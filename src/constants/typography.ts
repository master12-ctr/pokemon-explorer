import { colors, spacing } from './colors';


export const typography = {
  title: { fontSize: 24, fontWeight: '700' as const, color: colors.text.primary },
  titleWhite: { fontSize: 24, fontWeight: '700' as const, color: '#ffffff' },
  subtitle: { fontSize: 18, fontWeight: '600' as const, color: colors.text.secondary },
  body: { fontSize: 14, color: colors.text.primary, lineHeight: 24 },
  bodyBold: { fontSize: 14, fontWeight: '600' as const, color: colors.text.primary },
  caption: { fontSize: 12, color: colors.text.light },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginTop: spacing.sm,
    textTransform: 'capitalize' as const,
    color: colors.text.primary,
  },
};