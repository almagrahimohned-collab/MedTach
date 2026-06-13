// ============================================
// Dashboard Aggregator — Performance Analytics
// ============================================

import { ScoreBreakdown } from '../engine/plugins/scoring/ClinicalScoringPlugin';
import { TraceEntry } from '../engine/core/ExecutionTrace';
import { PluginStats } from '../engine/core/PluginHealthMonitor';

export interface UserStats {
  totalCases: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
  averageTimePerCase: number;
  streak: number;
  lastActive: number;
}

export interface SpecialtyBreakdown {
  specialty: string;
  casesCompleted: number;
  averageScore: number;
  bestScore: number;
  strengths: string[];
  weaknesses: string[];
}

export interface ProgressOverTime {
  labels: string[];
  scores: number[];
  times: number[];
  trend: 'improving' | 'stable' | 'declining';
}

export interface DashboardData {
  userStats: UserStats;
  specialtyBreakdown: SpecialtyBreakdown[];
  progressOverTime: ProgressOverTime;
  recentFeedback: string[];
  achievements: string[];
  recommendations: string[];
}

export class DashboardAggregator {
  
  aggregate(
    allScores: Array<{ score: ScoreBreakdown; date: number; specialty: string; caseId: string }>,
    allTraces: Array<{ caseId: string; trace: TraceEntry[] }>,
    pluginHealth: PluginStats[]
  ): DashboardData {
    return {
      userStats: this.calculateUserStats(allScores),
      specialtyBreakdown: this.calculateSpecialtyBreakdown(allScores),
      progressOverTime: this.calculateProgress(allScores),
      recentFeedback: this.generateRecentFeedback(allScores, allTraces),
      achievements: this.calculateAchievements(allScores),
      recommendations: this.generateRecommendations(allScores, pluginHealth)
    };
  }

  private calculateUserStats(
    scores: Array<{ score: ScoreBreakdown; date: number; specialty: string }>
  ): UserStats {
    if (scores.length === 0) {
      return {
        totalCases: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpent: 0,
        averageTimePerCase: 0,
        streak: 0,
        lastActive: 0
      };
    }

    const totalScore = scores.reduce((sum, s) => sum + s.score.total, 0);
    const bestScore = Math.max(...scores.map(s => s.score.total));
    const sortedByDate = [...scores].sort((a, b) => b.date - a.date);
    
    // Calculate streak
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < sortedByDate.length; i++) {
      const caseDate = new Date(sortedByDate[i].date);
      const daysDiff = Math.floor((today.getTime() - caseDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === i) streak++;
      else break;
    }

    return {
      totalCases: scores.length,
      averageScore: Math.round(totalScore / scores.length),
      bestScore,
      totalTimeSpent: scores.length * 300, // Estimate 5 min per case
      averageTimePerCase: 300,
      streak,
      lastActive: sortedByDate[0]?.date || 0
    };
  }

  private calculateSpecialtyBreakdown(
    scores: Array<{ score: ScoreBreakdown; date: number; specialty: string }>
  ): SpecialtyBreakdown[] {
    const bySpecialty: Record<string, Array<{ score: ScoreBreakdown }>> = {};
    
    for (const s of scores) {
      if (!bySpecialty[s.specialty]) bySpecialty[s.specialty] = [];
      bySpecialty[s.specialty].push({ score: s.score });
    }

    return Object.entries(bySpecialty).map(([specialty, cases]) => ({
      specialty,
      casesCompleted: cases.length,
      averageScore: Math.round(cases.reduce((sum, c) => sum + c.score.total, 0) / cases.length),
      bestScore: Math.max(...cases.map(c => c.score.total)),
      strengths: this.extractStrengths(cases.map(c => c.score)),
      weaknesses: this.extractWeaknesses(cases.map(c => c.score))
    }));
  }

  private calculateProgress(
    scores: Array<{ score: ScoreBreakdown; date: number; specialty: string }>
  ): ProgressOverTime {
    const sorted = [...scores].sort((a, b) => a.date - b.date);
    const recent = sorted.slice(-10);

    const labels = recent.map((_, i) => `Case ${i + 1}`);
    const scoreValues = recent.map(s => s.score.total);
    const timeValues = recent.map(() => Math.floor(Math.random() * 300 + 180));

    // Calculate trend
    const firstHalf = scoreValues.slice(0, Math.floor(scoreValues.length / 2));
    const secondHalf = scoreValues.slice(Math.floor(scoreValues.length / 2));
    const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length : 0;
    const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length : 0;
    
    const trend = secondAvg > firstAvg + 5 ? 'improving' :
                  secondAvg < firstAvg - 5 ? 'declining' : 'stable';

    return { labels, scores: scoreValues, times: timeValues, trend };
  }

  private generateRecentFeedback(
    scores: Array<{ score: ScoreBreakdown; date: number; specialty: string }>,
    traces: Array<{ caseId: string; trace: TraceEntry[] }>
  ): string[] {
    const feedback: string[] = [];
    const recent = scores.slice(-5);

    if (recent.length >= 3) {
      const recentAvg = recent.reduce((s, r) => s + r.score.total, 0) / recent.length;
      if (recentAvg >= 80) {
        feedback.push('🔥 You\'re on a roll! Recent performance is excellent.');
      } else if (recentAvg >= 70) {
        feedback.push('👍 Consistent performance. Keep building on your strengths.');
      }
    }

    const lastScore = recent[recent.length - 1];
    if (lastScore && lastScore.score.total >= 90) {
      feedback.push('🌟 Outstanding last case! You\'re mastering clinical reasoning.');
    }

    return feedback;
  }

  private calculateAchievements(
    scores: Array<{ score: ScoreBreakdown; date: number; specialty: string }>
  ): string[] {
    const achievements: string[] = [];

    if (scores.length >= 1) achievements.push('🌱 First Case Completed');
    if (scores.length >= 5) achievements.push('📚 5 Cases Club');
    if (scores.length >= 10) achievements.push('🏅 10 Cases Milestone');
    if (scores.length >= 25) achievements.push('🎖️ 25 Cases Veteran');
    if (scores.length >= 50) achievements.push('👑 50 Cases Master');

    const bestScore = scores.length > 0 ? Math.max(...scores.map(s => s.score.total)) : 0;
    if (bestScore >= 90) achievements.push('💎 Perfect Score');
    if (bestScore >= 80) achievements.push('⭐ High Achiever');

    const specialties = new Set(scores.map(s => s.specialty));
    if (specialties.size >= 3) achievements.push('🔬 Multi-Specialty Explorer');
    if (specialties.size >= 7) achievements.push('🌐 Broad Knowledge Base');

    return achievements;
  }

  private generateRecommendations(
    scores: Array<{ score: ScoreBreakdown; date: number; specialty: string }>,
    pluginHealth: PluginStats[]
  ): string[] {
    const recommendations: string[] = [];

    if (scores.length < 5) {
      recommendations.push('Complete at least 5 cases to unlock personalized recommendations');
    } else {
      const avgScore = scores.reduce((s, r) => s + r.score.total, 0) / scores.length;
      if (avgScore < 70) {
        recommendations.push('Focus on beginner cases to build foundational knowledge');
      } else {
        recommendations.push('Challenge yourself with intermediate and advanced cases');
      }
    }

    // Specialty gaps
    const completedSpecialties = new Set(scores.map(s => s.specialty));
    const recommendedSpecialties = ['cardiology', 'pulmonology', 'neurology']
      .filter(s => !completedSpecialties.has(s));
    
    if (recommendedSpecialties.length > 0) {
      recommendations.push(`Explore new specialties: ${recommendedSpecialties.join(', ')}`);
    }

    return recommendations;
  }

  private extractStrengths(scores: ScoreBreakdown[]): string[] {
    const strengths: string[] = [];
    const avgDiagnosis = scores.reduce((s, sc) => s + sc.diagnosis.score, 0) / scores.length;
    const avgTreatment = scores.reduce((s, sc) => s + sc.treatment.score, 0) / scores.length;
    
    if (avgDiagnosis >= 30) strengths.push('Diagnostic Accuracy');
    if (avgTreatment >= 22) strengths.push('Treatment Planning');
    
    return strengths.length > 0 ? strengths : ['Developing'];
  }

  private extractWeaknesses(scores: ScoreBreakdown[]): string[] {
    const weaknesses: string[] = [];
    const avgEfficiency = scores.reduce((s, sc) => s + sc.efficiency.score, 0) / scores.length;
    const avgTime = scores.reduce((s, sc) => s + sc.time.score, 0) / scores.length;
    
    if (avgEfficiency < 10) weaknesses.push('Test Ordering');
    if (avgTime < 10) weaknesses.push('Time Management');
    
    return weaknesses.length > 0 ? weaknesses : ['None identified'];
  }
}

export default DashboardAggregator;
