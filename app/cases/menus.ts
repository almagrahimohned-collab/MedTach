export const MEDICAL_MENUS: Record<string, { id: string; text: string; icon: string }[]> = {
  history: [
    { id: 'pmh', text: 'Past Medical History (PMH)', icon: 'clipboard-text-outline' },
    { id: 'family', text: 'Family History', icon: 'account-group-outline' },
    { id: 'surgical', text: 'Surgical History', icon: 'needle' },
    { id: 'allergy', text: 'Drug & Allergy History', icon: 'allergy' },
    { id: 'social', text: 'Social & Occupational History', icon: 'domain' },
    { id: 'systemic', text: 'Systemic Review', icon: 'clipboard-pulse-outline' },
  ],
  examination: [
    { id: 'vitals', text: 'Vital Signs', icon: 'heart-pulse' },
    { id: 'general', text: 'General Physical Examination', icon: 'human' },
    { id: 'cardio', text: 'Cardiovascular Examination', icon: 'heart-outline' },
    { id: 'respiratory', text: 'Respiratory Examination', icon: 'lungs' },
    { id: 'abdominal', text: 'Abdominal / GI Examination', icon: 'stomach' },
    { id: 'neuro', text: 'Neurological Examination', icon: 'brain' },
  ],
  labs: [
    { id: 'cbc', text: 'Complete Blood Count (CBC)', icon: 'blood-bag' },
    { id: 'renal', text: 'Renal Profile (U&E / KFT)', icon: 'kidney-outline' },
    { id: 'lft', text: 'Liver Function Test (LFT)', icon: 'liver' },
    { id: 'abg', text: 'Arterial Blood Gas (ABG)', icon: 'gas-cylinder' },
    { id: 'troponin', text: 'Cardiac Enzymes (Troponin I/T)', icon: 'heart-flash' },
    { id: 'cmp', text: 'Complete Metabolic Panel (CMP)', icon: 'flask-outline' },
  ],
  imaging: [
    { id: 'cxr', text: 'Chest X-Ray (PA/AP)', icon: 'x-ray' },
    { id: 'ct-head', text: 'CT Head (Non-Contrast)', icon: 'head-cog-outline' },
    { id: 'ct-pe', text: 'CT Chest (PE Protocol)', icon: 'image-area' },
    { id: 'us-abd', text: 'Ultrasound Abdomen & Pelvis', icon: 'wave' },
    { id: 'echo', text: 'Echocardiogram (TTE)', icon: 'cardiology' },
    { id: 'ecg', text: 'ECG', icon: 'monitor-waveform' },
  ],
};
