import { createCard, Flashcard } from './spacedRepetition';

export function getDefaultCards(): Flashcard[] {
  const cards: Flashcard[] = [];

  // ========== CARDIOLOGY (12 cards) ==========
  const cardioCards = [
    { f: 'What is the first-line treatment of acute STEMI?', b: 'PCI (Percutaneous Coronary Intervention)\nDoor-to-balloon time < 90 minutes\nIf PCI unavailable within 120 min: Fibrinolytics', d: 'hard' as const, t: '🫀 STEMI' },
    { f: 'ECG findings in STEMI?', b: 'ST elevation >1mm in 2 contiguous leads\nNew LBBB\nReciprocal ST depression\nTombstone pattern in severe cases', d: 'medium' as const, t: '🫀 ECG' },
    { f: 'Initial STEMI management (2024)?', b: 'Aspirin 325mg chewed\nP2Y12 inhibitor (Ticagrelor/Prasugrel)\nAnticoagulation (Heparin/Enoxaparin)\nO2 only if SpO2 <90%\nMorphine for severe pain (use cautiously)', d: 'hard' as const, t: '🫀 STEMI' },
    { f: 'Most common cause of AF?', b: 'Hypertension\nAlso: valvular disease, CAD, hyperthyroidism, alcohol, obesity, sleep apnea', d: 'easy' as const, t: '🫀 AFib' },
    { f: 'CHA₂DS₂-VASc score components?', b: 'CHF (1)\nHTN (1)\nAge >75 (2)\nDM (1)\nStroke/TIA (2)\nVascular disease (1)\nAge 65-74 (1)\nSex female (1)\n\nScore ≥2: Anticoagulate', d: 'medium' as const, t: '🫀 AFib' },
    { f: 'First-line rate control in AF?', b: 'Beta-blockers (metoprolol)\nor Non-dihydropyridine CCBs (diltiazem, verapamil)\nTarget HR <110 bpm (lenient)', d: 'easy' as const, t: '🫀 AFib' },
    { f: 'BNP levels in heart failure?', b: 'Normal: <100 pg/mL\nElevated: >400 pg/mL suggests HF\nVery high: >1000 pg/mL severe HF\nObese patients may have falsely low BNP', d: 'medium' as const, t: '🫀 Heart Failure' },
    { f: 'Contraindication for verapamil in HF?', b: 'HFrEF (EF <40%)\nVerapamil has negative inotropic effect\nOnly amlodipine and felodipine are safe in HFrEF', d: 'medium' as const, t: '🫀 Heart Failure' },
    { f: 'Most common organism in infective endocarditis?', b: 'Staphylococcus aureus (overall, especially IVDU)\nStreptococcus viridans (native valves)\nEnterococcus (elderly, prosthetic valves)', d: 'medium' as const, t: '🫀 Endocarditis' },
    { f: 'Treatment of hypertensive emergency?', b: 'IV labetalol or nicardipine\nLower BP by max 25% in first hour\nTarget 160/100-110 in first 2-6h\nAvoid rapid drops (stroke risk)', d: 'hard' as const, t: '🫀 Hypertension' },
    { f: 'Acute pericarditis: ECG + treatment?', b: 'ECG: Diffuse ST elevation (concave up), PR depression, no reciprocal changes\nTreatment: NSAIDs + Colchicine (3-6 months)\nAvoid steroids if possible (increased recurrence)\nComplication: Cardiac tamponade', d: 'hard' as const, t: '🫀 Pericarditis' },
    { f: 'Cardiac tamponade: Beck triad?', b: 'Beck Triad:\n1. Hypotension\n2. Muffled heart sounds\n3. Distended neck veins (JVD)\n\n+ Pulsus paradoxus (>10mmHg drop in SBP during inspiration)\nECG: Low voltage + Electrical alternans\nTreatment: Pericardiocentesis', d: 'hard' as const, t: '🫀 Tamponade' },
  ];
  cardioCards.forEach(c => cards.push(createCard('cardiology', c.f, c.b, 'basic', ['cardiology'], undefined, undefined, undefined, c.d, c.t)));

  // ========== PULMONOLOGY (12 cards) ==========
  const pulmoCards = [
    { f: 'CURB-65 criteria for pneumonia?', b: 'Confusion\nUrea >7 mmol/L (BUN >20)\nRR >30/min\nBP <90/60\nAge >65\n\nScore 0-1: Outpatient\nScore 2: Hospital\nScore 3+: ICU', d: 'medium' as const, t: '🫁 Pneumonia' },
    { f: 'First-line antibiotics for CAP?', b: 'Ceftriaxone + Azithromycin\nOR Levofloxacin monotherapy\nStart within 4 hours\nAdd Vancomycin if MRSA risk', d: 'medium' as const, t: '🫁 Pneumonia' },
    { f: 'GOLD criteria for COPD staging?', b: 'Stage 1: FEV1 >80% (Mild)\nStage 2: FEV1 50-79% (Moderate)\nStage 3: FEV1 30-49% (Severe)\nStage 4: FEV1 <30% (Very Severe)\nAlso assess symptoms (CAT/mMRC) + exacerbations', d: 'medium' as const, t: '🫁 COPD' },
    { f: 'Asthma step therapy - Step 1 (GINA 2024)?', b: 'Low-dose ICS-formoterol as needed\nNO MORE SABA ALONE\nAlternative: Low-dose ICS whenever SABA taken', d: 'hard' as const, t: '🫁 Asthma' },
    { f: 'Light criteria for pleural effusion?', b: 'Exudate if ANY of:\n• Protein pleural/serum >0.5\n• LDH pleural/serum >0.6\n• LDH >2/3 upper limit normal\n\nIf none met → Transudate', d: 'hard' as const, t: '🫁 Pleural Effusion' },
    { f: 'Most common cause of hemoptysis?', b: 'Acute bronchitis (most common)\nAlso: TB, bronchiectasis, lung cancer, PE, fungal infections', d: 'easy' as const, t: '🫁 Hemoptysis' },
    { f: 'Treatment of pneumothorax?', b: 'Small <2cm + asymptomatic: Observation + O2\nLarge/Symptomatic: Chest tube (5th ICS)\nTension: Needle decompression (2nd ICS, midclavicular)', d: 'hard' as const, t: '🫁 Pneumothorax' },
    { f: 'Wells criteria for PE?', b: 'Score >4: PE likely → CTPA\nScore ≤4: D-dimer → if positive → CTPA\nPERC rule: if 0/8, no testing needed', d: 'medium' as const, t: '🫁 PE' },
    { f: 'PFT: Obstructive vs Restrictive?', b: 'Obstructive: ↓ FEV1/FVC ratio (<0.7), ↑ TLC, ↑ RV\n(COPD, Asthma, Bronchiectasis)\n\nRestrictive: Normal FEV1/FVC, ↓ TLC\n(ILD, Obesity, Neuromuscular)\n\nMixed: Both patterns present', d: 'medium' as const, t: '🫁 PFT' },
    { f: 'ILD: UIP vs NSIP pattern?', b: 'UIP (Usual Interstitial Pneumonia):\nSubpleural, basal honeycombing\nTemporal heterogeneity\nPoor prognosis (IPF)\n\nNSIP:\nGround-glass opacities\nSubpleural sparing\nBetter steroid response', d: 'hard' as const, t: '🫁 ILD' },
    { f: 'Lung cancer: Paraneoplastic syndromes?', b: 'SIADH: Small cell\nCushing syndrome: Small cell (ectopic ACTH)\nHypercalcemia: Squamous cell (PTHrP)\nLambert-Eaton: Small cell\nHypertrophic osteoarthropathy: Adenocarcinoma\nTrousseau syndrome: Adenocarcinoma', d: 'hard' as const, t: '🫁 Lung Cancer' },
    { f: 'Sleep apnea: STOP-BANG criteria?', b: 'Snoring (loud)\nTired (daytime fatigue)\nObserved (apnea witnessed)\nPressure (HTN)\nBMI >35\nAge >50\nNeck >40cm\nGender (male)\n\n≥3: High risk → Polysomnography', d: 'medium' as const, t: '🫁 Sleep Apnea' },
  ];
  pulmoCards.forEach(c => cards.push(createCard('pulmonology', c.f, c.b, 'basic', ['pulmonology'], undefined, undefined, undefined, c.d, c.t)));

  // ========== NEUROLOGY (12 cards) ==========
  const neuroCards = [
    { f: 'tPA window for ischemic stroke?', b: 'IV tPA: within 4.5 hours of onset\nExtended window (4.5-9h): CT perfusion/MRI\nBP must be <185/110\nExclude hemorrhage on CT', d: 'hard' as const, t: '🧠 Stroke' },
    { f: 'First-line acute migraine treatment?', b: 'Triptans (Sumatriptan 50-100mg PO)\nBest if taken within 1 hour\nContraindicated: CAD, stroke, uncontrolled HTN', d: 'medium' as const, t: '🧠 Migraine' },
    { f: 'NIHSS score significance?', b: '0: No stroke\n1-4: Minor stroke\n5-15: Moderate stroke\n16-20: Moderate-severe\n21-42: Severe stroke\n>25: Consider thrombectomy', d: 'medium' as const, t: '🧠 Stroke' },
    { f: 'CSF findings in bacterial meningitis?', b: '↑ WBC (neutrophils, >1000)\n↓ Glucose (<40 mg/dL)\n↑ Protein (>100 mg/dL)\nGram stain: organisms\nOpening pressure elevated', d: 'hard' as const, t: '🧠 Meningitis' },
    { f: 'Treatment of status epilepticus?', b: '1st: IV Lorazepam 4mg (or Midazolam IM)\n2nd: IV Fosphenytoin 20mg/kg or Valproate\n3rd: IV Phenobarbital or Propofol infusion\nContinuous EEG monitoring', d: 'hard' as const, t: '🧠 Seizure' },
    { f: 'Most common primary brain tumor?', b: 'Glioblastoma multiforme (GBM)\nHighly aggressive, poor prognosis\nPresents: headache, seizures, focal deficits\nMedian survival: 12-15 months', d: 'medium' as const, t: '🧠 Brain Tumor' },
    { f: 'Features of Guillain-Barré syndrome?', b: 'Ascending symmetric weakness\nAreflexia\nAlbuminocytologic dissociation\nOften preceded by Campylobacter\nMonitor FVC (respiratory failure risk)', d: 'medium' as const, t: '🧠 GBS' },
    { f: 'Treatment of myasthenia gravis crisis?', b: 'IVIG or Plasmapheresis\nAvoid aminoglycosides, fluoroquinolones\nMonitor FVC q2h\nIntubate if FVC <15 mL/kg', d: 'hard' as const, t: '🧠 MG Crisis' },
    { f: 'Multiple sclerosis: McDonald criteria?', b: 'Dissemination in SPACE (≥2 lesions in different CNS areas)\nDissemination in TIME (new lesions on follow-up MRI or oligoclonal bands in CSF)\nTypes: RRMS (85%), PPMS, SPMS\nTreatment: DMTs (Ocrelizumab, Natalizumab, Fingolimod)', d: 'hard' as const, t: '🧠 MS' },
    { f: 'Parkinson disease: Cardinal features?', b: 'TRAP:\nTremor (resting, pill-rolling)\nRigidity (cogwheel)\nAkinesia/Bradykinesia\nPostural instability (late)\n\nTreatment: Levodopa/Carbidopa (gold standard)\nDopamine agonists (younger patients)\nMAO-B inhibitors (early disease)', d: 'medium' as const, t: '🧠 Parkinson' },
    { f: 'SAH: Hunt-Hess grading?', b: 'Grade 1: Mild headache, alert\nGrade 2: Moderate-severe headache, alert ± CN palsy\nGrade 3: Drowsy, mild focal deficit\nGrade 4: Stupor, hemiparesis\nGrade 5: Coma, decerebrate posturing\n\nCT non-contrast → LP if CT negative\nTreatment: Nimodipine, clipping/coiling', d: 'hard' as const, t: '🧠 SAH' },
    { f: 'Wernicke encephalopathy: Triad?', b: 'Classic Triad (only 10-16%):\n1. Confusion/Encephalopathy\n2. Ataxia (gait)\n3. Ophthalmoplegia (nystagmus, CN VI palsy)\n\nCaused by thiamine (B1) deficiency\nAlcoholics, hyperemesis, malnutrition\nTreatment: IV Thiamine BEFORE glucose\nUntreated → Korsakoff psychosis', d: 'medium' as const, t: '🧠 Wernicke' },
  ];
  neuroCards.forEach(c => cards.push(createCard('neurology', c.f, c.b, 'basic', ['neurology'], undefined, undefined, undefined, c.d, c.t)));

  // ========== ENDOCRINOLOGY (12 cards) ==========
  const endoCards = [
    { f: 'Diagnostic criteria for diabetes?', b: 'Fasting glucose ≥126 mg/dL\nOR HbA1c ≥6.5%\nOR 2h OGTT ≥200 mg/dL\nOR Random glucose ≥200 + symptoms\nMust be confirmed on 2 separate tests', d: 'medium' as const, t: '🔬 Diabetes' },
    { f: 'First-line treatment for Type 2 DM?', b: 'Metformin 500mg BID (titrate up)\n+ Lifestyle modifications\nContraindicated if eGFR <30\nConsider SGLT2i or GLP-1 RA if CVD/CKD', d: 'easy' as const, t: '🔬 Diabetes' },
    { f: 'DKA diagnostic criteria?', b: 'Glucose >250 mg/dL\npH <7.3\nHCO3 <18 mEq/L\nAnion gap >12\nKetones positive\nDKA vs HHS: DKA has ketosis + acidosis', d: 'hard' as const, t: '🔬 DKA' },
    { f: 'DKA management priorities?', b: '1. IV fluids (NS 1-2L bolus)\n2. Check K+ (>3.3 before insulin!)\n3. IV insulin 0.1 units/kg/hr\n4. Add D5 when glucose <200\n5. Monitor q1h: glucose, K+, pH', d: 'hard' as const, t: '🔬 DKA' },
    { f: 'Symptoms of hyperthyroidism?', b: 'Weight loss despite ↑ appetite\nHeat intolerance, sweating\nPalpitations, tremor, anxiety\nFrequent bowel movements\nHair thinning, onycholysis', d: 'easy' as const, t: '🔬 Hyperthyroid' },
    { f: 'Treatment of Graves disease?', b: 'Methimazole (first-line, not 1st trimester)\nPropranolol (symptom control)\nRAI if refractory\nSurgery if large goiter/nodule\nPTU in 1st trimester only', d: 'medium' as const, t: '🔬 Graves' },
    { f: 'Cushing syndrome: screening tests?', b: '1. 24h urinary free cortisol (gold standard)\n2. Late-night salivary cortisol\n3. 1mg overnight dexamethasone suppression test\nConfirm with 2 different tests', d: 'hard' as const, t: '🔬 Cushing' },
    { f: 'Addison disease: key features?', b: 'Primary adrenal insufficiency\nSymptoms: fatigue, weight loss, hyperpigmentation, hypotension, salt craving\nLabs: ↓cortisol, ↑ACTH, hyponatremia, hyperkalemia\nAdrenal crisis: hypotension, shock → IV hydrocortisone', d: 'medium' as const, t: '🔬 Addison' },
    { f: 'Pheochromocytoma: classic triad?', b: 'Episodic headache, palpitations, diaphoresis\n+ Hypertension (paroxysmal)\nDiagnosis: plasma metanephrines or 24h urine metanephrines\nImaging: CT/MRI adrenals\nPre-op: alpha-blockade BEFORE beta-blockade', d: 'hard' as const, t: '🔬 Pheochromocytoma' },
    { f: 'SIADH vs Cerebral Salt Wasting?', b: 'SIADH: euvolemic, ↓Na, ↓Uric acid, concentrated urine\nCSW: hypovolemic, ↓Na, polyuria\nKey: volume status differentiates\nSIADH → fluid restrict\nCSW → fluids + salt', d: 'hard' as const, t: '🔬 Hyponatremia' },
    { f: 'Thyroid storm: Burch-Wartofsky score?', b: 'Score ≥45: Highly suggestive\nComponents: Temp, CNS, GI, CVS, precipitant\nTreatment:\n1. PTU (blocks synthesis + T4→T3 conversion)\n2. Propranolol (symptoms)\n3. Hydrocortisone (blocks conversion)\n4. Lugol iodine (after PTU, blocks release)\nMortality: 10-30%', d: 'hard' as const, t: '🔬 Thyroid Storm' },
    { f: 'MEN syndromes: Types 1, 2A, 2B?', b: 'MEN1 (3 Ps):\nParathyroid hyperplasia\nPituitary adenoma\nPancreatic NET (gastrinoma, insulinoma)\n\nMEN2A:\nMedullary thyroid CA\nPheochromocytoma\nParathyroid hyperplasia\n\nMEN2B:\nMedullary thyroid CA\nPheochromocytoma\nMarfanoid habitus + Mucosal neuromas', d: 'hard' as const, t: '🔬 MEN' },
  ];
  endoCards.forEach(c => cards.push(createCard('endocrinology', c.f, c.b, 'basic', ['endocrinology'], undefined, undefined, undefined, c.d, c.t)));

  // ========== GASTROENTEROLOGY (12 cards) ==========
  const gastroCards = [
    { f: 'Upper GI bleed: most common causes?', b: '1. Peptic ulcer disease (50%)\n2. Esophageal varices (10-30%)\n3. Mallory-Weiss tear\n4. Erosive esophagitis/gastritis\n5. AV malformations', d: 'medium' as const, t: '🍽️ GI Bleed' },
    { f: 'Rockall score components?', b: 'Age, shock, comorbidity, diagnosis, endoscopic stigmata\nPre-endoscopy: age, shock, comorbidity\nPost-endoscopy: + diagnosis + stigmata\nLow risk <3: early discharge', d: 'hard' as const, t: '🍽️ GI Bleed' },
    { f: 'H. pylori eradication: first-line?', b: 'Quadruple therapy (14 days):\nPPI BID + Bismuth + Tetracycline + Metronidazole\nor\nClarithromycin triple therapy (if resistance <15%)\nTest eradication 4 weeks after', d: 'medium' as const, t: '🍽️ H. Pylori' },
    { f: 'Rome IV criteria for IBS?', b: 'Recurrent abdominal pain ≥1 day/week in last 3 months\n+ 2 or more:\n1. Related to defecation\n2. Change in stool frequency\n3. Change in stool form\nOnset >6 months ago', d: 'medium' as const, t: '🍽️ IBS' },
    { f: 'Child-Pugh score components?', b: 'Bilirubin, Albumin, INR, Ascites, Encephalopathy\nClass A: 5-6 (compensated)\nClass B: 7-9 (moderate)\nClass C: 10-15 (decompensated)\nPredicts surgical mortality', d: 'hard' as const, t: '🍽️ Cirrhosis' },
    { f: 'Acute pancreatitis: Ranson criteria?', b: 'At admission: Age >55, WBC >16K, Glucose >200, LDH >350, AST >250\nAt 48h: Hct drop >10%, BUN rise >5, Ca <8, PaO2 <60, Base deficit >4\nScore ≥3: Severe pancreatitis', d: 'hard' as const, t: '🍽️ Pancreatitis' },
    { f: 'Treatment of acute severe UC?', b: 'IV steroids (Methylprednisolone 60mg/d)\nIf no response in 3-5 days:\nIV Cyclosporine or Infliximab\nSurgical consult early\nMonitor for toxic megacolon', d: 'hard' as const, t: '🍽️ UC' },
    { f: 'Hepatorenal syndrome: criteria?', b: 'Cirrhosis + Ascites\n↑ Cr (>1.5) not improving after:\n• Stop diuretics\n• Albumin 1g/kg/d x2 days\nNo shock, no nephrotoxins\nType 1: rapid (<2 weeks)\nType 2: slower progression', d: 'hard' as const, t: '🍽️ HRS' },
    { f: 'Wilson disease: Diagnostic criteria?', b: '↓ Ceruloplasmin\n↑ 24h urinary copper\nKayser-Fleischer rings (slit lamp)\nLiver biopsy: ↑ copper\nGenetic testing: ATP7B mutation\nTreatment: D-penicillamine or Trientine\nZinc for maintenance\nAvoid high-copper foods', d: 'hard' as const, t: '🍽️ Wilson' },
    { f: 'Hemochromatosis: Key features?', b: 'HFE gene mutation (C282Y)\nIron overload: Liver, pancreas, heart, skin, joints\nTriad: Cirrhosis, DM, Bronze skin\nLabs: ↑ Ferritin, ↑ Transferrin saturation >45%\nTreatment: Phlebotomy (weekly until ferritin <50)\nAvoid vitamin C, alcohol', d: 'medium' as const, t: '🍽️ Hemochromatosis' },
    { f: 'Celiac disease: Diagnosis?', b: 'Serology:\nAnti-tTG IgA (screening)\nAnti-endomysial IgA (confirmatory)\nTotal IgA (rule out IgA deficiency)\n\nGold standard: Duodenal biopsy\nVillous atrophy, crypt hyperplasia, ↑IELs\nTreatment: Strict gluten-free diet for life', d: 'medium' as const, t: '🍽️ Celiac' },
    { f: 'Primary biliary cholangitis: Features?', b: 'Autoimmune destruction of intrahepatic bile ducts\n♀ > ♀ (90% female)\nFatigue + Pruritus\nLabs: ↑ ALP, ↑ GGT, AMA positive (95%)\nTreatment: Ursodeoxycholic acid\nComplications: Cirrhosis, Osteoporosis', d: 'medium' as const, t: '🍽️ PBC' },
  ];
  gastroCards.forEach(c => cards.push(createCard('gastroenterology', c.f, c.b, 'basic', ['gastroenterology'], undefined, undefined, undefined, c.d, c.t)));

  // ========== NEPHROLOGY (12 cards) ==========
  const nephroCards = [
    { f: 'KDIGO criteria for AKI?', b: 'Stage 1: Cr ×1.5-1.9 or UO <0.5 mL/kg/h x6h\nStage 2: Cr ×2-2.9 or UO <0.5 x12h\nStage 3: Cr ×3 or Cr >4 or UO <0.3 x24h or anuria x12h or RRT\nPre-renal vs Intra-renal vs Post-renal', d: 'hard' as const, t: '🩻 AKI' },
    { f: 'Most common cause of CKD?', b: 'Diabetes mellitus (44%)\nHypertension (28%)\nGlomerulonephritis\nPolycystic kidney disease\nScreen with eGFR + UACR annually in diabetics', d: 'easy' as const, t: '🩻 CKD' },
    { f: 'Indications for dialysis in AKI?', b: 'AEIOU:\nAcidosis (severe metabolic)\nElectrolytes (hyperkalemia >6.5)\nIntoxication (toxic alcohols, lithium)\nOverload (fluid refractory to diuretics)\nUremia (pericarditis, encephalopathy)', d: 'hard' as const, t: '🩻 Dialysis' },
    { f: 'Nephrotic syndrome: diagnostic criteria?', b: 'Proteinuria >3.5g/day\nHypoalbuminemia <3.0 g/dL\nEdema\nHyperlipidemia\nMost common causes: MCD (children), FSGS, MN (adults), Diabetic nephropathy', d: 'medium' as const, t: '🩻 Nephrotic' },
    { f: 'Nephritic syndrome: key features?', b: 'Hematuria (cola-colored urine)\nHypertension\nOliguria\nMild-moderate proteinuria (<3.5g)\nRBC casts in urine\nPost-streptococcal GN, IgA nephropathy, Lupus nephritis', d: 'medium' as const, t: '🩻 Nephritic' },
    { f: 'Treatment of hyperkalemia (K+ >6.0)?', b: '1. IV Calcium gluconate (cardioprotective)\n2. IV Insulin + D50 (shift K+ in)\n3. Sodium bicarbonate (if acidotic)\n4. Albuterol nebulized\n5. Furosemide (eliminate)\n6. Dialysis if refractory\nKayexalate: slow, not for acute', d: 'hard' as const, t: '🩻 Hyperkalemia' },
    { f: 'SIADH diagnostic criteria?', b: 'Hyponatremia (Na <135)\nLow serum osmolality (<275)\nInappropriately concentrated urine (>100)\nEuvolemia\nNormal renal, adrenal, thyroid function\nNo diuretic use', d: 'medium' as const, t: '🩻 Hyponatremia' },
    { f: 'Rhabdomyolysis: key management?', b: 'Aggressive IV fluids (NS 200-400mL/h)\nTarget UO 200-300mL/h\nMonitor CK, K+, Cr, Ca++\nAvoid Ringer Lactate (contains K+)\nDialysis if severe AKI or refractory hyperkalemia\nCheck for compartment syndrome', d: 'hard' as const, t: '🩻 Rhabdomyolysis' },
    { f: 'Renal tubular acidosis: Types 1-4?', b: 'Type 1 (Distal): ↓K+, urine pH >5.5, stones\nType 2 (Proximal): ↓K+, urine pH <5.5, Fanconi\nType 3: Rare, combined\nType 4 (Hypoaldosteronism): ↑K+, urine pH <5.5\nMost common: Type 4 (diabetics)\nTreatment: Correct acidosis, replace K+', d: 'hard' as const, t: '🩻 RTA' },
    { f: 'ADPKD vs ARPKD?', b: 'ADPKD: Autosomal dominant, adult onset\nMutation: PKD1 (85%) or PKD2 (15%)\nKidneys: Large cysts, hypertension, CKD\nExtra-renal: Berry aneurysm, liver cysts, MVP\n\nARPKD: Autosomal recessive, infant/child\nMutation: PKHD1\nCongenital hepatic fibrosis + kidney cysts', d: 'medium' as const, t: '🩻 PKD' },
    { f: 'RPGN: Types and treatment?', b: 'Type 1: Anti-GBM (Goodpasture)\nLinear IgG on IF\nPlasmapheresis + Steroids + Cyclophosphamide\n\nType 2: Immune complex (Lupus, IgA, post-infectious)\nGranular on IF\nTreat underlying cause\n\nType 3: Pauci-immune (ANCA: GPA, MPA)\nNo immune deposits\nSteroids + Cyclophosphamide/Rituximab', d: 'hard' as const, t: '🩻 RPGN' },
    { f: 'Kidney transplant rejection types?', b: 'Hyperacute (min-hours): Preformed antibodies\nImmediate nephrectomy\n\nAcute (days-weeks): T-cell mediated\n↑ Cr, biopsy: tubulitis\nTreatment: Steroids, Thymoglobulin\n\nChronic (months-years): Fibrosis\nSlowly progressive\nNo effective treatment', d: 'medium' as const, t: '🩻 Transplant' },
  ];
  nephroCards.forEach(c => cards.push(createCard('nephrology', c.f, c.b, 'basic', ['nephrology'], undefined, undefined, undefined, c.d, c.t)));

  // ========== HEMATOLOGY (12 cards) ==========
  const hemaCards = [
    { f: 'Microcytic anemia: differential?', b: 'TAILS:\nThalassemia\nAnemia of chronic disease\nIron deficiency\nLead poisoning\nSideroblastic anemia\n\nCheck: Ferritin, TIBC, Iron, Hb electrophoresis', d: 'medium' as const, t: '🩸 Anemia' },
    { f: 'Iron deficiency anemia: lab findings?', b: '↓ Ferritin (<15 ng/mL)\n↓ Serum iron\n↑ TIBC\n↓ Transferrin saturation (<15%)\nMicrocytic, hypochromic RBCs\n↑ RDW\nTreat with oral ferrous sulfate', d: 'easy' as const, t: '🩸 Iron Deficiency' },
    { f: 'HIT (Heparin-Induced Thrombocytopenia)?', b: 'Platelets drop >50% from baseline\nOccurs 5-10 days after heparin exposure\nParadoxical thrombosis (not bleeding!)\nDiagnosis: 4T score + PF4 antibody\nTreatment: STOP heparin, start argatroban or bivalirudin\nNEVER give warfarin alone (protein C depletion)', d: 'hard' as const, t: '🩸 HIT' },
    { f: 'DIC: lab findings?', b: '↓ Platelets\n↑ PT/PTT\n↓ Fibrinogen\n↑ D-dimer (very high)\nSchistocytes on blood smear\nTreat underlying cause\nGive platelets + FFP if bleeding\nHeparin if thrombosis predominant', d: 'hard' as const, t: '🩸 DIC' },
    { f: 'Transfusion reactions: types?', b: 'Acute hemolytic: ABO incompatibility (fever, hypotension, hemoglobinuria)\nFebrile non-hemolytic: cytokines (fever, chills)\nAllergic: urticaria, pruritus\nAnaphylactic: IgA deficiency (severe hypotension)\nTRALI: respiratory distress within 6h\nTACO: volume overload', d: 'medium' as const, t: '🩸 Transfusion' },
    { f: 'Sickle cell crisis: management?', b: '1. Pain control (opioids)\n2. IV fluids (hypotonic)\n3. Oxygen (if hypoxic)\n4. Treat triggers (infection, dehydration)\n5. Exchange transfusion if severe (stroke, ACS)\nHydroxyurea for prevention', d: 'hard' as const, t: '🩸 Sickle Cell' },
    { f: 'CML: diagnosis and treatment?', b: 'Philadelphia chromosome t(9;22) → BCR-ABL fusion\nPresents: leukocytosis, splenomegaly\nTreatment: Tyrosine Kinase Inhibitors\nImatinib 400mg daily (first-line)\nMonitor BCR-ABL by PCR q3mo\nAllogeneic transplant if refractory', d: 'medium' as const, t: '🩸 CML' },
    { f: 'Multiple Myeloma: CRAB criteria?', b: 'Calcium elevated (>11 mg/dL)\nRenal insufficiency (↑Cr)\nAnemia (Hb <10)\nBone lesions (lytic on X-ray)\n\nDiagnosis: SPEP (M spike), UPEP, bone marrow biopsy\nTreatment: Bortezomib + Lenalidomide + Dexamethasone', d: 'medium' as const, t: '🩸 Myeloma' },
    { f: 'Hemophilia A vs B?', b: 'Hemophilia A: Factor VIII deficiency\nX-linked recessive\n↑ PTT, normal PT, normal platelets\nTreatment: Factor VIII concentrate, Desmopressin (mild)\n\nHemophilia B: Factor IX deficiency\nSame labs, treatment: Factor IX concentrate\nChristmas disease', d: 'medium' as const, t: '🩸 Hemophilia' },
    { f: 'ITP vs TTP: Differentiation?', b: 'ITP: Isolated ↓platelets, normal PT/PTT, no schistocytes\nTreatment: Steroids, IVIG, Splenectomy, TPO agonists\n\nTTP: ↓Platelets + MAHA + Fever + Neuro + Renal\nSchistocytes present\nADAMTS13 deficiency\nTreatment: PLASMAPHERESIS (emergency!), steroids\nDo NOT give platelets!', d: 'hard' as const, t: '🩸 ITP vs TTP' },
    { f: 'MDS: IPSS-R scoring?', b: 'Cytopenias: Hb <10, ANC <1.8, Plt <100\nBone marrow blasts: <5%, 5-10%, 11-19%\nCytogenetics: Very good to Very poor\n\nRisk: Very low to Very high\nTreatment: Supportive (transfusions, EPO, G-CSF)\nLenalidomide (5q-)\nAzacitidine/Decitabine\nAllo transplant if high risk', d: 'hard' as const, t: '🩸 MDS' },
    { f: 'Polycythemia vera: JAK2 mutation?', b: 'JAK2 V617F mutation (>95%)\n↑ RBC mass → hyperviscosity\nSymptoms: Headache, pruritus (aquagenic), thrombosis, erythromelalgia\nLabs: ↑Hb, ↑Hct, normal O2 sat, low EPO\nTreatment: Phlebotomy (target Hct <45%)\nAspirin (if tolerated)\nHydroxyurea if high risk', d: 'medium' as const, t: '🩸 PV' },
  ];
  hemaCards.forEach(c => cards.push(createCard('hematology', c.f, c.b, 'basic', ['hematology'], undefined, undefined, undefined, c.d, c.t)));

  // ========== INFECTIOUS DISEASE (12 cards) ==========
  const idCards = [
    { f: 'Sepsis definition (Sepsis-3)?', b: 'Life-threatening organ dysfunction caused by dysregulated host response to infection\nSOFA score increase ≥2 points\nqSOFA: RR≥22, SBP≤100, GCS<15', d: 'hard' as const, t: '🦠 Sepsis' },
    { f: 'Surviving Sepsis 1-hour bundle?', b: '1. Measure lactate\n2. Blood cultures before antibiotics\n3. Broad-spectrum antibiotics\n4. IV crystalloid 30mL/kg\n5. Vasopressors if refractory hypotension\nTime = Tissue', d: 'hard' as const, t: '🦠 Sepsis' },
    { f: 'Empiric meningitis treatment?', b: 'Ceftriaxone 2g IV q12h\n+ Vancomycin 15-20mg/kg IV q8-12h\n+ Dexamethasone 10mg IV q6h x4 days\nDexamethasone before or with 1st antibiotic', d: 'hard' as const, t: '🦠 Meningitis' },
    { f: 'TB treatment (RIPE regimen)?', b: 'Rifampin: 6 months\nIsoniazid: 6 months (+ B6)\nPyrazinamide: 2 months\nEthambutol: 2 months\nTotal: 6 months (2 RIPE + 4 RI)\nCheck LFTs monthly', d: 'medium' as const, t: '🦠 TB' },
    { f: 'Most common nosocomial infection?', b: '1. UTI (catheter-associated) 35-40%\n2. Surgical site infection\n3. Pneumonia (VAP)\n4. Bloodstream infection (CLABSI)\nPrevention: remove lines ASAP', d: 'easy' as const, t: '🦠 Nosocomial' },
    { f: 'C. diff treatment guidelines?', b: 'First episode: Oral Vancomycin 125mg QID x10d\nor Fidaxomicin 200mg BID x10d\nSevere: Vancomycin 500mg PO/NG QID + IV Metronidazole\nRecurrent: Fidaxomicin or FMT', d: 'medium' as const, t: '🦠 C. Diff' },
    { f: 'HIV CD4 count classifications?', b: 'Stage 1: CD4 ≥500 cells/μL\nStage 2: CD4 200-499\nStage 3 (AIDS): CD4 <200\nor AIDS-defining condition\nStart ART regardless of CD4', d: 'medium' as const, t: '🦠 HIV' },
    { f: 'Most common cause of UTI?', b: 'E. coli (75-95%)\nAlso: Klebsiella, Proteus, Enterococcus\nCatheter-associated: Pseudomonas, Candida\nESBL risk if recent hospitalization/antibiotics', d: 'easy' as const, t: '🦠 UTI' },
    { f: 'Malaria: Species + Treatment?', b: 'P. falciparum: Most severe, chloroquine resistance common\nP. vivax/ovale: Hypnozoites in liver (needs primaquine)\nP. malariae: Quartan fever\nP. knowlesi: Zoonotic\n\nSevere falciparum: IV Artesunate\nUncomplicated: Artemisinin-based combination therapy (ACT)\nP. vivax/ovale: Chloroquine + Primaquine', d: 'hard' as const, t: '🦠 Malaria' },
    { f: 'Antifungals: Spectrum of activity?', b: 'Azoles (Fluconazole): Candida (not glabrata/krusei), Crypto\nVoriconazole: Aspergillus (first-line)\nPosaconazole: Mucormycosis salvage\n\nEchinocandins (Caspofungin): Candida (all species), Aspergillus\n\nAmphotericin B: Broadest spectrum\nNephrotoxic!\n\nTerbinafine: Dermatophytes', d: 'hard' as const, t: '🦠 Antifungals' },
    { f: 'HIV: Antiretroviral classes?', b: 'NRTIs: Tenofovir, Emtricitabine, Abacavir\nNNRTIs: Efavirenz, Rilpivirine\nPIs: Darunavir (with Ritonavir booster)\nINSTIs: Dolutegravir, Bictegravir (first-line)\nEntry inhibitors: Maraviroc\n\nTypical regimen: 2 NRTIs + 1 INSTI\nTDF/FTC + DTG = common', d: 'medium' as const, t: '🦠 HIV Treatment' },
    { f: 'COVID-19: Current management (2024)?', b: 'Mild outpatient: Paxlovid (nirmatrelvir/ritonavir) if high risk\nRemdesivir if can\'t take Paxlovid\n\nModerate inpatient: Remdesivir + Dexamethasone (if O2 needed)\nBaricitinib (JAK inhibitor) or Tocilizumab (IL-6) if severe\n\nAnticoagulation: Prophylactic unless contraindicated\nNo antibiotics unless bacterial superinfection', d: 'medium' as const, t: '🦠 COVID-19' },
  ];
  idCards.forEach(c => cards.push(createCard('infectious', c.f, c.b, 'basic', ['infectious'], undefined, undefined, undefined, c.d, c.t)));

  // ========== PHARMACOLOGY (12 cards) ==========
  const pharmaCards = [
    { f: 'Metformin mechanism?', b: '↓ Hepatic gluconeogenesis (main)\n↑ Peripheral insulin sensitivity\n↓ Intestinal glucose absorption\nActivates AMPK\nDoes NOT cause hypoglycemia or weight gain', d: 'medium' as const, t: '💊 Metformin' },
    { f: 'Furosemide mechanism?', b: 'Loop diuretic\nInhibits Na-K-2Cl cotransporter in thick ascending limb\n↑ Na, K, Ca, Mg excretion\nOnset: 30-60 min IV, 1-2h PO', d: 'medium' as const, t: '💊 Diuretics' },
    { f: 'ACE inhibitors side effects?', b: 'Cough (bradykinin, 5-20%)\nAngioedema (0.1-0.5%)\nHyperkalemia\nAKI (bilateral renal artery stenosis)\nTeratogenic (avoid in pregnancy)', d: 'medium' as const, t: '💊 ACEi' },
    { f: 'Warfarin mechanism?', b: 'Vitamin K antagonist\nInhibits synthesis of factors II, VII, IX, X\n+ Proteins C and S\nMonitored by PT/INR (target 2-3 most indications)\nBridge with heparin initially', d: 'medium' as const, t: '💊 Warfarin' },
    { f: 'Amiodarone side effects?', b: 'Pulmonary fibrosis (1-2%)\nThyroid: hypo- or hyperthyroidism\nLiver toxicity, hepatitis\nCorneal deposits (reversible)\nBlue-gray skin\nPeripheral neuropathy', d: 'hard' as const, t: '💊 Amiodarone' },
    { f: 'Propofol key features?', b: 'Rapid onset (30-40 sec)\nShort duration (3-10 min)\n↓ BP, ↓ ICP, ↓ cerebral O2 demand\nNo analgesia\nPRIS (rare, lethal): acidosis, rhabdomyolysis, HF', d: 'medium' as const, t: '💊 Propofol' },
    { f: 'Vancomycin monitoring?', b: 'Trough level: 15-20 mcg/mL (severe infections)\nCheck before 4th dose\nAUC/MIC monitoring preferred in some protocols\nNephrotoxicity + ototoxicity\nRed Man Syndrome: slow infusion', d: 'hard' as const, t: '💊 Vancomycin' },
    { f: 'Heparin vs Enoxaparin?', b: 'Heparin: IV, t½ 1-2h, monitor aPTT, reversible (protamine)\nEnoxaparin: SC, t½ 4-7h, no monitoring, less reversible\nLMWH preferred for most (less HIT, predictable)', d: 'medium' as const, t: '💊 Anticoagulation' },
    { f: 'Insulin types and onset?', b: 'Rapid (Lispro/Aspart): 15-30 min\nShort (Regular): 30-60 min\nIntermediate (NPH): 2-4 hours\nLong (Glargine/Detemir): 1-2 hours, peakless\nUltra-long (Degludec): >40h', d: 'easy' as const, t: '💊 Insulin' },
    { f: 'Naloxone use?', b: 'Opioid antagonist\nReverses respiratory depression\n0.4-2mg IV q2-3min (up to 10mg)\nShort half-life (30-90 min)\nMay need repeat doses or infusion\nWatch for acute withdrawal', d: 'medium' as const, t: '💊 Naloxone' },
    { f: 'Digoxin toxicity: Features + Treatment?', b: 'Symptoms: Nausea, vomiting, visual disturbances (yellow halos), arrhythmias (atrial tachycardia with block, bidirectional VT)\nECG: Scooped ST depression ("Salvador Dali sign")\nLabs: ↑Digoxin level (>2.0 ng/mL)\nTreatment: Digibind (Digoxin-specific Fab fragments)\nCorrect K+, Mg++\nAvoid calcium (stone heart)', d: 'hard' as const, t: '💊 Digoxin' },
    { f: 'Serotonin syndrome vs NMS vs MH?', b: 'Serotonin Syndrome:\nHyperthermia, clonus, hyperreflexia, mydriasis\nCaused by SSRIs, MAOIs, linezolid\nTreatment: Cyproheptadine, benzodiazepines\n\nNMS:\nLead-pipe rigidity, bradyreflexia, fever\nCaused by antipsychotics (Haldol)\nTreatment: Dantrolene, Bromocriptine\n\nMH:\nRigidity, ↑ETCO2, hyperthermia\nCaused by Succinylcholine, Halothane\nTreatment: DANTROLENE (emergency!)', d: 'hard' as const, t: '💊 Toxidromes' },
  ];
  pharmaCards.forEach(c => cards.push(createCard('pharmacology', c.f, c.b, 'basic', ['pharmacology'], undefined, undefined, undefined, c.d, c.t)));

  // ========== CLINICAL PEARLS (12 cards) ==========
  const quickCards = [
    { f: 'Most common cause of CKD?', b: 'Diabetes mellitus (44%)\nHypertension (28%)\nGlomerulonephritis\nPolycystic kidney disease\nScreen with eGFR + UACR annually in diabetics', d: 'easy' as const, t: '⚡ CKD' },
    { f: 'SIRS criteria?', b: '≥2 of:\n• Temp >38°C or <36°C\n• HR >90/min\n• RR >20/min or PaCO2 <32\n• WBC >12K or <4K or >10% bands\nNow replaced by qSOFA for sepsis screening', d: 'medium' as const, t: '⚡ SIRS' },
    { f: 'Types of shock and treatment?', b: 'Hypovolemic: fluids\nCardiogenic: inotropes, revascularization\nDistributive (septic): fluids + vasopressors\nObstructive (PE/tamponade): specific treatment\nNorepinephrine = 1st line vasopressor', d: 'hard' as const, t: '⚡ Shock' },
    { f: 'Anion gap formula and causes?', b: 'AG = Na - (Cl + HCO3)\nNormal: 8-12 mEq/L\nMUDPILES:\nMethanol, Uremia, DKA, Propylene glycol, Isoniazid/Iron, Lactic acidosis, Ethylene glycol, Salicylates', d: 'medium' as const, t: '⚡ Anion Gap' },
    { f: 'RBC transfusion thresholds?', b: 'Hb <7 g/dL: transfuse (most patients)\nHb <8 g/dL: ACS, post-cardiac surgery\nHb <9-10 g/dL: active bleeding, instability\nRestrictive strategy preferred (TRICC trial)', d: 'medium' as const, t: '⚡ Transfusion' },
    { f: 'Normal lab values (must know)?', b: 'Na: 135-145 mEq/L\nK: 3.5-5.0 mEq/L\nCr: 0.6-1.2 mg/dL\nGlucose: 70-100 fasting\nHb: 12-16 g/dL (F), 14-18 (M)\nPlatelets: 150-450K\nINR: 0.9-1.1\nLactate: <2 mmol/L', d: 'easy' as const, t: '⚡ Lab Values' },
    { f: 'Code status / DNR orders?', b: 'Full Code: CPR + intubation + ICU\nDNR: No CPR, may intubate\nDNI: No intubation, may do CPR\nComfort Care: symptom management only\nDiscuss goals of care early', d: 'easy' as const, t: '⚡ Ethics' },
    { f: 'How to read ABG?', b: '1. pH: acidotic (<7.35) or alkalotic (>7.45)?\n2. pCO2: respiratory component\n3. HCO3: metabolic component\n4. Match pH with primary disorder\n5. Check compensation\n6. Calculate AG if metabolic acidosis', d: 'medium' as const, t: '⚡ ABG' },
    { f: 'Basic EKG interpretation?', b: 'Rate: 300/R-R large squares\nRhythm: regular? P before each QRS?\nAxis: Lead I + aVF → normal 0-90°\nIntervals: PR 0.12-0.20, QRS <0.12, QTc <440/460\nST changes, T waves, Q waves\nAlways compare with old EKG', d: 'easy' as const, t: '⚡ EKG Basics' },
    { f: 'Wells criteria for DVT?', b: 'Score ≥3: high probability → duplex US\nScore 1-2: moderate → D-dimer → if positive → duplex US\nScore 0: low → D-dimer optional\nComponents: cancer, immobilization, surgery, tenderness, swelling, collateral veins, previous DVT, alternative diagnosis', d: 'medium' as const, t: '⚡ DVT' },
    { f: 'Glasgow Coma Scale (GCS)?', b: 'Eye Opening (E):\n4-Spontaneous, 3-To voice, 2-To pain, 1-None\n\nVerbal Response (V):\n5-Oriented, 4-Confused, 3-Words, 2-Sounds, 1-None\n\nMotor Response (M):\n6-Obeys, 5-Localizes, 4-Withdraws, 3-Flexion (decorticate), 2-Extension (decerebrate), 1-None\n\nScore 3-15\n≤8: Intubate!', d: 'easy' as const, t: '⚡ GCS' },
    { f: 'IV fluids: Crystalloids vs Colloids?', b: 'Crystalloids: NS, LR, Plasmalyte\nFirst-line for resuscitation\nCheap, no allergic reactions\n\nColloids: Albumin, HES, Dextran\nAlbumin: Consider in SBP, HRS\nHES: AVOID (AKI, mortality)\n\nNS vs LR: LR preferred (less hyperchloremic acidosis)\nNS: Use in metabolic alkalosis, hypochloremia\nAvoid LR in hyperkalemia, severe acidosis', d: 'medium' as const, t: '⚡ IV Fluids' },
  ];
  quickCards.forEach(c => cards.push(createCard('quick_review', c.f, c.b, 'basic', ['quick_review'], undefined, undefined, undefined, c.d, c.t)));

  return cards;
}
