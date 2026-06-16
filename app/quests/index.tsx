import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Animated,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../src/store';
import { generateDailyQuests, generateWeeklyQuests, Quest } from '../../src/utils/quests';
import { Ionicons } from '@expo/vector-icons';

export default function QuestsScreen() {
  const router = useRouter();
  const { completedCases, totalPoints, getTodayCases, getUniqueSpecialties, addPoints, quests, updateQuestProgress, claimQuest } = useStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const todayCases = getTodayCases();
  const uniqueSpecialties = getUniqueSpecialties();
  
  const dailyQuests = generateDailyQuests(completedCases, totalPoints, todayCases);
  const weeklyQuests = generateWeeklyQuests(completedCases, totalPoints, uniqueSpecialties);

  const handleClaim = (quest: Quest) => {
    const reward = claimQuest(quest.id);
    if (reward > 0) {
      addPoints(reward);
      Alert.alert('Reward Claimed! 🎉', `You earned +${reward} bonus points!`);
    }
  };

  const renderQuestCard = (quest: Quest, isWeekly: boolean = false) => {
    const progressPercent = Math.min(
      Math.round((quest.progress / quest.target) * 100),
      100
    );
    const storedQuest = quests.find(q => q.id === quest.id);
    const isClaimed = storedQuest?.claimed || false;
    const isCompleted = quest.completed || (storedQuest?.completed || false);

    return (
      <View
        key={quest.id}
        style={[styles.questCard, isCompleted && styles.questCardCompleted]}
      >
        <View style={styles.questHeader}>
          <View style={[styles.questIconBox, { backgroundColor: isCompleted ? '#10B98120' : '#1E293B' }]}>
            <Ionicons
              name={quest.icon as any}
              size={24}
              color={isCompleted ? '#10B981' : '#38BDF8'}
            />
          </View>
          <View style={styles.questInfo}>
            <Text style={styles.questTitle}>{quest.title}</Text>
            <Text style={styles.questDesc}>{quest.description}</Text>
          </View>
          <View style={styles.rewardBadge}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={styles.rewardText}>+{quest.reward}</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercent}%`, backgroundColor: isCompleted ? '#10B981' : '#38BDF8' },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {quest.progress}/{quest.target}
          </Text>
        </View>

        {isCompleted && !isClaimed && (
          <Pressable style={styles.claimBtn} onPress={() => handleClaim(quest)}>
            <Text style={styles.claimBtnText}>Claim Reward</Text>
            <Ionicons name="gift" size={16} color="#0F172A" />
          </Pressable>
        )}

        {isClaimed && (
          <View style={styles.claimedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.claimedText}>Claimed</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()
        }}
        />
        <View>
          <Text style={styles.title}>Daily Quests</Text>
          <Pressable onPress={() => router.push('/quests/daily-loop')} style={{ marginTop: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="flame" size={14} color="#F59E0B" />
              <Text style={{ color: '#F59E0B', fontSize: 12, fontWeight: '600' }}>Daily Loop</Text>
            </View>
          </Pressable>
        </View>
      </View>
      
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back(}>
            <Ionicons name="arrow-back" size={22} color="#94A3B8" />
          </Pressable>
          <View>
            <Text style={styles.title}>Daily Quests</Text>
            <Text style={styles.subtitle}>Complete tasks to earn bonus rewards</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Daily Quests</Text>
          <Text style={styles.sectionDesc}>Resets in 24 hours</Text>
          {dailyQuests.map(quest => renderQuestCard(quest))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📆 Weekly Quests</Text>
          <Text style={styles.sectionDesc}>Resets on Monday</Text>
          {weeklyQuests.map(quest => renderQuestCard(quest, true))}
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
  title: { color: '#F8FAFC', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#94A3B8', fontSize: 13, marginTop: 2 },

  section: { marginBottom: 28 },
  sectionTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  sectionDesc: { color: '#64748B', fontSize: 12, marginBottom: 14 },

  questCard: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  questCardCompleted: { borderColor: '#10B98140', backgroundColor: '#10B98108' },

  questHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  questIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questInfo: { flex: 1 },
  questTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '700', marginBottom: 2 },
  questDesc: { color: '#94A3B8', fontSize: 12 },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  rewardText: { color: '#F59E0B', fontSize: 12, fontWeight: '700' },

  progressSection: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { color: '#94A3B8', fontSize: 11, fontWeight: '600', width: 40, textAlign: 'right' },

  claimBtn: {
    backgroundColor: '#F59E0B',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  claimBtnText: { color: '#0F172A', fontSize: 13, fontWeight: '700' },

  claimedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 10,
    backgroundColor: '#10B98115',
    borderRadius: 10,
  },
  claimedText: { color: '#10B981', fontSize: 13, fontWeight: '600' },
});
