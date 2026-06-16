// ========== Universal Search Service ==========
import { caseRepository } from './CaseRepository';
import { labLibrary } from './LabLibrary';
import { COMPETENCY_DISPLAY } from '../engines/competencyEngine';

export interface SearchResult {
  id: string;
  type: 'case' | 'lab' | 'image' | 'drug' | 'competency' | 'specialty';
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  route?: string;
  params?: Record<string, string>;
}

const SPECIALTY_ICONS: Record<string, string> = {
  cardiology: 'heart', pulmonology: 'leaf', gastroenterology: 'restaurant',
  endocrinology: 'flask', nephrology: 'water', hematology: 'color-filter',
  infectious: 'bug', neurology: 'brain', rheumatology: 'body',
  dermatology: 'color-palette', gynecology: 'female', surgery: 'cut',
  pediatrics: 'happy', psychiatry: 'chatbubble',
};

const SPECIALTY_COLORS: Record<string, string> = {
  cardiology: '#EF4444', pulmonology: '#10B981', gastroenterology: '#F59E0B',
  endocrinology: '#8B5CF6', nephrology: '#3B82F6', hematology: '#EC4899',
  infectious: '#F97316', neurology: '#6366F1', rheumatology: '#14B8A6',
};

const DRUGS_DB: Record<string, { name: string; category: string; route: string }> = {
  amoxicillin: { name: 'Amoxicillin', category: 'Antibiotic', route: 'PO' },
  ceftriaxone: { name: 'Ceftriaxone', category: 'Antibiotic', route: 'IV' },
  noradrenaline: { name: 'Noradrenaline', category: 'Vasopressor', route: 'IV' },
  dobutamine: { name: 'Dobutamine', category: 'Inotrope', route: 'IV' },
  furosemide: { name: 'Furosemide', category: 'Diuretic', route: 'IV/PO' },
  heparin: { name: 'Heparin', category: 'Anticoagulant', route: 'IV/SC' },
  warfarin: { name: 'Warfarin', category: 'Anticoagulant', route: 'PO' },
  aspirin: { name: 'Aspirin', category: 'Antiplatelet', route: 'PO' },
  metformin: { name: 'Metformin', category: 'Antidiabetic', route: 'PO' },
  insulin: { name: 'Insulin', category: 'Antidiabetic', route: 'SC/IV' },
  morphine: { name: 'Morphine', category: 'Analgesic', route: 'IV/PO' },
  ondansetron: { name: 'Ondansetron', category: 'Antiemetic', route: 'IV/PO' },
};

class SearchService {
  private caseCache: any[] = [];

  async search(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) return [];
    
    const q = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // 1. Search cases
    results.push(...await this.searchCases(q));

    // 2. Search labs
    results.push(...this.searchLabs(q));

    // 3. Search competencies
    results.push(...this.searchCompetencies(q));

    // 4. Search drugs
    results.push(...this.searchDrugs(q));

    // 5. Search specialties
    results.push(...this.searchSpecialties(q));

    return results.slice(0, 20); // Limit to 20 results
  }

  private async searchCases(q: string): Promise<SearchResult[]> {
    try {
      if (this.caseCache.length === 0) {
        const cases = await caseRepository.getCasesForMode('clinical');
        this.caseCache = cases;
      }

      return this.caseCache
        .filter(c => 
          c.title.toLowerCase().includes(q) ||
          c.specialty.toLowerCase().includes(q) ||
          c.tags?.some((t: string) => t.toLowerCase().includes(q))
        )
        .slice(0, 5)
        .map(c => ({
          id: c.id,
          type: 'case' as const,
          title: c.title,
          subtitle: `${c.specialty} • ${c.difficulty}`,
          icon: SPECIALTY_ICONS[c.specialty] || 'medkit',
          color: SPECIALTY_COLORS[c.specialty] || '#38BDF8',
          route: '/cases/review',
          params: { caseId: c.id },
        }));
    } catch {
      return [];
    }
  }

  private searchLabs(q: string): SearchResult[] {
    const results: SearchResult[] = [];
    
    // Search in local lab library cache
    const labList = [
      { id: 'cbc', name: 'Complete Blood Count', cat: 'Hematology' },
      { id: 'crp', name: 'C-Reactive Protein', cat: 'Infection' },
      { id: 'abg', name: 'Arterial Blood Gas', cat: 'ABG' },
      { id: 'troponin', name: 'Troponin I', cat: 'Cardiac' },
      { id: 'bnp', name: 'BNP', cat: 'Cardiac' },
      { id: 'd_dimer', name: 'D-Dimer', cat: 'Coagulation' },
      { id: 'procalcitonin', name: 'Procalcitonin', cat: 'Infection' },
      { id: 'lft', name: 'Liver Function Tests', cat: 'Chemistry' },
      { id: 'cmp', name: 'Comprehensive Metabolic Panel', cat: 'Chemistry' },
      { id: 'coagulation', name: 'Coagulation Profile', cat: 'Coagulation' },
      { id: 'tsh', name: 'TSH', cat: 'Endocrine' },
      { id: 'hba1c', name: 'HbA1c', cat: 'Endocrine' },
      { id: 'blood_culture', name: 'Blood Cultures', cat: 'Microbiology' },
      { id: 'urinalysis', name: 'Urinalysis', cat: 'Microbiology' },
      { id: 'electrolytes', name: 'Electrolyte Panel', cat: 'Chemistry' },
    ];

    for (const lab of labList) {
      if (lab.name.toLowerCase().includes(q) || lab.id.includes(q) || lab.cat.toLowerCase().includes(q)) {
        results.push({
          id: lab.id,
          type: 'lab',
          title: lab.name,
          subtitle: `Category: ${lab.cat}`,
          icon: 'flask',
          color: '#10B981',
        });
      }
    }

    return results.slice(0, 5);
  }

  private searchCompetencies(q: string): SearchResult[] {
    const results: SearchResult[] = [];

    for (const [id, info] of Object.entries(COMPETENCY_DISPLAY)) {
      if (info.name.toLowerCase().includes(q) || info.category.toLowerCase().includes(q) || id.includes(q)) {
        results.push({
          id,
          type: 'competency',
          title: info.name,
          subtitle: `Category: ${info.category}`,
          icon: info.icon,
          color: '#38BDF8',
          route: '/profile/analytics',
        });
      }
    }

    return results.slice(0, 3);
  }

  private searchDrugs(q: string): SearchResult[] {
    const results: SearchResult[] = [];

    for (const [id, info] of Object.entries(DRUGS_DB)) {
      if (info.name.toLowerCase().includes(q) || info.category.toLowerCase().includes(q) || id.includes(q)) {
        results.push({
          id,
          type: 'drug',
          title: info.name,
          subtitle: `${info.category} • ${info.route}`,
          icon: 'medkit',
          color: '#F59E0B',
        });
      }
    }

    return results.slice(0, 3);
  }

  private searchSpecialties(q: string): SearchResult[] {
    const results: SearchResult[] = [];

    for (const [id, icon] of Object.entries(SPECIALTY_ICONS)) {
      if (id.includes(q)) {
        results.push({
          id,
          type: 'specialty',
          title: id.charAt(0).toUpperCase() + id.slice(1),
          subtitle: 'Medical Specialty',
          icon,
          color: SPECIALTY_COLORS[id] || '#38BDF8',
          route: '/specialties/details',
          params: { id },
        });
      }
    }

    return results.slice(0, 3);
  }
}

export const searchService = new SearchService();
