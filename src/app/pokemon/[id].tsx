import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Chip, FAB, IconButton, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { ErrorView } from '../../components/ErrorView';
import { PokeballLoader } from '../../components/PokeballLoader';
import { RadarChart } from '../../components/RadarChart';
import StatRings from '../../components/StatRings';
import { StickyTabBar } from '../../components/StickyTabBar';
import { colors, getTypeColor, spacing } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { usePokemonDetail } from '../../hooks/usePokemonDetail';
import { useSwipeNavigation } from '../../hooks/useSwipeNavigation';
import { usePokemonStore } from '../../store/pokemonStore';
import { getPokemonImageUrl } from '../../utils/imageResolver';

const FAB_SPACING = 64;
type StatsViewMode = 'radar' | 'rings';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pokemon, evolutions, flavorText, loading, error } = usePokemonDetail(id);
  const { addFavorite, removeFavorite, isFavorite, pokemons, getPokemonDetails } = usePokemonStore();
  const [activeTab, setActiveTab] = useState(0);
  const [statsViewMode, setStatsViewMode] = useState<StatsViewMode>('radar');
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const radarAnim = useRef(new Animated.Value(0)).current;

  // Dynamic ID resolver from loaded pokemons list
  const getPokemonIdFromName = useCallback((name: string): number => {
    const found = pokemons.find(p => p.name === name);
    if (found) {
      const parts = found.url.split('/').filter(Boolean);
      return parseInt(parts.pop() || '1', 10);
    }
    return 1;
  }, [pokemons]);

  // Prefetch evolution images
  useEffect(() => {
    if (evolutions.length) {
      evolutions.forEach(evo => {
        const evoId = getPokemonIdFromName(evo);
        const evoUrl = getPokemonImageUrl(evoId);
        Image.prefetch(evoUrl);
      });
    }
  }, [evolutions, getPokemonIdFromName]);

  useEffect(() => {
    Animated.timing(imageOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    if (activeTab === 1) {
      Animated.spring(radarAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      radarAnim.setValue(0);
    }
  }, [activeTab]);

  const allPokemonNames = usePokemonStore(useShallow(state => state.pokemons.map(p => p.name)));
  const { panGesture } = useSwipeNavigation(id, allPokemonNames);
  const setActiveTabMemo = useCallback((index: number) => setActiveTab(index), []);

  // Preload adjacent Pokémon details – with fallback for deep links
  const currentIndex = allPokemonNames.indexOf(id as string);
  const nextName = currentIndex !== -1 ? allPokemonNames[currentIndex + 1] : null;
  const prevName = currentIndex !== -1 ? allPokemonNames[currentIndex - 1] : null;

  useEffect(() => {
    if (nextName) getPokemonDetails(nextName);
    if (prevName) getPokemonDetails(prevName);
  }, [nextName, prevName, getPokemonDetails]);

  const animateHeart = () => {
    Animated.sequence([
      Animated.timing(heartScale, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(heartScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const toggleFavorite = useCallback(() => {
    if (!pokemon) return;
    animateHeart();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isFavorite(pokemon.name)) removeFavorite(pokemon.name);
    else addFavorite(pokemon.name);
  }, [pokemon, isFavorite, addFavorite, removeFavorite]);

  // Share with clipboard fallback for web
  const sharePokemon = useCallback(async () => {
    if (!pokemon) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const message = `Check out ${pokemon.name} #${pokemon.id} on Pokédex!`;
    
    if (Platform.OS === 'web') {
      await Clipboard.setStringAsync(message);
      Alert.alert('Copied!', 'Pokémon info copied to clipboard');
    } else {
      await Share.share({ message });
    }
  }, [pokemon]);

  if (loading) return <PokeballLoader fullScreen />;
  if (error || !pokemon) return <ErrorView message={error || 'No data'} onRetry={() => router.back()} />;

  const favorite = isFavorite(pokemon.name);
  const mainImageUrl = getPokemonImageUrl(pokemon.id);
  const mainType = pokemon.types[0].type.name;
  const headerColor = getTypeColor(mainType);
  const statsData = pokemon.stats.map(s => ({ name: s.stat.name, value: s.base_stat }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={panGesture}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <StatusBar style="light" backgroundColor="transparent" translucent />

          <Animated.ScrollView
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: insets.bottom + 80 }}
          >
            <View style={styles.heroCard}>
              <Animated.Image
                source={{ uri: mainImageUrl }}
                style={{ width: 160, height: 160, opacity: imageOpacity }}
                resizeMode="contain"
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm }}>
                <Text style={typography.title}>{pokemon.name}</Text>
                <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                  <IconButton
                    icon={favorite ? 'heart' : 'heart-outline'}
                    iconColor={favorite ? '#ef4444' : colors.text.secondary}
                    size={28}
                    onPress={toggleFavorite}
                  />
                </Animated.View>
              </View>
              <Text style={typography.caption}>#{pokemon.id}</Text>
              <View style={{ flexDirection: 'row', marginTop: spacing.sm }}>
                {pokemon.types.map((t) => (
                  <Chip
                    key={t.type.name}
                    style={{ backgroundColor: getTypeColor(t.type.name), marginRight: spacing.sm }}
                    textStyle={{ color: '#fff', fontWeight: 'bold' }}
                  >
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
              headerHeight={200}
             
              stickyOffset={insets.top + 80}
            />

            <View style={{ padding: spacing.lg }}>
              {activeTab === 0 && (
                <>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.lg }}>
                    <InfoCard label="Height" value={`${pokemon.height / 10} m`} />
                    <InfoCard label="Weight" value={`${pokemon.weight / 10} kg`} />
                    <InfoCard label="Base XP" value={`${pokemon.base_experience || '??'}`} />
                  </View>
                  <Text style={typography.body}>{flavorText}</Text>
                </>
              )}

              {activeTab === 1 && (
                <>
                  <SegmentedButtons
                    value={statsViewMode}
                    onValueChange={value => setStatsViewMode(value as StatsViewMode)}
                    buttons={[
                      { value: 'radar', label: 'Radar' },
                      { value: 'rings', label: 'Rings' },
                    ]}
                    style={{ marginBottom: spacing.md }}
                    theme={{
        colors: {
          primary: headerColor,          
      onSurface: '#888',             
      surface: 'transparent',      
      onSurfaceVariant: '#888',                   
        },
      }}
                  />

                  <Animated.View
                    style={{
                      opacity: radarAnim,
                      transform: [{ scale: radarAnim.interpolate({ inputRange: [0,1], outputRange: [0.9,1] }) }],
                    }}
                  >
                    {statsViewMode === 'radar' && <RadarChart stats={statsData} />}
                    {statsViewMode === 'rings' && <StatRings stats={statsData} maxStat={150} />}
                  </Animated.View>
                </>
              )}

              {activeTab === 2 && (
                <View>
                  {pokemon.abilities.map((a) => (
                    <View key={a.ability.name} style={styles.abilityCard}>
                      <Text style={typography.bodyBold}>{a.ability.name.replace('-', ' ')}</Text>
                      <Text style={typography.caption}>{a.is_hidden ? '(Hidden ability)' : 'Normal ability'}</Text>
                    </View>
                  ))}
                </View>
              )}

              {activeTab === 3 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {evolutions.map((evo) => {
                    const evoId = getPokemonIdFromName(evo);
                    const evoImageUrl = getPokemonImageUrl(evoId);
                    return (
                      <TouchableOpacity
                        key={evo}
                        onPress={() => router.push(`/pokemon/${evo}`)}
                        style={{ alignItems: 'center', marginRight: spacing.lg }}
                      >
                        <Image source={{ uri: evoImageUrl }} style={{ width: 80, height: 80 }} />
                        <Text style={typography.caption}>{evo}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
            </View>
          </Animated.ScrollView>

          <FAB
            icon={favorite ? 'heart' : 'heart-outline'}
            onPress={toggleFavorite}
            style={{ position: 'absolute', right: 16, bottom: 16 + insets.bottom, backgroundColor: favorite ? '#ef4444' : colors.card, zIndex: 1 }}
            color={favorite ? '#fff' : '#ef4444'}
          />
          <FAB
            icon="share-variant"
            onPress={sharePokemon}
            style={{ position: 'absolute', right: 16, bottom: 16 + insets.bottom + FAB_SPACING, backgroundColor: colors.card, zIndex: 1 }}
          />
        </SafeAreaView>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const InfoCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={{ alignItems: 'center', backgroundColor: colors.backgroundElement, padding: spacing.sm, borderRadius: 16, minWidth: 80 }}>
    <Text style={typography.caption}>{label}</Text>
    <Text style={typography.bodyBold}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  heroCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...colors.elevation.medium,
  },
  abilityCard: {
    backgroundColor: colors.backgroundElement,
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.sm,
  },
});