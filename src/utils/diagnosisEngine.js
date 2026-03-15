// Pure functions — no React, no state, fully testable
export const RANGES = {
  ph1: 7.35, ph2: 7.45,  // Gold standard: 7.35-7.45, not 7.3-7.5
  p1: 35,   p2: 45,
  h1: 22,   h2: 28,
};

export function calcPHc(hv, pv) {
  return Number((6.1 + Math.log10(hv / (0.03 * pv))).toFixed(2));
}

export function calcAnionGap(nav, clv, hv, albuminv) {
  return nav - (clv + hv) + 0.25 * (44 - albuminv);
}

export function calcHG(nav, clv) {
  return nav - clv - 36;
}

export function calcSIG(nav, Ca, Mg, K, clv, Lactate, hv, albuminv, pH, PO4) {
  return nav + Ca + Mg + K
    - (clv + Lactate)
    - (hv + albuminv * (0.123 * pH - 0.631) + PO4 * (0.309 * pH - 0.469));
}

export function calcBDE(SBD, nav, clv, albuminv) {
  return -1 * SBD - (nav - clv - 38) + 0.25 * (42 - albuminv);
}

export function getSeverityClassification(diagnosis, pH, pv, hv) {
  // Check for acute vs chronic based on gold standard formulas
  if (diagnosis.includes('Acute')) {
    return 'Acute';
  } else if (diagnosis.includes('Chronic')) {
    return 'Chronic';
  } else if (diagnosis.includes('Simple')) {
    // Determine if simple cases are acute or chronic based on pH
    if (pH < 7.3 || pH > 7.5) {
      return 'Acute';
    } else {
      return 'Chronic';
    }
  } else if (diagnosis.includes('Normal')) {
    return 'Normal';
  } else {
    // For uncompensated or partially compensates cases, determine by pH severity
    if (pH < 7.2) return 'Severe';
    if (pH > 7.6) return 'Severe';
    if (pH >= 7.3 && pH <= 7.5) return 'Mild';
    return 'Moderate';
  }
}

// Returns diagnosis string — same logic as original Diagnosis/resp/metacid/metalk
export function runDiagnosis({ pH, pv, hv, nav, clv, albuminv, CCo2, Exac, UrC }) {
  const pHc = calcPHc(hv, pv);
  if (Math.abs(pHc - pH) > 0.1) {
    return `Calculated PH = ${pHc} Please Review Input Values`;
  }

  let Diag = "";
  const { ph1, ph2, p1, p2 } = RANGES;

  // Normal - check this first
  if (pH >= 7.35 && pH <= 7.45 && pv >= 35 && pv <= 45 && hv >= 22 && hv <= 28) {
    Diag = "Normal, Check Anion Gap";
  }
  
  // Chronic CO2 special cases
  else if (pH < 7.3 && CCo2 === 1 && pv <= 57 && hv < 24 && Exac === 0) {
    Diag = "Chronic Respiratory Acidosis + Metabolic Acidosis";
  } else if (pH < 7.3 && CCo2 === 1 && pv > 2 * hv - 8 && hv >= 30 && Exac === 1) {
    Diag = "Acute on Top of Chronic Respiratory Acidosis";
  } else if (pH < 7.3 && CCo2 === 1 && pv > 57 && hv < 24 && Exac === 1) {
    Diag = "Acute on Top of Chronic Respiratory Acidosis + Metabolic Acidosis";
  }

  // Acidosis branch
  else if (Diag === "" && pH < 7.4) {
    Diag = " Acidosis";
    if (pv >= p2) {
      Diag = respDiag(pH, pv, hv, 1, 4, 'Acidosis', ph1, ph2);
    } else if (pv < p2) {
      Diag = metacidDiag(pH, pv, hv, ph1, ph2, p1, p2);
    }
  }
  
  // Alkalosis branch - only if pH > 7.4 (not >=)
  else if (pH > 7.4) {
    if (CCo2 === 0) {
      Diag = " - Alkalosis";
      if (pv < 35) {
        Diag = respDiag(pH, pv, hv, 2, 5, 'Alkalosis', ph1, ph2);
      } else {
        Diag = metalkDiag(pH, pv, hv, ph1, ph2, p1, p2);
      }
    } else if (CCo2 === 1) {
      if (!UrC) return 'VALUE_URINE_CHLORIDE_REQUIRED';
      Diag = "Chronic Respiratory Acidosis + Metabolic Alkalosis (";
      if (pv <= 0.92 * (2 * hv - 8)) {
        Diag = Diag + (UrC < 20 ? 'Post-Hypercapnic)' : 'Mixed)');
      } else if (UrC >= 20) {
        Diag = Diag + 'Independent, Chloride Resistant and/or Diuresis)';
      } else {
        Diag = Diag + 'Independent, Chloride Responsive, Extra-Renal Loss of Chloride)';
      }
    }
  }

  return appendAG(Diag, nav, clv, hv, albuminv);
}

// --- internal helpers ---

function appendAG(message, nav, clv, hv, albuminv) {
  if (!message.includes('Metabolic Acidosis')) return message;
  const AG = calcAnionGap(nav, clv, hv, albuminv);
  if (AG <= 12) return message + '\n(Normal Anion Gap Acidosis)';
  const HG = calcHG(nav, clv);
  if (HG > 6)  return message + '\n(High Anion Gap Metabolic Acidosis + Metabolic Alkalosis)';
  if (HG < -6) return message + '\n(High Anion Gap Metabolic Acidosis + Normal Anion Gap Acidosis)';
  return message + '\n(High Anion Gap Metabolic Acidosis)';
}

function respDiag(pH, pv, hv, x1, x2, label, ph1, ph2) {
  let Diag = "Respiratory - " + label;
  let Diag2 = label;
  
  if (pH < ph1 || pH > ph2) {
    Diag = "Acute" + Diag;
    const eq = 22 - (((40 - pv) / 10) * x1);
    const eq1 = 28 - (((40 - pv) / 10) * x1);
    if (hv > eq && hv < eq1)
      Diag = "Simple Acute Respiratory " + Diag2;
    else if (hv < eq)
      Diag = "Acute Respiratory " + Diag2 + " + Metabolic Acidosis.";
    else if (hv > eq1)
      Diag = "Acute Respiratory " + Diag2 + " + Metabolic Alkalosis.";
  }

  if (pH >= ph1 && pH <= ph2) {
    Diag = "Chronic " + Diag;
    const eq = 22 - (((40 - pv) / 10) * x2);
    const eq1 = 28 - (((40 - pv) / 10) * x2);
    if (hv > eq && hv < eq1)
      Diag = "Simple Chronic Respiratory " + Diag2;
    else if (hv < eq)
      Diag = "Chronic Respiratory " + Diag2 + " + Metabolic Acidosis.";
    else if (hv > eq1)
      Diag = "Chronic Respiratory " + Diag2 + " + Metabolic Alkalosis.";
  }
  
  return Diag;
}

function metacidDiag(pH, pv, hv, ph1, ph2, p1, p2) {
  let Diag = " - Metabolic Acidosis";
  let Diag2 = "";
  
  if (pH < ph1 || pH > ph2) {
    if (pv <= p2 && pv >= p1) {
      Diag = "Uncompensated " + Diag;
      Diag2 = "Uncompensated ";
    } else if (pv > p2 || pv < p1) {
      Diag = "Partially Compensated " + Diag;
      Diag2 = "Partially Compensated ";
    }
  }
  
  if (pH >= ph1 && pH <= ph2) {
    Diag = "Compensated " + Diag;
    Diag2 = "Compensated ";
  }
  
  if (pv >= 0.9 * (1.5 * hv + 4) && pv <= 1.1 * (1.5 * hv + 12))
    Diag = Diag2 + "Simple Metabolic Acidosis";
  else if (pv < 0.9 * (1.5 * hv + 4))
    Diag = Diag2 + "Metabolic Acidosis + Respiratory Alkalosis";
  else if (pv > 1.1 * (1.5 * hv + 12))
    Diag = Diag2 + "Metabolic Acidosis + Respiratory Acidosis";
    
  return Diag;
}

function metalkDiag(pH, pv, hv, ph1, ph2, p1, p2) {
  let Diag = " - Metabolic Alkalosis";
  let Diag2 = "";
  
  if (pH < ph1 || pH > ph2) {
    if (pv <= p2 && pv >= p1) {
      Diag = "Uncompensated " + Diag;
      Diag2 = "Uncompensated ";
    } else if (pv > p2 || pv < p1) {
      Diag = "Partially Compensated " + Diag;
      Diag2 = "Partially Compensated ";
    }
  }
  
  if (pH >= ph1 && pH <= ph2) {
    Diag = "Compensated " + Diag;
    Diag2 = "Compensated ";
  }
  
  if (pv >= 0.9 * (0.7 * hv + 15) && pv <= 1.1 * (0.7 * hv + 15))
    Diag = Diag2 + "Simple Metabolic Alkalosis";
  else if (pv < 0.9 * (0.7 * hv + 15))
    Diag = Diag2 + "Metabolic Alkalosis + Respiratory Alkalosis";
  else if (pv > 1.1 * (0.7 * hv + 15))
    Diag = Diag2 + "Metabolic Alkalosis + Respiratory Acidosis";
    
  return Diag;
}
