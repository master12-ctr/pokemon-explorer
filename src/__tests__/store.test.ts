import { act } from '@testing-library/react-native';
import axios from 'axios';
import { usePokemonStore } from '../store/pokemonStore';

jest.mock('axios');

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('PokemonStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds and removes favorites', async () => {
    const { addFavorite, removeFavorite, isFavorite } =
      usePokemonStore.getState();

    await addFavorite('pikachu');
    expect(isFavorite('pikachu')).toBe(true);

    await removeFavorite('pikachu');
    expect(isFavorite('pikachu')).toBe(false);
  });

  it('fetches pokemon list', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        results: [
          { name: 'pikachu', url: 'url1' },
          { name: 'bulbasaur', url: 'url2' },
        ],
      },
    });

    const { fetchPokemons } = usePokemonStore.getState();

    await act(async () => {
      await fetchPokemons(true);
    });

    const state = usePokemonStore.getState();

    expect(state.pokemons.length).toBeGreaterThan(0);
    expect(state.pokemons[0].name).toBe('pikachu');
  });

  it('caches pokemon details after first fetch', async () => {
    const mockResponse = {
      data: {
        id: 25,
        name: 'pikachu',
        stats: [],
        types: [],
        abilities: [],
        height: 4,
        weight: 60,
        base_experience: 100,
        sprites: {},
        species: { name: 'pikachu', url: '' },
      },
    };

    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const { getPokemonDetails } = usePokemonStore.getState();

    await act(async () => {
      await getPokemonDetails('pikachu');
    });

    const state = usePokemonStore.getState();

    expect(state.pokemonsDetails['pikachu']).toBeDefined();
  });
});