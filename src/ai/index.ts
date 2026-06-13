// ============================================
// AI Layer — Public API
// ============================================

export { FeedbackEngine } from './FeedbackEngine';
export { LearningPathGenerator } from './LearningPathGenerator';
export { DashboardAggregator } from './DashboardAggregator';

export type { AIFeedback, FeedbackSection } from './FeedbackEngine';
export type { LearningPath, LearningModule } from './LearningPathGenerator';
export type { DashboardData, UserStats, SpecialtyBreakdown, ProgressOverTime } from './DashboardAggregator';
