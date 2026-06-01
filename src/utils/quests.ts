export interface Quest {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  reward: number;
  type: 'daily' | 'weekly';
  icon: string;
  completed: boolean;
  claimed: boolean;
}

export const generateDailyQuests = (
  completedCases: any[],
  totalPoints: number,
  todayCases: any[]
): Quest[] => {
  const today = new Date().toISOString().split('T')[0];
  const todayDate = today;

  return [
    {
      id: `daily_diagnose_${todayDate}`,
      title: 'Daily Diagnostician',
      description: 'Complete 3 diagnostic cases today',
      target: 3,
      progress: Math.min(todayCases.length, 3),
      reward: 50,
      type: 'daily',
      icon: 'medkit',
      completed: todayCases.length >= 3,
      claimed: false,
    },
    {
      id: `daily_perfect_${todayDate}`,
      title: 'Perfect Score',
      description: 'Get a score of 100+ on any case today',
      target: 1,
      progress: todayCases.some(c => c.score >= 100) ? 1 : 0,
      reward: 75,
      type: 'daily',
      icon: 'star',
      completed: todayCases.some(c => c.score >= 100),
      claimed: false,
    },
    {
      id: `daily_points_${todayDate}`,
      title: 'Point Collector',
      description: 'Earn 200 points today',
      target: 200,
      progress: Math.min(
        todayCases.reduce((sum, c) => sum + c.score, 0),
        200
      ),
      reward: 40,
      type: 'daily',
      icon: 'trophy',
      completed: todayCases.reduce((sum, c) => sum + c.score, 0) >= 200,
      claimed: false,
    },
  ];
};

export const generateWeeklyQuests = (
  completedCases: any[],
  totalPoints: number,
  uniqueSpecialties: number
): Quest[] => {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekCases = completedCases.filter(
    c => new Date(c.date) >= weekStart
  );

  return [
    {
      id: `weekly_cases_${weekStart.toISOString().split('T')[0]}`,
      title: 'Weekly Warrior',
      description: 'Complete 15 cases this week',
      target: 15,
      progress: Math.min(weekCases.length, 15),
      reward: 200,
      type: 'weekly',
      icon: 'flame',
      completed: weekCases.length >= 15,
      claimed: false,
    },
    {
      id: `weekly_specialties_${weekStart.toISOString().split('T')[0]}`,
      title: 'Diverse Doctor',
      description: 'Diagnose cases in 3 different specialties',
      target: 3,
      progress: Math.min(uniqueSpecialties, 3),
      reward: 150,
      type: 'weekly',
      icon: 'git-network',
      completed: uniqueSpecialties >= 3,
      claimed: false,
    },
    {
      id: `weekly_accuracy_${weekStart.toISOString().split('T')[0]}`,
      title: 'Precision Master',
      description: 'Maintain 85%+ accuracy on all cases this week',
      target: 85,
      progress: weekCases.length > 0
        ? Math.min(
            Math.round(
              weekCases.reduce((sum, c) => sum + c.score, 0) / weekCases.length
            ),
            85
          )
        : 0,
      reward: 250,
      type: 'weekly',
      icon: 'bullseye',
      completed: weekCases.length >= 3 &&
        Math.round(
          weekCases.reduce((sum, c) => sum + c.score, 0) / weekCases.length
        ) >= 85,
      claimed: false,
    },
  ];
};

export const claimQuestReward = (quest: Quest): number => {
  if (quest.completed && !quest.claimed) {
    return quest.reward;
  }
  return 0;
};
