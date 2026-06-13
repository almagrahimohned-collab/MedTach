import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SCENARIOS_META, ScenarioMeta } from './scenarios';

export default function ScenarioSelectScreen() {
  const router = useRouter();

  const handleScenarioPress = (scenario: ScenarioMeta) => {
    if (scenario.locked) return;
    router.push(`/icu-sim/play?scenario=${scenario.id}` as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏥 ICU Simulator</Text>
        <Text style={styles.subtitle}>Master critical care scenarios</Text>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {SCENARIOS_META.map((scenario) => (
          <Pressable
            key={scenario.id}
            style={[
              styles.card,
              { borderLeftColor: scenario.color },
              scenario.locked && styles.lockedCard,
            ]}
            onPress={() => handleScenarioPress(scenario)}
          >
            <View style={[styles.iconBox, { backgroundColor: scenario.color + '20' }]}>
              <Ionicons
                name={scenario.locked ? 'lock-closed' : (scenario.icon as any)}
                size={28}
                color={scenario.locked ? '#64748B' : scenario.color}
              />
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, scenario.locked && styles.lockedText]}>
                  {scenario.title}
                </Text>
                <View style={[styles.badge, { backgroundColor: scenario.color + '30' }]}>
                  <Text style={[styles.badgeText, { color: scenario.color }]}>
                    {scenario.difficulty}
                  </Text>
                </View>
              </View>
              <Text style={[styles.cardSubtitle, scenario.locked && styles.lockedText]}>
                {scenario.subtitle}
              </Text>
              <Text style={styles.cardDesc}>{scenario.description}</Text>
              
              <View style={styles.objectives}>
                {scenario.learningObjectives.slice(0, 2).map((obj, i) => (
                  <View key={i} style={styles.objectiveItem}>
                    <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                    <Text style={styles.objectiveText}>{obj}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.footerItem}>
                  <Ionicons name="time-outline" size={14} color="#94A3B8" />
                  <Text style={styles.timeText}>{scenario.duration}</Text>
                </View>
                <View style={styles.footerItem}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.timeText}>+{scenario.xpReward} XP</Text>
                </View>
                {scenario.locked && (
                  <View style={styles.footerItem}>
                    <Ionicons name="lock-closed" size={14} color="#EF4444" />
                    <Text style={styles.lockText}>
                      Complete {SCENARIOS_META.find(s => s.id === scenario.requiredScenario)?.title}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <Ionicons
              name={scenario.locked ? 'lock-closed' : 'chevron-forward'}
              size={20}
              color={scenario.locked ? '#475569' : '#64748B'}
            />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { padding: 20, paddingTop: 10, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  title: { fontSize: 28, fontWeight: '800', color: '#F8FAFC' },
  subtitle: { fontSize: 14, color: '#94A3B8', marginTop: 4 },
  list: { flex: 1, padding: 16 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginBottom: 12, borderLeftWidth: 4, gap: 14 },
  lockedCard: { opacity: 0.6 },
  iconBox: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1, gap: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#F1F5F9' },
  lockedText: { color: '#64748B' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  cardSubtitle: { fontSize: 13, color: '#CBD5E1' },
  cardDesc: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
  objectives: { marginTop: 8, gap: 3 },
  objectiveItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  objectiveText: { fontSize: 11, color: '#94A3B8' },
  cardFooter: { marginTop: 8, gap: 4 },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontSize: 12, color: '#64748B' },
  lockText: { fontSize: 11, color: '#EF4444' },
});
