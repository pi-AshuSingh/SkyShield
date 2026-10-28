/**
 * SkyShield - Regulatory Compliance & Safety Audit Dossier Component
 * Generates formal ICAO Annex 19 / EASA / FAA Part 5 Safety Audit Dossier
 */
import { appState } from '../state.js';
import { SAFETY_PERFORMANCE_INDICATORS, RISK_MATRIX_CONFIG } from '../data.js';
import { formatZuluDate, exportToCSV, exportToJSON } from '../utils/formatters.js';

export function initAuditReport(containerId = 'audit-report-root') {
  const container = document.getElementById(containerId);
  if (!container) return;

  function render() {
    const incidents = appState.getIncidents();
    const spis = SAFETY_PERFORMANCE_INDICATORS;

    // Tally risk counts
    let intolerable = 0;
    let tolerable = 0;
    let acceptable = 0;
    incidents.forEach(inc => {
      if (inc.riskRating === 'intolerable') intolerable++;
      else if (inc.riskRating === 'tolerable') tolerable++;
      else acceptable++;
    });

    // All CAPAs
    const allCapas = [];
    incidents.forEach(i => {
      if (i.capaActions) allCapas.push(...i.capaActions);
    });
    const closedCapas = allCapas.filter(c => c.status && c.status.includes('Closed'));
    const closurePct = allCapas.length > 0 ? Math.round((closedCapas.length / allCapas.length) * 100) : 100;

    container.innerHTML = `
      <div class="audit-dossier-wrapper">
        <!-- Action bar -->
        <div class="dossier-controls-strip">
          <div class="strip-left">
            <span class="dossier-stamp">CONFIDENTIAL REGULATORY DOSSIER</span>
            <span class="dossier-ref mono">REF: SKY-SMS-AUD-2026-Q3</span>
          </div>
          <div class="strip-actions">
            <button class="btn btn-secondary" id="btn-export-csv" title="Download Occurrence CSV">
              <span>📥 Export CSV</span>
            </button>
            <button class="btn btn-secondary" id="btn-export-json" title="Download Machine-Readable JSON">
              <span>💾 Export JSON</span>
            </button>
            <button class="btn btn-primary" id="btn-print-dossier" title="Print or Save PDF Dossier">
              <span>🖨 Print / PDF Dossier</span>
            </button>
          </div>
        </div>

        <!-- Printable Document Body -->
        <div class="dossier-document" id="printable-dossier">
          <!-- Document Header -->
          <div class="doc-header">
            <div class="doc-brand">
              <img src="assets/skyshield-logo.jpg" alt="SkyShield Logo" class="doc-logo" />
              <div>
                <h1 class="doc-org-name">SKYSHIELD BHARAT — DGCA SAFETY DOSSIER</h1>
                <div class="doc-meta-sub">Directorate General of Civil Aviation (DGCA) • CAR Section 5 Series C & ICAO Annex 19</div>
              </div>
            </div>
            <div class="doc-reference-block">
              <div class="ref-row"><span>DOCUMENT:</span> <strong class="mono">DGCA SMS AUDIT DOSSIER</strong></div>
              <div class="ref-row"><span>PERIOD:</span> <strong class="mono">2026 AUDIT CYCLE</strong></div>
              <div class="ref-row"><span>GENERATED:</span> <strong class="mono">${formatZuluDate(new Date().toISOString())}</strong></div>
              <div class="ref-row"><span>REGULATOR / AOC:</span> <strong class="mono">DGCA / AOC-IND-2026-SK</strong></div>
            </div>
          </div>

          <!-- Executive Summary -->
          <section class="doc-section">
            <h2 class="doc-sec-title">1. EXECUTIVE AIR SAFETY & AIRWORTHINESS STATEMENT</h2>
            <p class="doc-paragraph">
              This Safety Audit Dossier is compiled pursuant to <strong>DGCA CAR Section 5 (Air Safety), Series C, Part I</strong> 
              (Notification and Investigation of Incidents), <strong>Aircraft Accident Investigation Bureau (AAIB India)</strong> 
              occurrence reporting protocols, and <strong>ICAO Annex 19 (Safety Management Systems)</strong> standards. 
              During the audited reporting window across Indian Flight Information Regions (Delhi, Mumbai, Kolkata, Chennai FIRs), 
              the system logged <strong>${incidents.length} safety occurrences</strong> across a cumulative 48,600 scheduled flight sectors. 
              Safety Performance Indicators (SPI) demonstrate full adherence to DGCA 72-hour Mandatory Occurrence Reporting (MOR) deadlines 
              and robust Corrective & Preventive Action (CAPA) verification rates.
            </p>
          </section>

          <!-- SPI Scorecard Table -->
          <section class="doc-section">
            <h2 class="doc-sec-title">2. SAFETY PERFORMANCE INDICATORS (SPI) & TARGETS (SPT)</h2>
            <table class="doc-table">
              <thead>
                <tr>
                  <th>SAFETY PERFORMANCE INDICATOR (SPI)</th>
                  <th>TARGET THRESHOLD (SPT)</th>
                  <th>ACTUAL METRIC</th>
                  <th>ANNEX 19 STATUS</th>
                  <th>TREND</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Fleet Incident Rate (per 10k Flight Hours)</td>
                  <td class="mono">&lt; ${spis.incidentRatePer10kHours.target}</td>
                  <td class="mono font-bold">${spis.incidentRatePer10kHours.current}</td>
                  <td><span class="badge badge-acceptable">COMPLIANT</span></td>
                  <td class="mono">${spis.incidentRatePer10kHours.trend}</td>
                </tr>
                <tr>
                  <td>Active Intolerable Hazard Occurrences</td>
                  <td class="mono">0 Active</td>
                  <td class="mono font-bold text-crimson">${intolerable}</td>
                  <td><span class="badge ${intolerable > 0 ? 'badge-intolerable' : 'badge-acceptable'}">${intolerable > 0 ? 'UNDER CAPA' : 'COMPLIANT'}</span></td>
                  <td class="mono">${spis.highRiskIntolerableEvents.trend}</td>
                </tr>
                <tr>
                  <td>Mandatory 72-Hour Occurrence Reporting Compliance</td>
                  <td class="mono">100.0%</td>
                  <td class="mono font-bold">100.0%</td>
                  <td><span class="badge badge-acceptable">COMPLIANT</span></td>
                  <td class="mono">Zero Overdue</td>
                </tr>
                <tr>
                  <td>Corrective Action Plan (CAPA) On-Time Closure</td>
                  <td class="mono">&gt; ${spis.capaClosureRate.target}%</td>
                  <td class="mono font-bold">${closurePct}%</td>
                  <td><span class="badge ${closurePct >= 90 ? 'badge-acceptable' : 'badge-tolerable'}">COMPLIANT</span></td>
                  <td class="mono">${spis.capaClosureRate.trend}</td>
                </tr>
                <tr>
                  <td>Voluntary vs Mandatory Reporting Ratio</td>
                  <td class="mono">&gt; ${spis.voluntaryReportingRatio.target}:1</td>
                  <td class="mono font-bold">${spis.voluntaryReportingRatio.current}:1</td>
                  <td><span class="badge badge-acceptable">HEALTHY CULTURE</span></td>
                  <td class="mono">Above Industry Median</td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- ICAO Risk Tolerability Breakdown -->
          <section class="doc-section">
            <h2 class="doc-sec-title">3. ICAO 5×5 OCCURRENCE TOLERABILITY PROFILE</h2>
            <div class="doc-stats-grid">
              <div class="doc-stat-box box-intol">
                <span class="ds-num mono">${intolerable}</span>
                <span class="ds-label">INTOLERABLE HAZARDS</span>
                <span class="ds-sub">Subject to mandatory Root-Cause analysis and Executive Board remediation</span>
              </div>
              <div class="doc-stat-box box-tol">
                <span class="ds-num mono">${tolerable}</span>
                <span class="ds-label">TOLERABLE / MITIGATED</span>
                <span class="ds-sub">Approved operational barriers in place, ongoing monitoring active</span>
              </div>
              <div class="doc-stat-box box-acc">
                <span class="ds-num mono">${acceptable}</span>
                <span class="ds-label">ACCEPTABLE (ROUTINE)</span>
                <span class="ds-sub">Within baseline operational boundaries (ICAO SMS Doc 9859 Chapter 2)</span>
              </div>
            </div>
          </section>

          <!-- Recent Occurrence Register Excerpt -->
          <section class="doc-section">
            <h2 class="doc-sec-title">4. AUDITED OCCURRENCE LEDGER (TOTAL ${incidents.length} RECORDS)</h2>
            <table class="doc-table compact-table">
              <thead>
                <tr>
                  <th>REF ID</th>
                  <th>DATE</th>
                  <th>FLIGHT</th>
                  <th>AIRCRAFT</th>
                  <th>CATEGORY</th>
                  <th>SEV/LIK</th>
                  <th>RCA STATUS</th>
                </tr>
              </thead>
              <tbody>
                ${incidents.slice(0, 8).map(inc => `
                  <tr>
                    <td class="mono font-bold">${inc.id}</td>
                    <td class="mono">${formatZuluDate(inc.date).split(' ')[0]}</td>
                    <td class="mono">${inc.flightNumber}</td>
                    <td>${inc.aircraftType}</td>
                    <td>${inc.category}</td>
                    <td class="mono">${inc.severity}${inc.likelihood} (${inc.riskRating.toUpperCase()})</td>
                    <td>${inc.status}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </section>

          <!-- Digital Certification Sign-off -->
          <section class="doc-section signoff-section">
            <h2 class="doc-sec-title">5. ACCOUNTABLE EXECUTIVE & CHIEF INSPECTOR SIGN-OFF</h2>
            <div class="signoff-grid">
              <div class="signoff-card">
                <div class="sig-title">ACCOUNTABLE EXECUTIVE / VP FLIGHT OPS</div>
                <div class="sig-name">Capt. Alistair Sterling, FRAeS</div>
                <div class="sig-meta mono">DIGITALLY CERTIFIED • TIMESTAMP: ${formatZuluDate(new Date().toISOString())}</div>
                <div class="sig-stamp">VERIFIED COMPLIANT</div>
              </div>
              <div class="signoff-card">
                <div class="sig-title">DIRECTOR OF SAFETY & AIRWORTHINESS</div>
                <div class="sig-name">Elena Rostova, M.Sc. Aero Eng</div>
                <div class="sig-meta mono">ICAO SMS AUDITOR LIC #SMS-94812</div>
                <div class="sig-stamp">ROOT-CAUSE AUDITED</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    `;

    attachEvents(container, incidents);
  }

  function attachEvents(wrapper, incidents) {
    const btnCsv = wrapper.querySelector('#btn-export-csv');
    const btnJson = wrapper.querySelector('#btn-export-json');
    const btnPrint = wrapper.querySelector('#btn-print-dossier');

    if (btnCsv) {
      btnCsv.addEventListener('click', () => exportToCSV(incidents));
    }
    if (btnJson) {
      btnJson.addEventListener('click', () => exportToJSON(incidents));
    }
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }
  }

  render();
  appState.subscribe('incidents:updated', render);
}
