// Acid-base diagnosis calculation logic - Gold Standard

export const Diagnosis = (pH, pv, hv, nav, clv, albuminv, UrC, CCo2C, ExacC) => {
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
          diagnosis = Diag2 + "Simple Metabolic Alkalosis";
        } else if (pv < 0.9 * (0.7 * hv + 15)) {
          diagnosis = Diag2 + "Metabolic Alkalosis + Respiratory Alkalosis";
        } else if (pv > 1.1 * (0.7 * hv + 15)) {
          diagnosis = Diag2 + "Metabolic Alkalosis + Respiratory Acidosis";
        }
      } else {
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
    } else if (CCo2C) {
      if (!UrC) {
        return {
          diagnosis: "Value of Ur. Chloride is Required",
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
      diagnosis = "Chronic Respiratory Acidosis + Metabolic Alkalosis (";
      if (pv <= 0.92 * (2 * hv - 8)) {
        if (UrC < 20) {
          diagnosis = diagnosis + "Post-Hypercapnic)";
        } else {
          diagnosis = diagnosis + "Mixed)";
        }
      } else if (UrC >= 20) {
        diagnosis = diagnosis + "Independent, Chloride Resistant and/or Diuresis)";
      } else {
        diagnosis = diagnosis + "Independent, Chloride Responsive, Extra-Renal Loss of Chloride)";
      }
    }
  }

  // Gold standard anion gap calculation for metabolic acidosis
  if (diagnosis.includes("Metabolic Acidosis")) {
    if (!nav || !clv || !albuminv) {
      return {
        diagnosis: "Please Complete Input Values for Na, CL & Albumin",
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
    
    // Gold standard anion gap formula
    AG = nav - (clv + hv) + 0.25 * (44 - albuminv);
    agValue = AG.toFixed(1);
    
    if (AG <= 12) {
      agStatus = "\n(Normal Anion Gap Acidosis)";
      diagnosis += agStatus;
    } else if (AG > 12) {
      HG = nav - clv - 36;
      if (HG > 6) {
        agStatus = "\n(High Anion Gap Metabolic Acidosis + Metabolic Alkalosis)";
        diagnosis += agStatus;
      } else if (HG < -6) {
        agStatus = "\n(High Anion Gap Metabolic Acidosis + Normal Anion Gap Acidosis)";
        diagnosis += agStatus;
      } else {
        agStatus = "\n(High Anion Gap Metabolic Acidosis)";
        diagnosis += agStatus;
      }
    }
  }

  return {
    diagnosis,
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

export const resp = (pv) => {
  const paCo2Value = parseFloat(pv);
  if (isNaN(paCo2Value)) return '';
  
  if (paCo2Value > 45) return 'Respiratory Acidosis';
  if (paCo2Value < 35) return 'Respiratory Alkalosis';
  return 'Normal Respiratory Status';
};

export const metacid = (hv, nav, clv, albuminv) => {
  const hCo3Value = parseFloat(hv);
  if (isNaN(hCo3Value)) return '';
  
  if (hCo3Value < 22) {
    if (nav && clv && albuminv) {
      const na = parseFloat(nav);
      const cl = parseFloat(clv);
      const albumin = parseFloat(albuminv);
      
      if (!isNaN(na) && !isNaN(cl) && !isNaN(albumin)) {
        const correctedCl = cl + (2.5 * (4.4 - albumin));
        const anionGap = na - correctedCl;
        
        if (anionGap > 12) {
          return 'High Anion Gap Metabolic Acidosis';
        } else if (anionGap < 6) {
          return 'Low Anion Gap Metabolic Acidosis';
        }
      }
    }
    return 'Metabolic Acidosis';
  }
  return 'Normal Metabolic Status';
};

export const metalk = (hv, UrC) => {
  const hCo3Value = parseFloat(hv);
  if (isNaN(hCo3Value)) return '';
  
  if (hCo3Value > 28) {
    if (UrC) {
      const urineCl = parseFloat(UrC);
      if (!isNaN(urineCl)) {
        if (urineCl < 20) {
          return 'Chloride Responsive Metabolic Alkalosis';
        } else if (urineCl > 40) {
          return 'Chloride Resistant Metabolic Alkalosis';
        }
        return 'Mixed Cause Metabolic Alkalosis';
      }
    }
    return 'Metabolic Alkalosis';
  }
  return 'Normal Metabolic Status';
};

export const displayDiag = (result) => {
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
