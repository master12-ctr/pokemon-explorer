import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';
import { PokemonListItem } from '../types/pokemon';

interface Props {
  pokemon: PokemonListItem;
  onPress: (name: string) => void;
}

export const PokemonCard: React.FC<Props> = ({ pokemon, onPress }) => {
  const id = pokemon.url.split('/').filter(Boolean).pop();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <TouchableOpacity onPress={() => onPress(pokemon.name)} activeOpacity={0.7}>
      <Card className="m-2 rounded-xl bg-white dark:bg-gray-800 shadow-md">
        <View className="items-center p-4">
          <Image
            source={{ uri: imageUrl }}
            style={{ width: 120, height: 120 }}
            className="mb-2"
          />
          <Text className="text-lg font-bold capitalize text-gray-800 dark:text-white">
            {pokemon.name}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">#{id}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};