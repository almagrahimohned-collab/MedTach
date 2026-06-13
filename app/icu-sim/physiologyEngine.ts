// ========== Physiology Core Engine ==========
// هذا المحرك يعالج العلامات الحيوية والاستجابات الفسيولوجية
// بشكل مستقل عن المرض الأساسي

import { VitalSigns, PatientState } from './physiology';

// ========== واجهة التأثيرات ==========
export interface PhysioEffects {
  hrChange?: number;
  contractility?: number;
  svrChange?: number;
  rrChange?: number;
  oxygenation?: number;
  airwayResistance?: number;
  gfrChange?: number;
  urineOutputChange?: number;
  venousReturn?: number;
  capillaryLeak?: number;
  metabolicRate?: number;
  lactateProduction?: number;
  lactateClearance?: number;
  tempChange?: number;
}

// ========== الحالة الداخلية للمحرك ==========
export interface PhysioState {
  intravascularVolume: number;
  extravascularVolume: number;
  myocardialFunction: number;
  svr: number;
  renalPerfusion: number;
  cerebralPerfusion: number;
  splanchnicPerfusion: number;
  oxygenDelivery: number;
  oxygenConsumption: number;
  lactateProduction: number;
  lactateClearance: number;
  alveolarVentilation: number;
  vqMismatch: number;
  totalFluidGiven: number;
  fluidBalance: number;
}

// ========== دالة حساب MAP محلية (لا تعتمد على physiology.ts) ==========
function calculateMAP(sys: number, dia: number): number {
  return Math.round(dia + (sys - dia) / 3);
}

// ========== القيم الافتراضية ==========
export function getDefaultPhysioState(): PhysioState {
  return {
    intravascularVolume: 70,
    extravascularVolume: 30,
    myocardialFunction: 80,
    svr: 100,
    renalPerfusion: 100,
    cerebralPerfusion: 100,
    splanchnicPerfusion: 100,
    oxygenDelivery: 100,
    oxygenConsumption: 100,
    lactateProduction: 0.5,
    lactateClearance: 0.8,
    alveolarVentilation: 100,
    vqMismatch: 0.1,
    totalFluidGiven: 0,
    fluidBalance: 0,
  };
}

// ========== تطبيق التأثيرات على الفسيولوجي ==========
export function applyPhysioEffects(physio: PhysioState, effects: PhysioEffects): PhysioState {
  const p = deepClone(physio);
  
  if (effects.contractility !== undefined) {
    p.myocardialFunction = clamp(p.myocardialFunction + effects.contractility * 10, 10, 100);
  }
  if (effects.svrChange !== undefined) {
    p.svr = clamp(p.svr + effects.svrChange * 15, 30, 200);
  }
  if (effects.venousReturn !== undefined) {
    p.intravascularVolume = clamp(p.intravascularVolume + effects.venousReturn * 5, 20, 100);
  }
  if (effects.oxygenation !== undefined) {
    p.alveolarVentilation = clamp(p.alveolarVentilation + effects.oxygenation * 10, 30, 150);
  }
  if (effects.airwayResistance !== undefined) {
    p.vqMismatch = clamp(p.vqMismatch + effects.airwayResistance * 0.1, 0, 0.9);
  }
  if (effects.gfrChange !== undefined) {
    p.renalPerfusion = clamp(p.renalPerfusion + effects.gfrChange * 15, 5, 100);
  }
  if (effects.capillaryLeak !== undefined) {
    p.extravascularVolume = clamp(p.extravascularVolume + effects.capillaryLeak * 5, 10, 80);
    p.intravascularVolume = clamp(p.intravascularVolume - effects.capillaryLeak * 3, 20, 100);
  }
  if (effects.lactateProduction !== undefined) {
    p.lactateProduction = clamp(p.lactateProduction + effects.lactateProduction, 0.1, 10);
  }
  if (effects.lactateClearance !== undefined) {
    p.lactateClearance = clamp(p.lactateClearance + effects.lactateClearance, 0.1, 1);
  }
  if (effects.metabolicRate !== undefined) {
    p.oxygenConsumption = clamp(p.oxygenConsumption + effects.metabolicRate * 10, 50, 200);
  }
  if (effects.tempChange !== undefined) {
    p.oxygenConsumption = clamp(p.oxygenConsumption + effects.tempChange * 3, 50, 200);
  }
  
  return p;
}

// ========== تحويل PhysioState إلى VitalSigns ==========
export function physioToVitals(physio: PhysioState, baseVitals: VitalSigns): VitalSigns {
  const hrBase = baseVitals.hr || 80;
  const hrSvrEffect = (physio.svr < 70) ? 20 : (physio.svr > 130) ? -10 : 0;
  const hrContractilityEffect = (physio.myocardialFunction < 50) ? 15 : 0;
  const hrOxygenEffect = (physio.oxygenDelivery < 70) ? 10 : 0;
  const hr = clamp(Math.round(hrBase + hrSvrEffect + hrContractilityEffect + hrOxygenEffect), 30, 200);

  const sysBase = baseVitals.bp?.systolic || 120;
  const sysSvrEffect = (physio.svr - 100) * 0.3;
  const sysContractEffect = (physio.myocardialFunction - 80) * 0.4;
  const sysVolumeEffect = (physio.intravascularVolume - 70) * 0.5;
  const systolic = clamp(Math.round(sysBase + sysSvrEffect + sysContractEffect + sysVolumeEffect), 35, 220);
  const diastolic = clamp(Math.round(systolic * 0.55 + physio.svr * 0.1), 20, 130);
  const map = calculateMAP(systolic, diastolic);

  const spo2Base = baseVitals.spo2 || 98;
  const spo2VentEffect = (physio.alveolarVentilation - 100) * 0.1;
  const spo2VqEffect = -physio.vqMismatch * 30;
  const spo2 = clamp(Math.round(spo2Base + spo2VentEffect + spo2VqEffect), 40, 100);

  const rrBase = baseVitals.rr || 16;
  const rrOxygenEffect = (physio.oxygenDelivery < 70) ? 8 : 0;
  const rrMetabolicEffect = (physio.oxygenConsumption > 120) ? 6 : 0;
  const rr = clamp(Math.round(rrBase + rrOxygenEffect + rrMetabolicEffect), 4, 50);

  const cvp = clamp(Math.round(physio.intravascularVolume * 0.15 + (100 - physio.myocardialFunction) * 0.05), 0, 25);

  const uoBase = 30;
  const uoRenalEffect = (physio.renalPerfusion - 100) * 0.4;
  const uoMapEffect = map > 65 ? 0 : (map - 65) * 0.5;
  const urineOutput = clamp(Math.round(uoBase + uoRenalEffect + uoMapEffect), 0, 300);

  const lactateProd = physio.lactateProduction;
  const lactateClear = physio.lactateClearance;
  const lactateOxygenEffect = physio.oxygenDelivery < 60 ? 2 : 0;
  const lactate = clamp(
    Math.round((lactateProd / lactateClear + lactateOxygenEffect) * 10) / 10,
    0.5, 20
  );

  return {
    ...baseVitals,
    hr,
    bp: { systolic, diastolic },
    map,
    spo2,
    rr,
    cvp,
    urineOutput,
    lactate,
    gcs: baseVitals.gcs ?? 15,
    etco2: baseVitals.etco2 ?? 35,
    ph: baseVitals.ph ?? 7.4,
    pao2: baseVitals.pao2 ?? 95,
    paco2: baseVitals.paco2 ?? 40,
    hco3: baseVitals.hco3 ?? 24,
    baseExcess: baseVitals.baseExcess ?? 0,
  };
}

// ========== تطور الفسيولوجي الطبيعي مع الزمن ==========
export function physioTimeProgression(physio: PhysioState, simTime: number): PhysioState {
  const p = deepClone(physio);
  
  if (simTime % 5 === 0 && simTime > 0) {
    if (p.myocardialFunction > 40 && p.svr < 150) {
      p.svr = clamp(p.svr + 2, 30, 200);
    }
    if (p.splanchnicPerfusion > 50 && p.lactateClearance < 0.8) {
      p.lactateClearance = clamp(p.lactateClearance + 0.02, 0.1, 1);
    }
    if (p.intravascularVolume > 60 && p.extravascularVolume > 20) {
      p.intravascularVolume = clamp(p.intravascularVolume - 0.5, 20, 100);
      p.extravascularVolume = clamp(p.extravascularVolume + 0.3, 10, 80);
    }
  }
  
  return p;
}

// ========== دوال مساعدة ==========
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
