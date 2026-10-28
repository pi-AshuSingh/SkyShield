/**
 * SkyShield - ICAO 5x5 Safety Risk Matrix Component
 * Interactive Risk Assessment Grid with real-time incident mapping & cross-filtering
 */
import { RISK_MATRIX_CONFIG } from '../data.js';
import { appState } from '../state.js';

export function initRiskMatrix(containerId = 'risk-matrix-root') {
  const container = document.getElementById(containerId);
  if (!container) return;

  function render() {
    const incidents = appState.getIncidents();
    const activeCell = appState.filters.matrixCell;

    // Calculate distribution across the 25 cells
    const cellCounts = {};
    incidents.forEach(inc => {
      const code = `${inc.severity}${inc.likelihood}`;
      cellCounts[code] = (cellCounts[code] || 0) + 1;
    });

    // Summary counts
    let intolerableTotal = 0;
    let tolerableTotal = 0;
    let acceptableTotal = 0;

    incidents.forEach(inc => {
      const code = `${inc.severity}${inc.likelihood}`;
      const rating = RISK_MATRIX_CONFIG.ratings[code] || 'acceptable';
      if (rating === 'intolerable') intolerableTotal++;
      else if (rating === 'tolerable') tolerableTotal++;
      else acceptableTotal++;
    });

    container.innerHTML = `
      <div class="matrix-card">
        <div class="card-header">
          <div class="header-left">
            <h3 class="card-title">ICAO 5×5 SAFETY RISK INDEX</h3>
            <span class="card-subtitle">Severity vs Likelihood Heatmap (Doc 9859 Chapter 2)</span>
          </div>
          <div class="header-right">
            ${activeCell ? `
              <div class="active-filter-pill">
                <span>FILTERED: <strong>CELL ${activeCell}</strong></span>
                <button id="btn-clear-matrix-filter" class="btn-clear-pill" title="Clear filter">✕</button>
              </div>
            ` : `
              <span class="hint-text">Click cell to isolate occurrences</span>
            `}
          </div>
        </div>

        <div class="risk-stats-strip">
          <div class="risk-stat-item stat-intolerable">
            <span class="stat-dot red"></span>
            <span class="stat-label">INTOLERABLE (UNACCEPTABLE)</span>
            <span class="stat-value mono">${intolerableTotal}</span>
          </div>
          <div class="risk-stat-item stat-tolerable">
            <span class="stat-dot amber"></span>
            <span class="stat-label">TOLERABLE (REVIEW / MITIGATION)</span>
            <span class="stat-value mono">${tolerableTotal}</span>
          </div>
          <div class="risk-stat-item stat-acceptable">
            <span class="stat-dot green"></span>
            <span class="stat-label">ACCEPTABLE (MONITORED)</span>
            <span class="stat-value mono">${acceptableTotal}</span>
          </div>
        </div>

        <div class="matrix-table-wrapper">
          <table class="risk-matrix-table" role="grid" aria-label="ICAO Risk Assessment Matrix">
            <thead>
              <tr>
                <th class="matrix-corner" rowspan="2">
                  <div class="corner-split">
                    <span class="corner-top">LIKELIHOOD →</span>
                    <span class="corner-bottom">SEVERITY ↓</span>
                  </div>
                </th>
                ${RISK_MATRIX_CONFIG.likelihoods.map(l => `
                  <th class="col-likelihood-header" scope="col">
                    <div class="likelihood-code">${l.code}</div>
                    <div class="likelihood-name">${l.label.split(' - ')[1]}</div>
                  </th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              ${RISK_MATRIX_CONFIG.severities.map(s => `
                <tr>
                  <th class="row-severity-header" scope="row">
                    <div class="sev-level">${s.level}</div>
                    <div class="sev-label">${s.label.split(' - ')[1]}</div>
                  </th>
                  ${RISK_MATRIX_CONFIG.likelihoods.map(l => {
                    const code = `${s.level}${l.code}`;
                    const count = cellCounts[code] || 0;
                    const rating = RISK_MATRIX_CONFIG.ratings[code] || 'acceptable';
                    const isSelected = activeCell === code;

                    return `
                      <td 
                        class="matrix-cell cell-${rating} ${isSelected ? 'cell-selected' : ''}" 
                        data-cell-code="${code}"
                        tabindex="0"
                        role="button"
                        aria-pressed="${isSelected}"
                        aria-label="Risk cell ${code}, severity ${s.level}, likelihood ${l.code}, rating ${rating}, ${count} incidents"
                      >
                        <div class="cell-inner">
                          <span class="cell-code mono">${code}</span>
                          ${count > 0 ? `
                            <span class="cell-count-badge ${rating}">${count}</span>
                          ` : `<span class="cell-empty-dot">·</span>`}
                        </div>
                      </td>
                    `;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="matrix-legend">
          <div class="legend-item"><span class="legend-box red"></span> Red: Immediate action mandatory, stop operation</div>
          <div class="legend-item"><span class="legend-box amber"></span> Amber: Tolerable with approved CAPA mitigation</div>
          <div class="legend-item"><span class="legend-box green"></span> Green: Acceptable risk, maintain routine monitoring</div>
        </div>
      </div>
    `;

    // Click handlers for matrix cells
    container.querySelectorAll('.matrix-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const code = cell.getAttribute('data-cell-code');
        if (appState.filters.matrixCell === code) {
          appState.clearMatrixCellFilter();
        } else {
          appState.setFilters({ matrixCell: code });
        }
      });

      // Accessible keyboard support
      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          cell.click();
        }
      });
    });

    const btnClear = container.querySelector('#btn-clear-matrix-filter');
    if (btnClear) {
      btnClear.addEventListener('click', (e) => {
        e.stopPropagation();
        appState.clearMatrixCellFilter();
      });
    }
  }

  render();
  appState.subscribe('incidents:updated', render);
  appState.subscribe('filters:changed', render);
}
