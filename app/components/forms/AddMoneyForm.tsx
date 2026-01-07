import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import DateField from './DateField';

interface AddMoneyFormProps {
  onSubmit: (data: { source: string; amount: number; date: string }) => void;
  onCancel: () => void;
  initialValues?: { source?: string; amount?: number; date?: string };
}

export default function AddMoneyForm({ onSubmit, onCancel, initialValues }: AddMoneyFormProps) {
  const theme = useTheme();
  const [source, setSource] = useState(initialValues?.source || '');
  const [amount, setAmount] = useState(initialValues?.amount?.toString() || '');
  const [date, setDate] = useState(initialValues?.date ? new Date(initialValues.date) : new Date());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ source?: string; amount?: string }>({});

  const handlePress = async () => {
    const newErrors: { source?: string; amount?: string } = {};
    if (!source) newErrors.source = 'Source is required';
    if (!amount) newErrors.amount = 'Amount is required';
    else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) newErrors.amount = 'Enter a valid amount';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        source,
        amount: parseFloat(amount),
        date: date.toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: theme.colors.elevation.level3 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
          {initialValues ? 'Edit Income' : 'Add Money'}
        </Text>

        <View style={styles.inputGroup}>
          <TextInput
            label="Source (e.g. Salary)"
            value={source}
            onChangeText={(text) => {
              setSource(text);
              if (errors.source) setErrors({ ...errors, source: undefined });
            }}
            mode="outlined"
            error={!!errors.source}
            style={[styles.input, { backgroundColor: theme.colors.elevation.level3 }]}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
            textColor={theme.colors.onSurface}
            theme={{ colors: { onSurfaceVariant: theme.colors.onSurfaceVariant } }}
          />
          {errors.source && (
            <HelperText type="error" visible={!!errors.source} style={styles.errorText}>
              {errors.source}
            </HelperText>
          )}
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            label="Amount"
            value={amount}
            onChangeText={(text) => {
              setAmount(text);
              if (errors.amount) setErrors({ ...errors, amount: undefined });
            }}
            mode="outlined"
            keyboardType="numeric"
            error={!!errors.amount}
            style={[styles.input, { backgroundColor: theme.colors.elevation.level3 }]}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
            textColor={theme.colors.onSurface}
            theme={{ colors: { onSurfaceVariant: theme.colors.onSurfaceVariant } }}
            returnKeyType="done"
            onSubmitEditing={handlePress}
            blurOnSubmit={true}
          />
          {errors.amount && (
            <HelperText type="error" visible={!!errors.amount} style={styles.errorText}>
              {errors.amount}
            </HelperText>
          )}
        </View>

          <View style={styles.inputGroup}>
            <DateField value={date} onChange={setDate} label="Date" />
          </View>
          
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => !loading && onCancel()}
            style={[styles.button, { borderColor: theme.colors.outline }]}
            labelStyle={{ color: theme.colors.onSurface }}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handlePress}
            loading={loading}
            disabled={loading}
            style={[
              styles.button,
              { backgroundColor: theme.colors.primary },
              loading && { backgroundColor: theme.colors.surfaceDisabled }
            ]}
            labelStyle={{
              color: theme.colors.onPrimary,
              fontWeight: 'bold'
            }}
          >
            {loading ? (initialValues ? 'Updating...' : 'Adding...') : (initialValues ? 'Update' : 'Add')}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
  },
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    marginBottom: 0,
  },
  inputGroup: {
    marginBottom: 12,
  },
  errorText: {
    padding: 0,
    margin: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
  },
  button: {
    flex: 0.45,
  },
});
