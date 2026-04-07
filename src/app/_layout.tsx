import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import '../global.css';

export default function RootLayout() {
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
        {/* Hide the default header on home screen – we use our own custom header */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="pokemon/[id]" options={{ title: 'Details' }} />
        <Stack.Screen name="favorites" options={{ title: 'Favorites', headerShown: true }} />
      </Stack>
    </PaperProvider>
  );
}