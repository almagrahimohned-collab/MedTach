import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MMEvent {
  time: number;
  type: 'critical' | 'action' | 'warning' | 'death';
  event: string;
}

interface MMConferenceProps {
  events: MMEvent[];
  scenarioTitle: string;
  onClose: () => void;
}

export default function MMConference({ events, scenarioTitle, onClose }: MMConferenceProps) {
  const timeline = events.sort((a, b) => a.time - b.time);
  const deathEvent = timeline.find(e => e.type === 'death');
  const warnings = timeline.filter(e => e.type === 'warning');
  const goodActions = timeline.filter(e => e.type === 'action');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔍 M&M Conference</Text>
        <Text style={styles.subtitle}>{scenarioTitle}</Text>
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#94A3B8" />
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Timeline */}
        <Text style={styles.sectionTitle}>⏱ Clinical Timeline</Text>
        <View style={styles.timeline}>
          {timeline.map((event, i) => {
            const isLast = i === timeline.length - 1;
            const dotColor = {
              critical: '#EF4444',
              action: '#10B981',
              warning: '#F59E0B',
              death: '#000000',
            }[event.type];

            return (
              <View key={i} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.dot, { backgroundColor: dotColor }]} />
                  {!isLast && <View style={styles.line} />}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTime}>{event.time}m</Text>
                  <Text style={styles.timelineEvent}>{event.event}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* What went wrong */}
        {warnings.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>❌ What Went Wrong</Text>
            {warnings.map((w, i) => (
              <View key={i} style={styles.findingCard}>
                <Ionicons name="warning" size={18} color="#F59E0B" />
                <Text style={styles.findingText}>{w.event}</Text>
              </View>
            ))}
          </>
        )}

        {/* What went right */}
        {goodActions.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>✅ What Went Right</Text>
            {goodActions.map((a, i) => (
              <View key={i} style={styles.findingCard}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text style={styles.findingText}>{a.event}</Text>
              </View>
            ))}
          </>
        )}

        {/* Literature */}
        <Text style={styles.sectionTitle}>📚 Evidence-Based Review</Text>
        <View style={styles.litCard}>
          <Text style={styles.litTitle}>Kumar et al. (2006) - Critical Care Medicine</Text>
          <Text style={styles.litText}>
            "Each hour of delay in antimicrobial administration was associated with a 7.8% decrease in survival."
          </Text>
        </View>
        <View style={styles.litCard}>
          <Text style={styles.litTitle}>Rivers et al. (2001) - NEJM</Text>
          <Text style={styles.litText}>
            "Early goal-directed therapy reduces mortality by 16% in severe sepsis and septic shock."
          </Text>
        </View>
      </ScrollView>

      <Pressable style={styles.doneBtn} onPress={onClose}>
        <Text style={styles.doneText}>I Understand</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: 16,
    marginBottom: 8,
  },
  timeline: {
    gap: 0,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#334155',
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 12,
  },
  timelineTime: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  timelineEvent: {
    fontSize: 13,
    color: '#E2E8F0',
    marginTop: 2,
  },
  findingCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  findingText: {
    flex: 1,
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  litCard: {
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#8B5CF6',
  },
  litTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A78BFA',
    marginBottom: 4,
  },
  litText: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  doneBtn: {
    backgroundColor: '#38BDF8',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  doneText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
});
