import React, { useState } from 'react';
import {
  StyleSheet, Text, View, Pressable, Modal, TextInput, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createCard, DEFAULT_DECKS } from '../app/flashcards/spacedRepetition';

const STORAGE_KEY = 'flashcards_data';

interface AddToFlashcardModalProps {
  visible: boolean;
  onClose: () => void;
  suggestedFront?: string;
  suggestedBack?: string;
  suggestedDeck?: string;
  source?: 'case' | 'question' | 'manual';
  sourceTitle?: string;
}

export default function AddToFlashcardModal({
  visible,
  onClose,
  suggestedFront = '',
  suggestedBack = '',
  suggestedDeck = 'your_cards',
  source,
  sourceTitle,
}: AddToFlashcardModalProps) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [selectedDeck, setSelectedDeck] = useState(suggestedDeck);
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    if (visible) {
      setFront(suggestedFront);
      setBack(suggestedBack);
      setSelectedDeck(suggestedDeck);
      setSaved(false);
    }
  }, [visible, suggestedFront, suggestedBack, suggestedDeck]);

  const handleSave = async () => {
    if (!front.trim() || !back.trim()) return;

    const card = createCard(
      selectedDeck,
      front.trim(),
      back.trim(),
      'basic',
      source ? [source] : ['manual'],
      undefined,
      undefined,
      undefined,
      undefined,
      sourceTitle,
      source || 'manual'
    );
    
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const existingCards = stored ? JSON.parse(stored) : [];
      const updated = [...existingCards, card];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSaved(true);
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (error) {
      console.error('Failed to save flashcard:', error);
    }
  };

  // 🆕 Show Your Cards first in deck selector
  const sortedDecks = [
    ...DEFAULT_DECKS.filter(d => d.isUserDeck),
    ...DEFAULT_DECKS.filter(d => !d.isUserDeck),
  ];

  const getSourceIcon = () => {
    if (source === 'case') return '🏥';
    if (source === 'question') return '❓';
    return '✍️';
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {saved ? '✅ Card Saved!' : `${getSourceIcon()} Add to Flashcards`}
            </Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#94A3B8" />
            </Pressable>
          </View>

          {saved ? (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={60} color="#10B981" />
              <Text style={styles.successText}>Flashcard added successfully!</Text>
              {source && (
                <View style={styles.sourceTag}>
                  <Text style={styles.sourceTagText}>
                    {getSourceIcon()} From {source === 'case' ? 'Clinical Case' : source === 'question' ? 'Question Bank' : 'Manual Entry'}
                  </Text>
                </View>
              )}
              <Text style={styles.deckInfo}>Deck: {DEFAULT_DECKS.find(d => d.id === selectedDeck)?.name}</Text>
            </View>
          ) : (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* 🆕 Source info */}
              {sourceTitle && (
                <View style={styles.sourceBanner}>
                  <Text style={styles.sourceBannerText}>
                    {getSourceIcon()} {sourceTitle}
                  </Text>
                </View>
              )}

              {/* Deck Selector */}
              <Text style={styles.label}>Deck</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.deckScroll}>
                {sortedDecks.map(deck => (
                  <Pressable
                    key={deck.id}
                    style={[
                      styles.deckChip,
                      deck.isUserDeck && styles.userDeckChip,
                      selectedDeck === deck.id && {
                        backgroundColor: deck.color + '30',
                        borderColor: deck.color,
                      },
                    ]}
                    onPress={() => setSelectedDeck(deck.id)}
                  >
                    <Text style={styles.deckChipEmoji}>{deck.emoji}</Text>
                    <Text style={[
                      styles.deckChipText,
                      selectedDeck === deck.id && { color: deck.color },
                    ]}>
                      {deck.name}
                    </Text>
                    {deck.isUserDeck && <Ionicons name="star" size={12} color="#38BDF8" />}
                  </Pressable>
                ))}
              </ScrollView>

              {/* Front Input */}
              <Text style={styles.label}>Front (Question)</Text>
              <TextInput
                style={styles.input}
                value={front}
                onChangeText={setFront}
                placeholder="Enter question..."
                placeholderTextColor="#64748B"
                multiline
              />

              {/* Back Input */}
              <Text style={styles.label}>Back (Answer)</Text>
              <TextInput
                style={[styles.input, styles.backInput]}
                value={back}
                onChangeText={setBack}
                placeholder="Enter answer..."
                placeholderTextColor="#64748B"
                multiline
              />

              {/* Save Button */}
              <Pressable
                style={[styles.saveBtn, (!front.trim() || !back.trim()) && styles.saveBtnDisabled]}
                onPress={handleSave}
                disabled={!front.trim() || !back.trim()}
              >
                <Ionicons name="flash" size={18} color="#0F172A" />
                <Text style={styles.saveBtnText}>Save to {DEFAULT_DECKS.find(d => d.id === selectedDeck)?.name}</Text>
              </Pressable>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  // 🆕 Source banner
  sourceBanner: {
    backgroundColor: '#38BDF815',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#38BDF830',
  },
  sourceBannerText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '600',
  },
  label: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  deckScroll: {
    maxHeight: 44,
    marginBottom: 4,
  },
  deckChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 8,
  },
  userDeckChip: {
    borderColor: '#38BDF840',
    backgroundColor: '#38BDF810',
  },
  deckChipEmoji: {
    fontSize: 14,
  },
  deckChipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#0F172A',
    color: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
    lineHeight: 22,
  },
  backInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#38BDF8',
    padding: 16,
    borderRadius: 14,
    marginTop: 24,
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveBtnText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  successContainer: {
    alignItems: 'center',
    padding: 40,
    gap: 12,
  },
  successText: {
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '600',
  },
  sourceTag: {
    backgroundColor: '#38BDF815',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38BDF830',
  },
  sourceTagText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },
  deckInfo: {
    color: '#94A3B8',
    fontSize: 12,
  },
});
