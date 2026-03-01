import React from 'react';

const ClinicalContext = ({ CCo2C, setCheckCCo2, ExacC, setCheckExac }) => {
  return (
    <div className="form-section card-enhanced">
      <h3 className="text-xl font-semibold">⚙️ Clinical Context</h3>

      <div className="columns columns-2">
        <div className="column">
          <div className="checkbox">
              <input type="checkbox" 
              checked={CCo2C}
              onChange={(e) => setCheckCCo2(e.target.checked)}
              />
              <label className="text-base font-medium">Chronic CO2 Retention</label>
          </div>
          <div className="text-sm text-secondary mt-2">
            Check if patient has chronic respiratory acidosis
          </div>
        </div>

        <div className="column">
          <div className="checkbox">
              <input type="checkbox" 
              checked={ExacC}
              onChange={(e) => setCheckExac(e.target.checked)}
              />
              <label className="text-base font-medium">Exacerbation</label>
          </div>
          <div className="text-sm text-secondary mt-2">
            Check if patient is experiencing acute exacerbation
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalContext;
