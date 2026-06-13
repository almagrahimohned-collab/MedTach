import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, Pressable,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { signIn, signUp, signInWithGoogle, resendConfirmation } from '../../src/services/authService';
import { useStore } from '../../src/store';

export default function AuthScreen() {
  const router = useRouter();
  const setUser = useStore((s) => s.setUser);
  const user = useStore((s) => s.user);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) router.replace('/(tabs)');
  }, [user]);

  const handleSubmit = async () => {
    setError('');
    setMessage('');
    if (!email.trim()) { setError('Please enter your email'); return; }
    setLoading(true);
    try {
      if (isLogin) {
        if (!password) { setError('Please enter your password'); setLoading(false); return; }
        const { user: authUser } = await signIn(email.trim(), password);
        if (authUser) {
          setUser({ id: authUser.id, email: authUser.email || '', name: authUser.user_metadata?.name || 'Doctor' });
          router.replace('/(tabs)');
        }
      } else {
        if (!name.trim()) { setError('Please enter your name'); setLoading(false); return; }
        if (!password || password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
        await signUp(email.trim(), password, name.trim());
        setMessage('✅ Account created! Check your email to confirm, then sign in.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err: any) {
      if (err.message?.includes('verify your email')) {
        Alert.alert('Email Not Verified', 'Check your inbox and click the confirmation link.', [
          { text: 'Resend', onPress: async () => { try { await resendConfirmation(email.trim()); Alert.alert('Sent!'); } catch { Alert.alert('Error'); } } },
          { text: 'OK', style: 'cancel' },
        ]);
      } else {
        setError(err.message || 'An error occurred');
      }
    } finally { setLoading(false); }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const { url } = await signInWithGoogle();
      if (url) {
        // المتصفح فتح، لا تفعل شيء - onAuthStateChange سيتولى الباقي
      }
    } catch (err: any) {
      setError(err.message || 'Google sign in failed');
    } finally { setGoogleLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🩺</Text>
          </View>
          <Text style={styles.appName}>MedTach</Text>
          <Text style={styles.appDesc}>Clinical Diagnostic Platform</Text>
        </View>

        <View style={styles.tabSwitch}>
          <Pressable style={[styles.tab, isLogin && styles.tabActive]} onPress={() => { setIsLogin(true); setError(''); setMessage(''); }}>
            <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Sign In</Text>
          </Pressable>
          <Pressable style={[styles.tab, !isLogin && styles.tabActive]} onPress={() => { setIsLogin(false); setError(''); setMessage(''); }}>
            <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Sign Up</Text>
          </Pressable>
        </View>

        {message ? <Text style={styles.messageText}>{message}</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {!isLogin && (
          <View style={styles.inputGroup}>
            <Ionicons name="person-outline" size={20} color="#64748B" />
            <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#64748B"
              value={name} onChangeText={setName} autoCapitalize="words" />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Ionicons name="mail-outline" size={20} color="#64748B" />
          <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#64748B"
            value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        </View>

        <View style={styles.inputGroup}>
          <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#64748B"
            value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#64748B" />
          </Pressable>
        </View>

        <Pressable style={[styles.submitBtn, loading && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#0F172A" /> : (
            <Text style={styles.submitBtnText}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
          )}
        </Pressable>

        {isLogin && (
          <>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable style={[styles.googleBtn, googleLoading && styles.submitBtnDisabled]} onPress={handleGoogleSignIn} disabled={googleLoading}>
              {googleLoading ? <ActivityIndicator color="#0F172A" /> : (
                <>
                  <Ionicons name="logo-google" size={20} color="#0F172A" />
                  <Text style={styles.googleBtnText}>Continue with Google</Text>
                </>
              )}
            </Pressable>
          </>
        )}

        <Pressable style={styles.switchBtn} onPress={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }}>
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Text style={styles.switchLink}>{isLogin ? 'Sign Up' : 'Sign In'}</Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 2, borderColor: '#38BDF8' },
  logoEmoji: { fontSize: 36 },
  appName: { color: '#F8FAFC', fontSize: 30, fontWeight: '800', marginBottom: 4 },
  appDesc: { color: '#94A3B8', fontSize: 14 },
  tabSwitch: { flexDirection: 'row', backgroundColor: '#1E293B', borderRadius: 14, padding: 4, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  tabActive: { backgroundColor: '#38BDF8' },
  tabText: { color: '#94A3B8', fontSize: 14, fontWeight: '600' },
  tabTextActive: { color: '#0F172A' },
  messageText: { color: '#10B981', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  errorText: { color: '#EF4444', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 14, borderWidth: 1, borderColor: '#334155', paddingHorizontal: 14, marginBottom: 14, gap: 10 },
  input: { flex: 1, color: '#F8FAFC', fontSize: 15, paddingVertical: 16 },
  submitBtn: { backgroundColor: '#38BDF8', padding: 18, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#0F172A', fontSize: 16, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#334155' },
  dividerText: { color: '#64748B', fontSize: 13, fontWeight: '500' },
  googleBtn: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  googleBtnText: { color: '#0F172A', fontSize: 15, fontWeight: '600' },
  switchBtn: { alignItems: 'center', marginTop: 24 },
  switchText: { color: '#94A3B8', fontSize: 13 },
  switchLink: { color: '#38BDF8', fontWeight: '600' },
});
