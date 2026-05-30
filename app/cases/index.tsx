import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, Modal, KeyboardAvoidingView, Platform, FlatList } from 'react-native';

// --- Medical Dictionaries (Consultant Level) ---
const medicalMenus: any = {
  history: [
    'Past Medical History (PMH)', 
    'Family History', 
    'Surgical History', 
    'Drug & Allergy History', 
    'Social & Occupational History',
    'Systemic Review'
  ],
  examination: [
    'Vital Signs', 
    'General Physical Examination', 
    'Cardiovascular Examination', 
    'Respiratory Examination', 
    'Abdominal / GI Examination', 
    'Neurological Examination'
  ],
  labs: [
    'Complete Blood Count (CBC)', 
    'Renal Profile (U&E / KFT)', 
    'Liver Function Test (LFT)', 
    'Arterial Blood Gas (ABG)', 
    'Cardiac Enzymes (Troponin I/T)', 
    'Coagulation Profile (PT/aPTT/INR)',
    'Inflammatory Markers (CRP/ESR)'
  ],
  imaging: [
    'Chest X-Ray (PA/AP)', 
    'CT Head (Non-Contrast)', 
    'CT Chest (PE Protocol)', 
    'Ultrasound Abdomen & Pelvis', 
    'Echocardiogram (TTE)',
    'MRI Brain'
  ]
};

export default function DiagnosticRoom() {
  const [interactions, setInteractions] = useState<{id: string, type: 'request' | 'response', text: string}[]>([]);
  const [inputText, setInputText] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [diagnosisModalVisible, setDiagnosisModalVisible] = useState(false);
  const [finalDiagnosis, setFinalDiagnosis] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  // Function to handle sending a request
  const handleSendRequest = (text: string) => {
    if (!text.trim()) return;
    
    const newRequest = { id: Date.now().toString(), type: 'request' as const, text };
    setInteractions((prev) => [...prev, newRequest]);
    setInputText('');
    setActiveMenu(null);

    // Simulate system receiving the request (Hybrid Logic placeholder)
    setTimeout(() => {
      setInteractions((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'response',
        text: `Pending results for: ${text}... (Data will be fetched from Firestore)`
      }]);
    }, 1000);
  };

  // Auto-scroll to bottom
  const handleContentSizeChange = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* 1. Case Header */}
      <View style={styles.caseHeader}>
        <Text style={styles.patientInfo}>Patient: 60M | ID: #88219</Text>
        <Text style={styles.chiefComplaint}>Chief Complaint: Shortness of breath (SOB) starting 2 hours ago, accompanied by chest tightness.</Text>
      </View>

      {/* 2. Interaction Log (Chat-like area) */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatArea} 
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={handleContentSizeChange}
      >
        {interactions.map((msg) => (
          <View key={msg.id} style={[styles.messageBubble, msg.type === 'request' ? styles.requestBubble : styles.responseBubble]}>
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* 3. Quick Action Buttons */}
      <View style={styles.quickActions}>
        <Pressable style={styles.actionBtn} onPress={() => setActiveMenu('history')}><Text style={styles.actionBtnText}>History</Text></Pressable>
        <Pressable style={styles.actionBtn} onPress={() => setActiveMenu('examination')}><Text style={styles.actionBtnText}>Exam</Text></Pressable>
        <Pressable style={styles.actionBtn} onPress={() => setActiveMenu('labs')}><Text style={styles.actionBtnText}>Labs</Text></Pressable>
        <Pressable style={styles.actionBtn} onPress={() => setActiveMenu('imaging')}><Text style={styles.actionBtnText}>Imaging</Text></Pressable>
      </View>

      {/* 4. Input Area & Final Diagnosis Button */}
      <View style={styles.inputContainer}>
        <Pressable style={styles.finalDiagnosisBtn} onPress={() => setDiagnosisModalVisible(true)}>
          <Text style={styles.finalDiagnosisText}>Final Diagnosis</Text>
        </Pressable>
        
        <View style={styles.inputRow}>
          <TextInput 
            style={styles.textInput}
            placeholder="Type custom request (e.g. D-dimer)..."
            placeholderTextColor="#64748B"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSendRequest(inputText)}
          />
          <Pressable style={styles.sendBtn} onPress={() => handleSendRequest(inputText)}>
            <Text style={styles.sendBtnText}>Send</Text>
          </Pressable>
        </View>
      </View>

      {/* --- Menus Modal (For History, Exam, Labs, Imaging) --- */}
      <Modal visible={!!activeMenu} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Select {activeMenu}</Text>
            <FlatList 
              data={activeMenu ? medicalMenus[activeMenu] : []}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable style={styles.menuItem} onPress={() => handleSendRequest(item)}>
                  <Text style={styles.menuItemText}>{item}</Text>
                </Pressable>
              )}
            />
            <Pressable style={styles.closeMenuBtn} onPress={() => setActiveMenu(null)}>
              <Text style={styles.closeMenuText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* --- Final Diagnosis Modal --- */}
      <Modal visible={diagnosisModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.diagnosisContainer}>
            <Text style={styles.diagnosisTitle}>Submit Final Diagnosis</Text>
            <Text style={styles.diagnosisSubtitle}>Warning: Submitting will end the case.</Text>
            <TextInput 
              style={styles.diagnosisInput}
              placeholder="Enter your final diagnosis here..."
              placeholderTextColor="#64748B"
              multiline
              value={finalDiagnosis}
              onChangeText={setFinalDiagnosis}
            />
            <View style={styles.diagnosisActionRow}>
              <Pressable style={styles.cancelBtn} onPress={() => setDiagnosisModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.submitBtn} onPress={() => {
                setDiagnosisModalVisible(false);
                alert('Diagnosis Submitted for Evaluation!');
              }}>
                <Text style={styles.submitBtnText}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  
  // Header
  caseHeader: { backgroundColor: '#1E293B', padding: 16, borderBottomWidth: 1, borderBottomColor: '#334155' },
  patientInfo: { color: '#38BDF8', fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  chiefComplaint: { color: '#F8FAFC', fontSize: 16, lineHeight: 24 },
  
  // Chat Area
  chatArea: { flex: 1 },
  chatContent: { padding: 16, paddingBottom: 20 },
  messageBubble: { maxWidth: '85%', padding: 14, borderRadius: 12, marginBottom: 12 },
  requestBubble: { backgroundColor: '#0284C7', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  responseBubble: { backgroundColor: '#334155', alignSelf: 'flex-start', borderBottomLeftRadius: 2 },
  messageText: { color: '#F8FAFC', fontSize: 15, lineHeight: 22 },

  // Quick Actions
  quickActions: { flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#0F172A', justifyContent: 'space-between' },
  actionBtn: { flex: 1, backgroundColor: '#1E293B', marginHorizontal: 4, paddingVertical: 10, borderRadius: 6, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  actionBtnText: { color: '#38BDF8', fontSize: 12, fontWeight: '600' },

  // Input Area
  inputContainer: { padding: 12, backgroundColor: '#1E293B', borderTopWidth: 1, borderTopColor: '#334155' },
  finalDiagnosisBtn: { backgroundColor: '#10B981', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  finalDiagnosisText: { color: '#0F172A', fontWeight: 'bold', fontSize: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  textInput: { flex: 1, backgroundColor: '#0F172A', color: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#334155', marginRight: 10 },
  sendBtn: { backgroundColor: '#38BDF8', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 8 },
  sendBtnText: { color: '#0F172A', fontWeight: 'bold' },

  // Modals Overlay
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.85)', justifyContent: 'flex-end' },
  
  // Menu Modal
  menuContainer: { backgroundColor: '#1E293B', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '70%' },
  menuTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', textTransform: 'capitalize' },
  menuItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#334155' },
  menuItemText: { color: '#38BDF8', fontSize: 16 },
  closeMenuBtn: { marginTop: 16, padding: 16, backgroundColor: '#334155', borderRadius: 8, alignItems: 'center' },
  closeMenuText: { color: '#F8FAFC', fontWeight: 'bold' },

  // Diagnosis Modal
  diagnosisContainer: { backgroundColor: '#1E293B', padding: 24, margin: 16, borderRadius: 16, marginBottom: 'auto', marginTop: 'auto' },
  diagnosisTitle: { color: '#10B981', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  diagnosisSubtitle: { color: '#94A3B8', fontSize: 14, marginBottom: 20 },
  diagnosisInput: { backgroundColor: '#0F172A', color: '#F8FAFC', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#334155', height: 120, textAlignVertical: 'top', marginBottom: 20 },
  diagnosisActionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelBtn: { padding: 12 },
  cancelBtnText: { color: '#94A3B8', fontWeight: 'bold' },
  submitBtn: { backgroundColor: '#10B981', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  submitBtnText: { color: '#0F172A', fontWeight: 'bold' },
});
