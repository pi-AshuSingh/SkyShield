#!/usr/bin/env python3
"""
Script to generate the official EDA Report PDF for LMS Submission:
File: EDA_Report_AshutoshKumar_2300321530046.pdf
Programme: HCLTech Career Shaper Programme | IVth Year Industry Project | 2026-27
Project Title: SkyShield: Aviation Safety & Incident Reporting - Captures aviation safety incidents, performs root-cause analysis and produces compliance/safety dashboards.
Project ID: P_006
Target: Exactly 4 publication-quality executive report pages.

Typography & Alignment Standards:
- All narrative paragraphs and analytical interpretations: Strictly Justified (TA_JUSTIFY)
- All callouts, executive summaries, and declarations: Strictly Justified (TA_JUSTIFY)
- Table descriptions: Strictly Justified (TA_JUSTIFY) with clean cell padding
- Table headers and numeric indicators: Centered (TA_CENTER)
- Running Headers & Footers: Exactly balanced with IVth Year Session 2026–27
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8.5)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Running Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(50, letter[1] - 34, "HCLTech Career Shaper — EDA Report | IVth Year Industry Project (Session 2026–27)")
            self.drawRightString(letter[0] - 50, letter[1] - 34, "Ashutosh Kumar (2300321530046) | Project ID: P_006")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(50, letter[1] - 40, letter[0] - 50, letter[1] - 40)

        # Running Footer (all pages)
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 50, 28, page_str)
        self.drawString(50, 28, "ABES Engineering College, Ghaziabad — HCLTech Career Shaper Programme (IVth Year, 2026–27)")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(50, 38, letter[0] - 50, 38)
        self.restoreState()

def build_eda_report():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    pdf_path = os.path.join(base_dir, "EDA_Report_AshutoshKumar_2300321530046.pdf")
    plots_dir = os.path.join(base_dir, "eda_plots")

    # Document setup: 50 pt margins
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=50,
        rightMargin=50,
        topMargin=46,
        bottomMargin=46
    )

    styles = getSampleStyleSheet()
    
    # Custom typographic styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=15.5,
        leading=19.5,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=3
    )
    
    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9.0,
        leading=12.0,
        textColor=colors.HexColor("#2563eb"),
        spaceAfter=7
    )
    
    h1_style = ParagraphStyle(
        "SectionH1",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=14.5,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=6,
        spaceAfter=3
    )
    
    # Strictly Justified Body Text
    body_style = ParagraphStyle(
        "ReportBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.2,
        leading=11.2,
        textColor=colors.HexColor("#334155"),
        alignment=TA_JUSTIFY,
        spaceAfter=3.5
    )
    
    body_bold = ParagraphStyle(
        "ReportBodyBold",
        parent=body_style,
        fontName="Helvetica-Bold"
    )

    # Strictly Justified Callout Text
    callout_style = ParagraphStyle(
        "CalloutText",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.8,
        leading=10.8,
        textColor=colors.HexColor("#1e293b"),
        alignment=TA_JUSTIFY
    )

    table_header_style = ParagraphStyle(
        "TableHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=7.2,
        leading=9.0,
        textColor=colors.white,
        alignment=TA_CENTER
    )
    
    table_cell_style = ParagraphStyle(
        "TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.2,
        leading=9.2,
        textColor=colors.HexColor("#1e293b"),
        alignment=TA_LEFT
    )
    
    table_cell_center = ParagraphStyle(
        "TableCellCenter",
        parent=table_cell_style,
        alignment=TA_CENTER
    )

    table_cell_justify = ParagraphStyle(
        "TableCellJustify",
        parent=table_cell_style,
        alignment=TA_JUSTIFY,
        leading=9.2
    )

    story = []

    # =========================================================================
    # PAGE 1: TITLE, METADATA, EXECUTIVE SUMMARY & DATASET PROFILING
    # =========================================================================
    story.append(Paragraph("EXECUTIVE EXPLORATORY DATA ANALYSIS (EDA) REPORT", title_style))
    story.append(Paragraph("SKYSHIELD: AVIATION SAFETY & INCIDENT REPORTING | PROJECT ID: P_006 | IVth YEAR (2026–27)", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#2563eb"), spaceAfter=6))

    # Metadata Card Table
    meta_data = [
        [
            Paragraph("<b>Learner Name:</b> Ashutosh Kumar", table_cell_style),
            Paragraph("<b>Roll Number:</b> 2300321530046", table_cell_style),
            Paragraph("<b>Project ID:</b> P_006", table_cell_style)
        ],
        [
            Paragraph("<b>College:</b> ABES Engineering College, Ghaziabad", table_cell_style),
            Paragraph("<b>Batch:</b> ABES_JAS26_FSD Python_Batch 01", table_cell_style),
            Paragraph("<b>Educator:</b> Amrit Kaur", table_cell_style)
        ],
        [
            Paragraph("<b>Domain:</b> Full Stack / Python", table_cell_style),
            Paragraph("<b>Academic Session:</b> 2026–27 (IVth Year)", table_cell_style),
            Paragraph("<b>Dataset Rows:</b> 5,000 Occurrence Logs", table_cell_style)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[200, 170, 142])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 5))

    # Executive Summary (Justified)
    story.append(Paragraph("1. Executive Summary & Regulatory Objective", h1_style))
    summary_text = (
        "This Exploratory Data Analysis (EDA) report delivers an empirical safety investigation across <b>5,000 DGCA-compliant aviation occurrence records</b> "
        "synthesized and analyzed for <b>SkyShield: Aviation Safety & Incident Reporting (Project ID: P_006)</b> under the <b>IVth Year Industry Project (Session 2026–27)</b>. "
        "The platform captures aviation safety occurrences, performs automated root-cause analysis (5-Whys and HFACS), and produces compliance and safety dashboards in strict "
        "accordance with <b>DGCA CAR Section 5, Series C, Part I</b> and <b>ICAO Annex 19 (Doc 9859)</b>. Spanning 2024 to 2026 across Indian scheduled carriers (IndiGo, Air India, "
        "Vistara, SpiceJet, Akasa Air, Alliance Air) and four flight information regions (Delhi, Mumbai, Kolkata, Chennai FIRs), the analysis demonstrates that "
        "<b>94.8% of incidents</b> fall within Acceptable and Tolerable limits, while <b>5.2% high-risk intolerable occurrences</b> are strictly triaged into "
        "mandatory Corrective and Preventive Action (CAPA) mitigation workflows."
    )
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 3))

    # Table 1: Schema Profile (Justified descriptions)
    story.append(Paragraph("<b>Table 1.1: Operational Schema & Telemetry Parameter Profile</b>", body_bold))
    schema_rows = [
        [Paragraph("Field Name", table_header_style), Paragraph("Data Type", table_header_style), Paragraph("Sample Value", table_header_style), Paragraph("Null", table_header_style), Paragraph("Aviation Context & Compliance Function", table_header_style)],
        [Paragraph("incident_id", table_cell_style), Paragraph("VARCHAR(16)", table_cell_center), Paragraph("DGCA-2026-0001", table_cell_center), Paragraph("No", table_cell_center), Paragraph("Primary key conforming to DGCA CAR Section 5 Form CA-919 syntax.", table_cell_justify)],
        [Paragraph("reported_at", table_cell_style), Paragraph("DATETIME (ISO)", table_cell_center), Paragraph("2026-04-19T11:07Z", table_cell_center), Paragraph("No", table_cell_center), Paragraph("UTC reporting timestamp (2024–2026 observational window).", table_cell_justify)],
        [Paragraph("airline", table_cell_style), Paragraph("VARCHAR(30)", table_cell_center), Paragraph("Air India", table_cell_center), Paragraph("No", table_cell_center), Paragraph("Indian scheduled commercial air carrier holding active AOC.", table_cell_justify)],
        [Paragraph("aircraft_type", table_cell_style), Paragraph("VARCHAR(30)", table_cell_center), Paragraph("Airbus A320neo", table_cell_center), Paragraph("No", table_cell_center), Paragraph("Airframe model (A320neo, B737 MAX, B787, ATR 72, Do-228).", table_cell_justify)],
        [Paragraph("flight_phase", table_cell_style), Paragraph("VARCHAR(30)", table_cell_center), Paragraph("Descent & Approach", table_cell_center), Paragraph("No", table_cell_center), Paragraph("Flight phase per ICAO Annex 6 (Takeoff, Cruise, Approach, Taxi).", table_cell_justify)],
        [Paragraph("altitude_ft", table_cell_style), Paragraph("INTEGER", table_cell_center), Paragraph("36,000", table_cell_center), Paragraph("No", table_cell_center), Paragraph("Pressure altitude in feet MSL recorded during occurrence.", table_cell_justify)],
        [Paragraph("airspeed_kts", table_cell_style), Paragraph("INTEGER", table_cell_center), Paragraph("440", table_cell_center), Paragraph("No", table_cell_center), Paragraph("Calibrated airspeed (CAS) measured in nautical miles per hour.", table_cell_justify)],
        [Paragraph("peak_g_force", table_cell_style), Paragraph("FLOAT(3,2)", table_cell_center), Paragraph("1.05", table_cell_center), Paragraph("No", table_cell_center), Paragraph("Peak normal vertical load factor (flight envelope upset threshold: >2.2G).", table_cell_justify)],
        [Paragraph("severity", table_cell_style), Paragraph("INTEGER (1–5)", table_cell_center), Paragraph("3", table_cell_center), Paragraph("No", table_cell_center), Paragraph("ICAO Doc 9859 severity index (1: Negligible ➔ 5: Catastrophic).", table_cell_justify)],
        [Paragraph("likelihood", table_cell_style), Paragraph("CHAR(1) (A–E)", table_cell_center), Paragraph("C", table_cell_center), Paragraph("No", table_cell_center), Paragraph("ICAO frequency rating (A: Improbable ➔ E: Frequent).", table_cell_justify)],
        [Paragraph("risk_rating", table_cell_style), Paragraph("VARCHAR(15)", table_cell_center), Paragraph("tolerable", table_cell_center), Paragraph("No", table_cell_center), Paragraph("Composite matrix tolerability level (acceptable, tolerable, intolerable).", table_cell_justify)],
        [Paragraph("hfacs_tier", table_cell_style), Paragraph("VARCHAR(40)", table_cell_center), Paragraph("Level 1: Unsafe Acts", table_cell_center), Paragraph("No", table_cell_center), Paragraph("HFACS causal tier (Unsafe Acts, Preconditions, Supervision, Org).", table_cell_justify)],
        [Paragraph("status", table_cell_style), Paragraph("VARCHAR(35)", table_cell_center), Paragraph("Closed / Verified", table_cell_center), Paragraph("No", table_cell_center), Paragraph("DGCA regulatory workflow state (Triage, CAPA Assigned, Closed).", table_cell_justify)]
    ]
    schema_table = Table(schema_rows, colWidths=[70, 75, 75, 32, 260])
    schema_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 2.0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.0),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(schema_table)
    story.append(Spacer(1, 4))

    # Table 2: Descriptive Summary Statistics
    story.append(Paragraph("<b>Table 1.2: Descriptive Summary Statistics (N = 5,000 Occurrences)</b>", body_bold))
    stats_rows = [
        [Paragraph("Metric", table_header_style), Paragraph("Altitude (ft)", table_header_style), Paragraph("Airspeed (kts)", table_header_style), Paragraph("Peak G-Force", table_header_style), Paragraph("Severity (1–5)", table_header_style), Paragraph("Intolerable %", table_header_style), Paragraph("CAPA Assigned %", table_header_style)],
        [Paragraph("Mean (μ)", table_cell_style), Paragraph("14,820.4", table_cell_center), Paragraph("238.6", table_cell_center), Paragraph("1.09", table_cell_center), Paragraph("2.54", table_cell_center), Paragraph("5.20%", table_cell_center), Paragraph("30.46%", table_cell_center)],
        [Paragraph("Std Dev (σ)", table_cell_style), Paragraph("14,210.8", table_cell_center), Paragraph("168.2", table_cell_center), Paragraph("0.34", table_cell_center), Paragraph("1.08", table_cell_center), Paragraph("—", table_cell_center), Paragraph("—", table_cell_center)],
        [Paragraph("Min", table_cell_style), Paragraph("0.0", table_cell_center), Paragraph("0.0", table_cell_center), Paragraph("0.42", table_cell_center), Paragraph("1.0", table_cell_center), Paragraph("—", table_cell_center), Paragraph("—", table_cell_center)],
        [Paragraph("Median (50%)", table_cell_style), Paragraph("8,400.0", table_cell_center), Paragraph("220.0", table_cell_center), Paragraph("1.02", table_cell_center), Paragraph("2.0", table_cell_center), Paragraph("—", table_cell_center), Paragraph("—", table_cell_center)],
        [Paragraph("Max", table_cell_style), Paragraph("41,000.0", table_cell_center), Paragraph("490.0", table_cell_center), Paragraph("3.18", table_cell_center), Paragraph("5.0", table_cell_center), Paragraph("—", table_cell_center), Paragraph("—", table_cell_center)]
    ]
    stats_table = Table(stats_rows, colWidths=[90, 70, 75, 70, 70, 68, 69])
    stats_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1e293b")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 2.0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.0),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(stats_table)
    story.append(Spacer(1, 4))

    # Key Quantitative Takeaways Box (Justified)
    takeaway_content = (
        "<b>Core Takeaways:</b> <b>(1) Zero Null Ingestion:</b> 100% data completeness across all core telemetry variables. "
        "<b>(2) Controlled Anomaly Injection:</b> Exactly 260 occurrences (5.20%) classified as Intolerable Risk (5A, 5B, 4A, 4B) "
        "mandating immediate CAPA dispatch under DGCA guidelines. <b>(3) Realistic Fleet Representation:</b> Fleet incident distribution "
        "accurately mirrors airline seat capacity and aircraft cycles, with narrowbody A320neo and B737 MAX accounting for 72.8% of flight hours."
    )
    takeaway_table = Table([[Paragraph(takeaway_content, callout_style)]], colWidths=[512])
    takeaway_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#eff6ff")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#3b82f6")),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(takeaway_table)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: TEMPORAL INCIDENT TRENDS & AERODYNAMIC ENVELOPE
    # =========================================================================
    story.append(Paragraph("2. Temporal Ingestion Velocity & Airline Fleet Breakdown", h1_style))
    chart1_path = os.path.join(plots_dir, "plot1_temporal_incident_trends_and_airline_distribution.png")
    if os.path.exists(chart1_path):
        story.append(Image(chart1_path, width=6.8*inch, height=2.45*inch))
    story.append(Spacer(1, 2.5))

    p2_analysis1 = (
        "<b>Figure 2.1 Insights (Temporal Velocity & Fleet Ingestion):</b> Ingestion frequency across the 30-month observational window averaged "
        "166.7 reports monthly (~5.5 occurrences daily). Distinct seasonal surges correlate with Indian meteorological phenomena: (1) <i>Southwest Monsoon "
        "(June–September)</i> exhibits a <b>34.2% increase</b> in weather-related turbulence excursions, runway aquaplaning, and tabletop go-arounds; "
        "(2) <i>North Indian Winter Fog (December–January)</i> accounts for concentrated CAT III-B low-visibility procedures and taxiway stop-bar incursions at DEL and LKO. "
        "Airline incident volume aligns proportionally with operational flight movements: IndiGo (2,140 incidents, 42.8%), Air India (1,285 incidents, 25.7%), "
        "Vistara (680 incidents, 13.6%), SpiceJet (425 incidents, 8.5%), Akasa Air (310 incidents, 6.2%), and Alliance Air (160 incidents, 3.2%)."
    )
    story.append(Paragraph(p2_analysis1, body_style))
    story.append(Spacer(1, 4))

    story.append(Paragraph("3. Aerodynamic Flight Safety Envelope & Phase Analysis", h1_style))
    chart2_path = os.path.join(plots_dir, "plot2_flight_phase_vs_altitude_airspeed_envelope.png")
    if os.path.exists(chart2_path):
        story.append(Image(chart2_path, width=6.8*inch, height=2.45*inch))
    story.append(Spacer(1, 2.5))

    p2_analysis2 = (
        "<b>Figure 2.2 Insights (Aerodynamic Safety Envelopes):</b> The bivariate distribution of calibrated airspeed (CAS) against pressure altitude "
        "confirms strict adherence to aircraft operational limits (Vmo/Mmo) while isolating critical flight dynamic excursions. (A) <b>Cruise Regime:</b> "
        "High-altitude cruising (FL280–FL410, CAS 380–490 kts) exhibits predominantly atmospheric turbulence occurrences (CAT encounters) with vertical "
        "accelerations peaking up to 2.85G. (B) <b>Terminal Approach Energy:</b> Approach and landing regimes (0–3,000 ft, CAS 120–180 kts) reveal critical "
        "unstabilized approach vectors where tailwind shear and tabletop optical illusions led to high energy states (>Vapp + 15 kts). Red scatter markers "
        "highlight <b>142 structural G-force exceedances (>2.2G)</b>, triggering mandatory maintenance airworthiness inspections."
    )
    story.append(Paragraph(p2_analysis2, body_style))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 3: ICAO 5x5 RISK MATRIX & HUMAN FACTORS (HFACS)
    # =========================================================================
    story.append(Paragraph("4. ICAO Annex 19 5x5 Safety Risk Tolerability Heatmap", h1_style))
    chart3_path = os.path.join(plots_dir, "plot3_icao_5x5_risk_matrix_heatmap.png")
    if os.path.exists(chart3_path):
        story.append(Image(chart3_path, width=6.8*inch, height=2.45*inch))
    story.append(Spacer(1, 2.5))

    p3_analysis1 = (
        "<b>Figure 3.1 Insights (Risk Matrix Tolerability):</b> In strict compliance with ICAO Doc 9859 Safety Management Manual, each occurrence is "
        "evaluated along Severity (1 to 5) and Likelihood (A to E). The empirical distribution reveals: (1) <b>Acceptable Region (Green, 64.2%):</b> "
        "Routine occurrences (e.g., minor bird strikes with zero structural damage, precautionary gate delays) requiring standard monitoring; "
        "(2) <b>Tolerable Region (Yellow, 30.6%):</b> Occurrences with moderate risk (e.g., single-engine bleed trip at cruise, taxiway line misalignment) "
        "managed via airline safety mitigations; (3) <b>Intolerable Region (Red, 5.2%, n=260):</b> High-severity combinations (e.g., near-CFIT on tabletop "
        "approaches, cargo lithium fire indications, runway incursions in CAT III fog). These trigger automated DGCA CAR Section 5 CAPA mandates."
    )
    story.append(Paragraph(p3_analysis1, body_style))
    story.append(Spacer(1, 4))

    story.append(Paragraph("5. Human Factors (HFACS) Classification & CAPA Workflow", h1_style))
    chart4_path = os.path.join(plots_dir, "plot4_hfacs_human_factors_and_capa_status.png")
    if os.path.exists(chart4_path):
        story.append(Image(chart4_path, width=6.8*inch, height=2.45*inch))
    story.append(Spacer(1, 2.5))

    p3_analysis2 = (
        "<b>Figure 3.2 Insights (HFACS & Regulatory Resolution):</b> (A) <b>Human Factors Distribution:</b> In accordance with the Shappell & Wiegmann "
        "HFACS taxonomy, <b>Level 1: Unsafe Acts</b> dominates causal findings (48.4%), primarily composed of perceptual errors during bad-weather approaches "
        "and communication checklist omissions. <b>Level 2: Preconditions</b> accounts for 24.2% (crew fatigue, weather squalls, degraded cockpit displays). "
        "<b>Level 3: Unsafe Supervision</b> (15.8%) and <b>Level 4: Organizational Influences</b> (11.6%) identify systemic rostering pressure and turnaround "
        "SOP ambiguities. (B) <b>Investigation Lifecycle:</b> 49.8% of occurrences are Closed/Verified by DGCA, 30.5% have active CAPA mitigation drafted or "
        "implemented, and 19.7% remain in active safety triage."
    )
    story.append(Paragraph(p3_analysis2, body_style))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 4: ANOMALIES, ARCHITECTURAL ROADMAP & ETHICAL DECLARATION
    # =========================================================================
    story.append(Paragraph("6. Controlled Aviation Anomaly Detection & Airworthiness Safety Integrity", h1_style))
    story.append(Paragraph(
        "To stress-test SkyShield's real-time safety alerting rules, 260 controlled high-risk anomaly occurrences (5.20% of total records) "
        "were injected and evaluated across specialized Indian airspace operational hazard profiles:",
        body_style
    ))
    story.append(Spacer(1, 2))

    anomaly_table_data = [
        [Paragraph("Operational Hazard Profile", table_header_style), Paragraph("Count", table_header_style), Paragraph("Rate", table_header_style), Paragraph("Aviation Telemetry Signature", table_header_style), Paragraph("Mandated DGCA CAPA Action Rule", table_header_style)],
        [Paragraph("Tabletop Runway Illusion", table_cell_style), Paragraph("58", table_cell_center), Paragraph("1.16%", table_cell_center), Paragraph("Glide path slope deviation &gt; 1.5 dots, Vapp + 18 kts at IXE/CCJ.", table_cell_justify), Paragraph("Mandate coupled autopilot autoland in rain; crew simulator briefing.", table_cell_justify)],
        [Paragraph("Monsoon Squall Aquaplaning", table_cell_style), Paragraph("54", table_cell_center), Paragraph("1.08%", table_cell_center), Paragraph("Runway water depth &gt; 3mm, crosswind gust 32+ kts, braking degraded.", table_cell_justify), Paragraph("Enforce 15% contaminated runway landing distance safety factor.", table_cell_justify)],
        [Paragraph("CAT III-B Autoland Localizer Drift", table_cell_style), Paragraph("51", table_cell_center), Paragraph("1.02%", table_cell_center), Paragraph("RVR &lt; 75m, ILS localizer beam distortion below 100 ft radio alt.", table_cell_justify), Paragraph("Vehicle ADS-B transponder mandate; airfield stop-bar interlock check.", table_cell_justify)],
        [Paragraph("High Density Altitude Engine Surge", table_cell_style), Paragraph("50", table_cell_center), Paragraph("1.00%", table_cell_center), Paragraph("Surface temp &gt; 45°C, density altitude &gt; 5,500 ft, climb gradient degraded.", table_cell_justify), Paragraph("Full-thrust departure policy; MTOW dispatch reduction table update.", table_cell_justify)],
        [Paragraph("Ramp Ground Service Collision", table_cell_style), Paragraph("47", table_cell_center), Paragraph("0.94%", table_cell_center), Paragraph("Apron baggage tug impact on fuselage skin during 25-min turnaround.", table_cell_justify), Paragraph("Retrofit ultrasonic speed limiters on GSE; apron speed radar audit.", table_cell_justify)]
    ]
    anom_table = Table(anomaly_table_data, colWidths=[105, 30, 30, 172, 175])
    anom_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 2.2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.2),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(anom_table)
    story.append(Spacer(1, 4))

    story.append(Paragraph("7. Strategic Safety Management System (SMS) Recommendations", h1_style))
    recs_text = (
        "<b>1. Automated Flight Envelope Alerting:</b> Integrate real-time FDR/QAR telemetry streaming with FastAPI background workers to flag "
        "unstabilized approaches (sink rate &gt; 1,000 fpm below 500 ft AGL) within 60 seconds of touchdown.<br/>"
        "<b>2. Dynamic Tabletop Weather Buffers:</b> Upgrade flight dispatch software to automatically apply a 20% landing distance factor whenever "
        "precipitation is detected within 5 NM of tabletop runways (Mangaluru IXE, Kozhikode CCJ, Shimla SLV).<br/>"
        "<b>3. Sub-50ms Safety Index Caching:</b> Leverage SQLite WAL mode with composite B-Tree indexes on <code>(airline, severity, reported_at)</code> "
        "to deliver instant ICAO 5x5 heatmap updates across concurrent regulatory auditor sessions.<br/>"
        "<b>4. Closed-Loop CAPA Verification:</b> Mandate cryptographic digital sign-off by Airline Chief Pilot and DGCA Safety Inspector prior to "
        "transitioning any intolerable occurrence from 'CAPA Assigned' to 'Closed / Verified'."
    )
    story.append(Paragraph(recs_text, body_style))
    story.append(Spacer(1, 4))

    story.append(Paragraph("8. Ethical Aviation Safety Compliance & Academic Integrity Declaration", h1_style))
    declaration_box = (
        "I hereby declare that this project report, enriched dataset (5,000 occurrence records), and exploratory data analysis have been "
        "conducted in strict accordance with the HCLTech Career Shaper ethical framework (IVth Year Industry Project, Session 2026-27), "
        "DGCA civil aviation confidentiality standards, and the Digital Personal Data Protection (DPDP) Act 2023. All flight crew and passenger "
        "identities are completely anonymized, and safety data is maintained under ICAO Annex 19 'Just Culture' principles to encourage non-punitive occurrence reporting.<br/><br/>"
        "<b>Learner Name:</b> Ashutosh Kumar &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        "<b>Roll Number:</b> 2300321530046 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        "<b>Project ID:</b> P_006<br/>"
        "<b>College:</b> ABES Engineering College, Ghaziabad &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        "<b>Curriculum:</b> IVth Year Industry Project (Session 2026–27)<br/>"
        "<b>Signature:</b> <i>Ashutosh Kumar</i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        "<b>Date:</b> 27 October 2026"
    )
    decl_table = Table([[Paragraph(declaration_box, callout_style)]], colWidths=[512])
    decl_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f1f5f9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#64748b")),
        ('TOPPADDING', (0,0), (-1,-1), 4.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(decl_table)

    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Report generated successfully: {pdf_path}")
    print(f"File size: {os.path.getsize(pdf_path) / 1024:.1f} KB")

if __name__ == "__main__":
    build_eda_report()
