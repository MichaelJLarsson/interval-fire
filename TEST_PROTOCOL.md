# Interval Fire — Manual Test Protocol

**Device:** iPhone  
**Date:** ___________  
**Build:** ___________

Mark each case `- [x]` when it passes, or add a ✗ and note inline for failures.

---

## 1. App Launch

- [ ] 1.1 Cold launch — opens to Home screen, no crash
- [ ] 1.2 Home header — Fire icon and streak pill (if streak > 0) visible
- [ ] 1.3 Preset carousel — at least the 4 starter presets shown
- [ ] 1.4 Recent section — history rows visible (mock data seeded)
- [ ] 1.5 Portrait lock — rotating device keeps portrait orientation

---

## 2. Home Screen

- [ ] 2.1 Swipe preset carousel left/right — cards snap, selection updates
- [ ] 2.2 Tap a preset card to select it — card highlights as selected
- [ ] 2.3 Tap play button on carousel card — navigates to timer, workout starts
- [ ] 2.4 Tap edit (pen) button on carousel card — opens Build modal in edit mode
- [ ] 2.5 Tap "Create New" button — opens Build modal in create mode
- [ ] 2.6 Tap "MORE STATS" — opens Stats modal with slide-up animation
- [ ] 2.7 Scroll down and back up — scrolls freely, header stays correct
- [ ] 2.8 Return to Home after timer — scroll position resets to top

---

## 3. Build Screen — Create New

- [ ] 3.1 Open from "Create New" — title "Build Workout", defaults: Work 20s, Rest 10s, 8 rounds
- [ ] 3.2 Tap each type chip (HIIT, Running, Cardio, Strength) — chip highlights, icon color updates
- [ ] 3.3 Increment Work stepper — steps 5 s increments ≤60 s, then 15 s
- [ ] 3.4 Decrement Work stepper to minimum — stops at 5 s, no underflow
- [ ] 3.5 Increment Rounds to 30 — stops at 30
- [ ] 3.6 Decrement Rounds to 1 — stops at 1, no underflow
- [ ] 3.7 Set Rest to 0 — label shows "Off"
- [ ] 3.8 Type a workout name — name updates live
- [ ] 3.9 Leave name empty, tap Save — falls back to "My Workout"
- [ ] 3.10 Summary cards — Intervals, Total time, Kcal, Active phase reflect current settings
- [ ] 3.11 Tap "Optional settings" — section expands with animation, chevron rotates
- [ ] 3.12 Tap "Optional settings" again — section collapses with animation
- [ ] 3.13 Warmup stepper — steps 30 s increments ≤2 min, then 60 s
- [ ] 3.14 Toggle Audio cues off/on — switch state persists
- [ ] 3.15 Toggle Voice Announcements off/on — switch state persists
- [ ] 3.16 Tap "Save" — dismisses modal, new preset in carousel
- [ ] 3.17 Tap "Start Workout" — saves and navigates straight to timer
- [ ] 3.18 Tap X (close) — dismisses without saving, no new preset added

---

## 4. Build Screen — Edit Existing

- [ ] 4.1 Open edit from carousel — title "Edit Workout", pre-filled with preset values
- [ ] 4.2 Name shown as display (not input) — name visible with pencil icon
- [ ] 4.3 Tap pencil icon — name becomes editable input with Apply button
- [ ] 4.4 Edit name, tap Apply — name updates, returns to display mode
- [ ] 4.5 Edit name, dismiss keyboard — name reverts to previous value
- [ ] 4.6 Modify stepper, tap Save — changes persisted to preset in carousel
- [ ] 4.7 Tap "Delete workout" — alert shown with Cancel / Delete
- [ ] 4.8 Confirm delete — preset removed from carousel, modal dismissed
- [ ] 4.9 Cancel delete — preset unchanged, stays in edit mode

---

## 5. Timer Screen

### 5a. Core timer

- [ ] 5.1 Prep phase — shows "GET READY", yellow ring, countdown ticking
- [ ] 5.2 Prep → Work transition — flash fires, ring turns red, phase label "WORK"
- [ ] 5.3 Work → Rest transition — flash fires, ring turns green, phase label "REST"
- [ ] 5.4 Rest → Work transition — flash fires, next work round starts
- [ ] 5.5 Round counter — label increments on each work/rest cycle
- [ ] 5.6 Progress ring — drains correctly relative to seconds remaining vs total phase
- [ ] 5.7 "Next:" text — shows correct upcoming phase, duration, and round number
- [ ] 5.8 Last round "Next:" text — shows "Last round!" during final work phase
- [ ] 5.9 Screen stays on — device does not auto-lock during workout

### 5b. Chrome overlay

- [ ] 5.10 Tap anywhere on timer — chrome overlay fades in (name, badge, dots, controls)
- [ ] 5.11 Chrome auto-hides — fades out after a few seconds with no interaction
- [ ] 5.12 Tap Pause — timer freezes, icon changes to play
- [ ] 5.13 Tap Resume — timer resumes from where it paused
- [ ] 5.14 Tap Skip — current phase skipped, moves to next phase
- [ ] 5.15 Tap audio icon — toggles audio cues, icon state updates
- [ ] 5.16 Tap voice icon — toggles voice announcements
- [ ] 5.17 Tap Stop (while running) — timer pauses, alert "Stop workout?" shown
- [ ] 5.18 Tap Cancel in stop alert — timer resumes
- [ ] 5.19 Tap Stop in stop alert — returns to Home, timer/state cleared
- [ ] 5.20 Tap Stop (while already paused) — alert shown; Cancel keeps it paused
- [ ] 5.21 Round dots — filled dots match completed rounds

### 5c. Audio & haptics

- [ ] 5.22 Audio enabled: last 3 s of work/rest — three audible beeps
- [ ] 5.23 Voice enabled: prep phase — "3… 2… 1…" spoken
- [ ] 5.24 Voice enabled: phase transitions — "Work!" / "Rest!" announced
- [ ] 5.25 Audio disabled — no beeps during workout
- [ ] 5.26 Voice disabled — no spoken announcements
- [ ] 5.27 Haptics — subtle vibration on each phase change

---

## 6. Complete Screen

- [ ] 6.1 Final round expires — navigates to Complete screen (fade transition)
- [ ] 6.2 Checkmark animation — green checkmark bounces in on arrival
- [ ] 6.3 Content fade-in — headline, name, stats tiles fade in after checkmark
- [ ] 6.4 Duration tile — shows correct elapsed time (MM:SS)
- [ ] 6.5 Rounds tile — shows correct number of rounds completed
- [ ] 6.6 Kcal tile — shows a non-zero estimated kcal
- [ ] 6.7 Streak banner — visible when current streak > 0
- [ ] 6.8 Tap "Home" — returns to Home screen
- [ ] 6.9 Tap "Stats" — navigates to Stats screen
- [ ] 6.10 New record on Home — completed workout appears in "Recent" section

---

## 7. Stats Screen

- [ ] 7.1 Open from "MORE STATS" — slides up, shows "Your Stats" title
- [ ] 7.2 Overview grid — Workouts, Total time, Kcal burned, Current streak show correct totals
- [ ] 7.3 Weekly bar chart — 7 bars, today's bar highlighted in red, correct day labels
- [ ] 7.4 Personal bests — all 4 rows show valid values
- [ ] 7.5 History list — up to 10 recent records with date, duration, rounds
- [ ] 7.6 Scroll — all sections reachable by scrolling
- [ ] 7.7 Tap X — modal dismisses
- [ ] 7.8 "Clear history" — confirms via alert, history cleared, stats reset
- [ ] 7.9 "Seed sample data" — history repopulated, stats update

---

## 8. Edge Cases & State Persistence

- [ ] 8.1 Delete all presets — carousel replaced by "No workouts yet" empty card; tapping opens Build
- [ ] 8.2 Background app mid-workout, return — timer still running (or paused), no crash
- [ ] 8.3 Force-quit and relaunch — presets and history persisted, no active workout
- [ ] 8.4 1-round preset — completes after single work phase, skips rest
- [ ] 8.5 Preset with warmup — warmup phase shown before prep/work
- [ ] 8.6 Rest = Off — timer cycles work → work with no rest phase
- [ ] 8.7 Prep = Off — skips GET READY, starts straight into work

---

## 9. Visual & Layout

- [ ] 9.1 Dark theme — all screens consistently dark (#0d0d0d background)
- [ ] 9.2 Fonts loaded — Barlow and BarlowSemiCondensed render correctly (not system fallback)
- [ ] 9.3 No layout clipping — no text or buttons cut off by notch or safe area
- [ ] 9.4 Tap targets — buttons and steppers respond without needing precise taps

---

**Progress: ___ / 74 passed**
