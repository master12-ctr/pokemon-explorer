import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import '../global.css';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#ef4444' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Pokédex' }} />
        <Stack.Screen name="pokemon/[id]" options={{ title: 'Pokémon Details' }} />
      </Stack>
    </PaperProvider>
  );
}