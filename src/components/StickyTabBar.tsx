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
}

export const StickyTabBar: React.FC<Props> = ({ 
  tabs, activeTab, setActiveTab, headerColor, scrollY, headerHeight 
}) => {
  const translateY = scrollY.interpolate({
    inputRange: [headerHeight - 50, headerHeight],
    outputRange: [100, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={{ transform: [{ translateY }], backgroundColor: '#fff', zIndex: 20 }}>
      <View style={{ flexDirection: 'row', marginTop: spacing.md, marginHorizontal: spacing.md, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
        {tabs.map((tab, index) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(index)} style={{ flex: 1, alignItems: 'center', paddingVertical: spacing.sm }}>
            <Text style={{ fontWeight: activeTab === index ? 'bold' : 'normal', color: activeTab === index ? headerColor : '#888' }}>{tab}</Text>
            {activeTab === index && <View style={{ height: 2, backgroundColor: headerColor, width: '50%', marginTop: 4 }} />}
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};