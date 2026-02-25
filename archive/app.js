import React, { useState } from 'react';

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    
    <div className = "field">
        <h1>ACID BASE MEDICAL DIAGNOSIS</h1>
          <h2>Please Check History and Exclude Normal ABG Samples</h2>
          
        <input
            type="number"
            className="search"
            placeholder="pH Value"
            // value={query}
            // onChange={(e) => setQuery(e.target.value)}
            // onKeyPress = {search}

        />
                <input
            type="number"
            className="search"
            placeholder="PaCO2 Value (mm Hg)"
            // value={query}
            // onChange={(e) => setQuery(e.target.value)}
            // onKeyPress = {search}

        />


                <input
            type="number"
            className="search"
            placeholder="HCO3 Value (mmol/l) "
            // value={query}
            // onChange={(e) => setQuery(e.target.value)}
            // onKeyPress = {search}

        />

        <input
                    type="number"
                    className="search"
                    placeholder="Ur.Chloride Value"
                    // value={query}
                    // onChange={(e) => setQuery(e.target.value)}
                    // onKeyPress = {search}

                />
        <h3>Na, Cl, Albumin are required for Metabolic Acidosis Diagnosis</h3>
        <input
            type="number"
            className="search"
            placeholder="Na Value (mmol/l)"
            // value={query}
            // onChange={(e) => setQuery(e.target.value)}
            // onKeyPress = {search}

        />
        <input
            type="number"
            className="search"
            placeholder="Cl Value (mmol/l)"
            // value={query}
            // onChange={(e) => setQuery(e.target.value)}
            // onKeyPress = {search}

        />
        <input
            type="number"
            className="search"
            placeholder="Albomin Value (g/l)"
            // value={query}
            // onChange={(e) => setQuery(e.target.value)}
            // onKeyPress = {search}

        />
        <label class="container">Chronic CO2 Retention 
  <input type="checkbox" />
</label>

<label class="container">Exacebration
  <input type="checkbox" />
</label>

    </div>
)
}

export default App;
