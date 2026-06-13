import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

export interface CaseEntry {
  id: string; title: string; specialty: string; difficulty: string; file: string;
}

export interface CaseIndex {
  version: string; lastUpdated: string;
  specialties: Record<string, { beginner?: CaseEntry[]; intermediate?: CaseEntry[]; advanced?: CaseEntry[] }>;
}

export interface MedicalCase {
  id: string; specialty: string; difficulty: string; title: string; department: string;
  patient: { age: number; gender: string; name: string; persona: string };
  chief_complaint: string; vitals?: Record<string, string>;
  physical_exam?: Record<string, string>; hidden_data?: Record<string, string>;
  correct_diagnosis: string; differential_diagnoses: string[];
  key_learning_points: string[]; patient_responses: Record<string, string>;
  hints: Record<string, string>; feedback?: any;
  meta?: { version: string; lastUpdated: string; tags: string[]; estimatedTime: number; images: string[]; labs: string[] };
}

export interface LabReference {
  id: string; test: string; category: string;
  normal_range: string; critical_low?: string; critical_high?: string;
  unit: string; interpretation: string;
}

export interface ImageMetadata {
  id: string; type: 'xray'|'ct'|'mri'|'ecg'|'ultrasound'|'clinical';
  category: string; file: string; description: string; findings?: string; cases: string[];
}

const GITHUB_USER = 'YOUR_GITHUB_USERNAME';
const GITHUB_REPO = 'medtach-content';
const GITHUB_BRANCH = 'main';
const GITHUB_RAW = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;

const FALLBACK_CASE: MedicalCase = {
  id: "fallback", specialty: "cardiology", difficulty: "beginner",
  title: "Sample Case - Acute Chest Pain", department: "Emergency Department",
  patient: { age: 60, gender: "male", name: "Patient", persona: "anxious, in pain" },
  chief_complaint: "Chest pain for 2 hours, pressure-like, radiating to left arm",
  vitals: { BP: "140/90", HR: "88", RR: "18", SpO2: "96%", Temp: "37.2°C" },
  physical_exam: { heart: "Regular rhythm, no murmurs", lungs: "Clear bilaterally" },
  hidden_data: { ecg: "ST elevation in II, III, aVF", troponin: "Elevated", cbc: "WBC 11,000" },
  correct_diagnosis: "Inferior ST-Elevation Myocardial Infarction",
  differential_diagnoses: ["Unstable Angina", "Pericarditis", "Aortic Dissection"],
  key_learning_points: ["Obtain ECG within 10 minutes", "Time is myocardium", "Check right-sided leads"],
  patient_responses: {
    pain_start: "It started about 2 hours ago while sitting at my desk",
    pain_type: "Heavy pressure, like someone sitting on my chest",
    radiation: "Goes up to my left shoulder and down my arm",
    associated: "Nauseous and sweaty",
    breathing: "Hurts more with deep breath",
    prior_history: "High blood pressure and high cholesterol"
  },
  hints: { diagnosis: "Think about ECG pattern", ecg: "Look at inferior leads", troponin: "Cardiac enzymes are key" },
  feedback: { correct_message: "Excellent!", incorrect_message: "This is Inferior STEMI." }
};

const FALLBACK_INDEX: CaseIndex = {
  version: "3.0", lastUpdated: "2026-06-12T00:00:00+02:00",
  specialties: {
    cardiology: {
      beginner: [
        { id: "stable_angina", title: "Stable Angina", specialty: "cardiology", difficulty: "beginner", file: "cardiology/beginner/stable_angina.json" },
        { id: "stemi_anteroseptal", title: "STEMI Anteroseptal", specialty: "cardiology", difficulty: "beginner", file: "cardiology/beginner/stemi_anteroseptal.json" },
        { id: "pericarditis", title: "Pericarditis", specialty: "cardiology", difficulty: "beginner", file: "cardiology/beginner/pericarditis.json" },
        { id: "hypertension_management", title: "Hypertension", specialty: "cardiology", difficulty: "beginner", file: "cardiology/beginner/hypertension_management.json" },
        { id: "dilated_cardiomyopathy", title: "Dilated Cardiomyopathy", specialty: "cardiology", difficulty: "beginner", file: "cardiology/beginner/dilated_cardiomyopathy.json" }
      ],
      intermediate: [
        { id: "atrial_fibrillation", title: "Atrial Fibrillation", specialty: "cardiology", difficulty: "intermediate", file: "cardiology/intermediate/atrial_fibrillation.json" },
        { id: "myocarditis", title: "Myocarditis", specialty: "cardiology", difficulty: "intermediate", file: "cardiology/intermediate/myocarditis.json" }
      ],
      advanced: [
        { id: "heart_failure", title: "Heart Failure", specialty: "cardiology", difficulty: "advanced", file: "cardiology/advanced/heart_failure.json" },
        { id: "aortic_dissection", title: "Aortic Dissection", specialty: "cardiology", difficulty: "advanced", file: "cardiology/advanced/aortic_dissection.json" }
      ]
    }
  }
};

let db: SQLite.SQLiteDatabase | null = null;

async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('medtach_content.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS cases (id TEXT PRIMARY KEY, specialty TEXT, difficulty TEXT, json_data TEXT, downloaded_at INTEGER, last_accessed INTEGER);
    CREATE TABLE IF NOT EXISTS images (id TEXT PRIMARY KEY, file_path TEXT, case_ids TEXT, downloaded INTEGER DEFAULT 0);
    CREATE TABLE IF NOT EXISTS manifest (id INTEGER PRIMARY KEY DEFAULT 1, json_data TEXT, updated_at INTEGER);
  `);
  return db;
}

export class ContentRepository {
  private static instance: ContentRepository;
  private manifestCache: CaseIndex | null = null;

  static getInstance(): ContentRepository {
    if (!ContentRepository.instance) ContentRepository.instance = new ContentRepository();
    return ContentRepository.instance;
  }

  async getManifest(): Promise<CaseIndex> {
    if (this.manifestCache) return this.manifestCache;
    try {
      const response = await fetch(`${GITHUB_RAW}/cases/index.json`);
      if (response.ok) {
        const data = await response.json();
        if (data.specialties && Object.keys(data.specialties).length > 0) {
          this.manifestCache = data;
          return data;
        }
      }
    } catch { console.log('[Repo] GitHub not reachable, using fallback'); }
    return FALLBACK_INDEX;
  }

  async getCaseIndex(): Promise<CaseIndex> {
    return this.getManifest();
  }

  async getCase(caseId: string): Promise<MedicalCase> {
    try {
      const database = await getDatabase();
      const cached = await database.getFirstAsync<{ json_data: string }>('SELECT json_data FROM cases WHERE id = ?', [caseId]);
      if (cached) {
        await database.runAsync('UPDATE cases SET last_accessed = ? WHERE id = ?', [Date.now(), caseId]);
        return JSON.parse(cached.json_data);
      }
    } catch {}

    try {
      const manifest = await this.getManifest();
      let caseFile: string | null = null;
      for (const [specialty, levels] of Object.entries(manifest.specialties)) {
        for (const [level, entries] of Object.entries(levels)) {
          const found = entries?.find((e: CaseEntry) => e.id === caseId);
          if (found) { caseFile = found.file; break; }
        }
        if (caseFile) break;
      }
      if (caseFile) {
        const url = `${GITHUB_RAW}/cases/${caseFile}`;
        const response = await fetch(url);
        if (response.ok) {
          const caseData: MedicalCase = await response.json();
          const database = await getDatabase();
          await database.runAsync(
            'INSERT OR REPLACE INTO cases (id, specialty, difficulty, json_data, downloaded_at, last_accessed) VALUES (?, ?, ?, ?, ?, ?)',
            [caseData.id, caseData.specialty, caseData.difficulty, JSON.stringify(caseData), Date.now(), Date.now()]
          );
          return caseData;
        }
      }
    } catch {}

    console.warn(`[Repo] Using fallback case for: ${caseId}`);
    return { ...FALLBACK_CASE, id: caseId } as MedicalCase;
  }

  async getCasesBySpecialty(specialty: string): Promise<CaseEntry[]> {
    const manifest = await this.getManifest();
    const levels = manifest.specialties[specialty];
    if (!levels) return [];
    const allCases: CaseEntry[] = [];
    for (const [level, entries] of Object.entries(levels)) {
      if (entries) allCases.push(...entries);
    }
    return allCases;
  }

  async getCaseImages(caseId: string): Promise<ImageMetadata[]> {
    try {
      const response = await fetch(`${GITHUB_RAW}/image-library.json`);
      const library = await response.json();
      return library.images?.filter((img: ImageMetadata) => img.cases?.includes(caseId)) || [];
    } catch { return []; }
  }

  async downloadImage(imageId: string): Promise<string> { return ''; }
  async getImageMetadata(imageId: string): Promise<ImageMetadata> { throw new Error('Not implemented'); }
  async getLabsReference(): Promise<Record<string, LabReference[]>> { return {}; }

  async searchCases(query: string): Promise<MedicalCase[]> {
    const database = await getDatabase();
    const results = await database.getAllAsync<{ json_data: string }>(
      'SELECT json_data FROM cases WHERE json_data LIKE ? OR specialty LIKE ?', [`%${query}%`, `%${query}%`]
    );
    return results.map(r => JSON.parse(r.json_data));
  }

  async checkForUpdates(): Promise<boolean> {
    try {
      const response = await fetch(`${GITHUB_RAW}/cases/index.json`);
      const remoteManifest = await response.json();
      const localManifest = await this.getManifest();
      return remoteManifest.lastUpdated !== localManifest.lastUpdated;
    } catch { return false; }
  }

  async clearCache(): Promise<void> {
    const database = await getDatabase();
    await database.execAsync('DELETE FROM cases; DELETE FROM images; DELETE FROM manifest;');
    this.manifestCache = null;
  }

  async getCacheSize(): Promise<number> {
    const database = await getDatabase();
    const result = await database.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM cases');
    return result?.count ?? 0;
  }
}

export default ContentRepository;

// ============================================
// Imaging Library — Supabase Integration
// ============================================

export interface ImagingLibraryItem {
  id: string;
  image_id: string;
  category: string;
  modality: string;
  body_part: string;
  diagnosis: string;
  findings: string;
  problems: string;
  image_url: string;
  source: string;
}

const SUPABASE_URL = 'https://mpegiwdjovzvzqxtgifj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_BPJm4CyR7EaM5fdYB_6NaQ_9Ei4nt2O';

export async function fetchImagesByCategory(category: string, limit: number = 10): Promise<ImagingLibraryItem[]> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/imaging_library?category=eq.${category}&limit=${limit}`;
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch images:', error);
  }
  return [];
}

export async function fetchRandomImages(modality: string = 'xray', limit: number = 10): Promise<ImagingLibraryItem[]> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/imaging_library?modality=eq.${modality}&limit=${limit}&order=random()`;
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch random images:', error);
  }
  return [];
}

export async function fetchImageById(imageId: string): Promise<ImagingLibraryItem | null> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/imaging_library?image_id=eq.${imageId}&limit=1`;
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data[0] || null;
    }
  } catch (error) {
    console.error('Failed to fetch image:', error);
  }
  return null;
}

export async function fetchAllCategories(): Promise<string[]> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/imaging_library?select=category`;
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return [...new Set(data.map((item: any) => item.category))];
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
  return [];
}
