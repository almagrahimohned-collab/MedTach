// Mapping بين فروع الـ UI والتخصصات في الـ index

export const SPECIALTY_MAPPING: Record<string, string> = {
  // Internal Medicine Branches
  'Cardiology': 'cardiology',
  'Pulmonology': 'pulmonology',
  'Gastroenterology': 'gastroenterology',
  'Endocrinology': 'endocrinology',
  'Nephrology': 'nephrology',
  'Hematology': 'hematology',
  'Infectious Disease': 'infectious',
  'Rheumatology': 'rheumatology',
  
  // Pediatrics Branches
  'Neonatology': 'pediatrics',
  'General Pediatrics': 'pediatrics',
  'Pediatric Cardiology': 'pediatrics',
  'Pediatric Neurology': 'pediatrics',
  'Pediatric ID': 'pediatrics',
  'Pediatric GI': 'pediatrics',
  'Pediatric Respiratory': 'pediatrics',
  
  // Surgery Branches
  'General Surgery': 'surgery',
  'Orthopedics': 'surgery',
  'Neurosurgery': 'surgery',
  'Cardiothoracic': 'surgery',
  'Vascular Surgery': 'surgery',
  'Plastic Surgery': 'surgery',
  'Urology': 'surgery',
  'ENT': 'surgery',
  
  // OB/GYN Branches
  'Obstetrics': 'gynecology',
  'Gynecology': 'gynecology',
  'Reproductive Endocrinology': 'gynecology',
  'Maternal-Fetal Medicine': 'gynecology',
  'Urogynecology': 'gynecology',
};

// الفروع اللي معندهاش مستويات - لازم نضيف difficulty وهمية
export const BRANCH_BASED_SPECIALTIES = ['pediatrics', 'surgery', 'gynecology'];

export function getSpecialtyForIndex(subSpecialty: string): string {
  return SPECIALTY_MAPPING[subSpecialty] || subSpecialty.toLowerCase();
}

// تحويل اسم الفرع لـ difficulty مناسب (للفروع اللي معندهاش مستويات)
export function getDifficultyForBranch(branch: string, selectedLevel: string): string {
  const branchLower = branch?.toLowerCase() || '';
  const level = selectedLevel?.toLowerCase() || 'beginner';
  
  // Level-based specialties: نستخدم المستوى مباشرة
  const levelBasedSpecs = ['cardiology', 'pulmonology', 'neurology', 'endocrinology', 
                            'gastroenterology', 'nephrology', 'hematology', 'infectious',
                            'rheumatology', 'dermatology'];
  
  if (levelBasedSpecs.includes(getSpecialtyForIndex(branch))) {
    return level;
  }
  
  // Branch-based specialties: نستخدم اسم الفرع كـ difficulty
  const branchMapping: Record<string, string> = {
    'neonatology': 'neonatology',
    'general pediatrics': 'general',
    'pediatric cardiology': 'cardiology',
    'pediatric neurology': 'neurology',
    'pediatric id': 'infectious',
    'pediatric gi': 'gastroenterology',
    'pediatric respiratory': 'respiratory',
    'general surgery': 'general',
    'orthopedics': 'orthopedics',
    'neurosurgery': 'neurosurgery',
    'cardiothoracic': 'cardiothoracic',
    'vascular surgery': 'vascular',
    'plastic surgery': 'plastic',
    'urology': 'urology',
    'ent': 'ent',
    'obstetrics': 'obstetrics',
    'gynecology': 'gynecology',
    'reproductive endocrinology': 'reproductive',
    'maternal-fetal medicine': 'mfm',
    'urogynecology': 'urogynecology',
  };
  
  return branchMapping[branchLower] || 'general';
}
