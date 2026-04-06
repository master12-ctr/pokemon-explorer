import React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';

interface Props {
  message: string;
  onRetry: () => void;
}

export const ErrorView: React.FC<Props> = ({ message, onRetry }) => (
  <View className="flex-1 justify-center items-center p-4">
    <Text className="text-red-500 text-lg mb-4 text-center">{message}</Text>
    <Button mode="contained" onPress={onRetry}>
      Retry
    </Button>
  </View>
);