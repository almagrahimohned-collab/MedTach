// 🦋 Endocrinology Management Hints
// References: ADA Standards 2024, ATA Guidelines, Endocrine Society, Medscape, Davidson's

export const ENDOCRINOLOGY_HINTS: Record<string, string> = {
  
  // ==================== BEGINNER ====================
  'diabetes': `🩸 **TYPE 2 DIABETES MELLITUS (ADA Standards of Care 2024)**

**DIAGNOSTIC CRITERIA (Any ONE):**
• HbA1c ≥6.5% (confirmed by repeat testing)
• Fasting glucose ≥126 mg/dL (7.0 mmol/L)
• 2h OGTT ≥200 mg/dL (11.1 mmol/L)
• Random glucose ≥200 + symptoms (polyuria, polydipsia, weight loss)

**TREATMENT TARGETS:**
• HbA1c: <7% (general), <6.5% (young, no CVD), <8% (elderly, limited life expectancy)
• Pre-prandial glucose: 80-130 mg/dL
• Post-prandial glucose: <180 mg/dL
• BP: <130/80 mmHg
• LDL: <70 mg/dL (with CVD) or <100 mg/dL (without CVD)

**LIFESTYLE MODIFICATIONS (Foundation of Treatment):**
• Medical nutrition therapy: Reduced refined carbs, Mediterranean diet
• Physical activity: 150 min/week moderate aerobic + resistance 2×/week
• Weight loss: 5-10% body weight (improves insulin sensitivity significantly)
• Smoking cessation

**PHARMACOLOGIC THERAPY (Stepwise Approach):**

**STEP 1: Metformin (First-line unless contraindicated)**
• Start: 500mg PO BID, titrate to 1000mg BID
• Extended-release: 500-2000mg PO daily (less GI side effects)
• MOA: Decreases hepatic gluconeogenesis, increases insulin sensitivity
• Benefits: Weight neutral/loss, low cost, CVD benefit, no hypoglycemia
• Contraindications: eGFR <30, active lactic acidosis risk
• Side effects: GI (diarrhea, nausea) - take with food, use ER formulation

**STEP 2: Add Second Agent (if HbA1c not at target in 3 months)**

**With ASCVD, HF, or CKD:**
• **SGLT2 inhibitors** (Empagliflozin 10-25mg, Dapagliflozin 5-10mg):
  - Proven CV and renal benefit (EMPA-REG, DECLARE-TIMI, DAPA-CKD trials)
  - Weight loss 2-4kg, BP reduction
  - Side effects: UTIs, genital infections, euglycemic DKA (rare), volume depletion
  - Avoid if eGFR <20 (or <25 for Dapagliflozin initiation)

• **GLP-1 Receptor Agonists** (Semaglutide, Liraglutide, Dulaglutide):
  - CV benefit (LEADER, SUSTAIN-6, REWIND trials)
  - Significant weight loss (5-15kg with Semaglutide)
  - Side effects: Nausea/vomiting (start low, titrate slow), pancreatitis risk
  - Contraindications: Personal/family history of medullary thyroid cancer, MEN2

**Without ASCVD/HF/CKD:**
• DPP-4 inhibitors (Sitagliptin 100mg): Weight neutral, well-tolerated
• Sulfonylureas (Glimepiride 2-4mg): Effective but hypoglycemia + weight gain
• Thiazolidinediones (Pioglitazone 15-45mg): Good efficacy but fluid retention, fractures, bladder cancer risk
• Insulin: Most effective, flexible dosing

**INSULIN INITIATION (When HbA1c >10% or symptomatic hyperglycemia):**
• Start basal insulin: Glargine U-100 or Detemir 10 units or 0.1-0.2 U/kg at bedtime
• Titrate: Increase by 10-15% or 2-4 units q3 days to achieve fasting glucose 80-130
• If basal >0.5 U/kg/day: Add prandial insulin (aspart, lispro) before largest meal
• Basal-bolus regimen: ~50% basal + 50% divided pre-meal

**PREVENTION SCREENING (Annual):**
• Retinopathy: Dilated eye exam
• Nephropathy: UACR + eGFR
• Neuropathy: Monofilament test + vibration sense
• Foot exam: Comprehensive (vascular + neurologic) annually
• CVD: Lipid panel, BP, smoking assessment

**SICK DAY RULES (Educate ALL patients):**
• NEVER stop insulin (may need MORE during illness despite not eating)
• Check glucose q2-4h, ketones if glucose >240
• Stay hydrated (sugar-free fluids 4-8 oz/hour)
• Continue oral medications if tolerating PO
• Seek help if: Vomiting, ketones positive, glucose >300 despite treatment, altered mental status

**VACCINATIONS:**
• Influenza: Annually
• Pneumococcal: PPSV23 + PCV13 (per CDC schedule)
• Hepatitis B: Series (increased risk in DM)
• COVID-19: Per current guidelines

**DISPOSITION:**
• New diagnosis, stable: Outpatient with diabetes education referral
• HbA1c >10% + symptoms: Consider short admission for insulin initiation
• DKA/HHS: ICU admission (see DKA protocol)`,

  'hypothyroidism': `🦋 **HYPOTHYROIDISM (ATA Guidelines 2023 / Davidson's Ch 20)**

**COMMON CAUSES:**
• Primary: Hashimoto thyroiditis (most common in iodine-sufficient areas), post-thyroidectomy, post-RAI, iodine deficiency
• Secondary: Pituitary or hypothalamic disease (low TSH + low T4)
• Drugs: Amiodarone, Lithium, Checkpoint inhibitors, Tyrosine kinase inhibitors

**CLINICAL FEATURES:**
• General: Fatigue, weight gain, cold intolerance, constipation
• Skin/Hair: Dry skin, hair loss, brittle nails, myxedema (severe)
• CNS: Bradyphrenia, depression, memory impairment
• CVS: Bradycardia, diastolic HTN, pericardial effusion
• Metabolic: Hyperlipidemia, hyponatremia, elevated CK
• OB: Menorrhagia, infertility
• Severe: Myxedema coma (hypothermia, altered mental status, respiratory failure)

**DIAGNOSIS:**
• Primary: TSH elevated + Free T4 low
• Subclinical: TSH elevated (usually 4.5-10 mIU/L) + Free T4 normal
• Check TPO antibodies: If positive = Hashimoto (confirms autoimmune etiology)

**TREATMENT:**

**Levothyroxine (T4) - STANDARD OF CARE:**
• Start dose: 1.6 mcg/kg/day (actual body weight)
  - Average: 75-125 mcg PO daily
  - Elderly/Cardiac disease: Start 25-50 mcg (go low, go slow!)
• Timing: Take on empty stomach, 30-60 min before breakfast
• Avoid taking with: Calcium, iron, PPIs, bile acid sequestrants (separate by 4h)
• Pregnancy: Increase dose 30-50% (check TSH each trimester)
• Brand vs generic: Stick with same formulation (bioequivalence varies)

**MONITORING:**
• Check TSH 6-8 weeks after dose change (T4 half-life = 7 days)
• Once stable: TSH annually (or more if symptoms, weight change, new medications)
• Goal TSH: 0.5-2.5 mIU/L (general), <2.5 in pregnancy
• Free T4: Not needed routinely if TSH is at goal
• Over-replacement: Atrial fibrillation risk, bone loss (osteoporosis)

**SUBCLINICAL HYPOTHYROIDISM (TSH 4.5-10, Normal FT4):**
• Treat if: TSH >10 (consensus), symptoms, positive TPO antibodies, pregnancy/planning pregnancy, goiter, progressive TSH rise
• Start low dose: 25-50 mcg daily
• Monitor TSH annually if not treating

**MYXEDEMA COMA (Endocrine Emergency - Mortality 30-60%!):**

**Clinical:**
• Severe hypothyroidism + precipitating event (infection, cold exposure, MI, sedatives)
• Hypothermia (may be missed - use low-reading thermometer!), altered mental status → coma
• Bradycardia, hypotension, hypoventilation, hyponatremia, hypoglycemia

**Management:**
1️⃣ **Levothyroxine IV:** 200-400 mcg IV loading → 1.6 mcg/kg/day IV (if IV unavailable, give NG)
  - Some protocols add Liothyronine (T3) IV 5-20 mcg (controversial)
2️⃣ **Hydrocortisone:** 100mg IV q8h (until adrenal insufficiency ruled out - may precipitate crisis if AI present)
3️⃣ **Supportive care:**
  - Passive rewarming (active rewarming may cause vasodilation + shock)
  - Mechanical ventilation if respiratory failure
  - Treat underlying precipitant (infection = most common)
  - IV fluids cautiously (risk of CHF - check cardiac function)
4️⃣ **Monitor in ICU:** Continuous telemetry, glucose q1h, electrolytes

**DISPOSITION:**
• Uncomplicated hypothyroidism: Outpatient management
• Myxedema coma: ICU
• Severe symptoms + unable to tolerate PO: Admit for IV levothyroxine`,

  // ==================== INTERMEDIATE ====================
  'hyperthyroidism': `⚡ **HYPERTHYROIDISM/THYROTOXICOSIS (ATA Guidelines / Davidson's Ch 20)**

**COMMON CAUSES:**
• Graves disease: Autoimmune (TSH receptor antibodies), diffuse goiter, ophthalmopathy
• Toxic multinodular goiter: Elderly, long-standing goiter
• Toxic adenoma: Solitary hyperfunctioning nodule
• Thyroiditis: Subacute (De Quervain - painful, post-viral), lymphocytic (postpartum, painless)
• Factitious: Exogenous thyroid hormone ingestion
• Drug-induced: Amiodarone (Type 1: Jod-Basedow, Type 2: Destructive thyroiditis)

**GRAVES-SPECIFIC FEATURES:**
• Ophthalmopathy: Proptosis, lid lag, diplopia (25% of Graves patients)
• Pretibial myxedema: Thickened, reddish skin on shins
• Thyroid acropachy: Digital clubbing

**DIAGNOSIS:**
• TSH: Suppressed (<0.01 mIU/L)
• Free T4 + Free T3: Elevated
• TSH Receptor Antibodies (TRAb): Positive → Graves disease
• Radioactive iodine uptake (RAIU):
  - Increased: Graves, toxic nodule
  - Decreased: Thyroiditis, exogenous thyroid hormone, iodine load

**TREATMENT (Three Options for Graves):**

**1. ANTITHYROID DRUGS (ATDs):**
• Methimazole (MMI): First-line (unless pregnancy)
  - Start: 10-30mg PO daily (severe 40-60mg)
  - Side effects: Rash (5%), agranulocytosis (0.3% - rare but serious!)
  - Teratogenic in 1st trimester: Aplasia cutis, choanal atresia
• Propylthiouracil (PTU): 
  - Use in 1st trimester of pregnancy ONLY
  - Start: 100-150mg PO TID
  - Risk: Hepatotoxicity (Black Box Warning - check LFTs!)
• Duration: 12-18 months then trial off
• Remission rate: 40-50% after 18-month course

**2. RADIOACTIVE IODINE (RAI-131):**
• Definitive treatment (ablates thyroid)
• Result: Hypothyroidism in 80-90% → lifelong levothyroxine
• Contraindications: Pregnancy (absolute!), active Graves ophthalmopathy (may worsen)
• Pre-treat with ATDs in elderly/cardiac patients

**3. THYROIDECTOMY:**
• Indications: Large goiter (>80g), compressive symptoms, suspicious nodule, pregnancy wanting definitive treatment (2nd trimester), severe ophthalmopathy
• Pre-operative: Achieve euthyroid state with ATDs + SSKI (potassium iodide) 5-7 days pre-op (reduces vascularity)
• Complications: Hypoparathyroidism (transient/permanent), RLN injury (hoarseness)

**SYMPTOMATIC TREATMENT:**
• Beta-blockers: Propranolol 20-80mg PO TID (also blocks T4→T3 conversion at high doses)
  - Atenolol 25-100mg daily (if propranolol contraindicated)
  - Controls tremor, tachycardia, anxiety, heat intolerance

**THYROID STORM (Endocrine Emergency - Mortality 10-30%):**

**Burch-Wartofsky Score:** ≥45 highly suggestive
• Fever, tachycardia, CNS dysfunction, GI symptoms + precipitant

**Treatment (5 B's):**
1️⃣ **Block synthesis:** PTU 500-1000mg PO/NG load → 250mg q4h (preferred over MMI in storm - blocks T4→T3 conversion)
2️⃣ **Block release:** SSKI 5 drops q6h (wait 1h after PTU to prevent gland from using iodine)
3️⃣ **Block T4→T3 conversion:** Propranolol 60-80mg PO q4h OR Hydrocortisone 100mg IV q8h
4️⃣ **Beta-blockade:** Esmolol drip (if oral not tolerated) - control HR <100
5️⃣ **Supportive:** Cooling (acetaminophen - avoid aspirin which displaces T4 from TBG), IV fluids, treat precipitant

**DISPOSITION:**
• Mild/moderate: Outpatient endocrinology
• Severe/Storm: ICU
• New diagnosis with cardiac complications: Admit for monitoring`,

  // ==================== ADVANCED ====================
  'addison': `⚠️ **ADRENAL INSUFFICIENCY / ADDISON'S DISEASE (Endocrine Society Guidelines)**

**TYPES:**
• Primary (Addison's): Adrenal gland destruction (autoimmune 80% in developed countries, TB worldwide)
• Secondary: Pituitary failure (low ACTH) - chronic steroid use most common cause
• Tertiary: Hypothalamic failure (low CRH)

**CLINICAL FEATURES (Insidious - Often Missed!):**
• Chronic: Fatigue, weight loss, anorexia, nausea, hyperpigmentation (primary only - ACTH ↑ melanocyte stimulation)
• Electrolytes: Hyponatremia, hyperkalemia, mild acidosis (mineralocorticoid deficiency)
• Hypotension, postural dizziness (volume depletion)
• Salt craving (pathognomonic)
• Vitiligo: Associated autoimmune condition
• Hyperpigmentation: Knuckles, palmar creases, buccal mucosa, scars

**DIAGNOSIS:**
• Morning cortisol: <3 mcg/dL → highly suggestive
• ACTH stimulation test (gold standard):
  - 250 mcg ACTH IV → measure cortisol at 0, 30, 60 min
  - Peak cortisol <18-20 mcg/dL = adrenal insufficiency
• ACTH level: Elevated in primary, low/normal in secondary
• Adrenal antibodies: 21-hydroxylase (present in 80% autoimmune Addison's)
• CT Adrenals: Small adrenals (autoimmune), enlarged (TB, metastases, hemorrhage)

**TREATMENT:**

**GLUCOCORTICOID REPLACEMENT:**
• Hydrocortisone: 15-25mg daily divided:
  - 10mg morning + 5mg afternoon + 5mg early evening (or 10-5-2.5)
  - Mimics circadian rhythm (highest in AM)
• Prednisone: 3-5mg PO daily (alternative - once daily dosing)
• Dexamethasone: Not preferred (difficult to titrate, higher side effect profile)

**MINERALOCORTICOID REPLACEMENT (Primary only):**
• Fludrocortisone: 0.05-0.2mg PO daily
• Monitor: BP (lying + standing), K+, renin level (target upper-normal)
• Increase dose in summer (salt loss from sweating)

**SICK DAY RULES (CRITICAL - Educate All Patients!):**
• DOUBLE or TRIPLE dose for 2-3 days during:
  - Fever >38°C
  - Infection requiring antibiotics
  - Vomiting/diarrhea
  - Surgery/trauma
• If unable to tolerate PO: IM Hydrocortisone 100mg or seek emergency care
• Medical alert bracelet: "Adrenal Insufficiency - Requires Steroids"

**ADRENAL CRISIS (Life-Threatening Emergency!):**

**Triggers:** Infection, surgery, trauma, missed steroids, vomiting

**Presentation:**
• Hypotension unresponsive to fluids and vasopressors
• Hyponatremia, hyperkalemia, hypoglycemia, hypercalcemia
• Fever, abdominal pain, vomiting (mimics acute abdomen)

**IMMEDIATE MANAGEMENT:**
1️⃣ **Hydrocortisone:** 100mg IV bolus STAT → 200mg/24h continuous infusion or 50mg IV q6h
2️⃣ **IV Fluids:** Normal saline 1-2L rapidly then D5NS (corrects hypoglycemia + hyponatremia)
3️⃣ **Treat precipitating cause:** Broad-spectrum antibiotics if infection suspected
4️⃣ **Monitor:** Glucose q1h, electrolytes q4h, telemetry
5️⃣ **Fludrocortisone:** Not needed acutely (high-dose hydrocortisone provides enough mineralocorticoid activity)

**TAPER:** Taper to maintenance over 3-5 days as clinical status improves

**PREGNANCY:**
• Increase hydrocortisone in 3rd trimester (increased CBG)
• Stress-dose steroids during labor: Hydrocortisone 100mg IV q6h

**FOLLOW-UP:**
• Endocrinology annually (more if unstable)
• DEXA scan (steroid-induced osteoporosis risk)
• Screen for other autoimmune: Thyroid, diabetes, pernicious anemia, vitiligo
• Assess quality of life and adjust dosing based on symptoms

**DISPOSITION:**
• New diagnosis stable: Outpatient endocrinology (give sick day rules + emergency injection kit)
• Adrenal crisis: ICU admission
• Any Addison's patient with vomiting: Admit for IV steroids`,

};
