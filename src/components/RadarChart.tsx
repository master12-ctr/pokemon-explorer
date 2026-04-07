import React from 'react';
import { Dimensions, View } from 'react-native';
import {
    VictoryArea,
    VictoryChart,
    VictoryPolarAxis,
    VictoryTheme,
} from 'victory-native';

const { width } = Dimensions.get('window');

interface StatData {
  name: string;
  value: number;
}

interface Props {
  stats: StatData[];
}

export const RadarChart: React.FC<Props> = ({ stats }) => {
  const data = stats.map(s => ({ stat: s.name, value: s.value / 255 }));
  const maxValue = 1;

  // Capitalize stat names for display
  const tickValues = stats.map(s => s.name.charAt(0).toUpperCase() + s.name.slice(1));

  return (
    <View style={{ alignItems: 'center', marginVertical: 20 }}>
      <VictoryChart
        polar
        theme={VictoryTheme.material}
        domain={{ y: [0, maxValue] }}
        width={width - 40}
        height={280}
      >
        <VictoryPolarAxis
          dependentAxis
          tickValues={[0.2, 0.4, 0.6, 0.8, 1]}
          labelPlacement="vertical"
        />
        <VictoryPolarAxis
          tickValues={tickValues}
          style={{
            axisLabel: { padding: 10 },
            tickLabels: { fontSize: 10, fill: '#6b7280' },
          }}
        />
        <VictoryArea
          data={data}
          x="stat"
          y="value"
          style={{
            data: { fill: '#f97316', fillOpacity: 0.6, stroke: '#f97316', strokeWidth: 2 },
          }}
        />
      </VictoryChart>
    </View>
  );
};