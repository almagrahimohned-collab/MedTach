import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  Modal,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../src/store';
import { OSCEEngine } from '../../src/osce/osceEngine';
import { OSCELoader } from '../../src/osce/osceLoader';
import { OSCETimer, getWarningColor, getWarningMessage } from '../../src/osce/osceTimer';
import { OSCEScoringEngine } from '../../src/osce/osceScoring';
import {
  OSCEStation,
  StationPhase,
  AskedQuestion,
  PerformedExamination,
  OrderedInvestigation,
} from '../../src/osce/osceTypes';

const { width, height } = Dimensions.get('window');

export default function StationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addPoints } = useStore();

  // State
  const [station, setStation] = useState<OSCEStation | null>(null);
  const [engine, setEngine] = useState<OSCEEngine | null>(null);
  const [timer, setTimer] = useState<OSCETimer | null>(null);
  const [phase, setPhase] = useState<StationPhase>('door');
  const [loading, setLoading] = useState(true);

  // UI State
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [patientResponses, setPatientResponses] = useState<AskedQuestion[]>([]);
  const [examFindings, setExamFindings] = useState<PerformedExamination[]>([]);
  const [orderedTests, setOrderedTests] = useState<OrderedInvestigation[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timeDisplay, setTimeDisplay] = useState('');
  const [warningLevel, setWarningLevel] = useState<'none' | 'low' | 'medium' | 'critical'>('none');
  const [warningMessage, setWarningMessage] = useState('');
  const [selectedExamSystem, setSelectedExamSystem] = useState<string | null>(null);
  const [diagnosisText, setDiagnosisText] = useState('');
  const [differentialText, setDifferentialText] = useState('');
  const [managementText, setManagementText] = useState('');
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  const scrollRef = useRef<ScrollView>(null);

  // Load station
  useEffect(() => {
    loadStation();
  }, []);

  // Timer effect
  useEffect(() => {
    if (!timer) return;

    const unsubscribe = timer.onUpdate((state) => {
      setTimeRemaining(state.timeRemaining);
      setTimeDisplay(timer.formatTimeRemaining());
      setWarningLevel(state.warningLevel);
      setWarningMessage(getWarningMessage(state.warningLevel, state.timeRemaining));
    });

    timer.onExpire(() => {
      handleTimeUp();
    });

    return () => {
      unsubscribe();
      timer.destroy();
    };
  }, [timer, phase]); // Added phase dependency

  const loadStation = async () => {
    try {
      const loader = new OSCELoader();
      const stationData = await loader.loadStation('cp001');
      const newEngine = new OSCEEngine(stationData);
      const newTimer = new OSCETimer({
        readingTime: stationData.readingTime * 60,
        stationTime: stationData.timeLimit * 60,
      });

      setStation(stationData);
      setEngine(newEngine);
      setTimer(newTimer);

      // Start reading phase
      newTimer.startReading();
      setPhase('door');
      setTimeDisplay(newTimer.formatTimeRemaining());
    } catch (error) {
      console.error('Failed to load station:', error);
      Alert.alert('Error', 'Failed to load OSCE station');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // Enter station after reading time
  const handleEnterStation = () => {
    if (!engine || !timer) return;

    timer.startStation();
    engine.startStation();
    setPhase('introduction');
    setCurrentPhaseIndex(1); // Skip door
    scrollToBottom();

    // Auto-advance to history after showing opening statement
    setTimeout(() => {
      setPhase('history');
      setCurrentPhaseIndex(2);
      scrollToBottom();
    }, 3000);
  };

  // Timer expired - depends on current phase
  const handleTimeUp = () => {
    if (!engine) return;
    
    if (phase === 'door') {
      // Reading time expired - auto-enter station
      handleEnterStation();
    } else {
      // Station time expired - submit
      finishStation();
    }
  };

  // Ask patient a question
  const handleAskQuestion = () => {
    if (!engine || !currentQuestion.trim()) return;

    const result = engine.askQuestion(currentQuestion);
    setPatientResponses(engine.getQuestionsAsked());
    setCurrentQuestion('');

    scrollToBottom();
  };

  // Perform examination
  const handleExamination = (systemId: string, step: string) => {
    if (!engine) return;

    const result = engine.performExamination(systemId, step);
    if (result.success) {
      setExamFindings(engine.getExaminationsPerformed());
      setSelectedExamSystem(null);
    }
    scrollToBottom();
  };

  // Order investigation
  const handleOrderInvestigation = (testId: string) => {
    if (!engine) return;

    const result = engine.orderInvestigation(testId);
    if (result.success) {
      setOrderedTests(engine.getInvestigationsOrdered());
    }
  };

  // Submit diagnosis
  const handleSubmitDiagnosis = () => {
    if (!engine) return;

    const differentials = differentialText
      .split('\n')
      .filter((d) => d.trim())
      .slice(0, 3);

    engine.submitDiagnosis(diagnosisText, differentials);
    setPhase('management');
    setCurrentPhaseIndex(5);
    scrollToBottom();
  };

  // Submit management
  const handleSubmitManagement = () => {
    if (!engine) return;

    const lines = managementText.split('\n').filter((l) => l.trim());
    engine.submitManagement(lines.slice(0, 5), lines.slice(5, 8), lines.slice(8));
    finishStation();
  };

  // Move to next phase manually
  const moveToPhase = (newPhase: StationPhase, phaseIndex: number) => {
    if (!engine) return;
    engine.moveToPhase(newPhase);
    setPhase(newPhase);
    setCurrentPhaseIndex(phaseIndex);
    scrollToBottom();
  };

  // Finish station and go to results
  const finishStation = () => {
    if (!engine || !station) return;

    const state = engine.getState();
    state.completedAt = Date.now();
    state.phase = 'complete';

    const scoring = new OSCEScoringEngine(station, state);
    const result = scoring.calculateResult();

    timer?.stop();

    router.push({
      pathname: '/osce-sim/results',
      params: {
        result: JSON.stringify(result),
        stationId: station.id,
      },
    });
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Loading screen
  if (loading || !station || !engine) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass" size={40} color="#38BDF8" />
          <Text style={styles.loadingText}>Preparing station...</Text>
        </View>
      </View>
    );
  }

  // ============================================================
  // DOOR PHASE
  // ============================================================
  if (phase === 'door') {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.doorContainer}>
          {/* Door Header */}
          <View style={styles.doorHeader}>
            <View style={styles.stationBadge}>
              <Text style={styles.stationNumber}>Station 1</Text>
            </View>
            <Text style={styles.doorTitle}>{station.title}</Text>
          </View>

          {/* Reading Time */}
          <View style={styles.doorTimerSection}>
            <Ionicons name="time" size={24} color="#F59E0B" />
            <Text style={styles.doorTimerText}>Reading Time: {timeDisplay}</Text>
            <Text style={styles.doorTimerHint}>Read the instructions carefully</Text>
          </View>

          {/* Instructions Card */}
          <View style={styles.doorInstructionsCard}>
            <View style={styles.doorSetting}>
              <Ionicons name="business" size={14} color="#94A3B8" />
              <Text style={styles.doorSettingText}>
                {station.doorInstructions.setting}
              </Text>
            </View>

            <Text style={styles.doorScenarioTitle}>Scenario:</Text>
            <Text style={styles.doorScenarioText}>
              {station.doorInstructions.scenario}
            </Text>

            <View style={styles.doorVitals}>
              <Text style={styles.doorVitalsTitle}>Vitals (if provided):</Text>
              <Text style={styles.doorVitalsText}>
                {station.doorInstructions.vitals_given || 'Review on entering'}
              </Text>
            </View>

            <Text style={styles.doorTaskTitle}>Your Task:</Text>
            <Text style={styles.doorTaskText}>{station.doorInstructions.task}</Text>
          </View>

          {/* Patient Info */}
          <View style={styles.doorPatientCard}>
            <Ionicons name="person" size={40} color="#64748B" />
            <Text style={styles.doorPatientName}>{station.patient.name}</Text>
            <Text style={styles.doorPatientDetails}>
              {station.patient.age} years • {station.patient.gender}
            </Text>
          </View>

          {/* Enter Button */}
          <Pressable style={styles.enterButton} onPress={handleEnterStation}>
            <Text style={styles.enterButtonText}>Enter Station</Text>
            <Ionicons name="arrow-forward" size={20} color="#0F172A" />
          </Pressable>

          <Pressable style={styles.doorBackButton} onPress={() => router.back()}>
            <Text style={styles.doorBackText}>Back to Dashboard</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  // ============================================================
  // MAIN STATION INTERFACE
  // ============================================================
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable
            onPress={() => {
              Alert.alert('Exit Station?', 'Your progress will be lost.', [
                { text: 'Stay', style: 'cancel' },
                { text: 'Exit', onPress: () => router.back(), style: 'destructive' },
              ]);
            }}
          >
            <Ionicons name="close" size={22} color="#94A3B8" />
          </Pressable>
          <Text style={styles.headerTitle}>{station.title}</Text>
        </View>
        <View
          style={[
            styles.timerBadge,
            { backgroundColor: getWarningColor(warningLevel) + '20' },
          ]}
        >
          <Ionicons
            name="time"
            size={14}
            color={getWarningColor(warningLevel)}
          />
          <Text
            style={[
              styles.timerText,
              { color: getWarningColor(warningLevel) },
            ]}
          >
            {timeDisplay}
          </Text>
        </View>
      </View>

      {/* Warning Message */}
      {warningMessage ? (
        <View style={styles.warningBanner}>
          <Text style={styles.warningBannerText}>{warningMessage}</Text>
        </View>
      ) : null}

      <ScrollView
        ref={scrollRef}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Patient Banner */}
        <View style={styles.patientBanner}>
          <Ionicons name="person-circle" size={32} color="#38BDF8" />
          <View style={styles.patientBannerInfo}>
            <Text style={styles.patientBannerName}>{station.patient.name}</Text>
            <Text style={styles.patientBannerDetail}>
              {station.patient.age} years, {station.patient.gender}
            </Text>
          </View>
        </View>

        {/* Introduction Phase */}
        {phase === 'introduction' && (
          <View style={styles.phaseCard}>
            <Text style={styles.openingStatement}>
              "{engine.getOpeningStatement()}"
            </Text>
            <Text style={styles.phaseHint}>
              The patient is looking at you, waiting for you to begin...
            </Text>
          </View>
        )}

        {/* History Taking Phase */}
        {(phase === 'introduction' || phase === 'history') && (
          <View style={styles.historySection}>
            <Text style={styles.phaseTitle}>💬 History Taking</Text>

            {/* Chat Messages */}
            {patientResponses.map((resp, i) => (
              <View key={i} style={styles.chatContainer}>
                {resp.question ? (
                  <View style={styles.doctorBubble}>
                    <Text style={styles.doctorText}>👨‍⚕️ {resp.question}</Text>
                  </View>
                ) : null}
                <View style={styles.patientBubble}>
                  <Text style={styles.patientText}>👤 {resp.answer}</Text>
                </View>
              </View>
            ))}

            {/* Question Input */}
            {phase === 'history' && (
              <View style={styles.inputSection}>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={currentQuestion}
                    onChangeText={setCurrentQuestion}
                    placeholder="Ask the patient a question..."
                    placeholderTextColor="#64748B"
                    onSubmitEditing={handleAskQuestion}
                    returnKeyType="send"
                  />
                  <Pressable style={styles.askButton} onPress={handleAskQuestion}>
                    <Ionicons name="send" size={18} color="#0F172A" />
                  </Pressable>
                </View>

                <Pressable
                  style={styles.proceedButton}
                  onPress={() => moveToPhase('examination', 3)}
                >
                  <Text style={styles.proceedButtonText}>
                    Proceed to Examination →
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {/* Examination Phase */}
        {phase === 'examination' && (
          <View style={styles.phaseSection}>
            <Text style={styles.phaseTitle}>🖐 Physical Examination</Text>
            <Text style={styles.phaseHint}>
              Select a body system to examine, then choose a technique.
            </Text>

            {/* Examination Systems */}
            <View style={styles.examSystemsGrid}>
              {engine.getAvailableExaminationSystems().map((systemId) => {
                const system = station.examination.systems[systemId];
                if (!system) return null;
                return (
                  <Pressable
                    key={systemId}
                    style={[
                      styles.examSystemCard,
                      selectedExamSystem === systemId && styles.examSystemCardActive,
                    ]}
                    onPress={() => setSelectedExamSystem(systemId)}
                  >
                    <Ionicons
                      name={
                        systemId === 'general' ? 'body' :
                        systemId === 'cardiovascular' ? 'heart' :
                        systemId === 'respiratory' ? 'leaf' :
                        systemId === 'extremities' ? 'hand-left' : 'medical'
                      }
                      size={22}
                      color={selectedExamSystem === systemId ? '#0F172A' : '#38BDF8'}
                    />
                    <Text
                      style={[
                        styles.examSystemName,
                        selectedExamSystem === systemId && styles.examSystemNameActive,
                      ]}
                    >
                      {systemId.charAt(0).toUpperCase() + systemId.slice(1)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Examination Steps */}
            {selectedExamSystem && (
              <View style={styles.examStepsSection}>
                <Text style={styles.examStepsTitle}>Examination Technique:</Text>
                <View style={styles.examStepsGrid}>
                  {['inspection', 'palpation', 'percussion', 'auscultation', 'special'].map(
                    (step) => {
                      const system = station.examination.systems[selectedExamSystem];
                      if (!system) return null;
                      const hasStep = system[step as keyof typeof system];
                      const performed = examFindings.some(
                        (e) => e.systemId === selectedExamSystem && e.step === step
                      );

                      if (!hasStep) return null;

                      return (
                        <Pressable
                          key={step}
                          style={[
                            styles.examStepButton,
                            performed && styles.examStepButtonDone,
                          ]}
                          onPress={() => handleExamination(selectedExamSystem, step)}
                          disabled={performed}
                        >
                          <Text
                            style={[
                              styles.examStepText,
                              performed && styles.examStepTextDone,
                            ]}
                          >
                            {step.charAt(0).toUpperCase() + step.slice(1)}
                          </Text>
                          {performed ? (
                            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                          ) : (
                            <Ionicons name="add-circle" size={16} color="#38BDF8" />
                          )}
                        </Pressable>
                      );
                    }
                  )}
                </View>
              </View>
            )}

            {/* Examination Findings */}
            {examFindings.length > 0 && (
              <View style={styles.findingsSection}>
                <Text style={styles.findingsTitle}>Findings:</Text>
                {examFindings.map((exam, i) => (
                  <View key={i} style={styles.findingItem}>
                    <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                    <Text style={styles.findingText}>{exam.finding}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <Pressable
                style={styles.quickAction}
                onPress={() => engine.addProfessionalBonus('Performed hand hygiene')}
              >
                <Ionicons name="water" size={18} color="#38BDF8" />
                <Text style={styles.quickActionText}>Wash Hands</Text>
              </Pressable>
              <Pressable
                style={styles.quickAction}
                onPress={() => engine.addProfessionalBonus('Introduced self to patient')}
              >
                <Ionicons name="people" size={18} color="#38BDF8" />
                <Text style={styles.quickActionText}>Introduce</Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.proceedButton}
              onPress={() => moveToPhase('investigations', 4)}
            >
              <Text style={styles.proceedButtonText}>
                Proceed to Investigations →
              </Text>
            </Pressable>
          </View>
        )}

        {/* Investigations Phase */}
        {phase === 'investigations' && (
          <View style={styles.phaseSection}>
            <Text style={styles.phaseTitle}>🔬 Investigations</Text>
            <Text style={styles.phaseHint}>
              Select investigations to order for this patient.
            </Text>

            <View style={styles.investigationsList}>
              {engine.getAvailableInvestigations().map((inv) => {
                const ordered = orderedTests.some((t) => t.testId === inv.id);
                return (
                  <Pressable
                    key={inv.id}
                    style={[styles.investigationCard, ordered && styles.investigationCardDone]}
                    onPress={() => handleOrderInvestigation(inv.id)}
                  >
                    <View style={styles.investigationLeft}>
                      <Ionicons
                        name={inv.category === 'imaging' ? 'camera' : inv.category === 'cardiac' ? 'heart' : 'flask'}
                        size={20}
                        color={ordered ? '#10B981' : '#38BDF8'}
                      />
                      <View style={styles.investigationInfo}>
                        <Text style={styles.investigationName}>{inv.name}</Text>
                        <Text style={styles.investigationCategory}>{inv.category}</Text>
                      </View>
                    </View>
                    {ordered ? (
                      <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                    ) : (
                      <Ionicons name="add-circle" size={22} color="#38BDF8" />
                    )}
                  </Pressable>
                );
              })}
            </View>

            {/* Test Results */}
            {orderedTests.map((test, i) => (
              <View key={i} style={styles.testResult}>
                <Text style={styles.testResultName}>{test.testName}</Text>
                <Text style={styles.testResultFinding}>{test.finding}</Text>
              </View>
            ))}

            <Pressable
              style={styles.proceedButton}
              onPress={() => moveToPhase('diagnosis', 5)}
            >
              <Text style={styles.proceedButtonText}>
                Proceed to Diagnosis →
              </Text>
            </Pressable>
          </View>
        )}

        {/* Diagnosis Phase */}
        {phase === 'diagnosis' && (
          <View style={styles.phaseSection}>
            <Text style={styles.phaseTitle}>🧠 Diagnosis</Text>

            <Text style={styles.inputLabel}>Primary Diagnosis:</Text>
            <TextInput
              style={styles.diagnosisInput}
              value={diagnosisText}
              onChangeText={setDiagnosisText}
              placeholder="Enter your primary diagnosis..."
              placeholderTextColor="#64748B"
              multiline
            />

            <Text style={styles.inputLabel}>
              Differential Diagnoses (one per line):
            </Text>
            <TextInput
              style={styles.diagnosisInput}
              value={differentialText}
              onChangeText={setDifferentialText}
              placeholder={'1. Aortic Dissection\n2. Pulmonary Embolism\n3. Pericarditis'}
              placeholderTextColor="#64748B"
              multiline
              numberOfLines={4}
            />

            <Pressable style={styles.submitButton} onPress={handleSubmitDiagnosis}>
              <Text style={styles.submitButtonText}>Submit Diagnosis & Continue</Text>
            </Pressable>
          </View>
        )}

        {/* Management Phase */}
        {phase === 'management' && (
          <View style={styles.phaseSection}>
            <Text style={styles.phaseTitle}>💊 Management Plan</Text>

            <Text style={styles.inputLabel}>
              Immediate Management, Monitoring, Long-term (separate with blank lines):
            </Text>
            <TextInput
              style={[styles.diagnosisInput, { minHeight: 120 }]}
              value={managementText}
              onChangeText={setManagementText}
              placeholder={'Immediate:\nActivate cath lab\nAspirin 300mg...\n\nMonitoring:\nContinuous cardiac monitor...\n\nLong-term:\nDAPT for 12 months...'}
              placeholderTextColor="#64748B"
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />

            <Pressable style={styles.submitButton} onPress={handleSubmitManagement}>
              <Text style={styles.submitButtonText}>Submit & Finish Station</Text>
            </Pressable>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 16,
  },

  // Door Phase Styles
  doorContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  doorHeader: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  stationBadge: {
    backgroundColor: '#38BDF8',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  stationNumber: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  doorTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  doorTimerSection: {
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F59E0B30',
  },
  doorTimerText: {
    color: '#F59E0B',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 8,
  },
  doorTimerHint: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },
  doorInstructionsCard: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  doorSetting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  doorSettingText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  doorScenarioTitle: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  doorScenarioText: {
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },
  doorVitals: {
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  doorVitalsTitle: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  doorVitalsText: {
    color: '#F8FAFC',
    fontSize: 13,
  },
  doorTaskTitle: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  doorTaskText: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 20,
  },
  doorPatientCard: {
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  doorPatientName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  doorPatientDetails: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 2,
  },
  enterButton: {
    backgroundColor: '#38BDF8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 14,
    gap: 8,
  },
  enterButtonText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  doorBackButton: {
    alignItems: 'center',
    padding: 14,
    marginTop: 8,
  },
  doorBackText: {
    color: '#94A3B8',
    fontSize: 14,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#1A1F2E',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  timerText: {
    fontSize: 13,
    fontWeight: '700',
  },
  warningBanner: {
    backgroundColor: '#EF444420',
    padding: 8,
    alignItems: 'center',
  },
  warningBannerText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },

  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },

  // Patient Banner
  patientBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  patientBannerInfo: {
    flex: 1,
  },
  patientBannerName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  patientBannerDetail: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },

  // Phase Cards
  phaseCard: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  phaseSection: {
    marginBottom: 20,
  },
  phaseTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  phaseHint: {
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 16,
  },
  openingStatement: {
    color: '#E2E8F0',
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 12,
  },

  // History - Chat
  historySection: {
    marginBottom: 20,
  },
  chatContainer: {
    marginBottom: 12,
  },
  doctorBubble: {
    backgroundColor: '#38BDF820',
    padding: 12,
    borderRadius: 14,
    alignSelf: 'flex-end',
    maxWidth: '85%',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#38BDF830',
  },
  doctorText: {
    color: '#E2E8F0',
    fontSize: 13,
  },
  patientBubble: {
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 14,
    alignSelf: 'flex-start',
    maxWidth: '85%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  patientText: {
    color: '#E2E8F0',
    fontSize: 13,
  },

  // Input
  inputSection: {
    marginTop: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#0F172A',
    color: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#334155',
  },
  askButton: {
    backgroundColor: '#38BDF8',
    padding: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proceedButton: {
    backgroundColor: '#10B981',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  proceedButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // Examination
  examSystemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  examSystemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
  },
  examSystemCardActive: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  examSystemName: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  examSystemNameActive: {
    color: '#0F172A',
  },
  examStepsSection: {
    marginBottom: 16,
  },
  examStepsTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  examStepsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  examStepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 4,
  },
  examStepButtonDone: {
    backgroundColor: '#10B98115',
    borderColor: '#10B98130',
  },
  examStepText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  examStepTextDone: {
    color: '#10B981',
  },
  findingsSection: {
    backgroundColor: '#0F172A',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#10B98120',
  },
  findingsTitle: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  findingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  findingText: {
    color: '#E2E8F0',
    fontSize: 12,
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 6,
  },
  quickActionText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },

  // Investigations
  investigationsList: {
    marginBottom: 16,
  },
  investigationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  investigationCardDone: {
    backgroundColor: '#10B98110',
    borderColor: '#10B98130',
  },
  investigationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  investigationInfo: {
    gap: 2,
  },
  investigationName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  investigationCategory: {
    color: '#64748B',
    fontSize: 11,
  },
  testResult: {
    backgroundColor: '#0F172A',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  testResultName: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  testResultFinding: {
    color: '#E2E8F0',
    fontSize: 12,
    lineHeight: 18,
  },

  // Diagnosis & Management
  inputLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
  },
  diagnosisInput: {
    backgroundColor: '#0F172A',
    color: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 60,
  },
  submitButton: {
    backgroundColor: '#38BDF8',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },
});

