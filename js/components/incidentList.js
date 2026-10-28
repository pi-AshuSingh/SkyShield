/**
 * SkyShield - Incident Log & Investigation Explorer Component
 * Filterable, sortable occurrence table with quick filters and flight data inspect
 */
import { appState } from '../state.js';
import { INCIDENT_CATEGORIES, FLIGHT_PHASES } from '../data.js';
import { formatZuluDate, getRiskLevelBadge, getSeverityBadge } from '../utils/formatters.js';

export function initIncidentList(containerId = 'incident-list-root') {
  const container = document.getElementById(containerId);
  if (!container) return;

  let viewMode = 'table'; // 'table' | 'cards'

  function render() {
    const incidents = appState.getFilteredIncidents();
    const currentFilters = appState.filters;

    container.innerHTML = `
      <div class="incident-log-card">
        <!-- Control Header & Filters -->
        <div class="log-controls-bar">
          <div class="controls-left">
            <h3 class="log-title">OCCURRENCE REGISTER (${incidents.length} Records)</h3>
            <div class="quick-filter-pills">
              <button class="pill-btn ${currentFilters.category === 'ALL' && !currentFilters.matrixCell ? 'active' : ''}" data-cat="ALL">All Occurrences</button>
              <button class="pill-btn ${currentFilters.category === 'Bird Strike / Wildlife Hazard (Black Kite / Stray Animal)' ? 'active' : ''}" data-cat="Bird Strike / Wildlife Hazard (Black Kite / Stray Animal)">🦅 Black Kite / Bird Strike</button>
              <button class="pill-btn ${currentFilters.category === 'Severe Monsoon Convective Weather / Cloudburst Squall' ? 'active' : ''}" data-cat="Severe Monsoon Convective Weather / Cloudburst Squall">⛈️ Monsoon / Squall</button>
              <button class="pill-btn ${currentFilters.category === 'Delhi NCR Dense Winter Fog (CAT III-B LVP / Low Visibility)' ? 'active' : ''}" data-cat="Delhi NCR Dense Winter Fog (CAT III-B LVP / Low Visibility)">🌫️ Delhi Fog (CAT III-B)</button>
              <button class="pill-btn ${currentFilters.category === 'Runway Incursion / Stop-Bar Violation' ? 'active' : ''}" data-cat="Runway Incursion / Stop-Bar Violation">🛑 Runway Incursions</button>
              <button class="pill-btn ${currentFilters.category === 'TCAS Resolution Advisory (RA) / Loss of Separation' ? 'active' : ''}" data-cat="TCAS Resolution Advisory (RA) / Loss of Separation">⚡ TCAS (RA)</button>
            </div>
          </div>

          <div class="controls-right">
            <!-- Dropdown Filters -->
            <div class="dropdown-filter-group">
              <select id="filter-category-select" class="form-select filter-select">
                <option value="ALL">All Categories</option>
                ${INCIDENT_CATEGORIES.map(c => `
                  <option value="${c}" ${currentFilters.category === c ? 'selected' : ''}>${c}</option>
                `).join('')}
              </select>

              <select id="filter-phase-select" class="form-select filter-select">
                <option value="ALL">All Flight Phases</option>
                ${FLIGHT_PHASES.map(p => `
                  <option value="${p}" ${currentFilters.phase === p ? 'selected' : ''}>${p}</option>
                `).join('')}
              </select>

              <select id="filter-severity-select" class="form-select filter-select">
                <option value="ALL">All Severities</option>
                <option value="5" ${currentFilters.severity === '5' ? 'selected' : ''}>Severity 5 (Catastrophic)</option>
                <option value="4" ${currentFilters.severity === '4' ? 'selected' : ''}>Severity 4 (Hazardous)</option>
                <option value="3" ${currentFilters.severity === '3' ? 'selected' : ''}>Severity 3 (Major)</option>
                <option value="2" ${currentFilters.severity === '2' ? 'selected' : ''}>Severity 2 (Minor)</option>
                <option value="1" ${currentFilters.severity === '1' ? 'selected' : ''}>Severity 1 (Negligible)</option>
              </select>
            </div>

            <!-- View Mode Switch -->
            <div class="view-toggle">
              <button id="view-mode-table" class="view-btn ${viewMode === 'table' ? 'active' : ''}" title="Table View">☰</button>
              <button id="view-mode-cards" class="view-btn ${viewMode === 'cards' ? 'active' : ''}" title="Card Grid View">⊞</button>
            </div>
          </div>
        </div>

        ${currentFilters.matrixCell ? `
          <div class="matrix-filter-banner">
            <span>Filtering by ICAO Risk Matrix Cell: <strong>${currentFilters.matrixCell}</strong></span>
            <button id="banner-clear-cell" class="btn btn-xs btn-outline">Clear Cell Filter</button>
          </div>
        ` : ''}

        <!-- Incidents Content -->
        <div class="incidents-body">
          ${incidents.length === 0 ? `
            <div class="empty-state-box">
              <div class="empty-icon">🛫</div>
              <h4>No Aviation Occurrences Found</h4>
              <p>No safety incident records match your active criteria. Try clearing search filters or file a new occurrence report.</p>
              <button id="btn-reset-filters-empty" class="btn btn-secondary">Reset All Filters</button>
            </div>
          ` : (viewMode === 'table' ? renderTableView(incidents) : renderCardsView(incidents))}
        </div>
      </div>
    `;

    attachEvents(container);
  }

  function renderTableView(incidents) {
    const selectedId = appState.selectedIncidentId;

    return `
      <div class="table-responsive">
        <table class="incident-table" role="table">
          <thead>
            <tr>
              <th>OCCURRENCE ID</th>
              <th>DATE (UTC)</th>
              <th>FLIGHT / OPERATOR</th>
              <th>AIRCRAFT</th>
              <th>ROUTE</th>
              <th>PHASE</th>
              <th>RISK INDEX</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            ${incidents.map(inc => {
              const riskBadge = getRiskLevelBadge(inc.riskRating);
              const isSelected = inc.id === selectedId;

              return `
                <tr class="incident-row ${isSelected ? 'row-selected' : ''}" data-id="${inc.id}">
                  <td class="mono cell-id">
                    <div class="id-wrapper">
                      <span class="id-text">${inc.id}</span>
                      <span class="category-subtext">${inc.category}</span>
                    </div>
                  </td>
                  <td class="mono cell-date">${formatZuluDate(inc.date)}</td>
                  <td>
                    <div class="flight-cell">
                      <span class="flight-num mono">${inc.flightNumber}</span>
                      <span class="airline-text">${inc.airline || ''}</span>
                    </div>
                  </td>
                  <td>
                    <div class="aircraft-cell">
                      <span class="ac-type">${inc.aircraftType}</span>
                      <span class="ac-reg mono">${inc.registration || ''}</span>
                    </div>
                  </td>
                  <td class="mono cell-route">
                    ${inc.origin && inc.destination ? `
                      <span class="route-origin">${inc.origin}</span>
                      <span class="route-arrow">✈</span>
                      <span class="route-dest">${inc.destination}</span>
                    ` : '--'}
                  </td>
                  <td class="cell-phase">
                    <span class="phase-tag">${inc.phase}</span>
                  </td>
                  <td>
                    <div class="risk-cell-badge">
                      <span class="badge ${riskBadge.class}">
                        ${riskBadge.icon} ${inc.severity}${inc.likelihood}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span class="status-badge-chip ${getStatusClass(inc.status)}">${inc.status}</span>
                  </td>
                  <td class="cell-actions">
                    <button class="btn btn-xs btn-primary btn-inspect-rca" data-id="${inc.id}" title="Launch Root-Cause Workbench">
                      <span>RCA</span>
                    </button>
                    <button class="btn btn-xs btn-ghost btn-delete-inc" data-id="${inc.id}" title="Delete Record">
                      ✕
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderCardsView(incidents) {
    const selectedId = appState.selectedIncidentId;

    return `
      <div class="cards-grid">
        ${incidents.map(inc => {
          const riskBadge = getRiskLevelBadge(inc.riskRating);
          const isSelected = inc.id === selectedId;

          return `
            <div class="occurrence-card ${isSelected ? 'card-selected' : ''}" data-id="${inc.id}">
              <div class="occ-card-header">
                <div>
                  <span class="occ-id mono">${inc.id}</span>
                  <span class="occ-date mono">${formatZuluDate(inc.date)}</span>
                </div>
                <span class="badge ${riskBadge.class}">${riskBadge.icon} ${inc.severity}${inc.likelihood} (${riskBadge.label})</span>
              </div>

              <h4 class="occ-title">${inc.title}</h4>

              <div class="occ-meta-grid">
                <div class="occ-meta-item">
                  <span class="m-lbl">FLIGHT</span>
                  <span class="m-val mono">${inc.flightNumber}</span>
                </div>
                <div class="occ-meta-item">
                  <span class="m-lbl">AIRCRAFT</span>
                  <span class="m-val">${inc.aircraftType}</span>
                </div>
                <div class="occ-meta-item">
                  <span class="m-lbl">ROUTE</span>
                  <span class="m-val mono">${inc.origin} → ${inc.destination}</span>
                </div>
                <div class="occ-meta-item">
                  <span class="m-lbl">PHASE</span>
                  <span class="m-val">${inc.phase}</span>
                </div>
              </div>

              <p class="occ-narrative-preview">${inc.narrative.slice(0, 140)}...</p>

              <div class="occ-card-footer">
                <span class="status-badge-chip ${getStatusClass(inc.status)}">${inc.status}</span>
                <button class="btn btn-sm btn-primary btn-inspect-rca" data-id="${inc.id}">
                  <span>🔬 Open RCA Workbench</span>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function getStatusClass(status) {
    if (status.includes('Active')) return 'status-active';
    if (status.includes('Validated')) return 'status-validated';
    if (status.includes('Progress')) return 'status-progress';
    if (status.includes('Closed')) return 'status-closed';
    return 'status-default';
  }

  function attachEvents(wrapper) {
    // Quick category pills
    wrapper.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-cat');
        appState.setFilters({ category: cat, matrixCell: null });
      });
    });

    // Dropdown filters
    const catSelect = wrapper.querySelector('#filter-category-select');
    if (catSelect) {
      catSelect.addEventListener('change', (e) => {
        appState.setFilters({ category: e.target.value });
      });
    }

    const phaseSelect = wrapper.querySelector('#filter-phase-select');
    if (phaseSelect) {
      phaseSelect.addEventListener('change', (e) => {
        appState.setFilters({ phase: e.target.value });
      });
    }

    const sevSelect = wrapper.querySelector('#filter-severity-select');
    if (sevSelect) {
      sevSelect.addEventListener('change', (e) => {
        appState.setFilters({ severity: e.target.value });
      });
    }

    // View toggle buttons
    const btnTable = wrapper.querySelector('#view-mode-table');
    const btnCards = wrapper.querySelector('#view-mode-cards');
    if (btnTable) {
      btnTable.addEventListener('click', () => {
        viewMode = 'table';
        render();
      });
    }
    if (btnCards) {
      btnCards.addEventListener('click', () => {
        viewMode = 'cards';
        render();
      });
    }

    // Clear matrix banner
    const clearCellBtn = wrapper.querySelector('#banner-clear-cell');
    if (clearCellBtn) {
      clearCellBtn.addEventListener('click', () => {
        appState.clearMatrixCellFilter();
      });
    }

    // Reset empty filters
    const resetFiltersEmpty = wrapper.querySelector('#btn-reset-filters-empty');
    if (resetFiltersEmpty) {
      resetFiltersEmpty.addEventListener('click', () => {
        appState.setFilters({ search: '', category: 'ALL', phase: 'ALL', severity: 'ALL', matrixCell: null });
      });
    }

    // Row selection and RCA workbench navigation
    wrapper.querySelectorAll('.incident-row, .occurrence-card').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.btn-delete-inc')) return;
        const id = el.getAttribute('data-id');
        appState.setSelectedIncident(id);
      });
    });

    wrapper.querySelectorAll('.btn-inspect-rca').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        appState.setSelectedIncident(id);
        appState.setActiveTab('workbench');
      });
    });

    // Delete incident
    wrapper.querySelectorAll('.btn-delete-inc').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (confirm(`Confirm deletion of occurrence record ${id}?`)) {
          appState.deleteIncident(id);
        }
      });
    });
  }

  render();
  appState.subscribe('incidents:updated', render);
  appState.subscribe('filters:changed', render);
  appState.subscribe('incident:selected', render);
}
