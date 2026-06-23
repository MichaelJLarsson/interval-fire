// ─── Color helpers ─────────────────────────────────────────────────────────────
function alpha(hex: string, opacity: number): string {
  return `${hex}${Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0')}`
}

// ─── Brand palette ────────────────────────────────────────────────────────────
// Raw hues from which tints, tones, and semantic tokens derive.
const fire = '#ff3d3d'
const fireHi = '#ff5050'
const mint = '#00e5a0'
const sky = '#00b9d5'
const brass = '#ffc300'
const plum = '#b388ff'

export const Brand = { fire, fireHi, mint, sky, brass, plum } as const

// ─── Neutral scale (light → dark) ─────────────────────────────────────────────
export const Neutral = {
  50: '#f0f0f0',
  100: '#e0e0e0',
  200: '#aaaaaa',
  300: '#888888',
  400: '#666666',
  500: '#555555',
  600: '#444444',
  700: '#353535',
  800: '#2e2e2e',
  900: '#181818',
  950: '#0d0d0d',
} as const

// ─── Semantic color tokens ─────────────────────────────────────────────────────
export const Colors = {
  // Surfaces
  bg: Neutral[950],
  surface: Neutral[900],

  // Borders & dividers
  border: Neutral[600],
  borderSubtle: Neutral[800],
  divider: Neutral[600],

  // Background gradient (fire-tinted, applied per-screen)
  gradientStart: '#560000',
  gradientEnd: '#000000',

  // Phase accents
  work: fire,
  workLight: fireHi,
  rest: mint,
  restAlt: sky,
  prep: brass,
  strength: plum,

  // Phase tint backgrounds (derived from brand hues)
  workBgTint: alpha(fire, 0.15),
  workSubtle: alpha(fire, 0.3),
  workIconBg: alpha(fire, 0.16),
  restBgTint: '#213d35',
  restIconBg: alpha(mint, 0.16),
  restCheckBg: alpha(mint, 0.09),
  prepIconBg: alpha(brass, 0.16),
  plumIconBg: alpha(plum, 0.16),
  streakBanner: '#350000',
  streakBorder: '#7e0000',

  // Text hierarchy
  textHi: Neutral[50],
  textMid: Neutral[100],
  textLo: Neutral[200],
  textMuted: Neutral[300],
  textFaint: Neutral[500],
  inputPlaceholder: Neutral[400],

  // Chart
  barTrack: Neutral[700],
  barFill: Neutral[600],
  barToday: fire,
  metaChip: Neutral[700],

  // Timer ring progress
  progressDone: Neutral[300],
  progressActive: fire,
  progressPending: Neutral[600],

  // Kcal
  kcalValue: fire,

  // Utility
  white: Neutral[50],
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
