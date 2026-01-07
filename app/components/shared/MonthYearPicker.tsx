import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Modal, Portal, Text, useTheme } from 'react-native-paper';

interface MonthYearPickerProps {
  visible: boolean;
  onDismiss: () => void;
  onSelect: (date: Date) => void;
  value?: Date;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function MonthYearPicker({ visible, onDismiss, onSelect, value }: MonthYearPickerProps) {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => currentYear - i);

  const initialDate = value || new Date();
  const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());

  const handleConfirm = () => {
    const newDate = new Date(selectedYear, selectedMonth, 1);
    onSelect(newDate);
    onDismiss();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.transparentModal}>
        <View style={styles.container}>
          <Text variant="titleLarge" style={styles.title}>Select Month & Year</Text>
          
          <View style={styles.content}>
            {/* Month Column */}
            <View style={styles.column}>
              <Text variant="labelMedium" style={styles.columnLabel}>Month</Text>
              <FlatList
                data={MONTHS}
                keyExtractor={(item) => item}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => setSelectedMonth(index)}
                    style={[
                      styles.item,
                      selectedMonth === index && { backgroundColor: theme.colors.primaryContainer }
                    ]}
                  >
                    <Text 
                      style={[
                        styles.itemText,
                        selectedMonth === index && { color: theme.colors.primary, fontWeight: 'bold' }
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
                style={styles.list}
              />
            </View>

            {/* Year Column */}
            <View style={styles.column}>
              <Text variant="labelMedium" style={styles.columnLabel}>Year</Text>
              <FlatList
                data={years}
                keyExtractor={(item) => item.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setSelectedYear(item)}
                    style={[
                      styles.item,
                      selectedYear === item && { backgroundColor: theme.colors.primaryContainer }
                    ]}
                  >
                    <Text 
                      style={[
                        styles.itemText,
                        selectedYear === item && { color: theme.colors.primary, fontWeight: 'bold' }
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
                style={styles.list}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Button onPress={onDismiss} textColor="#666">Cancel</Button>
            <Button mode="contained" onPress={handleConfirm}>Select</Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  transparentModal: {
    margin: 20,
    backgroundColor: 'transparent',
    elevation: 0,
    shadowColor: 'transparent',
  },
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
  },
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a1a1a',
  },
  content: {
    flexDirection: 'row',
    height: 300,
    gap: 12,
  },
  column: {
    flex: 1,
  },
  columnLabel: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#666',
    textTransform: 'uppercase',
  },
  list: {
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 8,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 14,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 8,
  },
});
