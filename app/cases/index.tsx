import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, Modal, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator } from 'react-native';
import { useStore } from '../../src/store';
import { dummyCases } from '../../src/utils/dummyCases';
import { fetchAIResponse } from '../../src/services/aiService';

const medicalMenus: any = {
  history: ['Past Medical History (PMH)', 'Family History', 'Surgical History', 'Drug & Allergy History', 'Social & Occupational History', 'Systemic Review'],
  examination: ['Vital Signs', 'General Physical Examination', 'Cardiovascular Examination', 'Respiratory Examination', 'Abdominal / GI Examination', 'Neurological Examination'],
  labs: ['Complete Blood Count (CBC)', 'Renal Profile (U&E / KFT)', 'Liver Function Test (LFT)', 'Arterial Blood Gas (ABG)', 'Cardiac Enzymes (Troponin I/T)', 'Complete Metabolic Panel (CMP)'],
  imaging: ['Chest X-Ray (PA/AP)', 'CT Head (Non-Contrast)', 'CT Chest (PE Protocol)', 'Ultrasound Abdomen & Pelvis', 'Echocardiogram (TTE)', 'ECG']
};

export default function DiagnosticRoom() {
  const { subCategory, difficulty, score, deductPoints, saveCaseResult } = useStore();
  const [interactions, setInteractions] = useState<{id: string, type: 'request' | 'response', text: string}[]>([]);
  const [inputText, setInputText] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [diagnosisModalVisible, setDiagnosisModalVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [finalDiagnosis, setFinalDiagnosis] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const currentCase = dummyCases[subCategory || 'Cardiology']?.[difficulty || 'Beginner']?.[0] || dummyCases['Cardiology']['Beginner'][0];

  const handleSendRequest = async (text: string) => {
    if (!text.trim()) return;
    deductPoints(2);
    const newRequest = { id: Date.now().toString(), type: 'request' as const, text };
    setInteractions((prev) => [...prev, newRequest]);
    setInputText('');
    setActiveMenu(null);
    setIsTyping(true);

    const hiddenContext = `Current Patient Facts (STRICTLY USE THIS DATA): - Info: ${currentCase.patientInfo} - Chief Complaint: ${currentCase.chiefComplaint} - Clinical Data & Lab Results: ${JSON.stringify(currentCase.data)}`;

    const apiHistory = [
      { role: 'system', content: hiddenContext },
      ...interactions.map(msg => ({ role: msg.type === 'request' ? 'user' : 'assistant', content: msg.text }))
    ];

    const aiResult = await fetchAIResponse(apiHistory, text);
    setInteractions((prev) => [...prev, { id: (Date.now() + 1).toString(), type: 'response', text: aiResult }]);
    setIsTyping(false);
  };

  const handleSubmitDiagnosis = async () => {
    if (!finalDiagnosis.trim()) return;
    setIsEvaluating(true);
    setDiagnosisModalVisible(false);

    const evaluationPrompt = `CRITICAL ACTION: EVALUATE RESIDENT PERFORMANCE.
      The resident has submitted their Final Diagnosis: "${finalDiagnosis}"
      Review the entire interaction history, the tests they requested, and compare their submission with the correct diagnosis: "${currentCase.correctDiagnosis}".
      Provide a comprehensive, professional evaluation report.`;

    const hiddenContext = `Correct Diagnosis: ${currentCase.correctDiagnosis}`;
    const apiHistory = [...interactions.map(msg => ({ role: msg.type === 'request' ? 'user' : 'assistant', content: msg.text }))];

    const result = await fetchAIResponse(apiHistory, evaluationPrompt);
    setFeedbackText(result);
    
    // حفظ النتيجة في الـ Store
    saveCaseResult(currentCase.id, score);
    
    setIsEvaluating(false);
    setFeedbackModalVisible(true);
  };

  const handleContentSizeChange = () => scrollViewRef.current?.scrollToEnd({ animated: true });

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <View style={styles.caseHeader}>
        <View style={styles.headerTopRow}>
          <Text style={styles.patientInfo}>{currentCase.patientInfo}</Text>
          <Text style={[styles.scoreBadge, score < 50 && styles.scoreWarning]}>Score: {score}</Text>
        </View>
        <Text style={styles.chiefComplaint}>{currentCase.chiefComplaint}</Text>
      </View>

      <ScrollView ref={scrollViewRef} style={styles.chatArea} contentContainerStyle={styles.chatContent} onContentSizeChange={handleContentSizeChange}>
        {interactions.map((msg) => (
          <View key={msg.id} style={[styles.messageBubble, msg.type === 'request' ? styles.requestBubble : styles.responseBubble]}>
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
        {isTyping && <View style={[styles.messageBubble, styles.responseBubble]}><Text style={[styles.messageText, { fontStyle: 'italic', color: '#94A3B8' }]}>Consultant is reviewing...</Text></View>}
      </ScrollView>

      {isEvaluating && (
        <View style={styles.evaluatingOverlay}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.evaluatingText}>Attending Physician is evaluating your performance...</Text>
        </View>
      )}

      <View style={styles.quickActions}>
        <Pressable style={styles.actionBtn} onPress={() => setActiveMenu('history')}><Text style={styles.actionBtnText}>History</Text></Pressable>
        <Pressable style={styles.actionBtn} onPress={() => setActiveMenu('examination')}><Text style={styles.actionBtnText}>Exam</Text></Pressable>
        <Pressable style={styles.actionBtn} onPress={() => setActiveMenu('labs')}><Text style={styles.actionBtnText}>Labs</Text></Pressable>
        <Pressable style={styles.actionBtn} onPress={() => setActiveMenu('imaging')}><Text style={styles.actionBtnText}>Imaging</Text></Pressable>
      </View>

      <View style={styles.inputContainer}>
        <Pressable style={styles.finalDiagnosisBtn} onPress={() => setDiagnosisModalVisible(true)} disabled={isEvaluating}>
          <Text style={styles.finalDiagnosisText}>Final Diagnosis</Text>
        </Pressable>
        <View style={styles.inputRow}>
          <TextInput style={styles.textInput} placeholder="Type custom request..." placeholderTextColor="#64748B" value={inputText} onChangeText={setInputText} onSubmitEditing={() => handleSendRequest(inputText)} editable={!isTyping && !isEvaluating} />
          <Pressable style={[styles.sendBtn, (isTyping || isEvaluating) && { opacity: 0.5 }]} onPress={() => handleSendRequest(inputText)} disabled={isTyping || isEvaluating}><Text style={styles.sendBtnText}>Send</Text></Pressable>
        </View>
      </View>

      {/* Modals remain same as original file */}
      <Modal visible={!!activeMenu} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}><View style={styles.menuContainer}><Text style={styles.menuTitle}>Select {activeMenu}</Text><FlatList data={activeMenu ? medicalMenus[activeMenu] : []} keyExtractor={(item) => item} renderItem={({ item }) => (<Pressable style={styles.menuItem} onPress={() => handleSendRequest(item)}><Text style={styles.menuItemText}>{item}</Text></Pressable>)} /><Pressable style={styles.closeMenuBtn} onPress={() => setActiveMenu(null)}><Text style={styles.closeMenuText}>Cancel</Text></Pressable></View></View>
      </Modal>

      <Modal visible={diagnosisModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}><View style={styles.diagnosisContainer}><Text style={styles.diagnosisTitle}>Submit Final Diagnosis</Text><TextInput style={styles.diagnosisInput} placeholder="Enter your final diagnosis..." value={finalDiagnosis} onChangeText={setFinalDiagnosis} /><View style={styles.diagnosisActionRow}><Pressable style={styles.cancelBtn} onPress={() => setDiagnosisModalVisible(false)}><Text style={styles.cancelBtnText}>Cancel</Text></Pressable><Pressable style={styles.submitBtn} onPress={handleSubmitDiagnosis}><Text style={styles.submitBtnText}>Submit Case</Text></Pressable></View></View></View>
      </Modal>

      <Modal visible={feedbackModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}><View style={styles.feedbackContainer}><Text style={styles.feedbackTitle}>📋 Evaluation Report</Text><ScrollView style={styles.feedbackScroll}><Text style={styles.feedbackContentText}>{feedbackText}</Text></ScrollView><Pressable style={styles.closeFeedbackBtn} onPress={() => setFeedbackModalVisible(false)}><Text style={styles.closeFeedbackText}>Return to Station</Text></Pressable></View></View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  caseHeader: { backgroundColor: '#1E293B', padding: 16, borderBottomWidth: 1, borderBottomColor: '#334155' },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  patientInfo: { color: '#38BDF8', fontSize: 14, fontWeight: 'bold' },
  scoreBadge: { backgroundColor: '#10B981', color: '#0F172A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontWeight: 'bold', overflow: 'hidden' },
  scoreWarning: { backgroundColor: '#EF4444', color: '#F8FAFC' },
  chiefComplaint: { color: '#F8FAFC', fontSize: 16, lineHeight: 24 },
  chatArea: { flex: 1 }, chatContent: { padding: 16, paddingBottom: 20 },
  messageBubble: { maxWidth: '85%', padding: 14, borderRadius: 12, marginBottom: 12 }, requestBubble: { backgroundColor: '#0284C7', alignSelf: 'flex-end', borderBottomRightRadius: 2 }, responseBubble: { backgroundColor: '#334155', alignSelf: 'flex-start', borderBottomLeftRadius: 2 }, messageText: { color: '#F8FAFC', fontSize: 15, lineHeight: 22 },
  quickActions: { flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#0F172A', justifyContent: 'space-between' }, actionBtn: { flex: 1, backgroundColor: '#1E293B', marginHorizontal: 4, paddingVertical: 10, borderRadius: 6, alignItems: 'center', borderWidth: 1, borderColor: '#334155' }, actionBtnText: { color: '#38BDF8', fontSize: 12, fontWeight: '600' },
  inputContainer: { padding: 12, paddingBottom: 24, backgroundColor: '#1E293B', borderTopWidth: 1, borderTopColor: '#334155' },
  finalDiagnosisBtn: { backgroundColor: '#10B981', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 }, finalDiagnosisText: { color: '#0F172A', fontWeight: 'bold', fontSize: 16 }, inputRow: { flexDirection: 'row', alignItems: 'center' }, textInput: { flex: 1, backgroundColor: '#0F172A', color: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#334155', marginRight: 10 }, sendBtn: { backgroundColor: '#38BDF8', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 8 }, sendBtnText: { color: '#0F172A', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.85)', justifyContent: 'flex-end' }, menuContainer: { backgroundColor: '#1E293B', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '70%' }, menuTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }, menuItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#334155' }, menuItemText: { color: '#38BDF8', fontSize: 16 }, closeMenuBtn: { marginTop: 16, padding: 16, backgroundColor: '#334155', borderRadius: 8, alignItems: 'center' }, closeMenuText: { color: '#F8FAFC', fontWeight: 'bold' },
  diagnosisContainer: { backgroundColor: '#1E293B', padding: 24, margin: 16, borderRadius: 16, marginBottom: 'auto', marginTop: 'auto' }, diagnosisTitle: { color: '#10B981', fontSize: 20, fontWeight: 'bold', marginBottom: 8 }, diagnosisInput: { backgroundColor: '#0F172A', color: '#F8FAFC', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#334155', height: 120, textAlignVertical: 'top', marginBottom: 20 }, diagnosisActionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }, cancelBtn: { padding: 12 }, cancelBtnText: { color: '#94A3B8', fontWeight: 'bold' }, submitBtn: { backgroundColor: '#10B981', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }, submitBtnText: { color: '#0F172A', fontWeight: 'bold' },
  evaluatingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 23, 42, 0.9)', justifyContent: 'center', alignItems: 'center', zIndex: 50 }, evaluatingText: { color: '#F8FAFC', marginTop: 16, fontSize: 16, fontWeight: '500', textAlign: 'center', paddingHorizontal: 20 },
  feedbackContainer: { backgroundColor: '#1E293B', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, height: '85%', width: '100%' }, feedbackTitle: { color: '#F59E0B', fontSize: 22, fontWeight: 'bold', marginBottom: 16 }, feedbackScroll: { flex: 1, marginBottom: 16 }, feedbackContentText: { color: '#E2E8F0', fontSize: 15, lineHeight: 24 }, closeFeedbackBtn: { backgroundColor: '#38BDF8', padding: 16, borderRadius: 12, alignItems: 'center' }, closeFeedbackText: { color: '#0F172A', fontWeight: 'bold', fontSize: 16 }
});
