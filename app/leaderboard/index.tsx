import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

const mockData = [
  { id: '1', name: 'Dr. Sarah', points: 2500, rank: 1 },
  { id: '2', name: 'Dr. Ahmed', points: 2200, rank: 2 },
  { id: '3', name: 'You (Dr. User)', points: 1850, rank: 3 },
];

export default function Leaderboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Leaderboard</Text>
      <FlatList
        data={mockData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.item, item.id === '3' && styles.highlight]}>
            <Text style={styles.rank}>{item.rank}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.points}>{item.points} pts</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 20 },
  header: { color: '#F8FAFC', fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  item: { flexDirection: 'row', backgroundColor: '#1E293B', padding: 15, borderRadius: 12, marginBottom: 10, alignItems: 'center' },
  highlight: { borderColor: '#38BDF8', borderWidth: 2 },
  rank: { color: '#94A3B8', fontSize: 18, fontWeight: 'bold', width: 40 },
  name: { color: '#F8FAFC', fontSize: 18, flex: 1 },
  points: { color: '#10B981', fontWeight: 'bold' }
});
