// 🩺 Dermatology Management Hints
// References: AAD Guidelines, BAD Guidelines, Tintinalli 9th Ed, Medscape, Davidson's

export const DERMATOLOGY_HINTS: Record<string, string> = {
  
  // ==================== BEGINNER ====================
  'eczema': `🧴 **ATOPIC DERMATITIS (ECZEMA) - AAD Guidelines 2023**

**CLINICAL FEATURES (Itch That Rashes - Not Rash That Itches!):**
• Intense pruritus (hallmark - worse at night)
• Chronic, relapsing course
• Age-specific distribution:
  - Infants: Face, scalp, extensor surfaces
  - Children: Flexural creases (antecubital, popliteal), neck, wrists
  - Adults: Flexural, face, hands, lichenification (thickened skin from chronic scratching)
• Associated: Atopic triad (asthma, allergic rhinitis, atopic dermatitis), food allergies, ichthyosis vulgaris

**SEVERITY ASSESSMENT:**
• Mild: Dry skin, infrequent itching, small areas
• Moderate: Frequent itching, larger areas, skin thickening
• Severe: Constant itching, widespread, sleep disturbance, secondary infection

**GENERAL SKIN CARE (Foundation - All Patients!):**

**1. HYDRATION AND MOISTURIZING (Most Important!):**
• Lukewarm baths/showers (5-10 min, not hot water)
• Gentle, fragrance-free cleansers (Cetaphil, CeraVe, Aveeno)
• Apply moisturizer within 3 minutes of bathing (soak-and-seal)
• Moisturizers: Creams/ointments > lotions (more occlusive)
  - Ceramides (CeraVe, Cetaphil Restoraderm) - repair skin barrier
  - Petrolatum (Vaseline) - most effective occlusive
• Frequency: 2-3× daily minimum

**2. AVOID TRIGGERS:**
• Irritants: Wool, synthetic fabrics, harsh soaps, fragrances
• Allergens: Dust mites, pollen, pet dander
• Temperature extremes, low humidity, sweating
• Stress (worsens itching)
• Food allergens: Only if confirmed (milk, egg, peanut in children)

**TREATMENT (Stepwise Approach):**

**MILD:**

**Topical Corticosteroids (First-Line):**
• Low potency: Hydrocortisone 1% OTC for face, groin, axilla (thin skin areas)
• Medium potency: Triamcinolone 0.1% for body
• Apply BID to affected areas (use fingertip unit - 1 FTU treats handprint-sized area)
• Duration: Until resolved, then stop (not continuous)
• Side effects: Skin atrophy, striae, telangiectasias with prolonged potent steroid use
• Avoid high-potency on face, groin, axilla!

**MODERATE:**

**Topical Calcineurin Inhibitors (TCIs - Steroid-Sparing):**
• Tacrolimus 0.03% (children) or 0.1% (adults) ointment BID
• Pimecrolimus 1% cream BID
• Advantages: No atrophy (safe for face, eyelids, folds), no tachyphylaxis
• Black Box Warning: Theoretical malignancy risk (no evidence in humans - FDA warning based on animal studies)
• Burning/stinging initially (improves with continued use)

**Topical PDE4 Inhibitor:**
• Crisaborole (Eucrisa) 2% ointment BID
  - Safe for age ≥3 months, no steroid side effects
  - Mild stinging initially

**Wet Wrap Therapy (For Severe Flares):**
• Apply steroid → damp layer → dry layer, leave overnight
• Intensive treatment, enhances steroid penetration

**SEVERE/REFRACTORY:**

**Phototherapy (NB-UVB):**
• Narrow band UVB 2-3×/week ×12-16 weeks
• Effective for chronic, widespread disease
• Risks: Premature aging, skin cancer (long-term)

**Systemic Immunosuppressants:**
• Cyclosporine: 3-5mg/kg/day (rapid response, short-term use only - nephrotoxicity, HTN)
• Methotrexate: 10-25mg weekly (slower onset, good for maintenance)
• Azathioprine: 2-3mg/kg/day (check TPMT before starting!)
• Mycophenolate mofetil: 1-1.5g BID (off-label, well-tolerated)

**Dupilumab (Dupixent) - Biologic - Game-Changer!**
• Anti-IL-4/IL-13 monoclonal antibody
• Dosing: 600mg SC loading → 300mg SC q2 weeks
• Efficacy: 70-80% achieve EASI-75 (75% improvement) at 16 weeks
• Side effects: Conjunctivitis (10-20% - treat with artificial tears, refer ophthalmology), injection site reactions
• No lab monitoring required!
• Approved for age ≥6 months

**Tralokinumab (Adbry):**
• Anti-IL-13 - similar efficacy to dupilumab, less conjunctivitis
• Alternative if dupilumab fails or conjunctivitis problematic

**JAK Inhibitors (Oral - for Refractory Disease):**
• Upadacitinib (Rinvoq): 15-30mg PO daily
• Abrocitinib (Cibinqo): 100-200mg PO daily
• Rapid itch relief (within days!)
• Black Box: Thrombosis, MACE, malignancy, infection

**ITCH MANAGEMENT:**
• Oral antihistamines: Hydroxyzine 25-50mg at bedtime (sedating = better for sleep)
  - Non-sedating (Cetirizine, Loratadine): Not effective for eczema itch (histamine is not primary mediator)
• Cool compresses, wet wraps
• Keep nails short, clean (reduce excoriation and infection risk)
• Cotton gloves at night for children

**SECONDARY INFECTION:**
• Staph aureus colonizes 90% of AD skin!
• Signs of infection: Honey-colored crusting, weeping, worsening despite treatment
• Culture: Swab for MRSA if recurrent or severe
• Treatment: Cephalexin 500mg PO QID ×7-10 days or Doxycycline 100mg PO BID
• Bleach baths: ½ cup household bleach in full bathtub (40 gallons) ×10 min, 2-3×/week
  - Reduces bacterial colonization and disease severity

**ECZEMA HERPETICUM (Emergency!):**
• Widespread HSV superinfection of eczema skin
• Punched-out erosions, vesicles, crusting, fever
• Treatment: Acyclovir IV (severe) or Valacyclovir PO (mild-moderate)
• Ophthalmic involvement: Emergency ophthalmology consult (can cause blindness!)

**FOLLOW-UP:**
• Mild: PCP management with as-needed dermatology referral
• Moderate-Severe: Dermatology q3-6 months
• On systemic therapy: Regular lab monitoring (drug-specific)
• Assess quality of life, sleep, mental health (anxiety/depression common)

**DISPOSITION:**
• Routine: Outpatient management
• Eczema herpeticum, severe secondary infection: Admit for IV antivirals/antibiotics
• Severe erythroderma: Admit for intensive topical treatment + systemic therapy initiation`,

  // ==================== INTERMEDIATE ====================
  'shingles': `🦠 **HERPES ZOSTER (SHINGLES) - CDC/IDSA Guidelines**

**PATHOPHYSIOLOGY:**
• Reactivation of latent VZV in dorsal root ganglia (after primary varicella/chickenpox)
• Lifetime risk: 30% (increases with age >50, immunocompromised)
• Contagious: Direct contact with vesicles (transmits varicella to non-immune, NOT zoster)

**CLINICAL FEATURES:**
• Prodrome: Pain, burning, itching, paresthesia in dermatomal distribution (2-3 days before rash)
• Rash: Maculopapular → vesicles → pustules → crusts (7-10 days, crust by 2-3 weeks)
• Distribution: Unilateral, dermatomal (does NOT cross midline)
• Common dermatomes: Thoracic (55%), Cervical (20%), Trigeminal (15% - V1 ophthalmic branch!)
• Pain: Sharp, burning, often severe (post-herpetic neuralgia risk increases with age)

**DIAGNOSIS (Usually Clinical):**
• PCR: Vesicular fluid or scab (most sensitive - confirm atypical cases)
• Direct fluorescent antibody (DFA): Rapid but less sensitive
• Tzanck smear: Multinucleated giant cells (historical - not specific for VZV vs HSV)

**TREATMENT (Start Within 72h of Rash Onset!):**

**ANTIVIRAL THERAPY (Reduces pain, duration, and PHN risk):**

**First-Line Oral (Immunocompetent):**
• Valacyclovir: 1g PO TID ×7 days (preferred - better bioavailability than acyclovir)
• Famciclovir: 500mg PO TID ×7 days
• Acyclovir: 800mg PO 5×/day ×7-10 days (less convenient dosing)

**IV Therapy (Indications):**
• Immunocompromised (regardless of severity)
• Disseminated zoster (>20 vesicles outside primary + adjacent dermatomes)
• Ophthalmic involvement (herpes zoster ophthalmicus - HZO)
• CNS involvement (encephalitis, meningitis, myelitis)
• Severe, unable to tolerate PO
• **Acyclovir IV:** 10mg/kg q8h (adjust for renal function) ×7-10 days
  - Transition to PO when clinically improving

**PAIN MANAGEMENT (Crucial - Prevent Post-Herpetic Neuralgia!):**

**Acute Pain:**
• NSAIDs: Ibuprofen 600-800mg PO TID or Naproxen 500mg BID
• Acetaminophen: 650-1000mg PO q6h (max 3g/day)
• Opioids: Oxycodone 5mg PO q4-6h PRN (severe pain - elderly often require opioids for zoster)
• Topical: Lidocaine 5% patch (apply to intact skin - not open vesicles)
• Calamine lotion: For itching

**Neuropathic Pain:**
• Gabapentin: Start 300mg at bedtime → titrate to 300-600mg TID (adjust for renal function)
• Pregabalin: 75-150mg BID
• Tricyclic antidepressants: Amitriptyline 25mg at bedtime (elderly: Nortriptyline preferred - fewer anticholinergic effects)
• All reduce PHN risk if started early!

**CORTICOSTEROIDS (Controversial - Not Routinely Recommended):**
• Prednisone 60mg PO daily ×10-14 day taper + antivirals
• Modest benefit: Faster healing, less acute pain
• No proven reduction in PHN incidence
• Consider only in: Severe pain, no contraindications (DM, HTN, infection)

**SPECIAL SYNDROMES:**

**HERPES ZOSTER OPHTHALMICUS (HZO) - V1 Dermatome (Emergency!):**

**Hutchinson Sign (Vesicles on Nose Tip):**
• Nasociliary branch of V1 → Strongly predicts ocular involvement
• **URGENT ophthalmology consult!**

**Ocular Manifestations:**
• Conjunctivitis, keratitis, episcleritis, scleritis
• Anterior uveitis (most common), acute retinal necrosis
• Can cause: Corneal scarring, glaucoma, vision loss, blindness

**Management:**
• IV Acyclovir (most guidelines) or high-dose PO Valacyclovir ×7-10 days
• Ophthalmic steroids (prednisolone acetate 1%) - prescribed by ophthalmology
• Cycloplegics (cyclopentolate) for pain if iritis
• Monitor intraocular pressure (steroid response glaucoma)
• Long-term: Chronic keratitis, neurotrophic keratopathy, post-herpetic neuralgia

**RAMSAY HUNT SYNDROME (Herpes Zoster Oticus) - CN VII + VIII:**
• Triad: Facial paralysis + ear pain + vesicles in ear canal/pinna
• Associated: Hearing loss, tinnitus, vertigo, altered taste (chorda tympani)
• Treatment: IV Acyclovir + Prednisone 60mg PO daily ×5 days (improves facial nerve recovery)
• Prognosis: Worse than Bell's palsy (only 50-60% complete recovery)
• ENT + Ophthalmology consult (eye closure = corneal exposure risk)

**DISSEMINATED ZOSTER:**
• >20 vesicles outside primary + adjacent dermatomes
• Visceral involvement: Pneumonitis, hepatitis, encephalitis (mortality 5-15%)
• Treatment: IV Acyclovir ×7-10 days
• Workup for immunodeficiency if no known cause

**POST-HERPETIC NEURALGIA (PHN):**
• Pain persisting >90 days after rash onset
• Risk factors: Age >50 (strongest predictor), severe acute pain, severe rash, ophthalmic involvement
• Affects 10-20% of all zoster patients, 50% of those >80 years

**PHN Treatment (Multimodal - Often Refractory):**
• Gabapentin/Pregabalin (first-line)
• Tricyclic antidepressants (Nortriptyline 25-75mg at bedtime)
• Lidocaine 5% patch (localized pain - very safe)
• Capsaicin 8% patch (Qutenza - single application lasts 3 months, requires clinic application)
• Opioids: Tramadol 50-100mg q6h (second-line), Oxycodone (refractory)
• Refer to pain management if refractory

**PREVENTION:**

**Shingrix (Recombinant Zoster Vaccine) - PREFERRED:**
• 2 doses IM, 2-6 months apart
• Efficacy: 97% in adults ≥50, 91% in ≥70 (even higher than Zostavax)
• Indicated: All adults ≥50 years (regardless of prior zoster history)
• Immunocompromised: Give if stable, on low-dose immunosuppression (ACIP recommendation)
• Not a live vaccine - safe in immunosuppressed (unlike Zostavax)
• Side effects: Injection site pain (80% - significant), fatigue, myalgia, fever (2-3 days)

**Zostavax (Live Attenuated) - Largely Replaced by Shingrix:**
• Contraindicated in immunocompromised (live vaccine!)
• Lower efficacy (51% overall, 38% in ≥70)

**VACCINATION AFTER ZOSTER EPISODE:**
• Wait until acute episode resolves (usually 4-8 weeks)
• Shingrix recommended even if prior zoster or prior Zostavax

**DISPOSITION:**
• Uncomplicated, immunocompetent: Outpatient
• HZO, Ramsay Hunt, disseminated, CNS: Admit for IV acyclovir
• Immunocompromised: Low threshold for admission
• Severe pain uncontrolled PO: Consider admission for pain management
• Isolate from: Pregnant women (if non-immune), immunocompromised, unvaccinated infants`,

};
