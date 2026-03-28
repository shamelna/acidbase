# Acid Base Medical Diagnosis - Comprehensive Calculation Tutorial

## Table of Contents
1. [Overview](#overview)
2. [Input Parameters](#input-parameters)
3. [Normal Reference Ranges](#normal-reference-ranges)
4. [Primary Acid-Base Disorders](#primary-acid-base-disorders)
5. [Compensation Mechanisms](#compensation-mechanisms)
6. [Anion Gap Calculations](#anion-gap-calculations)
7. [Delta Gap & Delta Ratio](#delta-gap--delta-ratio)
8. [Winter's Formula](#winters-formula)
9. [SIG & BDE Gap Calculations](#sig--bde-gap-calculations)
10. [Diagnostic Algorithm](#diagnostic-algorithm)
11. [Clinical Interpretation](#clinical-interpretation)
12. [Examples](#examples)

---

## Overview

The Acid Base Medical Diagnosis app implements a comprehensive algorithm for analyzing arterial blood gas (ABG) values and electrolyte data to determine acid-base disorders. The calculation logic follows established medical guidelines and physiological principles.

### Key Components:
- **pH determination**: Acidosis vs Alkalosis
- **PaCO₂ analysis**: Respiratory component
- **HCO₃⁻ analysis**: Metabolic component  
- **Compensation assessment**: Mixed vs Simple disorders
- **Anion gap evaluation**: Unmeasured anions
- **Advanced calculations**: SIG, BDE Gap, Delta Ratio

---

## Input Parameters

### Required Parameters:
1. **pH** - Hydrogen ion concentration
2. **PaCO₂** - Partial pressure of carbon dioxide (mm Hg)
3. **HCO₃⁻** - Bicarbonate concentration (mmol/l)
4. **Na⁺** - Sodium concentration (mmol/l)
5. **Cl⁻** - Chloride concentration (mmol/l)
6. **Albumin** - Serum albumin (g/l)

### Optional Parameters:
- **K⁺** - Potassium (mmol/l)
- **Ca²⁺** - Calcium (mmol/l)
- **Mg²⁺** - Magnesium (mmol/l)
- **Lactate** - Lactic acid (mmol/l)
- **PO₄³⁻** - Phosphate (mmol/l)
- **SBD** - Standard Base Difference (mmol/l)

---

## Normal Reference Ranges

| Parameter | Normal Range | Unit |
|-----------|--------------|------|
| pH | 7.35 - 7.45 | - |
| PaCO₂ | 35 - 45 | mm Hg |
| HCO₃⁻ | 22 - 28 | mmol/l |
| Na⁺ | 135 - 145 | mmol/l |
| Cl⁻ | 95 - 105 | mmol/l |
| K⁺ | 3.5 - 5.1 | mmol/l |
| Ca²⁺ | 2.1 - 2.6 | mmol/l |
| Mg²⁺ | 0.7 - 1.0 | mmol/l |
| Albumin | 35 - 50 | g/l |
| Lactate | 0.5 - 2.2 | mmol/l |
| PO₄³⁻ | 0.8 - 1.5 | mmol/l |

---

## Primary Acid-Base Disorders

### 1. Acidosis (pH < 7.35)

#### Respiratory Acidosis
- **Primary**: Elevated PaCO₂ (>45 mm Hg)
- **Expected pH**: 7.40 - 0.008 × (PaCO₂ - 40)
- **Compensation**: Renal HCO₃⁻ retention

#### Metabolic Acidosis  
- **Primary**: Low HCO₃⁻ (<22 mmol/l)
- **Expected PaCO₂**: Winter's Formula
- **Compensation**: Respiratory hyperventilation

### 2. Alkalosis (pH > 7.45)

#### Respiratory Alkalosis
- **Primary**: Low PaCO₂ (<35 mm Hg)
- **Expected pH**: 7.40 + 0.008 × (40 - PaCO₂)
- **Compensation**: Renal HCO₃⁻ excretion

#### Metabolic Alkalosis
- **Primary**: Elevated HCO₃⁻ (>28 mmol/l)
- **Expected PaCO₂**: 0.7 × HCO₃⁻ + 21
- **Compensation**: Respiratory hypoventilation

---

## Compensation Mechanisms

### Respiratory Compensation (Metabolic Disorders)

#### For Metabolic Acidosis:
```
Expected PaCO₂ = 1.5 × HCO₃⁻ + 8 ± 2
```

#### For Metabolic Alkalosis:
```
Expected PaCO₂ = 0.7 × HCO₃⁻ + 21 ± 2
```

### Renal Compensation (Respiratory Disorders)

#### For Acute Respiratory Acidosis:
```
Expected HCO₃⁻ increase = 1 × (PaCO₂ - 40) / 10
```

#### For Chronic Respiratory Acidosis:
```
Expected HCO₃⁻ increase = 3.5 × (PaCO₂ - 40) / 10
```

#### For Acute Respiratory Alkalosis:
```
Expected HCO₃⁻ decrease = 2 × (40 - PaCO₂) / 10
```

#### For Chronic Respiratory Alkalosis:
```
Expected HCO₃⁻ decrease = 5 × (40 - PaCO₂) / 10
```

---

## Anion Gap Calculations

### Standard Anion Gap (AG)
```
AG = Na⁺ - (Cl⁻ + HCO₃⁻)
```

**Normal Range**: 8-12 mmol/l

### Corrected Anion Gap (for albumin)
```
Corrected AG = AG + 2.5 × (4.0 - Albumin in g/dL)
```

Or using g/L:
```
Corrected AG = AG + 0.25 × (40 - Albumin in g/L)
```

### High Anion Gap Acidosis Causes:
- **MUDPILES**:
  - **M**ethanol
  - **U**remia
  - **D**KA (Diabetic Ketoacidosis)
  - **P**araldehyde
  - **I**soniazid, Iron, Isoniazid
  - **L**actic acidosis
  - **E**thylene glycol
  - **S**alicylates

---

## Delta Gap & Delta Ratio

### Delta Gap (ΔGap)
```
ΔGap = Corrected AG - Normal AG (12)
```

### Delta Ratio
```
Delta Ratio = ΔGap / ΔHCO₃⁻
Where ΔHCO₃⁻ = 24 - Measured HCO₃⁻
```

### Interpretation:

| Delta Ratio | Interpretation |
|-------------|----------------|
| < 0.4 | Normal AG Metabolic Acidosis |
| 0.4 - 0.8 | Mixed AG + Normal AG Acidosis |
| 0.8 - 2.0 | Pure High AG Acidosis |
| > 2.0 | Mixed High AG + Normal AG Acidosis |

---

## Winter's Formula

### For Metabolic Acidosis:
```
Expected PaCO₂ = 1.5 × HCO₃⁻ + 8 ± 2
```

### Application:
1. Calculate expected PaCO₂
2. Compare with measured PaCO₂
3. Determine if respiratory compensation is:
   - **Adequate**: Measured PaCO₂ within expected range
   - **Inadequate**: Measured PaCO₂ outside expected range
   - **Mixed disorder**: Additional respiratory component

---

## SIG & BDE Gap Calculations

### Strong Ion Gap (SIG)
```
SIG = (Na⁺ + K⁺ + Ca²⁺ + Mg²⁺) - (Cl⁻ + Lactate + 1.5 × Albumin)
```

### Base Deficit Excess (BDE) Gap
```
BDE Gap = SIG - SBD
```

### Interpretation:
- **SIG > 0**: Unmeasured anions present
- **SIG < 0**: Unmeasured cations present
- **BDE Gap**: Helps identify mixed disorders

---

## Diagnostic Algorithm

### Step 1: pH Analysis
```
IF pH < 7.35 → Acidosis
IF pH > 7.45 → Alkalosis  
IF pH 7.35-7.45 → Normal or compensated disorder
```

### Step 2: Primary Disorder Identification
```
FOR ACIDOSIS:
  IF PaCO₂ > 45 → Respiratory Acidosis
  IF HCO₃⁻ < 22 → Metabolic Acidosis
  
FOR ALKALOSIS:
  IF PaCO₂ < 35 → Respiratory Alkalosis
  IF HCO₃⁻ > 28 → Metabolic Alkalosis
```

### Step 3: Compensation Assessment
```
CALCULATE expected compensatory response
COMPARE measured vs expected values
DETERMINE if compensation is adequate
```

### Step 4: Mixed Disorder Detection
```
IF pH abnormal but both PaCO₂ and HCO₃⁻ abnormal
  → Mixed disorder likely
  
IF compensation inadequate
  → Mixed disorder likely
```

### Step 5: Anion Gap Evaluation (for Metabolic Acidosis)
```
CALCULATE anion gap
IF AG > 12 → High AG metabolic acidosis
IF AG ≤ 12 → Normal AG metabolic acidosis

CALCULATE delta ratio
INTERPRET mixed disorder patterns
```

---

## Clinical Interpretation

### Severity Assessment

| pH Range | Severity |
|----------|----------|
| 7.20-7.35 | Mild Acidosis |
| 7.10-7.20 | Moderate Acidosis |
| < 7.10 | Severe Acidosis |
| 7.45-7.55 | Mild Alkalosis |
| 7.55-7.65 | Moderate Alkalosis |
| > 7.65 | Severe Alkalosis |

### Compensation Levels

| Compensation Level | Description |
|-------------------|-------------|
| **Uncompensated** | pH abnormal, no compensatory changes |
| **Partially compensated** | pH abnormal, compensatory changes present |
| **Fully compensated** | pH normal, compensatory changes present |

---

## Examples

### Example 1: Metabolic Acidosis
**Input**: pH 7.25, PaCO₂ 35, HCO₃⁻ 15, Na⁺ 140, Cl⁻ 105, Albumin 40

**Calculations**:
1. **pH**: 7.25 (< 7.35) → Acidosis
2. **Primary**: HCO₃⁻ 15 (< 22) → Metabolic Acidosis
3. **Expected PaCO₂**: 1.5 × 15 + 8 = 30.5 ± 2 → 28.5-32.5
4. **Measured PaCO₂**: 35 (higher than expected) → Inadequate compensation
5. **Anion Gap**: 140 - (105 + 15) = 20 (> 12) → High AG
6. **Diagnosis**: High Anion Gap Metabolic Acidosis with respiratory compensation

### Example 2: Respiratory Acidosis
**Input**: pH 7.30, PaCO₂ 60, HCO₃⁻ 30, Na⁺ 140, Cl⁻ 100, Albumin 40

**Calculations**:
1. **pH**: 7.30 (< 7.35) → Acidosis
2. **Primary**: PaCO₂ 60 (> 45) → Respiratory Acidosis
3. **Expected HCO₃⁻**: 24 + 3.5 × (60-40)/10 = 31 → Chronic compensation
4. **Measured HCO₃⁻**: 30 (close to expected) → Adequate compensation
5. **Diagnosis**: Chronic Respiratory Acidosis with metabolic compensation

### Example 3: Mixed Disorder
**Input**: pH 7.20, PaCO₂ 50, HCO₃⁻ 18, Na⁺ 140, Cl⁻ 105, Albumin 40

**Calculations**:
1. **pH**: 7.20 (< 7.35) → Acidosis
2. **Both abnormal**: PaCO₂ 50 (> 45) and HCO₃⁻ 18 (< 22)
3. **Expected PaCO₂** (for HCO₃⁻ 18): 1.5 × 18 + 8 = 35 ± 2 → 33-37
4. **Measured PaCO₂**: 50 (much higher) → Respiratory component
5. **Expected HCO₃⁻** (for PaCO₂ 50): 24 + 3.5 × 10/10 = 27.5
6. **Measured HCO₃⁻**: 18 (much lower) → Metabolic component
7. **Diagnosis**: Mixed Respiratory and Metabolic Acidosis

---

## Implementation Notes

### Calculation Order:
1. Validate input ranges
2. Determine pH status
3. Identify primary disorder
4. Calculate expected compensation
5. Assess compensation adequacy
6. Calculate anion gap (if metabolic acidosis)
7. Determine mixed disorders
8. Generate clinical interpretation

### Edge Cases:
- **Impossible values**: pH < 6.8 or > 8.0
- **Severe disorders**: pH < 7.0 or > 7.7
- **Laboratory errors**: Inconsistent ABG-electrolyte relationships
- **Complex mixed disorders**: Multiple compensatory mechanisms

### Limitations:
- **Time factor**: Doesn't distinguish acute vs chronic disorders
- **Clinical context**: Requires correlation with patient condition
- **Laboratory variations**: Different reference ranges between institutions
- **Complex cases**: Severe mixed disorders may require expert interpretation

---

## References

1. **Emmett M, Narins RG.** Clinical approach to acid-base disorders. *N Engl J Med.* 1977.
2. **Gabow PA, Kaehny WD, Fennessey PV, et al.** Diagnostic importance of an increased serum anion gap. *N Engl J Med.* 1980.
3. **Winter SD, Pearson JR, Gabow PA, et al.** The fall of the serum anion gap. *Arch Intern Med.* 1990.
4. **Fencl V, Leith DE.** Stewart's quantitative acid-base chemistry. *J Appl Physiol.* 1993.
5. **Story DA, Poustie S.** Quantitative acid-base analysis: a new approach. *Crit Care Resusc.* 2001.

---

*This tutorial provides a comprehensive overview of the acid-base calculation logic implemented in the Acid Base Medical Diagnosis app. Always correlate laboratory findings with clinical presentation and consult appropriate medical references for patient care decisions.*
