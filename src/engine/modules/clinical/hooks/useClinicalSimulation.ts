// ============================================
// useSimulation V3 — Scoring + Replay
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import Kernel from '../../../core/Kernel';
import { EventBus } from '../../../events/EventBus';
import { buildCaseEngine, BuiltEngine } from '../../../core/CaseEngineBuilder';
import { EngineState, Action, ActionResult } from '../../../core/types';
import { ContentRepository, MedicalCase } from '../../../../content/ContentRepository';
import { ClinicalScoringPlugin } from '../scoring/ClinicalScoringPlugin';
import DeterministicRandom from '../../../core/DeterministicRandom';
import SimulationRecorder from '../../../core/SimulationRecorder';

export function useClinicalSimulation(caseId: string) {
  const engineRef = useRef<BuiltEngine | null>(null);
  const scoringRef = useRef<ClinicalScoringPlugin | null>(null);
  const randomRef = useRef<DeterministicRandom>(new DeterministicRandom());
  const recorderRef = useRef<SimulationRecorder | null>(null);
  
  const [state, setState] = useState<EngineState>({
    phase: 'history',
    patientState: 'INITIAL',
    vitals: { bp: '120/80', hr: 72, rr: 16, spo2: 98, temp: 37.0 },
    revealedData: [],
    actions: [],
    messages: [],
    score: 0,
    timeElapsed: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [caseData, setCaseData] = useState<MedicalCase | null>(null);
  const [trace, setTrace] = useState<any[]>([]);
  const [replayData, setReplayData] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    
    async function init() {
      try {
        const repo = ContentRepository.getInstance();
        const data = await repo.getCase(caseId);
        
        if (!mounted) return;
        setCaseData(data);

        // Build engine
        const engine = buildCaseEngine(data);
        engineRef.current = engine;

        // Add scoring plugin
        const scoringPlugin = new ClinicalScoringPlugin();
        scoringRef.current = scoringPlugin;
        engine.kernel.use(scoringPlugin);

        // Initialize recorder
        const recorder = new SimulationRecorder(engine.kernel, randomRef.current, caseId);
        recorderRef.current = recorder;
        recorder.start();

        // Subscribe to state changes
        const bus = EventBus.getInstance();
        const unsub = bus.on('STATE_CHANGED', (event: any) => {
          if (mounted) {
            setState(event.payload.state);
            setTrace(engine.kernel.getTrace().getAll());
          }
        });

        // Listen for diagnosis/treatment to update scoring
        bus.on('CORRECT_DIAGNOSIS', () => scoringPlugin.recordDiagnosis(true));
        bus.on('INCORRECT_DIAGNOSIS', () => scoringPlugin.recordDiagnosis(false));
        bus.on('TREATMENT_SUBMITTED', () => scoringPlugin.recordTreatment());
        bus.on('ACTION_COMPLETED', () => scoringPlugin.recordAction());

        // Listen for case completion to stop recording
        bus.on('CASE_COMPLETED', () => {
          if (recorderRef.current?.isActive()) {
            const data = recorderRef.current.stop();
            setReplayData(data);
          }
        });

        setState(engine.kernel.getState());
        setLoading(false);

        return () => {
          unsub();
          mounted = false;
        };
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to load case');
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      mounted = false;
      recorderRef.current?.stop();
      engineRef.current?.kernel.destroy();
    };
  }, [caseId]);

  const submitAction = useCallback(async (type: string, payload: string): Promise<ActionResult> => {
    if (!engineRef.current) {
      return { success: false, message: 'Engine not initialized' };
    }
    const action: Action = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: type as any,
      payload,
      timestamp: Date.now()
    };
    return await engineRef.current.kernel.submitAction(action);
  }, []);

  const sendMessage = useCallback(async (text: string): Promise<ActionResult> => {
    let type = 'history';
    if (text.startsWith('/diagnosis')) type = 'diagnosis';
    else if (text.startsWith('/treatment')) type = 'treatment';
    else if (text.startsWith('/labs') || text.startsWith('/imaging')) type = 'lab';
    else if (text.startsWith('/score') || text.startsWith('/result')) type = 'scoring';
    else if (state.phase === 'examination') type = 'exam';
    else if (state.phase === 'investigations') type = 'lab';
    else if (state.phase === 'diagnosis') type = 'diagnosis';
    else if (state.phase === 'treatment') type = 'treatment';
    return await submitAction(type, text);
  }, [submitAction, state.phase]);

  const reset = useCallback(() => {
    scoringRef.current?.reset();
    randomRef.current.reset();
    recorderRef.current?.stop();
    engineRef.current?.kernel.reset();
    setState(engineRef.current?.kernel.getState() || state);
    setTrace([]);
    setReplayData(null);
  }, []);

  return {
    state,
    caseData,
    loading,
    error,
    submitAction,
    sendMessage,
    reset,
    trace,
    replayData,
    isComplete: state.phase === 'complete',
    patientState: state.patientState,
    phase: state.phase
  };
}

export default useClinicalSimulation;
