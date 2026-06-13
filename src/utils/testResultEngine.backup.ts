import { getECGResult } from './engines/ecgEngine';
import { getLabResult } from './engines/labEngine';
import { buildReport } from './engines/reportEngine';
import { resolveMedicalImage } from './mediaResolver';

export type TestResult = {
  type: string; imageUrl: string | null; report: string;
  source: 'rule' | 'ai' | 'normal' | 'case' | 'fallback'; confidence: number;
};

interface TestInfo { id: string; name: string; category: string; }
interface CaseInfo { imaging_patterns?: any; correct_diagnosis?: string; title?: string; }

export async function buildTestResult(
  test: TestInfo | null, caseData: CaseInfo | null,
  labResult?: string, subCategory?: string
): Promise<TestResult> {
  if (!test) return { type: 'unknown', imageUrl: null, report: 'Result not available', source: 'fallback', confidence: 0 };
  const name = (test.name || '').toLowerCase();
  const diagnosis = caseData?.correct_diagnosis || caseData?.title || '';
  
  if (test.id === 'ecg' || name.includes('ecg') || name.includes('ekg')) {
    const e = await getECGResult(diagnosis, labResult);
    return { type: 'ecg', imageUrl: e.imageUrl, report: e.report, source: e.source, confidence: e.confidence };
  }
  
  if (name.includes('xray') || name.includes('x-ray') || name.includes('cxr') ||
      name.includes('ct') || name.includes('mri') || name.includes('ultrasound') ||
      name.includes('echo') || name.includes('doppler') || test.category === 'imaging') {
    const r = await resolveMedicalImage(test.id, caseData, diagnosis, test.name);
    const rpt = await buildReport(r.modality, r.patterns[0] || 'normal', diagnosis, labResult);
    return { type: 'imaging', imageUrl: r.imageUrl, report: rpt, source: r.source, confidence: r.confidence };
  }
  
  const l = getLabResult(test.name, labResult, subCategory);
  return { type: 'labs', imageUrl: null, report: l.report, source: 'rule', confidence: l.confidence };
}
