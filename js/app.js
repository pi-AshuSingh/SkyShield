/**
 * SkyShield - Main Application Orchestrator
 */
import { appState } from './state.js';
import { initHeader } from './components/header.js';
import { initRiskMatrix } from './components/riskMatrix.js';
import { initCharts } from './components/charts.js';
import { initAirportRadar } from './components/airportRadar.js';
import { initIncidentList } from './components/incidentList.js';
import { initRcaWorkbench } from './components/rcaWorkbench.js';
import { initIncidentForm } from './components/incidentForm.js';
import { initCapaTracker } from './components/capaTracker.js';
import { initAuditReport } from './components/auditReport.js';
import { initAuth } from './components/auth.js';
import { initFirebase } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Cloud Firestore Connection
  initFirebase();

  // Initialize Header
  initHeader();

  // Initialize Incident Form Dialog
  initIncidentForm('dialog-incident-form');

  // Initialize Main Views
  initRiskMatrix('risk-matrix-root');
  initCharts('analytics-charts-root');
  initAirportRadar('radar-scope-root');
  initIncidentList('incident-list-root');
  initRcaWorkbench('rca-workbench-root');
  initCapaTracker('capa-tracker-root');
  initAuditReport('audit-report-root');
  initAuth('dialog-auth');

  // Tab switching orchestrator
  function updateTabVisibility(activeTab) {
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabPanels.forEach(panel => {
      const panelTab = panel.getAttribute('data-tab-content');
      if (panelTab === activeTab) {
        panel.classList.remove('hidden');
        panel.setAttribute('aria-hidden', 'false');
      } else {
        panel.classList.add('hidden');
        panel.setAttribute('aria-hidden', 'true');
      }
    });

    // Scroll to top of panel smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  appState.subscribe('tab:changed', (tab) => {
    updateTabVisibility(tab);
  });

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // Press 'f' or 'n' to open File Incident modal if no input focused
    if ((e.key === 'n' || e.key === 'N') && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
      e.preventDefault();
      const modal = document.getElementById('dialog-incident-form');
      if (modal && !modal.open) {
        modal.showModal();
      }
    }
  });

  // Initial tab set
  updateTabVisibility(appState.activeTab);

  console.log('✈ SkyShield Aerospace Safety System initialized successfully.');
});
