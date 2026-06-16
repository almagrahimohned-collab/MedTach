import React, { useState } from 'react';
import {
  StyleSheet, Text, View, Pressable, ScrollView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../src/store';
import { SUBSCRIPTION_PLANS } from '../../src/services/levelSystem';
import { supabase } from '../../src/config/supabase';

export default function UpgradeScreen() {
  const router = useRouter();
  const user = useStore(s => s.user);
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') {
      router.back();
      return;
    }
    setLoading(planId);
    try {
      // محاكاة الاشتراك (نخزنه محلياً)
      await supabase.from('profiles').update({ subscription: planId }).eq('id', user?.id);
      Alert.alert('✅ Upgraded!', `You are now on the ${SUBSCRIPTION_PLANS.find(p => p.id === planId)?.name} plan!`);
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#94A3B8" />
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
        <Pressable onPress={() => router.push('/profile/analytics')} style={{ marginRight: 8 }}>
          <Ionicons name="stats-chart" size={22} color="#38BDF8" />
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heroText}>Choose Your Plan</Text>
        <Text style={styles.heroSub}>Unlock premium features and stand out</Text>

        {SUBSCRIPTION_PLANS.map(plan => (
          <View key={plan.id} style={[styles.planCard, plan.id === 'premium' && styles.planHighlighted]}>
            {plan.id === 'premium' && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>MOST POPULAR</Text>
              </View>
            )}
            <View style={styles.planHeader}>
              <Text style={[styles.planName, { color: plan.nameColor }]}>{plan.name}</Text>
              <Text style={styles.planPrice}>{plan.price}</Text>
            </View>
            <View style={styles.benefitsList}>
              {plan.benefits.map((benefit, i) => (
                <View key={i} style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
            <Pressable
              style={[styles.upgradeBtn, { backgroundColor: plan.nameColor === '#F8FAFC' ? '#334155' : plan.nameColor }]}
              onPress={() => handleUpgrade(plan.id)}
              disabled={loading === plan.id}
            >
              <Text style={styles.upgradeBtnText}>
                {loading === plan.id ? 'Processing...' : plan.id === 'free' ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </Text>
            </Pressable>
          </View>
        ))}

        <Text style={styles.footerText}>🔒 All plans auto-renew. Cancel anytime.</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 20, backgroundColor: '#1A1F2E', borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  headerTitle: { flex: 1, color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginLeft: 10 },
  content: { flex: 1, padding: 20 },
  heroText: { color: '#F8FAFC', fontSize: 26, fontWeight: '800', textAlign: 'center' },
  heroSub: { color: '#94A3B8', fontSize: 14, textAlign: 'center', marginTop: 4, marginBottom: 24 },
  planCard: { backgroundColor: '#1E293B', borderRadius: 20, padding: 24, marginBottom: 16, borderWidth: 2, borderColor: '#334155' },
  planHighlighted: { borderColor: '#F59E0B' },
  popularBadge: { position: 'absolute', top: -12, alignSelf: 'center', backgroundColor: '#F59E0B', paddingHorizontal: 16, paddingVertical: 4, borderRadius: 10 },
  popularText: { color: '#0F172A', fontSize: 10, fontWeight: '800' },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 8 },
  planName: { fontSize: 22, fontWeight: '800' },
  planPrice: { color: '#F8FAFC', fontSize: 20, fontWeight: '700' },
  benefitsList: { gap: 10, marginBottom: 20 },
  benefitItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  benefitText: { color: '#E2E8F0', fontSize: 14 },
  upgradeBtn: { padding: 16, borderRadius: 14, alignItems: 'center' },
  upgradeBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  footerText: { color: '#64748B', fontSize: 12, textAlign: 'center', marginTop: 8 },
});
