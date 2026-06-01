import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Animated,
  Linking,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const teamMembers = [
  { name: 'Medical Team', role: 'Clinical Content & Validation', icon: 'medkit' },
  { name: 'AI Engineers', role: 'Machine Learning Models', icon: 'hardware-chip' },
  { name: 'UX Designers', role: 'User Experience Design', icon: 'color-palette' },
  { name: 'Developers', role: 'Full Stack Development', icon: 'code-slash' },
];

const features = [
  { icon: 'brain', title: 'AI-Powered', desc: 'Advanced language models simulate real attending physicians' },
  { icon: 'library', title: 'Rich Case Library', desc: 'Hundreds of clinical cases across multiple specialties' },
  { icon: 'trophy', title: 'Gamified Learning', desc: 'Badges, leaderboards, and daily challenges' },
  { icon: 'analytics', title: 'Performance Tracking', desc: 'Detailed analytics and progress monitoring' },
  { icon: 'globe', title: 'Multi-platform', desc: 'Available on iOS, Android, and Web' },
  { icon: 'lock-closed', title: 'Privacy First', desc: 'Your data is stored securely on your device' },
];

export default function AboutScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleContact = () => {
    Alert.alert(
      'Contact Us',
      'Email: support@medtach.com\n\nWe typically respond within 24 hours.',
      [
        { text: 'Copy Email', onPress: () => {} },
        { text: 'Close', style: 'cancel' },
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert('Rate MedTach', 'Thank you for your support! Please rate us on the App Store.', [
      { text: 'Rate Now', onPress: () => {} },
      { text: 'Later', style: 'cancel' },
    ]);
  };

  const handlePrivacy = () => {
    Linking.openURL('https://medtach.com/privacy');
  };

  const handleTerms = () => {
    Linking.openURL('https://medtach.com/terms');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#94A3B8" />
          </Pressable>
          <Text style={styles.title}>About MedTach</Text>
        </View>

        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🩺</Text>
          </View>
          <Text style={styles.appName}>MedTach</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.tagline}>AI-Powered Clinical Diagnostic Platform</Text>
        </View>

        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>
            MedTach is an advanced medical education platform designed to help medical students, 
            residents, and practicing physicians sharpen their diagnostic skills through realistic 
            clinical case simulations powered by artificial intelligence.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Key Features</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIconBox}>
                <Ionicons name={feature.icon as any} size={22} color="#38BDF8" />
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍⚕️ Our Team</Text>
          {teamMembers.map((member, index) => (
            <View key={index} style={styles.teamItem}>
              <View style={styles.teamIconBox}>
                <Ionicons name={member.icon as any} size={20} color="#10B981" />
              </View>
              <View>
                <Text style={styles.teamName}>{member.name}</Text>
                <Text style={styles.teamRole}>{member.role}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📄 Legal</Text>
          
          <Pressable style={styles.linkItem} onPress={handlePrivacy}>
            <Ionicons name="shield-checkmark" size={20} color="#94A3B8" />
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </Pressable>

          <Pressable style={styles.linkItem} onPress={handleTerms}>
            <Ionicons name="document-text" size={20} color="#94A3B8" />
            <Text style={styles.linkText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </Pressable>

          <Pressable style={styles.linkItem} onPress={handleContact}>
            <Ionicons name="mail" size={20} color="#94A3B8" />
            <Text style={styles.linkText}>Contact Us</Text>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </Pressable>

          <Pressable style={styles.linkItem} onPress={handleRateApp}>
            <Ionicons name="star" size={20} color="#F59E0B" />
            <Text style={styles.linkText}>Rate the App</Text>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </Pressable>
        </View>

        <View style={styles.techSection}>
          <Text style={styles.sectionTitle}>🔧 Technology Stack</Text>
          <View style={styles.techGrid}>
            <View style={styles.techBadge}>
              <Text style={styles.techText}>React Native</Text>
            </View>
            <View style={styles.techBadge}>
              <Text style={styles.techText}>Expo</Text>
            </View>
            <View style={styles.techBadge}>
              <Text style={styles.techText}>TypeScript</Text>
            </View>
            <View style={styles.techBadge}>
              <Text style={styles.techText}>OpenRouter AI</Text>
            </View>
            <View style={styles.techBadge}>
              <Text style={styles.techText}>Zustand</Text>
            </View>
            <View style={styles.techBadge}>
              <Text style={styles.techText}>AsyncStorage</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.copyright}>© 2025 MedTach. All rights reserved.</Text>
          <Text style={styles.madeWith}>Made with ❤️ for medical education</Text>
        </View>

        <View style={{ height: 40 }} />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  content: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 24 },
  backBtn: { padding: 4 },
  title: { color: '#F8FAFC', fontSize: 22, fontWeight: '700' },

  logoSection: { alignItems: 'center', marginBottom: 24 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  logoEmoji: { fontSize: 36 },
  appName: { color: '#F8FAFC', fontSize: 28, fontWeight: '800', marginBottom: 4 },
  version: { color: '#38BDF8', fontSize: 13, fontWeight: '600', marginBottom: 6 },
  tagline: { color: '#94A3B8', fontSize: 14 },

  descriptionCard: {
    backgroundColor: '#1E293B',
    padding: 18,
    borderRadius: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  descriptionText: { color: '#CBD5E1', fontSize: 14, lineHeight: 22 },

  section: { marginBottom: 24 },
  sectionTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '700', marginBottom: 14 },

  featureItem: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  featureIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureInfo: { flex: 1 },
  featureTitle: { color: '#E2E8F0', fontSize: 14, fontWeight: '600', marginBottom: 2 },
  featureDesc: { color: '#94A3B8', fontSize: 12, lineHeight: 18 },

  teamItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  teamIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamName: { color: '#E2E8F0', fontSize: 14, fontWeight: '600' },
  teamRole: { color: '#94A3B8', fontSize: 12 },

  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  linkText: { color: '#E2E8F0', fontSize: 14, flex: 1 },

  techSection: { marginBottom: 24 },
  techGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  techBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  techText: { color: '#38BDF8', fontSize: 12, fontWeight: '600' },

  footer: { alignItems: 'center', paddingVertical: 20 },
  copyright: { color: '#64748B', fontSize: 12, marginBottom: 4 },
  madeWith: { color: '#475569', fontSize: 11 },
});
