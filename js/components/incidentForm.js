/**
 * SkyShield - Mandatory Occurrence Report (MOR) Filing Modal
 * Structured ICAO Annex 13/19 Compliant Flight Safety Submission
 */
import { appState } from '../state.js';
import { INCIDENT_CATEGORIES, FLIGHT_PHASES, RISK_MATRIX_CONFIG, AIRPORTS } from '../data.js';
import { saveIncidentToFirebase } from '../firebase.js';

export function initIncidentForm(dialogId = 'dialog-incident-form') {
  const dialog = document.getElementById(dialogId);
  if (!dialog) return;

  function render() {
    dialog.innerHTML = `
      <div class="modal-surface" role="document">
        <div class="modal-header">
          <div class="modal-header-titles">
            <span class="modal-badge">DGCA FORM CA-919 / CAR SECTION 5</span>
            <h3 class="modal-title">File Mandatory Occurrence Report (MOR)</h3>
            <p class="modal-subtitle">Confidential Civil Aviation Occurrence Submission • eGCA / AAIB Integrated</p>
          </div>
          <button type="button" class="btn-close-modal" id="btn-close-modal" aria-label="Close dialog">✕</button>
        </div>

        <form id="incident-submission-form" class="mor-form">
          <div class="modal-body">
            <!-- 1. Flight & Airframe Identification -->
            <div class="form-section">
              <h4 class="form-section-title">1. FLIGHT IDENTIFICATION & AIRFRAME (DGCA CAR SEC 5)</h4>
              <div class="form-row-3">
                <div class="form-group">
                  <label for="form-flight-number">Flight Number / Callsign *</label>
                  <input type="text" id="form-flight-number" class="form-control mono" placeholder="e.g. AI-102 or 6E-2041" required />
                </div>
                <div class="form-group">
                  <label for="form-aircraft-type">Aircraft Type *</label>
                  <select id="form-aircraft-type" class="form-control" required>
                    <option value="">Select Aircraft Model...</option>
                    <option value="Airbus A350-900">Airbus A350-900 (Air India)</option>
                    <option value="Airbus A321neo">Airbus A321neo (IndiGo / AI)</option>
                    <option value="Airbus A320neo">Airbus A320neo (IndiGo / Vistara / AI)</option>
                    <option value="Boeing 787-8/9 Dreamliner">Boeing 787-8/9 Dreamliner (Air India)</option>
                    <option value="Boeing 777-300ER">Boeing 777-300ER (Air India)</option>
                    <option value="Boeing 737 MAX 8">Boeing 737 MAX 8 (Akasa / AI Express)</option>
                    <option value="Boeing 737-800">Boeing 737-800 (SpiceJet)</option>
                    <option value="ATR 72-600">ATR 72-600 (IndiGo / Alliance Air)</option>
                    <option value="De Havilland Q400">De Havilland Q400 (SpiceJet)</option>
                    <option value="Dornier Do-228">Dornier Do-228 (Alliance Air)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="form-registration">Indian Tail Registration (VT-***) *</label>
                  <input type="text" id="form-registration" class="form-control mono" placeholder="e.g. VT-EXG" required pattern="^VT-[A-Z]{3}$" title="Format: VT-XXX" />
                </div>
              </div>

              <div class="form-row-3">
                <div class="form-group">
                  <label for="form-origin">Origin Aerodrome (ICAO) *</label>
                  <input type="text" id="form-origin" class="form-control mono" list="airports-datalist" placeholder="e.g. VIDP" required maxlength="4" />
                </div>
                <div class="form-group">
                  <label for="form-destination">Destination Aerodrome (ICAO) *</label>
                  <input type="text" id="form-destination" class="form-control mono" list="airports-datalist" placeholder="e.g. VABB" required maxlength="4" />
                </div>
                <div class="form-group">
                  <label for="form-operator">Airline / Operator *</label>
                  <select id="form-operator" class="form-control" required>
                    <option value="Air India">Air India</option>
                    <option value="IndiGo">IndiGo</option>
                    <option value="Air India Express">Air India Express</option>
                    <option value="Akasa Air">Akasa Air</option>
                    <option value="SpiceJet">SpiceJet</option>
                    <option value="Vistara">Vistara</option>
                    <option value="Alliance Air">Alliance Air</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 2. Operational Environment & Phase -->
            <div class="form-section">
              <h4 class="form-section-title">2. OPERATIONAL PARAMETERS & ATMOSPHERE</h4>
              <div class="form-row-3">
                <div class="form-group">
                  <label for="form-phase">Flight Phase *</label>
                  <select id="form-phase" class="form-control" required>
                    <option value="">Select Phase...</option>
                    ${FLIGHT_PHASES.map(p => `<option value="${p}">${p}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label for="form-altitude">Altitude / Flight Level</label>
                  <input type="text" id="form-altitude" class="form-control mono" placeholder="e.g. FL340 or 2,500 ft" />
                </div>
                <div class="form-group">
                  <label for="form-speed">Indicated Airspeed</label>
                  <input type="text" id="form-speed" class="form-control mono" placeholder="e.g. 290 kts / M0.82" />
                </div>
              </div>
              <div class="form-group">
                <label for="form-weather">Meteorological Conditions (METAR / Turbulence / IMC / VMC)</label>
                <input type="text" id="form-weather" class="form-control" placeholder="e.g. IMC in clouds, severe turbulence, wind 280@25G38kt" />
              </div>
            </div>

            <!-- 3. Classification & Risk Index -->
            <div class="form-section">
              <h4 class="form-section-title">3. HAZARD CLASSIFICATION & ICAO RISK MATRIX SCORE</h4>
              <div class="form-row-3">
                <div class="form-group">
                  <label for="form-category">Primary Occurrence Category *</label>
                  <select id="form-category" class="form-control" required>
                    <option value="">Select Category...</option>
                    ${INCIDENT_CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label for="form-severity">ICAO Severity (1 to 5) *</label>
                  <select id="form-severity" class="form-control" required>
                    <option value="5">5 - Catastrophic (Equipment loss / fatalities)</option>
                    <option value="4">4 - Hazardous (Serious injury / large safety reduction)</option>
                    <option value="3" selected>3 - Major (Significant reduction in safety margin)</option>
                    <option value="2">2 - Minor (Emergency SOP used, nuisance)</option>
                    <option value="1">1 - Negligible (Little operational consequence)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="form-likelihood">ICAO Likelihood (A to E) *</label>
                  <select id="form-likelihood" class="form-control" required>
                    <option value="A">A - Extremely Improbable (&lt; 10⁻⁹)</option>
                    <option value="B">B - Improbable (10⁻⁷ to 10⁻⁹)</option>
                    <option value="C" selected>C - Remote (10⁻⁵ to 10⁻⁷)</option>
                    <option value="D">D - Occasional (10⁻³ to 10⁻⁵)</option>
                    <option value="E">E - Frequent (&gt; 10⁻³)</option>
                  </select>
                </div>
              </div>

              <!-- Live Calculated Risk Preview -->
              <div class="risk-preview-box" id="form-risk-preview">
                <div class="rp-left">
                  <span class="rp-label">CALCULATED ICAO RISK INDEX:</span>
                  <span class="rp-code mono" id="rp-code">3C</span>
                </div>
                <div class="rp-right">
                  <span class="badge badge-tolerable" id="rp-badge">⚡ TOLERABLE (REVIEW REQUIRED)</span>
                </div>
              </div>
            </div>

            <!-- 4. Incident Narrative & Initial Action -->
            <div class="form-section">
              <h4 class="form-section-title">4. DESCRIPTIVE NARRATIVE & MITIGATION ACTIONS</h4>
              <div class="form-group">
                <label for="form-title">Occurrence Summary / Title *</label>
                <input type="text" id="form-title" class="form-control" placeholder="Concise title describing safety occurrence..." required />
              </div>
              <div class="form-group">
                <label for="form-narrative">Detailed Narrative of Sequence of Events *</label>
                <textarea id="form-narrative" class="form-control" rows="4" placeholder="Detail chronology of events, ATC communications, cockpit warnings, systems degraded, and immediate safety interventions..." required></textarea>
              </div>
              <div class="form-row-2">
                <div class="form-group">
                  <label for="form-reporter">Reported By / Crew Role *</label>
                  <input type="text" id="form-reporter" class="form-control" placeholder="e.g. Capt. Alex Mercer (Commander)" required />
                </div>
                <div class="form-group">
                  <label for="form-status">Initial Filing Status</label>
                  <select id="form-status" class="form-control">
                    <option value="Investigation Active">Investigation Active</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Root Cause Validated">Root Cause Validated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" id="btn-cancel-modal">Cancel</button>
            <button type="submit" class="btn btn-primary" id="btn-submit-incident">
              <span>✈ Submit & Launch RCA Workbench</span>
            </button>
          </div>
        </form>

        <datalist id="airports-datalist">
          ${AIRPORTS.map(a => `<option value="${a.code}">${a.name} (${a.city})</option>`).join('')}
        </datalist>
      </div>
    `;

    attachHandlers(dialog);
  }

  function updateRiskPreview(dialog) {
    const sev = dialog.querySelector('#form-severity').value;
    const lik = dialog.querySelector('#form-likelihood').value;
    const code = `${sev}${lik}`;
    const rating = RISK_MATRIX_CONFIG.ratings[code] || 'acceptable';

    const codeEl = dialog.querySelector('#rp-code');
    const badgeEl = dialog.querySelector('#rp-badge');

    if (codeEl && badgeEl) {
      codeEl.textContent = code;
      badgeEl.className = `badge badge-${rating}`;

      if (rating === 'intolerable') {
        badgeEl.textContent = '⚠️ INTOLERABLE (HIGH RISK - STOP OPERATION)';
      } else if (rating === 'tolerable') {
        badgeEl.textContent = '⚡ TOLERABLE (REVIEW / MITIGATION REQUIRED)';
      } else {
        badgeEl.textContent = '✓ ACCEPTABLE (ROUTINE MONITORING)';
      }
    }
  }

  function attachHandlers(dialog) {
    const closeBtn = dialog.querySelector('#btn-close-modal');
    const cancelBtn = dialog.querySelector('#btn-cancel-modal');

    const closeModal = () => dialog.close();
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    // Light dismiss on backdrop click
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        dialog.close();
      }
    });

    // Update risk preview on change
    const sevSelect = dialog.querySelector('#form-severity');
    const likSelect = dialog.querySelector('#form-likelihood');
    if (sevSelect && likSelect) {
      sevSelect.addEventListener('change', () => updateRiskPreview(dialog));
      likSelect.addEventListener('change', () => updateRiskPreview(dialog));
    }

    // Submit handler
    const form = dialog.querySelector('#incident-submission-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const flightNum = dialog.querySelector('#form-flight-number').value.trim();
        const aircraftType = dialog.querySelector('#form-aircraft-type').value;
        const registration = dialog.querySelector('#form-registration').value.trim();
        const origin = dialog.querySelector('#form-origin').value.trim().toUpperCase();
        const destination = dialog.querySelector('#form-destination').value.trim().toUpperCase();
        const airline = dialog.querySelector('#form-operator').value.trim();
        const phase = dialog.querySelector('#form-phase').value;
        const altitude = dialog.querySelector('#form-altitude').value.trim();
        const speed = dialog.querySelector('#form-speed').value.trim();
        const weather = dialog.querySelector('#form-weather').value.trim();
        const category = dialog.querySelector('#form-category').value;
        const severity = Number(dialog.querySelector('#form-severity').value);
        const likelihood = dialog.querySelector('#form-likelihood').value;
        const title = dialog.querySelector('#form-title').value.trim();
        const narrative = dialog.querySelector('#form-narrative').value.trim();
        const reportedBy = dialog.querySelector('#form-reporter').value.trim();
        const status = dialog.querySelector('#form-status').value;

        const code = `${severity}${likelihood}`;
        const riskRating = RISK_MATRIX_CONFIG.ratings[code] || 'acceptable';

        const newIncident = appState.addIncident({
          title,
          flightNumber: flightNum,
          airline,
          aircraftType,
          registration,
          origin,
          destination,
          phase,
          altitude,
          speed,
          weather,
          category,
          severity,
          likelihood,
          riskRating,
          status,
          reportedBy,
          narrative
        });

        // Asynchronously synchronize with Cloud Firestore
        saveIncidentToFirebase(newIncident).then(res => {
          if (res.success) {
            console.log(`[CLOUD SYNC] Incident ${newIncident.id} committed to Firebase.`);
          }
        }).catch(err => {
          console.warn('[CLOUD SYNC] Firebase sync deferred:', err.message);
        });

        dialog.close();
        form.reset();

        // Switch to RCA Workbench directly
        appState.setActiveTab('workbench');
      });
    }
  }

  render();
}
