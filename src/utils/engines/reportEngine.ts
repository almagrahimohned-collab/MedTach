import { getEducationalFeedback } from '../../services/aiService';

const T: Record<string, Record<string, string>> = {
  cxr: {
    pneumonia: `🩻 **CXR - Pneumonia**\n\n**Findings:**\n• Lobar consolidation\n• Air bronchograms\n\n**Impression:**\nCommunity-acquired pneumonia.\n\n**Recommendation:**\nAntibiotics. Follow-up CXR in 6-8 weeks.`,
    effusion: `🩻 **CXR - Pleural Effusion**\n\n**Findings:**\n• Blunted costophrenic angle\n• Meniscus sign\n\n**Impression:**\nPleural effusion.\n\n**Recommendation:**\nThoracentesis with fluid analysis.`,
    pneumothorax: `🩻 **CXR - Pneumothorax**\n\n**Findings:**\n• Visceral pleural line\n• Absent lung markings\n\n**Impression:**\nPneumothorax.\n\n**Recommendation:**\nChest tube if >2cm.`,
    cardiomegaly: `🩻 **CXR - Cardiomegaly**\n\n**Findings:**\n• CTR >0.5\n• Pulmonary congestion\n\n**Impression:**\nHeart failure.\n\n**Recommendation:**\nEcho. Diuresis. ACEi/ARB.`,
  },
  ct_brain: {
    stroke: `🧠 **CT Brain - Ischemic Stroke**\n\n**Findings:**\n• Hypodensity MCA territory\n• Loss of gray-white\n\n**Impression:**\nAcute ischemic stroke.\n\n**Recommendation:**\nThrombolysis if in window.`,
    hemorrhage: `🧠 **CT Brain - ICH**\n\n**Findings:**\n• Hyperdense lesion\n• Surrounding edema\n\n**Impression:**\nIntracerebral hemorrhage.\n\n**Recommendation:**\nBP control. Neurosurgery consult.`,
  },
};

const N: Record<string, string> = {
  cxr: `🩻 **CXR - Normal**\n\n**Findings:**\n• Lungs clear\n• Heart normal\n\n**Impression:**\nNormal chest radiograph.`,
  ct_brain: `🧠 **CT Brain - Normal**\n\n**Findings:**\n• No hemorrhage\n• Ventricles normal\n\n**Impression:**\nNormal CT brain.`,
  ct_chest: `🩻 **CT Chest - Normal**\n\n**Findings:**\n• No PE\n• Lungs clear\n\n**Impression:**\nNormal CT chest.`,
  us_abd: `🔬 **US Abdomen - Normal**\n\n**Findings:**\n• Liver normal\n• No stones\n\n**Impression:**\nNormal ultrasound.`,
};

export async function buildReport(modality: string, pattern: string, diagnosis?: string, storedFindings?: string): Promise<string> {
  const tmpl = T[modality]?.[pattern];
  if (tmpl) return storedFindings ? tmpl.replace('**Findings:**', `**Findings:**\n${storedFindings.split(/[,;\n]/).map(f => f.trim()).filter(f => f).map(f => f.startsWith('•') ? f : `• ${f}`).join('\n')}`) : tmpl;
  const n = N[modality];
  if (n && pattern === 'normal') return n;
  if (diagnosis) {
    try { const ai = await getEducationalFeedback(diagnosis, '', ''); if (ai?.length > 20) return `🔬 **${modality.toUpperCase()} Report**\n\n**Findings:**\n${storedFindings || 'See image'}\n\n**AI Interpretation:**\n${ai}`; } catch {}
  }
  return `🔬 **${modality.toUpperCase()} Report**\n\n**Findings:**\n${storedFindings || 'See image'}\n\n**Impression:**\nClinical correlation required.`;
}
