# Acid-Base App — Diagnosis Logic Reference

This file is the authoritative record of the diagnosis algorithm implemented in `index.html`.
It should be kept up to date with every change to diagnostic logic, formulas, or clinical rules.
Upload this file as a project file in Claude's project settings so every session has full context.

---

## Core Inputs

| Variable | Meaning | Unit |
|---|---|---|
| `pH` | Arterial blood pH | — |
| `pv` (PaCO₂) | Partial pressure of CO₂ | mm Hg |
| `hv` (HCO₃⁻) | Serum bicarbonate | mmol/L |
| `nav` (Na⁺) | Serum sodium | mmol/L |
| `clv` (Cl⁻) | Serum chloride | mmol/L |
| `albuminv` | Serum albumin | g/L |
| `cco2` | Chronic CO₂ retention flag | boolean |
| `exac` | Exacerbation flag | boolean |
| `urc` | Urinary chloride | mmol/L |

---

## Calculated pH Check

```
pHc = 6.1 + log10(HCO₃ / (0.03 × PaCO₂))
```

If `|pHc − pH| > 0.1`, values are inconsistent — flag for review.

---

## Reference Ranges

| Parameter | Normal Range |
|---|---|
| pH | 7.35 – 7.45 |
| PaCO₂ | 35 – 45 mm Hg |
| HCO₃⁻ | 22 – 28 mmol/L |
| ph1 / ph2 | 7.30 / 7.50 (acute vs chronic thresholds) |

---

## Compensation Classification

For metabolic disorders:

| pH | PaCO₂ | Label |
|---|---|---|
| 7.30 – 7.50 | any | Compensated |
| < 7.30 or > 7.50 | 35 – 45 (normal) | **Uncompensated** |
| < 7.30 or > 7.50 | outside 35–45 | Partially Compensated |

---

## Respiratory Disorder Logic

**Acidosis** (pH < 7.4, PaCO₂ ≥ 45):

- Acute if pH < 7.30. Multiplier = 1. Expected HCO₃ = 22 – ((40 − PaCO₂)/10 × 1) to 28 – ((40 − PaCO₂)/10 × 1)
- Chronic if pH 7.30–7.50. Multiplier = 4.
- HCO₃ within range → Simple; below range → + Metabolic Acidosis; above range → + Metabolic Alkalosis

**Alkalosis** (pH ≥ 7.4, PaCO₂ < 35):

- Acute if pH > 7.50. Multiplier = 2.
- Chronic if pH ≤ 7.50. Multiplier = 5.
- Same HCO₃ check as above.

---

## Metabolic Acidosis Logic

pH < 7.4, PaCO₂ < 45 → primary metabolic acidosis.

**Winter's formula** for expected PaCO₂ compensation:

```
Lower bound = 0.9 × (1.5 × HCO₃ + 4)
Upper bound = 1.1 × (1.5 × HCO₃ + 12)
```

- PaCO₂ within bounds → Simple Metabolic Acidosis
- PaCO₂ < lower bound → + Respiratory Alkalosis
- PaCO₂ > upper bound → + Respiratory Acidosis

---

## Metabolic Alkalosis Logic

pH ≥ 7.4, PaCO₂ ≥ 35 → primary metabolic alkalosis.

**Expected PaCO₂ compensation:**

```
Lower bound = 0.9 × (0.7 × HCO₃ + 15)
Upper bound = 1.1 × (0.7 × HCO₃ + 15)
```

- PaCO₂ within bounds → Simple Metabolic Alkalosis
- PaCO₂ < lower bound → + Respiratory Alkalosis
- PaCO₂ > upper bound → + Respiratory Acidosis

---

## Anion Gap (AG)

```
AG = Na − (Cl + HCO₃) + 0.25 × (44 − Albumin)
```

Calculated whenever the diagnosis includes "Metabolic Acidosis".

- AG ≤ 12 → Normal Anion Gap Acidosis (NAGA)
- AG > 12 → High Anion Gap:
  - HG = Na − Cl − 36
  - HG > 6 → HAGMA + concurrent Metabolic Alkalosis
  - HG < −6 → HAGMA + Normal Anion Gap Acidosis (mixed)
  - HG within −6 to +6 → Pure HAGMA

---

## Chronic CO₂ Retention (CCO2) Special Cases

When `cco2 = true`:

| Condition | Diagnosis |
|---|---|
| pH < 7.3, PaCO₂ ≤ 57, HCO₃ < 24, no exac | Chronic Respiratory Acidosis + Metabolic Acidosis |
| pH < 7.3, PaCO₂ > 2×HCO₃−8, HCO₃ ≥ 30, exac | Acute on Chronic Respiratory Acidosis |
| pH < 7.3, PaCO₂ > 57, HCO₃ < 24, exac | Acute on Chronic Respiratory Acidosis + Metabolic Acidosis |
| pH ≥ 7.4 | → check Urinary Chloride for Met. Alkalosis subtype |

**Metabolic Alkalosis subtype (CCO2 + pH ≥ 7.4):**

- Threshold = 0.92 × (2 × HCO₃ − 8)
- PaCO₂ ≤ threshold, UrCl < 20 → Post-Hypercapnic
- PaCO₂ ≤ threshold, UrCl ≥ 20 → Mixed
- PaCO₂ > threshold, UrCl ≥ 20 → Independent, Chloride-Resistant / Diuresis
- PaCO₂ > threshold, UrCl < 20 → Independent, Chloride-Responsive, Extra-Renal Loss

---

## SIG / BDE Gap

```
SIG = Na + Ca + Mg + K − (Cl + Lactate) − (HCO₃ + Albumin×(0.123×pH − 0.631) + PO₄×(0.309×pH − 0.469))
BDE = −1 × STD_Base_Deficit − (Na − Cl − 38) + 0.25 × (42 − Albumin)
```

- SIG > 2 → Abnormal (unmeasured anions present)

---

## Mixed Disturbance Note — Uncompensated Disorders

**Added: March 2026 (Dr. Atef feature request)**

Implemented in `getMixedNote(Diag)` function in `index.html`.

**Rule:** When a disorder is classified as `Uncompensated` AND a mixed respiratory component is also detected, display a clinical note explaining that the absent compensation requires its own explanation — either homeostatic failure or an iatrogenic cause.

This triggers **only** when `Diag.startsWith('Uncompensated ')` AND the string contains both a metabolic and a respiratory disorder.

### Trigger conditions and notes:

**Uncompensated Metabolic Acidosis + Respiratory Acidosis**
- PaCO₂ is normal when it should be falling (Kussmaul breathing expected)
- Iatrogenic: ventilator maintaining normal PaCO₂ settings; opioids/sedatives
- Homeostatic: COPD, respiratory muscle fatigue, neuromuscular disease, CNS depression

**Uncompensated Metabolic Acidosis + Respiratory Alkalosis**
- PaCO₂ is lower than even full compensation requires — independent hyperventilatory drive
- Consider: pain, sepsis, CNS pathology, ventilator rate/tidal volume too high

**Uncompensated Metabolic Alkalosis + Respiratory Acidosis**
- Expected hypoventilation (CO₂ retention) is blocked
- Iatrogenic: high-flow O₂ removing hypoxic drive; ventilator preventing CO₂ retention
- Homeostatic: COPD or fixed lung mechanics

**Uncompensated Metabolic Alkalosis + Respiratory Alkalosis**
- Independent hyperventilation overriding expected CO₂ retention
- Consider: pain, anxiety, sepsis, CNS pathology, iatrogenic hyperventilation

### Where it surfaces:
- ABG tab: amber callout box below the primary diagnosis
- Copy to clipboard: appended as plain text
- Single-case PDF export: amber-bordered block before calculated values
- Batch engine (`runDiagnosis()`): returned as `note` field
- Batch card: amber callout in expanded case view
- Batch Excel export: "Clinical Note" column in Summary sheet (HTML tags stripped)
- Batch PDF export: amber-bordered block per case

---

## Key Formula Summary

| Formula | Expression |
|---|---|
| Calculated pH | `6.1 + log10(HCO₃ / (0.03 × PaCO₂))` |
| Anion Gap | `Na − (Cl + HCO₃) + 0.25 × (44 − Albumin)` |
| HCO₃ gap (delta-delta) | `Na − Cl − 36` |
| Winters' lower | `0.9 × (1.5 × HCO₃ + 4)` |
| Winters' upper | `1.1 × (1.5 × HCO₃ + 12)` |
| Met. alk comp lower | `0.9 × (0.7 × HCO₃ + 15)` |
| Met. alk comp upper | `1.1 × (0.7 × HCO₃ + 15)` |
| CCO2 threshold | `0.92 × (2 × HCO₃ − 8)` |

---

*Last updated: March 2026*
