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
  file?: string;
}

const GITHUB_RAW = 'https://raw.githubusercontent.com/almagrahimohned-collab/medtach-content/main';
const LIBRARY_INDEX = `${GITHUB_RAW}/image-library.json`;

let cachedQuestions: ImageQuestion[] | null = null;

export async function fetchQuestions(): Promise<ImageQuestion[]> {
  if (cachedQuestions) return cachedQuestions;
  
  try {
    const response = await fetch(LIBRARY_INDEX);
    const data = await response.json();
    
    const questions: ImageQuestion[] = [];
    const categories = data?.library?.categories || [];
    
    for (const category of categories) {
      for (const image of category.images || []) {
        questions.push({
          ...image,
          imageUrl: `${GITHUB_RAW}/${image.file}`,
          category: category.modality || category.id,
          modality: category.modality,
          region: category.region,
        });
      }
    }
    
    cachedQuestions = questions;
    return questions;
  } catch (error) {
    console.error('Failed to fetch image library:', error);
    return [];
  }
}

export function clearCache() {
  cachedQuestions = null;
}

// أسئلة فاضية مؤقتاً - التطبيق يستخدم fetchQuestions()
export const IMAGE_QUESTIONS: ImageQuestion[] = [];
