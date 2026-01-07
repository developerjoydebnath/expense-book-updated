import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { useToast } from '../../components/shared/ToastProvider';
import { supabase } from '../../services/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const router = useRouter();
  const theme = useTheme();
  const { showToast } = useToast();

  async function signInWithEmail() {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      // Handle generic auth error
      showToast(error.message, 'error');
      setErrors({ email: ' ', password: error.message });
    } else {
      router.replace('/(tabs)');
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
          <Text variant="headlineLarge" style={styles.title}>Welcome Back</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Sign in to track your expenses</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              mode="outlined"
              error={!!errors.email}
              style={[styles.input, { backgroundColor: '#fff' }]}
              outlineColor={theme.colors.primary}
              activeOutlineColor={theme.colors.primary}
              textColor="#333"
            />
            {errors.email && (
              <HelperText type="error" visible={!!errors.email} style={styles.errorText}>
                {errors.email}
              </HelperText>
            )}
          </View>

          <View style={styles.inputGroup}>
            <TextInput
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              mode="outlined"
              secureTextEntry
              error={!!errors.password}
              style={[styles.input, { backgroundColor: '#fff' }]}
              outlineColor={theme.colors.primary}
              activeOutlineColor={theme.colors.primary}
              textColor="#333"
            />
            {errors.password && (
              <HelperText type="error" visible={!!errors.password} style={styles.errorText}>
                {errors.password}
              </HelperText>
            )}
          </View>

          <TouchableOpacity onPress={() => router.push('/auth/forgot-password')} style={styles.forgotPasswordContainer}>
            <Text style={[styles.forgotPassword, { color: theme.colors.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Button
            mode="contained"
            onPress={signInWithEmail}
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
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          <View style={styles.footer}>
            <Text variant="bodyMedium">Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
              <Text style={[styles.link, { color: theme.colors.primary }]}>Sign Up</Text>
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
  forgotPasswordContainer: {
    marginBottom: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    fontWeight: '600',
  },
  button: {
    borderRadius: 8,
    marginTop: 8,
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
