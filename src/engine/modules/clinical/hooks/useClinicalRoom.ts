// ============================================
// useDiagnosticRoom V3 — With Scoring & Replay
// ============================================

import { useSimulation } from '../hooks/useClinicalSimulation';
import { useEffect, useRef } from 'react';

export function useDiagnosticRoom(caseId: string) {
  const simulation = useSimulation(caseId);
  const prevPhaseRef = useRef(simulation.phase);

  // Request scoring when case completes
  useEffect(() => {
    if (simulation.phase === 'complete' && prevPhaseRef.current !== 'complete') {
      simulation.sendMessage('/score');
    }
    prevPhaseRef.current = simulation.phase;
  }, [simulation.phase]);

  return {
    // State
    caseData: simulation.caseData,
    patientState: simulation.patientState,
    vitals: simulation.state.vitals,
    messages: simulation.state.messages,
    phase: simulation.phase,
    revealedData: simulation.state.revealedData,
    timeElapsed: simulation.state.timeElapsed,
    
    // Score & Replay
    score: simulation.state.score,
    trace: simulation.trace,
    replayData: simulation.replayData,
    
    // Actions
    sendMessage: simulation.sendMessage,
    submitAction: simulation.submitAction,
    reset: simulation.reset,
    
    // Status
    loading: simulation.loading,
    error: simulation.error,
    isComplete: simulation.isComplete,
    
    // Helpers
    isAlive: simulation.patientState !== 'DECEASED',
    canInteract: !simulation.isComplete && !simulation.loading
  };
}

export default useDiagnosticRoom;
