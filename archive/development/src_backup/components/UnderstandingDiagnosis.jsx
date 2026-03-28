import React from 'react';
import { getSeverityClassification } from '../utils/diagnosisLogic.js';

// Medical Icons
const MedicalIcons = {
  stethoscope: '🩺',
  lab: '🔬',
  heart: '❤️',
  settings: '⚙️'
};

const UnderstandingDiagnosis = ({ input, pH, pv, hv, expandedSections, toggleSection, UrC, diagnosisResult }) => {
  const severity = diagnosisResult ? getSeverityClassification(diagnosisResult.diagnosis, pH, pv, hv) : '';
  
  return (
    <div className="diagnosis-enhanced mt-6">
      <div className="expandable-sections">
        <div className="expandable-item">
          <button 
            className="expandable-trigger"
            onClick={() => toggleSection('diagnosisLogic')}
          >
            <div className="expandable-header">
              <h4 className="text-lg font-semibold">{MedicalIcons.lab} Understanding Your Diagnosis</h4>
              <span className={`expandable-icon ${expandedSections.diagnosisLogic ? 'expanded' : ''}`}>▼</span>
            </div>
          </button>
          <div className={`expandable-content ${expandedSections.diagnosisLogic ? 'open' : ''}`} style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', marginTop: '10px' }}>
            <h5 className="font-semibold mt-4 mb-2">Why This Diagnosis?</h5>
            <div className="text-sm space-y-2">
              {/* Value-specific analysis */}
              <div className="value-analysis">
                <strong>Your Values vs Normal Ranges:</strong>
                <ul className="ml-4 mt-2">
                  <li>pH: {pH || 'Not provided'} 
                    {pH && (
                      <span className={parseFloat(pH) >= 7.35 && parseFloat(pH) <= 7.45 ? 'text-green-600' : 'text-red-600'}>
                        ({parseFloat(pH) >= 7.35 && parseFloat(pH) <= 7.45 ? 'Normal' : 
                          parseFloat(pH) < 7.35 ? 'Low (Acidemia)' : 'High (Alkalemia)'} 
                          - Normal: 7.35-7.45)
                      </span>
                    )}
                  </li>
                  <li>PaCO₂: {pv || 'Not provided'} 
                    {pv && (
                      <span className={parseFloat(pv) >= 35 && parseFloat(pv) <= 45 ? 'text-green-600' : 'text-red-600'}>
                        ({parseFloat(pv) >= 35 && parseFloat(pv) <= 45 ? 'Normal' : 
                          parseFloat(pv) < 35 ? 'Low' : 'High'} 
                          - Normal: 35-45 mm Hg)
                      </span>
                    )}
                  </li>
                  <li>HCO₃⁻: {hv || 'Not provided'} 
                    {hv && (
                      <span className={parseFloat(hv) >= 22 && parseFloat(hv) <= 28 ? 'text-green-600' : 'text-red-600'}>
                        ({parseFloat(hv) >= 22 && parseFloat(hv) <= 28 ? 'Normal' : 
                          parseFloat(hv) < 22 ? 'Low' : 'High'} 
                          - Normal: 22-28 mmol/l)
                      </span>
                    )}
                  </li>
                </ul>
              </div>

              {/* Primary disorder explanation based on actual diagnosis result */}
              {diagnosisResult && (
                <div className="diagnosis-explanation">
                  <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-800">
                      <strong>Severity Classification:</strong> {severity}
                    </p>
                  </div>
                  
                  {(() => {
                    const primaryDiagnosis = diagnosisResult.diagnosis;
                    
                    // Normal status
                    if (primaryDiagnosis.includes('Normal') || primaryDiagnosis.includes('normal')) {
                      return (
                        <div>
                          <strong>Normal Acid-Base Status:</strong>
                          <p className="mt-1">All your values fall within normal ranges, indicating no acid-base disorder.</p>
                          <p className="mt-1"><strong>Why normal:</strong> pH {pH} is within 7.35-7.45, PaCO₂ {pv} is within 35-45, and HCO₃⁻ {hv} is within 22-28.</p>
                        </div>
                      );
                    }
                    
                    // Respiratory Acidosis
                    if (primaryDiagnosis.includes('Respiratory Acidosis')) {
                      return (
                        <div>
                          <strong>Respiratory Acidosis Confirmed:</strong>
                          <p className="mt-1">PaCO₂ is {pv} mm Hg {parseFloat(pv) > 45 ? '(elevated)' : '(normal but compensation present)'}.</p>
                          <p className="mt-1"><strong>Why respiratory acidosis:</strong> 
                            {parseFloat(pv) > 45 ? ` PaCO₂ of ${pv} exceeds the normal range of 35-45, indicating CO₂ retention.` : 
                            ` Despite PaCO₂ of ${pv} being normal, the pH of ${pH} indicates respiratory acidosis with compensation.`}
                          </p>
                          <p className="mt-1"><strong>Physiology:</strong> High CO₂ combines with water to form carbonic acid, lowering pH.</p>
                        </div>
                      );
                    }
                    
                    // Respiratory Alkalosis
                    if (primaryDiagnosis.includes('Respiratory Alkalosis')) {
                      return (
                        <div>
                          <strong>Respiratory Alkalosis Confirmed:</strong>
                          <p className="mt-1">PaCO₂ is {pv} mm Hg {parseFloat(pv) < 35 ? '(low)' : '(normal but compensation present)'}.</p>
                          <p className="mt-1"><strong>Why respiratory alkalosis:</strong> 
                            {parseFloat(pv) < 35 ? ` PaCO₂ of ${pv} is below the normal range of 35-45, indicating hyperventilation.` : 
                            ` Despite PaCO₂ of ${pv} being normal, the pH of ${pH} indicates respiratory alkalosis with compensation.`}
                          </p>
                          <p className="mt-1"><strong>Physiology:</strong> Low CO₂ reduces carbonic acid formation, raising pH.</p>
                        </div>
                      );
                    }
                    
                    // Metabolic Acidosis
                    if (primaryDiagnosis.includes('Metabolic Acidosis')) {
                      return (
                        <div>
                          <strong>Metabolic Acidosis Confirmed:</strong>
                          <p className="mt-1">HCO₃⁻ is {hv} mmol/l {parseFloat(hv) < 22 ? '(low)' : '(normal but compensation present)'}.</p>
                          <p className="mt-1"><strong>Why metabolic acidosis:</strong> 
                            {parseFloat(hv) < 22 ? ` HCO₃⁻ of ${hv} is below the normal range of 22-28, indicating bicarbonate loss or acid accumulation.` : 
                            ` Despite HCO₃⁻ of ${hv} being normal, the pH of ${pH} indicates metabolic acidosis with compensation.`}
                          </p>
                          <p className="mt-1"><strong>Physiology:</strong> Low bicarbonate reduces the blood's buffering capacity, lowering pH.</p>
                          
                          {/* Anion Gap information if available */}
                          {diagnosisResult.anionGap && (
                            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                              <p className="text-sm text-blue-800">
                                <strong>Anion Gap:</strong> {diagnosisResult.anionGap} 
                                {primaryDiagnosis.includes('High Anion Gap') && ' (Elevated - suggests toxic/metabolic cause)'}
                                {primaryDiagnosis.includes('Normal Anion Gap') && ' (Normal - suggests GI/renal loss)'}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    }
                    
                    // Metabolic Alkalosis
                    if (primaryDiagnosis.includes('Metabolic Alkalosis')) {
                      return (
                        <div>
                          <strong>Metabolic Alkalosis Confirmed:</strong>
                          <p className="mt-1">HCO₃⁻ is {hv} mmol/l {parseFloat(hv) > 28 ? '(elevated)' : '(normal but compensation present)'}.</p>
                          <p className="mt-1"><strong>Why metabolic alkalosis:</strong> 
                            {parseFloat(hv) > 28 ? ` HCO₃⁻ of ${hv} exceeds the normal range of 22-28, indicating base excess or acid loss.` : 
                            ` Despite HCO₃⁻ of ${hv} being normal, the pH of ${pH} indicates metabolic alkalosis with compensation.`}
                          </p>
                          <p className="mt-1"><strong>Physiology:</strong> High bicarbonate increases the blood's buffering capacity, raising pH.</p>
                          
                          {/* Urine chloride assessment */}
                          {(!UrC || UrC === '') ? (
                            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                              <p className="text-sm text-yellow-800">
                                <strong>⚠️ Urine Chloride Needed:</strong> For complete assessment of metabolic alkalosis cause
                              </p>
                              <ul className="ml-4 mt-2 text-sm text-yellow-700">
                                <li><strong>Urine Cl &lt; 20 mmol/l:</strong> Volume-responsive (vomiting, diuretics)</li>
                                <li><strong>Urine Cl &gt; 20 mmol/l:</strong> Volume-resistant (hyperaldosteronism)</li>
                              </ul>
                            </div>
                          ) : (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                              <p className="text-sm text-green-800">
                                <strong>✅ Urine Chloride Assessment:</strong>
                              </p>
                              <div className="mt-2">
                                {parseFloat(UrC) < 20 ? (
                                  <div>
                                    <p className="text-sm text-green-700">
                                      <strong>Volume-Responsive</strong> (Urine Cl: {UrC} mmol/l)
                                    </p>
                                    <p className="text-sm text-green-600 mt-1">
                                      Low urine chloride indicates volume depletion from vomiting, diarrhea, or diuretics.
                                    </p>
                                  </div>
                                ) : (
                                  <div>
                                    <p className="text-sm text-green-700">
                                      <strong>Volume-Resistant</strong> (Urine Cl: {UrC} mmol/l)
                                    </p>
                                    <p className="text-sm text-green-600 mt-1">
                                      High urine chloride suggests mineralocorticoid excess or endocrine cause.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                    
                    // Mixed disorders
                    if (primaryDiagnosis.includes('Mixed')) {
                      return (
                        <div className="mixed-disorder-explanation">
                          <strong>Mixed Disorder:</strong>
                          <p className="mt-1">Both respiratory and metabolic components are present, creating a complex acid-base picture.</p>
                          <p className="mt-1">This requires careful evaluation of all parameters and often indicates severe illness or multiple concurrent processes.</p>
                        </div>
                      );
                    }
                    
                    // Default fallback
                    return (
                      <div>
                        <strong>Diagnosis Analysis:</strong>
                        <p className="mt-1">Based on your values: pH {pH}, PaCO₂ {pv}, HCO₃⁻ {hv}</p>
                        <p className="mt-1">The system has identified: {primaryDiagnosis}</p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Compensation explanation */}
              {diagnosisResult && (diagnosisResult.diagnosis.includes('Compensated') || diagnosisResult.diagnosis.includes('Uncompensated') || diagnosisResult.diagnosis.includes('Partially')) && (
                <div className="compensation-explanation">
                  <strong>Compensation Present:</strong>
                  <p className="mt-1">Your body is attempting to normalize pH through secondary mechanisms.</p>
                  <p className="mt-1">
                    {diagnosisResult.diagnosis.includes('Respiratory') ? 'Kidneys are adjusting bicarbonate levels' : 'Lungs are adjusting CO₂ levels'} 
                    to compensate for the primary disorder.
                  </p>
                  {diagnosisResult.diagnosis.includes('Complete') ? (
                    <p className="mt-1"><strong>Complete compensation:</strong> pH has returned to normal range, but the underlying disorder persists.</p>
                  ) : (
                    <p className="mt-1"><strong>Partial compensation:</strong> pH is still abnormal but less severe due to compensatory mechanisms.</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Value-specific clinical implications based on actual diagnosis */}
            <h5 className="font-semibold mt-4 mb-2">Clinical Implications</h5>
            <div className="text-sm">
              {diagnosisResult && (() => {
                const primaryDiagnosis = diagnosisResult.diagnosis;
                
                // Normal
                if (primaryDiagnosis.includes('Normal') || primaryDiagnosis.includes('normal')) {
                  return (
                    <div>
                      <p className="mt-2"><strong>Recommendations:</strong></p>
                      <ul className="ml-4 mt-1">
                        <li>Continue routine monitoring</li>
                        <li>Maintain current ventilation and metabolic support</li>
                        <li>Document as baseline for future comparisons</li>
                      </ul>
                    </div>
                  );
                }
                
                // Respiratory Acidosis
                if (primaryDiagnosis.includes('Respiratory Acidosis')) {
                  return (
                    <div>
                      <ul className="ml-4 mt-2">
                        <li><strong>Assess ventilation:</strong> Check respiratory rate, effort, and mechanics</li>
                        <li><strong>Consider oxygen therapy:</strong> If hypoxemic or in respiratory distress</li>
                        <li><strong>Ventilatory support:</strong> Non-invasive or mechanical ventilation if severe</li>
                        <li><strong>Treat underlying cause:</strong> Reversal of sedation, bronchodilators for COPD</li>
                      </ul>
                      <p className="mt-2 font-semibold text-red-600">
                        <strong>Urgent if:</strong> {pH && parseFloat(pH) < 7.1 ? `pH is ${pH} (already < 7.1) - immediate intervention needed` : 'pH < 7.1, PaCO₂ > 60, or severe respiratory distress'}
                      </p>
                    </div>
                  );
                }
                
                // Respiratory Alkalosis
                if (primaryDiagnosis.includes('Respiratory Alkalosis')) {
                  return (
                    <div>
                      <ul className="ml-4 mt-2">
                        <li><strong>Identify cause:</strong> Anxiety, pain, hypoxia, pulmonary embolism</li>
                        <li><strong>Treat underlying condition:</strong> Pain control, anxiolytics, oxygen therapy</li>
                        <li><strong>Consider sedation:</strong> If patient-ventilator dyssynchrony</li>
                      </ul>
                      <p className="mt-2 font-semibold text-red-600">
                        <strong>Urgent if:</strong> {pH && parseFloat(pH) > 7.6 ? `pH is ${pH} (already > 7.6) - immediate intervention needed` : 'pH > 7.6, neurological symptoms, or seizures'}
                      </p>
                    </div>
                  );
                }
                
                // Metabolic Acidosis
                if (primaryDiagnosis.includes('Metabolic Acidosis')) {
                  return (
                    <div>
                      <ul className="ml-4 mt-2">
                        <li><strong>Calculate anion gap:</strong> AG = Na - (Cl + HCO₃) + 0.25×(44 - Albumin)</li>
                        <li><strong>Identify cause:</strong> Renal failure, DKA, lactic acidosis, toxins</li>
                        <li><strong>Bicarbonate therapy:</strong> Consider if pH &lt; 7.1-7.2</li>
                        <li><strong>Treat underlying cause:</strong> Dialysis, insulin, improve perfusion</li>
                      </ul>
                      <p className="mt-2 font-semibold text-red-600">
                        <strong>Urgent if:</strong> {pH && parseFloat(pH) < 7.1 ? `pH is ${pH} (already < 7.1) - immediate intervention needed` : 'pH < 7.1, AG > 20, or hemodynamic instability'}
                      </p>
                    </div>
                  );
                }
                
                // Metabolic Alkalosis
                if (primaryDiagnosis.includes('Metabolic Alkalosis')) {
                  return (
                    <div>
                      <ul className="ml-4 mt-2">
                        {(!UrC || UrC === '') ? (
                          <li><strong>Urine chloride needed:</strong> To determine treatment approach</li>
                        ) : (
                          <>
                            {parseFloat(UrC) < 20 ? (
                              <>
                                <li><strong>Volume replacement:</strong> IV fluids (0.9% saline) to restore volume</li>
                                <li><strong>Stop offending agents:</strong> Discontinue diuretics if possible</li>
                                <li><strong>Correct electrolytes:</strong> Replace potassium and magnesium</li>
                              </>
                            ) : (
                              <>
                                <li><strong>Address endocrine cause:</strong> Evaluate for hyperaldosteronism</li>
                                <li><strong>Mineralocorticoid antagonists:</strong> Spironolactone, eplerenone</li>
                                <li><strong>Acidifying agents:</strong> Consider acetazolamide or HCl infusion</li>
                              </>
                            )}
                          </>
                        )}
                      </ul>
                      <p className="mt-2 font-semibold text-red-600">
                        <strong>Urgent if:</strong> {pH && parseFloat(pH) > 7.6 ? `pH is ${pH} (already > 7.6) - immediate intervention needed` : 'pH > 7.6, neurological symptoms, or severe hypokalemia'}
                      </p>
                    </div>
                  );
                }
                
                // Default fallback
                return (
                  <div>
                    <p><strong>Clinical Assessment Required:</strong></p>
                    <p className="mt-1">Based on diagnosis: {primaryDiagnosis}</p>
                    <p className="mt-1">Please consult with healthcare provider for specific management recommendations.</p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderstandingDiagnosis;
