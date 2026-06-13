export const NAMES_MALE = ['Ahmed', 'Hassan', 'Omar', 'Khalid', 'Ibrahim', 'Youssef', 'Ali', 'Mustafa', 'Tariq', 'Bilal', 'Mahmoud', 'Samir', 'Rashid', 'Nabil', 'Kareem'];
export const NAMES_FEMALE = ['Fatima', 'Layla', 'Samira', 'Nour', 'Aisha', 'Mariam', 'Zainab', 'Huda', 'Amal', 'Sara', 'Nadia', 'Lina', 'Rania', 'Dalia', 'Mona'];
export const LAST_NAMES = ['Al-Rashid', 'Al-Farsi', 'Al-Hashimi', 'Al-Qassim', 'Al-Sayed', 'Khan', 'Malik', 'Ahmed', 'Hassan', 'Omar', 'Ibrahim', 'Mahmoud', 'Khalil', 'Nasser', 'Saeed'];

export function generateName(gender: 'male' | 'female'): string {
  const first = gender === 'male' ? NAMES_MALE : NAMES_FEMALE;
  return `${first[Math.floor(Math.random() * first.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
}
