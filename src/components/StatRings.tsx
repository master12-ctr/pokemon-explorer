import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface Stat {
  name: string;
  value: number;
}

interface Props {
  stats: Stat[];
  maxStat?: number;
}

const StatRings: React.FC<Props> = ({ stats, maxStat = 150 }) => {
  const size = 70;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const getColor = (value: number) => {
    if (value < 50) return '#ef4444';
    if (value < 100) return '#f59e0b';
    return '#10b981';
  };

  const formatName = (name: string) => {
    const map: Record<string, string> = {
      hp: 'HP',
      attack: 'Atk',
      defense: 'Def',
      'special-attack': 'Sp.Atk',
      'special-defense': 'Sp.Def',
      speed: 'Speed',
    };
    return map[name] || name.toUpperCase();
  };

  return (
    <View style={styles.container}>
      {stats.map((stat) => {
        const percent = Math.min(stat.value / maxStat, 1);
        const strokeDashoffset = circumference * (1 - percent);
        const color = getColor(stat.value);

        return (
          <View key={stat.name} style={styles.ringContainer}>
            <Svg width={size} height={size}>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#e5e7eb"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(-90, ${size / 2}, ${size / 2})`}
              />
            </Svg>
            <Text style={styles.statName}>{formatName(stat.name)}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 20,
  },
  ringContainer: {
    alignItems: 'center',
    width: 80,
  },
  statName: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 6,
    color: '#4b5563',
  },
  statValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});

export default StatRings;