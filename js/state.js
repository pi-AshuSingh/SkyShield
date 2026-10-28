/**
 * SkyShield - Global Application State Manager
 * Reactive pub/sub state with localStorage persistence
 */
import { INITIAL_INCIDENTS, SAFETY_PERFORMANCE_INDICATORS } from './data.js';

const STORAGE_KEY = 'skyshield_incidents_v1';

class StateManager {
  constructor() {
    this.subscribers = new Map();
    this.incidents = this.loadIncidents();
    this.selectedIncidentId = this.incidents.length > 0 ? this.incidents[0].id : null;
    this.filters = {
      search: '',
      category: 'ALL',
      phase: 'ALL',
      severity: 'ALL',
      matrixCell: null, // e.g., '4C'
      status: 'ALL'
    };
    this.activeTab = 'dashboard'; // 'dashboard' | 'workbench' | 'incidents' | 'capa' | 'compliance'
  }

  loadIncidents() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load from localStorage, using initial dataset:', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_INCIDENTS));
  }

  saveIncidents() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.incidents));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event).add(callback);
    return () => this.subscribers.get(event).delete(callback);
  }

  emit(event, payload) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).forEach(cb => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`Error in subscriber for event ${event}:`, err);
        }
      });
    }
  }

  getIncidents() {
    return this.incidents;
  }

  getFilteredIncidents() {
    return this.incidents.filter(inc => {
      // Search text filter
      if (this.filters.search) {
        const query = this.filters.search.toLowerCase();
        const matchesQuery =
          inc.id.toLowerCase().includes(query) ||
          inc.title.toLowerCase().includes(query) ||
          inc.flightNumber.toLowerCase().includes(query) ||
          inc.aircraftType.toLowerCase().includes(query) ||
          (inc.origin && inc.origin.toLowerCase().includes(query)) ||
          (inc.destination && inc.destination.toLowerCase().includes(query)) ||
          inc.narrative.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Category filter
      if (this.filters.category !== 'ALL' && inc.category !== this.filters.category) {
        return false;
      }

      // Phase filter
      if (this.filters.phase !== 'ALL' && inc.phase !== this.filters.phase) {
        return false;
      }

      // Severity filter
      if (this.filters.severity !== 'ALL' && String(inc.severity) !== String(this.filters.severity)) {
        return false;
      }

      // Risk Matrix Cell (e.g. '4C')
      if (this.filters.matrixCell) {
        const cellCode = `${inc.severity}${inc.likelihood}`;
        if (cellCode !== this.filters.matrixCell) {
          return false;
        }
      }

      // Status filter
      if (this.filters.status !== 'ALL' && inc.status !== this.filters.status) {
        return false;
      }

      return true;
    });
  }

  getSelectedIncident() {
    return this.incidents.find(inc => inc.id === this.selectedIncidentId) || this.incidents[0] || null;
  }

  setSelectedIncident(id) {
    this.selectedIncidentId = id;
    this.emit('incident:selected', this.getSelectedIncident());
  }

  setFilters(newFilters) {
    this.filters = { ...this.filters, ...newFilters };
    this.emit('filters:changed', this.filters);
  }

  clearMatrixCellFilter() {
    this.filters.matrixCell = null;
    this.emit('filters:changed', this.filters);
  }

  setActiveTab(tabName) {
    this.activeTab = tabName;
    this.emit('tab:changed', tabName);
  }

  addIncident(incidentData) {
    // Generate incident ID if not provided
    const year = new Date().getFullYear();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newIncident = {
      id: incidentData.id || `INC-${year}-${randNum}`,
      date: incidentData.date || new Date().toISOString(),
      status: incidentData.status || 'Under Investigation',
      ...incidentData,
      rootCauseAnalysis: incidentData.rootCauseAnalysis || {
        fiveWhys: [
          { level: 1, question: 'Direct causal event:', answer: incidentData.narrative ? incidentData.narrative.slice(0, 100) + '...' : 'Incident occurred during flight operations.' }
        ],
        hfacsTags: [],
        bowTie: {
          threats: [{ name: 'Operational flight hazard', status: 'Active' }],
          preventionBarriers: [{ name: 'Standard Flight Deck Monitoring', status: 'Degraded', note: 'Under investigation' }],
          topEvent: incidentData.title || 'Reported Flight Occurrence',
          mitigationBarriers: [{ name: 'Crew SOP Execution', status: 'Effective', note: 'Aviation emergency checklist' }],
          consequences: [{ name: 'Flight Interruption', status: 'Mitigated' }]
        }
      },
      capaActions: incidentData.capaActions || []
    };

    this.incidents.unshift(newIncident);
    this.saveIncidents();
    this.setSelectedIncident(newIncident.id);
    this.emit('incidents:updated', this.incidents);
    return newIncident;
  }

  updateIncident(id, updates) {
    const idx = this.incidents.findIndex(inc => inc.id === id);
    if (idx !== -1) {
      this.incidents[idx] = { ...this.incidents[idx], ...updates };
      this.saveIncidents();
      this.emit('incidents:updated', this.incidents);
      if (this.selectedIncidentId === id) {
        this.emit('incident:selected', this.incidents[idx]);
      }
      return this.incidents[idx];
    }
    return null;
  }

  deleteIncident(id) {
    this.incidents = this.incidents.filter(inc => inc.id !== id);
    if (this.selectedIncidentId === id) {
      this.selectedIncidentId = this.incidents.length > 0 ? this.incidents[0].id : null;
    }
    this.saveIncidents();
    this.emit('incidents:updated', this.incidents);
    this.emit('incident:selected', this.getSelectedIncident());
  }

  // 5-Whys Helper
  updateFiveWhys(incidentId, fiveWhys) {
    const inc = this.incidents.find(i => i.id === incidentId);
    if (inc) {
      if (!inc.rootCauseAnalysis) inc.rootCauseAnalysis = {};
      inc.rootCauseAnalysis.fiveWhys = fiveWhys;
      this.saveIncidents();
      this.emit('rca:updated', inc);
      this.emit('incidents:updated', this.incidents);
    }
  }

  // HFACS Tags Helper
  toggleHfacsTag(incidentId, tagId) {
    const inc = this.incidents.find(i => i.id === incidentId);
    if (inc) {
      if (!inc.rootCauseAnalysis) inc.rootCauseAnalysis = {};
      if (!inc.rootCauseAnalysis.hfacsTags) inc.rootCauseAnalysis.hfacsTags = [];

      const idx = inc.rootCauseAnalysis.hfacsTags.indexOf(tagId);
      if (idx > -1) {
        inc.rootCauseAnalysis.hfacsTags.splice(idx, 1);
      } else {
        inc.rootCauseAnalysis.hfacsTags.push(tagId);
      }
      this.saveIncidents();
      this.emit('rca:updated', inc);
      this.emit('incidents:updated', this.incidents);
    }
  }

  // Bow-Tie Barrier Status Toggle Helper
  updateBowTieItem(incidentId, section, itemIndex, newStatus) {
    const inc = this.incidents.find(i => i.id === incidentId);
    if (inc && inc.rootCauseAnalysis && inc.rootCauseAnalysis.bowTie) {
      const targetList = inc.rootCauseAnalysis.bowTie[section];
      if (Array.isArray(targetList) && targetList[itemIndex]) {
        targetList[itemIndex].status = newStatus;
        this.saveIncidents();
        this.emit('rca:updated', inc);
      }
    }
  }

  // CAPA Helper
  addCapaAction(incidentId, capaItem) {
    const inc = this.incidents.find(i => i.id === incidentId);
    if (inc) {
      if (!inc.capaActions) inc.capaActions = [];
      const capaId = `CAPA-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      const newAction = {
        id: capaId,
        status: 'Open',
        ...capaItem
      };
      inc.capaActions.push(newAction);
      this.saveIncidents();
      this.emit('capa:updated', inc);
      this.emit('incidents:updated', this.incidents);
      return newAction;
    }
    return null;
  }

  updateCapaStatus(incidentId, capaId, newStatus) {
    const inc = this.incidents.find(i => i.id === incidentId);
    if (inc && inc.capaActions) {
      const action = inc.capaActions.find(a => a.id === capaId);
      if (action) {
        action.status = newStatus;
        this.saveIncidents();
        this.emit('capa:updated', inc);
        this.emit('incidents:updated', this.incidents);
      }
    }
  }

  resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    this.incidents = JSON.parse(JSON.stringify(INITIAL_INCIDENTS));
    this.selectedIncidentId = this.incidents[0].id;
    this.filters = { search: '', category: 'ALL', phase: 'ALL', severity: 'ALL', matrixCell: null, status: 'ALL' };
    this.saveIncidents();
    this.emit('incidents:updated', this.incidents);
    this.emit('incident:selected', this.getSelectedIncident());
    this.emit('filters:changed', this.filters);
  }
}

export const appState = new StateManager();
