import React from 'react';
import { StyleSheet, Text, View, Pressable, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function HelpModal({ visible, onClose }: HelpModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>🩺 ICU Simulator Guide</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="#94A3B8" />
            </Pressable>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* About */}
            <Text style={styles.sectionTitle}>📋 About this Mode</Text>
            <Text style={styles.text}>
              The ICU Simulator places you in charge of a critically ill patient in the Intensive Care Unit. Your goal is to diagnose, treat, and stabilize the patient using real ICU medications, procedures, and investigations.
            </Text>

            {/* Time System */}
            <Text style={styles.sectionTitle}>⏱ Compressed Time System</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Real Time</Text>
                <Text style={styles.tableHeader}>Simulation Time</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>1 second</Text>
                <Text style={styles.tableCell}>1 minute</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>1 minute</Text>
                <Text style={styles.tableCell}>1 hour</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>6-10 minutes</Text>
                <Text style={styles.tableCell}>Full ICU stay</Text>
              </View>
            </View>
            <Text style={styles.note}>⏰ The timer shows simulation time, not real time. Each second = 1 minute of patient time.</Text>

            {/* Medications */}
            <Text style={styles.sectionTitle}>💊 Medications</Text>
            <Text style={styles.text}>Over 80 medications across 14 categories:</Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>💉 <Text style={styles.bold}>Vasopressors</Text> - Raise blood pressure (Noradrenaline, Adrenaline)</Text>
              <Text style={styles.listItem}>💓 <Text style={styles.bold}>Inotropes</Text> - Support heart function (Dobutamine, Milrinone)</Text>
              <Text style={styles.listItem}>🦠 <Text style={styles.bold}>Antibiotics</Text> - Treat infections (Ceftriaxone, Vancomycin)</Text>
              <Text style={styles.listItem}>💧 <Text style={styles.bold}>Fluids</Text> - Volume resuscitation (NS, RL, Blood)</Text>
              <Text style={styles.listItem}>🚿 <Text style={styles.bold}>Diuretics</Text> - Remove excess fluid (Furosemide)</Text>
              <Text style={styles.listItem}>😴 <Text style={styles.bold}>Sedation</Text> - Keep patient comfortable (Propofol, Fentanyl)</Text>
            </View>

            {/* Procedures */}
            <Text style={styles.sectionTitle}>🛠️ Procedures</Text>
            <Text style={styles.text}>20+ ICU procedures available:</Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>🫁 <Text style={styles.bold}>Intubation</Text> - Secure the airway</Text>
              <Text style={styles.listItem}>🩻 <Text style={styles.bold}>Chest Tube</Text> - Drain pneumothorax/hemothorax</Text>
              <Text style={styles.listItem}>💓 <Text style={styles.bold}>Cardioversion</Text> - Correct arrhythmias</Text>
              <Text style={styles.listItem}>⚡ <Text style={styles.bold}>Defibrillation</Text> - Life-saving for cardiac arrest</Text>
              <Text style={styles.listItem}>🔄 <Text style={styles.bold}>CRRT</Text> - Continuous dialysis</Text>
            </View>

            {/* Labs */}
            <Text style={styles.sectionTitle}>🧪 Labs & Imaging</Text>
            <Text style={styles.text}>
              Order CBC, ABG, CMP, coagulation, CRP, procalcitonin, blood cultures, CXR, CT, ECG, ECHO, and more. Results appear instantly in the Labs tab.
            </Text>

            {/* Scoring */}
            <Text style={styles.sectionTitle}>📊 Scoring System</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Action</Text>
                <Text style={styles.tableHeader}>Points</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Patient survives</Text>
                <Text style={[styles.tableCell, { color: '#10B981' }]}>+200</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Antibiotics within 1 hour</Text>
                <Text style={[styles.tableCell, { color: '#10B981' }]}>+50</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Fluid resuscitation</Text>
                <Text style={[styles.tableCell, { color: '#10B981' }]}>+30</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Vasopressors if needed</Text>
                <Text style={[styles.tableCell, { color: '#10B981' }]}>+30</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Patient dies</Text>
                <Text style={[styles.tableCell, { color: '#EF4444' }]}>0</Text>
              </View>
            </View>

            {/* Tips */}
            <Text style={styles.sectionTitle}>💡 Pro Tips</Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>✅ Start with ABC assessment (Airway, Breathing, Circulation)</Text>
              <Text style={styles.listItem}>✅ Give antibiotics EARLY in sepsis (within 1 hour)</Text>
              <Text style={styles.listItem}>✅ Fluid resuscitate first, then add vasopressors if needed</Text>
              <Text style={styles.listItem}>✅ Monitor urine output - best indicator of perfusion</Text>
              <Text style={styles.listItem}>✅ Follow lactate levels to track treatment response</Text>
              <Text style={styles.listItem}>✅ Stop infusions when no longer needed (press ⏹ button)</Text>
              <Text style={styles.listItem}>⚠️ Avoid fluid overload - check CVP regularly</Text>
              <Text style={styles.listItem}>⚠️ Lasix can cause hypotension in hypovolemic patients</Text>
            </View>

            <View style={{ height: 30 }} />
          </ScrollView>

          <Pressable style={styles.gotItBtn} onPress={onClose}>
            <Text style={styles.gotItText}>Got it!</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#1E293B', borderRadius: 20, borderWidth: 1, borderColor: '#334155', maxHeight: '85%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#334155' },
  title: { color: '#F8FAFC', fontSize: 20, fontWeight: '800' },
  content: { padding: 20 },
  sectionTitle: { color: '#38BDF8', fontSize: 15, fontWeight: '700', marginTop: 20, marginBottom: 8 },
  text: { color: '#E2E8F0', fontSize: 13, lineHeight: 22, marginBottom: 8 },
  note: { color: '#F59E0B', fontSize: 12, fontStyle: 'italic', marginTop: 6, lineHeight: 18 },
  table: { backgroundColor: '#0F172A', borderRadius: 10, padding: 10, marginBottom: 10 },
  tableRow: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  tableHeader: { flex: 1, color: '#94A3B8', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  tableCell: { flex: 1, color: '#E2E8F0', fontSize: 13 },
  list: { gap: 6, marginBottom: 8 },
  listItem: { color: '#E2E8F0', fontSize: 12, lineHeight: 20 },
  bold: { fontWeight: '700', color: '#F8FAFC' },
  gotItBtn: { backgroundColor: '#38BDF8', margin: 20, padding: 16, borderRadius: 14, alignItems: 'center' },
  gotItText: { color: '#0F172A', fontSize: 16, fontWeight: '700' },
});
