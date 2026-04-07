import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { VictoryArea, VictoryChart, VictoryPolarAxis, VictoryTheme } from 'victory-native';

const { width } = Dimensions.get('window');

interface StatData {
  name: string;
  value: number;
}

interface Props {
  pokemon1Stats: StatData[];
  pokemon2Stats: StatData[];
  pokemon1Name: string;
  pokemon2Name: string;
}

const MAX_STAT = 255;

// Format stat names for display
const formatStatName = (name: string): string => {
  const map: Record<string, string> = {
    hp: 'HP',
    attack: 'Atk',
    defense: 'Def',
    'special-attack': 'Sp.Atk',
    'special-defense': 'Sp.Def',
    speed: 'Speed',
  };
  return map[name] || name;
};

export const CompareRadar: React.FC<Props> = ({
  pokemon1Stats,
  pokemon2Stats,
  pokemon1Name,
  pokemon2Name,
}) => {
  // Use pokemon1's stats to define the label order (unique set)
  const labels = pokemon1Stats.map(s => formatStatName(s.name));

  // Create a map for quick lookup of values by stat name
  const statMap1 = new Map(pokemon1Stats.map(s => [s.name, s.value]));
  const statMap2 = new Map(pokemon2Stats.map(s => [s.name, s.value]));

  // Build normalized data arrays for both Pokémon in the same label order
  const data1 = pokemon1Stats.map(stat => ({
    label: formatStatName(stat.name),
    value: (statMap1.get(stat.name) || 0) / MAX_STAT,
  }));

  const data2 = pokemon1Stats.map(stat => ({
    label: formatStatName(stat.name),
    value: (statMap2.get(stat.name) || 0) / MAX_STAT,
  }));

  // Close polygons (repeat first point at end)
  const closed1 = [...data1, data1[0]];
  const closed2 = [...data2, data2[0]];

  return (
    <View style={{ alignItems: 'center', marginVertical: 20 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>VS Battle</Text>
      <VictoryChart
        polar
        theme={VictoryTheme.material}
        domain={{ y: [0, 1] }}
        width={width - 40}
        height={320}
      >
        <VictoryPolarAxis
          dependentAxis
          tickValues={[0.2, 0.4, 0.6, 0.8, 1]}
          tickFormat={(t) => `${Math.round(t * MAX_STAT)}`}
          style={{
            grid: { stroke: '#e5e7eb' },
            tickLabels: { fontSize: 9, fill: '#9ca3af' },
          }}
        />
        <VictoryPolarAxis
          tickValues={labels}
          style={{
            axis: { stroke: 'transparent' },
            tickLabels: { fontSize: 11, fill: '#374151', fontWeight: '500', padding: 8 },
          }}
        />
        <VictoryArea
          data={closed1}
          x="label"
          y="value"
          style={{ data: { fill: '#f97316', fillOpacity: 0.4, stroke: '#f97316', strokeWidth: 2 } }}
        />
        <VictoryArea
          data={closed2}
          x="label"
          y="value"
          style={{ data: { fill: '#3b82f6', fillOpacity: 0.4, stroke: '#3b82f6', strokeWidth: 2 } }}
        />
      </VictoryChart>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
          <View style={{ width: 16, height: 16, backgroundColor: '#f97316', borderRadius: 4, marginRight: 6 }} />
          <Text style={{ fontWeight: '500' }}>{pokemon1Name}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 16, height: 16, backgroundColor: '#3b82f6', borderRadius: 4, marginRight: 6 }} />
          <Text style={{ fontWeight: '500' }}>{pokemon2Name}</Text>
        </View>
      </View>
    </View>
  );
};