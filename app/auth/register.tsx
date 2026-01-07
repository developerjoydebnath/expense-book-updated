import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { useMutation } from 'urql';
import { useToast } from '../../components/shared/ToastProvider';
import { ADD_USER } from '../../services/queries';
import { supabase } from '../../services/supabase';

export default function RegisterScreen() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  const router = useRouter();
  const theme = useTheme();

  const [, addUserMutation] = useMutation(ADD_USER);

  async function signUpWithEmail() {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
    else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const { data: { user }, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      showToast(error.message, 'error');
      setErrors({ email: error.message });
    } else if (user) {
      // Sync with public.User table
      const result = await addUserMutation({
        object: {
          id: user.id,
          email: user.email,
        }
      });

      if (result.error) {
        // If it's a duplicate key error, we can ignore it as the user is already synced
        if (!result.error.message.includes('duplicate key')) {
          console.error('Error syncing user:', result.error.message);
        }
      }

      // Force sign out to prevent auto-login after registration
      await supabase.auth.signOut();

      showToast('Registration successful! Please sign in.', 'success');
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
        <View>
          <View style={styles.header}>
            <Text variant="headlineLarge" style={styles.title}>Create Account</Text>
            <Text variant="bodyMedium" style={styles.subtitle}>Start managing your expenses today</Text>
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

            <View style={styles.inputGroup}>
              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                }}
                mode="outlined"
                secureTextEntry
                error={!!errors.confirmPassword}
                style={[styles.input, { backgroundColor: '#fff' }]}
                outlineColor={theme.colors.primary}
                activeOutlineColor={theme.colors.primary}
                textColor="#333"
              />
              {errors.confirmPassword && (
                <HelperText type="error" visible={!!errors.confirmPassword} style={styles.errorText}>
                  {errors.confirmPassword}
                </HelperText>
              )}
            </View>

            <Button
              mode="contained"
              onPress={signUpWithEmail}
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
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </View>

          <View style={styles.footer}>
            <Text variant="bodyMedium">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={[styles.link, { color: theme.colors.primary }]}>Sign In</Text>
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
