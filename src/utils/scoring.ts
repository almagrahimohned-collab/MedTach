export const calculateCaseScore = (
  isCorrect: boolean, 
  testsUsed: number, 
  timeTakenSeconds: number
) => {
  let score = 100; // الدرجة الأساسية
  
  // عقوبة طلب فحوصات كثيرة (كل فحص غير ضروري يخصم 10 نقاط)
  score -= (testsUsed * 10);
  
  // عقوبة الوقت (كل دقيقة تأخير تخصم 5 نقاط)
  score -= Math.floor(timeTakenSeconds / 60) * 5;
  
  // إذا كان التشخيص خاطئاً، نخفض النتيجة بشكل كبير
  if (!isCorrect) score = Math.max(0, score - 50);
  
  return Math.max(0, score);
};
