import * as Haptics from 'expo-haptics';
import React, { memo, useEffect, useRef } from 'react';
import { Animated, Image, Platform, Pressable, Text, TouchableNativeFeedback, View } from 'react-native';
import { Card } from 'react-native-paper';
import { colors } from '../constants/colors';
import { PokemonListItem } from '../types/pokemon';

interface Props {
  pokemon: PokemonListItem;
  onPress: (name: string) => void;
  screenWidth: number;
}

const Wrapper = Platform.OS === 'android' ? TouchableNativeFeedback : Pressable;

// Base64 fallback image
const FALLBACK_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABESURBVHgB7c6xDYAwDAXR60dgBToaoAQGwPxQASV7CToaoIQM8SXrSZZlWZZlWZZlWZZlWZZlWZZlWZZlWZZlWZZl/S8xAwAA//8DAIprB+I3p8rPAAAAAElFTkSuQmCC';

export const PokemonCard: React.FC<Props> = memo(({ pokemon, onPress, screenWidth }) => {
  const id = pokemon.url.split('/').filter(Boolean).pop();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  const cardImageSize = Math.min(screenWidth * 0.15, 100);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const imageFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Image.prefetch(imageUrl).catch(() => {});
  }, [imageUrl]);

  useEffect(() => {
    Animated.timing(imageFadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, friction: 6, tension: 200 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 6, tension: 200 }).start();
  };
  const handlePress = () => {
    Haptics.selectionAsync();
    onPress(pokemon.name);
  };

  return (
    <Wrapper
      onPress={handlePress}
      background={Platform.OS === 'android' ? TouchableNativeFeedback.Ripple('#f0f0f0', false) : undefined}
      onPressIn={Platform.OS === 'ios' ? handlePressIn : undefined}
      onPressOut={Platform.OS === 'ios' ? handlePressOut : undefined}
      style={{ flex: 1 }}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Card style={[{ borderRadius: 20, backgroundColor: colors.card }, colors.elevation.low]}>
          {/* ✅ NativeWind classes used below */}
          <View className="items-center p-2">
            <View className="bg-amber-50 rounded-full p-1">
              <Animated.Image
                source={{ uri: imageUrl }}
                defaultSource={{ uri: FALLBACK_IMAGE }}
                onError={(e) => console.warn(`Image failed: ${imageUrl}`, e.nativeEvent.error)}
                style={{ width: cardImageSize, height: cardImageSize, opacity: imageFadeAnim }}
                resizeMode="contain"
              />
            </View>
            <Text className="font-semibold text-base capitalize mt-1 text-gray-900">{pokemon.name}</Text>
            <Text className="text-xs text-gray-500">#{id}</Text>
          </View>
        </Card>
      </Animated.View>
    </Wrapper>
  );
});