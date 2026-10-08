// Paleta inspirada no protótipo: azul-marinho profundo com cartões translúcidos
// e destaques em dourado suave para o nome da marca.

export const colors = {
  bgTop: '#141B3D',
  bgBottom: '#2B3A6B',
  card: 'rgba(255,255,255,0.06)',
  cardBorder: 'rgba(255,255,255,0.12)',
  cardAlt: 'rgba(20,27,61,0.55)',
  pill: 'rgba(10,14,35,0.55)',
  pillBorder: 'rgba(255,255,255,0.08)',
  gold: '#E7C878',
  white: '#FFFFFF',
  textPrimary: '#F5F6FA',
  textSecondary: 'rgba(245,246,250,0.62)',
  textMuted: 'rgba(245,246,250,0.38)',
  accentBlue: '#6E8CFF',
  accentBlueDark: '#3A4FA0',
  accentPink: '#F6A6C1',
  accentCyan: '#7FD9E8',
  danger: '#E8768A',
  divider: 'rgba(255,255,255,0.08)',
  tabInactive: 'rgba(245,246,250,0.35)',
};

export const gradients = {
  background: [colors.bgTop, colors.bgBottom],
  button: ['#3A4FA0', '#6E8CFF'],
  chip: ['rgba(110,140,255,0.35)', 'rgba(110,140,255,0.10)'],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
};

export const typography = {
  brand: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.2,
  },
  h1: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  h2: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  value: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.white,
  },
  small: {
    fontSize: 11,
    color: colors.textMuted,
  },
};

export default { colors, gradients, spacing, radii, typography };
