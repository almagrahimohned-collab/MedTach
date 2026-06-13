import { supabase } from '../../src/config/supabase';

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  case_id?: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user?: {
    name: string;
    username?: string;
    avatar_url?: string;
    specialty?: string;
  };
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: {
    name: string;
    avatar_url?: string;
  };
}

export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, user:user_id(name, username, avatar_url, specialty)')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data as Post[];
}

export async function createPost(userId: string, title: string, content?: string, caseId?: string) {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: userId,
      title,
      content,
      case_id: caseId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getComments(postId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*, user:user_id(name, avatar_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as Comment[];
}

export async function addComment(postId: string, userId: string, content: string) {
  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, user_id: userId, content })
    .select()
    .single();

  if (error) throw error;
  
  await supabase.rpc('increment_comments', { post_id: postId });
  
  return data;
}

export async function likePost(postId: string) {
  const { error } = await supabase.rpc('increment_likes', { post_id: postId });
  if (error) throw error;
}

export async function updateProfile(userId: string, data: { username?: string; specialty?: string; bio?: string; is_public?: boolean }) {
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId);
  
  if (error) throw error;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) return null;
  return data;
}
