import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing } from '../constants/colors';
import { typography } from '../constants/typography';

interface Props {
  message: string;
  onRetry: () => void;
}

export const ErrorView: React.FC<Props> = ({ message, onRetry }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg }}>
   <Text style={[typography.body, { color: 'red', marginBottom: spacing.md }]}>{message}</Text>
    <TouchableOpacity
      onPress={onRetry}
      style={{ backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 8 }}
    >
      <Text style={{ color: '#fff' }}>Retry</Text>
    </TouchableOpacity>
  </View>
);