import axios from 'axios';
import { EvolutionChain, Pokemon, PokemonListItem, PokemonSpecies } from '../types/pokemon';

const API_BASE = 'https://pokeapi.co/api/v2';

export const fetchPokemonList = async (limit: number = 20, offset: number = 0): Promise<PokemonListItem[]> => {
  const response = await axios.get<{ results: PokemonListItem[] }>(`${API_BASE}/pokemon?limit=${limit}&offset=${offset}`);
  return response.data.results;
};

export const fetchPokemonDetails = async (idOrName: string | number): Promise<Pokemon> => {
  const response = await axios.get<Pokemon>(`${API_BASE}/pokemon/${idOrName}`);
  return response.data;
};

export const fetchPokemonSpecies = async (id: number): Promise<PokemonSpecies> => {
  const response = await axios.get<PokemonSpecies>(`${API_BASE}/pokemon-species/${id}`);
  return response.data;
};

export const fetchEvolutionChain = async (url: string): Promise<EvolutionChain> => {
  const response = await axios.get<EvolutionChain>(url);
  return response.data;
};