# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start Expo dev server (alias: npx expo start)
npm run ios        # Build and run on iOS simulator
npm run android    # Build and run on Android emulator
npm run web        # Start web dev server
npm run lint       # Run ESLint via expo lint
```

No test runner is configured yet.

## Architecture

**Interval Fire** is a React Native interval/HIIT timer app built with Expo SDK 55, expo-router (file-based routing), and TypeScript (strict mode).

### Path aliases
- `@/*` → `./src/*`
- `@/assets/*` → `./assets/*`

### Routing (`src/app/`)
- `(tabs)/` — Bottom tab navigator with three screens: Home (index), Build, Stats
- `timer` — Full-screen timer (fade transition, gesture disabled while active)
- `complete` — Post-workout summary (fade transition)

### State management (Zustand)
Three stores in `src/store/`, two persisted via AsyncStorage:
- **workoutStore** — Active workout state (phase, round, secondsLeft). Not persisted. Phases cycle: `prep → work → rest → work → … → complete`.
- **historyStore** — Completed workout records. Persisted (`interval-fire-history`). Includes derived selectors: `computeStreak`, `weeklyMinutes`, `estimateKcal`.
- **settingsStore** — User preferences (audio, voice, warning toggles). Persisted (`interval-fire-settings`).

### Timer engine (`src/hooks/useTimer.ts`)
Drift-corrected `setTimeout`-based timer that drives the workout. Handles phase transitions, audio cues (beeps + speech), haptic feedback, and auto-records completed workouts to history.

### Design system (`src/constants/theme.ts`)
Dark theme only. All color tokens, spacing, radii, and font family references are centralized. Fonts: Barlow (body) and Barlow Condensed (display), loaded via `@expo-google-fonts`.

### Presets (`src/constants/presets.ts`)
Workout templates with `workSecs`, `restSecs`, `rounds`, `prepSecs`, `warmupSecs`, `cooldownSecs`. Includes utility functions: `stepTime`, `stepWarmup`, `formatTime`, `totalSecs`.

### Key conventions
- React Compiler is enabled (`experiments.reactCompiler: true` in app.json)
- Typed routes enabled (`experiments.typedRoutes: true`)
- Portrait orientation only
- `GestureHandlerRootView` wraps the entire app at root layout level
