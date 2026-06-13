export interface Medication {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  dose: string;
  unit: string;
  route: string;
  frequency: string;
  maxDose: string;
  notes: string;
}

export const MEDICATION_CATEGORIES = [
  { id: 'vasopressor', name: '💉 Vasopressors', icon: 'trending-up' },
  { id: 'inotrope', name: '💓 Inotropes', icon: 'heart' },
  { id: 'antiarrhythmic', name: '⚡ Antiarrhythmics', icon: 'pulse' },
  { id: 'antibiotic', name: '🦠 Antibiotics', icon: 'bug' },
  { id: 'sedation', name: '😴 Sedation & Analgesia', icon: 'moon' },
  { id: 'paralytic', name: '💪 Paralytics', icon: 'fitness' },
  { id: 'fluid', name: '💧 Fluids & Blood', icon: 'water' },
  { id: 'anticoagulation', name: '🩸 Anticoagulation', icon: 'color-filter' },
  { id: 'steroid', name: '💊 Steroids & Hormones', icon: 'flask' },
  { id: 'diuretic', name: '🚿 Diuretics', icon: 'rainy' },
  { id: 'gi', name: '🔬 Gastrointestinal', icon: 'restaurant' },
  { id: 'respiratory', name: '🫁 Respiratory', icon: 'leaf' },
  { id: 'electrolyte', name: '⚡ Electrolytes', icon: 'flash' },
  { id: 'antidote', name: '🛡️ Antidotes/Reversal', icon: 'shield' },
];

export const ALL_MEDICATIONS: Medication[] = [
  // VASOPRESSORS
  { id: 'noradrenaline', name: 'Noradrenaline', category: 'vasopressor', subcategory: 'Alpha+Beta', dose: '0.05-2', unit: 'mcg/kg/min', route: 'IV infusion', frequency: 'Continuous', maxDose: '3 mcg/kg/min', notes: 'First-line for septic shock' },
  { id: 'adrenaline', name: 'Adrenaline', category: 'vasopressor', subcategory: 'Alpha+Beta', dose: '0.05-1', unit: 'mcg/kg/min', route: 'IV infusion', frequency: 'Continuous', maxDose: '2 mcg/kg/min', notes: 'Anaphylaxis, refractory shock' },
  { id: 'vasopressin', name: 'Vasopressin', category: 'vasopressor', subcategory: 'V1 receptor', dose: '0.01-0.04', unit: 'units/min', route: 'IV infusion', frequency: 'Continuous', maxDose: '0.04 units/min', notes: 'Adjunct to noradrenaline' },
  { id: 'phenylephrine', name: 'Phenylephrine', category: 'vasopressor', subcategory: 'Pure Alpha', dose: '50-300', unit: 'mcg/min', route: 'IV infusion', frequency: 'Continuous', maxDose: '300 mcg/min', notes: 'No tachycardia' },
  { id: 'dopamine', name: 'Dopamine', category: 'vasopressor', subcategory: 'Dose-dependent', dose: '2-20', unit: 'mcg/kg/min', route: 'IV infusion', frequency: 'Continuous', maxDose: '20 mcg/kg/min', notes: 'Low dose = renal, high = vasopressor' },

  // INOTROPES
  { id: 'dobutamine', name: 'Dobutamine', category: 'inotrope', subcategory: 'Beta-1 agonist', dose: '2.5-20', unit: 'mcg/kg/min', route: 'IV infusion', frequency: 'Continuous', maxDose: '20 mcg/kg/min', notes: 'Septic cardiomyopathy' },
  { id: 'milrinone', name: 'Milrinone', category: 'inotrope', subcategory: 'PDE3 inhibitor', dose: '0.25-0.75', unit: 'mcg/kg/min', route: 'IV infusion', frequency: 'Continuous', maxDose: '0.75 mcg/kg/min', notes: 'Watch for hypotension' },
  { id: 'levosimendan', name: 'Levosimendan', category: 'inotrope', subcategory: 'Ca sensitizer', dose: '0.05-0.2', unit: 'mcg/kg/min', route: 'IV infusion', frequency: '24h infusion', maxDose: '0.2 mcg/kg/min', notes: 'Long-acting (7 days)' },

  // ANTIARRHYTHMICS
  { id: 'amiodarone', name: 'Amiodarone', category: 'antiarrhythmic', subcategory: 'Class III', dose: '150mg bolus → 1mg/min', unit: '-', route: 'IV', frequency: 'Bolus + infusion', maxDose: '2.2g/24h', notes: 'AF, VT, VF' },
  { id: 'adenosine', name: 'Adenosine', category: 'antiarrhythmic', subcategory: 'AV node blocker', dose: '6mg → 12mg → 12mg', unit: 'mg', route: 'Rapid IV push', frequency: 'As needed', maxDose: '30mg total', notes: 'SVT diagnosis/treatment' },
  { id: 'esmolol', name: 'Esmolol', category: 'antiarrhythmic', subcategory: 'Beta blocker', dose: '50-200', unit: 'mcg/kg/min', route: 'IV infusion', frequency: 'Continuous', maxDose: '200 mcg/kg/min', notes: 'Short-acting beta blocker' },

  // ANTIBIOTICS
  { id: 'ceftriaxone', name: 'Ceftriaxone', category: 'antibiotic', subcategory: 'Cephalosporin', dose: '2g', unit: 'g', route: 'IV', frequency: 'q24h', maxDose: '4g/day', notes: 'CAP, meningitis' },
  { id: 'piperacillin_tazobactam', name: 'Piperacillin-Tazobactam', category: 'antibiotic', subcategory: 'Penicillin+BLI', dose: '4.5g', unit: 'g', route: 'IV', frequency: 'q6h', maxDose: '18g/day', notes: 'HAP, sepsis' },
  { id: 'vancomycin', name: 'Vancomycin', category: 'antibiotic', subcategory: 'Glycopeptide', dose: '15-20mg/kg', unit: 'mg/kg', route: 'IV', frequency: 'q8-12h', maxDose: '4g/day', notes: 'MRSA coverage' },
  { id: 'meropenem', name: 'Meropenem', category: 'antibiotic', subcategory: 'Carbapenem', dose: '1g', unit: 'g', route: 'IV', frequency: 'q8h', maxDose: '6g/day', notes: 'MDR organisms' },

  // SEDATION
  { id: 'propofol', name: 'Propofol', category: 'sedation', subcategory: 'General anesthetic', dose: '5-50', unit: 'mcg/kg/min', route: 'IV infusion', frequency: 'Continuous', maxDose: '80 mcg/kg/min', notes: 'Watch for hypotension' },
  { id: 'midazolam', name: 'Midazolam', category: 'sedation', subcategory: 'Benzodiazepine', dose: '1-5', unit: 'mg/hr', route: 'IV infusion', frequency: 'Continuous', maxDose: '20 mg/hr', notes: 'Accumulation in renal failure' },
  { id: 'dexmedetomidine', name: 'Dexmedetomidine', category: 'sedation', subcategory: 'Alpha-2 agonist', dose: '0.2-1.4', unit: 'mcg/kg/hr', route: 'IV infusion', frequency: 'Continuous', maxDose: '1.4 mcg/kg/hr', notes: 'No respiratory depression' },
  { id: 'fentanyl', name: 'Fentanyl', category: 'sedation', subcategory: 'Opioid', dose: '25-100', unit: 'mcg/hr', route: 'IV infusion', frequency: 'Continuous', maxDose: '200 mcg/hr', notes: 'Fast onset, short duration' },
  { id: 'morphine', name: 'Morphine', category: 'sedation', subcategory: 'Opioid', dose: '2-5mg', unit: 'mg', route: 'IV', frequency: 'q4h', maxDose: '10mg/dose', notes: 'Longer acting' },

  // PARALYTICS
  { id: 'rocuronium', name: 'Rocuronium', category: 'paralytic', subcategory: 'Non-depolarizing', dose: '0.6-1.2', unit: 'mg/kg', route: 'IV bolus', frequency: 'PRN', maxDose: '1.2 mg/kg', notes: 'RSI, vent synchrony' },
  { id: 'cisatracurium', name: 'Cisatracurium', category: 'paralytic', subcategory: 'Non-depolarizing', dose: '0.15-0.2', unit: 'mg/kg', route: 'IV bolus', frequency: 'PRN', maxDose: '0.2 mg/kg', notes: 'Safe in renal/liver failure' },

  // FLUIDS
  { id: 'ns_500', name: 'Normal Saline 500mL', category: 'fluid', subcategory: 'Crystalloid', dose: '500', unit: 'mL', route: 'IV bolus', frequency: 'Over 30min', maxDose: '-', notes: 'First-line resuscitation' },
  { id: 'ns_1000', name: 'Normal Saline 1000mL', category: 'fluid', subcategory: 'Crystalloid', dose: '1000', unit: 'mL', route: 'IV bolus', frequency: 'Over 60min', maxDose: '-', notes: 'Large volume resuscitation' },
  { id: 'ringer_lactate', name: "Ringer's Lactate 500mL", category: 'fluid', subcategory: 'Balanced Crystalloid', dose: '500', unit: 'mL', route: 'IV bolus', frequency: 'Over 30min', maxDose: '-', notes: 'Preferred in pancreatitis' },
  { id: 'albumin_5', name: 'Albumin 5% 250mL', category: 'fluid', subcategory: 'Colloid', dose: '250', unit: 'mL', route: 'IV', frequency: 'Over 2h', maxDose: '-', notes: 'Refractory shock' },
  { id: 'prbc_1', name: 'PRBCs 1 unit', category: 'fluid', subcategory: 'Blood Product', dose: '1', unit: 'unit', route: 'IV', frequency: 'Over 2-4h', maxDose: '-', notes: 'Hb <7 g/dL' },
  { id: 'ffp_2', name: 'FFP 2 units', category: 'fluid', subcategory: 'Blood Product', dose: '2', unit: 'units', route: 'IV', frequency: 'Over 2h', maxDose: '-', notes: 'INR >1.5 or bleeding' },
  { id: 'platelets_1', name: 'Platelets 1 unit', category: 'fluid', subcategory: 'Blood Product', dose: '1', unit: 'unit', route: 'IV', frequency: 'Over 1h', maxDose: '-', notes: 'PLT <20K or bleeding' },

  // DIURETICS
  { id: 'furosemide_20', name: 'Furosemide 20mg IV', category: 'diuretic', subcategory: 'Loop Diuretic', dose: '20', unit: 'mg', route: 'IV bolus', frequency: 'PRN', maxDose: '200mg/dose', notes: 'Fluid overload, HTN' },
  { id: 'furosemide_40', name: 'Furosemide 40mg IV', category: 'diuretic', subcategory: 'Loop Diuretic', dose: '40', unit: 'mg', route: 'IV bolus', frequency: 'PRN', maxDose: '200mg/dose', notes: 'Higher dose for renal failure' },
  { id: 'furosemide_80', name: 'Furosemide 80mg IV', category: 'diuretic', subcategory: 'Loop Diuretic', dose: '80', unit: 'mg', route: 'IV bolus', frequency: 'PRN', maxDose: '200mg/dose', notes: 'Severe fluid overload' },

  // STEROIDS
  { id: 'hydrocortisone', name: 'Hydrocortisone 50mg', category: 'steroid', subcategory: 'Corticosteroid', dose: '50', unit: 'mg', route: 'IV', frequency: 'q6h', maxDose: '-', notes: 'Septic shock (SSC guidelines)' },
  { id: 'methylprednisolone', name: 'Methylprednisolone 125mg', category: 'steroid', subcategory: 'Corticosteroid', dose: '125', unit: 'mg', route: 'IV', frequency: 'q6h', maxDose: '-', notes: 'ARDS, anaphylaxis' },

  // ANTICOAGULATION
  { id: 'heparin', name: 'Heparin (UFH)', category: 'anticoagulation', subcategory: 'Indirect thrombin inhibitor', dose: '80 units/kg → 18 units/kg/hr', unit: '-', route: 'IV', frequency: 'Bolus + infusion', maxDose: '-', notes: 'Monitor aPTT q6h' },
  { id: 'enoxaparin', name: 'Enoxaparin 40mg', category: 'anticoagulation', subcategory: 'LMWH', dose: '40', unit: 'mg', route: 'SC', frequency: 'q24h', maxDose: '-', notes: 'DVT prophylaxis' },

  // GI
  { id: 'omeprazole', name: 'Omeprazole 40mg', category: 'gi', subcategory: 'PPI', dose: '40', unit: 'mg', route: 'IV', frequency: 'q24h', maxDose: '-', notes: 'Stress ulcer prophylaxis' },
  { id: 'ondansetron', name: 'Ondansetron 4mg', category: 'gi', subcategory: 'Antiemetic', dose: '4', unit: 'mg', route: 'IV', frequency: 'q8h', maxDose: '16mg/day', notes: 'Nausea/vomiting' },

  // RESPIRATORY
  { id: 'salbutamol', name: 'Salbutamol 2.5mg neb', category: 'respiratory', subcategory: 'Beta-2 agonist', dose: '2.5', unit: 'mg', route: 'Nebulized', frequency: 'q4-6h', maxDose: '-', notes: 'Bronchospasm' },

  // ELECTROLYTES
  { id: 'kcl_20', name: 'Potassium Chloride 20mEq', category: 'electrolyte', subcategory: 'Potassium', dose: '20', unit: 'mEq', route: 'IV', frequency: 'Over 2h', maxDose: '40mEq/dose', notes: 'Rate max 10mEq/hr' },
  { id: 'calcium_gluconate', name: 'Calcium Gluconate 1g', category: 'electrolyte', subcategory: 'Calcium', dose: '1', unit: 'g', route: 'IV', frequency: 'Over 10min', maxDose: '-', notes: 'Hyperkalemia with ECG changes' },
  { id: 'magnesium_2g', name: 'Magnesium Sulfate 2g', category: 'electrolyte', subcategory: 'Magnesium', dose: '2', unit: 'g', route: 'IV', frequency: 'Over 15min', maxDose: '-', notes: 'Torsades, hypomagnesemia' },
  { id: 'sodium_bicarb', name: 'Sodium Bicarbonate 50mEq', category: 'electrolyte', subcategory: 'Buffer', dose: '50', unit: 'mEq', route: 'IV', frequency: 'PRN', maxDose: '-', notes: 'pH <6.9, hyperkalemia' },

  // ANTIDOTES
  { id: 'naloxone', name: 'Naloxone 0.4mg', category: 'antidote', subcategory: 'Opioid antagonist', dose: '0.4', unit: 'mg', route: 'IV', frequency: 'q2-3min PRN', maxDose: '10mg', notes: 'Opioid overdose' },
];

export function searchMedications(query: string, category?: string | null): Medication[] {
  const q = (query || "").toLowerCase();
  let results = ALL_MEDICATIONS.filter(m =>
    m.name.toLowerCase().includes(q) ||
    m.category.toLowerCase().includes(q) ||
    m.subcategory.toLowerCase().includes(q)
  );
  if (category) {
    results = results.filter(m => m.category === category);
  }
  return results;
}

export function getMedicationsByCategory(category: string): Medication[] {
  return ALL_MEDICATIONS.filter(m => m.category === category);
}
