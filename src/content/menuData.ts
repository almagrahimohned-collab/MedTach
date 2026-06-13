import ContentRepository, { CaseEntry } from './ContentRepository';

export interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route: string;
  description: string;
  caseCount?: number;
}

export async function getClinicalMenu(): Promise<MenuItem[]> {
  const repo = ContentRepository.getInstance();
  const manifest = await repo.getManifest();
  
  return Object.entries(manifest.specialties).map(([key, levels]) => {
    const totalCases = Object.values(levels).reduce((sum, entries) => sum + (entries?.length || 0), 0);
    return {
      id: key,
      title: key.charAt(0).toUpperCase() + key.slice(1),
      icon: 'medical',
      route: `/cases/specialty/${key}`,
      description: `${totalCases} clinical cases`,
      caseCount: totalCases
    };
  });
}
