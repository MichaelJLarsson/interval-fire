# Testing on a Physical Device

Two paths: **Path A** (local USB build, free) for fast iteration; **Path B** (EAS Build → TestFlight) for final pre-App-Store validation.

## Prerequisites (one-time)

- Xcode installed from the App Store
- Run `xcode-select --install` for command-line tools
- Open Xcode once, accept the license, install iOS platform
- An Apple ID (free works for Path A; $99/yr Apple Developer account required for Path B)

---

## Path A — Run on iPhone via USB (fastest)

1. Plug iPhone into Mac with a cable, unlock it, tap **Trust this computer**.

2. Add your Apple ID to Xcode: **Xcode → Settings → Accounts → + → Apple ID**.

3. Open the workspace (not the `.xcodeproj`):

   ```bash
   open ios/intervalfire.xcworkspace
   ```

4. In Xcode, select the `intervalfire` target → **Signing & Capabilities** tab → check **Automatically manage signing** → pick your personal team.
   - If you get a "bundle identifier not available" error, change `com.intervalfire.app` to something unique (e.g. `com.yourname.intervalfire`) in both Xcode and `app.json` line 12.

5. Build and install from the terminal (this also starts Metro):

   ```bash
   npx expo run:ios --device
   ```

   Pick your iPhone from the list. First build takes a few minutes.

6. **Trust the developer certificate on the iPhone** (first launch only):
   **Settings → General → VPN & Device Management → tap your Apple ID → Trust**.

7. The app is now live on your phone with hot reload. For subsequent sessions you can just run `npm start` and reconnect via the dev client without rebuilding.

> **Note:** Free Apple ID certificates expire after 7 days. Re-run `npx expo run:ios --device` to refresh.

---

## Path B — TestFlight via EAS Build (release-equivalent)

This is the correct pre-App-Store validation step — same build pipeline, same signing, same certificate as production.

1. Enroll in the **Apple Developer Program** at developer.apple.com ($99/yr) and register the app in App Store Connect with bundle ID `com.intervalfire.app`.

2. Install EAS CLI and log in:

   ```bash
   npm install -g eas-cli
   eas login
   eas init
   ```

3. Configure build profiles:

   ```bash
   eas build:configure
   ```

   This creates `eas.json` with `development`, `preview`, and `production` profiles.

4. Trigger a production build (cloud build, ~10–20 min):

   ```bash
   eas build --platform ios --profile production
   ```

   EAS will prompt for your Apple credentials and handle certificates/provisioning automatically.

5. Submit to TestFlight:

   ```bash
   eas submit --platform ios --latest
   ```

6. Install the **TestFlight** app on your iPhone → invite yourself as an internal tester in App Store Connect → install the build.

---

## Recommended flow

1. Use **Path A** for day-to-day device testing (sensors, audio, haptics, performance).
2. Before submitting to the App Store, do one **Path B** build to confirm the release-signed version behaves identically.
3. Promote that same TestFlight build to production — no rebuild needed.
