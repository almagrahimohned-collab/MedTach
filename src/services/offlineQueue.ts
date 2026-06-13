// 📦 Offline Queue Service - Sync when online, queue when offline
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../config/supabase';

const QUEUE_KEY = 'medtach_sync_queue';

interface QueueItem {
  id: string;
  dataType: 'sr_update' | 'answer_log' | 'quiz_session';
  payload: any;
  createdAt: string;
  attempts: number;
}

// 📥 Add to queue
export async function addToQueue(dataType: QueueItem['dataType'], payload: any): Promise<void> {
  const item: QueueItem = {
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    dataType,
    payload,
    createdAt: new Date().toISOString(),
    attempts: 0,
  };
  
  try {
    const queue = await getQueue();
    queue.push(item);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    
    // Try to sync immediately
    processQueue();
  } catch (e) {
    console.log('Add to queue failed:', e);
  }
}

// 📤 Get queue
async function getQueue(): Promise<QueueItem[]> {
  try {
    const data = await AsyncStorage.getItem(QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// 🔄 Process queue - sync to Supabase
export async function processQueue(): Promise<number> {
  const netState = await NetInfo.fetch();
  if (!netState.isConnected) return 0;
  
  const queue = await getQueue();
  if (queue.length === 0) return 0;
  
  let synced = 0;
  const remaining: QueueItem[] = [];
  
  for (const item of queue) {
    try {
      const success = await syncItem(item);
      if (success) {
        synced++;
        // Also save to Supabase sync_queue for backup
        await supabase.from('sync_queue').insert({
          user_id: item.payload.user_id,
          data_type: item.dataType,
          payload: item.payload,
          synced: true,
        });
      } else {
        item.attempts++;
        if (item.attempts < 5) remaining.push(item);
      }
    } catch {
      item.attempts++;
      if (item.attempts < 5) remaining.push(item);
    }
  }
  
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
  return synced;
}

// 📡 Sync single item
async function syncItem(item: QueueItem): Promise<boolean> {
  switch (item.dataType) {
    case 'sr_update':
      return syncSRUpdate(item.payload);
    case 'answer_log':
      return syncAnswerLog(item.payload);
    case 'quiz_session':
      return syncQuizSession(item.payload);
    default:
      return false;
  }
}

async function syncSRUpdate(payload: any): Promise<boolean> {
  try {
    const { error } = await supabase.from('user_spaced_repetition').upsert({
      user_id: payload.user_id,
      question_id: payload.question_id,
      interval: payload.interval,
      next_review: payload.next_review,
      correct_count: payload.correct_count,
      wrong_count: payload.wrong_count,
      last_reviewed: new Date().toISOString(),
    }, { onConflict: 'user_id, question_id' });
    return !error;
  } catch { return false; }
}

async function syncAnswerLog(payload: any): Promise<boolean> {
  try {
    const { error } = await supabase.from('user_question_progress').insert(payload);
    return !error;
  } catch { return false; }
}

async function syncQuizSession(payload: any): Promise<boolean> {
  try {
    const { error } = await supabase.from('user_quiz_sessions').insert(payload);
    return !error;
  } catch { return false; }
}

// 🧹 Clean old synced items
export async function cleanQueue(): Promise<void> {
  const queue = await getQueue();
  const remaining = queue.filter(item => item.attempts < 5);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
}

// 📊 Get queue stats
export async function getQueueStats(): Promise<{ total: number; pending: number }> {
  const queue = await getQueue();
  return { total: queue.length, pending: queue.length };
}

// 🔄 Setup auto-sync on network change
export function setupAutoSync(): () => void {
  const unsubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected) {
      processQueue().then(count => {
        if (count > 0) console.log(`🔄 Synced ${count} items`);
      });
    }
  });
  return unsubscribe;
}
