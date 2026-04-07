import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Share, Text, TouchableOpacity, View } from 'react-native';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Chip, FAB } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { LottieLoading } from '../../components/LottieLoading';
import { RadarChart } from '../../components/RadarChart';
import { StickyTabBar } from '../../components/StickyTabBar';
import { colors, getTypeColor, spacing } from '../../constants/colors';
import { usePokemonDetail } from '../../hooks/usePokemonDetail';
import { useSwipeNavigation } from '../../hooks/useSwipeNavigation';
import { usePokemonStore } from '../../store/pokemonStore';
import { getPokemonImageUrl } from '../../utils/imageResolver';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 280;
const HEADER_MIN_HEIGHT = 100;

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pokemon, evolutions, flavorText, loading, error } = usePokemonDetail(id);
  const { addFavorite, removeFavorite, isFavorite } = usePokemonStore();
  const [activeTab, setActiveTab] = useState(0);
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  // ✅ Fix infinite loop: useShallow to avoid new array reference on every render
  const allPokemonNames = usePokemonStore(
    useShallow(state => state.pokemons.map(p => p.name))
  );
  const { panGesture } = useSwipeNavigation(id, allPokemonNames);

  // ✅ Memoize tab setter to avoid recreation
  const setActiveTabMemo = useCallback((index: number) => setActiveTab(index), []);

  const toggleFavorite = useCallback(() => {
    if (!pokemon) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isFavorite(pokemon.name)) removeFavorite(pokemon.name);
    else addFavorite(pokemon.name);
  }, [pokemon, isFavorite, addFavorite, removeFavorite]);

  const sharePokemon = useCallback(async () => {
    if (pokemon) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await Share.share({ message: `Check out ${pokemon.name} #${pokemon.id} on Pokédex!` });
    }
  }, [pokemon]);

  if (loading) return <LottieLoading />;
  if (error || !pokemon) return <ErrorView message={error || 'No data'} onRetry={() => router.back()} />;

  const favorite = isFavorite(pokemon.name);
  const imageUrl = getPokemonImageUrl(pokemon.name);
  const mainType = pokemon.types[0].type.name;
  const headerColor = getTypeColor(mainType);
  const statsData = pokemon.stats.map(s => ({ name: s.stat.name, value: s.base_stat }));

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const titleOpacity = scrollY.interpolate({
    inputRange: [HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - 50, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={panGesture}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <StatusBar style="light" backgroundColor="transparent" translucent />
          <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: headerHeight, zIndex: 10, overflow: 'hidden' }}>
            <LinearGradient colors={[headerColor, headerColor + 'CC']} style={{ flex: 1 }}>
              <Animated.Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%', opacity: imageOpacity, resizeMode: 'cover', transform: [{ scale: 1.2 }] }} blurRadius={10} />
              <BlurView intensity={40} tint="dark" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            </LinearGradient>
            <Animated.View style={{ position: 'absolute', bottom: 10, left: 20, right: 20, opacity: titleOpacity }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>{pokemon.name}</Text>
              <Text style={{ color: '#fff' }}>#{pokemon.id}</Text>
            </Animated.View>
          </Animated.View>

          <Animated.ScrollView
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT, paddingBottom: insets.bottom + 80 }}
          >
            <View style={{ backgroundColor: '#fff', marginHorizontal: spacing.md, borderRadius: 24, marginTop: -40, padding: spacing.lg, ...colors.elevation.medium }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ fontSize: 28, fontWeight: 'bold', textTransform: 'capitalize' }}>{pokemon.name}</Text>
                  <Text style={{ color: colors.text.secondary }}>#{pokemon.id}</Text>
                </View>
                <Image source={{ uri: imageUrl }} style={{ width: 100, height: 100 }} />
              </View>
              <View style={{ flexDirection: 'row', marginTop: spacing.md }}>
                {pokemon.types.map((t) => (
                  <Chip key={t.type.name} style={{ backgroundColor: getTypeColor(t.type.name), marginRight: spacing.sm }} textStyle={{ color: '#fff', fontWeight: 'bold' }}>
                    {t.type.name.toUpperCase()}
                  </Chip>
                ))}
              </View>
            </View>

            <StickyTabBar
              tabs={['Overview', 'Stats', 'Abilities', 'Evolution']}
              activeTab={activeTab}
              setActiveTab={setActiveTabMemo}
              headerColor={headerColor}
              scrollY={scrollY}
              headerHeight={HEADER_MAX_HEIGHT}
            />

            <View style={{ padding: spacing.lg }}>
              {activeTab === 0 && (
                <>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.lg }}>
                    <InfoCard label="Height" value={`${pokemon.height / 10} m`} />
                    <InfoCard label="Weight" value={`${pokemon.weight / 10} kg`} />
                    <InfoCard label="Base XP" value={`${pokemon.base_experience || '??'}`} />
                  </View>
                  <Text style={{ fontSize: 16, color: colors.text.primary, lineHeight: 24 }}>{flavorText}</Text>
                </>
              )}
              {activeTab === 1 && <RadarChart stats={statsData} />}
              {activeTab === 2 && (
                <View>
                  {pokemon.abilities.map((a) => (
                    <View key={a.ability.name} style={{ backgroundColor: '#f9fafb', padding: spacing.md, borderRadius: 16, marginBottom: spacing.sm }}>
                      <Text style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{a.ability.name.replace('-', ' ')}</Text>
                      <Text style={{ color: colors.text.secondary }}>{a.is_hidden ? '(Hidden ability)' : 'Normal ability'}</Text>
                    </View>
                  ))}
                </View>
              )}
              {activeTab === 3 && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: spacing.md }}>
                  {evolutions.map((evo, idx) => (
                    <React.Fragment key={evo}>
                      <TouchableOpacity onPress={() => router.push(`/pokemon/${evo}`)} style={{ alignItems: 'center', flex: 1 }}>
                        <Image source={{ uri: getPokemonImageUrl(evo) }} style={{ width: 80, height: 80 }} />
                        <Text style={{ textTransform: 'capitalize', marginTop: spacing.sm }}>{evo}</Text>
                      </TouchableOpacity>
                      {idx < evolutions.length - 1 && <Text style={{ fontSize: 24, fontWeight: 'bold' }}>→</Text>}
                    </React.Fragment>
                  ))}
                </View>
              )}
            </View>
          </Animated.ScrollView>

          <FAB icon={favorite ? 'heart' : 'heart-outline'} onPress={toggleFavorite} style={{ position: 'absolute', right: 16, bottom: 16 + insets.bottom, backgroundColor: favorite ? '#ef4444' : '#fff' }} color={favorite ? '#fff' : '#ef4444'} />
          <FAB icon="share-variant" onPress={sharePokemon} style={{ position: 'absolute', right: 16, bottom: 80 + insets.bottom, backgroundColor: '#fff' }} />
        </SafeAreaView>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const InfoCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={{ alignItems: 'center', backgroundColor: '#f9fafb', padding: spacing.sm, borderRadius: 16, minWidth: 80 }}>
    <Text style={{ fontSize: 12, color: colors.text.secondary }}>{label}</Text>
    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{value}</Text>
  </View>
);

const ErrorView: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg }}>
    <Text style={{ color: 'red', marginBottom: spacing.md }}>{message}</Text>
    <TouchableOpacity onPress={onRetry} style={{ backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 8 }}>
      <Text style={{ color: '#fff' }}>Retry</Text>
    </TouchableOpacity>
  </View>
);