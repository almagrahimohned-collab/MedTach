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
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${path}: ${response.status}`);
    return await response.json();
  }

  async getIndex(): Promise<IndexData> {
    try {
      return await this.fetchJson<IndexData>('index.json');
    } catch (e) {
      console.warn('GitHub index fetch failed, using empty index');
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
    // هذا يرجع null لأنه ما عاد نعتمد على الحالات المحلية
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
}

export const contentService = new ContentService();
