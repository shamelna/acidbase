// Test calculations against gold standard
import { calcPHc, calcAnionGap, calcHG, runDiagnosis } from './src/utils/diagnosisEngine.js';

console.log('=== TESTING CALCULATION ACCURACY ===\n');

// Test Case 1: Normal values
console.log('TEST 1: Normal Values');
const pH1 = 7.40, pv1 = 40, hv1 = 24, nav1 = 140, clv1 = 100, albuminv1 = 40;
const pHc1 = calcPHc(hv1, pv1);
const AG1 = calcAnionGap(nav1, clv1, hv1, albuminv1);
console.log(`pH: ${pH1}, PaCO2: ${pv1}, HCO3: ${hv1}`);
console.log(`Calculated pHc: ${pHc1} (Expected: ~7.40)`);
console.log(`Anion Gap: ${AG1} (Expected: ~12)`);
console.log(`pHc-pH difference: ${Math.abs(pHc1 - pH1)} (Expected: < 0.1)`);
console.log('');

// Test Case 2: Respiratory Acidosis
console.log('TEST 2: Respiratory Acidosis');
const pH2 = 7.30, pv2 = 60, hv2 = 28, nav2 = 140, clv2 = 100, albuminv2 = 40;
const pHc2 = calcPHc(hv2, pv2);
const AG2 = calcAnionGap(nav2, clv2, hv2, albuminv2);
console.log(`pH: ${pH2}, PaCO2: ${pv2}, HCO3: ${hv2}`);
console.log(`Calculated pHc: ${pHc2} (Expected: ~7.30)`);
console.log(`Anion Gap: ${AG2} (Expected: ~12)`);
console.log(`pHc-pH difference: ${Math.abs(pHc2 - pH2)} (Expected: < 0.1)`);
console.log('');

// Test Case 3: Metabolic Acidosis
console.log('TEST 3: Metabolic Acidosis');
const pH3 = 7.25, pv3 = 30, hv3 = 15, nav3 = 140, clv3 = 105, albuminv3 = 40;
const pHc3 = calcPHc(hv3, pv3);
const AG3 = calcAnionGap(nav3, clv3, hv3, albuminv3);
const HG3 = calcHG(nav3, clv3);
console.log(`pH: ${pH3}, PaCO2: ${pv3}, HCO3: ${hv3}`);
console.log(`Calculated pHc: ${pHc3} (Expected: ~7.25)`);
console.log(`Anion Gap: ${AG3} (Expected: > 12)`);
console.log(`HG: ${HG3} (Expected: ${nav3} - ${clv3} - 36 = ${140 - 105 - 36})`);
console.log(`pHc-pH difference: ${Math.abs(pHc3 - pH3)} (Expected: < 0.1)`);
console.log('');

// Test Case 4: High Anion Gap
console.log('TEST 4: High Anion Gap Metabolic Acidosis');
const pH4 = 7.15, pv4 = 25, hv4 = 10, nav4 = 140, clv4 = 95, albuminv4 = 30;
const pHc4 = calcPHc(hv4, pv4);
const AG4 = calcAnionGap(nav4, clv4, hv4, albuminv4);
const HG4 = calcHG(nav4, clv4);
console.log(`pH: ${pH4}, PaCO2: ${pv4}, HCO3: ${hv4}`);
console.log(`Calculated pHc: ${pHc4} (Expected: ~7.15)`);
console.log(`Anion Gap: ${AG4} (Expected: > 12)`);
console.log(`HG: ${HG4} (Expected: ${nav4} - ${clv4} - 36 = ${140 - 95 - 36})`);
console.log(`pHc-pH difference: ${Math.abs(pHc4 - pH4)} (Expected: < 0.1)`);
console.log('');

// Test Diagnosis Logic
console.log('=== TESTING DIAGNOSIS LOGIC ===\n');

// Test Normal Case
const diag1 = runDiagnosis({ 
  pH: 7.40, pv: 40, hv: 24, nav: 140, clv: 100, albuminv: 40, 
  CCo2: 0, Exac: 0, UrC: null 
});
console.log(`Normal Case Diagnosis: ${diag1}`);
console.log(`Expected: "Normal, Check Anion Gap"`);
console.log('');

// Test Chronic Respiratory Acidosis + Metabolic Acidosis
const diag2 = runDiagnosis({ 
  pH: 7.25, pv: 55, hv: 22, nav: 140, clv: 100, albuminv: 40, 
  CCo2: 1, Exac: 0, UrC: null 
});
console.log(`Chronic Resp Acidosis + Met Acidosis Diagnosis: ${diag2}`);
console.log(`Expected: "Chronic Respiratory Acidosis + Metabolic Acidosis"`);
console.log('');

// Test Acute Respiratory Acidosis
const diag3 = runDiagnosis({ 
  pH: 7.20, pv: 65, hv: 25, nav: 140, clv: 100, albuminv: 40, 
  CCo2: 0, Exac: 0, UrC: null 
});
console.log(`Acute Respiratory Acidosis Diagnosis: ${diag3}`);
console.log(`Expected: "Acute Respiratory Acidosis + Metabolic Acidosis."`);
console.log('');

// Test Metabolic Acidosis
const diag4 = runDiagnosis({ 
  pH: 7.25, pv: 30, hv: 15, nav: 140, clv: 105, albuminv: 40, 
  CCo2: 0, Exac: 0, UrC: null 
});
console.log(`Metabolic Acidosis Diagnosis: ${diag4}`);
console.log(`Expected: Contains "Metabolic Acidosis" and anion gap info`);
console.log('');

console.log('=== ACCURACY VERIFICATION COMPLETE ===');
