// src/__tests__/store.test.ts
jest.mock('axios'); // this tells Jest to use the mock above

// If you don't have the separate mock file, you can inline it:
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
}));

// Now import the store
import { usePokemonStore } from '../store/pokemonStore';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('PokemonStore', () => {
  it('adds and removes favorites', async () => {
    const { addFavorite, removeFavorite, isFavorite } = usePokemonStore.getState();
    
    await addFavorite('pikachu');
    expect(isFavorite('pikachu')).toBe(true);
    
    await removeFavorite('pikachu');
    expect(isFavorite('pikachu')).toBe(false);
  });
});