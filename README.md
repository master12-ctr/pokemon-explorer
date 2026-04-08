# Pokémon Explorer

A modern Pokémon mobile application built with Expo and React Native, showcasing API integration, state management, and clean UI design.

---

## ✨ Features

- Pokémon list with infinite scroll
- Search by name (debounced)
- Detailed Pokémon screen (stats, types, abilities, evolution chain)
- Favorites with local persistence (AsyncStorage)
- Pull-to-refresh support
- Loading and error states (skeleton loaders + error boundary)
- Smooth animations and responsive UI
- **Performance optimizations**: FlatList optimizations, image prefetching, request deduplication, caching with TTL
- **Unit tests**: Basic store tests (Jest)

---

## 🛠 Tech Stack

- **Expo (SDK 55)**
- **React Native (0.83)**
- **TypeScript**
- **Zustand** – state management
- **React Native Paper** – UI components
- **NativeWind** – utility-first styling
- **Axios** – API requests
- **PokeAPI** – data source

---

## 🧱 Architecture Overview

The app follows a modular and scalable structure:

- **app/** – Screens (Expo Router)
- **components/** – Reusable UI components
- **store/** – Global state (Zustand)
- **services/** – API layer
- **hooks/** – Custom logic (data fetching, navigation)
- **utils/** – Helpers and parsers

### State Management

Zustand is used for:

- Global Pokémon list
- Cached Pokémon details (5‑minute TTL)
- Favorites persistence (AsyncStorage)
- API request deduplication (prevents duplicate network calls)

---

## 🔌 API

Data is fetched from the public **PokeAPI**:

- Pokémon list
- Pokémon details
- Species and evolution chain

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/pokemon-explorer.git
cd pokemon-explorer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the app

```bash
npx expo start
```

Scan the QR code using Expo Go (Android) or the Camera app (iOS).

---

## 📱 Tests
Run unit tests

```bash
npm test
```

## 🧪 Future Improvements

* Add unit tests (Jest / React Native Testing Library)
* Dark mode support
* Offline caching
* Performance optimizations for large datasets

---

## 📄 License

MIT
