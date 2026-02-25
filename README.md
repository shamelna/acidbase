# Acid Base Medical Diagnosis

A professional React-based web application for healthcare providers to analyze and interpret arterial blood gas (ABG) values and acid-base disorders.

## 🏥 Features

### Core Diagnosis Functionality
- **Real-time ABG Analysis**: Input pH, PaCO2, HCO3 for immediate diagnosis
- **Advanced Calculations**: Strong Ion Gap (SIG) and Base Deficit Excess (BDE) Gap
- **Anion Gap Calculation**: With albumin correction
- **Compensation Assessment**: Identifies acute vs chronic compensation patterns

### Enhanced User Experience
- **Medical-Themed Interface**: Professional healthcare design with medical icons
- **Visual Status Indicators**: Color-coded diagnosis badges (Normal/Acidosis/Alkalosis)
- **Progress Bars**: Visual representation of how close values are to normal ranges
- **pH Scale Visualization**: Interactive color-coded pH scale
- **Reference Ranges**: Display normal ranges for all parameters

### Educational Features
- **Understanding Your Diagnosis**: Detailed explanations of why specific diagnoses occur
- **Clinical Implications**: Actionable medical guidance for each condition
- **Diagnosis Algorithm**: Step-by-step explanation of the diagnostic process
- **Medical Disclaimer**: Professional liability protection

### Accessibility & Professional Features
- **High Contrast Mode**: Improved visibility for clinical settings
- **Large Text Option**: Enhanced readability
- **Export Functionality**: Download diagnosis results
- **Copy to Clipboard**: Quick result sharing
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/acid-base-diagnosis.git
cd acid-base-diagnosis
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Usage

### Basic Diagnosis
1. Enter patient's ABG values (pH, PaCO2, HCO3)
2. Click "Diagnose" for immediate results
3. Review the detailed diagnosis and clinical implications

### Advanced Analysis
1. Complete electrolyte values (Na, Cl, Albumin, K, Ca, Mg, Lactate, PO4)
2. Click "Calculate SIG / EDB Gap" for advanced calculations
3. Review anion gap and strong ion gap interpretations

### Educational Features
- Click "Understanding Your Diagnosis" to learn about the physiological basis
- Click "How This Diagnosis Works" to see the step-by-step algorithm
- Use the pH scale visualization to understand acid-base balance

## 🧬 Medical Accuracy

This application follows established medical guidelines:
- **Henderson-Hasselbalch Equation**: pH = 6.1 + log10([HCO3]/(0.03×PaCO2))
- **Compensation Ratios**: Acute (1:10), Chronic (1:4)
- **Anion Gap**: AG = Na - (Cl + HCO3) + 0.25×(44 - Albumin)
- **Reference Ranges**: Based on standard clinical laboratory values

## 🎨 Design System

### Kaizen Made Easy Theme
- **Primary Color**: #12385b (Professional Navy)
- **Secondary Color**: #017bb5 (Medical Blue)
- **Accent Color**: #de1738 (Alert Red)
- **Typography**: Inter font family for optimal readability
- **Responsive Design**: Mobile-first approach with breakpoints

### UI Components
- **Status Indicators**: Normal (Green), Warning (Yellow), Critical (Red)
- **Medical Icons**: Custom SVG icons for medical context
- **Progress Bars**: Visual feedback for value ranges
- **Expandable Sections**: Progressive disclosure of detailed information

## 🔧 Technology Stack

- **Frontend**: React 18 with functional components and hooks
- **Styling**: CSS custom properties with Kaizen design system
- **Build Tool**: Create React App with Webpack
- **Deployment**: Ready for GitHub Pages and other static hosting

## 📋 Scripts

### `npm start`
Runs the app in development mode with hot reload.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**One-way operation** - removes the single build dependency for full control.

## 🏥 Medical Disclaimer

⚠️ **Educational Use Only**: This tool provides educational support for healthcare professionals. Always use clinical judgment and consider full patient context. Not a substitute for medical training or professional consultation.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Medical guidelines based on standard acid-base physiology
- Design inspired by professional medical software interfaces
- Built with React and modern web technologies

## 📞 Support

For questions, issues, or suggestions:
- Create an issue on GitHub
- Review the educational content within the application
- Consult medical guidelines for clinical use cases

---

**Professional Healthcare Tool** | **Educational Support** | **Medical Accuracy**
