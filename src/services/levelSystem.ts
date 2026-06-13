export interface LevelInfo {
  level: number;
  title: string;
  minXP: number;
  nameColor: string;
  avatarFrame: string;
  badge: string;
  glowEffect: boolean;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, title: 'Medical Student', minXP: 0, nameColor: '#F8FAFC', avatarFrame: 'none', badge: '', glowEffect: false },
  { level: 5, title: 'Intern', minXP: 2500, nameColor: '#F8FAFC', avatarFrame: 'silver', badge: '💉', glowEffect: false },
  { level: 10, title: 'Resident', minXP: 5000, nameColor: '#38BDF8', avatarFrame: 'silver', badge: '👨‍⚕️', glowEffect: false },
  { level: 15, title: 'Senior Resident', minXP: 10000, nameColor: '#38BDF8', avatarFrame: 'gold', badge: '⭐', glowEffect: false },
  { level: 20, title: 'Specialist', minXP: 20000, nameColor: '#F59E0B', avatarFrame: 'gold', badge: '🎓', glowEffect: true },
  { level: 25, title: 'Senior Specialist', minXP: 35000, nameColor: '#F59E0B', avatarFrame: 'diamond', badge: '🏅', glowEffect: true },
  { level: 30, title: 'Consultant', minXP: 50000, nameColor: '#8B5CF6', avatarFrame: 'diamond', badge: '👑', glowEffect: true },
  { level: 40, title: 'Professor', minXP: 100000, nameColor: '#8B5CF6', avatarFrame: 'legendary', badge: '🧠', glowEffect: true },
  { level: 50, title: 'Master Clinician', minXP: 200000, nameColor: '#EF4444', avatarFrame: 'legendary', badge: '🔥🏆🔥', glowEffect: true },
];

export function getLevelInfo(totalXP: number): LevelInfo {
  let currentLevel = LEVELS[0];
  for (const level of LEVELS) {
    if (totalXP >= level.minXP) {
      currentLevel = level;
    }
  }
  return currentLevel;
}

export function getNextLevel(totalXP: number): LevelInfo | null {
  for (const level of LEVELS) {
    if (totalXP < level.minXP) {
      return level;
    }
  }
  return null;
}

export function getXPProgress(totalXP: number): number {
  const current = getLevelInfo(totalXP);
  const next = getNextLevel(totalXP);
  if (!next) return 100;
  const currentMin = current.minXP;
  const nextMin = next.minXP;
  return Math.round(((totalXP - currentMin) / (nextMin - currentMin)) * 100);
}

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    nameColor: '#F8FAFC',
    avatarFrame: 'none',
    badge: '',
    benefits: ['Basic cases', 'Standard AI', 'Basic stats'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$4.99/mo',
    nameColor: '#F59E0B',
    avatarFrame: 'gold',
    badge: '⭐',
    benefits: ['Golden name', 'Golden frame', 'Premium badge', '+3 cases daily', 'Priority AI', 'Advanced stats'],
  },
  {
    id: 'pro',
    name: 'Professional',
    price: '$9.99/mo',
    nameColor: '#8B5CF6',
    avatarFrame: 'diamond',
    badge: '👑',
    benefits: ['Purple glowing name', 'Diamond frame + sparkle', 'Pro badge', 'Unlimited cases', 'PDF export', 'Certificates', 'All AI models'],
  },
];
