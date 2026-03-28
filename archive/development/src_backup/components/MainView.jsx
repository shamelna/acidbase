import React from 'react';
import BloodGasInputs from './BloodGasInputs.jsx';
import ElectrolyteInputs from './ElectrolyteInputs.jsx';
import ClinicalContext from './ClinicalContext.jsx';
import ActionsBar from './ActionsBar.jsx';
import DiagnosisResults from './DiagnosisResults.jsx';
import UnderstandingDiagnosis from './UnderstandingDiagnosis.jsx';
import AdvancedCalculations from './AdvancedCalculations.jsx';
import AboutPage from './AboutPage.jsx';

// Medical Icons
const MedicalIcons = {
  stethoscope: '🩺',
  lab: '🔬',
  heart: '❤️',
  settings: '⚙️'
};

const MainView = ({ 
  pH, setpH, 
  pv, setPaCo2, 
  hv, setHCO3, 
  nav, setNa, 
  clv, setCl, 
  albuminv, setAlbumin, 
  UrC, setUrc, 
  CCo2C, setCheckCCo2, 
  ExacC, setCheckExac, 
  K, setK, 
  Ca, setCa, 
  Mg, setMg, 
  Lactate, setLactate, 
  PO4, setPO4, 
  SBD, setSBD, 
  input, setInput, 
  CalcSEtext, setCalcSEtext, 
  isLoading, setIsLoading, copied, setCopied, currentPage, setCurrentPage, expandedSections, setExpandedSections,
  toggleSection, 
  showInstallPrompt, setShowInstallPrompt, deferredPrompt, setDeferredPrompt, urineChlorideEnabled, 
  referenceRanges, 
  getValueStatus, getProgressPercentage, getPhIndicatorPosition, getDiagnosisClassification, copyToClipboard, 
  solve, CalcSE, clearAllValues, resetToNormal, saveCase, exportToPDF,
  handleInstallClick, dismissInstallPrompt,
  diagnosisResult,
  highlightUrineChloride
}) => {
  // Enhanced solve function
  const handleDiagnose = () => {
    solve();
  };

  return (
    <div className="app-wrapper">
      <div className="container fade-in-up">
        {/* PWA Install Prompt - Mobile Optimized */}
        {showInstallPrompt && !sessionStorage.getItem('installPromptDismissed') && currentPage === 'main' && (
          <div className="install-prompt mobile-optimized">
            <div className="install-prompt-content">
              <div className="install-prompt-icon">
                <img src="/favicon.svg" alt="App Icon" style={{width: '32px', height: '32px'}} />
              </div>
              <div className="install-prompt-text">
                <strong style={{color: 'white'}}>📱 Install Acid Base App</strong>
              </div>
              <div className="install-prompt-actions">
                <button 
                  onClick={handleInstallClick}
                  className="btn-primary btn-sm"
                >
                  Install
                </button>
                <button 
                  onClick={dismissInstallPrompt}
                  className="btn-secondary btn-sm"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="header" style={{paddingTop: '40px'}}>
          <div className="text-center">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-2 px-4">
              <div className="flex justify-center items-center mb-2 sm:mb-0">
                <a href="/" className="flex justify-center items-center" style={{textDecoration: 'none', color: 'inherit'}}>
                  <img src="/favicon.svg" alt="Acid Base Logo" style={{width: '40px', height: '40px', marginRight: '12px'}} />
                </a>
                <h1 className="text-2xl sm:text-4xl font-bold text-center sm:text-left" style={{marginTop: '20px'}}>ACID BASE MEDICAL DIAGNOSIS</h1>
              </div>
              <button onClick={() => setCurrentPage(currentPage === 'about' ? 'main' : 'about')} className="btn-secondary text-sm px-4 py-2">
                {currentPage === 'about' ? 'Back' : 'About'}
              </button>
            </div>
            <h2 className="text-lg sm:text-xl font-normal">Kaizen Made Easy - Professional Medical Tool</h2>
          </div>
        </div>

        {/* About Overlay Modal */}
        {currentPage === 'about' && (
          <div className="about-overlay">
            <div className="about-modal">
              <div className="about-header">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img src="/favicon.svg" alt="Acid Base Logo" style={{width: '40px', height: '40px', marginRight: '12px'}} />
                    <h2 className="text-2xl font-bold">About Acid Base Medical Diagnosis</h2>
                  </div>
                  <button 
                    onClick={() => setCurrentPage('main')} 
                    className="btn-close-modal"
                    aria-label="Close About"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="about-content">
                <AboutPage setCurrentPage={setCurrentPage} />
              </div>
            </div>
          </div>
        )}

        {currentPage !== 'about' && (
          <>
            <div className="mt-8">
              <BloodGasInputs 
                pH={pH} setpH={setpH}
                pv={pv} setPaCo2={setPaCo2}
                hv={hv} setHCO3={setHCO3}
                UrC={UrC} setUrc={setUrc}
                urineChlorideEnabled={urineChlorideEnabled}
                getValueStatus={getValueStatus}
                getProgressPercentage={getProgressPercentage}
                getPhIndicatorPosition={getPhIndicatorPosition}
                referenceRanges={referenceRanges}
                MedicalIcons={MedicalIcons}
                highlightUrineChloride={highlightUrineChloride}
              />
              
              <ElectrolyteInputs 
                nav={nav} setNa={setNa}
                clv={clv} setCl={setCl}
                albuminv={albuminv} setAlbumin={setAlbumin}
                getValueStatus={getValueStatus}
                getProgressPercentage={getProgressPercentage}
                referenceRanges={referenceRanges}
                MedicalIcons={MedicalIcons}
              />
              
              <ClinicalContext 
                CCo2C={CCo2C} setCheckCCo2={setCheckCCo2}
                ExacC={ExacC} setCheckExac={setCheckExac}
              />
              
              <ActionsBar 
                solve={handleDiagnose}
                clearAllValues={clearAllValues}
                resetToNormal={resetToNormal}
                isLoading={isLoading}
              />
            </div>

            <div className={`form-section card-enhanced ${input ? 'slide-in-up' : ''}`}>
              {input ? (
                <>
                  <div className="diagnosis-header">
                    <h3 className="text-xl font-semibold mb-2">{MedicalIcons.stethoscope} Diagnosis Results</h3>
                  </div>
                  
                  <DiagnosisResults 
                    input={input}
                    pH={pH}
                    pv={pv}
                    hv={hv}
                    copied={copied}
                    copyToClipboard={copyToClipboard}
                    saveCase={saveCase}
                    exportToPDF={exportToPDF}
                    clearAllValues={clearAllValues}
                    getValueStatus={getValueStatus}
                    getDiagnosisClassification={getDiagnosisClassification}
                    MedicalIcons={MedicalIcons}
                  />

                  <UnderstandingDiagnosis 
                    input={input}
                    pH={pH}
                    pv={pv}
                    hv={hv}
                    expandedSections={expandedSections}
                    toggleSection={toggleSection}
                    UrC={UrC}
                    diagnosisResult={diagnosisResult}
                  />
                  
                  <AdvancedCalculations 
                    K={K} setK={setK}
                    Ca={Ca} setCa={setCa}
                    Mg={Mg} setMg={setMg}
                    Lactate={Lactate} setLactate={setLactate}
                    PO4={PO4} setPO4={setPO4}
                    SBD={SBD} setSBD={setSBD}
                    CalcSEtext={CalcSEtext}
                    copied={copied}
                    copyToClipboard={copyToClipboard}
                    CalcSE={CalcSE}
                    isLoading={isLoading}
                    getValueStatus={getValueStatus}
                    getProgressPercentage={getProgressPercentage}
                    referenceRanges={referenceRanges}
                    MedicalIcons={MedicalIcons}
                  />
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400">
                    {MedicalIcons.stethoscope}
                    <p className="mt-2">Enter values and click "Diagnose" to see results</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MainView;
