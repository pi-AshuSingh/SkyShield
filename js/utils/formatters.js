/**
 * SkyShield - Formatting & Export Utilities
 */

export function formatZuluDate(isoString) {
  if (!isoString) return '--';
  const d = new Date(isoString);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  const hours = String(d.getUTCHours()).padStart(2, '0');
  const mins = String(d.getUTCMinutes()).padStart(2, '0');
  return `${day} ${month} ${year} ${hours}:${mins}Z`;
}

export function formatTimeAgo(isoString) {
  if (!isoString) return '';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function getRiskLevelBadge(rating) {
  switch (rating) {
    case 'intolerable':
      return { class: 'badge-intolerable', label: 'INTOLERABLE', icon: '⚠️' };
    case 'tolerable':
      return { class: 'badge-tolerable', label: 'TOLERABLE', icon: '⚡' };
    case 'acceptable':
    default:
      return { class: 'badge-acceptable', label: 'ACCEPTABLE', icon: '✓' };
  }
}

export function getSeverityBadge(severity) {
  switch (Number(severity)) {
    case 5:
      return { class: 'sev-5', label: 'Catastrophic (5)', color: '#ef4444' };
    case 4:
      return { class: 'sev-4', label: 'Hazardous (4)', color: '#f97316' };
    case 3:
      return { class: 'sev-3', label: 'Major (3)', color: '#eab308' };
    case 2:
      return { class: 'sev-2', label: 'Minor (2)', color: '#3b82f6' };
    case 1:
    default:
      return { class: 'sev-1', label: 'Negligible (1)', color: '#10b981' };
  }
}

export function exportToCSV(incidents) {
  const headers = ['ID', 'Date (UTC)', 'Flight No', 'Aircraft', 'Origin', 'Destination', 'Category', 'Phase', 'Severity', 'Likelihood', 'Risk Rating', 'Status', 'Title'];
  const rows = incidents.map(inc => [
    `"${inc.id}"`,
    `"${formatZuluDate(inc.date)}"`,
    `"${inc.flightNumber}"`,
    `"${inc.aircraftType}"`,
    `"${inc.origin || ''}"`,
    `"${inc.destination || ''}"`,
    `"${inc.category}"`,
    `"${inc.phase}"`,
    `"${inc.severity}"`,
    `"${inc.likelihood}"`,
    `"${inc.riskRating}"`,
    `"${inc.status}"`,
    `"${(inc.title || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SkyShield_Incident_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(incidents) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(incidents, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `SkyShield_Audit_Dossier_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
