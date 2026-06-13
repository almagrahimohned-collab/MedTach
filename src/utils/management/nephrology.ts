// 🫘 Nephrology Management Hints
// References: KDIGO Guidelines 2024, Tintinalli 9th Ed, Medscape, Davidson's

export const NEPHROLOGY_HINTS: Record<string, string> = {
  
  // ==================== BEGINNER ====================
  'aki': `🫘 **ACUTE KIDNEY INJURY (KDIGO Guidelines 2024)**

**DEFINITION (KDIGO Criteria - Any ONE):**
• sCr increase ≥0.3 mg/dL within 48h
• sCr increase ≥1.5× baseline within 7 days
• Urine output <0.5 mL/kg/hr for ≥6h

**STAGING:**
• Stage 1: sCr 1.5-1.9× baseline OR UOP <0.5 mL/kg/h ×6-12h
• Stage 2: sCr 2.0-2.9× baseline OR UOP <0.5 mL/kg/h ×12-24h
• Stage 3: sCr ≥3× baseline OR sCr ≥4 mg/dL OR UOP <0.3 mL/kg/h ×24h OR anuria ×12h OR RRT initiated

**CLASSIFICATION BY CAUSE:**

**PRE-RENAL (55-60% - Most Common):**
• Hypovolemia: Dehydration, hemorrhage, diuretics, GI losses
• Hypotension: Sepsis, cardiogenic shock, cirrhosis (HRS)
• Renal hypoperfusion: CHF, renal artery stenosis, NSAIDs, ACEi/ARB
• BUN:Cr ratio >20:1, FENa <1%, low urine Na (<20), concentrated urine (SG >1.020)
• **Treat underlying cause:** Fluids (crystalloid 500mL-1L bolus), hold nephrotoxins, improve cardiac output

**INTRINSIC (35-40%):**
• ATN (Acute Tubular Necrosis): Prolonged pre-renal → ischemia, nephrotoxins, sepsis
• AIN (Acute Interstitial Nephritis): Drugs (NSAIDs, PCN, cephalosporins, PPIs), infection, autoimmune
• Glomerulonephritis: RPGN, lupus nephritis, anti-GBM, IgA, post-infectious
• Vascular: Renal artery/vein thrombosis, cholesterol emboli, TTP-HUS, malignant HTN
• BUN:Cr ratio <15:1, FENa >2%, muddy brown casts on UA

**POST-RENAL (5%):**
• Obstruction: BPH, stones, malignancy, neurogenic bladder, strictures
• Diagnose: Renal/bladder ultrasound (hydronephrosis)
• Relieve obstruction: Foley catheter, nephrostomy tube, stent

**INITIAL MANAGEMENT (All AKI Patients):**

1️⃣ **Identify and Treat Cause:**
• Thorough history + medication review (STOP nephrotoxins!)
• NSAIDs, ACEi/ARB, diuretics, aminoglycosides, vancomycin, IV contrast, amphotericin

2️⃣ **Optimize Volume Status:**
• Hypovolemic: IV crystalloid (NS or LR) bolus 500mL-1L, reassess
  - Avoid LR if K+ >5 (contains K+)
• Hypervolemic: Diuretics (Furosemide IV 40-80mg, may need infusion)
  - If oliguric despite diuretics: Consider RRT for volume removal

3️⃣ **Optimize Hemodynamics:**
• MAP target: ≥65 mmHg (higher if chronic HTN)
• Vasopressors: Norepinephrine first-line (no evidence that dopamine "renal dose" is beneficial)

4️⃣ **Manage Electrolytes:**
• Hyperkalemia (K+ >5.5): ECG changes? → Calcium gluconate 1g IV STAT
  - Shift K+: Insulin 10U IV + D50 1 amp, Albuterol 10-20mg nebulized, NaHCO₃ 1-2 amps (if acidotic)
  - Eliminate K+: Furosemide (if not anuric), Kayexalate/Sodium zirconium cyclosilicate, Hemodialysis
• Metabolic acidosis: NaHCO₃ if pH <7.2 and HCO₃ <15 (controversial - BICAR-ICU trial)
• Hyperphosphatemia: Phosphate binders with meals

5️⃣ **Nutrition:**
• Adequate calories: 25-35 kcal/kg/day
• Protein: 0.8-1.2 g/kg/day (non-catabolic), 1.5-2 g/kg/day (catabolic/on RRT)

6️⃣ **Avoid Nephrotoxins:**
• Contrast: Hold if possible, use low-osmolar/iso-osmolar, pre-hydrate
• Aminoglycosides: Use alternative if possible
• Vancomycin: Monitor trough (15-20), avoid concurrent nephrotoxins

7️⃣ **Medication Dosing:**
• Renally dose ALL medications based on CrCl (not just antibiotics!)
• Common culprits: Enoxaparin (accumulation → bleeding), morphine metabolites, gabapentin

**INDICATIONS FOR EMERGENT DIALYSIS (AEIOU):**
• **A**cidosis: Severe metabolic acidosis refractory to medical therapy (pH <7.1)
• **E**lectrolytes: Hyperkalemia >6.5 or ECG changes refractory to medical therapy
• **I**ntoxication: Toxic alcohols (methanol, ethylene glycol), lithium, salicylates, metformin (MALA)
• **O**verload: Volume overload with pulmonary edema refractory to diuretics
• **U**remia: Pericarditis, encephalopathy, bleeding (platelet dysfunction)

**RENAL REPLACEMENT THERAPY (RRT) OPTIONS:**
• Intermittent Hemodialysis (IHD): Stable patients, rapid correction
• Continuous RRT (CRRT): ICU, hemodynamically unstable (less hypotension)
• SLED (Sustained Low-Efficiency Dialysis): Hybrid - 6-12h sessions, between IHD and CRRT

**MONITORING:**
• Strict I/O, daily weights
• Electrolytes q6-12h initially
• Avoid hyperglycemia (renal gluconeogenesis impaired)
• Monitor for recovery: Increasing UOP, decreasing sCr

**PROGNOSIS:**
• Recovery: Usually begins within 7-21 days (ATN)
• Non-oliguric AKI: Better prognosis than oliguric
• Mortality: 20-50% (ICU), higher if requiring RRT
• Long-term: Increased CKD risk, need for follow-up nephrology

**DISPOSITION:**
• Stage 1, stable, cause identified/reversed: Can manage on floor/observation
• Stage 2-3: Admit, nephrology consult
• Refractory hyperkalemia, acidosis, volume overload: ICU for possible emergent dialysis`,

  // ==================== INTERMEDIATE ====================
  'nephrotic': `🫘 **NEPHROTIC SYNDROME (KDIGO Glomerulonephritis Guidelines 2021)**

**DIAGNOSTIC CRITERIA:**
• Proteinuria: >3.5g/24h (or spot UPCR >3500 mg/g)
• Hypoalbuminemia: Albumin <3.0 g/dL
• Edema: Peripheral, periorbital, ascites, pleural effusion
• Hyperlipidemia: Increased total cholesterol, LDL, triglycerides
• (Lipiduria: Oval fat bodies on UA)

**PRIMARY CAUSES:**

**Minimal Change Disease (MCD) - Most Common in Children:**
• Light microscopy: Normal, EM: Podocyte foot process effacement
• Associated: Hodgkin lymphoma, NSAIDs, lithium
• Treatment: Prednisone 1mg/kg/day (children respond in 2-4 weeks, adults 8 weeks)
  - Steroid-resistant: Cyclophosphamide, Cyclosporine, Tacrolimus, Rituximab
• Prognosis: Excellent, 90%+ complete remission

**Focal Segmental Glomerulosclerosis (FSGS) - Most Common in Black Adults:**
• Light microscopy: Segmental sclerosis in some glomeruli
• Primary (idiopathic) vs Secondary (HIV, obesity, reflux nephropathy, heroin, pamidronate)
• APOL1 gene mutation: Strong association in African Americans
• Treatment: Prednisone 1mg/kg/day ×4-16 weeks
  - Steroid-resistant: Calcineurin inhibitors (Cyclosporine, Tacrolimus) ×6 months
  - Refractory: Rituximab, plasma exchange (if recurrent post-transplant)
• Prognosis: 50% progress to ESRD in 5-10 years

**Membranous Nephropathy - Most Common in White Adults:**
• Light microscopy: Thickened GBM, IF: Granular IgG + C3, EM: Subepithelial deposits
• Anti-PLA2R antibodies: Positive in 70% (correlates with disease activity)
• Secondary causes: SLE, Hepatitis B/C, malignancy (colon, lung, prostate), drugs (NSAIDs, gold)
• Treatment: 
  - Low risk (proteinuria <4g/24h): Conservative (ACEi/ARB) ×6 months (30% spontaneous remission)
  - Moderate-high risk (>4g or declining GFR): Rituximab (first-line) OR Ponticelli protocol (alternating steroids + Cyclophosphamide)
• Prognosis: 30% spontaneous remission, 30% persistent proteinuria, 30% progress to ESRD

**GENERAL MANAGEMENT (All Nephrotic Patients):**

**1. PROTEINURIA REDUCTION:**
• ACEi/ARB: Ramipril 5-10mg or Losartan 50-100mg daily (titrate to max tolerated)
  - Reduces proteinuria 40-50%, slows CKD progression
  - Monitor K+ and sCr (acceptable 30% increase in sCr)
• SGLT2 inhibitors: Dapagliflozin 10mg (additional antiproteinuric effect - DAPA-CKD trial)
• Target proteinuria: <1g/24h

**2. EDEMA MANAGEMENT:**
• Sodium restriction: <2g/day (88 mmol)
• Fluid restriction: <1.5L/day if hyponatremic
• Diuretics: Furosemide 40-80mg PO BID (may need IV if gut edema)
  - Add Metolazone 2.5-5mg if refractory (sequential nephron blockade)
  - Target weight loss: 0.5-1 kg/day
• IV Albumin + Furosemide: Consider if severe, refractory edema with hypoalbuminemia <2
  - Albumin 25g IV over 2-4h + Furosemide IV mid-infusion and after

**3. THROMBOEMBOLISM PROPHYLAXIS:**
• High risk if: Albumin <2.5 (loss of antithrombin III), membranous nephropathy (highest risk)
• Prophylactic anticoagulation: Consider if albumin <2.0 + additional risk factors
• Warfarin (target INR 2-3) or LMWH (if acute clot)
• Treat DVT/PE/Renal vein thrombosis per standard guidelines

**4. HYPERLIPIDEMIA:**
• Statins: Atorvastatin 20-40mg daily (reduces cardiovascular risk)
• Resolves with remission of nephrotic syndrome

**5. INFECTION RISK:**
• Loss of immunoglobulins in urine → increased risk of encapsulated organisms (S. pneumoniae)
• Vaccinate: Pneumococcal (PPSV23 + PCV13), Influenza, Meningococcal
• Low threshold to treat infections

**6. DIETARY MODIFICATIONS:**
• Protein: 0.8-1g/kg/day (high protein diet increases proteinuria - no longer recommended!)
• Sodium: <2g/day
• Potassium: Restrict only if hyperkalemic or on ACEi/ARB
• Fluid: <1-1.5L/day if edema/hyponatremia

**MONITORING:**
• Urine: UPCR monthly initially, then q3-6 months
• Renal function: sCr, eGFR q1-3 months
• Albumin, lipids q3-6 months
• Anti-PLA2R (if membranous): q6-12 months (guides treatment response)
• BP, edema, medication side effects

**RENAL BIOPSY INDICATIONS:**
• Nephrotic syndrome in adults (unless classic MCD in child responding to steroids)
• Unexplained AKI
• Rapidly progressive glomerulonephritis
• Suspected secondary cause
• Steroid-resistant nephrotic syndrome

**DISPOSITION:**
• New diagnosis: Admit for workup + renal biopsy
• Mild-moderate edema: Outpatient nephrology management
• Severe edema/anuria: Admit for diuresis + monitoring
• Thrombotic complication: Admit for anticoagulation
• RPGN: Urgent nephrology consult + biopsy (days matter!)`,

};
