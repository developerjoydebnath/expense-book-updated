import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import {
    VictoryAxis,
    VictoryBar,
    VictoryChart,
    VictoryLabel,
} from 'victory-native';

interface MonthlyExpenseGraphProps {
  expenses: { date: string; amount: number }[];
}

function getLast12Months() {
  const now = new Date();
  const months: { key: string; label: string }[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    const label = `${d.toLocaleString('default', { month: 'short' })}-${d.getFullYear().toString().slice(-2)}`;
    months.push({ key, label });
  }
  return months;
}

function getMonthlyGraphData(expenses: { date: string; amount: number }[]) {
  const months = getLast12Months();
  const map: Record<string, number> = {};
  expenses.forEach(e => {
    if (!e.date) return;
    const d = new Date(e.date);
    const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    map[key] = (map[key] || 0) + e.amount;
  });
  return months.map(m => ({ x: m.label, y: map[m.key] || 0 }));
}

const MonthlyExpenseGraph: React.FC<MonthlyExpenseGraphProps> = ({ expenses }) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const data = React.useMemo(() => getMonthlyGraphData(expenses), [expenses]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.elevation.level2 }]}> 
      <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>Monthly Expense Graph</Text>
      <View style={styles.chartContainer}>
        <VictoryChart
          width={screenWidth - 32}
          height={220}
          domainPadding={20}
          padding={{ top: 40, bottom: 40, left: 50, right: 30 }}
        >
          <VictoryAxis
            style={{
              tickLabels: {
                fontSize: 10,
                padding: 5,
                fill: theme.colors.onSurface,
                angle: -45,
                textAnchor: 'end',
                verticalAnchor: 'middle',
              },
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
            data={data}
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
};

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

export default MonthlyExpenseGraph;
