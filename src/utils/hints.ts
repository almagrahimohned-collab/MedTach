export interface Hint {
  id: string;
  text: string;
  cost: number;
  category: 'history' | 'examination' | 'labs' | 'imaging' | 'diagnosis';
}

export const getAvailableHints = (caseData: any, testsOrdered: string[]): Hint[] => {
  const hints: Hint[] = [];

  if (caseData?.data) {
    const dataKeys = Object.keys(caseData.data);
    
    if (!testsOrdered.includes('vitals')) {
      hints.push({
        id: 'hint_vitals',
        text: 'Start with basic vital signs to assess patient stability.',
        cost: 5,
        category: 'examination',
      });
    }

    if (!testsOrdered.includes('cbc')) {
      hints.push({
        id: 'hint_cbc',
        text: 'A complete blood count can reveal infection, anemia, or other hematological issues.',
        cost: 10,
        category: 'labs',
      });
    }

    if (dataKeys.some(k => k.toLowerCase().includes('ecg'))) {
      hints.push({
        id: 'hint_ecg',
        text: 'Consider checking cardiac electrical activity for rhythm abnormalities.',
        cost: 10,
        category: 'imaging',
      });
    }

    hints.push({
      id: 'hint_general',
      text: 'Review the chief complaint carefully. Focus on the most life-threatening possibilities first.',
      cost: 15,
      category: 'diagnosis',
    });

    hints.push({
      id: 'hint_systematic',
      text: 'Follow a systematic approach: History → Examination → Labs → Imaging → Diagnosis.',
      cost: 5,
      category: 'history',
    });
  }

  return hints;
};

export const getDiagnosisHint = (correctDiagnosis: string): string => {
  const words = correctDiagnosis.split(' ');
  const firstLetters = words.map(w => w[0]).join('');
  return `The diagnosis has ${words.length} word(s). First letters: ${firstLetters}...`;
};
