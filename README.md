# Interval Fire 🔥

A React Native interval/HIIT timer app built with [Expo](https://expo.dev) SDK 55, [expo-router](https://docs.expo.dev/router/introduction) (file-based routing), and TypeScript (strict mode).

Build custom HIIT, running, cardio, and strength interval workouts, run them with a drift-corrected full-screen timer (audio cues, voice announcements, haptics), and track history, streaks, and stats — with completed workouts synced to Apple Health on iOS.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npm start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

Or target a platform directly:

```bash
npm run ios       # build and run on iOS simulator
npm run android   # build and run on Android emulator
npm run web       # start web dev server
```

> Apple Health sync (see below) requires a native build (`npm run ios`) — it isn't available in Expo Go.

You can start developing by editing the files inside the **src** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Architecture

See [CLAUDE.md](./CLAUDE.md) for the full architecture reference (routing, state stores, timer engine, design system, component organization, conventions). The short version:

- **Routing** (`src/app/`) — a flat Stack navigator: `index` (Home), `build` (workout builder modal), `stats` (stats dashboard modal), `timer` (full-screen timer), `complete` (post-workout summary).
- **State** (`src/store/`) — four Zustand stores: `workoutStore` (active workout, not persisted), `historyStore`, `settingsStore`, and `presetsStore` (all persisted via AsyncStorage).
- **Timer engine** (`src/hooks/useTimer.ts`) — a drift-corrected `setTimeout` loop driving phase transitions, audio/haptic cues, and history/Health sync on completion.
- **Design system** (`src/constants/theme.ts`, [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)) — dark theme only, Barlow/BarlowSemiCondensed type, a token-based spacing/radius scale.

## Testing

Unit tests run on [Jest](https://jestjs.io) via `jest-expo`. Tests live in `__tests__/` subdirectories adjacent to the code they test; mocks for `async-storage`, `expo-haptics`, `expo-speech`, and `@kingstinct/react-native-healthkit` are in `src/__mocks__/`.

```bash
npm test                                          # run the full suite
npx jest src/store/__tests__/workoutStore.test.ts # run a single test file
```

For manual, on-device QA, follow [TEST_PROTOCOL.md](./TEST_PROTOCOL.md) — a checklist covering app launch, every screen, audio/haptics, state persistence, and Apple Health sync.

## Formatting & linting

This project uses [Prettier](https://prettier.io) for code formatting and ESLint for linting, configured in `.prettierrc` and `eslint.config.js` respectively.

```bash
npm run format        # format all files in place
npm run format:check  # check formatting without writing (CI-friendly)
npm run lint          # run ESLint
```

A **pre-commit hook** (managed with [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/lint-staged/lint-staged)) runs automatically on `git commit`: it runs `eslint --fix` and `prettier --write` on staged `.js/.jsx/.ts/.tsx` files, and `prettier --write` on staged `.json/.md/.yml/.yaml/.css` files, then re-stages the fixed versions. The hook is installed automatically via the `prepare` script when you run `npm install`. If a file has a lint error that can't be auto-fixed, the commit is blocked until you fix it.

## Apple Health integration

iOS-only. Completed workouts are written to HealthKit via `src/lib/appleHealth.ts` — the workout's type (mapped to a `WorkoutActivityType`), start/end timestamps, and estimated active energy burned. The first sync attempt triggers the system HealthKit authorization prompt; a denied or unavailable permission fails silently and never blocks the completion flow.

Because it depends on the native HealthKit module, this only works in a development build or a release build on a real device or simulator — not in Expo Go:

```bash
npm run ios
```

See TEST_PROTOCOL.md § 10 for the manual test checklist covering permissions, activity-type mapping, and sync edge cases.

## Audio cues

The timer plays two kinds of sounds: spoken **voice announcements** (pre-rendered ElevenLabs MP3s) and synthesized **beeps** (WAV tones). Both are bundled assets — there's no runtime TTS or network call.

### Adding a new voice announcement

1. **Add the phrase to the generation script.** Edit `scripts/generate-voices.ts` and append a new entry to the `PHRASES` map:

   ```ts
   const PHRASES: Record<string, string> = {
     // …existing entries
     warmup: 'Warm up!',
   }
   ```

   The key (`warmup`) becomes the filename and code identifier; the value is the literal text ElevenLabs will speak.

2. **Generate the MP3.** Run the script with your ElevenLabs API key (one-time setup — get a key at <https://elevenlabs.io/app/settings/api-keys>):

   ```bash
   ELEVENLABS_API_KEY=sk_xxxxx npx ts-node scripts/generate-voices.ts
   ```

   This writes `assets/voice/warmup.mp3`. To swap the voice for _all_ phrases, change `VOICE_ID` at the top of the script (browse voices at <https://elevenlabs.io/voice-library>) and re-run.

3. **Wire it into the app.** In `src/hooks/useAudio.ts`, add the key to both the `VoicePhrase` union and the `VOICE_ASSETS` map:

   ```ts
   export type VoicePhrase = /* … */ 'warmup'

   const VOICE_ASSETS: Record<VoicePhrase, ReturnType<typeof require>> = {
     // …existing entries
     warmup: require('@/assets/voice/warmup.mp3'),
   }
   ```

4. **Trigger it.** Call `speak('warmup')` from wherever the cue should fire — typically `src/hooks/useTimer.ts`. `speak()` is a no-op when the user's `voiceEnabled` setting is off, so you don't need to gate it yourself.

5. **Commit the new MP3** alongside the code change so other devs and CI builds get the audio without needing the API key.

### Adding or tweaking a beep

Beeps are synthesized programmatically — no API key required.

- **Tweak the existing countdown boop.** Edit the constants at the top of `scripts/generate-beeps.ts` (`DURATION`, `FREQUENCY`, `AMPLITUDE`, `FADE_TIME`) and run:

  ```bash
  npx ts-node scripts/generate-beeps.ts
  ```

  This overwrites `assets/sounds/countdown.wav`. Commit the regenerated WAV.

- **Add a new beep sound** (e.g. a different tone for phase transitions):
  1. Duplicate `scripts/generate-beeps.ts` or extend it to write a second file (e.g. `assets/sounds/transition.wav` at a lower frequency/longer duration).
  2. In `src/hooks/useAudio.ts`, `require()` the new asset and add a `playFoo()` callback following the existing `playTick()` pattern (creating a fresh `AudioPlayer`, releasing the previous one via a ref).
  3. Return the new function from the hook and call it from `useTimer.ts`.

### Where the cues fire

| Cue                                       | When                                                 |
| ----------------------------------------- | ---------------------------------------------------- |
| `speak('prep')`                           | On workout start                                     |
| `speak('three' \| 'two' \| 'one')`        | Last 3 seconds of the prep phase                     |
| `playTick()`                              | Last 4 seconds (3, 2, 1, 0) of every work/rest phase |
| `speak('work' \| 'rest' \| 'last_round')` | Phase transitions                                    |
| `speak('complete')`                       | Workout finished                                     |

All voice cues (including the prep 3-2-1 countdown) respect the `voiceEnabled` setting; all beeps (including the work/rest 3-second warning ticks) respect `audioEnabled`.

## Learn more

To learn more about developing this project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [expo-router documentation](https://docs.expo.dev/router/introduction/): File-based routing used throughout `src/app/`.
- [Zustand documentation](https://zustand.docs.pmnd.rs/): State management used in `src/store/`.
- [react-native-reanimated documentation](https://docs.swmansion.com/react-native-reanimated/): Animations (timer ring, flash overlay, etc.).
