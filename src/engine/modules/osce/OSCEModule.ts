import ModuleRegistry from '../ModuleRegistry';

export function registerOSCEModule(): void {
  const registry = ModuleRegistry.getInstance();
  registry.register({
    name: 'osce',
    version: '1.0.0',
    description: 'OSCE — Objective Structured Clinical Examination',
    plugins: [],
    enabled: true,
  });
  console.log('[OSCEModule] Registered');
}

export default registerOSCEModule;
