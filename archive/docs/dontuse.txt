import React, {useState, useEffect} from 'react';
import DiagButton from './DiagButton'

import logo from './logo.svg';
//import './App.css';

function App() {
const [input, setInput] = useState('');
const [pH, setpH] = useState('');
const [pv, setPaCo2] = useState('');
const [hv, setHCO3] = useState('');
const [nav, setNa] = useState('');
const [clv, setCl] = useState('');
const [albuminv, setAlbumin] = useState('');
const [K, setK] = useState('');
const [Ca, setCa] = useState('');
const [Mg, setMg] = useState('');
const [Lactate, setLactate] = useState('');
const [PO4, setPO4] = useState('');
const [SBD, setSBD] = useState('');
const [CCo2C, setCheckCCo2] = useState('');
const [ExacC, setCheckExac] = useState('');
const [UrC, setUrc] = useState('');
const [CalcSEtext, setCalcSEtext] = useState('');
//const [Exac, setExac] = useState('');
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
const solve = () =>{
    if(pH === "" || pv === "" || hv === ""){
      displayDiag("Please Complete Input Values for PH, PaCO2 & HCO3");
      //return;
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
    
 }
}

const CalcSE = () =>{

  setCalcSEtext("welcome");
  //console.log(K);
  if(K=== ""||Ca=== ""||Mg=== ""||Lactate===""||PO4=== ""||SBD===""||SBD<=0||nav===""||clv===""||albuminv===""||pH===""){
    console.log(albuminv);
    setCalcSEtext("Please provide K, Ca, Mg, Lactate, PO4, Na, Cl, Albumin and (+ve) STD Base Dificit values");
    return;
}
else{
  console.log("SIG");
    Calc_SIG =nav+Ca+Mg+K-(clv+Lactate)-(hv+albuminv*(0.123*pH-0.631)+PO4*(0.309*pH-0.469));
    Calc_BDE = -1*SBD-(nav-clv-38)+0.25*(42-albuminv);
    
    if (Calc_SIG>2){
        checknormal = " (Abnormal Anion)";
    }else 
    {
      checknormal = " (Normal Value)";
    }
    setCalcSEtext("SIG="+Number((Calc_SIG).toFixed(2))+checknormal+"\n"+"BDE Gap="+Number((Calc_BDE).toFixed(2))+"\n");

}

}



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

        if (Diag === "" && pH < 7.4) {
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
        else if (pH >= 7.4) {
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
<div class="container"> 
<br></br>
<div class="container has-text-centered"> 
<h1 className = "title">ACID BASE MEDICAL DIAGNOSIS</h1>
          
</div>  
<br></br>
<div>
<h2 className = "subtitle">Please Check History and Exclude Normal ABG Samples</h2>
<br></br>
</div>
<div class="columns ">

<div class="column">
    <div class="control">
    <input class="input" type="number" keyboardType ='numeric' placeholder="pH Value" onChange={(e) => setpH(Number(e.target.value))}/>
    {/* <input class="input" type="number" keyboardType ='numeric' placeholder="pH Value" onChangeText={(text) => this.setState({pH: parseFloat(text)})}/> */}

    </div>
</div>

<div class="column">
    <div class="control">
    <input class="input" type="number" keyboardType ='numeric' placeholder="PaCO2 Value (mm Hg)" onChange={(e) => setPaCo2(Number(e.target.value))}/>
    </div>
</div>

<div class="column">
    <div class="control">
    <input class="input" type="number" keyboardType ='numeric' placeholder="HCO3 Value (mmol/l)" onChange={(e) => setHCO3(Number(e.target.value))}/>
    </div>
</div>
<div class="column">
    <div class="control">
    <input class="input" type="number" keyboardType ='numeric' placeholder="Ur.Chloride" onChange={(e) => setUrc(Number(e.target.value))}/>
    </div>
</div>
</div>
<br></br>
<div class = "field"> 
<h3 className= "label">Na, Cl, Albumin are required only for Metabolic Acidosis Diagnosis</h3>
</div>

<div class="columns">
<div class="column">
    <div class="control">
    <input class="input" type="number" keyboardType ='numeric' placeholder="Na Value (mmol/l)" onChange={(e) => setNa(Number(e.target.value))}/>
    </div>
</div>

<div class="column">
    <div class="control">
    <input class="input" type="number" keyboardType ='numeric' placeholder="Cl Value (mmol/l)" onChange={(e) => setCl(Number(e.target.value))}/>
    </div>
</div>

<div class="column">
    <div class="control">
    <input class="input" type="number" keyboardType ='numeric' placeholder="Albomin Value (g/l)" onChange={(e) => setAlbumin(Number(e.target.value))}/>
    </div>
</div>
</div>

<div class="field">
  <div class="control">
    <label class="checkbox">
      <input type="checkbox" 
      //defaultChecked = 'false'
      onChange={(e) => setCheckCCo2((e.target.checked))}
      />
      Chronic CO2 Retention 
    </label>
  </div>
</div>

<div class="field">
  <div class="control">
    <label class="checkbox">
        <input type="checkbox" 
        //disabled = {true} 
        onChange={(e) => setCheckExac((e.target.checked))}
        />
      Exacebration 
    </label>
  </div>
</div>

<div class="field is-grouped">
  <div class="control">
    <DiagButton handleSolve={solve} class="button is-link">Submit</DiagButton>
    

  </div>
  
  <div class="control">
    <button class="button is-link is-light">Reset</button>
  </div>

</div>
<div class="field">
  <label class="label">Diagnosis</label>
  <div class="control">
    <textarea class="textarea" value={input} placeholder="Diagnosis..."></textarea>
  </div>
</div>

<br></br>
<div class = "field"> 
<h3 className= "label">Calculate SIG and BDE Gap?</h3>
</div>

{/* <div class="control">
  <label class="radio">
    <input type="radio" name="foobar"/>
    Yes
  </label>
  <label class="radio">
    <input type="radio" name="foobar" checked/>
    No
  </label>
</div> */}

<div class="columns">

<div class="column">
    <div class="control">
    <input class="input" type="number" keyboardType ='numeric' placeholder="K(mmol/l)" onChange={(e) => setK(Number(e.target.value))}/>
    </div>
</div>

<div class="column">
    <div class="control">
    <input class="input" type="number" keyboardType ='numeric' placeholder="Ca(mmol/l)" onChange={(e) => setCa(Number(e.target.value))}/>
    </div>
</div>
<div class="column">
    <div class="control">
    <input class="input" type="number" keyboardType ='numeric' placeholder="Mg(mmol/l)" onChange={(e) => setMg(Number(e.target.value))}/>
    </div>
</div>

<div class="column">
    <div class="control">
    <input class="input" type="number" keyboardType ='numeric' placeholder="Lactate(mmol/l)" onChange={(e) => setLactate(Number(e.target.value))}/>
    </div>
</div>

<div class="column">
    <div class="control">
    <input class="input" type="number" keyboardType ='numeric' placeholder="PO4(mmol/l)" onChange={(e) => setPO4(Number(e.target.value))}/>
    </div>
</div>
<div class="column">
    <div class="control">
    <input class="input" type="number" keyboardType ='numeric' placeholder="+ve STD Base Dificit" onChange={(e) => setSBD(Number(e.target.value))}/>
    </div>
</div>
</div>
<br></br>
<div class="field is-grouped">
  <div class="control">
  <DiagButton handleSolve={CalcSE} class="button is-link">Calculate SIG / EDB Gap</DiagButton>
          
  </div>
  
</div>
<br></br>
<div class="field">
  <label class="label">SIG / EDB Gap</label>
  <div class="control">
    <textarea class="textarea" value={CalcSEtext} placeholder="SIG / EDB Gap..."></textarea>
  </div>
</div>
<br></br>
</div>



)
}

export default App;
