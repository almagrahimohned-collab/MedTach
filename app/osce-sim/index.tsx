import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../src/store';
import { OSCELoader } from '../../src/osce/osceLoader';
import { OSCEIndex } from '../../src/osce/osceTypes';

const { width } = Dimensions.get('window');

export default function OSCEWelcomeScreen() {
  const router = useRouter();
  const { user } = useStore();
  const [index, setIndex] = useState<OSCEIndex | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOSCEIndex();
  }, []);

  const loadOSCEIndex = async () => {
    try {
      const loader = new OSCELoader();
      const data = await loader.loadIndex();
      setIndex(data);
    } catch (error) {
      console.error('Failed to load OSCE index:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCircuit = (circuitId?: string) => {
    router.push({
      pathname: '/osce-sim/station',
      params: { circuitId: circuitId || 'default' },
    });
  };

  const handlePracticeMode = () => {
    router.push({
      pathname: '/osce-sim/station',
      params: { mode: 'practice' },
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="school" size={60} color="#38BDF8" />
          <Text style={styles.loadingText}>Loading OSCE Stations...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#94A3B8" />
          </Pressable>
          <Text style={styles.headerTitle}>OSCE Simulator</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="medkit" size={48} color="#38BDF8" />
          </View>
          <Text style={styles.welcomeTitle}>Clinical OSCE</Text>
          <Text style={styles.welcomeSubtitle}>
            Practice clinical skills with realistic patient encounters
          </Text>
          
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="location" size={18} color="#38BDF8" />
              <Text style={styles.statValue}>
                {index?.total_stations || 1}
              </Text>
              <Text style={styles.statLabel}>Stations</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="time" size={18} color="#F59E0B" />
              <Text style={styles.statValue}>
                {index?.circuits?.length || 1}
              </Text>
              <Text style={styles.statLabel}>Circuits</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="trophy" size={18} color="#10B981" />
              <Text style={styles.statValue}>
                {user?.osceCompleted || 0}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Main Actions */}
        <View style={styles.actionsSection}>
          {/* Exam Mode */}
          <Pressable
            style={styles.examModeCard}
            onPress={() => handleStartCircuit()}
          >
            <View style={styles.examModeContent}>
              <View style={styles.examModeLeft}>
                <View style={styles.examIconBadge}>
                  <Ionicons name="timer" size={28} color="#0F172A" />
                </View>
                <View style={styles.examModeText}>
                  <Text style={styles.examModeTitle}>Full OSCE Exam</Text>
                  <Text style={styles.examModeDescription}>
                    Complete 12-station circuit with timed stations
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#38BDF8" />
            </View>
            <View style={styles.examModeBadges}>
              <View style={styles.badge}>
                <Ionicons name="time" size={12} color="#F59E0B" />
                <Text style={styles.badgeText}>60 min</Text>
              </View>
              <View style={styles.badge}>
                <Ionicons name="location" size={12} color="#38BDF8" />
                <Text style={styles.badgeText}>12 stations</Text>
              </View>
              <View style={styles.badge}>
                <Ionicons name="ribbon" size={12} color="#10B981" />
                <Text style={styles.badgeText}>Exam mode</Text>
              </View>
            </View>
          </Pressable>

          {/* Practice Mode */}
          <Pressable
            style={styles.practiceCard}
            onPress={handlePracticeMode}
          >
            <View style={styles.practiceContent}>
              <View style={styles.practiceIcon}>
                <Ionicons name="book" size={24} color="#38BDF8" />
              </View>
              <View style={styles.practiceText}>
                <Text style={styles.practiceTitle}>Practice Mode</Text>
                <Text style={styles.practiceDescription}>
                  Practice individual stations at your own pace
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#64748B" />
            </View>
          </Pressable>

          {/* Specialty Selection */}
          <View style={styles.specialtySection}>
            <Text style={styles.sectionTitle}>By Specialty</Text>
            <View style={styles.specialtyGrid}>
              {['Cardiology', 'Pulmonology', 'Gastroenterology', 'Neurology'].map(
                (specialty) => (
                  <Pressable
                    key={specialty}
                    style={styles.specialtyCard}
                    onPress={() => {
                      router.push({
                        pathname: '/osce-sim/station',
                        params: { specialty: specialty.toLowerCase() },
                      });
                    }}
                  >
                    <Ionicons
                      name={
                        specialty === 'Cardiology'
                          ? 'heart'
                          : specialty === 'Pulmonology'
                          ? 'leaf'
                          : specialty === 'Gastroenterology'
                          ? 'restaurant'
                          : 'cog'
                      }
                      size={24}
                      color="#38BDF8"
                    />
                    <Text style={styles.specialtyName}>{specialty}</Text>
                    <Text style={styles.specialtyCount}>
                      {index?.stations?.filter(
                        (s) => s.specialty === specialty.toLowerCase()
                      ).length || 0}{' '}
                      stations
                    </Text>
                  </Pressable>
                )
              )}
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        {user?.osceHistory && user.osceHistory.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent OSCE Exams</Text>
            {user.osceHistory.slice(0, 3).map((exam: any, i: number) => (
              <View key={i} style={styles.recentItem}>
                <View style={styles.recentLeft}>
                  <Ionicons
                    name={exam.passed ? 'checkmark-circle' : 'close-circle'}
                    size={20}
                    color={exam.passed ? '#10B981' : '#EF4444'}
                  />
                  <View style={styles.recentText}>
                    <Text style={styles.recentTitle}>
                      {exam.circuitName || 'OSCE Exam'}
                    </Text>
                    <Text style={styles.recentDate}>{exam.date}</Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.recentScore,
                    { color: exam.passed ? '#10B981' : '#EF4444' },
                  ]}
                >
                  {exam.score}%
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Bottom Padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 16,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    backgroundColor: '#1A1F2E',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: {
    width: 30,
  },

  // Welcome Card
  welcomeCard: {
    margin: 20,
    padding: 24,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#38BDF810',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    color: '#F8FAFC',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    color: '#64748B',
    fontSize: 11,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#334155',
  },

  // Actions
  actionsSection: {
    paddingHorizontal: 20,
  },

  // Exam Mode Card
  examModeCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#38BDF830',
    padding: 20,
    marginBottom: 12,
  },
  examModeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  examModeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  examIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  examModeText: {
    flex: 1,
  },
  examModeTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  examModeDescription: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
  },
  examModeBadges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
  },

  // Practice Card
  practiceCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 16,
    marginBottom: 24,
  },
  practiceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  practiceIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#38BDF810',
    justifyContent: 'center',
    alignItems: 'center',
  },
  practiceText: {
    flex: 1,
  },
  practiceTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  practiceDescription: {
    color: '#94A3B8',
    fontSize: 12,
  },

  // Specialty Section
  specialtySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  specialtyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  specialtyCard: {
    width: (width - 60) / 2,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  specialtyName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  specialtyCount: {
    color: '#64748B',
    fontSize: 11,
  },

  // Recent Section
  recentSection: {
    paddingHorizontal: 20,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recentText: {
    gap: 2,
  },
  recentTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  recentDate: {
    color: '#64748B',
    fontSize: 11,
  },
  recentScore: {
    fontSize: 16,
    fontWeight: '700',
  },
});

