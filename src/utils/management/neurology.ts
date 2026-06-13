// 🧠 Neurology Management Hints
// References: Tintinalli 9th Ed, AHA/ASA Guidelines, AAN Guidelines, Medscape, Davidson's

export const NEUROLOGY_HINTS: Record<string, string> = {
  
  // ==================== BEGINNER ====================
  'migraine': `🧠 **MIGRAINE MANAGEMENT (AAN/AHS Guidelines 2023 / Tintinalli Ch 164)**

**RED FLAGS - Rule Out Secondary Headache First:**
• Thunderclap onset (SAH - worst headache of life)
• Fever + neck stiffness (meningitis)
• New onset age >50 (temporal arteritis, mass)
• Focal neurologic deficits persisting >60 min
• Papilledema (increased ICP)
• Pregnancy (pre-eclampsia, CVT)

**MILD-MODERATE ATTACK (No nausea/vomiting):**
• First-line: NSAIDs
  - Ibuprofen 600-800mg PO
  - Naproxen 500-750mg PO
  - Diclofenac 50-100mg PO
• Aspirin 1000mg PO (effervescent for rapid absorption)
• Acetaminophen 1000mg PO (less effective alone, combine with caffeine)

**MODERATE-SEVERE ATTACK:**
• Triptans (5-HT1B/1D agonists) - FIRST LINE:
  - Sumatriptan: 50-100mg PO OR 20mg nasal spray OR 6mg SC (fastest)
  - Rizatriptan 10mg ODT (orally disintegrating - good if nausea)
  - Eletriptan 40-80mg (most effective oral triptan)
  - Zolmitriptan 2.5-5mg PO or nasal
• Contraindications to Triptans: CAD, stroke, uncontrolled HTN, hemiplegic migraine, basilar migraine
• If Triptan contraindicated:
  - Lasmiditan 50-100mg (5-HT1F agonist - no vasoconstriction, no cardiac CI)
  - Ubrogepant 50-100mg (CGRP antagonist - gepant class)
  - Rimegepant 75mg ODT (CGRP antagonist - also approved for prevention)

**SEVERE/REFRACTORY (ED Setting):**
• Dopamine antagonists (target D2 receptors in CTZ):
  - Metoclopramide 10mg IV + Diphenhydramine 25mg IV (prevents akathisia)
  - Prochlorperazine 10mg IV (most effective per trials)
  - Chlorpromazine 12.5-25mg IV (monitor for orthostasis)
• PLUS Dexamethasone 10mg IV (reduces recurrence at 24-72h)
• Ketorolac 30mg IV if not already taken NSAID
• Magnesium sulfate 1-2g IV (limited evidence, consider in aura)
• Valproic acid 500-1000mg IV (if refractory)

**STATUS MIGRAINOSUS (>72 hours refractory):**
• DHE (Dihydroergotamine): 1mg IV/IM, repeat q1h up to 3mg (pre-treat with Metoclopramide)
• IV fluids (D5NS or NS)
• Consider admission for:
  - IV DHE q8h protocol + Antiemetics
  - Valproic acid IV 500mg q8h
  - Peripheral nerve blocks (occipital, supraorbital)

**PREVENTION (Indications: >4 attacks/month, disabling attacks, acute meds ineffective/contraindicated):**
• First-line oral: Propranolol 80-240mg, Topiramate 50-100mg, Amitriptyline 25-150mg
• CGRP monoclonal antibodies: Erenumab 70-140mg SC monthly, Galcanezumab 120-240mg SC
• OnabotulinumtoxinA (Botox): 155-195 units q12 weeks (chronic migraine only)
• Supplements: Magnesium 400-600mg, Riboflavin 400mg, CoQ10 300mg (level B evidence)

**DISPOSITION:**
• Resolved in ED: Discharge with rescue + prevention plan
• Status migrainosus: Consider admission for IV protocol
• Red flags present: Admit for workup`,

  'bells palsy': `😐 **BELL'S PALSY (AAN Guidelines / Tintinalli Ch 168)**

**DIAGNOSIS (Clinical - Diagnosis of Exclusion):**
• Acute onset (<72h) unilateral facial weakness
• Involves forehead AND lower face (peripheral CN VII lesion)
• ± Hyperacusis (stapedius muscle), altered taste (chorda tympani), decreased tearing
• IMPORTANT: If forehead is spared → CENTRAL lesion (stroke!) - Urgent CT/MRI

**DISTINGUISH FROM CENTRAL FACIAL PALSY:**
• Bell's Palsy: Forehead + lower face weak (upper motor neuron lesion CANNOT cause forehead weakness - bilateral innervation)
• Stroke: Only lower face weak, forehead intact
• Ramsay Hunt: Vesicles in ear canal/palate + severe pain (VZV - worse prognosis)
• Lyme disease: Bilateral facial palsy, endemic area, tick exposure (bilateral Bell's is very rare)
• Guillain-Barré: Bilateral, ascending weakness, areflexia
• Acoustic neuroma: Gradual onset, hearing loss, tinnitus

**MANAGEMENT (Start within 72h of onset):**

**CORTICOSTEROIDS (Class I - Reduces incomplete recovery by 40%):**
• Prednisone: 60-80mg PO daily ×7 days (then taper or stop)
  - Regimen: 60mg ×5 days, then decrease by 10mg/day
• MUST be started within 72h for benefit

**ANTIVIRALS (Consider - especially if severe or Ramsay Hunt suspected):**
• Valacyclovir 1000mg PO TID ×7 days
• OR Acyclovir 400mg PO 5×/day ×7 days
• Evidence: Modest benefit, synergistic with steroids (NNT = 11 for complete recovery)
• DEFINITELY give if: Severe palsy, Ramsay Hunt syndrome, vesicles present

**EYE CARE (CRITICAL - Prevent Exposure Keratopathy):**
• Artificial tears q1-2h while awake
• Lacrilube ointment at night
• Moisture chamber or eye taping at night
• Sunglasses/eye shield during day
• **Urgent ophthalmology referral** if: Eye pain, redness, decreased vision

**PROGNOSIS:**
• 70% complete recovery without treatment
• 85% complete recovery with steroids
• 90%+ with steroids + antivirals
• Improvement begins: 2-3 weeks, maximum recovery: 3-6 months
• Poor prognostic factors: Age >60, complete palsy, no improvement by 3 weeks, Ramsay Hunt

**FOLLOW-UP:**
• Reassess at 2-4 weeks
• If no improvement by 3 months: EMG/NCS + MRI brain to rule out tumor
• Refer to ENT/neurology if incomplete recovery at 3 months

**DISPOSITION:** Discharge home with close follow-up (unless bilateral or severe eye complications)`,

  // ==================== INTERMEDIATE ====================
  'stroke': `🧠 **ACUTE ISCHEMIC STROKE (AHA/ASA 2023 Guidelines)**

**TIME IS BRAIN: 1.9 million neurons die per minute during LVO!**

**PREHOSPITAL/ED:**
• Stroke scale: NIHSS (0-42)
• Last known well time (NOT when found)
• Glucose check (hypoglycemia mimics stroke)
• Non-contrast CT Head STAT (rule out hemorrhage)

**CT FINDINGS:**
• Hyperdense MCA sign (early - within 3h)
• Loss of gray-white differentiation (insular ribbon sign)
• Sulcal effacement
• ASPECTS score: ≥7 = favorable for reperfusion

**THROMBOLYSIS (IV tPA/Alteplase):**

**Window: 0-4.5 hours from last known well**
• Dose: 0.9mg/kg (max 90mg), 10% bolus over 1 min, 90% infusion over 60 min
• NINDS trial: NNT = 8 for excellent outcome at 3 months
• ECASS III: Extended window to 4.5h

**INCLUSION CRITERIA:**
• Age ≥18
• Clinical diagnosis of ischemic stroke with measurable deficit
• Onset <4.5h (or <3h if age >80, DM + prior stroke, or on warfarin with INR ≤1.7)

**ABSOLUTE CONTRAINDICATIONS:**
• Intracranial hemorrhage on CT
• Extensive hypodensity (>1/3 MCA territory)
• Recent intracranial/spinal surgery (<3 months)
• Head trauma/stroke within 3 months
• Active internal bleeding
• INR >1.7, PT >15s, Platelets <100K, aPTT >40s
• SBP >185 or DBP >110 despite treatment

**RELATIVE CONTRAINDICATIONS (Weigh Risk/Benefit):**
• Minor/rapidly improving symptoms
• Seizure at onset (if deficit is post-ictal)
• Recent major surgery (<14 days)
• Pregnancy

**POST-THROMBOLYSIS MONITORING:**
• ICU/Stroke unit admission
• Neuro checks + vital signs q15min ×2h → q30min ×6h → q1h ×16h
• BP goal: <180/105 ×24h
• No antiplatelets/anticoagulants ×24h
• No nasogastric tubes, urinary catheters, arterial punctures ×24h
• Follow-up CT/MRI at 24h

**MECHANICAL THROMBECTOMY (LVO - Large Vessel Occlusion):**
• Window: 0-24h from onset
• DAWN Trial (2018): Up to 24h with CT perfusion mismatch
• DEFUSE 3 Trial (2018): Up to 16h with perfusion imaging
• Eligible vessels: ICA, MCA M1, MCA M2 dominant
• NIHSS ≥6
• Pre-stroke mRS 0-1

**BLOOD PRESSURE MANAGEMENT:**
• NO tPA candidate: Permissive HTN unless SBP >220 or DBP >120
• tPA candidate: SBP <185, DBP <110 before and ×24h after
  - Labetalol 10-20mg IV q10-20min (max 300mg)
  - Nicardipine 5mg/hr infusion
• Post-thrombectomy: SBP <160 (or <140 per some protocols)

**ANTIPLATELET THERAPY:**
• After 24h post-tPA: Aspirin 325mg PO daily
• Non-tPA candidate: Aspirin 325mg within 24-48h (CAST/IST trials)
• DAPT (Aspirin + Clopidogrel): For minor stroke (NIHSS ≤3) or high-risk TIA ×21 days (CHANCE/POINT trials)
  - Aspirin 325mg load + Clopidogrel 600mg load → Aspirin 81mg + Clopidogrel 75mg daily ×21 days
  - Reduces recurrent stroke by 32% in first 90 days

**SECONDARY PREVENTION (Workup):**
• Echo (TTE ± bubble study for PFO)
• TEE if: Suspected cardioembolic source despite normal TTE, prosthetic valve, aortic arch atheroma
• Telemetry ×24-48h (look for paroxysmal AFib)
• Carotid duplex: If >50% stenosis → CTA/MRA for confirmation
• Lipid panel: High-intensity statin (Atorvastatin 80mg) regardless of baseline LDL
• HbA1c: Screen for DM
• Hypercoagulable workup: If young, no clear etiology, family history

**DISPOSITION:** 
• All strokes: Admit to stroke unit (reduces mortality, improves outcomes)
• Thrombolysis/thrombectomy: ICU/Neuro-ICU
• Minor stroke: Telemetry bed`,

  'myasthenia gravis': `💪 **MYASTHENIA GRAVIS (MGFA Guidelines / Tintinalli Ch 177)**

**CLINICAL FEATURES:**
• Fluctuating weakness (worse with activity, better with rest)
• Ocular: Ptosis, diplopia (50% present ocular only)
• Bulbar: Dysphagia, dysarthria, nasal regurgitation, weak cough
• Proximal limbs: Difficulty climbing stairs, lifting arms
• **Myasthenic Crisis:** Respiratory failure from bulbar/respiratory muscle weakness

**DIAGNOSIS:**
• Ice pack test: Apply ice to ptotic eyelid ×2 min → improvement (simple, bedside)
• Edrophonium (Tensilon) test: Improvement in muscle strength (rarely used - risk of bradycardia)
• AchR antibody: Positive in 85% generalized MG
• MuSK antibody: If AchR negative (5-10%)
• EMG: Repetitive nerve stimulation → decremental response (>10%)
• CT Chest: Rule out thymoma (10-15% of MG patients)

**TREATMENT:**

**SYMPTOMATIC:**
• Pyridostigmine: 30-60mg PO q4-6h (start low, titrate)
  - Onset: 30-60 min, Duration: 3-6h
  - Side effects: Diarrhea, cramps, bradycardia (add Glycopyrrolate 1mg if needed)

**IMMUNOSUPPRESSION (Chronic):**
• First-line: Prednisone 10-20mg daily (slow taper to lowest effective dose)
  - Start low, go slow (paradoxical worsening in first 2 weeks possible!)
• Steroid-sparing: Azathioprine 2-3mg/kg/day (takes 12-18 months for full effect)
• Alternatives: Mycophenolate 1-1.5g BID, Cyclosporine, Tacrolimus
• Refractory: Rituximab (especially MuSK+), Eculizumab (AchR+)

**THYMECTOMY (MGTX Trial):**
• Indication: AchR+ generalized MG, age <65
• Benefits: Reduced steroid requirement, improved outcomes over 3 years
• Thymoma: Always resect (regardless of MG status)

**MYASTHENIC CRISIS (Respiratory Emergency!):**

**RED FLAGS - Impending Crisis:**
• Pooling of secretions, weak cough, inability to handle secretions
• Single breath count <15, vital capacity <15 mL/kg or <1L
• NIF (Negative Inspiratory Force) <20 cmH₂O (less negative = weaker)
• Staccato speech, nasal voice, drooling

**MANAGEMENT:**
1️⃣ **Secure airway:** Early intubation (avoid if possible - try BiPAP first)
  - Use Rocuronium cautiously (increased sensitivity to non-depolarizing NMBs)
  - AVOID Succinylcholine (resistance → prolonged effect)

2️⃣ **Plasmapheresis (PLEX):** 5 exchanges over 7-10 days
  - Rapid improvement (days) - first-line in crisis
  - Removes antibodies directly

3️⃣ **IVIG:** 0.4g/kg/day ×5 days
  - Equally effective as PLEX (takes 1-2 weeks for peak)
  - Preferred if: Hemodynamic instability, sepsis, difficult IV access

4️⃣ **Hold Pyridostigmine** during crisis (increases secretions)

5️⃣ **Identify trigger:** Infection (40%), medication change, surgery, pregnancy, aspiration

**MEDICATIONS TO AVOID (Worsen MG):**
• Aminoglycosides, Fluoroquinolones, Macrolides (all antibiotics)
• Beta-blockers, Calcium channel blockers
• Magnesium (including MgSO₄ for pre-eclampsia!)
• Neuromuscular blocking agents
• Procainamide, Quinidine
• Statins (can worsen - weigh risk/benefit)

**DISPOSITION:**
• Mild: Outpatient neurology management
• Moderate (bulbar symptoms): Admit for monitoring + treatment optimization
• Crisis: ICU (may need intubation ± PLEX/IVIG)`,

  'parkinson': `🧓 **PARKINSON'S DISEASE (MDS Guidelines / NICE 2023)**

**CARDINAL FEATURES (TRAP):**
• Tremor: Resting, "pill-rolling", 4-6 Hz
• Rigidity: Cogwheel (tremor + rigidity), lead-pipe
• Akinesia/Bradykinesia: Slow movements, masked facies, micrographia
• Postural instability: Late finding, falls backward

**SUPPORTIVE FEATURES:**
• Asymmetric onset, excellent response to levodopa
• Non-motor: Constipation, anosmia, REM sleep behavior disorder, depression, orthostatic hypotension

**RED FLAGS (Consider Parkinson-plus syndromes):**
• Early falls (within 1 year) → PSP (Progressive Supranuclear Palsy)
• Early autonomic failure → MSA (Multiple System Atrophy)
• Early dementia/hallucinations → LBD (Lewy Body Dementia)
• Poor levodopa response → Consider atypical parkinsonism
• Symmetric onset

**TREATMENT (Symptomatic - No Disease-Modifying Therapy Yet):**

**EARLY DISEASE (<65 years, mild symptoms):**
• First-line: MAO-B inhibitors
  - Rasagiline 1mg PO daily
  - Selegiline 5mg PO BID
  - Neuroprotective potential (delays need for levodopa)
• Dopamine agonists:
  - Pramipexole 0.125mg TID (titrate slowly)
  - Ropinirole 0.25mg TID
  - Rotigotine patch 2-4mg/24h (good for NPO, swallowing issues)
  - Side effects: Impulse control disorders (gambling, hypersexuality - ASK about this!), hallucinations, edema

**MODERATE-ADVANCED DISEASE:**
• Levodopa/Carbidopa (Sinemet) - GOLD STANDARD:
  - Start: 25/100mg TID (titrate as needed)
  - Available: IR (immediate release), CR (controlled release), Rytary (extended release)
  - Carbidopa prevents peripheral conversion → reduces nausea
  - "Honeymoon period": Excellent response for 5-7 years

**MOTOR COMPLICATIONS (After 5-10 years of levodopa):**
• Wearing-off: COMT inhibitors
  - Entacapone 200mg with each levodopa dose
  - Opicapone 50mg at bedtime (once daily)
• Dyskinesias: Amantadine 100mg BID-TID (NMDA antagonist)
• "On-Off" fluctuations: 
  - Apomorphine SC injection (rescue therapy - 2-4mg SC PRN, max 5×/day)
  - Apomorphine continuous infusion pump
  - Duopa (carbidopa/levodopa intestinal gel - PEG-J tube)

**DEEP BRAIN STIMULATION (DBS):**
• Indications: Motor fluctuations despite optimal medical therapy, tremor refractory to meds
• Target: Subthalamic nucleus (STN) or Globus pallidus interna (GPi)
• Requirements: Levodopa responsive, no significant cognitive impairment, age <70

**NON-MOTOR SYMPTOM MANAGEMENT:**
• Depression: SSRIs (Sertraline, Escitalopram) - avoid MAOIs with MAO-B inhibitors
• Psychosis: Pimavanserin 34mg (5-HT2A inverse agonist - NO dopamine blockade)
  - Quetiapine 12.5-50mg (low dose - less EPS)
  - AVOID Haloperidol, Risperidone (worsen parkinsonism!)
• Dementia: Rivastigmine (ChEI)
• Constipation: Polyethylene glycol, increased fluids/fiber
• Orthostatic hypotension: Fludrocortisone, Midodrine, compression stockings
• Sialorrhea: Glycopyrrolate, atropine drops, Botox to salivary glands

**HOSPITALIZATION PEARLS:**
• NEVER miss levodopa doses! Withdrawal can cause NMS-like syndrome
• Give on time, every time (even NPO - use Rotigotine patch or NG levodopa)
• Avoid: Metoclopramide, Haloperidol, Prochlorperazine (all dopamine antagonists)
• Safe antiemetics: Ondansetron, Domperidone (QTc monitoring)

**DISPOSITION:** 
• Stable: Outpatient neurology q3-6 months
• Acute decompensation: Admit if unable to take PO, severe OFF state, psychosis, falls
• DBS evaluation: Refer to specialized movement disorders center`,

  // ==================== ADVANCED ====================
  'guillain barre': `⚠️ **GUILLAIN-BARRÉ SYNDROME (GBS Guidelines / Tintinalli Ch 178)**

**CLASSIC PRESENTATION:**
• Ascending, symmetric weakness (legs → arms → face → bulbar → respiratory)
• Areflexia or hyporeflexia (key finding!)
• Preceding infection: Campylobacter (30%), CMV, EBV, Zika, or vaccination
• Peak: 2-4 weeks after onset
• Albuminocytologic dissociation: Elevated CSF protein with normal WBC count

**GBS VARIANTS:**
• AIDP (90%): Classic ascending weakness, demyelinating
• AMAN: Pure motor, axonal, associated with Campylobacter
• AMSAN: Motor + sensory, axonal (worse prognosis)
• Miller Fisher Syndrome: Ophthalmoplegia, ataxia, areflexia (anti-GQ1b antibody)
• Bickerstaff Brainstem Encephalitis: MFS + altered consciousness

**INITIAL ASSESSMENT (ED):**
• ABC assessment (respiratory failure is #1 cause of death!)
• Vital capacity q2-4h initially, then q6h
• Single breath count (normal >30)
• NIF (Negative Inspiratory Force): <20 cmH₂O = impending respiratory failure
• Bulbar assessment: Dysphagia, dysarthria, pooling secretions
• Autonomic assessment: HR, BP lability (can be severe!)
• Neurologic exam: Document MRC sum score (0-60), reflexes

**RESPIRATORY MONITORING (Crucial!):**
• Intubate if:
  - Vital capacity <15 mL/kg (<1L in adult)
  - NIF <20 cmH₂O
  - PaCO₂ >45 or rising
  - Unable to handle secretions
  - Bulbar dysfunction with aspiration
• **20-40% require mechanical ventilation**

**TREATMENT (Start ASAP - within 2 weeks of onset):**

**IVIG (First-line, equally effective as PLEX):**
• Dose: 0.4g/kg/day ×5 days (total 2g/kg)
• Advantages: Easier to administer, fewer side effects
• Disadvantages: Expensive, volume load, AKI risk
• Pre-treat: IV fluids, check IgA levels (deficiency = anaphylaxis risk)

**PLASMAPHERESIS (PLEX):**
• 5 exchanges over 7-10 days (exchange 1-1.5 plasma volumes each)
• Advantages: Removes antibodies directly
• Disadvantages: Requires central line, hypotension, hypocalcemia
• Equally effective as IVIG (do NOT combine - no additional benefit)

**STEROIDS:**
• NOT recommended (no benefit in GBS - actually may worsen outcomes)

**AUTONOMIC DYSFUNCTION MANAGEMENT:**
• Labile BP: Avoid over-treatment
• Bradycardia: Atropine or pacing (may alternate with tachycardia!)
• Ileus: NPO, NG tube
• Urinary retention: Foley catheter

**PAIN MANAGEMENT:**
• Neuropathic pain common: Gabapentin 300-900mg TID, Pregabalin 75-150mg BID
• Opioids for severe pain (morphine 2-4mg IV PRN)
• Muscle cramps: Baclofen 10-20mg TID

**DVT PROPHYLAXIS:**
• Enoxaparin 40mg SC daily + SCDs (high risk due to immobility)

**REHABILITATION:**
• Early PT/OT consultation (prevent contractures, maintain ROM)
• Speech therapy for dysphagia
• Nutritional support: NG/NJ if bulbar dysfunction

**PROGNOSIS:**
• 80%: Independent ambulation at 1 year
• 15-20%: Residual disability
• 5-10%: Mortality (respiratory failure, autonomic dysfunction, PE)
• Poor prognostic factors: Age >60, rapid onset <7 days, need for ventilation, AMSAN variant
• Recovery: Begins 2-4 weeks after nadir, continues for 6-12 months

**DISPOSITION:** ICU admission (all GBS patients due to risk of rapid deterioration)`,

  'multiple sclerosis': `🧬 **MULTIPLE SCLEROSIS (McDonald Criteria 2017 / AAN Guidelines)**

**CLINICAL PATTERNS:**
• Relapsing-Remitting (RRMS): 85% - acute attacks with complete/partial recovery
• Secondary Progressive (SPMS): Gradual worsening after RRMS
• Primary Progressive (PPMS): 10-15% - steady decline from onset
• Clinically Isolated Syndrome (CIS): First episode, doesn't meet MS criteria yet

**COMMON PRESENTATIONS:**
• Optic neuritis: Unilateral vision loss, pain with eye movement, relative afferent pupillary defect (RAPD)
• Brainstem: Internuclear ophthalmoplegia (INO - MLF lesion), diplopia, vertigo
• Spinal cord: Sensory level, Lhermitte sign (electric shock with neck flexion), transverse myelitis
• Cerebellar: Ataxia, intention tremor, scanning speech (Charcot triad)
• Uhthoff phenomenon: Symptoms worsen with heat (fever, exercise, hot bath)

**DIAGNOSIS (McDonald Criteria 2017):**
• Dissemination in space (DIS): ≥1 lesion in ≥2 typical CNS locations
• Dissemination in time (DIT): Simultaneous enhancing + non-enhancing lesions OR new lesion on follow-up MRI OR OCBs in CSF
• MRI: Periventricular, juxtacortical, infratentorial, spinal cord lesions
• CSF: Oligoclonal bands (OCBs) unique to CSF (not in serum)

**ACUTE RELAPSE MANAGEMENT:**

**Mild (Sensory only, no functional impairment):**
• Conservative: No steroids, monitor

**Moderate-Severe (Motor, cerebellar, brainstem, visual):**
• Methylprednisolone 1000mg IV daily ×3-5 days
• No taper needed
• OR oral equivalent: Prednisone 1250mg PO daily ×3-5 days (equal efficacy per Cochrane)
• Shortens recovery time but does NOT alter long-term disability
• H2 blocker/PPI for gastric protection

**Refractory/Severe (No response to steroids in 5-7 days):**
• Plasmapheresis (PLEX): 5-7 exchanges over 10-14 days
  - Most effective for: Brainstem lesions, severe motor deficits

**DISEASE-MODIFYING THERAPIES (DMTs):**

**Injectable (Moderate Efficacy):**
• Interferon beta-1a (Avonex IM weekly, Rebif SC TIW)
• Glatiramer acetate 40mg SC TIW
• Safe in pregnancy (Category B)

**Oral (Moderate-High Efficacy):**
• Fingolimod 0.5mg PO daily (first-dose bradycardia - 6h observation)
• Dimethyl fumarate 240mg BID (flushing, GI - take with food/aspirin)
• Teriflunomide 14mg PO daily (teratogenic - avoid in childbearing)
• Siponimod (for SPMS)

**Infusion (High Efficacy - Best for aggressive disease):**
• Natalizumab 300mg IV q4 weeks (PML risk - check JC virus antibody q6 months)
• Ocrelizumab 600mg IV q6 months (anti-CD20 - also approved for PPMS)
• Alemtuzumab 12mg IV daily ×5 days year 1, ×3 days year 2 (highest efficacy, significant risks)

**SYMPTOMATIC MANAGEMENT:**
• Spasticity: Baclofen 10-80mg/day, Tizanidine 2-8mg TID, Botox for focal spasticity
• Neuropathic pain: Gabapentin 300-3600mg/day, Pregabalin 75-300mg BID
• Fatigue: Amantadine 100mg BID, Modafinil 100-200mg daily
• Bladder dysfunction: Oxybutynin (urgency), Tamsulosin (retention), Self-catheterization
• Depression: SSRIs (common comorbidity in MS)
• Tremor: Propranolol, Primidone, or DBS (refractory cases)

**LIFESTYLE MODIFICATIONS:**
• Vitamin D 2000-5000 IU daily (low levels associated with higher relapse rate)
• Smoking cessation (smoking accelerates disability progression)
• Avoid hyperthermia (hot tubs, saunas)
• Physical therapy + Occupational therapy
• Regular exercise (improves fatigue, mood, mobility)

**DISPOSITION:**
• Acute relapse mild: Outpatient management, follow-up neurology
• Acute relapse moderate-severe: Admit for IV steroids
• First presentation (CIS): Admit for workup + MRI + LP
• Respiratory compromise/brainstem: ICU (monitor for aspiration, respiratory failure)`,

};
