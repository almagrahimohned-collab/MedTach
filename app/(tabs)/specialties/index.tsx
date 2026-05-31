import { StyleSheet, Text, View, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

const specialties = [
  { id: 'internal', name: 'Internal Medicine' },
  { id: 'pediatrics', name: 'Pediatrics' },
  { id: 'surgery', name: 'Surgery' },
  { id: 'gynecology', name: 'OB/GYN' },
];

export default function Specialties() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Specialty</Text>
      <FlatList
        data={specialties}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/specialties/details?id=${item.id}`)}>
            <Text style={styles.cardText}>{item.name}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#1E293B', width: '48%', padding: 20, margin: '1%', borderRadius: 12, alignItems: 'center' },
  cardText: { color: '#F8FAFC', fontWeight: '600' },
});
