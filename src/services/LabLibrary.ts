// ========== LabLibrary — مكتبة التحاليل المركزية v1.0 ==========
import { supabase } from '../config/supabase';
import { LabTest } from './caseTypes';

class LabLibrary {
  private cache: Map<string, LabTest> = new Map();

  // ========== جلب تحليل من المكتبة ==========
  async getTest(testId: string): Promise<LabTest | null> {
    if (this.cache.has(testId)) {
      return this.cache.get(testId)!;
    }

    try {
      const { data, error } = await supabase
        .from('labs_library')
        .select('*')
        .eq('id', testId)
        .single();

      if (data && !error) {
        const test: LabTest = {
          id: data.id,
          name: data.name,
          category: data.category,
          parameters: data.parameters,
        };
        this.cache.set(testId, test);
        return test;
      }
    } catch (e) {
      console.warn('LabLibrary.getTest failed:', e);
    }

    // Fallback to local JSON
    return this.getTestFromLocal(testId);
  }

  // ========== جلب كل التحاليل ==========
  async getAllTests(): Promise<LabTest[]> {
    try {
      const { data, error } = await supabase
        .from('labs_library')
        .select('*');

      if (data && !error) {
        return data.map((d: any) => ({
          id: d.id,
          name: d.name,
          category: d.category,
          parameters: d.parameters,
        }));
      }
    } catch (e) {
      console.warn('LabLibrary.getAllTests failed:', e);
    }

    return [];
  }

  // ========== الحصول على القيم الطبيعية لتحليل ==========
  getNormalValues(testId: string): Record<string, string> | null {
    const test = this.cache.get(testId);
    if (!test) return null;

    const normals: Record<string, string> = {};
    for (const [param, info] of Object.entries(test.parameters)) {
      normals[param] = info.normal_range;
    }
    return normals;
  }

  // ========== توليد نتيجة طبيعية لتحليل ==========
  generateNormalResult(testId: string): string {
    const test = this.cache.get(testId);
    if (!test) return 'Normal';

    const lines: string[] = [];
    for (const [param, info] of Object.entries(test.parameters)) {
      lines.push(`${param}: ${info.normal_range} ${info.unit}`);
    }
    return lines.join('\n');
  }

  // ========== هل التحليل موجود في المكتبة؟ ==========
  hasTest(testId: string): boolean {
    return this.cache.has(testId);
  }

  // ========== إضافة/تحديث تحليل ==========
  async upsertTest(test: LabTest): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('labs_library')
        .upsert({
          id: test.id,
          name: test.name,
          category: test.category,
          parameters: test.parameters,
        });

      if (!error) {
        this.cache.set(test.id, test);
        return true;
      }
    } catch (e) {
      console.error('LabLibrary.upsertTest failed:', e);
    }
    return false;
  }

  // ========== Private: fallback محلي ==========
  private async getTestFromLocal(testId: string): Promise<LabTest | null> {
    try {
      const base = 'https://raw.githubusercontent.com/almagrahimohned-collab/medtach-content/main';
      const res = await fetch(`${base}/labs-reference.json`);
      const data = await res.json();
      
      for (const [category, catData] of Object.entries(data.categories || {})) {
        const tests = (catData as any).tests || [];
        const found = tests.find((t: any) => t.id === testId);
        if (found) return found;
      }
    } catch (e) {
      console.warn('LabLibrary local fallback failed:', e);
    }
    return null;
  }

  clearCache() {
    this.cache.clear();
  }
}

export const labLibrary = new LabLibrary();
