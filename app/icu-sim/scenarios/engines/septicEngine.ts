import { ScenarioEngine, EngineContext } from './types';
import { calculateMAP, PatientState } from '../../physiology';

export const septicEngine: ScenarioEngine = {
  name: 'septic',
  update(ctx: EngineContext): PatientState {
    const { state } = ctx;
    const v = { ...state.vitals };
    const events = [...state.events];
    const newState = { ...state };
    const simTime = state.simTime;
    const runningOrders = state.activeOrders.filter(o => o.running);

    runningOrders.forEach(order => {
      const effect = getSepticDrugEffect(order.name);
      if (effect.bpSystolic) v.bp.systolic = Math.max(35, Math.min(200, v.bp.systolic + effect.bpSystolic));
      if (effect.bpDiastolic) v.bp.diastolic = Math.max(20, Math.min(120, v.bp.diastolic + effect.bpDiastolic));
      if (effect.hr) v.hr = Math.max(30, Math.min(180, v.hr + effect.hr));
      if (effect.spo2) v.spo2 = Math.max(50, Math.min(100, v.spo2 + effect.spo2));
      if (effect.rr) v.rr = Math.max(0, Math.min(50, v.rr + effect.rr));
      if (effect.temp) v.temp = Math.max(35, Math.min(41, Math.round((v.temp + effect.temp) * 10) / 10));
      if (effect.cvp) v.cvp = Math.max(0, Math.min(25, v.cvp + effect.cvp));
      if (effect.urineOutput) v.urineOutput = Math.max(0, Math.min(300, v.urineOutput + effect.urineOutput));
      if (effect.lactate) v.lactate = Math.max(0.5, Math.round((v.lactate + effect.lactate) * 10) / 10);
      if (order.type === 'bolus' && (simTime - order.startSimTime) > 10) order.running = false;
    });

    const hasAntibiotics = state.activeOrders.some(o => o.category === 'antibiotic' && o.running);
    if (!hasAntibiotics && simTime % 5 === 0 && simTime > 0) {
      v.bp.systolic = Math.max(40, v.bp.systolic - 1);
      v.bp.diastolic = Math.max(20, v.bp.diastolic - 1);
      v.hr = Math.min(180, v.hr + 2);
      v.lactate = Math.min(15, Math.round((v.lactate + 0.2) * 10) / 10);
    }

    if (hasAntibiotics && simTime % 10 === 0) {
      const abxOrder = state.activeOrders.find(o => o.category === 'antibiotic');
      const abxStarted = abxOrder ? simTime - abxOrder.startSimTime : 0;
      if (abxStarted > 30) {
        v.temp = Math.max(36.5, Math.round((v.temp - 0.05) * 10) / 10);
        v.lactate = Math.max(1, Math.round((v.lactate - 0.1) * 10) / 10);
        v.hr = Math.max(60, v.hr - 1);
      }
    }

    if (v.cvp > 16 && simTime % 10 === 0) {
      v.spo2 = Math.max(70, v.spo2 - 2);
      v.rr = Math.min(50, v.rr + 2);
    }

    const hasDiuretics = runningOrders.some(o => o.category === 'diuretic');
    if (hasDiuretics && v.cvp < 4 && simTime % 5 === 0) {
      v.bp.systolic = Math.max(40, v.bp.systolic - 2);
      v.hr = Math.min(180, v.hr + 3);
    }

    v.map = calculateMAP(v.bp.systolic, v.bp.diastolic);
    if (v.map < 65 && simTime % 5 === 0) v.urineOutput = Math.max(0, v.urineOutput - 2);
    if (simTime % 10 === 0) {
      const tempDelta = v.temp - 37;
      v.hr = Math.max(35, Math.min(180, Math.round(v.hr + tempDelta * 6)));
    }

    if (state.loseConditions?.check && state.loseConditions.check({ ...newState, vitals: v, events })) {
      newState.status = 'dead';
      if (!events.includes('DEATH')) events.push('💀 Patient expired');
    }
    if (state.winConditions?.check && state.winConditions.check({ ...newState, vitals: v, events })) {
      if (newState.status === 'critical' || newState.status === 'deteriorating') {
        newState.status = 'improving';
        events.push('✅ Patient improving');
      }
    }
    if (!hasAntibiotics && simTime > 90 && v.map < 55 && newState.status !== 'dead') {
      newState.status = 'deteriorating';
    }

    newState.vitals = v;
    newState.events = events;
    return newState;
  }
};

interface DrugEffect {
  bpSystolic?: number; bpDiastolic?: number; hr?: number;
  spo2?: number; rr?: number; temp?: number;
  cvp?: number; urineOutput?: number; lactate?: number;
}

function getSepticDrugEffect(name: string): DrugEffect {
  const effects: Record<string, DrugEffect> = {
    'Noradrenaline': { bpSystolic: 3, bpDiastolic: 2, hr: -2 },
    'Adrenaline': { bpSystolic: 5, bpDiastolic: 3, hr: 5 },
    'Vasopressin': { bpSystolic: 2, bpDiastolic: 1 },
    'Dopamine': { bpSystolic: 2, hr: 2, urineOutput: 2 },
    'Dobutamine': { bpSystolic: 3, hr: 3, urineOutput: 3 },
    'Normal Saline 500mL': { bpSystolic: 4, bpDiastolic: 2, cvp: 2, urineOutput: 3 },
    'Normal Saline 1000mL': { bpSystolic: 7, bpDiastolic: 4, cvp: 4, urineOutput: 5 },
    'Furosemide 20mg IV': { cvp: -1, urineOutput: 8 },
    'Furosemide 40mg IV': { cvp: -2, urineOutput: 12 },
    'Hydrocortisone 50mg': { bpSystolic: 2, temp: -0.1 },
    'Propofol': { hr: -3, rr: -2, bpSystolic: -2 },
    'Midazolam': { hr: -2, rr: -1 },
    'Fentanyl': { hr: -3, rr: -3 },
    'Amiodarone': { hr: -8, bpSystolic: -2 },
  };
  return effects[name] || {};
}
