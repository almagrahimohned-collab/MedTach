import { StyleSheet, Text, View, TextInput, Pressable, Animated, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthIndex() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      alert('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      alert('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const userData = {
      name: name || 'Dr. User',
      email,
      isLoggedIn: true,
      lastLogin: new Date().toISOString(),
    };

    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1000);
  };

  const handleGoogleAuth = () => {
    const userData = {
      name: 'Dr. Google User',
      email: 'google@medtach.com',
      isLoggedIn: true,
      lastLogin: new Date().toISOString(),
    };
    AsyncStorage.setItem('userData', JSON.stringify(userData));
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🩺</Text>
            </View>
            <Text style={styles.appName}>MedTach</Text>
            <Text style={styles.appDesc}>Clinical Diagnostic Platform</Text>
          </View>

          <View style={styles.tabSwitch}>
            <Pressable
              style={[styles.tab, isLogin && styles.tabActive]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Sign In</Text>
            </Pressable>
            <Pressable
              style={[styles.tab, !isLogin && styles.tabActive]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Sign Up</Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Ionicons name="person-outline" size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#64748B"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Ionicons name="mail-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#64748B"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="lock-closed-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#64748B"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#64748B"
                />
              </Pressable>
            </View>

            {!isLogin && (
              <View style={styles.inputGroup}>
                <Ionicons name="lock-closed-outline" size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#64748B"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
            )}

            {isLogin && (
              <Pressable style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </Pressable>
            )}

            <Pressable
              style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.submitBtnText}>
                {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#0F172A" />
            </Pressable>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <Pressable style={styles.googleBtn} onPress={handleGoogleAuth}>
              <Ionicons name="logo-google" size={20} color="#0F172A" />
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </Pressable>
          </View>

          <Text style={styles.terms}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  content: { padding: 24 },

  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  logoEmoji: { fontSize: 36 },
  appName: { color: '#F8FAFC', fontSize: 30, fontWeight: '800', marginBottom: 4 },
  appDesc: { color: '#94A3B8', fontSize: 14 },

  tabSwitch: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 4,
    marginBottom: 28,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  tabActive: { backgroundColor: '#38BDF8' },
  tabText: { color: '#94A3B8', fontSize: 14, fontWeight: '600' },
  tabTextActive: { color: '#0F172A' },

  form: { gap: 14 },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#F8FAFC', fontSize: 15, paddingVertical: 16 },
  eyeBtn: { padding: 4 },

  forgotBtn: { alignSelf: 'flex-end', marginTop: 2 },
  forgotText: { color: '#38BDF8', fontSize: 13, fontWeight: '500' },

  submitBtn: {
    backgroundColor: '#38BDF8',
    padding: 18,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#0F172A', fontSize: 16, fontWeight: '700' },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  divider: { flex: 1, height: 1, backgroundColor: '#334155' },
  dividerText: { color: '#64748B', marginHorizontal: 16, fontSize: 13 },

  googleBtn: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  googleBtnText: { color: '#0F172A', fontSize: 15, fontWeight: '600' },

  terms: { color: '#64748B', fontSize: 11, textAlign: 'center', marginTop: 24, lineHeight: 16 },
});
