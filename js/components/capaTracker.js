/**
 * SkyShield - CAPA (Corrective and Preventive Action) Tracker
 * ICAO SMS Closed-Loop Risk Remediation & Audit Tracking
 */
import { appState } from '../state.js';

export function initCapaTracker(containerId = 'capa-tracker-root') {
  const container = document.getElementById(containerId);
  if (!container) return;

  function render() {
    const incidents = appState.getIncidents();

    // Aggregate all CAPA actions across all incidents
    const allCapas = [];
    incidents.forEach(inc => {
      if (Array.isArray(inc.capaActions)) {
        inc.capaActions.forEach(capa => {
          allCapas.push({
            ...capa,
            incidentId: inc.id,
            incidentTitle: inc.title,
            flightNumber: inc.flightNumber
          });
        });
      }
    });

    const openCapas = allCapas.filter(c => c.status === 'Open');
    const inProgressCapas = allCapas.filter(c => c.status === 'In Progress');
    const closedCapas = allCapas.filter(c => c.status === 'Closed' || c.status === 'Closed & Verified');

    const totalCount = allCapas.length;
    const closureRate = totalCount > 0 ? Math.round((closedCapas.length / totalCount) * 100) : 100;

    container.innerHTML = `
      <div class="capa-tracker-board">
        <!-- CAPA Header & Metrics -->
        <div class="capa-header-row">
          <div>
            <h3 class="capa-main-title">CORRECTIVE & PREVENTIVE ACTION (CAPA) REGISTER</h3>
            <span class="capa-subtitle">Closed-Loop Aviation Risk Remediation (ICAO Doc 9859 Safety Assurance)</span>
          </div>
          <button class="btn btn-primary" id="btn-open-create-capa">
            + New Corrective Action
          </button>
        </div>

        <div class="capa-metrics-grid">
          <div class="capa-metric-card">
            <span class="cm-lbl">TOTAL CAPA ACTIONS</span>
            <span class="cm-val mono text-cyan">${totalCount}</span>
          </div>
          <div class="capa-metric-card">
            <span class="cm-lbl">OPEN / PENDING WORK</span>
            <span class="cm-val mono text-amber">${openCapas.length}</span>
          </div>
          <div class="capa-metric-card">
            <span class="cm-lbl">ACTIVE ENGINEERING / SOP</span>
            <span class="cm-val mono text-blue">${inProgressCapas.length}</span>
          </div>
          <div class="capa-metric-card">
            <span class="cm-lbl">AUDITED & VERIFIED</span>
            <span class="cm-val mono text-emerald">${closedCapas.length}</span>
          </div>
          <div class="capa-metric-card">
            <span class="cm-lbl">ON-TIME CLOSURE RATIO</span>
            <span class="cm-val mono text-emerald">${closureRate}%</span>
          </div>
        </div>

        <!-- Kanban Columns -->
        <div class="capa-kanban-board">
          <!-- Column 1: Open -->
          <div class="kanban-column col-open">
            <div class="column-header">
              <span class="col-status-indicator amber"></span>
              <h4>OPEN / ASSIGNED (${openCapas.length})</h4>
            </div>
            <div class="cards-list">
              ${openCapas.length > 0 ? openCapas.map(capa => renderCapaCard(capa, 'Open')).join('') : '<div class="kanban-empty">No unstarted actions.</div>'}
            </div>
          </div>

          <!-- Column 2: In Progress -->
          <div class="kanban-column col-progress">
            <div class="column-header">
              <span class="col-status-indicator blue"></span>
              <h4>IN PROGRESS (${inProgressCapas.length})</h4>
            </div>
            <div class="cards-list">
              ${inProgressCapas.length > 0 ? inProgressCapas.map(capa => renderCapaCard(capa, 'In Progress')).join('') : '<div class="kanban-empty">No actions in progress.</div>'}
            </div>
          </div>

          <!-- Column 3: Closed & Verified -->
          <div class="kanban-column col-closed">
            <div class="column-header">
              <span class="col-status-indicator green"></span>
              <h4>CLOSED & AUDITED (${closedCapas.length})</h4>
            </div>
            <div class="cards-list">
              ${closedCapas.length > 0 ? closedCapas.map(capa => renderCapaCard(capa, 'Closed')).join('') : '<div class="kanban-empty">No closed actions.</div>'}
            </div>
          </div>
        </div>

        <!-- Inline Dialog for New CAPA -->
        <dialog id="dialog-new-capa" class="modal-dialog">
          <div class="modal-surface">
            <div class="modal-header">
              <h3 class="modal-title">Create Corrective Action Item</h3>
              <button type="button" class="btn-close-modal" id="btn-close-capa-modal">✕</button>
            </div>
            <form id="form-create-capa" class="mor-form">
              <div class="modal-body">
                <div class="form-group">
                  <label for="capa-incident-select">Target Aviation Occurrence *</label>
                  <select id="capa-incident-select" class="form-control" required>
                    ${incidents.map(i => `<option value="${i.id}">${i.id} - ${i.flightNumber}: ${i.title.slice(0, 50)}...</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label for="capa-title">Action Title & Remediation Scope *</label>
                  <input type="text" id="capa-title" class="form-control" placeholder="e.g. Recalibrate stall warning sensor thresholds..." required />
                </div>
                <div class="form-row-2">
                  <div class="form-group">
                    <label for="capa-assignee">Assigned Lead / Engineering Inspector *</label>
                    <input type="text" id="capa-assignee" class="form-control" placeholder="e.g. Dir. Flight Operations" required />
                  </div>
                  <div class="form-group">
                    <label for="capa-deadline">Target Completion Date *</label>
                    <input type="date" id="capa-deadline" class="form-control" required value="2026-11-15" />
                  </div>
                </div>
                <div class="form-row-2">
                  <div class="form-group">
                    <label for="capa-priority">Action Priority</label>
                    <select id="capa-priority" class="form-control">
                      <option value="High">High (Immediate Airworthiness)</option>
                      <option value="Medium" selected>Medium (Operational Procedure)</option>
                      <option value="Low">Low (Administrative)</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="capa-standard">Compliance Regulatory Standard</label>
                    <input type="text" id="capa-standard" class="form-control" placeholder="e.g. ICAO Doc 9859 / EASA CS-25" />
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-ghost" id="btn-cancel-capa">Cancel</button>
                <button type="submit" class="btn btn-primary">Save CAPA</button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    `;

    attachEvents(container);
  }

  function renderCapaCard(capa, currentStage) {
    return `
      <div class="capa-card priority-${(capa.priority || 'medium').toLowerCase()}" data-capa-id="${capa.id}" data-inc-id="${capa.incidentId}">
        <div class="capa-top">
          <span class="capa-id mono">${capa.id}</span>
          <span class="capa-priority-badge">${capa.priority || 'Normal'}</span>
        </div>

        <h5 class="capa-title">${capa.title}</h5>

        <div class="capa-inc-link">
          <span class="link-label">INCIDENT:</span>
          <span class="link-id mono" title="${capa.incidentTitle}">${capa.incidentId} (${capa.flightNumber})</span>
        </div>

        <div class="capa-meta">
          <div class="meta-row">
            <span class="meta-icon">👤</span>
            <span class="meta-val">${capa.assignee || 'Unassigned'}</span>
          </div>
          <div class="meta-row">
            <span class="meta-icon">📅</span>
            <span class="meta-val mono">Due: ${capa.deadline || '--'}</span>
          </div>
          ${capa.complianceStandard ? `
            <div class="meta-row">
              <span class="meta-icon">📜</span>
              <span class="meta-standard mono">${capa.complianceStandard}</span>
            </div>
          ` : ''}
        </div>

        <div class="capa-actions-strip">
          ${currentStage === 'Open' ? `
            <button class="btn btn-xs btn-primary btn-advance-capa" data-next="In Progress" data-capa-id="${capa.id}" data-inc-id="${capa.incidentId}">
              Start Work ➔
            </button>
          ` : ''}
          ${currentStage === 'In Progress' ? `
            <button class="btn btn-xs btn-ghost btn-advance-capa" data-next="Open" data-capa-id="${capa.id}" data-inc-id="${capa.incidentId}">
              ⇤ Revert
            </button>
            <button class="btn btn-xs btn-success btn-advance-capa" data-next="Closed & Verified" data-capa-id="${capa.id}" data-inc-id="${capa.incidentId}">
              Verify & Close ✓
            </button>
          ` : ''}
          ${currentStage === 'Closed' ? `
            <button class="btn btn-xs btn-ghost btn-advance-capa" data-next="In Progress" data-capa-id="${capa.id}" data-inc-id="${capa.incidentId}">
              Reopen Case ↺
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  function attachEvents(wrapper) {
    const dialog = wrapper.querySelector('#dialog-new-capa');
    const openBtn = wrapper.querySelector('#btn-open-create-capa');
    const closeBtn = wrapper.querySelector('#btn-close-capa-modal');
    const cancelBtn = wrapper.querySelector('#btn-cancel-capa');

    if (openBtn && dialog) {
      openBtn.addEventListener('click', () => dialog.showModal());
    }
    if (closeBtn && dialog) {
      closeBtn.addEventListener('click', () => dialog.close());
    }
    if (cancelBtn && dialog) {
      cancelBtn.addEventListener('click', () => dialog.close());
    }

    if (dialog) {
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) dialog.close();
      });
    }

    // Advance/revert status buttons
    wrapper.querySelectorAll('.btn-advance-capa').forEach(btn => {
      btn.addEventListener('click', () => {
        const incId = btn.getAttribute('data-inc-id');
        const capaId = btn.getAttribute('data-capa-id');
        const nextStatus = btn.getAttribute('data-next');
        appState.updateCapaStatus(incId, capaId, nextStatus);
        render();
      });
    });

    // Form submit
    const form = wrapper.querySelector('#form-create-capa');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const incId = wrapper.querySelector('#capa-incident-select').value;
        const title = wrapper.querySelector('#capa-title').value.trim();
        const assignee = wrapper.querySelector('#capa-assignee').value.trim();
        const deadline = wrapper.querySelector('#capa-deadline').value;
        const priority = wrapper.querySelector('#capa-priority').value;
        const complianceStandard = wrapper.querySelector('#capa-standard').value.trim();

        appState.addCapaAction(incId, {
          title,
          assignee,
          deadline,
          priority,
          complianceStandard
        });

        if (dialog) dialog.close();
        form.reset();
        render();
      });
    }
  }

  render();
  appState.subscribe('incidents:updated', render);
  appState.subscribe('capa:updated', render);
}
