import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useStore } from '../../../src/store';
import { calculateCaseScore } from '../../../src/utils/scoring';
import { medicalCases } from '../../../src/data/cases';

type TestType = 'cbc' | 'xray';

export default function DiagnosticSuite() {
  const { specialty } = useLocalSearchParams();
  const { addPoints } = useStore();

  const caseData = useMemo(() => {
    return (medicalCases as any)?.[specialty as string]?.[0] ?? null;
  }, [specialty]);

  const [orderedTests, setOrderedTests] = useState<TestType[]>([]);
  const [results, setResults] = useState<string>('No investigations ordered yet.');
  const [startTime] = useState(new Date());

  if (!caseData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No case found for this specialty.</Text>
      </View>
    );
  }

  const handleOrderTest = (type: TestType) => {
    if (orderedTests.includes(type)) return;

    setOrderedTests((prev) => [...prev, type]);

    const newResult =
      type === 'cbc'
        ? caseData.labResults
        : caseData.xRayResults;

    setResults(newResult);
  };

  const handleSubmit = () => {
    const timeTaken = Math.floor(
      (new Date().getTime() - startTime.getTime()) / 1000
    );

    const score = calculateCaseScore(
      true,
      orderedTests.length,
      timeTaken
    );

    addPoints(score);

    alert(`Case Completed\nScore: ${score} points`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* HEADER */}
      <View style={styles.headerBox}>
        <Text style={styles.title}>
          Clinical Case Simulation
        </Text>

        <Text style={styles.subtitle}>
          Specialty: {String(specialty)}
        </Text>
      </View>

      {/* PATIENT INFO */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Patient Information</Text>
        <Text style={styles.text}>👤 {caseData.history}</Text>
      </View>

      {/* RESULTS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Investigations</Text>
        <Text style={styles.resultText}>{results}</Text>
      </View>

      {/* TEST BUTTONS */}
      <Text style={styles.sectionTitle}>Order Tests</Text>

      <Pressable
        style={[
          styles.button,
          orderedTests.includes('cbc') && styles.disabled
        ]}
        onPress={() => handleOrderTest('cbc')}
      >
        <Text style={styles.buttonText}>Complete Blood Count (CBC)</Text>
      </Pressable>

      <Pressable
        style={[
          styles.button,
          orderedTests.includes('xray') && styles.disabled
        ]}
        onPress={() => handleOrderTest('xray')}
      >
        <Text style={styles.buttonText}>Chest Imaging</Text>
      </Pressable>

      {/* ORDERED TESTS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ordered Tests</Text>
        {orderedTests.length === 0 ? (
          <Text style={styles.textMuted}>No tests ordered yet</Text>
        ) : (
          orderedTests.map((t) => (
            <Text key={t} style={styles.text}>
              • {t.toUpperCase()}
            </Text>
          ))
        )}
      </View>

      {/* SUBMIT */}
      <Pressable style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>
          Submit Final Diagnosis →
        </Text>
      </Pressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  headerBox: {
    backgroundColor: '#0F172A',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
  },

  subtitle: {
    marginTop: 4,
    color: '#94A3B8',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#38BDF8',
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#111827',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  text: {
    color: '#F8FAFC',
    lineHeight: 20,
  },

  textMuted: {
    color: '#64748B',
  },

  resultText: {
    color: '#F8FAFC',
  },

  button: {
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },

  disabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: '#F8FAFC',
    textAlign: 'center',
    fontWeight: '600',
  },

  submitBtn: {
    backgroundColor: '#10B981',
    padding: 18,
    borderRadius: 14,
    marginTop: 20,
  },

  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },

  errorText: {
    color: '#F87171',
    textAlign: 'center',
    marginTop: 40,
  },
});
