import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { supabase } from '../../services/supabase';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const router = useRouter();
  const theme = useTheme();

  async function resetPassword() {
    if (!email) {
      setErrorText('Email is required');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) setErrorText(error.message);
    else {
      alert('Password reset email sent!');
      router.replace('/auth/login');
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>Reset Password</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Enter your email to receive a reset link</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errorText) setErrorText(null);
              }}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!errorText}
              style={[styles.input, { backgroundColor: '#fff' }]}
              outlineColor={theme.colors.primary}
              activeOutlineColor={theme.colors.primary}
              textColor="#333"
            />
            {errorText && (
              <HelperText type="error" visible={!!errorText} style={styles.errorText}>
                {errorText}
              </HelperText>
            )}
          </View>

          <Button
            mode="contained"
            onPress={resetPassword}
            loading={loading}
            disabled={loading}
            style={[
              styles.button,
              { backgroundColor: '#7C4DFF' },
              loading && { backgroundColor: '#B388FF' }
            ]}
            labelStyle={{
              color: '#fff',
              fontWeight: 'bold'
            }}
            contentStyle={styles.buttonContent}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[styles.link, { color: theme.colors.primary }]}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    color: '#666',
  },
  form: {
    width: '100%',
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
  button: {
    borderRadius: 8,
    marginTop: 0,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  link: {
    fontWeight: 'bold',
  },
});
