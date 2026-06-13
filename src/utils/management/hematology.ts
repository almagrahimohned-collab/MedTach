// 🩸 Hematology Management Hints
// References: ASH Guidelines, BSH Guidelines, Tintinalli 9th Ed, Medscape

export const HEMATOLOGY_HINTS: Record<string, string> = {
  
  // ==================== BEGINNER ====================
  'anemia iron deficiency': `🩸 **IRON DEFICIENCY ANEMIA (ASH Guidelines / Davidson's Ch 21)**

**MICROCYTIC ANEMIA (MCV <80 fL) - Differential:**
• Iron deficiency (most common)
• Thalassemia (normal/high RBC count, normal RDW)
• Anemia of chronic disease (ACD - usually normocytic, can be microcytic)
• Sideroblastic anemia
• Lead poisoning

**LABORATORY FINDINGS IN IRON DEFICIENCY:**
• Low: Hb, MCV, MCH, ferritin, serum iron, transferrin saturation (<15%)
• High: TIBC (total iron binding capacity), RDW (anisocytosis), transferrin, soluble transferrin receptor
• Platelets: Often elevated (reactive thrombocytosis)
• Ferritin: <15 ng/mL = diagnostic (<50 in CKD/inflammation)
• Gold standard: Bone marrow biopsy (absent iron stores) - rarely needed

**CAUSES (Always Identify and Treat Underlying Cause!):**
• Blood loss: Menorrhagia (most common in premenopausal women), GI bleeding (most common in men + postmenopausal women)
• Decreased absorption: Celiac disease, H. pylori, atrophic gastritis, gastric bypass
• Increased demand: Pregnancy, lactation, growth spurts
• Dietary: Vegetarians/vegans, elderly, poverty (rare in developed countries alone)

**WORKUP FOR CAUSE:**
• GI evaluation: EGD + colonoscopy (ALL men + postmenopausal women with unexplained IDA!)
• Celiac serology: tTG-IgA + total IgA
• Menstrual history: Duration, frequency, clots, flooding
• Urinalysis: Hematuria (rare cause of IDA)
• Stool O&P: Hookworm if from endemic area

**TREATMENT:**

**Oral Iron (First-Line):**
• Ferrous sulfate 325mg (65mg elemental iron) PO TID
  - Alternatives: Ferrous gluconate 325mg (38mg elemental) or Ferrous fumarate 325mg (106mg elemental)
• Take on empty stomach (absorption enhanced by vitamin C, decreased by antacids, tea, coffee, calcium)
• If GI intolerance: Take with small amount of food, switch to different formulation, or use lower dose
• Expected response: Reticulocytosis in 5-7 days, Hb rise 1g/dL per week
• Duration: Continue 3-6 months AFTER Hb normalizes to replete stores
• Side effects: Nausea, constipation, diarrhea, black stools (benign, warn patients)

**IV Iron (Indications):**
• Intractable GI side effects (15-20% of patients)
• Severe malabsorption (celiac, inflammatory bowel disease, gastric bypass)
• Ongoing significant blood loss exceeding oral replacement capacity
• CKD on dialysis (IV iron standard of care)
• Need for rapid correction (pre-operative, severe symptoms)

**IV Iron Formulations:**
• Iron sucrose (Venofer): 200-300mg IV over 15-60 min, repeat q1-3 days (total dose typically 1000mg)
• Ferric carboxymaltose (Injectafer): 750mg IV over 15 min, repeat ×1 at 7 days (total 1500mg)
  - Allows larger single doses, fewer visits
• Low molecular weight iron dextran (INFeD): Test dose required (rare anaphylaxis)
• Ferumoxytol (Feraheme): 510mg IV over 15 min, repeat at 3-8 days
• Ferric derisomaltose (Monoferric): 1000mg IV single dose over 20 min
  - Simplest: Single infusion replaces total deficit

**BLOOD TRANSFUSION (If Symptomatic):**
• Restrictive strategy: Hb <7 g/dL (or <8 if CAD/active bleeding)
• Transfuse 1 unit pRBC → recheck Hb (expect 1g/dL increase per unit)
• Avoid routine transfusion in stable, asymptomatic IDA (oral/IV iron preferred)

**SPECIAL POPULATIONS:**

**Pregnancy:**
• Universal iron supplementation recommended (30-60mg elemental daily)
• Treat IDA aggressively (associated with preterm birth, low birth weight, postpartum depression)

**Heart Failure:**
• Treat IDA regardless of Hb! (FAIR-HF, CONFIRM-HF trials)
  - IV iron improves symptoms, exercise capacity, quality of life
• Ferric carboxymaltose preferred (studied in HF trials)

**FOLLOW-UP:**
• Repeat Hb + ferritin at 1-3 months
• Goal: Ferritin >50 ng/mL, transferrin saturation >20%
• If no response: Check adherence, consider ongoing blood loss, malabsorption, or wrong diagnosis
• Once replete: Monitor Hb annually + if symptoms recur

**DISPOSITION:**
• Asymptomatic, Hb >7: Outpatient workup + oral iron
• Symptomatic, moderate anemia: Consider IV iron
• Severe symptomatic anemia (Hb <7, angina, dyspnea, hemodynamic instability): Admit for transfusion`,

  // ==================== INTERMEDIATE ====================
  'dvt': `🩸 **DEEP VEIN THROMBOSIS (ACCP CHEST Guidelines 2021 / ASH 2023)**

**WELLS SCORE (Pre-Test Probability):**
• Active cancer: +1
• Paralysis/immobilization of leg: +1
• Bedridden >3 days or surgery <12 weeks: +1
• Localized tenderness along deep veins: +1
• Entire leg swollen: +1
• Calf swelling >3cm vs asymptomatic side: +1
• Pitting edema confined to symptomatic leg: +1
• Collateral superficial veins: +1
• Alternative diagnosis as likely or more likely than DVT: -2
→ Score ≤0: Low risk (D-dimer) | Score 1-2: Moderate | Score ≥3: High risk (ultrasound)

**DIAGNOSTIC ALGORITHM:**
• Low risk (Wells ≤0): D-dimer (high sensitivity, low specificity)
  - If negative → DVT excluded
  - If positive → Compression ultrasound
• Moderate-High risk (Wells ≥1): Compression ultrasound directly
  - Proximal DVT: Femoral, popliteal veins (high risk of embolization)
  - Distal DVT: Calf veins (lower risk, management controversial)
• Serial ultrasound: If initial negative + high suspicion, repeat in 5-7 days

**TREATMENT:**

**INITIAL ANTICOAGULATION (Choose ONE):**

**DOACs (First-Line - No Monitoring Required):**
• Rivaroxaban (Xarelto): 15mg PO BID ×3 weeks → 20mg daily with food
• Apixaban (Eliquis): 10mg PO BID ×7 days → 5mg PO BID
• Edoxaban (Savaysa): 60mg PO daily (after 5-10 days of LMWH lead-in)
  - Reduce to 30mg if: CrCl 15-50, weight <60kg, or strong P-gp inhibitors
• Dabigatran (Pradaxa): 150mg PO BID (after 5-10 days of LMWH lead-in)

**LMWH (If DOACs Contraindicated):**
• Enoxaparin: 1mg/kg SC BID or 1.5mg/kg SC daily
• Preferred in: Cancer-associated thrombosis, pregnancy, CrCl <30 (reduce dose)

**Warfarin (If Cost is Primary Concern or APS):**
• Start with LMWH bridge ×5+ days until INR 2-3 ×24h
• Frequent INR monitoring required

**Unfractionated Heparin (Special Situations):**
• Severe renal impairment (CrCl <15)
• High bleeding risk (reversible, short half-life)
• Need for procedures/interventions

**TREATMENT DURATION:**

**Provoked DVT (reversible risk factor: surgery, trauma, immobilization):**
• 3 months anticoagulation

**Unprovoked DVT (no clear trigger):**
• Minimum 3 months → reassess for extended anticoagulation
• Consider extended if: Male, low bleeding risk, D-dimer positive after stopping
• DOAC reduced dose for extended: Rivaroxaban 10mg daily or Apixaban 2.5mg BID (after 6 months full dose)

**Cancer-Associated Thrombosis (CAT):**
• LMWH ×3-6 months (CLOT trial - Dalteparin superior to Warfarin)
• OR DOACs: Rivaroxaban or Edoxaban (non-inferior, increased GI bleeding risk - weigh risk/benefit)
• Indefinite anticoagulation (until cancer resolved)

**Recurrent DVT (while on therapeutic anticoagulation):**
• Check adherence
• Switch to LMWH (if on DOAC) or increase Warfarin target INR to 3-4
• Consider IVC filter if anticoagulation failure despite optimal therapy

**Recurrent Unprovoked DVT:**
• Indefinite anticoagulation (lifelong)

**SPECIAL CONSIDERATIONS:**

**Distal (Calf) DVT:**
• If severe symptoms or risk factors for extension (cancer, unprovoked, inpatient): Anticoagulate 3 months
• If low-risk (post-op, minimal symptoms, no risk factors): Serial ultrasound surveillance ×2 weeks
  - If extends → Anticoagulate; if stable → Observation

**Upper Extremity DVT:**
• PICC-line associated: Remove catheter + anticoagulate 3 months
• Paget-Schroetter syndrome (effort thrombosis - young athletes): Anticoagulate + consider catheter-directed thrombolysis + thoracic outlet decompression

**Pregnancy:**
• LMWH (Enoxaparin) - does NOT cross placenta
• Avoid: DOACs (cross placenta, teratogenic in animal studies), Warfarin (teratogenic in 1st trimester)
• Continue ×6 weeks postpartum (minimum 3 months total)
• Epidural: Hold LMWH ≥24h before placement

**Heparin-Induced Thrombocytopenia (HIT):**
• Suspect if: Platelets drop >50% or <150K, 5-14 days after heparin initiation
• Confirm: 4T score + anti-PF4 antibody
• Stop ALL heparin (including LMWH, heparin flushes!)
• Start non-heparin anticoagulant: Argatroban (IV) or Bivalirudin or Fondaparinux
• Transition to Warfarin ONLY after platelets >150K (risk of warfarin-induced skin necrosis)

**THROMBOLYSIS (Catheter-Directed):**
• Consider for: Iliofemoral DVT (<14 days), phlegmasia cerulea dolens (limb-threatening), young, functional
• Goal: Prevent post-thrombotic syndrome
• ATTRACT trial: Reduced post-thrombotic syndrome severity (not incidence)
• Systemic thrombolysis NOT recommended (high bleeding risk)

**COMPRESSION STOCKINGS:**
• 30-40mmHg graduated compression
• Reduce post-thrombotic syndrome (pain, swelling)
• Start when swelling improves, continue ×2 years
• SOX trial challenged benefit - selective use for symptomatic edema

**IVC FILTER (Inferior Vena Cava Filter):**
• Indications: Absolute contraindication to anticoagulation + acute proximal DVT/PE, failure of anticoagulation despite therapeutic levels
• NOT routine (PREPIC2 trial - no mortality benefit, increased DVT risk)
• Retrievable filter preferred → Remove when anticoagulation can be safely started

**FOLLOW-UP:**
• Monitor for post-thrombotic syndrome: Chronic leg pain, swelling, discoloration, ulcers
• Reassess anticoagulation duration at 3 months
• Cancer screening: Age-appropriate + consider if unprovoked (controversial - limited evidence)
• Thrombophilia testing: Select patients (young, recurrent, family history, unusual site)

**DISPOSITION:**
• Acute DVT, stable, no PE symptoms: Outpatient management with DOAC
• Acute DVT + suspected PE: Admit for CTPA + management
• Extensive iliofemoral DVT: Consider admission for catheter-directed thrombolysis
• Phlegmasia cerulea dolens: Emergency - threatens limb viability - urgent thrombolysis/thrombectomy`,

};
