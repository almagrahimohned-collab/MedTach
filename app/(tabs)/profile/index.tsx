import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../../src/store';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const router = useRouter();
  const { totalPoints, completedCases, badges } = useStore();

  const accuracy = completedCases.length > 0
    ? Math.round(completedCases.reduce((acc, c) => acc + c.score, 0) / completedCases.length)
    : 100;

  const recentCases = completedCases.slice(-3).reverse();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={40} color="#0F172A" />
        </View>
        <Text style={styles.drName}>Dr. Ahmed</Text>
        <Text style={styles.drTitle}>Internal Medicine Resident</Text>
      </View>

      <Text style={styles.sectionTitle}>Performance Metrics</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{totalPoints}</Text>
          <Text style={styles.statLabel}>Total Score</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{completedCases.length}</Text>
          <Text style={styles.statLabel}>Cases Solved</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{accuracy}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>🏆 Badges</Text>
      <View style={styles.badgeGrid}>
        {badges.length > 0 ? (
          badges.map((badge, index) => (
            <View key={index} style={styles.badgeItem}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noBadges}>Complete cases to earn badges</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Recent Cases</Text>
      {recentCases.length > 0 ? (
        recentCases.map((c, i) => (
          <View key={i} style={styles.caseCard}>
            <View>
              <Text style={styles.caseTitle}>Case #{completedCases.length - recentCases.length + i + 1}</Text>
              <Text style={styles.caseSpecialty}>{new Date(c.date).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.caseScore}>{c.score} pts</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noBadges}>No cases completed yet</Text>
      )}

      <Pressable style={styles.historyBtn} onPress={() => router.push('/profile/history')}>
        <Ionicons name="bar-chart" size={18} color="#38BDF8" />
        <Text style={styles.historyBtnText}>View Full Analytics</Text>
      </Pressable>

      <Pressable style={styles.settingsBtn} onPress={() => router.push('/settings')}>
        <Ionicons name="settings-outline" size={18} color="#94A3B8" />
        <Text style={styles.settingsBtnText}>Settings</Text>
      </Pressable>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 16 },
  headerCard: { backgroundColor: '#1E293B', padding: 24, borderRadius: 16, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#334155' },
  avatarPlaceholder: { width: 80, height: 80, backgroundColor: '#38BDF8', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  drName: { fontSize: 24, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  drTitle: { fontSize: 16, color: '#94A3B8' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 12, marginTop: 8 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statBox: { backgroundColor: '#1E293B', flex: 1, padding: 16, borderRadius: 12, alignItems: 'center', marginHorizontal: 4, borderWidth: 1, borderColor: '#334155' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#10B981', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#94A3B8', textAlign: 'center' },

  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  badgeItem: { backgroundColor: '#1E293B', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#38BDF8' },
  badgeText: { color: '#F8FAFC', fontWeight: 'bold', fontSize: 14 },
  noBadges: { color: '#94A3B8', fontStyle: 'italic', marginBottom: 24 },

  caseCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1E293B', padding: 16, borderRadius: 8, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#38BDF8' },
  caseTitle: { fontSize: 16, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  caseSpecialty: { fontSize: 12, color: '#94A3B8' },
  caseScore: { fontSize: 16, fontWeight: 'bold', color: '#10B981' },

  historyBtn: { flexDirection: 'row', backgroundColor: '#1E293B', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 8, gap: 8, borderWidth: 1, borderColor: '#334155' },
  historyBtnText: { color: '#38BDF8', fontSize: 16, fontWeight: 'bold' },

  settingsBtn: { flexDirection: 'row', backgroundColor: '#1E293B', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 10, gap: 8, borderWidth: 1, borderColor: '#334155', marginBottom: 40 },
  settingsBtnText: { color: '#94A3B8', fontSize: 16, fontWeight: '500' },
});
