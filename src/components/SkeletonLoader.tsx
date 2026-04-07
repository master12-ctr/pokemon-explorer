import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, DimensionValue, View } from 'react-native';
import { spacing } from '../constants/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SkeletonProps {
  height?: number;
  width?: DimensionValue;
  borderRadius?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ height = 100, width = '100%', borderRadius = 12 }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View style={{ height, width, backgroundColor: '#e0e0e0', borderRadius, overflow: 'hidden' }}>
      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f5f5f5',
          transform: [{ translateX }],
        }}
      />
    </View>
  );
};

export const SkeletonCard: React.FC = () => (
  <View style={{ flex: 1, margin: spacing.sm }}>
    <SkeletonLoader height={180} borderRadius={20} />
  </View>
);

export const SkeletonDetail: React.FC = () => (
  <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <SkeletonLoader height={280} />
    <View style={{ margin: spacing.md, marginTop: -40, padding: spacing.lg, backgroundColor: '#fff', borderRadius: 24 }}>
      <SkeletonLoader height={100} />
    </View>
  </View>
);