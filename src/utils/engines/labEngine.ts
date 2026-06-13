import { getRoutineTestResult } from '../normalLabResults';
import { normalizeConfidence } from '../mediaResolver';

export function getLabResult(testName: string, hiddenDataResult?: string, subCategory?: string) {
  if (hiddenDataResult && hiddenDataResult.length > 5) return { report: hiddenDataResult, confidence: normalizeConfidence(1.0) };
  const r = getRoutineTestResult(testName, subCategory);
  if (r) return { report: r, confidence: normalizeConfidence(0.9) };
  return { report: `📋 **${testName}** - Within normal limits.`, confidence: normalizeConfidence(0.5) };
}
