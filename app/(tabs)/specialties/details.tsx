import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useStore } from '../../../src/store';

const specialtyData: any = {
  internal: ['Cardiology', 'Respiratory', 'Gastroenterology', 'Endocrinology'],
  pediatrics: ['Neonatology', 'Genetics', 'Infectious Diseases'],
  surgery: ['General Surgery', 'Orthopedics', 'Neurosurgery'],
  gynecology: ['Obstetrics', 'Reproductive Endocrinology'],
};

export default function SpecialtyDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const setSessionConfig = useStore((state) => state.setSessionConfig);

  const [sub, setSub] = useState(specialtyData[id as string]?.[0] || '');
  const [level, setLevel] = useState('Beginner');

  const handleStartSession = () => {
    setSessionConfig(id as string, sub, level);
    router.push('/cases');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Select Sub-Category</Text>
      {specialtyData[id as string]?.map((item: string) => (
        <Pressable key={item} style={[styles.card, sub === item && styles.selected]} onPress={() => setSub(item)}>
          <Text style={styles.cardText}>{item}</Text>
        </Pressable>
      ))}

      <Text style={styles.label}>Select Difficulty</Text>
      {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
        <Pressable key={l} style={[styles.card, level === l && styles.selected]} onPress={() => setLevel(l)}>
          <Text style={styles.cardText}>{l}</Text>
        </Pressable>
      ))}

      <Pressable style={styles.nextButton} onPress={handleStartSession}>
        <Text style={styles.nextButtonText}>Start Diagnostic Session</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 16 },
  label: { fontSize: 18, color: '#94A3B8', marginVertical: 15 },
  card: { backgroundColor: '#1E293B', padding: 16, borderRadius: 8, marginBottom: 10 },
  selected: { borderColor: '#38BDF8', borderWidth: 2 },
  cardText: { color: '#F8FAFC' },
  nextButton: { backgroundColor: '#38BDF8', padding: 20, borderRadius: 12, alignItems: 'center', marginTop: 30 },
  nextButtonText: { color: '#0F172A', fontWeight: 'bold' },
});
