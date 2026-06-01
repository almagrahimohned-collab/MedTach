import React, { useState, useCallback, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Pressable, 
  FlatList, 
  Animated, 
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const specialties = [
  { 
    id: 'internal', 
    name: 'Internal Medicine',
    emoji: '🏥',
    color: '#3B82F6',
    description: 'Adult diseases & chronic conditions',
    caseCount: 45,
    difficulty: 'Intermediate',
  },
  { 
    id: 'pediatrics', 
    name: 'Pediatrics',
    emoji: '👶',
    color: '#F59E0B',
    description: 'Child healthcare & development',
    caseCount: 32,
    difficulty: 'Beginner',
  },
  { 
    id: 'surgery', 
    name: 'Surgery',
    emoji: '🔪',
    color: '#EF4444',
    description: 'Operative procedures & trauma',
    caseCount: 38,
    difficulty: 'Advanced',
  },
  { 
    id: 'gynecology', 
    name: 'OB/GYN',
    emoji: '🤰',
    color: '#8B5CF6',
    description: 'Women health & pregnancy',
    caseCount: 28,
    difficulty: 'Intermediate',
  },
  { 
    id: 'cardiology', 
    name: 'Cardiology',
    emoji: '❤️',
    color: '#EC4899',
    description: 'Heart & cardiovascular system',
    caseCount: 50,
    difficulty: 'Advanced',
  },
  { 
    id: 'neurology', 
    name: 'Neurology',
    emoji: '🧠',
    color: '#10B981',
    description: 'Brain & nervous system',
    caseCount: 35,
    difficulty: 'Advanced',
  },
];

export default function Specialties() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const scaleAnims = useRef<{ [key: string]: Animated.Value }>({}).current;

  // نفس الـ handlers بتاعتك
  const getScaleAnim = (id: string) => {
    if (!scaleAnims[id]) {
      scaleAnims[id] = new Animated.Value(1);
    }
    return scaleAnims[id];
  };

  const handlePressIn = useCallback((id: string) => {
    Animated.spring(getScaleAnim(id), {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressOut = useCallback((id: string) => {
    Animated.spring(getScaleAnim(id), {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, []);

  // نفس التنقل بتاعك بالظبط
  const handleSpecialtyPress = useCallback((item: typeof specialties[0]) => {
    setSelectedId(item.id);
    router.push(`/specialties/details?id=${item.id}`);
  }, [router]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#10B981';
      case 'Intermediate': return '#F59E0B';
      case 'Advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderSpecialtyCard = useCallback(({ item }: { item: typeof specialties[0] }) => {
    const scaleAnim = getScaleAnim(item.id);

    return (
      <Animated.View style={[
        styles.cardWrapper,
        { transform: [{ scale: scaleAnim }] }
      ]}>
        <Pressable
          style={({ pressed }) => [
            styles.card,
            { borderColor: item.color + '40' },
            selectedId === item.id && { borderColor: item.color, borderWidth: 2 },
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => handleSpecialtyPress(item)}
          onPressIn={() => handlePressIn(item.id)}
          onPressOut={() => handlePressOut(item.id)}
        >
          {/* Emoji & Name */}
          <View style={styles.cardTop}>
            <View style={[styles.emojiContainer, { backgroundColor: item.color + '20' }]}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.name}
            </Text>
          </View>

          {/* Description */}
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>

          {/* Stats */}
          <View style={styles.cardStats}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>📚</Text>
              <Text style={styles.statText}>{item.caseCount} Cases</Text>
            </View>
            
            <View style={[styles.difficultyBadge, { 
              backgroundColor: getDifficultyColor(item.difficulty) + '20',
              borderColor: getDifficultyColor(item.difficulty) + '40',
            }]}>
              <View style={[styles.difficultyDot, { 
                backgroundColor: getDifficultyColor(item.difficulty) 
              }]} />
              <Text style={[styles.difficultyText, { 
                color: getDifficultyColor(item.difficulty) 
              }]}>
                {item.difficulty}
              </Text>
            </View>
          </View>

          {/* Arrow indicator */}
          <View style={styles.arrowContainer}>
            <Text style={[styles.arrow, { color: item.color }]}>→</Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  }, [selectedId, handleSpecialtyPress, handlePressIn, handlePressOut]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Select Specialty</Text>
          <Text style={styles.subtitle}>Choose a medical field to begin</Text>
        </View>
        
        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewIcon}>📋</Text>
            <Text style={styles.overviewText}>
              {specialties.length} Specialties
            </Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewIcon}>📄</Text>
            <Text style={styles.overviewText}>
              {specialties.reduce((sum, s) => sum + s.caseCount, 0)} Cases
            </Text>
          </View>
        </View>
      </View>

      {/* Grid */}
      <FlatList
        data={specialties}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderSpecialtyCard}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  overviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  overviewIcon: {
    fontSize: 14,
  },
  overviewText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 32,
  },
  columnWrapper: {
    gap: 10,
    marginBottom: 10,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: (width - 44) / 2,
  },
  card: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#334155',
    minHeight: 180,
    justifyContent: 'space-between',
    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  emoji: {
    fontSize: 24,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: 0.3,
  },
  cardDescription: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16,
    marginBottom: 10,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 12,
  },
  statText: {
    fontSize: 10,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  difficultyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  difficultyText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  arrowContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  arrow: {
    fontSize: 20,
    fontWeight: '900',
    opacity: 0.7,
  },
});
