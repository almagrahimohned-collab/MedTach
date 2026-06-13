import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ========== Clinical Pearls Database ==========
export const CLINICAL_PEARLS = {
  septic_shock: [
    { title: 'SSC 2021', text: '30mL/kg crystalloid within 3 hours of recognition', source: 'Surviving Sepsis Campaign' },
    { title: 'Early Antibiotics', text: 'Every hour delay increases mortality by 7-8%', source: 'Kumar et al., 2006' },
    { title: 'MAP Target', text: 'MAP ≥ 65 mmHg is the initial target for vasopressor therapy', source: 'SEPSISPAM Trial' },
    { title: 'Lactate Clearance', text: '>10% lactate clearance at 2 hours predicts survival', source: 'Rivers et al., 2001' },
    { title: 'Steroids', text: 'Hydrocortisone 50mg q6h if vasopressor-dependent', source: 'ADRENAL Trial' },
  ],
  dka: [
    { title: 'Fluid Protocol', text: '0.9% NaCl 15-20 mL/kg in first hour, then 250-500 mL/hr', source: 'ADA Guidelines 2024' },
    { title: 'Insulin Rate', text: '0.1 units/kg/hr IV, target glucose drop 50-75 mg/dL/hr', source: 'UK DKA Guidelines' },
    { title: 'Potassium', text: 'Start K+ replacement when K < 5.0 mEq/L', source: 'ADA Guidelines' },
    { title: 'Bicarbonate', text: 'NOT recommended unless pH < 6.9 (controversial)', source: 'Cochrane Review' },
    { title: 'Transition', text: 'Switch to SC insulin when: AG closed, pH > 7.30, HCO3 > 18, patient eating', source: 'Joint British Guidelines' },
  ],
  cardiogenic_shock: [
    { title: 'Inotrope First', text: 'Dobutamine is first-line inotrope for cardiogenic shock', source: 'ESC Guidelines 2023' },
    { title: 'Avoid Fluids', text: 'Excessive fluids worsen pulmonary edema in cardiogenic shock', source: 'ESC Heart Failure Guidelines' },
    { title: 'Revascularization', text: 'Emergency PCI reduces mortality by 50%', source: 'SHOCK Trial' },
    { title: 'Mechanical Support', text: 'Consider IABP or Impella if refractory to pharmacotherapy', source: 'DanGer Shock Trial' },
    { title: 'MAP Target', text: 'MAP ≥ 65 mmHg, but avoid excessive afterload', source: 'ESC Guidelines' },
  ],
};

interface ClinicalPearlsProps {
  scenarioId: string;
  visible: boolean;
  onClose: () => void;
}

export default function ClinicalPearls({ scenarioId, visible, onClose }: ClinicalPearlsProps) {
  const pearls = CLINICAL_PEARLS[scenarioId as keyof typeof CLINICAL_PEARLS] || [];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>📚 Clinical Pearls</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#94A3B8" />
            </Pressable>
          </View>

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {pearls.map((pearl, i) => (
              <View key={i} style={styles.pearlCard}>
                <View style={styles.pearlHeader}>
                  <Ionicons name="bulb" size={20} color="#F59E0B" />
                  <Text style={styles.pearlTitle}>{pearl.title}</Text>
                </View>
                <Text style={styles.pearlText}>{pearl.text}</Text>
                <Text style={styles.pearlSource}>📖 {pearl.source}</Text>
              </View>
            ))}
          </ScrollView>

          <Pressable style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneBtnText}>Got it!</Text>
          </Pressable>
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
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  closeBtn: {
    padding: 4,
  },
  list: {
    gap: 10,
  },
  pearlCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  pearlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  pearlTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  pearlText: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 20,
    marginBottom: 6,
  },
  pearlSource: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
  },
  doneBtn: {
    backgroundColor: '#F59E0B',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  doneBtnText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
});
