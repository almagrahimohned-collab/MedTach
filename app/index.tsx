import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MedSim 🩺</Text>
      <Text style={styles.subtitle}>منصة محاكاة التشخيص الطبي الذكي</Text>
      
      <Pressable 
        style={styles.button} 
        onPress={() => router.push('/auth')}
      >
        <Text style={styles.buttonText}>الدخول للتطبيق</Text>
      </Pressable>
    </View>
  );
}

// تنسيقات مؤقتة لحين تفعيل NativeWind بالكامل
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#38BDF8',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
