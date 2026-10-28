/**
 * SkyShield - Dynamic Aviation Analytics & Charts
 * High-performance SVG & Canvas visualizations without external bloat
 */
import { appState } from '../state.js';
import { FLIGHT_PHASES } from '../data.js';

export function initCharts(containerId = 'analytics-charts-root') {
  const container = document.getElementById(containerId);
  if (!container) return;

  function render() {
    const incidents = appState.getFilteredIncidents();
    const allIncidents = appState.getIncidents();

    // 1. Group by Flight Phase
    const phaseCounts = {};
    incidents.forEach(inc => {
      // Normalize phase label for compact chart
      let p = inc.phase || 'Other';
      if (p.includes('Climb')) p = 'Initial Climb';
      else if (p.includes('Cruise')) p = 'Cruise';
      else if (p.includes('Approach')) p = 'Approach';
      else if (p.includes('Taxi') || p.includes('Pushback')) p = 'Taxi / Ramp';
      else if (p.includes('Takeoff')) p = 'Takeoff';
      else if (p.includes('Descent')) p = 'Descent';
      else if (p.includes('Landing')) p = 'Landing';

      phaseCounts[p] = (phaseCounts[p] || 0) + 1;
    });

    // 2. Group by Category (Pareto)
    const categoryCounts = {};
    incidents.forEach(inc => {
      categoryCounts[inc.category] = (categoryCounts[inc.category] || 0) + 1;
    });
    const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

    // 3. Aircraft Fleet Distribution
    const fleetCounts = {};
    incidents.forEach(inc => {
      let fleet = 'Other';
      if (inc.aircraftType.includes('A350')) fleet = 'Airbus A350';
      else if (inc.aircraftType.includes('787')) fleet = 'Boeing 787';
      else if (inc.aircraftType.includes('737')) fleet = 'Boeing 737';
      else if (inc.aircraftType.includes('A320') || inc.aircraftType.includes('A321')) fleet = 'Airbus A320/321';
      else if (inc.aircraftType.includes('A330')) fleet = 'Airbus A330';
      else if (inc.aircraftType.includes('777')) fleet = 'Boeing 777';
      else if (inc.aircraftType.includes('ATR')) fleet = 'ATR 72';
      fleetCounts[fleet] = (fleetCounts[fleet] || 0) + 1;
    });

    // 4. Monthly Trend Data (Simulated 6-month historical curve + actual filtered)
    const months = [
      { month: 'MAY', intol: 1, tol: 2, acc: 5 },
      { month: 'JUN', intol: 0, tol: 3, acc: 4 },
      { month: 'JUL', intol: 2, tol: 1, acc: 6 },
      { month: 'AUG', intol: 1, tol: 4, acc: 7 },
      { month: 'SEP', intol: 2, tol: 3, acc: 5 },
      { month: 'OCT', intol: 3, tol: 2, acc: 4 }
    ];

    container.innerHTML = `
      <div class="analytics-grid">
        <!-- Monthly Severity Trend Chart -->
        <div class="analytics-card trend-card">
          <div class="card-header">
            <div>
              <h4 class="card-title">INCIDENT TREND & SEVERITY VELOCITY</h4>
              <span class="card-subtitle">Trailing 6-Month Occurrences (ICAO Annex 19 SPI)</span>
            </div>
            <div class="trend-legend">
              <span class="legend-chip red"><span class="chip-dot"></span> Intolerable</span>
              <span class="legend-chip amber"><span class="chip-dot"></span> Tolerable</span>
              <span class="legend-chip green"><span class="chip-dot"></span> Acceptable</span>
            </div>
          </div>
          <div class="chart-canvas-box" id="monthly-trend-box">
            ${renderTrendSvg(months)}
          </div>
        </div>

        <!-- Flight Phase Donut Chart -->
        <div class="analytics-card phase-card">
          <div class="card-header">
            <div>
              <h4 class="card-title">OCCURRENCES BY FLIGHT PHASE</h4>
              <span class="card-subtitle">Critical Phase-of-Flight Risk Concentration</span>
            </div>
          </div>
          <div class="donut-chart-container">
            ${renderPhaseDonut(phaseCounts, incidents.length)}
          </div>
        </div>

        <!-- Category Pareto Chart -->
        <div class="analytics-card pareto-card">
          <div class="card-header">
            <div>
              <h4 class="card-title">HAZARD DOMAIN PARETO</h4>
              <span class="card-subtitle">Frequency Breakdown by Primary Occurrence Type</span>
            </div>
          </div>
          <div class="pareto-bars-list">
            ${sortedCategories.slice(0, 5).map(([cat, count]) => {
              const pct = incidents.length > 0 ? Math.round((count / incidents.length) * 100) : 0;
              return `
                <div class="pareto-row">
                  <div class="pareto-info">
                    <span class="pareto-name">${cat}</span>
                    <span class="pareto-val mono">${count} (${pct}%)</span>
                  </div>
                  <div class="pareto-track">
                    <div class="pareto-fill" style="width: ${Math.max(pct, 6)}%"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Fleet Vulnerability Card -->
        <div class="analytics-card fleet-card">
          <div class="card-header">
            <div>
              <h4 class="card-title">FLEET AIRWORTHINESS PROFILE</h4>
              <span class="card-subtitle">Occurrences by Airframe Model</span>
            </div>
          </div>
          <div class="fleet-meter-list">
            ${Object.entries(fleetCounts).map(([fleet, count]) => {
              const maxVal = Math.max(...Object.values(fleetCounts), 1);
              const barWidth = Math.round((count / maxVal) * 100);
              return `
                <div class="fleet-row">
                  <div class="fleet-badge-box">
                    <span class="fleet-plane-icon">✈</span>
                    <span class="fleet-name">${fleet}</span>
                  </div>
                  <div class="fleet-bar-wrapper">
                    <div class="fleet-bar-fill" style="width: ${barWidth}%"></div>
                  </div>
                  <span class="fleet-count mono">${count}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    attachDonutHoverListeners(container);
  }

  function renderTrendSvg(months) {
    const width = 500;
    const height = 180;
    const paddingLeft = 40;
    const paddingBottom = 30;
    const chartW = width - paddingLeft - 20;
    const chartH = height - paddingBottom - 20;

    const maxTotal = 15;
    const colWidth = chartW / months.length;

    let barsSvg = '';
    let polylinePoints = [];

    months.forEach((m, i) => {
      const x = paddingLeft + i * colWidth + (colWidth - 32) / 2;
      const total = m.intol + m.tol + m.acc;

      const hAcc = (m.acc / maxTotal) * chartH;
      const hTol = (m.tol / maxTotal) * chartH;
      const hIntol = (m.intol / maxTotal) * chartH;

      const yAcc = height - paddingBottom - hAcc;
      const yTol = yAcc - hTol;
      const yIntol = yTol - hIntol;

      // Polyline for rate trend
      const cx = x + 16;
      const cy = yIntol;
      polylinePoints.push(`${cx},${cy}`);

      barsSvg += `
        <!-- Column for ${m.month} -->
        <g class="chart-col-group">
          <!-- Acceptable -->
          <rect class="bar-rect bar-acc" x="${x}" y="${yAcc}" width="32" height="${hAcc}" rx="2" />
          <!-- Tolerable -->
          <rect class="bar-rect bar-tol" x="${x}" y="${yTol}" width="32" height="${hTol}" />
          <!-- Intolerable -->
          <rect class="bar-rect bar-intol" x="${x}" y="${yIntol}" width="32" height="${hIntol}" rx="3" />
          
          <text class="chart-x-label mono" x="${x + 16}" y="${height - 10}" text-anchor="middle">${m.month}</text>
          <text class="chart-col-value mono" x="${x + 16}" y="${yIntol - 6}" text-anchor="middle">${total}</text>
        </g>
      `;
    });

    return `
      <svg class="trend-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
        <!-- Grid lines -->
        <line x1="${paddingLeft}" y1="${height - paddingBottom}" x2="${width - 10}" y2="${height - paddingBottom}" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
        <line x1="${paddingLeft}" y1="${height - paddingBottom - chartH / 2}" x2="${width - 10}" y2="${height - paddingBottom - chartH / 2}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4" />
        <line x1="${paddingLeft}" y1="${20}" x2="${width - 10}" y2="${20}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4" />

        ${barsSvg}

        <!-- Trend spline line -->
        <polyline 
          fill="none" 
          stroke="#00f0ff" 
          stroke-width="2.5" 
          stroke-dasharray="none" 
          points="${polylinePoints.join(' ')}" 
        />
        ${polylinePoints.map(pt => `
          <circle cx="${pt.split(',')[0]}" cy="${pt.split(',')[1]}" r="4" fill="#00f0ff" stroke="#0a0e17" stroke-width="2" />
        `).join('')}
      </svg>
    `;
  }

  function renderPhaseDonut(phaseCounts, total) {
    const size = 180;
    const strokeWidth = 26;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const colors = ['#00f0ff', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#3b82f6', '#f43f5e'];
    const entries = Object.entries(phaseCounts);

    if (total === 0 || entries.length === 0) {
      return `
        <div class="empty-chart-notice">No occurrences matching current filters.</div>
      `;
    }

    let accumulatedPct = 0;
    const slices = entries.map(([phase, count], idx) => {
      const pct = count / total;
      const strokeDasharray = `${pct * circumference} ${circumference}`;
      const strokeDashoffset = -accumulatedPct * circumference;
      accumulatedPct += pct;
      const color = colors[idx % colors.length];

      return `
        <circle 
          class="donut-slice"
          cx="${size / 2}" 
          cy="${size / 2}" 
          r="${radius}" 
          fill="transparent" 
          stroke="${color}" 
          stroke-width="${strokeWidth}" 
          stroke-dasharray="${strokeDasharray}" 
          stroke-dashoffset="${strokeDashoffset}"
          data-phase="${phase}"
          data-count="${count}"
          data-pct="${Math.round(pct * 100)}"
          transform="rotate(-90 ${size / 2} ${size / 2})"
        />
      `;
    }).join('');

    const topPhase = entries[0] ? entries[0][0] : 'None';
    const topCount = entries[0] ? entries[0][1] : 0;

    return `
      <div class="donut-wrapper">
        <svg class="donut-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <circle 
            cx="${size / 2}" 
            cy="${size / 2}" 
            r="${radius}" 
            fill="transparent" 
            stroke="rgba(255,255,255,0.06)" 
            stroke-width="${strokeWidth}" 
          />
          ${slices}
        </svg>
        <div class="donut-center-label" id="donut-center-info">
          <span class="donut-center-val mono" id="donut-val">${topCount}</span>
          <span class="donut-center-title" id="donut-title">${topPhase}</span>
        </div>
      </div>
      <div class="donut-legend">
        ${entries.map(([phase, count], idx) => `
          <div class="donut-legend-item" data-phase="${phase}">
            <span class="legend-color-dot" style="background-color: ${colors[idx % colors.length]}"></span>
            <span class="legend-phase-name">${phase}</span>
            <span class="legend-phase-count mono">${count}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  function attachDonutHoverListeners(wrapper) {
    const slices = wrapper.querySelectorAll('.donut-slice');
    const centerVal = wrapper.querySelector('#donut-val');
    const centerTitle = wrapper.querySelector('#donut-title');

    slices.forEach(slice => {
      slice.addEventListener('mouseenter', () => {
        const phase = slice.getAttribute('data-phase');
        const count = slice.getAttribute('data-count');
        const pct = slice.getAttribute('data-pct');
        if (centerVal && centerTitle) {
          centerVal.textContent = `${count} (${pct}%)`;
          centerTitle.textContent = phase;
        }
      });
    });
  }

  render();
  appState.subscribe('incidents:updated', render);
  appState.subscribe('filters:changed', render);
}
