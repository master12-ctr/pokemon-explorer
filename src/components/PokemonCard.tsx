import React, { memo, useRef } from 'react';
import { Animated, Image, Pressable, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import { shadowStyle, spacing } from '../constants/spacing';
import { PokemonListItem } from '../types/pokemon';

interface Props {
  pokemon: PokemonListItem;
  onPress: (name: string) => void;
  screenWidth: number;
}

export const PokemonCard: React.FC<Props> = memo(({ pokemon, onPress, screenWidth }) => {
  const id = pokemon.url.split('/').filter(Boolean).pop();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  const cardImageSize = Math.min(screenWidth * 0.15, 100);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 6,
      tension: 200,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 200,
    }).start();
  };

  return (
    <Pressable
      onPress={() => onPress(pokemon.name)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ flex: 1 }}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Card style={[{ borderRadius: 20, backgroundColor: '#fff' }, shadowStyle]}>
          <View style={{ alignItems: 'center', padding: spacing.sm }}>
            <View style={{ backgroundColor: '#fef3c7', borderRadius: 100, padding: spacing.xs }}>
              <Image source={{ uri: imageUrl }} style={{ width: cardImageSize, height: cardImageSize }} resizeMode="contain" />
            </View>
            <Text style={{ fontSize: 14, fontWeight: '600', marginTop: spacing.sm, textTransform: 'capitalize' }}>
              {pokemon.name}
            </Text>
            <Text style={{ color: '#9ca3af', marginTop: spacing.xs, fontSize: 12 }}>#{id}</Text>
          </View>
        </Card>
      </Animated.View>
    </Pressable>
  );
});