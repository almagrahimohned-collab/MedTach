// 🫁 Pulmonology Management Hints
// References: Tintinalli 9th Ed, GOLD 2024, BTS Guidelines, Medscape, Davidson's

export const PULMONOLOGY_HINTS: Record<string, string> = {
  
  // ==================== BEGINNER ====================
  'pneumonia': `🫁 **COMMUNITY-ACQUIRED PNEUMONIA (IDSA/ATS 2019 / Davidson's Ch 17)**

**SITE OF CARE DECISION (CURB-65 Score):**
• Confusion (new) - 1
• Urea >7 mmol/L (BUN >20) - 1
• Respiratory rate ≥30 - 1
• Blood pressure: SBP <90 or DBP ≤60 - 1
• Age ≥65 - 1
→ Score 0-1: Outpatient | Score 2: Consider admission | Score ≥3: Admit (ICU if ≥4)

**OUTPATIENT (No comorbidities, no recent antibiotics):**
• Amoxicillin 1g PO TID ×5-7 days
• OR Doxycycline 100mg PO BID ×5-7 days

**OUTPATIENT (With comorbidities: DM, CKD, COPD, immunocompromised):**
• Amoxicillin-Clavulanate 875/125mg PO BID
• PLUS Azithromycin 500mg PO day 1, then 250mg ×4 days
• OR Respiratory fluoroquinolone: Levofloxacin 750mg PO daily ×5 days

**INPATIENT (Non-ICU):**
• Ceftriaxone 2g IV daily + Azithromycin 500mg IV daily
• OR Respiratory fluoroquinolone: Levofloxacin 750mg IV daily

**ICU (Severe CAP):**
• Ceftriaxone 2g IV daily + Azithromycin 500mg IV daily
• OR Ceftriaxone + Levofloxacin 750mg IV daily
• ADD Vancomycin 15-20mg/kg IV q8-12h if MRSA risk factors
• ADD anti-pseudomonal if: Prior pseudomonas, recent hospitalization, structural lung disease

**MRSA RISK FACTORS:**
• Prior MRSA infection/colonization
• Recent hospitalization + IV antibiotics
• Necrotizing/cavitary pneumonia
• ICU admission with septic shock

**DURATION:**
• Minimum 5 days, afebrile ×48-72h, clinically stable
• Stop antibiotics when clinically stable, not based on CXR (takes weeks to clear)

**STEROIDS:**
• Consider Methylprednisolone 40mg IV daily if severe CAP with septic shock (ESC 2023 - reduces duration of shock)
• Routine steroids NOT recommended for all CAP

**DISPOSITION:**
• CURB-65 0-1: Outpatient, follow-up 48-72h
• CURB-65 2: Observation or short admission
• CURB-65 ≥3: Admit medical ward
• CURB-65 ≥4 or ICU criteria: ICU admission

**RED FLAGS:**
• Multilobar involvement, parapneumonic effusion/empyema
• Failure to improve in 48-72h: Consider resistant organism, complication, or alternative diagnosis`,

  'pleural effusion': `💧 **PLEURAL EFFUSION (BTS Guidelines / Davidson's Ch 18)**

**LIGHT'S CRITERIA (Exudate if ANY ONE met):**
1. Pleural fluid protein / Serum protein >0.5
2. Pleural fluid LDH / Serum LDH >0.6
3. Pleural fluid LDH >2/3 upper limit of normal serum LDH
→ Exudate: Further investigation needed | Transudate: Treat underlying cause

**DIAGNOSTIC THORACENTESIS (Always send):**
• LDH, protein, glucose, pH (in heparinized blood gas syringe)
• Gram stain + culture (inoculate blood culture bottles at bedside)
• Cytology (if malignancy suspected)
• AFB + Adenosine deaminase (ADA) if TB suspected
• Triglycerides (if chylothorax suspected - milky fluid)

**COMMON CAUSES BY TYPE:**

**TRANSUDATE:**
• CHF: Bilateral, diuresis. Therapeutic thoracentesis if large + symptomatic
• Cirrhosis (hepatic hydrothorax): Sodium restriction + diuretics. TIPS if refractory
• Nephrotic syndrome: Treat proteinuria. Diuretics + salt restriction
• Atelectasis: Treat underlying cause

**EXUDATE:**
• Parapneumonic: Antibiotics + drainage if complicated (pH <7.2, glucose <60, positive culture)
• Malignancy: Therapeutic thoracentesis + pleurodesis (talc) or indwelling pleural catheter
• TB pleuritis: Anti-TB therapy ×6 months (RIPE). ADA >40 strongly suggestive
• Pulmonary embolism: Anticoagulation (effusion resolves with treatment)
• Connective tissue disease: Treat underlying disease ± NSAIDs/steroids

**PLEURAL INFECTION/EMPYEMA:**
• Complicated parapneumonic: pH <7.2, glucose <60, LDH >1000, loculations
• Chest tube drainage (28-32Fr)
• Intrapleural tPA + DNase (MIST2 trial) if loculated
• Surgical decortication (VATS) if conservative management fails

**WHEN TO DRAIN:**
• Symptomatic large effusion (dyspnea)
• Complicated parapneumonic/empyema
• Diagnostic if cause unknown
• Do NOT drain bilateral transudates initially - diurese first!

**PEARL:** Always check pleural fluid hematocrit if bloody: >50% serum Hct = hemothorax (chest tube!)`,

  // ==================== INTERMEDIATE ====================
  'asthma': `🫁 **ASTHMA EXACERBATION (GINA 2024 / Tintinalli Ch 68)**

**SEVERITY ASSESSMENT (PEFR = Peak Expiratory Flow Rate):**
• Mild: PEFR >70%, speaks in sentences, RR <25
• Moderate: PEFR 50-70%, speaks in phrases, RR 25-30, HR 100-120
• Severe: PEFR 25-50%, speaks in words, RR >30, HR >120, SpO₂ <92%
• Life-threatening: PEFR <25%, silent chest, cyanosis, confusion, SpO₂ <88%, PaCO₂ normal or elevated

**IMMEDIATE MANAGEMENT (O₂ to target SpO₂ 93-95%):**

**BRONCHODILATORS:**
• Albuterol: 2.5-5mg nebulized q20min ×3 doses (continuous if severe)
  - OR MDI 4-8 puffs q20min with spacer (equally effective)
• Ipratropium: 0.5mg nebulized q20min ×3 doses (first hour only)

**SYSTEMIC CORTICOSTEROIDS (Give within 1 hour - Class I):**
• Prednisone 50mg PO daily ×5-7 days (no taper needed for short course)
• OR Methylprednisolone 40-60mg IV q6-12h (if unable to take PO)
• Dexamethasone 12mg PO/IV daily (equally effective, less frequent dosing)

**MAGNESIUM SULFATE (if severe/life-threatening):**
• 2g IV over 20 minutes (Caution: hypotension, respiratory depression)
• Evidence: Reduces hospitalizations in severe asthma (moderate evidence)

**NON-INVASIVE VENTILATION (BiPAP/CPAP):**
• Consider if not responding to initial therapy
• Reduces intubation rate, improves oxygenation
• Contraindicated if: Altered mental status, vomiting, hemodynamic instability

**INTUBATION CRITERIA:**
• Cardiac arrest, respiratory arrest
• Severe hypoxia despite maximal therapy
• Altered mental status (cannot protect airway)
• Exhaustion with rising PaCO₂

**POST-INTUBATION VENTILATION STRATEGY:**
• Permissive hypercapnia: Low tidal volumes (6-8 mL/kg), low RR (8-10)
• Prolonged expiratory time (I:E ratio 1:4 or 1:5)
• Goal: Prevent dynamic hyperinflation + barotrauma

**DISPOSITION:**
• Mild: Discharge if PEFR >70% predicted, sustained 60 min after last treatment
  - Prednisone ×5 days, albuterol MDI PRN, ICS (if not on controller)
  - Follow-up within 2-7 days
• Moderate: Observation unit or admission
• Severe/Life-threatening: ICU admission

**DISCHARGE CHECKLIST:**
• PEFR >70% predicted, sustained >60 min
• Able to use MDI with proper technique
• Prednisone prescription + ICS (beclomethasone or budesonide/formoterol)
• Written asthma action plan
• Follow-up arranged`,

  'pulmonary embolism': `🩸 **PULMONARY EMBOLISM (ESC 2019 / AHA 2023 / Tintinalli Ch 70)**

**WELLS CRITERIA (Determine Pre-Test Probability):**
• Clinical signs/symptoms of DVT: +3
• PE is #1 diagnosis or equally likely: +3
• HR >100: +1.5
• Immobilization/surgery within 4 weeks: +1.5
• Previous DVT/PE: +1.5
• Hemoptysis: +1
• Cancer (active): +1
→ Score ≤4: PE unlikely (PERC rule) | Score >4: PE likely (CTPA)

**DIAGNOSTIC ALGORITHM:**
• Unstable (SBP <90): Bedside Echo → RV dysfunction? → Thrombolysis
• Stable + Wells ≤4: PERC rule. If PERC=0 → No further testing. If any PERC positive → D-dimer
• Stable + Wells >4: CTPA directly
• D-dimer (age-adjusted if >50): <500 ng/mL or <(age×10) rules out PE

**RISK STRATIFICATION:**

**HIGH-RISK (Massive PE):**
• SBP <90 for >15 min or requiring vasopressors
• Cardiac arrest
→ **Thrombolysis: Alteplase (tPA) 100mg IV over 2 hours**
  - Or 50mg bolus if cardiac arrest (simplified regimen)
  - Absolute contraindications: Active bleeding, recent stroke, recent surgery

**INTERMEDIATE-RISK (Submassive PE):**
• SBP ≥90 + RV dysfunction (Echo: RV/LV ratio >1, McConnell sign) + elevated troponin
→ Anticoagulation. Consider catheter-directed thrombolysis if deteriorating

**LOW-RISK:**
• SBP ≥90, normal RV function, normal troponin
→ Anticoagulation. May be candidate for early discharge/outpatient management (HESTIA criteria)

**ANTICOAGULATION:**

**Immediate (Before confirmation if high suspicion):**
• Enoxaparin 1mg/kg SC q12h OR 1.5mg/kg SC daily
• OR Unfractionated heparin: 80 U/kg bolus → 18 U/kg/hr (if thrombolysis possible, CrCl <30, or high bleeding risk)

**Long-Term (Choose ONE):**
• DOACs (First-line): Rivaroxaban 15mg BID ×3 weeks → 20mg daily OR Apixaban 10mg BID ×7 days → 5mg BID
• Warfarin: Bridge with LMWH ≥5 days until INR 2-3 ×24h
• LMWH alone: If active cancer (CLOT trial - Dalteparin)

**DURATION:**
• Provoked (reversible risk factor): 3 months
• Unprovoked: 3 months then reassess for extended anticoagulation
• Cancer-associated: Indefinite (or until cancer resolved)
• Recurrent: Indefinite

**IVC FILTER:** 
Only if anticoagulation absolutely contraindicated + acute proximal DVT/PE
(Not routine - PREPIC2 trial showed no mortality benefit)

**DISPOSITION:**
• Massive PE: ICU for thrombolysis
• Submassive: Monitored bed, cardiology consult
• Low-risk + HESTIA criteria met: Consider outpatient management with DOAC
• PESI Class I-II (low risk): Can discharge early

**PREGNANCY CONSIDERATION:**
• LMWH is safe (does not cross placenta). Avoid DOACs + Warfarin
• CTPA vs V/Q scan: Both acceptable. CTPA delivers less fetal radiation`,

  'pneumothorax': `🫧 **PNEUMOTHORAX (BTS 2023 / Tintinalli Ch 71)**

**TYPES:**
• Primary spontaneous: No underlying lung disease (tall, thin, young males, smokers)
• Secondary spontaneous: Underlying lung disease (COPD, CF, TB, malignancy)
• Traumatic: Penetrating/blunt chest trauma
• Tension: One-way valve → progressive accumulation → mediastinal shift → obstructive shock

**TENSION PNEUMOTHORAX (Clinical Diagnosis - Do NOT wait for CXR!):**
• Hypotension, JVD, tracheal deviation AWAY from affected side
• Absent breath sounds, hyperresonance to percussion
• **Immediate needle decompression:** 14G needle, 2nd ICS midclavicular line
  - OR 5th ICS anterior axillary line (ATLS 10th Ed)
  - Follow with tube thoracostomy (chest tube)

**SIZE ASSESSMENT (CXR):**
• Small: <2cm rim from chest wall at hilum level
• Large: ≥2cm rim

**MANAGEMENT BY TYPE:**

**PRIMARY SPONTANEOUS PNEUMOTHORAX:**

| Size | Symptomatic | Asymptomatic |
|------|-------------|--------------|
| Small (<2cm) | Aspirate | Observe 4-6h → repeat CXR → home if stable |
| Large (≥2cm) | Aspirate → if fails → chest drain | Aspirate |

• Simple aspiration: 16-18G catheter, 2nd ICS MCL, aspirate until resistance or 2.5L removed
• Success rate: 50-70% for primary spontaneous
• If aspiration fails → Small-bore chest tube (8-14Fr) with Heimlich valve or water seal

**SECONDARY SPONTANEOUS PNEUMOTHORAX:**
• Always requires admission (high risk of tension)
• Small (<2cm) + asymptomatic: Small-bore chest drain
• Large or symptomatic: Chest drain (16-22Fr)
• VATS pleurodesis + bullectomy if: Recurrent, persistent air leak >5 days, bilateral

**CHEST DRAIN MANAGEMENT:**
• Connect to underwater seal (NOT suction initially - risk re-expansion pulmonary edema)
• Bubbling = air leak (document if continuous or only on coughing)
• Swinging = patent drain
• Suction (-20 cmH₂O): Only if lung not re-expanded in 48h

**REMOVAL CRITERIA:**
• Lung fully expanded on CXR
• No air leak (no bubbling) for 24h
• Drainage <200 mL/day
• Remove during expiration or Valsalva maneuver

**DISPOSITION:**
• Primary small + aspirated successfully: Discharge with follow-up 2-4 weeks
• Primary large, secondary, or chest tube: Admit
• Tension: ICU after decompression
• Advise: No air travel ×2 weeks after resolution, no diving EVER after spontaneous PTX

**RECURRENCE PREVENTION:**
• Offer VATS pleurodesis after 2nd episode
• Smoking cessation reduces recurrence risk 50%`,

  // ==================== ADVANCED ====================
  'ards': `🫁 **ARDS - ACUTE RESPIRATORY DISTRESS SYNDROME (Berlin Definition / ATS 2024)**

**BERLIN CRITERIA (All 4 required):**
1. Acute onset (<7 days of known clinical insult)
2. CXR/CT: Bilateral opacities (not explained by effusion, collapse, nodules)
3. Respiratory failure not fully explained by cardiac failure/fluid overload
4. PaO₂/FiO₂ ratio (on PEEP ≥5 cmH₂O):
   • Mild: 200-300 mmHg
   • Moderate: 100-200 mmHg
   • Severe: <100 mmHg

**COMMON CAUSES:**
• Direct: Pneumonia, aspiration, near-drowning, inhalation injury, pulmonary contusion
• Indirect: Sepsis, pancreatitis, trauma, burns, massive transfusion, DIC

**INITIAL MANAGEMENT:**

**VENTILATION (ARDSNet Protocol - ARMA Trial):**
• Mode: Volume control (assist-control)
• **Low tidal volume: 6 mL/kg predicted body weight** (reduces mortality 22%!)
• Plateau pressure: <30 cmH₂O (prevents barotrauma)
• PEEP: Start at 5 cmH₂O, titrate using PEEP table (ARDSNet)
• **Permissive hypercapnia:** Allow PaCO₂ to rise (pH >7.15 acceptable)
• FiO₂: Titrate to SpO₂ 88-95% or PaO₂ 55-80 mmHg

**PRONE POSITIONING (PROSEVA Trial):**
• Indication: PaO₂/FiO₂ <150 (moderate-severe ARDS)
• Duration: ≥16 hours per day (reduces mortality 50% in severe ARDS!)
• Early initiation (within 36h)
• Contraindications: Unstable spine, open abdomen, ICP monitoring

**NEUROMUSCULAR BLOCKADE (ROSE Trial - Rethinking):**
• Consider Cisatracurium 15mg bolus → 37.5mg/hr ×48h in early severe ARDS
• Current evidence: Selective use for dyssynchrony, not routine for all

**CONSERVATIVE FLUID STRATEGY (FACTT Trial):**
• Target CVP <4 mmHg or PAOP <8 mmHg
• Diurese after initial resuscitation phase
• Reduces ventilator days without increasing renal failure

**RESCUE THERAPIES (Severe Refractory ARDS):**
• Recruitment maneuvers: Transient increase in PEEP to 30-40 cmH₂O (caution: hypotension, barotrauma)
• Inhaled pulmonary vasodilators: Inhaled nitric oxide (iNO) 5-20ppm or Epoprostenol 50ng/kg/min (improves oxygenation, no mortality benefit)
• ECMO (V-V): If PaO₂/FiO₂ <80 despite optimal therapy (CESAR trial)
• High-frequency oscillatory ventilation: NOT recommended (OSCILLATE/OSCAR trials - harm or no benefit)

**SUPPORTIVE CARE:**
• Head of bed elevation 30-45° (VAP prevention)
• DVT prophylaxis: Enoxaparin 40mg SC daily
• Stress ulcer prophylaxis: Famotidine 20mg IV BID or Pantoprazole 40mg IV daily
• Daily sedation interruption + spontaneous breathing trials
• Early enteral nutrition (within 24-48h)

**MONITORING:**
• ABG q4-6h (or more frequent if unstable)
• Plateau pressure q4h and after any ventilator change
• Driving pressure (Pplat - PEEP): Target <15 cmH₂O
• Lung compliance + resistance trends

**WEANING:**
• SBT (Spontaneous Breathing Trial) daily when: FiO₂ ≤0.4, PEEP ≤8, hemodynamically stable
• RSBI (Rapid Shallow Breathing Index): RR/TV <105 predicts success
• Extubate if: SBT tolerated ×30 min, adequate cough, minimal secretions

**DISPOSITION:** ICU admission mandatory

**PROGNOSIS:** Mortality 35-45%. Long-term: Weakness, cognitive impairment, PTSD`,

};
