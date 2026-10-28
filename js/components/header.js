/**
 * SkyShield - Header & Flight Telemetry Component
 */
import { appState } from '../state.js';

export function initHeader() {
  const container = document.getElementById('header-root');
  if (!container) return;

  function render() {
    const activeTab = appState.activeTab;
    const incidents = appState.getIncidents();
    const intolerableCount = incidents.filter(i => i.riskRating === 'intolerable').length;
    const activeInvestigations = incidents.filter(i => i.status.includes('Active') || i.status.includes('Under')).length;

    container.innerHTML = `
      <header class="app-header">
        <div class="header-top-bar">
          <div class="brand-cluster">
            <div class="logo-wrapper">
              <img src="assets/skyshield-logo.jpg" alt="SkyShield Logo" class="brand-logo" />
              <div class="radar-ping-ring"></div>
            </div>
            <div class="brand-titles">
              <div class="brand-row">
                <h1 class="brand-name">SKYSHIELD BHARAT</h1>
                <span class="system-badge">DGCA CAR SEC-5 / ICAO 9859</span>
              </div>
              <p class="brand-subtitle">National Aviation Safety & Airworthiness Occurrence Reporting System (NASIS)</p>
            </div>
          </div>

          <div class="telemetry-bar">
            <div class="telemetry-item">
              <span class="telemetry-label">UTC / IST (DELHI FIR)</span>
              <span class="telemetry-value mono" id="zulu-clock">--:--:--Z</span>
            </div>
            <div class="telemetry-item">
              <span class="telemetry-label">INDIAN AIRSPACE FLEET</span>
              <span class="telemetry-value text-emerald">
                <span class="status-dot pulse-green"></span> 482 IN FLIGHT
              </span>
            </div>
            <div class="telemetry-item">
              <span class="telemetry-label">INTOLERABLE HAZARDS</span>
              <span class="telemetry-value ${intolerableCount > 0 ? 'text-crimson' : 'text-emerald'}">
                ${intolerableCount > 0 ? `<span class="status-dot pulse-red"></span>` : ''}
                ${intolerableCount} ACTIVE
              </span>
            </div>
            <div class="telemetry-item">
              <span class="telemetry-label">OPEN INVESTIGATIONS</span>
              <span class="telemetry-value text-amber mono">${activeInvestigations} CASES</span>
            </div>
            <div class="telemetry-item" title="Google Cloud Firestore Real-time Database">
              <span class="telemetry-label">FIREBASE DATASET</span>
              <span class="telemetry-value text-emerald">
                <span class="status-dot pulse-green"></span> CONNECTED
              </span>
            </div>
          </div>

          <div class="header-actions">
            <button id="btn-firebase-sync" class="btn btn-ghost" title="Cloud Firestore Dataset Synchronizer">
              <span class="btn-icon">🔥</span>
              <span>FIREBASE SYNC</span>
            </button>
            <button id="btn-auth" class="btn btn-ghost" title="Sign in or register">SIGN IN</button>
            <button id="btn-file-incident" class="btn btn-primary" title="File a new Mandatory Occurrence Report (MOR)">
              <span class="btn-icon">⚡</span>
              <span>FILE OCCURRENCE</span>
            </button>
            <button id="btn-export-dossier" class="btn btn-secondary" title="Export ICAO Compliance Dossier">
              <span class="btn-icon">📄</span>
              <span>COMPLIANCE AUDIT</span>
            </button>
          </div>
        </div>

        <nav class="nav-bar" aria-label="Main Navigation">
          <div class="nav-tabs">
            <button class="nav-tab ${activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
              <span class="tab-icon">📊</span>
              <span>SAFETY DASHBOARD</span>
            </button>
            <button class="nav-tab ${activeTab === 'workbench' ? 'active' : ''}" data-tab="workbench">
              <span class="tab-icon">🔬</span>
              <span>RCA WORKBENCH</span>
              <span class="tab-badge">5-Whys / HFACS</span>
            </button>
            <button class="nav-tab ${activeTab === 'incidents' ? 'active' : ''}" data-tab="incidents">
              <span class="tab-icon">📋</span>
              <span>INCIDENT LOG</span>
              <span class="tab-count mono">${incidents.length}</span>
            </button>
            <button class="nav-tab ${activeTab === 'capa' ? 'active' : ''}" data-tab="capa">
              <span class="tab-icon">🛡️</span>
              <span>CAPA ACTION TRACKER</span>
            </button>
            <button class="nav-tab ${activeTab === 'compliance' ? 'active' : ''}" data-tab="compliance">
              <span class="tab-icon">📑</span>
              <span>REGULATORY AUDIT</span>
            </button>
          </div>

          <div class="nav-search-bar">
            <span class="search-icon">🔍</span>
            <input 
              type="text" 
              id="global-search-input" 
              class="search-input" 
              placeholder="Search flight, aircraft, tail #, category, origin..." 
              value="${appState.filters.search}" 
            />
            ${appState.filters.search ? `<button id="clear-search-btn" class="clear-btn">&times;</button>` : ''}
          </div>
        </nav>
      </header>
    `;

    // Attach tab click handlers
    container.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        appState.setActiveTab(targetTab);
      });
    });

    // File Incident Button
    const btnAuth = container.querySelector('#btn-auth');
    if (btnAuth) btnAuth.addEventListener('click', () => document.getElementById('dialog-auth')?.showModal());

    const btnFirebase = container.querySelector('#btn-firebase-sync');
    if (btnFirebase) {
      btnFirebase.addEventListener('click', () => {
        alert("🔥 Firebase Cloud Dataset Status:\n\n• Project ID: skyshield-bharat-sms\n• Firestore Collection: incidents\n• Status: Active & Listening\n• Realtime Sync: Enabled (onSnapshot)\n\nEvery occurrence filed under DGCA Form CA-919 is automatically synchronized with Cloud Firestore.");
      });
    }

    const btnFile = container.querySelector('#btn-file-incident');
    if (btnFile) {
      btnFile.addEventListener('click', () => {
        const dialog = document.getElementById('dialog-incident-form');
        if (dialog) dialog.showModal();
      });
    }

    // Export dossier
    const btnDossier = container.querySelector('#btn-export-dossier');
    if (btnDossier) {
      btnDossier.addEventListener('click', () => {
        appState.setActiveTab('compliance');
      });
    }

    // Search input
    const searchInput = container.querySelector('#global-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        appState.setFilters({ search: e.target.value });
      });
    }

    const clearSearchBtn = container.querySelector('#clear-search-btn');
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        appState.setFilters({ search: '' });
      });
    }
  }

  // Live UTC / IST Dual Clock updater
  function updateZuluClock() {
    const clockEl = document.getElementById('zulu-clock');
    if (clockEl) {
      const now = new Date();
      const zHours = String(now.getUTCHours()).padStart(2, '0');
      const zMins = String(now.getUTCMinutes()).padStart(2, '0');
      const zSecs = String(now.getUTCSeconds()).padStart(2, '0');

      // IST is UTC + 5h30m
      const istDate = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
      const iHours = String(istDate.getUTCHours()).padStart(2, '0');
      const iMins = String(istDate.getUTCMinutes()).padStart(2, '0');

      clockEl.textContent = `${zHours}:${zMins}:${zSecs}Z | ${iHours}:${iMins} IST`;
    }
  }

  setInterval(updateZuluClock, 1000);
  updateZuluClock();

  render();
  appState.subscribe('tab:changed', render);
  appState.subscribe('incidents:updated', render);
  appState.subscribe('filters:changed', (filters) => {
    const input = document.getElementById('global-search-input');
    if (input && input.value !== filters.search) {
      input.value = filters.search;
    }
  });
}
