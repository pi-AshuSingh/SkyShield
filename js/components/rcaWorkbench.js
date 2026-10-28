/**
 * SkyShield - Aviation Root-Cause Analysis (RCA) Workbench
 * 5-Whys Investigation Tree, HFACS Human Factors Classification & Bow-Tie Risk Engine
 */
import { appState } from '../state.js';
import { HFACS_TAXONOMY } from '../data.js';
import { formatZuluDate, getRiskLevelBadge } from '../utils/formatters.js';

export function initRcaWorkbench(containerId = 'rca-workbench-root') {
  const container = document.getElementById(containerId);
  if (!container) return;

  let activeSubTab = '5whys'; // '5whys' | 'hfacs' | 'bowtie' | 'fdr'

  function render() {
    const incident = appState.getSelectedIncident();
    const allIncidents = appState.getIncidents();

    if (!incident) {
      container.innerHTML = `
        <div class="empty-workbench">
          <h3>No Incident Selected</h3>
          <p>Please select an occurrence from the incident log to conduct root-cause analysis.</p>
        </div>
      `;
      return;
    }

    const rca = incident.rootCauseAnalysis || { fiveWhys: [], hfacsTags: [], bowTie: {} };
    const fiveWhys = rca.fiveWhys || [];
    const hfacsTags = rca.hfacsTags || [];
    const bowTie = rca.bowTie || { threats: [], preventionBarriers: [], topEvent: '', mitigationBarriers: [], consequences: [] };
    const riskBadge = getRiskLevelBadge(incident.riskRating);

    container.innerHTML = `
      <div class="workbench-layout">
        <!-- Top Incident Summary Ribbon -->
        <div class="workbench-ribbon">
          <div class="ribbon-selector-group">
            <span class="ribbon-label">ACTIVE INVESTIGATION:</span>
            <select id="workbench-incident-select" class="form-select incident-switcher">
              ${allIncidents.map(inc => `
                <option value="${inc.id}" ${inc.id === incident.id ? 'selected' : ''}>
                  ${inc.id} - ${inc.flightNumber} (${inc.aircraftType}) - ${inc.title.slice(0, 48)}...
                </option>
              `).join('')}
            </select>
          </div>

          <div class="ribbon-meta">
            <span class="ribbon-chip mono">REG: ${incident.registration || '--'}</span>
            <span class="ribbon-chip mono">FLIGHT: ${incident.flightNumber}</span>
            <span class="ribbon-chip mono">${incident.origin || '---'} ➔ ${incident.destination || '---'}</span>
            <span class="badge ${riskBadge.class}">${riskBadge.icon} ICAO ${incident.severity}${incident.likelihood}</span>
          </div>

          <div class="ribbon-actions">
            <button class="btn btn-sm btn-secondary" id="btn-add-capa-from-rca">
              + New CAPA Action
            </button>
          </div>
        </div>

        <!-- Incident Detailed Banner -->
        <div class="incident-context-card">
          <div class="context-main">
            <h2 class="context-title">${incident.title}</h2>
            <p class="context-narrative">${incident.narrative}</p>
            <div class="context-tags">
              <span class="ctx-tag"><strong>Phase:</strong> ${incident.phase}</span>
              <span class="ctx-tag"><strong>Altitude:</strong> ${incident.altitude || 'N/A'}</span>
              <span class="ctx-tag"><strong>Airspeed:</strong> ${incident.speed || 'N/A'}</span>
              <span class="ctx-tag"><strong>Weather:</strong> ${incident.weather || 'Standard'}</span>
              <span class="ctx-tag"><strong>Reported by:</strong> ${incident.reportedBy || 'Aircrew'}</span>
            </div>
          </div>
        </div>

        <!-- RCA Paradigm Sub-Navigation -->
        <div class="rca-nav-tabs">
          <button class="rca-tab ${activeSubTab === '5whys' ? 'active' : ''}" data-subtab="5whys">
            <span class="rca-tab-icon">🌿</span>
            <span class="rca-tab-text">5-WHYS CAUSAL TREE</span>
            <span class="tab-indicator-badge">${fiveWhys.length} Nodes</span>
          </button>
          <button class="rca-tab ${activeSubTab === 'hfacs' ? 'active' : ''}" data-subtab="hfacs">
            <span class="rca-tab-icon">🧠</span>
            <span class="rca-tab-text">HFACS HUMAN FACTORS</span>
            <span class="tab-indicator-badge">${hfacsTags.length} Active</span>
          </button>
          <button class="rca-tab ${activeSubTab === 'bowtie' ? 'active' : ''}" data-subtab="bowtie">
            <span class="rca-tab-icon">🎀</span>
            <span class="rca-tab-text">BOW-TIE BARRIER MODEL</span>
          </button>
          <button class="rca-tab ${activeSubTab === 'fdr' ? 'active' : ''}" data-subtab="fdr">
            <span class="rca-tab-icon">📡</span>
            <span class="rca-tab-text">FDR / TELEMETRY EXCERPT</span>
          </button>
        </div>

        <!-- RCA Subtab Content Area -->
        <div class="rca-subtab-container">
          ${activeSubTab === '5whys' ? render5WhysTree(incident, fiveWhys) : ''}
          ${activeSubTab === 'hfacs' ? renderHfacsMatrix(incident, hfacsTags) : ''}
          ${activeSubTab === 'bowtie' ? renderBowTieModel(incident, bowTie) : ''}
          ${activeSubTab === 'fdr' ? renderFdrTelemetry(incident) : ''}
        </div>
      </div>
    `;

    attachEvents(container, incident);
  }

  // 1. 5-Whys Tree Renderer
  function render5WhysTree(incident, fiveWhys) {
    return `
      <div class="five-whys-section">
        <div class="section-lead">
          <div class="lead-text">
            <h3>Iterative 5-Whys Root Cause Chain</h3>
            <p>Drill down sequentially from symptom to operational, psychological, and systemic organizational root causes.</p>
          </div>
          <button class="btn btn-sm btn-primary" id="btn-add-why-node">+ Add Causal Node</button>
        </div>

        <div class="why-tree-diagram">
          ${fiveWhys.map((node, idx) => {
            const isLast = idx === fiveWhys.length - 1;
            return `
              <div class="why-node-wrapper ${isLast ? 'terminal-node' : ''}">
                <div class="why-node-card">
                  <div class="why-node-header">
                    <span class="why-badge ${isLast ? 'badge-root' : ''}">
                      ${isLast ? '🎯 SYSTEMIC ROOT CAUSE' : `WHY #${idx + 1}`}
                    </span>
                    <button class="btn-delete-node" data-idx="${idx}" title="Remove this causal step">✕</button>
                  </div>
                  <div class="why-node-body">
                    <div class="why-field">
                      <label class="why-lbl">QUESTION / INQUIRY:</label>
                      <input 
                        type="text" 
                        class="why-input why-q" 
                        data-idx="${idx}" 
                        value="${escapeHtml(node.question || '')}" 
                        placeholder="Why did this event occur?"
                      />
                    </div>
                    <div class="why-field">
                      <label class="why-lbl">DISCOVERED CAUSAL FACTOR / EVIDENCE:</label>
                      <textarea 
                        class="why-input why-a" 
                        data-idx="${idx}" 
                        rows="2"
                        placeholder="Factual findings or operational contributing factor..."
                      >${escapeHtml(node.answer || '')}</textarea>
                    </div>
                  </div>
                </div>

                ${!isLast ? `
                  <div class="why-connector-arrow">
                    <div class="arrow-line"></div>
                    <span class="arrow-tip">▼</span>
                    <span class="connector-label">LEADS TO</span>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // 2. HFACS Taxonomy Renderer
  function renderHfacsMatrix(incident, activeTags) {
    return `
      <div class="hfacs-section">
        <div class="section-lead">
          <div class="lead-text">
            <h3>Human Factors Analysis and Classification System (HFACS)</h3>
            <p>Click tags to assign or unassign psychological, operational, supervisory, and organizational root factors.</p>
          </div>
          <div class="hfacs-summary-pill">
            <span><strong>${activeTags.length}</strong> active HFACS classifications</span>
          </div>
        </div>

        <div class="hfacs-tiers-grid">
          ${Object.entries(HFACS_TAXONOMY).map(([tierName, tags]) => `
            <div class="hfacs-tier-card">
              <div class="tier-card-header">
                <h4>${tierName}</h4>
              </div>
              <div class="tier-tags-list">
                ${tags.map(tag => {
                  const isActive = activeTags.includes(tag.id);
                  return `
                    <div 
                      class="hfacs-tag-pill ${isActive ? 'active' : ''}" 
                      data-tag-id="${tag.id}"
                      tabindex="0"
                      role="button"
                      aria-pressed="${isActive}"
                      title="${tag.desc}"
                    >
                      <div class="tag-top">
                        <span class="tag-status-icon">${isActive ? '✓' : '+'}</span>
                        <span class="tag-name">${tag.name}</span>
                      </div>
                      <p class="tag-desc">${tag.desc}</p>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 3. Bow-Tie Model Renderer
  function renderBowTieModel(incident, bowTie) {
    const threats = bowTie.threats || [];
    const prevBarriers = bowTie.preventionBarriers || [];
    const topEvent = bowTie.topEvent || incident.title;
    const mitBarriers = bowTie.mitigationBarriers || [];
    const consequences = bowTie.consequences || [];

    return `
      <div class="bowtie-section">
        <div class="section-lead">
          <div class="lead-text">
            <h3>Aviation Bow-Tie Barrier & Safety Margin Visualizer</h3>
            <p>Interactive barrier effectiveness model. Click any defense barrier to cycle its operational state (Effective ➔ Degraded ➔ Failed).</p>
          </div>
          <div class="bowtie-legend">
            <span class="bt-badge-status effective">● Effective</span>
            <span class="bt-badge-status degraded">● Degraded</span>
            <span class="bt-badge-status failed">● Failed</span>
          </div>
        </div>

        <div class="bowtie-diagram-board">
          <!-- Left Wing: Threats & Prevention Barriers -->
          <div class="bowtie-column col-threats">
            <div class="col-title">THREAT SOURCES (HAZARDS)</div>
            <div class="nodes-stack">
              ${threats.map(t => `
                <div class="threat-node">
                  <span class="node-icon">⚡</span>
                  <span class="node-text">${t.name}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="bowtie-column col-barriers prev-barriers">
            <div class="col-title">PREVENTION BARRIERS</div>
            <div class="nodes-stack">
              ${prevBarriers.map((b, idx) => `
                <div 
                  class="barrier-node status-${(b.status || 'effective').toLowerCase()}" 
                  data-section="preventionBarriers" 
                  data-idx="${idx}"
                  title="Click to cycle status: Effective -> Degraded -> Failed"
                >
                  <div class="barrier-top">
                    <span class="barrier-type">DEFENSE #${idx + 1}</span>
                    <span class="barrier-status-tag">${b.status}</span>
                  </div>
                  <div class="barrier-name">${b.name}</div>
                  ${b.note ? `<div class="barrier-note">${b.note}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Center Knot: Top Event -->
          <div class="bowtie-column col-center">
            <div class="top-event-knot">
              <div class="knot-inner">
                <span class="knot-badge">TOP EVENT / HAZARD</span>
                <h4 class="knot-title">${topEvent}</h4>
                <span class="knot-alert">Loss of Safety Margin</span>
              </div>
            </div>
          </div>

          <!-- Right Wing: Mitigation Barriers & Consequences -->
          <div class="bowtie-column col-barriers mit-barriers">
            <div class="col-title">MITIGATION CONTROLS</div>
            <div class="nodes-stack">
              ${mitBarriers.map((b, idx) => `
                <div 
                  class="barrier-node status-${(b.status || 'effective').toLowerCase()}" 
                  data-section="mitigationBarriers" 
                  data-idx="${idx}"
                  title="Click to cycle status"
                >
                  <div class="barrier-top">
                    <span class="barrier-type">RECOVERY #${idx + 1}</span>
                    <span class="barrier-status-tag">${b.status}</span>
                  </div>
                  <div class="barrier-name">${b.name}</div>
                  ${b.note ? `<div class="barrier-note">${b.note}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>

          <div class="bowtie-column col-consequences">
            <div class="col-title">OUTCOMES / CONSEQUENCES</div>
            <div class="nodes-stack">
              ${consequences.map(c => `
                <div class="consequence-node ${c.status === 'Prevented' ? 'prevented' : 'mitigated'}">
                  <span class="cons-status">${c.status}</span>
                  <span class="cons-text">${c.name}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 4. FDR / Telemetry Renderer
  function renderFdrTelemetry(incident) {
    const snippet = incident.fdrSnippet || {};
    const entries = Object.entries(snippet);

    return `
      <div class="fdr-section">
        <div class="section-lead">
          <div class="lead-text">
            <h3>Flight Data Recorder (FDR) / QAR Parameter Excerpt</h3>
            <p>Synchronized black-box sensor telemetry recorded during occurrence interval.</p>
          </div>
          <span class="mono fdr-sync-badge">FDR SYNCED • SAMPLING RATE 64Hz</span>
        </div>

        <div class="fdr-dashboard-grid">
          ${entries.map(([param, val]) => `
            <div class="telemetry-gauge-card">
              <div class="gauge-param-name mono">${formatParamName(param)}</div>
              <div class="gauge-param-value mono">${val}</div>
              <div class="gauge-waveform-bar">
                <div class="wave-track">
                  <div class="wave-fill animate-pulse"></div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Simulated Graphical Telemetry Waveform -->
        <div class="telemetry-plot-card">
          <div class="plot-header">
            <span class="plot-title mono">EVENT TIMELINE - ACCELERATION & CONTROL SURFACE TRACE</span>
            <span class="plot-legend mono">T-0: Occurrence Inception</span>
          </div>
          <div class="plot-canvas-wrapper">
            <svg class="plot-svg" viewBox="0 0 600 120" preserveAspectRatio="none">
              <line x1="0" y1="60" x2="600" y2="60" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
              <line x1="280" y1="0" x2="280" y2="120" stroke="#ef4444" stroke-dasharray="4" stroke-width="1.5" />
              <text x="285" y="20" fill="#ef4444" font-size="10" font-family="JetBrains Mono, monospace">EVENT ONSET</text>
              <!-- Normal flight trace -->
              <path d="M 0 60 Q 70 58, 140 60 T 280 60" fill="none" stroke="#00f0ff" stroke-width="2" />
              <!-- Spike trace -->
              <path d="M 280 60 L 300 20 L 320 95 L 345 35 L 370 75 L 400 55 L 450 62 L 600 60" fill="none" stroke="#ef4444" stroke-width="2.5" />
            </svg>
          </div>
        </div>
      </div>
    `;
  }

  function formatParamName(key) {
    return key.replace(/([A-Z])/g, ' $1').toUpperCase();
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function attachEvents(wrapper, incident) {
    // Switch incident dropdown
    const switcher = wrapper.querySelector('#workbench-incident-select');
    if (switcher) {
      switcher.addEventListener('change', (e) => {
        appState.setSelectedIncident(e.target.value);
      });
    }

    // Subtabs click
    wrapper.querySelectorAll('.rca-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        activeSubTab = tab.getAttribute('data-subtab');
        render();
      });
    });

    // 5-Whys edit handlers
    wrapper.querySelectorAll('.why-q, .why-a').forEach(input => {
      input.addEventListener('change', () => {
        const idx = Number(input.getAttribute('data-idx'));
        const currentWhys = JSON.parse(JSON.stringify(incident.rootCauseAnalysis.fiveWhys || []));
        if (currentWhys[idx]) {
          if (input.classList.contains('why-q')) {
            currentWhys[idx].question = input.value;
          } else {
            currentWhys[idx].answer = input.value;
          }
          appState.updateFiveWhys(incident.id, currentWhys);
        }
      });
    });

    // Add why node
    const btnAddWhy = wrapper.querySelector('#btn-add-why-node');
    if (btnAddWhy) {
      btnAddWhy.addEventListener('click', () => {
        const currentWhys = JSON.parse(JSON.stringify(incident.rootCauseAnalysis.fiveWhys || []));
        currentWhys.push({
          level: currentWhys.length + 1,
          question: `Why did factor #${currentWhys.length} occur?`,
          answer: 'Contributing operational/organizational condition.'
        });
        appState.updateFiveWhys(incident.id, currentWhys);
        render();
      });
    }

    // Delete why node
    wrapper.querySelectorAll('.btn-delete-node').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-idx'));
        const currentWhys = JSON.parse(JSON.stringify(incident.rootCauseAnalysis.fiveWhys || []));
        if (currentWhys.length > 1) {
          currentWhys.splice(idx, 1);
          appState.updateFiveWhys(incident.id, currentWhys);
          render();
        } else {
          alert('At least one causal node must remain in the investigation chain.');
        }
      });
    });

    // HFACS tag toggle
    wrapper.querySelectorAll('.hfacs-tag-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const tagId = pill.getAttribute('data-tag-id');
        appState.toggleHfacsTag(incident.id, tagId);
        render();
      });
    });

    // Bow-Tie Barrier toggle
    wrapper.querySelectorAll('.barrier-node').forEach(node => {
      node.addEventListener('click', () => {
        const section = node.getAttribute('data-section');
        const idx = Number(node.getAttribute('data-idx'));
        const currentStatus = incident.rootCauseAnalysis.bowTie[section][idx].status;

        let nextStatus = 'Effective';
        if (currentStatus === 'Effective') nextStatus = 'Degraded';
        else if (currentStatus === 'Degraded') nextStatus = 'Failed';
        else nextStatus = 'Effective';

        appState.updateBowTieItem(incident.id, section, idx, nextStatus);
        render();
      });
    });

    // Add CAPA from workbench
    const btnCapa = wrapper.querySelector('#btn-add-capa-from-rca');
    if (btnCapa) {
      btnCapa.addEventListener('click', () => {
        appState.setActiveTab('capa');
      });
    }
  }

  render();
  appState.subscribe('incident:selected', render);
  appState.subscribe('rca:updated', render);
}
