import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDiagnosticRoom } from '../hooks/useDiagnosticRoom';
import { VitalsMonitor, ChatBubble, ActionBar, PhaseIndicator, ResultScreen } from '../components';

export default function DiagnosticRoomScreen() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();
  const router = useRouter();
  const validCaseId = (caseId && caseId !== "undefined" && caseId !== "null" && caseId.length > 0) ? caseId : "fallback";
  
  const {
    caseData, patientState, vitals, messages, phase,
    sendMessage, loading, error, isComplete, timeElapsed, canInteract,
    score, trace, replayData
  } = useDiagnosticRoom(validCaseId || 'fallback');
  
  const scrollRef = useRef<ScrollView>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    if (isComplete && score) {
      setTimeout(() => setShowResult(true), 500);
    }
  }, [isComplete, score]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.statusText}>Loading case...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{String(error)}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => router.back()}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showResult && score) {
    return (
      <ResultScreen
        score={score}
        caseData={caseData}
        trace={trace}
        replayData={replayData}
        onRestart={() => setShowResult(false)}
        onHome={() => router.back()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {caseData?.title || 'Diagnostic Room'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {caseData?.patient?.age ? `${caseData.patient.age}yo ${caseData.patient.gender}` : ''}
        </Text>
      </View>

      <PhaseIndicator
        phase={String(phase)}
        patientState={String(patientState)}
        timeElapsed={Number(timeElapsed)}
      />

      {vitals && Object.keys(vitals).length > 0 && (
        <VitalsMonitor vitals={vitals} />
      )}

      <ScrollView ref={scrollRef} style={styles.chatArea} contentContainerStyle={styles.chatContent}>
        {messages.map((msg: any, index: number) => (
          <ChatBubble key={index} role={msg.role || 'system'} content={String(msg.content || '')} />
        ))}
        
        {isComplete && !showResult && (
          <View style={styles.completeBanner}>
            <Text style={styles.completeText}>✅ Case Complete</Text>
          </View>
        )}
      </ScrollView>

      {canInteract && (
        <ActionBar phase={String(phase)} onSubmit={sendMessage} disabled={!canInteract} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { padding: 16, backgroundColor: '#007AFF' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 },
  chatArea: { flex: 1 },
  chatContent: { padding: 16, paddingBottom: 20 },
  completeBanner: { padding: 20, backgroundColor: '#E8F5E9', borderRadius: 12, alignItems: 'center', marginTop: 20 },
  completeText: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32' },
  statusText: { marginTop: 10, color: '#666' },
  errorIcon: { fontSize: 40, marginBottom: 10 },
  errorText: { color: '#e74c3c', fontSize: 16, textAlign: 'center', marginBottom: 16 },
  retryBtn: { padding: 12, backgroundColor: '#007AFF', borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' }
});
