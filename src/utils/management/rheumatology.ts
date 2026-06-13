// 🦴 Rheumatology Management Hints
// References: ACR Guidelines 2023, EULAR Guidelines, Tintinalli 9th Ed, Medscape, Davidson's

export const RHEUMATOLOGY_HINTS: Record<string, string> = {
  
  // ==================== BEGINNER ====================
  'rheumatoid arthritis': `🦴 **RHEUMATOID ARTHRITIS (ACR Guidelines 2021 / EULAR 2022)**

**DIAGNOSIS (2010 ACR/EULAR Criteria - Score ≥6/10):**
• Joint involvement: 1 large (0), 2-10 large (1), 1-3 small (2), 4-10 small (3), >10 including small (5)
• Serology: RF negative + anti-CCP negative (0), low-positive RF or CCP (2), high-positive RF or CCP (3)
• Acute phase reactants: Normal CRP + ESR (0), Abnormal CRP or ESR (1)
• Duration: <6 weeks (0), ≥6 weeks (1)

**CLINICAL FEATURES:**
• Symmetric polyarthritis: MCP, PIP, wrist, MTP (spares DIP - unlike OA)
• Morning stiffness >30 min (improves with activity)
• Systemic: Fatigue, weight loss, low-grade fever
• Extra-articular: Rheumatoid nodules, interstitial lung disease, pericarditis, vasculitis, Sjögren syndrome, Felty syndrome
• Joint deformities (late, untreated): Ulnar deviation, swan-neck, boutonnière, Z-thumb

**LABORATORY:**
• Rheumatoid Factor (RF): Sensitivity 70-80%, specificity 80%
• Anti-CCP (anti-citrullinated peptide): Sensitivity 65-70%, specificity 95%+ (more specific!)
• Both positive = worst prognosis
• Elevated ESR/CRP (monitor disease activity)
• CBC: Anemia of chronic disease, thrombocytosis (active inflammation)

**IMAGING:**
• X-rays: Periarticular osteopenia → erosions → joint space narrowing → deformities
• Ultrasound/MRI: Detect synovitis, erosions earlier than X-ray

**TREATMENT (Treat-to-Target - Remission or Low Disease Activity):**

**PRINCIPLES:**
• START DMARDs within 3 months of diagnosis! (Early treatment = better outcomes)
• Window of opportunity: First 3-6 months critical for preventing irreversible damage
• Treat to target: q3-6 month assessments, escalate therapy if not at goal
• Combination therapy more effective than monotherapy

**STEP 1: csDMARDs (Conventional Synthetic DMARDs):**

**Methotrexate (MTX) - First-Line Anchor Drug:**
• Start: 7.5-15mg PO/SC weekly
• Titrate: Increase 2.5-5mg q4-8 weeks to 20-25mg weekly
• Onset: 4-8 weeks (full effect 3-6 months)
• Side effects: Nausea, hepatotoxicity, myelosuppression, pneumonitis (rare - cough + SOB!)
• MUST prescribe Folic Acid: 1mg PO daily (reduces toxicity without reducing efficacy)
• Contraindications: Pregnancy (teratogenic - stop 3 months before conception!), liver disease, CKD stage 4-5, alcohol use
• Monitoring: CBC, LFTs, Cr q2-4 weeks initially → q8-12 weeks once stable

**Alternative csDMARDs (If MTX contraindicated):**
• Leflunomide: 10-20mg PO daily (hepatotoxicity, diarrhea, teratogenic)
• Sulfasalazine: 500mg BID titrate to 1-1.5g BID (safe in pregnancy)
• Hydroxychloroquine: 200-400mg PO daily (retinal toxicity - annual eye exam after 5 years, safest DMARD)

**STEP 2: Add bDMARD or tsDMARD (If moderate-high disease activity despite MTX ×3 months):**

**TNF Inhibitors (bDMARDs - First choice):**
• Adalimumab (Humira): 40mg SC q2 weeks
• Etanercept (Enbrel): 50mg SC weekly
• Infliximab (Remicade): 3-5mg/kg IV at 0, 2, 6 weeks → q8 weeks
• Certolizumab (Cimzia): 400mg SC at 0, 2, 4 weeks → 200mg q2 weeks (safe in pregnancy - no placental transfer)
• Golimumab (Simponi): 50mg SC monthly
• Screen before starting: TB (PPD/IGRA), Hepatitis B/C, HIV
• Risks: Infection (TB reactivation!), lymphoma (rare), demyelinating disease, CHF exacerbation

**Non-TNF Biologics (If TNF inhibitor fails):**
• Abatacept (Orencia): T-cell co-stimulation blocker - IV monthly or SC weekly
• Tocilizumab (Actemra): IL-6 receptor blocker - IV q4 weeks or SC q2 weeks (watch for GI perforation!)
• Rituximab (Rituxan): Anti-CD20 - 1g IV ×2 doses (2 weeks apart) q6-12 months (if RF/CCP+)
• Sarilumab: IL-6 receptor blocker - SC q2 weeks

**JAK Inhibitors (tsDMARDs - Oral):**
• Tofacitinib (Xeljanz): 5mg PO BID or 11mg XR daily
• Baricitinib (Olumiant): 2-4mg PO daily
• Upadacitinib (Rinvoq): 15mg PO daily
• Black Box Warning: Increased risk of thrombosis, MACE, malignancy (FDA - use after TNF failure)
• Screen: TB, Hep B/C, lipids, CBC, LFTs
• Avoid in: DVT/PE history, age >65 + CV risk, malignancy

**STEP 3: Switch/Add (If still active disease):**
• Switch within same class or change mechanism of action
• Triple therapy: MTX + Sulfasalazine + Hydroxychloroquine (non-inferior to biologics in some trials)

**ADJUNCTIVE THERAPIES:**
• NSAIDs: Naproxen 500mg BID PRN (short-term, bridge therapy - NOT disease-modifying)
• Corticosteroids: Prednisone 5-10mg PO daily (bridge until DMARDs take effect, taper ASAP)
  - Low-dose (<7.5mg) may be needed long-term in some patients
  - IA injections: Triamcinolone for single joint flares
• Physical/Occupational therapy
• Vaccinations: Influenza, Pneumococcal, Shingles (Shingrix - NOT Zostavax live!), COVID-19
• Osteoporosis: Calcium 1200mg + Vitamin D 800IU + consider bisphosphonate (chronic steroids)

**PREGNANCY CONSIDERATIONS:**
• Safe: Hydroxychloroquine, Sulfasalazine, Prednisone <20mg, Certolizumab (TNF)
• Stop: MTX, Leflunomide, Mycophenolate (teratogenic - months before conception!)
• Disease typically improves in pregnancy (flares postpartum!)

**MONITORING (q3-6 months):**
• DAS28-CRP or CDAI/SDAI (disease activity scores)
• Labs: CBC, LFTs, Cr (depending on medications)
• Functional status: HAQ (Health Assessment Questionnaire)
• Radiographs: Hands/feet q1-2 years (or as needed)

**DISPOSITION:**
• New diagnosis, stable: Outpatient rheumatology referral
• Acute severe flare: Consider short admission for IV steroids + pain control
• Septic arthritis must be ruled out in any acute monoarticular flare!
• RA lung disease with hypoxia: Admit for workup + management`,

  // ==================== INTERMEDIATE ====================
  'sle': `🦋 **SYSTEMIC LUPUS ERYTHEMATOSUS (EULAR/ACR Guidelines 2023)**

**DIAGNOSIS (2019 EULAR/ACR Criteria - Score ≥10 with Positive ANA):**
• ANA ≥1:80 (entry criterion - must be present)
• Constitutional: Fever (2), Weight loss (1)
• Hematologic: Leukopenia <4K (3), Thrombocytopenia <100K (4), Hemolytic anemia (4)
• Mucocutaneous: Non-scarring alopecia (2), Oral ulcers (2), Malar rash (6), Subacute/discoid lupus (4)
• Arthritis: ≥2 joints (6)
• Serositis: Pleuritis (5), Pericarditis (6)
• Renal: Proteinuria >0.5g/24h (4), Class II/V LN on biopsy (8), Class III/IV LN on biopsy (10)
• Immunologic: Low C3/C4 (3), Anti-dsDNA (6), Anti-Sm (6)

**CLINICAL FEATURES (Multisystem - Great Imitator!):**
• Constitutional: Fatigue, fever, weight loss (90%)
• Musculoskeletal: Arthralgias/arthritis (90% - non-erosive, Jaccoud arthropathy)
• Skin: Malar rash (butterfly - spares nasolabial folds), photosensitivity, discoid lupus
• Renal: Lupus nephritis (50% - leading cause of mortality)
• Hematologic: Anemia, leukopenia, thrombocytopenia, APS (antiphospholipid syndrome)
• Neuropsychiatric: Cognitive dysfunction, headache, seizures, psychosis (19%)
• Cardiopulmonary: Pleuritis, pericarditis, Libman-Sacks endocarditis, pulmonary HTN
• Vascular: Raynaud phenomenon, vasculitis, thromboembolism (APS)

**LABORATORY MONITORING:**
• Disease activity: Anti-dsDNA (titer correlates with activity, especially nephritis), C3/C4 (low = active disease)
• Routine: CBC (leukopenia, anemia), Cr, UA (proteinuria, hematuria, RBC casts = nephritis)
• Specific antibodies: Anti-Sm (specific), Anti-Ro/SSA (neonatal lupus), Anti-La/SSB, Anti-RNP, aPL antibodies

**GENERAL MANAGEMENT (All SLE Patients):**

**1. SUN PROTECTION (Critical!):**
• Broad-spectrum sunscreen SPF 50+ daily
• Protective clothing, hats, sunglasses
• Avoid peak sun exposure (10am-4pm)
• UV light triggers flares in 70% of patients!

**2. HYDROXYCHLOROQUINE (ALL patients unless contraindicated!):**
• 200-400mg PO daily (weight-based: ≤5mg/kg actual body weight)
• Benefits: Reduces flares, organ damage, thrombosis, mortality, lipid profiles
• Retinal toxicity: Annual eye exam after 5 years (risk: dose, duration, CKD)
• Safe in pregnancy (reduces neonatal lupus risk!)

**3. CARDIOVASCULAR RISK REDUCTION:**
• SLE patients have 50× increased MI risk (chronic inflammation + steroids)
• Aggressive risk factor management: Statins, BP control, smoking cessation
• Aspirin 81mg: Consider if aPL positive

**4. VACCINATIONS:**
• Influenza annually, Pneumococcal (PPSV23 + PCV13), Shingrix (recombinant)
• Avoid live vaccines if on immunosuppression
• HPV vaccine (age-appropriate)

**5. OSTEOPOROSIS PREVENTION:**
• Calcium 1200mg + Vitamin D 800-1000IU daily
• DEXA scan at baseline + q1-2 years if on chronic steroids

**TREATMENT BY ORGAN SYSTEM:**

**MILD (Constitutional, skin, mild arthritis):**
• Hydroxychloroquine
• NSAIDs: Naproxen 500mg BID PRN (caution with renal disease)
• Low-dose steroids: Prednisone 5-10mg PO daily (short-term)
• Belimumab (Benlysta): Anti-BLyS - for skin/joint disease, steroid-sparing

**MODERATE (Serositis, significant arthritis, rash):**
• Prednisone 0.5mg/kg/day → taper over weeks
• DMARDs: Methotrexate 15-25mg weekly (arthritis), Azathioprine 2-3mg/kg/day (steroid-sparing)
• Mycophenolate mofetil (CellCept): 1-1.5g BID (skin, hematologic, renal)
• Calcineurin inhibitors: Tacrolimus (nephritis, skin), Voclosporin (LN)

**SEVERE (Nephritis, CNS, pneumonitis, hemolytic anemia, severe thrombocytopenia):**
• Pulse Methylprednisolone: 500-1000mg IV ×3 days → Prednisone 1mg/kg/day with taper
• Cyclophosphamide (CYC): IV 500mg q2 weeks ×6 doses (NIH protocol) or 500-1000mg/m² monthly ×6 (Euro-Lupus)
  - For: Lupus nephritis Class III/IV, CNS, alveolar hemorrhage
  - Side effects: Hemorrhagic cystitis (Mesna + hydration!), infection, malignancy, infertility, premature ovarian failure
  - Offer GnRH agonists (Leuprolide) for ovarian protection in young women
• Mycophenolate mofetil: 1.5g PO BID (equal efficacy to CYC for nephritis - ALMS trial, safer, no infertility)
• Rituximab: 1g IV ×2 doses (refractory nephritis, CNS, hemolytic anemia, thrombocytopenia)
• Belimumab: Add to standard therapy for nephritis (BLISS-LN trial)

**LUPUS NEPHRITIS (SPECIFIC MANAGEMENT):**

**Classification (ISN/RPS 2018):**
• Class I: Minimal mesangial (no treatment needed)
• Class II: Mesangial proliferative (low-dose steroids)
• Class III: Focal proliferative (<50% glomeruli) - aggressive treatment
• Class IV: Diffuse proliferative (≥50% glomeruli) - aggressive treatment
• Class V: Membranous (proteinuria >3.5g/24h - treat like III/IV)
• Class VI: Advanced sclerosing (>90% sclerotic - no immunosuppression, CKD management)

**Induction (First 6 months):**
• Mycophenolate mofetil 1.5g PO BID ×6 months (preferred over CYC - less toxicity)
  - OR Cyclophosphamide IV monthly ×6 doses (if severe/rapidly progressive)
• PLUS High-dose steroids: Pulse Methylprednisolone → Prednisone taper

**Maintenance (After induction, minimum 3 years):**
• Mycophenolate mofetil 0.75-1g BID
  - OR Azathioprine 2mg/kg/day
• Low-dose Prednisone <5-7.5mg daily (taper to minimum effective dose)
• Hydroxychloroquine (continues indefinitely)
• ACEi/ARB: If proteinuria >0.5g/24h

**Monitoring:**
• UA + UACR or 24h urine: q3 months initially, q6 months once stable
• Anti-dsDNA, C3/C4: q3-6 months
• Renal biopsy: If relapse, resistance to therapy, or change in pattern

**SPECIAL SITUATIONS:**

**Antiphospholipid Syndrome (APS) with SLE:**
• aPL antibodies + thrombosis or pregnancy morbidity
• Warfarin INR 2-3 (first VTE) or 3-4 (arterial thrombosis/recurrent VTE while on warfarin)
• Aspirin 81mg + prophylaxis: If aPL+ without history of thrombosis
• Catastrophic APS: Anticoagulation + high-dose steroids + plasma exchange + IVIG

**Pregnancy in SLE:**
• PLAN pregnancy when disease quiescent ×6 months
• Continue: Hydroxychloroquine, Azathioprine, Prednisone <20mg, Calcineurin inhibitors
• STOP: Mycophenolate, Cyclophosphamide, Methotrexate, ACEi/ARB (teratogenic)
• Monitor: Monthly SLE activity, anti-Ro/SSA if positive (risk of neonatal lupus - congenital heart block)
• Fetal echo: Weekly 16-26 weeks if anti-Ro/SSA positive
• APS: Lovenox therapeutic dose during pregnancy + postpartum

**DISPOSITION:**
• Mild-moderate flare, stable: Outpatient rheumatology
• Severe flare (nephritis, CNS, serositis): Admit for pulse steroids + workup
• Catastrophic APS, DAH (diffuse alveolar hemorrhage): ICU
• New diagnosis: Outpatient rheumatology with close follow-up`,

};
