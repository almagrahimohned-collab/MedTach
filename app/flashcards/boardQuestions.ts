import { contentService } from '../../src/services/contentService';

export interface BoardQuestion {
  id: string; specialty: string; topic: string; difficulty: 'easy' | 'medium' | 'hard';
  vignette: string; options: { id: string; text: string }[]; correctOptionId: string;
  explanation: { whyCorrect: string; whyWrong: Record<string, string>; clinicalPearl: string; };
  references: string[]; highYield: boolean; imageUrl?: string; timeAllocated: number;
}

export let BOARD_QUESTIONS: BoardQuestion[] = [];

const BASE = 'https://raw.githubusercontent.com/almagrahimohned-collab/medtach-content/main/board-questions';
const FILES = ['cardiology','pulmonology','neurology','endocrinology','gastroenterology','nephrology','hematology','infectious','pharmacology','clinical_pearls','genetics'];

// ========== NEW: Load from unified cases ==========
async function loadFromUnifiedCases(): Promise<BoardQuestion[]> {
  try {
    const cases = await contentService.getCasesForMode('board', { hasBoardQuestion: true });
    const questions: BoardQuestion[] = [];
    
    for (const c of cases) {
      if (!c.hasBoardQuestion) continue;
      const fullCase = await contentService.getUnifiedCase(c.id);
      if (!fullCase?.board_question) continue;
      
      const bq = fullCase.board_question;
      questions.push({
        id: fullCase.id,
        specialty: fullCase.specialty,
        topic: fullCase.specialty,
        difficulty: fullCase.difficulty as 'easy' | 'medium' | 'hard',
        vignette: bq.vignette,
        options: bq.options,
        correctOptionId: bq.correct_option,
        explanation: {
          whyCorrect: bq.explanation.why_correct,
          whyWrong: bq.explanation.why_wrong,
          clinicalPearl: bq.explanation.clinical_pearl,
        },
        references: [],
        highYield: true,
        timeAllocated: 90,
      });
    }
    
    if (questions.length > 0) {
      console.log(`✅ Loaded ${questions.length} board questions from unified cases`);
      return questions;
    }
  } catch (e) {
    console.warn('Failed to load from unified cases:', e);
  }
  return [];
}

// ========== OLD: Load from GitHub JSON files ==========
async function loadFromGitHub(): Promise<BoardQuestion[]> {
  const all: BoardQuestion[] = [];
  for (const f of FILES) {
    try {
      const res = await fetch(`${BASE}/${f}.json`);
      const data = await res.json();
      if (Array.isArray(data)) { all.push(...data); console.log('✅ ' + f + ': ' + data.length); }
    } catch(e: any) { console.log('❌ ' + f); }
  }
  return all;
}

// ========== Main loader: Unified first, then GitHub ==========
export async function loadBoardQuestions(): Promise<BoardQuestion[]> {
  if (BOARD_QUESTIONS.length > 0) return BOARD_QUESTIONS;

  // Try unified cases first
  const unifiedQuestions = await loadFromUnifiedCases();
  if (unifiedQuestions.length > 0) {
    BOARD_QUESTIONS = unifiedQuestions;
    return BOARD_QUESTIONS;
  }

  // Fallback to GitHub
  console.log('⚠️ No unified cases, loading from GitHub...');
  const ghQuestions = await loadFromGitHub();
  console.log('TOTAL: ' + ghQuestions.length);
  BOARD_QUESTIONS = ghQuestions;
  return BOARD_QUESTIONS;
}

export function getTotalLoadedQuestions(): number { return BOARD_QUESTIONS.length; }

export function getMockBoardExam(n: number = 40, a: number = 0): BoardQuestion[] {
  if (BOARD_QUESTIONS.length === 0) return [];
  const available = Math.min(n, BOARD_QUESTIONS.length);
  return [...BOARD_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, available);
}

export function getBoardQuestions(s?: string, d?: string): BoardQuestion[] {
  let q = BOARD_QUESTIONS;
  if (s) q = q.filter(x => x.specialty === s);
  if (d) q = q.filter(x => x.difficulty === d);
  return [...q].sort(() => Math.random() - 0.5);
}

export function getExamStats(n: number = 40) {
  const t = BOARD_QUESTIONS.length;
  return { totalQuestions: t, totalBlocks: Math.floor(t/n), questionsPerBlock: n, uniqueExamsBeforeRepeat: Math.floor(t/n) };
}

export function getSpecialtyDistribution(q: BoardQuestion[]): Record<string, number> {
  const d: Record<string, number> = {};
  q.forEach(x => { d[x.specialty] = (d[x.specialty] || 0) + 1; });
  return d;
}
