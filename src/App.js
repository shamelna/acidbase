import { useState, useEffect } from 'react';
import DiagButton from './DiagButton';
import jsPDF from 'jspdf';

//import logo from './logo.svg';
//import './App.css';

// Medical Icons SVG
const MedicalIcons = {
  stethoscope: <svg className="medical-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19 11h-8V7a3 3 0 016 0v4zm-2 2v2a4 4 0 01-8 0v-2h8zm-9-2V7a5 5 0 0110 0v4h2V7a7 7 0 00-14 0v4h2z"/></svg>,
  heart: <svg className="medical-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>,
  lab: <svg className="medical-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v2h1v14a4 4 0 008 0V4h1V2H7zm4 16c-1.1 0-2-.9-2-2V4h4v12c0 1.1-.9 2-2 2z"/></svg>,
  settings: <svg className="medical-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15.5A3.5 3.5 0 018.5 12 3.5 3.5 0 0112 8.5a3.5 3.5 0 013.5 3.5 3.5 3.5 0 01-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0014 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.08-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/></svg>,
  // Medical App Logo - DNA Helix + Heartbeat
  logo: <svg className="icon-large" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#12385b" />
        <stop offset="100%" stopColor="#017bb5" />
      </linearGradient>
    </defs>
    <path d="M30 50 Q30 30, 50 30 T70 50 Q70 70, 50 70 T30 50" stroke="url(#logoGradient)" strokeWidth="3" fill="none"/>
    <circle cx="40" cy="40" r="8" fill="#de1738"/>
    <circle cx="60" cy="40" r="8" fill="#de1738"/>
    <circle cx="50" cy="60" r="8" fill="#017bb5"/>
    <path d="M20 50 L25 50 M75 50 L80 50 M50 20 L50 25 M50 75 L50 80" stroke="#12385b" strokeWidth="2" strokeLinecap="round"/>
    <path d="M35 50 L45 50 M55 50 L65 50" stroke="#de1738" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
  </svg>
};

// Normal reference ranges
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

function App() {
const [input, setInput] = useState('');
const [pH, setpH] = useState('7.40');
const [pv, setPaCo2] = useState('40');
const [hv, setHCO3] = useState('24');
const [nav, setNa] = useState('140');
const [clv, setCl] = useState('100');
const [albuminv, setAlbumin] = useState('40');
const [K, setK] = useState('4.0');
const [Ca, setCa] = useState('2.3');
const [Mg, setMg] = useState('0.8');
const [Lactate, setLactate] = useState('1.5');
const [PO4, setPO4] = useState('1.0');
const [SBD, setSBD] = useState('0');
const [CCo2C, setCheckCCo2] = useState(false);
const [ExacC, setCheckExac] = useState(false);
const [UrC, setUrc] = useState('');
const [CalcSEtext, setCalcSEtext] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [copied, setCopied] = useState(false);
const [highContrast, setHighContrast] = useState(false);
const [largeText, setLargeText] = useState(false);
const [savedCases, setSavedCases] = useState([]);
const [showHistory, setShowHistory] = useState(false);
const [expandedSections, setExpandedSections] = useState({
  understanding: false,
  howItWorks: false,
  about: false
});
const [headerHidden, setHeaderHidden] = useState(false);
const [lastScrollY, setLastScrollY] = useState(0);
const [showInstallPrompt, setShowInstallPrompt] = useState(false);
const [deferredPrompt, setDeferredPrompt] = useState(null);
let Exac;
let CCo2;
let pHc;
let Diag;
let ph1 = 7.3;
let ph2 = 7.5;
let p1 = 35;
let p2 = 45;
let h1 = 22;
let h2 = 28;
let eq, eq1;
let x1, x2;
let Diag2;
let DiagAG;
let AG;
let HG;
let  Calc_SIG,Calc_BDE;
let checknormal;

// Helper functions
const getValueStatus = (value, min, max) => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 'normal';
  if (numValue < min * 0.8 || numValue > max * 1.2) return 'critical';
  if (numValue < min || numValue > max) return 'warning';
  return 'normal';
};

const getProgressPercentage = (value, min, max) => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 50;
  const range = max - min;
  const position = (numValue - min) / range;
  return Math.max(0, Math.min(100, position * 100));
};

const getPhIndicatorPosition = (phValue) => {
  const numValue = parseFloat(phValue);
  if (isNaN(numValue)) return 50;
  // pH scale from 6.8 to 8.0
  const scaleMin = 6.8;
  const scaleMax = 8.0;
  const position = ((numValue - scaleMin) / (scaleMax - scaleMin)) * 100;
  return Math.max(0, Math.min(100, position));
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

const saveCase = () => {
  // Coming soon - show notification instead
  alert('Save functionality coming soon! This feature will allow you to save patient cases locally for future reference.');
};

const loadCase = (caseData) => {
  try {
    // Load case data into state
    setpH(caseData.pH);
    setPaCo2(caseData.PaCO2);
    setHCO3(caseData.HCO3);
    setNa(caseData.Na);
    setCl(caseData.Cl);
    setAlbumin(caseData.Albumin);
    setK(caseData.K);
    setCa(caseData.Ca);
    setMg(caseData.Mg);
    setLactate(caseData.Lactate);
    setPO4(caseData.PO4);
    setSBD(caseData.SBD);
    setInput(caseData.input);
  } catch (error) {
    console.error('Error loading case:', error);
    alert('Error loading case. Please try again.');
  }
};

const clearAllValues = () => {
  // Clear all input values - Final version with rich SIG formatting
  setpH('');
  setPaCo2('');
  setHCO3('');
  setNa('');
  setCl('');
  setAlbumin('');
  setK('');
  setCa('');
  setMg('');
  setLactate('');
  setPO4('');
  setSBD('');
  setCalcSEtext('');
  setInput('');
  setCopied(false);
};

const exportToPDF = async () => {
  try {
    // Create new PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Add custom font for better medical report appearance
    pdf.setFontSize(20);
    pdf.setTextColor(18, 56, 91); // Dark blue color matching app theme
    
    // Title
    pdf.text('ACID BASE MEDICAL DIAGNOSIS REPORT', 105, 20, { align: 'center' });
    
    // Add line under title
    pdf.setDrawColor(18, 56, 91);
    pdf.setLineWidth(0.5);
    pdf.line(20, 25, 190, 25);
    
    // Patient and generation info
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 35);
    pdf.text('Patient: _________________________    MRN: _________________________', 20, 45);
    
    // Input Values Section
    pdf.setFontSize(14);
    pdf.setTextColor(18, 56, 91);
    pdf.text('INPUT VALUES', 20, 60);
    
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, 62, 190, 62);
    
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    const inputValues = [
      `pH:     ${pH} (Normal: 7.35-7.45)`,
      `PaCO2:  ${pv} mm Hg (Normal: 35-45)`,
      `HCO3:   ${hv} mmol/l (Normal: 22-28)`,
      `Na:     ${nav} mmol/l (Normal: 135-145)`,
      `Cl:     ${clv} mmol/l (Normal: 95-105)`,
      `Albumin: ${albuminv} g/l (Normal: 35-50)`
    ];
    
    inputValues.forEach((value, index) => {
      pdf.text(value, 25, 70 + (index * 7));
    });
    
    // Diagnosis Section
    const diagnosisY = 115;
    pdf.setFontSize(14);
    pdf.setTextColor(18, 56, 91);
    pdf.text('DIAGNOSIS', 20, diagnosisY);
    
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, diagnosisY + 2, 190, diagnosisY + 2);
    
    // Add diagnosis with icon
    pdf.setFontSize(12);
    let diagnosisText = input;
    let icon = '';
    let color = [0, 0, 0];
    
    if (input.includes('Normal')) {
      icon = '✅ ';
      color = [34, 197, 94]; // Green
    } else if (input.includes('Acidosis')) {
      icon = '⚠️ ';
      color = [245, 158, 11]; // Orange
    } else if (input.includes('Alkalosis')) {
      icon = '⚠️ ';
      color = [59, 130, 246]; // Blue
    } else {
      icon = '🚨 ';
      color = [239, 68, 68]; // Red
    }
    
    pdf.setTextColor(...color);
    pdf.setFontSize(13);
    pdf.setFont(undefined, 'bold');
    pdf.text(icon + diagnosisText, 25, diagnosisY + 10);
    
    // Add explanation content
    const isNormal = input.includes('Normal');
    const isAcidosis = input.includes('Acidosis');
    const isAlkalosis = input.includes('Alkalosis');
    const isCompensated = input.includes('Compensated');
    
    let explanationContent = '';
    
    if (isNormal) {
      explanationContent = `Normal Results: Your blood gas values fall within normal ranges, indicating proper acid-base balance.

Clinical Implications:
- Normal Acid-Base Status: No immediate intervention needed
- Recommendations: Continue routine monitoring, maintain current ventilation and metabolic support
- Consider anion gap calculation if metabolic concerns exist
- Document as baseline for future comparisons
- When to Recheck: If clinical status changes or new symptoms develop`;
    } else if (isAcidosis) {
      explanationContent = `Acidosis: Blood pH is below normal range (<7.35), indicating excess acid.

Types:
- Respiratory Acidosis: High PaCO2 (>45) from poor ventilation
- Metabolic Acidosis: Low HCO3 (<22) from acid accumulation or bicarbonate loss
- Mixed Acidosis: Both respiratory and metabolic components

Clinical Implications:
- Consider: Oxygen therapy, ventilation support, or bicarbonate administration
- Urgent if: pH <7.2 or severe respiratory distress`;
    } else if (isAlkalosis) {
      explanationContent = `Alkalosis: Blood pH is above normal range (>7.45), indicating excess base.

Types:
- Respiratory Alkalosis: Low PaCO2 (<35) from hyperventilation
- Metabolic Alkalosis: High HCO3 (>28) from base excess or acid loss
- Mixed Alkalosis: Both respiratory and metabolic components

Clinical Implications:
- Consider: Address underlying cause, monitor electrolytes, cautious fluid management
- Urgent if: pH >7.6 or neurological symptoms`;
    }
    
    if (isCompensated) {
      explanationContent += `

Compensation:
Body is attempting to normalize pH through secondary mechanisms.
- Respiratory Compensation: Lungs adjust CO2 levels to correct metabolic issues
- Metabolic Compensation: Kidneys retain/produce bicarbonate to correct respiratory issues
- Complete Compensation: pH normalized but underlying disorder persists`;
    }
    
    // Add explanation text
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    
    const splitExplanation = pdf.splitTextToSize(explanationContent, 160);
    pdf.text(splitExplanation, 25, diagnosisY + 20);
    
    // Clinical Notes Section
    const notesY = diagnosisY + 20 + (splitExplanation.length * 5) + 10;
    
    pdf.setFontSize(14);
    pdf.setTextColor(18, 56, 91);
    pdf.text('CLINICAL NOTES', 20, notesY);
    
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, notesY + 2, 190, notesY + 2);
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text('_______________________________________________________________________', 20, notesY + 15);
    pdf.text('Physician Signature: _________________________    Date: _______________', 20, notesY + 20);
    pdf.text('_______________________________________________________________________', 20, notesY + 25);
    
    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('This report was generated by Acid Base Medical Diagnosis App', 105, 280, { align: 'center' });
    pdf.text('Professional Medical Tool - Kaizen Made Easy', 105, 285, { align: 'center' });
    pdf.text('For educational and clinical reference purposes only.', 105, 290, { align: 'center' });
    
    // Save the PDF
    pdf.save(`acid-base-diagnosis-${new Date().toISOString().split('T')[0]}.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};

const toggleSection = (section) => {
  setExpandedSections(prev => ({
    ...prev,
    [section]: !prev[section]
  }));
};

// Load saved cases on mount
useEffect(() => {
  const saved = localStorage.getItem('acidBaseCases');
  if (saved) {
    setSavedCases(JSON.parse(saved));
  }
}, []);

// Handle scroll behavior for mobile header
useEffect(() => {
  let lastScrollY = window.scrollY;
  
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    // Only apply scroll behavior on mobile
    if (window.innerWidth <= 768) {
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px - hide header
        setHeaderHidden(true);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
        // Scrolling up or near top - show header
        setHeaderHidden(false);
      }
    }
    
    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, [lastScrollY, headerHidden]);

// Handle PWA install prompt
useEffect(() => {
  const handleBeforeInstallPrompt = (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    setDeferredPrompt(e);
    // Show the install banner
    setShowInstallPrompt(true);
  };

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  
  // Check if app is already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    setShowInstallPrompt(false);
  }

  return () => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  };
}, []);

const handleInstallClick = async () => {
  if (!deferredPrompt) return;
  
  // Show the install prompt
  deferredPrompt.prompt();
  
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  
  if (outcome === 'accepted') {
    console.log('User accepted the install prompt');
  } else {
    console.log('User dismissed the install prompt');
  }
  
  // Clear the deferred prompt
  setDeferredPrompt(null);
  setShowInstallPrompt(false);
};

const dismissInstallPrompt = () => {
  setShowInstallPrompt(false);
  // Don't show again for this session
  sessionStorage.setItem('installPromptDismissed', 'true');
};
const solve = () =>{
    setIsLoading(true);
    
    setTimeout(() => {
      if(pH === "" || pv === "" || hv === ""){
        displayDiag("Please Complete Input Values for PH, PaCO2 & HCO3");
        setIsLoading(false);
        return;
      }
      else{
      
      pHc = 6.1 + (Math.log10(hv / (0.03 * pv)) / Math.log10(10));
      pHc = Number((pHc).toFixed(2));
      
      if(CCo2C !== true){
        CCo2 = 0;
        console.log(CCo2);
      }
      else{
        CCo2 = 1;
        console.log(CCo2);
      }
    
      if(ExacC !== true){
        Exac = 0;
        console.log(Exac);
      }
      else{
        Exac = 1;
        console.log(Exac);
      }
    
      
      
      Diagnosis();
      setIsLoading(false);
    }
  }, 1000);
}

const CalcSE = () => {
  setIsLoading(true);
  
  setTimeout(() => {
    setCalcSEtext("welcome");
    
    // Check which values are missing and provide specific feedback
    const missingValues = [];
    const invalidValues = [];
    
    if (K === "" || K === null || K === undefined) missingValues.push("K");
    if (Ca === "" || Ca === null || Ca === undefined) missingValues.push("Ca");
    if (Mg === "" || Mg === null || Mg === undefined) missingValues.push("Mg");
    if (Lactate === "" || Lactate === null || Lactate === undefined) missingValues.push("Lactate");
    if (PO4 === "" || PO4 === null || PO4 === undefined) missingValues.push("PO4");
    if (nav === "" || nav === null || nav === undefined) missingValues.push("Na");
    if (clv === "" || clv === null || clv === undefined) missingValues.push("Cl");
    if (albuminv === "" || albuminv === null || albuminv === undefined) missingValues.push("Albumin");
    if (pH === "" || pH === null || pH === undefined) missingValues.push("pH");
    if (SBD === "" || SBD === null || SBD === undefined) missingValues.push("STD Base Deficit");
    if (SBD !== "" && SBD !== null && SBD !== undefined && (parseFloat(SBD) <= 0 || isNaN(parseFloat(SBD)))) {
      invalidValues.push("STD Base Deficit must be positive");
    }
    
    // Provide specific feedback about missing values
    if (missingValues.length > 0 || invalidValues.length > 0) {
      let errorMessage = "";
      if (missingValues.length > 0) {
        errorMessage = `Missing values: ${missingValues.join(", ")}`;
      }
      if (invalidValues.length > 0) {
        if (errorMessage) errorMessage += "\n";
        errorMessage += invalidValues.join(", ");
      }
      
      setCalcSEtext(`Please provide the following required values:\n${errorMessage}`);
      setIsLoading(false);
      return;
    }
    
    // All values are present, perform calculation
    console.log("SIG");
    
    // Convert all values to numbers and handle NaN
    const numK = parseFloat(K) || 0;
    const numCa = parseFloat(Ca) || 0;
    const numMg = parseFloat(Mg) || 0;
    const numLactate = parseFloat(Lactate) || 0;
    const numPO4 = parseFloat(PO4) || 0;
    const numNav = parseFloat(nav) || 0;
    const numClv = parseFloat(clv) || 0;
    const numHv = parseFloat(hv) || 0;
    const numAlbuminv = parseFloat(albuminv) || 0;
    const numPH = parseFloat(pH) || 0;
    const numSBD = parseFloat(SBD) || 0;
    
    // Calculate SIG with NaN protection
    Calc_SIG = numNav + numCa + numMg + numK - (numClv + numLactate) - (numHv + numAlbuminv * (0.123 * numPH - 0.631) + numPO4 * (0.309 * numPH - 0.469));
    Calc_BDE = -1 * numSBD - (numNav - numClv - 38) + 0.25 * (42 - numAlbuminv);
    
    // Check if results are valid numbers
    if (isNaN(Calc_SIG) || isNaN(Calc_BDE)) {
      setCalcSEtext("Error: Invalid calculation. Please check all input values.");
      setIsLoading(false);
      return;
    }
    
    if (Calc_SIG > 2) {
      checknormal = " (Abnormal Anion)";
    } else {
      checknormal = " (Normal Value)";
    }
    
    setCalcSEtext("SIG=" + Number((Calc_SIG).toFixed(2)) + checknormal + "\n" + "BDE Gap=" + Number((Calc_BDE).toFixed(2)) + "\n");
    setIsLoading(false);
  }, 1000);
};



 function Diagnosis() {
    Diag = "";
     if (Math.abs(pHc - pH) > 0.1) {
        setInput(("Calculated PH = " + pHc + " Please Review Input Values"));
    }
    else{
        if (pH >= 7.35 && pH <= 7.45) {

            if (pv >= 35 && pv <= 45) {

                if (hv >= 22 && hv <= 28) {


                    Diag = "Normal, Check Anion Gap";
                    displayDiag(Diag);
                    return; // Stop further processing for normal values
                    
                }
            }
        }
        ////
        else if (pH < 7.3 && CCo2 === 1 && pv <= 57 && hv < 24 && Exac === 0) {


            Diag = "Chronic Respiratory Acidosis + Metabolic Acidosis";
            displayDiag(Diag);
        } else if (pH < 7.3 && CCo2 === 1 && pv > 2 * hv - 8 && hv >= 30 && Exac === 1) {

            Diag = "Acute on Top of Chronic Respiratory Acidosis";
            displayDiag(Diag);
        } else if (pH < 7.3 && CCo2 === 1 && pv > 57 && hv < 24 && Exac === 1) {


            Diag = "Acute on Top of Chronic Respiratory Acidosis + Metabolic Acidosis";
            displayDiag(Diag);
        }
//////////////////

        if (Diag === "" && pH < 7.35) {
            Diag = " Acidosis";
            //Log.i("MainActivity.java", "Resp" + Diag);
            //if (pv>=p2&&hv>=h1)
            if (pv >= p2/*&&hv>=h1*/) {
                x1 = 1;
                x2 = 4;
                Diag2 = "Acidosis";
                resp();

            } else if (pv < p2/*&hv<h1*/) {
                Diag = " - Metabolic" + Diag;
                metacid();
            }


        }
        else if (Diag === "" && pH > 7.45) {
          console.log(">=7.4");
            if (CCo2 === 0) {
              console.log(">=7.4 Alk");
                Diag = " - Alkalosis";
                if (pv < 35) {
                    x1 = 2;
                    x2 = 5;
                    Diag2 = " Alkalosis";
                    resp();
                } else metalk();
            } else if (CCo2 === 1) {
                if (UrC === 0) {
                    //popUp("Value of Ur. Chloride is Required");
                    displayDiag("Value of Ur. Chloride is Required");
                    //TextView UrCValue = (TextView) findViewById(R.id.UrC);
                    //UrCValue.setError("This field is required!");
                    return;
                }
                Diag = "Chronic Respiratory Acidosis + Metabolic Alkalosis (";
                if (pv <= 0.92 * (2 * hv - 8)) {
                    if (UrC < 20) displayDiag(Diag = Diag + "Post-Hypercapnic)");
                    else displayDiag(Diag = Diag + "Mixed)");
                } else if (UrC >= 20)
                    displayDiag(Diag = Diag + "Independent, Chloride Resistant and/or Diuresis)");
                else
                    displayDiag(Diag = Diag + "Independent, Chloride Responsive, Extra-Renal Loss of Chloride)");

            }
        }
        /// 
    console.log(Diag);
    if (Diag === "") {

        displayDiag(Diag);
    }
    
    
    }
  }
  function resp() {
    console.log("RESP");
    //Log.i("MainActivity.java", "Resp" + Diag);
    Diag = "Respiratory" + Diag;
    //Log.i("MainActivity.java", "Resp" + Diag);
    if (pH < ph1 || pH > ph2) {
        Diag = "Acute" + Diag;
        eq = 22 - (((40 - pv) / 10) * x1);
        eq1 = 28 - (((40 - pv) / 10) * x1);
        if (hv > eq && hv < eq1)
            Diag = "Simple Acute Respiratory " + Diag2;
        else if (hv < eq)
            Diag = "Acute Respiratory " + Diag2 + " + Metabolic Acidosis.";
        else if (hv > eq1)
            Diag = "Acute Respiratory " + Diag2 + " + Metabolic Alkalosis.";

    }

    if (pH >= ph1 && pH <= ph2) {
        Diag = "Chronic " + Diag;
        //Log.i("MainActivity.java", "Resp" + Diag);
        eq = 22 - (((40 - pv) / 10) * x2);
        eq1 = 28 - (((40 - pv) / 10) * x2);
        if (hv > eq && hv < eq1)
            Diag = "Simple Chronic Respiratory " + Diag2;
        else if (hv < eq)
            Diag = "Chronic Respiratory " + Diag2 + " + Metabolic Acidosis.";
        else if (hv > eq1)
            Diag = "Chronic Respiratory " + Diag2 + " + Metabolic Alkalosis.";

    }

    displayDiag(Diag);
}

function metacid() {
  console.log("METACID");
  //Log.i("MainActivity.java", "Metacid");
  Diag = " - Metabolic" + Diag;
  if (pH < ph1 || pH > ph2) {
      if (pv <= p2 && pv >= p1) {
          Diag = "Uncompensated " + Diag;
          Diag2 = "Uncompensated ";
      } else if (pv > p2 || pv < p1) {
          Diag = "Partially Compensated " + Diag;
          Diag2 = "Partially Compensated ";
      }
  }

  if (pH >= ph1 && pH <= ph2) {
      Diag = "Compensated " + Diag;
      Diag2 = "Compensated ";
  }

  if (pv >= 0.9 * (1.5 * hv + 4) && pv <= 1.1 * (1.5 * hv + 12))
      Diag = Diag2 + "Simple Metabolic Acidosis";
  else if (pv < 0.9 * (1.5 * hv + 4))
      Diag = Diag2 + "Metabolic Acidosis + Respiratory Alkalosis";
  else if (pv > 1.1 * (1.5 * hv + 12))
      Diag = Diag2 + "Metabolic Acidosis + Respiratory Acidosis";

  displayDiag(Diag);
}

function metalk() {
  console.log("METALK");
  //Log.i("MainActivity.java", "Metalk");
  Diag = " - Metabolic" + Diag;
  if (pH < ph1 || pH > ph2) {
      if (pv <= p2 && pv >= p1) {
          Diag = "Uncompensated " + Diag;
          Diag2 = "Uncompensated ";

      } else if (pv > p2 || pv < p1) {
          Diag = "Partially Compensated " + Diag;
          Diag2 = "Partially Compensated ";
      }
  }
  if (pH >= ph1 && pH <= ph2) {
      Diag = "Compensated " + Diag;
      Diag2 = "Compensated ";
  }
  if (pv >= 0.9 * (0.7 * hv + 15) && pv <= 1.1 * (0.7 * hv + 15))
      Diag = Diag2 + "Simple Metabolic Alkalosis";
  else if (pv < 0.9 * (0.7 * hv + 15))
      Diag = Diag2 + "Metabolic Alkalosis + Respiratory Alkalosis";
  else if (pv > 1.1 * (0.7 * hv + 15))
      Diag = Diag2 + "Metabolic Alkalosis + Respiratory Acidosis";


  displayDiag(Diag);
}
  
  function displayDiag(message){
    console.log("DISPLAY");
    // if (message === ""){
    //     Diag = "Please Review Input Values";
    //     setInput(Diag);
    // }
    // else{
    //     setInput(Diag);
    // }

     


    if (message.includes("Metabolic Acidosis")) {

      //      popUp(" Metabolic Acidosis");
      //if (NaValue.getText().toString() != "") nav = ParseDouble(NaValue.getText().toString());
      //if (CLValue.getText().toString() != "") clv = ParseDouble(CLValue.getText().toString());
      //if (AlbuminValue.getText().toString() != "")
      //    albuminv = ParseDouble(AlbuminValue.getText().toString());
      //Log.i("MainActivity.java", nav + " " + clv + " " + albuminv);
      if (nav === 0 || clv === 0 || albuminv === 0) {
        displayDiag("Please Complete Input Values for Na, CL & Albumin");
      //    popUp("Please Complete Input Values for Na, CL & Albumin");
      //    DiagText.setText("Please Complete Input Values for Na, CL & Albumin");

        //  return;

      }
      //CheckCalc.setEnabled(true);
      AG = nav - (clv + hv) + 0.25 * (44 - albuminv);
      if (AG <= 12) {
          DiagAG = "\n(Normal Anion Gap Acidosis)";
          message += DiagAG;
      } else if (AG > 12) {
          HG = nav - clv - 36;
          if (HG > 6) {
              DiagAG = "\n(High Anion Gap Metabolic Acidosis + Metabolic Alkalosis)";
              message += DiagAG;
          } else if (HG < -6) {
              DiagAG = "\n(High Anion Gap Metabolic Acidosis + Normal Anion Gap Acidosis)";
              message += DiagAG;
          } else {
              DiagAG = "\n(High Anion Gap Metabolic Acidosis)";
              message += DiagAG;
          }
      }

  }
  //else CheckCalc.setEnabled(false);
  setInput(message);
  
  //scroll.scrollTo(0,scroll.getBottom());

  }
  return (
<div className={`container fade-in-up ${highContrast ? 'high-contrast' : ''} ${largeText ? 'large-text' : ''}`}> 

{/* PWA Install Prompt */}
{showInstallPrompt && !sessionStorage.getItem('installPromptDismissed') && (
  <div className="install-prompt">
    <div className="install-prompt-content">
      <div className="install-prompt-text">
        <strong>Install Acid Base App</strong>
        <p>Add this medical tool to your home screen for quick access</p>
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
          Dismiss
        </button>
      </div>
    </div>
  </div>
)}

<div className={`header ${headerHidden ? 'hidden' : ''}`}>
<div className="text-center">
<div className="flex justify-center items-center mb-2">
  {MedicalIcons.logo}
  <h1 className="text-4xl font-bold ml-4">ACID BASE MEDICAL DIAGNOSIS</h1>
</div>
<h2 className="text-xl font-normal">Kaizen Made Easy - Professional Medical Tool</h2>
</div>

{/* Accessibility Controls */}
<div className="text-center mt-4">
  <div className="accessibility-controls">
    <button 
      onClick={() => setHighContrast(!highContrast)}
      className={`btn-secondary ${highContrast ? 'bg-accent text-white' : ''} mx-2`}
    >
      {MedicalIcons.settings} High Contrast
    </button>
    <button 
      onClick={() => setLargeText(!largeText)}
      className={`btn-secondary ${largeText ? 'bg-accent text-white' : ''} mx-2`}
    >
      Large Text
    </button>
    <span className="history-coming-soon">History (Coming Soon)</span>
  </div>
</div>
</div>  

{/* About Section */}
<div className="form-section card-enhanced">
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-xl font-semibold">{MedicalIcons.lab} About Acid Base Diagnosis</h3>
  </div>
  
  <div className={`expandable-content ${expandedSections.about ? 'open' : ''}`}>
    <div className="about-content">
      <div className="about-intro mb-6">
        <p className="text-base leading-relaxed">
          This professional Acid Base Medical Diagnosis tool is designed for healthcare providers to quickly and accurately analyze arterial blood gas (ABG) values and interpret acid-base disorders.
        </p>
      </div>

      <div className="about-resources mb-6">
        <h4 className="text-lg font-semibold mb-3">📚 Educational Resources</h4>
        <div className="resource-links space-y-3">
          <div className="resource-item">
            <h5 className="font-medium mb-2">📖 Complete Medical Guide</h5>
            <p className="text-sm text-secondary mb-2">
              Comprehensive PDF documentation covering acid-base physiology, clinical applications, and case studies.
            </p>
            <a 
              href="https://drive.google.com/file/d/1-YRwh_9Vd2FvWdmzjUpLMSadsuRv52eV/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              📄 View Medical Guide PDF
            </a>
          </div>

          <div className="resource-item">
            <h5 className="font-medium mb-2">🎯 Diagnosis Algorithm</h5>
            <p className="text-sm text-secondary mb-2">
              Step-by-step PowerPoint presentation showing the complete diagnostic algorithm and decision trees.
            </p>
            <a 
              href="https://drive.google.com/file/d/1UgsqSMKz26DN8JXzpNqevFyvEthrhH0L/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              📊 View Algorithm Presentation
            </a>
          </div>
        </div>
      </div>

      <div className="about-features mb-6">
        <h4 className="text-lg font-semibold mb-3">🔬 Key Features</h4>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">{MedicalIcons.stethoscope}</div>
            <div className="feature-text">
              <h5 className="font-medium">Real-time Analysis</h5>
              <p className="text-sm text-secondary">Instant ABG interpretation with clinical implications</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">{MedicalIcons.heart}</div>
            <div className="feature-text">
              <h5 className="font-medium">Educational Content</h5>
              <p className="text-sm text-secondary">Detailed explanations of diagnosis logic</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">{MedicalIcons.lab}</div>
            <div className="feature-text">
              <h5 className="font-medium">Advanced Calculations</h5>
              <p className="text-sm text-secondary">SIG, BDE Gap, and Anion Gap with albumin correction</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">{MedicalIcons.settings}</div>
            <div className="feature-text">
              <h5 className="font-medium">Professional Design</h5>
              <p className="text-sm text-secondary">Medical-themed interface with accessibility features</p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-medical-accuracy">
        <h4 className="text-lg font-semibold mb-3">⚕️ Medical Accuracy</h4>
        <div className="accuracy-info">
          <p className="text-sm mb-3">
            This application follows established medical guidelines and incorporates evidence-based calculations:
          </p>
          <ul className="text-sm space-y-1 ml-4">
            <li>• <strong>Henderson-Hasselbalch Equation</strong> for pH validation</li>
            <li>• <strong>Compensation Ratios</strong> (Acute: 1:10, Chronic: 1:4)</li>
            <li>• <strong>Anion Gap</strong> with albumin correction formula</li>
            <li>• <strong>Reference Ranges</strong> based on clinical laboratory standards</li>
            <li>• <strong>Clinical Guidelines</strong> from current medical literature</li>
          </ul>
        </div>
      </div>

      <div className="about-disclaimer mt-6">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs font-semibold text-yellow-800 mb-2">
            ⚠️ Medical Disclaimer
          </p>
          <p className="text-xs text-yellow-700">
            This tool provides educational support for healthcare professionals. Always use clinical judgment and consider full patient context. Not a substitute for medical training, professional consultation, or institutional protocols.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

{/* History Panel */}
{showHistory && (
  <div className="form-section slide-in-up">
    <h3 className="text-xl font-semibold mb-4">{MedicalIcons.lab} Saved Cases</h3>
    <div className="saved-cases">
      {savedCases.length === 0 ? (
        <p className="text-secondary">No saved cases yet.</p>
      ) : (
        savedCases.map(caseData => (
          <div key={caseData.id} className="case-item" onClick={() => loadCase(caseData)}>
            <div className="case-item-date">{caseData.date}</div>
            <div className="case-item-summary">
              pH: {caseData.values.pH}, PaCO2: {caseData.values.pv}, HCO3: {caseData.values.hv}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
)}

<div className="mt-8">
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
      className={`input value-${getValueStatus(pH, referenceRanges.pH.min, referenceRanges.pH.max)} ${isLoading ? 'loading' : ''}`} 
      type="number" 
      value={pH}
      onChange={(e) => setpH(e.target.value)}
      placeholder="pH Value"
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
      className={`input value-${getValueStatus(pv, referenceRanges.PaCO2.min, referenceRanges.PaCO2.max)} ${isLoading ? 'loading' : ''}`} 
      type="number" 
      value={pv}
      onChange={(e) => setPaCo2(e.target.value)}
      placeholder="PaCO2 Value (mm Hg)"
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
      className={`input value-${getValueStatus(hv, referenceRanges.HCO3.min, referenceRanges.HCO3.max)} ${isLoading ? 'loading' : ''}`} 
      type="number" 
      value={hv}
      onChange={(e) => setHCO3(e.target.value)}
      placeholder="HCO3 Value (mmol/l)"
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
      <label className="text-base font-medium">Ur.Chloride</label>
      <span className="tooltip-text">Required for chronic respiratory acidosis diagnosis</span>
    </div>
    <div className="control">
    <input 
      className={`input ${isLoading ? 'loading' : ''}`} 
      type="number" 
      value={UrC}
      onChange={(e) => setUrc(e.target.value)}
      placeholder="Ur.Chloride"
    />
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
      className={`input value-${getValueStatus(nav, referenceRanges.Na.min, referenceRanges.Na.max)} ${isLoading ? 'loading' : ''}`} 
      type="number" 
      value={nav}
      onChange={(e) => setNa(e.target.value)}
      placeholder="Na Value (mmol/l)"
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
      className={`input value-${getValueStatus(clv, referenceRanges.Cl.min, referenceRanges.Cl.max)} ${isLoading ? 'loading' : ''}`} 
      type="number" 
      value={clv}
      onChange={(e) => setCl(e.target.value)}
      placeholder="Cl Value (mmol/l)"
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
      className={`input value-${getValueStatus(albuminv, referenceRanges.Albumin.min, referenceRanges.Albumin.max)} ${isLoading ? 'loading' : ''}`} 
      type="number" 
      value={albuminv}
      onChange={(e) => setAlbumin(e.target.value)}
      placeholder="Albumin Value (g/l)"
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

<div className="form-section card-enhanced">
<h3 className="text-xl font-semibold">{MedicalIcons.settings} Clinical Context</h3>

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

<div className="form-section card-enhanced">
<h3 className="text-xl font-semibold">{MedicalIcons.heart} Actions</h3>
  <div className="columns columns-2">
    <div className="column">
      <DiagButton 
        handleSolve={solve} 
        className={`btn-primary ${isLoading ? 'loading' : ''}`}
      >
        {isLoading ? 'Analyzing...' : 'Diagnose'}
      </DiagButton>
    </div>
    <div className="column">
      <button 
        className="btn-danger"
        onClick={clearAllValues}
      >
        Clear All Values
      </button>
    </div>
  </div>
</div>

<div className={`form-section card-enhanced ${input ? 'slide-in-up' : ''}`}>
  {/* Diagnosis Results Header */}
  <div className="diagnosis-header">
    <h3 className="text-xl font-semibold mb-2">{MedicalIcons.stethoscope} Diagnosis Results</h3>
  </div>
  
  {/* Primary Diagnosis Badge - Prominent Display */}
  {input && (
      <div className="diagnosis-result-main">
        <div className={`diagnosis-card ${input.includes('Normal') ? 'diagnosis-normal' : input.includes('Acidosis') ? 'diagnosis-acidosis' : input.includes('Alkalosis') ? 'diagnosis-alkalosis' : 'diagnosis-critical'}`}>
          <div className="diagnosis-header">
            <div className="diagnosis-icon">
              {input.includes('Normal') ? MedicalIcons.heart : 
               input.includes('Acidosis') ? <span className="warning-icon">⚠️</span> :
               input.includes('Alkalosis') ? <span className="warning-icon">⚠️</span> :
               <span className="critical-icon">🚨</span>}
            </div>
            <div className="diagnosis-title">
              <h2 className={`diagnosis-label ${input.includes('Normal') ? 'diagnosis-normal-text' : input.includes('Acidosis') ? 'diagnosis-acidosis-text' : input.includes('Alkalosis') ? 'diagnosis-alkalosis-text' : 'diagnosis-abnormal-text'}`}>
                {input.includes('Normal') ? '✅ NORMAL ACID-BASE STATUS' : 
                 input.includes('Acidosis') ? '⚠️ ACIDOSIS DETECTED' : 
                 input.includes('Alkalosis') ? '⚠️ ALKALOSIS DETECTED' : '🚨 ABNORMAL FINDINGS'}
              </h2>
              <p className={`diagnosis-subtitle ${input.includes('Normal') ? 'diagnosis-normal-subtitle' : input.includes('Acidosis') ? 'diagnosis-acidosis-subtitle' : input.includes('Alkalosis') ? 'diagnosis-alkalosis-subtitle' : 'diagnosis-abnormal-subtitle'}`}>{input}</p>
            </div>
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
    )}
  </div>
  
  {/* Enhanced Diagnosis Display */}
  {input && (
    <div className="diagnosis-enhanced mt-6">
      {/* Expandable Sections */}
      <div className="expandable-sections">
        {/* Understanding Your Diagnosis */}
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
          <div className={`expandable-content ${expandedSections.diagnosisLogic ? 'open' : ''}`}>
            <div className="p-4 bg-light-blue rounded-lg">
              <h5 className="font-semibold mb-2">Why This Diagnosis?</h5>
              <div className="text-sm space-y-2">
                {input.includes('Normal') && (
                  <div>
                    <strong>Normal Results:</strong> Your blood gas values fall within normal ranges, indicating proper acid-base balance.
                    <ul className="ml-4 mt-2">
                      <li>pH: {pH} (Normal: 7.35-7.45)</li>
                      <li>PaCO2: {pv} mm Hg (Normal: 35-45)</li>
                      <li>HCO3: {hv} mmol/l (Normal: 22-28)</li>
                    </ul>
                    <p className="mt-2"><strong>Clinical Significance:</strong> No acid-base disorder detected. All values are within normal limits.</p>
                  </div>
                )}
                {input.includes('Acidosis') && (
                  <div>
                    <strong>Acidosis:</strong> Blood pH is below normal range (&lt;7.35), indicating excess acid.
                    <ul className="ml-4 mt-2">
                      <li><strong>Respiratory Acidosis:</strong> High PaCO2 (&gt;45) from poor ventilation</li>
                      <li><strong>Metabolic Acidosis:</strong> Low HCO3 (&lt;22) from acid accumulation or bicarbonate loss</li>
                      <li><strong>Mixed Acidosis:</strong> Both respiratory and metabolic components</li>
                    </ul>
                  </div>
                )}
                {input.includes('Alkalosis') && (
                  <div>
                    <strong>Alkalosis:</strong> Blood pH is above normal range (&gt;7.45), indicating excess base.
                    <ul className="ml-4 mt-2">
                      <li><strong>Respiratory Alkalosis:</strong> Low PaCO2 (&lt;35) from hyperventilation</li>
                      <li><strong>Metabolic Alkalosis:</strong> High HCO3 (&gt;28) from base excess or acid loss</li>
                      <li><strong>Mixed Alkalosis:</strong> Both respiratory and metabolic components</li>
                    </ul>
                  </div>
                )}
                {input.includes('Compensated') && (
                  <div>
                    <strong>Compensation:</strong> Body is attempting to normalize pH through secondary mechanisms.
                    <ul className="ml-4 mt-2">
                      <li><strong>Respiratory Compensation:</strong> Lungs adjust CO2 levels to correct metabolic issues</li>
                      <li><strong>Metabolic Compensation:</strong> Kidneys retain/produce bicarbonate to correct respiratory issues</li>
                      <li><strong>Complete Compensation:</strong> pH normalized but underlying disorder persists</li>
                    </ul>
                  </div>
                )}
              </div>
              
              <h5 className="font-semibold mt-4 mb-2">Clinical Implications</h5>
              <div className="text-sm">
                {input.includes('Normal') && (
                  <div>
                    <p>✅ <strong>Normal Acid-Base Status:</strong> No immediate intervention needed.</p>
                    <p className="mt-2"><strong>Recommendations:</strong></p>
                    <ul className="ml-4 mt-1">
                      <li>Continue routine monitoring</li>
                      <li>Maintain current ventilation and metabolic support</li>
                      <li>Consider anion gap calculation if metabolic concerns exist</li>
                      <li>Document as baseline for future comparisons</li>
                    </ul>
                    <p className="mt-2"><strong>When to Recheck:</strong> If clinical status changes or new symptoms develop.</p>
                  </div>
                )}
                {input.includes('Acidosis') && (
                  <div>
                    <p>⚠️ Consider: Oxygen therapy, ventilation support, or bicarbonate administration depending on cause and severity.</p>
                    <p className="mt-2"><strong>Urgent if:</strong> pH &lt;7.2 or severe respiratory distress</p>
                  </div>
                )}
                {input.includes('Alkalosis') && (
                  <div>
                    <p>⚠️ Consider: Address underlying cause, monitor electrolytes, cautious fluid management.</p>
                    <p className="mt-2"><strong>Urgent if:</strong> pH &gt;7.6 or neurological symptoms</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* How This Diagnosis Works */}
        <div className="expandable-item mt-4">
          <button 
            className="expandable-trigger"
            onClick={() => toggleSection('diagnosisAlgorithm')}
          >
            <div className="expandable-header">
              <h4 className="text-lg font-semibold">{MedicalIcons.settings} How This Diagnosis Works</h4>
              <span className={`expandable-icon ${expandedSections.diagnosisAlgorithm ? 'expanded' : ''}`}>▼</span>
            </div>
          </button>
          <div className={`expandable-content ${expandedSections.diagnosisAlgorithm ? 'open' : ''}`}>
            <div className="p-4 bg-light-blue rounded-lg">
              <h5 className="font-semibold mb-3">Diagnosis Algorithm</h5>
              <div className="text-sm space-y-3">
                <div>
                  <strong>Step 1: pH Validation</strong>
                  <div className="equation-box mt-2">
                    <div className="equation-title">Henderson-Hasselbalch Equation:</div>
                    <div className="equation-formula">
                      pH = 6.1 + log₁₀(<span className="equation-fraction"><span className="numerator">[HCO₃⁻]</span><span className="denominator">0.03 × PaCO₂</span></span>)
                    </div>
                    <div className="equation-explanation mt-2">
                      <span className="equation-variable">HCO₃⁻</span> = Bicarbonate (mmol/l)<br/>
                      <span className="equation-variable">PaCO₂</span> = Partial pressure of CO₂ (mm Hg)
                    </div>
                  </div>
                  <p className="ml-4 mt-3">If calculated pH differs &gt;0.1 from measured pH → Review input values</p>
                </div>
                
                <div>
                  <strong>Step 2: Primary Disorder Identification</strong>
                  <ul className="ml-4">
                    <li>pH &lt;7.35 → Acidosis</li>
                    <li>pH &gt;7.45 → Alkalosis</li>
                    <li>pH 7.35-7.45 → Normal (unless compensation present)</li>
                  </ul>
                </div>
                
                <div>
                  <strong>Step 3: Respiratory vs Metabolic</strong>
                  <ul className="ml-4">
                    <li><strong>Respiratory:</strong> PaCO2 abnormal (check against pH direction)</li>
                    <li><strong>Metabolic:</strong> HCO3 abnormal (check against pH direction)</li>
                  </ul>
                </div>
                
                <div>
                  <strong>Step 4: Compensation Assessment</strong>
                  <ul className="ml-4">
                    <li><strong>Acute:</strong> Expected compensation: 1:10 ratio</li>
                    <li><strong>Chronic:</strong> Expected compensation: 1:4 ratio</li>
                    <li><strong>Uncompensated:</strong> pH abnormal, no compensation</li>
                    <li><strong>Partially Compensated:</strong> pH abnormal, partial compensation</li>
                    <li><strong>Compensated:</strong> pH normal, abnormal primary values</li>
                  </ul>
                </div>
                
                <div>
                  <strong>Step 5: Mixed Disorders</strong>
                  <p className="ml-4">When both respiratory and metabolic components are present and don't match expected compensation patterns.</p>
                </div>
                
                <div>
                  <strong>Step 6: Anion Gap (if metabolic acidosis)</strong>
                  <p className="ml-4">AG = Na - (Cl + HCO3) + 0.25×(44 - Albumin)</p>
                  <ul className="ml-4">
                    <li>AG &le;12 → Normal anion gap acidosis</li>
                    <li>AG &gt;12 → High anion gap acidosis</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs font-semibold text-yellow-800">⚠️ Medical Disclaimer: This tool provides educational support only. Always use clinical judgment and consider full patient context.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
  
  {/* Fallback for when no diagnosis yet */}
  {!input && (
    <div className="text-center py-8">
      <div className="text-gray-400">
        {MedicalIcons.stethoscope}
        <p className="mt-2">Enter values and click "Diagnose" to see results</p>
      </div>
    </div>
  )}
</div>

<div className="form-section card-enhanced">
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
      className={`input value-${getValueStatus(K, referenceRanges.K.min, referenceRanges.K.max)} ${isLoading ? 'loading' : ''}`} 
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
      className={`input value-${getValueStatus(Ca, referenceRanges.Ca.min, referenceRanges.Ca.max)} ${isLoading ? 'loading' : ''}`} 
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
      className={`input value-${getValueStatus(Mg, referenceRanges.Mg.min, referenceRanges.Mg.max)} ${isLoading ? 'loading' : ''}`} 
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
      className={`input value-${getValueStatus(Lactate, referenceRanges.Lactate.min, referenceRanges.Lactate.max)} ${isLoading ? 'loading' : ''}`} 
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
      className={`input value-${getValueStatus(PO4, referenceRanges.PO4.min, referenceRanges.PO4.max)} ${isLoading ? 'loading' : ''}`} 
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
      <span className="tooltip-text">Normal range: -2 to 2 mmol/l</span>
    </div>
    <div className="control">
    <input 
      className={`input value-${getValueStatus(SBD, referenceRanges.SBD.min, referenceRanges.SBD.max)} ${isLoading ? 'loading' : ''}`} 
      type="number" 
      value={SBD}
      onChange={(e) => setSBD(e.target.value)}
      placeholder="+ve STD Base Deficit"
    />
    <div className="reference-range">
      Normal: {referenceRanges.SBD.min}-{referenceRanges.SBD.max} {referenceRanges.SBD.unit}
    </div>
    <div className="progress-bar">
      <div className="progress-fill" style={{width: `${getProgressPercentage(SBD, referenceRanges.SBD.min, referenceRanges.SBD.max)}%`}}></div>
    </div>
    <span className={`status-${getValueStatus(SBD, referenceRanges.SBD.min, referenceRanges.SBD.max)}`}>
      {getValueStatus(SBD, referenceRanges.SBD.min, referenceRanges.SBD.max).toUpperCase()}
    </span>
    </div>
</div>
</div>
<div className="form-section">
  <div className="column">
    <DiagButton 
      handleSolve={CalcSE} 
      className={`btn-primary ${isLoading ? 'loading' : ''}`}
    >
      {isLoading ? 'Calculating...' : 'Calculate SIG / EDB Gap'}
    </DiagButton>
  </div>
</div>
<div className={`form-section card-enhanced ${CalcSEtext ? 'slide-in-up' : ''}`}>
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
  {/* Rich SIG/EDB Gap Results Display */}
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
</div>

  )
}

export default App;
