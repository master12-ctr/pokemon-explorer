import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';

interface Props {
  pokemon: { name: string; url: string };
  onPress: (name: string) => void;
}

export const PokemonCard: React.FC<Props> = ({ pokemon, onPress }) => {
  const id = pokemon.url.split('/').filter(Boolean).pop();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <TouchableOpacity onPress={() => onPress(pokemon.name)} activeOpacity={0.8}>
      <Card className="m-2 rounded-2xl bg-white shadow-lg overflow-hidden">
        <View className="items-center p-4">
          <Image source={{ uri: imageUrl }} style={{ width: 110, height: 110 }} />
          <Text className="text-lg font-bold capitalize mt-3 text-gray-800">
            {pokemon.name}
          </Text>
          <Text className="text-sm text-gray-500">#{id}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};