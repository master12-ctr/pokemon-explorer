import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, RefreshControl, Text, useWindowDimensions, View } from 'react-native';
import { FAB, Searchbar } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorView } from '../components/ErrorView';
import { LottieLoading } from '../components/LottieLoading';
import { PokemonCard } from '../components/PokemonCard';
import { SkeletonCard } from '../components/SkeletonLoader';
import { getLayout, spacing } from '../constants/spacing';
import { usePokemonStore } from '../store/pokemonStore';

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const { listHeaderHeight, numColumns, gap, screenWidth } = getLayout(width, height);
  const { pokemons, loading, error, fetchPokemons, loadMore } = usePokemonStore();
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();
  const isLoadingMore = useRef(false);

  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  const filteredPokemons = useMemo(() => {
    if (!searchQuery) return pokemons;
    return pokemons.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [pokemons, searchQuery]);

  const handlePress = useCallback((name: string) => router.push(`/pokemon/${name}`), [router]);
  const handleRefresh = useCallback(() => fetchPokemons(), [fetchPokemons]);
  const handleLoadMore = useCallback(() => {
    if (isLoadingMore.current || loading) return;
    isLoadingMore.current = true;
    loadMore().finally(() => (isLoadingMore.current = false));
  }, [loading, loadMore]);

  const randomPokemon = useCallback(() => {
    if (pokemons.length) {
      const random = pokemons[Math.floor(Math.random() * pokemons.length)];
      router.push(`/pokemon/${random.name}`);
    }
  }, [pokemons, router]);

  if (loading && pokemons.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF7ED' }}>
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          keyExtractor={(i) => i.toString()}
          numColumns={numColumns}
          renderItem={() => <SkeletonCard />}
          contentContainerStyle={{ paddingHorizontal: spacing.md, gap }}
          columnWrapperStyle={{ gap }}
        />
      </SafeAreaView>
    );
  }
  if (error && pokemons.length === 0) return <ErrorView message={error} onRetry={fetchPokemons} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF7ED' }}>
      <StatusBar style="light" backgroundColor="#f97316" />
      <View style={{ backgroundColor: '#f97316', height: listHeaderHeight, justifyContent: 'center', paddingHorizontal: spacing.lg, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Pokédex</Text>
        <Text style={{ color: '#fde68a', marginTop: 2, fontSize: 12 }}>Find your favorite Pokémon</Text>
      </View>
      <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.md, marginBottom: spacing.sm }}>
        <Searchbar
          placeholder="Search Pokémon"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ borderRadius: 24, backgroundColor: '#fff', ...shadowStyle }}
          iconColor="#f97316"
        />
      </View>
      <FlatList
        data={filteredPokemons}
        keyExtractor={(item) => item.name}
        numColumns={numColumns}
        renderItem={({ item }) => <PokemonCard pokemon={item} onPress={handlePress} screenWidth={screenWidth} />}
        columnWrapperStyle={{ gap }}
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl + insets.bottom, gap }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && pokemons.length > 0 ? <LottieLoading /> : null}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
      />
      <FAB
        icon="dice-multiple"
        style={{ position: 'absolute', right: 16, bottom: 16 + insets.bottom, backgroundColor: '#f97316' }}
        color="white"
        onPress={randomPokemon}
      />
    </SafeAreaView>
  );
}

const shadowStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
};