// ─── Colour tokens ────────────────────────────────────────────────────────────
export const BaseColors = {
  fireOrange: '#ff3d3d',
  fireOrangeLight: '#ff5050',
  eucalyptus: '#00e5a0',
  eucalyptusAlt: '#00B9D5',
  brass: '#ffc300',
  lavender: '#b388ff',
  white: '#f0f0f0',
  black: '#0d0d0d',
} as const

export const Grey = {
  white: BaseColors.white,
  grey100: BaseColors.white,
  grey200: '#e0e0e0',
  grey300: '#aaa',
  grey400: '#888',
  grey500: '#666',
  grey600: '#555',
  grey700: '#444',
  grey800: '#353535',
  grey900: '#2e2e2e',
  grey950: '#181818',
  black: BaseColors.black,
} as const

export const Colors = {
  // Background layers
  bg: BaseColors.black,
  surface: Grey.grey950,
  border: Grey.grey700,
  borderHi: Grey.grey900,
  divider: Grey.grey700,

  // Background gradient (applied per-screen, not a token value)
  // linear-gradient(to bottom, #560000 0%, #000 ~22%)
  gradientStart: '#560000',
  gradientEnd: '#000000',

  // Phase accents
  work: BaseColors.fireOrange,
  workLight: BaseColors.fireOrangeLight,
  rest: BaseColors.eucalyptus,
  restAlt: BaseColors.eucalyptusAlt,
  prep: BaseColors.brass,
  strength: BaseColors.lavender,

  // Phase tint backgrounds
  workBgTint: 'rgba(255,61,61,0.15)',
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
  textHi: BaseColors.white,
  textMid: Grey.grey200,
  textLo: Grey.grey300,
  textMuted: Grey.grey400,
  textDim: Grey.grey500,
  textFaint: Grey.grey600,
  textGhost: Grey.grey500,
  inputPlaceholder: Grey.grey500,

  // Chart
  barTrack: Grey.grey800,
  barFill: Grey.grey700,
  barToday: BaseColors.fireOrange,
  metaChip: Grey.grey800,

  // Round progress (timer)
  progressDone: Grey.grey400,
  progressActive: BaseColors.fireOrange,
  progressPending: Grey.grey700,

  // Kcal / history
  textKcal: Grey.grey500,
  kcalValue: BaseColors.fireOrange,

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
