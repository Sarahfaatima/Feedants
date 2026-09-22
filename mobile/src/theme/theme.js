export const colors = {
  primary: '#0E7C7B', // teal accent
  primaryDark: '#0A5F5E',
  primaryLight: '#E3F4F3',
  primarySurface: '#EAF7F6',

  background: '#F7F9F9',
  surface: '#FFFFFF',
  border: '#E7ECEB',

  textPrimary: '#101828',
  textSecondary: '#5B6B6A',
  textMuted: '#8A9998',

  success: '#1D9E7C',
  danger: '#D64545',
  warning: '#B98900',

  gold: '#E4A017',
  silver: '#9AA5B1',
  bronze: '#C97A3D',

  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(16, 24, 40, 0.5)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const typography = {
  title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  heading: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  subheading: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  body: { fontSize: 14, fontWeight: '400', color: colors.textPrimary },
  bodyMuted: { fontSize: 13, fontWeight: '400', color: colors.textSecondary },
  caption: { fontSize: 12, fontWeight: '400', color: colors.textMuted },
  label: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
};

export const shadow = {
  card: {
    shadowColor: '#0F2E2D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
};
