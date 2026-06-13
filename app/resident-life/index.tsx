import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../src/store';
import {
  ShiftState, createInitialShift, updateShift, performAction,
  makeDiagnosis, answerConsult, resolveInterruption, acceptConsult,
  evaluateShift, formatTime, getResourceSummary,
  togglePause, setGameSpeed, TICK_SPEED_MS,
  getSuggestedPatient, getClinicalPearls, getClinicalAudit,
  Patient, Action, ConsultRequest, Interruption,
} from './ShiftManager';
import { getLevelProgress, getCurrentLevelInfo } from './CareerSystem';

export default function ResidentLife() {
  const router = useRouter();
  const { addPoints } = useStore();
  const [state, setState] = useState<ShiftState | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [showConsult, setShowConsult] = useState<ConsultRequest | null>(null);
  const [showInterruption, setShowInterruption] = useState<Interruption | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [shiftResult, setShiftResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stateRef = useRef<ShiftState | null>(null);

  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { initShift(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  useEffect(() => {
    if (gameStarted && !gameOver && state) {
      const speed = state.gameSpeed === 2 ? TICK_SPEED_MS / 2 : TICK_SPEED_MS;
      timerRef.current = setInterval(() => {
        if (!stateRef.current || stateRef.current.paused) return;
        const updated = updateShift(stateRef.current);
        const alive = updated.patients.filter(p => p.status !== 'died');
        if (alive.length === 0 || updated.focus <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          setShiftResult(evaluateShift(updated));
          setGameOver(true);
        }
        setState(updated);
      }, speed);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [gameStarted, gameOver, state?.gameSpeed]);

  useEffect(() => {
    if (!state?.interruptions?.length) return;
    const next = state.interruptions.find(i => !i.resolved);
    if (next && !showInterruption && !showPatientModal && !showConsult) {
      setShowInterruption(next);
    }
  }, [state?.interruptions?.length]);

  const initShift = async () => {
    setLoading(true);
    try {
      const s = await createInitialShift('junior');
      setState(s); stateRef.current = s;
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleAction = useCallback((pid: string, action: Action) => {
    if (!stateRef.current) return;
    const u = performAction(stateRef.current, pid, action.id);
    setState(u); stateRef.current = u;
    setShowPatientModal(false);
  }, []);

  const handleDiagnosis = useCallback((pid: string, diag: string) => {
    if (!stateRef.current) return;
    const u = makeDiagnosis(stateRef.current, pid, diag);
    setState(u); stateRef.current = u;
    setShowDiagnosis(false); setShowPatientModal(false);
  }, []);

  const handleConsultAnswer = useCallback((cid: string, idx: number) => {
    if (!stateRef.current) return;
    const u = answerConsult(stateRef.current, cid, idx);
    setState(u); stateRef.current = u;
    setShowConsult(null);
  }, []);

  const handleInterruption = useCallback((iid: string) => {
    if (!stateRef.current) return;
    const u = resolveInterruption(stateRef.current, iid);
    setState(u); stateRef.current = u;
    setShowInterruption(null);
  }, []);

  const handleEndShift = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!stateRef.current) return;
    const r = evaluateShift(stateRef.current);
    setShiftResult(r); addPoints(r.xpEarned);
    setGameOver(true); setShowReport(true);
  }, []);

  if (loading || !state) {
    return (
      <View style={s.container}>
        <View style={s.center}>
          <Ionicons name="medical" size={60} color="#EF4444" />
          <Text style={s.title}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!gameStarted) {
    const info = getCurrentLevelInfo(state.career);
    const prog = getLevelProgress(state.career);
    return (
      <View style={s.container}>
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={s.center}>
            <Ionicons name="medkit" size={64} color="#EF4444" />
            <Text style={s.title}>Resident Life</Text>
            <Text style={s.subtitle}>Emergency Department</Text>
            <View style={s.card}>
              <Text style={s.cardTitle}>👨‍⚕️ {info.title}</Text>
              <View style={s.bar}><View style={[s.barFill, { width: `${prog}%` }]} /></View>
              <Text style={s.muted}>{state.career.xp} XP</Text>
            </View>
            <View style={s.infoBox}>
              <Text style={s.infoLine}>👥 {state.patients.length} patients waiting</Text>
              <Text style={s.infoLine}>🧠 Real clinical decisions</Text>
              <Text style={s.infoLine}>💊 Diagnose & Treat</Text>
            </View>
            <Pressable style={s.btn} onPress={() => setGameStarted(true)}>
              <Text style={s.btnText}>Start Shift</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (gameOver && showReport && shiftResult) {
    const audit = state ? getClinicalAudit(state.patients) : null;
    const pearls = state ? getClinicalPearls(state.patients) : [];
    return (
      <View style={s.container}>
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={s.center}>
            <Ionicons name="clipboard" size={64} color="#38BDF8" />
            <Text style={s.title}>Shift Report</Text>
            <Text style={[s.badge, { color: shiftResult.accuracy >= 80 ? '#10B981' : shiftResult.accuracy >= 50 ? '#F59E0B' : '#EF4444' }]}>
              {shiftResult.accuracy >= 80 ? '🌟 Excellent' : shiftResult.accuracy >= 50 ? '👍 Good' : '❌ Needs Work'}
            </Text>
            <Text style={s.xp}>{shiftResult.xpEarned} XP</Text>
            <View style={s.row}>
              <Text style={s.stat}>✅ {shiftResult.survived} survived</Text>
              <Text style={s.stat}>❌ {shiftResult.died} died</Text>
            </View>
            <View style={s.row}>
              <Text style={s.stat}>📞 {shiftResult.consultsCorrect}/{shiftResult.consultsAnswered} consults</Text>
              <Text style={s.stat}>🧠 {shiftResult.diagnosticAccuracy.toFixed(0)}% diagnosis</Text>
            </View>
            {audit && (
              <Text style={s.muted}>Guidelines: {audit.guidelineAdherence.toFixed(0)}% | Harmful: {audit.harmfulActions} | Unnecessary: {audit.unnecessaryTests}</Text>
            )}
            {pearls.length > 0 && (
              <View style={s.pearls}>
                <Text style={s.pearlTitle}>📚 Clinical Pearls</Text>
                {pearls.map((p: string, i: number) => <Text key={i} style={s.pearl}>{p}</Text>)}
              </View>
            )}
            {shiftResult.levelUp && (
              <View style={s.levelUp}><Text style={s.levelUpText}>🎉 LEVEL UP! {shiftResult.newLevel}!</Text></View>
            )}
            {shiftResult.achievementsUnlocked?.length > 0 && (
              <View style={s.achs}>{shiftResult.achievementsUnlocked.map((a: string, i: number) => <Text key={i} style={s.ach}>🏆 {a}</Text>)}</View>
            )}
            <Pressable style={s.btn} onPress={async () => {
              const ns = await createInitialShift(shiftResult.newLevel || state.level, undefined, state.career);
              setState(ns); stateRef.current = ns;
              setGameOver(false); setGameStarted(true); setShowReport(false); setShiftResult(null);
            }}><Text style={s.btnText}>Next Shift</Text></Pressable>
            <Pressable onPress={() => router.back()}><Text style={s.link}>Dashboard</Text></Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  const critical = state.patients.filter(p => p.status === 'waiting' && p.priority === 'critical');
  const urgent = state.patients.filter(p => p.status === 'waiting' && p.priority === 'urgent');
  const stable = state.patients.filter(p => p.status === 'waiting' && p.priority === 'stable');
  const inProgress = state.patients.filter(p => p.status === 'in-progress' || p.status === 'deteriorated');
  const done = state.patients.filter(p => p.status === 'stable');
  const dead = state.patients.filter(p => p.status === 'died');
  const suggested = getSuggestedPatient(state.patients);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Pressable onPress={() => { if (timerRef.current) clearInterval(timerRef.current); router.back(); }}>
          <Ionicons name="close" size={24} color="#94A3B8" />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={s.hTitle}>{formatTime(state.timeElapsed)}</Text>
          <Text style={s.hSub}>{state.shiftType === 'night' ? '🌙 Night' : '🌅 Morning'} • {state.patients.length} patients</Text>
        </View>
        <Pressable style={s.hBtn} onPress={() => { const u = togglePause(stateRef.current!); setState(u); stateRef.current = u; }}>
          <Ionicons name={state.paused ? 'play' : 'pause'} size={18} color="#FFF" />
        </Pressable>
        <Pressable style={s.hBtn} onPress={() => { const u = setGameSpeed(stateRef.current!, state.gameSpeed === 1 ? 2 : 1); setState(u); stateRef.current = u; }}>
          <Text style={s.hBtnText}>{state.gameSpeed}x</Text>
        </Pressable>
        <Text style={s.hStat}>⚡{state.focus}%</Text>
        <Text style={s.hStat}>⭐{state.reputation}</Text>
        {state.patientQueue.length > 0 && <Text style={s.hQueue}>+{state.patientQueue.length}</Text>}
        <Pressable onPress={() => setShowResources(true)}>
          <Ionicons name="business" size={20} color="#38BDF8" />
        </Pressable>
      </View>

      {state.paused && (
        <View style={s.pause}>
          <Ionicons name="pause-circle" size={80} color="#FFF" />
          <Text style={s.pauseTitle}>PAUSED</Text>
          <Pressable style={s.btn} onPress={() => { const u = togglePause(stateRef.current!); setState(u); stateRef.current = u; }}>
            <Text style={s.btnText}>Resume</Text>
          </Pressable>
        </View>
      )}

      <ScrollView style={s.list} showsVerticalScrollIndicator={false}>
        {state.patientQueue.length > 0 && (
          <View style={s.alert}><Ionicons name="people" size={14} color="#F59E0B" /><Text style={s.alertText}>{state.patientQueue.length} incoming</Text></View>
        )}
        {state.interruptions.filter(i => !i.resolved).length > 0 && (
          <Pressable style={s.alertRed} onPress={() => { const n = state.interruptions.find(i => !i.resolved); if (n) setShowInterruption(n); }}>
            <Ionicons name="alert-circle" size={14} color="#EF4444" /><Text style={s.alertRedText}>Interruption - Tap</Text>
          </Pressable>
        )}

        {suggested && (
          <Pressable style={s.suggestedCard} onPress={() => { setSelectedPatient(suggested); setShowPatientModal(true); }}>
            <Ionicons name="bulb" size={16} color="#F59E0B" />
            <Text style={s.suggestedText}>Suggested: {suggested.name} ({suggested.priority})</Text>
            <Ionicons name="arrow-forward" size={16} color="#F59E0B" />
          </Pressable>
        )}

        {critical.length > 0 && (
          <>
            <Text style={s.secTitle}>🔴 Critical</Text>
            {critical.map(p => (
              <Pressable key={p.id} style={[s.pCard, s.pCritical]} onPress={() => { setSelectedPatient(p); setShowPatientModal(true); }}>
                <View style={{ flex: 1 }}>
                  <Text style={s.pName}>{p.name}, {p.age}{p.gender === 'male' ? 'M' : 'F'}</Text>
                  <Text style={s.pComp}>{p.complaint.substring(0, 50)}...</Text>
                  <Text style={s.pTime}>⏱ {p.deteriorationTimer}min {p.deteriorationTimer < 8 ? '⚠️' : ''}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#EF4444" />
              </Pressable>
            ))}
          </>
        )}

        {urgent.length > 0 && (
          <>
            <Text style={s.secTitle}>🟡 Urgent</Text>
            {urgent.map(p => (
              <Pressable key={p.id} style={[s.pCard, s.pUrgent]} onPress={() => { setSelectedPatient(p); setShowPatientModal(true); }}>
                <View style={{ flex: 1 }}>
                  <Text style={s.pName}>{p.name}, {p.age}{p.gender === 'male' ? 'M' : 'F'}</Text>
                  <Text style={s.pComp}>{p.complaint.substring(0, 50)}...</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#F59E0B" />
              </Pressable>
            ))}
          </>
        )}

        {stable.length > 0 && (
          <>
            <Text style={s.secTitle}>🟢 Stable</Text>
            {stable.map(p => (
              <Pressable key={p.id} style={s.pCard} onPress={() => { setSelectedPatient(p); setShowPatientModal(true); }}>
                <View style={{ flex: 1 }}>
                  <Text style={s.pName}>{p.name}, {p.age}{p.gender === 'male' ? 'M' : 'F'}</Text>
                  <Text style={s.pComp}>{p.complaint.substring(0, 50)}...</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#10B981" />
              </Pressable>
            ))}
          </>
        )}

        {inProgress.length > 0 && <Text style={s.statusLine}>🔄 {inProgress.length} in progress</Text>}
        {done.length > 0 && <Text style={s.statusLine}>✅ {done.length} stable</Text>}
        {dead.length > 0 && <Text style={[s.statusLine, { color: '#EF4444' }]}>💀 {dead.length} deceased</Text>}

        {state.consults.filter(c => !c.accepted).length > 0 && (
          <>
            <Text style={s.secTitle}>📞 Consults</Text>
            {state.consults.filter(c => !c.accepted).map(c => (
              <Pressable key={c.id} style={s.consultCard} onPress={() => {
                const u = acceptConsult(stateRef.current!, c.id); setState(u); stateRef.current = u; setShowConsult(c);
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={s.consultFrom}>{c.from}</Text>
                  <Text style={s.consultDesc}>{c.description}</Text>
                </View>
                <Ionicons name="chatbubbles" size={20} color="#38BDF8" />
              </Pressable>
            ))}
          </>
        )}

        <Text style={s.secTitle}>📝 Log</Text>
        {state.events.slice(-8).reverse().map((e, i) => <Text key={i} style={s.logText}>{e}</Text>)}
        <View style={{ height: 60 }} />
      </ScrollView>

      <Pressable style={s.endBtn} onPress={handleEndShift}>
        <Text style={s.endBtnText}>End Shift</Text>
      </Pressable>

      <Modal visible={showPatientModal} transparent animationType="slide">
        <View style={s.modalBack}><View style={s.modal}>
          {selectedPatient && (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={s.modalTitle}>{selectedPatient.name}</Text>
                <Text style={{ color: selectedPatient.priority === 'critical' ? '#EF4444' : selectedPatient.priority === 'urgent' ? '#F59E0B' : '#10B981', fontWeight: '700', fontSize: 12 }}>
                  {selectedPatient.priority === 'critical' ? '🔴 Critical' : selectedPatient.priority === 'urgent' ? '🟡 Urgent' : '🟢 Stable'}
                </Text>
              </View>
              <Text style={s.modalSub}>{selectedPatient.age}{selectedPatient.gender === 'male' ? 'M' : 'F'} • {selectedPatient.complaint}</Text>
              <Text style={s.modalTimer}>⏱ {selectedPatient.deteriorationTimer}min until deterioration</Text>
              <Text style={s.modalVitals}>
                VS: BP {selectedPatient.vitals.sbp}/{selectedPatient.vitals.dbp} | HR {selectedPatient.vitals.hr} | SpO2 {selectedPatient.vitals.spo2}% | GCS {selectedPatient.vitals.gcs}
              </Text>

              {selectedPatient.diagnosisAttempted ? (
                <Text style={{ color: selectedPatient.diagnosisCorrect ? '#10B981' : '#EF4444', fontWeight: '600', marginTop: 6 }}>
                  {selectedPatient.diagnosisCorrect ? '✅ Correct Diagnosis' : '❌ Incorrect Diagnosis'}
                </Text>
              ) : (
                <Pressable style={s.diagBtn} onPress={() => setShowDiagnosis(true)}>
                  <Text style={s.diagBtnText}>🧠 Make Diagnosis</Text>
                </Pressable>
              )}

              <Text style={s.actTitle}>Actions:</Text>
              {selectedPatient.requiredActions.map(a => (
                <Pressable key={a.id} style={[s.actBtn, a.status !== 'available' && { opacity: 0.4 }]} onPress={() => handleAction(selectedPatient.id, a)} disabled={a.status !== 'available'}>
                  <Ionicons name={a.status === 'completed' ? 'checkmark-circle' : a.status === 'in-progress' ? 'time' : 'ellipse-outline'} size={20} color={a.status === 'completed' ? '#10B981' : a.status === 'in-progress' ? '#F59E0B' : '#64748B'} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.actName}>{a.name} {a.category === 'treatment' ? '💊' : ''}</Text>
                    <Text style={s.actTime}>⏱ {a.timeCost}min {a.status === 'in-progress' ? '(in progress...)' : ''}</Text>
                    {a.status === 'completed' && a.result && <Text style={s.actResult}>{a.result}</Text>}
                  </View>
                </Pressable>
              ))}
              <Pressable style={s.closeBtn} onPress={() => setShowPatientModal(false)}><Text style={s.closeBtnText}>Close</Text></Pressable>
            </>
          )}
        </View></View>
      </Modal>

      <Modal visible={showDiagnosis && !!selectedPatient} transparent animationType="slide">
        <View style={s.modalBack}><View style={s.modal}>
          {selectedPatient && (
            <>
              <Text style={s.modalTitle}>Diagnosis</Text>
              <Text style={s.modalSub}>{selectedPatient.complaint}</Text>
              {[...new Set([selectedPatient.correctDiagnosis, ...selectedPatient.differentialDiagnoses])].map((d, i) => (
                <Pressable key={i} style={s.optBtn} onPress={() => handleDiagnosis(selectedPatient.id, d)}>
                  <Text style={s.optText}>{d}</Text>
                </Pressable>
              ))}
              <Pressable style={s.closeBtn} onPress={() => setShowDiagnosis(false)}><Text style={s.closeBtnText}>Cancel</Text></Pressable>
            </>
          )}
        </View></View>
      </Modal>

      <Modal visible={!!showConsult} transparent animationType="slide">
        <View style={s.modalBack}><View style={s.modal}>
          {showConsult && (
            <>
              <Text style={s.modalTitle}>{showConsult.from} Consult</Text>
              <Text style={s.modalSub}>{showConsult.description}</Text>
              <Text style={{ color: '#F8FAFC', fontSize: 15, fontWeight: '600', marginTop: 12 }}>{showConsult.question}</Text>
              {showConsult.options.map((opt, i) => (
                <Pressable key={i} style={s.optBtn} onPress={() => handleConsultAnswer(showConsult.id, i)}>
                  <Text style={s.optText}>{String.fromCharCode(65 + i)}. {opt}</Text>
                </Pressable>
              ))}
              <Pressable style={s.closeBtn} onPress={() => setShowConsult(null)}><Text style={s.closeBtnText}>Dismiss</Text></Pressable>
            </>
          )}
        </View></View>
      </Modal>

      <Modal visible={!!showInterruption} transparent animationType="fade">
        <View style={s.modalBack}><View style={[s.modal, { alignItems: 'center', borderColor: showInterruption?.urgency === 'high' ? '#EF4444' : '#F59E0B', borderWidth: 2 }]}>
          {showInterruption && (
            <>
              <Ionicons name="warning" size={50} color={showInterruption.urgency === 'high' ? '#EF4444' : '#F59E0B'} />
              <Text style={s.modalTitle}>{showInterruption.type.toUpperCase()}</Text>
              <Text style={[s.modalSub, { textAlign: 'center' }]}>{showInterruption.message}</Text>
              <Pressable style={[s.btn, { backgroundColor: showInterruption.urgency === 'high' ? '#EF4444' : '#F59E0B', marginTop: 16 }]} onPress={() => handleInterruption(showInterruption.id)}>
                <Text style={s.btnText}>Acknowledge</Text>
              </Pressable>
            </>
          )}
        </View></View>
      </Modal>

      <Modal visible={showResources} transparent animationType="slide">
        <View style={s.modalBack}><View style={s.modal}>
          <Text style={s.modalTitle}>🏥 Resources</Text>
          {getResourceSummary(state).map((r: string, i: number) => <Text key={i} style={s.resText}>{r}</Text>)}
          <Pressable style={s.closeBtn} onPress={() => setShowResources(false)}><Text style={s.closeBtnText}>Close</Text></Pressable>
        </View></View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 10 },
  scroll: { flexGrow: 1 },
  title: { color: '#F8FAFC', fontSize: 26, fontWeight: '800' },
  subtitle: { color: '#94A3B8', fontSize: 16 },
  muted: { color: '#94A3B8', fontSize: 12 },
  link: { color: '#94A3B8', fontSize: 14, marginTop: 8 },
  card: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, width: '100%' },
  cardTitle: { color: '#F8FAFC', fontSize: 15, fontWeight: '700' },
  bar: { height: 5, backgroundColor: '#334155', borderRadius: 3, marginVertical: 8 },
  barFill: { height: '100%', backgroundColor: '#10B981', borderRadius: 3 },
  infoBox: { gap: 6, marginTop: 6 },
  infoLine: { color: '#E2E8F0', fontSize: 14 },
  btn: { backgroundColor: '#EF4444', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14, marginTop: 8 },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  xp: { color: '#F59E0B', fontSize: 38, fontWeight: '800' },
  badge: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  row: { flexDirection: 'row', gap: 16, marginTop: 4 },
  stat: { color: '#E2E8F0', fontSize: 14 },
  pearls: { backgroundColor: '#1E293B', padding: 14, borderRadius: 12, width: '100%', marginTop: 12 },
  pearlTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '700', marginBottom: 6 },
  pearl: { color: '#94A3B8', fontSize: 12, paddingVertical: 2, lineHeight: 18 },
  levelUp: { backgroundColor: '#10B98120', padding: 14, borderRadius: 12, marginTop: 8, width: '100%', alignItems: 'center' },
  levelUpText: { color: '#10B981', fontSize: 18, fontWeight: '800' },
  achs: { marginTop: 8 },
  ach: { color: '#F8FAFC', fontSize: 13, paddingVertical: 2 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingTop: 18, backgroundColor: '#1A1F2E', gap: 8 },
  hTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700' },
  hSub: { color: '#94A3B8', fontSize: 11 },
  hBtn: { backgroundColor: '#334155', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  hBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  hStat: { color: '#F59E0B', fontSize: 11, fontWeight: '700', backgroundColor: '#1E293B', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  hQueue: { color: '#F59E0B', fontSize: 11, fontWeight: '700', backgroundColor: '#F59E0B20', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  pause: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 100, justifyContent: 'center', alignItems: 'center', gap: 12 },
  pauseTitle: { color: '#FFF', fontSize: 28, fontWeight: '800' },
  list: { flex: 1, padding: 10 },
  alert: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F59E0B15', padding: 8, borderRadius: 8, marginBottom: 8 },
  alertText: { color: '#F59E0B', fontSize: 11, fontWeight: '600' },
  alertRed: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EF444420', padding: 8, borderRadius: 8, marginBottom: 8 },
  alertRedText: { color: '#EF4444', fontSize: 11, fontWeight: '600' },
  suggestedCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F59E0B15', padding: 10, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#F59E0B40' },
  suggestedText: { color: '#F59E0B', fontSize: 13, fontWeight: '600', flex: 1 },
  secTitle: { color: '#F8FAFC', fontSize: 13, fontWeight: '700', marginBottom: 6, marginTop: 4 },
  pCard: { backgroundColor: '#1E293B', padding: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#334155', marginBottom: 6 },
  pCritical: { borderLeftWidth: 3, borderLeftColor: '#EF4444' },
  pUrgent: { borderLeftWidth: 3, borderLeftColor: '#F59E0B' },
  pName: { color: '#F8FAFC', fontSize: 13, fontWeight: '600' },
  pComp: { color: '#94A3B8', fontSize: 11, marginTop: 1 },
  pTime: { color: '#EF4444', fontSize: 10, marginTop: 3, fontWeight: '600' },
  statusLine: { color: '#94A3B8', fontSize: 12, paddingVertical: 2 },
  consultCard: { backgroundColor: '#1E293B', padding: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#38BDF840', marginBottom: 6 },
  consultFrom: { color: '#38BDF8', fontSize: 12, fontWeight: '600' },
  consultDesc: { color: '#94A3B8', fontSize: 11, marginTop: 1 },
  logText: { color: '#64748B', fontSize: 10, paddingVertical: 1 },
  endBtn: { backgroundColor: '#10B981', margin: 10, padding: 14, borderRadius: 12, alignItems: 'center' },
  endBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  modalBack: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#1E293B', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%' },
  modalTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700' },
  modalSub: { color: '#94A3B8', fontSize: 12, marginTop: 4 },
  modalTimer: { color: '#EF4444', fontSize: 11, fontWeight: '600', marginTop: 4 },
  modalVitals: { color: '#38BDF8', fontSize: 11, fontWeight: '600', marginTop: 4, backgroundColor: '#0F172A', padding: 6, borderRadius: 6 },
  diagBtn: { backgroundColor: '#8B5CF620', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#8B5CF6', marginTop: 10, alignItems: 'center' },
  diagBtnText: { color: '#A78BFA', fontSize: 14, fontWeight: '600' },
  actTitle: { color: '#94A3B8', fontSize: 12, fontWeight: '700', marginTop: 14, marginBottom: 6 },
  actBtn: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#334155', gap: 8 },
  actName: { color: '#F8FAFC', fontSize: 13, fontWeight: '600' },
  actTime: { color: '#64748B', fontSize: 10, marginTop: 1 },
  actResult: { color: '#10B981', fontSize: 10, marginTop: 2, fontStyle: 'italic' },
  optBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#1E293B', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#334155', marginTop: 6 },
  optText: { color: '#E2E8F0', fontSize: 14, flex: 1 },
  closeBtn: { backgroundColor: '#334155', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  closeBtnText: { color: '#E2E8F0', fontWeight: '600' },
  resText: { color: '#E2E8F0', fontSize: 13, paddingVertical: 3 },
});
