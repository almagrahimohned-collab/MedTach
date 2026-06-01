export const calculateCaseScore = (
  isCorrect: boolean,
  testsUsed: number,
  timeTakenSeconds: number,
  isDailyChallenge: boolean = false,
  difficulty: string = 'Beginner'
): { score: number; breakdown: ScoreBreakdown } => {
  let baseScore = 100;

  const testsPenalty = Math.min(testsUsed * 8, 40);
  baseScore -= testsPenalty;

  const timePenalty = Math.floor(timeTakenSeconds / 45) * 4;
  baseScore -= Math.min(timePenalty, 30);

  if (!isCorrect) {
    baseScore = Math.max(0, baseScore - 50);
  }

  const difficultyMultiplier = 
    difficulty === 'Advanced' ? 1.5 :
    difficulty === 'Intermediate' ? 1.2 : 1.0;

  baseScore = Math.round(baseScore * difficultyMultiplier);

  const dailyBonus = isDailyChallenge ? Math.round(baseScore * 0.25) : 0;
  const finalScore = Math.max(0, Math.min(150, baseScore + dailyBonus));

  return {
    score: finalScore,
    breakdown: {
      baseScore: 100,
      testsPenalty: -testsPenalty,
      timePenalty: -timePenalty,
      correctBonus: isCorrect ? 0 : -50,
      difficultyMultiplier,
      dailyBonus,
      finalScore,
    },
  };
};

export interface ScoreBreakdown {
  baseScore: number;
  testsPenalty: number;
  timePenalty: number;
  correctBonus: number;
  difficultyMultiplier: number;
  dailyBonus: number;
  finalScore: number;
}

export const getScoreGrade = (score: number): { grade: string; color: string; emoji: string } => {
  if (score >= 120) return { grade: 'Outstanding', color: '#F59E0B', emoji: '⭐' };
  if (score >= 100) return { grade: 'Excellent', color: '#10B981', emoji: '🏆' };
  if (score >= 80) return { grade: 'Great', color: '#38BDF8', emoji: '👍' };
  if (score >= 60) return { grade: 'Good', color: '#8B5CF6', emoji: '📚' };
  if (score >= 40) return { grade: 'Fair', color: '#F97316', emoji: '💪' };
  return { grade: 'Needs Improvement', color: '#EF4444', emoji: '📖' };
};

export const getTimeString = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
};
