export const dummyCases: any = {
  Cardiology: {
    Beginner: [
      {
        id: 'cardio_01',
        patientInfo: 'Patient: 60M | ID: #88219',
        chiefComplaint: 'Chief Complaint: Shortness of breath starting 2 hours ago, accompanied by central chest tightness radiating to the left arm.',
        department: 'Emergency',
        data: {
          'Past Medical History (PMH)': 'Known case of Hypertension for 10 years, non-compliant with medications. Type 2 Diabetes Mellitus.',
          'Vital Signs': 'BP: 160/95 mmHg, HR: 110 bpm, RR: 22/min, SpO2: 94% on room air, Temp: 37.1°C',
          'Complete Blood Count (CBC)': 'Hb: 13.5 g/dL, WBC: 8.2 x10^9/L (Normal), Platelets: 250 x10^9/L',
          'Cardiac Enzymes (Troponin I/T)': 'Troponin I: 1.2 ng/mL (Significantly Elevated - Normal < 0.04)',
          'Complete Metabolic Panel (CMP)': 'Na: 138, K: 4.1, Urea: 40, Creatinine: 1.1',
          'Chest X-Ray (PA/AP)': 'No obvious focal consolidation. Mild cardiomegaly.',
          'ECG': 'ST-segment elevation in leads V1-V4 (Anteroseptal STEMI).'
        },
        correctDiagnosis: 'Anteroseptal STEMI (Myocardial Infarction)'
      }
    ],
    Intermediate: [
      {
        id: 'cardio_02',
        patientInfo: 'Patient: 45F | ID: #77124',
        chiefComplaint: 'Palpitations and dizziness for 3 days. Occasional chest discomfort at rest.',
        department: 'Cardiology',
        data: {
          'Past Medical History (PMH)': 'No known chronic illnesses. Mother had mitral valve prolapse.',
          'Vital Signs': 'BP: 110/70 mmHg, HR: 130 bpm (irregular), RR: 18/min, SpO2: 98%, Temp: 36.8°C',
          'Complete Blood Count (CBC)': 'Hb: 12.8 g/dL, WBC: 7.1 x10^9/L, Platelets: 280 x10^9/L',
          'Thyroid Function Test': 'TSH: 2.1 mIU/L (Normal), Free T4: 1.2 ng/dL (Normal)',
          'Cardiac Enzymes (Troponin I/T)': 'Troponin I: <0.01 ng/mL (Normal)',
          'ECG': 'Absent P waves, irregularly irregular rhythm. Ventricular rate ~130 bpm.',
          'Echocardiogram (TTE)': 'Normal LV function. Left atrial enlargement. No valvular abnormalities.'
        },
        correctDiagnosis: 'Atrial Fibrillation with Rapid Ventricular Response'
      }
    ],
    Advanced: [
      {
        id: 'cardio_03',
        patientInfo: 'Patient: 72M | ID: #99341',
        chiefComplaint: 'Progressive dyspnea on exertion over 3 months. Now dyspneic at rest. Orthopnea. Bilateral leg swelling.',
        department: 'Cardiology',
        data: {
          'Past Medical History (PMH)': 'Ischemic heart disease, CABG 5 years ago. Hypertension. Type 2 Diabetes.',
          'Vital Signs': 'BP: 100/65 mmHg, HR: 98 bpm, RR: 28/min, SpO2: 89% on room air, Temp: 36.5°C',
          'Complete Blood Count (CBC)': 'Hb: 10.1 g/dL, WBC: 9.8 x10^9/L, Platelets: 210 x10^9/L',
          'Complete Metabolic Panel (CMP)': 'Na: 132, K: 5.4, Urea: 78, Creatinine: 2.1',
          'BNP': 'BNP: 1850 pg/mL (Severely Elevated - Normal < 100)',
          'Chest X-Ray (PA/AP)': 'Cardiomegaly. Bilateral pleural effusions. Pulmonary vascular congestion.',
          'Echocardiogram (TTE)': 'Severe LV systolic dysfunction. EF: 25%. Global hypokinesis. Moderate mitral regurgitation.'
        },
        correctDiagnosis: 'Acute Decompensated Heart Failure with Reduced Ejection Fraction'
      }
    ]
  },
  Respiratory: {
    Beginner: [
      {
        id: 'resp_01',
        patientInfo: 'Patient: 25M | ID: #55421',
        chiefComplaint: 'Productive cough with green sputum for 5 days. Fever up to 39°C. Right-sided chest pain when breathing.',
        department: 'Emergency',
        data: {
          'Past Medical History (PMH)': 'No chronic illnesses. Non-smoker.',
          'Vital Signs': 'BP: 120/75 mmHg, HR: 105 bpm, RR: 24/min, SpO2: 92% on room air, Temp: 38.8°C',
          'Complete Blood Count (CBC)': 'Hb: 14.2 g/dL, WBC: 16.5 x10^9/L (Leukocytosis), Neutrophils: 85%',
          'Chest X-Ray (PA/AP)': 'Right lower lobe consolidation with air bronchograms.',
          'CRP': 'CRP: 145 mg/L (Severely Elevated - Normal < 5)'
        },
        correctDiagnosis: 'Community-Acquired Pneumonia (Right Lower Lobe)'
      }
    ],
    Intermediate: [
      {
        id: 'resp_02',
        patientInfo: 'Patient: 35F | ID: #66782',
        chiefComplaint: 'Recurrent episodes of wheezing, chest tightness, and dry cough, especially at night and early morning. Worse with cold air.',
        department: 'Pulmonology',
        data: {
          'Past Medical History (PMH)': 'History of allergic rhinitis. Eczema in childhood.',
          'Vital Signs': 'BP: 115/72 mmHg, HR: 88 bpm, RR: 20/min, SpO2: 95%, Temp: 36.7°C',
          'Complete Blood Count (CBC)': 'Hb: 13.1 g/dL, WBC: 8.4 x10^9/L, Eosinophils: 8% (Elevated)',
          'Pulmonary Function Test': 'FEV1: 65% predicted. FEV1/FVC ratio: 0.68. Significant reversibility post-bronchodilator (12% improvement).',
          'Chest X-Ray (PA/AP)': 'Hyperinflation. No consolidation.',
          'IgE Levels': 'Total IgE: 450 IU/mL (Elevated)'
        },
        correctDiagnosis: 'Moderate Persistent Asthma with Allergic Component'
      }
    ],
    Advanced: [
      {
        id: 'resp_03',
        patientInfo: 'Patient: 68M | ID: #88234',
        chiefComplaint: 'Progressive shortness of breath over years. Chronic productive cough. 40 pack-year smoking history.',
        department: 'Pulmonology',
        data: {
          'Past Medical History (PMH)': 'Smoker for 40 years. Hypertension.',
          'Vital Signs': 'BP: 135/85 mmHg, HR: 92 bpm, RR: 26/min, SpO2: 88% on room air, Temp: 36.4°C',
          'Complete Blood Count (CBC)': 'Hb: 16.8 g/dL (Polycythemia), WBC: 9.2 x10^9/L, Platelets: 300 x10^9/L',
          'Arterial Blood Gas (ABG)': 'pH: 7.34, PaCO2: 58 mmHg, PaO2: 55 mmHg, HCO3: 30 mmol/L',
          'Pulmonary Function Test': 'FEV1: 35% predicted. FEV1/FVC: 0.45. Severe obstruction. No reversibility.',
          'Chest X-Ray (PA/AP)': 'Hyperinflated lungs. Flattened diaphragms. Increased retrosternal air space.',
          'CT Chest': 'Centrilobular emphysema predominantly in upper lobes. No evidence of ILD.'
        },
        correctDiagnosis: 'Severe COPD (Chronic Obstructive Pulmonary Disease) with Chronic Hypoxic Respiratory Failure'
      }
    ]
  },
  Neurology: {
    Beginner: [
      {
        id: 'neuro_01',
        patientInfo: 'Patient: 28F | ID: #33421',
        chiefComplaint: 'Severe unilateral headache for 6 hours. Throbbing quality. Associated with nausea and photophobia. Has had similar episodes before.',
        department: 'Emergency',
        data: {
          'Past Medical History (PMH)': 'History of similar headaches since adolescence. Triggered by stress and lack of sleep.',
          'Vital Signs': 'BP: 125/78 mmHg, HR: 72 bpm, RR: 16/min, SpO2: 99%, Temp: 36.6°C',
          'Neurological Examination': 'No focal neurological deficits. Fundoscopy: Normal optic discs.',
          'CT Head (Non-Contrast)': 'No acute intracranial hemorrhage. No mass effect.'
        },
        correctDiagnosis: 'Migraine without Aura'
      }
    ],
    Intermediate: [
      {
        id: 'neuro_02',
        patientInfo: 'Patient: 65M | ID: #44567',
        chiefComplaint: 'Sudden onset of right-sided weakness and difficulty speaking for 2 hours.',
        department: 'Emergency',
        data: {
          'Past Medical History (PMH)': 'Hypertension, Atrial Fibrillation (not on anticoagulation), Diabetes.',
          'Vital Signs': 'BP: 185/105 mmHg, HR: 110 bpm (irregular), RR: 18/min, SpO2: 96%, Temp: 36.8°C',
          'Neurological Examination': 'Right-sided hemiparesis (3/5), expressive aphasia, right facial droop. NIHSS: 12.',
          'CT Head (Non-Contrast)': 'No acute hemorrhage. Hyperdense left MCA sign.',
          'CT Angiography': 'Occlusion of left MCA M1 segment.'
        },
        correctDiagnosis: 'Acute Ischemic Stroke (Left MCA Territory)'
      }
    ],
    Advanced: [
      {
        id: 'neuro_03',
        patientInfo: 'Patient: 42F | ID: #77812',
        chiefComplaint: 'Progressive bilateral leg weakness and numbness ascending over 2 weeks. Now difficulty walking. History of diarrheal illness 3 weeks ago.',
        department: 'Neurology',
        data: {
          'Past Medical History (PMH)': 'Recent Campylobacter gastroenteritis 3 weeks ago. No other medical history.',
          'Vital Signs': 'BP: 130/80 mmHg, HR: 90 bpm, RR: 16/min, SpO2: 98%, Temp: 36.5°C',
          'Neurological Examination': 'Bilateral lower limb weakness (3/5), absent deep tendon reflexes in lower limbs. Sensory loss in stocking distribution. Upper limbs: normal.',
          'Complete Blood Count (CBC)': 'Hb: 13.5 g/dL, WBC: 9.1 x10^9/L, Platelets: 260 x10^9/L',
          'CSF Analysis': 'Albuminocytologic dissociation: Protein 180 mg/dL (Elevated), WBC: 3 cells/µL (Normal)',
          'Nerve Conduction Study': 'Demyelinating polyneuropathy with conduction blocks.'
        },
        correctDiagnosis: 'Guillain-Barré Syndrome (AIDP variant)'
      }
    ]
  },
  Endocrinology: {
    Beginner: [
      {
        id: 'endo_01',
        patientInfo: 'Patient: 45M | ID: #22109',
        chiefComplaint: 'Increased thirst, frequent urination, and fatigue for 3 months. Weight loss of 8 kg despite normal appetite.',
        department: 'Endocrinology',
        data: {
          'Past Medical History (PMH)': 'Obesity (BMI: 32). Father has Type 2 Diabetes.',
          'Vital Signs': 'BP: 140/88 mmHg, HR: 78 bpm, RR: 15/min, SpO2: 99%, Temp: 36.5°C',
          'Fasting Blood Glucose': 'Fasting glucose: 210 mg/dL (11.7 mmol/L)',
          'HbA1c': 'HbA1c: 9.2% (Severely Elevated)',
          'Complete Metabolic Panel (CMP)': 'Na: 136, K: 4.3, Urea: 35, Creatinine: 0.9',
          'Urinalysis': 'Glucose: +++, Ketones: Negative'
        },
        correctDiagnosis: 'Type 2 Diabetes Mellitus (New Onset)'
      }
    ],
    Intermediate: [
      {
        id: 'endo_02',
        patientInfo: 'Patient: 35F | ID: #55432',
        chiefComplaint: 'Weight loss, palpitations, heat intolerance, and tremors for 2 months. Feeling anxious and irritable.',
        department: 'Endocrinology',
        data: {
          'Past Medical History (PMH)': 'No chronic illnesses. Family history of thyroid disease.',
          'Vital Signs': 'BP: 145/80 mmHg, HR: 115 bpm, RR: 18/min, SpO2: 98%, Temp: 37.4°C',
          'Thyroid Function Test': 'TSH: <0.01 mIU/L (Suppressed), Free T4: 4.2 ng/dL (Elevated), Free T3: 8.5 pg/mL (Elevated)',
          'Thyroid Ultrasound': 'Diffusely enlarged thyroid gland with increased vascularity. No nodules.',
          'TSH Receptor Antibodies': 'TRAb: 8.5 IU/L (Positive)'
        },
        correctDiagnosis: 'Graves Disease (Primary Hyperthyroidism)'
      }
    ],
    Advanced: [
      {
        id: 'endo_03',
        patientInfo: 'Patient: 28F | ID: #99021',
        chiefComplaint: 'Amenorrhea for 9 months. Milky discharge from both breasts. Occasional headaches.',
        department: 'Endocrinology',
        data: {
          'Past Medical History (PMH)': 'No chronic illnesses. Not pregnant. No medications.',
          'Vital Signs': 'BP: 115/70 mmHg, HR: 72 bpm, RR: 14/min, SpO2: 99%, Temp: 36.7°C',
          'Hormone Panel': 'Prolactin: 185 ng/mL (Severely Elevated - Normal < 25), FSH: 3.2 IU/L (Low), LH: 2.1 IU/L (Low), Estradiol: 25 pg/mL (Low)',
          'MRI Brain with Contrast': '8 mm microadenoma in the anterior pituitary gland. No optic chiasm compression.',
          'Visual Field Testing': 'Normal visual fields.'
        },
        correctDiagnosis: 'Prolactinoma (Microadenoma)'
      }
    ]
  }
};
