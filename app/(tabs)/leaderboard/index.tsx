import { StyleSheet, Text, View, FlatList, Pressable, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useStore } from '../../../src/store';
import { Ionicons } from '@expo/vector-icons';

const generateWeeklyData = (userPoints: number, userCases: number) => {
  const base = [
    { id: 'w1', name: 'Dr. Sarah', score: 2450, cases: 18, rank: 1, trend: 'up' },
    { id: 'w2', name: 'Dr. Khalid', score: 2280, cases: 15, rank: 2, trend: 'up' },
    { id: 'w3', name: 'Dr. Youssef', score: 2100, cases: 14, rank: 3, trend: 'down' },
    { id: 'w4', name: 'Dr. Layla', score: 1950, cases: 13, rank: 4, trend: 'up' },
    { id: 'w5', name: 'Dr. Omar', score: 1800, cases: 12, rank: 5, trend: 'same' },
    { id: 'w6', name: 'Dr. Fatima', score: 1650, cases: 11, rank: 6, trend: 'down' },
    { id: 'w7', name: 'Dr. Hassan', score: 1500, cases: 10, rank: 7, trend: 'up' },
    { id: 'w8', name: 'Dr. Mariam', score: 1350, cases: 9, rank: 8, trend: 'same' },
  ];

  const userEntry = {
    id: 'me',
    name: 'Dr. You',
    score: userPoints,
    cases: userCases,
    rank: 0,
    trend: 'up',
    isMe: true,
  };

  const all = [...base, userEntry].sort((a, b) => b.score - a.score);
  all.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return all;
};

const generateMonthlyData = (userPoints: number, userCases: number) => {
  const base = [
    { id: 'm1', name: 'Dr. Sarah', score: 9800, cases: 72, rank: 1, trend: 'up' },
    { id: 'm2', name: 'Dr. Khalid', score: 9200, cases: 68, rank: 2, trend: 'up' },
    { id: 'm3', name: 'Dr. Noor', score: 8700, cases: 65, rank: 3, trend: 'down' },
    { id: 'm4', name: 'Dr. Youssef', score: 8100, cases: 60, rank: 4, trend: 'up' },
    { id: 'm5', name: 'Dr. Layla', score: 7600, cases: 55, rank: 5, trend: 'same' },
    { id: 'm6', name: 'Dr. Omar', score: 7000, cases: 50, rank: 6, trend: 'up' },
    { id: 'm7', name: 'Dr. Fatima', score: 6500, cases: 48, rank: 7, trend: 'down' },
    { id: 'm8', name: 'Dr. Tariq', score: 6000, cases: 45, rank: 8, trend: 'same' },
    { id: 'm9', name: 'Dr. Hassan', score: 5500, cases: 40, rank: 9, trend: 'up' },
    { id: 'm10', name: 'Dr. Mariam', score: 5000, cases: 38, rank: 10, trend: 'down' },
  ];

  const userEntry = {
    id: 'me',
    name: 'Dr. You',
    score: userPoints,
    cases: userCases,
    rank: 0,
    trend: 'up',
    isMe: true,
  };

  const all = [...base, userEntry].sort((a, b) => b.score - a.score);
  all.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return all;
};

export default function Leaderboard() {
  const { totalPoints, completedCases } = useStore();
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const weeklyData = generateWeeklyData(totalPoints, completedCases.length);
  const monthlyData = generateMonthlyData(totalPoints, completedCases.length);
  const currentData = activeTab === 'weekly' ? weeklyData : monthlyData;

  const topThree = currentData.slice(0, 3);
  const remaining = currentData.slice(3);

  const handleTabChange = (tab: 'weekly' | 'monthly') => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
    setActiveTab(tab);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return { icon: 'trending-up', color: '#10B981' };
      case 'down': return { icon: 'trending-down', color: '#EF4444' };
      default: return { icon: 'remove', color: '#94A3B8' };
    }
  };

  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const renderTopThree = () => (
    <View style={styles.podium}>
      {topThree.map((player, index) => {
        const heights = [120, 90, 70];
        const positions = [1, 0, 2];
        const pos = positions[index];

        return (
          <View key={player.id} style={[styles.podiumItem, { order: pos }]}>
            <View style={[styles.podiumAvatar, player.isMe && styles.podiumAvatarMe]}>
              <Text style={styles.podiumEmoji}>{getRankDisplay(player.rank)}</Text>
            </View>
            <Text style={[styles.podiumName, player.isMe && styles.podiumNameMe]} numberOfLines={1}>
              {player.name}
            </Text>
            <Text style={styles.podiumScore}>{player.score.toLocaleString()}</Text>
            <View style={[styles.podiumBar, { height: heights[index] }]} />
          </View>
        );
      })}
    </View>
  );

  const renderItem = ({ item }: { item: any }) => {
    const trend = getTrendIcon(item.trend);

    return (
      <View style={[styles.rankCard, item.isMe && styles.myRankCard]}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankNumber}>{getRankDisplay(item.rank)}</Text>
        </View>
        <View style={styles.playerInfo}>
          <Text style={[styles.playerName, item.isMe && styles.playerNameMe]}>
            {item.name}
          </Text>
          <Text style={styles.playerCases}>{item.cases} cases</Text>
        </View>
        <View style={styles.scoreSection}>
          <Text style={styles.scoreText}>{item.score.toLocaleString()}</Text>
          <View style={styles.trendBadge}>
            <Ionicons name={trend.icon as any} size={12} color={trend.color} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Top Diagnosticians</Text>

        <View style={styles.tabSwitch}>
          <Pressable
            style={[styles.tab, activeTab === 'weekly' && styles.tabActive]}
            onPress={() => handleTabChange('weekly')}
          >
            <Text style={[styles.tabText, activeTab === 'weekly' && styles.tabTextActive]}>
              Weekly
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'monthly' && styles.tabActive]}
            onPress={() => handleTabChange('monthly')}
          >
            <Text style={[styles.tabText, activeTab === 'monthly' && styles.tabTextActive]}>
              Monthly
            </Text>
          </Pressable>
        </View>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {renderTopThree()}

        <FlatList
          data={remaining}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { padding: 20, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#F8FAFC', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#94A3B8', textAlign: 'center', marginBottom: 20 },

  tabSwitch: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#F59E0B' },
  tabText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#0F172A' },

  content: { flex: 1 },

  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 8,
  },
  podiumItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    maxWidth: 100,
  },
  podiumAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  podiumAvatarMe: {
    borderColor: '#38BDF8',
    backgroundColor: '#0F2942',
  },
  podiumEmoji: { fontSize: 22 },
  podiumName: { color: '#E2E8F0', fontSize: 11, fontWeight: '600', textAlign: 'center' },
  podiumNameMe: { color: '#38BDF8' },
  podiumScore: { color: '#F59E0B', fontSize: 11, fontWeight: '700' },
  podiumBar: {
    width: '100%',
    backgroundColor: '#F59E0B15',
    borderRadius: 8,
    minHeight: 20,
  },

  list: { paddingHorizontal: 20, paddingBottom: 40 },

  rankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  myRankCard: {
    borderColor: '#38BDF8',
    backgroundColor: '#0F2942',
  },
  rankBadge: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 14,
    color: '#F8FAFC',
    fontWeight: '600',
    marginBottom: 2,
  },
  playerNameMe: {
    color: '#38BDF8',
  },
  playerCases: {
    fontSize: 11,
    color: '#64748B',
  },
  scoreSection: {
    alignItems: 'flex-end',
    gap: 4,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  trendBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
