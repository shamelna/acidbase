import React, { useState } from 'react';

const AboutPage = ({ setCurrentPage }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="about-page-content">
      <div className="about-intro">
        <h3 className="text-xl font-semibold mb-4">🩺 Professional Acid Base Medical Diagnosis Tool</h3>
        <p className="text-secondary mb-4">
          This professional Acid Base Medical Diagnosis tool is designed for healthcare providers to quickly and accurately analyze arterial blood gas (ABG) values and interpret acid-base disorders.
        </p>
      </div>

      <div className="about-resources">
        <h4 className="text-lg font-semibold mb-4">📚 Educational Resources</h4>
        
        <div className="resource-card">
          <div className="resource-header">
            <span className="resource-icon">📖</span>
            <h5 className="font-semibold">Complete Medical Guide</h5>
          </div>
          <p className="text-secondary mb-3">
            Comprehensive PDF documentation covering acid-base physiology, clinical applications, and case studies.
          </p>
          <a 
            href="https://drive.google.com/file/d/1-YRwh_9Vd2FvWdmzjUpLMSadsuRv52eV/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-sm"
          >
            📄 View Medical Guide PDF
          </a>
        </div>

        <div className="resource-card">
          <div className="resource-header">
            <span className="resource-icon">🎯</span>
            <h5 className="font-semibold">Diagnosis Algorithm</h5>
          </div>
          <p className="text-secondary mb-3">
            Step-by-step PowerPoint presentation showing the complete diagnostic algorithm and decision trees.
          </p>
          <a 
            href="https://drive.google.com/file/d/1UgsqSMKz26DN8JXzpNqevFyvEthrhH0L/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-sm"
          >
            📊 View Algorithm Presentation
          </a>
        </div>
      </div>

      <div className="about-features">
        <h4 className="text-lg font-semibold mb-4">🔬 Key Features</h4>
        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <div>
              <h5 className="font-semibold">Real-time Analysis</h5>
              <p className="text-secondary">Instant ABG interpretation with clinical implications</p>
            </div>
          </div>
          
          <div className="feature-item">
            <span className="feature-icon">📚</span>
            <div>
              <h5 className="font-semibold">Educational Content</h5>
              <p className="text-secondary">Detailed explanations of diagnosis logic</p>
            </div>
          </div>
          
          <div className="feature-item">
            <span className="feature-icon">🧮</span>
            <div>
              <h5 className="font-semibold">Advanced Calculations</h5>
              <p className="text-secondary">SIG, BDE Gap, and Anion Gap with albumin correction</p>
            </div>
          </div>
          
          <div className="feature-item">
            <span className="feature-icon">🎨</span>
            <div>
              <h5 className="font-semibold">Professional Design</h5>
              <p className="text-secondary">Medical-themed interface with accessibility features</p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-accuracy">
        <h4 className="text-lg font-semibold mb-4">⚕️ Medical Accuracy</h4>
        <p className="text-secondary mb-4">
          This application follows established medical guidelines and incorporates evidence-based calculations:
        </p>
        <ul className="accuracy-list">
          <li>• Henderson-Hasselbalch Equation for pH validation</li>
          <li>• Compensation Ratios (Acute: 1:10, Chronic: 1:4)</li>
          <li>• Anion Gap with albumin correction formula</li>
          <li>• Reference Ranges based on clinical laboratory standards</li>
          <li>• Clinical Guidelines from current medical literature</li>
        </ul>
      </div>

      <div className="about-algorithm">
        <div className="expandable-section">
          <button 
            className="expandable-trigger"
            onClick={() => toggleSection('algorithm')}
          >
            <div className="expandable-header">
              <h4 className="text-lg font-semibold">How This Diagnosis Works</h4>
              <span className={`expandable-icon ${expandedSection === 'algorithm' ? 'expanded' : ''}`}>▼</span>
            </div>
          </button>
          <div className={`expandable-content ${expandedSection === 'algorithm' ? 'open' : ''}`}>
            <div className="algorithm-steps">
              <div className="step-card">
                <h5 className="font-semibold text-primary">Step 1: pH Validation</h5>
                <div className="formula-box">
                  <strong>Henderson-Hasselbalch Equation:</strong>
                  <div className="formula">
                    pH = 6.1 + log₁₀(
                    <div className="fraction">
                      <div>[HCO₃⁻]</div>
                      <div>0.03 × PaCO₂</div>
                    </div>
                    )
                  </div>
                  <div className="formula-legend">
                    HCO₃⁻ = Bicarbonate (mmol/l)<br/>
                    PaCO₂ = Partial pressure of CO₂ (mm Hg)
                  </div>
                  <div className="validation-note">
                    If calculated pH differs &gt;0.1 from measured pH → Review input values
                  </div>
                </div>
              </div>

              <div className="step-card">
                <h5 className="font-semibold text-primary">Step 2: Primary Disorder Identification</h5>
                <div className="disorder-grid">
                  <div className="disorder-item">
                    <span className="disorder-condition">pH &lt;7.35</span>
                    <span className="disorder-result">→ Acidosis</span>
                  </div>
                  <div className="disorder-item">
                    <span className="disorder-condition">pH &gt;7.45</span>
                    <span className="disorder-result">→ Alkalosis</span>
                  </div>
                  <div className="disorder-item">
                    <span className="disorder-condition">pH 7.35-7.45</span>
                    <span className="disorder-result">→ Normal (unless compensation present)</span>
                  </div>
                </div>
              </div>

              <div className="step-card">
                <h5 className="font-semibold text-primary">Step 3: Respiratory vs Metabolic</h5>
                <div className="comparison-table">
                  <div className="table-row-header">
                    <span>Respiratory</span>
                    <span>Metabolic</span>
                  </div>
                  <div className="table-row">
                    <span>PaCO₂ abnormal (check against pH direction)</span>
                    <span>HCO₃ abnormal (check against pH direction)</span>
                  </div>
                </div>
              </div>

              <div className="step-card">
                <h5 className="font-semibold text-primary">Step 4: Compensation Assessment</h5>
                <div className="compensation-types">
                  <div className="compensation-item">
                    <strong>Acute:</strong> Expected compensation: 1:10 ratio
                  </div>
                  <div className="compensation-item">
                    <strong>Chronic:</strong> Expected compensation: 1:4 ratio
                  </div>
                  <div className="compensation-item">
                    <strong>Uncompensated:</strong> pH abnormal, no compensation
                  </div>
                  <div className="compensation-item">
                    <strong>Partially Compensated:</strong> pH abnormal, partial compensation
                  </div>
                  <div className="compensation-item">
                    <strong>Compensated:</strong> pH normal, abnormal primary values
                  </div>
                </div>
              </div>

              <div className="step-card">
                <h5 className="font-semibold text-primary">Step 5: Mixed Disorders</h5>
                <p className="text-secondary">
                  When both respiratory and metabolic components are present and don't match expected compensation patterns.
                </p>
              </div>

              <div className="step-card">
                <h5 className="font-semibold text-primary">Step 6: Anion Gap (if metabolic acidosis)</h5>
                <div className="formula-box">
                  <div className="formula">
                    AG = Na - (Cl + HCO₃) + 0.25×(44 - Albumin)
                  </div>
                  <div className="anion-gap-results">
                    <div className="result-item">
                      <span>AG ≤12</span>
                      <span className="result-normal">→ Normal anion gap acidosis</span>
                    </div>
                    <div className="result-item">
                      <span>AG &gt;12</span>
                      <span className="result-abnormal">→ High anion gap acidosis</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-disclaimer">
        <div className="disclaimer-box">
          <h5 className="font-semibold text-warning mb-2">⚠️ Medical Disclaimer</h5>
          <p className="text-secondary">
            This tool provides educational support only. Always use clinical judgment and consider full patient context.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <button onClick={() => setCurrentPage('main')} className="btn-primary">
          Back to Diagnosis
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
