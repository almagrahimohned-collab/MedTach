import React, { useState, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { searchService, SearchResult } from '../src/services/searchService';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    const data = await searchService.search(text);
    setResults(data);
    setHasSearched(true);
    setLoading(false);
  }, []);

  const handleResultPress = (result: SearchResult) => {
    if (result.route) {
      router.push(`${result.route}?${new URLSearchParams(result.params).toString()}` as any);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'case': return '#38BDF8';
      case 'lab': return '#10B981';
      case 'image': return '#8B5CF6';
      case 'drug': return '#F59E0B';
      case 'competency': return '#6366F1';
      case 'specialty': return '#EC4899';
      default: return '#94A3B8';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'case': return 'document-text';
      case 'lab': return 'flask';
      case 'image': return 'image';
      case 'drug': return 'medkit';
      case 'competency': return 'ribbon';
      case 'specialty': return 'fitness';
      default: return 'search';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'case': return 'Clinical Case';
      case 'lab': return 'Lab Test';
      case 'image': return 'Medical Image';
      case 'drug': return 'Medication';
      case 'competency': return 'Competency';
      case 'specialty': return 'Specialty';
      default: return type;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Search Bar */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#94A3B8" />
        </Pressable>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#64748B" />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search cases, labs, drugs..."
            placeholderTextColor="#64748B"
            value={query}
            onChangeText={handleSearch}
            autoFocus
          />
          {query.length > 0 && (
            <Pressable onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={18} color="#64748B" />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#38BDF8" />
          </View>
        )}

        {hasSearched && !loading && results.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={60} color="#334155" />
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptySub}>Try a different search term</Text>
          </View>
        )}

        {results.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsCount}>{results.length} results for "{query}"</Text>
            {results.map((result, index) => (
              <Pressable
                key={`${result.type}-${result.id}-${index}`}
                style={styles.resultCard}
                onPress={() => handleResultPress(result)}
              >
                <View style={[styles.resultIcon, { backgroundColor: getTypeColor(result.type) + '20' }]}>
                  <Ionicons name={getTypeIcon(result.type) as any} size={22} color={getTypeColor(result.type)} />
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultTitle}>{result.title}</Text>
                  <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
                </View>
                <View style={[styles.typeBadge, { backgroundColor: getTypeColor(result.type) + '15' }]}>
                  <Text style={[styles.typeText, { color: getTypeColor(result.type) }]}>
                    {getTypeLabel(result.type)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#64748B" />
              </Pressable>
            ))}
          </View>
        )}

        {!hasSearched && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Quick Search</Text>
            <View style={styles.suggestionGrid}>
              {['pneumonia', 'STEMI', 'ECG', 'troponin', 'antibiotics', 'shock'].map(item => (
                <Pressable
                  key={item}
                  style={styles.suggestionChip}
                  onPress={() => handleSearch(item)}
                >
                  <Text style={styles.suggestionText}>{item}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingTop: 20, backgroundColor: '#1A1F2E', borderBottomWidth: 1, borderBottomColor: '#1E293B', gap: 10 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F172A', borderRadius: 12, paddingHorizontal: 12, gap: 8, borderWidth: 1, borderColor: '#334155' },
  searchInput: { flex: 1, color: '#F8FAFC', fontSize: 15, paddingVertical: 10 },
  content: { flex: 1, padding: 16 },
  loadingContainer: { paddingVertical: 40 },
  emptyContainer: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700' },
  emptySub: { color: '#94A3B8', fontSize: 14 },
  resultsSection: { gap: 8 },
  resultsCount: { color: '#94A3B8', fontSize: 12, marginBottom: 4 },
  resultCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#334155', gap: 10 },
  resultIcon: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  resultInfo: { flex: 1, gap: 2 },
  resultTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '600' },
  resultSubtitle: { color: '#94A3B8', fontSize: 11 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  typeText: { fontSize: 10, fontWeight: '600' },
  suggestionsContainer: { paddingTop: 10 },
  suggestionsTitle: { color: '#94A3B8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  suggestionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  suggestionChip: { backgroundColor: '#1E293B', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#334155' },
  suggestionText: { color: '#E2E8F0', fontSize: 13, fontWeight: '600' },
});
