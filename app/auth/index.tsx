import { StyleSheet, Text, View } from 'react-native';

export default function AuthIndex() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>شاشة تسجيل الدخول (قيد الإنشاء)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#F8FAFC',
    fontSize: 18,
  },
});
