import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  Platform,
  FlatList,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useStore } from '../../src/store';
import { dummyCases } from '../../src/utils/dummyCases';
import { fetchAIResponse } from '../../src/services/aiService';
import { checkBadges } from '../../src/utils/badges';
import { calculateCaseScore, getScoreGrade, getTimeString } from '../../src/utils/scoring';
import { getAvailableHints, getDiagnosisHint } from '../../src/utils/hints';

const MEDICAL_MENUS = {
  history: [
    { id: 'pmh', text: 'Past Medical History (PMH)', icon: 'clipboard-text' },
    { id: 'family', text: 'Family History', icon: 'account-group' },
    { id: 'surgical', text: 'Surgical History', icon: 'needle' },
    { id: 'allergy', text: 'Drug & Allergy History', icon: 'allergy' },
    { id: 'social', text: 'Social & Occupational History', icon: 'domain' },
    { id: 'systemic', text: 'Systemic Review', icon: 'clipboard-pulse' },
  ],
  examination: [
    { id: 'vitals', text: 'Vital Signs', icon: 'heart-pulse' },
    { id: 'general', text: 'General Physical Examination', icon: 'human' },
    { id: 'cardio', text: 'Cardiovascular Examination', icon: 'heart' },
    { id: 'respiratory', text: 'Respiratory Examination', icon: 'lungs' },
    { id: 'abdominal', text: 'Abdominal / GI Examination', icon: 'stomach' },
    { id: 'neuro', text: 'Neurological Examination', icon: 'brain' },
  ],
  labs: [
    { id: 'cbc', text: 'Complete Blood Count (CBC)', icon: 'blood-bag' },
    { id: 'renal', text: 'Renal Profile (U&E / KFT)', icon: 'kidney' },
    { id: 'lft', text: 'Liver Function Test (LFT)', icon: 'liver' },
    { id: 'abg', text: 'Arterial Blood Gas (ABG)', icon: 'gas-cylinder' },
    { id: 'troponin', text: 'Cardiac Enzymes (Troponin I/T)', icon: 'heart-flash' },
    { id: 'cmp', text: 'Complete Metabolic Panel (CMP)', icon: 'flask' },
  ],
  imaging: [
    { id: 'cxr', text: 'Chest X-Ray (PA/AP)', icon: 'x-ray' },
    { id: 'ct-head', text: 'CT Head (Non-Contrast)', icon: 'head-cog' },
    { id: 'ct-pe', text: 'CT Chest (PE Protocol)', icon: 'image-area' },
    { id: 'us-abd', text: 'Ultrasound Abdomen & Pelvis', icon: 'wave' },
    { id: 'echo', text: 'Echocardiogram (TTE)', icon: 'cardiology' },
    { id: 'ecg', text: 'ECG', icon: 'monitor-waveform' },
  ],
};

export default function DiagnosticRoom() {
  const { 
    addPoints, 
    saveCaseResult, 
    addBadge, 
    completedCases, 
    getAccuracy, 
    getUniqueSpecialties,
    dailyChallenge,
    completeDailyChallenge,
    deductPoints 
  } = useStore();
  
  const [interactions, setInteractions] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [diagnosisModalVisible, setDiagnosisModalVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [hintsModalVisible, setHintsModalVisible] = useState(false);
  const [finalDiagnosis, setFinalDiagnosis] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [testsCount, setTestsCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const subCategory = useStore((s) => s.subCategory);
  const difficulty = useStore((s) => s.difficulty);
  const currentCase = dummyCases[subCategory || 'Cardiology']?.[difficulty || 'Beginner']?.[0];

  const isDailyChallengeCase = dailyChallenge?.caseId === currentCase?.id && !dailyChallenge?.completed;

  const orderedTests = interactions
    .filter(i => i.type === 'request')
    .map(i => i.menuType);

  const availableHints = getAvailableHints(currentCase, orderedTests);

  const handleSendRequest = async (text: string) => {
    if (!text.trim() || isLoading) return;

    if (activeMenu) {
      setTestsCount((prev) => prev + 1);
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }

    setIsLoading(true);
    const newRequest = {
      id: Date.now().toString(),
      type: 'request',
      text,
      timestamp: new Date(),
      menuType: activeMenu,
    };

    setInteractions((prev) => [...prev, newRequest]);
    setInputText('');
    setActiveMenu(null);

    try {
      const aiResult = await fetchAIResponse([], text);
      setInteractions((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'response',
          text: aiResult,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      Alert.alert('Connection Error', 'Unable to get response.', [
        { text: 'Retry', onPress: () => handleSendRequest(text) },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseHint = (hint: any) => {
    setHintsUsed(prev => prev + 1);
    deductPoints(hint.cost);
    setHintsModalVisible(false);
    
    setInteractions((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'response',
        text: `💡 Hint: ${hint.text} (-${hint.cost} pts)`,
        timestamp: new Date(),
        isHint: true,
      },
    ]);

    Alert.alert('Hint Used', `-${hint.cost} points deducted from your score.`);
  };

  const handleUseDiagnosisHint = () => {
    const hint = getDiagnosisHint(currentCase.correctDiagnosis);
    setHintsUsed(prev => prev + 1);
    deductPoints(20);
    setHintsModalVisible(false);

    setInteractions((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'response',
        text: `💡 Diagnosis Hint: ${hint} (-20 pts)`,
        timestamp: new Date(),
        isHint: true,
      },
    ]);

    Alert.alert('Diagnosis Hint Used', '-20 points deducted.');
  };

  const handleSubmitDiagnosis = async () => {
    if (!finalDiagnosis.trim()) return;

    setIsEvaluating(true);
    setDiagnosisModalVisible(false);

    const timeTaken = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    const evaluationPrompt = `Evaluate this medical diagnosis. Student answer: "${finalDiagnosis}". Correct answer: "${currentCase.correctDiagnosis}". Is it correct? Answer with Yes or No and provide brief feedback.`;

    try {
      const result = await fetchAIResponse([], evaluationPrompt);
      const isCorrect = result.toLowerCase().includes('yes');
      
      const { score, breakdown } = calculateCaseScore(
        isCorrect,
        testsCount,
        timeTaken,
        isDailyChallengeCase,
        difficulty || 'Beginner'
      );

      addPoints(score);
      saveCaseResult(currentCase.id, score);

      if (isDailyChallengeCase) {
        completeDailyChallenge(dailyChallenge?.bonusPoints || 0);
      }

      const accuracy = getAccuracy();
      const specialtiesCount = getUniqueSpecialties();
      const currentPoints = useStore.getState().totalPoints;

      checkBadges(
        completedCases,
        addBadge,
        currentPoints,
        accuracy,
        specialtiesCount,
        timeTaken
      );

      const grade = getScoreGrade(score);
      const timeStr = getTimeString(timeTaken);

      const feedbackMessage = `${result}\n\n📊 Score Breakdown:\n• Grade: ${grade.emoji} ${grade.grade}\n• Time: ${timeStr}\n• Tests Ordered: ${testsCount}\n• Hints Used: ${hintsUsed}\n• Final Score: ${score} pts${isDailyChallengeCase ? `\n• Daily Bonus: +${dailyChallenge?.bonusPoints || 0} bonus pts` : ''}`;

      setFeedbackText(feedbackMessage);
      setIsEvaluating(false);
      setFeedbackModalVisible(true);
    } catch (error) {
      setIsEvaluating(false);
      Alert.alert('Error', 'Failed to evaluate diagnosis.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.caseHeader}>
        <View style={styles.headerTop}>
          <View style={styles.badge}>
            <MaterialCommunityIcons name="hospital-building" size={14} color="#38BDF8" />
            <Text style={styles.badgeText}>{currentCase?.department || 'Emergency'}</Text>
          </View>
          <View style={styles.timerBadge}>
            <MaterialCommunityIcons name="clock-outline" size={14} color="#10B981" />
            <Text style={styles.timerText}>Active</Text>
          </View>
        </View>
        {isDailyChallengeCase && (
          <View style={styles.dailyBadge}>
            <MaterialCommunityIcons name="fire" size={14} color="#F59E0B" />
            <Text style={styles.dailyBadgeText}>Daily Challenge (+{dailyChallenge?.bonusPoints} bonus)</Text>
          </View>
        )}
        <Text style={styles.patientInfo}>{currentCase?.patientInfo}</Text>
        <Text style={styles.chiefComplaint}>{currentCase?.chiefComplaint}</Text>
      </View>

      <View style={styles.statsBar}>
        <Animated.View style={[styles.statItem, { transform: [{ scale: pulseAnim }] }]}>
          <MaterialCommunityIcons name="flask" size={14} color="#38BDF8" />
          <Text style={styles.statText}>{testsCount} Tests</Text>
        </Animated.View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="lightbulb-on" size={14} color="#F59E0B" />
          <Text style={styles.statText}>{hintsUsed} Hints</Text>
        </View>
        <Pressable style={styles.hintBtn} onPress={() => setHintsModalVisible(true)}>
          <MaterialCommunityIcons name="lightbulb" size={16} color="#F59E0B" />
          <Text style={styles.hintBtnText}>Hints</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatArea}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {interactions.length === 0 && (
          <View style={styles.welcomeBubble}>
            <MaterialCommunityIcons name="robot" size={20} color="#10B981" />
            <Text style={styles.welcomeText}>
              📋 What would you like to investigate? Select from the options below or type your query.
            </Text>
          </View>
        )}

        {interactions.map((msg) => (
          <View key={msg.id} style={styles.messageRow}>
            {msg.type === 'response' && (
              <View style={[styles.aiIcon, msg.isHint && styles.hintIcon]}>
                <MaterialCommunityIcons 
                  name={msg.isHint ? "lightbulb" : "brain"} 
                  size={16} 
                  color={msg.isHint ? "#F59E0B" : "#10B981"} 
                />
              </View>
            )}
            <View
              style={[
                styles.messageBubble,
                msg.type === 'request' ? styles.requestBubble : styles.responseBubble,
                msg.isHint && styles.hintBubble,
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
              {msg.menuType && (
                <View style={styles.menuTag}>
                  <MaterialCommunityIcons name="tag" size={8} color="#64748B" />
                  <Text style={styles.menuTagText}>{msg.menuType}</Text>
                </View>
              )}
            </View>
            {msg.type === 'request' && (
              <View style={styles.userIcon}>
                <MaterialCommunityIcons name="doctor" size={16} color="#3B82F6" />
              </View>
            )}
          </View>
        ))}

        {isLoading && (
          <View style={styles.loadingBubble}>
            <ActivityIndicator size="small" color="#38BDF8" />
            <Text style={styles.loadingText}>Analyzing...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.quickActions}>
        <Pressable
          style={[styles.actionBtn, activeMenu === 'history' && styles.activeBtn]}
          onPress={() => setActiveMenu(activeMenu === 'history' ? null : 'history')}
        >
          <MaterialCommunityIcons name="clipboard-text" size={18} color={activeMenu === 'history' ? '#FFF' : '#38BDF8'} />
          <Text style={[styles.actionBtnText, activeMenu === 'history' && styles.activeBtnText]}>History</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, activeMenu === 'examination' && styles.activeBtn]}
          onPress={() => setActiveMenu(activeMenu === 'examination' ? null : 'examination')}
        >
          <MaterialCommunityIcons name="stethoscope" size={18} color={activeMenu === 'examination' ? '#FFF' : '#10B981'} />
          <Text style={[styles.actionBtnText, activeMenu === 'examination' && styles.activeBtnText]}>Exam</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, activeMenu === 'labs' && styles.activeBtn]}
          onPress={() => setActiveMenu(activeMenu === 'labs' ? null : 'labs')}
        >
          <MaterialCommunityIcons name="flask" size={18} color={activeMenu === 'labs' ? '#FFF' : '#F59E0B'} />
          <Text style={[styles.actionBtnText, activeMenu === 'labs' && styles.activeBtnText]}>Labs</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, activeMenu === 'imaging' && styles.activeBtn]}
          onPress={() => setActiveMenu(activeMenu === 'imaging' ? null : 'imaging')}
        >
          <MaterialCommunityIcons name="image-area" size={18} color={activeMenu === 'imaging' ? '#FFF' : '#8B5CF6'} />
          <Text style={[styles.actionBtnText, activeMenu === 'imaging' && styles.activeBtnText]}>Imaging</Text>
        </Pressable>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your investigation..."
            placeholderTextColor="#64748B"
            multiline
            onSubmitEditing={() => inputText.trim() && handleSendRequest(inputText)}
          />
          <Pressable
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={() => handleSendRequest(inputText)}
            disabled={!inputText.trim() || isLoading}
          >
            <MaterialCommunityIcons name="send" size={18} color={inputText.trim() ? '#0F172A' : '#64748B'} />
          </Pressable>
        </View>
        <Pressable style={styles.finalDiagnosisBtn} onPress={() => setDiagnosisModalVisible(true)}>
          <MaterialCommunityIcons name="clipboard-pulse" size={20} color="#FFF" />
          <Text style={styles.finalDiagnosisText}>Final Diagnosis</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#FFF" />
        </Pressable>
      </View>

      <Modal visible={!!activeMenu} transparent={true} animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setActiveMenu(null)}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>
                {activeMenu?.charAt(0).toUpperCase() + activeMenu?.slice(1)} Options
              </Text>
              <Pressable onPress={() => setActiveMenu(null)}>
                <MaterialCommunityIcons name="close" size={24} color="#94A3B8" />
              </Pressable>
            </View>
            <FlatList
              data={activeMenu ? MEDICAL_MENUS[activeMenu] : []}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable style={styles.menuItem} onPress={() => handleSendRequest(item.text)}>
                  <MaterialCommunityIcons name={item.icon} size={20} color="#38BDF8" />
                  <Text style={styles.menuItemText}>{item.text}</Text>
                  <MaterialCommunityIcons name="plus-circle" size={20} color="#38BDF8" />
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      <Modal visible={hintsModalVisible} transparent={true} animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setHintsModalVisible(false)}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>💡 Available Hints</Text>
              <Pressable onPress={() => setHintsModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#94A3B8" />
              </Pressable>
            </View>
            <FlatList
              data={availableHints}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable style={styles.menuItem} onPress={() => handleUseHint(item)}>
                  <MaterialCommunityIcons name="lightbulb" size={20} color="#F59E0B" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.menuItemText}>{item.text}</Text>
                    <Text style={styles.hintCost}>Cost: {item.cost} points</Text>
                  </View>
                  <MaterialCommunityIcons name="plus-circle" size={20} color="#F59E0B" />
                </Pressable>
              )}
            />
            <Pressable style={styles.diagnosisHintBtn} onPress={handleUseDiagnosisHint}>
              <MaterialCommunityIcons name="brain" size={20} color="#EF4444" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Reveal Diagnosis Pattern</Text>
                <Text style={styles.hintCost}>Cost: 20 points</Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={diagnosisModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.diagnosisContainer}>
            <Text style={styles.diagnosisTitle}>Submit Your Diagnosis</Text>
            <TextInput
              style={styles.diagnosisInput}
              value={finalDiagnosis}
              onChangeText={setFinalDiagnosis}
              placeholder="Enter your final diagnosis..."
              placeholderTextColor="#64748B"
              multiline
            />
            <View style={styles.diagnosisBtns}>
              <Pressable style={styles.cancelBtn} onPress={() => setDiagnosisModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.submitBtn, !finalDiagnosis.trim() && styles.submitBtnDisabled]}
                onPress={handleSubmitDiagnosis}
                disabled={!finalDiagnosis.trim()}
              >
                <Text style={styles.submitBtnText}>Submit Diagnosis</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {isEvaluating && (
        <Modal visible={true} transparent={true}>
          <View style={styles.evaluatingOverlay}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.evaluatingText}>Evaluating your diagnosis...</Text>
          </View>
        </Modal>
      )}

      <Modal visible={feedbackModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackTitle}>Diagnosis Result</Text>
            <ScrollView style={styles.feedbackScroll}>
              <Text style={styles.feedbackText}>{feedbackText}</Text>
            </ScrollView>
 <Pressable 
   style={styles.reviewBtn} 
   onPress={() => {
     setFeedbackModalVisible(false);
     router.push(`/cases/review/${currentCase.id}`);
   }}
 >
   <Ionicons name="document-text" size={18} color="#38BDF8" />
   <Text style={styles.reviewBtnText}>Detailed Review</Text>
 </Pressable>           
 <Pressable style={styles.closeFeedbackBtn} onPress={() => setFeedbackModalVisible(false)}>
              <Text style={styles.closeFeedbackBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  caseHeader: { backgroundColor: '#1A1F2E', padding: 16, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, borderBottomWidth: 2, borderBottomColor: '#38BDF830' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#38BDF820', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
  badgeText: { color: '#38BDF8', fontSize: 11, fontWeight: '600' },
  timerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10B98120', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
  timerText: { color: '#10B981', fontSize: 11, fontWeight: '600' },
  dailyBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F59E0B15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4, alignSelf: 'flex-start', marginBottom: 8 },
  dailyBadgeText: { color: '#F59E0B', fontSize: 11, fontWeight: '600' },
  patientInfo: { color: '#38BDF8', fontWeight: 'bold', fontSize: 18, marginBottom: 4 },
  chiefComplaint: { color: '#F8FAFC', marginTop: 8, fontSize: 14, backgroundColor: '#F59E0B15', padding: 10, borderRadius: 8, borderLeftWidth: 3, borderLeftColor: '#F59E0B' },
  statsBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 8, backgroundColor: '#0F172A', borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { color: '#E2E8F0', fontSize: 12, fontWeight: '600' },
  hintBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F59E0B15', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, gap: 4 },
  hintBtnText: { color: '#F59E0B', fontSize: 11, fontWeight: '600' },
  chatArea: { flex: 1, padding: 12 },
  welcomeBubble: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10B98115', padding: 12, borderRadius: 12, gap: 8, marginBottom: 12, borderWidth: 1, borderColor: '#10B98130' },
  welcomeText: { color: '#6EE7B7', fontSize: 13, flex: 1 },
  messageRow: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-end', gap: 6 },
  messageBubble: { padding: 10, borderRadius: 12, maxWidth: '75%' },
  requestBubble: { backgroundColor: '#3B82F6', alignSelf: 'flex-end' },
  responseBubble: { backgroundColor: '#1E293B', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#334155' },
  hintBubble: { backgroundColor: '#F59E0B15', borderColor: '#F59E0B40' },
  messageText: { color: '#FFF', fontSize: 13, lineHeight: 18 },
  aiIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#10B98120', justifyContent: 'center', alignItems: 'center' },
  hintIcon: { backgroundColor: '#F59E0B20' },
  userIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#3B82F620', justifyContent: 'center', alignItems: 'center' },
  menuTag: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4 },
  menuTagText: { fontSize: 8, color: '#64748B', textTransform: 'uppercase' },
  loadingBubble: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B80', padding: 10, borderRadius: 12, alignSelf: 'flex-start', gap: 8 },
  loadingText: { color: '#64748B', fontSize: 12, fontStyle: 'italic' },
  quickActions: { flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 8, gap: 6, backgroundColor: '#0F172A', borderTopWidth: 1, borderTopColor: '#1E293B' },
  actionBtn: { flex: 1, backgroundColor: '#1E293B', padding: 10, alignItems: 'center', borderRadius: 12, flexDirection: 'row', justifyContent: 'center', gap: 4, borderWidth: 1, borderColor: 'transparent' },
  activeBtn: { backgroundColor: '#38BDF820', borderColor: '#38BDF8' },
  actionBtnText: { color: '#38BDF8', fontSize: 11, fontWeight: '600' },
  activeBtnText: { color: '#FFFFFF' },
  inputContainer: { paddingHorizontal: 12, paddingBottom: Platform.OS === 'ios' ? 30 : 12, paddingTop: 8, backgroundColor: '#0F172A', borderTopWidth: 1, borderTopColor: '#1E293B' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: '#1E293B', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  textInput: { flex: 1, color: '#F8FAFC', fontSize: 13, maxHeight: 80 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#38BDF8', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  sendBtnDisabled: { backgroundColor: '#334155' },
  finalDiagnosisBtn: { backgroundColor: '#10B981', padding: 14, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  finalDiagnosisText: { color: '#0F172A', fontWeight: 'bold', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  menuContainer: { backgroundColor: '#1E293B', padding: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#334155' },
  menuTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '700' },
  menuItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#334155', flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuItemText: { color: '#E2E8F0', flex: 1, fontSize: 14 },
  hintCost: { color: '#F59E0B', fontSize: 11, marginTop: 4 },
  diagnosisHintBtn: { padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: '#334155' },
  diagnosisContainer: { backgroundColor: '#1E293B', padding: 20, margin: 20, borderRadius: 20, borderWidth: 1, borderColor: '#334155' },
  diagnosisTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  diagnosisInput: { backgroundColor: '#0F172A', color: '#FFF', padding: 14, borderRadius: 12, minHeight: 80, fontSize: 14, borderWidth: 1, borderColor: '#334155' },
  diagnosisBtns: { flexDirection: 'row', gap: 8, marginTop: 16 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#334155', alignItems: 'center' },
  cancelBtnText: { color: '#E2E8F0', fontWeight: '600' },
  submitBtn: { flex: 2, backgroundColor: '#10B981', padding: 14, alignItems: 'center', borderRadius: 12 },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: '#0F172A', fontWeight: 'bold', fontSize: 14 },
  evaluatingOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', gap: 16 },
  evaluatingText: { color: '#F8FAFC', fontSize: 16 },
  feedbackContainer: { backgroundColor: '#1E293B', padding: 20, margin: 20, borderRadius: 20, maxHeight: '70%', borderWidth: 1, borderColor: '#334155' },
  feedbackTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  feedbackScroll: { maxHeight: 300 },
  feedbackText: { color: '#E2E8F0', fontSize: 14, lineHeight: 20 },
  closeFeedbackBtn: { backgroundColor: '#10B981', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  closeFeedbackBtnText: { color: '#0F172A', fontWeight: 'bold', fontSize: 14 },
reviewBtn: {
  backgroundColor: '#38BDF815',
  padding: 14,
  borderRadius: 12,
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'center',
  gap: 8,
  marginBottom: 8,
  borderWidth: 1,
  borderColor: '#38BDF830',
},
reviewBtnText: {
  color: '#38BDF8',
  fontWeight: '600',
  fontSize: 14,
},
});

// أضف هذا الزر داخل feedbackContainer بعد feedbackScroll:
// <Pressable 
//   style={styles.reviewBtn} 
//   onPress={() => {
//     setFeedbackModalVisible(false);
//     router.push(`/cases/review/${currentCase.id}`);
//   }}
// >
//   <Text style={styles.reviewBtnText}>View Detailed Review</Text>
// </Pressable>
