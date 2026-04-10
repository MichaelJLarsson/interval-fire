# Interval Fire -- Design System Spec

> Extracted from the [Figma Design Spec](https://www.figma.com/design/3ZQnsMpEjS6jSDnyeWvww0/Interval-Fire-%E2%80%94-Design-Spec?node-id=25-54) and existing codebase.
> Source of truth for tokens, typography, and reusable components.

---

## 1. Color Tokens

### Backgrounds

| Token        | Hex         | Usage                                      |
| ------------ | ----------- | ------------------------------------------ |
| `bg`         | `#0d0d0d`   | App background (below gradient)            |
| `surface`    | `#1e1e1e`   | Summary cards, chart backgrounds           |
| `surfaceLo`  | `#181818`   | Subtle surface variant                     |
| `offBlack`   | `#151515`   | Ghost/outline button fill                  |
| `planeBlack` | `#262626`   | Setting rows, text inputs, stepper buttons |
| `border`     | `#505050`   | Stepper/button borders                     |
| `borderHi`   | `#2e2e2e`   | Subtle dividers                            |
| `divider`    | `#444`      | Dividers                                   |

### Background Gradient

All screens share a top gradient:

```
linear-gradient(to bottom, #560000 0%, #000000 ~22%)
```

Applied to the screen root, fading from deep red to black.

### Phase Accents

| Token       | Hex         | Usage                                  |
| ----------- | ----------- | -------------------------------------- |
| `work`      | `#ff3d3d`   | Work phase, primary CTA fills          |
| `workLight` | `#ff6060`   | Work phase lighter variant, card text  |
| `workSoft`  | `#ff5050`   | Summary data values (work-related)     |
| `rest`      | `#00e5a0`   | Rest phase, "eucalyptus" accent        |
| `prep`      | `#ffc300`   | Prep/countdown phase, "clock" accent   |
| `strength`  | `#b388ff`   | Strength/kcal accent, "plum"           |

### Phase Accent Backgrounds (16% opacity tints)

| Token          | Value                    | Usage                        |
| -------------- | ------------------------ | ---------------------------- |
| `workBgTint`   | `rgba(255,61,61, 0.13)`  | Streak pill bg, work pill bg |
| `workBgTint2`  | `rgba(255,61,61, 0.15)`  | Phase pill (red)             |
| `workBgTint3`  | `rgba(255,61,61, 0.19)`  | Selected type chip bg        |
| `workBorder`   | `rgba(255,61,61, 0.33)`  | Streak pill border           |
| `workBgButton` | `rgba(255,61,61, 0.30)`  | Edit button bg               |
| `restBgTint`   | `#213d35`                | Phase pill (green)           |
| `restIconBg`   | `rgba(0,229,160, 0.16)`  | Personal best icon bg        |
| `restCheckBg`  | `rgba(0,229,160, 0.09)`  | Completion checkmark bg      |
| `prepIconBg`   | `rgba(255,195,0, 0.16)`  | Personal best icon bg        |
| `plumIconBg`   | `rgba(179,136,255, 0.16)`| Personal best icon bg        |
| `streakBanner` | `#350000`                | Streak banner bg             |
| `streakBorder` | `#7e0000`                | Streak banner border         |

### Text

| Token              | Hex       | Usage                                      |
| ------------------ | --------- | ------------------------------------------ |
| `textHi`           | `#f0f0f0` | Primary text, headings, button labels      |
G| `textLo`           | `#aaa`    | Secondary text (sub-labels, metadata)      |
| `textDim`          | `#666`    | Disabled / very subtle text                |
| `textFaint`        | `#555`    | Faintest text                              |
| `textGhost`        | `#737373` | "Tap anywhere" hint text                   |
| `inputPlaceholder` | `#6b6b6b` | Text input placeholder                     |

### Chart Colors

| Token         | Hex       | Usage                      |
| ------------- | --------- | -------------------------- |
| `barTrack`    | `#353535` | Bar chart background track |
| `barFill`     | `#4b4b4b` | Bar chart filled portion   |
| `barToday`    | `#ff3d3d` | Today's bar accent         |
| `metaChip`    | `#373737` | Info chips (rounds, time)  |

### Round Progress Bar (Timer)

| Token              | Hex       | Usage               |
| ------------------ | --------- | -------------------- |
| `progressDone`     | `#919191` | Completed rounds     |
| `progressActive`   | `#ff3d3d` | Current round        |
| `progressPending`  | `#4c4242` | Upcoming rounds      |

---

## 2. Typography

### Font Families

| Token       | Family                  | Usage                                |
| ----------- | ----------------------- | ------------------------------------ |
| `condensed` | Barlow Semi Condensed   | Display headings, timer digits, CTAs |
| `body`      | Inter                   | Body text, labels, sub-labels        |

> Note: Figma uses "Barlow Semi Condensed" while the codebase currently loads "Barlow Condensed". Verify which is correct and align.

### Type Scale

| Name              | Family              | Weight    | Size  | Letter Spacing | Usage                                       |
| ----------------- | -------------------- | --------- | ----- | -------------- | ------------------------------------------- |
| `displayXL`       | Barlow Semi Cond.    | ExtraBold | 96px  | 0              | Timer countdown digits                      |
| `displayLg`       | Barlow Semi Cond.    | ExtraBold | 40px  | 0              | "Workout Complete!" heading                 |
| `displayMd`       | Barlow Semi Cond.    | ExtraBold | 36px  | 0              | Preset card title ("TABATA CLASSIC")        |
| `displaySm`       | Barlow Semi Cond.    | Bold      | 30px  | 0              | Summary data values ("8,340", "6.2h")       |
| `headingLg`       | Barlow Semi Cond.    | Bold      | 26px  | -0.52px        | Screen titles ("Build Workout", "Your Stats") |
| `headingMd`       | Barlow Semi Cond.    | ExtraBold | 20px  | 1px            | Timer workout name, button labels           |
| `logo`            | Barlow Semi Cond.    | ExtraBold | 30px  | -0.5px         | App logo text                               |
| `bodyLg`          | Inter                | Bold      | 17px  | 0              | Kcal values in history                      |
| `bodyMd`          | Inter                | SemiBold  | 14px  | 0              | Setting labels, history titles, PB titles   |
| `bodySm`          | Inter                | SemiBold  | 13px  | 0              | Edit button, streak text                    |
| `bodyXs`          | Inter                | Medium    | 12px  | 0              | History item names (secondary)              |
| `caption`         | Inter                | Medium    | 11px  | 0              | Sub-labels, metadata lines                  |
| `label`           | Inter                | Bold      | 10px  | 1.5px          | Section headers, uppercase labels           |
| `labelSm`         | Inter                | SemiBold  | 10px  | 0              | Type chip labels                            |
| `phaseBadge`      | Inter                | Bold      | 13px  | 2px            | Phase label below timer ("WORK", "REST")    |
| `nextPhase`       | Inter                | Light/SemiBold | 14px | 0           | "Next: Rest 0:10" mixed weight              |
| `ctaText`         | Barlow Semi Cond.    | ExtraBold | 20px  | 0.4px          | CTA button text ("CREATE NEW", "HOME")      |
| `pillText`        | Inter                | Bold      | 10px  | 0.3px          | Streak pill, status pill                    |
| `chipText`        | Inter                | Regular   | 10px  | 0              | Meta chips ("8 rounds", "4:00 min")         |

### Label Convention

All `label`-style text is **UPPERCASE** with `letterSpacing: 1.5px`. Used for section headers throughout ("QUICK START", "RECENT", "TYPE", "INTERVAL SETTINGS", etc.).

---

## 3. Spacing

| Token     | Value | Usage                                         |
| --------- | ----- | --------------------------------------------- |
| `screenH` | 22px  | Horizontal screen padding (all screens)       |
| `screenV` | 46px  | Vertical screen padding (top/bottom)          |
| `xs`      | 4px   | Tight spacing                                 |
| `sm`      | 8px   | Gap between type chips, small gaps            |
| `md`      | 12px  | Gap within summary grid, between label + data |
| `lg`      | 16px  | Card internal padding (horizontal), gap pairs |
| `xl`      | 24px  | Medium section spacing                        |
| `xxl`     | 28px  | Primary section gap (flex gap on all screens) |
| `xxxl`    | 36px  | Large section spacing                         |

### Card Padding

| Component      | Padding          |
| -------------- | ---------------- |
| Summary card   | 16px H, 19px V   |
| Setting row    | 18px H, 16px V   |
| Text input     | 17px H           |
| CTA button     | 31px H, 16-17px V|
| Ghost button   | 17px H, 13px V   |

---

## 4. Border Radii

| Token  | Value  | Usage                                                   |
| ------ | ------ | ------------------------------------------------------- |
| `sm`   | 8px    | Phase pills, stepper buttons, round progress bar, chips |
| `md`   | 12px   | Type chips, text input, streak banner                   |
| `lg`   | 13px   | Summary cards, chart container, PB container            |
| `xl`   | 14px   | Setting rows, CTA buttons                               |
| `pill` | 20px   | Streak pill                                              |
| `full` | 999px  | Circular elements (timer ring, play button)             |

---

## 5. Shared Components

### 5.1 Summary Card

A stat display card with label + large value. Three color variants.

**Props:** `label: string`, `value: string`, `variant: 'default' | 'eucalyptus' | 'white'`

| Variant      | Value Color |
| ------------ | ----------- |
| `default`    | `#ff5050`   |
| `eucalyptus` | `#00e5a0`   |
| `white`      | `#f0f0f0`   |

**Structure:**

- Background: `planeBlack` (#262626)
- Border radius: 13px
- Padding: 16px horizontal, 19px vertical
- Label: `label` style (10px Inter Bold, uppercase, #888, tracking 1.5px)
- Value: `displaySm` style (30px Barlow Semi Condensed Bold)
- Gap between label and value: 10px

**Used on:** Home (build summary), Stats (top grid), Workout Complete (duration/rounds/kcal)

---

### 5.2 Setting Row

A settings control with label, sub-label, and either a stepper or toggle.

**Props:** `label: string`, `subLabel: string`, `value: string`, `type: 'stepper' | 'toggle'`

**Structure:**

- Background: `planeBlack` (#262626)
- Border radius: 14px
- Padding: 18px horizontal, 16px vertical
- Height: 68px
- Left side: label (14px Inter SemiBold, #e0e0e0) + sub-label (11px Inter Medium, #aaa)
- Right side (stepper): `[+]` `value` `[-]` with 12px gap
- Right side (toggle): iOS-style toggle switch

**Stepper buttons:**

- Size: 36px x 36px
- Background: `planeBlack` (#262626)
- Border: 1.5px solid `#505050`
- Border radius: 8px
- Text: 18px Inter Bold, #f0f0f0

**Toggle:**

- Width: 64px
- Active fill: `#ff3d3d`
- Knob: white, 24px wide, pill-shaped

**Used on:** Build screen (work/rest/rounds, warmup/cooldown/countdown, audio/voice/warning)

---

### 5.3 CTA Button (Primary)

Full-width call-to-action button.

**Props:** `label: string`, `icon?: ReactNode`, `variant: 'filled' | 'outline'`

**Filled variant:**

- Background: `#ff3d3d`
- Border radius: 14px
- Padding: 31px H, 16-17px V
- Text: 20px Barlow Semi Condensed ExtraBold, #f0f0f0, uppercase, tracking 0.4px
- Optional leading icon (24px)

**Outline variant:**

- Background: `#151515`
- Border: 1px solid `#ff3d3d`
- Text color: `#ff3d3d`
- Same typography as filled

**Used on:** Home ("CREATE NEW"), Build ("CANCEL" / "READY TO GO?"), Complete ("STATS" / "HOME")

---

### 5.4 Ghost Button (Small)

Small, muted button for secondary actions.

**Structure:**

- Background: `#262626`
- Border: 2px solid `#505050`
- Border radius: 7px
- Padding: 17px H, 13px V
- Text: 10px Inter Bold, #aaa, uppercase, tracking 0.2px

**Used on:** Home ("MORE STATS")

---

### 5.5 Edit Button (Inline)

Compact button overlaid on cards.

**Structure:**

- Background: `rgba(255,61,61, 0.30)`
- Border radius: 7px
- Padding: 16px H, 8px V
- Text: 13px Barlow Semi Condensed Medium, #ff3d3d, tracking 0.26px

**Used on:** Home preset card ("EDIT")

---

### 5.6 Streak Pill

Compact status indicator.

**Structure:**

- Background: `rgba(255,61,61, 0.13)`
- Border: 1px solid `rgba(255,61,61, 0.33)`
- Border radius: 20px
- Padding: 14px H, 8px V
- Text: 10px Inter Bold, #ff6a6a, uppercase, tracking 0.3px

**Variants (by context):**

- Home: streak count ("6-DAY STREAK")
- Timer: phase label ("WORK")

**Used on:** Home (top right), Timer (top right)

---

### 5.7 Phase Pill

Small colored pills showing interval parameters.

**Red (work):**

- Background: `rgba(255,61,61, 0.15)`
- Border radius: 8px
- Text: 10px Inter Bold, #ff7070, uppercase

**Green (rest):**

- Background: `#213d35`
- Border radius: 8px
- Text: 10px Inter Bold, #00e5a0, uppercase

**Used on:** Home preset card ("20S WORK", "10S REST")

---

### 5.8 Section Label

Consistent section header pattern used everywhere.

**Structure:**

- Text: 10px Inter Bold, uppercase
- Color: `#888` (or `#aaa` depending on context)
- Letter spacing: 1.5px

**Examples:** "QUICK START", "RECENT", "TYPE", "INTERVAL SETTINGS", "THIS WEEK", "PERSONAL BESTS"

---

### 5.9 History Row

A workout history list item.

**Structure:**

- Left side:
  - Title: 14px Inter SemiBold, #e0e0e0 (first item) or 12px (subsequent)
  - Subtitle: 11px Inter Medium, #aaa ("Today . 4:00 min . HIIT")
- Right side:
  - Value: 17px Inter Bold, #ff5555
  - Unit: 10px Inter Regular, #777 ("kcal")
- Separator: 1px line, #1a1a1a
- Vertical rhythm: ~50px per row

**Used on:** Home screen ("RECENT" section)

---

### 5.10 Personal Best Row

A record/achievement list item with icon.

**Structure:**

- Icon container: 40px x 40px, rounded 10px, tinted background (16% opacity of accent color)
- Icon: 18-24px, centered in container
- Text block:
  - Title: 14px Inter SemiBold, #f0f0f0
  - Subtitle: 11px Inter Medium, #aaa
- Value: 30px Barlow Semi Condensed Bold, accent-colored, right-aligned
- Divider: 1.4px line, #444
- Row gap: 12px

**Icon background colors per stat:**

| Stat             | Icon Bg                       | Value Color |
| ---------------- | ----------------------------- | ----------- |
| Longest streak   | `rgba(255,61,61, 0.16)`      | `#ff6060`   |
| Most rounds      | `rgba(0,229,160, 0.16)`      | `#00e5a0`   |
| Longest workout  | `rgba(255,195,0, 0.16)`      | `#ffc300`   |
| Most kcal        | `rgba(179,136,255, 0.16)`    | `#b388ff`   |

**Used on:** Stats screen

---

### 5.11 Type Chip (Build)

Workout type selector chip.

**Structure:**

- Size: flex-1 within row, 65px height
- Border radius: 12px
- Icon: 18px, centered above label
- Label: 10px Inter SemiBold, uppercase

**States:**

| State    | Background                    | Border              | Text/Icon Color |
| -------- | ----------------------------- | -------------------- | --------------- |
| Default  | `#262626`                     | 1px solid `#505050`  | `#f0f0f0`       |
| Selected | `rgba(255,61,61, 0.19)`       | 1px solid `#ff3d3d`  | `#ff3d3d`       |

**Used on:** Build screen (HIIT / Running / Cardio / Strength)

---

### 5.12 Text Input

Simple text input field.

**Structure:**

- Background: `#262626`
- Border: 1px solid `#7c7c7c`
- Border radius: 12px
- Height: 46px
- Padding: 17px horizontal
- Placeholder: 15px Inter Medium, #6b6b6b, uppercase

**Used on:** Build screen ("Give your workout a name")

---

### 5.13 Timer Ring

Circular progress indicator for the active timer.

**Structure:**

- Outer size: ~270px diameter
- Track: dark gray ring
- Fill: phase-colored ring (work = red, rest = green)
- Center content:
  - Time: 96px Barlow Semi Condensed ExtraBold, phase-colored
  - Phase label: 13px Inter Bold, #aaa, uppercase, tracking 2px
- Below ring: "Next: Rest 0:10" (14px Inter, mixed Light + SemiBold, #aaa)

**Used on:** Timer screen (both chrome and focus modes)

---

### 5.14 Timer Controls

Playback controls for the timer.

**Play/Pause button:**

- Size: 76px circle
- Background: gradient/glow effect
- Icon: 52px

**Stop button:**

- Size: 56px circle
- Background: `#262626`
- Border: 2px solid `#505050`
- Icon: 12px white square

**Forward button:**

- Size: 56px circle
- Background: dark with subtle border
- Icon: 24px fast-forward

**Layout:** horizontal row, centered, play in middle, stop left, forward right

---

### 5.15 Round Progress Bar

Segmented progress indicator showing round completion.

**Structure:**

- Segments: equal-width bars, 3px height, rounded 2px
- Gap between segments: ~3px
- Full width across screen (22px - 22px margins)

**Segment states:**

| State    | Color     |
| -------- | --------- |
| Done     | `#919191` |
| Active   | `#ff3d3d` |
| Pending  | `#4c4242` |

**Used on:** Timer screen (chrome mode)

---

### 5.16 Weekly Bar Chart

7-day activity chart.

**Structure:**

- Container: `#262626` background, 13px radius, 17px H / 19px V padding
- 7 columns (one per day), equal width
- Each bar:
  - Track: `#353535`, rounded 4px, fixed height ~68px
  - Fill: `#4b4b4b`, rounded 4px, variable height from bottom
  - Today fill: `#ff3d3d`
- Day labels below: 10px Inter Bold, #aaa, uppercase, tracking 1.5px
- Active day label color: `#ff3d3d`

**Used on:** Stats screen

---

### 5.17 Streak Banner

Motivational banner shown after workout completion.

**Structure:**

- Background: `#350000`
- Border: 1px solid `#7e0000`
- Border radius: 12px
- Height: 44px
- Content centered: fire emoji + text
- Text: 13px Inter Medium, #ff3d3d

**Used on:** Workout Complete screen

---

### 5.18 Screen Title

Two-line screen heading pattern.

**Structure:**

- Line 1: 26px Barlow Semi Condensed Bold, #f0f0f0, uppercase
- Line 2: 26px Barlow Semi Condensed Bold, #ff3d3d, uppercase
- Line height: 28px
- Letter spacing: -0.52px

**Examples:**

- "BUILD" / "WORKOUT"
- "YOUR" / "STATS"

**Used on:** Build, Stats screens

---

## 6. Screen Layout Patterns

### Common Structure

All screens share:

- Background gradient: `#560000` -> `#000000` at ~22%
- Padding: 22px horizontal, 46px vertical
- Content: vertical flex column, gap 28px
- Safe area: accounted for by the 46px top padding

### Tab Screens (Home, Build, Stats)

- Bottom tab bar (not in Figma, handled by expo-router)
- Scrollable content area

### Modal Screens (Timer, Complete)

- Full screen, no tab bar
- Timer: two modes (chrome revealed / focus)
- Complete: centered vertically, action buttons at bottom

---

## 7. Existing Code Mapping

| Design Component       | Code File                              | Status  |
| ---------------------- | -------------------------------------- | ------- |
| Color tokens           | `src/constants/theme.ts`               | Partial |
| Spacing / Radii        | `src/constants/theme.ts`               | Partial |
| Timer Ring             | `src/components/timer/TimerRing.tsx`   | Exists  |
| Chrome Overlay         | `src/components/timer/ChromeOverlay.tsx`| Exists  |
| Preset Carousel        | `src/components/home/PresetCarousel.tsx`| Exists  |
| Stepper                | `src/components/build/Stepper.tsx`     | Exists  |
| Flash Overlay          | `src/components/shared/FlashOverlay.tsx`| Exists  |
| Fire Icon              | `src/components/shared/FireIcon.tsx`   | Exists  |
| Summary Card           | --                                     | Missing |
| Setting Row            | --                                     | Missing |
| CTA Button             | --                                     | Missing |
| Ghost Button           | --                                     | Missing |
| Streak Pill            | --                                     | Missing |
| Phase Pill             | --                                     | Missing |
| Section Label          | --                                     | Missing |
| History Row            | --                                     | Missing |
| Personal Best Row      | --                                     | Missing |
| Type Chip              | --                                     | Missing |
| Text Input             | --                                     | Missing |
| Streak Banner          | --                                     | Missing |
| Screen Title           | --                                     | Missing |

---

## 8. Gaps: Figma vs. Code

### Token gaps in `theme.ts`

1. **Missing colors:** `offBlack`, `planeBlack`, `divider`, `dividerHi`, `barTrack`, `barFill`, `progressDone`, `progressActive`, `progressPending`, `streakBanner`, `streakBorder`, all tint/alpha variants
2. **Missing spacing:** `screenV` (46px), `xxl` as 28px (currently 36px -- verify intent)
3. **Missing radii:** `pill` (20px), value `13` for summary cards (currently `lg` is 14)
4. **Font family mismatch:** Figma says "Barlow Semi Condensed", code says "BarlowCondensed"

### Component gaps

All shared UI components listed in section 5 (except Timer Ring and Stepper) need to be extracted as reusable components. Currently, button styles, cards, and list items are likely inline in screen files.
