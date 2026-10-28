/**
 * SkyShield - Global Aerodrome Radar & Incident Hotspot Scope
 * Interactive vector radar display with live sweeps and aerodrome risk profiles
 */
import { AIRPORTS } from '../data.js';
import { appState } from '../state.js';

export function initAirportRadar(containerId = 'radar-scope-root') {
  const container = document.getElementById(containerId);
  if (!container) return;

  let activeAirport = null;

  function render() {
    const incidents = appState.getIncidents();

    // Calculate occurrences linked to each airport
    const airportStats = AIRPORTS.map(apt => {
      const occurrences = incidents.filter(i => i.origin === apt.code || i.destination === apt.code);
      const highRisk = occurrences.filter(i => i.riskRating === 'intolerable').length;
      return {
        ...apt,
        totalOccurrences: occurrences.length,
        highRiskOccurrences: highRisk
      };
    });

    container.innerHTML = `
      <div class="radar-card">
        <div class="card-header">
          <div>
            <h4 class="card-title">BHARAT AIRSPACE AERODROME RADAR</h4>
            <span class="card-subtitle">Delhi • Mumbai • Chennai • Kolkata FIR Surveillance & Met Hazards</span>
          </div>
          <div class="radar-status-badge">
            <span class="status-dot pulse-cyan"></span>
            <span>AAI AIRSPACE SURVEILLANCE ACTIVE</span>
          </div>
        </div>

        <div class="radar-content-layout">
          <!-- Left: Radar Display Scope -->
          <div class="radar-scope-wrapper">
            <div class="radar-screen">
              <!-- Animated sweeping beam -->
              <div class="radar-sweep-beam"></div>

              <!-- Concentric Rings & Crosshairs -->
              <div class="radar-ring ring-1"></div>
              <div class="radar-ring ring-2"></div>
              <div class="radar-ring ring-3"></div>
              <div class="radar-crosshair-h"></div>
              <div class="radar-crosshair-v"></div>

              <!-- Heading labels -->
              <span class="radar-heading-label n">000° N</span>
              <span class="radar-heading-label e">090° E</span>
              <span class="radar-heading-label s">180° S</span>
              <span class="radar-heading-label w">270° W</span>

              <!-- Airport Blips on Scope -->
              <div class="radar-blips-container">
                ${renderRadarBlips(airportStats)}
              </div>
            </div>
          </div>

          <!-- Right: Selected Airport Detail Panel -->
          <div class="radar-detail-panel" id="airport-detail-pane">
            ${renderAirportDetail(activeAirport || airportStats[0])}
          </div>
        </div>
      </div>
    `;

    attachBlipListeners(container, airportStats);
  }

  function renderRadarBlips(airports) {
    // Project lat/long into normalized radar circle (center: Central India / Nagpur FIR ~21°N, 78.5°E)
    const centerLat = 21.0;
    const centerLng = 78.5;

    return airports.map(apt => {
      // Calculate delta from center of Indian Subcontinent
      const dLng = (apt.lng - centerLng);
      const dLat = (apt.lat - centerLat);

      // Scale to radar circle percentage (12% to 88% range)
      const xPct = Math.min(Math.max(50 + (dLng / 13) * 36, 12), 88);
      const yPct = Math.min(Math.max(50 - (dLat / 13) * 36, 12), 88);

      const hasIntolerable = apt.highRiskOccurrences > 0;
      const isActive = activeAirport && activeAirport.code === apt.code;

      return `
        <div 
          class="radar-blip ${hasIntolerable ? 'blip-intolerable' : 'blip-normal'} ${isActive ? 'blip-active' : ''}"
          style="left: ${xPct}%; top: ${yPct}%;"
          data-code="${apt.code}"
          title="${apt.name} (${apt.code}) - ${apt.totalOccurrences} incidents"
        >
          <div class="blip-core"></div>
          <div class="blip-ripple"></div>
          <span class="blip-tag mono">${apt.code}</span>
        </div>
      `;
    }).join('');
  }

  function renderAirportDetail(apt) {
    if (!apt) return '<div class="empty-notice">Select an aerodrome to view telemetry.</div>';

    const incidents = appState.getIncidents().filter(i => i.origin === apt.code || i.destination === apt.code);

    return `
      <div class="aerodrome-dossier">
        <div class="dossier-header">
          <div>
            <div class="apt-code-badge mono">${apt.code} / ${apt.name}</div>
            <div class="apt-city">${apt.city}</div>
          </div>
          <div class="risk-score-gauge">
            <span class="gauge-label">RISK INDEX</span>
            <span class="gauge-val mono ${apt.riskScore > 75 ? 'text-crimson' : 'text-amber'}">${apt.riskScore}/100</span>
          </div>
        </div>

        <div class="dossier-stats-row">
          <div class="dossier-stat">
            <span class="ds-lbl">TOTAL INCIDENTS</span>
            <span class="ds-val mono">${apt.totalOccurrences}</span>
          </div>
          <div class="dossier-stat">
            <span class="ds-lbl">HIGH-RISK (INTOL)</span>
            <span class="ds-val mono text-crimson">${apt.highRiskOccurrences}</span>
          </div>
          <div class="dossier-stat">
            <span class="ds-lbl">COORDINATES</span>
            <span class="ds-val mono">${apt.lat.toFixed(2)}°, ${apt.lng.toFixed(2)}°</span>
          </div>
        </div>

        <!-- Simulated METAR / Terminal Condition -->
        <div class="metar-card">
          <div class="metar-title">
            <span>METAR WEATHER TELEMETRY</span>
            <span class="live-pill">LIVE SENSOR</span>
          </div>
          <div class="metar-raw mono">
            ${apt.code === 'VIDP' 
              ? 'VIDP 210930Z 00000KT 0350 R28/0550 FG VV/// 14/14 Q1016 BECMG 0800 FG LVP-CAT3B'
              : (apt.code === 'VABB'
                ? 'VABB 210930Z 27018G32KT 3000 +RA FEW008 BKN015CB 29/27 Q1006 TEMPO 1500 +TSRA'
                : `${apt.code} 210930Z 09010KT 6000 SCT020 BKN080 32/24 Q1009 NOSIG`)
            }
          </div>
          <div class="metar-decoded">
            ${apt.code === 'VIDP'
              ? '<span>Wind: Calm</span> • <span>Visibility: 350m (RVR 550m)</span> • <span>CAT III-B LVP Active</span>'
              : (apt.code === 'VABB'
                ? '<span>Wind: 270° @ 18G32kt</span> • <span>Heavy Rain / Squall</span> • <span>CB Cells Active</span>'
                : '<span>Wind: 090° @ 10kt</span> • <span>Visibility: 6 km</span> • <span>Temp: 32°C</span>')
            }
          </div>
        </div>

        <!-- Incidents List for this aerodrome -->
        <div class="apt-incidents-section">
          <div class="section-title">ASSOCIATED OCCURRENCES (${incidents.length})</div>
          <div class="apt-incidents-mini-list">
            ${incidents.length > 0 ? incidents.map(inc => `
              <div class="apt-incident-item" data-id="${inc.id}">
                <div class="mini-top">
                  <span class="mini-flight mono">${inc.flightNumber}</span>
                  <span class="mini-risk ${inc.riskRating}">${inc.riskRating.toUpperCase()}</span>
                </div>
                <div class="mini-title">${inc.title}</div>
                <div class="mini-footer mono">${inc.aircraftType} • ${inc.phase}</div>
              </div>
            `).join('') : '<div class="no-inc-mini">No active hazard occurrences recorded for this station.</div>'}
          </div>
        </div>

        <button class="btn btn-secondary btn-block filter-apt-btn" id="btn-isolate-airport">
          🔍 Filter All Incidents by ${apt.code}
        </button>
      </div>
    `;
  }

  function attachBlipListeners(wrapper, airportStats) {
    wrapper.querySelectorAll('.radar-blip').forEach(blip => {
      blip.addEventListener('click', () => {
        const code = blip.getAttribute('data-code');
        activeAirport = airportStats.find(a => a.code === code);
        render();
      });
    });

    const isolateBtn = wrapper.querySelector('#btn-isolate-airport');
    if (isolateBtn && activeAirport) {
      isolateBtn.addEventListener('click', () => {
        appState.setFilters({ search: activeAirport.code });
        appState.setActiveTab('incidents');
      });
    }

    wrapper.querySelectorAll('.apt-incident-item').forEach(item => {
      item.addEventListener('click', () => {
        const incId = item.getAttribute('data-id');
        appState.setSelectedIncident(incId);
        appState.setActiveTab('workbench');
      });
    });
  }

  render();
  appState.subscribe('incidents:updated', render);
}
