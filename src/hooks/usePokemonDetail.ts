import { useEffect, useRef, useState } from 'react';
import { usePokemonStore } from '../store/pokemonStore';
import { EvolutionChain, Pokemon, PokemonSpecies } from '../types/pokemon';
import { parseEvolutionTree } from '../utils/evolutionParser';

interface UsePokemonDetailReturn {
  pokemon: Pokemon | null;
  species: PokemonSpecies | null;
  evolutionChain: EvolutionChain | null;
  evolutions: string[];
  flavorText: string;
  loading: boolean;
  error: string | null;
}

export const usePokemonDetail = (id: string): UsePokemonDetailReturn => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use ref to prevent multiple fetches
  const fetchedRef = useRef(false);
  
  const { getPokemonDetails, getPokemonSpecies, getEvolutionChain } = usePokemonStore();

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    
    const load = async () => {
      setLoading(true);
      try {
        const data = await getPokemonDetails(id);
        if (!data) throw new Error('No data');
        setPokemon(data);
        
        const speciesData = await getPokemonSpecies(data.id);
        setSpecies(speciesData);
        
        if (speciesData?.evolution_chain?.url) {
          const chain = await getEvolutionChain(speciesData.evolution_chain.url);
          setEvolutionChain(chain);
        }
      } catch (err) {
        setError('Failed to load details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, getPokemonDetails, getPokemonSpecies, getEvolutionChain]);

  const evolutions = evolutionChain ? parseEvolutionTree(evolutionChain.chain) : (pokemon ? [pokemon.name] : []);
  const flavorText = species?.flavor_text_entries?.find(
    entry => entry.language.name === 'en'
  )?.flavor_text || 'No description available.';

  return { pokemon, species, evolutionChain, evolutions, flavorText, loading, error };
};