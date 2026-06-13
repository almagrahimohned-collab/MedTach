// ========== ABG Real-Time Calculator ==========
// يحسب قيم ABG بناءً على vitals + ventilator settings

export interface ABGResult {
  ph: number;
  pao2: number;
  paco2: number;
  hco3: number;
  baseExcess: number;
  sao2: number;
  lactate: number;
  
  // Interpretations
  oxygenation: string;
  ventilation: string;
  acidBase: string;
  primaryDisorder: string;
  compensation: string;
  anionGap?: number;
  expectedCompensation?: string;
}

export interface ABGInputs {
  // Patient vitals
  spo2: number;
  rr: number;
  temp: number;
  lactate: number;
  
  // Ventilator
  fio2: number;
  peep: number;
  tidalVolume: number;
  mode: string;
  
  // Labs (from DKA or scenario)
  glucose?: number;
  potassium?: number;
  sodium?: number;
  chloride?: number;
  bicarbonate?: number;
  ketones?: number;
}

// ========== Core Calculation ==========
export function calculateABG(inputs: ABGInputs): ABGResult {
  const { spo2, rr, temp, lactate, fio2, peep, tidalVolume } = inputs;
  
  // ===== PaO2 Calculation (Alveolar Gas Equation) =====
  const barometricPressure = 760; // mmHg at sea level
  const waterVapor = 47; // mmHg
  const pio2 = fio2 * (barometricPressure - waterVapor);
  
  // A-a gradient based on disease severity
  const aAGradient = estimateAAGradient(spo2, fio2, peep);
  
  // PaO2 = PIO2 - (PaCO2/RQ) - A-a gradient
  const paco2Est = estimatePaCO2(rr, tidalVolume, temp);
  const respiratoryQuotient = 0.8;
  const pao2 = Math.max(30, Math.min(500, pio2 - (paco2Est / respiratoryQuotient) - aAGradient));
  
  // ===== PaCO2 Calculation =====
  const paco2 = paco2Est;
  
  // ===== pH & HCO3 Calculation =====
  // Henderson-Hasselbalch simplified
  const hco3Base = inputs.bicarbonate || 24;
  
  // Adjust HCO3 based on lactate and ketones
  let hco3 = hco3Base - (lactate > 2 ? (lactate - 2) * 2 : 0);
  if (inputs.ketones && inputs.ketones > 1) {
    hco3 -= inputs.ketones * 1.5;
  }
  hco3 = Math.max(2, Math.min(40, hco3));
  
  // pH = 6.1 + log(HCO3 / (0.03 * PaCO2))
  const phRaw = 6.1 + Math.log10(hco3 / (0.03 * paco2));
  const ph = Math.round(phRaw * 100) / 100;
  
  // ===== Base Excess =====
  const baseExcess = Math.round(((hco3 - 24.4) + (2.3 * (7.4 - ph))) * 10) / 10;
  
  // ===== SaO2 =====
  const sao2 = Math.round(calculateSaO2(pao2, ph, temp) * 10) / 10;
  
  // ===== Anion Gap =====
  let anionGap: number | undefined;
  if (inputs.sodium && inputs.chloride) {
    anionGap = Math.round((inputs.sodium - inputs.chloride - hco3) * 10) / 10;
  }
  
  // ===== Interpretations =====
  const oxygenation = interpretOxygenation(pao2, fio2, spo2);
  const ventilation = interpretVentilation(paco2);
  const acidBase = interpretAcidBase(ph, paco2, hco3, anionGap);
  
  return {
    ph,
    pao2: Math.round(pao2),
    paco2: Math.round(paco2),
    hco3: Math.round(hco3 * 10) / 10,
    baseExcess,
    sao2,
    lactate,
    oxygenation,
    ventilation,
    acidBase,
    primaryDisorder: acidBase.split('\n')[0] || 'Normal',
    compensation: acidBase.includes('Compensated') ? 'Compensated' : 
                  acidBase.includes('Uncompensated') ? 'Uncompensated' : 'Normal',
    anionGap,
    expectedCompensation: calculateExpectedCompensation(ph, paco2, hco3),
  };
}

// ========== Helper Functions ==========

function estimateAAGradient(spo2: number, fio2: number, peep: number): number {
  // Normal A-a gradient ~10-15 on room air
  let gradient = 15;
  
  // Increases with lung injury
  if (spo2 < 95) gradient += (95 - spo2) * 2;
  if (spo2 < 90) gradient += 20;
  if (spo2 < 85) gradient += 30;
  
  // PEEP improves A-a gradient slightly
  gradient -= peep * 1.5;
  
  // FiO2 effect
  gradient *= (0.5 + fio2 * 0.5);
  
  return Math.max(5, Math.min(500, gradient));
}

function estimatePaCO2(rr: number, tv: number, temp: number): number {
  // Minute ventilation
  const mv = rr * tv / 1000; // L/min
  
  // CO2 production (increases with temp)
  const co2Production = 200 + (temp - 37) * 25; // mL/min
  
  // PaCO2 = CO2 production / alveolar ventilation
  const deadSpace = 150; // mL
  const alveolarVentilation = Math.max(1, rr * (tv - deadSpace) / 1000);
  
  const paco2 = Math.max(15, Math.min(80, Math.round(co2Production / alveolarVentilation / 10)));
  
  // Fever increases CO2
  return paco2;
}

function calculateSaO2(pao2: number, ph: number, temp: number): number {
  // Hill equation for oxyhemoglobin
  const p50 = 26.7; // mmHg
  const n = 2.7; // Hill coefficient
  
  // Bohr effect: pH shifts curve
  const p50Adjusted = p50 * Math.pow(10, 0.48 * (7.4 - ph));
  
  // Temp effect
  const p50Final = p50Adjusted * (1 + (temp - 37) * 0.02);
  
  const sao2 = Math.pow(pao2, n) / (Math.pow(p50Final, n) + Math.pow(pao2, n)) * 100;
  
  return Math.max(30, Math.min(100, sao2));
}

// ========== Interpretation Functions ==========

function interpretOxygenation(pao2: number, fio2: number, spo2: number): string {
  const pfRatio = pao2 / fio2;
  
  if (pfRatio > 400) return 'Normal Oxygenation';
  if (pfRatio > 300) return 'Mild Hypoxemia';
  if (pfRatio > 200) return 'Moderate Hypoxemia (ALI)';
  if (pfRatio > 100) return 'Severe Hypoxemia (ARDS)';
  return 'Critical Hypoxemia';
}

function interpretVentilation(paco2: number): string {
  if (paco2 < 25) return 'Severe Hyperventilation';
  if (paco2 < 35) return 'Mild Hyperventilation';
  if (paco2 <= 45) return 'Normal Ventilation';
  if (paco2 <= 55) return 'Mild Hypoventilation';
  return 'Severe Hypoventilation';
}

function interpretAcidBase(ph: number, paco2: number, hco3: number, ag?: number): string {
  // Normal ranges
  const normalPH = ph >= 7.35 && ph <= 7.45;
  const acidemic = ph < 7.35;
  const alkalemic = ph > 7.45;
  
  const respAcidosis = paco2 > 45;
  const respAlkalosis = paco2 < 35;
  const metAcidosis = hco3 < 22;
  const metAlkalosis = hco3 > 26;
  
  let result = '';
  
  if (normalPH && !respAcidosis && !respAlkalosis && !metAcidosis && !metAlkalosis) {
    return 'Normal Acid-Base Status';
  }
  
  // Primary disorder
  if (acidemic) {
    if (respAcidosis && metAcidosis) {
      result = 'Mixed Respiratory & Metabolic Acidosis';
    } else if (respAcidosis) {
      result = 'Respiratory Acidosis';
      // Check compensation
      const expectedHCO3 = 24 + (paco2 - 40) * 0.1; // Acute
      if (hco3 > expectedHCO3 + 2) result += '\nPartially Compensated';
      else result += '\nUncompensated';
    } else if (metAcidosis) {
      result = 'Metabolic Acidosis';
      if (ag && ag > 12) result += '\n↑ Anion Gap (' + ag + ')';
      else if (ag !== undefined) result += '\nNon-Anion Gap';
      // Winter's formula
      const expectedPaCO2 = 1.5 * hco3 + 8;
      if (paco2 < expectedPaCO2 - 2) result += '\nWith Respiratory Alkalosis';
      else if (paco2 > expectedPaCO2 + 2) result += '\nWith Respiratory Acidosis';
      else result += '\nCompensated';
    }
  } else if (alkalemic) {
    if (respAlkalosis && metAlkalosis) {
      result = 'Mixed Respiratory & Metabolic Alkalosis';
    } else if (respAlkalosis) {
      result = 'Respiratory Alkalosis';
    } else if (metAlkalosis) {
      result = 'Metabolic Alkalosis';
    }
  } else if (normalPH) {
    // Mixed disorder with normal pH
    if (respAcidosis && metAlkalosis) result = 'Mixed Respiratory Acidosis + Metabolic Alkalosis';
    else if (respAlkalosis && metAcidosis) result = 'Mixed Respiratory Alkalosis + Metabolic Acidosis';
    else result = 'Compensated Disorder';
  }
  
  return result || 'Indeterminate';
}

function calculateExpectedCompensation(ph: number, paco2: number, hco3: number): string {
  if (ph < 7.35 && hco3 < 22) {
    // Metabolic acidosis - Winter's formula
    const expected = 1.5 * hco3 + 8;
    return `Expected PaCO₂: ${Math.round(expected)} mmHg (Winter's Formula)`;
  }
  if (ph > 7.45 && hco3 > 26) {
    return `Expected PaCO₂: ${Math.round(0.7 * hco3 + 20)} mmHg`;
  }
  if (ph < 7.35 && paco2 > 45) {
    // Acute respiratory acidosis
    const expected = 24 + (paco2 - 40) * 0.1;
    return `Expected HCO₃: ${Math.round(expected * 10) / 10} mEq/L (Acute)`;
  }
  return 'Within expected range';
}

// ========== Generate ABG Report Text ==========
export function generateABGReport(abg: ABGResult): string {
  return `ABG Report
━━━━━━━━━━━━━━━━━━
pH:     ${abg.ph.toFixed(2)}  (7.35-7.45)
PaO₂:   ${abg.pao2} mmHg  (80-100)
PaCO₂:  ${abg.paco2} mmHg  (35-45)
HCO₃:   ${abg.hco3} mEq/L  (22-26)
BE:     ${abg.baseExcess} mEq/L  (-2 to +2)
SaO₂:   ${abg.sao2}%
Lactate: ${abg.lactate} mmol/L
${abg.anionGap ? 'Anion Gap: ' + abg.anionGap + ' mEq/L  (8-12)\n' : ''}
━━━━━━━━━━━━━━━━━━
📊 P/F Ratio: ${Math.round(abg.pao2 / 0.6)}
🫁 ${abg.oxygenation}
💨 ${abg.ventilation}
🧪 ${abg.primaryDisorder}
${abg.expectedCompensation || ''}`;
}
