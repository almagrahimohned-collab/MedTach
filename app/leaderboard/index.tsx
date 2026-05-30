import { StyleSheet, Text, View, FlatList } from 'react-native';

const leaderboardData = [
  { id: '1', name: 'Dr. Sarah', score: 8900, rank: 1 },
  { id: '2', name: 'Dr. Khalid', score: 8450, rank: 2 },
  { id: '3', name: 'Dr. Youssef', score: 7800, rank: 3 },
  { id: '4', name: 'Dr. Ahmed (You)', score: 3450, rank: 45 },
  { id: '5', name: 'Dr. Mona', score: 3400, rank: 46 },
];

export default function Leaderboard() {
  const renderItem = ({ item }: { item: any }) => {
    const isTop3 = item.rank <= 3;
    const isMe = item.name.includes('(You)');

    return (
      <View style={[styles.rankCard, isMe && styles.myRankCard]}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankNumber}>
            {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
          </Text>
        </View>
        <Text style={[styles.drName, isTop3 && styles.topDrName]}>{item.name}</Text>
        <Text style={styles.scoreText}>{item.score} pts</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Global Rankings</Text>
      <Text style={styles.subtitle}>Top Diagnosticians</Text>

      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#F59E0B', textAlign: 'center', marginTop: 10, marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#94A3B8', textAlign: 'center', marginBottom: 24 },
  list: { paddingBottom: 20 },
  
  rankCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  myRankCard: { borderColor: '#38BDF8', backgroundColor: '#0F2942' }, 
  
  rankBadge: { width: 40, alignItems: 'center', marginRight: 16 },
  rankNumber: { fontSize: 20, fontWeight: 'bold', color: '#F8FAFC' },
  
  drName: { flex: 1, fontSize: 16, color: '#F8FAFC', fontWeight: '500' },
  topDrName: { fontWeight: 'bold', color: '#F59E0B' }, 
  
  scoreText: { fontSize: 16, fontWeight: 'bold', color: '#10B981' },
});
