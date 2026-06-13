import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChatBubbleProps {
  role: 'user' | 'system' | 'patient';
  content: string;
}

export function ChatBubble({ role = 'system', content = '' }: ChatBubbleProps) {
  const isUser = role === 'user';
  const isPatient = role === 'patient';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.otherContainer]}>
      {!isUser && (
        <Text style={styles.roleLabel}>
          {isPatient ? '👤 Patient' : '🏥 System'}
        </Text>
      )}
      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : isPatient ? styles.patientBubble : styles.systemBubble
      ]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.otherText]}>
          {String(content)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12, maxWidth: '80%' },
  userContainer: { alignSelf: 'flex-end' },
  otherContainer: { alignSelf: 'flex-start' },
  bubble: { padding: 12, borderRadius: 16 },
  userBubble: { backgroundColor: '#007AFF' },
  patientBubble: { backgroundColor: '#FFF3E0', borderWidth: 1, borderColor: '#FFE0B2' },
  systemBubble: { backgroundColor: '#E3F2FD', borderWidth: 1, borderColor: '#BBDEFB' },
  text: { fontSize: 15, lineHeight: 21 },
  userText: { color: '#fff' },
  otherText: { color: '#333' },
  roleLabel: { fontSize: 10, color: '#999', marginBottom: 2, marginLeft: 4 }
});

export default ChatBubble;
