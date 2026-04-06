import axios from 'axios';
import { Pokemon, PokemonSpecies } from '../types/pokemon';

const API_BASE = 'https://pokeapi.co/api/v2';

export const fetchPokemonList = async (limit: number = 20, offset: number = 0) => {
//   const response = await axios.get(`${API_BASE}/pokemon?limit=${limit}&offset=${offset}`);
//   return response.data.results as PokemonListItem[];

   const mockPokemons = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
      { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
      { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' },
      { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
      { name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/7/' },
      { name: 'wartortle', url: 'https://pokeapi.co/api/v2/pokemon/8/' },
      { name: 'blastoise', url: 'https://pokeapi.co/api/v2/pokemon/9/' },
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    ];
  return mockPokemons;

};

export const fetchPokemonDetails = async (idOrName: string | number) => {
  const response = await axios.get(`${API_BASE}/pokemon/${idOrName}`);
  return response.data as Pokemon;
};

export const fetchPokemonSpecies = async (id: number) => {
  const response = await axios.get(`${API_BASE}/pokemon-species/${id}`);
  return response.data as PokemonSpecies;
};