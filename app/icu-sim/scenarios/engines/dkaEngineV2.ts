import { ScenarioEngine, EngineContext } from './types';
import { PatientState } from '../../physiology';
import {
  PhysioState, PhysioEffects, getDefaultPhysioState,
  applyPhysioEffects, physioToVitals, physioTimeProgression
} from '../../physiologyEngine';

// ========== محرك DKA مع نظام الطبقات ==========
export const dkaEngineV2: ScenarioEngine = {
  name: 'dka_v2',

  update(ctx: EngineContext): PatientState {
    const { state } = ctx;
    const simTime = state.simTime;
    const newState = deepClone(state);
    const events = [...state.events];

    let physio: PhysioState = (state as any)._physio || getDefaultPhysioState();

    // ========== 1. تأثيرات الأدوية ← PhysioEffects ==========
    const runningOrders = state.activeOrders.filter(o => o.running);
    const drugEffects: PhysioEffects = {};

    runningOrders.forEach(order => {
      const effect = getDKADrugPhysioEffect(order.name, order.dose);
      Object.assign(drugEffects, effect);
      if (order.type === 'bolus' && (simTime - order.startSimTime) > 10) {
        order.running = false;
      }
    });

    // ========== 2. DKA PATHOPHYSIOLOGY ==========
    const hasInsulin = state.activeOrders.some(o =>
      o.name.includes('Insulin') && o.running
    );
    const hasFluids = state.activeOrders.some(o =>
      (o.category === 'fluid' || o.name.includes('Saline') || o.name.includes('Ringer')) && o.running
    );

    const diseaseEffects: PhysioEffects = {};

    if (!hasInsulin) {
      // DKA progression: acidosis worsens, osmotic diuresis, dehydration
      if (simTime % 5 === 0 && simTime > 0) {
        // Acidosis → vasodilation + myocardial depression
        diseaseEffects.svrChange = -0.15;
        diseaseEffects.contractility = -0.1;
        // Osmotic diuresis → volume depletion
        diseaseEffects.venousReturn = -0.2;
        // Hyperventilation (Kussmaul) - compensation
        diseaseEffects.metabolicRate = 0.2;
        // Acidosis worsens lactate clearance
        diseaseEffects.lactateClearance = -0.02;
        diseaseEffects.lactateProduction = 0.1;
      }
    }

    // ========== 3. INSULIN THERAPY EFFECTS (غير مباشر) ==========
    if (hasInsulin) {
      const insulinOrder = state.activeOrders.find(o => o.name.includes('Insulin'));
      const insulinStarted = insulinOrder ? simTime - insulinOrder.startSimTime : 0;

      if (insulinStarted > 15) {
        // Insulin: stops ketogenesis → gradual acid-base correction
        // هذا يؤثر على الـ pH وليس العلامات الحيوية مباشرة
        diseaseEffects.metabolicRate = -0.1;    // Less hyperventilation needed
        
        // تحسن تدريجي في الـ pH والـ HCO3 (يُحسب في DKA model)
        if (insulinStarted > 30) {
          diseaseEffects.lactateClearance = 0.03;
          diseaseEffects.contractility = 0.1;    // pH improvement → cardiac function
          diseaseEffects.svrChange = 0.1;        // Vasoconstriction returns
        }
      }
    }

    // ========== 4. FLUID RESUSCITATION EFFECTS ==========
    if (hasFluids) {
      // Fluids restore volume
      if (simTime % 5 === 0) {
        diseaseEffects.venousReturn = 0.3;
        diseaseEffects.gfrChange = 0.15;         // Renal perfusion improves
      }
    }

    // ========== 5. DKA-SPECIFIC ACID-BASE MODEL ==========
    // هذا القلب الحقيقي لمحرك DKA
    const dkaState = getOrCreateDKAState(state, physio);
    
    // تحديث الـ ketones والـ anion gap والـ pH
    const updatedDKA = updateDKAMetabolism(dkaState, hasInsulin, hasFluids, simTime);
    
    // تخزين قيم DKA في الـ vitals
    const v = physioToVitals(physio, state.vitals);
    v.ph = updatedDKA.ph;
    v.hco3 = updatedDKA.hco3;
    v.anionGap = updatedDKA.anionGap;
    v.ketones = updatedDKA.ketones;
    v.glucose = updatedDKA.glucose;
    v.potassium = updatedDKA.potassium;
    v.paco2 = updatedDKA.paco2;

    // ========== 6. تطبيق التأثيرات المركبة ==========
    const combinedEffects: PhysioEffects = { ...diseaseEffects, ...drugEffects };
    physio = applyPhysioEffects(physio, combinedEffects);
    physio = physioTimeProgression(physio, simTime);

    // ========== 7. تحويل PhysioState إلى VitalSigns ==========
    const vitals = physioToVitals(physio, v);

    // ========== 8. Organ Perfusion ==========
    if (vitals.map < 65 && simTime % 5 === 0) {
      physio.renalPerfusion = clamp(physio.renalPerfusion - 3, 5, 100);
    }
    if (vitals.map > 65 && physio.renalPerfusion < 100 && simTime % 10 === 0) {
      physio.renalPerfusion = clamp(physio.renalPerfusion + 1, 5, 100);
    }

    // ========== 9. Win/Lose Checks ==========
    if (state.loseConditions?.check) {
      if (state.loseConditions.check({ ...newState, vitals, events })) {
        newState.status = 'dead';
        if (!events.includes('DEATH')) events.push(`💀 ${state.loseConditions.description}`);
      }
    }
    if (state.winConditions?.check) {
      if (state.winConditions.check({ ...newState, vitals, events })) {
        if (newState.status === 'critical' || newState.status === 'deteriorating') {
          newState.status = 'improving';
          events.push(`✅ ${state.winConditions.description}`);
        }
      }
    }
    if (!hasInsulin && simTime > 120 && updatedDKA.ph < 7.05 && newState.status !== 'dead') {
      newState.status = 'deteriorating';
      if (!events.includes('DKA_WORSENING')) {
        events.push('⚠️ DKA worsening - severe acidosis without insulin');
      }
    }

    // ========== 10. أحداث خاصة بـ DKA ==========
    if (updatedDKA.potassium < 3.2 && !events.includes('HYPOKALEMIA')) {
      events.push('⚠️ Hypokalemia! K+ < 3.2 - cardiac risk');
    }
    if (updatedDKA.glucose < 250 && updatedDKA.ph > 7.30 && !events.includes('DKA_RESOLVING')) {
      events.push('✅ DKA resolving - consider subcutaneous insulin transition');
    }

    // ========== 11. تخزين الحالة ==========
    newState.vitals = vitals;
    newState.events = events;
    (newState as any)._physio = physio;
    (newState as any)._dkaState = updatedDKA;

    return newState;
  }
};

// ========== DKA Metabolic Model ==========
interface DKAState {
  glucose: number;        // mg/dL
  ketones: number;        // mmol/L (beta-hydroxybutyrate)
  potassium: number;      // mEq/L
  ph: number;
  hco3: number;           // mEq/L
  paco2: number;          // mmHg
  anionGap: number;
  insulinOnBoard: number; // units
  totalFluids: number;    // mL
}

function getOrCreateDKAState(state: PatientState, physio: PhysioState): DKAState {
  if ((state as any)._dkaState) return (state as any)._dkaState;
  
  return {
    glucose: state.vitals.glucose || 620,
    ketones: state.vitals.ketones || 6.5,
    potassium: state.vitals.potassium || 5.8,
    ph: state.vitals.ph || 7.08,
    hco3: state.vitals.hco3 || 8,
    paco2: state.vitals.paco2 || 22,
    anionGap: state.vitals.anionGap || 28,
    insulinOnBoard: 0,
    totalFluids: physio.totalFluidGiven || 0,
  };
}

function updateDKAMetabolism(
  dka: DKAState,
  hasInsulin: boolean,
  hasFluids: boolean,
  simTime: number
): DKAState {
  const d = deepClone(dka);

  // ===== KETONE METABOLISM =====
  if (hasInsulin) {
    // Insulin suppresses ketogenesis + enhances clearance
    // Ketone half-life ~2-4 hours with insulin
    if (simTime % 10 === 0) {
      d.ketones = clamp(d.ketones - 0.3, 0.1, 10);
    }
  } else if (!hasInsulin && simTime % 10 === 0 && simTime > 0) {
    // Without insulin: ketones accumulate
    d.ketones = clamp(d.ketones + 0.2, 0.1, 12);
  }

  // ===== ANION GAP =====
  // AG = (Na - Cl - HCO3) ≈ ketones * 3 + lactate
  // Simplified: AG correlated with ketones
  d.anionGap = clamp(Math.round((d.ketones * 3.5 + (d.hco3 < 15 ? 3 : 0)) * 10) / 10, 8, 40);

  // ===== ACID-BASE (Henderson-Hasselbalch simplified) =====
  // pH change driven by ketone clearance (anion gap closing)
  if (hasInsulin && d.ketones < 4) {
    // Acidosis resolving
    if (simTime % 10 === 0) {
      d.hco3 = clamp(d.hco3 + 0.5, 4, 32);
      d.ph = clamp(Math.round((d.ph + 0.01) * 100) / 100, 6.85, 7.48);
    }
  } else if (!hasInsulin && d.ketones > 5 && simTime % 10 === 0 && simTime > 0) {
    // Acidosis worsening
    d.hco3 = clamp(d.hco3 - 0.3, 4, 32);
    d.ph = clamp(Math.round((d.ph - 0.01) * 100) / 100, 6.85, 7.48);
  }

  // Respiratory compensation: Kussmaul
  // PaCO2 = 1.5 * HCO3 + 8 ± 2 (Winter's formula)
  if (simTime % 5 === 0) {
    d.paco2 = clamp(Math.round(1.5 * d.hco3 + 8 + (Math.random() * 4 - 2)), 10, 45);
  }

  // ===== GLUCOSE =====
  if (hasInsulin && simTime % 5 === 0) {
    // Insulin lowers glucose ~50-75 mg/dL/hour
    d.glucose = clamp(d.glucose - 6, 80, 700);
  }
  if (hasFluids && simTime % 10 === 0) {
    // Fluids dilute glucose slightly
    d.glucose = clamp(d.glucose - 2, 80, 700);
  }

  // ===== POTASSIUM =====
  // Insulin drives K+ into cells → hypokalemia risk
  if (hasInsulin && simTime % 15 === 0) {
    d.potassium = clamp(Math.round((d.potassium - 0.15) * 10) / 10, 2.5, 7);
  }
  // Without insulin, K+ can rise from acidosis
  if (!hasInsulin && d.ph < 7.1 && simTime % 15 === 0) {
    d.potassium = clamp(Math.round((d.potassium + 0.1) * 10) / 10, 2.5, 7);
  }

  return d;
}

// ========== Drug → PhysioEffects Translator ==========
function getDKADrugPhysioEffect(name: string, dose: string): PhysioEffects {
  const base = doseToFactor(dose);

  const effects: Record<string, PhysioEffects> = {
    'Normal Saline 1000mL': {
      venousReturn: 0.5 * base,
      gfrChange: 0.2,
    },
    'Normal Saline 500mL': {
      venousReturn: 0.25 * base,
      gfrChange: 0.1,
    },
    "Ringer's Lactate 500mL": {
      venousReturn: 0.25 * base,
      gfrChange: 0.1,
    },
    'Insulin Regular 10u IV': {
      metabolicRate: -0.3,  // Stops catabolic state
    },
    'Insulin Regular 5u IV': {
      metabolicRate: -0.15,
    },
    'Potassium Chloride 20mEq': {
      // No direct physio effect - handled in DKA model
    },
    'Sodium Bicarbonate 50mEq': {
      // Minimal evidence for bicarb in DKA, but if given:
      metabolicRate: -0.05,
    },
  };

  return effects[name] || {};
}

function doseToFactor(dose: string): number {
  const match = dose.match(/([\d.]+)/);
  if (!match) return 1;
  const value = parseFloat(match[1]);
  if (dose.includes('mL')) return Math.min(value / 500, 2);
  if (dose.includes('u') || dose.includes('unit')) return Math.min(value / 10, 2);
  if (dose.includes('mEq')) return Math.min(value / 20, 2);
  return 1;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
