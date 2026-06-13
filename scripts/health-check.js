#!/usr/bin/env node
// ============================================
// System Health Check
// ============================================

const fs = require('fs');
const path = require('path');

const CHECKS = {
  'Engine Core': () => {
    const required = [
      'src/engine/core/Kernel.ts',
      'src/engine/core/types.ts',
      'src/engine/events/EventBus.ts',
    ];
    return checkFiles(required);
  },
  
  'Plugins': () => {
    const required = [
      'src/engine/plugins/actions/HistoryPlugin.ts',
      'src/engine/plugins/actions/ExaminationPlugin.ts',
      'src/engine/plugins/actions/InvestigationPlugin.ts',
      'src/engine/plugins/actions/DiagnosisPlugin.ts',
      'src/engine/plugins/actions/TreatmentPlugin.ts',
    ];
    return checkFiles(required);
  },
  
  'Content': () => {
    const casesDir = 'medtach-content/cases';
    if (!fs.existsSync(casesDir)) return { pass: false, message: 'Content directory missing' };
    
    const specialties = fs.readdirSync(casesDir).filter(d => 
      fs.statSync(path.join(casesDir, d)).isDirectory()
    );
    
    let totalCases = 0;
    specialties.forEach(s => {
      const count = countFiles(path.join(casesDir, s));
      totalCases += count;
    });
    
    return {
      pass: totalCases > 0,
      message: `${specialties.length} specialties, ${totalCases} cases`
    };
  },
  
  'Components': () => {
    const required = [
      'app/cases/components/VitalsMonitor.tsx',
      'app/cases/components/ChatBubble.tsx',
      'app/cases/components/ActionBar.tsx',
      'app/cases/components/PhaseIndicator.tsx',
      'app/cases/components/ResultScreen.tsx',
      'app/cases/components/ReplayViewer.tsx',
    ];
    return checkFiles(required);
  },
  
  'AI Layer': () => {
    const required = [
      'src/ai/FeedbackEngine.ts',
      'src/ai/LearningPathGenerator.ts',
      'src/ai/DashboardAggregator.ts',
    ];
    return checkFiles(required);
  },
};

function checkFiles(files) {
  const missing = files.filter(f => !fs.existsSync(f));
  return {
    pass: missing.length === 0,
    message: missing.length === 0 
      ? `All ${files.length} files present` 
      : `Missing: ${missing.join(', ')}`
  };
}

function countFiles(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  function walk(d) {
    const items = fs.readdirSync(d);
    items.forEach(item => {
      const full = path.join(d, item);
      if (fs.statSync(full).isDirectory()) walk(full);
      else if (item.endsWith('.json')) count++;
    });
  }
  walk(dir);
  return count;
}

// Run checks
console.log('🏥 MedTach System Health Check\n');
console.log('═'.repeat(50));

let allPass = true;
for (const [name, check] of Object.entries(CHECKS)) {
  const result = check();
  const icon = result.pass ? '✅' : '❌';
  console.log(`${icon} ${name}: ${result.message}`);
  if (!result.pass) allPass = false;
}

console.log('═'.repeat(50));
console.log(`\n${allPass ? '✅ All systems healthy!' : '❌ Some systems need attention.'}`);
process.exit(allPass ? 0 : 1);
