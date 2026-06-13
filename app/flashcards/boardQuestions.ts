export interface BoardQuestion {
  id: string; specialty: string; topic: string; difficulty: 'easy' | 'medium' | 'hard';
  vignette: string; options: { id: string; text: string }[]; correctOptionId: string;
  explanation: { whyCorrect: string; whyWrong: Record<string, string>; clinicalPearl: string; };
  references: string[]; highYield: boolean; imageUrl?: string; timeAllocated: number;
}

export let BOARD_QUESTIONS: BoardQuestion[] = [];

const BASE = 'https://raw.githubusercontent.com/almagrahimohned-collab/medtach-content/main/board-questions';
const FILES = ['cardiology','pulmonology','neurology','endocrinology','gastroenterology','nephrology','hematology','infectious','pharmacology','clinical_pearls','genetics'];

export async function loadBoardQuestions(): Promise<BoardQuestion[]> {
  if (BOARD_QUESTIONS.length > 0) return BOARD_QUESTIONS;
  const all: BoardQuestion[] = [];
  for (const f of FILES) {
    try {
      const res = await fetch(`${BASE}/${f}.json`);
      const data = await res.json();
      if (Array.isArray(data)) { all.push(...data); console.log('✅ ' + f + ': ' + data.length); }
    } catch(e: any) { console.log('❌ ' + f); }
  }
  console.log('TOTAL: ' + all.length);
  BOARD_QUESTIONS = all;
  return all;
}

export function getTotalLoadedQuestions(): number { return BOARD_QUESTIONS.length; }

export function getMockBoardExam(n: number = 40, a: number = 0): BoardQuestion[] {
  if (BOARD_QUESTIONS.length === 0) return [];
  // لو العدد المطلوب أكبر من المتاح، ناخد كل المتاح
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
