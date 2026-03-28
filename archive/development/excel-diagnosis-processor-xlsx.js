const fs = require('fs');
const XLSX = require('xlsx');

// Import the exact Diagnosis and displayDiag functions from the web app
// Gold standard diagnosis algorithm (extracted from useAcidBase.js)

const Diagnosis = (pH, pv, hv, nav, clv, albuminv, UrC, CCo2C, ExacC) => {
  let diagnosis = '';
  let anionGap = 0;
  let agStatus = '';
  let agValue = 0;
  let urineChlorideStatus = '';
  let urineChlorideText = '';
  let compensationStatus = '';
  let compensationText = '';
  let chronicCo2Status = '';
  let chronicCo2Text = '';
  let exacerbationStatus = '';
  let exacerbationText = '';

  // Gold standard pH calculation
  const pHc = 6.1 + (Math.log10(hv / (0.03 * pv)) / Math.log10(10));
  const pHcRounded = Number((pHc).toFixed(2));
  
  // Check if calculated pH matches input pH (gold standard validation)
  if (Math.abs(pHcRounded - pH) > 0.1) {
    return {
      diagnosis: "Calculated PH = " + pHcRounded + " Please Review Input Values",
      anionGap: agValue,
      compensation: compensationStatus,
      compensationText,
      chronicCo2: chronicCo2Status,
      chronicCo2Text,
      exacerbation: exacerbationStatus,
      exacerbationText,
      urineChloride: urineChlorideText
    };
  }

  // Gold standard normal ranges
  const ph1 = 7.3;
  const ph2 = 7.5;
  const p1 = 35;
  const p2 = 45;
  const h1 = 22;
  const h2 = 28;
  
  let x1, x2;
  let Diag2 = '';
  let DiagAG = '';
  let AG;
  let HG;

  // Gold standard diagnosis logic
  if (pH >= 7.35 && pH <= 7.45 && pv >= 35 && pv <= 45 && hv >= 22 && hv <= 28) {
    diagnosis = "Normal, Check Anion Gap";
  }
  // Chronic respiratory acidosis cases
  else if (pH < 7.3 && CCo2C && pv <= 57 && hv < 24 && !ExacC) {
    diagnosis = "Chronic Respiratory Acidosis + Metabolic Acidosis";
  }
  else if (pH < 7.3 && CCo2C && pv > 2 * hv - 8 && hv >= 30 && ExacC) {
    diagnosis = "Acute on Top of Chronic Respiratory Acidosis";
  }
  else if (pH < 7.3 && CCo2C && pv > 57 && hv < 24 && ExacC) {
    diagnosis = "Acute on Top of Chronic Respiratory Acidosis + Metabolic Acidosis";
  }
  // Main acidosis/alkalosis logic
  else if (pH < 7.4) {
    diagnosis = " Acidosis";
    if (pv >= p2) {
      x1 = 1;
      x2 = 4;
      Diag2 = "Acidosis";
      diagnosis = "Respiratory" + diagnosis;
      
      // Compensation logic
      if (pH < ph1 || pH > ph2) {
        diagnosis = "Acute" + diagnosis;
        const eq = 22 - (((40 - pv) / 10) * x1);
        const eq1 = 28 - (((40 - pv) / 10) * x1);
        if (hv > eq && hv < eq1) {
          diagnosis = "Simple Acute Respiratory " + Diag2;
        } else if (hv < eq) {
          diagnosis = "Acute Respiratory " + Diag2 + " + Metabolic Acidosis.";
        } else if (hv > eq1) {
          diagnosis = "Acute Respiratory " + Diag2 + " + Metabolic Alkalosis.";
        }
      } else if (pH >= ph1 && pH <= ph2) {
        diagnosis = "Chronic " + diagnosis;
        const eq = 22 - (((40 - pv) / 10) * x2);
        const eq1 = 28 - (((40 - pv) / 10) * x2);
        if (hv > eq && hv < eq1) {
          diagnosis = "Simple Chronic Respiratory " + Diag2;
        } else if (hv < eq) {
          diagnosis = "Chronic Respiratory " + Diag2 + " + Metabolic Acidosis.";
        } else if (hv > eq1) {
          diagnosis = "Chronic Respiratory " + Diag2 + " + Metabolic Alkalosis.";
        }
      }
    } else if (pv < p2) {
      diagnosis = " - Metabolic" + diagnosis;
      
      // Metabolic acidosis compensation
      if (pH < ph1 || pH > ph2) {
        if (pv <= p2 && pv >= p1) {
          diagnosis = "Uncompensated " + diagnosis;
          Diag2 = "Uncompensated ";
        } else if (pv > p2 || pv < p1) {
          diagnosis = "Partially Compensated " + diagnosis;
          Diag2 = "Partially Compensated ";
        }
      }
      if (pH >= ph1 && pH <= ph2) {
        diagnosis = "Compensated " + diagnosis;
        Diag2 = "Compensated ";
      }
      
      if (pv >= 0.9 * (1.5 * hv + 4) && pv <= 1.1 * (1.5 * hv + 12)) {
        diagnosis = Diag2 + "Simple Metabolic Acidosis";
      } else if (pv < 0.9 * (1.5 * hv + 4)) {
        diagnosis = Diag2 + "Metabolic Acidosis + Respiratory Alkalosis";
      } else if (pv > 1.1 * (1.5 * hv + 12)) {
        diagnosis = Diag2 + "Metabolic Acidosis + Respiratory Acidosis";
      }
    }
  }
  else if (pH >= 7.4) {
    if (!CCo2C) {
      diagnosis = " - Alkalosis";
      if (pv < 35) {
        x1 = 2;
        x2 = 5;
        Diag2 = " Alkalosis";
        diagnosis = "Respiratory" + diagnosis;
        
        // Respiratory alkalosis compensation
        if (pH < ph1 || pH > ph2) {
          if (pv <= p2 && pv >= p1) {
            diagnosis = "Uncompensated " + diagnosis;
            Diag2 = "Uncompensated ";
          } else if (pv > p2 || pv < p1) {
            diagnosis = "Partially Compensated " + diagnosis;
            Diag2 = "Partially Compensated ";
          }
        }
        if (pH >= ph1 && pH <= ph2) {
          diagnosis = "Compensated " + diagnosis;
          Diag2 = "Compensated ";
        }
        if (pv >= 0.9 * (0.7 * hv + 15) && pv <= 1.1 * (0.7 * hv + 15)) {
          diagnosis = Diag2 + "Simple Respiratory Alkalosis";
        } else if (pv < 0.9 * (0.7 * hv + 15)) {
          diagnosis = Diag2 + "Respiratory Alkalosis + Metabolic Alkalosis";
        } else if (pv > 1.1 * (0.7 * hv + 15)) {
          diagnosis = Diag2 + "Respiratory Alkalosis + Metabolic Acidosis";
        }
      } else if (hv > 28) {
        x1 = 2;
        x2 = 5;
        Diag2 = " Alkalosis";
        diagnosis = "Metabolic" + diagnosis;
        
        // Metabolic alkalosis compensation
        if (pH < ph1 || pH > ph2) {
          if (pv <= p2 && pv >= p1) {
            diagnosis = "Uncompensated " + diagnosis;
            Diag2 = "Uncompensated ";
          } else if (pv > p2 || pv < p1) {
            diagnosis = "Partially Compensated " + diagnosis;
            Diag2 = "Partially Compensated ";
          }
        }
        if (pH >= ph1 && pH <= ph2) {
          diagnosis = "Compensated " + diagnosis;
          Diag2 = "Compensated ";
        }
        if (pv >= 0.9 * (0.7 * hv + 15) && pv <= 1.1 * (0.7 * hv + 15)) {
          diagnosis = Diag2 + "Simple Metabolic Alkalosis";
        } else if (pv < 0.9 * (0.7 * hv + 15)) {
          diagnosis = Diag2 + "Metabolic Alkalosis + Respiratory Alkalosis";
        } else if (pv > 1.1 * (0.7 * hv + 15)) {
          diagnosis = Diag2 + "Metabolic Alkalosis + Respiratory Acidosis";
        }
      }
    }
  }

  // Anion gap calculation
  if (nav && clv && albuminv) {
    const na = parseFloat(nav);
    const cl = parseFloat(clv);
    const albumin = parseFloat(albuminv);
    
    if (!isNaN(na) && !isNaN(cl) && !isNaN(albumin)) {
      AG = na - cl - albumin;
      agValue = AG;
      agStatus = AG > 12 ? "High Anion Gap" : AG < 6 ? "Low Anion Gap" : "Normal Anion Gap";
      
      if (diagnosis.includes("Metabolic Acidosis")) {
        if (AG > 12) {
          DiagAG = "High Anion Gap ";
        } else if (AG < 6) {
          DiagAG = "Low Anion Gap ";
        }
        diagnosis = diagnosis.replace("Metabolic Acidosis", DiagAG + "Metabolic Acidosis");
      }
    }
  }

  // Urine chloride status
  if (UrC && (diagnosis.includes("Metabolic Alkalosis") || diagnosis.includes("Metabolic Acidosis"))) {
    const urineCl = parseFloat(UrC);
    if (!isNaN(urineCl)) {
      if (urineCl < 20) {
        urineChlorideStatus = " (Low Urine Chloride)";
        urineChlorideText = "Low Urine Chloride suggests contraction alkalosis or diarrhea";
      } else if (urineCl > 40) {
        urineChlorideStatus = " (High Urine Chloride)";
        urineChlorideText = "High Urine Chloride suggests diuretic use or renal tubular acidosis";
      } else {
        urineChlorideStatus = " (Normal Urine Chloride)";
        urineChlorideText = "Normal Urine Chloride";
      }
    }
  }

  return {
    diagnosis: diagnosis.trim(),
    anionGap: agValue,
    compensation: compensationStatus,
    compensationText,
    chronicCo2: chronicCo2Status,
    chronicCo2Text,
    exacerbation: exacerbationStatus,
    exacerbationText,
    urineChloride: urineChlorideText
  };
};

const displayDiag = (result) => {
  let display = result.diagnosis;
  
  if (result.compensation) {
    display += result.compensation;
  }
  
  if (result.chronicCo2) {
    display += result.chronicCo2;
  }
  
  if (result.exacerbation) {
    display += result.exacerbation;
  }
  
  return display;
};

// Calculate SIG and BDE for additional info
function calculateAdditionalInfo(K, Ca, Mg, Lactate, PO4, SBD, nav, clv, albuminv, pH, hv) {
    let sigResult = "";
    let bdeResult = "";
    
    if (K && Ca && Mg && Lactate && PO4 && SBD && parseFloat(SBD) > 0) {
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
        return `${sigResult} | ${bdeResult}`;
    }
    
    return "";
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

// Process CSV file and create XLSX outputs
function processCSV() {
    const inputFile = 'acid base  Xls_mod_MAR__25_12.csv';
    const detailedOutputFile = 'acid base  Xls_mod_MAR__25_12_with_diagnosis.xlsx';
    const formulaOutputFile = 'acid base  Xls_mod_MAR__25_12_with_formulas.xlsx';
    
    const data = fs.readFileSync(inputFile, 'utf8');
    const lines = data.split('\n').filter(line => line.trim());
    
    // Parse header
    const header = lines[0].split(',').map(h => h.trim());
    
    // Add new columns including full diagnosis
    const detailedHeader = [...header, 'Full_Diagnosis', 'Primary_Diagnosis', 'Compensation_Type', 'Severity_Classification', 'Additional_Info', 'pHc_Calculated'];
    const formulaHeader = [...header, 'Excel_Diagnosis', 'Excel_Severity', 'Excel_Compensation'];
    
    const detailedData = [detailedHeader];
    const formulaData = [formulaHeader];
    
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
        
        // Calculate diagnosis using the exact web app logic
        const UrC = ""; // Urine chloride not available in CSV
        const CCo2C = false; // CO2 check not available in CSV
        const ExacC = false; // Exacerbation check not available in CSV
        const diagnosisResult = Diagnosis(pH, pv, hv, nav, clv, albuminv, UrC, CCo2C, ExacC);
        const fullDiagnosis = displayDiag(diagnosisResult);
        
        // Calculate additional info (SIG/BDE)
        const additionalInfo = calculateAdditionalInfo(K, Ca, Mg, Lactate, PO4, SBD, nav, clv, albuminv, pH, hv);
        
        // Calculate pHc for validation
        const pHc = 6.1 + (Math.log10(hv / (0.03 * pv)) / Math.log10(10));
        
        if (Math.abs(pHc - pH) > 0.1) {
            errorCount++;
        } else {
            processedCount++;
        }
        
        // Extract simplified diagnosis for other columns
        let primaryDiagnosis = "";
        let compensationType = "";
        let severity = "";
        
        if (fullDiagnosis.includes("Calculated PH")) {
            primaryDiagnosis = "Error";
            compensationType = "Error";
            severity = "Error";
        } else {
            // Extract primary diagnosis
            if (fullDiagnosis.includes("Respiratory Acidosis")) {
                primaryDiagnosis = "Respiratory Acidosis";
            } else if (fullDiagnosis.includes("Metabolic Acidosis")) {
                primaryDiagnosis = "Metabolic Acidosis";
            } else if (fullDiagnosis.includes("Respiratory Alkalosis")) {
                primaryDiagnosis = "Respiratory Alkalosis";
            } else if (fullDiagnosis.includes("Metabolic Alkalosis")) {
                primaryDiagnosis = "Metabolic Alkalosis";
            } else if (fullDiagnosis.includes("Normal")) {
                primaryDiagnosis = "Normal";
            } else {
                primaryDiagnosis = "Mixed";
            }
            
            // Extract compensation
            if (fullDiagnosis.includes("Compensated")) {
                compensationType = "Compensated";
            } else if (fullDiagnosis.includes("Uncompensated")) {
                compensationType = "Uncompensated";
            } else if (fullDiagnosis.includes("Partially Compensated")) {
                compensationType = "Partially Compensated";
            } else {
                compensationType = "None";
            }
            
            // Extract severity
            if (fullDiagnosis.includes("Acute")) {
                severity = "Acute";
            } else if (fullDiagnosis.includes("Chronic")) {
                severity = "Chronic";
            } else if (pH < 7.2 || pH > 7.6) {
                severity = "Severe";
            } else if (pH >= 7.3 && pH <= 7.5) {
                severity = "Mild";
            } else {
                severity = "Moderate";
            }
        }
        
        // Add detailed diagnosis columns
        const detailedRow = [...values, fullDiagnosis, primaryDiagnosis, compensationType, severity, additionalInfo, pHc.toFixed(2)];
        detailedData.push(detailedRow);
        
        // Generate Excel formulas
        const excelDiagnosis = generateExcelFormula(i + 1);
        const excelSeverity = generateSeverityFormula(i + 1);
        const excelCompensation = generateCompensationFormula(i + 1);
        
        // Add formula columns
        const formulaRow = [...values, excelDiagnosis, excelSeverity, excelCompensation];
        formulaData.push(formulaRow);
        
        console.log(`Processed: ${caseName} - ${primaryDiagnosis}`);
    }
    
    // Create XLSX workbooks with proper data structure
    const detailedWB = XLSX.utils.book_new();
    const detailedWS = XLSX.utils.aoa_to_sheet(detailedData);
    XLSX.utils.book_append_sheet(detailedWB, detailedWS, "Diagnosis Results");
    
    const formulaWB = XLSX.utils.book_new();
    const formulaWS = XLSX.utils.aoa_to_sheet(formulaData);
    XLSX.utils.book_append_sheet(formulaWB, formulaWS, "Excel Formulas");
    
    // Ensure headers are properly set
    XLSX.utils.sheet_add_aoa(detailedWS, [detailedHeader], {origin: "A1"});
    XLSX.utils.sheet_add_aoa(formulaWS, [formulaHeader], {origin: "A1"});
    
    // Apply formatting to make it Excel files more professional
    formatWorksheet(detailedWS, detailedData.length, detailedData[0].length);
    formatWorksheet(formulaWS, formulaData.length, formulaData[0].length);
    
    // Write XLSX files
    XLSX.writeFile(detailedWB, detailedOutputFile);
    XLSX.writeFile(formulaWB, formulaOutputFile);
    
    console.log(`\n=== Processing Complete ===`);
    console.log(`Total cases processed: ${lines.length - 1}`);
    console.log(`Successful diagnoses: ${processedCount}`);
    console.log(`Errors encountered: ${errorCount}`);
    console.log(`\nXLSX Output files created:`);
    console.log(`1. Detailed diagnosis: ${detailedOutputFile}`);
    console.log(`2. Excel formulas: ${formulaOutputFile}`);
}

// Format worksheet for better appearance
function formatWorksheet(ws, rowCount, colCount) {
    // Set column widths
    const colWidths = [];
    for (let i = 0; i < colCount; i++) {
        colWidths.push({ wch: 20 }); // Increased width for full diagnosis
    }
    ws['!cols'] = colWidths;
    
    // Freeze header row
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };
    
    // Add header styling (bold text)
    for (let col = 0; col < colCount; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!ws[cellAddress]) continue;
        ws[cellAddress].s = {
            font: { bold: true },
            fill: { fgColor: { rgb: "E6E6FA" } }, // Light lavender background
            alignment: { horizontal: "center", wrapText: true }
        };
    }
}

// Run the processor
processCSV();
