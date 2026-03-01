import React from 'react';

const AdvancedCalculations = ({ 
  K, setK, 
  Ca, setCa, 
  Mg, setMg, 
  Lactate, setLactate, 
  PO4, setPO4, 
  SBD, setSBD,
  CalcSEtext, 
  copied, 
  copyToClipboard, 
  CalcSE, 
  isLoading,
  getValueStatus, 
  getProgressPercentage,
  referenceRanges,
  MedicalIcons 
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold">{MedicalIcons.lab} Advanced Calculations</h3>
      <p className="text-sm text-secondary mb-4">Calculate Strong Ion Gap (SIG) and Base Deficit Excess (BDE) Gap</p>

      <div className="columns columns-3">
        <div className="column">
          <div className="tooltip">
            <label className="text-base font-medium">Potassium (K)</label>
            <span className="tooltip-text">Normal range: 3.5-5.1 mmol/l</span>
          </div>
          <div className="control">
            <input 
              className={`input value-${getValueStatus(K, referenceRanges.K.min, referenceRanges.K.max)}`} 
              type="number" 
              value={K}
              onChange={(e) => setK(e.target.value)}
              placeholder="K (mmol/l)"
            />
            <div className="reference-range">
              Normal: {referenceRanges.K.min}-{referenceRanges.K.max} {referenceRanges.K.unit}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${getProgressPercentage(K, referenceRanges.K.min, referenceRanges.K.max)}%`}}></div>
            </div>
            <span className={`status-${getValueStatus(K, referenceRanges.K.min, referenceRanges.K.max)}`}>
              {getValueStatus(K, referenceRanges.K.min, referenceRanges.K.max).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="column">
          <div className="tooltip">
            <label className="text-base font-medium">Calcium (Ca)</label>
            <span className="tooltip-text">Normal range: 2.1-2.6 mmol/l</span>
          </div>
          <div className="control">
            <input 
              className={`input value-${getValueStatus(Ca, referenceRanges.Ca.min, referenceRanges.Ca.max)}`} 
              type="number" 
              value={Ca}
              onChange={(e) => setCa(e.target.value)}
              placeholder="Ca (mmol/l)"
            />
            <div className="reference-range">
              Normal: {referenceRanges.Ca.min}-{referenceRanges.Ca.max} {referenceRanges.Ca.unit}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${getProgressPercentage(Ca, referenceRanges.Ca.min, referenceRanges.Ca.max)}%`}}></div>
            </div>
            <span className={`status-${getValueStatus(Ca, referenceRanges.Ca.min, referenceRanges.Ca.max)}`}>
              {getValueStatus(Ca, referenceRanges.Ca.min, referenceRanges.Ca.max).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="column">
          <div className="tooltip">
            <label className="text-base font-medium">Magnesium (Mg)</label>
            <span className="tooltip-text">Normal range: 0.7-1.0 mmol/l</span>
          </div>
          <div className="control">
            <input 
              className={`input value-${getValueStatus(Mg, referenceRanges.Mg.min, referenceRanges.Mg.max)}`} 
              type="number" 
              value={Mg}
              onChange={(e) => setMg(e.target.value)}
              placeholder="Mg (mmol/l)"
            />
            <div className="reference-range">
              Normal: {referenceRanges.Mg.min}-{referenceRanges.Mg.max} {referenceRanges.Mg.unit}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${getProgressPercentage(Mg, referenceRanges.Mg.min, referenceRanges.Mg.max)}%`}}></div>
            </div>
            <span className={`status-${getValueStatus(Mg, referenceRanges.Mg.min, referenceRanges.Mg.max)}`}>
              {getValueStatus(Mg, referenceRanges.Mg.min, referenceRanges.Mg.max).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="columns columns-3 mt-4">
        <div className="column">
          <div className="tooltip">
            <label className="text-base font-medium">Lactate</label>
            <span className="tooltip-text">Normal range: 0.5-2.2 mmol/l</span>
          </div>
          <div className="control">
            <input 
              className={`input value-${getValueStatus(Lactate, referenceRanges.Lactate.min, referenceRanges.Lactate.max)}`} 
              type="number" 
              value={Lactate}
              onChange={(e) => setLactate(e.target.value)}
              placeholder="Lactate (mmol/l)"
            />
            <div className="reference-range">
              Normal: {referenceRanges.Lactate.min}-{referenceRanges.Lactate.max} {referenceRanges.Lactate.unit}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${getProgressPercentage(Lactate, referenceRanges.Lactate.min, referenceRanges.Lactate.max)}%`}}></div>
            </div>
            <span className={`status-${getValueStatus(Lactate, referenceRanges.Lactate.min, referenceRanges.Lactate.max)}`}>
              {getValueStatus(Lactate, referenceRanges.Lactate.min, referenceRanges.Lactate.max).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="column">
          <div className="tooltip">
            <label className="text-base font-medium">Phosphate (PO4)</label>
            <span className="tooltip-text">Normal range: 0.8-1.5 mmol/l</span>
          </div>
          <div className="control">
            <input 
              className={`input value-${getValueStatus(PO4, referenceRanges.PO4.min, referenceRanges.PO4.max)}`} 
              type="number" 
              value={PO4}
              onChange={(e) => setPO4(e.target.value)}
              placeholder="PO4 (mmol/l)"
            />
            <div className="reference-range">
              Normal: {referenceRanges.PO4.min}-{referenceRanges.PO4.max} {referenceRanges.PO4.unit}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${getProgressPercentage(PO4, referenceRanges.PO4.min, referenceRanges.PO4.max)}%`}}></div>
            </div>
            <span className={`status-${getValueStatus(PO4, referenceRanges.PO4.min, referenceRanges.PO4.max)}`}>
              {getValueStatus(PO4, referenceRanges.PO4.min, referenceRanges.PO4.max).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="column">
          <div className="tooltip">
            <label className="text-base font-medium">+ve STD Base Deficit</label>
            <span className="tooltip-text">Must be positive value (&gt;0) for SIG/EDB calculation</span>
          </div>
          <div className="control">
            <input 
              className={`input value-${getValueStatus(SBD, 0, 10)} ${SBD && parseFloat(SBD) <= 0 ? 'input-error' : ''}`} 
              type="number" 
              value={SBD}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || parseFloat(value) > 0) {
                  setSBD(value);
                  e.target.classList.remove('input-error');
                } else if (parseFloat(value) <= 0) {
                  e.target.classList.add('input-error');
                  setSBD('');
                }
              }}
              placeholder="Positive value only"
              min="0.1"
              step="0.1"
            />
            <div className="reference-range">
              Required: &gt; 0 {referenceRanges.SBD.unit}
            </div>
            {SBD && parseFloat(SBD) <= 0 && (
              <div className="field-error-hint">
                <small className="text-danger">⚠️ Must be positive value for calculation</small>
              </div>
            )}
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${getProgressPercentage(SBD, 0, 10)}%`}}></div>
            </div>
            <span className={`status-${getValueStatus(SBD, 0, 10)}`}>
              {SBD && parseFloat(SBD) > 0 ? getValueStatus(SBD, 0, 10).toUpperCase() : 'REQUIRED'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button 
          onClick={CalcSE} 
          className={`btn-primary ${isLoading ? 'loading' : ''}`}
        >
          {isLoading ? 'Calculating...' : 'Calculate SIG / EDB Gap'}
        </button>
      </div>

      <div className={`mt-4 ${CalcSEtext ? 'slide-in-up' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{MedicalIcons.lab} SIG / EDB Gap Results</h3>
          {CalcSEtext && (
            <button 
              onClick={() => copyToClipboard(CalcSEtext)}
              className={`copy-btn ${copied ? 'copied' : ''}`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>

        {CalcSEtext && CalcSEtext.includes('SIG=') ? (
          <div className="sig-results-rich">
            {CalcSEtext.split('\n').map((line, index) => {
              if (line.includes('SIG=')) {
                const sigValue = line.split('=')[1];
                const isAbnormal = line.includes('Abnormal');
                return (
                  <div key={index} className={`sig-result-item ${isAbnormal ? 'sig-abnormal' : 'sig-normal'}`}>
                    <div className="sig-label">
                      <span className="sig-icon">{isAbnormal ? '⚠️' : '✅'}</span>
                      <span className="sig-title">Strong Ion Gap (SIG)</span>
                    </div>
                    <div className="sig-value">{sigValue}</div>
                  </div>
                );
              } else if (line.includes('BDE Gap=')) {
                const bdeValue = line.split('=')[1];
                return (
                  <div key={index} className="sig-result-item sig-bde">
                    <div className="sig-label">
                      <span className="sig-icon">📊</span>
                      <span className="sig-title">Base Deficit Excess (BDE) Gap</span>
                    </div>
                    <div className="sig-value">{bdeValue}</div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        ) : CalcSEtext && CalcSEtext.includes('Cannot calculate') ? (
          <div className="sig-error">
            <div className="sig-error-icon">⚠️</div>
            <div className="sig-error-content">
              <h4>Calculation Error</h4>
              <pre className="sig-error-message">{CalcSEtext}</pre>
            </div>
          </div>
        ) : (
          <div className="sig-placeholder">
            <div className="sig-placeholder-icon">🧮</div>
            <p>SIG / EDB Gap results will appear here...</p>
            <p className="text-sm text-secondary">Complete all required values and click Calculate SIG / EDB Gap</p>
          </div>
        )}

        {CalcSEtext && CalcSEtext.includes('Abnormal') && (
          <div className="mt-4">
            <div className="status-critical">
              ABNORMAL ANION GAP DETECTED
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedCalculations;
