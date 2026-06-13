import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, Pressable, ScrollView, TextInput, Modal, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../src/store';
import { getPosts, createPost, getComments, addComment, likePost, Post, Comment } from './communityService';

export default function CommunityScreen() {
  const router = useRouter();
  const user = useStore(s => s.user);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [showComments, setShowComments] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'myPosts'>('feed');

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data as Post[]);
    } catch (e) {
      console.error('Error loading posts:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !user?.id) return;
    try {
      await createPost(user.id, newTitle, newContent);
      setNewTitle('');
      setNewContent('');
      setShowNewPost(false);
      loadPosts();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await likePost(postId);
      loadPosts();
    } catch (e) {}
  };

  const handleShowComments = async (postId: string) => {
    if (showComments === postId) {
      setShowComments(null);
      return;
    }
    setShowComments(postId);
    try {
      const data = await getComments(postId);
      setComments(data as Comment[]);
    } catch (e) {}
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user?.id || !showComments) return;
    try {
      await addComment(showComments, user.id, newComment);
      setNewComment('');
      const data = await getComments(showComments);
      setComments(data as Comment[]);
    } catch (e) {}
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#94A3B8" />
        </Pressable>
        <Text style={styles.headerTitle}>Community</Text>
        <Pressable onPress={() => setShowNewPost(true)}>
          <Ionicons name="add-circle" size={26} color="#38BDF8" />
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Pressable style={[styles.tab, activeTab === 'feed' && styles.tabActive]} onPress={() => setActiveTab('feed')}>
          <Text style={[styles.tabText, activeTab === 'feed' && styles.tabTextActive]}>📋 Feed</Text>
        </Pressable>
        <Pressable style={[styles.tab, activeTab === 'myPosts' && styles.tabActive]} onPress={() => setActiveTab('myPosts')}>
          <Text style={[styles.tabText, activeTab === 'myPosts' && styles.tabTextActive]}>📝 My Posts</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {posts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people" size={60} color="#334155" />
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptySub}>Be the first to share!</Text>
          </View>
        ) : (
          posts
            .filter(p => activeTab === 'feed' ? true : p.user_id === user?.id)
            .map(post => (
              <View key={post.id} style={styles.postCard}>
                {/* Post Header */}
                <View style={styles.postHeader}>
                  <View style={styles.avatar}>
                    <Ionicons name="person-circle" size={40} color="#38BDF8" />
                  </View>
                  <View style={styles.postInfo}>
                    <Text style={styles.postAuthor}>{(post.user as any)?.name || 'Doctor'}</Text>
                    <Text style={styles.postTime}>{new Date(post.created_at).toLocaleDateString()}</Text>
                  </View>
                </View>

                {/* Post Content */}
                <Text style={styles.postTitle}>{post.title}</Text>
                {post.content && <Text style={styles.postContent}>{post.content}</Text>}

                {/* Post Actions */}
                <View style={styles.postActions}>
                  <Pressable style={styles.actionBtn} onPress={() => handleLike(post.id)}>
                    <Ionicons name="heart-outline" size={18} color="#94A3B8" />
                    <Text style={styles.actionText}>{post.likes_count || 0}</Text>
                  </Pressable>
                  <Pressable style={styles.actionBtn} onPress={() => handleShowComments(post.id)}>
                    <Ionicons name="chatbubble-outline" size={18} color="#94A3B8" />
                    <Text style={styles.actionText}>{post.comments_count || 0}</Text>
                  </Pressable>
                </View>

                {/* Comments Section */}
                {showComments === post.id && (
                  <View style={styles.commentsSection}>
                    {comments.map(comment => (
                      <View key={comment.id} style={styles.commentItem}>
                        <Ionicons name="person-circle" size={24} color="#64748B" />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.commentAuthor}>{(comment.user as any)?.name || 'Doctor'}</Text>
                          <Text style={styles.commentContent}>{comment.content}</Text>
                        </View>
                      </View>
                    ))}
                    <View style={styles.commentInput}>
                      <TextInput
                        style={styles.commentTextInput}
                        value={newComment}
                        onChangeText={setNewComment}
                        placeholder="Add a comment..."
                        placeholderTextColor="#64748B"
                        onSubmitEditing={handleAddComment}
                      />
                      <Pressable onPress={handleAddComment}>
                        <Ionicons name="send" size={20} color="#38BDF8" />
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            ))
        )}
      </ScrollView>

      {/* New Post Modal */}
      <Modal visible={showNewPost} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Post</Text>
            <TextInput
              style={styles.input}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Title..."
              placeholderTextColor="#64748B"
            />
            <TextInput
              style={[styles.input, { minHeight: 80 }]}
              value={newContent}
              onChangeText={setNewContent}
              placeholder="Share your thoughts..."
              placeholderTextColor="#64748B"
              multiline
            />
            <View style={styles.modalBtns}>
              <Pressable style={styles.cancelBtn} onPress={() => setShowNewPost(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveBtn} onPress={handleCreatePost}>
                <Text style={styles.saveText}>Post</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  loadingContainer: { flex: 1, backgroundColor: '#0A0E1A', justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 20, backgroundColor: '#1A1F2E', borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  headerTitle: { flex: 1, color: '#F8FAFC', fontSize: 20, fontWeight: '700', marginLeft: 10 },
  tabs: { flexDirection: 'row', backgroundColor: '#1A1F2E', borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#38BDF8' },
  tabText: { color: '#94A3B8', fontSize: 14, fontWeight: '600' },
  tabTextActive: { color: '#38BDF8' },
  content: { flex: 1 },
  emptyContainer: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700' },
  emptySub: { color: '#94A3B8', fontSize: 14 },
  postCard: { backgroundColor: '#1E293B', marginHorizontal: 16, marginTop: 12, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#334155' },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  avatar: { width: 40, height: 40 },
  postInfo: { flex: 1 },
  postAuthor: { color: '#F8FAFC', fontSize: 14, fontWeight: '600' },
  postTime: { color: '#64748B', fontSize: 11 },
  postTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  postContent: { color: '#E2E8F0', fontSize: 13, lineHeight: 20, marginBottom: 12 },
  postActions: { flexDirection: 'row', gap: 20, borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { color: '#94A3B8', fontSize: 13 },
  commentsSection: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 10 },
  commentItem: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  commentAuthor: { color: '#38BDF8', fontSize: 12, fontWeight: '600' },
  commentContent: { color: '#E2E8F0', fontSize: 12 },
  commentInput: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  commentTextInput: { flex: 1, backgroundColor: '#0F172A', color: '#FFF', padding: 10, borderRadius: 8, fontSize: 12, borderWidth: 1, borderColor: '#334155' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1E293B', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  input: { backgroundColor: '#0F172A', color: '#FFF', padding: 12, borderRadius: 10, fontSize: 14, borderWidth: 1, borderColor: '#334155', marginBottom: 10 },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 10 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#334155', alignItems: 'center' },
  cancelText: { color: '#E2E8F0', fontWeight: '600' },
  saveBtn: { flex: 2, backgroundColor: '#38BDF8', padding: 14, borderRadius: 12, alignItems: 'center' },
  saveText: { color: '#0F172A', fontWeight: '700' },
});
