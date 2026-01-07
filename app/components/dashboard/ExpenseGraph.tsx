import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
} from 'victory-native';

interface ExpenseGraphProps {
  data: { x: string; y: number }[];
}

export default function ExpenseGraph({ data }: ExpenseGraphProps) {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;
  // Sort data so the most recent day (today) appears first (left side)
const sortedData = React.useMemo(() => data.slice(0, 7), [data]);


  return (
    <View style={[styles.container, { backgroundColor: theme.colors.elevation.level2 }]}>
      <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
        Daily Expense Graph
      </Text>

      <View style={styles.chartContainer}>
        <VictoryChart
          width={screenWidth - 32}
          height={220}
          domainPadding={20}
          padding={{ top: 40, bottom: 40, left: 50, right: 30 }}
        >
          <VictoryAxis
            style={{
              tickLabels: { fontSize: 10, padding: 5, fill: theme.colors.onSurface },
              axis: { stroke: theme.colors.onSurface },
            }}
          />

          <VictoryAxis
            dependentAxis
            tickFormat={(y) => `৳${y}`}
            style={{
              tickLabels: { fontSize: 10, padding: 5, fill: theme.colors.onSurface },
              axis: { stroke: theme.colors.onSurface },
            }}
          />

          <VictoryBar
           data={sortedData.slice(0, 7)}
            labels={({ datum }) => datum.y > 0 ? `৳${datum.y}` : ''}
            labelComponent={<VictoryLabel dy={-10} dx={-2} />}
            style={{
              data: {
                fill: theme.colors.primary,
                width: 20,
              },
              labels: {
                fontSize: 10,
                fill: theme.colors.onSurface,
                angle: -45,
                verticalAnchor: 'middle',
                textAnchor: 'start',
              },
            }}
            cornerRadius={{ top: 4 }}
          />
        </VictoryChart>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chartContainer: {
    alignItems: 'center',
  },
});
