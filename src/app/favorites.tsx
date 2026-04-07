import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    useWindowDimensions,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorView } from '../components/ErrorView';
import { PokemonCard } from '../components/PokemonCard';
import { colors, spacing } from '../constants/colors';
import { getLayout } from '../constants/spacing';
import { typography } from '../constants/typography';
import { usePokemonStore } from '../store/pokemonStore';

export default function FavoritesScreen() {
  const { favorites, fetchPokemons, pokemons, loading, error } = usePokemonStore();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();
  const { numColumns, gap, screenWidth } = getLayout(width, 0); // height not needed

  // Filter only favorited Pokémon from the loaded list
  const favoritePokemons = pokemons.filter(p => favorites.includes(p.name));

  // If no pokemons loaded yet, fetch them (needed to show details)
  useEffect(() => {
    if (pokemons.length === 0 && !loading) {
      fetchPokemons();
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPokemons();
    setRefreshing(false);
  }, [fetchPokemons]);

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

  if (loading && pokemons.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error && pokemons.length === 0) {
    return <ErrorView message={error} onRetry={fetchPokemons} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" backgroundColor={colors.primary} />

      {/* Simple header */}
      {/* <View
        style={{
          backgroundColor: colors.primary,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={[typography.titleWhite, { fontSize: 20 }]}>Favorites</Text>
      </View> */}

      <FlatList
        data={favoritePokemons}
        keyExtractor={(item) => item.name}
        numColumns={numColumns}
        columnWrapperStyle={{ gap }}
        renderItem={({ item }) => (
          <View style={{ flex: 1, margin: spacing.sm / 2 }}>
            <PokemonCard
              pokemon={item}
              onPress={handlePress}
              screenWidth={screenWidth}
            />
          </View>
        )}
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