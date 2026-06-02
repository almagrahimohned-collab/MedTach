import React, { useRef } from 'react';
import {
  Text, View, TextInput, Pressable, ScrollView, Modal, FlatList,
  ActivityIndicator, Animated, Image, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { useDiagnosticRoom } from './hooks/useDiagnosticRoom';
import { MEDICAL_MENUS } from './menus';

export default function DiagnosticRoom() {
  const data = useDiagnosticRoom();
  const scrollViewRef = useRef<ScrollView>(null);

  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'patient': return { bg: '#8B5CF620', border: '#8B5CF640', icon: 'person', iconColor: '#8B5CF6' };
      case 'supervisor': return { bg: '#1E293B', border: '#334155', icon: 'school', iconColor: '#38BDF8' };
      case 'technician': return { bg: '#F59E0B10', border: '#F59E0B30', icon: 'flask', iconColor: '#F59E0B' };
      default: return { bg: '#1E293B', border: '#334155', icon: 'medkit', iconColor: '#10B981' };
    }
  };

  if (!data.caseLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38BDF8" />
        <Text style={styles.loadingText}>Loading case...</Text>
      </View>
    );
  }

  if (!data.currentCase) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle-outline" size={60} color="#EF4444" />
        <Text style={styles.errorTitle}>No Case Found</Text>
        <Text style={styles.errorDesc}>No case available for this selection.</Text>
        <Pressable style={styles.retryBtn} onPress={data.loadCase}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={styles.caseHeader}>
        <View style={styles.headerTop}>
          <View style={styles.badge}>
            <Ionicons name="medkit" size={14} color="#38BDF8" />
            <Text style={styles.badgeText}>{data.currentCase.department || 'Emergency'}</Text>
          </View>
          <View style={styles.timerBadge}>
            <Ionicons name="time-outline" size={14} color="#10B981" />
            <Text style={styles.timerText}>Active</Text>
          </View>
        </View>
        {data.isDailyChallengeCase && (
          <View style={styles.dailyBadge}>
            <Ionicons name="flame" size={14} color="#F59E0B" />
            <Text style={styles.dailyBadgeText}>Daily Challenge (+{data.dailyChallenge?.bonusPoints} bonus)</Text>
          </View>
        )}
        <Text style={styles.patientInfo}>Patient: {data.currentCase.patient.age}{data.currentCase.patient.gender === 'male' ? 'M' : 'F'} | {data.currentCase.patient.name}</Text>
        <Text style={styles.chiefComplaint}>{data.currentCase.chief_complaint}</Text>
      </View>

      <View style={styles.statsBar}>
        <Animated.View style={[styles.statItem, { transform: [{ scale: data.pulseAnim }] }]}>
          <Ionicons name="flask" size={14} color="#38BDF8" />
          <Text style={styles.statText}>{data.testsCount} Tests</Text>
        </Animated.View>
        <View style={styles.statItem}>
          <Ionicons name="bulb" size={14} color="#F59E0B" />
          <Text style={styles.statText}>{data.hintsUsed} Hints</Text>
        </View>
        <Pressable style={styles.hintBtn} onPress={() => data.setHintsModalVisible(true)}>
          <Ionicons name="bulb-outline" size={16} color="#F59E0B" />
          <Text style={styles.hintBtnText}>Get Hint</Text>
        </Pressable>
      </View>

      <ScrollView ref={scrollViewRef} style={styles.chatArea}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
      >
        {data.interactions.length === 0 && (
          <View style={styles.welcomeBubble}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#10B981" />
            <Text style={styles.welcomeText}>What would you like to investigate? Select from options below or type your query.</Text>
          </View>
        )}

        {data.interactions.map((msg: any) => {
          if (msg.type === 'image') {
            return (
              <View key={msg.id} style={styles.messageRow}>
                <View style={[styles.aiIcon, { backgroundColor: '#F59E0B20' }]}>
                  <Ionicons name="image" size={16} color="#F59E0B" />
                </View>
                <View style={[styles.messageBubble, styles.responseBubble, { backgroundColor: '#F59E0B10', borderColor: '#F59E0B30' }]}>
                  <Image source={{ uri: msg.imageUrl }} style={styles.messageImage} resizeMode="contain"
                    onError={() => console.log('Image load error:', msg.imageUrl)} />
                  <Text style={styles.messageText}>{msg.text}</Text>
                </View>
              </View>
            );
          }

          const rs = getRoleStyle(msg.role || 'supervisor');
          return (
            <View key={msg.id} style={styles.messageRow}>
              {msg.type === 'response' && (
                <View style={[styles.aiIcon, msg.isHint && styles.hintIcon, { backgroundColor: rs.bg }]}>
                  <Ionicons name={rs.icon as any} size={16} color={rs.iconColor} />
                </View>
              )}
              <View style={[styles.messageBubble, msg.type === 'request' ? styles.requestBubble : styles.responseBubble, msg.isHint && styles.hintBubble, msg.type === 'response' && { backgroundColor: rs.bg, borderColor: rs.border }]}>
                <Text style={styles.messageText}>{msg.text}</Text>
                {msg.menuType && (
                  <View style={styles.menuTag}>
                    <MaterialCommunityIcons name="tag-outline" size={8} color="#64748B" />
                    <Text style={styles.menuTagText}>{msg.menuType}</Text>
                  </View>
                )}
                {msg.role && msg.role !== 'supervisor' && (
                  <Text style={[styles.roleLabel, { color: rs.iconColor }]}>{msg.role.toUpperCase()}</Text>
                )}
              </View>
              {msg.type === 'request' && (
                <View style={styles.userIcon}>
                  <Ionicons name="person" size={16} color="#3B82F6" />
                </View>
              )}
            </View>
          );
        })}

        {data.isLoading && (
          <View style={styles.loadingBubble}>
            <ActivityIndicator size="small" color="#38BDF8" />
            <Text style={styles.loadingText}>Analyzing...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.quickActions}>
        {['history', 'examination', 'labs', 'imaging'].map((menu) => (
          <Pressable key={menu} style={[styles.actionBtn, data.activeMenu === menu && styles.activeBtn]}
            onPress={() => data.setActiveMenu(data.activeMenu === menu ? null : menu)}>
            <MaterialCommunityIcons
              name={menu === 'history' ? 'clipboard-text-outline' : menu === 'examination' ? 'stethoscope' : menu === 'labs' ? 'flask-outline' : 'image-outline'}
              size={16} color={data.activeMenu === menu ? '#FFF' : '#38BDF8'} />
            <Text style={[styles.actionBtnText, data.activeMenu === menu && styles.activeBtnText]} numberOfLines={1}>
              {menu.charAt(0).toUpperCase() + menu.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput style={styles.textInput} value={data.inputText} onChangeText={data.setInputText}
            placeholder="Type your clinical query..." placeholderTextColor="#64748B" multiline
            onSubmitEditing={() => data.inputText.trim() && data.handleSendRequest(data.inputText)} />
          <Pressable style={[styles.sendBtn, !data.inputText.trim() && styles.sendBtnDisabled]}
            onPress={() => data.handleSendRequest(data.inputText)} disabled={!data.inputText.trim() || data.isLoading}>
            <Ionicons name="send" size={18} color={data.inputText.trim() ? '#0F172A' : '#64748B'} />
          </Pressable>
        </View>
        <Pressable style={styles.finalDiagnosisBtn} onPress={() => data.setDiagnosisModalVisible(true)}>
          <Ionicons name="clipboard" size={20} color="#FFF" />
          <Text style={styles.finalDiagnosisText}>Submit Final Diagnosis</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFF" />
        </Pressable>
      </View>

      <Modal visible={!!data.activeMenu} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => data.setActiveMenu(null)}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>{data.activeMenu?.charAt(0).toUpperCase() + data.activeMenu?.slice(1)} Options</Text>
              <Pressable onPress={() => data.setActiveMenu(null)}>
                <Ionicons name="close" size={24} color="#94A3B8" />
              </Pressable>
            </View>
            <FlatList
              data={data.activeMenu ? MEDICAL_MENUS[data.activeMenu] || [] : []}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable style={styles.menuItem} onPress={() => data.handleSendRequest(item.text)}>
                  <MaterialCommunityIcons name={item.icon as any} size={20} color="#38BDF8" />
                  <Text style={styles.menuItemText}>{item.text}</Text>
                  <Ionicons name="add-circle" size={20} color="#38BDF8" />
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      <Modal visible={data.hintsModalVisible} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => data.setHintsModalVisible(false)}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>💡 Available Hints</Text>
              <Pressable onPress={() => data.setHintsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#94A3B8" />
              </Pressable>
            </View>
            {data.availableHints.map((hint: any) => (
              <Pressable key={hint.id} style={styles.menuItem} onPress={() => data.handleUseHint(hint)}>
                <Ionicons name="bulb" size={20} color="#F59E0B" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.menuItemText}>{hint.text}</Text>
                  <Text style={{ color: '#F59E0B', fontSize: 11, marginTop: 4 }}>Cost: {hint.cost} points</Text>
                </View>
              </Pressable>
            ))}
            <Pressable style={styles.menuItem} onPress={() => data.handleUseDiagnosisHint()}>
              <Ionicons name="brain" size={20} color="#EF4444" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Reveal Diagnosis Pattern</Text>
                <Text style={{ color: '#F59E0B', fontSize: 11, marginTop: 4 }}>Cost: 20 points</Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={data.diagnosisModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.diagnosisContainer}>
            <Text style={styles.diagnosisTitle}>Submit Your Final Diagnosis</Text>
            <TextInput style={styles.diagnosisInput} value={data.finalDiagnosis} onChangeText={data.setFinalDiagnosis}
              placeholder="Enter your complete diagnosis..." placeholderTextColor="#64748B" multiline />
            <View style={styles.diagnosisBtns}>
              <Pressable style={styles.cancelBtn} onPress={() => data.setDiagnosisModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.submitBtn, !data.finalDiagnosis.trim() && styles.submitBtnDisabled]}
                onPress={data.handleSubmitDiagnosis} disabled={!data.finalDiagnosis.trim()}>
                <Text style={styles.submitBtnText}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {data.isEvaluating && (
        <Modal visible transparent>
          <View style={styles.evaluatingOverlay}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.evaluatingText}>Evaluating diagnosis...</Text>
          </View>
        </Modal>
      )}

      <Modal visible={data.feedbackModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackTitle}>Diagnosis Result</Text>
            <ScrollView style={styles.feedbackScroll}>
              <Text style={styles.feedbackText}>{data.feedbackText}</Text>
            </ScrollView>
            <Pressable style={styles.closeFeedbackBtn} onPress={() => data.setFeedbackModalVisible(false)}>
              <Text style={styles.closeFeedbackBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
