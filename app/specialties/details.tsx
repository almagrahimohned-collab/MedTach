import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Modal, Animated, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../../src/store';
import { contentService } from '../../src/services/contentService';
import { Ionicons } from '@expo/vector-icons';

const specialtyData: Record<string, any> = {
  cardiology: { name: 'Internal Medicine', gradient: '#3B82F6', icon: 'heart-outline',
    subs: [
      { name: 'Cardiology', icon: 'heart-outline', desc: 'Heart diseases, ECG, echocardiography' },
      { name: 'Pulmonology', icon: 'leaf-outline', desc: 'Asthma, COPD, pneumonia, TB' },
      { name: 'Gastroenterology', icon: 'restaurant-outline', desc: 'Liver, pancreas, GI bleeding' },
      { name: 'Endocrinology', icon: 'flask-outline', desc: 'Diabetes, thyroid, adrenal' },
      { name: 'Nephrology', icon: 'water-outline', desc: 'AKI, CKD, electrolytes' },
      { name: 'Hematology', icon: 'color-filter-outline', desc: 'Anemia, leukemia, coagulation' },
      { name: 'Infectious Disease', icon: 'bug-outline', desc: 'Sepsis, meningitis, TB, HIV' },
      { name: 'Rheumatology', icon: 'body-outline', desc: 'RA, SLE, gout, vasculitis' },
    ],
  },
  pediatrics: { name: 'Pediatrics', gradient: '#F59E0B', icon: 'happy-outline',
    subs: [
      { name: 'Neonatology', icon: 'leaf-outline', desc: 'Prematurity, congenital disorders' },
      { name: 'General Pediatrics', icon: 'happy-outline', desc: 'Growth, development, vaccines' },
      { name: 'Pediatric Cardiology', icon: 'heart-outline', desc: 'Congenital heart diseases' },
      { name: 'Pediatric Neurology', icon: 'brain-outline', desc: 'Epilepsy, cerebral palsy' },
      { name: 'Pediatric ID', icon: 'shield-outline', desc: 'Pediatric infections, fevers' },
      { name: 'Pediatric GI', icon: 'restaurant-outline', desc: 'Pyloric stenosis, intussusception' },
      { name: 'Pediatric Respiratory', icon: 'leaf-outline', desc: 'Asthma, bronchiolitis, CF' },
    ],
  },
  surgery: { name: 'Surgery', gradient: '#EF4444', icon: 'cut-outline',
    subs: [
      { name: 'General Surgery', icon: 'cut-outline', desc: 'Appendicitis, hernia, gallbladder' },
      { name: 'Orthopedics', icon: 'bone-outline', desc: 'Fractures, joint replacement' },
      { name: 'Neurosurgery', icon: 'brain-outline', desc: 'Brain tumors, trauma, spine' },
      { name: 'Cardiothoracic', icon: 'heart-outline', desc: 'CABG, valve surgery, lung' },
      { name: 'Vascular Surgery', icon: 'pulse-outline', desc: 'Aneurysm, bypass, DVT' },
      { name: 'Plastic Surgery', icon: 'color-wand-outline', desc: 'Burns, reconstruction' },
      { name: 'Urology', icon: 'water-outline', desc: 'Kidney stones, BPH' },
      { name: 'ENT', icon: 'ear-outline', desc: 'Tonsils, thyroid, sinuses' },
    ],
  },
  gynecology: { name: 'OB/GYN', gradient: '#8B5CF6', icon: 'female-outline',
    subs: [
      { name: 'Obstetrics', icon: 'people-outline', desc: 'Pregnancy, labor, postpartum' },
      { name: 'Gynecology', icon: 'female-outline', desc: 'Menstrual disorders, infections' },
      { name: 'Reproductive Endocrinology', icon: 'flask-outline', desc: 'Infertility, PCOS, menopause' },
      { name: 'Maternal-Fetal Medicine', icon: 'heart-outline', desc: 'High-risk pregnancy' },
      { name: 'Urogynecology', icon: 'water-outline', desc: 'Pelvic floor disorders' },
    ],
  },
};

const levels = [
  { id: 'beginner', label: 'Intern', icon: 'school-outline', color: '#10B981', desc: 'Medical student or foundation year' },
  { id: 'intermediate', label: 'Resident', icon: 'medkit-outline', color: '#F59E0B', desc: 'In-training resident physician' },
  { id: 'advanced', label: 'Specialist', icon: 'ribbon-outline', color: '#EF4444', desc: 'Experienced attending/specialist' },
];

export default function SpecialtyDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const setCategory = useStore((s) => s.setCategory);
  const [sub, setSub] = useState('');
  const [level, setLevel] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [availableLevels, setAvailableLevels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const specialty = specialtyData[id as string];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
    loadLevels();
  }, []);

  const loadLevels = async () => {
    try {
      const index = await contentService.getIndex();
      const allCases = index.cases || [];
      const relevantCases = allCases.filter((c: any) => c.specialty === (id as string));
      const lvls = [...new Set(relevantCases.map((c: any) => c.difficulty))].filter(Boolean);
      setAvailableLevels(lvls.length > 0 ? lvls : ["beginner", "intermediate", "advanced"]);
    } catch {
      setAvailableLevels(['beginner', 'intermediate', 'advanced']);
    } finally {
      setLoading(false);
    }
  };

  if (!specialty) {
    return (
      <View style={styles.container}><View style={styles.errorCard}><Ionicons name="alert-circle" size={60} color="#EF4444" /><Text style={styles.errorTitle}>Specialty Not Found</Text><Pressable style={styles.backBtnLarge} onPress={() => router.back()}><Ionicons name="arrow-back" size={18} color="#FFF" /><Text style={styles.backBtnLargeText}>Go Back</Text></Pressable></View></View>
    );
  }

  const confirmStart = async () => { setShowConfirm(false); try { const idx = await contentService.getIndex(); const cases = idx.cases || []; const groups: Record<string, string[]> = {"cardiology":["cardiology","pulmonology","neurology","endocrinology","gastroenterology","nephrology","infectious","hematology","rheumatology","dermatology"],"pediatrics":["pediatrics"],"gynecology":["gynecology"],"surgery":["surgery"]}; const match = cases.filter((c) => { const ms = groups[id as string]?.includes(c.specialty) || c.specialty === id; const mb = !sub || c.specialty === sub.toLowerCase().replace(/ /g,"_") || c.specialty.includes(sub.toLowerCase().replace(/ /g,"_")); const ml = !level || c.difficulty === level; return ms && mb && ml; }); if (match.length > 0) { const rc = match[Math.floor(Math.random()*match.length)]; router.push(("/cases/review/"+rc.id) as any); } else { router.push("/cases"); } } catch { router.push("/cases"); } };
  const filteredLevels = levels.filter(l => availableLevels.includes(l.id));

  if (loading) return <View style={styles.container}><ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 100 }} /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Back button in header */}
        <View style={[styles.headerBadge, { backgroundColor: specialty.gradient + '20' }]}>
          <Ionicons name={specialty.icon as any} size={18} color={specialty.gradient} />
          <Text style={[styles.headerBadgeText, { color: specialty.gradient }]}>{specialty.name}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          
          <View style={styles.stepRow}><View style={[styles.stepBadge, { backgroundColor: specialty.gradient }]}><Text style={styles.stepNumber}>1</Text></View><Text style={styles.stepTitle}>Choose Sub-Specialty</Text></View>
          
          <View style={styles.subGrid}>
            {specialty.subs.map((item: any) => {
              const isSelected = sub === item.name;
              return (
                <Pressable key={item.name} style={[styles.subCard, isSelected && { borderColor: specialty.gradient, backgroundColor: specialty.gradient + '10' }]} onPress={() => { setSub(item.name); setLevel(''); }}>
                  <View style={[styles.subIconBox, { backgroundColor: isSelected ? specialty.gradient + '25' : '#1E293B' }]}><Ionicons name={item.icon} size={22} color={isSelected ? specialty.gradient : '#94A3B8'} /></View>
                  <View style={{ flex: 1 }}><Text style={[styles.subName, isSelected && { color: specialty.gradient }]}>{item.name}</Text><Text style={styles.subDesc}>{item.desc}</Text></View>
                  {isSelected && <Ionicons name="checkmark-circle" size={22} color={specialty.gradient} />}
                </Pressable>
              );
            })}
          </View>

          {sub && (
            <>
              <View style={styles.stepRow}><View style={[styles.stepBadge, { backgroundColor: specialty.gradient }]}><Text style={styles.stepNumber}>2</Text></View><Text style={styles.stepTitle}>Select Your Level</Text></View>
              <View style={styles.levelRow}>
                {filteredLevels.map((lvl) => {
                  const isSelected = level === lvl.id;
                  return (
                    <Pressable key={lvl.id} style={[styles.levelCard, isSelected && { borderColor: lvl.color, backgroundColor: lvl.color + '10' }]} onPress={() => setLevel(lvl.id)}>
                      <Ionicons name={lvl.icon as any} size={28} color={isSelected ? lvl.color : '#64748B'} />
                      <Text style={[styles.levelLabel, isSelected && { color: lvl.color }]}>{lvl.label}</Text>
                      <Text style={styles.levelDesc}>{lvl.desc}</Text>
                      {isSelected && <View style={[styles.levelCheck, { backgroundColor: lvl.color }]}><Ionicons name="checkmark" size={14} color="#FFF" /></View>}
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          {sub && level && (
            <Pressable style={[styles.startBtn, { backgroundColor: specialty.gradient }]} onPress={() => setShowConfirm(true)}>
              <Text style={styles.startBtnText}>Begin Diagnostic Session</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </Pressable>
          )}

        </Animated.View>
      </ScrollView>

      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="checkmark-circle" size={60} color="#10B981" />
            <Text style={styles.modalTitle}>Begin Session?</Text>
            <View style={styles.modalInfo}>
              <View style={styles.modalInfoRow}><Ionicons name="medkit-outline" size={16} color="#94A3B8" /><Text style={styles.modalInfoText}>{specialty.name} → {sub}</Text></View>
              <View style={styles.modalInfoRow}><Ionicons name="ribbon-outline" size={16} color="#94A3B8" /><Text style={styles.modalInfoText}>Level: {levels.find(l => l.id === level)?.label}</Text></View>
            </View>
            <View style={styles.modalBtns}>
              <Pressable style={styles.modalCancel} onPress={() => setShowConfirm(false)}><Text style={styles.modalCancelText}>Cancel</Text></Pressable>
              <Pressable style={[styles.modalStart, { backgroundColor: specialty.gradient }]} onPress={confirmStart}><Text style={styles.modalStartText}>Start</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  scroll: { paddingBottom: 40 },
  content: { padding: 20 },
  errorCard: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
  errorTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700' },
  backBtnLarge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1E293B', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  backBtnLargeText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 20, gap: 14 },
  backCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  headerBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, gap: 8 },
  headerBadgeText: { fontSize: 14, fontWeight: '700' },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14, marginTop: 8 },
  stepBadge: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  stepNumber: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  stepTitle: { color: '#F8FAFC', fontSize: 17, fontWeight: '700' },
  subGrid: { gap: 8, marginBottom: 20 },
  subCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1E293B', padding: 14, borderRadius: 14, borderWidth: 1.5, borderColor: '#334155' },
  subIconBox: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  subName: { color: '#F8FAFC', fontSize: 14, fontWeight: '700', marginBottom: 2 },
  subDesc: { color: '#94A3B8', fontSize: 11, lineHeight: 16 },
  levelRow: { gap: 10, marginBottom: 20 },
  levelCard: { backgroundColor: '#1E293B', padding: 18, borderRadius: 14, borderWidth: 2, borderColor: '#334155', flexDirection: 'row', alignItems: 'center', gap: 12 },
  levelLabel: { color: '#F8FAFC', fontSize: 14, fontWeight: '700', flex: 1 },
  levelDesc: { color: '#64748B', fontSize: 10 },
  levelCheck: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, borderRadius: 16, gap: 10, marginTop: 10 },
  startBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 40 },
  modalCard: { backgroundColor: '#1E293B', padding: 28, borderRadius: 20, alignItems: 'center', gap: 14, width: '100%', borderWidth: 1, borderColor: '#334155' },
  modalTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '800' },
  modalInfo: { gap: 8, width: '100%' },
  modalInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modalInfoText: { color: '#E2E8F0', fontSize: 14 },
  modalBtns: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 4 },
  modalCancel: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#334155', alignItems: 'center' },
  modalCancelText: { color: '#E2E8F0', fontWeight: '600' },
  modalStart: { flex: 2, padding: 14, borderRadius: 12, alignItems: 'center' },
  modalStartText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});
