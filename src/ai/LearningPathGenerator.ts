// ============================================
// Learning Path Generator — Adaptive Training
// ============================================

import { ScoreBreakdown } from '../engine/plugins/scoring/ClinicalScoringPlugin';
import { AIFeedback } from './FeedbackEngine';

export interface LearningModule {
  id: string;
  title: string;
  type: 'case' | 'flashcard' | 'reading' | 'quiz';
  specialty: string;
  difficulty: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
}

export interface LearningPath {
  userLevel: string;
  focusAreas: string[];
  modules: LearningModule[];
  totalEstimatedTime: number;
  nextMilestone: string;
}

export class LearningPathGenerator {
  
  generatePath(
    recentScores: ScoreBreakdown[],
    feedback: AIFeedback,
    completedSpecialties: string[]
  ): LearningPath {
    const focusAreas = this.identifyFocusAreas(recentScores, feedback);
    const modules = this.generateModules(focusAreas, completedSpecialties);
    
    const avgScore = recentScores.length > 0
      ? recentScores.reduce((sum, s) => sum + s.total, 0) / recentScores.length
      : 0;

    return {
      userLevel: this.determineLevel(avgScore),
      focusAreas,
      modules,
      totalEstimatedTime: modules.reduce((sum, m) => sum + m.estimatedTime, 0),
      nextMilestone: this.generateMilestone(avgScore, completedSpecialties.length)
    };
  }

  private identifyFocusAreas(scores: ScoreBreakdown[], feedback: AIFeedback): string[] {
    const areas: string[] = [];

    // Analyze weak components
    if (scores.length > 0) {
      const avgDiagnosis = scores.reduce((s, sc) => s + sc.diagnosis.score, 0) / scores.length;
      const avgTreatment = scores.reduce((s, sc) => s + sc.treatment.score, 0) / scores.length;
      const avgEfficiency = scores.reduce((s, sc) => s + sc.efficiency.score, 0) / scores.length;

      if (avgDiagnosis < 25) areas.push('Diagnostic Reasoning');
      if (avgTreatment < 18) areas.push('Treatment Planning');
      if (avgEfficiency < 9) areas.push('Clinical Efficiency');
    }

    // Add from feedback
    const highPriorityImprovements = feedback.improvements.filter(i => i.priority === 'high');
    areas.push(...highPriorityImprovements.map(i => i.title));

    return [...new Set(areas)];
  }

  private generateModules(focusAreas: string[], completedSpecialties: string[]): LearningModule[] {
    const modules: LearningModule[] = [];

    const moduleTemplates: Record<string, LearningModule[]> = {
      'Diagnostic Reasoning': [
        {
          id: 'dr_1', title: 'Building Differential Diagnoses',
          type: 'case', specialty: 'general', difficulty: 'beginner',
          reason: 'Practice systematic differential generation',
          priority: 'high', estimatedTime: 15
        },
        {
          id: 'dr_2', title: 'Clinical Pattern Recognition',
          type: 'flashcard', specialty: 'general', difficulty: 'intermediate',
          reason: 'Strengthen pattern recognition skills',
          priority: 'high', estimatedTime: 10
        }
      ],
      'Treatment Planning': [
        {
          id: 'tp_1', title: 'Evidence-Based Treatment Selection',
          type: 'case', specialty: 'general', difficulty: 'intermediate',
          reason: 'Improve treatment specificity',
          priority: 'high', estimatedTime: 20
        }
      ],
      'Clinical Efficiency': [
        {
          id: 'ce_1', title: 'Focused History Taking',
          type: 'quiz', specialty: 'general', difficulty: 'beginner',
          reason: 'Reduce unnecessary investigations',
          priority: 'medium', estimatedTime: 10
        }
      ]
    };

    for (const area of focusAreas) {
      const templates = moduleTemplates[area] || [];
      modules.push(...templates);
    }

    // Add specialty-specific modules for uncompleted specialties
    const allSpecialties = ['cardiology', 'pulmonology', 'neurology', 'gastroenterology'];
    const uncompleted = allSpecialties.filter(s => !completedSpecialties.includes(s));
    
    for (const specialty of uncompleted.slice(0, 2)) {
      modules.push({
        id: `spec_${specialty}`,
        title: `${specialty.charAt(0).toUpperCase() + specialty.slice(1)} Essentials`,
        type: 'case',
        specialty,
        difficulty: 'beginner',
        reason: `Build foundation in ${specialty}`,
        priority: 'medium',
        estimatedTime: 15
      });
    }

    return modules;
  }

  private determineLevel(avgScore: number): string {
    if (avgScore >= 85) return 'Advanced';
    if (avgScore >= 70) return 'Intermediate';
    if (avgScore >= 50) return 'Beginner';
    return 'Novice';
  }

  private generateMilestone(avgScore: number, completedCount: number): string {
    if (avgScore >= 80 && completedCount >= 10) {
      return '🏆 Ready for advanced cases across all specialties';
    } else if (avgScore >= 70 && completedCount >= 5) {
      return '🎯 On track: Complete 5 more cases to unlock advanced difficulty';
    } else if (completedCount >= 3) {
      return '📈 Building momentum: Focus on diagnostic accuracy';
    } else {
      return '🌱 Getting started: Complete your first 5 cases';
    }
  }
}

export default LearningPathGenerator;
