import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, Pressable, ScrollView, Animated, Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../../../src/store';
import { contentService } from '../../../src/services/contentService';
import { Ionicons } from '@expo/vector-icons';

const specialtyData: Record<string, any> = {
  cardiology: { name: 'Internal Medicine', gradient: ['#3B82F6', '#1D4ED8'], subs: [
    { name: 'Cardiology', icon: 'heart-outline', desc: 'Heart & vascular diseases' },
    { name: 'Pulmonology', icon: 'leaf-outline', desc: 'Lung & breathing disorders' },
    { name: 'Gastroenterology', icon: 'nutrition-outline', desc: 'Digestive system' },
    { name: 'Endocrinology', icon: 'pulse-outline', desc: 'Hormones & metabolism' },
    { name: 'Nephrology', icon: 'water-outline', desc: 'Kidney diseases' },
    { name: 'Hematology', icon: 'color-filter-outline', desc: 'Blood disorders' },
    { name: 'Infectious Diseases', icon: 'bug-outline', desc: 'Infections' },
    { name: 'Rheumatology', icon: 'body-outline', desc: 'Joints & autoimmune' },
  ]},
  pediatrics: { name: 'Pediatrics', gradient: ['#F59E0B', '#B45309'], subs: [
    { name: 'Neonatology', icon: 'leaf-outline', desc: 'Newborn intensive care' },
    { name: 'General Pediatrics', icon: 'happy-outline', desc: 'Child healthcare' },
    { name: 'Pediatric Cardiology', icon: 'heart-outline', desc: 'Children heart diseases' },
    { name: 'Pediatric Neurology', icon: 'brain-outline', desc: 'Children brain disorders' },
    { name: 'Pediatric ID', icon: 'shield-outline', desc: 'Pediatric infections' },
  ]},
  surgery: { name: 'Surgery', gradient: ['#EF4444', '#991B1B'], subs: [
    { name: 'General Surgery', icon: 'cut-outline', desc: 'Common procedures' },
    { name: 'Orthopedics', icon: 'bone-outline', desc: 'Bone & joint surgery' },
    { name: 'Neurosurgery', icon: 'brain-outline', desc: 'Brain & spine surgery' },
    { name: 'Cardiothoracic', icon: 'heart-outline', desc: 'Heart & lung surgery' },
    { name: 'Vascular Surgery', icon: 'pulse-outline', desc: 'Blood vessel surgery' },
    { name: 'Plastic Surgery', icon: 'color-wand-outline', desc: 'Reconstructive surgery' },
  ]},
  gynecology: { name: 'OB/GYN', gradient: ['#8B5CF6', '#5B21B6'], subs: [
    { name: 'Obstetrics', icon: 'people-outline', desc: 'Pregnancy & childbirth' },
    { name: 'Gynecology', icon: 'female-outline', desc: 'Reproductive health' },
    { name: 'Reproductive Endocrinology', icon: 'flask-outline', desc: 'Hormonal disorders' },
    { name: 'Maternal-Fetal Medicine', icon: 'heart-outline', desc: 'High-risk pregnancy' },
    { name: 'Urogynecology', icon: 'water-outline', desc: 'Pelvic floor disorders' },
  ]},
};

const levels = [
  { id: 'beginner', label: 'Intern', icon: 'school-outline', gradient: ['#10B981', '#047857'], desc: 'Medical student or intern' },
  { id: 'intermediate', label: 'Resident', icon: 'medkit-outline', gradient: ['#F59E0B', '#B45309'], desc: 'Resident physician' },
  { id: 'advanced', label: 'Specialist', icon: 'ribbon-outline', gradient: ['#EF4444', '#991B1B'], desc: 'Experienced specialist' },
];

export default function SpecialtyDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const setCategory = useStore((s) => s.setCategory);
  const [sub, setSub] = useState('');
  const [level, setLevel] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [availableLevels, setAvailableLevels] = useState<string[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const specialty = specialtyData[id as string];

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    loadAvailableLevels();
  }, [sub]);

  const loadAvailableLevels = async () => {
    try {
      const index = await contentService.getIndex();
      const specId = (id as string).toLowerCase();
      const lvls = Object.entries(index.cases_by_specialty[specId] || {})
        .filter(([_, count]) => (count as number) > 0)
        .map(([lvl]) => lvl);
      setAvailableLevels(lvls.length > 0 ? lvls : ['beginner', 'intermediate', 'advanced']);
    } catch { setAvailableLevels(['beginner', 'intermediate', 'advanced']); }
  };

  if (!specialty) {
    return (
      <View style={styles.errorScreen}>
        <Ionicons name="alert-circle" size={50} color="#EF4444" />
        <Text style={styles.errorTitle}>Specialty Not Found</Text>
        <Pressable style={styles.errorBtn} onPress={() => router.back()}>
          <Text style={styles.errorBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const handleStart = () => {
    if (!sub || !level) return;
    setShowConfirm(true);
  };

  const confirmStart = () => {
    setShowConfirm(false);
    setCategory(id as string, sub, level);
    router.push('/cases');
  };

  const selectedLevel = levels.find(l => l.id === level);
  const filteredLevels = levels.filter(l => availableLevels.includes(l.id));

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={18} color="#94A3B8" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <View style={[styles.heroCard, { backgroundColor: specialty.gradient[0] + '20' }]}>
            <Text style={[styles.heroTitle, { color: specialty.gradient[0] }]}>{specialty.name}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sub-Category</Text>
            <View style={styles.subGrid}>
              {specialty.subs.map((item: any) => {
                const isSelected = sub === item.name;
                return (
                  <Pressable
                    key={item.name}
                    style={[styles.subCard, isSelected && { borderColor: specialty.gradient[0], backgroundColor: specialty.gradient[0] + '15' }]}
                    onPress={() => { setSub(item.name); setLevel(''); }}
                  >
                    <Ionicons name={item.icon} size={20} color={isSelected ? specialty.gradient[0] : '#94A3B8'} />
                    <Text style={[styles.subName, isSelected && { color: specialty.gradient[0] }]}>{item.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {sub && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience Level</Text>
              <View style={styles.levelRow}>
                {filteredLevels.map((lvl) => {
                  const isSelected = level === lvl.id;
                  return (
                    <Pressable
                      key={lvl.id}
                      style={[styles.levelCard, isSelected && { borderColor: lvl.gradient[0], backgroundColor: lvl.gradient[0] + '15' }]}
                      onPress={() => setLevel(lvl.id)}
                    >
                      <Ionicons name={lvl.icon as any} size={24} color={isSelected ? lvl.gradient[0] : '#94A3B8'} />
                      <Text style={[styles.levelName, isSelected && { color: lvl.gradient[0] }]}>{lvl.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {sub && level && (
            <Pressable style={[styles.startBtn, { backgroundColor: specialty.gradient[0] }]} onPress={handleStart}>
              <Text style={styles.startBtnText}>Start Diagnostic Session</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </Pressable>
          )}

        </Animated.View>
      </ScrollView>

      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmCard}>
            <Ionicons name="checkmark-circle" size={50} color="#10B981" />
            <Text style={styles.confirmTitle}>Begin Session?</Text>
            <Text style={styles.confirmText}>
              {specialty.name} → {sub}{'\n'}
              Level: {selectedLevel?.label}
            </Text>
            <View style={styles.confirmBtns}>
              <Pressable style={styles.confirmCancel} onPress={() => setShowConfirm(false)}>
                <Text style={styles.confirmCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.confirmStart, { backgroundColor: specialty.gradient[0] }]} onPress={confirmStart}>
                <Text style={styles.confirmStartText}>Start</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  scrollContent: { paddingBottom: 40 },
  content: { padding: 20 },
  errorScreen: { flex: 1, backgroundColor: '#0A0E1A', justifyContent: 'center', alignItems: 'center', gap: 16 },
  errorTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700' },
  errorBtn: { backgroundColor: '#1E293B', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  errorBtnText: { color: '#38BDF8', fontWeight: '600' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 20 },
  backText: { color: '#64748B', fontSize: 12, fontWeight: '600' },
  heroCard: { padding: 20, borderRadius: 16, marginBottom: 24, alignItems: 'center' },
  heroTitle: { fontSize: 24, fontWeight: '800' },
  section: { marginBottom: 24 },
  sectionTitle: { color: '#94A3B8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  subGrid: { gap: 8 },
  subCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#1E293B', padding: 14, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#334155',
  },
  subName: { color: '#E2E8F0', fontSize: 14, fontWeight: '600' },
  levelRow: { flexDirection: 'row', gap: 10 },
  levelCard: {
    flex: 1, alignItems: 'center', gap: 8,
    backgroundColor: '#1E293B', padding: 20, borderRadius: 14,
    borderWidth: 2, borderColor: '#334155',
  },
  levelName: { color: '#E2E8F0', fontSize: 13, fontWeight: '700' },
  startBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 18, borderRadius: 16, gap: 8, marginTop: 10,
  },
  startBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 40 },
  confirmCard: { backgroundColor: '#1E293B', padding: 28, borderRadius: 20, alignItems: 'center', gap: 12, width: '100%', borderWidth: 1, borderColor: '#334155' },
  confirmTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '700' },
  confirmText: { color: '#94A3B8', fontSize: 14, textAlign: 'center', lineHeight: 22 },
  confirmBtns: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 8 },
  confirmCancel: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#334155', alignItems: 'center' },
  confirmCancelText: { color: '#E2E8F0', fontWeight: '600' },
  confirmStart: { flex: 2, padding: 14, borderRadius: 12, alignItems: 'center' },
  confirmStartText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});
