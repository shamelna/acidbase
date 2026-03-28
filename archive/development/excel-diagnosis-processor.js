const fs = require('fs');
const path = require('path');

// Gold standard diagnosis algorithm (extracted from useAcidBase.js)
function calculateDiagnosis(pH, pv, hv, nav, clv, albuminv, UrC, CCo2C, ExacC, K, Ca, Mg, Lactate, PO4, SBD) {
    // pHc calculation
    const pHc = 6.1 + (Math.log10(hv / (0.03 * pv)) / Math.log10(10));
    
    // Check if |pHc - pH| > 0.1 -> error
    if (Math.abs(pHc - pH) > 0.1) {
        return {
            error: `pHc calculation error: pHc=${pHc.toFixed(2)}, pH=${pH}`,
            diagnosis: "Invalid Data"
        };
    }
    
    // Normal ranges
    const pHNormal = pH >= 7.35 && pH <= 7.45;
    const pvNormal = pv >= 35 && pv <= 45;
    const hvNormal = hv >= 22 && hv <= 28;
    
    let primaryDiagnosis = "";
    let compensationType = "";
    let severity = "";
    let additionalInfo = "";
    
    // pH-based diagnosis
    if (pH < 7.35) {
        primaryDiagnosis = "Acidosis";
        if (pv > 45) {
            primaryDiagnosis = "Respiratory Acidosis";
            if (hv > 28) {
                compensationType = "Metabolic Compensation";
            } else {
                compensationType = "No Compensation";
            }
        } else if (hv < 22) {
            primaryDiagnosis = "Metabolic Acidosis";
            if (pv < 35) {
                compensationType = "Respiratory Compensation";
            } else {
                compensationType = "No Compensation";
            }
        }
    } else if (pH > 7.45) {
        primaryDiagnosis = "Alkalosis";
        if (pv < 35) {
            primaryDiagnosis = "Respiratory Alkalosis";
            if (hv > 28) {
                compensationType = "Metabolic Compensation";
            } else {
                compensationType = "No Compensation";
            }
        } else if (hv > 28) {
            primaryDiagnosis = "Metabolic Alkalosis";
            if (pv > 45) {
                compensationType = "Respiratory Compensation";
            } else {
                compensationType = "No Compensation";
            }
        }
    } else {
        primaryDiagnosis = "Normal";
        compensationType = "Normal";
    }
    
    // Severity classification
    if (pv !== 40 && hv !== 24) {
        severity = pH < 7.2 || pH > 7.6 ? "Severe" : "Moderate";
    } else {
        severity = "Mild";
    }
    
    // Calculate SIG and BDE if values available
    let sigResult = "";
    let bdeResult = "";
    
    if (K && Ca && Mg && Lactate && PO4 && SBD && SBD > 0) {
        const k = parseFloat(K);
        const ca = parseFloat(Ca);
        const mg = parseFloat(Mg);
        const lactate = parseFloat(Lactate);
        const po4 = parseFloat(PO4);
        const sbd = parseFloat(SBD);
        const navValue = parseFloat(nav);
        const clValue = parseFloat(clv);
        const albuminValue = parseFloat(albuminv);
        const pHValue = parseFloat(pH);
        const hvValue = parseFloat(hv);
        
        // Gold standard SIG calculation
        const Calc_SIG = navValue + ca + mg + k - (clValue + lactate) - (hvValue + albuminValue * (0.123 * pHValue - 0.631) + po4 * (0.309 * pHValue - 0.469));
        
        // Gold standard BDE Gap calculation  
        const Calc_BDE = -1 * sbd - (navValue - clValue - 38) + 0.25 * (42 - albuminValue);
        
        const sigStatus = Calc_SIG > 2 ? " (Abnormal Anion)" : " (Normal Value)";
        
        sigResult = `SIG=${Calc_SIG.toFixed(2)}${sigStatus}`;
        bdeResult = `BDE Gap=${Calc_BDE.toFixed(2)}`;
        additionalInfo = `${sigResult} | ${bdeResult}`;
    }
    
    return {
        primaryDiagnosis,
        compensationType,
        severity,
        additionalInfo,
        pHc: pHc.toFixed(2),
        normalRanges: { pH: pHNormal, PaCO2: pvNormal, HCO3: hvNormal }
    };
}

// Generate comprehensive Excel formula for diagnosis
function generateExcelFormula(rowNumber) {
    return `=IF(AND(B${rowNumber}>=7.35,B${rowNumber}<=7.45),"Normal",IF(B${rowNumber}<7.35,IF(K${rowNumber}>45,IF(M${rowNumber}>28,"Respiratory Acidosis with Metabolic Compensation","Respiratory Acidosis without Compensation"),IF(M${rowNumber}<22,IF(K${rowNumber}<35,"Metabolic Acidosis with Respiratory Compensation","Metabolic Acidosis without Compensation"),"Mixed Acidosis")),IF(K${rowNumber}<35,IF(M${rowNumber}>28,"Respiratory Alkalosis with Metabolic Compensation","Respiratory Alkalosis without Compensation"),IF(M${rowNumber}>28,IF(K${rowNumber}>45,"Metabolic Alkalosis with Respiratory Compensation","Metabolic Alkalosis without Compensation"),"Mixed Alkalosis")))))`;
}

// Generate Excel formula for severity
function generateSeverityFormula(rowNumber) {
    return `=IF(OR(B${rowNumber}<7.2,B${rowNumber}>7.6),"Severe",IF(AND(B${rowNumber}>7.3,B${rowNumber}<7.5),"Mild","Moderate"))`;
}

// Generate Excel formula for compensation
function generateCompensationFormula(rowNumber) {
    return `=IF(AND(B${rowNumber}>=7.35,B${rowNumber}<=7.45),"Normal",IF(B${rowNumber}<7.35,IF(K${rowNumber}>45,IF(M${rowNumber}>28,"Metabolic","None"),IF(M${rowNumber}<22,IF(K${rowNumber}<35,"Respiratory","None"),"Mixed")),IF(K${rowNumber}<35,IF(M${rowNumber}>28,"Metabolic","None"),IF(M${rowNumber}>28,IF(K${rowNumber}>45,"Respiratory","None"),"Mixed"))))`;
}

// Process CSV file
function processCSV() {
    const inputFile = 'acid base  Xls_mod_MAR__25_12.csv';
    const outputFile = 'acid base  Xls_mod_MAR__25_12_with_diagnosis.csv';
    const excelOutputFile = 'acid base  Xls_mod_MAR__25_12_with_formulas.csv';
    
    const data = fs.readFileSync(inputFile, 'utf8');
    const lines = data.split('\n').filter(line => line.trim());
    
    // Parse header
    const header = lines[0].split(',').map(h => h.trim());
    
    // Add new columns for detailed diagnosis
    const detailedHeader = [...header, 'Primary_Diagnosis', 'Compensation_Type', 'Severity_Classification', 'Additional_Info', 'pHc_Calculated'];
    const formulaHeader = [...header, 'Excel_Diagnosis', 'Excel_Severity', 'Excel_Compensation'];
    
    const detailedResults = [detailedHeader.join(',')];
    const formulaResults = [formulaHeader.join(',')];
    
    let processedCount = 0;
    let errorCount = 0;
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(',').map(v => v.trim());
        const caseName = values[0] || `Case_${i}`;
        
        // Extract required values based on CSV structure
        const pH = parseFloat(values[1]) || 0;
        const pv = parseFloat(values[10]) || 0; // PCO2 (first occurrence)
        const hv = parseFloat(values[12]) || 0; // HCO3
        const nav = parseFloat(values[4]) || 0; // Na
        const clv = parseFloat(values[8]) || 0; // Cl
        const albuminv = parseFloat(values[13]) || 0; // albumin
        const K = values[5]; // K
        const Ca = values[7]; // Ca
        const Mg = values[6]; // Mg
        const Lactate = values[18]; // lactate
        const PO4 = values[17]; // PO4
        const SBD = values[3]; // BE (Base Excess)
        
        // Calculate diagnosis
        const UrC = ""; // Urine chloride not available in CSV
        const CCo2C = false; // CO2 check not available in CSV
        const ExacC = false; // Exacerbation check not available in CSV
        const diagnosis = calculateDiagnosis(pH, pv, hv, nav, clv, albuminv, UrC, CCo2C, ExacC, K, Ca, Mg, Lactate, PO4, SBD);
        
        if (diagnosis.error) {
            errorCount++;
        } else {
            processedCount++;
        }
        
        // Format detailed diagnosis
        const primaryDiagnosis = diagnosis.error ? "Error" : diagnosis.primaryDiagnosis;
        const compensationType = diagnosis.error ? "Error" : diagnosis.compensationType;
        const severity = diagnosis.error ? "Error" : diagnosis.severity;
        const additionalInfo = diagnosis.error ? diagnosis.error : diagnosis.additionalInfo;
        const pHcCalculated = diagnosis.error ? "Error" : diagnosis.pHc;
        
        // Add detailed diagnosis columns
        const detailedRow = [...values, primaryDiagnosis, compensationType, severity, additionalInfo, pHcCalculated];
        detailedResults.push(detailedRow.join(','));
        
        // Generate Excel formulas
        const excelDiagnosis = generateExcelFormula(i + 1);
        const excelSeverity = generateSeverityFormula(i + 1);
        const excelCompensation = generateCompensationFormula(i + 1);
        
        // Add formula columns
        const formulaRow = [...values, excelDiagnosis, excelSeverity, excelCompensation];
        formulaResults.push(formulaRow.join(','));
        
        console.log(`Processed: ${caseName} - ${primaryDiagnosis}`);
    }
    
    // Write output files
    fs.writeFileSync(outputFile, detailedResults.join('\n'));
    fs.writeFileSync(excelOutputFile, formulaResults.join('\n'));
    
    console.log(`\n=== Processing Complete ===`);
    console.log(`Total cases processed: ${lines.length - 1}`);
    console.log(`Successful diagnoses: ${processedCount}`);
    console.log(`Errors encountered: ${errorCount}`);
    console.log(`\nOutput files:`);
    console.log(`1. Detailed diagnosis: ${outputFile}`);
    console.log(`2. Excel formulas: ${excelOutputFile}`);
}

// Run the processor
processCSV();
