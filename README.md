# Pokémon Explorer

A Pokémon mobile application built with Expo and React Native, showcasing API integration, state management, and clean UI design.

---

## ✨ Features

- Pokémon list with infinite scroll
- Search by name (debounced)
- Detailed Pokémon screen (stats, types, abilities, evolution chain)
- Favorites with local persistence (AsyncStorage)
- Pull-to-refresh support
- Loading and error states (skeleton loaders)
- Smooth animations and responsive UI
- **Basic Performance optimizations**:
  - FlatList optimizations for smoother scrolling
  - Image prefetching for better UX
  - Simple caching for frequently used data
- **Unit tests**:
  - Store logic (favorites, fetching, caching)
  - Component tests (PokemonCard, ErrorView)

---

## ✅ Requirement Checklist

- [x] Pokémon list screen  
- [x] Pokémon detail screen  
- [x] Data fetched from PokeAPI  
- [x] Loading states  
- [x] Error handling  
- [x] Navigation between screens  

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
- **utils/** – Helpers

### State Management

Zustand is used for:

- Global Pokémon list
- Cached Pokémon details for better performance
- Favorites persistence with AsyncStorage
- Reduced duplicate API requests where possible

---

## 🔌 API

Data is fetched from the public **PokeAPI**:

- Pokémon list  
- Pokémon details  
- Species and evolution chain  

---

## 🔐 Environment

No API key required (PokeAPI is public).

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
Basic unit tests include:

Store logic (favorites and data handling)
A few component-level tests

## 📝 Notes

This project includes additional features beyond the minimum requirements to explore React Native capabilities and improve user experience.

---
