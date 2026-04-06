import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ErrorView } from '../components/ErrorView';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PokemonCard } from '../components/PokemonCard';
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/pokemon/${name}`);
  };

  const handleSearch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // search is already reactive via onChange, but we keep for GO button
  };

  const handleRefresh = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fetchPokemons();
  }, []);

  if (loading && pokemons.length === 0) return <LoadingSpinner />;
  if (error && pokemons.length === 0) return <ErrorView message={error} onRetry={fetchPokemons} />;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar style="light" />

      {/* Header with blue gradient */}
      <LinearGradient
        colors={['#1e3a8a', '#3b82f6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-b-3xl px-5 pt-6 pb-8"
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-3xl font-bold text-white">Pokédex</Text>
          <View className="w-8 h-8 bg-white/30 rounded-full justify-center items-center">
            <Text className="text-white text-lg">⚡</Text>
          </View>
        </View>
        <Text className="text-white text-lg mt-2">Who are you looking for?</Text>

        {/* Search bar with GO button */}
        <View className="flex-row items-center mt-4 space-x-2">
          <View className="flex-1 bg-white rounded-full px-4 py-2 flex-row items-center">
            <TextInput
              placeholder="Eg. Pikachu"
              placeholderTextColor="#9ca3af"
              className="flex-1 text-gray-800"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity
            onPress={handleSearch}
            className="bg-blue-800 rounded-full px-5 py-2"
          >
            <Text className="text-white font-semibold">GO</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Pokémon Grid */}
      <FlatList
        data={filteredPokemons}
        keyExtractor={(item) => item.name}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 24 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => <PokemonCard pokemon={item} onPress={handlePress} />}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={loading && pokemons.length > 0 ? <LoadingSpinner /> : null}
        ListEmptyComponent={
          !loading && filteredPokemons.length === 0 ? (
            <View className="flex-1 justify-center items-center mt-20">
              <Text className="text-gray-500 text-lg">No Pokémon found</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}