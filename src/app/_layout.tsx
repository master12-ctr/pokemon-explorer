import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import '../global.css';
import { usePokemonStore } from '../store/pokemonStore';

export default function RootLayout() {
  const hydrateFavorites = usePokemonStore(state => state.hydrateFavorites);

  useEffect(() => {
    hydrateFavorites();
  }, [hydrateFavorites]);

  return (
    <PaperProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#f97316' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="pokemon/[id]" options={{ title: 'Details' }} />
        <Stack.Screen name="favorites" options={{ title: 'Favorites', headerShown: true }} />
      </Stack>
    </PaperProvider>
  );
}