// 🏥 Gastroenterology Management Hints
// References: Tintinalli 9th Ed, ACG Guidelines, AGA Guidelines, Medscape, Davidson's

export const GASTROENTEROLOGY_HINTS: Record<string, string> = {
  
  // ==================== BEGINNER ====================
  'appendicitis': `🔪 **ACUTE APPENDICITIS (WSES Guidelines 2023 / Tintinalli Ch 83)**

**CLINICAL FEATURES:**
• Periumbilical pain → migrates to RLQ (McBurney's point)
• Anorexia, nausea, vomiting (typically after pain onset)
• Low-grade fever (high fever suggests perforation)
• Signs: McBurney's point tenderness, Rovsing sign, Psoas sign (retrocecal), Obturator sign (pelvic)
• Alvarado Score: Predicts probability (≥7 = high risk)

**DIAGNOSIS (Age and Resource Dependent):**

**Adults (Aged 18-40):**
• CT Abdomen/Pelvis with IV contrast: Sensitivity 95%, Specificity 94%
• Low-dose CT preferred in young patients

**Pregnancy:**
• Ultrasound first-line (avoid radiation)
• MRI if US inconclusive (no radiation, high accuracy)

**Children:**
• Ultrasound first-line (avoid radiation)
• CT if US inconclusive + high clinical suspicion

**MANAGEMENT:**

**NON-OPERATIVE (Antibiotics Alone):**
• Selected uncomplicated appendicitis (no appendicolith, no abscess, no perforation)
• Antibiotics: Ertapenem 1g IV daily OR Ceftriaxone 2g IV + Metronidazole 500mg IV q8h ×7-10 days
• Success rate: 70-75% at 1 year, 40% recurrence at 5 years (APPAC trial)
• Discuss recurrence risk with patient (surgery definitive, antibiotics = 25% failure in 1 year)

**SURGICAL (Laparoscopic Appendectomy - Gold Standard):**
• Pre-op antibiotics (within 60 min of incision): Cefoxitin 2g IV or Cefazolin 2g + Metronidazole 500mg IV
• Laparoscopic preferred: Less pain, shorter stay, faster recovery, fewer wound infections
• Open appendectomy: If laparoscopy contraindicated or converted

**COMPLICATED APPENDICITIS (Perforation, Abscess, Phlegmon):**

**Stable Patient:**
• Percutaneous drainage (if abscess >3cm) + IV antibiotics
• Interval appendectomy: 6-12 weeks later (controversial - some guidelines no longer recommend routine interval appendectomy)
• Antibiotics: Piperacillin-Tazobactam 3.375g IV q6h OR Meropenem 1g IV q8h

**Unstable/Generalized Peritonitis:**
• Emergency laparotomy/laparoscopy
• Source control: Appendectomy + peritoneal washout
• Post-op: Continue IV antibiotics until afebrile + WBC normalizing

**POST-OPERATIVE CARE:**
• Early ambulation, advance diet as tolerated
• DVT prophylaxis: Early mobilization ± LMWH if high risk
• Discharge: When tolerating PO, pain controlled PO, afebrile
• Complications: Surgical site infection (5-10%), intra-abdominal abscess (2-5%), ileus

**SPECIAL POPULATIONS:**

**Pregnancy:**
• Appendectomy cannot be delayed (risk of perforation = fetal loss 35%!)
• Laparoscopic safe up to 28 weeks (tilt left to avoid IVC compression)
• Fetal monitoring before and after surgery

**Elderly:**
• Often present atypically (less pain, less fever)
• Higher perforation rate (delayed presentation)
• Higher morbidity/mortality

**DISPOSITION:**
• Uncomplicated, post-appendectomy: Discharge 24-48h post-op
• Perforated/abscess: Admit 3-7 days for IV antibiotics
• Non-operative: Discharge on PO antibiotics, close follow-up`,

  'gastritis': `🔥 **GASTRITIS & PEPTIC ULCER DISEASE (ACG Guidelines / Davidson's Ch 14)**

**ETIOLOGIES:**
• H. pylori (70% of PUD) - Gram-negative spiral bacterium
• NSAIDs (including low-dose aspirin)
• Stress gastritis (ICU patients - burns, trauma, sepsis, head injury)
• Alcohol, smoking
• Zollinger-Ellison syndrome (rare - gastrinoma)
• Autoimmune (pernicious anemia - B12 deficiency)

**CLINICAL FEATURES:**
• Epigastric pain/burning (may be relieved or worsened by food)
• Nausea, bloating, early satiety
• Alarm symptoms: Weight loss, dysphagia, vomiting, GI bleeding, anemia, palpable mass
• Gastric ulcer: Pain worse with food (eating increases acid)
• Duodenal ulcer: Pain relieved by food, worse 2-3h after meals, wakes patient at night

**DIAGNOSIS:**

**H. pylori Testing:**
• Urea breath test (active infection - test of cure)
• Stool antigen (active infection - test of cure)
• Endoscopic biopsy: Rapid urease test (CLO test) + histology + culture (if refractory)
• Serology: IgG antibodies (NOT for test of cure - remains positive for years)
• **Stop PPIs 2 weeks before testing** (false negatives!) - H2 blockers 24h before

**Endoscopy (EGD) Indications:**
• Age >60 with new-onset dyspepsia
• Alarm symptoms present
• Failed empiric therapy
• Evaluate for Barrett's esophagus (chronic GERD)

**MANAGEMENT:**

**H. PYLORI ERADICATION (Quadruple Therapy - 14 days):**

**Bismuth Quadruple (Preferred First-Line - ACG 2017):**
• Bismuth subsalicylate 525mg PO QID
• Metronidazole 500mg PO TID-QID
• Tetracycline 500mg PO QID
• PPI (Omeprazole 40mg or equivalent) PO BID
• Duration: 14 days
• Eradication rate: 90-95%

**Clarithromycin Triple (Only if Clarithromycin resistance <15% in region):**
• Clarithromycin 500mg PO BID
• Amoxicillin 1g PO BID (or Metronidazole 500mg BID if penicillin allergic)
• PPI PO BID
• Duration: 14 days

**Levofloxacin Quadruple (Salvage - if first-line fails):**
• Levofloxacin 500mg PO daily
• Amoxicillin 1g PO BID
• PPI PO BID
• Duration: 14 days

**Rifabutin Triple (Rescue - if multiple failures):**
• Rifabutin 150mg PO BID
• Amoxicillin 1g PO BID
• PPI PO BID

**CONFIRM ERADICATION:**
• Urea breath test or stool antigen ≥4 weeks after completing therapy
• Must be off PPIs ×2 weeks, off antibiotics ×4 weeks

**NSAID-RELATED ULCER:**
• Stop NSAID if possible (switch to acetaminophen, non-acetylated salicylate)
• If must continue: PPI + COX-2 selective NSAID (Celecoxib) - reduces but does NOT eliminate risk
• Misoprostol: 200mcg PO QID (only if cannot take PPI - diarrhea limits use)

**PPI THERAPY (Uncomplicated Ulcer):**
• Omeprazole 20-40mg PO daily, Pantoprazole 40mg, Esomeprazole 40mg
• Duration: 4 weeks duodenal, 8 weeks gastric
• Repeat endoscopy to confirm gastric ulcer healing (rule out malignancy)

**COMPLICATIONS:**

**Upper GI Bleeding (see UGIB protocol):**
• Resuscitate: 2 large-bore IVs, IVF, pRBC if Hb <7 (or <8 if CAD)
• IV PPI: Pantoprazole 80mg IV bolus → 8mg/hr infusion ×72h
• Urgent EGD: Within 24h (therapeutic - epinephrine injection, cautery, clips)
• Rockall score: Predicts rebleeding and mortality

**Perforation:**
• Surgical emergency - immediate laparotomy
• Graham patch repair (omental patch)
• Broad-spectrum antibiotics: Piperacillin-Tazobactam or Ciprofloxacin + Metronidazole

**Gastric Outlet Obstruction:**
• NG decompression
• IV PPI
• Endoscopic balloon dilation
• Surgery if refractory

**LONG-TERM:**
• Re-endoscope gastric ulcers to confirm healing (rule out malignancy)
• Maintenance PPI if: Recurrent, complicated, or persistent NSAID use
• Avoid smoking, alcohol, NSAIDs

**DISPOSITION:**
• Uncomplicated: Outpatient treatment
• GI bleeding: Admit (ICU if unstable)
• Perforation: Emergency surgery
• Obstruction: Admit for management`,

  // ==================== INTERMEDIATE ====================
  'pancreatitis': `🫁 **ACUTE PANCREATITIS (Revised Atlanta Classification / ACG Guidelines 2023)**

**DIAGNOSIS (Need 2/3 criteria):**
1. Characteristic abdominal pain (epigastric, radiating to back, severe)
2. Serum lipase (or amylase) ≥3× upper limit of normal
3. Characteristic findings on CT/MRI/US

**NOTE:** Lipase is more sensitive AND specific than amylase (remains elevated longer, not affected by non-pancreatic causes)

**ETIOLOGIES (I GET SMASHED):**
• I: Idiopathic
• G: Gallstones (40% - most common)
• E: Ethanol (30%)
• T: Trauma
• S: Steroids
• M: Mumps/malignancy
• A: Autoimmune
• S: Scorpion stings/spider bites
• H: Hypertriglyceridemia (>1000 mg/dL), Hypercalcemia
• E: ERCP (post-procedure)
• D: Drugs (Azathioprine, Valproic acid, Didanosine, Sulfonamides, Thiazides, Furosemide)

**SEVERITY ASSESSMENT:**

**Ranson Criteria (48h score):**
• At admission: Age >55, WBC >16K, Glucose >200, LDH >350, AST >250
• At 48h: Hct drop >10%, BUN rise >5, Ca <8, PaO₂ <60, Base deficit >4, Fluid sequestration >6L
• Score 0-2: Mild (mortality <1%)
• Score 3-5: Moderate (mortality 15-20%)
• Score ≥6: Severe (mortality >50%)

**BISAP Score (Simpler - Bedside):**
• BUN >25, Impaired mental status, SIRS ≥2, Age >60, Pleural effusion
• Score ≥3: Increased mortality

**CT Severity Index (CTSI):**
• Grade A (normal) to E (>2 fluid collections)
• CTSI ≥7: Severe pancreatitis

**MANAGEMENT:**

**1. FLUID RESUSCITATION (Most Important First Step!):**
• Aggressive IV fluids: Lactated Ringer's (preferred over NS - reduces SIRS per RCTs)
• Rate: 250-500 mL/hr for first 12-24h (or 5-10 mL/kg/hr)
• Goal: BUN decreasing, HR <100, UOP >0.5 mL/kg/hr, Hct 35-44%
• Caution: Elderly, CKD, CHF - reassess q4-6h for fluid overload

**2. PAIN CONTROL:**
• IV opioids: Morphine 2-4mg IV q2-4h or Hydromorphone 0.5-1mg IV q3-4h
• PCA pump for severe pain
• Myth: Morphine does NOT worsen pancreatitis (no evidence for sphincter of Oddi spasm concern)

**3. NUTRITION (Early Enteral Feeding!):**
• Mild pancreatitis: Start oral diet when pain decreases + appetite returns
  - Low-fat solid diet (equally tolerated as clear liquids, faster recovery)
• Severe pancreatitis: Enteral nutrition within 24-48h via NJ tube (NOT NPO!)
  - Reduces infected necrosis, organ failure, mortality vs TPN
  - TPN only if enteral not tolerated after 72h or ileus

**4. ANTIBIOTICS:**
• NOT routinely indicated for prophylaxis (no mortality benefit)
• Reserved for: Confirmed infected necrosis (positive cultures, gas on CT) or cholangitis
• Suspect infected necrosis if: New fever >7-10 days, worsening despite support
  - CT-guided FNA for culture (Gram stain)
  - Empiric: Carbapenem (Meropenem 1g IV q8h) - penetrates pancreas well

**5. ERCP (Within 24h):**
• Indications: Cholangitis + biliary pancreatitis
• Urgent (within 24h): Confirmed biliary obstruction + cholangitis
• NOT for: Mild biliary pancreatitis without obstruction (can wait for interval cholecystectomy)

**LOCAL COMPLICATIONS:**

**Acute Peripancreatic Fluid Collection (APFC): <4 weeks**
• Usually sterile, resolves spontaneously
• No drainage needed unless infected

**Pancreatic Pseudocyst: >4 weeks, encapsulated**
• Drain if: Symptomatic (pain, obstruction), infected, enlarging
• Endoscopic cystogastrostomy (preferred) or percutaneous

**Acute Necrotic Collection (ANC): <4 weeks**
• Necrosis on CT (non-enhancing areas)
• Sterile: Supportive care
• Infected: Antibiotics + delayed drainage (step-up approach)

**Walled-Off Necrosis (WON): >4 weeks**
• Step-up approach: Endoscopic drainage → if fails → percutaneous → if fails → surgical necrosectomy (VARD)
• Delay surgery >4 weeks if possible (reduces mortality)

**CHOLECYSTECTOMY:**
• Mild biliary pancreatitis: During same admission (within 48-72h of resolution)
• Severe biliary pancreatitis: Delay until resolution (4-6 weeks)

**DISPOSITION:**
• Mild pancreatitis (Ranson 0-2, BISAP 0-1): Floor admission
• Moderate-Severe (Ranson ≥3, BISAP ≥2): ICU/step-down
• Necrotizing: ICU (may require tertiary center transfer)
• All biliary pancreatitis: Surgery consult for cholecystectomy timing`,

  'ugib': `🩸 **UPPER GI BLEEDING (ACG Guidelines 2021 / Tintinalli Ch 76)**

**INITIAL ASSESSMENT - ABCs FIRST!**
• 2 large-bore IVs (18G minimum)
• Hemodynamic monitoring: HR, BP (orthostatic), SpO₂
• Initial labs: CBC, coagulation profile, LFTs, BUN/Cr, Type and crossmatch

**RISK STRATIFICATION:**

**Glasgow-Blatchford Score (GBS) - Pre-endoscopy:**
• BUN, Hb, SBP, HR, Melena, Syncope, Liver disease, Cardiac failure
• Score 0-1: Low risk - consider outpatient endoscopy
• Score ≥2: Admit for urgent endoscopy

**Rockall Score - Post-endoscopy:**
• Age, Shock, Comorbidity, Diagnosis, Endoscopic stigmata
• Predicts rebleeding and mortality

**RESUSCITATION:**
• Crystalloid: Normal saline or LR bolus 500mL-1L
• pRBC transfusion if:
  - Hb <7 g/dL (restrictive strategy - reduces rebleeding vs liberal)
  - Hb <8 g/dL if CAD, active bleeding, hemodynamic instability
• Target: SBP >100, HR <100, UOP >0.5 mL/kg/hr
• Coagulopathy: FFP if INR >1.5-2 (not routinely if on warfarin - give PCC if life-threatening)
• Platelets: If <50K or on antiplatelet agents with active bleeding

**MEDICAL THERAPY (Start Immediately):**

**IV PPI (Before Endoscopy - Reduces high-risk stigmata, not mortality):**
• Pantoprazole or Omeprazole 80mg IV bolus → 8mg/hr infusion ×72h
• High-dose IV PPI reduces rebleeding after endoscopic therapy

**Prokinetic Agent (Consider 30 min before endoscopy):**
• Erythromycin 250mg IV over 20-30 min (improves visualization, reduces need for second-look EGD)

**Octreotide (If Variceal Bleeding Suspected - Cirrhosis, Portal HTN):**
• 50mcg IV bolus → 50mcg/hr infusion ×3-5 days
• Reduces portal pressure, controls variceal hemorrhage

**Vasopressin/Terlipressin (Alternative for Varices):**
• Terlipressin 2mg IV q4h (if available - not FDA approved in US)

**Antibiotics (Variceal Bleeding - Reduces Mortality!):**
• Ceftriaxone 1g IV daily ×7 days (or Norfloxacin 400mg PO BID)

**ENDOSCOPY (EGD) - Timing:**
• Emergent (<6h): Hemodynamic instability despite resuscitation
• Urgent (<24h): GBS ≥2, significant bleeding
• Elective: Low-risk (GBS 0-1), stable

**ENDOSCOPIC FINDINGS (Forrest Classification):**
• Ia: Spurting (90% rebleed risk) - Treat
• Ib: Oozing (55% rebleed)
• IIa: Visible vessel (43% rebleed)
• IIb: Adherent clot (22% rebleed)
• IIc: Flat pigmented spot (10% rebleed) - Observe
• III: Clean base (5% rebleed) - Discharge if stable

**ENDOSCOPIC THERAPY:**
• Epinephrine injection (1:10,000) - temporary vasoconstriction
• Thermal coagulation (heater probe, bipolar)
• Hemostatic clips
• Combination: Epinephrine + thermal or mechanical (most effective)

**VARICEAL BLEEDING SPECIFIC THERAPY:**
• Endoscopic variceal ligation (EVL) - preferred over sclerotherapy
• If uncontrolled: Rescue TIPS (transjugular intrahepatic portosystemic shunt)
• Sengstaken-Blakemore tube: Temporary (<24h) - bridge to definitive therapy
  - Gastric balloon 250mL first, if still bleeding inflate esophageal balloon to 30mmHg
  - Complications: Aspiration, esophageal rupture (DO NOT inflate esophageal balloon without gastric balloon!)

**POST-ENDOSCOPY CARE:**
• IV PPI infusion ×72h (if high-risk stigmata)
• NPO → clear liquids after 12-24h → advance as tolerated
• Resume antiplatelets: When? Depends on thrombotic vs bleeding risk
  - Low thrombotic risk: Resume when hemostasis confirmed
  - High thrombotic risk (DES <1yr, ACS <30 days): Resume within 3-5 days

**SECONDARY PREVENTION:**

**Peptic Ulcer:**
• H. pylori testing + eradication (see Gastritis protocol)
• Avoid NSAIDs, aspirin (if possible)
• Maintenance PPI if: Complicated ulcer, requires antiplatelets/NSAIDs

**Varices:**
• Non-selective beta-blockers: Propranolol 20mg BID (titrate to 25% HR reduction or HR 55-60)
  - OR Carvedilol 6.25-12.5mg daily
• Repeat EVL q2-4 weeks until obliteration

**DISPOSITION:**
• GBS 0-1, clean base ulcer: Consider early discharge (<24h)
• All others: Admit for monitoring + endoscopy
• Variceal bleeding: ICU
• Unstable/rebleeding: ICU`,

  // ==================== ADVANCED ====================
  'cirrhosis': `🫁 **CIRRHOSIS & DECOMPENSATED LIVER DISEASE (AASLD Guidelines 2023)**

**CHILD-PUGH SCORE (Assess Severity):**
• Bilirubin, Albumin, INR, Ascites, Encephalopathy
• Class A: 5-6 points (compensated) - 1yr survival 100%
• Class B: 7-9 points (decompensated) - 1yr survival 80%
• Class C: 10-15 points (advanced) - 1yr survival 45%

**MELD-Na Score (Transplant Priority):**
• Bilirubin, Creatinine, INR, Sodium, (recently: Albumin + Sex)
• MELD >15: Refer for transplant evaluation

**COMPLICATIONS MANAGEMENT:**

**1. ASCITES:**

**Initial Management:**
• Sodium restriction: <2g/day (88 mmol/day)
• Diuretics: Spironolactone 100mg + Furosemide 40mg PO daily (ratio 100:40)
  - Titrate: Increase q3-5 days (max 400mg spironolactone + 160mg furosemide)
  - Weight loss goal: 0.5kg/day (no edema) or 1kg/day (with edema)
  - Monitor: Daily weight, renal function, K+

**Refractory Ascites:**
• Large volume paracentesis (LVP): Drain up to 5-8L
  - Albumin 6-8g per liter removed (if >5L) - reduces post-paracentesis circulatory dysfunction (PCD)
• TIPS: Reduces portal pressure, controls ascites (increases encephalopathy risk)
• Transplant evaluation

**SBP (Spontaneous Bacterial Peritonitis) - Ascitic fluid PMN >250:**
• Treat: Cefotaxime 2g IV q8h (or Ceftriaxone 2g IV daily) ×5-7 days
• Albumin: 1.5g/kg day 1, 1g/kg day 3 (reduces hepatorenal syndrome!)
• Prophylaxis after SBP: Norfloxacin 400mg daily or TMP-SMX DS daily

**2. HEPATIC ENCEPHALOPATHY:**

**Precipitants (Always Search!):**
• Infection (SBP, UTI, PNA), GI bleeding, constipation, dehydration
• Electrolyte imbalance (hypokalemia, hyponatremia)
• Sedatives (benzodiazepines, opioids)
• TIPS, surgery, progressive liver disease

**Treatment:**
• Lactulose: 15-30mL PO BID-TID, titrate to 2-3 soft stools/day
  - If unable to take PO: Lactulose enema (300mL + 700mL water, retain 30-60 min)
• Rifaximin: 550mg PO BID (add to lactulose for recurrent/chronic HE - reduces recurrence 58%)
• Identify and treat precipitant!
• Nutritional support: 1.2-1.5g/kg protein (restrict protein ONLY if severe acute episode <24-48h)

**3. HEPATORENAL SYNDROME (HRS-AKI):**

**Diagnosis (ICA Criteria):**
• Cirrhosis + ascites
• sCr increase ≥0.3 mg/dL within 48h OR ≥1.5× baseline
• No improvement after 48h diuretic withdrawal + albumin 1g/kg/day
• Absence of shock, nephrotoxic drugs, parenchymal kidney disease
• No proteinuria >500mg/day, no hematuria >50 RBCs

**Treatment:**
• Terlipressin: 0.85-1mg IV q6h + Albumin 20-40g/day (first-line where available)
• Midodrine 7.5-15mg PO TID + Octreotide 100-200mcg SC TID + Albumin (alternative in US)
• Norepinephrine IV (if ICU) + Albumin
• Hemodialysis: Bridge to transplant
• Liver transplant: Definitive treatment

**4. VARICEAL HEMORRHAGE (See UGIB protocol for acute management)**

**Primary Prophylaxis (No prior bleeding):**
• Non-selective beta-blockers (Propranolol 20mg BID or Carvedilol 6.25-12.5mg daily)
  - Titrate to 25% HR reduction or HR 55-60
• Endoscopic variceal ligation (EVL): If medium/large varices + beta-blocker contraindication
• Screen all cirrhotics with EGD at diagnosis

**Secondary Prophylaxis (After bleed):**
• EVL q2-4 weeks until obliteration + NSBB
• TIPS if refractory

**5. HEPATOCELLULAR CARCINOMA (HCC) SCREENING:**
• Ultrasound + AFP q6 months
• If nodule >1cm: CT/MRI (LI-RADS classification)
• Early-stage: Resection, ablation, transplant
• Intermediate: TACE (transarterial chemoembolization)
• Advanced: Sorafenib, Lenvatinib, Atezolizumab + Bevacizumab
• Metastatic: Best supportive care

**LIVER TRANSPLANT REFERRAL:**
• MELD-Na ≥15
• Decompensated cirrhosis (ascites, HE, variceal bleed, jaundice)
• HCC within Milan criteria
• Hepatopulmonary syndrome, portopulmonary hypertension

**VACCINATIONS (All Cirrhotics):**
• Hepatitis A + B (if not immune)
• Pneumococcal (PPSV23 + PCV13)
• Influenza annually
• COVID-19
• Tdap

**DISPOSITION:**
• Compensated cirrhosis: Outpatient hepatology q3-6 months
• Decompensated: Admit for management
• Variceal bleed, SBP, HRS: ICU
• New decompensation: Admit for workup + stabilization`,

};
