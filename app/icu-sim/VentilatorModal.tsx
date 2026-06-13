import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface VentilatorSettings {
  mode: 'VCV' | 'PCV' | 'SIMV' | 'PSV';
  fio2: number;
  peep: number;
  tidalVolume: number;
  respiratoryRate: number;
  pressureSupport: number;
  triggerSensitivity: number;
}

interface VentilatorModalProps {
  visible: boolean;
  current: VentilatorSettings;
  onSave: (settings: VentilatorSettings) => void;
  onClose: () => void;
}

export const DEFAULT_VENT_SETTINGS: VentilatorSettings = {
  mode: 'VCV',
  fio2: 0.60,
  peep: 8,
  tidalVolume: 450,
  respiratoryRate: 16,
  pressureSupport: 10,
  triggerSensitivity: 2,
};

export default function VentilatorModal({ visible, current, onSave, onClose }: VentilatorModalProps) {
  const [settings, setSettings] = useState<VentilatorSettings>(current || DEFAULT_VENT_SETTINGS);
  const [tempValue, setTempValue] = useState('');

  const modes = ['VCV', 'PCV', 'SIMV', 'PSV'] as const;

  const adjust = (key: keyof VentilatorSettings, delta: number, min: number, max: number) => {
    setSettings(prev => ({
      ...prev,
      [key]: Math.max(min, Math.min(max, Math.round((prev[key] as number + delta) * 10) / 10)),
    }));
  };

  const renderSlider = (label: string, value: number, unit: string, key: keyof VentilatorSettings, min: number, max: number, step: number) => (
    <View style={styles.paramRow}>
      <Text style={styles.paramLabel}>{label}</Text>
      <View style={styles.paramControls}>
        <Pressable style={styles.paramBtn} onPress={() => adjust(key, -step, min, max)}>
          <Ionicons name="remove" size={20} color="#F8FAFC" />
        </Pressable>
        <View style={styles.paramValueBox}>
          <Text style={styles.paramValue}>{typeof value === 'number' ? value.toFixed(value < 1 ? 2 : 0) : value}</Text>
          <Text style={styles.paramUnit}>{unit}</Text>
        </View>
        <Pressable style={styles.paramBtn} onPress={() => adjust(key, step, min, max)}>
          <Ionicons name="add" size={20} color="#F8FAFC" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="leaf" size={24} color="#10B981" />
              <Text style={styles.title}>Ventilator Settings</Text>
            </View>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="#94A3B8" />
            </Pressable>
          </View>

          {/* Mode Selector */}
          <Text style={styles.sectionLabel}>Mode</Text>
          <View style={styles.modeGrid}>
            {modes.map(mode => (
              <Pressable
                key={mode}
                style={[styles.modeBtn, settings.mode === mode && styles.modeBtnActive]}
                onPress={() => setSettings(prev => ({ ...prev, mode }))}
              >
                <Text style={[styles.modeText, settings.mode === mode && styles.modeTextActive]}>{mode}</Text>
              </Pressable>
            ))}
          </View>

          {/* Parameters */}
          <View style={styles.paramsSection}>
            {renderSlider('FiO₂', settings.fio2, '', 'fio2', 0.21, 1.0, 0.05)}
            {renderSlider('PEEP', settings.peep, 'cmH₂O', 'peep', 0, 25, 1)}
            {renderSlider('Tidal Volume', settings.tidalVolume, 'mL', 'tidalVolume', 200, 800, 10)}
            {renderSlider('Rate', settings.respiratoryRate, '/min', 'respiratoryRate', 8, 35, 1)}
            {renderSlider('Pressure Support', settings.pressureSupport, 'cmH₂O', 'pressureSupport', 0, 30, 1)}
            {renderSlider('Trigger', settings.triggerSensitivity, 'L/min', 'triggerSensitivity', 1, 10, 0.5)}
          </View>

          {/* Calculated Values */}
          <View style={styles.calculatedSection}>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Plateau Pressure</Text>
              <Text style={styles.calcValue}>
                {Math.round(settings.peep + (settings.tidalVolume / 30))} cmH₂O
              </Text>
            </View>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Compliance</Text>
              <Text style={styles.calcValue}>
                {Math.round(settings.tidalVolume / (settings.peep + (settings.tidalVolume / 30) - settings.peep))} mL/cmH₂O
              </Text>
            </View>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Minute Ventilation</Text>
              <Text style={styles.calcValue}>
                {(settings.tidalVolume * settings.respiratoryRate / 1000).toFixed(1)} L/min
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.saveBtn} onPress={() => onSave(settings)}>
              <Ionicons name="checkmark" size={20} color="#0F172A" />
              <Text style={styles.saveText}>Apply Settings</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  modeGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modeBtnActive: {
    backgroundColor: '#10B98120',
    borderColor: '#10B981',
  },
  modeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  modeTextActive: {
    color: '#10B981',
  },
  paramsSection: {
    gap: 8,
    marginBottom: 16,
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paramLabel: {
    fontSize: 13,
    color: '#CBD5E1',
    flex: 1,
  },
  paramControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paramBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paramValueBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    minWidth: 50,
    justifyContent: 'center',
  },
  paramValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  paramUnit: {
    fontSize: 10,
    color: '#64748B',
  },
  calculatedSection: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    gap: 6,
    marginBottom: 16,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calcLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  calcValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#334155',
    alignItems: 'center',
  },
  cancelText: {
    color: '#CBD5E1',
    fontSize: 15,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },
});
