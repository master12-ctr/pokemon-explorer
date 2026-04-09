import React from 'react';
import { Animated, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { spacing } from '../constants/colors';

interface Props {
  tabs: string[];
  activeTab: number;
  setActiveTab: (index: number) => void;
  headerColor: string;
  scrollY: Animated.Value;
  headerHeight: number;
  stickyOffset?: number;
}

export const StickyTabBar: React.FC<Props> = ({
  tabs,
  activeTab,
  setActiveTab,
  headerColor,
  scrollY,
  headerHeight,
  stickyOffset = 0,
}) => {
  const { width } = useWindowDimensions();

  const translateY = scrollY.interpolate({
    inputRange: [0, headerHeight - 50, headerHeight],
    outputRange: [0, 0, 50],
    extrapolate: 'clamp',
  });

  const opacity = scrollY.interpolate({
    inputRange: [headerHeight - 80, headerHeight - 30],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <>
      {/* Regular tab bar (scrolls away) */}
      <View
        style={{
          flexDirection: 'row',
          marginTop: spacing.md,
          marginHorizontal: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
        }}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(index)}
            style={{ flex: 1, alignItems: 'center', paddingVertical: spacing.sm }}
          >
            <Text
              style={{
                fontWeight: activeTab === index ? 'bold' : 'normal',
                color: activeTab === index ? headerColor : '#888',
              }}
            >
              {tab}
            </Text>
            {activeTab === index && (
              <View
                style={{
                  height: 2,
                  backgroundColor: headerColor,
                  width: '50%',
                  marginTop: 4,
                }}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Sticky version (pinned to top) */}
      <Animated.View
        style={{
          position: 'absolute',
          top: stickyOffset,
          left: 0,
          width,
          backgroundColor: '#fff',
          zIndex: 20,
          opacity,
          transform: [{ translateY }],
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
          paddingHorizontal: spacing.md,
        }}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={`${tab}-pinned`}
            onPress={() => setActiveTab(index)}
            style={{ flex: 1, alignItems: 'center', paddingVertical: spacing.sm }}
          >
            <Text
              style={{
                fontWeight: activeTab === index ? 'bold' : 'normal',
                color: activeTab === index ? headerColor : '#888',
              }}
            >
              {tab}
            </Text>
            {activeTab === index && (
              <View
                style={{
                  height: 2,
                  backgroundColor: headerColor,
                  width: '50%',
                  marginTop: 4,
                }}
              />
            )}
          </TouchableOpacity>
        ))}
      </Animated.View>
    </>
  );
};