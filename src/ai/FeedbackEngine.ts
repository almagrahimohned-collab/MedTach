// ============================================
// AI Feedback Engine — Intelligent Analysis
// ============================================

import { TraceEntry, TraceSummary } from '../engine/core/ExecutionTrace';
import { SimulationSnapshot } from '../engine/core/SimulationSnapshot';
import { ScoreBreakdown } from '../engine/plugins/scoring/ClinicalScoringPlugin';
import { MedicalCase } from '../content/ContentRepository';

export interface FeedbackSection {
  title: string;
  icon: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  type: 'strength' | 'improvement' | 'insight' | 'suggestion';
}

export interface AIFeedback {
  overall: string;
  strengths: FeedbackSection[];
  improvements: FeedbackSection[];
  insights: FeedbackSection[];
  suggestions: FeedbackSection[];
  cognitiveBiases: string[];
  comparisonToPeers?: {
    percentile: number;
    avgScore: number;
    avgTime: number;
  };
}

export class FeedbackEngine {
  
  // Generate comprehensive feedback
  generateFeedback(
    score: ScoreBreakdown,
    trace: TraceEntry[],
    snapshots: SimulationSnapshot[],
    caseData: MedicalCase
  ): AIFeedback {
    const feedback: AIFeedback = {
      overall: this.generateOverall(score),
      strengths: this.identifyStrengths(score, trace, caseData),
      improvements: this.identifyImprovements(score, trace, caseData),
      insights: this.generateInsights(trace, snapshots, caseData),
      suggestions: this.generateSuggestions(score, trace, caseData),
      cognitiveBiases: this.detectCognitiveBiases(trace, snapshots, caseData)
    };

    return feedback;
  }

  private generateOverall(score: ScoreBreakdown): string {
    if (score.total >= 90) {
      return "Outstanding performance! You demonstrated excellent clinical reasoning and efficient case management. Your diagnostic accuracy and treatment planning are at an advanced level.";
    } else if (score.total >= 80) {
      return "Very good performance. You showed strong clinical skills with minor areas for refinement. Your approach was systematic and mostly efficient.";
    } else if (score.total >= 70) {
      return "Good effort. You have solid foundational knowledge but there's room to improve your diagnostic efficiency and treatment specificity.";
    } else if (score.total >= 60) {
      return "Adequate performance. You demonstrated basic competency but need to work on systematic approach and differential diagnosis generation.";
    } else {
      return "This case presented challenges. Focus on building a structured diagnostic framework and reviewing key clinical patterns for this presentation.";
    }
  }

  private identifyStrengths(
    score: ScoreBreakdown, 
    trace: TraceEntry[], 
    caseData: MedicalCase
  ): FeedbackSection[] {
    const strengths: FeedbackSection[] = [];

    // Diagnosis accuracy
    if (score.diagnosis.score >= 35) {
      strengths.push({
        title: 'Accurate Diagnosis',
        icon: '🎯',
        content: `You correctly identified ${caseData.correct_diagnosis}. Your diagnostic reasoning was precise and well-supported by the evidence gathered.`,
        priority: 'high',
        type: 'strength'
      });
    }

    // Efficient history taking
    const historyActions = trace.filter(e => e.contextSnapshot.phase === 'history');
    if (historyActions.length <= 5 && historyActions.length > 0) {
      strengths.push({
        title: 'Focused History Taking',
        icon: '📋',
        content: `You obtained key history in only ${historyActions.length} questions, demonstrating excellent clinical focus and efficiency.`,
        priority: 'medium',
        type: 'strength'
      });
    }

    // Good time management
    if (score.time.score >= 12) {
      strengths.push({
        title: 'Time Management',
        icon: '⏱️',
        content: `You completed the case efficiently, demonstrating good clinical decision-making under time constraints.`,
        priority: 'medium',
        type: 'strength'
      });
    }

    // Systematic approach
    const phases = [...new Set(trace.map(e => e.contextSnapshot.phase))];
    if (phases.length >= 4) {
      strengths.push({
        title: 'Systematic Approach',
        icon: '🔄',
        content: 'You followed a structured clinical approach through history, examination, investigations, and diagnosis phases.',
        priority: 'low',
        type: 'strength'
      });
    }

    return strengths;
  }

  private identifyImprovements(
    score: ScoreBreakdown,
    trace: TraceEntry[],
    caseData: MedicalCase
  ): FeedbackSection[] {
    const improvements: FeedbackSection[] = [];

    // Diagnostic accuracy needs work
    if (score.diagnosis.score < 30) {
      improvements.push({
        title: 'Diagnostic Accuracy',
        icon: '🔍',
        content: `The correct diagnosis was ${caseData.correct_diagnosis}. Review the key differentiating features: ${caseData.key_learning_points?.slice(0, 2).join('; ')}.`,
        priority: 'high',
        type: 'improvement'
      });
    }

    // Too many unnecessary tests
    const investigationActions = trace.filter(e => 
      e.contextSnapshot.phase === 'investigations'
    );
    const optimalTests = Object.keys(caseData.hidden_data || {}).length || 5;
    if (investigationActions.length > optimalTests * 1.5) {
      improvements.push({
        title: 'Test Ordering Efficiency',
        icon: '🧪',
        content: `You ordered ${investigationActions.length} investigations. A more focused approach with ${optimalTests} key tests would be more efficient and cost-effective.`,
        priority: 'medium',
        type: 'improvement'
      });
    }

    // Missing key physical exam
    if (caseData.physical_exam) {
      const examKeys = Object.keys(caseData.physical_exam);
      const performedExams = trace.filter(e => 
        e.contextSnapshot.phase === 'examination'
      );
      if (performedExams.length < examKeys.length * 0.5) {
        improvements.push({
          title: 'Physical Examination',
          icon: '🩺',
          content: `You missed several key physical examination findings. Remember: ${examKeys.slice(0, 3).map(k => k.replace(/_/g, ' ')).join(', ')} are important in this presentation.`,
          priority: 'medium',
          type: 'improvement'
        });
      }
    }

    // Treatment plan incomplete
    if (score.treatment.score < 20) {
      improvements.push({
        title: 'Treatment Planning',
        icon: '💊',
        content: 'Your treatment plan needs more specificity. Include medication names, doses, and monitoring parameters.',
        priority: 'high',
        type: 'improvement'
      });
    }

    return improvements;
  }

  private generateInsights(
    trace: TraceEntry[],
    snapshots: SimulationSnapshot[],
    caseData: MedicalCase
  ): FeedbackSection[] {
    const insights: FeedbackSection[] = [];

    // Phase transition analysis
    if (snapshots.length >= 2) {
      const firstSnap = snapshots[0];
      const lastSnap = snapshots[snapshots.length - 1];
      
      if (lastSnap.context.revealedCount > firstSnap.context.revealedCount) {
        insights.push({
          title: 'Information Gathering',
          icon: '💡',
          content: `You progressively gathered ${lastSnap.context.revealedCount} pieces of clinical data, building your diagnostic picture systematically.`,
          priority: 'low',
          type: 'insight'
        });
      }
    }

    // Decision-making pattern
    const failedActions = trace.filter(e => !e.result?.success);
    if (failedActions.length > 0) {
      insights.push({
        title: 'Adaptive Learning',
        icon: '🔄',
        content: `You encountered ${failedActions.length} challenges but continued working through the case. This persistence is valuable in clinical practice.`,
        priority: 'medium',
        type: 'insight'
      });
    }

    // Key pattern recognition
    if (caseData.key_learning_points && caseData.key_learning_points.length > 0) {
      insights.push({
        title: 'Clinical Pattern',
        icon: '🧩',
        content: `Key learning: ${caseData.key_learning_points[0]}`,
        priority: 'high',
        type: 'insight'
      });
    }

    return insights;
  }

  private generateSuggestions(
    score: ScoreBreakdown,
    trace: TraceEntry[],
    caseData: MedicalCase
  ): FeedbackSection[] {
    const suggestions: FeedbackSection[] = [];

    // Generate differential early
    const earlyDiagnosis = trace.find(e => e.contextSnapshot.phase === 'diagnosis');
    const totalActions = trace.length;
    if (earlyDiagnosis && trace.indexOf(earlyDiagnosis) < totalActions * 0.3) {
      suggestions.push({
        title: 'Avoid Premature Closure',
        icon: '⚠️',
        content: 'Try generating a broad differential early and refining it as you gather more data. Avoid committing to a diagnosis too quickly.',
        priority: 'medium',
        type: 'suggestion'
      });
    }

    // Use hints wisely
    const hintsUsed = trace.filter(e => e.action.payload.startsWith('/hint'));
    if (hintsUsed.length > 2) {
      suggestions.push({
        title: 'Independent Reasoning',
        icon: '🧠',
        content: 'Try relying less on hints. Challenge yourself to work through the case independently before seeking assistance.',
        priority: 'low',
        type: 'suggestion'
      });
    }

    // Review resources
    suggestions.push({
      title: 'Further Study',
      icon: '📚',
      content: `Review ${caseData.specialty} guidelines for ${caseData.correct_diagnosis}. Focus on: diagnostic criteria, first-line investigations, and management algorithms.`,
      priority: 'medium',
      type: 'suggestion'
    });

    // Practice similar cases
    if (score.total < 70) {
      suggestions.push({
        title: 'Practice Recommendation',
        icon: '🏋️',
        content: `Try another ${caseData.difficulty}-level ${caseData.specialty} case to reinforce these concepts. Repetition builds clinical pattern recognition.`,
        priority: 'high',
        type: 'suggestion'
      });
    }

    return suggestions;
  }

  private detectCognitiveBiases(
    trace: TraceEntry[],
    snapshots: SimulationSnapshot[],
    caseData: MedicalCase
  ): string[] {
    const biases: string[] = [];

    // Anchoring bias - sticking to first diagnosis
    const diagnosisActions = trace.filter(e => e.contextSnapshot.phase === 'diagnosis');
    if (diagnosisActions.length <= 1 && diagnosisActions.length > 0) {
      const firstDiag = diagnosisActions[0];
      if (!firstDiag.result?.success) {
        biases.push('Anchoring Bias: You may have fixated on an initial diagnosis without adequately considering alternatives.');
      }
    }

    // Confirmation bias - only seeking confirming evidence
    const correctDx = caseData.correct_diagnosis.toLowerCase();
    const supportingActions = trace.filter(e => 
      e.action.payload.toLowerCase().includes(correctDx) ||
      e.result?.message?.toLowerCase().includes(correctDx)
    );
    const totalInvestigations = trace.filter(e => e.contextSnapshot.phase === 'investigations');
    if (supportingActions.length > totalInvestigations.length * 0.7) {
      biases.push('Confirmation Bias: Consider actively seeking findings that might rule OUT your leading diagnosis, not just confirm it.');
    }

    // Premature closure
    const totalActions = trace.length;
    const firstDiagnosisIndex = trace.findIndex(e => e.contextSnapshot.phase === 'diagnosis');
    if (firstDiagnosisIndex > 0 && firstDiagnosisIndex < totalActions * 0.4) {
      biases.push('Premature Closure: You accepted a diagnosis before gathering sufficient data. Aim to complete history and key investigations first.');
    }

    // Availability bias
    const rareConditions = ['aortic_dissection', 'pheochromocytoma', 'guillain_barre', 'addison'];
    const mentionedRare = trace.filter(e => 
      rareConditions.some(r => e.action.payload.toLowerCase().includes(r))
    );
    if (mentionedRare.length > 0 && !rareConditions.some(r => caseData.correct_diagnosis.toLowerCase().includes(r))) {
      biases.push('Availability Bias: Consider more common diagnoses before rare ones. "When you hear hoofbeats, think horses, not zebras."');
    }

    return biases;
  }
}

export default FeedbackEngine;
