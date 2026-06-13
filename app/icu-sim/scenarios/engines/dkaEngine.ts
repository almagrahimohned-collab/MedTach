import { ScenarioEngine, EngineContext } from './types';
import { calculateMAP, PatientState } from '../../physiology';

export const dkaEngine: ScenarioEngine = {
  name: 'dka',
  update(ctx: EngineContext): PatientState {
    const { state } = ctx;
    const v = { ...state.vitals };
    const events = [...state.events];
    const newState = { ...state };
    const simTime = state.simTime;
    const runningOrders = state.activeOrders.filter(o => o.running);

    runningOrders.forEach(order => {
      const effect = getDKADrugEffect(order.name);
      if (effect.hr) v.hr = Math.max(30, Math.min(180, v.hr + effect.hr));
      if (effect.bpSystolic) v.bp.systolic = Math.max(35, Math.min(200, v.bp.systolic + effect.bpSystolic));
      if (effect.spo2) v.spo2 = Math.max(50, Math.min(100, v.spo2 + effect.spo2));
      if (effect.ph) v.ph = Math.max(6.8, Math.min(7.5, Math.round((v.ph + effect.ph) * 100) / 100));
      if (effect.hco3) v.hco3 = Math.max(2, Math.min(35, v.hco3 + effect.hco3));
      if (effect.urineOutput) v.urineOutput = Math.max(0, Math.min(300, v.urineOutput + effect.urineOutput));
      if (effect.cvp) v.cvp = Math.max(0, Math.min(25, v.cvp + effect.cvp));
      if (order.type === 'bolus' && (simTime - order.startSimTime) > 10) order.running = false;
    });

    const hasInsulin = state.activeOrders.some(o => o.category === 'hormone' && o.name.includes('Insulin'));
    const hasFluids = state.activeOrders.some(o => o.category === 'fluid' && o.running);

    if (!hasInsulin && !hasFluids && simTime % 5 === 0 && simTime > 0) {
      v.ph = Math.max(6.8, Math.round((v.ph - 0.02) * 100) / 100);
      v.hco3 = Math.max(2, v.hco3 - 1);
      v.hr = Math.min(180, v.hr + 3);
      v.rr = Math.min(45, v.rr + 1);
    }

    if (hasInsulin && simTime % 10 === 0) {
      const insulinOrder = state.activeOrders.find(o => o.category === 'hormone' && o.name.includes('Insulin'));
      const insulinStarted = insulinOrder ? simTime - insulinOrder.startSimTime : 0;
      if (insulinStarted > 30) {
        v.ph = Math.min(7.45, Math.round((v.ph + 0.01) * 100) / 100);
        v.hco3 = Math.min(30, v.hco3 + 1);
        v.rr = Math.max(12, v.rr - 1);
        v.hr = Math.max(60, v.hr - 2);
      }
    }

    if (hasFluids && simTime % 5 === 0) {
      v.urineOutput = Math.min(300, v.urineOutput + 3);
      v.hr = Math.max(60, v.hr - 1);
    }

    v.map = calculateMAP(v.bp.systolic, v.bp.diastolic);
    if (v.map < 65 && simTime % 5 === 0) v.urineOutput = Math.max(0, v.urineOutput - 1);

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
    if (!hasInsulin && simTime > 120 && v.ph < 7.05 && newState.status !== 'dead') {
      newState.status = 'deteriorating';
    }

    newState.vitals = v;
    newState.events = events;
    return newState;
  }
};

interface DrugEffect {
  hr?: number; bpSystolic?: number; bpDiastolic?: number;
  spo2?: number; rr?: number; temp?: number;
  cvp?: number; urineOutput?: number; ph?: number; hco3?: number;
}

function getDKADrugEffect(name: string): DrugEffect {
  const effects: Record<string, DrugEffect> = {
    'Normal Saline 1000mL': { cvp: 3, urineOutput: 8, hr: -5 },
    'Normal Saline 500mL': { cvp: 2, urineOutput: 4, hr: -3 },
    'Insulin Regular 10u IV': { ph: 0.03, hco3: 2, hr: -3 },
    'Potassium Chloride 20mEq': { hr: -2 },
  };
  return effects[name] || {};
}
