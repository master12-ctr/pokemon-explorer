import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import '../global.css';

export default function RootLayout() {
  return (
    <PaperProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false, // we'll use custom header inside screens
        }}
      />
    </PaperProvider>
  );
}