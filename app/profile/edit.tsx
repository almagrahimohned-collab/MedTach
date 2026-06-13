import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, Pressable, ScrollView, TextInput, Switch, Alert, Modal, FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../src/store';
import { supabase } from '../../src/config/supabase';

const SPECIALTIES = [
  'Internal Medicine', 'Cardiology', 'Pulmonology', 'Neurology', 'Endocrinology',
  'Gastroenterology', 'Nephrology', 'Hematology', 'Oncology', 'Infectious Disease',
  'Rheumatology', 'Dermatology', 'Psychiatry', 'Pediatrics', 'Surgery (General)',
  'Orthopedics', 'Neurosurgery', 'OB/GYN', 'Ophthalmology', 'ENT',
  'Anesthesiology', 'Radiology', 'Emergency Medicine', 'Family Medicine', 'Other',
];

const LEVELS = ['Intern', 'Resident', 'Specialist', 'Consultant'];

const COUNTRIES = ['Libya', 'Egypt', 'Saudi Arabia', 'UAE', 'Jordan', 'Kuwait', 'Qatar', 'Oman', 'Bahrain', 'Sudan', 'Tunisia', 'Algeria', 'Morocco', 'Other'];

const AVATARS = ['🩺', '👨‍⚕️', '👩‍⚕️', '🧑‍⚕️', '💉', '🔬', '🧬', '🫀', '🫁', '🧠', '🦴', '🦷', '👁️', '🩸', '💊', '🏥', '🩻', '🩹', '🫄', '👶', '🧑‍🦽', '🔬', '💉', '🩺'];
const AVATAR_COLORS = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#6366F1', '#14B8A6'];

export default function EditProfile() {
  const router = useRouter();
  const user = useStore(s => s.user);
  const [loading, setLoading] = useState(false);
  const [showAvatars, setShowAvatars] = useState(false);
  const [showSpecialties, setShowSpecialties] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const [showCountries, setShowCountries] = useState(false);

  const [form, setForm] = useState({
    name: '',
    username: '',
    specialty: '',
    level: '',
    institution: '',
    graduationYear: '',
    country: '',
    bio: '',
    avatar: '🩺',
    avatarColor: '#3B82F6',
    isPublic: true,
    showStats: true,
    showBadges: true,
    showActivity: true,
  });

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    if (!user?.id) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (data) {
      setForm(prev => ({
        ...prev,
        name: data.name || '',
        username: data.username || '',
        specialty: data.specialty || '',
        bio: data.bio || '',
        isPublic: data.is_public ?? true,
      }));
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: form.name,
          username: form.username,
          specialty: form.specialty,
          bio: form.bio,
          is_public: form.isPublic,
        })
        .eq('id', user.id);

      if (error) throw error;
      Alert.alert('✅ Saved', 'Profile updated successfully');
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#94A3B8" />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <Pressable onPress={handleSave} disabled={loading}>
          <Text style={styles.saveBtn}>{loading ? '...' : 'Save'}</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <Pressable style={[styles.avatarCircle, { backgroundColor: form.avatarColor + '30' }]} onPress={() => setShowAvatars(true)}>
            <Text style={styles.avatarEmoji}>{form.avatar}</Text>
          </Pressable>
          <Pressable onPress={() => setShowAvatars(true)}>
            <Text style={styles.changeAvatar}>Change Avatar</Text>
          </Pressable>
        </View>

        {/* Personal Information */}
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>👤 Full Name</Text>
          <TextInput style={styles.input} value={form.name} onChangeText={t => setForm(p => ({ ...p, name: t }))} placeholder="Dr. Ahmed Hassan" placeholderTextColor="#64748B" />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>📧 Email</Text>
          <TextInput style={[styles.input, styles.readOnly]} value={user?.email || ''} editable={false} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>🏷️ Username</Text>
          <TextInput style={styles.input} value={form.username} onChangeText={t => setForm(p => ({ ...p, username: t }))} placeholder="@ahmed_cardio" placeholderTextColor="#64748B" autoCapitalize="none" />
        </View>

        {/* Professional Details */}
        <Text style={styles.sectionTitle}>Professional Details</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>🩺 Specialty</Text>
          <Pressable style={styles.selectInput} onPress={() => setShowSpecialties(true)}>
            <Text style={[styles.selectText, !form.specialty && { color: '#64748B' }]}>{form.specialty || 'Select specialty'}</Text>
            <Ionicons name="chevron-down" size={18} color="#64748B" />
          </Pressable>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>🎓 Level</Text>
          <Pressable style={styles.selectInput} onPress={() => setShowLevels(true)}>
            <Text style={[styles.selectText, !form.level && { color: '#64748B' }]}>{form.level || 'Select level'}</Text>
            <Ionicons name="chevron-down" size={18} color="#64748B" />
          </Pressable>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>🏥 Institution</Text>
          <TextInput style={styles.input} value={form.institution} onChangeText={t => setForm(p => ({ ...p, institution: t }))} placeholder="Hospital or University" placeholderTextColor="#64748B" />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>📅 Graduation Year</Text>
          <TextInput style={styles.input} value={form.graduationYear} onChangeText={t => setForm(p => ({ ...p, graduationYear: t }))} placeholder="2020" placeholderTextColor="#64748B" keyboardType="numeric" maxLength={4} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>🌍 Country</Text>
          <Pressable style={styles.selectInput} onPress={() => setShowCountries(true)}>
            <Text style={[styles.selectText, !form.country && { color: '#64748B' }]}>{form.country || 'Select country'}</Text>
            <Ionicons name="chevron-down" size={18} color="#64748B" />
          </Pressable>
        </View>

        {/* About Me */}
        <Text style={styles.sectionTitle}>About Me</Text>
        <TextInput style={[styles.input, styles.bioInput]} value={form.bio} onChangeText={t => setForm(p => ({ ...p, bio: t }))} placeholder="Write something about yourself..." placeholderTextColor="#64748B" multiline />

        {/* Privacy */}
        <Text style={styles.sectionTitle}>Privacy Settings</Text>
        
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>🌐 Public Profile</Text>
            <Text style={styles.switchDesc}>Visible to other doctors</Text>
          </View>
          <Switch value={form.isPublic} onValueChange={v => setForm(p => ({ ...p, isPublic: v }))} trackColor={{ false: '#334155', true: '#38BDF840' }} thumbColor={form.isPublic ? '#38BDF8' : '#94A3B8'} />
        </View>

        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>📊 Show Statistics</Text>
            <Text style={styles.switchDesc}>Cases solved, accuracy, points</Text>
          </View>
          <Switch value={form.showStats} onValueChange={v => setForm(p => ({ ...p, showStats: v }))} trackColor={{ false: '#334155', true: '#38BDF840' }} thumbColor={form.showStats ? '#38BDF8' : '#94A3B8'} />
        </View>

        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>🏆 Show Badges</Text>
            <Text style={styles.switchDesc}>Earned achievements</Text>
          </View>
          <Switch value={form.showBadges} onValueChange={v => setForm(p => ({ ...p, showBadges: v }))} trackColor={{ false: '#334155', true: '#38BDF840' }} thumbColor={form.showBadges ? '#38BDF8' : '#94A3B8'} />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Avatar Modal */}
      <Modal visible={showAvatars} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Avatar</Text>
            <Text style={styles.modalSub}>Icon</Text>
            <View style={styles.avatarGrid}>
              {AVATARS.map(emoji => (
                <Pressable key={emoji} style={[styles.avatarItem, form.avatar === emoji && styles.avatarItemSelected]} onPress={() => { setForm(p => ({ ...p, avatar: emoji })); setShowAvatars(false); }}>
                  <Text style={styles.avatarItemEmoji}>{emoji}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.modalSub}>Color</Text>
            <View style={styles.colorRow}>
              {AVATAR_COLORS.map(color => (
                <Pressable key={color} style={[styles.colorDot, { backgroundColor: color }, form.avatarColor === color && styles.colorDotSelected]} onPress={() => setForm(p => ({ ...p, avatarColor: color }))} />
              ))}
            </View>
            <Pressable style={styles.cancelBtn} onPress={() => setShowAvatars(false)}>
              <Text style={styles.cancelText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Select Modals */}
      {[
        { show: showSpecialties, setShow: setShowSpecialties, title: 'Specialty', data: SPECIALTIES, key: 'specialty' },
        { show: showLevels, setShow: setShowLevels, title: 'Level', data: LEVELS, key: 'level' },
        { show: showCountries, setShow: setShowCountries, title: 'Country', data: COUNTRIES, key: 'country' },
      ].map(modal => (
        <Modal key={modal.key} visible={modal.show} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select {modal.title}</Text>
              <FlatList
                data={modal.data}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <Pressable style={styles.listItem} onPress={() => { setForm(p => ({ ...p, [modal.key]: item })); modal.setShow(false); }}>
                    <Text style={styles.listItemText}>{item}</Text>
                  </Pressable>
                )}
                style={{ maxHeight: 300 }}
              />
            </View>
          </View>
        </Modal>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 20, backgroundColor: '#1A1F2E', borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  headerTitle: { flex: 1, color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginLeft: 10 },
  saveBtn: { color: '#38BDF8', fontSize: 15, fontWeight: '700' },
  content: { flex: 1, padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  avatarEmoji: { fontSize: 40 },
  changeAvatar: { color: '#38BDF8', fontSize: 13, fontWeight: '600' },
  sectionTitle: { color: '#94A3B8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginTop: 24, marginBottom: 12 },
  fieldGroup: { marginBottom: 14 },
  label: { color: '#94A3B8', fontSize: 12, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: '#1E293B', color: '#F8FAFC', padding: 14, borderRadius: 12, fontSize: 14, borderWidth: 1, borderColor: '#334155' },
  readOnly: { opacity: 0.5 },
  selectInput: { backgroundColor: '#1E293B', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#334155', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectText: { color: '#F8FAFC', fontSize: 14 },
  bioInput: { minHeight: 80, textAlignVertical: 'top' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  switchLabel: { color: '#F8FAFC', fontSize: 14, fontWeight: '600' },
  switchDesc: { color: '#64748B', fontSize: 11, marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1E293B', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' },
  modalTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  modalSub: { color: '#94A3B8', fontSize: 12, fontWeight: '600', marginBottom: 10, marginTop: 14 },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  avatarItem: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#334155' },
  avatarItemSelected: { borderColor: '#38BDF8', backgroundColor: '#38BDF820' },
  avatarItemEmoji: { fontSize: 22 },
  colorRow: { flexDirection: 'row', gap: 10 },
  colorDot: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: 'transparent' },
  colorDotSelected: { borderColor: '#FFF' },
  cancelBtn: { backgroundColor: '#334155', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  cancelText: { color: '#E2E8F0', fontWeight: '600' },
  listItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#334155' },
  listItemText: { color: '#E2E8F0', fontSize: 14 },
});
