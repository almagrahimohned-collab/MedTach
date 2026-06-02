import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, Pressable, FlatList, Animated, Dimensions, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { contentService } from '../../../src/services/contentService';

const { width } = Dimensions.get('window');

const mainSpecialties = [
  { id: 'cardiology', name: 'Internal Medicine', emoji: '🩺', color: '#3B82F6', description: 'Adult diseases & chronic conditions' },
  { id: 'pediatrics', name: 'Pediatrics', emoji: '👶', color: '#F59E0B', description: 'Child healthcare & development' },
  { id: 'gynecology', name: 'OB/GYN', emoji: '🤰', color: '#8B5CF6', description: 'Women health & pregnancy' },
  { id: 'surgery', name: 'Surgery', emoji: '🏥', color: '#EF4444', description: 'Operative procedures & trauma' },
];

export default function Specialties() {
  const router = useRouter();
  const [caseCounts, setCaseCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
    loadCaseCounts();
  }, []);

  const loadCaseCounts = async () => {
    try {
      const index = await contentService.getIndex();
      const counts: Record<string, number> = {};
      mainSpecialties.forEach(spec => {
        const bySpec = index.cases_by_specialty[spec.id] || {};
        counts[spec.id] = Object.values(bySpec).reduce((a: number, b: any) => a + (b || 0), 0);
      });
      setCaseCounts(counts);
    } catch (e) {
      mainSpecialties.forEach(s => { caseCounts[s.id] = 0; });
      setCaseCounts({ ...caseCounts });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Specialty</Text>
          <Text style={styles.subtitle}>Choose a medical field to begin diagnosis</Text>
        </View>

        <FlatList
          data={mainSpecialties}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/specialties/details?id=${item.id}`)}
            >
              <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                <Text style={styles.emoji}>{item.emoji}</Text>
              </View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
              <View style={styles.cardFooter}>
                <Ionicons name="document-text-outline" size={14} color="#94A3B8" />
                <Text style={styles.caseCount}>{caseCounts[item.id] || 0} Cases</Text>
              </View>
            </Pressable>
          )}
        />

        <View style={{ height: 20 }} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  loadingContainer: { flex: 1, backgroundColor: '#0A0E1A', justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, padding: 16 },
  header: { marginBottom: 20, marginTop: 10 },
  title: { fontSize: 28, fontWeight: '800', color: '#F8FAFC', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#94A3B8' },
  listContent: { paddingBottom: 20 },
  columnWrapper: { gap: 12, marginBottom: 12 },
  card: {
    flex: 1, backgroundColor: '#1E293B', padding: 20, borderRadius: 20,
    borderWidth: 1, borderColor: '#334155', gap: 10,
  },
  iconBox: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
  },
  emoji: { fontSize: 28 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#F8FAFC' },
  cardDesc: { fontSize: 11, color: '#94A3B8', lineHeight: 16 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 'auto' },
  caseCount: { fontSize: 12, color: '#64748B', fontWeight: '500' },
});
