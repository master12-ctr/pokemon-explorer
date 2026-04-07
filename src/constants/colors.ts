import { ViewStyle } from 'react-native';

export const colors = {
  primary: '#f97316',
  background: '#FFF7ED',
  card: '#ffffff',
  backgroundElement: '#f9fafb',
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    light: '#9ca3af',
  },
  type: {
    fire: '#f97316', water: '#3b82f6', grass: '#22c55e', electric: '#eab308',
    psychic: '#ec4899', ice: '#06b6d4', dragon: '#8b5cf6', dark: '#78716c',
    fairy: '#f472b6', normal: '#a8a29e', fighting: '#dc2626', flying: '#a1a1aa',
    poison: '#a855f7', ground: '#d97706', rock: '#b45309', bug: '#84cc16',
    ghost: '#6b21a5', steel: '#71717a',
  },
  elevation: {
    low: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    } as ViewStyle,
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    } as ViewStyle,
  },
};

export const getTypeColor = (typeName: string): string => {
  return colors.type[typeName as keyof typeof colors.type] || colors.primary;
};

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};