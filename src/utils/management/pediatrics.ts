// 👶 Pediatrics Management Hints
// References: AAP Guidelines, Nelson Textbook 21st Ed, Tintinalli 9th Ed, Medscape

export const PEDIATRICS_HINTS: Record<string, string> = {
  
  // ==================== BEGINNER ====================
  'bronchiolitis': `👶 **BRONCHIOLITIS (AAP Guidelines 2023 / NICE 2023)**

**DEFINITION:** Viral lower respiratory tract infection in infants <24 months
**PEAK AGE:** 2-6 months
**MOST COMMON PATHOGEN:** RSV (Respiratory Syncytial Virus) - 50-80%

**CLINICAL FEATURES:**
• Prodrome: URI symptoms (rhinorrhea, congestion, cough) ×1-3 days
• Progressive: Cough, tachypnea, respiratory distress (nasal flaring, grunting, retractions)
• Wheezing, crackles on auscultation
• Apnea: Can be presenting symptom in young infants (<6 weeks) or premature infants
• Fever: Usually low-grade; high fever suggests alternative diagnosis (pneumonia, UTI)

**SEVERITY ASSESSMENT (Bronchiolitis Severity Score):**
• **Mild:** Feeding normally, SpO₂ >95%, mild tachypnea, no/mild retractions, normal behavior
• **Moderate:** Decreased feeding (50-75% of normal), SpO₂ 90-95%, moderate tachypnea (RR 50-70), moderate retractions, irritable
• **Severe:** Feeding <50%, SpO₂ <90%, severe tachypnea (RR >70), severe retractions/grunting, lethargy

**MANAGEMENT (Supportive - Key Principle: "Less is More!"):**

**1. RESPIRATORY SUPPORT:**
• **Oxygen therapy:** Target SpO₂ >90% (AAP threshold for O₂)
  - Low-flow nasal cannula: 0.5-2 L/min
  - High-flow nasal cannula (HFNC): 2 L/kg/min (max 8-12 L/min in infants)
    - Consider if: Severe respiratory distress, SpO₂ <90% on standard O₂
    - Evidence: Reduces escalation to CPAP/intubation (moderate evidence)
• **CPAP:** If HFNC fails or severe distress with hypercapnia
• **Intubation:** Respiratory failure (PaCO₂ rising despite support, apnea refractory to stimulation)

**2. HYDRATION AND NUTRITION:**
• Maintain hydration (tachypnea + decreased feeding → dehydration risk)
• Nasogastric (NG) feeds: If respiratory rate 60-70 (unsafe to feed orally)
• IV fluids: If RR >70, severe distress, or unable to tolerate NG
  - Isotonic maintenance: D5½NS at maintenance rate
  - Monitor for SIADH (bronchiolitis increases ADH - risk of hyponatremia!)

**3. NASAL SUCTIONING (Critical for Feeding!):**
• Bulb suction or nasal aspirator before feeds and PRN
• Deep suctioning: Only if significant secretions + respiratory distress
• Infants are obligate nasal breathers - nasal congestion = respiratory distress + feeding difficulty

**TREATMENTS WITH NO PROVEN BENEFIT (DO NOT USE ROUTINELY!):**
❌ **Bronchodilators (Albuterol):** No benefit in bronchiolitis (Cochrane review)
  - Trial MAY be considered if: Strong family history of atopy, older infant (>12 months), wheeze-predominant
  - If trial: Assess response objectively (RR, SpO₂, work of breathing) - discontinue if no improvement

❌ **Corticosteroids (PO/IV/Inhaled):** No benefit in acute bronchiolitis
  - Dexamethasone PO/IV not recommended (unless comorbid asthma/reactive airway disease)

❌ **Nebulized Hypertonic Saline (3% or 7%):** 
  - Some studies show reduced length of stay, others show no benefit
  - AAP: Not recommended routinely (consider if hospitalized + prolonged course)

❌ **Nebulized Epinephrine (Racemic epinephrine):**
  - Modest short-term benefit (outpatient setting)
  - NOT recommended for inpatients (no difference in length of stay)

❌ **Antibiotics:** No role unless secondary bacterial infection (pneumonia, AOM, UTI)
  - Procalcitonin may help guide decision (low PCT supports viral etiology)

❌ **Chest physiotherapy:** No benefit (Cochrane review)

**RED FLAGS (Consider Alternative/Complicating Diagnosis):**
• Toxic appearance, high fever >39°C
• Asymmetric lung findings (consolidation → pneumonia, foreign body aspiration)
• Severe hypoxia out of proportion to findings (cardiac disease, pulmonary hypertension)
• Recurrent bronchiolitis (>2 episodes): Consider cystic fibrosis, immunodeficiency, aspiration, congenital anomaly

**HIGH-RISK GROUPS (Lower Threshold for Admission):**
• Age <12 weeks (especially <6 weeks - highest risk of apnea)
• Prematurity <35 weeks
• Chronic lung disease (BPD - bronchopulmonary dysplasia)
• Congenital heart disease (especially cyanotic, CHF)
• Immunodeficiency
• Neuromuscular disorders (weak cough, aspiration risk)

**DISPOSITION (AAP Admission Criteria):**
• **Admit if:**
  - SpO₂ <90% on room air
  - RR >70, moderate-severe respiratory distress
  - Dehydration or unable to feed (PO intake <50% normal)
  - Apnea (observed or reported)
  - High-risk infant (age <6 weeks, prematurity, comorbidities)
  - Uncertain home care capability

• **Consider PICU if:**
  - SpO₂ <90% despite HFNC 2 L/kg/min
  - Recurrent apnea
  - Hypercapnia (PaCO₂ >55-60) or rising despite HFNC
  - Altered mental status, exhaustion

**PREVENTION:**
• **Palivizumab (Synagis):** Monoclonal antibody against RSV
  - Monthly IM injections during RSV season (November-March in US)
  - Candidates (per AAP): 
    • Premature <29 weeks, age <12 months at RSV season start
    • BPD on oxygen/medications in past 6 months, age <24 months
    • Hemodynamically significant CHD, age <12 months
    • Severe immunodeficiency
  - Nirsevimab (Beyfortus): New long-acting monoclonal - single dose for RSV season (2023 recommendation: all infants <8 months)

**PARENT EDUCATION (Discharge):**
• Natural course: Symptoms peak days 3-5, cough may persist 2-4 weeks
• Warning signs: Respiratory distress, decreased feeding, lethargy, apnea
• Nasal suctioning technique demonstration
• Avoid smoke exposure, practice good hand hygiene
• Follow-up: 24-48h with PCP, sooner if concerns

**PROGNOSIS:**
• Self-limited (7-10 days acute symptoms)
• 30-50% develop recurrent wheezing in childhood
• Small subset develop persistent asthma (especially if severe RSV + atopic family history)`,

  'otitis media': `👂 **ACUTE OTITIS MEDIA (AAP Guidelines 2023)**

**DIAGNOSIS (Need ALL 3 - AAP 2013):**
1. **Acute onset:** Within 48h of symptoms
2. **Middle ear inflammation:** TM erythema or otalgia interfering with sleep/activity
3. **Middle ear effusion (MEE):** Bulging TM, limited/impaired mobility, otorrhea (not from otitis externa), air-fluid level

**SPECTRUM OF DISEASE:**
• AOM: Acute infection with effusion (as above)
• OME (Otitis Media with Effusion): Effusion WITHOUT signs of infection (no pain, no fever, no erythema)
  - Common after AOM (persists 4-8 weeks) or with Eustachian tube dysfunction
  - NO antibiotics! Observation ×3 months, then ENT referral if persistent
• Chronic OME: ≥3 months, bilateral, hearing loss >20dB → Tympanostomy tubes

**MICROBIOLOGY:**
• Streptococcus pneumoniae: 30-40% (most common bacterial cause)
• Non-typeable Haemophilus influenzae: 20-30%
• Moraxella catarrhalis: 10-15%
• Group A Streptococcus: 5%
• Viral: RSV, rhinovirus, influenza, adenovirus (30-40% - many AOM are viral or viral-bacterial coinfection)

**MANAGEMENT:**

**PAIN MANAGEMENT (ALL Patients - Regardless of Antibiotic Decision!):**
• Acetaminophen: 15mg/kg PO q4-6h (max 75mg/kg/day)
• Ibuprofen: 10mg/kg PO q6-8h (age >6 months, max 40mg/kg/day)
• Topical anesthetic: Benzocaine/antipyrine otic drops (Auralgan) - if TM intact
  - Provides rapid local pain relief
• Avoid: Decongestants, antihistamines - no benefit in AOM

**ANTIBIOTIC DECISION - OBSERVATION vs TREATMENT:**

**Immediate Antibiotic Treatment (AAP Criteria):**
• Age <6 months: Always treat (regardless of severity/uncertainty)
• Age 6-23 months + bilateral AOM: Treat
• Age 6-23 months + unilateral AOM + severe symptoms: Treat
  - Severe: Moderate-severe otalgia ≥48h or fever ≥39°C (102.2°F)
• Any age + otorrhea (TM perforation): Treat
• Any age + severe symptoms + uncertain follow-up: Treat

**Observation Option ("Watchful Waiting"):**
• Age 6-23 months + unilateral AOM + mild symptoms: Observe 48h
• Age ≥24 months + unilateral OR bilateral + mild symptoms: Observe 48h
• Requirements: Reliable caregiver, access to follow-up, symptom monitoring plan
• Pain management: Emphasize importance
• Reassess: If no improvement or worsening at 48-72h → start antibiotics

**FIRST-LINE ANTIBIOTICS:**

**Amoxicillin (First-Line - Unless Recent Use):**
• 80-90mg/kg/day PO divided BID ×10 days (<2 years or severe symptoms) or ×5-7 days (≥2 years, mild-moderate)
  - High-dose for S. pneumoniae resistance (standard dose 40-45mg/kg/day is insufficient!)

**Amoxicillin-Clavulanate (Augmentin) - If Amoxicillin Failure or Recent Use:**
• 90mg/kg/day (amoxicillin component) divided BID ×10 days
• Indications:
  - Failed amoxicillin (symptoms persist after 48-72h of amoxicillin)
  - Amoxicillin use within 30 days
  - Concurrent purulent conjunctivitis (H. influenzae highly likely)
  - Severe symptoms (high fever, severe pain)
  - History of recurrent AOM unresponsive to amoxicillin

**PENICILLIN ALLERGY ALTERNATIVES:**

**Non-Type I Allergy (No Anaphylaxis):**
• Cefdinir: 14mg/kg/day divided BID ×10 days
• Cefuroxime: 30mg/kg/day divided BID ×10 days
• Ceftriaxone: 50mg/kg IM/IV daily ×1-3 days (if PO not tolerated)

**Type I Allergy (Anaphylaxis to Penicillin):**
• Azithromycin: 10mg/kg day 1, then 5mg/kg days 2-5 (once daily)
• Clarithromycin: 15mg/kg/day divided BID ×10 days
• Clindamycin: 30-40mg/kg/day divided TID ×10 days
  - Plus additional agent for H. influenzae (clindamycin only covers Gram-positives)
  - Note: Macrolide resistance in S. pneumoniae = 30-40% (increasing)

**TREATMENT FAILURE (48-72h after appropriate antibiotic):**
• Re-examine: Confirm AOM diagnosis (not OME)
• If on Amoxicillin → Switch to Amoxicillin-Clavulanate
• If on Amoxicillin-Clavulanate → Ceftriaxone 50mg/kg IM/IV daily ×3 days
• Consider ENT referral for tympanocentesis + culture

**RECURRENT AOM (≥3 episodes in 6 months or ≥4 in 12 months):**
• Evaluate for: Immunodeficiency, anatomic abnormality (cleft palate, submucous cleft), allergies, GERD
• Tympanostomy tube placement (ENT referral):
  - Reduces AOM frequency by 50%
  - Indications: Recurrent AOM, chronic OME with hearing loss >20dB, speech/language delay
• Consider: Pneumococcal conjugate vaccine (PCV13) - reduces S. pneumoniae AOM
• Prophylactic antibiotics: NOT recommended (AAP) - risk of resistance outweighs benefit

**COMPLICATIONS (Rare but Serious):**

**Acute Mastoiditis:**
• Tender, erythematous, edematous post-auricular mass
• Ear displaced forward and downward
• CT temporal bone with contrast
• Treatment: IV antibiotics (Ceftriaxone or Vancomycin + Ceftazidime) + Myringotomy ± Mastoidectomy
• Admit, ENT consult urgently

**Suppurative Labyrinthitis:**
• Vertigo, nystagmus, sensorineural hearing loss
• ENT emergency - IV antibiotics ± surgical drainage

**Intracranial Complications (Meningitis, Brain Abscess, Sigmoid Sinus Thrombosis):**
• Headache, fever, altered mental status, focal neurologic deficits
• CT/MRI brain, LP (if safe)
• Neurosurgery + ID consults

**FOLLOW-UP:**
• Reassess 48-72h if observation or treatment failure
• Routine follow-up at end of treatment if <2 years, recurrent AOM, or language concerns
• Hearing test: If OME persists >3 months, speech delay, or recurrent AOM
• Tympanometry: Normal type A curve indicates resolution of effusion

**PREVENTION:**
• PCV13 vaccination (routine childhood immunization)
• Annual influenza vaccine (influenza predisposes to AOM)
• Breastfeeding ≥6 months (reduces AOM by 40%)
• Avoid passive smoking (major risk factor)
• Avoid bottle propping, pacifier use after 6 months
• Limit daycare attendance if recurrent AOM`,

  'gastroenteritis': `👶 **ACUTE GASTROENTERITIS (ESPGHAN/ESPID Guidelines / AAP)**

**ETIOLOGY (Most Common - Viral):**
• Rotavirus (most common severe - pre-vaccine era)
• Norovirus (most common in outbreaks - all ages)
• Adenovirus 40/41, Astrovirus, Sapovirus
• Bacterial: Salmonella, Shigella, Campylobacter, E. coli (0157:H7), C. difficile
• Parasitic: Giardia, Cryptosporidium, Entamoeba histolytica

**ASSESSMENT OF DEHYDRATION (WHO/CDC - Clinical Dehydration Scale):**

**Mild (3-5%):**
• Thirsty, slightly dry mucous membranes, normal skin turgor
• Alert, normal respiratory pattern, tears present
• Capillary refill ≤2 sec, normal heart rate

**Moderate (6-9%):**
• Irritable/lethargic, dry mucous membranes, sunken eyes
• Decreased skin turgor, tachypnea, decreased tears
• Capillary refill 2-3 sec, tachycardia, oliguria (decreased wet diapers)

**Severe (≥10% - Medical Emergency):**
• Lethargic/unconscious, very dry mucous membranes, deeply sunken eyes
• Tenting skin (poor turgor), deep/rapid breathing (acidosis)
• Capillary refill >3 sec, marked tachycardia, hypotension, anuria
• Delayed capillary refill + abnormal skin turgor + abnormal respiratory pattern = 3 best clinical signs

**MANAGEMENT:**

**1. ORAL REHYDRATION THERAPY (ORT) - First-Line for Mild-Moderate!**

**WHO Oral Rehydration Solution (ORS):**
• Composition (per liter): Glucose 13.5g, Na+ 75mEq, K+ 20mEq, Cl- 65mEq, Citrate 10mEq, Osmolarity 245 mOsm/L
• Pedialyte, Enfalyte, WHO-ORS sachets
• Goal: Replace fluid deficit over 4 hours
  - Mild dehydration: 50mL/kg over 4h
  - Moderate dehydration: 100mL/kg over 4h
• Method: 5mL q1-2min (teaspoon/syringe) - small, frequent amounts prevent vomiting
  - If child vomits: Wait 5-10 min, resume at slower rate (1mL q2-5min)
• Continue breastfeeding during ORT!

**Fluids to AVOID:**
❌ Water alone (no electrolytes, risk of hyponatremia)
❌ Sports drinks (too much sugar, low Na - hyperosmolar, worsens diarrhea)
❌ Fruit juices, soda, Jell-O water (hyperosmolar)
❌ BRAT diet restriction (banana, rice, applesauce, toast) - outdated, restrictive
❌ Boiled milk (hyperosmolar, dangerous!)

**2. EARLY REFEEDING (ASAP - Within 4-6h of Rehydration!):**
• Continue breastfeeding! (most important)
• Formula-fed: Restart full-strength formula immediately after rehydration
• Older children: Complex carbohydrates (rice, wheat, bread, potatoes), lean meats, yogurt, fruits, vegetables
• Temporary lactose intolerance (rare, usually in severe rotavirus): Consider lactose-free formula for 1-2 weeks
• Avoid: Fatty foods, simple sugars (worsen osmotic diarrhea)

**3. IV FLUIDS (If Severe Dehydration or ORT Failure):**

**Initial Bolus (Shock/Hypoperfusion):**
• Normal Saline or Ringer's Lactate: 20mL/kg IV bolus over 5-10 min
• Reassess after each bolus, repeat PRN (up to 60mL/kg in first hour if needed)

**Maintenance + Deficit Replacement:**
• Calculate: Maintenance + ½ deficit over 8h + ½ deficit over 16h
• Isotonic solution: D5½NS + 20mEq/L KCl (once UOP confirmed)
• Monitor: Strict I/O, daily weights, electrolytes q6-12h

**4. ADJUNCTIVE THERAPIES:**

**Zinc Supplementation (WHO Recommendation):**
• <6 months: 10mg PO daily ×10-14 days
• ≥6 months: 20mg PO daily ×10-14 days
• Benefit: Reduces stool volume, duration of diarrhea by 20-30%, prevents recurrence

**Probiotics (Limited Evidence - Consider):**
• Lactobacillus rhamnosus GG (Culturelle): 10-20 billion CFU daily ×5-7 days
• Saccharomyces boulardii (Florastor): 250-500mg BID ×5-7 days
• Evidence: Modest reduction in diarrhea duration (~1 day), most effective if given early
• ESPGHAN: Weak recommendation for select strains

**Ondansetron (Zofran) - For Persistent Vomiting:**
• Dose: 0.15mg/kg PO/IV (max 8mg) single dose
• Evidence: Reduces vomiting, reduces need for IV fluids, reduces hospitalization
• NOT routine for all gastroenteritis (only if vomiting impeding ORT)
• Side effect: Diarrhea (may increase - warn parents!)

**ANTIDIARRHEALS (AVOID IN CHILDREN!):**
❌ Loperamide (Imodium): Contraindicated in children <3 years (risk of ileus, toxic megacolon, death)
❌ Bismuth subsalicylate (Pepto-Bismol): Contains salicylate - risk of Reye syndrome
❌ Kaolin-pectin: Not recommended (no proven benefit)

**ANTIBIOTICS (Only for Specific Indications):**
• Dysentery (bloody diarrhea + fever): Azithromycin 10mg/kg PO daily ×3 days (or Ceftriaxone IV)
  - Shigella is most common bacterial cause of dysentery in children
• Salmonella: NOT treated in uncomplicated gastroenteritis (prolongs carrier state!)
  - Treat if: Age <3 months, immunocompromised, bacteremia, typhoid fever
• C. difficile: Metronidazole 30mg/kg/day PO divided QID ×10 days (or Vancomycin PO)
• Giardia: Metronidazole 15mg/kg/day PO divided TID ×5-7 days (or Tinidazole single dose)
• Campylobacter: Azithromycin 10mg/kg/day ×3 days (if severe/dysenteric)

**PARENT EDUCATION:**
• Natural course: Diarrhea 5-7 days, vomiting 1-3 days
• Warning signs: Blood in stool, severe abdominal pain, high fever >39°C, dehydration despite ORT, altered mental status
• Strict handwashing, isolate at home (norovirus highly contagious!)
• Do NOT send to daycare/school until: Diarrhea resolved ×24h, no vomiting ×48h

**HOSPITALIZATION CRITERIA (Consider Admission if):**
• Severe dehydration (>9%)
• Shock, altered mental status
• ORT failure (persistent vomiting despite slow administration of ORS)
• Unable to tolerate PO (surgical abdomen, altered consciousness)
• Significant electrolyte abnormalities (Na <130 or >150, K <3)
• Caregiver unable to manage ORT at home
• High-risk: Age <3 months, significant comorbidities, immunocompromised

**PROGNOSIS:**
• Self-limited (viral: 3-7 days)
• Rotavirus severe in unvaccinated infants (peak age 6-24 months)
• Post-gastroenteritis: Temporary lactose intolerance (1-2 weeks), weight loss (regain within 1-2 weeks)`,

  // ==================== INTERMEDIATE ====================
  'meningitis': `🧠 **PEDIATRIC MENINGITIS (IDSA/AAP Guidelines / Nelson Textbook)**

**EMERGENCY! Suspected meningitis = Immediate workup + empiric antibiotics within 30 minutes!**

**ETIOLOGY BY AGE:**

**Neonates (0-28 days):**
• Group B Streptococcus (GBS) - most common
• E. coli (especially K1 strain)
• Listeria monocytogenes
• Gram-negative enteric rods

**Infants/Children (1 month - 23 months):**
• Streptococcus pneumoniae (most common bacterial cause in all ages post-neonatal)
• Neisseria meningitidis (meningococcus)
• Group B Streptococcus
• Haemophilus influenzae type B (Hib) - rare with vaccination

**Children (2-18 years):**
• N. meningitidis (adolescents/college students)
• S. pneumoniae
• Hib - rare

**CLINICAL PRESENTATION - AGE-SPECIFIC:**

**Neonates/Young Infants:**
• Nonspecific! Fever OR hypothermia, poor feeding, lethargy/irritability, vomiting
• Bulging fontanelle (late sign), high-pitched cry, hypotonia
• Seizures, jaundice, respiratory distress, apnea
• Classic meningeal signs (neck stiffness, Kernig, Brudzinski) often ABSENT

**Older Infants/Children:**
• Fever, headache, vomiting, photophobia
• Neck stiffness, altered mental status
• Kernig sign: Pain/resistance with knee extension when hip flexed
• Brudzinski sign: Involuntary hip flexion when neck flexed
• Seizures (20-30%)
• Petechial/purpuric rash (meningococcus - think N. meningitidis!)

**DIAGNOSIS:**

**Lumbar Puncture (LP) - Gold Standard:**
• Indicated: ALL suspected meningitis unless contraindicated
• Contraindications: 
  - Cardiorespiratory instability
  - Signs of increased ICP (papilledema, Cushing triad, focal neurologic signs, coma)
  - Infection at LP site
  - Coagulopathy/thrombocytopenia (<50K)
  - Seizure within 30 min (not absolute)
• CT before LP if: Focal neurologic deficit, papilledema, GCS <10, seizure within 30 min, immunocompromised
  - **DO NOT DELAY ANTIBIOTICS for CT/LP!** Give steroids + antibiotics FIRST

**CSF Analysis (Normal Values - Neonates vs Children):**
• WBC: Neonates <30, Children <5-10 (lymphocyte predominant)
  - Bacterial: Neutrophilic pleocytosis (WBC >1000, >80% PMNs)
  - Viral: Lymphocytic pleocytosis (WBC <500, mostly lymphocytes)
• Protein: Neonates <150, Children <40 mg/dL (Bacterial: markedly elevated >100-500)
• Glucose: 50-80% of serum glucose (Bacterial: Low <40 or ratio <0.4)
• Gram stain: Positive in 60-90% bacterial meningitis (if no prior antibiotics)
• Culture: Definitive diagnosis, susceptibility testing
• PCR: Rapid detection of N. meningitidis, S. pneumoniae, Hib, HSV, enterovirus

**Blood Tests:**
• CBC with differential, CRP, Procalcitonin (PCT >2 strongly suggests bacterial)
• Blood cultures (positive in 50-75% bacterial meningitis)
• Electrolytes (SIADH common), coagulation profile
• HSV PCR (if suspected encephalitis - neonates, temporal lobe findings)

**TREATMENT (Empiric - Start Within 30 Minutes!):**

**DEXAMETHASONE (Before or With First Dose of Antibiotics!):**
• 0.15mg/kg IV q6h ×4 days (if <6 weeks)
• MUST give 15-30 min BEFORE antibiotics (reduces subarachnoid inflammation)
• Reduces mortality and hearing loss in Hib meningitis (controversial in pneumococcal)
• Continue only if: CSF Gram stain/culture shows Hib or S. pneumoniae
• Stop if: Other pathogen or no bacterial etiology identified

**EMPIRIC ANTIBIOTICS:**

**Neonates (0-28 days):**
• Ampicillin 100mg/kg IV q8h (covers GBS, Listeria)
  - PLUS Cefotaxime 50mg/kg IV q8h (or Gentamicin 4mg/kg IV daily)
  - Cefotaxime preferred over Ceftriaxone in neonates (displaces bilirubin - risk of kernicterus)
• ADD Acyclovir 20mg/kg IV q8h (if risk factors for HSV: maternal HSV, vesicular rash, temporal lobe on CT, seizures)

**Infants >28 days / Children:**
• Ceftriaxone 100mg/kg/day IV divided q12-24h (max 4g/day)
  - OR Cefotaxime 200mg/kg/day IV divided q6-8h (max 12g/day)
• PLUS Vancomycin 15-20mg/kg IV q6-8h (covers resistant S. pneumoniae until susceptibilities)
  - Adjust for renal function, target trough 15-20 mcg/mL

**ADD if Risk Factors:**
• Listeria (neonates, elderly, immunocompromised, pregnant): ADD Ampicillin
• Gram-negative rods (neonates, neurosurgery, post-neurosurgery, elderly): ADD Ceftazidime or Cefepime
• HSV encephalitis suspected: ADD Acyclovir

**PATHOGEN-DIRECTED (Once Cultures + Susceptibilities Available):**

**S. pneumoniae:**
• Penicillin MIC <0.06: Penicillin G 300,000-400,000 U/kg/day IV divided q4-6h ×10-14 days
• Penicillin MIC ≥0.12: Ceftriaxone or Cefotaxime (if susceptible)
• Penicillin + Ceftriaxone resistant: Vancomycin + Ceftriaxone/Cefotaxime
• Duration: 10-14 days

**N. meningitidis:**
• Penicillin G or Ceftriaxone ×7 days (ceftriaxone eradicates carrier state)
• Chemoprophylaxis (close contacts!): Rifampin 10mg/kg PO BID ×2 days (<1 month: 5mg/kg)
  - Alternatives: Ciprofloxacin 500mg PO single dose (adults), Ceftriaxone 125-250mg IM single dose
  - All household contacts, daycare contacts, anyone exposed to oral secretions

**Hib:**
• Ceftriaxone or Cefotaxime ×7-10 days
• Rifampin prophylaxis (household contacts if unvaccinated child <4 years)
  - Rifampin 20mg/kg PO daily ×4 days (max 600mg)

**GBS:**
• Penicillin G ×14-21 days (or Ampicillin)
• PLUS Gentamicin for synergy (first 5-7 days)

**Gram-negative rods:**
• Ceftazidime, Cefepime, or Meropenem ×21 days (based on susceptibilities)

**HSV Encephalitis:**
• Acyclovir 20mg/kg IV q8h ×21 days (neonates: 14-21 days)
• Repeat LP at 21 days to confirm HSV PCR negative (if still positive, continue Acyclovir)
• Long-term oral suppression: Acyclovir 300mg/m²/dose PO TID ×6 months (reduces developmental delay)

**SUPPORTIVE CARE:**

**Fluid Management:**
• Risk of SIADH (hyponatremia + fluid overload = cerebral edema)
• Initial: Maintenance at 60-70% + monitor Na+ q6-12h
• Isotonic fluids: Normal Saline or Ringer's Lactate
• Treat shock: 20mL/kg NS boluses (restore perfusion first - cerebral perfusion critical!)

**ICP Management:**
• Head midline, HOB 30°
• Mannitol 0.5g/kg IV or Hypertonic saline 3% 3-5mL/kg (if signs of herniation)
• Hyperventilation: Only as temporizing measure (target PaCO₂ 30-35, NOT <30 - risk of ischemia)
• Neurosurgery consult for ICP monitor

**Seizures:**
• Lorazepam 0.1mg/kg IV (max 4mg) for active seizure
• Phenobarbital 20mg/kg IV load (neonates)
• Phenytoin/Fosphenytoin 20mg/kg IV (older children)
• EEG monitoring (subclinical seizures common in meningitis)

**COMPLICATIONS (Monitor for):**
• Subdural empyema/effusion (persistent fever, focal signs, increasing head circumference in infants)
• Brain abscess, ventriculitis
• Hydrocephalus (communicating - CSF absorption impaired)
• Hearing loss: BAER (Brainstem Auditory Evoked Response) before discharge (all bacterial meningitis!)
• Neurodevelopmental delay, seizures, cognitive impairment
• SIADH, DIC

**PROPHYLAXIS (Household Contacts):**
• N. meningitidis: Rifampin or Ciprofloxacin or Ceftriaxone (all close contacts)
• Hib: Rifampin (if unvaccinated child <4 in household)

**ISOLATION:**
• Droplet precautions ×24h after appropriate antibiotics started
• N. meningitidis, Hib (until 24h antibiotics)

**DISPOSITION:**
• ALL suspected meningitis: Emergency department → Admit
• Bacterial meningitis: PICU
• Viral meningitis: PICU or floor (depending on severity)
• LP performed, awaiting results: Admit for observation + empiric treatment`,

  'asthma exacerbation': `👶 **PEDIATRIC ASTHMA EXACERBATION (GINA 2024 / AAP Guidelines)**

**SEVERITY ASSESSMENT (Pediatric Asthma Score - PAS):**
• Based on: RR, SpO₂, Wheezing, Retractions, Dyspnea
• **Mild:** PAS <7, SpO₂ >95%, speaks in sentences, expiratory wheeze only
• **Moderate:** PAS 7-11, SpO₂ 90-95%, speaks in phrases, expiratory + inspiratory wheeze, retractions
• **Severe:** PAS ≥12, SpO₂ <90%, speaks single words, severe retractions, nasal flaring
• **Life-threatening:** Silent chest, cyanosis, altered mental status, SpO₂ <88%, PaCO₂ rising

**IMMEDIATE MANAGEMENT:**

**OXYGEN (Target SpO₂ 94-98%):**
• Nasal cannula or face mask
• Titrate to SpO₂ >93%

**BRONCHODILATORS (First-Line - Give Within 10 Minutes!):**

**Albuterol (Salbutamol) - MDI with Spacer vs Nebulizer:**
• MDI with Spacer: 4-12 puffs q20min ×3 doses (equally or MORE effective than nebulizer)
  - Technique: Shake → spray 1 puff → inhale 5-10 breaths (with spacer) → repeat
  - Dose by severity: Mild 4 puffs, Moderate 6-8 puffs, Severe 10-12 puffs
• Nebulizer: 2.5-5mg in 3mL NS q20min ×3 doses (continuous if severe)
  - Weight <20kg: 2.5mg
  - Weight ≥20kg: 5mg

**Ipratropium Bromide (Atrovent) - Add in Severe Exacerbations:**
• MDI: 4-8 puffs q20min ×3 doses (combine with albuterol)
• Nebulizer: 250-500mcg q20min ×3 doses (only for first hour)
• Benefit: Reduces hospitalization by 25% in severe asthma (especially in ED setting)

**SYSTEMIC CORTICOSTEROIDS (Give Within 1 Hour!):**

**Oral (Preferred - Equally Effective as IV):**
• Prednisolone/Prednisone: 1-2mg/kg PO daily (max 60mg) ×3-5 days
  - No taper needed for short course
• Dexamethasone: 0.6mg/kg PO/IM daily ×1-2 days (longer half-life)
  - Equivalent efficacy to prednisone 5-day course (single dose for mild, 2 doses for moderate)
  - More palatable, less vomiting

**IV (If Unable to Tolerate PO or Severe):**
• Methylprednisolone: 1-2mg/kg IV q6h (max 60mg/dose)
• Continue until tolerating PO, then switch

**MAGNESIUM SULFATE (If Severe or Life-Threatening):**
• 25-75mg/kg IV over 20 min (max 2g)
• Evidence: Reduces hospitalization in severe asthma (meta-analysis)
• Monitor: BP (hypotension), respiratory rate (rare respiratory depression), reflexes
• Calcium gluconate available at bedside (reversal if toxicity)

**SECOND-LINE THERAPIES (Severe/Refractory - Consult PICU):**

**IV Beta-Agonists:**
• Terbutaline: 10mcg/kg IV bolus → 0.4mcg/kg/min infusion (titrate to response)
  - OR Albuterol IV (less evidence)
  - Cardiac monitoring mandatory (tachycardia, arrhythmias)
  - Check CK, lactate (skeletal muscle toxicity)

**IV Aminophylline/Theophylline:**
• Rarely used now (narrow therapeutic index, high side effect profile)
• Load: 5-7mg/kg IV over 20-30 min → 1mg/kg/hr infusion
• Monitor: Serum levels (target 10-20 mcg/mL), cardiac arrhythmias, seizures

**Heliox (Helium-Oxygen 70:30 or 80:20):**
• Reduces airway resistance (lower gas density)
• Only effective if FiO₂ <40% (can't deliver high O₂)
• Limited evidence, resource-intensive

**NON-INVASIVE VENTILATION (BiPAP/CPAP):**
• Consider if: Moderate-severe distress, SpO₂ <90% despite O₂, rising PaCO₂
• Reduces work of breathing, buys time for medications to work
• Settings: IPAP 10-15, EPAP 5-8, FiO₂ titrated
• Caution: Young children may not tolerate, aspiration risk

**INTUBATION (Last Resort - High Mortality!):**
• Indications: Cardiorespiratory arrest, coma, severe hypoxia despite maximal therapy
• Anticipate: Hypotension (high intrathoracic pressure + sedatives), barotrauma (pneumothorax)
• Ventilation strategy:
  - Low tidal volumes: 6-8 mL/kg
  - Low respiratory rate: 8-12 (allow permissive hypercapnia)
  - Prolonged expiratory time: I:E ratio 1:3 to 1:5
  - Goal: Prevent dynamic hyperinflation (auto-PEEP)
• Ketamine: Ideal induction agent (bronchodilator properties)

**ASSESSING RESPONSE:**
• Serial PAS (Pediatric Asthma Score) q1-2h
• SpO₂ continuous
• PEFR if age ≥6: % predicted (mild >70%, moderate 50-70%, severe <50%)
• If no improvement after initial therapy: Escalate (MgSO₄, consider PICU)

**DISPOSITION:**

**Discharge Criteria:**
• PAS <5 sustained >60 min after last treatment
• SpO₂ >92% on room air
• PEFR >70% predicted
• Able to tolerate PO
• Reliable caregiver, access to medications, follow-up arranged

**Admission Criteria:**
• PAS ≥8 despite initial therapy
• SpO₂ <92% on room air
• PEFR <50% predicted
• Required MgSO₄ or second-line therapies
• High-risk: Previous PICU admission, multiple ED visits, poor adherence, psychosocial concerns
• Age <2 years (higher risk of deterioration)

**PICU Criteria:**
• Severe distress despite maximal ED therapy (2-3h)
• SpO₂ <90% on FiO₂ >50%
• Rising PaCO₂ or PaO₂ <60
• Altered mental status
• Required BiPAP or intubation
• Hypotension

**DISCHARGE MEDICATIONS:**
• Albuterol MDI with spacer: 2-4 puffs q4-6h PRN
• Prednisolone: Complete 3-5 day course
• Inhaled Corticosteroid (ICS): Start or optimize (Budesonide, Fluticasone, Beclomethasone)
  - ALL children with asthma exacerbation should be on ICS!
• Montelukast: Consider add-on (especially viral-induced asthma, allergic component)

**DISCHARGE EDUCATION:**
• Asthma Action Plan (written!) - Green/Yellow/Red zones
• MDI + Spacer technique demonstration (return demonstration by caregiver)
• Identify triggers, environmental control
• Follow-up: PCP 2-7 days, Pulmonologist/Allergist 1-4 weeks
• Annual influenza vaccine`,

};
