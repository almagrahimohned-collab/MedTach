import { ScenarioEngine, EngineContext } from './types';
import { PatientState } from '../../physiology';
import {
  PhysioState, PhysioEffects, getDefaultPhysioState,
  applyPhysioEffects, physioToVitals, physioTimeProgression
} from '../../physiologyEngine';

export const septicEngineV2: ScenarioEngine = {
  name: 'septic_v2',

  update(ctx: EngineContext): PatientState {
    const { state } = ctx;
    const simTime = state.simTime;
    const newState = deepClone(state);
    const events = [...state.events];

    let physio: PhysioState = (state as any)._physio || getDefaultPhysioState();

    const runningOrders = state.activeOrders.filter(o => o.running);
    const drugEffects: PhysioEffects = {};

    runningOrders.forEach(order => {
      const effect = getSepticDrugPhysioEffect(order.name, order.dose);
      Object.assign(drugEffects, effect);
      if (order.type === 'bolus' && (simTime - order.startSimTime) > 10) {
        order.running = false;
      }
    });

    const hasAntibiotics = state.activeOrders.some(o => o.category === 'antibiotic' && o.running);
    const sepsisEffects: PhysioEffects = {};

    if (!hasAntibiotics) {
      if (simTime % 5 === 0 && simTime > 0) {
        sepsisEffects.svrChange = -0.3;
        sepsisEffects.capillaryLeak = 0.2;
        sepsisEffects.contractility = -0.2;
        sepsisEffects.lactateProduction = 0.3;
        sepsisEffects.lactateClearance = -0.05;
      }
      if (simTime === 60 && !events.includes('DELAYED_ABX')) {
        events.push('⚠️ Antibiotics delayed over 1 hour!');
      }
    } else {
      const abxOrder = state.activeOrders.find(o => o.category === 'antibiotic');
      const abxStarted = abxOrder ? simTime - abxOrder.startSimTime : 0;
      if (abxStarted > 30 && simTime % 10 === 0) {
        sepsisEffects.svrChange = 0.1;
        sepsisEffects.capillaryLeak = -0.05;
        sepsisEffects.lactateProduction = -0.1;
        sepsisEffects.tempChange = -0.05;
      }
      if (abxStarted > 60 && !events.includes('LACTATE_CLEARING')) {
        events.push('✅ Source control effective - lactate clearing');
      }
    }

    if (physio.totalFluidGiven > 4000 && simTime % 10 === 0) {
      sepsisEffects.oxygenation = -0.2;
      if (physio.totalFluidGiven > 6000 && !events.includes('PULMONARY_EDEMA')) {
        events.push('🚨 Pulmonary edema - fluid overload!');
      }
    }

    const hasDiuretics = runningOrders.some(o => o.category === 'diuretic');
    if (hasDiuretics && physio.intravascularVolume < 40) {
      sepsisEffects.svrChange = -0.2;
    }

    const combinedEffects: PhysioEffects = { ...sepsisEffects, ...drugEffects };
    physio = applyPhysioEffects(physio, combinedEffects);
    physio = physioTimeProgression(physio, simTime);
    const v = physioToVitals(physio, state.vitals);

    if (v.map < 65 && simTime % 5 === 0) {
      physio.renalPerfusion = clamp(physio.renalPerfusion - 3, 5, 100);
      if (v.urineOutput < 10 && !events.includes('OLIGURIA')) {
        events.push('⚠️ Oliguria - MAP <65mmHg, AKI risk');
      }
    }
    if (v.map > 65 && physio.renalPerfusion < 100 && simTime % 10 === 0) {
      physio.renalPerfusion = clamp(physio.renalPerfusion + 1, 5, 100);
    }

    if (state.loseConditions?.check) {
      if (state.loseConditions.check({ ...newState, vitals: v, events })) {
        newState.status = 'dead';
        if (!events.includes('DEATH')) events.push('💀 ' + state.loseConditions.description);
      }
    }
    if (state.winConditions?.check) {
      if (state.winConditions.check({ ...newState, vitals: v, events })) {
        if (newState.status === 'critical' || newState.status === 'deteriorating') {
          newState.status = 'improving';
          events.push('✅ ' + state.winConditions.description);
        }
      }
    }
    if (!hasAntibiotics && simTime > 90 && v.map < 55 && newState.status !== 'dead') {
      newState.status = 'deteriorating';
    }

    newState.vitals = v;
    newState.events = events;
    (newState as any)._physio = physio;

    return newState;
  }
};

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
