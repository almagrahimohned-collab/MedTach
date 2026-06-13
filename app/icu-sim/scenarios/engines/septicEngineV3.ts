import { ScenarioEngine, EngineContext } from './types';
import { PatientState } from '../../physiology';
import {
  PhysioState, PhysioEffects, getDefaultPhysioState,
  applyPhysioEffects, physioToVitals, physioTimeProgression
} from '../../physiologyEngine';
import { trackHistory, evaluateOutcome, TrendAnalysis } from './trendEngine';

export const septicEngineV3: ScenarioEngine = {
  name: 'septic_v3',

  update(ctx: EngineContext): PatientState {
    const { state } = ctx;
    const simTime = state.simTime;
    const newState = deepClone(state);
    const events = [...state.events];

    let physio: PhysioState = (state as any)._physio || getDefaultPhysioState();

    // ========== 1. Drug Effects ==========
    const runningOrders = state.activeOrders.filter(o => o.running);
    const drugEffects: PhysioEffects = {};

    runningOrders.forEach(order => {
      const effect = getSepticDrugPhysioEffect(order.name, order.dose);
      Object.assign(drugEffects, effect);
      if (order.type === 'bolus' && (simTime - order.startSimTime) > 10) {
        order.running = false;
      }
    });

    // ========== 2. SEPSIS PATHOPHYSIOLOGY (Rate-based) ==========
    const hasAntibiotics = state.activeOrders.some(o => o.category === 'antibiotic' && o.running);
    const sepsisEffects: PhysioEffects = {};

    if (!hasAntibiotics) {
      // Untreated sepsis: worsening over time
      const severityMultiplier = Math.min(1 + simTime / 120, 3); // يتضاعف كل ساعتين
      sepsisEffects.svrChange = -0.3 * severityMultiplier;
      sepsisEffects.capillaryLeak = 0.2 * severityMultiplier;
      sepsisEffects.contractility = -0.2 * severityMultiplier;
      sepsisEffects.lactateProduction = 0.3 * severityMultiplier;
      sepsisEffects.lactateClearance = -0.05 * severityMultiplier;
      
      if (simTime === 60 && !events.includes('DELAYED_ABX')) {
        events.push('⚠️ Antibiotics delayed over 1 hour - mortality increasing!');
      }
      if (simTime === 120 && !events.includes('CRITICAL_DELAY')) {
        events.push('🚨 2 hours without antibiotics - risk of irreversible shock!');
      }
    } else {
      // Treated: gradual recovery
      const abxOrder = state.activeOrders.find(o => o.category === 'antibiotic');
      const abxStarted = abxOrder ? simTime - abxOrder.startSimTime : 0;
      
      if (abxStarted > 30) {
        const recoveryRate = Math.min((abxStarted - 30) / 60, 1); // 0→1 over 60 min
        sepsisEffects.svrChange = 0.15 * recoveryRate;
        sepsisEffects.capillaryLeak = -0.08 * recoveryRate;
        sepsisEffects.lactateProduction = -0.15 * recoveryRate;
        sepsisEffects.lactateClearance = 0.05 * recoveryRate;
        sepsisEffects.tempChange = -0.08 * recoveryRate;
      }
      
      if (abxStarted > 60 && !events.includes('LACTATE_CLEARING')) {
        events.push('✅ Source control effective - lactate clearing');
      }
    }

    // ========== 3. Fluid Overload (with inertia) ==========
    if (physio.totalFluidGiven > 4000) {
      const overloadSeverity = (physio.totalFluidGiven - 4000) / 2000; // 0→1 over 2L
      sepsisEffects.oxygenation = -0.3 * overloadSeverity;
      sepsisEffects.airwayResistance = 0.2 * overloadSeverity;
      
      if (physio.totalFluidGiven > 6000 && !events.includes('PULMONARY_EDEMA')) {
        events.push('🚨 Pulmonary edema - severe fluid overload!');
      }
    }

    // ========== 4. Apply Effects ==========
    const combinedEffects: PhysioEffects = { ...sepsisEffects, ...drugEffects };
    physio = applyPhysioEffects(physio, combinedEffects);
    physio = physioTimeProgression(physio, simTime);
    
    // Convert to vitals
    const v = physioToVitals(physio, state.vitals);

    // ========== 5. Trend Tracking ==========
    newState.vitals = v;
    (newState as any)._physio = physio;
    const history = trackHistory(newState);

    // ========== 6. ORGAN PERFUSION ==========
    if (v.map < 65) {
      physio.renalPerfusion = clamp(physio.renalPerfusion - 2, 5, 100);
      if (v.urineOutput < 10 && !events.includes('OLIGURIA')) {
        events.push('⚠️ Oliguria - MAP <65mmHg, AKI risk');
      }
    }

    // ========== 7. OUTCOME EVALUATION ==========
    const newStatus = evaluateOutcome(
      newState,
      state.winConditions || { mapAbove: 65, lactateBelow: 2.5, spo2Above: 92, urineOutputAbove: 25 },
      state.loseConditions || { mapBelow: 25, spo2Below: 35, lactateAbove: 15 }
    );
    
    newState.status = newStatus as any;
    
    // Add trend-based events
    const trend = analyzeTrendFromHistory(history);
    if (trend.overallTrend === 'deteriorating' && !events.includes('DETERIORATING_TREND')) {
      events.push('⚠️ Patient trending downward - reassess management');
    }

    newState.events = events;
    (newState as any)._physio = physio;

    return newState;
  }
};

// ========== Helpers ==========
function analyzeTrendFromHistory(history: any[]): TrendAnalysis {
  if (history.length < 3) {
    return {
      mapTrend: 'stable', lactateTrend: 'stable', spo2Trend: 'stable',
      overallTrend: 'stable', mapSlope: 0, lactateSlope: 0, sustainedHypotension: 0,
    };
  }
  const first = history[0];
  const last = history[history.length - 1];
  const mapSlope = (last.map - first.map) / (last.simTime - first.simTime || 1);
  const lactateSlope = (last.lactate - first.lactate) / (last.simTime - first.simTime || 1);
  
  let sustainedHypotension = 0;
  for (const s of history) { if (s.map < 65) sustainedHypotension += 2; }
  
  const mapTrend = mapSlope > 0.3 ? 'rising' : mapSlope < -0.3 ? 'falling' : 'stable';
  const lactateTrend = lactateSlope < -0.05 ? 'clearing' : lactateSlope > 0.05 ? 'rising' : 'stable';
  const score = (mapSlope > 0 ? 1 : -1) + (lactateSlope < 0 ? 1 : -1);
  const overallTrend = score >= 1 ? 'improving' : score <= -1 ? 'deteriorating' : 'stable';
  
  return { mapTrend, lactateTrend, spo2Trend: 'stable', overallTrend, mapSlope, lactateSlope, sustainedHypotension } as TrendAnalysis;
}

function getSepticDrugPhysioEffect(name: string, dose: string): PhysioEffects {
  const base = doseToFactor(dose);
  const effects: Record<string, PhysioEffects> = {
    'Noradrenaline': { svrChange: 0.5 * base, contractility: 0.2 * base, hrChange: -2 },
    'Adrenaline': { svrChange: 0.7 * base, contractility: 0.5 * base, hrChange: 5, metabolicRate: 0.3 },
    'Vasopressin': { svrChange: 0.3 * base },
    'Dobutamine': { contractility: 0.6 * base, svrChange: -0.1, hrChange: 3 },
    'Normal Saline 500mL': { venousReturn: 0.3 },
    'Normal Saline 1000mL': { venousReturn: 0.6 },
    'Furosemide 20mg IV': { gfrChange: -0.3, venousReturn: -0.2 },
    'Hydrocortisone 50mg': { svrChange: 0.15, capillaryLeak: -0.1 },
  };
  return effects[name] || {};
}

function doseToFactor(dose: string): number {
  const match = dose.match(/([\d.]+)/);
  if (!match) return 1;
  const value = parseFloat(match[1]);
  if (dose.includes('mcg/kg/min')) return Math.min(value / 0.1, 3);
  if (dose.includes('mg')) return Math.min(value / 50, 2);
  if (dose.includes('mL')) return Math.min(value / 500, 2);
  return 1;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
