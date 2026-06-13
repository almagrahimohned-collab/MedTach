// ========== Ventilator → PhysioEffects Translator ==========
import { PhysioEffects } from './physiologyEngine';
import { VentilatorSettings } from './VentilatorModal';

export function ventilatorToEffects(settings: VentilatorSettings): PhysioEffects {
  const effects: PhysioEffects = {};

  // FiO2 → Oxygenation
  // 0.21 (room air) = baseline, 1.0 = max
  effects.oxygenation = (settings.fio2 - 0.21) * 0.8;

  // PEEP → Alveolar recruitment + Venous return compromise
  const peepEffect = settings.peep / 10; // Normalize to 0-2.5
  effects.oxygenation = (effects.oxygenation || 0) + peepEffect * 0.3;
  effects.venousReturn = -peepEffect * 0.15; // High PEEP reduces venous return

  // Tidal Volume → CO2 clearance
  const tvNormalized = (settings.tidalVolume - 400) / 200; // -1 to 2
  if (tvNormalized > 1) {
    effects.airwayResistance = tvNormalized * 0.15; // Barotrauma risk
  }

  // Respiratory Rate → CO2 clearance
  const rrNormalized = (settings.respiratoryRate - 14) / 10; // -0.6 to 2
  effects.metabolicRate = -rrNormalized * 0.1; // CO2 removal

  // Pressure Support → Work of breathing
  if (settings.mode === 'PSV' || settings.mode === 'SIMV') {
    effects.oxygenation = (effects.oxygenation || 0) + settings.pressureSupport * 0.02;
  }

  // Mode-specific effects
  switch (settings.mode) {
    case 'VCV':
      // Guaranteed volume, risk of high pressures
      if (settings.peep + (settings.tidalVolume / 30) > 30) {
        effects.airwayResistance = (effects.airwayResistance || 0) + 0.2;
      }
      break;
    case 'PCV':
      // Pressure limited, volume varies
      effects.airwayResistance = -0.05; // Safer for lungs
      break;
    case 'SIMV':
      // Partial support
      effects.oxygenation = (effects.oxygenation || 0) - 0.05; // Less control
      break;
    case 'PSV':
      // Patient-dependent
      effects.oxygenation = (effects.oxygenation || 0) - 0.1; // Variable
      break;
  }

  return effects;
}

// ========== Ventilator Alert Checks ==========
export function checkVentilatorAlerts(settings: VentilatorSettings): string[] {
  const alerts: string[] = [];

  // High pressure alert
  const plateauPressure = settings.peep + (settings.tidalVolume / 30);
  if (plateauPressure > 30) {
    alerts.push('⚠️ High plateau pressure >30 cmH₂O - risk of barotrauma');
  }
  if (plateauPressure > 35) {
    alerts.push('🚨 Critical plateau pressure >35 cmH₂O!');
  }

  // High FiO2
  if (settings.fio2 > 0.8) {
    alerts.push('⚠️ High FiO₂ >0.8 - consider lung protective strategies');
  }

  // High PEEP
  if (settings.peep > 18) {
    alerts.push('⚠️ High PEEP >18 cmH₂O - may impair venous return');
  }

  // High tidal volume
  if (settings.tidalVolume > 600) {
    alerts.push('⚠️ High tidal volume - consider ARDSNet protocol (6 mL/kg)');
  }

  // Low FiO2 with poor SpO2
  if (settings.fio2 < 0.4) {
    alerts.push('💡 Low FiO₂ - ensure adequate oxygenation');
  }

  return alerts;
}
