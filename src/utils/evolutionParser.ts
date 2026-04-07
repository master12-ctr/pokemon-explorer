import { EvolutionChainLink } from '../types/pokemon';

export const parseEvolutionTree = (chainNode: EvolutionChainLink): string[] => {
  const result: string[] = [chainNode.species.name];
  if (chainNode.evolves_to && chainNode.evolves_to.length) {
    for (const next of chainNode.evolves_to) {
      result.push(...parseEvolutionTree(next));
    }
  }
  return result;
};