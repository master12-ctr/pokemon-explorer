# Pokémon Explorer

A beautifully designed Pokémon mobile app built with Expo, TypeScript, React Native Paper, NativeWind, and Zustand.

## Features

- ✅ Pokémon list with infinite scroll
- ✅ Search by name (debounced)
- ✅ Detail screen with stats, types, abilities, height, weight
- ✅ Favorites (persisted locally with AsyncStorage)
- ✅ Pull‑to‑refresh
- ✅ Loading & error states
- ✅ Clean, modern UI with shadows and gradients

## Tech Stack

- **Expo SDK 55**
- **React Native 0.83**
- **TypeScript**
- **Zustand** (state management + persistence)
- **React Native Paper** (UI components)
- **NativeWind v5** (Tailwind CSS for React Native)
- **Axios** (API calls)
- **PokeAPI**

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/pokemon-explorer.git
   cd pokemon-explorer
   Install dependencies:

bash
npm install
Start the development server:

bash
npx expo start
Scan the QR code with Expo Go (Android) or the Camera app (iOS).

Screenshots
Add your own screenshots here before submitting.

Project Structure
text
src/
├── components/       # Reusable UI (Card, SearchBar, Loading, Error)
├── store/            # Zustand store (Pokémon, favorites)
├── services/         # API calls (PokeAPI)
├── types/            # TypeScript interfaces
app/
├── _layout.tsx       # Root layout with PaperProvider & Stack nav
├── index.tsx         # List screen
└── pokemon/[id].tsx  # Detail screen
Future Improvements
Dark mode toggle

Unit tests with Jest

Offline support

License
MIT

text

---

## 🚀 Final Steps

1. **Replace each file** with the code above.
2. **Install missing dependencies** (if any):
   ```bash
   npm install zustand @react-native-async-storage/async-storage axios
Clear Metro cache and restart:

bash
npx expo start -c
Test on a real device (Expo Go).