// 🦠 Infectious Disease Management Hints
// References: WHO Guidelines, IDSA Guidelines, Tintinalli 9th Ed, Medscape

export const INFECTIOUS_HINTS: Record<string, string> = {
  
  // ==================== BEGINNER ====================
  'malaria': `🦟 **MALARIA (WHO Guidelines 2023 / Tintinalli Ch 154)**

**SPECIES (5 Infect Humans):**
• P. falciparum: Most severe, drug-resistant, cerebral malaria, high mortality
• P. vivax: Relapsing (hypnozoites in liver), requires primaquine for radical cure
• P. ovale: Relapsing (hypnozoites), requires primaquine
• P. malariae: Chronic, nephrotic syndrome risk
• P. knowlesi: SE Asia, can be severe, mimics P. malariae on smear

**DIAGNOSIS (Gold Standard):**
• Thick smear: Screen for parasites (more sensitive - 10-20× more blood examined)
• Thin smear: Species identification + parasitemia % (guides treatment)
• Rapid Diagnostic Test (RDT): Detects HRP2 (P. falciparum specific) or pLDH (all species)
  - HRP2 can remain positive 2-3 weeks after treatment (not for follow-up)
• PCR: Most sensitive, speciation, limited availability

**SEVERE MALARIA CRITERIA (Any ONE - WHO):**
• Cerebral malaria: GCS <11 or seizures (rule out other causes)
• Parasitemia >5% (non-immune) or >10% (semi-immune)
• Severe anemia: Hb <7 g/dL (adults) or <5 g/dL (children)
• AKI: sCr >3 mg/dL or urine output <400mL/24h
• ARDS, shock, DIC, acidosis (pH <7.25, HCO₃ <15), hypoglycemia (<40 mg/dL)
• Hemoglobinuria (blackwater fever)
• Jaundice: Bilirubin >3 mg/dL with parasitemia >100K

**TREATMENT:**

**UNCOMPLICATED P. FALCIPARUM (Oral therapy):**

**Artemisinin-Based Combination Therapy (ACT) - First Line:**
• Artemether-Lumefantrine (Coartem): 80/480mg PO BID ×3 days (with fatty food for absorption)
  - Most widely used ACT globally
• Artesunate-Amodiaquine: 100/270mg PO daily ×3 days
• Dihydroartemisinin-Piperaquine: 40/320mg PO daily ×3 days
• Pyronaridine-Artesunate: 180/60mg PO daily ×3 days

**Alternatives (If ACT unavailable):**
• Atovaquone-Proguanil (Malarone): 250/100mg PO daily ×3 days
• Quinine 650mg PO TID ×7 days + Doxycycline 100mg PO BID ×7 days

**UNCOMPLICATED P. VIVAX/OVALE:**
• ACT (as above) ×3 days
• PLUS Primaquine 30mg PO daily ×14 days (for hypnozoite eradication - prevents relapse!)
  - MUST check G6PD before primaquine! (risk of hemolysis if deficient)
  - G6PD deficiency: Primaquine 45mg weekly ×8 weeks (or omit in severe deficiency)

**SEVERE MALARIA (IV Therapy - ICU):**

**First-Line: Artesunate IV (WHO Preferred):**
• 2.4mg/kg IV at 0h, 12h, 24h, then daily until tolerates PO
• Weight-based dosing, max 2.4g total dose
• Transition to ACT when clinically stable + tolerating PO
• Monitor: Delayed hemolysis (post-artesunate - 2-3 weeks after treatment!)
  - Check Hb weekly ×4 weeks after treatment

**Alternative: Quinidine IV (US if artesunate not available):**
• 10mg/kg IV over 1-2h → 0.02mg/kg/min continuous infusion
• Monitor: QT prolongation, hypotension, hypoglycemia
• Change to PO when tolerating

**SUPPORTIVE CARE (Severe Malaria):**
• Seizures: Lorazepam 2-4mg IV or Diazepam 5-10mg IV
• Hypoglycemia: D10W 1-2 amps, monitor glucose q2-4h (quinine/quinidine stimulate insulin!)
• AKI: Hemodialysis if indicated (renal failure common in severe malaria)
• ARDS: Lung-protective ventilation
• Anemia: Transfuse if Hb <7 (or <10 if hemodynamically unstable)
• Avoid corticosteroids for cerebral malaria (increased mortality in RCTs)

**CHEMOPROPHYLAXIS (Travelers):**
• Atovaquone-Proguanil: Start 1-2 days before, daily during, ×7 days after
• Doxycycline: Start 2 days before, daily during, ×28 days after
• Mefloquine: Start 2 weeks before, weekly during, ×4 weeks after (neuropsychiatric SE)
• Chloroquine: Only for areas with chloroquine-sensitive malaria (limited regions)

**COMPLICATIONS:**
• Cerebral malaria: Mortality 15-20% despite treatment
• Blackwater fever: Massive hemolysis, hemoglobinuria, AKI
• ARDS: Even after parasite clearance (immune-mediated)
• Post-artesunate delayed hemolysis: 2-3 weeks post-treatment

**DISPOSITION:**
• Uncomplicated, stable: Outpatient with close follow-up
• Uncomplicated + vomiting: Admit for IV antiemetics + PO anti-malarials
• Severe malaria: ICU admission mandatory
• P. falciparum in non-immune: Strongly consider admission (can deteriorate rapidly)`,

  // ==================== INTERMEDIATE ====================
  'hiv': `🦠 **HIV/AIDS MANAGEMENT (DHHS Guidelines 2024 / IAS-USA)**

**DIAGNOSIS (CDC Algorithm):**
• 4th generation Ag/Ab test: Detects p24 antigen + HIV-1/2 antibodies
  - Positive within 2-4 weeks of infection
• Confirm with HIV-1/HIV-2 differentiation assay
• If indeterminate: HIV-1 NAT (nucleic acid test) for acute infection
• Window period: 4th gen test detects 95% by 4 weeks, >99% by 6 weeks

**BASELINE EVALUATION (New Diagnosis):**
• CD4 count + % (immune status)
• HIV viral load (HIV RNA)
• HIV genotype (resistance testing - BEFORE starting treatment!)
• HLA-B*5701: If considering Abacavir (hypersensitivity risk if positive)
• Co-receptor tropism: If considering Maraviroc
• Hepatitis A/B/C serology, TB screening (IGRA or PPD)
• STI screening: Syphilis (RPR/VDRL), Gonorrhea/Chlamydia (NAAT)
• PAP smear (anal if indicated), Pregnancy test
• Baseline labs: CBC, CMP, LFTs, fasting lipids, UA, UACR

**ANTIRETROVIRAL THERAPY (ART):**
**START ART IMMEDIATELY UPON DIAGNOSIS (All patients, regardless of CD4!)**
• START and INSIGHT trials: Early ART reduces morbidity/mortality
• Exception: Cryptococcal meningitis (delay ART 2-4 weeks - risk of IRIS)

**FIRST-LINE REGIMENS (DHHS 2024 - Choose ONE from each category):**

**Backbone (2 NRTIs):**
• Tenofovir AF (TAF) 25mg + Emtricitabine (FTC) 200mg (Descovy) - Preferred
  - Better bone and renal safety than TDF
• Tenofovir DF (TDF) 300mg + FTC 200mg (Truvada)
  - Avoid if: CKD, osteoporosis (monitor Cr + urine dipstick q3-6 months)
• Abacavir 600mg + Lamivudine 300mg (Epzicom)
  - Only if HLA-B*5701 NEGATIVE (hypersensitivity reaction risk)

**Third Agent (Choose ONE):**
• Dolutegravir 50mg (Integrase inhibitor - Preferred):
  - Triumeq = Abacavir/Lamivudine/Dolutegravir (single pill)
  - Dovato = Lamivudine/Dolutegravir (2-drug regimen - select patients)
• Bictegravir 50mg (co-formulated with TAF/FTC = Biktarvy - single pill, most prescribed)
• Raltegravir 400mg BID or 1200mg (2×600mg) daily
• Elvitegravir/Cobicistat (co-formulated with TAF/FTC = Genvoya)
• Darunavir/Ritonavir or Darunavir/Cobicistat (boosted PI - high barrier to resistance)
• Doravirine (NNRTI) - co-formulated with TDF/3TC = Delstrigo

**MONITORING ON ART:**
• Viral load: At 4-6 weeks, then q3-6 months once suppressed
  - Goal: <20-50 copies/mL (undetectable) by 24 weeks
  - U=U: Undetectable = Untransmittable (no risk of sexual transmission!)
• CD4: q3-6 months initially, q6-12 months once stable
  - Goal: >500 (normal immune function)
• CMP, LFTs, lipids: q3-6 months
• Urinalysis: q6 months if on TDF (tubular toxicity)
• Adherence counseling at EVERY visit

**OPPORTUNISTIC INFECTION (OI) PROPHYLAXIS:**

**CD4 <200: Pneumocystis jirovecii Pneumonia (PJP/PCP)**
• TMP-SMX (Bactrim) DS 1 tablet PO daily or TIW
• Alternative: Dapsone 100mg daily, Atovaquone 1500mg daily, Aerosolized pentamidine monthly

**CD4 <100 + Toxoplasma IgG+: Toxoplasmosis**
• TMP-SMX DS 1 tablet PO daily (also covers PCP)
• Alternative: Dapsone + Pyrimethamine + Leucovorin

**CD4 <50: MAC (Mycobacterium avium complex)**
• Azithromycin 1200mg PO weekly (or Clarithromycin 500mg PO BID)
• Stop when CD4 >100 ×3 months on ART

**TB SCREENING (ALL Patients at Diagnosis):**
• IGRA (QuantiFERON) or PPD ≥5mm = positive
• If positive: Rule out active TB (CXR + symptoms)
• Latent TB: Isoniazid 300mg + B6 50mg daily ×9 months OR Rifampin ×4 months
  - Rifampin interacts with many ARVs! (adjust ART accordingly)

**COMMON OIs - BRIEF MANAGEMENT:**

**PCP Pneumonia:**
• TMP-SMX 15-20mg/kg/day (TMP component) IV/PO ×21 days
• Prednisone 40mg BID ×5d → 40mg daily ×5d → 20mg daily ×11d (if PaO₂ <70 or A-a gradient >35)
• Prophylaxis after: TMP-SMX DS daily

**Cerebral Toxoplasmosis:**
• Pyrimethamine 200mg load → 50mg daily + Sulfadiazine 1g QID + Leucovorin 10-25mg daily ×6 weeks
• Steroids for mass effect: Dexamethasone 4mg q6h

**Cryptococcal Meningitis:**
• Induction: Amphotericin B 0.7-1mg/kg IV + Flucytosine 25mg/kg PO QID ×2 weeks
• Consolidation: Fluconazole 400-800mg daily ×8 weeks
• Maintenance: Fluconazole 200mg daily (until CD4 >100 + suppressed VL)
• Manage ICP: Serial LPs or lumbar drain (opening pressure >25 cmH₂O)
• Delay ART: 2-4 weeks after starting antifungals (prevent IRIS)

**CMV Retinitis:**
• Valganciclovir 900mg PO BID ×21 days (or Ganciclovir IV)
• Ophthalmology consult urgently
• Prophylaxis: Not routine (monitor for symptoms)

**PREVENTION:**

**Pre-Exposure Prophylaxis (PrEP) - High-Risk HIV-Negative:**
• Tenofovir DF/FTC (Truvada) 1 tablet PO daily
  - On-demand (2-1-1): 2 tabs 2-24h before sex, 1 tab 24h after, 1 tab 48h after (MSM only)
• Descovy (TAF/FTC): Only for MSM and transgender women (not studied in vaginal sex)
• Cabotegravir IM q2 months (long-acting injectable - highly effective)
• Monitor: HIV test q2-3 months, sCr q6 months, STI screening q3-6 months

**Post-Exposure Prophylaxis (PEP) - Start Within 72h:**
• TDF/FTC + Raltegravir 400mg BID OR Dolutegravir 50mg daily ×28 days
• Baseline: HIV test, pregnancy test, LFTs
• Follow-up: HIV test at 4-6 weeks and 3 months

**IMMUNIZATIONS:**
• Influenza annually, Pneumococcal (PPSV23 + PCV13), Tdap q10 years
• Hepatitis A + B (if not immune), HPV (age <26)
• Meningococcal (if risk factors), COVID-19
• AVOID live vaccines if CD4 <200: MMR, Varicella, Yellow fever, Intranasal influenza

**DISPOSITION:**
• New diagnosis, asymptomatic, CD4 >200: Outpatient ID clinic
• AIDS-defining illness, CD4 <50: Consider admission for workup + OI prophylaxis
• Active OI: Admit for treatment (especially PCP with hypoxia, cryptococcal meningitis, CMV retinitis)
• Poor adherence, social barriers: Case management + support services`,

};
