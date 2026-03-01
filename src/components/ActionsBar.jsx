import React from 'react';

const ActionsBar = ({ solve, clearAllValues, resetToNormal, isLoading }) => {
  return (
    <div className="form-section card-enhanced">
      <h3 className="text-xl font-semibold">❤️ Actions</h3>
      <div className="columns columns-3">
        <div className="column">
          <button 
            onClick={solve}
            className={`btn-primary ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Diagnose'}
          </button>
        </div>
        <div className="column">
          <button 
            className="btn-danger"
            onClick={clearAllValues}
          >
            Clear All Values
          </button>
        </div>
        <div className="column">
          <button 
            className="btn-primary"
            onClick={resetToNormal}
          >
            Reset to Normal
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionsBar;
