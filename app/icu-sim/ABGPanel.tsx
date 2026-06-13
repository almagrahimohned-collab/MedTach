import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { calculateABG, generateABGReport, ABGInputs, ABGResult } from './abgCalculator';
import { VentilatorSettings } from './VentilatorModal';

interface ABGPanelProps {
  vitals: {
    spo2: number;
    rr: number;
    temp: number;
    lactate: number;
    ph?: number;
    glucose?: number;
    potassium?: number;
    sodium?: number;
    chloride?: number;
    bicarbonate?: number;
    ketones?: number;
  };
  ventSettings: VentilatorSettings;
  expanded?: boolean;
  onToggle?: () => void;
}

export default function ABGPanel({ vitals, ventSettings, expanded = false, onToggle }: ABGPanelProps) {
  const abg: ABGResult = useMemo(() => {
    const inputs: ABGInputs = {
      spo2: vitals.spo2,
      rr: vitals.rr,
      temp: vitals.temp,
      lactate: vitals.lactate,
      fio2: ventSettings.fio2,
      peep: ventSettings.peep,
      tidalVolume: ventSettings.tidalVolume,
      mode: ventSettings.mode,
      glucose: vitals.glucose,
      potassium: vitals.potassium,
      sodium: vitals.sodium,
      chloride: vitals.chloride,
      bicarbonate: vitals.bicarbonate,
      ketones: vitals.ketones,
    };
    return calculateABG(inputs);
  }, [vitals.spo2, vitals.rr, vitals.temp, vitals.lactate, ventSettings]);

  const getPHColor = (ph: number) => {
    if (ph < 7.15) return '#EF4444';
    if (ph < 7.30) return '#F97316';
    if (ph < 7.35) return '#F59E0B';
    if (ph <= 7.45) return '#10B981';
    if (ph <= 7.55) return '#F59E0B';
    return '#EF4444';
  };

  const getPFColor = (pf: number) => {
    if (pf > 400) return '#10B981';
    if (pf > 300) return '#F59E0B';
    if (pf > 200) return '#F97316';
    return '#EF4444';
  };

  if (!expanded) {
    return (
      <Pressable style={styles.collapsed} onPress={onToggle}>
        <View style={styles.collapsedRow}>
          <Ionicons name="flask" size={16} color="#38BDF8" />
          <Text style={[styles.phValue, { color: getPHColor(abg.ph) }]}>
            pH {abg.ph.toFixed(2)}
          </Text>
          <Text style={styles.separator}>|</Text>
          <Text style={styles.abgValue}>PaO₂ {abg.pao2}</Text>
          <Text style={styles.separator}>|</Text>
          <Text style={styles.abgValue}>PaCO₂ {abg.paco2}</Text>
          <Text style={styles.separator}>|</Text>
          <Text style={styles.abgValue}>HCO₃ {abg.hco3}</Text>
          <Ionicons name="chevron-down" size={14} color="#64748B" />
        </View>
      </Pressable>
    );
  }

  const pfRatio = Math.round(abg.pao2 / ventSettings.fio2);

  return (
    <View style={styles.expanded}>
      <Pressable style={styles.header} onPress={onToggle}>
        <View style={styles.headerLeft}>
          <Ionicons name="flask" size={20} color="#38BDF8" />
          <Text style={styles.title}>ABG Analysis</Text>
        </View>
        <Ionicons name="chevron-up" size={20} color="#64748B" />
      </Pressable>

      {/* pH Scale */}
      <View style={styles.phScale}>
        <Text style={styles.scaleLabel}>Acidemia</Text>
        <View style={styles.scaleBar}>
          <View style={[styles.scaleIndicator, { left: `${((abg.ph - 6.8) / 0.9) * 100}%`, backgroundColor: getPHColor(abg.ph) }]} />
        </View>
        <Text style={styles.scaleLabel}>Alkalemia</Text>
      </View>
      <View style={styles.scaleRange}>
        <Text style={styles.rangeText}>6.80</Text>
        <Text style={[styles.rangeText, { color: '#10B981' }]}>7.35-7.45</Text>
        <Text style={styles.rangeText}>7.70</Text>
      </View>

      {/* Values Grid */}
      <View style={styles.valuesGrid}>
        <View style={[styles.valueCard, { borderLeftColor: getPHColor(abg.ph) }]}>
          <Text style={styles.valueLabel}>pH</Text>
          <Text style={[styles.valueNumber, { color: getPHColor(abg.ph) }]}>{abg.ph.toFixed(2)}</Text>
          <Text style={styles.valueRange}>7.35-7.45</Text>
        </View>
        <View style={[styles.valueCard, { borderLeftColor: abg.pao2 > 80 ? '#10B981' : '#EF4444' }]}>
          <Text style={styles.valueLabel}>PaO₂</Text>
          <Text style={[styles.valueNumber, { color: abg.pao2 > 80 ? '#10B981' : '#EF4444' }]}>{abg.pao2}</Text>
          <Text style={styles.valueRange}>80-100</Text>
        </View>
        <View style={[styles.valueCard, { borderLeftColor: abg.paco2 > 45 ? '#EF4444' : abg.paco2 < 35 ? '#F59E0B' : '#10B981' }]}>
          <Text style={styles.valueLabel}>PaCO₂</Text>
          <Text style={[styles.valueNumber, { color: abg.paco2 > 45 ? '#EF4444' : abg.paco2 < 35 ? '#F59E0B' : '#10B981' }]}>{abg.paco2}</Text>
          <Text style={styles.valueRange}>35-45</Text>
        </View>
        <View style={[styles.valueCard, { borderLeftColor: abg.hco3 < 22 ? '#EF4444' : abg.hco3 > 26 ? '#F59E0B' : '#10B981' }]}>
          <Text style={styles.valueLabel}>HCO₃</Text>
          <Text style={[styles.valueNumber, { color: abg.hco3 < 22 ? '#EF4444' : abg.hco3 > 26 ? '#F59E0B' : '#10B981' }]}>{abg.hco3}</Text>
          <Text style={styles.valueRange}>22-26</Text>
        </View>
      </View>

      {/* P/F Ratio */}
      <View style={[styles.pfCard, { borderLeftColor: getPFColor(pfRatio) }]}>
        <Text style={styles.pfLabel}>P/F Ratio</Text>
        <Text style={[styles.pfNumber, { color: getPFColor(pfRatio) }]}>{pfRatio}</Text>
        <Text style={styles.pfInterpretation}>
          {pfRatio > 400 ? 'Normal' : pfRatio > 300 ? 'Mild' : pfRatio > 200 ? 'Moderate ARDS' : pfRatio > 100 ? 'Severe ARDS' : 'Critical'}
        </Text>
      </View>

      {/* Interpretation */}
      <View style={styles.interpretation}>
        <Text style={styles.interpTitle}>📋 Interpretation</Text>
        <Text style={styles.interpText}>🫁 {abg.oxygenation}</Text>
        <Text style={styles.interpText}>💨 {abg.ventilation}</Text>
        <Text style={styles.interpText}>🧪 {abg.primaryDisorder}</Text>
        {abg.expectedCompensation && (
          <Text style={styles.interpSub}>{abg.expectedCompensation}</Text>
        )}
        {abg.anionGap !== undefined && (
          <Text style={[styles.interpText, { color: abg.anionGap > 12 ? '#EF4444' : '#10B981' }]}>
            ⚡ Anion Gap: {abg.anionGap} {abg.anionGap > 12 ? '(↑ Elevated)' : '(Normal)'}
          </Text>
        )}
      </View>

      <Text style={styles.realtime}>🔄 Real-time • updates every 2s</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  collapsed: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 10,
    marginBottom: 4,
  },
  collapsedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  separator: {
    color: '#334155',
    fontSize: 12,
  },
  abgValue: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  expanded: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  phScale: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scaleLabel: {
    fontSize: 9,
    color: '#64748B',
    width: 55,
    textAlign: 'center',
  },
  scaleBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#334155',
    position: 'relative',
  },
  scaleIndicator: {
    position: 'absolute',
    top: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  scaleRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 63,
    marginTop: -4,
  },
  rangeText: {
    fontSize: 8,
    color: '#64748B',
  },
  valuesGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  valueCard: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderLeftWidth: 3,
  },
  valueLabel: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
  },
  valueNumber: {
    fontSize: 18,
    fontWeight: '800',
    marginVertical: 2,
  },
  valueRange: {
    fontSize: 7,
    color: '#64748B',
  },
  pfCard: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pfLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  pfNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  pfInterpretation: {
    fontSize: 11,
    color: '#CBD5E1',
    flex: 1,
    textAlign: 'right',
  },
  interpretation: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 10,
    gap: 3,
  },
  interpTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  interpText: {
    fontSize: 11,
    color: '#CBD5E1',
  },
  interpSub: {
    fontSize: 10,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  realtime: {
    fontSize: 9,
    color: '#64748B',
    textAlign: 'center',
  },
});
