import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  StationResult,
  DomainScore,
  GlobalRating,
} from '../../src/osce/osceTypes';
import { getRatingColor } from '../../src/osce/osceScoring';

const { width } = Dimensions.get('window');

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse result from params
  const result: StationResult | null = useMemo(() => {
    try {
      if (params.result) {
        return JSON.parse(params.result as string);
      }
      return null;
    } catch {
      return null;
    }
  }, [params.result]);

  if (!result) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={48} color="#F59E0B" />
          <Text style={styles.errorText}>Could not load results</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const ratingColor = getRatingColor(result.globalRating);
  const passed = result.globalRating !== 'fail' && result.globalRating !== 'borderline';

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getRatingEmoji = (rating: GlobalRating): string => {
    const emojis: Record<GlobalRating, string> = {
      'fail': '😔',
      'borderline': '😟',
      'pass': '✅',
      'good': '👍',
      'excellent': '🌟',
    };
    return emojis[rating];
  };

  const getRatingMessage = (rating: GlobalRating): string => {
    const messages: Record<GlobalRating, string> = {
      'fail': 'Needs Significant Improvement',
      'borderline': 'Borderline Performance',
      'pass': 'Satisfactory Performance',
      'good': 'Good Clinical Skills',
      'excellent': 'Outstanding Performance!',
    };
    return messages[rating];
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#94A3B8" />
        </Pressable>
        <Text style={styles.headerTitle}>Station Results</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Result Header */}
        <View style={[styles.resultHeader, { borderColor: ratingColor }]}>
          <Text style={styles.resultEmoji}>{getRatingEmoji(result.globalRating)}</Text>
          <View
            style={[
              styles.ratingBadge,
              { backgroundColor: ratingColor + '20', borderColor: ratingColor },
            ]}
          >
            <Text style={[styles.ratingText, { color: ratingColor }]}>
              {result.globalRating.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.ratingMessage}>
            {getRatingMessage(result.globalRating)}
          </Text>

          {/* Score Circle */}
          <View style={styles.scoreCircle}>
            <Text style={[styles.scorePercent, { color: ratingColor }]}>
              {result.percentage}%
            </Text>
            <Text style={styles.scoreFraction}>
              {result.totalScore}/{result.maxScore} points
            </Text>
          </View>

          {/* Pass/Fail Status */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: passed ? '#10B98120' : '#EF444420' },
            ]}
          >
            <Ionicons
              name={passed ? 'checkmark-circle' : 'alert-circle'}
              size={20}
              color={passed ? '#10B981' : '#EF4444'}
            />
            <Text
              style={[styles.statusText, { color: passed ? '#10B981' : '#EF4444' }]}
            >
              {passed ? 'STATION PASSED' : 'STATION FAILED'}
            </Text>
          </View>
        </View>

        {/* Time Taken */}
        <View style={styles.timeCard}>
          <View style={styles.timeRow}>
            <Ionicons name="time" size={18} color="#94A3B8" />
            <Text style={styles.timeLabel}>Time Taken</Text>
            <Text style={styles.timeValue}>{formatTime(result.timeTaken)}</Text>
          </View>
          <View style={styles.timeRow}>
            <Ionicons name="hourglass" size={18} color="#94A3B8" />
            <Text style={styles.timeLabel}>Time Allocated</Text>
            <Text style={styles.timeValue}>{formatTime(result.timeAllocated)}</Text>
          </View>
          <View style={styles.timeBar}>
            <View
              style={[
                styles.timeBarFill,
                {
                  width: `${Math.min(100, (result.timeTaken / result.timeAllocated) * 100)}%`,
                  backgroundColor:
                    result.timeTaken > result.timeAllocated ? '#EF4444' : '#38BDF8',
                },
              ]}
            />
          </View>
        </View>

        {/* Domain Scores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Breakdown</Text>

          {result.domainScores.map((domain, index) => (
            <View key={index} style={styles.domainCard}>
              <View style={styles.domainHeader}>
                <View style={styles.domainInfo}>
                  <Text style={styles.domainName}>{domain.domain}</Text>
                  <Text style={styles.domainWeight}>Weight: {domain.weight}%</Text>
                </View>
                <View style={styles.domainScoreRight}>
                  <Text
                    style={[
                      styles.domainPercentage,
                      {
                        color:
                          domain.percentage >= 80
                            ? '#10B981'
                            : domain.percentage >= 60
                            ? '#F59E0B'
                            : '#EF4444',
                      },
                    ]}
                  >
                    {domain.percentage}%
                  </Text>
                  <Text style={styles.domainScoreText}>
                    {domain.earned}/{domain.maximum}
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.domainBar}>
                <View
                  style={[
                    styles.domainBarFill,
                    {
                      width: `${domain.percentage}%`,
                      backgroundColor:
                        domain.percentage >= 80
                          ? '#10B981'
                          : domain.percentage >= 60
                          ? '#F59E0B'
                          : '#EF4444',
                    },
                  ]}
                />
              </View>

              {/* Correct Items */}
              {domain.itemsCorrect.length > 0 && (
                <View style={styles.itemsList}>
                  <Text style={styles.itemsListTitle}>✓ Correct:</Text>
                  {domain.itemsCorrect.map((item, i) => (
                    <View key={i} style={styles.itemRow}>
                      <Ionicons name="checkmark" size={14} color="#10B981" />
                      <Text style={styles.itemTextCorrect}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Missed Items */}
              {domain.itemsMissed.length > 0 && (
                <View style={styles.itemsList}>
                  <Text style={styles.itemsListTitleMissed}>✗ Missed:</Text>
                  {domain.itemsMissed.map((item, i) => (
                    <View key={i} style={styles.itemRow}>
                      <Ionicons name="close" size={14} color="#EF4444" />
                      <Text style={styles.itemTextMissed}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Critical Items Missed */}
        {result.criticalItemsMissed.length > 0 && (
          <View style={styles.section}>
            <View style={styles.criticalHeader}>
              <Ionicons name="warning" size={18} color="#EF4444" />
              <Text style={styles.criticalTitle}>Critical Items Missed</Text>
            </View>
            <Text style={styles.criticalSubtext}>
              These are essential for safe clinical practice
            </Text>
            {result.criticalItemsMissed.map((item, i) => (
              <View key={i} style={styles.criticalItem}>
                <Ionicons name="alert-circle" size={16} color="#EF4444" />
                <Text style={styles.criticalItemText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Professional Bonuses & Penalties */}
        {(result.bonuses.length > 0 || result.penalties.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Behaviour</Text>

            {result.bonuses.length > 0 && (
              <View style={styles.behaviourList}>
                <Text style={styles.behaviourTitleGood}>✅ Strengths:</Text>
                {result.bonuses.map((bonus, i) => (
                  <View key={i} style={styles.behaviourItem}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.behaviourText}>{bonus}</Text>
                  </View>
                ))}
              </View>
            )}

            {result.penalties.length > 0 && (
              <View style={styles.behaviourList}>
                <Text style={styles.behaviourTitleBad}>⚠️ Areas to Improve:</Text>
                {result.penalties.map((penalty, i) => (
                  <View key={i} style={styles.behaviourItem}>
                    <Ionicons name="flag" size={14} color="#EF4444" />
                    <Text style={styles.behaviourText}>{penalty}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Feedback */}
        {result.feedback && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detailed Feedback</Text>
            <View style={styles.feedbackCard}>
              <Text style={styles.feedbackText}>{result.feedback}</Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Pressable
            style={styles.retryButton}
            onPress={() => router.replace('/osce-sim/station')}
          >
            <Ionicons name="refresh" size={18} color="#0F172A" />
            <Text style={styles.retryButtonText}>Try Another Station</Text>
          </Pressable>

          <Pressable
            style={styles.dashboardButton}
            onPress={() => router.replace('/osce-sim')}
          >
            <Text style={styles.dashboardButtonText}>Back to Dashboard</Text>
          </Pressable>
        </View>

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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 40,
  },
  errorText: {
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
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },

  // Result Header
  resultHeader: {
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 24,
    borderRadius: 20,
    borderWidth: 2,
    marginBottom: 16,
  },
  resultEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  ratingBadge: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  ratingMessage: {
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 16,
  },
  scoreCircle: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scorePercent: {
    fontSize: 52,
    fontWeight: '800',
  },
  scoreFraction: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Time Card
  timeCard: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  timeLabel: {
    color: '#94A3B8',
    fontSize: 13,
    flex: 1,
  },
  timeValue: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  timeBar: {
    height: 4,
    backgroundColor: '#0F172A',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 8,
  },
  timeBarFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Section
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },

  // Domain Cards
  domainCard: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
  },
  domainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  domainInfo: {
    flex: 1,
  },
  domainName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  domainWeight: {
    color: '#64748B',
    fontSize: 11,
  },
  domainScoreRight: {
    alignItems: 'flex-end',
  },
  domainPercentage: {
    fontSize: 20,
    fontWeight: '800',
  },
  domainScoreText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  domainBar: {
    height: 6,
    backgroundColor: '#0F172A',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  domainBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Items
  itemsList: {
    marginBottom: 8,
  },
  itemsListTitle: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  itemsListTitleMissed: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 3,
  },
  itemTextCorrect: {
    color: '#A7F3D0',
    fontSize: 12,
    flex: 1,
  },
  itemTextMissed: {
    color: '#FECACA',
    fontSize: 12,
    flex: 1,
  },

  // Critical Items
  criticalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  criticalTitle: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
  },
  criticalSubtext: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 10,
  },
  criticalItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#EF444410',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  criticalItemText: {
    color: '#FCA5A5',
    fontSize: 12,
    flex: 1,
  },

  // Behaviour
  behaviourList: {
    marginBottom: 12,
  },
  behaviourTitleGood: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  behaviourTitleBad: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  behaviourItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 3,
  },
  behaviourText: {
    color: '#E2E8F0',
    fontSize: 12,
    flex: 1,
  },

  // Feedback
  feedbackCard: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  feedbackText: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 22,
  },

  // Actions
  actionsSection: {
    gap: 10,
    marginTop: 10,
  },
  retryButton: {
    backgroundColor: '#38BDF8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 14,
    gap: 8,
  },
  retryButtonText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },
  dashboardButton: {
    alignItems: 'center',
    padding: 14,
  },
  dashboardButtonText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#38BDF8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
});

