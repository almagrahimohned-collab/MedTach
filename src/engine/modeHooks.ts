import { useSimulation } from './useSimulation';

export function useClinicalCase(caseId: string) {
  return useSimulation(caseId);
}

export function useICUSim(caseId: string) {
  return useSimulation(caseId);
}

export function useResidentLife(caseId: string) {
  return useSimulation(caseId);
}

export function useOSCESim(caseId: string) {
  return useSimulation(caseId);
}

export function useBoardPrep(caseId: string) {
  return useSimulation(caseId);
}
