export const checkBadges = (completedCases: any[], addBadge: (b: string) => void) => {
  // وسام الخبير: إذا حل أكثر من 5 حالات
  if (completedCases.length >= 5) {
    addBadge('🏆 Diagnostic Expert');
  }
  
  // وسام المثابر: إذا حل أكثر من 3 حالات في يوم واحد (تحتاج إضافة منطق التاريخ)
  if (completedCases.length >= 3) {
    addBadge('🔥 High Streak');
  }
};
