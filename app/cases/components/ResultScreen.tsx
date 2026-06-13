import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

interface ResultScreenProps {
  score: any; caseData: any; trace: any; replayData: any;
  onRestart: () => void; onHome: () => void;
}

export function ResultScreen({ score, caseData, onRestart, onHome }: ResultScreenProps) {
  const total = typeof score === 'number' ? score : (score?.total || score?.totalScore || 0);
  const grade = typeof score === 'string' ? score : (score?.grade || (total >= 90 ? 'A+' : total >= 80 ? 'A' : total >= 70 ? 'B' : total >= 60 ? 'C' : 'F'));
  const passed = total >= 60;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.gradeContainer}>
        <View style={[styles.gradeCircle, { backgroundColor: passed ? '#2ecc71' : '#e74c3c' }]}>
          <Text style={styles.gradeText}>{String(grade)}</Text>
          <Text style={styles.scoreText}>{String(total)}/100</Text>
        </View>
        <Text style={styles.statusText}>{passed ? '✅ Case Passed' : '📚 Keep Practicing'}</Text>
      </View>

      {caseData?.key_learning_points && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Key Learning Points</Text>
          {Array.isArray(caseData.key_learning_points) && caseData.key_learning_points.map((point: any, i: number) => (
            <View key={i} style={styles.point}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.pointText}>{String(point)}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Summary</Text>
        <Text style={styles.detail}>Diagnosis: {String(caseData?.correct_diagnosis || 'N/A')}</Text>
        <Text style={styles.detail}>Specialty: {String(caseData?.specialty || 'N/A')}</Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={onRestart}>
        <Text style={styles.btnText}>🔄 Try Again</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnOutline} onPress={onHome}>
        <Text style={styles.btnOutlineText}>🏠 Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20 },
  gradeContainer: { alignItems: 'center', marginBottom: 24 },
  gradeCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  gradeText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  scoreText: { color: '#fff', fontSize: 14 },
  statusText: { fontSize: 16, fontWeight: '600', marginTop: 8 },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  point: { flexDirection: 'row', marginBottom: 6 },
  bullet: { marginRight: 8, color: '#007AFF' },
  pointText: { flex: 1, fontSize: 14, color: '#333' },
  detail: { fontSize: 14, color: '#333', marginBottom: 4 },
  btn: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 8 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  btnOutline: { borderWidth: 1, borderColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnOutlineText: { color: '#007AFF', fontWeight: '600', fontSize: 16 },
});

export default ResultScreen;
