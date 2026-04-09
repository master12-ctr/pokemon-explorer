import * as Haptics from 'expo-haptics';
import React, { memo, useEffect, useRef } from 'react';
import { Animated, Image, Platform, Pressable, Text, TouchableNativeFeedback, View } from 'react-native';
import { Card } from 'react-native-paper';
import { colors, spacing } from '../constants/colors';
import { typography } from '../constants/typography';
import { PokemonListItem } from '../types/pokemon';

interface Props {
  pokemon: PokemonListItem;
  onPress: (name: string) => void;
  screenWidth: number;
  cardWidth?: number; 
}

const Wrapper = Platform.OS === 'android' ? TouchableNativeFeedback : Pressable;

const FALLBACK_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABESURBVHgB7c6xDYAwDAXR60dgBToaoAQGwPxQASV7CToaoIQM8SXrSZZlWZZlWZZlWZZlWZZlWZZlWZZlWZZlWZZl/S8xAwAA//8DAIprB+I3p8rPAAAAAElFTkSuQmCC';

export const PokemonCard: React.FC<Props> = memo(({ pokemon, onPress, screenWidth, cardWidth }) => {
  const id = pokemon.url.split('/').filter(Boolean).pop();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  
  const imageSize = cardWidth 
    ? Math.min(cardWidth * 0.5, 120) 
    : Math.min(screenWidth * 0.15, 100);
  
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
          <View style={{ alignItems: 'center', padding: spacing.sm }}>
            <View style={{ backgroundColor: '#fef3c7', borderRadius: 100, padding: spacing.xs }}>
              <Animated.Image
                source={{ uri: imageUrl }}
                defaultSource={{ uri: FALLBACK_IMAGE }}
                onError={(e) => console.warn(`Image failed: ${imageUrl}`, e.nativeEvent.error)}
                style={{ width: imageSize, height: imageSize, opacity: imageFadeAnim }}
                resizeMode="contain"
              />
            </View>
            <Text style={typography.cardTitle}>{pokemon.name}</Text>
            <Text style={typography.caption}>#{id}</Text>
          </View>
        </Card>
      </Animated.View>
    </Wrapper>
  );
});