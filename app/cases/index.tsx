import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, Modal, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator } from 'react-native';
import { useStore } from '../../src/store';
import { dummyCases } from '../../src/utils/dummyCases';
import { fetchAIResponse } from '../../src/services/aiService';
import { checkBadges } from '../../src/utils/badges';
import { calculateCaseScore } from '../../src/utils/scoring';

const medicalMenus: any = {
  history: ['Past Medical History (PMH)', 'Family History', 'Surgical History', 'Drug & Allergy History', 'Social & Occupational History', 'Systemic Review'],
  examination: ['Vital Signs', 'General Physical Examination', 'Cardiovascular Examination', 'Respiratory Examination', 'Abdominal / GI Examination', 'Neurological Examination'],
  labs: ['Complete Blood Count (CBC)', 'Renal Profile (U&E / KFT)', 'Liver Function Test (LFT)', 'Arterial Blood Gas (ABG)', 'Cardiac Enzymes (Troponin I/T)', 'Complete Metabolic Panel (CMP)'],
  imaging: ['Chest X-Ray (PA/AP)', 'CT Head (Non-Contrast)', 'CT Chest (PE Protocol)', 'Ultrasound Abdomen & Pelvis', 'Echocardiogram (TTE)', 'ECG']
};

export default function DiagnosticRoom() {
  const { addPoints, saveCaseResult, addBadge, completedCases } = useStore();
  const [interactions, setInteractions] = useState<{id: string, type: 'request' | 'response', text: string}[]>([]);
  const [inputText, setInputText] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [diagnosisModalVisible, setDiagnosisModalVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [finalDiagnosis, setFinalDiagnosis] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  
  // متغيرات نظام النقاط
  const [testsCount, setTestsCount] = useState(0);
  const [startTime] = useState(new Date());

  const currentCase = dummyCases[useStore((s) => s.subCategory) || 'Cardiology']?.[useStore((s) => s.difficulty) || 'Beginner']?.[0];

  const handleSendRequest = async (text: string) => {
    if (!text.trim()) return;
    
    // إذا كان الطلب من القوائم (ليس نصاً حراً)، نعتبره فحصاً ونزيد العداد
    if (activeMenu) setTestsCount(prev => prev + 1);

    const newRequest = { id: Date.now().toString(), type: 'request' as const, text };
    setInteractions((prev) => [...prev, newRequest]);
    setInputText('');
    setActiveMenu(null);

    const aiResult = await fetchAIResponse([], text);
    setInteractions((prev) => [...prev, { id: (Date.now() + 1).toString(), type: 'response', text: aiResult }]);
  };

  const handleSubmitDiagnosis = async () => {
    if (!finalDiagnosis.trim()) return;
    setIsEvaluating(true);
    setDiagnosisModalVisible(false);

    const timeTaken = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    const evaluationPrompt = `Evaluate: "${finalDiagnosis}". Correct is: "${currentCase.correctDiagnosis}". Is it correct? (Answer Yes/No)`;
    
    const result = await fetchAIResponse([], evaluationPrompt);
    
    // تحديد ما إذا كان التشخيص صحيحاً (بحث بسيط عن كلمة Yes)
    const isCorrect = result.toLowerCase().includes('yes');
    const finalScore = calculateCaseScore(isCorrect, testsCount, timeTaken);
    
    addPoints(finalScore);
    saveCaseResult(currentCase.id, finalScore);
    checkBadges(completedCases, addBadge);
    
    setFeedbackText(result);
    setIsEvaluating(false);
    setFeedbackModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* (باقي واجهة العرض تبقى كما هي) */}
      <View style={styles.caseHeader}>
        <Text style={styles.patientInfo}>{currentCase.patientInfo}</Text>
        <Text style={styles.chiefComplaint}>{currentCase.chiefComplaint}</Text>
      </View>

      <ScrollView style={styles.chatArea}>
        {interactions.map((msg) => (
          <View key={msg.id} style={[styles.messageBubble, msg.type === 'request' ? styles.requestBubble : styles.responseBubble]}>
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.quickActions}>
        <Pressable style={styles.actionBtn} onPress={() => setActiveMenu('history')}><Text style={styles.actionBtnText}>History</Text></Pressable>
        <Pressable style={styles.actionBtn} onPress={() => setActiveMenu('examination')}><Text style={styles.actionBtnText}>Exam</Text></Pressable>
        <Pressable style={styles.actionBtn} onPress={() => setActiveMenu('labs')}><Text style={styles.actionBtnText}>Labs</Text></Pressable>
      </View>

      <View style={styles.inputContainer}>
        <Pressable style={styles.finalDiagnosisBtn} onPress={() => setDiagnosisModalVisible(true)}><Text style={styles.finalDiagnosisText}>Final Diagnosis</Text></Pressable>
      </View>

      {/* Modals... */}
      <Modal visible={!!activeMenu} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
            <View style={styles.menuContainer}>
                <FlatList data={activeMenu ? medicalMenus[activeMenu] : []} renderItem={({ item }) => (
                    <Pressable style={styles.menuItem} onPress={() => handleSendRequest(item)}><Text style={styles.menuItemText}>{item}</Text></Pressable>
                )} />
            </View>
        </View>
      </Modal>

      <Modal visible={diagnosisModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
            <View style={styles.diagnosisContainer}>
                <TextInput style={styles.diagnosisInput} value={finalDiagnosis} onChangeText={setFinalDiagnosis} placeholder="Diagnosis..." />
                <Pressable style={styles.submitBtn} onPress={handleSubmitDiagnosis}><Text style={styles.submitBtnText}>Submit</Text></Pressable>
            </View>
        </View>
      </Modal>

      {isEvaluating && <ActivityIndicator size="large" color="#10B981" style={StyleSheet.absoluteFill} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  caseHeader: { backgroundColor: '#1E293B', padding: 16 },
  patientInfo: { color: '#38BDF8', fontWeight: 'bold' },
  chiefComplaint: { color: '#F8FAFC', marginTop: 8 },
  chatArea: { flex: 1, padding: 16 },
  messageBubble: { padding: 12, borderRadius: 8, marginBottom: 8 },
  requestBubble: { backgroundColor: '#0284C7', alignSelf: 'flex-end' },
  responseBubble: { backgroundColor: '#334155', alignSelf: 'flex-start' },
  messageText: { color: '#FFF' },
  quickActions: { flexDirection: 'row', padding: 10 },
  actionBtn: { flex: 1, backgroundColor: '#1E293B', margin: 4, padding: 10, alignItems: 'center' },
  actionBtnText: { color: '#38BDF8', fontSize: 12 },
  inputContainer: { padding: 16, backgroundColor: '#1E293B' },
  finalDiagnosisBtn: { backgroundColor: '#10B981', padding: 16, borderRadius: 8, alignItems: 'center' },
  finalDiagnosisText: { color: '#0F172A', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  menuContainer: { backgroundColor: '#1E293B', padding: 20 },
  menuItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#334155' },
  menuItemText: { color: '#38BDF8' },
  diagnosisContainer: { backgroundColor: '#1E293B', padding: 20, margin: 20, borderRadius: 16 },
  diagnosisInput: { backgroundColor: '#0F172A', color: '#FFF', padding: 16, borderRadius: 8, height: 100 },
  submitBtn: { backgroundColor: '#10B981', padding: 16, marginTop: 16, alignItems: 'center', borderRadius: 8 },
  submitBtnText: { color: '#0F172A', fontWeight: 'bold' }
});
