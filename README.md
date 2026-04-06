# Pokémon Explorer

A simple Pokémon mobile app built with Expo, React Native, TypeScript, Zustand, and Tailwind CSS (NativeWind).

## Features

- Browse a list of Pokémon with infinite scroll
- Search Pokémon by name
- View detailed stats, types, abilities, height, weight
- Mark favorites (persisted locally with AsyncStorage)
- Dark/light mode support (using NativeWind)

## Tech Stack

- Expo SDK 55
- React Native 0.83
- TypeScript
- Zustand (state management)
- React Native Paper (UI components)
- NativeWind (Tailwind CSS)
- Axios (API calls)
- PokeAPI

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/pokemon-explorer.git
   cd pokemon-explorer
   Install dependencies:

bash
npm install
Start the development server:

bash
npx expo start
Scan the QR code with Expo Go (Android) or the Camera app (iOS).

Notes
The app uses the official PokeAPI.

Favorites are stored locally using AsyncStorage.

Infinite scroll loads 20 Pokémon at a time.

If the API fails, the app falls back to mock data to demonstrate UI.

Known Issues
None. All core features work as expected.

License
MIT

text

---

## 3. Push to GitHub (If Not Done Yet)

If you haven’t run the commands above, do:

```bash
cd D:\PokemonApp
git init
git add .
git commit -m "Initial commit: Pokémon Explorer app"
git remote add origin https://github.com/YOUR_USERNAME/pokemon-explorer.git
git push -u origin main
If you get an error about main not existing, run:

bash
git branch -M main
git push -u origin main