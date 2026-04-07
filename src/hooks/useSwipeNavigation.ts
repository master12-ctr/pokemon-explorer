import { router } from 'expo-router';
import { useCallback } from 'react';
import { Gesture } from 'react-native-gesture-handler';

export const useSwipeNavigation = (currentId: string, allPokemonNames: string[]) => {
  const goToNext = useCallback(() => {
    const idx = allPokemonNames.indexOf(currentId);
    if (idx < allPokemonNames.length - 1) router.push(`/pokemon/${allPokemonNames[idx + 1]}`);
  }, [currentId, allPokemonNames]);

  const goToPrev = useCallback(() => {
    const idx = allPokemonNames.indexOf(currentId);
    if (idx > 0) router.push(`/pokemon/${allPokemonNames[idx - 1]}`);
  }, [currentId, allPokemonNames]);

  const panGesture = Gesture.Pan()
    .onEnd(event => {
      if (event.translationX > 50) goToPrev();
      else if (event.translationX < -50) goToNext();
    });

  return { panGesture, goToNext, goToPrev };
};