# Acid Base Medical Diagnosis - PWA

## 🚀 Progressive Web App

This is a production-ready Progressive Web App (PWA) for acid-base medical diagnosis.

### 📱 Features

- **Offline Functionality**: Works without internet connection
- **Mobile Optimized**: Responsive design for all devices
- **Installable**: Can be installed as a mobile app
- **Fast Loading**: Optimized production build
- **Modern UI**: Clean, professional medical interface

### 📁 Repository Structure

```
📁 Root Directory (Current App)
├── 📄 index.html - Main PWA application
├── 📄 manifest.json - PWA configuration
├── 📄 sw.js - Service worker for offline functionality
├── 📄 favicon.svg & icons/ - PWA icons
├── 📁 build/ - Optimized production build
├── 📁 static/ - CSS, JS, and static assets
├── 📄 robots.txt - SEO configuration
├── 📄 CNAME - Custom domain (GitHub Pages)
└── 📁 archive/ - Backup and development files

📁 archive/ (Historical Files)
├── 📁 development/ - Previous source code and tools
│   ├── 📁 src_backup/ - Original React source code
│   ├── 📁 node_modules/ - Development dependencies
│   ├── 📄 test_calculations.js - Calculation verification
│   └── 📄 excel-diagnosis-processor*.js - Excel processing tools
├── 📁 excel/ - Excel files with diagnosis data
│   ├── 📄 acid base  Xls_mod_MAR__25_12.* - Original data
│   └── 📄 *_with_diagnosis.* - Processed results
├── 📁 docs/ - Documentation and reference
│   ├── 📄 dontuse.txt - Gold standard diagnosis logic
│   ├── 📄 ACID_BASE_CALCULATION_TUTORIAL.md
│   ├── 📄 DEPLOYMENT.md
│   └── 📄 EXCEL_DIAGNOSIS_RESULTS.md
└── 📄 AcidBase-main/ - Additional backup
```

### 🎯 Medical Accuracy

This app implements the gold standard acid-base diagnosis algorithm with:
- **pHc Calculation**: `6.1 + (Math.log10(hv / (0.03 * pv)) / Math.log10(10))`
- **Anion Gap**: `AG = nav - (clv + hv) + 0.25 * (44 - albuminv)`
- **Compensation Logic**: Acute vs chronic respiratory disorders
- **Clinical Thresholds**: Evidence-based urgency criteria

### 🚀 Deployment

The app is deployed as a PWA and can be:
- Accessed via web browser
- Installed on mobile devices
- Used offline with cached data
- Added to home screen like a native app

### 📝 Development History

The original React source code is preserved in `archive/development/src_backup/` for future development needs. The current production build is optimized for performance and reliability.

### 🔧 Technical Stack

- **Progressive Web App** with service worker
- **Modern JavaScript** with ES6+ features
- **Responsive CSS** with custom properties
- **Optimized Assets** for fast loading
- **Offline-First** architecture

---

*Last Updated: March 2026*
*Version: 2.0 - PWA Production Build*
