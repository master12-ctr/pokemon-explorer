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
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  offset: number;
  fetchPokemons: () => Promise<void>;
  loadMore: () => Promise<void>;
  getPokemonDetails: (name: string) => Promise<Pokemon | null>;
  getPokemonSpecies: (id: number) => Promise<PokemonSpecies | null>;
  getEvolutionChain: (url: string) => Promise<EvolutionChain | null>;
  addFavorite: (name: string) => void;
  removeFavorite: (name: string) => void;
  isFavorite: (name: string) => boolean;
}

const LIMIT = 20;

export const usePokemonStore = create<PokemonStore>((set, get) => ({
  pokemons: [],
  pokemonsDetails: {},
  pokemonsSpecies: {},
  evolutionChains: {},
  favorites: [],
  loading: false,
  error: null,
  hasMore: true,
  offset: 0,

  fetchPokemons: async () => {
    const { offset, pokemons } = get();
    if (offset > 0 && pokemons.length > 0) {
      console.log('Already loaded, skipping fetch');
      return;
    }
    set({ loading: true, error: null });
    try {
      console.log('Fetching first page of Pokémon...');
      const results = await fetchPokemonList(LIMIT, 0);
      console.log(`Fetched ${results.length} Pokémon`);
      set({
        pokemons: results,
        offset: LIMIT,
        hasMore: results.length === LIMIT,
        loading: false,
      });
    } catch (error: any) {
      console.error('API error:', error.message);
      set({ error: error instanceof Error ? error.message : 'Failed to load Pokémon', loading: false });
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
      set({ error: error instanceof Error ? error.message : 'Failed to load more', loading: false });
    }
  },

  getPokemonDetails: async (name: string) => {
    const { pokemonsDetails } = get();
    if (pokemonsDetails[name]) return pokemonsDetails[name];
    try {
      const details = await fetchPokemonDetails(name);
      set((state) => ({
        pokemonsDetails: { ...state.pokemonsDetails, [name]: details }
      }));
      return details;
    } catch (error) {
      set({ error: `Failed to load details for ${name}` });
      return null;
    }
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

  // Prevent duplicate favorites
  addFavorite: (name) =>
    set((state) => ({
      favorites: state.favorites.includes(name) ? state.favorites : [...state.favorites, name],
    })),
  removeFavorite: (name) =>
    set((state) => ({ favorites: state.favorites.filter((fav) => fav !== name) })),
  isFavorite: (name) => get().favorites.includes(name),
}));