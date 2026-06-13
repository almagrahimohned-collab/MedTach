import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet, Text, View, Pressable, ScrollView, Modal, FlatList, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../src/store';
import { PatientState, ActiveOrder, LabResult, VitalSigns, updatePhysiology, getInitialState, getInitialStateFromScenario } from './physiology';
import { MEDICATION_CATEGORIES, ALL_MEDICATIONS, Medication, searchMedications, getMedicationsByCategory } from './medications';
import { PROCEDURE_CATEGORIES, ALL_PROCEDURES, ProcedureItem } from './procedures';
import { getScenarioData, ScenarioData } from './scenarios';
import CodeBlueOverlay from './CodeBlueOverlay';
import ClinicalPearls from './ClinicalPearls';
import GoalTracker from './GoalTracker';
import ResultScreen from './ResultScreen';
import VentilatorModal, { DEFAULT_VENT_SETTINGS, VentilatorSettings } from './VentilatorModal';
import ABGPanel from './ABGPanel';
import FluidBalance from './FluidBalance';
import { ventilatorToEffects, checkVentilatorAlerts } from './ventilatorEffects';
import { calculateFinalScore, ScoreBreakdown } from './scoringEngine';

const LABS_LIST = [
  { id: 'cbc', name: 'CBC', icon: 'flask' },
  { id: 'abg', name: 'ABG', icon: 'flask' },
  { id: 'cmp', name: 'CMP', icon: 'flask' },
  { id: 'coagulation', name: 'Coagulation Profile', icon: 'flask' },
  { id: 'cxr', name: 'Chest X-Ray', icon: 'image' },
  { id: 'crp', name: 'CRP', icon: 'flask' },
  { id: 'procalcitonin', name: 'Procalcitonin', icon: 'flask' },
  { id: 'blood_cx', name: 'Blood Cultures x2', icon: 'flask' },
  { id: 'lft', name: 'Liver Function', icon: 'flask' },
  { id: 'ecg', name: 'ECG 12-Lead', icon: 'pulse' },
  { id: 'echo', name: 'ECHO Bedside', icon: 'pulse' },
  { id: 'troponin', name: 'Troponin I', icon: 'flask' },
  { id: 'bnp', name: 'BNP', icon: 'flask' },
  { id: 'ct_head', name: 'CT Head', icon: 'image' },
  { id: 'ct_chest', name: 'CT Chest with Contrast', icon: 'image' },
];

const HIDDEN_LABS: Record<string, string> = {
  cbc: 'WBC: 22,000\nHb: 13.5\nPLT: 180,000',
  abg: 'pH: 7.22 | PaO2: 68 | PaCO2: 32\nHCO3: 14 | Lactate: 5.8 | BE: -8',
  cmp: 'Na: 138 | K: 4.2 | Cl: 102\nBUN: 28 | Cr: 1.6 | Glucose: 180',
  cxr: 'Bilateral infiltrates',
  crp: '280 mg/L', procalcitonin: '45 ng/mL', blood_cx: 'Pending',
  coagulation: 'PT: 14 | PTT: 32 | INR: 1.2', lft: 'AST: 45 | ALT: 38',
  ecg: 'Sinus tachycardia', troponin: '0.02', bnp: '85',
  ct_head: 'No acute abnormality', ct_chest: 'Consolidations', echo: 'Hyperdynamic LV',
};

export default function ICUSimulator({ scenarioId = 'septic_shock' }: { scenarioId?: string }) {
  const router = useRouter();
  const { addPoints } = useStore();
  const scenarioData = getScenarioData(scenarioId);
  const scenario = scenarioData?.scenario;

  const [state, setState] = useState<PatientState>(() => getInitialStateFromScenario(scenario));
  const [showMeds, setShowMeds] = useState(false);
  const [showLabs, setShowLabs] = useState(false);
  const [showProcedures, setShowProcedures] = useState(false);
  const [showPearls, setShowPearls] = useState(false);
  const [showVent, setShowVent] = useState(false);
  const [abgExpanded, setAbgExpanded] = useState(false);
  const [ventSettings, setVentSettings] = useState<VentilatorSettings>(DEFAULT_VENT_SETTINGS);
  const [medSearch, setMedSearch] = useState('');
  const [medCategory, setMedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'monitor' | 'goals' | 'orders' | 'labs' | 'abg' | 'fluids'>('monitor');
  const [simEnded, setSimEnded] = useState(false);
  const [score, setScore] = useState<ScoreBreakdown | null>(null);
  const [codeBlueActive, setCodeBlueActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setState(getInitialStateFromScenario(scenario));
    setSimEnded(false);
    setCodeBlueActive(false);
    setScore(null);
  }, [scenarioId]);

  useEffect(() => {
    if (simEnded) return;
    timerRef.current = setInterval(() => {
      setState(prev => {
        const updated = updatePhysiology({ ...prev, simTime: prev.simTime + 1 });
        const ventAlerts = checkVentilatorAlerts(ventSettings);
        const newEvents = [...updated.events];
        for (const alert of ventAlerts) {
          if (!newEvents.includes(alert)) newEvents.push(alert);
        }
        return { ...updated, events: newEvents };
      });
    }, 2000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [simEnded, ventSettings]);

  useEffect(() => {
    if (state.vitals.map < 40 || state.vitals.spo2 < 50 || state.status === 'dead') {
      if (!codeBlueActive) setCodeBlueActive(true);
    }
  }, [state.vitals.map, state.vitals.spo2, state.status]);

  useEffect(() => {
    if ((state.status === 'dead' || state.status === 'recovered' || state.status === 'improving') && !simEnded && state.simTime > 30) {
      endSimulation();
    }
  }, [state.status]);

  const endSimulation = () => {
    const finalScore = calculateFinalScore(state, scenario?.winConditions || {}, scenarioId);
    setScore(finalScore);
    setSimEnded(true);
    addPoints(finalScore.total);
  };

  const getCompletedGoals = (): string[] => {
    const v = state.vitals;
    const completed: string[] = [];
    const goals = scenario?.goals || [];
    goals.forEach(goal => {
      if (goal.includes('MAP') && v.map > 65) completed.push(goal);
      if (goal.includes('Lactate') && v.lactate < 2.5) completed.push(goal);
      if (goal.includes('SpO2') && v.spo2 > 92) completed.push(goal);
      if (goal.includes('Urine') && v.urineOutput > 25) completed.push(goal);
      if (goal.includes('Antibiotics') && state.activeOrders.some(o => o.category === 'antibiotic' && o.running)) completed.push(goal);
      if (goal.includes('pH') && v.ph > 7.30) completed.push(goal);
    });
    return completed;
  };

  const giveMedication = useCallback((med: Medication) => {
    const type = med.route.includes('infusion') ? 'infusion' : med.route.includes('bolus') ? 'bolus' : 'intermittent';
    const order: ActiveOrder = {
      id: Date.now().toString(), name: med.name, category: med.category,
      dose: med.dose + ' ' + med.unit, startSimTime: state.simTime, type, running: true,
    };
    setState(prev => ({
      ...prev, activeOrders: [...prev.activeOrders, order],
      events: [...prev.events, '[' + prev.simTime + 'm] 💊 ' + med.name],
    }));
  }, [state.simTime]);

  const stopOrder = useCallback((orderId: string) => {
    setState(prev => ({
      ...prev,
      activeOrders: prev.activeOrders.map(o => o.id === orderId ? { ...o, running: false } : o),
      events: [...prev.events, '[' + prev.simTime + 'm] ⏹ Stopped'],
    }));
  }, [state.simTime]);

  const requestLab = useCallback((labId: string) => {
    const lab = LABS_LIST.find(l => l.id === labId);
    if (!lab) return;
    setState(prev => ({
      ...prev,
      labResults: [...prev.labResults, { id: Date.now().toString(), name: lab.name, value: HIDDEN_LABS[labId] || 'N/A', simTime: prev.simTime }],
      events: [...prev.events, '[' + prev.simTime + 'm] 🔬 ' + lab.name],
    }));
  }, []);

  const performProcedure = useCallback((proc: ProcedureItem) => {
    setState(prev => ({
      ...prev,
      procedures: [...prev.procedures, { id: Date.now().toString(), name: proc.name, category: proc.category, simTime: prev.simTime, effect: proc.effect }],
      events: [...prev.events, '[' + prev.simTime + 'm] 🏥 ' + proc.name],
    }));
  }, []);

  if (simEnded && score) {
    return <ResultScreen score={score} vitals={state.vitals} state={state} scenarioId={scenarioId}
      onRetry={() => { setState(getInitialStateFromScenario(scenario)); setSimEnded(false); setScore(null); }} />;
  }

  return (
    <View style={styles.container}>
      <CodeBlueOverlay active={codeBlueActive} onComplete={() => setCodeBlueActive(false)} />
      <ClinicalPearls scenarioId={scenarioId} visible={showPearls} onClose={() => setShowPearls(false)} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#F8FAFC" /></Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{scenarioData?.meta?.title || 'ICU'}</Text>
          <Text style={styles.headerSub}>Sim: {state.simTime}m | Vent: {ventSettings.mode} FiO₂ {ventSettings.fio2.toFixed(2)}</Text>
        </View>
        <Text style={styles.clock}>⏱ {state.simTime}m</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusBg(state.status) }]}>
          <Text style={styles.statusText}>{state.status.toUpperCase()}</Text>
        </View>
        <Pressable onPress={() => setShowPearls(true)} style={{ marginLeft: 8 }}>
          <Ionicons name="bulb" size={22} color="#F59E0B" />
        </Pressable>
      </View>

      <View style={styles.monitor}>
        <View style={styles.vitalsGrid}>
          {v('❤️ HR', state.vitals.hr, 'bpm', state.vitals.hr > 140 || state.vitals.hr < 40)}
          {v('💉 MAP', state.vitals.map, 'mmHg', state.vitals.map < 65)}
          {v('🫁 SpO2', state.vitals.spo2, '%', state.vitals.spo2 < 90)}
          {v('🌡 Temp', state.vitals.temp, '°C', state.vitals.temp > 39 || state.vitals.temp < 35)}
          {v('🫀 RR', state.vitals.rr, '/min', state.vitals.rr > 30)}
          {v('💧 U/O', state.vitals.urineOutput, 'mL/h', state.vitals.urineOutput < 15)}
          {v('🧪 Lact', state.vitals.lactate, 'mmol', state.vitals.lactate > 4)}
          {v('📊 CVP', state.vitals.cvp, 'mmHg', state.vitals.cvp > 15 || state.vitals.cvp < 2)}
        </View>
      </View>

      <View style={styles.tabs}>
        {(['monitor', 'goals', 'orders', 'labs', 'abg', 'fluids'] as const).map(tab => (
          <Pressable key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'monitor' ? '📋' : tab === 'goals' ? '🎯' : tab === 'orders' ? '💊' : tab === 'labs' ? '🔬' : tab === 'abg' ? '🧪' : '💧'}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'monitor' && <View style={styles.section}>{state.events.slice(-20).reverse().map((e, i) => <Text key={i} style={styles.eventText}>{e}</Text>)}</View>}
        {activeTab === 'goals' && <GoalTracker goals={scenario?.goals || []} completedGoals={getCompletedGoals()} />}
        {activeTab === 'orders' && (
          <View style={styles.section}>
            {state.activeOrders.map(o => (
              <View key={o.id} style={styles.orderItem}>
                <View style={{ flex: 1 }}><Text style={styles.orderName}>{o.name}</Text><Text style={styles.orderDose}>{o.dose}</Text></View>
                {o.running ? <Pressable onPress={() => stopOrder(o.id)}><Ionicons name="stop-circle" size={24} color="#EF4444" /></Pressable> : <Text style={styles.orderStopped}>Stopped</Text>}
              </View>
            ))}
          </View>
        )}
        {activeTab === 'labs' && <View style={styles.section}>{state.labResults.map(l => <View key={l.id} style={styles.labItem}><Text style={styles.labName}>{l.name}</Text><Text style={styles.labValue}>{l.value}</Text></View>)}</View>}
        {activeTab === 'abg' && <ABGPanel vitals={state.vitals} ventSettings={ventSettings} expanded={abgExpanded} onToggle={() => setAbgExpanded(!abgExpanded)} />}
        {activeTab === 'fluids' && <FluidBalance events={state.events} activeOrders={state.activeOrders} simTime={state.simTime} vitals={state.vitals} />}
      </ScrollView>

      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={() => setShowMeds(true)}><Ionicons name="medkit" size={22} color="#38BDF8" /><Text style={styles.actionText}>Meds</Text></Pressable>
        <Pressable style={styles.actionBtn} onPress={() => setShowLabs(true)}><Ionicons name="flask" size={22} color="#10B981" /><Text style={styles.actionText}>Labs</Text></Pressable>
        <Pressable style={styles.actionBtn} onPress={() => setShowVent(true)}><Ionicons name="leaf" size={22} color="#10B981" /><Text style={styles.actionText}>Vent</Text></Pressable>
        <Pressable style={styles.actionBtn} onPress={() => setShowProcedures(true)}><Ionicons name="fitness" size={22} color="#F59E0B" /><Text style={styles.actionText}>Proc</Text></Pressable>
        <Pressable style={styles.endSimBtn} onPress={endSimulation}><Ionicons name="flag" size={22} color="#0F172A" /><Text style={styles.endSimText}>End</Text></Pressable>
      </View>

      <Modal visible={showMeds} transparent animationType="slide">
        <View style={styles.modalOverlay}><View style={styles.modalContent}>
          <View style={styles.modalHeader}><Text style={styles.modalTitle}>💊 Medications</Text><Pressable onPress={() => setShowMeds(false)}><Ionicons name="close" size={24} color="#F8FAFC" /></Pressable></View>
          <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor="#64748B" value={medSearch} onChangeText={setMedSearch} />
          <ScrollView horizontal style={{ marginBottom: 10 }}>{MEDICATION_CATEGORIES.map(cat => <Pressable key={cat.id} style={[styles.categoryChip, medCategory === cat.id && styles.categoryChipActive]} onPress={() => setMedCategory(medCategory === cat.id ? null : cat.id)}><Text style={[styles.categoryChipText, medCategory === cat.id && styles.categoryChipTextActive]}>{cat.name}</Text></Pressable>)}</ScrollView>
                const filteredMeds = medSearch || medCategory ? searchMedications(medSearch || "") : ALL_MEDICATIONS;
                return (
          <FlatList data={(() => medSearch || medCategory ? searchMedications(medSearch || "") : ALL_MEDICATIONS)()} keyExtractor={item => item.id} renderItem={({ item }) => <Pressable style={styles.medItem} onPress={() => { giveMedication(item); setShowMeds(false); }}><Text style={styles.medName}>{item.name}</Text><Text style={styles.medDose}>{item.dose} {item.unit}</Text></Pressable>} />
        </View></View>
      </Modal>

      <Modal visible={showLabs} transparent animationType="slide">
        <View style={styles.modalOverlay}><View style={styles.modalContent}>
          <View style={styles.modalHeader}><Text style={styles.modalTitle}>🔬 Labs</Text><Pressable onPress={() => setShowLabs(false)}><Ionicons name="close" size={24} color="#F8FAFC" /></Pressable></View>
          {LABS_LIST.map(lab => <Pressable key={lab.id} style={styles.modalItem} onPress={() => { requestLab(lab.id); setShowLabs(false); }}><Ionicons name={lab.icon as any} size={22} color="#38BDF8" /><Text style={styles.modalItemText}>{lab.name}</Text></Pressable>)}
        </View></View>
      </Modal>

      <Modal visible={showProcedures} transparent animationType="slide">
        <View style={styles.modalOverlay}><View style={styles.modalContent}>
          <View style={styles.modalHeader}><Text style={styles.modalTitle}>🏥 Procedures</Text><Pressable onPress={() => setShowProcedures(false)}><Ionicons name="close" size={24} color="#F8FAFC" /></Pressable></View>
          {ALL_PROCEDURES.map(proc => <Pressable key={proc.id} style={styles.modalItem} onPress={() => { performProcedure(proc); setShowProcedures(false); }}><Ionicons name="fitness" size={22} color="#F59E0B" /><Text style={styles.modalItemText}>{proc.name}</Text></Pressable>)}
        </View></View>
      </Modal>

      <VentilatorModal visible={showVent} current={ventSettings} onSave={(s) => { setVentSettings(s); setShowVent(false); }} onClose={() => setShowVent(false)} />
    </View>
  );
}

function v(label: string, value: number, unit: string, critical: boolean) {
  return <View key={label} style={styles.vitalItem}><Text style={styles.vitalLabel}>{label}</Text><Text style={[styles.vitalValue, critical && styles.vitalCritical]}>{value}</Text><Text style={styles.vitalUnit}>{unit}</Text></View>;
}
function statusBg(s: string) {
  switch (s) { case 'critical': return '#EF444420'; case 'deteriorating': return '#F9731620'; case 'improving': case 'recovered': return '#10B98120'; case 'dead': return '#000'; default: return '#334155'; }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingTop: 20, backgroundColor: '#1A1F2E', gap: 8 },
  headerInfo: { flex: 1 }, headerTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '700' }, headerSub: { color: '#94A3B8', fontSize: 9 },
  clock: { color: '#38BDF8', fontSize: 13, fontWeight: '700' }, statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }, statusText: { fontSize: 9, fontWeight: '700', color: '#F8FAFC' },
  monitor: { padding: 10, backgroundColor: '#0F172A' }, vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  vitalItem: { width: '18%', backgroundColor: '#1A1F2E', padding: 6, borderRadius: 6, alignItems: 'center' }, vitalLabel: { color: '#64748B', fontSize: 8 }, vitalValue: { color: '#F8FAFC', fontSize: 14, fontWeight: '800' }, vitalUnit: { color: '#64748B', fontSize: 7 }, vitalCritical: { color: '#EF4444' },
  tabs: { flexDirection: 'row', backgroundColor: '#1A1F2E' }, tab: { flex: 1, paddingVertical: 10, alignItems: 'center' }, tabActive: { borderBottomWidth: 2, borderBottomColor: '#38BDF8' }, tabText: { color: '#94A3B8', fontSize: 14 }, tabTextActive: { color: '#38BDF8' },
  content: { flex: 1, padding: 8 }, section: { backgroundColor: '#1E293B', padding: 10, borderRadius: 10 }, eventText: { color: '#E2E8F0', fontSize: 11, paddingVertical: 1.5 },
  orderItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 }, orderName: { color: '#F8FAFC', fontSize: 12, fontWeight: '600' }, orderDose: { color: '#64748B', fontSize: 10 }, orderStopped: { color: '#64748B', fontSize: 10 },
  labItem: { paddingVertical: 5 }, labName: { color: '#38BDF8', fontSize: 11, fontWeight: '600' }, labValue: { color: '#E2E8F0', fontSize: 10 },
  actions: { flexDirection: 'row', padding: 10, backgroundColor: '#1A1F2E', gap: 5 },
  actionBtn: { flex: 1, backgroundColor: '#1E293B', padding: 8, borderRadius: 10, alignItems: 'center' }, actionText: { color: '#FFF', fontSize: 9, fontWeight: '600', marginTop: 2 },
  endSimBtn: { flex: 1, backgroundColor: '#F59E0B', padding: 8, borderRadius: 10, alignItems: 'center' }, endSimText: { color: '#0F172A', fontSize: 9, fontWeight: '700', marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }, modalContent: { backgroundColor: '#1E293B', padding: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }, modalTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700' },
  searchInput: { backgroundColor: '#0F172A', color: '#FFF', padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 10 },
  categoryChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#0F172A', marginRight: 6 }, categoryChipActive: { backgroundColor: '#38BDF820' }, categoryChipText: { color: '#94A3B8', fontSize: 11 }, categoryChipTextActive: { color: '#38BDF8' },
  medItem: { padding: 12 }, medName: { color: '#F8FAFC', fontSize: 13, fontWeight: '600' }, medDose: { color: '#64748B', fontSize: 10 },
  modalItem: { flexDirection: 'row', padding: 14, gap: 12 }, modalItemText: { color: '#E2E8F0', fontSize: 14, flex: 1 },
});
