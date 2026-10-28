/**
 * SkyShield Bharat — Cloud Firestore Integration Module
 * Real-time synchronization for DGCA Occurrence Reports & Root-Cause Analysis
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  limit 
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// Active Firebase Project Configuration (SkyShield Bharat)
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDDiH4IFtefAvQbtkkuetU1dIxXo0xmH4c",
  authDomain: "skyshield-bharat-sms.firebaseapp.com",
  projectId: "skyshield-bharat-sms",
  storageBucket: "skyshield-bharat-sms.firebasestorage.app",
  messagingSenderId: "747111494850",
  appId: "1:747111494850:web:bc141cfb405f330cc8f75b"
};

let app = null;
let db = null;
let isInitialized = false;

/**
 * Initializes the Firebase Application and Firestore Database instance.
 */
export function initFirebase() {
  if (isInitialized && db) return db;
  try {
    app = initializeApp(FIREBASE_CONFIG);
    db = getFirestore(app);
    isInitialized = true;
    console.log("🔥 Firebase initialized: Connected to project", FIREBASE_CONFIG.projectId);
    return db;
  } catch (err) {
    console.warn("⚠️ Firebase initialization warning:", err.message);
    return null;
  }
}

/**
 * Saves a single incident to the 'incidents' collection in Cloud Firestore.
 * @param {Object} incident Incident object conforming to DGCA CA-919 schema
 */
export async function saveIncidentToFirebase(incident) {
  const firestore = initFirebase();
  if (!firestore) return { success: false, error: 'Firebase not initialized' };

  try {
    const docId = incident.id || incident.incident_id || `DGCA-2026-${Date.now()}`;
    const docRef = doc(firestore, 'incidents', docId);

    // Sanitize document fields for Firestore
    const payload = {
      incident_id: docId,
      reported_at: incident.date || incident.reported_at || new Date().toISOString(),
      flight_number: incident.flightNumber || incident.flight_number || 'N/A',
      airline: incident.airline || 'N/A',
      aircraft_type: incident.aircraftType || incident.aircraft_type || 'N/A',
      registration: incident.registration || 'VT-XXX',
      origin_icao: incident.origin || incident.origin_icao || 'VIDP',
      dest_icao: incident.destination || incident.dest_icao || 'VABB',
      flight_phase: incident.phase || incident.flight_phase || 'En-Route',
      altitude_ft: Number(incident.altitude) || Number(incident.altitude_ft) || 0,
      airspeed_kts: Number(incident.speed) || Number(incident.airspeed_kts) || 0,
      peak_g_force: Number(incident.peak_g_force) || 1.0,
      weather: incident.weather || 'Standard CAVOK',
      category: incident.category || 'General Operational Safety',
      severity: Number(incident.severity) || 3,
      likelihood: incident.likelihood || 'C',
      risk_rating: incident.riskRating || incident.risk_rating || 'tolerable',
      narrative: incident.narrative || incident.title || '',
      hfacs_tier: incident.hfacs_tier || (incident.rootCauseAnalysis && incident.rootCauseAnalysis.hfacsTags ? 'Level 2: Preconditions' : 'Level 1: Unsafe Acts'),
      hfacs_code: incident.hfacs_code || (incident.rootCauseAnalysis && incident.rootCauseAnalysis.hfacsTags ? incident.rootCauseAnalysis.hfacsTags[0] : 'UA-DEC'),
      five_whys_json: typeof incident.five_whys_json === 'string' 
        ? incident.five_whys_json 
        : JSON.stringify(incident.rootCauseAnalysis ? incident.rootCauseAnalysis.fiveWhys : []),
      status: incident.status || 'Reported to DGCA',
      synced_at: new Date().toISOString()
    };

    await setDoc(docRef, payload, { merge: true });
    console.log(`[FIREBASE] Incident ${docId} synced successfully to Cloud Firestore.`);
    return { success: true, docId };
  } catch (err) {
    console.error("[FIREBASE] Error saving incident to Firestore:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Loads recent incidents from Cloud Firestore.
 * @param {number} maxResults Maximum number of records to fetch
 */
export async function fetchIncidentsFromFirebase(maxResults = 100) {
  const firestore = initFirebase();
  if (!firestore) return [];

  try {
    const q = query(collection(firestore, 'incidents'), limit(maxResults));
    const snapshot = await getDocs(q);
    const incidents = [];
    snapshot.forEach(docSnap => {
      incidents.push({ id: docSnap.id, ...docSnap.data() });
    });
    console.log(`[FIREBASE] Fetched ${incidents.length} incidents from Cloud Firestore.`);
    return incidents;
  } catch (err) {
    console.error("[FIREBASE] Error fetching incidents:", err);
    return [];
  }
}

/**
 * Subscribes to real-time incident updates from Cloud Firestore.
 * @param {Function} callback Called with updated incidents array whenever Firestore changes
 */
export function subscribeToRealtimeIncidents(callback) {
  const firestore = initFirebase();
  if (!firestore) return () => {};

  try {
    const q = query(collection(firestore, 'incidents'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const records = [];
      snapshot.forEach(d => records.push({ id: d.id, ...d.data() }));
      console.log(`[FIREBASE REALTIME] Received ${records.length} records.`);
      if (typeof callback === 'function') callback(records);
    }, (err) => {
      console.warn("[FIREBASE REALTIME] Listener error:", err.message);
    });
    return unsubscribe;
  } catch (err) {
    console.error("[FIREBASE REALTIME] Setup failed:", err);
    return () => {};
  }
}

/**
 * Batch synchronizes an array of incidents into Firestore with progress callbacks.
 */
export async function batchSyncToFirebase(incidentsList, onProgress) {
  const firestore = initFirebase();
  if (!firestore) throw new Error("Firebase is not initialized");

  let uploaded = 0;
  const total = incidentsList.length;

  for (const item of incidentsList) {
    await saveIncidentToFirebase(item);
    uploaded++;
    if (onProgress) onProgress(uploaded, total);
  }

  return { success: true, uploaded, total };
}
