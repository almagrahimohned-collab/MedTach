// 🫀 Cardiology Management Hints
// References: Tintinalli 9th Ed, ESC 2023 Guidelines, Medscape, Davidson's

export const CARDIOLOGY_HINTS: Record<string, string> = {
  
  // ==================== BEGINNER ====================
  'stemi': `🚨 **STEMI MANAGEMENT (ESC 2023 / Tintinalli Ch 55)**

**DOOR-TO-BALLOON GOAL: <90 MINUTES**

**IMMEDIATE (First 10 min):**
• Aspirin 324mg chewed (non-enteric coated) - Class I
• Nitroglycerin 0.4mg SL q5min ×3 (if SBP >90, no RV infarction)
• Oxygen ONLY if SpO₂ <90% (AVOID trial - routine O₂ may increase infarct size)
• Morphine 2-4mg IV PRN (for pain refractory to NTG - may delay platelet inhibition)

**ANTIPLATELET THERAPY:**
• Ticagrelor 180mg PO loading dose (preferred per PLATO trial)
• OR Prasugrel 60mg PO load (TRITON-TIMI 38 - avoid if prior stroke/TIA)
• OR Clopidogrel 600mg PO load if above unavailable

**ANTICOAGULATION:**
• UFH: 60 U/kg IV bolus (max 4000U) → 12 U/kg/hr infusion
• OR Enoxaparin: 30mg IV bolus + 1mg/kg SC q12h
• OR Bivalirudin: 0.75 mg/kg bolus → 1.75 mg/kg/hr (if heparin allergy/HIT)

**REPERFUSION STRATEGY:**
• Primary PCI: First medical contact-to-device <120 min (preferred)
• Fibrinolysis: If PCI not available within 120 min
  - Tenecteplase (TNK): Weight-based IV bolus (30-50mg)
  - Door-to-needle <30 min
  - Absolute CI: Active bleeding, recent intracranial hemorrhage, ischemic stroke <3mo, known cerebral AV malformation

**POST-REPERFUSION MEDICATIONS:**
• DAPT ×12 months (Aspirin 81mg + Ticagrelor 90mg BID/Prasugrel 10mg daily)
• High-intensity statin: Atorvastatin 80mg PO daily
• Beta-blocker: Metoprolol 25-50mg PO q6-12h (within 24h, avoid if signs of shock/CHF)
• ACEi/ARB: Lisinopril 2.5-5mg (within 24h, especially if EF <40% or anterior MI)
• Aldosterone antagonist: Eplerenone 25mg (if EF <40% + HF or DM)

**DISPOSITION:** CCU admission, continuous telemetry ×24-48h, Echo before discharge

**RED FLAGS:** 
• Cardiogenic shock (SBP <90, PCWP >18, CI <1.8) → Urgent PCI + inotropes ± IABP/Impella
• Mechanical complications: Papillary muscle rupture, VSD, free wall rupture (days 3-7 post-MI)
• Ventricular arrhythmias: Amiodarone 150mg IV over 10min → 1mg/min infusion`,

  'pericarditis': `💔 **ACUTE PERICARDITIS (ESC 2015 / Davidson's Ch 16)**

**DIAGNOSIS (Need 2/4 criteria):**
1. Chest pain (pleuritic, positional - relieved sitting forward)
2. Pericardial friction rub
3. ECG: Diffuse ST elevation + PR depression (no reciprocal changes)
4. Pericardial effusion (new or worsening)

**FIRST-LINE TREATMENT:**
• Ibuprofen 600mg PO TID ×1-2 weeks (taper based on symptoms/CRP)
• OR Aspirin 750-1000mg PO TID (preferred post-MI)
• PLUS Colchicine 0.5mg BID ×3 months (reduces recurrence by 50% - COPE/ICAP trials)
• PLUS PPI (Omeprazole 20mg) for gastric protection

**ACTIVITY RESTRICTION:**
• Restrict physical activity until symptoms resolve + CRP normalizes
• Athletes: No competitive sports for 3 months minimum

**⚠️ CRITICAL PEARL:** 
Avoid corticosteroids as first-line therapy! They increase recurrence rate 3-fold (COPPS trial). Reserve for:
• Refractory/recurrent pericarditis
• Autoimmune etiology (SLE, RA)
• Uremic pericarditis
• Pregnancy (contraindication to NSAIDs)

**MONITORING:**
• CRP weekly to guide NSAID tapering
• Echo at diagnosis + follow-up for effusion
• ECG for resolution of changes (may take weeks)

**RED FLAGS (High-Risk Features - Admit All):**
• Fever >38°C + leukocytosis (purulent pericarditis)
• Anticoagulation therapy (risk of hemorrhagic tamponade)
• Large pericardial effusion (>20mm) or tamponade physiology
• Elevated troponin (myopericarditis)

**DISPOSITION:** 
• Low-risk: Outpatient management, follow-up 1 week
• High-risk: Admit, cardiac monitoring, serial Echo`,

  // ==================== INTERMEDIATE ====================
  'atrial fibrillation': `💓 **ATRIAL FIBRILLATION (AHA/ACC/HRS 2023 / Davidson's Ch 16)**

**HEMODYNAMICALLY UNSTABLE? → IMMEDIATE SYNCHRONIZED CARDIOVERSION (200J)**

**A-B-C-D-E APPROACH:**

**A - ANTICOAGULATION (Stroke Prevention):**
• Calculate CHA₂DS₂-VASc score:
  - C: CHF (1) | H: HTN (1) | A₂: Age ≥75 (2) | D: DM (1) | S₂: Stroke/TIA (2)
  - V: Vascular disease (1) | A: Age 65-74 (1) | Sc: Sex Female (1)
• Score ≥2 (men) / ≥3 (women) → DOAC:
  - Apixaban 5mg BID (preferred - ARISTOTLE trial)
  - Rivaroxaban 20mg daily (ROCKET-AF)
  - Dabigatran 150mg BID (RE-LY)
  - Edoxaban 60mg daily (ENGAGE-AF)
• Warfarin: If DOAC contraindicated (mechanical valve, mitral stenosis)
  - Target INR 2-3, TTR ≥70%
• Score 0-1: No anticoagulation generally needed
• Always calculate HAS-BLED score for bleeding risk

**B - BETTER SYMPTOM CONTROL (Rate vs Rhythm):**
• RATE CONTROL (First-line, RACE II trial):
  - Beta-blockers: Metoprolol 25-100mg BID, Carvedilol 3.125-25mg BID
  - CCBs: Diltiazem CD 120-360mg daily (avoid if HFrEF)
  - Digoxin: 0.125-0.25mg daily (if sedentary or HFrEF)
  - Target: Resting HR <80, exercise HR <110
• RHYTHM CONTROL (if symptomatic despite rate control):
  - Electrical cardioversion: Synchronized 200J biphasic
  - Pharmacological: Flecainide 200-300mg PO ("pill-in-pocket") or Amiodarone
  - Catheter ablation: Pulmonary vein isolation (PVI) - Class I if drug-refractory

**C - COMORBIDITY MANAGEMENT:**
• HTN: ACEi/ARB, BP <130/80
• HF: Guideline-directed medical therapy
• Sleep apnea: Screen and treat (strong association with AF recurrence)
• Obesity: Weight loss >10% reduces AF burden

**D - DURATION & DECISION:**
• AF <48h: Can cardiovert without TEE (if no high-risk features)
• AF >48h or unknown: TEE to rule out LAA thrombus OR 3 weeks anticoagulation before cardioversion
• Post-cardioversion: Continue anticoagulation ×4 weeks minimum

**E - EDUCATION & FOLLOW-UP:**
• Teach "pill-in-pocket" strategy if appropriate
• Annual Echo, electrolytes, thyroid function
• Discuss trigger avoidance: Alcohol, caffeine, stress

**DISPOSITION:** 
• Stable new-onset: Outpatient rate control + anticoagulation, cardiology follow-up
• Symptomatic/uncontrolled: Admit for rate/rhythm control
• Unstable: Emergency cardioversion`,

  'aortic stenosis': `🫀 **AORTIC STENOSIS (ACC/AHA 2021 / Davidson's Ch 16)**

**TRIAD (late presentation):**
1. Dyspnea (HF) → Survival 2 years without AVR
2. Angina → Survival 3 years without AVR
3. Syncope → Survival 3 years without AVR

**SEVERITY CLASSIFICATION (Echo):**
• Mild: AVA >1.5 cm², mean gradient <20 mmHg, Vmax 2.6-2.9 m/s
• Moderate: AVA 1.0-1.5 cm², mean gradient 20-40 mmHg, Vmax 3.0-3.9 m/s
• Severe: AVA <1.0 cm², mean gradient >40 mmHg, Vmax >4.0 m/s

**SYMPTOMATIC SEVERE AS → AVR (Surgery or TAVI)**

**MEDICAL MANAGEMENT (Bridge to AVR):**
• Diuretics: Furosemide 20-40mg PRN (for volume overload)
  - Use cautiously! AS patients are preload-dependent
• ACEi/ARB: Can be used carefully (avoid hypotension)
• Beta-blockers: For rate control if AFib (decreases myocardial O₂ demand)
• Avoid: Aggressive vasodilation, high-dose diuretics (may cause hypotension)

**TAVI vs SAVR DECISION:**
• TAVI (Transcatheter): Preferred if:
  - Age >80 years OR STS risk score >8%
  - Frailty, porcelain aorta, prior chest radiation
• SAVR (Surgical): Preferred if:
  - Age <65, low surgical risk
  - Associated CAD requiring CABG
  - Bicuspid AV, infective endocarditis

**FOLLOW-UP SCHEDULE (Asymptomatic):**
• Severe AS: Echo q6-12 months
• Moderate AS: Echo q1-2 years
• Mild AS: Echo q3-5 years

**RED FLAGS:**
• Syncope: Critical AS until proven otherwise
• Rapid progression: Increase in Vmax >0.3 m/s/year
• Low-flow low-gradient AS with reduced EF: Dobutamine stress echo to assess contractile reserve

**DISPOSITION:** 
• Symptomatic: Urgent cardiology/cardiothoracic surgery referral
• Asymptomatic severe: Close follow-up, avoid heavy exertion
• Decompensated HF: Gentle diuresis (avoid hypotension)`,

  'hypertensive emergency': `⚠️ **HYPERTENSIVE EMERGENCY (JNC 8 / Tintinalli Ch 57)**

**DEFINITION:** SBP >180 or DBP >120 WITH end-organ damage
(NOT just high numbers - hypertensive urgency = no organ damage)

**TARGET ORGANS:**
• Brain: Hypertensive encephalopathy, ICH, ischemic stroke
• Heart: Acute pulmonary edema, ACS, aortic dissection
• Kidneys: Acute kidney injury
• Eyes: Papilledema, retinal hemorrhages
• Pregnancy: Preeclampsia/eclampsia

**GOAL:** Reduce MAP by 10-20% in first hour, then 5-15% over next 23 hours
**CRITICAL:** DO NOT lower BP too rapidly (risk of cerebral/cardiac ischemia)

**FIRST-LINE IV AGENTS:**
• Labetalol: 20mg IV bolus → 20-80mg q10min (max 300mg) or 0.5-2mg/min infusion
• Nicardipine: 5mg/hr IV infusion, titrate q5-15min by 2.5mg/hr (max 15mg/hr) - PREFERRED for neuro
• Clevidipine: 1-2mg/hr IV, titrate q5-10min - ultra-short acting, ideal for stroke
• Esmolol: 500mcg/kg bolus → 50-300mcg/kg/min (aortic dissection)

**SPECIFIC SCENARIOS:**
• Acute pulmonary edema: Nitroglycerin IV (5-100mcg/min) + furosemide
• Aortic dissection: Esmolol FIRST (HR <60) then vasodilator. Target SBP 100-120 within 20 min
• Stroke (ischemic): Only treat if SBP >220 or DBP >120 (if not thrombolysis candidate)
• ICH: Target SBP <140 within 1 hour (INTERACT2/ATACH-2 trials)
• Preeclampsia: Magnesium sulfate 4-6g IV + Labetalol/Hydralazine. Deliver if ≥37 weeks

**ORAL AGENTS (for hypertensive urgency - NO organ damage):**
• Clonidine 0.1-0.2mg PO (onset 30-60 min)
• Captopril 25mg PO (onset 15-30 min)
• Amlodipine 5-10mg PO (long-acting, avoid rapid drops)

**MONITORING:**
• Arterial line for continuous BP monitoring (ICU setting)
• Neuro checks q15-30min
• Urine output (renal perfusion)
• ECG for ischemia

**DISPOSITION:** ICU admission for titratable IV therapy

**PEARL:** "Treat the patient, not the number" - Asymptomatic severe HTN alone is NOT an emergency`,

  // ==================== ADVANCED ====================
  'heart failure': `💔 **HEART FAILURE (ACC/AHA 2022 / Davidson's Ch 15)**

**CLASSIFICATION:**
• HFrEF: EF ≤40% → GDMT reduces mortality
• HFmrEF: EF 41-49% → Similar to HFrEF management
• HFpEF: EF ≥50% → Diuretics + comorbidity management

**ACUTE DECOMPENSATED HF - INITIAL ASSESSMENT:**
• ABC assessment, SpO₂, continuous telemetry
• Look for triggers: Dietary indiscretion, medication non-adherence, ischemia, arrhythmia, infection, anemia
• CXR: Pulmonary edema, pleural effusions, cardiomegaly
• Labs: CBC, CMP, troponin, BNP/NT-proBNP, TSH
• Echo (if not recent): EF, wall motion, valvular disease

**MANAGEMENT (WET-WARM Profile - Most Common):**

**1. DIURESIS:**
• Furosemide IV: 40mg (naïve) to 2.5× home dose (if on chronic loop diuretic)
• If inadequate response in 2h: Double dose or add Thiazide (sequential nephron blockade)
• Target: Urine output >1-2 L/day, daily weight loss 0.5-1.5 kg

**2. VASODILATORS (if SBP >90):**
• Nitroglycerin IV: 10-20mcg/min, titrate to symptom relief and SBP
• Nesiritide: Consider if refractory (limited efficacy data)
• Nitroprusside: Only if SBP >100 (watch for cyanide toxicity)

**3. INOTROPES (if low output/shock):**
• Dobutamine: 2.5-5mcg/kg/min (β1/β2 agonist)
• Milrinone: 0.125-0.375mcg/kg/min (PDE-3 inhibitor, watch for hypotension)
• Dopamine: 3-10mcg/kg/min (avoid - increased mortality in ADHERE registry)

**GDMT (GUIDELINE-DIRECTED MEDICAL THERAPY) - FOUR PILLARS:**
1. **ARNI/ACEi/ARB:** Sacubitril/Valsartan (Entresto) preferred over ACEi (PARADIGM-HF trial)
2. **Beta-blocker:** Carvedilol, Metoprolol succinate, Bisoprolol (reduce mortality 35%)
3. **MRA:** Spironolactone 25mg or Eplerenone 50mg (RALES/EMPHASIS-HF trials)
4. **SGLT2i:** Dapagliflozin 10mg or Empagliflozin 10mg (DAPA-HF/EMPEROR-Reduced trials)

**ADDITIONAL THERAPIES:**
• Ivabradine: If HR >70 on max beta-blocker (SHIFT trial)
• Digoxin: For symptom control (not mortality benefit)
• Hydralazine + Isosorbide dinitrate: If African-American (A-HeFT trial)

**DEVICE THERAPY:**
• ICD: EF ≤35% on GDMT >3 months (or >40 days post-MI), NYHA II-III
• CRT-D: EF ≤35%, LBBB with QRS >150ms, NYHA II-IV (reduces mortality 36%)

**DISPOSITION:**
• Mild decompensation (responds to IV diuretics in ED): Can consider observation unit
• Moderate-severe: Admit, cardiology consult
• Respiratory failure/shock: ICU

**RED FLAGS FOR READMISSION (check before discharge):**
• GDMT optimization, medication reconciliation, daily weight monitoring education
• Follow-up appointment within 7 days`,

  'endocarditis': `🦠 **INFECTIVE ENDOCARDITIS (ESC 2023 / Tintinalli Ch 81)**

**MODIFIED DUKE CRITERIA (2 major OR 1 major + 3 minor OR 5 minor):**
• Major: Positive blood cultures ×2, Echo evidence (vegetation, abscess, new regurgitation)
• Minor: Fever, predisposing condition, vascular phenomena, immunologic phenomena, positive cultures not meeting major

**BLOOD CULTURES BEFORE ANTIBIOTICS!**
• Obtain 3 sets from 3 different venipuncture sites (≥1 hour apart)
• Do NOT delay antibiotics if septic shock

**EMPIRIC THERAPY (culture results pending):**

**Native Valve:**
• Ampicillin 2g IV q4h + (Oxacillin/Nafcillin 2g IV q4h OR Vancomycin) + Gentamicin 1mg/kg IV q8h

**Prosthetic Valve (<1 year post-op):**
• Vancomycin 15-20mg/kg IV q8-12h + Gentamicin 1mg/kg IV q8h + Rifampin 300-450mg PO q8h

**PATHOGEN-DIRECTED THERAPY:**

**Staphylococcus aureus (MSSA):**
• Oxacillin/Nafcillin 2g IV q4h ×6 weeks (preferred over vancomycin for MSSA)
• Alternative: Cefazolin 2g IV q8h

**Staphylococcus aureus (MRSA):**
• Vancomycin 15-20mg/kg IV q8-12h (trough 15-20 mcg/mL) ×6 weeks
• Alternative: Daptomycin 6-10mg/kg IV daily

**Streptococcus viridans (fully susceptible):**
• Penicillin G 12-18 million U/day continuous or q4h ×4 weeks
• OR Ceftriaxone 2g IV daily ×4 weeks
• Can add Gentamicin for 2 weeks (shortens duration)

**Enterococcus:**
• Ampicillin 2g IV q4h + Ceftriaxone 2g IV q12h ×6 weeks (dual beta-lactam - reduced nephrotoxicity)
• OR Ampicillin + Gentamicin (traditional, more nephrotoxic)

**HACEK Organisms:**
• Ceftriaxone 2g IV daily ×4 weeks

**INDICATIONS FOR SURGERY (Early - within first week):**
• CHF from valvular regurgitation
• Perivalvular abscess, fistula, or heart block
• Persistent bacteremia >5-7 days despite appropriate antibiotics
• Fungal endocarditis
• Prosthetic valve dehiscence
• Recurrent emboli despite antibiotics
• Vegetation size >10mm + embolic event

**MONITORING:**
• Daily blood cultures until negative (usually 48-72h)
• Echo (TEE preferred) at diagnosis + if clinical deterioration
• Monitor for embolic complications: CNS (stroke, mycotic aneurysm), spleen, kidneys
• Renal function + gentamicin/vancomycin levels

**DISPOSITION:** 
• All IE patients: Hospital admission
• Unstable/severe: ICU
• Stable: General ward with ID + Cardiology consultation`,

  // ==================== FALLBACK ====================
  'hypertension': `💗 **HYPERTENSION MANAGEMENT (ACC/AHA 2017 / JNC 8)**

See 'hypertensive emergency' for acute severe hypertension with end-organ damage.

For chronic hypertension management, refer to stepwise approach with lifestyle modifications + pharmacotherapy based on comorbidities and age.`,
};
