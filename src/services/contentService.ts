import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/almagrahimohned-collab/medtach-content/main';
const CONTENT_CACHE_KEY = 'medtach_content_cache';
const IMAGE_CACHE_DIR = `${FileSystem.cachesDirectory}medtach_images/`;

export interface CaseData {
  id: string;
  specialty: string;
  difficulty: string;
  version?: string;
  title: string;
  department: string;
  patient: { age: number; gender: string; name: string; persona: string };
  chief_complaint: string;
  vitals: Record<string, string>;
  physical_exam: Record<string, string>;
  hidden_data: Record<string, string>;
  media: Record<string, string>;
  correct_diagnosis: string;
  differential_diagnoses: string[];
  key_learning_points: string[];
  patient_responses: Record<string, string>;
  hints: Record<string, string>;
  feedback?: any;
}

export interface IndexData {
  version: string;
  last_updated: string;
  total_cases: number;
  cases_by_specialty: Record<string, Record<string, number>>;
  cases: { id: string; title: string; specialty: string; difficulty: string; path: string }[];
}

class ContentService {
  private baseUrl: string;
  private cachedIndex: IndexData | null = null;

  constructor() {
    this.baseUrl = GITHUB_RAW_BASE;
  }

  async ensureImageDir(): Promise<void> {
    const dirInfo = await FileSystem.getInfoAsync(IMAGE_CACHE_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(IMAGE_CACHE_DIR, { intermediates: true });
    }
  }

  async fetchJson<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}/${path}`;
    console.log('Fetching:', url);
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.status}`);
    }

    const text = await response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error('Empty response');
    }

    return JSON.parse(text);
  }

  async getIndex(): Promise<IndexData> {
    try {
      // إذا كان فيه cached index، استخدمه
      if (this.cachedIndex) {
        return this.cachedIndex;
      }

      const index = await this.fetchJson<IndexData>('index.json');
      
      // إذا الـ cases فاضي، معناها الملف مش متحدث
      if (!index.cases || index.cases.length === 0) {
        console.warn('Index has no cases, trying to rebuild...');
        // نحاول نجيب من الكاش المحلي
        const cached = await AsyncStorage.getItem(CONTENT_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.cases && parsed.cases.length > 0) {
            this.cachedIndex = parsed;
            return parsed;
          }
        }
      }

      // نخزن في الكاش
      await AsyncStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(index));
      this.cachedIndex = index;
      
      return index;
    } catch (e) {
      console.warn('GitHub index fetch failed:', e);
      
      // نحاول نرجع من الكاش المحلي
      const cached = await AsyncStorage.getItem(CONTENT_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.cases && parsed.cases.length > 0) {
          return parsed;
        }
      }

      // لو مفيش حاجة، نرجع empty
      return {
        version: '0.0.0',
        last_updated: '',
        total_cases: 0,
        cases_by_specialty: {},
        cases: []
      };
    }
  }

  async getCase(path: string): Promise<CaseData> {
    return await this.fetchJson<CaseData>(path);
  }

  getLocalCase(specialty: string, difficulty: string): CaseData | null {
    return null;
  }

  async getImageUrl(mediaPath: string): Promise<string> {
    if (!mediaPath) return '';
    await this.ensureImageDir();
    const fileName = mediaPath.replace(/\//g, '_');
    const localPath = `${IMAGE_CACHE_DIR}${fileName}`;
    const localFile = await FileSystem.getInfoAsync(localPath);
    if (localFile.exists) return localPath;
    try {
      const remoteUrl = `${this.baseUrl}/${mediaPath}`;
      await FileSystem.downloadAsync(remoteUrl, localPath);
      return localPath;
    } catch {
      return '';
    }
  }

  clearCache() {
    this.cachedIndex = null;
  }
}

export const contentService = new ContentService();
