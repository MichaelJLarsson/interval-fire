// ─── Colour tokens ────────────────────────────────────────────────────────────
export const Colors = {
  // Background layers
  bg:        '#0d0d0d',
  surface:   '#1e1e1e',
  surfaceLo: '#181818',
  border:    '#2a2a2a',
  borderHi:  '#2e2e2e',

  // Phase accents
  work:      '#ff3d3d',
  workLight: '#ff6060',
  rest:      '#00e5a0',
  prep:      '#ffc300',

  // Text
  textHi:    '#f0f0f0',
  textMid:   '#e0e0e0',
  textLo:    '#aaa',
  textMuted: '#888',
  textDim:   '#666',
  textFaint: '#555',

  // Stepper buttons
  stepBg:     '#383838',
  stepBorder: '#505050',

  // Misc
  strength:  '#b388ff',
  white:     '#ffffff',
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────
export const Fonts = {
  condensed: 'BarlowCondensed',  // loaded via expo-font
  body:      'Barlow',
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const Spacing = {
  screenH: 22,   // horizontal screen padding
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 36,
} as const;

// ─── Border radii ─────────────────────────────────────────────────────────────
export const Radii = {
  sm:  8,
  md:  11,
  lg:  14,
  xl:  18,
  full: 999,
} as const;
