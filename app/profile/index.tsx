import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();

  const userStats = {
    name: 'Dr. Ahmed',
    title: 'Internal Medicine Resident',
    totalScore: 3450,
    casesSolved: 42,
    accuracy: '88%',
  };

  const unlockedCases = [
    { id: '1', title: 'Complex Arrhythmia', specialty: 'Cardiology' },
    { id: '2', title: 'Refractory Asthma', specialty: 'Respiratory' },
    { id: '3', title: 'Unexplained Jaundice', specialty: 'Gastroenterology' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header Info */}
      <View style={styles.headerCard}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>Dr</Text>
        </View>
        <Text style={styles.drName}>{userStats.name}</Text>
        <Text style={styles.drTitle}>{userStats.title}</Text>
      </View>

      {/* Stats Grid */}
      <Text style={styles.sectionTitle}>Performance Metrics</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{userStats.totalScore}</Text>
          <Text style={styles.statLabel}>Total Score</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{userStats.casesSolved}</Text>
          <Text style={styles.statLabel}>Cases Solved</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{userStats.accuracy}</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
      </View>

      {/* Unlocked Cases */}
      <Text style={styles.sectionTitle}>Case Library</Text>
      {unlockedCases.map((c) => (
        <View key={c.id} style={styles.caseCard}>
          <Text style={styles.caseTitle}>{c.title}</Text>
          <Text style={styles.caseSpecialty}>{c.specialty}</Text>
        </View>
      ))}

      {/* Action Buttons */}
      <Pressable style={styles.leaderboardBtn} onPress={() => router.push('/leaderboard')}>
        <Text style={styles.leaderboardBtnText}>🏆 View Leaderboard</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 16 },
  headerCard: { backgroundColor: '#1E293B', padding: 24, borderRadius: 16, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#334155' },
  avatarPlaceholder: { width: 80, height: 80, backgroundColor: '#38BDF8', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#0F172A' },
  drName: { fontSize: 24, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  drTitle: { fontSize: 16, color: '#94A3B8' },
  
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 12, marginTop: 8 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statBox: { backgroundColor: '#1E293B', flex: 1, padding: 16, borderRadius: 12, alignItems: 'center', marginHorizontal: 4, borderWidth: 1, borderColor: '#334155' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#10B981', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#94A3B8', textAlign: 'center' },
  
  caseCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 8, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#38BDF8' },
  caseTitle: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  caseSpecialty: { fontSize: 14, color: '#94A3B8' },
  
  leaderboardBtn: { backgroundColor: '#F59E0B', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24, marginBottom: 40 },
  leaderboardBtnText: { color: '#0F172A', fontSize: 16, fontWeight: 'bold' },
});
