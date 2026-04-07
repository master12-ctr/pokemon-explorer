import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Image,
    Modal,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Chip, FAB, IconButton, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { CompareRadar } from '../../components/CompareRadar';
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
import { getPokemonIdByName, getPokemonImageUrl } from '../../utils/imageResolver';

const FAB_SPACING = 64;
type StatsViewMode = 'radar' | 'rings' | 'compare';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pokemon, evolutions, flavorText, loading, error } = usePokemonDetail(id);
  const { addFavorite, removeFavorite, isFavorite, pokemons, getPokemonDetails } = usePokemonStore();
  const [activeTab, setActiveTab] = useState(0);
  const [statsViewMode, setStatsViewMode] = useState<StatsViewMode>('radar');
  const [comparePokemon, setComparePokemon] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchCompare, setSearchCompare] = useState('');
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const radarAnim = useRef(new Animated.Value(0)).current;

  // Prefetch evolution images
  useEffect(() => {
    if (evolutions.length) {
      evolutions.forEach(evo => {
        const evoId = getPokemonIdByName(evo);
        const evoUrl = getPokemonImageUrl(evoId);
        Image.prefetch(evoUrl);
      });
    }
  }, [evolutions]);

  useEffect(() => {
    Animated.timing(imageOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  // Animate radar chart when Stats tab becomes active
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

  const sharePokemon = useCallback(async () => {
    if (pokemon) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await Share.share({ message: `Check out ${pokemon.name} #${pokemon.id} on Pokédex!` });
    }
  }, [pokemon]);

  const openCompareModal = () => setModalVisible(true);

  const selectComparePokemon = async (selectedName: string) => {
    if (selectedName === pokemon?.name) return;
    const details = await getPokemonDetails(selectedName);
    if (details) {
      setComparePokemon(details);
      setStatsViewMode('compare');
      setModalVisible(false);
      setSearchCompare('');
    }
  };

  const filteredPokemons = useMemo(() => {
    if (!searchCompare) return pokemons;
    return pokemons.filter(p => p.name.toLowerCase().includes(searchCompare.toLowerCase()));
  }, [pokemons, searchCompare]);

  if (loading) return <PokeballLoader fullScreen />;
  if (error || !pokemon) return <ErrorView message={error || 'No data'} onRetry={() => router.back()} />;

  const favorite = isFavorite(pokemon.name);
  const mainImageUrl = getPokemonImageUrl(pokemon.id);
  const mainType = pokemon.types[0].type.name;
  const headerColor = getTypeColor(mainType);
  const statsData = pokemon.stats.map(s => ({ name: s.stat.name, value: s.base_stat }));
  const compareStatsData = comparePokemon?.stats.map((s:any) => ({ name: s.stat.name, value: s.base_stat })) || [];

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
            {/* Hero card */}
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
              stickyOffset={0}
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
                  />
                  {!comparePokemon && statsViewMode === 'compare' && (
                    <TouchableOpacity onPress={openCompareModal} style={styles.compareButton}>
                      <Text style={{ color: colors.primary, fontWeight: '600' }}>+ Select Pokémon to compare</Text>
                    </TouchableOpacity>
                  )}

                  <Animated.View
                    style={{
                      opacity: radarAnim,
                      transform: [{ scale: radarAnim.interpolate({ inputRange: [0,1], outputRange: [0.9,1] }) }],
                    }}
                  >
                    {statsViewMode === 'radar' && <RadarChart stats={statsData} />}
                    {statsViewMode === 'rings' && <StatRings stats={statsData} maxStat={150} />}
                    {statsViewMode === 'compare' && comparePokemon && (
                      <CompareRadar
                        pokemon1Stats={statsData}
                        pokemon2Stats={compareStatsData}
                        pokemon1Name={pokemon.name}
                        pokemon2Name={comparePokemon.name}
                      />
                    )}
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
                    const evoId = getPokemonIdByName(evo);
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

          {/* FABs – now properly above content */}
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

      {/* Modal for compare selection (searchable) */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
            <IconButton icon="arrow-left" onPress={() => setModalVisible(false)} />
            <Text style={[typography.title, { flex: 1 }]}>Select Pokémon</Text>
          </View>
          <TextInput
            placeholder="Search Pokémon..."
            value={searchCompare}
            onChangeText={setSearchCompare}
            style={{
              margin: spacing.md,
              padding: spacing.md,
              borderRadius: 24,
              backgroundColor: colors.card,
              fontSize: 16,
            }}
          />
          <ScrollView>
            {filteredPokemons.map(p => (
              <TouchableOpacity
                key={p.name}
                onPress={() => selectComparePokemon(p.name)}
                style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', flexDirection: 'row', alignItems: 'center' }}
              >
                <Image
                  source={{ uri: getPokemonImageUrl(getPokemonIdByName(p.name)) }}
                  style={{ width: 50, height: 50, marginRight: spacing.md }}
                />
                <Text style={typography.body}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  compareButton: {
    backgroundColor: colors.backgroundElement,
    padding: spacing.md,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
});