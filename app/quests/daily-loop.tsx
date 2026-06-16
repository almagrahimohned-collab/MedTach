import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../src/store';
import { caseRepository } from '../../src/services/CaseRepository';
import { UnifiedCase } from '../../src/services/caseTypes';

export default function DailyLoopScreen() {
  const router = useRouter();
  const store = useStore();
  const [loading, setLoading] = useState(true);
  const [caseOfDay, setCaseOfDay] = useState<UnifiedCase | null>(null);
  const [imageOfDay, setImageOfDay] = useState<any>(null);

  useEffect(() => {
    loadDailyLoop();
  }, []);

  const loadDailyLoop = async () => {
    setLoading(true);
    store.generateDailyLoop();
    
    const weak = store.getWeakCompetencies(3);
    
    const caseData = await caseRepository.getCaseOfDay(weak);
    setCaseOfDay(caseData);
    
    const imgData = await caseRepository.getImageOfDay();
    setImageOfDay(imgData);
    
    setLoading(false);
  };

  const handleOpenCase = () => {
    if (!caseOfDay) return;
    store.completeDailyLoopItem('case');
    router.push(`/cases/review/${caseOfDay.id}` as any);
  };

  const handleOpenImage = () => {
    if (!imageOfDay) return;
    store.completeDailyLoopItem('image');
    router.push('/image-challenge' as any);
  };

  const handleOpenBoard = () => {
    store.completeDailyLoopItem('board');
    router.push('/board-prep/exam?mode=mock' as any);
  };

  const handleOpenECG = () => {
    store.completeDailyLoopItem('ecg');
    router.push('/image-challenge' as any);
  };

  const completed = store.dailyLoop?.completed || [];
  const allDone = completed.length >= 4;

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 100 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#94A3B8" />
        </Pressable>
        <Text style={styles.title}>Daily Learning Loop</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>
            {allDone ? '🎉 All Complete!' : `${completed.length}/4 Done`}
          </Text>
          <View style={styles.progressDots}>
            {['case', 'image', 'board', 'ecg'].map((item, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  completed.includes(item) && styles.dotDone,
                ]}
              />
            ))}
          </View>
          {allDone && (
            <Text style={styles.bonusText}>+50 Bonus Points Earned!</Text>
          )}
        </View>

        {/* Case of the Day */}
        <Pressable
          style={[styles.card, completed.includes('case') && styles.cardDone]}
          onPress={handleOpenCase}
        >
          <View style={styles.cardIcon}>
            <Ionicons name="document-text" size={28} color="#38BDF8" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>📋 Case of the Day</Text>
            <Text style={styles.cardDesc}>
              {caseOfDay ? caseOfDay.title : 'No case available'}
            </Text>
            {caseOfDay?.competencies && (
              <Text style={styles.cardTags}>
                🎯 {caseOfDay.competencies.slice(0, 2).join(', ')}
              </Text>
            )}
          </View>
          {completed.includes('case') ? (
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          ) : (
            <Ionicons name="chevron-forward" size={24} color="#64748B" />
          )}
        </Pressable>

        {/* Image of the Day */}
        <Pressable
          style={[styles.card, completed.includes('image') && styles.cardDone]}
          onPress={handleOpenImage}
        >
          <View style={[styles.cardIcon, { backgroundColor: '#8B5CF620' }]}>
            <Ionicons name="image" size={28} color="#8B5CF6" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>🖼️ Image of the Day</Text>
            <Text style={styles.cardDesc}>
              {imageOfDay ? `${imageOfDay.modality?.toUpperCase()} — ${imageOfDay.findings}` : 'Image challenge'}
            </Text>
          </View>
          {completed.includes('image') ? (
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          ) : (
            <Ionicons name="chevron-forward" size={24} color="#64748B" />
          )}
        </Pressable>

        {/* Board Question of the Day */}
        <Pressable
          style={[styles.card, completed.includes('board') && styles.cardDone]}
          onPress={handleOpenBoard}
        >
          <View style={[styles.cardIcon, { backgroundColor: '#F59E0B20' }]}>
            <Ionicons name="school" size={28} color="#F59E0B" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>📚 Board Question</Text>
            <Text style={styles.cardDesc}>Test your knowledge with a board-style question</Text>
          </View>
          {completed.includes('board') ? (
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          ) : (
            <Ionicons name="chevron-forward" size={24} color="#64748B" />
          )}
        </Pressable>

        {/* ECG of the Day */}
        <Pressable
          style={[styles.card, completed.includes('ecg') && styles.cardDone]}
          onPress={handleOpenECG}
        >
          <View style={[styles.cardIcon, { backgroundColor: '#EF444420' }]}>
            <Ionicons name="pulse" size={28} color="#EF4444" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>⚡ ECG of the Day</Text>
            <Text style={styles.cardDesc}>Interpret today's ECG strip</Text>
          </View>
          {completed.includes('ecg') ? (
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          ) : (
            <Ionicons name="chevron-forward" size={24} color="#64748B" />
          )}
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 20, backgroundColor: '#1A1F2E', borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#F8FAFC', fontSize: 20, fontWeight: '700', flex: 1, textAlign: 'center' },
  content: { flex: 1, padding: 16 },
  progressCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 20, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  progressTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginBottom: 10 },
  progressDots: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#334155' },
  dotDone: { backgroundColor: '#10B981' },
  bonusText: { color: '#F59E0B', fontSize: 14, fontWeight: '600' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155', gap: 12 },
  cardDone: { opacity: 0.6, borderColor: '#10B98140' },
  cardIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#38BDF820', justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1, gap: 4 },
  cardTitle: { color: '#F8FAFC', fontSize: 15, fontWeight: '700' },
  cardDesc: { color: '#94A3B8', fontSize: 12 },
  cardTags: { color: '#38BDF8', fontSize: 10, marginTop: 2 },
});
