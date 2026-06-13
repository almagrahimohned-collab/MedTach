import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { contentService } from '../../../src/services/contentService';
import { useStore } from '../../../src/store';
import { supabase } from '../../../src/config/supabase';

const S = [
  { id: 'cardiology', name: 'Internal Medicine', icon: 'heart-outline', color: '#3B82F6', desc: 'Adult diseases & chronic conditions' },
  { id: 'pediatrics', name: 'Pediatrics', icon: 'happy-outline', color: '#F59E0B', desc: 'Child healthcare & development' },
  { id: 'gynecology', name: 'OB/GYN', icon: 'female-outline', color: '#8B5CF6', desc: 'Women health & pregnancy' },
  { id: 'surgery', name: 'Surgery', icon: 'cut-outline', color: '#EF4444', desc: 'Operative procedures & trauma' },
];

const SPECIALTY_GROUPS: Record<string, string[]> = {
  'cardiology': ['cardiology', 'pulmonology', 'neurology', 'endocrinology', 'gastroenterology', 'nephrology', 'infectious', 'hematology', 'rheumatology', 'dermatology'],
  'pediatrics': ['pediatrics'],
  'gynecology': ['gynecology'],
  'surgery': ['surgery'],
};

export default function CasesTab() {
  const router = useRouter();
  const user = useStore(s => s.user);
  const [counts, setCounts] = useState<Record<string, { total: number; solved: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCounts(); }, []);

  const loadCounts = async () => {
    try {
      const index = await contentService.getIndex();
      const allCases = index.cases || [];
      const newCounts: Record<string, { total: number; solved: number }> = {};
      for (const item of S) {
        const specialties = SPECIALTY_GROUPS[item.id] || [item.id];
        const total = allCases.filter((c: any) => specialties.includes(c.specialty)).length;
        let solved = 0;
        if (user?.id) {
          const { count } = await supabase.from('case_progress').select('*', { count: 'exact', head: true }).eq('user_id', user.id).in('specialty', specialties).eq('status', 'completed');
          solved = count || 0;
        }
        newCounts[item.id] = { total, solved };
      }
      setCounts(newCounts);
    } catch (e) { console.log('Failed to load counts:', e); }
    finally { setLoading(false); }
  };

  if (loading) return (<View style={styles.container}><ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 100 }} /></View>);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Specialty</Text>
      <FlatList data={S} keyExtractor={i => i.id} numColumns={2} columnWrapperStyle={{ gap: 10, marginBottom: 10 }} contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const c = counts[item.id] || { total: 0, solved: 0 };
          const remaining = c.total - c.solved;
          return (
            <Pressable style={styles.card} onPress={() => router.push(`/specialties/details?id=${item.id}`)}>
              <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}><Ionicons name={item.icon as any} size={28} color={item.color} /></View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
              <View style={styles.countRow}>
                <View style={[styles.countBadge, { backgroundColor: item.color + '15' }]}>
                  <Text style={[styles.countText, { color: item.color }]}>{remaining} Available</Text>
                </View>
                {c.solved > 0 && <Text style={styles.solvedText}>✓ {c.solved}</Text>}
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  title: { color: '#F8FAFC', fontSize: 24, fontWeight: '800', padding: 16, paddingBottom: 8 },
  card: { flex: 1, backgroundColor: '#1E293B', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#334155', gap: 8, minHeight: 160 },
  iconBox: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { color: '#F8FAFC', fontSize: 15, fontWeight: '700' },
  cardDesc: { color: '#94A3B8', fontSize: 11, marginTop: 'auto' },
  countRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  countBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  countText: { fontSize: 11, fontWeight: '600' },
  solvedText: { color: '#64748B', fontSize: 10 },
});
