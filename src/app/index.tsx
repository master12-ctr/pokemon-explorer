import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { ErrorView } from '../components/ErrorView';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PokemonCard } from '../components/PokemonCard';
import { SearchBar } from '../components/SearchBar';
import { usePokemonStore } from '../store/pokemonStore';

export default function HomeScreen() {
  const { pokemons, loading, error, fetchPokemons, loadMore } = usePokemonStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPokemons();
  }, []);

  const filteredPokemons = searchQuery
    ? pokemons.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : pokemons;

  const handlePress = (name: string) => {
    router.push(`/pokemon/${name}`);
  };

  const handleRefresh = useCallback(() => {
    fetchPokemons();
  }, []);

  if (loading && pokemons.length === 0) return <LoadingSpinner />;
  if (error && pokemons.length === 0) return <ErrorView message={error} onRetry={fetchPokemons} />;

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      <SearchBar onSearch={setSearchQuery} />
      <FlatList
        data={filteredPokemons}
        keyExtractor={(item) => item.name}
        numColumns={2}
        renderItem={({ item }) => <PokemonCard pokemon={item} onPress={handlePress} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh} />}
        onEndReached={() => loadMore()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && pokemons.length > 0 ? <LoadingSpinner /> : null}
      />
    </View>
  );
}