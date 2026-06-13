// 🔪 Surgery Management Hints
// References: Tintinalli 9th Ed, Schwartz's Principles of Surgery 11th Ed, ATLS 10th Ed, Medscape

export const SURGERY_HINTS: Record<string, string> = {
  
  // ==================== BEGINNER ====================
  'cholecystitis': `🔪 **ACUTE CHOLECYSTITIS (Tokyo Guidelines 2018 / WSES 2023)**

**PATHOPHYSIOLOGY:**
• Gallstone obstruction of cystic duct → bile stasis → inflammation → infection
• Acalculous cholecystitis (5-10%): Critically ill patients (burns, TPN, sepsis, DM)

**CLINICAL FEATURES:**
• RUQ/epigastric pain (prolonged >4-6h, unlike biliary colic)
• Murphy sign: Arrest of inspiration on RUQ palpation (specific)
• Fever, nausea/vomiting, anorexia
• Jaundice suggests: CBD stone, Mirizzi syndrome, cholangitis

**DIAGNOSIS (Tokyo Guidelines - Need ONE local + ONE systemic):**

**Local Signs:**
• Murphy sign, RUQ mass/pain/tenderness

**Systemic Signs:**
• Fever, elevated WBC, elevated CRP

**Imaging (Confirmatory):**
• Ultrasound (First-line): Gallstones, wall thickening >4mm, pericholecystic fluid, sonographic Murphy sign
• CT if: Complications suspected (perforation, abscess), US inconclusive, or alternative diagnosis needed
• HIDA (Hepatobiliary Iminodiacetic Acid) scan: Non-visualization of gallbladder = acute cholecystitis (most sensitive)
  - Gold standard when diagnosis uncertain

**SEVERITY GRADING (Tokyo Guidelines):**
• Grade I (Mild): No organ dysfunction, mild inflammation
• Grade II (Moderate): WBC >18K, palpable RUQ mass, symptoms >72h, marked local inflammation
• Grade III (Severe): Organ dysfunction (CV, respiratory, renal, hepatic, neurologic)

**MANAGEMENT:**

**INITIAL (All Patients):**
• NPO, IV fluids (isotonic crystalloid)
• Analgesia: Ketorolac 15-30mg IV or Morphine 2-4mg IV
• Antiemetics: Ondansetron 4mg IV PRN
• Antibiotics (Grade II-III, or Grade I if signs of infection):

**Antibiotic Regimens (Cover Gram-negatives + Anaerobes):**
• Community-acquired, mild-moderate: Cefazolin 2g IV q8h ± Metronidazole 500mg IV q8h
  - OR Ceftriaxone 2g IV daily + Metronidazole 500mg IV q8h
• Severe or healthcare-associated: Piperacillin-Tazobactam 3.375g IV q6h
  - OR Meropenem 1g IV q8h (if penicillin allergic)
  - OR Ciprofloxacin 400mg IV q12h + Metronidazole 500mg IV q8h

**SURGICAL TIMING:**

**Early Laparoscopic Cholecystectomy (Preferred - Within 24-72h):**
• Grade I-II: Within 24-72h of admission (reduces length of stay, complications vs delayed)
• "Golden period": First 72h (before dense adhesions form)
• Conversion to open: 5-10% (higher if delayed >72h)
• Intraoperative cholangiogram (IOC): If CBD stone suspected (elevated LFTs, dilated CBD on US)

**Delayed Cholecystectomy (6-12 Weeks):**
• Grade III (severe) with organ dysfunction, unstable for surgery
• Pregnancy (2nd trimester preferred)
• Severe comorbidities requiring optimization
• Treat with antibiotics + percutaneous cholecystostomy tube if not improving

**Percutaneous Cholecystostomy (PC):**
• Indications: Grade III, critically ill, failed conservative management, high surgical risk
• Ultrasound-guided transhepatic drainage
• Bridge to interval cholecystectomy in 6-12 weeks
• Tube removal: After cholangiogram confirms cystic duct patency (4-6 weeks)

**COMPLICATIONS:**

**Gangrenous Cholecystitis:**
• Ischemic necrosis of gallbladder wall
• Higher conversion to open, morbidity, mortality
• Urgent cholecystectomy

**Perforated Cholecystitis:**
• Localized: Pericholecystic abscess (percutaneous drainage + antibiotics → interval cholecystectomy)
• Free perforation: Biliary peritonitis (emergency laparotomy + cholecystectomy + washout)

**Emphysematous Cholecystitis:**
• Gas in gallbladder wall (C. perfringens, E. coli)
• DM patients, more severe
• Urgent cholecystectomy + broad-spectrum antibiotics

**Mirizzi Syndrome:**
• CBD obstruction from extrinsic compression by impacted cystic duct/gallbladder neck stone
• Type I: No cholecystocholedochal fistula
• Type II-IV: Fistula present
• Treatment: Subtotal cholecystectomy (high risk of CBD injury with total)

**POST-OPERATIVE CARE:**
• Advance diet as tolerated (usually clears → regular within 24h)
• Early ambulation
• DVT prophylaxis: Early mobilization ± LMWH (high-risk patients)
• Discharge: 24-48h (laparoscopic), 3-5 days (open)
• Activity: No heavy lifting ×4-6 weeks

**DISPOSITION:**
• Grade I: Admit for early cholecystectomy (24-72h)
• Grade II: Admit, antibiotics, early cholecystectomy
• Grade III: ICU, stabilize, antibiotics, percutaneous drainage ± delayed cholecystectomy`,

  'hernia': `🔪 **HERNIA MANAGEMENT (EHS Guidelines / Tintinalli Ch 90)**

**TYPES:**
• Inguinal (75%): Indirect (congenital - lateral to epigastric vessels) vs Direct (acquired - medial)
• Femoral: Below inguinal ligament (highest risk of incarceration/strangulation!)
• Umbilical: Infants (usually close spontaneously by age 4-5) vs Adults (acquired - cirrhosis, ascites, obesity)
• Incisional/Ventral: Previous surgical incision
• Epigastric: Linea alba, above umbilicus
• Spigelian: Lateral to rectus sheath (rare, high incarceration risk)

**CLINICAL FEATURES:**
• Bulge/lump: Increases with Valsalva, standing, straining; reduces with recumbency or manual pressure
• Dull ache, dragging sensation (worse at end of day, prolonged standing)
• Incarceration: Non-reducible hernia (without strangulation) → pain, nausea, vomiting
• Strangulation (Surgical Emergency!): Incarcerated + vascular compromise → severe pain, tenderness, erythema, fever, leukocytosis, signs of bowel obstruction
  - If untreated: Bowel necrosis, perforation, peritonitis, sepsis (mortality 5-10%)

**MANAGEMENT BY TYPE:**

**1. REDUCIBLE INGUINAL HERNIA (Elective Repair):**

**Asymptomatic/Minimally Symptomatic:**
• Watchful waiting is safe (low risk of incarceration <1% per year for inguinal)
• No difference in pain, function, or complications vs surgery at 2-10 years
• Consider surgery if: Symptoms progress, patient preference

**Symptomatic:**
• Elective mesh repair (reduces recurrence)
• Laparoscopic (TEP/TAPP) vs Open (Lichtenstein):
  - Laparoscopic: Less post-op pain, faster return to work, equal recurrence rate
  - Open: Can be done under local anesthesia (elderly, high-risk for GA), faster procedure
  - Bilateral or recurrent: Laparoscopic preferred

**2. FEMORAL HERNIA:**
• Always repair! (High incarceration risk 20-30% at 2 years)
• Open (McVay/Cooper's ligament repair) or Laparoscopic

**3. UMBILICAL HERNIA:**
• Infants: Observe until age 4-5 (90% close spontaneously)
  - Refer for repair if: Persistent >1.5cm at age 4, symptomatic, cosmetic concern after age 5
• Adults: Elective mesh repair if symptomatic (high recurrence without mesh)

**4. INCISIONAL HERNIA:**
• Elective repair if symptomatic (mesh always - reduces recurrence from 40% to 10%)
• Component separation technique for large defects

**INCARCERATED HERNIA (ED Management):**
• Attempt reduction (if no signs of strangulation!):
  - Trendelenburg position (inguinal), sedation + analgesia
  - Gentle, sustained pressure over hernia
  - Ice pack to reduce swelling
  - Success rate: 70-80%
• Successful reduction: Admit for observation ×24h → elective repair during same admission or 4-6 weeks
• Failed reduction: Emergency surgery

**STRANGULATED HERNIA (Surgical Emergency - NO Reduction Attempts!):**
• Immediate surgical consult
• Pre-op: NPO, IVF, broad-spectrum antibiotics (Cefoxitin 2g IV or Piperacillin-Tazobactam), correct coagulopathy
• Surgery: Assess bowel viability, resect necrotic bowel + primary anastomosis, tissue repair (mesh contraindicated in contaminated field)
• Laparotomy if: Peritonitis, hemodynamic instability

**POST-OPERATIVE CARE:**
• Activity: Avoid heavy lifting ×4-6 weeks
• Scrotal support (scrotal edema common after inguinal repair)
• Ice packs to wound for 48h
• Complications: Seroma, hematoma, wound infection, chronic pain (5-10%), recurrence (1-3% with mesh, 5-10% without)
• Return to work: Sedentary 1-2 weeks, manual labor 4-6 weeks

**DISPOSITION:**
• Reducible, asymptomatic: Outpatient elective repair or observation
• Reducible, symptomatic: Elective repair
• Incarcerated reduced successfully: Admit, repair during admission
• Incarcerated not reducible: Emergency surgery
• Strangulated: Emergency surgery within hours!`,

  'abscess': `🔪 **SKIN AND SOFT TISSUE ABSCESS (IDSA Guidelines / Tintinalli)**

**DEFINITION:** Localized collection of pus in dermis/deeper tissues

**MICROBIOLOGY:**
• Staphylococcus aureus (most common - including MRSA)
• Streptococcus pyogenes (Group A Strep)
• Polymicrobial: Perineal, perianal, IVDU-associated
• Special sites: Eikenella (human bites), Pasteurella (animal bites), Anaerobes (perirectal)

**DIAGNOSIS (Clinical):**
• Tender, fluctuant, erythematous nodule/mass
• ± Surrounding cellulitis, purulent drainage, fever
• Pointing: Central pustule or area of thinning
• Ultrasound: If uncertain (cellulitis vs abscess) - anechoic/hypoechoic fluid collection
  - Helpful for: Deep abscesses, atypical locations, evaluating for drainable collection

**TREATMENT:**

**INCISION AND DRAINAGE (I&D) - Definitive Treatment for Fluctuant Abscesses:**

**Procedure:**
1. **Consent:** Scar, bleeding, infection, recurrence, pain
2. **Anesthesia:**
   - Local: Lidocaine 1% with epinephrine (field block - NOT directly into abscess cavity - acidic environment inactivates anesthetic)
   - Regional nerve block if large or sensitive area
   - Consider procedural sedation (children, large, sensitive location)
3. **Prep:** Chlorhexidine or povidone-iodine, sterile drapes
4. **Incision:**
   - Linear incision along skin tension lines (Langer lines)
   - #11 blade, full length of fluctuance
   - Adequate size for drainage (small incisions = premature closure = recurrence)
5. **Drainage:**
   - Gentle manual expression (no aggressive probing - risk of bacteremia)
   - Break up loculations with hemostat (closed) or gloved finger
   - Culture: Swab purulent material (aerobic + anaerobic, MRSA screen)
6. **Irrigation:**
   - Normal saline or sterile water, copious irrigation
   - 19G angiocath + 30-60mL syringe (generates adequate pressure)
7. **Packing (Controversial):**
   - Small abscess (<5cm), immunocompetent, accessible location: No packing needed (equal outcomes, less pain)
   - Large, deep, immunocompromised, or high-risk location: Pack with iodoform or plain gauze
   - Remove/replace packing at 24-48h, then wound care
8. **Dressing:** Loose gauze dressing, absorbent pad
9. **Wound care:** Saline irrigation BID, packing changes as needed, monitor for re-accumulation

**ANTIBIOTICS (NOT Routinely Needed After I&D for Simple Abscess!):**

**Indications for Antibiotics (IDSA 2014):**
• Failed I&D alone (progression or no improvement)
• Systemic symptoms: Fever >38°C, tachycardia, WBC >12K
• Extensive disease: Multiple abscesses, large >5cm, significant surrounding cellulitis
• High-risk: Immunocompromised, DM, elderly
• Special locations: Face (central triangle), hand, perineum, over joints
• MRSA risk factors: Prior MRSA, healthcare exposure, IVDU, incarceration, athletes, military

**Antibiotic Selection (If Indicated):**

**MRSA Coverage (Include ONE):**
• TMP-SMX (Bactrim) DS 1-2 tabs PO BID ×7-10 days
• Doxycycline 100mg PO BID ×7-10 days
• Clindamycin 300-450mg PO TID ×7-10 days (check local resistance patterns - inducible resistance common)

**PLUS Strep Coverage (Some agents cover both):**
• TMP-SMX and Doxycycline have variable strep coverage - consider adding:
  - Penicillin VK 500mg PO QID or Amoxicillin 500mg PO TID
  - OR Cephalexin 500mg PO QID
• Clindamycin covers both MRSA and Strep (if susceptible)

**IV Antibiotics (Severe, Admitted Patients):**
• Vancomycin 15-20mg/kg IV q8-12h (covers MRSA)
  - PLUS Piperacillin-Tazobactam 3.375g IV q6h (if polymicrobial, perineal)
  - OR PLUS Cefepime 2g IV q8h + Metronidazole 500mg IV q8h

**SPECIAL SITES:**

**Perirectal Abscess:**
• High risk of fistula-in-ano (30-50%)
• I&D + drain placement (often requires OR)
• Antibiotics: Cover Gram-negatives + Anaerobes (Piperacillin-Tazobactam or Cipro + Metronidazole)
• Follow-up: Colorectal surgery (evaluate for fistula)

**Peritonsillar Abscess (Quinsy):**
• Needle aspiration (ENT or experienced ED physician)
• OR I&D in OR
• Antibiotics: Amoxicillin-Clavulanate or Clindamycin
• Steroids: Dexamethasone 10mg IV (reduces pain, edema, trismus)
• Admit for: IV antibiotics, dehydration, airway concern

**Pilonidal Abscess:**
• I&D with packing (high recurrence)
• Definitive: Excision after infection resolved (weeks later)

**Hidradenitis Suppurativa:**
• Chronic, recurrent abscesses in intertriginous areas (axilla, groin)
• Acute: I&D (conservative - avoid wide excision acutely)
• Chronic: Dermatology referral, intralesional steroids, Adalimumab (biologic)

**FOLLOW-UP:**
• Recheck 24-48h for packing removal/replacement
• Wound healing: Secondary intention (usually 2-4 weeks)
• Recurrence: 10-30% (especially MRSA)
• If recurrent: Decolonization protocol (Mupirocin 2% nasal BID ×5 days + Chlorhexidine washes daily ×5-7 days)

**RED FLAGS (Return Precautions):**
• Spreading erythema/red streaks (lymphangitis)
• Fever, chills, systemic symptoms
• Worsening pain, purulent drainage
• No improvement in 48h

**DISPOSITION:**
• Simple, small, immunocompetent: Outpatient I&D ± oral antibiotics
• Large, deep, facial: Consider procedural sedation + observation
• Systemic symptoms, immunocompromised: Admit for IV antibiotics ± OR I&D
• Perirectal, peritonsillar: Often require OR drainage + admission`,

  // ==================== INTERMEDIATE ====================
  'bowel obstruction': `🔪 **SMALL BOWEL OBSTRUCTION (SBO) - EAST Guidelines / WSES 2023**

**ETIOLOGIES (Most to Least Common):**
• Adhesions (60%): Prior abdominal surgery
• Hernias (20%): Inguinal, femoral, ventral, internal
• Tumors (10%): Colon cancer, metastases, carcinomatosis
• Crohn disease (5%): Strictures, inflammation
• Other: Gallstone ileus, intussusception, volvulus, bezoar, foreign body

**CLINICAL FEATURES:**
• Crampy, colicky abdominal pain (q3-5 min initially → constant if ischemia)
• Nausea/vomiting (proximal SBO = early vomiting, distal SBO = late, feculent vomiting)
• Abdominal distension (more pronounced in distal obstruction)
• Obstipation (no stool or flatus) - late finding (gas distal to obstruction may pass initially)
• Hyperactive, high-pitched bowel sounds (early), absent (late with ischemia)

**PHYSICAL EXAM:**
• Vital signs: Tachycardia, hypotension = late (dehydration, sepsis)
• Abdominal: Tympany (percussion), surgical scars, hernias (check inguinal/femoral!)
• Signs of peritonitis: Guarding, rebound, rigidity (think ischemia or perforation!)
• Rectal exam: Empty rectum (obstipation), mass, blood

**DIAGNOSIS:**

**CT Abdomen/Pelvis with IV Contrast (Gold Standard):**
• Dilated small bowel loops >3cm
• Transition point: Where dilated bowel meets decompressed distal bowel
• Signs of ischemia: Thickened bowel wall, mesenteric edema, pneumatosis (gas in bowel wall), portal venous gas, free fluid, decreased/enhancing wall enhancement
• Closed loop obstruction: U-shaped loop, mesenteric vessel convergence

**Plain Abdominal X-Ray (Limited Role - 3-View Acute Abdomen Series):**
• Dilated small bowel (>3cm), air-fluid levels (specific but not sensitive)
• "String of pearls" sign: Small air bubbles trapped between valvulae conniventes
• May be normal in 20% of proven SBO!

**MANAGEMENT:**

**INITIAL (All Patients):**
1. **NPO** (nothing by mouth)
2. **NG tube:** Decompression (immediate relief, reduces aspiration risk)
   - Low intermittent suction
   - Monitor output
3. **IV Fluids:**
   - Isotonic crystalloid (NS or LR): 20mL/kg bolus, then maintenance + NG losses
   - Third-spacing significant in SBO! Expect large fluid deficits
   - Monitor: UOP >0.5 mL/kg/hr, HR, BP, BUN, lactate
4. **Electrolyte Monitoring and Replacement:**
   - Hypokalemia common (vomiting + NG losses + alkalosis)
   - Metabolic alkalosis (loss of gastric HCl) → paradoxical aciduria
5. **Pain Management:**
   - Morphine 2-4mg IV or Hydromorphone 0.5mg IV PRN
   - NPO + NG tube → no PO options
6. **Antiemetics:** Ondansetron 4mg IV q8h PRN

**NON-OPERATIVE MANAGEMENT (NOM) - Trial if NO signs of ischemia/perforation:**

**Criteria for NOM:**
• Partial SBO (some gas in colon on CT)
• No signs of ischemia, peritonitis, or strangulation
• Stable, improving clinically
• Known adhesion disease

**Protocol:**
1. **NG decompression** + serial abdominal exams q4-6h
2. **Water-soluble contrast challenge** (Gastrografin):
   - 50-100mL via NG tube, clamp ×4-8h
   - Abdominal X-ray at 4-8h and 24h
   - Contrast in colon = partial SBO, predicts successful NOM (90%+)
   - No contrast in colon at 24h = likely needs surgery
   - Gastrografin also therapeutic (osmotic effect reduces bowel wall edema, stimulates peristalsis)
3. **Monitor:** Clinical status, NG output, pain, resolution of obstipation
4. **Success:** 70-80% with adhesions resolve with NOM within 48-72h

**When NOM Fails (Operate if):**
• No clinical improvement after 48-72h
• Worsening pain, distension, NG output
• New peritoneal signs
• Increasing WBC, lactate, or tachycardia
• No contrast in colon at 24h

**SURGICAL MANAGEMENT (Indications):**

**Emergency Surgery (Within Hours):**
• Signs of strangulation/ischemia (peritonitis, lactate rising, free air, pneumatosis)
• Closed loop obstruction on CT
• Incarcerated hernia not reducible
• Volvulus (sigmoid or cecal)

**Urgent Surgery (During Admission After NOM Trial):**
• Complete SBO (no air in colon)
• Failed NOM (48-72h)
• High-grade obstruction on CT
• Recurrent SBO in same location

**Operative Approach:**
• Laparoscopic lysis of adhesions (preferred if feasible - less post-op adhesions)
• Laparotomy if: Dense adhesions, distended bowel (no working space), ischemia requiring resection
• Bowel resection: If ischemia/necrosis → resect + primary anastomosis
• Stoma: If hemodynamically unstable, peritoneal contamination, or malnutrition (damage control)

**SPECIAL ETIOLOGIES:**

**Gallstone Ileus (Elderly Women - Rigler Triad):**
• Pneumobilia + SBO + Ectopic gallstone (usually terminal ileum)
• Treatment: Enterolithotomy (remove stone) + cholecystectomy + fistula repair (staged vs simultaneous)
• Do NOT milk stone distally (causes mucosal injury) - enterotomy at stone location

**Crohn Disease Stricture:**
• Medical: Steroids (if inflammatory), anti-TNF (infliximab for fistulizing)
• Endoscopic balloon dilation (short, isolated strictures)
• Surgery: Stricturoplasty or resection (if medical + endoscopic fails)
• Minimize bowel resection (preserve length - risk of short bowel syndrome)

**SBO in Pregnancy:**
• Adhesions (post-appendectomy, C-section), volvulus (enlarged uterus displaces bowel)
• MRI without contrast (CT contraindicated 1st trimester, minimized radiation later)
• Consult OB, surgery, and MFM
• If surgery needed: 2nd trimester preferred (1st: miscarriage risk, 3rd: preterm labor)

**POST-OPERATIVE ILEUS (vs SBO - Important Distinction!):**
• Ileus: Diffuse dilation without transition point, occurs days 1-5 post-op
• SBO: Focal dilation with transition point, can occur weeks-years post-op
• Ileus management: Supportive (NPO, NG if vomiting, ambulation, time)

**COMPLICATIONS:**
• Aspiration pneumonia: NG decompression reduces risk
• Bowel ischemia/necrosis: 10% of SBO, mortality 20-30% if perforated
• Short bowel syndrome: If extensive resection (>200cm remaining) → TPN dependence
• Recurrence: 10-20% after surgical adhesiolysis

**DISPOSITION:**
• All SBO: Admit for NPO, NG, IVF, observation
• Partial + stable: Surgical floor, trial NOM
• Complete + stable: Surgical floor, NOM trial with close monitoring
• Signs of ischemia/peritonitis: Emergency surgery
• Critically ill/ICU: Sepsis, bowel necrosis, perforation`,

  'acute abdomen': `🔪 **ACUTE ABDOMEN / PERFORATED VISCUS (WSES Guidelines / Tintinalli)**

**DEFINITION:** Acute abdominal pain <7 days requiring urgent diagnosis ± surgery

**SURGICAL ABDOMEN - "Can't Miss" Diagnoses:**
• Perforated viscus (ulcer, diverticulitis, colon cancer, foreign body)
• Mesenteric ischemia (arterial embolism, venous thrombosis, NOMI)
• Bowel obstruction with strangulation
• Ruptured AAA (abdominal aortic aneurysm)
• Ruptured ectopic pregnancy
• Necrotizing pancreatitis with infection
• Toxic megacolon
• Abdominal compartment syndrome

**CLINICAL FEATURES OF PERFORATION:**

**History:**
• Sudden, severe abdominal pain ("worst pain of life")
• Pain generalized (peritonitis) → localized (walled-off abscess)
• Nausea, vomiting, obstipation
• History of PUD (perforated ulcer), diverticulosis, recent colonoscopy

**Physical Exam:**
• Patient lies still (movement worsens peritoneal pain) - unlike renal colic!
• Board-like rigidity (classic for free air, peritonitis)
• Rebound tenderness, guarding
• Absent bowel sounds (paralytic ileus)
• Fever, tachycardia, tachypnea, hypotension (late - sepsis)

**DIAGNOSIS:**

**CT Abdomen/Pelvis with IV + Oral Contrast (Gold Standard):**
• Free air (pneumoperitoneum) - most sensitive
• Extravasation of contrast (site of leak)
• Abscess, phlegmon, wall thickening, fat stranding
• Portal venous gas (bowel ischemia - high mortality)

**Upright CXR / Left Lateral Decubitus (Bedside - Rapid):**
• Free air under diaphragm (upright) or over liver (left lateral decubitus)
• As little as 1mL of free air detectable on properly exposed CXR
• Sensitivity: 75% for perforated ulcer, lower for other causes

**Labs:**
• WBC + differential (leukocytosis, left shift)
• Lactate (elevated → ischemia, sepsis, hypoperfusion)
• CMP, LFTs, lipase, coagulation profile, Type and screen (possible OR)

**MANAGEMENT:**

**INITIAL RESUSCITATION (Simultaneous with Workup):**

1. **ABCs:** O₂ to maintain SpO₂ >94%
2. **IV Access:** 2 large-bore IVs
3. **Fluid Resuscitation:**
   - Crystalloid: 1-2L bolus (reassess, may need 3-6L in 24h due to third-spacing)
   - Target: MAP >65, UOP >0.5mL/kg/hr, lactate clearance
   - Vasopressors if fluid-refractory: Norepinephrine first-line
4. **NPO + NG Tube:** Decompression (reduce ongoing contamination)
5. **Foley Catheter:** Strict I/O
6. **Analgesia:** Morphine 2-4mg IV or Hydromorphone 0.5-1mg IV (does NOT mask peritoneal signs - myth!)
7. **Antibiotics (Within 1 Hour of Recognition!):**
   • Community-acquired: Piperacillin-Tazobactam 3.375g IV q6h
     - OR Ceftriaxone 2g IV daily + Metronidazole 500mg IV q8h
   • Healthcare-associated or severe: Meropenem 1g IV q8h
     - OR Cefepime 2g IV q8h + Metronidazole 500mg IV q8h
   • Add Vancomycin if: MRSA risk factors, hemodynamic instability, known colonization
   • Add Fluconazole if: Immunocompromised, prolonged hospitalization, upper GI perforation

**SURGICAL MANAGEMENT:**

**Emergency Exploratory Laparotomy:**
• Indications: Free perforation with diffuse peritonitis, hemodynamic instability
• Goals: Source control (close perforation, resect pathology), peritoneal washout, drainage
• Damage control surgery if: Acidosis (pH <7.2), hypothermia (<34°C), coagulopathy → temporary closure, planned re-operation

**SPECIFIC PERFORATION MANAGEMENT:**

**Perforated Peptic Ulcer (DU > GU):**
• Graham patch repair (omental patch): Close perforation, cover with omental pedicle
• Biopsy: Gastric ulcer edge (rule out malignancy)
• H. pylori testing: At time of surgery or 4 weeks post-op (serology unreliable acutely)
• Post-op: High-dose PPI (Pantoprazole 80mg IV bolus → 8mg/hr ×72h)
• Definitive ulcer surgery (vagotomy + antrectomy/pyloroplasty): Rarely needed now (PPIs effective)

**Perforated Diverticulitis (Hinchey Classification):**
• Hinchey I: Pericolic abscess → Percutaneous drainage + antibiotics
• Hinchey II: Pelvic/intra-abdominal abscess → Percutaneous drainage + antibiotics
• Hinchey III: Purulent peritonitis → Laparoscopic lavage + drain (controversial) OR Hartmann procedure
• Hinchey IV: Feculent peritonitis → Hartmann procedure (sigmoid resection + end colostomy)

**Colon Cancer Perforation:**
• Resection of involved segment
• Hartmann procedure (no anastomosis in contaminated field + malignancy)
• Oncology staging + follow-up

**NON-OPERATIVE MANAGEMENT (Select Patients):**

**Criteria:**
• Contained perforation (walled-off on CT)
• No systemic sepsis
• Hemodynamically stable
• Close surgical monitoring available

**Protocol:**
• NPO + NG decompression
• IV antibiotics ×7-10 days
• Serial abdominal exams q4-6h
• Repeat CT if: Clinical deterioration, no improvement in 48-72h
• Water-soluble contrast study: Confirm sealed leak before advancing diet

**MONITORING:**
• Vital signs q2-4h, strict I/O
• Serial abdominal exams (same examiner preferred)
• Labs: CBC, lactate q6-12h (lactate clearance = improving perfusion)
• Early warning scores: MEWS, SOFA (qSOFA in ED)

**RED FLAGS (Need for Re-Operation):**
• Worsening peritonitis, abdominal compartment syndrome
• Persistent sepsis despite source control
• Anastomotic leak (fever, ileus, new peritoneal signs)
• Infected necrosis, abscess not amenable to percutaneous drainage

**COMPLICATIONS:**
• Sepsis/septic shock (mortality 20-40% for perforated viscus)
• Intra-abdominal abscess (10-20%)
• Wound dehiscence, surgical site infection
• Enterocutaneous fistula
• Adhesive SBO (months-years later)
• Incisional hernia

**DISPOSITION:**
• Diffuse peritonitis, free air, sepsis: Emergency laparotomy → ICU post-op
• Contained perforation, stable: ICU for close monitoring + IV antibiotics
• Abscess: IR drainage + antibiotics, surgical floor
• Rule out acute abdomen with surgical consult`,

};
