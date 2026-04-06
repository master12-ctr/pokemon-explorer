import axios from 'axios';
import { Pokemon, PokemonListItem, PokemonSpecies } from '../types/pokemon';

const API_BASE = 'https://pokeapi.co/api/v2';

export const fetchPokemonList = async (limit: number = 20, offset: number = 0) => {
  const response = await axios.get(`${API_BASE}/pokemon?limit=${limit}&offset=${offset}`);
  return response.data.results as PokemonListItem[];
};

export const fetchPokemonDetails = async (idOrName: string | number) => {
  const response = await axios.get(`${API_BASE}/pokemon/${idOrName}`);
  return response.data as Pokemon;
};

export const fetchPokemonSpecies = async (id: number) => {
  const response = await axios.get(`${API_BASE}/pokemon-species/${id}`);
  return response.data as PokemonSpecies;
};