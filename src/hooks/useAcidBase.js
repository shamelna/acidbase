import { useState, useMemo, useCallback, useRef } from 'react';
import { Diagnosis, displayDiag } from '../utils/diagnosisLogic.js';
import { getValueStatus, getProgressPercentage, getPhIndicatorPosition, getDiagnosisClassification, copyToClipboard } from '../utils/diagnosisUtils.js';

export const useAcidBase = () => {
  // State management - prefilled with normal values
  const [pH, setpH] = useState('7.40');
  const [pv, setPaCo2] = useState('40');
  const [hv, setHCO3] = useState('24');
  const [nav, setNa] = useState('140');
  const [clv, setCl] = useState('100');
  const [albuminv, setAlbumin] = useState('40');
  const [UrC, setUrc] = useState('');
  const [CCo2C, setCheckCCo2] = useState(false);
  const [ExacC, setCheckExac] = useState(false);
  const [K, setK] = useState('4.0');
  const [Ca, setCa] = useState('2.3');
  const [Mg, setMg] = useState('0.8');
  const [Lactate, setLactate] = useState('1.0');
  const [PO4, setPO4] = useState('1.2');
  const [SBD, setSBD] = useState('0');
  const [input, setInput] = useState('');
  const [CalcSEtext, setCalcSEtext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState('main');
  const [expandedSections, setExpandedSections] = useState({
    diagnosisLogic: true, // Open by default
    clinicalContext: false,
    pHScale: false,
    compensation: false,
    anionGap: false,
    sigCalculation: false
  });
  const [highlightUrineChloride, setHighlightUrineChloride] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Debounce refs
  const pHTimeoutRef = useRef(null);
  const pvTimeoutRef = useRef(null);
  const hvTimeoutRef = useRef(null);

  // Debounced state setters with debugging
  const setpHWithDebug = useCallback((value) => {
    console.log('setpH called with:', value);
    if (pHTimeoutRef.current) {
      clearTimeout(pHTimeoutRef.current);
    }
    pHTimeoutRef.current = setTimeout(() => {
      setpH(value);
    }, 50); // 50ms debounce
  }, []);
  
  const setPaCo2WithDebug = useCallback((value) => {
    console.log('setPaCo2 called with:', value);
    if (pvTimeoutRef.current) {
      clearTimeout(pvTimeoutRef.current);
    }
    pvTimeoutRef.current = setTimeout(() => {
      setPaCo2(value);
    }, 50); // 50ms debounce
  }, []);
  
  const setHCO3WithDebug = useCallback((value) => {
    console.log('setHCO3 called with:', value);
    if (hvTimeoutRef.current) {
      clearTimeout(hvTimeoutRef.current);
    }
    hvTimeoutRef.current = setTimeout(() => {
      setHCO3(value);
    }, 50); // 50ms debounce
  }, []);

  // Reference ranges
  const referenceRanges = {
    pH: { min: 7.35, max: 7.45, unit: '' },
    PaCO2: { min: 35, max: 45, unit: 'mm Hg' },
    HCO3: { min: 22, max: 28, unit: 'mmol/l' },
    Na: { min: 135, max: 145, unit: 'mmol/l' },
    Cl: { min: 95, max: 105, unit: 'mmol/l' },
    Albumin: { min: 35, max: 50, unit: 'g/l' },
    K: { min: 3.5, max: 5.1, unit: 'mmol/l' },
    Ca: { min: 2.1, max: 2.6, unit: 'mmol/l' },
    Mg: { min: 0.7, max: 1.0, unit: 'mmol/l' },
    Lactate: { min: 0.5, max: 2.2, unit: 'mmol/l' },
    PO4: { min: 0.8, max: 1.5, unit: 'mmol/l' },
    SBD: { min: -2, max: 2, unit: 'mmol/l' }
  };

  // Computed values - optimized with useMemo
  const urineChlorideEnabled = useMemo(() => parseFloat(hv) > 28, [hv]);

  // Memoized utility functions to prevent re-renders
  const memoizedGetValueStatus = useMemo(() => getValueStatus, []);
  const memoizedGetProgressPercentage = useMemo(() => getProgressPercentage, []);
  const memoizedGetPhIndicatorPosition = useMemo(() => getPhIndicatorPosition, []);
  const memoizedGetDiagnosisClassification = useMemo(() => getDiagnosisClassification, []);
  const memoizedCopyToClipboard = useMemo(() => copyToClipboard, []);

  // Toggle functions with useCallback
  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  // PWA install prompt handlers with useCallback
  const handleInstallClick = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
      }
    }
  }, [deferredPrompt]);

  const dismissInstallPrompt = useCallback(() => {
    setShowInstallPrompt(false);
    sessionStorage.setItem('installPromptDismissed', 'true');
  }, []);

  // Main diagnosis function with useCallback
  const solve = useCallback(() => {
    setIsLoading(true);
    setCopied(false);
    
    // Reset diagnosis results before continuing
    setInput('');
    setDiagnosisResult(null);
    
    setTimeout(() => {
      // Check if urine chloride is required but missing
      const isMetabolicAlkalosis = parseFloat(hv) > 28;
      const urineChlorideMissing = !UrC || UrC === '';
      
      if (isMetabolicAlkalosis && urineChlorideMissing) {
        // Show notification and scroll to urine chloride field
        setInput("⚠️ URINE CHLORIDE NEEDED\n\nFor metabolic alkalosis, urine chloride helps determine:\n\n• Volume-responsive (Urine Cl < 20 mmol/l)\n• Volume-resistant (Urine Cl > 20 mmol/l)\n\nPlease enter urine chloride value below.\n\nDiagnosis will proceed with current values.");
        setIsLoading(false);
        
        // Trigger highlight in BloodGasInputs component
        setHighlightUrineChloride(true);
        
        // Scroll to urine chloride field after a short delay
        setTimeout(() => {
          const urineChlorideField = document.querySelector('input[placeholder*="Ur.Chloride"]');
          if (urineChlorideField) {
            urineChlorideField.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
            // Add visual highlight
            urineChlorideField.classList.add('input-highlight');
            setTimeout(() => {
              urineChlorideField.classList.remove('input-highlight');
            }, 3000);
          }
        }, 100);
        return;
      }
      
      const result = Diagnosis(pH, pv, hv, nav, clv, albuminv, UrC, CCo2C, ExacC);
      const display = displayDiag(result);
      setInput(display);
      setDiagnosisResult(result); // Store the structured result
      setIsLoading(false);
      
      // Smooth scroll to diagnosis results positioned at vertical middle with enhanced animation
      setTimeout(() => {
        const resultsElement = document.querySelector('.diagnosis-enhanced');
        if (resultsElement) {
          const elementRect = resultsElement.getBoundingClientRect();
          const elementTop = elementRect.top + window.pageYOffset;
          const windowHeight = window.innerHeight;
          const elementHeight = elementRect.height;
          
          // Calculate scroll position to center the element vertically
          const scrollToPosition = elementTop - (windowHeight / 2) + (elementHeight / 2);
          
          // Enhanced smooth scrolling with custom animation
          const startPosition = window.pageYOffset;
          const distance = scrollToPosition - startPosition;
          const duration = 800; // Animation duration in milliseconds
          let startTime = null;
          
          function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          }
          
          function animateScroll(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easeProgress = easeInOutCubic(progress);
            
            const currentPosition = startPosition + (distance * easeProgress);
            window.scrollTo(0, currentPosition);
            
            if (timeElapsed < duration) {
              requestAnimationFrame(animateScroll);
            }
          }
          
          requestAnimationFrame(animateScroll);
        }
      }, 500); // Wait for results to render
    }, 1000);
  }, [pH, pv, hv, nav, clv, albuminv, UrC, CCo2C, ExacC]);

  // SIG/EDB Gap calculation with useCallback
  const CalcSE = useCallback(() => {
    setIsLoading(true);
    setCopied(false);
    
    setTimeout(() => {
      const k = parseFloat(K);
      const ca = parseFloat(Ca);
      const mg = parseFloat(Mg);
      const lactate = parseFloat(Lactate);
      const po4 = parseFloat(PO4);
      const sbd = parseFloat(SBD);
      const navValue = parseFloat(nav);
      const clValue = parseFloat(clv);
      const albuminValue = parseFloat(albuminv);
      const pHValue = parseFloat(pH);
      const hvValue = parseFloat(hv);
      
      console.log('CalcSE called with values:', { k, ca, mg, lactate, po4, sbd, navValue, clValue, albuminValue, pHValue, hvValue });
      
      // Check for missing or invalid values (gold standard requirements)
      const missingFields = [];
      const invalidFields = [];
      
      if (K === "") missingFields.push("K");
      if (Ca === "") missingFields.push("Ca");
      if (Mg === "") missingFields.push("Mg");
      if (Lactate === "") missingFields.push("Lactate");
      if (PO4 === "") missingFields.push("PO4");
      if (nav === "") missingFields.push("Na");
      if (clv === "") missingFields.push("Cl");
      if (albuminv === "") missingFields.push("Albumin");
      if (pH === "") missingFields.push("pH");
      
      if (SBD === "" || parseFloat(SBD) <= 0) {
        if (SBD === "") {
          missingFields.push("STD Base Deficit");
        } else {
          invalidFields.push("STD Base Deficit (must be positive)");
        }
      }
      
      if (missingFields.length > 0 || invalidFields.length > 0) {
        let errorMessage = "⚠️ Cannot calculate SIG/EDB Gap:\n\n";
        
        if (missingFields.length > 0) {
          errorMessage += "Missing required values:\n";
          missingFields.forEach(field => {
            errorMessage += `• ${field}\n`;
          });
        }
        
        if (invalidFields.length > 0) {
          if (missingFields.length > 0) errorMessage += "\n";
          errorMessage += "Invalid values:\n";
          invalidFields.forEach(field => {
            errorMessage += `• ${field}\n`;
          });
        }
        
        errorMessage += "\nPlease provide all required values with STD Base Deficit > 0";
        setCalcSEtext(errorMessage);
        setIsLoading(false);
        return;
      }
      
      // Gold standard SIG calculation
      const Calc_SIG = navValue + ca + mg + k - (clValue + lactate) - (hvValue + albuminValue * (0.123 * pHValue - 0.631) + po4 * (0.309 * pHValue - 0.469));
      
      // Gold standard BDE Gap calculation  
      const Calc_BDE = -1 * sbd - (navValue - clValue - 38) + 0.25 * (42 - albuminValue);
      
      // Gold standard SIG normal range check
      let checknormal;
      if (Calc_SIG > 2) {
        checknormal = " (Abnormal Anion)";
      } else {
        checknormal = " (Normal Value)";
      }
      
      const result = "SIG=" + Number((Calc_SIG).toFixed(2)) + checknormal + "\n" + "BDE Gap=" + Number((Calc_BDE).toFixed(2)) + "\n";
      
      setCalcSEtext(result);
      setIsLoading(false);
    }, 1000);
  }, [K, Ca, Mg, Lactate, PO4, SBD, nav, clv, albuminv, pH, hv]);

  // Utility functions with useCallback
  const clearAllValues = useCallback(() => {
    setpHWithDebug('');
    setPaCo2WithDebug('');
    setHCO3WithDebug('');
    setNa('');
    setCl('');
    setAlbumin('');
    setUrc('');
    setCheckCCo2(false);
    setCheckExac(false);
    setK('');
    setCa('');
    setMg('');
    setLactate('');
    setPO4('');
    setSBD('');
    setInput('');
    setCalcSEtext('');
    setCopied(false);
  }, []);

  const resetToNormal = useCallback(() => {
    setpHWithDebug('7.40');
    setPaCo2WithDebug('40');
    setHCO3WithDebug('24');
    setNa('140');
    setCl('100');
    setAlbumin('40');
    setUrc('');
    setCheckCCo2(false);
    setCheckExac(false);
    setK('4.0');
    setCa('2.3');
    setMg('0.8');
    setLactate('1.0');
    setPO4('1.2');
    setSBD('0');
    setInput('');
    setCalcSEtext('');
    setCopied(false);
  }, []);

  const saveCase = useCallback(() => {
    // Save functionality - placeholder
    console.log('Save case functionality coming soon');
  }, []);

  const loadCase = useCallback(() => {
    // Load functionality - placeholder
    console.log('Load case functionality coming soon');
  }, []);

  const exportToPDF = useCallback(() => {
    if (!input) {
      alert('No diagnosis results to export. Please run a diagnosis first.');
      return;
    }

    // Create a temporary HTML element for PDF generation
    const createPDFContent = () => {
      const currentDate = new Date().toLocaleString();
      const fileName = `Acid-Base-Medical-Report-${new Date().toISOString().slice(0, 10)}`;
      
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Acid Base Medical Diagnosis Report</title>
          <style>
            @page {
              size: A4;
              margin: 1cm;
            }
            body {
              font-family: 'Helvetica', 'Arial', sans-serif;
              font-size: 10px;
              line-height: 1.4;
              color: #333;
              margin: 0;
              padding: 20px;
            }
            .header {
              background: #12385B;
              color: white;
              padding: 15px 20px;
              border-radius: 5px 5px 0 0;
              margin: -20px -20px 20px -20px;
            }
            .header h1 {
              margin: 0;
              font-size: 18px;
              font-weight: bold;
            }
            .header p {
              margin: 5px 0 0 0;
              font-size: 9px;
              opacity: 0.9;
            }
            .section {
              margin-bottom: 20px;
              page-break-inside: avoid;
            }
            .section h2 {
              background: #12385B;
              color: white;
              padding: 8px 12px;
              margin: 0 0 10px 0;
              font-size: 12px;
              border-radius: 3px;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
              font-size: 9px;
            }
            .table th {
              background: #12385B;
              color: white;
              padding: 6px 8px;
              text-align: left;
              font-weight: bold;
              border: 1px solid #12385B;
            }
            .table td {
              padding: 6px 8px;
              border: 1px solid #ddd;
              background: white;
            }
            .table tr:nth-child(even) td {
              background: #f5f5f5;
            }
            .status-normal {
              background: #f0fff0 !important;
              color: #2d5016;
            }
            .status-abnormal {
              background: #fff0f0 !important;
              color: #d32f2f;
            }
            .diagnosis-box {
              background: #f8f9fa;
              border: 2px solid #12385B;
              border-radius: 5px;
              padding: 12px;
              margin: 10px 0;
              font-size: 10px;
            }
            .urgent {
              color: #d32f2f;
              font-weight: bold;
              font-size: 9px;
              margin-top: 10px;
            }
            .footer {
              margin-top: 20px;
              padding-top: 10px;
              border-top: 1px solid #ddd;
              font-size: 8px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ACID BASE MEDICAL DIAGNOSIS REPORT</h1>
            <p>Professional Medical Tool for Healthcare Providers</p>
            <p>Generated: ${currentDate}</p>
          </div>
          
          <div class="section">
            <h2>PATIENT INFORMATION</h2>
            <table class="table">
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
              <tr>
                <td>Date of Report</td>
                <td>${new Date().toLocaleDateString()}</td>
              </tr>
              <tr>
                <td>Time of Report</td>
                <td>${new Date().toLocaleTimeString()}</td>
              </tr>
              <tr>
                <td>Report Type</td>
                <td>Acid-Base Analysis</td>
              </tr>
              <tr>
                <td>Clinical Setting</td>
                <td>Emergency/Critical Care</td>
              </tr>
            </table>
          </div>
          
          <div class="section">
            <h2>BLOOD GAS ANALYSIS</h2>
            <table class="table">
              <tr>
                <th>Parameter</th>
                <th>Value</th>
                <th>Normal Range</th>
                <th>Status</th>
              </tr>
              <tr>
                <td>pH</td>
                <td>${pH || 'Not provided'}</td>
                <td>7.35 - 7.45</td>
                <td class="${pH && parseFloat(pH) >= 7.35 && parseFloat(pH) <= 7.45 ? 'status-normal' : 'status-abnormal'}">
                  ${pH ? (parseFloat(pH) >= 7.35 && parseFloat(pH) <= 7.45 ? 'Normal' : 
                          parseFloat(pH) < 7.35 ? `Low (${parseFloat(pH).toFixed(2)})` : 
                          `High (${parseFloat(pH).toFixed(2)})`) : 'Not provided'}
                </td>
              </tr>
              <tr>
                <td>PaCO₂</td>
                <td>${pv || 'Not provided'} mm Hg</td>
                <td>35 - 45 mm Hg</td>
                <td class="${pv && parseFloat(pv) >= 35 && parseFloat(pv) <= 45 ? 'status-normal' : 'status-abnormal'}">
                  ${pv ? (parseFloat(pv) >= 35 && parseFloat(pv) <= 45 ? 'Normal' : 
                          parseFloat(pv) < 35 ? `Low (${parseFloat(pv)})` : 
                          `High (${parseFloat(pv)})`) : 'Not provided'}
                </td>
              </tr>
              <tr>
                <td>HCO₃⁻</td>
                <td>${hv || 'Not provided'} mmol/l</td>
                <td>22 - 28 mmol/l</td>
                <td class="${hv && parseFloat(hv) >= 22 && parseFloat(hv) <= 28 ? 'status-normal' : 'status-abnormal'}">
                  ${hv ? (parseFloat(hv) >= 22 && parseFloat(hv) <= 28 ? 'Normal' : 
                          parseFloat(hv) < 22 ? `Low (${parseFloat(hv)})` : 
                          `High (${parseFloat(hv)})`) : 'Not provided'}
                </td>
              </tr>
            </table>
          </div>
          
          <div class="section">
            <h2>ELECTROLYTE ANALYSIS</h2>
            <table class="table">
              <tr>
                <th>Electrolyte</th>
                <th>Value</th>
                <th>Normal Range</th>
                <th>Status</th>
              </tr>
              <tr>
                <td>Na⁺</td>
                <td>${nav || 'Not provided'} mmol/l</td>
                <td>135 - 145 mmol/l</td>
                <td class="${nav && parseFloat(nav) >= 135 && parseFloat(nav) <= 145 ? 'status-normal' : 'status-abnormal'}">
                  ${nav ? (parseFloat(nav) >= 135 && parseFloat(nav) <= 145 ? 'Normal' : 
                           parseFloat(nav) < 135 ? `Low (${parseFloat(nav)})` : 
                           `High (${parseFloat(nav)})`) : 'Not provided'}
                </td>
              </tr>
              <tr>
                <td>Cl⁻</td>
                <td>${clv || 'Not provided'} mmol/l</td>
                <td>98 - 106 mmol/l</td>
                <td class="${clv && parseFloat(clv) >= 98 && parseFloat(clv) <= 106 ? 'status-normal' : 'status-abnormal'}">
                  ${clv ? (parseFloat(clv) >= 98 && parseFloat(clv) <= 106 ? 'Normal' : 
                            parseFloat(clv) < 98 ? `Low (${parseFloat(clv)})` : 
                            `High (${parseFloat(clv)})`) : 'Not provided'}
                </td>
              </tr>
              <tr>
                <td>Albumin</td>
                <td>${albuminv || 'Not provided'} g/l</td>
                <td>35 - 50 g/l</td>
                <td class="${albuminv && parseFloat(albuminv) >= 35 && parseFloat(albuminv) <= 50 ? 'status-normal' : 'status-abnormal'}">
                  ${albuminv ? (parseFloat(albuminv) >= 35 && parseFloat(albuminv) <= 50 ? 'Normal' : 
                                parseFloat(albuminv) < 35 ? `Low (${parseFloat(albuminv)})` : 
                                `High (${parseFloat(albuminv)})`) : 'Not provided'}
                </td>
              </tr>
              ${UrC && UrC !== '' ? `
              <tr>
                <td>Urine Cl⁻</td>
                <td>${UrC} mmol/l</td>
                <td>&lt; 20 or &gt; 20 mmol/l</td>
                <td class="${parseFloat(UrC) < 20 ? 'status-normal' : 'status-abnormal'}">
                  ${parseFloat(UrC) < 20 ? `Volume-responsive (${UrC})` : `Volume-resistant (${UrC})`}
                </td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <div class="section">
            <h2>DIAGNOSIS RESULTS</h2>
            <div class="diagnosis-box">
              ${input.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div class="section">
            <h2>CLINICAL INTERPRETATION</h2>
            <div style="font-size: 9px; line-height: 1.5;">
              ${getClinicalInterpretation(pH, pv, hv)}
            </div>
            <div class="urgent">
              ${pH && parseFloat(pH) < 7.1 ? `URGENT: pH is ${parseFloat(pH).toFixed(2)} (already < 7.1) - immediate intervention needed` :
                pH && parseFloat(pH) > 7.6 ? `URGENT: pH is ${parseFloat(pH).toFixed(2)} (already > 7.6) - immediate intervention needed` :
                'Urgent if: pH < 7.1 or > 7.6, severe respiratory distress, neurological symptoms, or hemodynamic instability'}
            </div>
          </div>
          
          <div class="footer">
            <p>Acid Base Medical Diagnosis Tool - Professional Medical Software</p>
            <p>© 2024 Kaizen Made Easy - For Educational and Clinical Use</p>
            <p>Page 1 of 1</p>
          </div>
        </body>
        </html>
      `;
    };

    // Use browser's print functionality for PDF generation
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(createPDFContent());
      printWindow.document.close();
      
      // Wait for content to load, then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };
    } else {
      alert('Please allow popups for this website to generate PDF reports.');
    }
    
    console.log('PDF report generated using browser print');
  }, [input, pH, pv, hv, nav, clv, albuminv, UrC]);

  // Helper functions for status determination
  const getpHStatus = (value) => {
    if (!value) return 'Not provided';
    const ph = parseFloat(value);
    if (ph >= 7.35 && ph <= 7.45) return 'Normal';
    if (ph < 7.35) return `Low (${ph.toFixed(2)})`;
    return `High (${ph.toFixed(2)})`;
  };

  const getPaCO2Status = (value) => {
    if (!value) return 'Not provided';
    const paco2 = parseFloat(value);
    if (paco2 >= 35 && paco2 <= 45) return 'Normal';
    if (paco2 < 35) return `Low (${paco2})`;
    return `High (${paco2})`;
  };

  const getHCO3Status = (value) => {
    if (!value) return 'Not provided';
    const hco3 = parseFloat(value);
    if (hco3 >= 22 && hco3 <= 28) return 'Normal';
    if (hco3 < 22) return `Low (${hco3})`;
    return `High (${hco3})`;
  };

  const getNaStatus = (value) => {
    if (!value) return 'Not provided';
    const na = parseFloat(value);
    if (na >= 135 && na <= 145) return 'Normal';
    if (na < 135) return `Low (${na})`;
    return `High (${na})`;
  };

  const getClStatus = (value) => {
    if (!value) return 'Not provided';
    const cl = parseFloat(value);
    if (cl >= 98 && cl <= 106) return 'Normal';
    if (cl < 98) return `Low (${cl})`;
    return `High (${cl})`;
  };

  const getAlbuminStatus = (value) => {
    if (!value) return 'Not provided';
    const albumin = parseFloat(value);
    if (albumin >= 35 && albumin <= 50) return 'Normal';
    if (albumin < 35) return `Low (${albumin})`;
    return `High (${albumin})`;
  };

  const getUrineClStatus = (value) => {
    if (!value) return 'Not provided';
    const ucl = parseFloat(value);
    if (ucl < 20) return `Volume-responsive (${ucl})`;
    return `Volume-resistant (${ucl})`;
  };

  const getClinicalInterpretation = (pH, pv, hv) => {
    if (!pH || !pv || !hv) return 'Complete blood gas analysis required for clinical interpretation.';
    
    const ph = parseFloat(pH);
    const paco2 = parseFloat(pv);
    const hco3 = parseFloat(hv);
    
    let interpretation = `This acid-base analysis shows pH ${ph.toFixed(2)}, PaCO₂ ${paco2} mm Hg, and HCO₃⁻ ${hco3} mmol/l. `;
    
    if (ph >= 7.35 && ph <= 7.45) {
      interpretation += 'The pH is within normal range, indicating no primary acid-base disorder. ';
    } else if (ph < 7.35) {
      interpretation += 'The patient has acidemia (low pH). ';
      if (paco2 > 45) {
        interpretation += 'The elevated PaCO₂ suggests respiratory acidosis as the primary disorder. ';
      } else if (hco3 < 22) {
        interpretation += 'The low HCO₃⁻ suggests metabolic acidosis as the primary disorder. ';
      }
    } else {
      interpretation += 'The patient has alkalemia (high pH). ';
      if (paco2 < 35) {
        interpretation += 'The low PaCO₂ suggests respiratory alkalosis as the primary disorder. ';
      } else if (hco3 > 28) {
        interpretation += 'The elevated HCO₃⁻ suggests metabolic alkalosis as the primary disorder. ';
      }
    }
    
    interpretation += 'Clinical correlation with patient presentation and underlying medical conditions is essential for accurate diagnosis and appropriate management.';
    
    return interpretation;
  };

  return {
    // State
    pH, setpH: setpHWithDebug, pv, setPaCo2: setPaCo2WithDebug, hv, setHCO3: setHCO3WithDebug, nav, setNa, clv, setCl, albuminv, setAlbumin,
    UrC, setUrc, CCo2C, setCheckCCo2, ExacC, setCheckExac, K, setK, Ca, setCa, Mg, setMg,
    Lactate, setLactate, PO4, setPO4, SBD, setSBD, input, setInput, CalcSEtext, setCalcSEtext,
    isLoading, setIsLoading, copied, setCopied, currentPage, setCurrentPage, expandedSections, setExpandedSections,
    showInstallPrompt, setShowInstallPrompt, deferredPrompt, setDeferredPrompt, urineChlorideEnabled, highlightUrineChloride, diagnosisResult,
    
    // Constants
    referenceRanges,
    
    // Functions
    toggleSection, handleInstallClick, dismissInstallPrompt, solve, CalcSE, clearAllValues, resetToNormal,
    saveCase, loadCase, exportToPDF,
    
    // Memoized Utils
    getValueStatus: memoizedGetValueStatus,
    getProgressPercentage: memoizedGetProgressPercentage,
    getPhIndicatorPosition: memoizedGetPhIndicatorPosition,
    getDiagnosisClassification: memoizedGetDiagnosisClassification,
    copyToClipboard: memoizedCopyToClipboard
  };
};
