// 📚 Question Data Service v3 - reads new flat JSON files + lazy loading
const GITHUB_RAW = 'https://raw.githubusercontent.com/almagrahimohned-collab/medtach-content/main';
const QUESTIONS_BASE = `${GITHUB_RAW}/questions`;

export interface QuestionOption { id: string; text: string; isCorrect: boolean; }
export interface Question {
  id: string; specialty: string; subspecialty: string; concept: string;
  cognitive_level: string; difficulty: string; question: string;
  options: QuestionOption[]; explanation: any; trap_type: string; tags: string[];
  media?: { type: string; url: string; description: string };
}
export interface IndexData {
  version: number; total_questions: number; subjects: any;
}

// ✅ Lazy loading cache
const fileCache: Record<string, Question[]> = {};

export async function fetchIndex(): Promise<IndexData | null> {
  try {
    const res = await fetch(`${QUESTIONS_BASE}/index.json`);
    if (res.ok) return await res.json();
  } catch (e) {}
  return null;
}

// ✅ Load single subspecialty file (lazy)
export async function fetchQuestionsFile(specialty: string, subspecialty: string, indexData: IndexData): Promise<Question[]> {
  const cacheKey = `${specialty}/${subspecialty}`;
  if (fileCache[cacheKey]) return fileCache[cacheKey];
  
  try {
    const file = indexData.subjects?.[specialty]?.subspecialties?.[subspecialty]?.file;
    if (!file) return [];
    
    const res = await fetch(`${QUESTIONS_BASE}/${file}`);
    if (res.ok) {
      const questions: Question[] = await res.json();
      fileCache[cacheKey] = questions;
      return questions;
    }
  } catch (e) {}
  return [];
}

// ✅ Filter questions locally (fast - no extra network)
export function filterQuestions(
  questions: Question[],
  difficulty: string,
  concept?: string,
  limit: number = 10
): Question[] {
  let filtered = questions;
  
  if (difficulty && difficulty !== 'all') {
    filtered = filtered.filter(q => q.difficulty === difficulty);
  }
  
  if (concept && concept !== 'all') {
    filtered = filtered.filter(q => 
      q.concept === concept || q.cognitive_level === concept
    );
  }
  
  return filtered.sort(() => Math.random() - 0.5).slice(0, limit);
}

// ✅ Adaptive selection based on weak areas
export function selectAdaptiveQuestions(
  questions: Question[],
  weakConcepts: string[],
  weakTags: string[],
  limit: number = 10
): Question[] {
  const priority: Question[] = [];
  const normal: Question[] = [];
  
  for (const q of questions) {
    const matchesWeak = weakConcepts.some(c => q.concept?.includes(c)) ||
                        weakTags.some(t => q.tags?.includes(t));
    if (matchesWeak) priority.push(q);
    else normal.push(q);
  }
  
  const selected = [
    ...priority.sort(() => Math.random() - 0.5).slice(0, Math.ceil(limit * 0.6)),
    ...normal.sort(() => Math.random() - 0.5).slice(0, Math.ceil(limit * 0.4)),
  ];
  
  return selected.sort(() => Math.random() - 0.5).slice(0, limit);
}

export function clearCache() {
  Object.keys(fileCache).forEach(k => delete fileCache[k]);
}
