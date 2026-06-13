// 🎯 Media Pattern Resolver v4 - Manifest-Based Decision System
// + Clinical Signal Extractor (Lightweight Intelligence Layer)

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/almagrahimohned-collab/medtach-content/main';

export interface ResolvedMedia {
  imageUrl: string | null;
  patterns: string[];
  modality: string;
  confidence: number;
  source: 'case' | 'rule' | 'fallback';
}

export interface ImagingPattern {
  pattern: string;
  confidence: number;
  source: string;
}

interface CaseLike {
  imaging_patterns?: Record<string, string | ImagingPattern>;
  correct_diagnosis?: string;
  title?: string;
}

// 🧠 RULE ENGINE
const RULE_ENGINE: Record<string, Record<string, { keywords: string[]; priority: number; exclude?: string[] }>> = {
  cxr: {
    pneumonia: { keywords: ["pneumonia", "consolidation", "lobar pneumonia", "bronchopneumonia", "tb", "tuberculosis", "bronchiectasis", "cystic fibrosis", "lung abscess", "empyema"], priority: 10 },
    effusion: { keywords: ["pleural effusion", "effusion", "pleural fluid", "hydrothorax", "hemothorax"], priority: 8 },
    pneumothorax: { keywords: ["pneumothorax", "collapsed lung", "air leak", "tension pneumothorax"], priority: 9 },
    cardiomegaly: { keywords: ["heart failure", "chf", "cardiomyopathy", "dilated cardiomyopathy", "cardiomegaly", "enlarged heart", "pulmonary edema", "congestive heart"], priority: 8 },
    atelectasis: { keywords: ["atelectasis", "lung collapse"], priority: 6 },
  },
  ct_brain: {
    stroke: { keywords: ["stroke", "cva", "ischemia", "infarction", "tia", "cerebrovascular", "lacunar infarct"], priority: 10, exclude: ["heat stroke", "heatstroke"] },
    hemorrhage: { keywords: ["hemorrhage", "bleed", "hematoma", "ich", "sah", "subarachnoid", "subdural", "epidural", "hemorrhagic stroke"], priority: 10 },
    tumor: { keywords: ["brain tumor", "brain mass", "glioma", "meningioma", "metastasis", "glioblastoma", "astrocytoma", "brain cancer"], priority: 8 },
  },
  ct_chest: {
    pe: { keywords: ["pulmonary embolism", "pe", "pulmonary embolus"], priority: 10 },
    mass: { keywords: ["lung mass", "lung tumor", "lung cancer", "pulmonary nodule"], priority: 8 },
  },
  us_abd: {
    gallstones: { keywords: ["gallstone", "cholelithiasis", "biliary colic", "cholecystitis"], priority: 9 },
    appendicitis: { keywords: ["appendicitis", "appendix", "appendiceal"], priority: 9 },
  },
};

// 🧠 Clinical Signal Extractor (NEW)
function extractClinicalSignals(text: string): string[] {
  if (!text) return [];

  const t = text.toLowerCase();
  const signals: string[] = [];

  if (t.includes('orthopnea') || t.includes('pnd') || t.includes('jvd') || t.includes('edema')) {
    signals.push('heart_failure');
  }

  if (t.includes('fever') || t.includes('cough') || t.includes('sputum') || t.includes('consolidation')) {
    signals.push('pneumonia');
  }

  if (t.includes('pleuritic') || t.includes('dullness') || t.includes('decreased breath sounds')) {
    signals.push('effusion');
  }

  if (t.includes('sudden chest pain') || t.includes('hyperresonance') || t.includes('dyspnea acute')) {
    signals.push('pneumothorax');
  }

  if (t.includes('night sweats') || t.includes('weight loss') || t.includes('hemoptysis')) {
    signals.push('tuberculosis');
  }

  return signals;
}

// 🖼️ Modality mapping
const TEST_MODALITY_MAP: Record<string, string> = {
  'cxr': 'cxr', 'chest x-ray': 'cxr', 'chest x ray': 'cxr', 'xray': 'cxr', 'x-ray': 'cxr',
  'ct head': 'ct_brain', 'ct brain': 'ct_brain', 'ct_head': 'ct_brain', 'ct_brain': 'ct_brain',
  'ct chest': 'ct_chest', 'ct_chest': 'ct_chest', 'cta chest': 'ct_chest',
  'us abdomen': 'us_abd', 'ultrasound abdomen': 'us_abd', 'us_abd': 'us_abd',
  'mri brain': 'mri_brain', 'mri_brain': 'mri_brain',
};

let manifestCache: any = null;

async function fetchManifest(): Promise<any> {
  if (manifestCache) return manifestCache;
  try {
    const res = await fetch(`${GITHUB_RAW_BASE}/media/library/manifest.json`);
    if (res.ok) {
      manifestCache = await res.json();
      return manifestCache;
    }
  } catch {}
  return {};
}

export function normalizeConfidence(value: number): number {
  return Math.max(0, Math.min(1, Math.round(value * 100) / 100));
}

export async function resolveMedicalImage(
  testId: string,
  caseData: CaseLike | null,
  diagnosis?: string,
  _testName?: string
): Promise<ResolvedMedia> {

  const combined = `${testId} ${_testName || ''}`.toLowerCase();
  let modality: string | null = null;

  for (const [key, value] of Object.entries(TEST_MODALITY_MAP)) {
    if (combined.includes(key)) { modality = value; break; }
  }

  if (!modality) {
    return { imageUrl: null, patterns: [], modality: 'unknown', confidence: 0, source: 'fallback' };
  }

  const diag = diagnosis || caseData?.correct_diagnosis || caseData?.title || '';
  const manifest = await fetchManifest();

  // 🔴 Case override
  const casePattern = getCasePattern(caseData, modality);
  if (casePattern && casePattern !== 'normal') {
    const imageUrl = selectFromManifest(manifest, modality, casePattern);
    if (imageUrl) {
      return { imageUrl, patterns: [casePattern], modality, confidence: 0.95, source: 'case' };
    }
  }

  // 🧠 NEW: clinical signals
  const signals = extractClinicalSignals(diag);

  // 🟡 Rule engine
  const ruleResults = applyRuleEngine(diag, modality);

  // 🟢 Signal fallback BEFORE normal fallback
  if (signals.length > 0 && ruleResults.length === 0) {
    for (const s of signals) {
      const imageUrl = selectFromManifest(manifest, modality, s);
      if (imageUrl) {
        return {
          imageUrl,
          patterns: [s],
          modality,
          confidence: 0.6,
          source: 'rule',
        };
      }
    }
  }

  if (ruleResults.length > 0) {
    for (const rule of ruleResults) {
      const imageUrl = selectFromManifest(manifest, modality, rule.pattern);
      if (imageUrl) {
        return {
          imageUrl,
          patterns: ruleResults.map(r => r.pattern),
          modality,
          confidence: normalizeConfidence(rule.confidence),
          source: 'rule',
        };
      }
    }
  }

  const normalImage = selectFromManifest(manifest, modality, 'normal');

  return {
    imageUrl: normalImage,
    patterns: ['normal'],
    modality,
    confidence: 0.3,
    source: 'fallback',
  };
}

function getCasePattern(caseData: CaseLike | null, modality: string): string | null {
  if (!caseData?.imaging_patterns) return null;
  const pattern = caseData.imaging_patterns[modality];
  if (!pattern) return null;
  if (typeof pattern === 'string') return pattern;
  if (typeof pattern === 'object' && 'pattern' in pattern) return pattern.pattern;
  return null;
}

function applyRuleEngine(diagnosis: string, modality: string): { pattern: string; confidence: number }[] {
  if (!diagnosis || !RULE_ENGINE[modality]) return [];

  const dx = diagnosis.toLowerCase();
  const results: { pattern: string; score: number }[] = [];

  for (const [pattern, config] of Object.entries(RULE_ENGINE[modality])) {
    const matched = config.keywords.filter(k => dx.includes(k));
    if (matched.length > 0) {
      results.push({ pattern, score: matched.length * config.priority });
    }
  }

  results.sort((a, b) => b.score - a.score);

  return results.map(r => ({
    pattern: r.pattern,
    confidence: Math.min(r.score / 30, 0.85),
  }));
}

function selectFromManifest(manifest: any, modality: string, pattern: string): string | null {
  const images = manifest?.[modality]?.[pattern];

  if (!images || images.length === 0) {
    const normalImages = manifest?.[modality]?.['normal'];
    if (!normalImages?.length) return null;

    const randomIndex = Math.floor(Math.random() * normalImages.length);

    return `${GITHUB_RAW_BASE}/media/library/${modality}/normal/${normalImages[randomIndex]}`;
  }

  const randomIndex = Math.floor(Math.random() * images.length);

  return `${GITHUB_RAW_BASE}/media/library/${modality}/${pattern}/${images[randomIndex]}`;
}

export function clearManifestCache() {
  manifestCache = null;
}
