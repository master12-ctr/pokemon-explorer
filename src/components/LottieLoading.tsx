import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

export const LottieLoading: React.FC = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Continuous rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Gentle pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF7ED' }}>
      <Animated.View
        style={{
          transform: [{ rotate: spin }, { scale: scaleAnim }],
        }}
      >
        {/* Pokéball – pure RN, no assets */}
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#ef4444',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            borderWidth: 4,
            borderColor: '#1f2937',
          }}
        >
          <View
            style={{
              width: '100%',
              height: '50%',
              backgroundColor: '#f3f4f6',
              position: 'absolute',
              top: 0,
            }}
          />
          <View
            style={{
              width: '100%',
              height: 8,
              backgroundColor: '#1f2937',
              position: 'absolute',
              top: '50%',
              marginTop: -4,
            }}
          />
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: '#1f2937',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 2,
            }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: '#f3f4f6',
              }}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};