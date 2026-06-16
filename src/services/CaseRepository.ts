// ========== CaseRepository — Single Source of Truth v1.0 ==========
import { supabase } from '../config/supabase';
import { UnifiedCase, CaseFilters, CaseForMode } from './caseTypes';

const GITHUB_BASE = 'https://raw.githubusercontent.com/almagrahimohned-collab/medtach-content/main';

class CaseRepository {
  private cache: Map<string, UnifiedCase> = new Map();

  // ========== 1. جلب حالة واحدة ==========
  async getCase(caseId: string): Promise<UnifiedCase | null> {
    // Check cache first
    if (this.cache.has(caseId)) {
      return this.cache.get(caseId)!;
    }

    try {
      // Try Supabase first
      const { data, error } = await supabase
        .from('unified_cases')
        .select('*')
        .eq('id', caseId)
        .single();

      if (data && !error) {
        const caseData = data.data as UnifiedCase;
        this.cache.set(caseId, caseData);
        return caseData;
      }

      // Fallback to GitHub
      const caseData = await this.getCaseFromGitHub(caseId);
      if (caseData) {
        this.cache.set(caseId, caseData);
        return caseData;
      }
    } catch (e) {
      console.warn('CaseRepository.getCase failed:', e);
    }

    return null;
  }

  // ========== 2. جلب حالات لمود معين ==========
  async getCasesForMode(mode: string, filters?: CaseFilters): Promise<CaseForMode[]> {
    const allCases = await this.getAllCases(filters);
    
    return allCases.map(c => ({
      id: c.id,
      title: c.title,
      specialty: c.specialty,
      difficulty: c.difficulty,
      hasImaging: !!(c.imaging && Object.keys(c.imaging).length > 0),
      hasLabs: !!(c.labs && Object.keys(c.labs).length > 0),
      hasECG: !!(c.imaging?.ecg),
      hasBoardQuestion: !!c.board_question,
      hasICUScenario: !!c.icu_scenario,
      tags: c.metadata?.tags || [],
    }));
  }

  // ========== 3. جلب كل الحالات ==========
  async getAllCases(filters?: CaseFilters): Promise<UnifiedCase[]> {
    try {
      let query = supabase.from('unified_cases').select('*');

      if (filters?.specialty) {
        query = query.eq('specialty', filters.specialty);
      }
      if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }
      if (filters?.tags?.length) {
        query = query.contains('data->metadata->tags', filters.tags);
      }

      const { data, error } = await query;
      
      if (data && !error) {
        return data.map((d: any) => d.data as UnifiedCase);
      }
    } catch (e) {
      console.warn('CaseRepository.getAllCases failed:', e);
    }

    // Fallback to GitHub
    return this.getAllCasesFromGitHub(filters);
  }

  // ========== 4. جلب حالة عشوائية ==========
  async getRandomCase(filters?: CaseFilters): Promise<UnifiedCase | null> {
    const allCases = await this.getAllCases(filters);
    if (allCases.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * allCases.length);
    return allCases[randomIndex];
  }

  // ========== 5. تحويل حالة لمود معين ==========
  transformForMode(caseData: UnifiedCase, mode: string): any {
    switch (mode) {
      case 'clinical':
        return this.transformForClinical(caseData);
      case 'image':
        return this.transformForImage(caseData);
      case 'board':
        return this.transformForBoard(caseData);
      case 'icu':
        return this.transformForICU(caseData);
      case 'flashcard':
        return this.transformForFlashcard(caseData);
      case 'resident':
        return this.transformForResident(caseData);
      default:
        return caseData;
    }
  }

  // ========== 6. تحويلات المودات ==========
  private transformForClinical(caseData: UnifiedCase) {
    return {
      id: caseData.id,
      patient: caseData.patient,
      clinical: caseData.clinical,
      physical_examination: caseData.physical_examination,
      vitals: caseData.vitals,
      labs: caseData.labs,
      imaging: caseData.imaging,
      diagnosis: caseData.diagnosis,
      unlockable_investigations: caseData.unlockable_investigations,
      patient_responses: caseData.patient_responses,
    };
  }

  private transformForImage(caseData: UnifiedCase) {
    const opts = caseData.board_question?.options?.map(o => o.text) || [];
    const correctIdx = caseData.board_question?.options?.findIndex(
      o => o.id === caseData.board_question?.correct_option
    ) ?? 0;

    return {
      id: caseData.id,
      category: caseData.specialty,
      imageUrl: caseData.imaging?.cxr?.file || caseData.imaging?.ct_chest?.file || '',
      description: caseData.imaging?.cxr?.findings || caseData.imaging?.ct_chest?.findings || '',
      question: caseData.board_question?.question || 'What is the most likely diagnosis?',
      options: opts,
      correctIndex: correctIdx,
      explanation: caseData.board_question?.explanation?.why_correct || '',
      pearl: caseData.board_question?.explanation?.clinical_pearl || '',
      difficulty: caseData.difficulty,
      modality: Object.keys(caseData.imaging || {})[0] || 'cxr',
      region: 'chest',
    };
  }

  private transformForBoard(caseData: UnifiedCase) {
    if (!caseData.board_question) return null;
    
    // Merge board_question.explanation with explanation_quality
    const eq = caseData.explanation_quality;
    
    return {
      id: caseData.id,
      specialty: caseData.specialty,
      topic: caseData.specialty,
      difficulty: caseData.difficulty,
      vignette: caseData.board_question.vignette,
      options: caseData.board_question.options,
      correctOptionId: caseData.board_question.correct_option,
      explanation: {
        whyCorrect: eq?.why_correct || caseData.board_question.explanation.why_correct,
        whyWrong: eq?.why_wrong || caseData.board_question.explanation.why_wrong,
        clinicalPearl: eq?.clinical_pearl || caseData.board_question.explanation.clinical_pearl,
        pitfalls: eq?.pitfalls || caseData.pitfalls || [],
        guidelineReferences: eq?.guideline_references || [],
      },
      references: caseData.references?.map(r => r.source) || [],
      highYield: true,
    };
  }

  private transformForICU(caseData: UnifiedCase) {
    return {
      id: caseData.id,
      title: caseData.title,
      patient: {
        name: `Patient ${caseData.patient.age}${caseData.patient.gender === 'male' ? 'M' : 'F'}`,
        age: caseData.patient.age,
        gender: caseData.patient.gender,
        weight: 70,
      },
      diagnosis: caseData.diagnosis.primary,
      description: caseData.clinical.chief_complaint,
      difficulty: caseData.difficulty === 'beginner' ? 'Easy' : caseData.difficulty === 'intermediate' ? 'Medium' : 'Hard',
      durationMinutes: caseData.icu_scenario?.duration_minutes || 360,
      initialStatus: caseData.icu_scenario?.initial_status || 'critical',
      initialVitals: {
        hr: caseData.vitals.hr,
        bp: { systolic: caseData.vitals.bp_systolic, diastolic: caseData.vitals.bp_diastolic },
        spo2: caseData.vitals.spo2,
        rr: caseData.vitals.rr,
        temp: caseData.vitals.temp,
        lactate: caseData.labs?.abg?.lactate || 1.5,
        urineOutput: 30,
      },
      goals: caseData.icu_scenario?.goals || [],
      winConditions: caseData.icu_scenario?.win_conditions || {},
      loseConditions: caseData.icu_scenario?.lose_conditions || {},
    };
  }

  private transformForFlashcard(caseData: UnifiedCase) {
    return {
      id: caseData.id,
      front: caseData.title,
      back: caseData.diagnosis.primary,
      specialty: caseData.specialty,
      teachingPoints: caseData.education?.teaching_points || [],
      clinicalPearls: caseData.education?.clinical_pearls || [],
    };
  }

  private transformForResident(caseData: UnifiedCase) {
    return {
      id: caseData.id,
      name: `Patient ${caseData.patient.age}${caseData.patient.gender === 'male' ? 'M' : 'F'}`,
      age: caseData.patient.age,
      gender: caseData.patient.gender,
      complaint: caseData.clinical.chief_complaint,
      diagnosis: caseData.diagnosis.primary,
      pearl: caseData.education?.resident_tip || '',
      tags: caseData.metadata?.tags || [],
    };
  }

  // ========== 7. إضافة/تحديث حالة ==========
  async upsertCase(caseData: UnifiedCase): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('unified_cases')
        .upsert({
          id: caseData.id,
          title: caseData.title,
          specialty: caseData.specialty,
          difficulty: caseData.difficulty,
          version: caseData.version || '1.0.0',
          data: caseData,
          updated_at: new Date().toISOString(),
        });

      if (!error) {
        this.cache.set(caseData.id, caseData);
        return true;
      }
    } catch (e) {
      console.error('CaseRepository.upsertCase failed:', e);
    }
    return false;
  }

  // ========== 8. حذف حالة ==========
  async deleteCase(caseId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('unified_cases')
        .delete()
        .eq('id', caseId);

      if (!error) {
        this.cache.delete(caseId);
        return true;
      }
    } catch (e) {
      console.error('CaseRepository.deleteCase failed:', e);
    }
    return false;
  }

  // ========== Private Helpers ==========
  private async getCaseFromGitHub(caseId: string): Promise<UnifiedCase | null> {
    try {
      const index = await fetch(`${GITHUB_BASE}/index.json`).then(r => r.json());
      const entry = index.cases?.find((c: any) => c.id === caseId);
      if (entry?.path) {
        return await fetch(`${GITHUB_BASE}/${entry.path}`).then(r => r.json());
      }
    } catch (e) {
      console.warn('GitHub fallback failed:', e);
    }
    return null;
  }

  private async getAllCasesFromGitHub(filters?: CaseFilters): Promise<UnifiedCase[]> {
    try {
      const index = await fetch(`${GITHUB_BASE}/index.json`).then(r => r.json());
      const allCases = await Promise.all(
        (index.cases || []).slice(0, 50).map(async (entry: any) => {
          try {
            return await fetch(`${GITHUB_BASE}/${entry.path}`).then(r => r.json());
          } catch {
            return null;
          }
        })
      );
      return allCases.filter(Boolean);
    } catch {
      return [];
    }
  }


  // ========== 9. Get normal image for modality ==========
  async getNormalImage(modality: string): Promise<{ file: string; findings: string } | null> {
    try {
      const normalCategories: Record<string, string> = {
        'cxr': 'normal',
        'xray': 'normal',
        'ct_chest': 'chest_normal',
        'ct_abdomen': 'abdomen_normal',
        'ct_head': 'brain_normal',
        'ecg': 'normal_ecg',
        'echo': 'normal_echo',
        'ultrasound': 'normal_abdomen',
        'ultrasound_abdomen': 'normal_abdomen',
        'ultrasound_pelvic': 'pelvic_normal',
        'ultrasound_breast': 'breast_normal',
        'mri': 'brain_normal',
      };

      const category = normalCategories[modality] || 'normal';
      
      const { data, error } = await supabase
        .from('imaging_library')
        .select('image_url, diagnosis')
        .eq('modality', modality)
        .eq('category', category)
        .limit(1)
        .single();

      if (data && !error) {
        return {
          file: data.image_url,
          findings: data.diagnosis || 'Normal study',
        };
      }
    } catch (e) {
      console.warn('CaseRepository.getNormalImage failed:', e);
    }
    return null;
  }

  // ========== 10. Resolve investigation — 3 levels ==========
  resolveInvestigation(
    caseData: UnifiedCase | null,
    investigationId: string,
    investigationType: 'lab' | 'imaging' | 'ecg'
  ): {
    level: 'case_specific' | 'not_yet_unlocked' | 'not_indicated';
    result: string | null;
    file?: string;
  } {
    // Level 1: Investigation exists in case → return actual result
    if (caseData) {
      // Check labs
      if (investigationType === 'lab' && caseData.labs) {
        const labData = (caseData.labs as any)[investigationId];
        if (labData) {
          if (typeof labData === 'object') {
            const parts = Object.entries(labData)
              .filter(([_, v]) => v !== null && v !== undefined)
              .map(([k, v]) => `${k}: ${v}`);
            return { level: 'case_specific', result: parts.join(', ') || 'See details' };
          }
          return { level: 'case_specific', result: String(labData) };
        }
      }

      // Check imaging
      if ((investigationType === 'imaging' || investigationType === 'ecg') && caseData.imaging) {
        const imgData = (caseData.imaging as any)[investigationId];
        if (imgData) {
          return {
            level: 'case_specific',
            result: imgData.findings || 'See image',
            file: imgData.file,
          };
        }
      }
    }

    // Level 2: Investigation in unlockable list → not yet unlocked
    if (caseData?.unlockable_investigations?.includes(investigationId)) {
      return { level: 'not_yet_unlocked', result: null };
    }

    // Level 3: Not in case → not indicated
    return { level: 'not_indicated', result: null };
  }


  // ========== 11. Daily Loop ==========
  async getCaseOfDay(weakCompetencies: string[]): Promise<UnifiedCase | null> {
    // Try to find a case matching weak competencies
    const allCases = await this.getAllCases();
    const matching = allCases.filter(c => 
      c.competencies?.some(comp => weakCompetencies.includes(comp))
    );
    
    if (matching.length > 0) {
      return matching[Math.floor(Math.random() * matching.length)];
    }
    
    // Fallback: random case
    return allCases.length > 0 ? allCases[Math.floor(Math.random() * allCases.length)] : null;
  }

  async getImageOfDay(): Promise<{ file: string; findings: string; modality: string } | null> {
    const modalities = ['xray', 'ct', 'ultrasound', 'ecg'];
    const modality = modalities[new Date().getDay() % modalities.length];
    return await this.getNormalImage(modality);
  }

  clearCache() {
    this.cache.clear();
  }
}

export const caseRepository = new CaseRepository();
