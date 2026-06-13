export interface Flashcard {
  id: string;
  deck: string;
  front: string;
  back: string;
  type: 'basic' | 'cloze' | 'image' | 'mcq' | 'boss';
  options?: string[];
  correctOption?: string;
  imageUrl?: string;
  tags: string[];
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReview: number;
  lastReview: number;
  createdAt: number;
  // 🎨 Visual enhancements
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  medicalTitle?: string;
  deckIcon?: string;
  deckColor?: string;
  source?: 'case' | 'question' | 'manual'; // 🆕 Track source
}

// 🎮 Boss Card interface
export interface BossCard {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  difficulty: 'hard' | 'expert';
  timeLimit: number; // seconds
}

export function createCard(
  deck: string,
  front: string,
  back: string,
  type: 'basic' | 'cloze' | 'image' | 'mcq' | 'boss' = 'basic',
  tags: string[] = [],
  options?: string[],
  correctOption?: string,
  imageUrl?: string,
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert',
  medicalTitle?: string,
  source?: 'case' | 'question' | 'manual'
): Flashcard {
  return {
    id: Date.now().toString() + Math.random().toString(36).slice(2, 11),
    deck,
    front,
    back,
    type,
    options,
    correctOption,
    imageUrl,
    tags,
    interval: 0,
    repetitions: 0,
    easeFactor: 2.5,
    nextReview: Date.now(),
    lastReview: 0,
    createdAt: Date.now(),
    difficulty,
    medicalTitle,
    source,
  };
}

export function reviewCard(card: Flashcard, quality: 0 | 1 | 2 | 3 | 4 | 5): Flashcard {
  const now = Date.now();
  let { interval, repetitions, easeFactor } = card;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  const nextReview = now + interval * 24 * 60 * 60 * 1000;

  return {
    ...card,
    interval,
    repetitions,
    easeFactor,
    nextReview,
    lastReview: now,
  };
}

export function getDueCards(cards: Flashcard[]): Flashcard[] {
  const now = Date.now();
  return cards
    .filter(card => card.nextReview <= now)
    .sort((a, b) => a.nextReview - b.nextReview);
}

export function getNewCards(cards: Flashcard[]): Flashcard[] {
  return cards.filter(card => card.repetitions === 0 && card.lastReview === 0);
}

export function getCardStats(cards: Flashcard[]) {
  const now = Date.now();
  const mastered = cards.filter(c => c.repetitions >= 3).length;
  const learning = cards.filter(c => c.repetitions > 0 && c.repetitions < 3).length;
  const newCards = cards.filter(c => c.repetitions === 0).length;
  const due = cards.filter(c => c.nextReview <= now).length;
  return { mastered, learning, newCards, due, total: cards.length };
}

export const DEFAULT_DECKS = [
  { id: 'your_cards', name: 'Your Cards', icon: 'bookmark', emoji: '📚', color: '#38BDF8', isUserDeck: true },
  { id: 'cardiology', name: 'Cardiology', icon: 'heart', emoji: '🫀', color: '#EF4444' },
  { id: 'pulmonology', name: 'Pulmonology', icon: 'leaf', emoji: '🫁', color: '#3B82F6' },
  { id: 'neurology', name: 'Neurology', icon: 'brain', emoji: '🧠', color: '#8B5CF6' },
  { id: 'endocrinology', name: 'Endocrinology', icon: 'flask', emoji: '🔬', color: '#F59E0B' },
  { id: 'gastroenterology', name: 'Gastroenterology', icon: 'restaurant', emoji: '🍽️', color: '#10B981' },
  { id: 'nephrology', name: 'Nephrology', icon: 'water-outline', emoji: '🩻', color: '#06B6D4' },
  { id: 'hematology', name: 'Hematology', icon: 'color-filter-outline', emoji: '🩸', color: '#DC2626' },
  { id: 'infectious', name: 'Infectious Disease', icon: 'bug', emoji: '🦠', color: '#F97316' },
  { id: 'pharmacology', name: 'Pharmacology', icon: 'medkit', emoji: '💊', color: '#EC4899' },
  { id: 'quick_review', name: 'Clinical Pearls', icon: 'flash', emoji: '⚡', color: '#8B5CF6' },
];
