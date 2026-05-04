# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start Expo dev server
npm run ios        # Build and run on iOS simulator
npm run android    # Build and run on Android emulator
npm run web        # Start web dev server
npm run lint       # Run ESLint (expo lint, flat config)
npm test           # Run Jest test suite
```

To run a single test file:
```bash
npx jest src/store/__tests__/workoutStore.test.ts
```

## Architecture

**Interval Fire** is a React Native interval/HIIT timer app built with Expo SDK 55, expo-router (file-based routing), and TypeScript (strict mode).

### Path aliases
- `@/*` → `./src/*`
- `@/assets/*` → `./assets/*`

### Routing (`src/app/`)
The app uses a flat Stack navigator (no tab bar). All screens live directly under `src/app/`:
- `index.tsx` — Home: preset carousel, recent workouts, streak
- `build.tsx` — Workout builder modal (create/edit presets)
- `stats.tsx` — Stats dashboard modal
- `timer.tsx` — Full-screen timer (fade transition, gesture disabled while running)
- `complete.tsx` — Post-workout summary (fade transition, receives `name`/`elapsedSecs`/`rounds` via `useLocalSearchParams`)

Build and stats are presented as `slide_from_bottom` modals. The root `_layout.tsx` loads fonts and wraps everything in `GestureHandlerRootView`.

### State management (Zustand — `src/store/`)
Four stores, three persisted via AsyncStorage:
- **workoutStore** — Active workout state (`phase`, `round`, `secondsLeft`, `isPaused`). **Not persisted.** Phases cycle: `prep → work → rest → work → … → complete`.
- **historyStore** — Completed `WorkoutRecord` entries. Persisted (`interval-fire-history`). Seeded with mock data for development. Derived selectors live **outside** the store as standalone functions: `computeStreak`, `weeklyMinutes`, `estimateKcal`.
- **settingsStore** — `audioEnabled`, `voiceEnabled` toggles. Persisted (`interval-fire-settings`). `audioEnabled` gates the work/rest 3-second warning ticks; `voiceEnabled` gates all spoken cues including the prep 3-2-1 countdown.
- **presetsStore** — User-created `Preset` entries with full CRUD. Persisted (`interval-fire-presets`). Defaults to four `STARTER_PRESETS` from `src/constants/presets.ts`. Generated IDs use format `user-${timestamp}-${random}`.

### Timer engine (`src/hooks/useTimer.ts`)
Drift-corrected `setTimeout` loop (1 s base). On each tick it calls `advance()`:
1. Decrements `secondsLeft` via `workoutStore.tick()`.
2. When `secondsLeft` hits 0, transitions phase: `prep → work`, `work → rest`, `rest → work` (incrementing round), or records the workout and calls `onComplete()`.
3. Audio cues via `useAudio` (frequency beeps + `expo-speech` announcements) and haptics via `useHaptics`, both gated by settings toggles.
4. On completion, calculates elapsed time, constructs a `WorkoutRecord` with estimated kcal, and calls `historyStore.addRecord()` before navigating away.

Drift correction: each tick schedules the next with `max(0, nextTickRef - Date.now() + 1000)` to compensate for JS event-loop jitter.

### Preset data model (`src/constants/presets.ts`)
```ts
interface Preset {
  id: string;
  name: string;
  type: 'hiit' | 'running' | 'cardio' | 'strength';
  workSecs: number; restSecs: number; rounds: number;
  prepSecs: number; warmupSecs: number; cooldownSecs: number;
}
```
Utility functions: `stepTime` (5 s increments ≤60 s, then 15 s), `stepWarmup` (30 s ≤2 min, then 60 s), `formatTime` ("Off" / "30s" / "1:30"), `totalSecs`.

### Design system (`src/constants/theme.ts`)
Dark theme only. Key tokens:
- **Backgrounds:** `bg` #0d0d0d, `surface` #1e1e1e, `surfaceLo` #181818
- **Phase accents:** `work` #ff3d3d, `rest` #00e5a0, `prep` #ffc300, `strength` #b388ff
- **Typography:** `condensed` = BarlowSemiCondensed_800ExtraBold (display), `body` = Barlow_400Regular, `bodySemiBold` = Barlow_600SemiBold — 10-level font-size scale from `label` (10) to `displayXL` (82)
- **Spacing:** `screenH` 22 / `screenV` 46 plus xs–xxxl (4–36)
- **Radii:** sm (8) through `pill` (20) / `full` (999)

A companion `DESIGN_SYSTEM.md` documents the full token table and shared component specs.

### Component organization (`src/components/`)
- `shared/` — App-wide reusable pieces (cards, pills, buttons, icons)
- `timer/` — `TimerRing` (animated Reanimated progress ring) and `ChromeOverlay` (tap-to-reveal controls with audio/pause/skip/stop)
- `home/` — `PresetCarousel`
- `build/` — `Stepper`

### Key conventions
- React Compiler enabled (`experiments.reactCompiler: true` in `app.json`) — avoid manual `useMemo`/`useCallback` where the compiler handles it.
- Typed routes enabled (`experiments.typedRoutes: true`) — use typed `router.push` / `<Link href>` paths.
- Portrait orientation only.
- Derived/computed values (streak, weekly minutes, kcal) are standalone selector functions, not embedded in store state.
- Mock history data is loaded by default in `historyStore` for local development; clearing AsyncStorage removes it.
- Animations use `react-native-reanimated` (spring + timing); the `FlashOverlay` component fires on every phase transition.
- Tests live in `__tests__/` subdirectories adjacent to the code they test; mocks for `async-storage`, `expo-haptics`, and `expo-speech` are in `src/__mocks__/`.
