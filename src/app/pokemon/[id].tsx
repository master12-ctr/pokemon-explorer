import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { Chip, IconButton, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ErrorView } from '../../components/ErrorView';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { usePokemonStore } from '../../store/pokemonStore';
import { Pokemon } from '../../types/pokemon';


export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPokemonDetails, addFavorite, removeFavorite, isFavorite } = usePokemonStore();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getPokemonDetails(id);
        if (data) setPokemon(data);
        else setError('Pokémon not found');
      } catch (err) {
        setError('Failed to load details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const toggleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!pokemon) return;
    if (isFavorite(pokemon.name)) {
      removeFavorite(pokemon.name);
    } else {
      addFavorite(pokemon.name);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error || !pokemon) return <ErrorView message={error || 'No data'} onRetry={() => router.back()} />;

  const favorite = isFavorite(pokemon.name);
  const imageUrl = pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero section */}
        <View className="items-center pt-6 pb-6 bg-blue-50 rounded-b-3xl">
          <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200 }} resizeMode="contain" />
          <Text className="text-3xl font-bold text-gray-800 capitalize mt-2">{pokemon.name}</Text>
          <Text className="text-gray-500 text-lg">#{pokemon.id}</Text>
        </View>

        {/* Floating favorite button */}
        <IconButton
          icon={favorite ? 'heart' : 'heart-outline'}
          iconColor={favorite ? '#ef4444' : '#9ca3af'}
          size={30}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'white',
            borderRadius: 30,
            elevation: 2,
          }}
          onPress={toggleFavorite}
        />

        {/* Back button */}
        <IconButton
          icon="arrow-left"
          size={26}
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            backgroundColor: 'white',
            borderRadius: 26,
            elevation: 2,
          }}
          onPress={() => router.back()}
        />

        {/* Details sections */}
        <View className="p-5">
          {/* Height & Weight row */}
          <View className="flex-row justify-around mb-6 bg-white p-4 rounded-2xl shadow-sm">
            <View className="items-center">
              <Text className="text-gray-500 text-sm">Height</Text>
              <Text className="text-xl font-bold">{pokemon.height / 10} m</Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-500 text-sm">Weight</Text>
              <Text className="text-xl font-bold">{pokemon.weight / 10} kg</Text>
            </View>
          </View>

          {/* Types section */}
          <View className="bg-white p-4 rounded-2xl shadow-sm mb-4">
            <Text className="text-xl font-bold mb-3">Types</Text>
            <View className="flex-row flex-wrap">
              {pokemon.types.map((t) => (
                <Chip key={t.type.name} className="mr-2 mb-2 bg-blue-100">
                  {t.type.name.toUpperCase()}
                </Chip>
              ))}
            </View>
          </View>

          {/* Stats section with progress bars */}
          <View className="bg-white p-4 rounded-2xl shadow-sm mb-4">
            <Text className="text-xl font-bold mb-3">Base Stats</Text>
            {pokemon.stats.map((stat) => (
              <View key={stat.stat.name} className="mb-3">
                <View className="flex-row justify-between mb-1">
                  <Text className="capitalize text-gray-700">{stat.stat.name}</Text>
                  <Text className="font-semibold">{stat.base_stat}</Text>
                </View>
                <ProgressBar
                  progress={stat.base_stat / 255}
                  color="#2563eb"
                  style={{ height: 6, borderRadius: 6 }}
                />
              </View>
            ))}
          </View>

          {/* Abilities section */}
          <View className="bg-white p-4 rounded-2xl shadow-sm">
            <Text className="text-xl font-bold mb-3">Abilities</Text>
            {pokemon.abilities.map((a) => (
              <Text key={a.ability.name} className="text-gray-700 capitalize text-base mb-1">
                • {a.ability.name.replace('-', ' ')}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}