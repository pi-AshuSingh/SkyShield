#!/usr/bin/env python3
"""
Generates the System Architecture Diagram for SkyShield:
Project Title: SkyShield: Aviation Safety & Incident Reporting
Project ID: P_006
Architecture: HTML5/Modern CSS Flight Deck UI + FastAPI REST API + SQLite3 SMS Database + ICAO 5x5 Engine
Output: system_architecture_diagram.png (High-resolution, publication ready 300 DPI)
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches

def create_architecture_diagram():
    fig, ax = plt.subplots(figsize=(15, 10.5), dpi=300)
    fig.patch.set_facecolor("#f8fafc")
    ax.set_facecolor("#f8fafc")

    # Canvas Boundary: [0, 15] x [0, 10.5]
    ax.set_xlim(0, 15)
    ax.set_ylim(0, 10.5)
    ax.axis("off")

    # Header Title Banner
    header_box = patches.FancyBboxPatch(
        (0.6, 9.35), 13.8, 0.9,
        boxstyle="round,pad=0.1,rounding_size=0.15",
        facecolor="#0f172a", edgecolor="#1e293b", linewidth=1.5
    )
    ax.add_patch(header_box)
    ax.text(7.5, 9.9, "SKYSHIELD: AVIATION SAFETY & INCIDENT REPORTING (PROJECT ID: P_006)", 
            ha="center", va="center", fontsize=13.5, fontweight="bold", color="#f8fafc", family="sans-serif")
    ax.text(7.5, 9.55, "Captures aviation safety incidents, performs root-cause analysis and produces compliance/safety dashboards", 
            ha="center", va="center", fontsize=9.5, color="#38bdf8", family="sans-serif")

    # ROW 1: PRESENTATION & CLIENT INTERACTION TIER
    # Box 1: Flight Crew & Ops Portal
    crew_box = patches.FancyBboxPatch(
        (0.6, 6.3), 4.3, 2.7,
        boxstyle="round,pad=0.1,rounding_size=0.15",
        facecolor="#ffffff", edgecolor="#3b82f6", linewidth=2.0
    )
    ax.add_patch(crew_box)
    ax.text(2.75, 8.65, "FLIGHT CREW & AIRLINE OPS PORTAL", ha="center", va="center", fontsize=10, fontweight="bold", color="#1d4ed8")
    crew_items = [
        "• DGCA Form CA-919 Incident Logging UX",
        "• Live Flight Parameters (Alt, CAS, G-Load)",
        "• Weather & Atmospheric Encounter Modal",
        "• Flight Phase Dropdowns & Call-Sign Tagger",
        "• Responsive HTML5 / Modern CSS Glassmorphism"
    ]
    for i, txt in enumerate(crew_items):
        ax.text(0.9, 8.25 - (i * 0.38), txt, ha="left", va="center", fontsize=8.5, color="#334155")

    # Box 2: Aviation Safety Officer & Investigator Suite
    safety_box = patches.FancyBboxPatch(
        (5.35, 6.3), 4.3, 2.7,
        boxstyle="round,pad=0.1,rounding_size=0.15",
        facecolor="#ffffff", edgecolor="#0284c7", linewidth=2.0
    )
    ax.add_patch(safety_box)
    ax.text(7.5, 8.65, "SAFETY MANAGEMENT & INVESTIGATION", ha="center", va="center", fontsize=10, fontweight="bold", color="#0369a1")
    safety_items = [
        "• Interactive Leaflet Indian FIR Map (DEL/BOM/CCU/MAA)",
        "• Dynamic ICAO 5x5 Severity/Likelihood Matrix",
        "• HFACS 4-Tier Human-Factors Classifier",
        "• Interactive 5-Whys Root-Cause Tree Visualizer",
        "• Real-Time Incident Filtering & Search"
    ]
    for i, txt in enumerate(safety_items):
        ax.text(5.65, 8.25 - (i * 0.38), txt, ha="left", va="center", fontsize=8.5, color="#334155")

    # Box 3: DGCA Regulatory & Executive Terminal
    dgca_box = patches.FancyBboxPatch(
        (10.1, 6.3), 4.3, 2.7,
        boxstyle="round,pad=0.1,rounding_size=0.15",
        facecolor="#ffffff", edgecolor="#10b981", linewidth=2.0
    )
    ax.add_patch(dgca_box)
    ax.text(12.25, 8.65, "DGCA REGULATORY & COMPLIANCE", ha="center", va="center", fontsize=10, fontweight="bold", color="#047857")
    dgca_items = [
        "• CAR Section 5 Series C Part I Audit Suite",
        "• Mandatory CAPA Assignment & Tracking",
        "• Fleet-wide Airworthiness Risk Index",
        "• Safety Performance Indicator (SPI) Trends",
        "• Executive PDF / CSV Regulatory Exports"
    ]
    for i, txt in enumerate(dgca_items):
        ax.text(10.4, 8.25 - (i * 0.38), txt, ha="left", va="center", fontsize=8.5, color="#334155")

    # Connectors Row 1 -> Row 2
    for x in [2.75, 7.5, 12.25]:
        ax.annotate("", xy=(x, 5.7), xytext=(x, 6.3),
                    arrowprops=dict(arrowstyle="->", color="#64748b", lw=2, mutation_scale=15))

    # ROW 2: API GATEWAY & CORE BACKEND PROCESSING
    # Box 4: API Gateway & Validation Layer
    gw_box = patches.FancyBboxPatch(
        (0.6, 3.3), 6.6, 2.4,
        boxstyle="round,pad=0.1,rounding_size=0.15",
        facecolor="#ffffff", edgecolor="#8b5cf6", linewidth=2.0
    )
    ax.add_patch(gw_box)
    ax.text(3.9, 5.35, "API GATEWAY & TELEMETRY INGRESS (FASTAPI / ASGI)", ha="center", va="center", fontsize=10, fontweight="bold", color="#6d28d9")
    gw_items = [
        "• Python 3.11+ High-Throughput Asynchronous FastAPI Endpoints",
        "• Pydantic v2 Request Validation & Error Sanitization",
        "• Cross-Origin Resource Sharing (CORS) & SSL/TLS Termination",
        "• Structured JSON Telemetry & DGCA Form CA-919 Schema Parser"
    ]
    for i, txt in enumerate(gw_items):
        ax.text(0.9, 4.95 - (i * 0.38), txt, ha="left", va="center", fontsize=8.5, color="#334155")

    # Box 5: Aviation Safety Intelligence & Inference Engines
    core_box = patches.FancyBboxPatch(
        (7.8, 3.3), 6.6, 2.4,
        boxstyle="round,pad=0.1,rounding_size=0.15",
        facecolor="#ffffff", edgecolor="#f59e0b", linewidth=2.0
    )
    ax.add_patch(core_box)
    ax.text(11.1, 5.35, "SAFETY REASONING & ROOT-CAUSE ENGINES", ha="center", va="center", fontsize=10, fontweight="bold", color="#b45309")
    core_items = [
        "• ICAO Annex 19 5x5 Risk Tolerability Matrix Engine",
        "• HFACS Causal Rule Hierarchy Classifier (Acts to Org Influences)",
        "• 5-Whys Recursive Diagnostic Tree Assembler & Parser",
        "• Automated CAPA Workflow Dispatch for Intolerable Occurrences"
    ]
    for i, txt in enumerate(core_items):
        ax.text(8.1, 4.95 - (i * 0.38), txt, ha="left", va="center", fontsize=8.5, color="#334155")

    # Connectors Row 2 -> Row 3
    ax.annotate("", xy=(3.9, 2.7), xytext=(3.9, 3.3),
                arrowprops=dict(arrowstyle="->", color="#64748b", lw=2, mutation_scale=15))
    ax.annotate("", xy=(11.1, 2.7), xytext=(11.1, 3.3),
                arrowprops=dict(arrowstyle="->", color="#64748b", lw=2, mutation_scale=15))

    # ROW 3: DATA PERSISTENCE & ANALYTICS WAREHOUSE
    # Box 6: SQLite Database & Storage Engine
    db_box = patches.FancyBboxPatch(
        (0.6, 0.4), 6.6, 2.3,
        boxstyle="round,pad=0.1,rounding_size=0.15",
        facecolor="#ffffff", edgecolor="#059669", linewidth=2.0
    )
    ax.add_patch(db_box)
    ax.text(3.9, 2.35, "DATA PERSISTENCE TIER (SQLITE3 / SMS REPOSITORY)", ha="center", va="center", fontsize=10, fontweight="bold", color="#047857")
    db_items = [
        "• skyshield_sms.db Relational Engine with WAL Mode Enabled",
        "• Composite B-Tree Indexes on (airline, severity, reported_at)",
        "• Pre-calculated FIR Geometries & GeoJSON Airport Waypoints",
        "• Immutable Regulatory Incident Ledger & Audit Trail"
    ]
    for i, txt in enumerate(db_items):
        ax.text(0.9, 1.95 - (i * 0.38), txt, ha="left", va="center", fontsize=8.5, color="#334155")

    # Box 7: Statistical Analytics & EDA Engine
    stat_box = patches.FancyBboxPatch(
        (7.8, 0.4), 6.6, 2.3,
        boxstyle="round,pad=0.1,rounding_size=0.15",
        facecolor="#ffffff", edgecolor="#ef4444", linewidth=2.0
    )
    ax.add_patch(stat_box)
    ax.text(11.1, 2.35, "STATISTICAL ANALYTICS & EDA ENGINE (PANDAS / SEABORN)", ha="center", va="center", fontsize=10, fontweight="bold", color="#b91c1c")
    stat_items = [
        "• 5,000 Validated DGCA Occurrence Records (2024–2026)",
        "• Flight Phase Envelope & Aerodynamic Anomaly Detection",
        "• Fleet Severity Heatmaps & Temporal Risk Index Tracking",
        "• Automated Executive PDF Report & Publication Visuals"
    ]
    for i, txt in enumerate(stat_items):
        ax.text(8.1, 1.95 - (i * 0.38), txt, ha="left", va="center", fontsize=8.5, color="#334155")

    plt.tight_layout()
    plt.savefig("system_architecture_diagram.png", dpi=300, bbox_inches="tight")
    plt.savefig("architecture_diagram.png", dpi=300, bbox_inches="tight")
    print("Updated architecture diagrams generated: system_architecture_diagram.png & architecture_diagram.png")

if __name__ == "__main__":
    create_architecture_diagram()
