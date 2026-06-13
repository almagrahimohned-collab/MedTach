export interface ProcedureItem {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  icon: string;
  effect: string;
  complications: string;
  timeToPerform: number;
}

export const PROCEDURE_CATEGORIES = [
  { id: 'airway', name: '🫁 Airway', icon: 'leaf' },
  { id: 'breathing', name: '🩻 Breathing', icon: 'image' },
  { id: 'circulation', name: '💓 Circulation', icon: 'heart' },
  { id: 'access', name: '💉 Access', icon: 'medkit' },
  { id: 'dialysis', name: '🔄 Dialysis', icon: 'refresh' },
  { id: 'neuro', name: '🧠 Neuro', icon: 'brain' },
  { id: 'emergency', name: '⚡ Emergency', icon: 'flash' },
];

export const ALL_PROCEDURES: ProcedureItem[] = [
  // AIRWAY
  { id: 'intubation', name: 'Endotracheal Intubation (RSI)', category: 'airway', subcategory: 'Definitive', icon: 'leaf', effect: 'Secures airway, enables mechanical ventilation', complications: 'Esophageal intubation, dental trauma, hypotension', timeToPerform: 5 },
  { id: 'niv', name: 'Non-Invasive Ventilation (NIV)', category: 'airway', subcategory: 'Non-invasive', icon: 'leaf', effect: 'Improves oxygenation without intubation', complications: 'Aspiration risk, skin breakdown', timeToPerform: 3 },
  { id: 'opa', name: 'Oropharyngeal Airway (OPA)', category: 'airway', subcategory: 'Basic', icon: 'leaf', effect: 'Basic airway adjunct', complications: 'Gag reflex, aspiration', timeToPerform: 1 },

  // BREATHING
  { id: 'chest_tube', name: 'Chest Tube Insertion (Thoracostomy)', category: 'breathing', subcategory: 'Pleural', icon: 'image', effect: 'Drains pneumothorax/hemothorax, improves SpO2', complications: 'Lung laceration, infection, bleeding', timeToPerform: 8 },
  { id: 'needle_decomp', name: 'Needle Decompression (Tension PTX)', category: 'breathing', subcategory: 'Emergency', icon: 'image', effect: 'Immediate relief of tension pneumothorax', complications: 'Lung injury, ineffective if mispositioned', timeToPerform: 2 },
  { id: 'bronchoscopy', name: 'Bronchoscopy (Diagnostic)', category: 'breathing', subcategory: 'Diagnostic', icon: 'image', effect: 'Visualize airways, obtain cultures', complications: 'Hypoxia, bleeding, pneumothorax', timeToPerform: 10 },

  // CIRCULATION
  { id: 'central_line', name: 'Central Venous Line (CVL)', category: 'circulation', subcategory: 'Access', icon: 'heart', effect: 'Reliable IV access, CVP monitoring, vasopressors', complications: 'Pneumothorax, arterial puncture, infection', timeToPerform: 8 },
  { id: 'arterial_line', name: 'Arterial Line (Radial/Femoral)', category: 'circulation', subcategory: 'Monitoring', icon: 'heart', effect: 'Continuous BP monitoring, ABG sampling', complications: 'Thrombosis, hematoma, infection', timeToPerform: 6 },
  { id: 'cardioversion', name: 'Synchronized Cardioversion', category: 'circulation', subcategory: 'Rhythm', icon: 'heart', effect: 'Converts SVT/AF to sinus rhythm', complications: 'Stroke if not anticoagulated, skin burns', timeToPerform: 3 },
  { id: 'defibrillation', name: 'Defibrillation (VF/VT)', category: 'circulation', subcategory: 'Emergency', icon: 'flash', effect: 'Life-saving for cardiac arrest rhythms', complications: 'Myocardial damage, skin burns', timeToPerform: 1 },
  { id: 'pacing', name: 'Transcutaneous Pacing', category: 'circulation', subcategory: 'Emergency', icon: 'flash', effect: 'Emergency pacing for bradycardia', complications: 'Pain, skin burns, failure to capture', timeToPerform: 3 },
  { id: 'pericardiocentesis', name: 'Pericardiocentesis', category: 'circulation', subcategory: 'Emergency', icon: 'heart', effect: 'Relieves cardiac tamponade', complications: 'Myocardial puncture, arrhythmia', timeToPerform: 8 },

  // ACCESS
  { id: 'piv_18', name: 'Peripheral IV 18G', category: 'access', subcategory: 'Vascular', icon: 'medkit', effect: 'Standard IV access', complications: 'Infiltration, phlebitis', timeToPerform: 2 },
  { id: 'foley', name: 'Foley Catheter Insertion', category: 'access', subcategory: 'Urinary', icon: 'medkit', effect: 'Accurate urine output monitoring', complications: 'UTI, urethral trauma', timeToPerform: 3 },
  { id: 'ngt', name: 'Nasogastric Tube (NGT)', category: 'access', subcategory: 'Enteral', icon: 'medkit', effect: 'Gastric decompression, medication administration', complications: 'Epistaxis, sinusitis', timeToPerform: 3 },
  { id: 'pocus', name: 'Point-of-Care Ultrasound (POCUS)', category: 'access', subcategory: 'Diagnostic', icon: 'medkit', effect: 'Rapid bedside assessment', complications: 'None significant', timeToPerform: 5 },

  // DIALYSIS
  { id: 'crrt', name: 'Continuous Renal Replacement Therapy (CRRT)', category: 'dialysis', subcategory: 'Continuous', icon: 'refresh', effect: 'Continuous dialysis for unstable patients', complications: 'Hypotension, electrolyte shifts, line infection', timeToPerform: 10 },

  // NEURO
  { id: 'lumbar_puncture', name: 'Lumbar Puncture', category: 'neuro', subcategory: 'Diagnostic', icon: 'brain', effect: 'CSF analysis for meningitis/SAH', complications: 'Post-dural headache, bleeding, herniation', timeToPerform: 8 },
  { id: 'hypothermia', name: 'Therapeutic Hypothermia Protocol', category: 'neuro', subcategory: 'Post-arrest', icon: 'brain', effect: 'Neuroprotection after cardiac arrest', complications: 'Shivering, electrolyte shifts, infection', timeToPerform: 10 },

  // EMERGENCY
  { id: 'code_blue', name: 'Code Blue - CPR', category: 'emergency', subcategory: 'Cardiac Arrest', icon: 'flash', effect: 'Initiates CPR protocol', complications: 'Rib fractures, organ injury', timeToPerform: 1 },
];
