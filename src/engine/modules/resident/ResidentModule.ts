import ModuleRegistry from '../ModuleRegistry';

export function registerResidentModule(): void {
  const registry = ModuleRegistry.getInstance();
  registry.register({
    name: 'resident',
    version: '1.0.0',
    description: 'Resident Life — Hospital Shift Simulation',
    plugins: [],
    enabled: true,
  });
  console.log('[ResidentModule] Registered');
}

export default registerResidentModule;
