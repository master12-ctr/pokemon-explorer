import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import {
    fetchEvolutionChain,
    fetchPokemonDetails,
    fetchPokemonList,
    fetchPokemonSpecies
} from '../services/pokeApi';
import { EvolutionChain, Pokemon, PokemonListItem, PokemonSpecies } from '../types/pokemon';

interface PokemonStore {
  pokemons: PokemonListItem[];
  pokemonsDetails: Record<string, Pokemon>;
  pokemonsSpecies: Record<string, PokemonSpecies>;
  evolutionChains: Record<string, EvolutionChain>;
  favorites: string[];
  loadingInitial: boolean;
  loadingMore: boolean;
  loadingDetails: Record<string, boolean>;
  error: string | null;
  errorDetails: Record<string, string>;
  hasMore: boolean;
  offset: number;
  fetchPokemons: (force?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  getPokemonDetails: (name: string) => Promise<Pokemon | null>;
  getPokemonSpecies: (id: number) => Promise<PokemonSpecies | null>;
  getEvolutionChain: (url: string) => Promise<EvolutionChain | null>;
  addFavorite: (name: string) => Promise<void>;
  removeFavorite: (name: string) => Promise<void>;
  isFavorite: (name: string) => boolean;
  hydrateFavorites: () => Promise<void>;
}

const LIMIT = 20;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let lastFetchTime = 0;

// ✅ Promise cache to prevent duplicate requests
const pendingRequests: Record<string, Promise<Pokemon | null> | undefined> = {};

export const usePokemonStore = create<PokemonStore>((set, get) => ({
  pokemons: [],
  pokemonsDetails: {},
  pokemonsSpecies: {},
  evolutionChains: {},
  favorites: [],
  loadingInitial: false,
  loadingMore: false,
  loadingDetails: {},
  error: null,
  errorDetails: {},
  hasMore: true,
  offset: 0,

  hydrateFavorites: async () => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      if (stored) {
        set({ favorites: JSON.parse(stored) });
      }
    } catch (e) {
      console.warn('Failed to load favorites', e);
    }
  },

  fetchPokemons: async (force = false) => {
    const { offset, pokemons, loadingInitial } = get();
    const now = Date.now();
    if (!force && offset > 0 && pokemons.length > 0 && (now - lastFetchTime) < CACHE_TTL) return;
    if (loadingInitial) return;
    set({ loadingInitial: true, error: null });
    try {
      const results = await fetchPokemonList(LIMIT, 0);
      lastFetchTime = Date.now();
      set({
        pokemons: results,
        offset: LIMIT,
        hasMore: results.length === LIMIT,
        loadingInitial: false,
      });
    } catch (error: any) {
      set({ error: error?.message || 'Failed to load Pokémon', loadingInitial: false });
    }
  },

  loadMore: async () => {
    const { loadingMore, hasMore, offset, pokemons } = get();
    if (loadingMore || !hasMore) return;
    set({ loadingMore: true });
    try {
      const results = await fetchPokemonList(LIMIT, offset);
      set({
        pokemons: [...pokemons, ...results],
        offset: offset + LIMIT,
        hasMore: results.length === LIMIT,
        loadingMore: false,
      });
    } catch (error) {
      set({ error: (error as Error)?.message || 'Failed to load more', loadingMore: false });
    }
  },

  
  
  getPokemonDetails: async (name: string) => {
  const { pokemonsDetails } = get();
  if (pokemonsDetails[name]) return pokemonsDetails[name];

  //  Check pending request FIRST
  if (pendingRequests[name]) return pendingRequests[name];

  const promise = (async () => {
    set((state) => ({
      loadingDetails: { ...state.loadingDetails, [name]: true },
    }));
    try {
      const details = await fetchPokemonDetails(name);
      set((state) => ({
        pokemonsDetails: { ...state.pokemonsDetails, [name]: details },
        loadingDetails: { ...state.loadingDetails, [name]: false },
        errorDetails: { ...state.errorDetails, [name]: undefined },
      }));
      delete pendingRequests[name];
      return details;
    } catch (error: any) {
      set((state) => ({
        loadingDetails: { ...state.loadingDetails, [name]: false },
        errorDetails: { ...state.errorDetails, [name]: error?.message || `Failed to load ${name}` },
      }));
      delete pendingRequests[name];
      return null;
    }
  })();

  pendingRequests[name] = promise;
  return promise;
},

  getPokemonSpecies: async (id: number) => {
    const { pokemonsSpecies } = get();
    const key = id.toString();
    if (pokemonsSpecies[key]) return pokemonsSpecies[key];
    try {
      const species = await fetchPokemonSpecies(id);
      set((state) => ({
        pokemonsSpecies: { ...state.pokemonsSpecies, [key]: species }
      }));
      return species;
    } catch (error) {
      return null;
    }
  },

  getEvolutionChain: async (url: string) => {
    const { evolutionChains } = get();
    if (evolutionChains[url]) return evolutionChains[url];
    try {
      const chain = await fetchEvolutionChain(url);
      set((state) => ({
        evolutionChains: { ...state.evolutionChains, [url]: chain }
      }));
      return chain;
    } catch (error) {
      return null;
    }
  },

  addFavorite: async (name) => {
    const { favorites } = get();
    if (favorites.includes(name)) return;
    const updated = [...favorites, name];
    set({ favorites: updated });
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    // Pre-fetch details if not already cached
    const { getPokemonDetails } = get();
    if (!get().pokemonsDetails[name]) {
      getPokemonDetails(name);
    }
  },

  removeFavorite: async (name) => {
    const updated = get().favorites.filter(f => f !== name);
    set({ favorites: updated });
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
  },

  isFavorite: (name) => get().favorites.includes(name),
}));