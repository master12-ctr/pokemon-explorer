import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { FAB, IconButton, Searchbar } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorView } from '../components/ErrorView';
import { PokeballLoader } from '../components/PokeballLoader';
import { PokemonCard } from '../components/PokemonCard';
import { SkeletonCard } from '../components/SkeletonLoader';
import { colors, spacing } from '../constants/colors';
import { getLayout } from '../constants/spacing';
import { typography } from '../constants/typography';
import { usePokemonStore } from '../store/pokemonStore';

const CARD_HEIGHT = 220; // approximate height per row

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const { numColumns, gap, screenWidth } = getLayout(width, height);
  const { pokemons, loadingInitial, loadingMore, error, fetchPokemons, loadMore, hasMore } = usePokemonStore();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Only fetch if list is empty
  useEffect(() => {
    if (pokemons.length === 0 && !loadingInitial) {
      fetchPokemons(false);
    }
  }, [pokemons.length, loadingInitial, fetchPokemons]);

  // Prefetch first 20 images
  useEffect(() => {
    if (Platform.OS !== 'web' && pokemons.length) {
      pokemons.slice(0, 20).forEach(p => {
        const id = p.url.split('/').filter(Boolean).pop();
        const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
        Image.prefetch(imgUrl).catch(() => {});
      });
    }
  }, [pokemons]);

  const filteredPokemons = useMemo(() => {
    if (!searchQuery) return pokemons;
    return pokemons.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [pokemons, searchQuery]);

  const handlePress = useCallback((name: string) => {
    Haptics.selectionAsync();
    router.push(`/pokemon/${name}`);
  }, []);

  const handleRefresh = useCallback(() => fetchPokemons(true), [fetchPokemons]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loadingInitial) {
      loadMore();
    }
  }, [loadingMore, hasMore, loadingInitial, loadMore]);

  const scrollToTop = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const renderEmptyList = () => (
    <View style={{ alignItems: 'center', marginTop: 40 }}>
      <Text style={typography.body}>No Pokémon found 🧐</Text>
      <Text style={typography.caption}>Try a different name</Text>
    </View>
  );

  // 
const getItemLayout = useCallback(
  (_: any, index: number) => {
    const row = Math.floor(index / numColumns);
    // Use a generous fixed height that accommodates most cards
    const estimatedRowHeight = 230;
    return {
      length: estimatedRowHeight,
      offset: estimatedRowHeight * row,
      index,
    };
  },
  [numColumns]
);

  // Header animations (unchanged)
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [130, 80],
    extrapolate: 'clamp',
  });
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 60, 120],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0.96],
    extrapolate: 'clamp',
  });
  const showScrollToTop = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  if (loadingInitial && pokemons.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          keyExtractor={i => i.toString()}
          numColumns={numColumns}
          renderItem={() => <SkeletonCard />}
          contentContainerStyle={{ paddingHorizontal: spacing.md, gap }}
          columnWrapperStyle={{ gap }}
        />
      </SafeAreaView>
    );
  }
  if (error && pokemons.length === 0) return <ErrorView message={error} onRetry={() => fetchPokemons(true)} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" backgroundColor={colors.primary} />
      <Animated.View
        style={{
          backgroundColor: colors.primary,
          paddingHorizontal: spacing.md,
          paddingTop: spacing.sm,
          paddingBottom: spacing.sm,
          height: headerHeight,
          justifyContent: 'flex-end',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          elevation: 6,
          zIndex: 10,
          opacity: headerOpacity,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
          <Animated.Text style={[typography.titleWhite, { fontSize: 22, opacity: titleOpacity, letterSpacing: 0.5 }]}>
            Pokédex
          </Animated.Text>
          <IconButton icon="heart" iconColor="#fff" size={24} onPress={() => router.push('/favorites')} style={{ margin: 0 }} />
        </View>
        <View style={{ paddingBottom: spacing.sm }}>
          <Searchbar
            placeholder="Search Pokémon"
            onChangeText={setSearchInput}
            value={searchInput}
            style={{ borderRadius: 28, backgroundColor: colors.card, elevation: 2, height: 48 }}
            inputStyle={{ fontSize: 14 }}
            iconColor={colors.primary}
          />
        </View>
      </Animated.View>

      <FlatList
        ref={flatListRef}
        data={filteredPokemons}
        keyExtractor={item => item.url} // ✅ more stable than name
        numColumns={numColumns}
        renderItem={({ item }) => <PokemonCard pokemon={item} onPress={handlePress} screenWidth={screenWidth} />}
        columnWrapperStyle={{ gap }}
        contentContainerStyle={{ paddingTop: spacing.sm, paddingHorizontal: spacing.md, paddingBottom: spacing.xl + insets.bottom, gap }}
        ListEmptyComponent={renderEmptyList}
        ListFooterComponent={() => {
          if (loadingMore) {
            return (
              <View style={{ alignItems: 'center', marginTop: spacing.lg }}>
                <PokeballLoader size={40} />
              </View>
            );
          }
          if (!hasMore && pokemons.length > 0) {
            return (
              <View style={{ alignItems: 'center', marginTop: spacing.xl }}>
                <Text style={typography.caption}>You've caught them all!</Text>
              </View>
            );
          }
          return null;
        }}
        refreshControl={<RefreshControl refreshing={loadingInitial} onRefresh={handleRefresh} colors={[colors.primary]} tintColor={colors.primary} />}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews={Platform.OS === 'android'}
        getItemLayout={getItemLayout}
      />

      <Animated.View
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16 + insets.bottom,
          opacity: showScrollToTop,
          transform: [{ scale: showScrollToTop.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
        }}
      >
        <FAB icon="arrow-up" onPress={scrollToTop} style={{ backgroundColor: colors.card, elevation: 4 }} color={colors.primary} size="small" />
      </Animated.View>
    </SafeAreaView>
  );
}