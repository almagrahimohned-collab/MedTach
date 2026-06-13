import { normalizeConfidence } from '../mediaResolver';

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/almagrahimohned-collab/medtach-content/main';

const ECG_PATTERNS: Record<string, { aliases: string[]; report: string }> = {
  'stemi': {
    aliases: ['stemi', 'st elevation', 'myocardial infarction', 'anterior mi', 'inferior mi'],
    report: `🫀 **ECG Report - STEMI**\n\n**Findings:**\n• ST elevation ≥2mm\n• Reciprocal ST depression\n• Pathologic Q waves\n\n**Interpretation:**\nAcute transmural myocardial ischemia.\n\n**Clinical Correlation:**\nDoor-to-balloon <90min. Activate cath lab immediately.`,
  },
  'pericarditis': {
    aliases: ['pericarditis', 'acute pericarditis'],
    report: `🫀 **ECG Report - Acute Pericarditis**\n\n**Findings:**\n• Diffuse ST elevation (concave-up)\n• PR depression\n• No reciprocal changes\n\n**Interpretation:**\nStage 1 acute pericarditis.\n\n**Clinical Correlation:**\nNSAIDs + Colchicine. Avoid anticoagulation.`,
  },
  'atrial fibrillation': {
    aliases: ['atrial fibrillation', 'afib', 'af'],
    report: `🫀 **ECG Report - Atrial Fibrillation**\n\n**Findings:**\n• Irregularly irregular rhythm\n• Absent P waves\n• Narrow QRS\n\n**Interpretation:**\nAF with rapid ventricular response.\n\n**Clinical Correlation:**\nRate control + anticoagulation based on CHA₂DS₂-VASc.`,
  },
  'heart failure': {
    aliases: ['heart failure', 'chf', 'cardiomyopathy', 'dilated cardiomyopathy'],
    report: `🫀 **ECG Report - LVH with Strain**\n\n**Findings:**\n• LVH by voltage criteria\n• Left axis deviation\n• ST-T strain pattern\n\n**Interpretation:**\nChronic pressure/volume overload.\n\n**Clinical Correlation:**\nEcho essential. Treat underlying cause.`,
  },
  'brugada': { aliases: ['brugada'], report: `🫀 **ECG Report - Brugada Type 1**\n\n**Findings:**\n• Coved ST elevation V1-V2\n• T wave inversion\n\n**Interpretation:**\nBrugada syndrome.\n\n**Clinical Correlation:**\nICD indicated.` },
  'long qt': { aliases: ['long qt', 'lqts', 'prolonged qt'], report: `🫀 **ECG Report - Long QT**\n\n**Findings:**\n• QTc >500ms\n• T wave alternans\n\n**Interpretation:**\nHigh risk for Torsades.\n\n**Clinical Correlation:**\nBeta-blockers. Avoid QT-prolonging drugs.` },
  'wpw': { aliases: ['wpw', 'wolff-parkinson-white', 'preexcitation'], report: `🫀 **ECG Report - WPW**\n\n**Findings:**\n• Short PR <120ms\n• Delta wave\n• Wide QRS\n\n**Interpretation:**\nAccessory pathway.\n\n**Clinical Correlation:**\nCatheter ablation curative >95%.` },
};

function scoreMatch(dx: string, alias: string): number {
  dx = dx.toLowerCase().trim(); alias = alias.toLowerCase().trim();
  if (dx === alias) return 3;
  if (dx.includes(alias)) return 2;
  if (alias.includes(dx) && dx.length > 3) return 1;
  return 0;
}

export interface ECGResult {
  imageUrl: string | null; report: string; source: 'rule' | 'normal'; confidence: number;
}

export async function getECGResult(diagnosis: string, labResult?: string): Promise<ECGResult> {
  const dx = diagnosis.toLowerCase().trim();
  let bestScore = 0; let bestPattern: typeof ECG_PATTERNS[string] | null = null;
  for (const [, pattern] of Object.entries(ECG_PATTERNS)) {
    for (const alias of pattern.aliases) {
      const score = scoreMatch(dx, alias);
      if (score > bestScore) { bestScore = score; bestPattern = pattern; }
    }
  }
  const rn = Math.floor(Math.random() * 16) + 1;
  if (bestPattern && bestScore >= 2) {
    return { imageUrl: `${GITHUB_RAW_BASE}/media/ecg/normal/normal_${rn}.png`, report: labResult ? `🫀 **ECG Report**\n\n**Findings:**\n${labResult}\n\n${bestPattern.report.split('**Interpretation:**\n')[1] || ''}` : bestPattern.report, source: 'rule', confidence: normalizeConfidence(bestScore / 3) };
  }
  return { imageUrl: `${GITHUB_RAW_BASE}/media/ecg/normal/normal_${rn}.png`, report: `🫀 **ECG Report - Normal Sinus Rhythm**\n\n**Findings:**\n${labResult || '• Normal sinus rhythm, 72 bpm'}\n\n**Interpretation:**\nNormal 12-lead ECG.`, source: 'normal', confidence: normalizeConfidence(0.7) };
}
