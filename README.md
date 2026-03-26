# Interval Fire 🔥

A native iOS & Android interval timer app built with Expo + React Native.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Expo (SDK 51, managed workflow) | Fastest path to iOS + Android from one codebase; OTA updates |
| Language | TypeScript (strict) | Safety + autocomplete across the whole codebase |
| Navigation | Expo Router (file-based) | Next.js-style routing; handles deep links automatically |
| State | Zustand | Zero boilerplate; persists easily with AsyncStorage middleware |
| Animation | React Native Reanimated 3 | GPU-accelerated; worklet-based (runs off the JS thread) |
| Audio | expo-av + expo-speech | Native audio mode (plays in silent mode, background-safe) |
| Haptics | expo-haptics | Phase-change feedback — heavy for WORK, medium for REST |
| Keep awake | expo-keep-awake | Prevents screen sleep during active workouts |
| Storage | AsyncStorage (settings + history) | Lightweight; swap for expo-sqlite if history grows large |

## Getting started

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** (iOS/Android) for instant preview.

## Project structure

```
app/
  _layout.tsx          Root layout — fonts, gesture handler, navigation stack
  (tabs)/
    _layout.tsx        Bottom tab bar
    index.tsx          Home — preset carousel + recent workouts
    build.tsx          Build — custom workout creator
    stats.tsx          Stats — weekly chart + personal bests + history
  timer.tsx            Full-screen timer (no tab bar)
  complete.tsx         Completion summary screen

components/
  timer/
    TimerRing.tsx      SVG progress ring with Reanimated pulse
    ChromeOverlay.tsx  Focus-mode chrome (slides in/out on tap)
  home/
    PresetCarousel.tsx Horizontal snap-scroll preset cards + dots
  build/
    Stepper.tsx        Reusable ± stepper row
  shared/
    FlashOverlay.tsx   Full-screen phase-change colour flash

store/
  workoutStore.ts      Active timer state (phase, round, secondsLeft)
  historyStore.ts      Completed workouts + derived selectors
  settingsStore.ts     Audio / voice / warning toggles (persisted)

hooks/
  useTimer.ts          Drift-corrected interval engine + phase transitions
  useAudio.ts          Beeps (expo-av) + speech (expo-speech)
  useHaptics.ts        Phase-appropriate haptic feedback
  useChromeVisibility.ts  Focus-mode show/hide with auto-hide timer

constants/
  theme.ts             Colour tokens, spacing, radii
  presets.ts           Default presets, time-step logic, formatTime
```

## Key implementation notes

### Timer precision
`useTimer` records `Date.now()` at launch and uses drift-corrected `setTimeout`
scheduling — each tick compensates for JS thread delays so the countdown never
drifts more than a few milliseconds over a full workout.

### Ring animation isolation
`TimerRing` wraps **only** the SVG in the Reanimated animated view. The countdown
text is an absolute-positioned sibling rendered in `timer.tsx`, so the pulse scale
animation never moves the numbers.

### Background execution
`UIBackgroundModes: ["audio", "processing"]` is set in `app.json`. Pair with
`expo-task-manager` + `expo-background-fetch` for full background timer support
(Phase 2 implementation).

### Audio
`useAudio` lazy-initialises the AVSession on first interaction (required by iOS).
`playsInSilentModeIOS: true` ensures beeps work even when the ringer switch is off.
Bundle short WAV files in `assets/sounds/` and load them via `Audio.Sound.createAsync`.

## Roadmap

- [ ] Phase 2: Background task for timer when app is backgrounded
- [ ] Phase 3: Bundled beep WAV assets
- [ ] Phase 4: iCloud / Google Drive history sync
- [ ] Phase 5: Apple Watch companion app (expo doesn't support watchOS yet — use React Native Watch Connectivity)
- [ ] Phase 6: Custom interval programs (pyramid, EMOM, AMRAP variations)
