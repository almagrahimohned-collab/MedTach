export interface BadgeCheckResult {
  earned: boolean;
  badge: string;
  reason: string;
}

export const checkBadges = (
  completedCases: any[],
  addBadge: (b: string) => void,
  totalPoints: number = 0,
  accuracy: number = 0,
  specialtiesCount: number = 0,
  currentTimeSeconds: number = 0
): BadgeCheckResult[] => {
  const results: BadgeCheckResult[] = [];
  const today = new Date().toISOString().split('T')[0];

  const todayCases = completedCases.filter(
    (c) => c.date?.startsWith(today)
  );

  const checkAndAward = (condition: boolean, badge: string, reason: string) => {
    if (condition) {
      addBadge(badge);
      results.push({ earned: true, badge, reason });
    } else {
      results.push({ earned: false, badge, reason });
    }
  };

  checkAndAward(
    completedCases.length >= 1,
    '🩺 First Diagnosis',
    'Complete your first case'
  );

  checkAndAward(
    completedCases.length >= 10,
    '🏆 Diagnostic Expert',
    'Complete 10 cases'
  );

  checkAndAward(
    completedCases.length >= 25,
    '👨‍⚕️ Master Clinician',
    'Complete 25 cases'
  );

  checkAndAward(
    completedCases.length >= 50,
    '🧠 Medical Genius',
    'Complete 50 cases'
  );

  checkAndAward(
    totalPoints >= 5000,
    '⭐ Rising Star',
    'Earn 5,000 total points'
  );

  checkAndAward(
    totalPoints >= 15000,
    '💎 Diamond Doctor',
    'Earn 15,000 total points'
  );

  checkAndAward(
    todayCases.length >= 5,
    '🔥 Daily Streak',
    'Complete 5 cases in one day'
  );

  checkAndAward(
    todayCases.length >= 10,
    '⚡ Marathon Runner',
    'Complete 10 cases in one day'
  );

  checkAndAward(
    accuracy >= 90 && completedCases.length >= 5,
    '🎯 Sharp Shooter',
    'Maintain 90%+ accuracy over 5 cases'
  );

  checkAndAward(
    accuracy >= 95 && completedCases.length >= 10,
    '🔍 Diagnostic Perfectionist',
    'Maintain 95%+ accuracy over 10 cases'
  );

  checkAndAward(
    currentTimeSeconds <= 120 && completedCases.length >= 1,
    '⚡ Speed Diagnostician',
    'Complete a case in under 2 minutes'
  );

  checkAndAward(
    specialtiesCount >= 3,
    '🌐 Versatile Doctor',
    'Diagnose cases in 3 different specialties'
  );

  checkAndAward(
    specialtiesCount >= 5,
    '🏥 Multidisciplinary Expert',
    'Diagnose cases in 5 different specialties'
  );

  checkAndAward(
    completedCases.length >= 100,
    '👑 Legendary Diagnostician',
    'Complete 100 cases'
  );

  return results;
};
