// ========== AI Teaching Points Generator ==========

export interface TeachingPoint {
  type: 'positive' | 'warning' | 'tip';
  emoji: string;
  message: string;
}

export function generateTeachingPoints(state: any, scenarioId: string): TeachingPoint[] {
  const points: TeachingPoint[] = [];
  const v = state.vitals;
  const events = state.events || [];
  const orders = state.activeOrders || [];

  // ===== POSITIVE =====
  if (orders.some((o: any) => o.category === 'antibiotic' && o.startSimTime <= 30)) {
    points.push({ type: 'positive', emoji: '✅', message: 'Antibiotics given within 30 minutes - following SSC guidelines reduces mortality by 50%.' });
  }
  
  if (orders.some((o: any) => o.name.includes('Saline') && o.startSimTime <= 10)) {
    points.push({ type: 'positive', emoji: '✅', message: 'Early fluid resuscitation - 30mL/kg within 3 hours is the standard of care.' });
  }
  
  if (v.map > 65 && v.lactate < 2.5) {
    points.push({ type: 'positive', emoji: '✅', message: 'Excellent hemodynamic endpoints achieved - MAP >65 and lactate clearance confirm adequate resuscitation.' });
  }

  // ===== WARNINGS =====
  const abxOrder = orders.find((o: any) => o.category === 'antibiotic');
  if (abxOrder && abxOrder.startSimTime > 45) {
    points.push({ type: 'warning', emoji: '⚠️', message: 'Antibiotics delayed beyond 45 minutes. Kumar et al. (2006): each hour delay increases mortality by 7.8%.' });
  }
  
  if (!orders.some((o: any) => o.category === 'vasopressor' || o.category === 'inotrope') && v.map < 60) {
    points.push({ type: 'warning', emoji: '⚠️', message: 'MAP <60 without vasopressors - SSC recommends starting norepinephrine when MAP remains <65 after fluids.' });
  }
  
  if (events.some((e: string) => e.includes('PULMONARY_EDEMA'))) {
    points.push({ type: 'warning', emoji: '⚠️', message: 'Pulmonary edema developed - reassess fluid balance. Consider limiting crystalloids and starting diuretics if euvolemic.' });
  }
  
  if (v.urineOutput < 15 && v.map > 65) {
    points.push({ type: 'warning', emoji: '⚠️', message: 'Oliguria despite adequate MAP - consider intrinsic renal injury. Check nephrotoxic medications.' });
  }

  // ===== TIPS =====
  if (scenarioId === 'septic_shock' && !orders.some((o: any) => o.name.includes('Hydrocortisone'))) {
    points.push({ type: 'tip', emoji: '💡', message: 'Consider hydrocortisone 50mg q6h if vasopressor-dependent (ADRENAL Trial, 2018).' });
  }
  
  if (scenarioId === 'dka' && v.potassium && v.potassium < 3.5) {
    points.push({ type: 'tip', emoji: '💡', message: 'Potassium dropping - ensure K+ replacement in IV fluids. Insulin drives K+ intracellularly.' });
  }
  
  if (v.lactate > 4 && orders.some((o: any) => o.category === 'antibiotic')) {
    points.push({ type: 'tip', emoji: '💡', message: 'Lactate still elevated despite antibiotics - repeat lactate in 2-4 hours. Clearance >10% predicts survival (Rivers et al.).' });
  }
  
  if (points.length === 0) {
    points.push({ type: 'tip', emoji: '💡', message: 'Review the Surviving Sepsis Campaign guidelines for evidence-based management strategies.' });
  }

  return points;
}

// ===== Next Challenge Recommendation =====
export function recommendNextChallenge(state: any, scenarioId: string, allScenarios: any[]): string | null {
  const v = state.vitals;
  
  // Detect weaknesses
  const weaknesses: string[] = [];
  
  if (scenarioId === 'septic_shock') {
    if (v.lactate > 4) weaknesses.push('Lactate management');
    if (v.map < 60) weaknesses.push('Vasopressor titration');
    if (v.urineOutput < 15) weaknesses.push('Fluid balance');
  }
  
  if (scenarioId === 'dka') {
    if (v.ph && v.ph < 7.15) weaknesses.push('Acid-base management');
    if (v.potassium && (v.potassium < 3.2 || v.potassium > 6)) weaknesses.push('Electrolyte management');
  }
  
  // Map weaknesses to scenarios
  const recommendations: Record<string, string> = {
    'Lactate management': 'dka',
    'Vasopressor titration': 'cardiogenic_shock',
    'Fluid balance': 'dka',
    'Acid-base management': 'dka',
    'Electrolyte management': 'hyperkalemia',
  };
  
  for (const [weakness, recommendedId] of Object.entries(recommendations)) {
    if (weaknesses.includes(weakness) && recommendedId !== scenarioId) {
      return recommendedId;
    }
  }
  
  // If no specific weakness, recommend next locked scenario
  const currentIndex = allScenarios.findIndex((s: any) => s.id === scenarioId);
  if (currentIndex < allScenarios.length - 1) {
    return allScenarios[currentIndex + 1]?.id || null;
  }
  
  return null;
}
