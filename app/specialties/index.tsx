import { StyleSheet, Text, View, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

const specialties = [
  { id: '1', name: 'Internal Medicine' },
  { id: '2', name: 'Pediatrics' },
  { id: '3', name: 'Surgery' },
  { id: '4', name: 'Obstetrics & Gynecology' },
];

export default function Specialties() {
  const router = useRouter();

  const renderItem = ({ item }: { item: { id: string; name: string } }) => (
    <Pressable 
      style={styles.card} 
      onPress={() => router.push('/cases')}
    >
      <Text style={styles.cardText}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Specialty</Text>
      <Text style={styles.subtitle}>Choose your field of practice</Text>
      
      <FlatList
        data={specialties}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#94A3B8', marginBottom: 24, textAlign: 'center' },
  list: { paddingBottom: 20 },
  row: { justifyContent: 'space-between', marginBottom: 16 },
  card: { 
    backgroundColor: '#1E293B', 
    width: '48%', 
    padding: 24, 
    borderRadius: 12, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155'
  },
  cardText: { color: '#F8FAFC', fontSize: 16, fontWeight: '600', textAlign: 'center' },
});
