import { contentService } from '../../src/services/contentService';

export interface ImageQuestion {
  id: string;
  category: string;
  imageUrl: string;
  description: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  pearl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  modality?: string;
  region?: string;
}

const SUPABASE_URL = 'https://mpegiwdjovzvzqxtgifj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_BPJm4CyR7EaM5fdYB_6NaQ_9Ei4nt2O';

// ========== NEW: Fetch from unified cases ==========
async function fetchFromUnifiedCases(category?: string): Promise<ImageQuestion[]> {
  try {
    const cases = await contentService.getCasesForMode('image', {
      hasImaging: true,
      ...(category ? { specialty: category } : {}),
    });

    const questions: ImageQuestion[] = [];
    
    for (const c of cases) {
      if (!c.hasImaging) continue;
      
      // Get full case data
      const fullCase = await contentService.getUnifiedCase(c.id);
      if (!fullCase) continue;

      // Use CaseRepository transform
      const { caseRepository } = require('../../src/services/CaseRepository');
      const imageData = caseRepository.transformForMode(fullCase, 'image');
      
      if (imageData && imageData.imageUrl) {
        questions.push(imageData);
      }
    }

    return questions;
  } catch (e) {
    console.warn('Failed to fetch from unified cases:', e);
    return [];
  }
}

// ========== OLD: Fetch from imaging_library (kept for backward compatibility) ==========
async function fetchFromImagingLibrary(category?: string): Promise<ImageQuestion[]> {
  try {
    let url = `${SUPABASE_URL}/rest/v1/imaging_library?limit=100`;
    if (category) url += `&category=eq.${category}`;

    const resp = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });

    const items = await resp.json();

    return items.map((item: any) => {
      const allCategories = ['pneumonia', 'pleural_effusion', 'pneumothorax', 'cardiomegaly', 'atelectasis', 'normal_chest'];
      const correctCat = item.category;
      const otherCats = allCategories.filter(c => c !== correctCat).sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [correctCat, ...otherCats].sort(() => Math.random() - 0.5);
      const correctIndex = options.indexOf(correctCat);

      return {
        id: item.image_id,
        category: item.category,
        imageUrl: item.image_url,
        description: item.diagnosis?.substring(0, 100) || '',
        question: 'What is the most likely diagnosis?',
        options: options.map(o => o.replace(/_/g, ' ')),
        correctIndex,
        explanation: item.diagnosis || '',
        pearl: item.problems || '',
        difficulty: 'medium' as const,
        modality: item.modality,
        region: item.body_part,
      };
    });
  } catch (e) {
    console.warn('Failed to fetch from imaging library:', e);
    return [];
  }
}

// ========== Main fetch: Unified cases FIRST, then imaging library ==========
export async function fetchQuestions(category?: string): Promise<ImageQuestion[]> {
  // Try unified cases first
  const unifiedQuestions = await fetchFromUnifiedCases(category);
  if (unifiedQuestions.length > 0) {
    console.log(`✅ Loaded ${unifiedQuestions.length} questions from unified cases`);
    return unifiedQuestions;
  }

  // Fallback to imaging library
  console.log('⚠️ No unified cases, falling back to imaging library');
  return await fetchFromImagingLibrary(category);
}

export const IMAGE_QUESTIONS: ImageQuestion[] = [];
