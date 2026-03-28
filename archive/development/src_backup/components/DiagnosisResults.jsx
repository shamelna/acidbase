import React from 'react';

const DiagnosisResults = ({ 
  input, 
  pH, 
  pv, 
  hv, 
  copied, 
  copyToClipboard, 
  saveCase, 
  exportToPDF, 
  clearAllValues,
  getValueStatus,
  getDiagnosisClassification,
  MedicalIcons 
}) => {
  return (
    <div className="diagnosis-result-main">
      <div className={`diagnosis-card ${getDiagnosisClassification(input) === 'normal' ? 'diagnosis-normal' : getDiagnosisClassification(input) === 'pathological' ? 'diagnosis-pathological' : 'diagnosis-critical'}`}>
        <div className="diagnosis-header">
          <div className="diagnosis-icon">
            {input.includes('Normal') ? MedicalIcons.heart : 
             input.includes('Acidosis') ? <span className="warning-icon">⚠️</span> :
             input.includes('Alkalosis') ? <span className="warning-icon">⚠️</span> :
             <span className="critical-icon">🚨</span>}
          </div>
          <div className="diagnosis-title">
            <h2 className={`diagnosis-label ${getDiagnosisClassification(input) === 'normal' ? 'diagnosis-normal-text' : getDiagnosisClassification(input) === 'pathological' ? 'diagnosis-pathological-text' : 'diagnosis-abnormal-text'}`}>
              {/* Commented out: Diagnosis title message */}
              {/* {input.includes('Normal') ? '✅ NORMAL ACID-BASE STATUS' : 
               getDiagnosisClassification(input) === 'pathological' ? '🚨 PATHOLOGICAL FINDINGS' : '⚠️ DIAGNOSTIC ABNORMALITY'} */}
            </h2>
            <p className={`diagnosis-subtitle ${getDiagnosisClassification(input) === 'normal' ? 'diagnosis-normal-subtitle' : getDiagnosisClassification(input) === 'pathological' ? 'diagnosis-pathological-subtitle' : 'diagnosis-abnormal-subtitle'}`}>{input}</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="diagnosis-actions mt-4">
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={() => copyToClipboard(input)}
              className={`copy-btn ${copied ? 'copied' : ''}`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button 
              onClick={saveCase}
              className="btn-secondary"
              title="Save functionality coming soon"
            >
              Save (Coming Soon)
            </button>
            <button 
              onClick={exportToPDF}
              className="export-btn"
            >
              Export
            </button>
            <button 
              onClick={clearAllValues}
              className="btn-danger"
            >
              Clear All Values
            </button>
          </div>
        </div>
        
        {/* Lab Values - Separate Section */}
        <div className="lab-values-section mt-6">
          <h4 className="text-lg font-semibold mb-3">Input Values</h4>
          <div className="diagnosis-metrics">
            <div className="metric-item">
              <span className="metric-label">pH</span>
              <span className={`metric-value ${getValueStatus(pH, 7.35, 7.45)}`}>{pH}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">PaCO₂</span>
              <span className={`metric-value ${getValueStatus(pv, 35, 45)}`}>{pv}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">HCO₃⁻</span>
              <span className={`metric-value ${getValueStatus(hv, 22, 28)}`}>{hv}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisResults;
