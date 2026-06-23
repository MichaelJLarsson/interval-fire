// ─── Colour tokens ────────────────────────────────────────────────────────────
export const Colors = {
  // Background layers
  bg: '#0d0d0d',
  surface: '#181818',
  border: '#505050',
  borderHi: '#2e2e2e',
  divider: '#444',

  // Background gradient (applied per-screen, not a token value)
  // linear-gradient(to bottom, #560000 0%, #000 ~22%)
  gradientStart: '#560000',
  gradientEnd: '#000000',

  // Phase accents
  work: '#ff3d3d',
  workLight: '#ff6060',
  workSoft: '#ff5050',
  workAlt: '#ff6d3d',
  rest: '#00e5a0',
  restAlt: '#00B9D5',
  prep: '#ffc300',
  strength: '#b388ff',

  // Phase tint backgrounds
  workBgTint: 'rgba(255,61,61,0.13)',
  workBgTint2: 'rgba(255,61,61,0.15)',
  workBgTint3: 'rgba(255,61,61,0.19)',
  workBorder: 'rgba(255,61,61,0.33)',
  workBgButton: 'rgba(255,61,61,0.30)',
  restBgTint: '#213d35',
  restIconBg: 'rgba(0,229,160,0.16)',
  restCheckBg: 'rgba(0,229,160,0.09)',
  prepIconBg: 'rgba(255,195,0,0.16)',
  plumIconBg: 'rgba(179,136,255,0.16)',
  streakBanner: '#350000',
  streakBorder: '#7e0000',

  // Text
  textHi: '#f0f0f0',
  textMid: '#e0e0e0',
  textLo: '#aaa',
  textMuted: '#888',
  textDim: '#666',
  textFaint: '#555',
  textGhost: '#737373',
  inputPlaceholder: '#6b6b6b',

  // Chart
  barTrack: '#353535',
  barFill: '#4b4b4b',
  barToday: '#ff3d3d',
  metaChip: '#373737',

  // Round progress (timer)
  progressDone: '#919191',
  progressActive: '#ff3d3d',
  progressPending: '#4c4242',

  // Kcal / history
  textKcal: '#777',
  kcalValue: '#ff5555',

  // Misc
  white: '#ffffff',
} as const

// ─── Typography ───────────────────────────────────────────────────────────────
export const Fonts = {
  condensed: 'BarlowSemiCondensed_800ExtraBold',
  condensedBold: 'BarlowSemiCondensed_700Bold',
  condensedMedium: 'BarlowSemiCondensed_500Medium',
  body: 'Barlow_400Regular',
  bodySemiBold: 'Barlow_600SemiBold',
} as const

// ─── Font sizes ───────────────────────────────────────────────────────────────
// Scale follows DESIGN_SYSTEM.md §2 Type Scale.
export const FontSizes = {
  displayXL: 96, // Timer countdown digits
  displayLg: 40, // "Workout Complete!" headline
  displayMd: 36, // Preset card title
  displaySm: 30, // Summary data values, logo
  headingLg: 26, // Screen titles
  headingMd: 20, // CTA buttons, timer workout name
  bodyXl: 18, // Kcal value, workout name on timer
  body: 14, // History titles, setting labels, inputs
  caption: 12, // Sub-labels, metadata, secondary body
  label: 10, // Uppercase section labels, chips, pills
} as const

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const Spacing = {
  screenH: 22, // horizontal screen padding
  screenV: 46, // vertical screen padding
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 28,
  xxxl: 36,
} as const

// ─── Border radii ─────────────────────────────────────────────────────────────
export const Radii = {
  sm: 8,
  md: 12,
  lg: 13,
  xl: 14,
  pill: 20,
  full: 999,
} as const
