import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

interface MonitorProps {
  hr: number;
  spo2: number;
  rr: number;
  map: number;
  temp: number;
  systolic: number;
  diastolic: number;
}

export default function PatientMonitor({ hr, spo2, rr, map, temp, systolic, diastolic }: MonitorProps) {
  // ECG Wave animation
  const ecgTranslateX = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const alarmAnim = useRef(new Animated.Value(0)).current;

  // ECG Waveform loop
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(ecgTranslateX, {
        toValue: -200,
        duration: 60000 / (hr || 60),
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [hr]);

  // Pulse animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 60000 / (hr || 60) - 300,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [hr]);

  // Alarm flash
  useEffect(() => {
    if (spo2 < 90 || map < 65) {
      const alarm = Animated.loop(
        Animated.sequence([
          Animated.timing(alarmAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(alarmAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      alarm.start();
      return () => alarm.stop();
    } else {
      alarmAnim.setValue(0);
    }
  }, [spo2 < 90 || map < 65]);

  const isAlarming = spo2 < 90 || map < 65 || hr > 140 || hr < 40;

  // ECG Wave Points (simulated complex)
  const ecgWave = [
    'M0,25 L10,25 L12,25 L14,15 L15,10 L16,5 L17,0 L18,5 L19,20 L20,25 L22,25 L24,25',
    'L26,25 L28,25 L30,25 L32,25 L34,25 L36,25 L38,25 L40,25',
    'L42,25 L44,25 L46,25 L48,25 L50,25 L52,25 L54,25 L56,25',
    'L58,25 L60,25 L62,25 L64,25 L66,25 L68,25 L70,25',
  ].join(' ');

  return (
    <View style={[styles.container, isAlarming && styles.alarmingContainer]}>
      {/* Monitor Screen Border */}
      <View style={styles.screen}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Text style={styles.patientInfo}>ICU-3 | Adult</Text>
          <Text style={styles.monitorBrand}>MedTach Monitor</Text>
        </View>

        {/* ECG Waveform */}
        <View style={styles.ecgSection}>
          <View style={styles.ecgGrid}>
            {/* Grid lines */}
            {[...Array(5)].map((_, i) => (
              <View key={i} style={[styles.gridLine, { top: i * 20 }]} />
            ))}
            
            {/* ECG Wave */}
            <Animated.View style={[styles.ecgWave, { transform: [{ translateX: ecgTranslateX }] }]}>
              <svg width="300" height="80" viewBox="0 0 300 50">
                <polyline
                  points="0,25 10,25 12,25 14,18 15,12 16,5 17,0 18,5 19,22 20,25 22,25 25,25 30,25 35,25 40,25 45,25 50,25 55,25 60,25 65,25 70,25 75,25 80,25 85,25 90,25 95,25 100,25"
                  fill="none"
                  stroke={isAlarming ? '#EF4444' : '#10B981'}
                  strokeWidth="2"
                />
                <polyline
                  points="100,25 110,25 112,25 114,18 115,12 116,5 117,0 118,5 119,22 120,25 122,25 125,25 130,25 135,25 140,25 145,25 150,25 155,25 160,25 165,25 170,25 175,25 180,25 185,25 190,25 195,25 200,25"
                  fill="none"
                  stroke={isAlarming ? '#EF4444' : '#10B981'}
                  strokeWidth="2"
                />
              </svg>
            </Animated.View>
          </View>
          <Text style={styles.ecgLead}>Lead II</Text>
        </View>

        {/* Vital Signs */}
        <View style={styles.vitalsRow}>
          {/* HR */}
          <View style={styles.vitalBox}>
            <Animated.View style={[styles.vitalCard, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={[styles.vitalNumber, (hr > 140 || hr < 40) && styles.alarming]}>
                {hr}
              </Text>
            </Animated.View>
            <Text style={styles.vitalUnit}>BPM</Text>
            <Text style={styles.vitalLabel}>❤️ HR</Text>
          </View>

          {/* BP */}
          <View style={styles.vitalBox}>
            <Text style={[styles.vitalNumber, map < 65 && styles.alarming]}>
              {systolic}/{diastolic}
            </Text>
            <Text style={styles.vitalUnit}>({map})</Text>
            <Text style={styles.vitalLabel}>💉 BP</Text>
          </View>

          {/* SpO2 */}
          <View style={styles.vitalBox}>
            <Animated.View style={{ opacity: spo2 < 90 ? alarmAnim : 1 }}>
              <Text style={[styles.vitalNumber, spo2 < 90 && styles.alarming]}>
                {spo2}
              </Text>
            </Animated.View>
            <Text style={styles.vitalUnit}>%</Text>
            <Text style={styles.vitalLabel}>🫁 SpO₂</Text>
          </View>

          {/* RR */}
          <View style={styles.vitalBox}>
            <Text style={[styles.vitalNumber, rr > 30 && styles.alarming]}>
              {rr}
            </Text>
            <Text style={styles.vitalUnit}>/min</Text>
            <Text style={styles.vitalLabel}>🫀 RR</Text>
          </View>

          {/* Temp */}
          <View style={styles.vitalBox}>
            <Text style={[styles.vitalNumber, (temp > 39 || temp < 35) && styles.alarming]}>
              {temp.toFixed(1)}
            </Text>
            <Text style={styles.vitalUnit}>°C</Text>
            <Text style={styles.vitalLabel}>🌡 Temp</Text>
          </View>
        </View>

        {/* Bottom Status Bar */}
        <View style={styles.statusBar}>
          <Text style={styles.statusItem}>
            {isAlarming ? '⚠️ ALARM' : '✅ Stable'}
          </Text>
          <Text style={styles.statusItem}>NIBP: Auto</Text>
          <Text style={styles.statusItem}>Alarm Limits: Set</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    borderRadius: 16,
    padding: 8,
    borderWidth: 2,
    borderColor: '#1A1A2E',
  },
  alarmingContainer: {
    borderColor: '#EF4444',
  },
  screen: {
    backgroundColor: '#0A0A0A',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A2E',
    paddingBottom: 6,
  },
  patientInfo: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '700',
  },
  monitorBrand: {
    fontSize: 9,
    color: '#333',
    fontWeight: '600',
  },
  ecgSection: {
    height: 70,
    backgroundColor: '#000',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#111',
  },
  ecgGrid: {
    flex: 1,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#0A1A0A',
  },
  ecgWave: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  ecgLead: {
    position: 'absolute',
    top: 4,
    right: 8,
    fontSize: 8,
    color: '#1A3A1A',
    fontWeight: '600',
  },
  vitalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  vitalBox: {
    flex: 1,
    alignItems: 'center',
    gap: 1,
  },
  vitalCard: {
    backgroundColor: '#0A0A0A',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#1A1A2E',
    alignItems: 'center',
    width: '100%',
  },
  vitalNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#10B981',
    fontFamily: 'monospace',
  },
  alarming: {
    color: '#EF4444',
  },
  vitalUnit: {
    fontSize: 8,
    color: '#555',
    fontFamily: 'monospace',
  },
  vitalLabel: {
    fontSize: 8,
    color: '#555',
    fontWeight: '600',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#1A1A2E',
    paddingTop: 6,
  },
  statusItem: {
    fontSize: 8,
    color: '#333',
    fontWeight: '600',
  },
});
