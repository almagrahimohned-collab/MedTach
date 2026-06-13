import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { randomizeScenario, RandomizedScenario, generateSeedDisplay } from './caseRandomizer';
import { Scenario } from './scenarios/types';

interface RandomizerCardProps {
  scenario: Scenario | null;
}

export default function RandomizerCard({ scenario }: RandomizerCardProps) {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [randomized, setRandomized] = useState<RandomizedScenario | null>(null);

  const handleRandomize = () => {
    if (!scenario) return;
    const rand = randomizeScenario(scenario);
    setRandomized(rand);
    setShowPreview(true);
  };

  const handleStart = () => {
    if (!randomized) return;
    setShowPreview(false);
    router.push({
      pathname: '/icu-sim/play',
      params: {
        scenario: randomized._original.id,
        seed: randomized._seed,
        variant: randomized._variant,
        severity: randomized._severity,
      },
    } as any);
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'mild': return '#10B981';
      case 'moderate': return '#F59E0B';
      case 'severe': return '#F97316';
      case 'critical': return '#EF4444';
      default: return '#64748B';
    }
  };

  return (
    <>
      <Pressable style={styles.card} onPress={handleRandomize}>
        <View style={styles.cardLeft}>
          <Text style={styles.dice}>🎲</Text>
          <View>
            <Text style={styles.title}>Random Challenge</Text>
            <Text style={styles.subtitle}>Every case is different!</Text>
          </View>
        </View>
        <Ionicons name="shuffle" size={24} color="#8B5CF6" />
      </Pressable>

      {/* Preview Modal */}
      <Modal visible={showPreview} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>🎲 Randomized Case</Text>

            {randomized && (
              <>
                {/* Seed Info */}
                <View style={styles.seedCard}>
                  <Text style={styles.seedText}>Seed: #{randomized._seed}</Text>
                  <Text style={styles.seedSub}>Share with friends!</Text>
                </View>

                {/* Patient Info */}
                <View style={styles.patientCard}>
                  <Text style={styles.patientName}>{randomized.patient.name}</Text>
                  <Text style={styles.patientDetails}>
                    {randomized.patient.age}y • {randomized.patient.weight}kg
                  </Text>
                </View>

                {/* Variants */}
                <View style={styles.variantsRow}>
                  <View style={[styles.variantChip, { backgroundColor: getSeverityColor(randomized._severity) + '20' }]}>
                    <Text style={[styles.variantText, { color: getSeverityColor(randomized._severity) }]}>
                      {randomized._severity.toUpperCase()}
                    </Text>
                  </View>
                  <View style={[styles.variantChip, { backgroundColor: '#8B5CF620' }]}>
                    <Text style={[styles.variantText, { color: '#8B5CF6' }]}>
                      {randomized._variant.toUpperCase()}
                    </Text>
                  </View>
                  {randomized._randomEvents.length > 0 && (
                    <View style={[styles.variantChip, { backgroundColor: '#EF444420' }]}>
                      <Text style={[styles.variantText, { color: '#EF4444' }]}>
                        {randomized._randomEvents.length} EVENTS
                      </Text>
                    </View>
                  )}
                </View>

                {/* Initial Vitals Preview */}
                <View style={styles.vitalsPreview}>
                  <Text style={styles.vitalsTitle}>Initial Vitals</Text>
                  <View style={styles.vitalsGrid}>
                    <Text style={styles.vitalItem}>HR: {randomized.initialVitals.hr}</Text>
                    <Text style={styles.vitalItem}>BP: {randomized.initialVitals.bp.systolic}/{randomized.initialVitals.bp.diastolic}</Text>
                    <Text style={styles.vitalItem}>SpO₂: {randomized.initialVitals.spo2}%</Text>
                    <Text style={styles.vitalItem}>Lactate: {randomized.initialVitals.lactate}</Text>
                  </View>
                </View>

                {/* Events */}
                {randomized._randomEvents.length > 0 && (
                  <View style={styles.eventsCard}>
                    <Text style={styles.eventsTitle}>⚡ Possible Events</Text>
                    {randomized._randomEvents.map((event, i) => (
                      <Text key={i} style={styles.eventItem}>
                        T+{event.time}m: {event.event}
                      </Text>
                    ))}
                  </View>
                )}
              </>
            )}

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable style={styles.rerollBtn} onPress={handleRandomize}>
                <Ionicons name="dice" size={20} color="#FFF" />
                <Text style={styles.rerollText}>Re-roll</Text>
              </Pressable>
              <Pressable style={styles.startBtn} onPress={handleStart}>
                <Ionicons name="play" size={20} color="#0F172A" />
                <Text style={styles.startText}>Start Case</Text>
              </Pressable>
            </View>

            <Pressable style={styles.cancelBtn} onPress={() => setShowPreview(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#8B5CF640',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dice: {
    fontSize: 32,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 20,
    gap: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
  },
  seedCard: {
    backgroundColor: '#8B5CF620',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8B5CF640',
  },
  seedText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#A78BFA',
  },
  seedSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  patientCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  patientDetails: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  variantsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  variantChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  variantText: {
    fontSize: 11,
    fontWeight: '700',
  },
  vitalsPreview: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
  },
  vitalsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vitalItem: {
    fontSize: 12,
    color: '#CBD5E1',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  eventsCard: {
    backgroundColor: '#EF444410',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  eventsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FCA5A5',
    marginBottom: 6,
  },
  eventItem: {
    fontSize: 11,
    color: '#FCA5A5',
    paddingVertical: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  rerollBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#8B5CF6',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  rerollText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  startBtn: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#10B981',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  startText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    alignItems: 'center',
    padding: 8,
  },
  cancelText: {
    color: '#64748B',
    fontSize: 13,
  },
});
