// ========== Case Randomizer Engine ==========
// يضيف عشوائية للسيناريوهات لجعل كل محاولة مختلفة

import { Scenario, InitialVitals } from './scenarios/types';

// ========== أنماط المرضى ==========
export type PatientVariant = 'typical' | 'elderly' | 'young' | 'obese' | 'frail' | 'athletic';

interface PatientProfile {
  weightRange: [number, number];
  ageRange: [number, number];
  vitalsMultiplier: Partial<Record<keyof InitialVitals, [number, number]>>;
  description: string;
}

const PATIENT_PROFILES: Record<PatientVariant, PatientProfile> = {
  typical: {
    weightRange: [65, 85],
    ageRange: [40, 65],
    vitalsMultiplier: {},
    description: 'Typical presentation',
  },
  elderly: {
    weightRange: [55, 75],
    ageRange: [70, 90],
    vitalsMultiplier: {
      hr: [0.8, 0.95],       // Less tachycardia
      bp: [0.85, 0.95],       // Lower baseline BP
      temp: [0.9, 1.0],       // Less febrile response
      rr: [1.0, 1.2],         // Higher RR
    },
    description: 'Elderly - blunted response',
  },
  young: {
    weightRange: [60, 80],
    ageRange: [18, 35],
    vitalsMultiplier: {
      hr: [1.1, 1.3],         // More tachycardia
      temp: [1.0, 1.1],       // Strong febrile response
      rr: [0.9, 1.1],
    },
    description: 'Young adult - robust response',
  },
  obese: {
    weightRange: [100, 150],
    ageRange: [35, 60],
    vitalsMultiplier: {
      hr: [1.0, 1.2],
      bp: [1.05, 1.2],        // Higher baseline BP
      spo2: [0.85, 0.95],     // Lower baseline SpO2
    },
    description: 'Obese - altered physiology',
  },
  frail: {
    weightRange: [45, 60],
    ageRange: [75, 95],
    vitalsMultiplier: {
      hr: [0.7, 0.9],
      bp: [0.7, 0.85],        // Much lower BP
      temp: [0.8, 0.95],
      rr: [1.1, 1.4],
      lactate: [1.2, 1.5],    // Higher baseline lactate
    },
    description: 'Frail - poor reserve',
  },
  athletic: {
    weightRange: [70, 90],
    ageRange: [25, 45],
    vitalsMultiplier: {
      hr: [0.6, 0.8],         // Bradycardic baseline
      bp: [0.9, 1.05],
      rr: [0.7, 0.9],
    },
    description: 'Athletic - high reserve',
  },
};

// ========== شدة السيناريو ==========
export type SeverityModifier = 'mild' | 'moderate' | 'severe' | 'critical';

interface SeverityProfile {
  vitalsSeverity: Partial<Record<keyof InitialVitals, [number, number]>>;
  description: string;
  timeMultiplier: number;
}

const SEVERITY_PROFILES: Record<SeverityModifier, SeverityProfile> = {
  mild: {
    vitalsSeverity: {
      hr: [0.85, 0.95],
      lactate: [0.5, 0.8],
      urineOutput: [1.2, 1.5],
    },
    description: 'Mild - early presentation',
    timeMultiplier: 1.5,
  },
  moderate: {
    vitalsSeverity: {
      hr: [0.95, 1.1],
      lactate: [0.8, 1.2],
      urineOutput: [0.8, 1.2],
    },
    description: 'Moderate - established disease',
    timeMultiplier: 1.0,
  },
  severe: {
    vitalsSeverity: {
      hr: [1.1, 1.3],
      lactate: [1.3, 1.8],
      urineOutput: [0.4, 0.7],
      spo2: [0.85, 0.95],
    },
    description: 'Severe - advanced pathology',
    timeMultiplier: 0.7,
  },
  critical: {
    vitalsSeverity: {
      hr: [1.3, 1.5],
      lactate: [1.8, 2.5],
      urineOutput: [0.1, 0.3],
      spo2: [0.7, 0.85],
      map: [0.6, 0.75],
    },
    description: 'Critical - near collapse',
    timeMultiplier: 0.4,
  },
};

// ========== مضاعفات عشوائية ==========
export type RandomEvent = {
  time: number;
  type: 'complication' | 'improvement' | 'surprise';
  event: string;
  vitalsImpact?: Partial<InitialVitals>;
  duration: number;
};

const RANDOM_COMPLICATIONS: RandomEvent[] = [
  {
    time: 30 + Math.floor(Math.random() * 60),
    type: 'complication',
    event: '⚠️ Acute kidney injury - creatinine rising',
    vitalsImpact: { urineOutput: 3 },
    duration: 120,
  },
  {
    time: 45 + Math.floor(Math.random() * 60),
    type: 'complication',
    event: '⚠️ Atrial fibrillation with rapid ventricular response',
    vitalsImpact: { hr: 30 },
    duration: 60,
  },
  {
    time: 60 + Math.floor(Math.random() * 90),
    type: 'complication',
    event: '🚨 Tension pneumothorax suspected!',
    vitalsImpact: { spo2: -20, bp: { systolic: -30, diastolic: -15 } },
    duration: 30,
  },
  {
    time: 20 + Math.floor(Math.random() * 40),
    type: 'improvement',
    event: '✅ Patient responding well to initial therapy',
    vitalsImpact: { lactate: -1, hr: -10 },
    duration: 60,
  },
  {
    time: 90 + Math.floor(Math.random() * 60),
    type: 'surprise',
    event: '🔬 Blood cultures show MDR organism - change antibiotics!',
    vitalsImpact: {},
    duration: 0,
  },
];

// ========== Randomizer Main Function ==========
export interface RandomizedScenario extends Scenario {
  _original: Scenario;
  _variant: PatientVariant;
  _severity: SeverityModifier;
  _randomEvents: RandomEvent[];
  _seed: number;
}

export function randomizeScenario(
  scenario: Scenario,
  seed?: number
): RandomizedScenario {
  const actualSeed = seed || Math.floor(Math.random() * 100000);
  const rng = createRNG(actualSeed);

  // Pick random variant
  const variants = Object.keys(PATIENT_PROFILES) as PatientVariant[];
  const variant = variants[Math.floor(rng() * variants.length)];
  const profile = PATIENT_PROFILES[variant];

  // Pick random severity
  const severities = Object.keys(SEVERITY_PROFILES) as SeverityModifier[];
  const severity = severities[Math.floor(rng() * severities.length)];
  const sevProfile = SEVERITY_PROFILES[severity];

  // Apply modifiers to vitals
  const randomizedVitals = applyModifiers(
    scenario.initialVitals,
    profile.vitalsMultiplier,
    sevProfile.vitalsSeverity
  );

  // Add small random noise (±5%)
  const noisyVitals = addNoise(randomizedVitals, 0.05, rng);

  // Pick random complications
  const numComplications = Math.floor(rng() * 3); // 0-2 complications
  const shuffled = [...RANDOM_COMPLICATIONS].sort(() => rng() - 0.5);
  const randomEvents = shuffled.slice(0, numComplications);

  // Randomize patient demographics
  const weight = Math.round(
    profile.weightRange[0] + rng() * (profile.weightRange[1] - profile.weightRange[0])
  );
  const age = Math.round(
    profile.ageRange[0] + rng() * (profile.ageRange[1] - profile.ageRange[0])
  );

  const randomizedScenario: RandomizedScenario = {
    ...scenario,
    id: `${scenario.id}_r${actualSeed}`,
    title: `${scenario.title} [${severity.toUpperCase()}]`,
    diagnosis: `${scenario.diagnosis} (${profile.description})`,
    description: `${scenario.description}\nVariant: ${profile.description}\nSeverity: ${sevProfile.description}`,
    initialStatus: severity === 'critical' ? 'critical' : 'critical',
    durationMinutes: Math.round(scenario.durationMinutes * sevProfile.timeMultiplier),
    initialVitals: noisyVitals,
    patient: {
      ...scenario.patient,
      age,
      weight,
      name: generateRandomName(rng),
    },
    _original: scenario,
    _variant: variant,
    _severity: severity,
    _randomEvents: randomEvents,
    _seed: actualSeed,
  };

  // Add random event goals
  if (randomEvents.length > 0) {
    randomizedScenario.timedEvents = [
      ...(scenario.timedEvents || []),
      ...randomEvents.map(e => ({
        simTime: e.time,
        event: e.event,
      })),
    ];
  }

  return randomizedScenario;
}

// ========== Helper Functions ==========

function createRNG(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function applyModifiers(
  vitals: InitialVitals,
  variantMod: Partial<Record<keyof InitialVitals, [number, number]>>,
  severityMod: Partial<Record<keyof InitialVitals, [number, number]>>
): InitialVitals {
  const result = { ...vitals };

  const apply = (key: keyof InitialVitals) => {
    const orig = result[key] as number;
    if (typeof orig !== 'number') return;

    let multiplier = 1;
    if (variantMod[key]) {
      const [min, max] = variantMod[key]!;
      multiplier *= min + Math.random() * (max - min);
    }
    if (severityMod[key]) {
      const [min, max] = severityMod[key]!;
      multiplier *= min + Math.random() * (max - min);
    }
    (result as any)[key] = Math.round(orig * multiplier * 10) / 10;
  };

  apply('hr');
  apply('spo2');
  apply('rr');
  apply('temp');
  apply('lactate');
  apply('urineOutput');

  // BP special handling
  if (variantMod.bp || severityMod.bp) {
    let bpMult = 1;
    if (variantMod.bp) bpMult *= variantMod.bp[0] + Math.random() * (variantMod.bp[1] - variantMod.bp[0]);
    if (severityMod.bp) bpMult *= severityMod.bp[0] + Math.random() * (severityMod.bp[1] - severityMod.bp[0]);
    result.bp = {
      systolic: Math.round(vitals.bp.systolic * bpMult),
      diastolic: Math.round(vitals.bp.diastolic * bpMult),
    };
  }

  return result;
}

function addNoise(vitals: InitialVitals, range: number, rng: () => number): InitialVitals {
  const result = { ...vitals };
  const addNoiseToNumber = (val: number) => {
    const noise = (rng() - 0.5) * 2 * range;
    return Math.round(val * (1 + noise) * 10) / 10;
  };

  (result as any).hr = addNoiseToNumber(vitals.hr);
  (result as any).spo2 = Math.min(100, addNoiseToNumber(vitals.spo2));
  (result as any).rr = addNoiseToNumber(vitals.rr);
  (result as any).lactate = addNoiseToNumber(vitals.lactate);
  (result as any).urineOutput = addNoiseToNumber(vitals.urineOutput);

  return result;
}

const FIRST_NAMES = ['Ahmed', 'Mohammed', 'Ali', 'Omar', 'Khalid', 'Fatima', 'Aisha', 'Noora', 'Sara', 'Layla'];
const LAST_NAMES = ['Hassan', 'Al-Otaibi', 'Al-Zahrani', 'Al-Rashid', 'Al-Mansoori', 'Al-Qahtani', 'Al-Shammari'];

function generateRandomName(rng: () => number): string {
  const first = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
  const last = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
  return `${first} ${last}`;
}

// ========== Seed Display ==========
export function generateSeedDisplay(randomized: RandomizedScenario): string {
  return `
🎲 Case Seed: #${randomized._seed}
━━━━━━━━━━━━━━━━━━━━━
👤 Patient: ${randomized.patient.name}
📊 Age: ${randomized.patient.age}y | Weight: ${randomized.patient.weight}kg
🔄 Variant: ${randomized._variant.toUpperCase()}
⚠️ Severity: ${randomized._severity.toUpperCase()}
🎯 Random Events: ${randomized._randomEvents.length}
━━━━━━━━━━━━━━━━━━━━━
💡 Share this seed to challenge friends!
  `.trim();
}

// ========== Challenge Mode ==========
export function createChallenge(seed: number, scenarioId: string): string {
  return `icu_challenge_${scenarioId}_${seed}`;
}

export function parseChallenge(challenge: string): { scenarioId: string; seed: number } | null {
  const match = challenge.match(/icu_challenge_(.+)_(\d+)/);
  if (!match) return null;
  return { scenarioId: match[1], seed: parseInt(match[2]) };
}
