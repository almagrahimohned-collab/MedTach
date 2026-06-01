import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, Text, View, Pressable, ScrollView, Alert, 
  Animated, Dimensions, Platform, StatusBar 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../../../src/store';

const { width } = Dimensions.get('window');

const specialtyData = {
  internal: { 
    name: 'Internal Medicine', 
    gradient: ['#3B82F6', '#1D4ED8'],
    subs: [
      { name: 'Cardiology', icon: '❤️', desc: 'Heart & vascular diseases', cases: 25 },
      { name: 'Respiratory', icon: '🫁', desc: 'Lung & breathing disorders', cases: 20 },
      { name: 'Gastroenterology', icon: '🔬', desc: 'Digestive system', cases: 18 },
      { name: 'Endocrinology', icon: '🧬', desc: 'Hormones & metabolism', cases: 15 },
    ]
  },
  pediatrics: { 
    name: 'Pediatrics', 
    gradient: ['#F59E0B', '#B45309'],
    subs: [
      { name: 'Neonatology', icon: '🍼', desc: 'Newborn intensive care', cases: 20 },
      { name: 'Genetics', icon: '🧬', desc: 'Inherited disorders', cases: 12 },
      { name: 'Infectious Diseases', icon: '🦠', desc: 'Pediatric infections', cases: 18 },
    ]
  },
  surgery: { 
    name: 'Surgery', 
    gradient: ['#EF4444', '#991B1B'],
    subs: [
      { name: 'General Surgery', icon: '🏥', desc: 'Common procedures', cases: 22 },
      { name: 'Orthopedics', icon: '🦴', desc: 'Bone & joint surgery', cases: 18 },
      { name: 'Neurosurgery', icon: '🧠', desc: 'Brain & spine surgery', cases: 15 },
    ]
  },
  gynecology: { 
    name: 'OB/GYN', 
    gradient: ['#8B5CF6', '#5B21B6'],
    subs: [
      { name: 'Obstetrics', icon: '🤰', desc: 'Pregnancy & childbirth', cases: 20 },
      { name: 'Reproductive Endocrinology', icon: '🔬', desc: 'Hormonal disorders', cases: 12 },
    ]
  },
};

const levels = [
  { id: 'Beginner', gradient: ['#10B981', '#047857'] },
  { id: 'Intermediate', gradient: ['#F59E0B', '#B45309'] },
  { id: 'Advanced', gradient: ['#EF4444', '#991B1B'] },
];

export default function SpecialtyDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const setCategory = useStore((s) => s.setCategory);
  
  const [sub, setSub] = useState('');
  const [level, setLevel] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const specialty = specialtyData[id];

  if (!specialty) {
    return (
      <View style={styles.errorScreen}>
        <View style={styles.errorGlass}>
          <Text style={styles.errorIcon}>🔍</Text>
          <Text style={styles.errorTitle}>Not Found</Text>
          <Text style={styles.errorDesc}>This specialty doesn't exist</Text>
          <Pressable style={styles.errorBtn} onPress={() => router.back()}>
            <Text style={styles.errorBtnText}>← Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const handleStart = () => {
    if (!sub || !level) {
      Alert.alert('Missing Selection', 'Please select a sub-category and difficulty level');
      return;
    }
    Alert.alert(
      'Begin Session',
      `Ready to start ${sub} cases at ${level} level?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start', style: 'destructive', onPress: () => { 
          setCategory(id, sub, level); 
          router.push('/cases'); 
        }},
      ]
    );
  };

  const selectedSubData = specialty.subs.find(s => s.name === sub);
  const selectedLevelData = levels.find(l => l.id === level);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E1A" />
      
      <ScrollView 
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          
          {/* Back Button */}
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          {/* Specialty Header Card */}
          <View style={styles.heroCard}>
            <View style={[styles.heroGradient, { backgroundColor: specialty.gradient[0] }]}>
              <View style={styles.heroOverlay} />
              <View style={styles.heroContent}>
                <Text style={styles.heroLabel}>SELECTED SPECIALTY</Text>
                <Text style={styles.heroTitle}>{specialty.name}</Text>
                <View style={styles.heroBadge}>
                  <View style={styles.heroDot} />
                  <Text style={styles.heroBadgeText}>{specialty.subs.length} Sub-categories</Text>
                </View>
              </View>
              <View style={styles.heroDecoration}>
                <View style={styles.decorationCircle1} />
                <View style={styles.decorationCircle2} />
              </View>
            </View>
          </View>

          {/* Step 1: Sub-category */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepNumber}>1</Text>
              </View>
              <View>
                <Text style={styles.sectionTitle}>Choose Sub-Category</Text>
                <Text style={styles.sectionDesc}>Select your area of focus</Text>
              </View>
            </View>

            <View style={styles.subGrid}>
              {specialty.subs.map((item) => {
                const isSelected = sub === item.name;
                return (
                  <Pressable
                    key={item.name}
                    style={[styles.subCard, isSelected && styles.subCardSelected]}
                    onPress={() => setSub(item.name)}
                  >
                    <View style={[styles.subIconBox, isSelected && { backgroundColor: specialty.gradient[0] + '20' }]}>
                      <Text style={styles.subIcon}>{item.icon}</Text>
                    </View>
                    <Text style={[styles.subName, isSelected && { color: specialty.gradient[0] }]}>
                      {item.name}
                    </Text>
                    <Text style={styles.subDesc}>{item.desc}</Text>
                    <View style={styles.subFooter}>
                      <Text style={styles.subCases}>{item.cases} cases</Text>
                      {isSelected && (
                        <View style={[styles.selectedPill, { backgroundColor: specialty.gradient[0] }]}>
                          <Text style={styles.selectedPillText}>Selected</Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Step 2: Difficulty */}
          {sub && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepNumber}>2</Text>
                </View>
                <View>
                  <Text style={styles.sectionTitle}>Select Difficulty</Text>
                  <Text style={styles.sectionDesc}>Choose complexity level</Text>
                </View>
              </View>

              <View style={styles.levelRow}>
                {levels.map((lvl) => {
                  const isSelected = level === lvl.id;
                  return (
                    <Pressable
                      key={lvl.id}
                      style={[styles.levelCard, isSelected && { borderColor: lvl.gradient[0] }]}
                      onPress={() => setLevel(lvl.id)}
                    >
                      <View style={[styles.levelBar, { backgroundColor: lvl.gradient[0] }]} />
                      <Text style={[styles.levelName, isSelected && { color: lvl.gradient[0] }]}>
                        {lvl.id}
                      </Text>
                      <Text style={styles.levelLabel}>
                        {lvl.id === 'Beginner' ? 'Entry' : lvl.id === 'Intermediate' ? 'Mid' : 'Expert'}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Summary & Start */}
          {sub && level && (
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryTitle}>Session Summary</Text>
                <View style={styles.summaryLine} />
              </View>
              
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Specialty</Text>
                  <Text style={styles.summaryValue}>{specialty.name}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Sub-category</Text>
                  <Text style={[styles.summaryValue, { color: specialty.gradient[0] }]}>
                    {selectedSubData?.icon} {sub}
                  </Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Difficulty</Text>
                  <Text style={[styles.summaryValue, { color: selectedLevelData?.gradient[0] }]}>
                    {level}
                  </Text>
                </View>
              </View>

              <Pressable style={styles.startBtn} onPress={handleStart}>
                <View style={[styles.startBtnGradient, { backgroundColor: specialty.gradient[0] }]}>
                  <Text style={styles.startBtnText}>Start Diagnostic Session</Text>
                  <Text style={styles.startBtnIcon}>→</Text>
                </View>
              </Pressable>
            </View>
          )}
          
        </Animated.View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    padding: 20,
  },

  // Error Screen
  errorScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0E1A',
    padding: 20,
  },
  errorGlass: {
    backgroundColor: '#1E293B',
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    width: '100%',
    maxWidth: 320,
  },
  errorIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  errorDesc: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 24,
  },
  errorBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  errorBtnText: {
    color: '#38BDF8',
    fontWeight: '600',
    fontSize: 14,
  },

  // Back Button
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backIcon: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '700',
  },
  backText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Hero Card
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  heroGradient: {
    padding: 28,
    position: 'relative',
    overflow: 'hidden',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
  },
  heroLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  heroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  heroDecoration: {
    position: 'absolute',
    right: -20,
    bottom: -20,
  },
  decorationCircle1: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  decorationCircle2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    position: 'absolute',
    right: 60,
    bottom: 60,
  },

  // Section
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  stepNumber: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  sectionDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  // Sub-category Grid
  subGrid: {
    gap: 12,
  },
  subCard: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    position: 'relative',
  },
  subCardSelected: {
    borderColor: '#38BDF8',
    backgroundColor: '#1E293B',
  },
  subIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  subIcon: {
    fontSize: 24,
  },
  subName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  subDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 12,
  },
  subFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subCases: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  selectedPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedPillText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Level Cards
  levelRow: {
    flexDirection: 'row',
    gap: 12,
  },
  levelCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#334155',
    alignItems: 'center',
    gap: 8,
  },
  levelBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  levelName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },
  levelLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryHeader: {
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  summaryLine: {
    height: 1,
    backgroundColor: '#334155',
  },
  summaryRow: {
    gap: 16,
    marginBottom: 24,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#F8FAFC',
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#334155',
  },

  // Start Button
  startBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  startBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 12,
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  startBtnIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '900',
  },
});
