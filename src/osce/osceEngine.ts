// osceEngine.ts - OSCE Main Engine
// Created: 2026-06-11
// Core game engine: processes student actions, manages state, handles scoring

import {
  OSCEStation,
  StationState,
  StationPhase,
  AskedQuestion,
  PerformedExamination,
  OrderedInvestigation,
  StudentDiagnosis,
  StudentManagement,
  StationResult,
  DomainScore,
  ChecklistItem,
  QuestionMapEntry,
  Investigation,
} from './osceTypes';

// ============================================================
// OSCE ENGINE CLASS
// ============================================================

export class OSCEEngine {
  private station: OSCEStation;
  private state: StationState;
  private startTime: number = 0;

  constructor(station: OSCEStation) {
    this.station = station;
    this.state = this.createInitialState();
  }

  /**
   * Create fresh station state
   */
  private createInitialState(): StationState {
    return {
      stationId: this.station.id,
      phase: 'door',
      timeRemaining: this.station.timeLimit * 60, // Convert to seconds
      questionsAsked: [],
      examinationsPerformed: [],
      investigationsOrdered: [],
      professionalBonuses: [],
      professionalPenalties: [],
      startedAt: Date.now(),
    };
  }

  // ============================================================
  // PHASE MANAGEMENT
  // ============================================================

  /**
   * Start the station (after reading time)
   */
  startStation(): void {
    this.startTime = Date.now();
    this.state.phase = 'introduction';
    this.state.startedAt = this.startTime;
  }

  /**
   * Move to next phase
   */
  moveToPhase(phase: StationPhase): void {
    const validTransitions: Record<StationPhase, StationPhase[]> = {
      'door': ['introduction'],
      'introduction': ['history'],
      'history': ['examination', 'investigations', 'diagnosis'],
      'examination': ['investigations', 'diagnosis', 'management'],
      'investigations': ['diagnosis', 'management'],
      'diagnosis': ['management'],
      'management': ['complete'],
      'complete': [],
    };

    if (validTransitions[this.state.phase]?.includes(phase)) {
      this.state.phase = phase;
    } else {
      console.warn(`Invalid phase transition: ${this.state.phase} → ${phase}`);
    }
  }

  /**
   * Get current phase
   */
  getPhase(): StationPhase {
    return this.state.phase;
  }

  /**
   * Get patient's opening statement
   */
  getOpeningStatement(): string {
    return this.station.history.openingStatement;
  }

  // ============================================================
  // HISTORY TAKING ENGINE
  // ============================================================

  /**
   * Process a student's question and return patient's response
   */
  askQuestion(question: string): { answer: string; matchedKey?: string; isRelevant: boolean } {
    if (!question.trim()) {
      return { answer: "I'm sorry, I didn't catch that.", isRelevant: false };
    }

    const normalizedQuestion = question.toLowerCase().trim();
    const questionMap = this.station.history.questionMap;

    // Try to find matching question
    let bestMatch: { key: string; entry: QuestionMapEntry; score: number } | null = null;

    for (const [key, entry] of Object.entries(questionMap)) {
      const matchScore = this.calculateMatchScore(normalizedQuestion, entry.keywords);
      
      if (matchScore > 0 && (!bestMatch || matchScore > bestMatch.score)) {
        bestMatch = { key, entry, score: matchScore };
      }
    }

    // Check if already asked
    const alreadyAsked = this.state.questionsAsked.some(
      q => q.matchedKey === bestMatch?.key
    );

    if (bestMatch && bestMatch.score >= 0.5) {
      if (alreadyAsked) {
        // Student asking again - patient gets annoyed
        return {
          answer: "I already told you about that. Is there something else you'd like to ask?",
          matchedKey: bestMatch.key,
          isRelevant: true,
        };
      }

      // Record the question
      const askedQuestion: AskedQuestion = {
        question,
        answer: bestMatch.entry.response,
        matchedKey: bestMatch.key,
        timestamp: Date.now(),
      };
      this.state.questionsAsked.push(askedQuestion);

      return {
        answer: bestMatch.entry.response,
        matchedKey: bestMatch.key,
        isRelevant: true,
      };
    }

    // No match found
    const askedQuestion: AskedQuestion = {
      question,
      answer: "I'm not sure what you mean. Could you ask that differently?",
      timestamp: Date.now(),
    };
    this.state.questionsAsked.push(askedQuestion);

    return {
      answer: "I'm not sure what you mean. Could you ask that differently?",
      isRelevant: false,
    };
  }

  /**
   * Calculate how well student's question matches keywords
   * Returns 0-1 score
   */
  private calculateMatchScore(question: string, keywords: string[]): number {
    let matchCount = 0;
    let totalWeight = keywords.length;

    for (const keyword of keywords) {
      const normalizedKeyword = keyword.toLowerCase();
      
      // Exact match
      if (question.includes(normalizedKeyword)) {
        matchCount += 1;
        continue;
      }

      // Fuzzy match: check if most words of keyword are present
      const keywordWords = normalizedKeyword.split(/\s+/);
      const matchedWords = keywordWords.filter(word => question.includes(word));
      
      if (matchedWords.length >= keywordWords.length * 0.6) {
        matchCount += 0.7;
      }
    }

    return totalWeight > 0 ? matchCount / totalWeight : 0;
  }

  /**
   * Get all questions asked so far
   */
  getQuestionsAsked(): AskedQuestion[] {
    return this.state.questionsAsked;
  }

  // ============================================================
  // EXAMINATION ENGINE
  // ============================================================

  /**
   * Perform an examination maneuver and get findings
   */
  performExamination(systemId: string, step: string): { finding: string; success: boolean } {
    const system = this.station.examination.systems[systemId];
    
    if (!system) {
      return { finding: "No such examination available.", success: false };
    }

    // Check if step exists for this system
    const finding = system[step as keyof typeof system];
    if (!finding || typeof finding !== 'string') {
      return { finding: "This examination step is not applicable here.", success: false };
    }

    // Check if already performed
    const alreadyPerformed = this.state.examinationsPerformed.some(
      e => e.systemId === systemId && e.step === step
    );

    if (alreadyPerformed) {
      return { finding: `Already examined: ${finding}`, success: true };
    }

    // Record the examination
    const exam: PerformedExamination = {
      systemId,
      step,
      finding: finding as string,
      timestamp: Date.now(),
    };
    this.state.examinationsPerformed.push(exam);

    // Check for professional bonuses
    if (step === 'inspection' && systemId === 'general') {
      this.addProfessionalBonus('Performed general inspection');
    }

    // Check correct sequence
    this.checkExaminationSequence(systemId, step);

    return { finding: finding as string, success: true };
  }

  /**
   * Check if examination follows correct sequence
   */
  private checkExaminationSequence(systemId: string, step: string): void {
    const correctSequence = ['inspection', 'palpation', 'percussion', 'auscultation'];
    const stepsForSystem = this.state.examinationsPerformed
      .filter(e => e.systemId === systemId)
      .map(e => e.step);

    const stepIndex = correctSequence.indexOf(step);
    const previousSteps = stepsForSystem.slice(0, -1); // exclude current

    // Check if any previous step was skipped
    for (let i = 0; i < stepIndex; i++) {
      if (!previousSteps.includes(correctSequence[i])) {
        this.addProfessionalPenalty(
          `Performed ${step} before ${correctSequence[i]} in ${systemId} exam`
        );
        break;
      }
    }
  }

  /**
   * Get all examinations performed
   */
  getExaminationsPerformed(): PerformedExamination[] {
    return this.state.examinationsPerformed;
  }

  /**
   * Get available examination systems
   */
  getAvailableExaminationSystems(): string[] {
    return Object.keys(this.station.examination.systems);
  }

  // ============================================================
  // INVESTIGATIONS ENGINE
  // ============================================================

  /**
   * Order an investigation and get results
   */
  orderInvestigation(testId: string): { finding: string; testName: string; success: boolean; isCritical: boolean } {
    const investigation = this.station.investigations.available[testId];
    
    if (!investigation) {
      return { 
        finding: "This test is not available.", 
        testName: testId,
        success: false,
        isCritical: false
      };
    }

    // Check if already ordered
    const alreadyOrdered = this.state.investigationsOrdered.some(
      i => i.testId === testId
    );

    if (alreadyOrdered) {
      return {
        finding: investigation.finding,
        testName: investigation.name,
        success: true,
        isCritical: this.station.investigations.critical_investigations.includes(testId),
      };
    }

    // Record the order
    const ordered: OrderedInvestigation = {
      testId,
      testName: investigation.name,
      finding: investigation.finding,
      timestamp: Date.now(),
    };
    this.state.investigationsOrdered.push(ordered);

    return {
      finding: investigation.finding,
      testName: investigation.name,
      success: true,
      isCritical: this.station.investigations.critical_investigations.includes(testId),
    };
  }

  /**
   * Get all investigations ordered
   */
  getInvestigationsOrdered(): OrderedInvestigation[] {
    return this.state.investigationsOrdered;
  }

  /**
   * Get available investigations
   */
  getAvailableInvestigations(): { id: string; name: string; category: string }[] {
    return Object.entries(this.station.investigations.available).map(([id, inv]) => ({
      id,
      name: inv.name,
      category: inv.category,
    }));
  }

  // ============================================================
  // DIAGNOSIS SUBMISSION
  // ============================================================

  /**
   * Submit student's diagnosis
   */
  submitDiagnosis(primary: string, differentials: string[]): void {
    this.state.diagnosis = { primary, differentials };
  }

  // ============================================================
  // MANAGEMENT SUBMISSION
  // ============================================================

  /**
   * Submit student's management plan
   */
  submitManagement(immediate: string[], monitoring: string[], longTerm: string[]): void {
    this.state.management = { immediate, monitoring, longTerm };
  }

  // ============================================================
  // PROFESSIONAL BEHAVIOUR
  // ============================================================

  /**
   * Add professional bonus
   */
  addProfessionalBonus(description: string): void {
    if (!this.state.professionalBonuses.includes(description)) {
      this.state.professionalBonuses.push(description);
    }
  }

  /**
   * Add professional penalty
   */
  addProfessionalPenalty(description: string): void {
    if (!this.state.professionalPenalties.includes(description)) {
      this.state.professionalPenalties.push(description);
    }
  }

  /**
   * Perform hand hygiene
   */
  performHandHygiene(): void {
    this.addProfessionalBonus('Performed hand hygiene');
  }

  /**
   * Introduce self to patient
   */
  introduceSelf(): void {
    this.addProfessionalBonus('Introduced self and explained role');
  }

  // ============================================================
  // TIMER MANAGEMENT
  // ============================================================

  /**
   * Update time remaining
   */
  updateTime(timeRemaining: number): void {
    this.state.timeRemaining = timeRemaining;
  }

  /**
   * Get time remaining
   */
  getTimeRemaining(): number {
    return this.state.timeRemaining;
  }

  // ============================================================
  // STATE ACCESS
  // ============================================================

  /**
   * Get complete station state
   */
  getState(): StationState {
    return this.state;
  }

  /**
   * Get the station configuration
   */
  getStation(): OSCEStation {
    return this.station;
  }

  /**
   * Get patient info
   */
  getPatientInfo() {
    return this.station.patient;
  }

  /**
   * Get door instructions
   */
  getDoorInstructions() {
    return this.station.doorInstructions;
  }

  /**
   * Check if station is complete
   */
  isComplete(): boolean {
    return this.state.phase === 'complete';
  }
}

// ============================================================
// EXPORT
// ============================================================

export default OSCEEngine;
