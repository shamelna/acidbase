import React from 'react';
import { getValueStatus, getProgressPercentage, getPhIndicatorPosition } from '../utils/diagnosisUtils.js';

const BloodGasInputs = React.memo(({ 
  pH, setpH, 
  pv, setPaCo2, 
  hv, setHCO3, 
  UrC, setUrc, 
  urineChlorideEnabled, 
  getValueStatus, 
  getProgressPercentage, 
  getPhIndicatorPosition, 
  referenceRanges, 
  MedicalIcons,
  highlightUrineChloride
}) => {
  const [highlightRequired, setHighlightRequired] = React.useState(false);
  
  // Update highlight when prop changes
  React.useEffect(() => {
    if (highlightUrineChloride) {
      setHighlightRequired(true);
      // Auto-clear after 3 seconds
      setTimeout(() => {
        setHighlightRequired(false);
      }, 3000);
    }
  }, [highlightUrineChloride]);
  return (
    <div className="form-section card-enhanced">
      <h3 className="text-xl font-semibold">{MedicalIcons.stethoscope} Primary Blood Gas Values</h3>
      <p className="text-sm text-secondary mb-4">Please Check History and Exclude Normal ABG Samples</p>

      <div className="columns columns-2">
        <div className="column">
          <div className="tooltip">
            <label className="text-base font-medium">pH Value</label>
            <span className="tooltip-text">Normal range: 7.35-7.45</span>
          </div>
          <div className="control">
            <input 
              key="ph-input"
              className={`input value-${getValueStatus(pH, referenceRanges.pH.min, referenceRanges.pH.max)}`} 
              type="number" 
              value={pH}
              onChange={(e) => setpH(e.target.value)}
              placeholder="pH Value"
              step="0.01"
              min="6.8"
              max="8.0"
            />
            <div className="reference-range">
              Normal: {referenceRanges.pH.min}-{referenceRanges.pH.max}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${getProgressPercentage(pH, referenceRanges.pH.min, referenceRanges.pH.max)}%`}}></div>
            </div>
            <span className={`status-${getValueStatus(pH, referenceRanges.pH.min, referenceRanges.pH.max)}`}>
              {getValueStatus(pH, referenceRanges.pH.min, referenceRanges.pH.max).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="column">
          <div className="tooltip">
            <label className="text-base font-medium">PaCO2 Value</label>
            <span className="tooltip-text">Normal range: 35-45 mm Hg</span>
          </div>
          <div className="control">
            <input 
              key="paco2-input"
              className={`input value-${getValueStatus(pv, referenceRanges.PaCO2.min, referenceRanges.PaCO2.max)}`} 
              type="number" 
              value={pv}
              onChange={(e) => setPaCo2(e.target.value)}
              placeholder="PaCO2 Value (mm Hg)"
              step="1"
              min="20"
              max="80"
            />
            <div className="reference-range">
              Normal: {referenceRanges.PaCO2.min}-{referenceRanges.PaCO2.max} {referenceRanges.PaCO2.unit}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${getProgressPercentage(pv, referenceRanges.PaCO2.min, referenceRanges.PaCO2.max)}%`}}></div>
            </div>
            <span className={`status-${getValueStatus(pv, referenceRanges.PaCO2.min, referenceRanges.PaCO2.max)}`}>
              {getValueStatus(pv, referenceRanges.PaCO2.min, referenceRanges.PaCO2.max).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="columns columns-2 mt-4">
        <div className="column">
          <div className="tooltip">
            <label className="text-base font-medium">HCO3 Value</label>
            <span className="tooltip-text">Normal range: 22-28 mmol/l</span>
          </div>
          <div className="control">
            <input 
              key="hco3-input"
              className={`input value-${getValueStatus(hv, referenceRanges.HCO3.min, referenceRanges.HCO3.max)}`} 
              type="number" 
              value={hv}
              onChange={(e) => setHCO3(e.target.value)}
              placeholder="HCO3 Value (mmol/l)"
              step="0.1"
              min="10"
              max="40"
            />
            <div className="reference-range">
              Normal: {referenceRanges.HCO3.min}-{referenceRanges.HCO3.max} {referenceRanges.HCO3.unit}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${getProgressPercentage(hv, referenceRanges.HCO3.min, referenceRanges.HCO3.max)}%`}}></div>
            </div>
            <span className={`status-${getValueStatus(hv, referenceRanges.HCO3.min, referenceRanges.HCO3.max)}`}>
              {getValueStatus(hv, referenceRanges.HCO3.min, referenceRanges.HCO3.max).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="column">
          <div className="tooltip">
            <label className="text-base font-medium">
              Ur.Chloride
              {urineChlorideEnabled && (!UrC || UrC === '') && (
                <span className={`required-indicator ${highlightRequired ? 'highlight-required' : ''}`}>
                  * Required
                </span>
              )}
            </label>
            <span className="tooltip-text">Required for metabolic alkalosis diagnosis</span>
          </div>
          <div className="control">
            <input 
              key="urine-chloride-input"
              className={`input ${!urineChlorideEnabled ? 'disabled' : ''} ${highlightRequired && (!UrC || UrC === '') ? 'highlight-border' : ''}`} 
              type="number" 
              value={UrC}
              onChange={(e) => {
                setUrc(e.target.value);
                if (e.target.value) {
                  setHighlightRequired(false);
                }
              }}
              placeholder="Ur.Chloride"
              disabled={!urineChlorideEnabled}
              step="1"
              min="0"
              max="200"
            />
            {!urineChlorideEnabled && (
                <div className="field-disabled-hint">
                  <small>Enabled when Metabolic Alkalosis is detected</small>
                </div>
              )}
            {urineChlorideEnabled && (!UrC || UrC === '') && (
              <div className={`field-required-hint ${highlightRequired ? 'highlight-hint' : ''}`}>
                <small>Required for complete metabolic alkalosis assessment</small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* pH Scale Visual */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-2">pH Scale Visual</h4>
        <div className="ph-scale">
          <div 
            className="ph-indicator" 
            style={{left: `${getPhIndicatorPosition(pH)}%`}}
          ></div>
        </div>
        <div className="ph-labels">
          <span>6.8</span>
          <span>7.0</span>
          <span>7.2</span>
          <span>7.4</span>
          <span>7.6</span>
          <span>7.8</span>
          <span>8.0</span>
        </div>
      </div>
    </div>
  );
});

BloodGasInputs.displayName = 'BloodGasInputs';

export default BloodGasInputs;
