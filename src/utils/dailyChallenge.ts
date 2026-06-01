import { dummyCases } from './dummyCases';

export const getDailyChallenge = () => {
  const today = new Date().toISOString().split('T')[0];
  
  const specialties = Object.keys(dummyCases);
  const randomSpecialty = specialties[Math.floor(Math.random() * specialties.length)];
  
  const levels = Object.keys(dummyCases[randomSpecialty]);
  const randomLevel = levels[Math.floor(Math.random() * levels.length)];
  
  const cases = dummyCases[randomSpecialty][randomLevel];
  const randomCase = cases[Math.floor(Math.random() * cases.length)];

  return {
    date: today,
    specialty: randomSpecialty,
    level: randomLevel,
    case: randomCase,
    bonusPoints: randomLevel === 'Advanced' ? 200 : randomLevel === 'Intermediate' ? 150 : 100,
  };
};

export const getDailySeed = () => {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
};
