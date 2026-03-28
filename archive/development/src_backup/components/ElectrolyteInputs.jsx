import React from 'react';

const ElectrolyteInputs = ({ 
  nav, setNa, 
  clv, setCl, 
  albuminv, setAlbumin,
  getValueStatus, 
  getProgressPercentage,
  referenceRanges,
  MedicalIcons 
}) => {
  return (
    <div className="form-section card-enhanced">
      <h3 className="text-xl font-semibold">{MedicalIcons.lab} Electrolyte Values</h3>
      <p className="text-sm text-secondary mb-4">Na, Cl, Albumin are required only for Metabolic Acidosis Diagnosis</p>

      <div className="columns columns-3">
        <div className="column">
          <div className="tooltip">
            <label className="text-base font-medium">Na Value</label>
            <span className="tooltip-text">Normal range: 135-145 mmol/l</span>
          </div>
          <div className="control">
            <input 
              key="na-input"
              className={`input value-${getValueStatus(nav, referenceRanges.Na.min, referenceRanges.Na.max)}`} 
              type="number" 
              value={nav}
              onChange={(e) => setNa(e.target.value)}
              placeholder="Na Value (mmol/l)"
              step="1"
              min="120"
              max="160"
            />
            <div className="reference-range">
              Normal: {referenceRanges.Na.min}-{referenceRanges.Na.max} {referenceRanges.Na.unit}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${getProgressPercentage(nav, referenceRanges.Na.min, referenceRanges.Na.max)}%`}}></div>
            </div>
            <span className={`status-${getValueStatus(nav, referenceRanges.Na.min, referenceRanges.Na.max)}`}>
              {getValueStatus(nav, referenceRanges.Na.min, referenceRanges.Na.max).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="column">
          <div className="tooltip">
            <label className="text-base font-medium">Cl Value</label>
            <span className="tooltip-text">Normal range: 95-105 mmol/l</span>
          </div>
          <div className="control">
            <input 
              key="cl-input"
              className={`input value-${getValueStatus(clv, referenceRanges.Cl.min, referenceRanges.Cl.max)}`} 
              type="number" 
              value={clv}
              onChange={(e) => setCl(e.target.value)}
              placeholder="Cl Value (mmol/l)"
              step="1"
              min="80"
              max="120"
            />
            <div className="reference-range">
              Normal: {referenceRanges.Cl.min}-{referenceRanges.Cl.max} {referenceRanges.Cl.unit}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${getProgressPercentage(clv, referenceRanges.Cl.min, referenceRanges.Cl.max)}%`}}></div>
            </div>
            <span className={`status-${getValueStatus(clv, referenceRanges.Cl.min, referenceRanges.Cl.max)}`}>
              {getValueStatus(clv, referenceRanges.Cl.min, referenceRanges.Cl.max).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="column">
          <div className="tooltip">
            <label className="text-base font-medium">Albumin Value</label>
            <span className="tooltip-text">Normal range: 35-50 g/l</span>
          </div>
          <div className="control">
            <input 
              key="albumin-input"
              className={`input value-${getValueStatus(albuminv, referenceRanges.Albumin.min, referenceRanges.Albumin.max)}`} 
              type="number" 
              value={albuminv}
              onChange={(e) => setAlbumin(e.target.value)}
              placeholder="Albumin Value (g/l)"
              step="0.1"
              min="20"
              max="60"
            />
            <div className="reference-range">
              Normal: {referenceRanges.Albumin.min}-{referenceRanges.Albumin.max} {referenceRanges.Albumin.unit}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${getProgressPercentage(albuminv, referenceRanges.Albumin.min, referenceRanges.Albumin.max)}%`}}></div>
            </div>
            <span className={`status-${getValueStatus(albuminv, referenceRanges.Albumin.min, referenceRanges.Albumin.max)}`}>
              {getValueStatus(albuminv, referenceRanges.Albumin.min, referenceRanges.Albumin.max).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectrolyteInputs;
