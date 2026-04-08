import React, { useMemo } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { VictoryArea, VictoryChart, VictoryPolarAxis, VictoryTheme } from 'victory-native';

const { width } = Dimensions.get('window');

interface StatData {
  name: string;
  value: number;
}

interface Props {
  stats: StatData[];
}

const MAX_STAT = 255;

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

export const RadarChart: React.FC<Props> = ({ stats }) => {
  const processedData = useMemo(() => {
    if (!stats || stats.length === 0) return { data: [], labels: [] };

    const normalized = stats.map(stat => ({
      label: formatStatName(stat.name),
      value: stat.value / MAX_STAT,
      rawValue: stat.value,
    }));

    const closed = [...normalized, normalized[0]];
    const labels = normalized.map(n => n.label);

    return { data: closed, labels };
  }, [stats]);

  if (!stats || stats.length === 0) {
    return (
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <Text style={{ color: '#9ca3af' }}>No stat data available</Text>
      </View>
    );
  }

  return (
    <View style={{ alignItems: 'center', marginVertical: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Base Stats Overview</Text>

      <VictoryChart
        polar
        theme={VictoryTheme.material}
        domain={{ y: [0, 1] }}
        width={width - 40}
        height={320}
      >
        {/* Dependent axis (rings) with numeric values */}
        <VictoryPolarAxis
          dependentAxis
          tickValues={[0.2, 0.4, 0.6, 0.8, 1]}
          tickFormat={(t) => `${Math.round(t * MAX_STAT)}`}
          style={{
            grid: { stroke: '#e5e7eb', strokeWidth: 0.8 },
            axis: { stroke: '#d1d5db' },
            tickLabels: { fontSize: 10, fill: '#6b7280' },
          }}
        />

        {/* Category axis (stat names) – now VISIBLE */}
        <VictoryPolarAxis
          tickValues={processedData.labels}
          style={{
            axis: { stroke: '#d1d5db' },
            tickLabels: { fontSize: 11, fill: '#374151', fontWeight: '500', padding: 6 },
          }}
        />

        <VictoryArea
          data={processedData.data}
          x="label"
          y="value"
          style={{
            data: {
              fill: '#f97316',
              fillOpacity: 0.35,
              stroke: '#f97316',
              strokeWidth: 2.5,
            },
          }}
        />
      </VictoryChart>

      {/* Extra legend (optional, keeps the numbers visible) */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 }}>
        {stats.map(stat => (
          <View key={stat.name} style={{ marginHorizontal: 8, marginVertical: 4, alignItems: 'center' }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#4b5563' }}>{formatStatName(stat.name)}</Text>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#f97316' }}>{stat.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};