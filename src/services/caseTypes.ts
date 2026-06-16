// ========== Unified Case Types v1.0 ==========

export interface UnifiedCase {
  id: string;
  title: string;
  specialty: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  version?: string;

  patient: {
    age: number;
    gender: "male" | "female";
  };

  clinical: {
    chief_complaint: string;
    history_of_present_illness: string;
    past_medical_history?: string;
    medications?: string[];
    allergies?: string[];
    social_history?: string;
  };

  physical_examination: {
    general?: string;
    chest?: string;
    cardiac?: string;
    abdominal?: string;
    extremities?: string;
  };

  vitals: {
    hr: number;
    bp_systolic: number;
    bp_diastolic: number;
    spo2: number;
    rr: number;
    temp: number;
  };

  labs?: {
    cbc?: { wbc: number; hb: number; plt: number };
    crp?: number;
    abg?: { ph: number; pao2: number; paco2: number; hco3: number; lactate: number };
    troponin?: number;
    bnp?: number;
    d_dimer?: number;
    creatinine?: number;
    bun?: number;
    glucose?: number;
    electrolytes?: { na: number; k: number; cl: number };
    lft?: { alt: number; ast: number; alp: number; bilirubin: number };
    coagulation?: { pt: number; ptt: number; inr: number };
    procalcitonin?: number;
    blood_culture?: string;
    urinalysis?: string;
    [key: string]: any;
  };

  imaging?: {
    cxr?: { file: string; findings: string };
    ct_chest?: { file: string; findings: string };
    ct_abdomen?: { file: string; findings: string };
    ultrasound?: { file: string; findings: string; type: string };
    ecg?: { file: string; findings: string };
    echo?: { file: string; findings: string };
    [key: string]: any;
  };

  unlockable_investigations?: string[];

  diagnosis: {
    primary: string;
    differentials: string[];
    red_flags?: string[];
  };

  board_question?: {
    vignette: string;
    question: string;
    options: Array<{ id: string; text: string }>;
    correct_option: string;
    explanation: {
      why_correct: string;
      why_wrong: Record<string, string>;
      clinical_pearl: string;
    };
  };

  icu_scenario?: {
    initial_status: "critical" | "deteriorating";
    duration_minutes: number;
    goals: string[];
    win_conditions: Record<string, number>;
    lose_conditions: Record<string, number>;
    timed_events?: Array<{
      sim_time: number;
      event: string;
      vitals_change?: Record<string, number>;
    }>;
    allowed_medications?: string[];
    restricted_medications?: string[];
  };

  education?: {
    teaching_points: string[];
    clinical_pearls: string[];
    resident_tip?: string;
    common_pitfalls?: string[];
  };

  patient_responses?: Record<string, string>;

  metadata?: {
    tags: string[];
    created_at: string;
    updated_at: string;
    source?: string;
  };
}

  // ========== NEW: Core Capabilities ==========
  version?: string;

  tags?: string[];
  competencies?: string[];
  learning_objectives?: string[];

  canonical_diagnosis_id?: string;

  clinical_pearls?: string[];
  pitfalls?: string[];

  references?: Array<{
    source: string;
    year?: number;
    url?: string;
  }>;

  difficulty_dimensions?: {
    diagnosis?: number;      // 1-5
    management?: number;     // 1-5
    interpretation?: number; // 1-5
  };

  investigation_registry?: Array<{
    id: string;              // "troponin_i"
    display_name: string;    // "Troponin I"
    type: "lab" | "imaging" | "ecg";
  }>;

  outcomes?: {
    best?: string;
    acceptable?: string;
    poor?: string;
  };

  related_cases?: string[];

  teaching_assets?: {
    ecg?: string[];
    xray?: string[];
    ultrasound?: string[];
    ct?: string[];
    mri?: string[];
    diagrams?: string[];
  };

  related_content?: {
    board_questions?: string[];
    osce_stations?: string[];
    flashcards?: string[];
  };


export interface CaseFilters {
  specialty?: string;
  difficulty?: string;
  tags?: string[];
  hasImaging?: boolean;
  hasLabs?: boolean;
  hasECG?: boolean;
  hasBoardQuestion?: boolean;
  hasICUScenario?: boolean;
}

export interface CaseForMode {
  id: string;
  title: string;
  specialty: string;
  difficulty: string;
  hasImaging: boolean;
  hasLabs: boolean;
  hasECG: boolean;
  hasBoardQuestion: boolean;
  hasICUScenario: boolean;
  tags: string[];
}

export interface LabTest {
  id: string;
  name: string;
  category: string;
  parameters: Record<string, {
    normal_range: string;
    unit: string;
  }>;
}
