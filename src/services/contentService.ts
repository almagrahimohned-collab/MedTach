import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { caseRepository } from './CaseRepository';
import { UnifiedCase } from './caseTypes';

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/almagrahimohned-collab/medtach-content/main';
const CONTENT_CACHE_KEY = 'medtach_content_cache';
const IMAGE_CACHE_DIR = `${FileSystem.cachesDirectory}medtach_images/`;

// ========== Old CaseData (for backward compatibility) ==========
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
      if (this.cachedIndex) {
        return this.cachedIndex;
      }

      const index = await this.fetchJson<IndexData>('index.json');

      if (!index.cases || index.cases.length === 0) {
        console.warn('Index has no cases, trying to rebuild...');
        const cached = await AsyncStorage.getItem(CONTENT_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.cases && parsed.cases.length > 0) {
            this.cachedIndex = parsed;
            return parsed;
          }
        }
      }

      await AsyncStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(index));
      this.cachedIndex = index;
      return index;
    } catch (e) {
      console.warn('GitHub index fetch failed:', e);

      const cached = await AsyncStorage.getItem(CONTENT_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.cases && parsed.cases.length > 0) {
          return parsed;
        }
      }

      return {
        version: '0.0.0',
        last_updated: '',
        total_cases: 0,
        cases_by_specialty: {},
        cases: []
      };
    }
  }

  // ========== Old API (backward compatible) ==========
  async getCase(path: string): Promise<CaseData> {
    return await this.fetchJson<CaseData>(path);
  }

  // ========== NEW: Get unified case by ID ==========
  async getUnifiedCase(caseId: string): Promise<UnifiedCase | null> {
    return await caseRepository.getCase(caseId);
  }

  // ========== NEW: Get unified cases for a mode ==========
  async getCasesForMode(mode: string, filters?: any): Promise<any[]> {
    return await caseRepository.getCasesForMode(mode, filters);
  }

  // ========== NEW: Get random unified case ==========
  async getRandomUnifiedCase(filters?: any): Promise<UnifiedCase | null> {
    return await caseRepository.getRandomCase(filters);
  }

  // ========== NEW: Transform unified case to old format (bridge) ==========
  unifiedToLegacy(caseData: UnifiedCase): CaseData {
    return {
      id: caseData.id,
      specialty: caseData.specialty,
      difficulty: caseData.difficulty,
      version: caseData.version,
      title: caseData.title,
      department: (caseData.tags?.[0] || caseData.metadata?.tags?.[0] || 'General'),
      patient: {
        age: caseData.patient.age,
        gender: caseData.patient.gender,
        name: `Patient ${caseData.patient.age}${caseData.patient.gender === 'male' ? 'M' : 'F'}`,
        persona: 'neutral',
      },
      chief_complaint: caseData.clinical.chief_complaint,
      vitals: {
        bp: `${caseData.vitals.bp_systolic}/${caseData.vitals.bp_diastolic} mmHg`,
        hr: String(caseData.vitals.hr),
        rr: String(caseData.vitals.rr),
        spo2: `${caseData.vitals.spo2}%`,
        temp: `${caseData.vitals.temp}°C`,
      },
      physical_exam: {
        chest: caseData.physical_examination?.chest || '',
        general: caseData.physical_examination?.general || '',
        cardiac: caseData.physical_examination?.cardiac || '',
        abdominal: caseData.physical_examination?.abdominal || '',
      },
      hidden_data: this.extractHiddenData(caseData),
      media: this.extractMedia(caseData),
      correct_diagnosis: caseData.diagnosis.primary,
      differential_diagnoses: caseData.diagnosis.differentials,
      key_learning_points: [...(caseData.education?.teaching_points || []), ...(caseData.learning_objectives || []), ...(caseData.clinical_pearls || [])],
      patient_responses: caseData.patient_responses || {},
      hints: {},
    };
  }

  private extractHiddenData(caseData: UnifiedCase): Record<string, string> {
    const result: Record<string, string> = {};

    if (caseData.labs?.cbc) {
      result['cbc'] = `WBC: ${caseData.labs.cbc.wbc}, Hb: ${caseData.labs.cbc.hb}, PLT: ${caseData.labs.cbc.plt}`;
    }
    if (caseData.labs?.crp !== undefined) {
      result['crp'] = `CRP: ${caseData.labs.crp} mg/L`;
    }
    if (caseData.labs?.abg) {
      result['abg'] = `pH: ${caseData.labs.abg.ph}, PaO2: ${caseData.labs.abg.pao2}, PaCO2: ${caseData.labs.abg.paco2}, HCO3: ${caseData.labs.abg.hco3}, Lactate: ${caseData.labs.abg.lactate}`;
    }
    if (caseData.imaging?.cxr) {
      result['cxr'] = caseData.imaging.cxr.findings;
    }

    return result;
  }

  private extractMedia(caseData: UnifiedCase): Record<string, string> {
    const result: Record<string, string> = {};

    if (caseData.imaging?.cxr?.file) {
      result['cxr'] = caseData.imaging.cxr.file;
    }
    if (caseData.imaging?.ecg?.file) {
      result['ecg'] = caseData.imaging.ecg.file;
    }

    return result;
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
    caseRepository.clearCache();
  }
}

export const contentService = new ContentService();
