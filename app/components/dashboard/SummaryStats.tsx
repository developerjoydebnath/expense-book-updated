import { Plus } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, IconButton, Text, useTheme } from 'react-native-paper';

interface SummaryStatsProps {
  todayExpense: number;
  availableMoney: number;
  thisMonthExpense: number;
  onAddMoney: () => void;
  onAddExpense: () => void;
}

export default function SummaryStats({ todayExpense, availableMoney, thisMonthExpense, onAddMoney, onAddExpense }: SummaryStatsProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {/* Main Card: Available Money */}
      <Card style={[styles.mainCard, { backgroundColor: theme.colors.primaryContainer }]}>  
        <Card.Content>
          <View style={styles.mainRow}>
            <View>
              <Text variant="labelLarge" style={{ color: theme.colors.onPrimaryContainer }}>Available Money</Text>
              <Text variant="headlineLarge" style={[styles.amount, { color: theme.colors.onPrimaryContainer }]}>
                ৳ {availableMoney.toLocaleString()}
              </Text>
            </View>
            <IconButton
              icon={() => <Plus size={32} color={theme.colors.onPrimary} />}
              onPress={onAddMoney}
              mode="contained"
              containerColor={theme.colors.primary}
              style={styles.mainAddButton}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Sub Cards: Expenses */}
      <View style={styles.subRow}>
        <Card style={[styles.subCard, { backgroundColor: theme.colors.errorContainer, flex: 1 }]}>
          <Card.Content style={{ paddingBottom: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text variant="labelSmall" numberOfLines={1} style={{ color: theme.colors.onErrorContainer }}>Today&apos;s Expense</Text>
                <Text variant="titleLarge" style={[styles.amount, { color: theme.colors.onErrorContainer }]}>
                  ৳ {todayExpense.toLocaleString()}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.subCard, { backgroundColor: theme.colors.tertiaryContainer, flex: 1 }]}>
          <Card.Content>
            <Text variant="labelSmall" numberOfLines={1} style={{ color: theme.colors.onTertiaryContainer }}>Monthly Expense</Text>
            <Text variant="titleLarge" style={[styles.amount, { color: theme.colors.onTertiaryContainer }]}>
              ৳ {thisMonthExpense.toLocaleString()}
            </Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  mainCard: {
    borderRadius: 20,
    elevation: 2,
  },
  subRow: {
    flexDirection: 'row',
    gap: 12,
  },
  subCard: {
    borderRadius: 16,
    elevation: 2,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amount: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  mainAddButton: {
    margin: 0,
    borderRadius: 12,
  },
});
