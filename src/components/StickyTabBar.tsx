import React from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { spacing } from '../constants/spacing';

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
  // Pins the tab bar when scrolled past the header
  const isPinned = scrollY.interpolate({
    inputRange: [headerHeight - 50, headerHeight],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <>
      {/* Regular (scrolls away) */}
      <View style={{ marginTop: spacing.md, marginHorizontal: spacing.md, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
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
            {activeTab === index && <View style={{ height: 2, backgroundColor: headerColor, width: '50%', marginTop: 4 }} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Sticky pinned version (appears when scrolled) */}
      <Animated.View
        style={{
          position: 'absolute',
          top: stickyOffset,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          zIndex: 20,
          opacity: isPinned,
          transform: [{ translateY: 0 }],
          marginHorizontal: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
          flexDirection: 'row',
        }}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab + 'pinned'}
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
            {activeTab === index && <View style={{ height: 2, backgroundColor: headerColor, width: '50%', marginTop: 4 }} />}
          </TouchableOpacity>
        ))}
      </Animated.View>
    </>
  );
};