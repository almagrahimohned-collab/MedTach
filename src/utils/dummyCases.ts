export const dummyCases: any = {
  Cardiology: {
    Beginner: [
      {
        id: 'cardio_01',
        patientInfo: 'Patient: 60M | ID: #88219',
        chiefComplaint: 'Chief Complaint: Shortness of breath (SOB) starting 2 hours ago, accompanied by central chest tightness radiating to the left arm.',
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
    ]
  }
};
