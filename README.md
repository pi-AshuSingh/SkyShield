# SkyShield: Aviation Safety & Incident Reporting

> **Project ID:** `P_006`  
> **Course / Track:** HCLTech Career Shaper Programme | IVth Year Industry Project (Session 2026–27)  
> **Learner:** Ashutosh Kumar (Roll No: `2300321530046`)  
> **Institution:** ABES Engineering College, Ghaziabad  
> **Mentor:** Amrit Kaur | **Batch:** `ABES_JAS26_FSD Python_Batch 01`

---

## ✈️ Overview

**SkyShield** is an enterprise-grade National Aviation Safety & Airworthiness Intelligence System (NASIS) engineered in accordance with **DGCA Civil Aviation Requirements (CAR) Section 5, Series C, Part I** and **ICAO Annex 19 (Doc 9859 Safety Management Manual)**.

The platform provides a streamlined full-stack architecture for capturing civil aviation safety occurrences, performing automated root-cause analysis (5-Whys and HFACS 4-tier taxonomy), and rendering real-time regulatory compliance and airworthiness dashboards across Indian airspace.

---

## 🚀 Key Features

1. **Digital DGCA Form CA-919 Telemetry Pipeline:**
   - Real-time occurrence reporting interface capturing flight parameters, airframe metrics, weather encounters, and pilot narratives.
   - Zero-null validation ensuring 100% adherence to DGCA mandatory reporting guidelines.

2. **ICAO Annex 19 Bivariate 5x5 Risk Tolerability Matrix:**
   - Evaluates incident Severity (1: Negligible ➔ 5: Catastrophic) and Likelihood (A: Improbable ➔ E: Frequent).
   - Dynamically segments occurrences into **Acceptable (Green, 64.2%)**, **Tolerable (Yellow, 30.6%)**, and **Intolerable (Red, 5.2%)** safety regimes.

3. **Human Factors Analysis & Classification System (HFACS):**
   - Deterministic 4-tier causal classification:
     - **Level 1: Unsafe Acts** (48.4%)
     - **Level 2: Preconditions for Unsafe Acts** (24.2%)
     - **Level 3: Unsafe Supervision** (15.8%)
     - **Level 4: Organizational Influences** (11.6%)

4. **Recursive 5-Whys Root-Cause Analysis (RCA) Engine:**
   - Structured diagnostic trees drilling down from surface telemetry alerts to underlying latent organizational root causes.

5. **Interactive Aeronautical Geospatial Dashboard:**
   - High-performance Leaflet.js mapping with pre-compiled GeoJSON polygons for Indian Flight Information Regions (FIRs): **Delhi (VIDF)**, **Mumbai (VABF)**, **Kolkata (VECF)**, and **Chennai (VOMF)**.
   - Live aerodrome waypoint indexing for major hubs (DEL, BOM, BLR, MAA, HYD, CCU, GOX, COK, IXE, CCJ).

6. **Closed-Loop DGCA CAPA Compliance Tracker:**
   - Automated routing of all high-risk Intolerable Occurrences into mandatory Corrective and Preventive Action (CAPA) mitigation workflows.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend / UI** | Semantic HTML5, Vanilla Modern CSS (Cockpit Glassmorphism Dark Mode), Modular JavaScript (ES6+), Responsive Grid & Flexbox |
| **Geospatial & Mapping** | Leaflet.js v1.9.4, GeoJSON Aeronautical FIR Polygons, SVG Flight Markers |
| **Backend / API Gateway** | Python 3.10+, FastAPI (ASGI Framework), Pydantic v2 Schema Modeling, Uvicorn Server |
| **Database & Persistence** | SQLite3 (`skyshield_sms.db`) with Write-Ahead Logging (WAL) and Composite B-Tree Indexing |
| **Cloud & Deployment** | Render, Railway, Vercel, Firebase Hosting, Cloud Firestore, Docker/Procfile Ready |
| **Compliance & Standards** | DGCA CAR Section 5 Series C Part I, ICAO Annex 19 (Doc 9859), HFACS, DPDP Act 2023 |

---

## 📁 Repository Structure (Optimized for One-Click Deployment)

```
SkyShield/
├── index.html         # Flight Deck Web Interface (Responsive UI)
├── js/                # Modular JavaScript (Components, State, Radar, RCA)
│   ├── app.js
│   ├── state.js
│   ├── firebase.js
│   ├── data.js
│   └── components/
├── css/               # Responsive Cockpit Glassmorphism Styles
│   ├── index.css
│   ├── variables.css
│   ├── dashboard.css
│   ├── incidents.css
│   ├── bowtie.css
│   ├── modal.css
│   └── rca.css
├── assets/            # App Assets & Branding
│   └── skyshield-logo.jpg
├── server.py          # FastAPI Production REST Backend & Static File Server
├── skyshield_sms.db   # Embedded SQLite3 SMS Database with Indexed Records
├── requirements.txt   # Minimal Production Dependencies (FastAPI, Uvicorn, Pydantic)
├── Procfile           # 1-Click Cloud Deployment Process Specification
├── package.json       # Project Metadata & Run Scripts
├── firebase.json      # Firebase Hosting & Firestore Configuration
├── firestore.rules    # Firestore Security Rules
└── README.md          # Project Documentation
```

---

## 🚀 Quick Deployment Guide

### Option 1: One-Click Cloud Deployment (Render / Railway / Koyeb)

1. Connect your GitHub repository to [Render](https://render.com) or [Railway](https://railway.app).
2. Select **Web Service** with:
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT` (auto-detected from `Procfile`)
3. Your application is live with full REST API and frontend dashboard!

---

### Option 2: Run Locally with Python (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pi-AshuSingh/SkyShield.git
   cd SkyShield
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the server:**
   ```bash
   python3 server.py
   ```
   - Application: [http://127.0.0.1:8000](http://127.0.0.1:8000)
   - Interactive API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### Option 3: Static Frontend Hosting (Vercel / GitHub Pages / Firebase)

Because `index.html` connects seamlessly with client-side state and cloud sync:
- **Firebase:** Run `firebase deploy --only hosting`
- **Vercel:** Import Git repo with zero configuration.

---

## 📜 Ethical Compliance & Data Protection

- **Digital Personal Data Protection (DPDP) Act 2023:** All pilot, flight crew, and passenger identities are fully pseudonymized and segregated from analytical telemetry.
- **ICAO Just Culture:** Occurrence reporting is maintained under non-punitive principles to encourage proactive hazard disclosure and transparent airworthiness monitoring.

---

## 👨‍💻 Author

- **Ashutosh Kumar**  
  Roll No: `2300321530046`  
  Department of Computer Science & Engineering  
  ABES Engineering College, Ghaziabad  
  *HCLTech Career Shaper Programme (Session 2026–27)*
