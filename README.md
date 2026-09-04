# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

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

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
