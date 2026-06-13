// ============================================
// Dashboard API — Instructor/Admin Interface
// ============================================

import { DashboardAggregator, DashboardData } from '../ai/DashboardAggregator';
import { ScoreBreakdown } from '../engine/plugins/scoring/ClinicalScoringPlugin';
import { TraceEntry } from '../engine/core/ExecutionTrace';
import { AIFeedback, FeedbackEngine } from '../ai/FeedbackEngine';
import { LearningPath, LearningPathGenerator } from '../ai/LearningPathGenerator';
import { MedicalCase } from '../content/ContentRepository';

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  level: string;
  totalCases: number;
  averageScore: number;
  lastActive: number;
  strengths: string[];
  weaknesses: string[];
  recentScores: Array<{ date: number; score: number; case: string }>;
}

export interface CohortAnalytics {
  totalStudents: number;
  activeStudents: number;
  averageScore: number;
  scoreDistribution: Record<string, number>;
  mostChallengingCases: Array<{ caseId: string; avgScore: number; attempts: number }>;
  topPerformers: StudentRecord[];
  needsAttention: StudentRecord[];
}

export interface InstructorFeedback {
  studentId: string;
  feedback: AIFeedback;
  learningPath: LearningPath;
  recommendedIntervention: string;
}

export class DashboardAPI {
  private aggregator: DashboardAggregator;
  private feedbackEngine: FeedbackEngine;
  private pathGenerator: LearningPathGenerator;
  
  // Mock student data — in production, this comes from Supabase
  private students: Map<string, {
    info: { id: string; name: string; email: string };
    history: Array<{ 
      caseId: string; 
      specialty: string;
      score: ScoreBreakdown; 
      date: number;
      trace: TraceEntry[];
    }>;
  }> = new Map();

  constructor() {
    this.aggregator = new DashboardAggregator();
    this.feedbackEngine = new FeedbackEngine();
    this.pathGenerator = new LearningPathGenerator();
  }

  // Get student dashboard
  getStudentDashboard(studentId: string): DashboardData | null {
    const student = this.students.get(studentId);
    if (!student) return null;

    const scores = student.history.map(h => ({
      score: h.score,
      date: h.date,
      specialty: h.specialty,
      caseId: h.caseId
    }));

    const traces = student.history.map(h => ({
      caseId: h.caseId,
      trace: h.trace
    }));

    return this.aggregator.aggregate(scores, traces, []);
  }

  // Get student record
  getStudentRecord(studentId: string): StudentRecord | null {
    const student = this.students.get(studentId);
    if (!student) return null;

    const scores = student.history.map(h => h.score);
    const avgScore = scores.length > 0 
      ? scores.reduce((s, sc) => s + sc.total, 0) / scores.length 
      : 0;

    return {
      id: student.info.id,
      name: student.info.name,
      email: student.info.email,
      level: avgScore >= 80 ? 'Advanced' : avgScore >= 60 ? 'Intermediate' : 'Beginner',
      totalCases: student.history.length,
      averageScore: Math.round(avgScore),
      lastActive: student.history[student.history.length - 1]?.date || 0,
      strengths: this.extractTopStrengths(scores),
      weaknesses: this.extractTopWeaknesses(scores),
      recentScores: student.history.slice(-10).map(h => ({
        date: h.date,
        score: h.score.total,
        case: h.caseId
      }))
    };
  }

  // Get cohort analytics
  getCohortAnalytics(): CohortAnalytics {
    const allStudents = Array.from(this.students.values());
    const activeStudents = allStudents.filter(s => 
      s.history.length > 0 && 
      Date.now() - s.history[s.history.length - 1].date < 7 * 24 * 60 * 60 * 1000
    );

    const allScores = allStudents.flatMap(s => s.history.map(h => h.score.total));
    const avgScore = allScores.length > 0 
      ? allScores.reduce((a, b) => a + b, 0) / allScores.length 
      : 0;

    // Score distribution
    const distribution: Record<string, number> = {
      'A (90-100)': 0, 'B (80-89)': 0, 'C (70-79)': 0,
      'D (60-69)': 0, 'F (<60)': 0
    };
    allScores.forEach(s => {
      if (s >= 90) distribution['A (90-100)']++;
      else if (s >= 80) distribution['B (80-89)']++;
      else if (s >= 70) distribution['C (70-79)']++;
      else if (s >= 60) distribution['D (60-69)']++;
      else distribution['F (<60)']++;
    });

    // Most challenging cases
    const casePerformance: Record<string, { total: number; count: number }> = {};
    allStudents.forEach(s => {
      s.history.forEach(h => {
        if (!casePerformance[h.caseId]) casePerformance[h.caseId] = { total: 0, count: 0 };
        casePerformance[h.caseId].total += h.score.total;
        casePerformance[h.caseId].count++;
      });
    });

    const mostChallenging = Object.entries(casePerformance)
      .map(([caseId, perf]) => ({
        caseId,
        avgScore: Math.round(perf.total / perf.count),
        attempts: perf.count
      }))
      .sort((a, b) => a.avgScore - b.avgScore)
      .slice(0, 5);

    // Top performers and students needing attention
    const studentRecords = allStudents.map(s => this.getStudentRecord(s.info.id)!);
    const topPerformers = [...studentRecords]
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 5);
    const needsAttention = [...studentRecords]
      .filter(s => s.averageScore < 60)
      .sort((a, b) => a.averageScore - b.averageScore);

    return {
      totalStudents: allStudents.length,
      activeStudents: activeStudents.length,
      averageScore: Math.round(avgScore),
      scoreDistribution: distribution,
      mostChallengingCases: mostChallenging,
      topPerformers,
      needsAttention
    };
  }

  // Generate instructor feedback for a student
  generateInstructorFeedback(
    studentId: string,
    caseData: MedicalCase
  ): InstructorFeedback | null {
    const student = this.students.get(studentId);
    if (!student || student.history.length === 0) return null;

    const lastCase = student.history[student.history.length - 1];
    const feedback = this.feedbackEngine.generateFeedback(
      lastCase.score,
      lastCase.trace,
      [],
      caseData
    );

    const recentScores = student.history.slice(-5).map(h => h.score);
    const completedSpecialties = [...new Set(student.history.map(h => h.specialty))];
    const learningPath = this.pathGenerator.generatePath(
      recentScores,
      feedback,
      completedSpecialties
    );

    const recommendedIntervention = this.determineIntervention(
      student.history.length,
      recentScores.reduce((s, sc) => s + sc.total, 0) / recentScores.length
    );

    return {
      studentId,
      feedback,
      learningPath,
      recommendedIntervention
    };
  }

  // Export data
  exportStudentData(studentId: string): string {
    const student = this.students.get(studentId);
    if (!student) return '{}';
    
    return JSON.stringify({
      student: student.info,
      history: student.history.map(h => ({
        caseId: h.caseId,
        specialty: h.specialty,
        score: h.score,
        date: new Date(h.date).toISOString()
      }))
    }, null, 2);
  }

  exportCohortData(): string {
    const analytics = this.getCohortAnalytics();
    const students = Array.from(this.students.values()).map(s => ({
      ...s.info,
      caseCount: s.history.length,
      avgScore: s.history.length > 0 
        ? Math.round(s.history.reduce((sum, h) => sum + h.score.total, 0) / s.history.length)
        : 0
    }));

    return JSON.stringify({ analytics, students }, null, 2);
  }

  private extractTopStrengths(scores: ScoreBreakdown[]): string[] {
    if (scores.length === 0) return ['New Student'];
    const avgDiag = scores.reduce((s, sc) => s + sc.diagnosis.score, 0) / scores.length;
    const avgTreat = scores.reduce((s, sc) => s + sc.treatment.score, 0) / scores.length;
    const strengths: string[] = [];
    if (avgDiag >= 30) strengths.push('Diagnosis');
    if (avgTreat >= 22) strengths.push('Treatment');
    return strengths.length > 0 ? strengths : ['Developing'];
  }

  private extractTopWeaknesses(scores: ScoreBreakdown[]): string[] {
    if (scores.length === 0) return ['Insufficient Data'];
    const avgEff = scores.reduce((s, sc) => s + sc.efficiency.score, 0) / scores.length;
    const avgTime = scores.reduce((s, sc) => s + sc.time.score, 0) / scores.length;
    const weaknesses: string[] = [];
    if (avgEff < 10) weaknesses.push('Efficiency');
    if (avgTime < 10) weaknesses.push('Time');
    return weaknesses.length > 0 ? weaknesses : ['None'];
  }

  private determineIntervention(caseCount: number, avgScore: number): string {
    if (caseCount < 5) return 'Encourage completing more cases to establish baseline';
    if (avgScore < 50) return 'Schedule one-on-one review session. Focus on fundamentals.';
    if (avgScore < 70) return 'Assign targeted practice in weak areas. Monitor weekly.';
    if (avgScore < 85) return 'Challenge with advanced cases. Encourage peer teaching.';
    return 'Ready for leadership roles. Consider as peer mentor.';
  }

  // Mock data seeding for demo
  seedDemoData(): void {
    const demoStudents = [
      { id: 's1', name: 'Dr. Sarah Ahmed', email: 'sarah@medtach.com' },
      { id: 's2', name: 'Dr. Omar Hassan', email: 'omar@medtach.com' },
      { id: 's3', name: 'Dr. Layla Mahmoud', email: 'layla@medtach.com' },
    ];

    demoStudents.forEach(student => {
      const history: Array<any> = [];
      for (let i = 0; i < 8; i++) {
        history.push({
          caseId: `case_${i + 1}`,
          specialty: ['cardiology', 'pulmonology', 'neurology'][i % 3],
          score: {
            diagnosis: { score: 25 + Math.floor(Math.random() * 15), max: 40, feedback: '' },
            treatment: { score: 18 + Math.floor(Math.random() * 12), max: 30, feedback: '' },
            efficiency: { score: 8 + Math.floor(Math.random() * 7), max: 15, feedback: '' },
            time: { score: 8 + Math.floor(Math.random() * 7), max: 15, feedback: '' },
            total: 60 + Math.floor(Math.random() * 35),
            grade: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
            passed: Math.random() > 0.2
          },
          date: Date.now() - (8 - i) * 86400000,
          trace: []
        });
      }
      this.students.set(student.id, { info: student, history });
    });
  }
}

export default DashboardAPI;
