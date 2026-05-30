import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function AuthIndex() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // تجاوز مؤقت لتجربة الانتقال إلى صفحة التخصصات
    router.push('/specialties');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Welcome to MedSim</Text>
      <Text style={styles.headerSubtitle}>Sign in to continue</Text>

      <View style={styles.form}>
        <TextInput 
          style={styles.input} 
          placeholder="Email Address" 
          placeholderTextColor="#64748B"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          placeholderTextColor="#64748B"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Sign In</Text>
        </Pressable>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        <Pressable style={styles.googleButton}>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 24, justifyContent: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 8, textAlign: 'center' },
  headerSubtitle: { fontSize: 16, color: '#94A3B8', marginBottom: 40, textAlign: 'center' },
  form: { width: '100%' },
  input: { backgroundColor: '#1E293B', color: '#F8FAFC', padding: 16, borderRadius: 8, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: '#334155' },
  loginButton: { backgroundColor: '#38BDF8', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  loginButtonText: { color: '#0F172A', fontSize: 16, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  divider: { flex: 1, height: 1, backgroundColor: '#334155' },
  dividerText: { color: '#64748B', marginHorizontal: 16 },
  googleButton: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 8, alignItems: 'center' },
  googleButtonText: { color: '#0F172A', fontSize: 16, fontWeight: 'bold' },
});
