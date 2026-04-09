import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  useWindowDimensions,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorView } from '../components/ErrorView';
import { PokemonCard } from '../components/PokemonCard';
import { SkeletonCard } from '../components/SkeletonLoader';
import { colors, spacing } from '../constants/colors';
import { getLayout } from '../constants/spacing';
import { typography } from '../constants/typography';
import { usePokemonStore } from '../store/pokemonStore';
import { PokemonListItem } from '../types/pokemon';

export default function FavoritesScreen() {
  const { favorites, pokemonsDetails, getPokemonDetails, loadingInitial, error, errorDetails } = usePokemonStore();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMissing, setLoadingMissing] = useState(false);
  const { width } = useWindowDimensions();
  const { numColumns, gap, screenWidth, cardWidth } = getLayout(width, 0);

  const favoritePokemons = useMemo(() => {
    return favorites
      .map(name => {
        const details = pokemonsDetails[name];
        if (!details) return null;
        return { name, url: `https://pokeapi.co/api/v2/pokemon/${details.id}/` };
      })
      .filter(Boolean) as PokemonListItem[];
  }, [favorites, pokemonsDetails]);

  useEffect(() => {
    const missing = favorites.filter(name => !pokemonsDetails[name] && !errorDetails[name]);
    if (missing.length === 0) return;
    const fetchMissing = async () => {
      setLoadingMissing(true);
      await Promise.all(missing.map(name => getPokemonDetails(name)));
      setLoadingMissing(false);
    };
    fetchMissing();
  }, [favorites, pokemonsDetails, errorDetails, getPokemonDetails]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all(favorites.map(name => getPokemonDetails(name)));
    setRefreshing(false);
  }, [favorites, getPokemonDetails]);

  const handlePress = useCallback((name: string) => {
    Haptics.selectionAsync();
    router.push(`/pokemon/${name}`);
  }, []);

  const renderEmptyList = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
      <Text style={typography.body}>No favorites yet 💔</Text>
      <Text style={typography.caption}>Go back and tap the heart icon on any Pokémon</Text>
    </View>
  );

  const renderItem = ({ item }: { item: PokemonListItem }) => (
    <View style={{ flex: 1 }}>

      <PokemonCard pokemon={item} onPress={handlePress} screenWidth={screenWidth} cardWidth={cardWidth} />
    </View>
  );

  const isLoading = (loadingInitial || loadingMissing) && favoritePokemons.length === 0;

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <FlatList
          data={[1, 2, 3, 4]}
          keyExtractor={(i) => i.toString()}
          numColumns={numColumns}
          renderItem={() => <SkeletonCard />}
          contentContainerStyle={{ paddingHorizontal: spacing.md, gap }}
          columnWrapperStyle={{ gap }}
        />
      </SafeAreaView>
    );
  }

  if (error && favoritePokemons.length === 0) {
    return <ErrorView message={error} onRetry={handleRefresh} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" backgroundColor={colors.primary} />
      <FlatList
        data={favoritePokemons}
        keyExtractor={(item) => item.url}
        numColumns={numColumns}
        columnWrapperStyle={{ gap }}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.xl + insets.bottom,
          gap,
        }}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
}