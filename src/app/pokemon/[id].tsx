import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { Chip, IconButton } from 'react-native-paper';
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
    <ScrollView className="flex-1 bg-gray-100 dark:bg-gray-900">
      <View className="items-center pt-6 pb-4 bg-red-500 rounded-b-3xl">
        <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200 }} />
        <Text className="text-3xl font-bold text-white capitalize mt-2">{pokemon.name}</Text>
        <Text className="text-white text-lg">#{pokemon.id}</Text>
        <IconButton
          icon={favorite ? 'heart' : 'heart-outline'}
          iconColor="white"
          size={32}
          onPress={toggleFavorite}
        />
      </View>

      <View className="p-4">
        <View className="flex-row justify-around mb-6">
          <View className="items-center">
            <Text className="text-gray-500">Height</Text>
            <Text className="text-lg font-bold">{pokemon.height / 10} m</Text>
          </View>
          <View className="items-center">
            <Text className="text-gray-500">Weight</Text>
            <Text className="text-lg font-bold">{pokemon.weight / 10} kg</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-xl font-bold mb-2">Types</Text>
          <View className="flex-row flex-wrap">
            {pokemon.types.map((t) => (
              <Chip key={t.type.name} className="mr-2 mb-2 bg-blue-100">
                {t.type.name}
              </Chip>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-xl font-bold mb-2">Stats</Text>
          {pokemon.stats.map((stat) => (
            <View key={stat.stat.name} className="mb-2">
              <Text className="capitalize text-gray-700">{stat.stat.name}</Text>
              <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <View
                  style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                  className="h-full bg-green-500"
                />
              </View>
              <Text className="text-right text-sm">{stat.base_stat}</Text>
            </View>
          ))}
        </View>

        <View>
          <Text className="text-xl font-bold mb-2">Abilities</Text>
          {pokemon.abilities.map((a) => (
            <Text key={a.ability.name} className="text-gray-700 capitalize">
              • {a.ability.name}
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}