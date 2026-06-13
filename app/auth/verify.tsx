import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { verifyOTP, resendVerification } from '../../src/services/authService';
import { useStore } from '../../src/store';

export default function VerifyScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const setUser = useStore((s) => s.setUser);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    inputRef.current?.focus();
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = async () => {
    if (!token || token.length < 6) {
      setError('Please enter the complete code');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { user } = await verifyOTP(email as string, token.trim());
      if (user) {
        setUser({ id: user.id, email: user.email || '', name: user.user_metadata?.name || 'Doctor' });
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid or expired code. Please try again.');
      setToken('');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    try {
      await resendVerification(email as string);
      setTimer(60);
      setToken('');
      setError('');
      Alert.alert('Code Sent', 'A new verification code has been sent to your email.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const maskedEmail = (email as string)?.replace(/(.{2}).*(@.*)/, '$1***$2');

  return (
    <View style={styles.container}>
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#94A3B8" />
      </Pressable>

      <View style={styles.content}>
        <Ionicons name="mail" size={64} color="#38BDF8" style={{ marginBottom: 24 }} />
        <Text style={styles.title}>Verify Email</Text>
        <Text style={styles.subtitle}>
          Enter the code sent to{'\n'}
          <Text style={styles.email}>{maskedEmail}</Text>
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          ref={inputRef}
          style={styles.codeInput}
          value={token}
          onChangeText={(text) => setToken(text.replace(/[^0-9]/g, ''))}
          placeholder="Enter verification code"
          placeholderTextColor="#64748B"
          keyboardType="number-pad"
          maxLength={8}
          autoFocus
          onSubmitEditing={handleVerify}
        />

        <Pressable
          style={[styles.verifyBtn, loading && styles.verifyBtnDisabled]}
          onPress={handleVerify}
          disabled={loading || token.length < 6}
        >
          {loading ? <ActivityIndicator color="#0F172A" /> : (
            <Text style={styles.verifyBtnText}>Verify & Continue</Text>
          )}
        </Pressable>

        <Pressable style={styles.resendBtn} onPress={handleResend} disabled={timer > 0}>
          <Text style={[styles.resendText, timer > 0 && styles.resendDisabled]}>
            {timer > 0 ? `Resend code in ${timer}s` : 'Resend Code'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  backBtn: { padding: 20, paddingTop: 30 },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 30, paddingTop: 40 },
  title: { color: '#F8FAFC', fontSize: 26, fontWeight: '800', marginBottom: 10 },
  subtitle: { color: '#94A3B8', fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 28 },
  email: { color: '#38BDF8', fontWeight: '600' },
  errorText: { color: '#EF4444', fontSize: 13, marginBottom: 16, textAlign: 'center' },
  codeInput: {
    width: '100%', backgroundColor: '#1E293B', borderRadius: 14,
    borderWidth: 2, borderColor: '#334155', color: '#F8FAFC',
    fontSize: 28, fontWeight: '700', textAlign: 'center',
    paddingVertical: 16, paddingHorizontal: 20, marginBottom: 24,
    letterSpacing: 8,
  },
  verifyBtn: {
    backgroundColor: '#38BDF8', paddingVertical: 16, paddingHorizontal: 48,
    borderRadius: 14, width: '100%', alignItems: 'center',
  },
  verifyBtnDisabled: { opacity: 0.6 },
  verifyBtnText: { color: '#0F172A', fontSize: 16, fontWeight: '700' },
  resendBtn: { marginTop: 24 },
  resendText: { color: '#38BDF8', fontSize: 14, fontWeight: '500' },
  resendDisabled: { color: '#64748B' },
});
