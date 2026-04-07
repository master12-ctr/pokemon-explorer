import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

interface Props {
  size?: number;
  fullScreen?: boolean;
}

export const PokeballLoader: React.FC<Props> = ({ size = 80, fullScreen = false }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 500, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const content = (
    <Animated.View style={{ transform: [{ rotate: spin }, { scale: scaleAnim }] }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#ef4444',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          borderWidth: size * 0.05,
          borderColor: '#1f2937',
        }}
      >
        <View style={{ width: '100%', height: '50%', backgroundColor: '#f3f4f6', position: 'absolute', top: 0 }} />
        <View style={{ width: '100%', height: size * 0.1, backgroundColor: '#1f2937', position: 'absolute', top: '50%', marginTop: -size * 0.05 }} />
        <View style={{ width: size * 0.3, height: size * 0.3, borderRadius: size * 0.15, backgroundColor: '#1f2937', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
          <View style={{ width: size * 0.15, height: size * 0.15, borderRadius: size * 0.075, backgroundColor: '#f3f4f6' }} />
        </View>
      </View>
    </Animated.View>
  );

  if (fullScreen) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF7ED' }}>{content}</View>;
  }
  return content;
};