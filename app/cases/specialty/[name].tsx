import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ContentRepository, CaseEntry } from "../../../src/content/ContentRepository";
const specialtyCache = new Map<string, CaseEntry[]>();

export default function SpecialtyCasesScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const [cases, setCases] = useState<CaseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (name) loadCases();
  }, [name]);

  const loadCases = async () => {
    const cached = specialtyCache.get(name!);
    if (cached) { setCases(cached); setLoading(false); return; }
    try {
      setLoading(true);
      setError(null);
      const repo = ContentRepository.getInstance();
      const allCases = await repo.getCasesBySpecialty(name!);
      setCases(allCases);
      specialtyCache.set(name!, allCases);
      
      if (allCases.length === 0) {
        setError(`No cases found for ${name}`);
      }
    } catch (e: any) {
      console.error('[SpecialtyScreen] Error:', e);
      setError(e.message || 'Failed to load cases');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.statusText}>Loading {name} cases...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadCases}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const grouped = groupByDifficulty(cases);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {name?.charAt(0).toUpperCase() + (name?.slice(1) || '')}
      </Text>
      <Text style={styles.subtitle}>{cases.length} cases</Text>

      <FlatList
        data={Object.entries(grouped)}
        keyExtractor={([level]) => level}
        renderItem={({ item: [level, entries] }) => (
          <View style={styles.section}>
            <Text style={styles.levelTitle}>
              {level.charAt(0).toUpperCase() + level.slice(1)} ({entries.length})
            </Text>
            {entries.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                style={styles.card}
                onPress={() => router.push(`/cases/review/${entry.id}` as any)}
              >
                <Text style={styles.cardTitle}>{entry.title}</Text>
                <Text style={styles.cardArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No cases found in this specialty</Text>
          </View>
        }
      />
    </View>
  );
}

function groupByDifficulty(entries: CaseEntry[]): Record<string, CaseEntry[]> {
  const groups: Record<string, CaseEntry[]> = { beginner: [], intermediate: [], advanced: [] };
  for (const entry of entries) {
    const level = entry.difficulty || 'beginner';
    if (!groups[level]) groups[level] = [];
    groups[level].push(entry);
  }
  return groups;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4, color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  section: { marginBottom: 20 },
  levelTitle: { fontSize: 16, fontWeight: '600', color: '#007AFF', marginBottom: 8, textTransform: 'capitalize' },
  card: {
    padding: 14, marginBottom: 6, backgroundColor: '#fff',
    borderRadius: 10, borderWidth: 1, borderColor: '#e0e0e0',
    flexDirection: 'row', alignItems: 'center'
  },
  cardTitle: { flex: 1, fontSize: 14, color: '#333' },
  cardArrow: { fontSize: 16, color: '#ccc' },
  statusText: { marginTop: 10, color: '#666' },
  errorIcon: { fontSize: 40, marginBottom: 10 },
  errorText: { color: '#e74c3c', fontSize: 16, textAlign: 'center', marginBottom: 16 },
  emptyText: { color: '#666', fontSize: 16 },
  retryBtn: { padding: 12, backgroundColor: '#007AFF', borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' }
});
