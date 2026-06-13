import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ActionBarProps {
  phase: string;
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export function ActionBar({ phase = 'history', onSubmit, disabled = false }: ActionBarProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSubmit(input.trim());
    setInput('');
  };

  const suggestions: Record<string, string[]> = {
    history: ["When did it start?", "Any other symptoms?", "Past medical history?"],
    examination: ["Examine heart", "Check lungs", "Abdominal exam"],
    investigations: ["Order CBC", "Check Troponin", "/labs", "/imaging"],
    diagnosis: ["/diagnosis "],
    treatment: ["/treatment "]
  };
  const getPlaceholder = (): string => {
    switch (phase) {
      case 'history': return 'Ask about symptoms...';
      case 'examination': return 'What to examine?';
      case 'investigations': return 'Order labs/imaging...';
      case 'diagnosis': return '/diagnosis [your diagnosis]';
      case 'treatment': return '/treatment [your plan]';
      default: return 'Type a message...';
    }
  };

  if (disabled) {
    return (
      <View style={styles.container}>
        <View style={styles.disabledBar}>
          <Text style={styles.disabledText}>Case complete</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder={getPlaceholder()}
          placeholderTextColor="#999"
          onSubmitEditing={handleSend}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!input.trim()}
        >
          <Text style={styles.sendIcon}>↑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderTopWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#fff' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, gap: 8 },
  input: { flex: 1, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 24, fontSize: 15, maxHeight: 100 },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center' },
  sendButtonDisabled: { backgroundColor: '#ccc' },
  sendIcon: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  disabledBar: { padding: 16, alignItems: 'center', backgroundColor: '#E8F5E9' },
  disabledText: { color: '#2E7D32', fontWeight: '600' }
});

export default ActionBar;
