import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { fetchPokemonDetails, fetchPokemonList } from '../services/pokeApi';
import { Pokemon, PokemonListItem } from '../types/pokemon';

interface PokemonStore {
  pokemons: PokemonListItem[];
  pokemonsDetails: Record<string, Pokemon>;
  favorites: string[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  offset: number;
  fetchPokemons: () => Promise<void>;
  loadMore: () => Promise<void>;
  getPokemonDetails: (name: string) => Promise<Pokemon | null>;
  addFavorite: (name: string) => void;
  removeFavorite: (name: string) => void;
  isFavorite: (name: string) => boolean;
}

const LIMIT = 20;

export const usePokemonStore = create<PokemonStore>()(
  persist(
    (set, get) => ({
      pokemons: [],
      pokemonsDetails: {},
      favorites: [],
      loading: false,
      error: null,
      hasMore: true,
      offset: 0,

      fetchPokemons: async () => {
  const { offset, pokemons } = get();
  if (offset > 0 && pokemons.length > 0) return;
  set({ loading: true, error: null });
  try {
    console.log('Fetching Pokémon list...');
    const results = await fetchPokemonList(LIMIT, 0);
    console.log('Fetched:', results.length);
    set({
      pokemons: results,
      offset: LIMIT,
      hasMore: results.length === LIMIT,
      loading: false,
    });
  } catch (error: any) {
    console.error('API error:', error.message);
    set({ error: 'Failed to load Pokémon', loading: false });
  }
},

      loadMore: async () => {
        const { loading, hasMore, offset, pokemons } = get();
        if (loading || !hasMore) return;
        set({ loading: true });
        try {
          const results = await fetchPokemonList(LIMIT, offset);
          set({
            pokemons: [...pokemons, ...results],
            offset: offset + LIMIT,
            hasMore: results.length === LIMIT,
            loading: false,
          });
        } catch (error) {
          set({ error: 'Failed to load more', loading: false });
        }
      },

      getPokemonDetails: async (name: string) => {
        const { pokemonsDetails } = get();
        if (pokemonsDetails[name]) return pokemonsDetails[name];
        try {
          const details = await fetchPokemonDetails(name);
          set((state) => ({
            pokemonsDetails: { ...state.pokemonsDetails, [name]: details },
          }));
          return details;
        } catch (error) {
          set({ error: `Failed to load details for ${name}` });
          return null;
        }
      },

      addFavorite: (name) =>
        set((state) => ({ favorites: [...state.favorites, name] })),

      removeFavorite: (name) =>
        set((state) => ({ favorites: state.favorites.filter((fav) => fav !== name) })),

      isFavorite: (name) => get().favorites.includes(name),
    }),
    {
      name: 'pokemon-storage',
      storage: createJSONStorage(() => AsyncStorage), // ✅ correct way
    }
  )
);