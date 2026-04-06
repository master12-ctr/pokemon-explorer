import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import '../global.css';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#2c3e50',
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Pokédex' }} />
        <Stack.Screen name="pokemon/[id]" options={{ title: 'Details' }} />
      </Stack>
    </PaperProvider>
  );
}