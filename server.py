#!/usr/bin/env python3
"""
SkyShield Bharat — National Aviation Safety & Airworthiness Intelligence System (NASIS)
Production Full-Stack Python Backend (FastAPI + SQLite3)
Provides RESTful APIs for Incident Logging (Form CA-919), ICAO 5x5 Risk Matrix,
HFACS Human-Factors Classification, and 5-Whys Root-Cause Analysis.
"""

import json
import sqlite3
from typing import Optional, List, Dict, Any
from datetime import datetime

from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

DB_PATH = "skyshield_sms.db"

app = FastAPI(
    title="SkyShield Bharat API — Aviation Safety Management System",
    description="Full-Stack Python REST API compliant with DGCA CAR Section 5 Series C Part I & ICAO Annex 19",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# ----------------- PYDANTIC SCHEMAS (DATA VALIDATION) -----------------

class FiveWhysStep(BaseModel):
    step: int = Field(..., ge=1, le=5)
    q: str = Field(..., min_length=5)
    a: str = Field(..., min_length=5)

class IncidentCreateSchema(BaseModel):
    flight_number: str = Field(..., example="AI-102")
    airline: str = Field(..., example="Air India")
    aircraft_type: str = Field(..., example="Boeing 787-8/9")
    registration: str = Field(..., pattern=r"^VT-[A-Z]{3}$", example="VT-EXG")
    origin_icao: str = Field(..., min_length=4, max_length=4, example="VIDP")
    dest_icao: str = Field(..., min_length=4, max_length=4, example="VABB")
    flight_phase: str = Field(..., example="Terminal Approach / Localizer")
    altitude_ft: int = Field(..., ge=0, le=43000, example=1200)
    airspeed_kts: int = Field(..., ge=0, le=540, example=142)
    peak_g_force: float = Field(..., ge=-1.40, le=3.60, example=2.41)
    weather: str = Field(..., example="Severe Monsoon squall, crosswind gusting 34 kts")
    category: str = Field(..., example="Severe Monsoon Convective Weather / Cloudburst Squall")
    severity: int = Field(..., ge=1, le=5, example=4)
    likelihood: str = Field(..., pattern=r"^[A-E]$", example="C")
    narrative: str = Field(..., min_length=20, example="Aircraft encountered microburst downdraft on final approach to Runway 27 at Mumbai.")
    hfacs_tier: Optional[str] = "Level 2: Preconditions"
    hfacs_code: Optional[str] = "PRE-ENV-PHY"
    hfacs_name: Optional[str] = "Physical Environment (Convective Windshear)"

class CAPAUpdateSchema(BaseModel):
    capa_action: str = Field(..., min_length=5)
    capa_status: str = Field(..., example="In Progress")
    status: Optional[str] = "CAPA Assigned"

# ----------------- ICAO 5x5 RISK EVALUATION ENGINE -----------------

ICAO_RISK_RATINGS = {
    (5, 'A'): 'intolerable', (5, 'B'): 'intolerable', (5, 'C'): 'intolerable', (5, 'D'): 'intolerable', (5, 'E'): 'intolerable',
    (4, 'A'): 'tolerable',   (4, 'B'): 'intolerable', (4, 'C'): 'intolerable', (4, 'D'): 'intolerable', (4, 'E'): 'intolerable',
    (3, 'A'): 'acceptable',  (3, 'B'): 'tolerable',   (3, 'C'): 'tolerable',   (3, 'D'): 'intolerable', (3, 'E'): 'intolerable',
    (2, 'A'): 'acceptable',  (2, 'B'): 'acceptable',  (2, 'C'): 'tolerable',   (2, 'D'): 'tolerable',   (2, 'E'): 'tolerable',
    (1, 'A'): 'acceptable',  (1, 'B'): 'acceptable',  (1, 'C'): 'acceptable',  (1, 'D'): 'acceptable',  (1, 'E'): 'tolerable'
}

# ----------------- REST API ENDPOINTS -----------------

@app.get("/api/health", tags=["System"])
def health_check():
    """System health check and database connectivity probe."""
    try:
        conn = get_db()
        count = conn.execute("SELECT COUNT(*) FROM incidents").fetchone()[0]
        conn.close()
        return {
            "status": "healthy",
            "system": "SkyShield Bharat FSD Backend",
            "framework": "FastAPI (Python 3.10+)",
            "database": "SQLite (skyshield_sms.db)",
            "records_indexed": count,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/incidents", tags=["Incidents"])
def list_incidents(
    search: Optional[str] = None,
    category: Optional[str] = None,
    phase: Optional[str] = None,
    severity: Optional[int] = None,
    risk_rating: Optional[str] = None,
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0)
):
    """Retrieve filtered, paginated list of safety incidents."""
    conn = get_db()
    query = "SELECT * FROM incidents WHERE 1=1"
    params = []

    if search:
        query += " AND (incident_id LIKE ? OR flight_number LIKE ? OR airline LIKE ? OR narrative LIKE ?)"
        s = f"%{search}%"
        params.extend([s, s, s, s])

    if category and category != "ALL":
        query += " AND category = ?"
        params.append(category)

    if phase and phase != "ALL":
        query += " AND flight_phase = ?"
        params.append(phase)

    if severity:
        query += " AND severity = ?"
        params.append(severity)

    if risk_rating and risk_rating != "ALL":
        query += " AND risk_rating = ?"
        params.append(risk_rating)

    # Get total matching count
    count_query = query.replace("SELECT *", "SELECT COUNT(*)")
    total = conn.execute(count_query, params).fetchone()[0]

    # Add sorting and pagination
    query += " ORDER BY reported_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    rows = conn.execute(query, params).fetchall()
    conn.close()

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "results": [dict(r) for r in rows]
    }

@app.get("/api/incidents/{incident_id}", tags=["Incidents"])
def get_incident(incident_id: str):
    """Get complete details and RCA for a specific incident."""
    conn = get_db()
    row = conn.execute("SELECT * FROM incidents WHERE incident_id = ?", (incident_id,)).fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")

    res = dict(row)
    if res.get("five_whys_json"):
        try:
            res["five_whys"] = json.loads(res["five_whys_json"])
        except Exception:
            res["five_whys"] = []
    return res

@app.post("/api/incidents", status_code=status.HTTP_201_CREATED, tags=["Incidents"])
def create_incident(payload: IncidentCreateSchema):
    """Submit DGCA Form CA-919 occurrence report with automated ICAO risk evaluation."""
    conn = get_db()
    cursor = conn.cursor()

    # Generate sequential incident ID
    last_id_row = cursor.execute("SELECT incident_id FROM incidents ORDER BY ROWID DESC LIMIT 1").fetchone()
    if last_id_row:
        last_num = int(last_id_row[0].split("-")[-1])
        new_id = f"DGCA-2026-{(last_num + 1):04d}"
    else:
        new_id = "DGCA-2026-0001"

    # Evaluate risk rating
    risk = ICAO_RISK_RATINGS.get((payload.severity, payload.likelihood), "tolerable")
    capa_req = (risk == "intolerable")
    initial_status = "Triage / Under Review" if not capa_req else "CAPA Assigned"

    # Default 5-whys chain
    default_whys = [
        {"step": 1, "q": f"Why did the {payload.category} occurrence happen?", "a": payload.narrative[:120]},
        {"step": 2, "q": "Why were environmental or physical thresholds breached?", "a": f"Conditions reached {payload.weather}."},
        {"step": 3, "q": "Why did sensors or flight crew detection not mitigate earlier?", "a": "Operating parameters fluctuated near regulatory limits."},
        {"step": 4, "q": "Why were standard briefing buffers insufficient?", "a": "Standard operating procedure required tighter buffer intervals."},
        {"step": 5, "q": "Why does the systemic deficiency persist?", "a": "Operational safety monitoring requires mandatory fleet circular."}
    ]

    now_iso = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

    cursor.execute("""
        INSERT INTO incidents (
            incident_id, reported_at, flight_number, airline, callsign,
            aircraft_type, aircraft_icao, registration, origin_icao, origin_name,
            origin_fir, dest_icao, dest_name, dest_fir, flight_phase,
            altitude_ft, airspeed_kts, peak_g_force, weather, category,
            severity, likelihood, risk_rating, narrative, hfacs_tier,
            hfacs_code, hfacs_name, five_whys_json, status, dgca_car_reference,
            capa_required, capa_status, capa_action, closure_days
        ) VALUES (
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?
        )
    """, (
        new_id, now_iso, payload.flight_number, payload.airline, payload.airline,
        payload.aircraft_type, payload.aircraft_type[:4], payload.registration, payload.origin_icao, payload.origin_icao,
        "Indian FIR", payload.dest_icao, payload.dest_icao, "Indian FIR", payload.flight_phase,
        payload.altitude_ft, payload.airspeed_kts, payload.peak_g_force, payload.weather, payload.category,
        payload.severity, payload.likelihood, risk, payload.narrative, payload.hfacs_tier,
        payload.hfacs_code, payload.hfacs_name, json.dumps(default_whys), initial_status, "CAR Section 5, Series C, Part I",
        capa_req, "Drafted" if capa_req else "Not Applicable", "N/A" if not capa_req else "Mandated DGCA CAPA Review", ""
    ))

    conn.commit()
    conn.close()

    return {
        "success": True,
        "message": f"Occurrence {new_id} recorded per DGCA CAR Section 5",
        "incident_id": new_id,
        "risk_rating": risk,
        "capa_required": capa_req
    }

@app.get("/api/stats/summary", tags=["Analytics"])
def get_stats_summary():
    """Aggregates metrics for the executive dashboard: totals, risk matrix cells, and HFACS tiers."""
    conn = get_db()
    
    total = conn.execute("SELECT COUNT(*) FROM incidents").fetchone()[0]
    intolerable = conn.execute("SELECT COUNT(*) FROM incidents WHERE risk_rating = 'intolerable'").fetchone()[0]
    tolerable = conn.execute("SELECT COUNT(*) FROM incidents WHERE risk_rating = 'tolerable'").fetchone()[0]
    acceptable = conn.execute("SELECT COUNT(*) FROM incidents WHERE risk_rating = 'acceptable'").fetchone()[0]
    capa_active = conn.execute("SELECT COUNT(*) FROM incidents WHERE capa_required = 1 AND status != 'Closed / Verified by DGCA'").fetchone()[0]

    # ICAO 5x5 Matrix cells
    cells = conn.execute("SELECT severity || likelihood as cell, COUNT(*) as count FROM incidents GROUP BY cell").fetchall()
    matrix_data = {r["cell"]: r["count"] for r in cells}

    # HFACS Tiers
    hfacs_rows = conn.execute("SELECT hfacs_tier, COUNT(*) as count FROM incidents GROUP BY hfacs_tier").fetchall()
    hfacs_data = {r["hfacs_tier"]: r["count"] for r in hfacs_rows}

    # Top categories
    cat_rows = conn.execute("SELECT category, COUNT(*) as count FROM incidents GROUP BY category ORDER BY count DESC LIMIT 6").fetchall()
    top_categories = [{"category": r["category"], "count": r["count"]} for r in cat_rows]

    conn.close()

    return {
        "total_incidents": total,
        "risk_breakdown": {
            "intolerable": intolerable,
            "tolerable": tolerable,
            "acceptable": acceptable
        },
        "capa_pending": capa_active,
        "icao_matrix_counts": matrix_data,
        "hfacs_distribution": hfacs_data,
        "top_categories": top_categories
    }

@app.put("/api/capa/{incident_id}", tags=["CAPA"])
def update_capa(incident_id: str, payload: CAPAUpdateSchema):
    """Assign or update Corrective and Preventive Action (CAPA) workflow."""
    conn = get_db()
    cursor = conn.cursor()

    row = cursor.execute("SELECT incident_id FROM incidents WHERE incident_id = ?", (incident_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")

    cursor.execute("""
        UPDATE incidents
        SET capa_action = ?, capa_status = ?, status = ?
        WHERE incident_id = ?
    """, (payload.capa_action, payload.capa_status, payload.status or "CAPA Assigned", incident_id))

    conn.commit()
    conn.close()

    return {
        "success": True,
        "message": f"CAPA updated for {incident_id}",
        "capa_status": payload.capa_status
    }

@app.get("/api/firebase/config", tags=["Firebase"])
def get_firebase_config():
    """Returns the Cloud Firestore client configuration for frontend sync."""
    return {
        "projectId": "skyshield-bharat-sms",
        "appId": "1:747111494850:web:bc141cfb405f330cc8f75b",
        "storageBucket": "skyshield-bharat-sms.firebasestorage.app",
        "apiKey": "AIzaSyDDiH4IFtefAvQbtkkuetU1dIxXo0xmH4c",
        "authDomain": "skyshield-bharat-sms.firebaseapp.com",
        "messagingSenderId": "747111494850",
        "status": "connected"
    }

# ----------------- SERVE FRONTEND STATIC FILES -----------------
# Serves index.html, /js, /css, and assets
app.mount("/js", StaticFiles(directory="js"), name="js")
app.mount("/css", StaticFiles(directory="css"), name="css")
app.mount("/assets", StaticFiles(directory="assets"), name="assets")

@app.get("/")
def serve_index():
    return FileResponse("index.html")

if __name__ == "__main__":
    import uvicorn
    print("🛫 SkyShield Bharat Full-Stack Python Backend running on http://127.0.0.1:8000")
    print("📚 Interactive Swagger REST API Docs at: http://127.0.0.1:8000/docs")
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
