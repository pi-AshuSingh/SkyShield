/**
 * SkyShield - Aviation Safety & Incident Reporting
 * Master Domain Data: ICAO SMS, Risk Matrix, HFACS, Bow-Tie Models, & Seed Incidents
 */

export const RISK_MATRIX_CONFIG = {
  severities: [
    { level: 5, label: '5 - Catastrophic', desc: 'Equipment destroyed, multiple fatalities' },
    { level: 4, label: '4 - Hazardous', desc: 'Large reduction in safety margins, serious injury' },
    { level: 3, label: '3 - Major', desc: 'Significant reduction in safety margins, serious incident' },
    { level: 2, label: '2 - Minor', desc: 'Operating limitations, emergency SOP used, minor incident' },
    { level: 1, label: '1 - Negligible', desc: 'Little consequence, minor inconvenience' }
  ],
  likelihoods: [
    { code: 'A', label: 'A - Extremely Improbable', desc: 'Almost inconceivable (< 10⁻⁹)' },
    { code: 'B', label: 'B - Improbable', desc: 'Very unlikely to occur (10⁻⁷ to 10⁻⁹)' },
    { code: 'C', label: 'C - Remote', desc: 'Unlikely, but possible (10⁻⁵ to 10⁻⁷)' },
    { code: 'D', label: 'D - Occasional', desc: 'Likely to occur sometimes (10⁻³ to 10⁻⁵)' },
    { code: 'E', label: 'E - Frequent', desc: 'Likely to occur often (> 10⁻³)' }
  ],
  // Cell risk levels: 'intolerable' (red), 'tolerable' (amber), 'acceptable' (green)
  ratings: {
    '5A': 'intolerable', '5B': 'intolerable', '5C': 'intolerable', '5D': 'intolerable', '5E': 'intolerable',
    '4A': 'tolerable',   '4B': 'intolerable', '4C': 'intolerable', '4D': 'intolerable', '4E': 'intolerable',
    '3A': 'acceptable',  '3B': 'tolerable',   '3C': 'tolerable',   '3D': 'intolerable', '3E': 'intolerable',
    '2A': 'acceptable',  '2B': 'acceptable',  '2C': 'tolerable',   '2D': 'tolerable',   '2E': 'tolerable',
    '1A': 'acceptable',  '1B': 'acceptable',  '1C': 'acceptable',  '1D': 'acceptable',  '1E': 'tolerable'
  }
};

export const HFACS_TAXONOMY = {
  'Level 1: Unsafe Acts': [
    { id: 'UA-DEC', name: 'Decision Error', desc: 'Faulty flight plan, improper speed/altitude choice, misjudged risk' },
    { id: 'UA-SKB', name: 'Skill-Based Error', desc: 'Stick-and-rudder slip, checklist omission, misread instrument' },
    { id: 'UA-PER', name: 'Perceptual Error', desc: 'Visual illusion, spatial disorientation, misjudged descent rate' },
    { id: 'UA-VIO-ROUTINE', name: 'Routine Violation', desc: 'Habitual deviation from standard operating procedure (SOP)' },
    { id: 'UA-VIO-EXCEPT', name: 'Exceptional Violation', desc: 'Isolated, deliberate breach of safety protocol without authorization' }
  ],
  'Level 2: Preconditions for Unsafe Acts': [
    { id: 'PRE-ENV-PHY', name: 'Physical Environment', desc: 'Severe weather, IMC, turbulence, glare, runway contamination' },
    { id: 'PRE-ENV-TECH', name: 'Technological Environment', desc: 'Avionics ergonomics, false warnings, automation surprise' },
    { id: 'PRE-COND-FAT', name: 'Operator Fatigue & Circadian', desc: 'High duty hours, sleep deficit, time-zone desynchronosis' },
    { id: 'PRE-COND-COG', name: 'Cognitive Overload / Distraction', desc: 'Channelized attention, high radio clutter, panic' },
    { id: 'PRE-PERS-CRM', name: 'CRM & Communication Breakdown', desc: 'Steep authority gradient, unassertive First Officer, ATC mishear' }
  ],
  'Level 3: Unsafe Supervision': [
    { id: 'SUP-INAD', name: 'Inadequate Supervision', desc: 'Lack of oversight, failure to verify crew qualification or currency' },
    { id: 'SUP-PLAN', name: 'Planned Inappropriate Operations', desc: 'Dispatching into known convective hazard or tight duty margins' },
    { id: 'SUP-DEF', name: 'Failed to Correct Known Deficiency', desc: 'Ignoring repeat pilot reports (PIREPs) or recurring maintenance logs' }
  ],
  'Level 4: Organizational Influences': [
    { id: 'ORG-RES', name: 'Resource Management', desc: 'Fleet maintenance budget cuts, substandard tooling, simulator shortage' },
    { id: 'ORG-CLIM', name: 'Safety Culture & Climate', desc: 'On-time schedule pressure prioritized over precautionary delays' },
    { id: 'ORG-PROC', name: 'Operational Processes & SOP Quality', desc: 'Ambiguous flight manual wording, outdated MEL procedures' }
  ]
};

export const INCIDENT_CATEGORIES = [
  'Bird Strike / Wildlife Hazard (Black Kite / Stray Animal)',
  'Severe Monsoon Convective Weather / Cloudburst Squall',
  'Delhi NCR Dense Winter Fog (CAT III-B LVP / Low Visibility)',
  'Runway Incursion / Stop-Bar Violation',
  'TCAS Resolution Advisory (RA) / Loss of Separation',
  'High Density Altitude (Hot Weather 45°C+ Thrust Margin)',
  'Avionics & Pitot-Static Sensor Probe Discrepancy',
  'Tail Strike / Hard Landing Exceedance (> 2.1g)',
  'Cabin Pressurization / Emergency Oxygen Mask Deployment',
  'Laser Illumination in Terminal Control Area (TMA)',
  'Ground Handling & Ramp Safety (GSE Impact)',
  'PED Lithium Battery Thermal Runaway in Cabin',
  'Tabletop Runway Spatial Disorientation / Late Go-Around'
];

export const FLIGHT_PHASES = [
  'Pre-Flight / Boarding',
  'Pushback & Taxi-Out',
  'Takeoff Roll',
  'Initial Climb (0 - 10,000 ft)',
  'En-Route / Cruise (FL280 - FL410)',
  'Descent',
  'Terminal Approach / Localizer',
  'Landing Rollout & Flare',
  'Taxi-In & Gate'
];

export const AIRPORTS = [
  { code: 'VIDP', name: 'Indira Gandhi Intl', city: 'New Delhi (DEL)', lat: 28.5562, lng: 77.1000, riskScore: 88, fir: 'Delhi FIR', category: 'CAT III-B Hub' },
  { code: 'VABB', name: 'Chhatrapati Shivaji Maharaj Intl', city: 'Mumbai (BOM)', lat: 19.0896, lng: 72.8656, riskScore: 82, fir: 'Mumbai FIR', category: 'Monsoon Crosswind' },
  { code: 'VOBL', name: 'Kempegowda Intl', city: 'Bengaluru (BLR)', lat: 13.1986, lng: 77.7066, riskScore: 64, fir: 'Chennai FIR', category: 'High Tech / CAT III-B' },
  { code: 'VOMM', name: 'Chennai Intl', city: 'Chennai (MAA)', lat: 12.9941, lng: 80.1709, riskScore: 68, fir: 'Chennai FIR', category: 'Bay of Bengal Radar' },
  { code: 'VECC', name: 'Netaji Subhash Chandra Bose Intl', city: 'Kolkata (CCU)', lat: 22.6547, lng: 88.4467, riskScore: 76, fir: 'Kolkata FIR', category: 'Kalbaishakhi Storms' },
  { code: 'VOHS', name: 'Rajiv Gandhi Intl', city: 'Hyderabad (HYD)', lat: 17.2403, lng: 78.4294, riskScore: 59, fir: 'Chennai FIR', category: 'Central Transit Hub' },
  { code: 'VOCI', name: 'Cochin Intl', city: 'Kochi, Kerala (COK)', lat: 10.1556, lng: 76.4019, riskScore: 73, fir: 'Chennai FIR', category: 'Monsoon Operations' },
  { code: 'VAAH', name: 'Sardar Vallabhbhai Patel Intl', city: 'Ahmedabad (AMD)', lat: 23.0734, lng: 72.6347, riskScore: 69, fir: 'Mumbai FIR', category: 'High Thermal Density' },
  { code: 'VIAR', name: 'Sri Guru Ram Dass Jee Intl', city: 'Amritsar (ATQ)', lat: 31.7096, lng: 74.7973, riskScore: 78, fir: 'Delhi FIR', category: 'Severe Winter Fog' },
  { code: 'VAGO', name: 'Manohar Intl Airport', city: 'Goa (GOX)', lat: 15.7667, lng: 73.8667, riskScore: 54, fir: 'Mumbai FIR', category: 'Coastal Approach' }
];

export const INITIAL_INCIDENTS = [
  {
    id: 'DGCA-2026-0891',
    title: 'Monsoon Cloudburst Microburst Encounter & Windshear TOGA Go-Around on RWY 27',
    flightNumber: 'AI-102',
    airline: 'Air India (AIC102)',
    aircraftType: 'Boeing 787-9 Dreamliner',
    registration: 'VT-EXG',
    origin: 'VIDP',
    destination: 'VABB',
    date: '2026-10-12T14:28:00Z',
    phase: 'Terminal Approach / Localizer',
    altitude: '1,200 ft AGL',
    speed: '142 kts',
    weather: 'Severe Southwest Monsoon squall, crosswind gusting 34 kts, runway water depth 5mm, Predictive Windshear Alert',
    category: 'Severe Monsoon Convective Weather / Cloudburst Squall',
    severity: 4,
    likelihood: 'C', // 4C -> Intolerable
    riskRating: 'intolerable',
    status: 'Investigation Active',
    reportedBy: 'Capt. Rajesh Sharma (Senior Commander)',
    narrative: 'While on final approach to Runway 27 at Mumbai CSMI during intense Southwest Monsoon downpour, aircraft encountered severe microburst with instantaneous airspeed loss of 22 knots and vertical sink rate spike to 1,400 fpm. Predictive Windshear Warning (PWS) triggered in cockpit. Flight crew executed immediate TOGA Go-Around, entered hold at DADAR waypoint, and successfully diverted to Ahmedabad. Occurrence filed under DGCA CAR Section 5 Series C Part I.',
    fdrSnippet: {
      peakG: '+2.41g / -0.82g',
      pitchVariation: '+6.2° to -4.1°',
      airspeedDelta: '±28 kts indicated',
      durationSeconds: 14
    },
    rootCauseAnalysis: {
      fiveWhys: [
        { level: 1, question: 'Why did the aircraft experience sudden severe structural buffeting?', answer: 'The aircraft penetrated an unforecast thermal mountain wave shear boundary at the jet stream flank.' },
        { level: 2, question: 'Why was the shear boundary not detected before encounter?', answer: 'Airborne weather radar does not detect moisture-free Clear Air Turbulence, and satellite turbulence models showed low probability.' },
        { level: 3, question: 'Why was there no prior PIREP (Pilot Report) from preceding traffic on NAT Track Z?', answer: 'The shear boundary shifted 40 nautical miles south within 35 minutes due to rapidly intensifying jet core velocity.' },
        { level: 4, question: 'Why were the cabin crew still securing trolleys in the aft galley?', answer: 'The automated predictive turbulence alert chime did not trigger early enough to grant the recommended 3-minute prep window.' },
        { level: 5, question: 'Why was the automated predictive turbulence algorithm threshold insufficiently conservative?', answer: 'Systemic flight dispatch software configuration had high eddy-dissipation-rate (EDR) thresholds to minimize nuisance route diversions.' }
      ],
      hfacsTags: ['PRE-ENV-PHY', 'PRE-ENV-TECH', 'ORG-PROC'],
      bowTie: {
        threats: [
          { name: '145-knot Jetstream core speed gradient', status: 'Active' },
          { name: 'Rapidly shifting shear boundary on NAT Track Z', status: 'Active' },
          { name: 'Lack of visible moisture / radar reflectivity', status: 'Active' }
        ],
        preventionBarriers: [
          { name: 'Meteorological SIGMET & Turbulence Forecast', status: 'Degraded', note: 'Underestimated boundary migration rate' },
          { name: 'Eddy Dissipation Rate (EDR) Telemetry Monitor', status: 'Degraded', note: 'Triggered alert 45s prior instead of 3m' },
          { name: 'Prior Flight Crew PIREP Sharing Network', status: 'Failed', note: 'Preceding flight was 48nm north' }
        ],
        topEvent: 'Uncontrolled Severe High-Altitude Turbulence Encounter (+2.4g / -0.8g)',
        mitigationBarriers: [
          { name: 'Flight Deck Fasten Seatbelt Sign Protocol', status: 'Effective', note: 'Passengers were securely seated; prevented major trauma' },
          { name: 'Fly-by-wire Flight Envelope Protection', status: 'Effective', note: 'Prevented stall or high-speed aerodynamic upset' },
          { name: 'ATC Oceanic Priority Altitude Change Request', status: 'Effective', note: 'Descended to smooth layer at FL340 within 90s' }
        ],
        consequences: [
          { name: '2 Crew Minor Injuries (Aft Galley)', status: 'Mitigated' },
          { name: 'Airframe Structural Overstress Inspection Required', status: 'Mitigated' },
          { name: 'Severe In-flight Loss of Control (Catastrophic)', status: 'Prevented' }
        ]
      }
    },
    capaActions: [
      {
        id: 'CAPA-2026-041',
        title: 'Recalibrate Dispatch EDR Turbulence Thresholds for Oceanic Tracks',
        assignee: 'Dir. Flight Dispatch & Met (Elena Rostova)',
        deadline: '2026-10-30',
        priority: 'High',
        status: 'In Progress',
        complianceStandard: 'ICAO Annex 3 & EASA AMC1 SPA.LVO.105'
      },
      {
        id: 'CAPA-2026-042',
        title: 'Mandatory Cabin Crew Fast-Stow Trolley SOP Revision under High EDR Advisories',
        assignee: 'Head of In-flight Safety (Capt. Liam Davis)',
        deadline: '2026-11-15',
        priority: 'Medium',
        status: 'Open',
        complianceStandard: 'FAA AC 120-88A'
      }
    ]
  },
  {
    id: 'DGCA-2026-0874',
    title: 'Dual Engine Black Kite Bird Ingestion during Initial Climb at 1,400 ft AGL',
    flightNumber: '6E-2041',
    airline: 'IndiGo (IGO2041)',
    aircraftType: 'Airbus A321neo',
    registration: 'VT-IML',
    origin: 'VIDP',
    destination: 'VOBL',
    date: '2026-10-10T09:14:00Z',
    phase: 'Initial Climb (0 - 10,000 ft)',
    altitude: '1,400 ft AGL',
    speed: '235 kts',
    weather: 'VMC, Wind 290/12kt, Temp 34°C, Black Kite bird flock observed in Najafgarh drain flyway corridor',
    category: 'Bird Strike / Wildlife Hazard (Black Kite / Stray Animal)',
    severity: 4,
    likelihood: 'B', // 4B -> Intolerable
    riskRating: 'intolerable',
    status: 'Root Cause Validated',
    reportedBy: 'First Officer Ananya Sen',
    narrative: 'During climb-out passing 1,400 ft AGL on Runway 29 departure corridor at Delhi, flight crew sighted a flock of Black Kites. Simultaneous impacts on both CFM LEAP-1A engines. Engine 1 vibration spiked to 4.8 units with burning odor in flight deck. Engine 2 sustained acoustic fan rub. Crew declared PAN-PAN, leveled off at 4,000 ft, executed engine vibration checklist, and safely performed precautionary overweight landing on Runway 28. DGCA Air Safety informed.',
    fdrSnippet: {
      engine1N1Vib: '4.85 units (Warning > 4.0)',
      engine2N1Vib: '1.20 units (Normal)',
      egtDelta: '+48°C on Engine 1',
      maxAltitudeReached: '4,000 ft MSL'
    },
    rootCauseAnalysis: {
      fiveWhys: [
        { level: 1, question: 'Why did both engines suffer bird strikes at 1,400 ft AGL?', answer: 'The departure corridor crossed an active low-altitude thermal soaring corridor of heavy Black Kites near open water drainage.' },
        { level: 2, question: 'Why was the flight crew unaware of the flock at that specific departure corridor?', answer: 'Airfield avian radar perimeter was restricted to 2 nautical miles and did not cover the extended climb gradient.' },
        { level: 3, question: 'Why was the wildlife hazard detection perimeter limited?', answer: 'Airports Authority of India (AAI) bird hazard laser scaring program was concentrated within the runway boundary fence.' },
        { level: 4, question: 'Why did ATC not issue an urgent bird strike vector advisory?', answer: 'ATC had received a PIREP from preceding departure 18 minutes prior but the hazard marker had expired in the local terminal radar display.' },
        { level: 5, question: 'Why did the hazard advisory expire prematurely?', answer: 'Local aerodrome SOP set wildlife advisory markers to auto-purge after 15 minutes unless manually renewed by Tower supervisor.' }
      ],
      hfacsTags: ['PRE-ENV-PHY', 'ORG-RES', 'SUP-DEF'],
      bowTie: {
        threats: [
          { name: 'Najafgarh basin open drainage black kite soaring flock', status: 'Active' },
          { name: 'Low departure corridor altitude window (1,400 ft)', status: 'Active' },
          { name: 'High CFM LEAP engine frontal intake surface area', status: 'Active' }
        ],
        preventionBarriers: [
          { name: 'Airfield Wildlife Patrol & Pyrotechnic Dispersal', status: 'Degraded', note: 'Patrol active at ground level, ineffective at 1,400 ft AGL' },
          { name: 'Avian Radar Alerting System', status: 'Failed', note: 'Out of perimeter range (>2 NM)' },
          { name: 'ATC Real-time Wildlife Advisory', status: 'Failed', note: 'Alert auto-expired 3 minutes prior' }
        ],
        topEvent: 'Dual Engine High-Energy Bird Ingestion at Low Altitude',
        mitigationBarriers: [
          { name: 'Engine Bird Ingestion Airworthiness Certification (CS-E 800)', status: 'Effective', note: 'Blades contained, no catastrophic uncontained disc failure' },
          { name: 'Flight Crew PAN-PAN Declaration & CRM Emergency Protocol', status: 'Effective', note: 'Maintained positive climb gradient on single reliable engine' },
          { name: 'Fuel Burn-off SOP & Immediate Precautionary Return', status: 'Effective', note: 'Safe landing within maximum landing weight margins' }
        ],
        consequences: [
          { name: 'Severe Engine Fan Blade Mechanical Damage ($1.2M)', status: 'Mitigated' },
          { name: 'Dual Engine Flameout & Forced Off-Field Landing', status: 'Prevented' },
          { name: 'Runway Closure & Delhi FIR Departure Delays', status: 'Mitigated' }
        ]
      }
    },
    capaActions: [
      {
        id: 'DGCA-CAPA-038',
        title: 'Upgrade Delhi Aerodrome Avian Radar Sensor Array to 3D Extended Range (0-5000 ft)',
        assignee: 'Airports Authority of India Wildlife Liaison (R. K. Verma)',
        deadline: '2026-12-01',
        priority: 'High',
        status: 'In Progress',
        complianceStandard: 'DGCA CAR Section 4, Series B & ICAO Doc 9137'
      },
      {
        id: 'DGCA-CAPA-039',
        title: 'Amend Delhi ATC Tower Wildlife Advisory Purge Protocol from 15m to 45m',
        assignee: 'Air Traffic Operations Supervisor (V. S. Nair)',
        deadline: '2026-10-25',
        priority: 'Medium',
        status: 'Closed & Verified',
        complianceStandard: 'DGCA Air Safety Circular 02/2024'
      }
    ]
  },
  {
    id: 'DGCA-2026-0842',
    title: 'TCAS Resolution Advisory (RA) - Loss of Separation along Airway Q24 (Nagpur FIR)',
    flightNumber: 'IX-412',
    airline: 'Air India Express (AXB412)',
    aircraftType: 'Boeing 737 MAX 8',
    registration: 'VT-BXA',
    origin: 'VOCI',
    destination: 'VIDP',
    date: '2026-10-06T16:51:00Z',
    phase: 'En-Route / Cruise (FL280 - FL410)',
    altitude: 'FL370 (37,000 ft)',
    speed: '450 kts',
    weather: 'VMC, Night flight, High-density crossing traffic over Nagpur VOR (Airways Q24 / N877)',
    category: 'TCAS Resolution Advisory (RA) / Loss of Separation',
    severity: 4,
    likelihood: 'B', // 4B -> Intolerable
    riskRating: 'intolerable',
    status: 'Investigation Active',
    reportedBy: 'Capt. Jean-Luc Moreau (Line Training Captain)',
    narrative: 'While cruising at FL370 on airway Q24 over Nagpur FIR, ATC cleared crossing traffic to FL360 without adequate lateral buffer. At 2.1 nautical miles lateral and 700 ft vertical distance, TCAS Level 3 Traffic Advisory escalated to Resolution Advisory "CLIMB! CLIMB NOW!". Pilot flying immediately disconnected autopilot and hand-flew an aggressive 2,200 ft/min climb matching green fly-to arc on PFD. Missed conflicting traffic by 520 ft vertical and 0.8 nm lateral. Occurrence notified immediately to DGCA Air Safety & AAIB India.',
    fdrSnippet: {
      closestPointOfApproach: '0.82 nm lateral, 520 ft vertical',
      tcasRAAlert: 'CLIMB, CLIMB (16:51:14Z)',
      crewReactionTime: '1.4 seconds to pitch up command',
      gLoadDuringManeuver: '+1.62g'
    },
    rootCauseAnalysis: {
      fiveWhys: [
        { level: 1, question: 'Why was minimum separation breached between IX412 and crossing traffic?', answer: 'Both aircraft were routed onto intersecting domestic airways without an automated route conflict warning.' },
        { level: 2, question: 'Why did the Nagpur en-route sector controller clear the flight without noticing conflict?', answer: 'The air traffic controller was managing two combined high-density sectors under high radio channel congestion during shift change.' },
        { level: 3, question: 'Why were the two ATC sectors combined during peak evening rush?', answer: 'Temporary staffing constraints during peak seasonal traffic demand.' },
        { level: 4, question: 'Why did the ground-based Short Term Conflict Alert (STCA) not trigger earlier?', answer: 'Ground-based STCA algorithm was set with a 15-second acoustic warning delay to avoid nuisance alarms in merging corridor.' },
        { level: 5, question: 'Why was the airborne TCAS RA the sole barrier that prevented collision?', answer: 'TCAS II Version 7.1 operates autonomously between aircraft Mode-S transponders, completely independent of ground radar controllers.' }
      ],
      hfacsTags: ['UA-DEC', 'PRE-COND-COG', 'PRE-PERS-CRM', 'ORG-RES'],
      bowTie: {
        threats: [
          { name: 'Intersecting domestic trunk airways (Q24/N877) in Central India FIR', status: 'Active' },
          { name: 'High controller workload & combined sector staffing at Nagpur ACC', status: 'Active' }
        ],
        preventionBarriers: [
          { name: 'ATC Radar Separation Vectoring', status: 'Failed', note: 'Controller did not detect convergent altitude trend' },
          { name: 'Ground Short-Term Conflict Alert (STCA)', status: 'Degraded', note: 'Delayed acoustic warning by 15 seconds' },
          { name: 'Flight Deck Visual Scan & Traffic Display', status: 'Degraded', note: 'Night conditions, visual traffic identification difficult' }
        ],
        topEvent: 'Loss of Separation Below Safety Minimums (520 ft / 0.8 nm)',
        mitigationBarriers: [
          { name: 'Airborne Collision Avoidance System (TCAS II v7.1)', status: 'Effective', note: 'Coordinated opposite sense climb/descend commands flawlessly' },
          { name: 'Flight Crew Immediate Compliance with RA Directive', status: 'Effective', note: 'Immediate disconnect of autopilot and compliance within 1.4s' }
        ],
        consequences: [
          { name: 'Airborne Mid-Air Collision (Catastrophic Loss)', status: 'Prevented' },
          { name: 'Passenger Anxiety / Abrupt Pitch Change', status: 'Mitigated' }
        ]
      }
    },
    capaActions: [
      {
        id: 'DGCA-CAPA-031',
        title: 'Revise Nagpur ACC Sector De-combining Standard Operating Procedures',
        assignee: 'Airports Authority of India (AAI) Air Traffic Management Board',
        deadline: '2026-11-01',
        priority: 'High',
        status: 'In Progress',
        complianceStandard: 'ICAO Doc 4444 (PANS-ATM)'
      },
      {
        id: 'CAPA-2026-032',
        title: 'Annual Flight Sim TCAS RA Rapid Compliance Refresher for Max 8 Fleet',
        assignee: 'Chief Flight Instructor (Capt. Eric Gomez)',
        deadline: '2026-11-30',
        priority: 'Medium',
        status: 'Open',
        complianceStandard: 'EASA CS-ACAS'
      }
    ]
  },
  {
    id: 'INC-2026-0810',
    title: 'Runway Incursion at Holding Point Charlie during Heavy Fog (CAT III)',
    flightNumber: 'SK-221',
    airline: 'SkyShield Air (SKY221)',
    aircraftType: 'Airbus A320neo',
    registration: 'PH-SKB',
    origin: 'EHAM',
    destination: 'EGLL',
    date: '2026-10-02T06:42:00Z',
    phase: 'Pushback & Taxi-Out',
    altitude: 'Ground (Elevation -11 ft)',
    speed: '8 kts taxi',
    weather: 'CAT III Low Visibility Procedures (LVP), RVR 150m, dense radiation fog, wet asphalt',
    category: 'Runway Incursion / Excursion',
    severity: 3,
    likelihood: 'C', // 3C -> Tolerable
    riskRating: 'tolerable',
    status: 'Root Cause Validated',
    reportedBy: 'Capt. Arjan Van Dijk',
    narrative: 'While taxiing in CAT III conditions (RVR 150m) to runway 18L via taxiway C, flight crew momentarily crossed the illuminated Runway Guard Lights (wig-wags) and entered the protected runway safety area by 12 meters before coming to a complete stop. Departure roll of inbound cargo aircraft on 18L was immediately aborted by Tower controller using Surface Movement Radar alert. No collision occurred; aircraft was instructed to hold position until tractor was dispatched.',
    fdrSnippet: {
      taxiSpeedAtHoldingPoint: '8.4 kts slowing to 0 kts',
      distancePastHoldingLine: '12.4 meters',
      runwayGuardLightState: 'Active / Functional',
      asmgcsAlertTriggerTime: '06:42:19Z'
    },
    rootCauseAnalysis: {
      fiveWhys: [
        { level: 1, question: 'Why did SK221 overshoot the runway 18L holding point?', answer: 'The crew misidentified taxiway intersection C4 for C3 in dense fog.' },
        { level: 2, question: 'Why did the crew misidentify the taxiway intersection?', answer: 'The airport moving map display (AMM) on the Electronic Flight Bag (EFB) suffered GPS lag.' },
        { level: 3, question: 'Why did the EFB suffer GPS positioning lag?', answer: 'The cockpit Bluetooth GPS antenna receiver had intermittent battery contact.' },
        { level: 4, question: 'Why did the crew rely on EFB without verifying painted ground signage?', answer: 'Painted surface markings were obscured by pooled rainwater and low morning visibility.' },
        { level: 5, question: 'Why were the automated Stop-Bar controllable lights not energized by ATC?', answer: 'Ground controller had omitted toggling the automated stop-bar switch due to high frequency workload.' }
      ],
      hfacsTags: ['UA-PER', 'PRE-ENV-PHY', 'PRE-ENV-TECH', 'SUP-DEF'],
      bowTie: {
        threats: [
          { name: 'CAT III Low Visibility (<150m RVR) Fog', status: 'Active' },
          { name: 'Complex high-density taxiway layout at Schiphol', status: 'Active' }
        ],
        preventionBarriers: [
          { name: 'Cockpit Electronic Flight Bag Airport Moving Map', status: 'Failed', note: 'GPS latency caused false position indication' },
          { name: 'Airfield Inset Stop-Bar Red Light Interlocks', status: 'Failed', note: 'Not energized by controller' },
          { name: 'Crew Visual Cross-check of Physical Signage', status: 'Degraded', note: 'Signage reflected glare in fog' }
        ],
        topEvent: 'Unauthorized Penetration of Protected Runway Safeguarding Area',
        mitigationBarriers: [
          { name: 'Advanced Surface Movement Guidance & Control System (A-SMGCS)', status: 'Effective', note: 'Detected intrusion and generated audible Tower alert' },
          { name: 'Tower Controller Immediate Takeoff Abort Instruction', status: 'Effective', note: 'Stopped departing Boeing 777F before reaching 50 knots' }
        ],
        consequences: [
          { name: 'High-speed Runway Collision (Catastrophic)', status: 'Prevented' },
          { name: 'Flight Clearance Suspension & Alcohol/Drug Testing', status: 'Mitigated' }
        ]
      }
    },
    capaActions: [
      {
        id: 'CAPA-2026-024',
        title: 'Install Hardwired Cockpit GPS Repeaters for All Fleet EFB Tablets',
        assignee: 'Fleet Avionics Engineering (Ing. Stefan Weber)',
        deadline: '2026-11-20',
        priority: 'High',
        status: 'In Progress',
        complianceStandard: 'FAA AC 120-76D'
      },
      {
        id: 'CAPA-2026-025',
        title: 'Mandate Dual-Stopbar Interlock Software System at EHAM Taxiway C',
        assignee: 'Schiphol Airport Safety Committee',
        deadline: '2026-12-15',
        priority: 'Medium',
        status: 'Open',
        complianceStandard: 'ICAO Doc 9870 (Runway Safety)'
      }
    ]
  },
  {
    id: 'INC-2026-0789',
    title: 'Dual Hydraulic Green & Yellow Low Pressure Indication on ILS Final',
    flightNumber: 'SK-550',
    airline: 'SkyShield Air (SKY550)',
    aircraftType: 'Airbus A330-300',
    registration: 'G-SKYS',
    origin: 'OMDB',
    destination: 'EGLL',
    date: '2026-09-28T18:05:00Z',
    phase: 'Terminal Approach / Localizer',
    altitude: '2,200 ft AGL',
    speed: '160 kts',
    weather: 'Wind 240@18G26kt, Rain showers, Cloud ceiling 1,200 ft',
    category: 'Avionics & Systems Failure',
    severity: 3,
    likelihood: 'B', // 3B -> Tolerable
    riskRating: 'tolerable',
    status: 'CAPA In Progress',
    reportedBy: 'Capt. Thomas Sterling',
    narrative: 'On 8 nm final for RWY 27R at Heathrow, crew configured gear down and Flaps 3. ECAM triggered HYD G + Y SYS LO PR. Alternate braking automatically armed. Crew executed ECAM action, confirmed Blue system was maintaining full flight control capability, and briefed emergency gravity gear extension. Aircraft touched down safely within touchdown zone; nosewheel steering was unavailable as designed, requiring runway tow to stand.',
    fdrSnippet: {
      greenHydraulicPressure: '620 PSI (Nominal 3,000 PSI)',
      yellowHydraulicPressure: '710 PSI (Nominal 3,000 PSI)',
      blueHydraulicPressure: '3,010 PSI (Nominal)',
      brakingMode: 'Alternate with Antiskid active'
    },
    rootCauseAnalysis: {
      fiveWhys: [
        { level: 1, question: 'Why did Green and Yellow hydraulic pressures drop below nominal?', answer: 'A common manifold coupling seal degraded after severe thermal cycling.' },
        { level: 2, question: 'Why did both seals degrade simultaneously?', answer: 'Both seals originated from the same defective vendor manufacturing batch installed during last C-Check.' },
        { level: 3, question: 'Why was the defective seal batch not identified during pre-installation QA?', answer: 'Component elastomer hardness certification was verified on paper without physical durometer sampling.' },
        { level: 4, question: 'Why did hydraulic telemetry not flag micro-leakage earlier in cruise?', answer: 'Reservoir quantity sensor damping algorithm smoothed out early gradual volume decreases.' },
        { level: 5, question: 'Why did the aircraft retain full pitch and roll control?', answer: 'Airbus 3-independent architecture ensures Blue system is isolated on separate engine and electric pumps.' }
      ],
      hfacsTags: ['ORG-RES', 'SUP-DEF'],
      bowTie: {
        threats: [
          { name: 'Defective batch of elastomer hydraulic seals', status: 'Active' },
          { name: 'High demand during landing gear extension and flap deployment', status: 'Active' }
        ],
        preventionBarriers: [
          { name: 'Maintenance C-Check Quality Assurance Inspection', status: 'Failed', note: 'Paperwork check only; failed to catch durometer fault' },
          { name: 'Hydraulic Reservoir Fluid Level Sensor Alert', status: 'Degraded', note: 'Damping algorithm smoothed out early trend' }
        ],
        topEvent: 'Dual Hydraulic System Pressure Loss on Terminal Approach',
        mitigationBarriers: [
          { name: 'Independent Triple Redundant Architecture (Blue System)', status: 'Effective', note: 'Flawlessly maintained primary flight surfaces' },
          { name: 'Alternate Braking & Accumulator Subsystem', status: 'Effective', note: 'Allowed full deceleration without runway overshoot' },
          { name: 'Crew ECAM Discipline & Briefed Tow Operation', status: 'Effective', note: 'Engine shutdown on runway prevented pump cavitation' }
        ],
        consequences: [
          { name: 'Runway 27R Blocked for 22 Minutes ($85k Tow fee)', status: 'Mitigated' },
          { name: 'Complete Loss of Flight Controls (Catastrophic)', status: 'Prevented' }
        ]
      }
    },
    capaActions: [
      {
        id: 'CAPA-2026-018',
        title: 'Fleet-wide Ultrasonic Durometer Inspection of All Hydraulic Seals Batch #882-C',
        assignee: 'Head of Fleet Maintenance (Robert K. Henderson)',
        deadline: '2026-10-20',
        priority: 'High',
        status: 'Closed & Verified',
        complianceStandard: 'EASA AD 2026-0198'
      }
    ]
  },
  {
    id: 'INC-2026-0765',
    title: 'Unauthorized Commercial Drone (UAS) Intrusion at 3,200 ft in Controlled CTR Airspace',
    flightNumber: 'SK-902',
    airline: 'SkyShield Air (SKY902)',
    aircraftType: 'Boeing 777-300ER',
    registration: 'A6-SKX',
    origin: 'WSSS',
    destination: 'OMDB',
    date: '2026-09-22T13:18:00Z',
    phase: 'Terminal Approach / Localizer',
    altitude: '3,200 ft AGL',
    speed: '175 kts',
    weather: 'Clear sky, CAVOK, 38°C ambient, light turbulence',
    category: 'Airspace Violation / Drone Intrusion',
    severity: 3,
    likelihood: 'D', // 3D -> Intolerable
    riskRating: 'intolerable',
    status: 'Investigation Active',
    reportedBy: 'Capt. Tariq Al-Mansoori',
    narrative: 'While established on ILS RWY 12L at Dubai International passing 3,200 ft, crew observed a multi-rotor commercial drone (approx 1 meter span, dark grey with orange rotors) pass down the right side of the aircraft at an estimated distance of 75-100 meters. Drone was operating directly inside the active approach corridor without transponder or Remote ID broadcast. Flight crew alerted Dubai Tower; airport operations suspended inbound arrivals on 12L for 18 minutes while state police deployed drone countermeasures.',
    fdrSnippet: {
      estimatedSeparation: '75 - 100 meters lateral',
      airspeedDuringIncident: '174 kts',
      flightPathDeviation: 'None (maintained stabilized glidepath)',
      droneAltitudeEstimate: '3,200 ft MSL'
    },
    rootCauseAnalysis: {
      fiveWhys: [
        { level: 1, question: 'Why was an unauthorized drone operating at 3,200 ft on the ILS glidepath?', answer: 'An unlicensed hobbyist deliberately bypassed manufacturer firmware geofencing restrictions.' },
        { level: 2, question: 'Why was the drone able to bypass manufacturer geofencing?', answer: 'Open-source unauthorized firmware exploit available online bypassed altitude ceilings.' },
        { level: 3, question: 'Why was the drone not detected prior to visual pilot sighting?', answer: 'Primary airport surveillance radar is tuned to filter out low-Doppler small radar cross-section objects.' },
        { level: 4, question: 'Why was RF spectrum counter-UAS sensor coverage incomplete?', answer: 'The perimeter RF detection sensors were obstructed by new terminal expansion cranes.' },
        { level: 5, question: 'Why was there no legal deterrence preventing the operator?', answer: 'Mandatory Remote-ID enforcement lacked automated signal triangulators in that sector.' }
      ],
      hfacsTags: ['UA-VIO-EXCEPT', 'PRE-ENV-TECH', 'ORG-PROC'],
      bowTie: {
        threats: [
          { name: 'Unregulated civilian drone operation near busy aerodrome', status: 'Active' },
          { name: 'Geofence-bypassed firmware modifications', status: 'Active' }
        ],
        preventionBarriers: [
          { name: 'UAS Manufacturer Software Geofencing', status: 'Failed', note: 'Hacked by user' },
          { name: 'Aero RF Perimeter Drone Detection Sensors', status: 'Degraded', note: 'Line-of-sight shadowed by construction' },
          { name: 'Civil Aviation Regulatory Flight Prohibition Zone', status: 'Failed', note: 'Deliberate breach' }
        ],
        topEvent: 'Near-Midair Drone Collision with Widebody Passenger Jet at 3,200 ft',
        mitigationBarriers: [
          { name: 'Cockpit Visual Vigilance & Immediate Tower Reporting', status: 'Effective', note: 'Alerted trailing aircraft to go-around' },
          { name: 'Airport Arrival Suspension & Police Interception Protocol', status: 'Effective', note: 'Prevented strike on following 6 aircraft' }
        ],
        consequences: [
          { name: 'Engine Ingestion / Windshield Penetration at 175 kts', status: 'Prevented' },
          { name: '18-Minute Airfield Approach Closure ($210k diversion cost)', status: 'Mitigated' }
        ]
      }
    },
    capaActions: [
      {
        id: 'CAPA-2026-015',
        title: 'Deploy High-Frequency Radio Jammer & Optical Drone Detection Mast at 12L Outer Marker',
        assignee: 'Dubai Aviation Security Division',
        deadline: '2026-11-10',
        priority: 'High',
        status: 'In Progress',
        complianceStandard: 'ICAO Annex 17 / UAE GCAA CAR OPS'
      }
    ]
  },
  {
    id: 'INC-2026-0731',
    title: 'High-Power Green Laser Illumination of Flight Deck during Night Visual Approach',
    flightNumber: 'SK-315',
    airline: 'SkyShield Air (SKY315)',
    aircraftType: 'Airbus A321LR',
    registration: 'JA-88SK',
    origin: 'RJTT',
    destination: 'RJAA',
    date: '2026-09-15T21:34:00Z',
    phase: 'Terminal Approach / Localizer',
    altitude: '1,400 ft AGL',
    speed: '142 kts',
    weather: 'Night, fine weather, visibility 20km, calm winds',
    category: 'Laser Illumination',
    severity: 3,
    likelihood: 'C', // 3C -> Tolerable
    riskRating: 'tolerable',
    status: 'Closed',
    reportedBy: 'Capt. Kenji Sato',
    narrative: 'On short final for Runway 34R at Tokyo Haneda, flight deck was targeted by three successive pulses of high-power green laser radiation from a residential area 2 nm south of the threshold. First Officer (Pilot Flying) suffered temporary flash-blindness in left eye. Captain immediately assumed control ("I have control"), shielded eyes, transitioned to instrument references, and continued stabilized approach to safe landing. First Officer underwent medical ophthalmology examination; full retinal recovery verified.',
    fdrSnippet: {
      laserDuration: '3 bursts of ~1.2s each',
      crewControlTransferTime: '0.8 seconds',
      flightPathDeviations: '0.1 dot on ILS glideslope',
      postLandingMedicalClearance: 'Verified normal vision'
    },
    rootCauseAnalysis: {
      fiveWhys: [
        { level: 1, question: 'Why was the flight deck blinded by laser radiation?', answer: 'A high-powered 5-watt handheld green laser was pointed into the cockpit from ground level.' },
        { level: 2, question: 'Why did the First Officer experience retinal flash-blindness?', answer: 'The pilot was looking outside scanning for runway threshold lights.' },
        { level: 3, question: 'Why did the incident not compromise flight trajectory?', answer: 'Captain immediately asserted control and flew solely by head-down flight instruments.' },
        { level: 4, question: 'Why was the perpetrator able to purchase a 5W industrial laser?', answer: 'E-commerce loophole permitted import of uncertified lasers labeled as astronomical pointers.' },
        { level: 5, question: 'Why did airport police apprehend the suspect within 12 minutes?', answer: 'Automated cockpit-directed infrared camera at Tokyo Tower triangulated GPS origin of the beam.' }
      ],
      hfacsTags: ['UA-PER', 'PRE-ENV-PHY', 'PRE-PERS-CRM'],
      bowTie: {
        threats: [
          { name: 'Ground laser targeting at low altitude night approach', status: 'Active' }
        ],
        preventionBarriers: [
          { name: 'Municipal Laser Weapon Sales Ban', status: 'Failed', note: 'Imported via online storefront' }
        ],
        topEvent: 'Flight Deck Optical Laser Illumination & Pilot Incapacitation',
        mitigationBarriers: [
          { name: 'Laser Glare Aviation Protective Eyewear (Available in flight bag)', status: 'Degraded', note: 'Not worn at time of illumination' },
          { name: 'Pilot CRM Immediate Transfer of Control Protocol', status: 'Effective', note: 'Executed within 0.8s' },
          { name: 'Automated Police Thermal Beam Triangulator', status: 'Effective', note: 'Suspect arrested in 12m' }
        ],
        consequences: [
          { name: 'Temporary Crew Retinal Flash Blindness', status: 'Mitigated' },
          { name: 'Catastrophic Night Runway Undershoot / Crash', status: 'Prevented' }
        ]
      }
    },
    capaActions: [
      {
        id: 'CAPA-2026-009',
        title: 'Mandate Anti-Laser HUD Film Coating for all A321 Fleet Windshields',
        assignee: 'Chief Avionics Engineer (Hiroshi Tanaka)',
        deadline: '2026-10-15',
        priority: 'Medium',
        status: 'Closed & Verified',
        complianceStandard: 'ICAO Doc 9815 (Laser Hazards)'
      }
    ]
  },
  {
    id: 'INC-2026-0698',
    title: 'Unscheduled Rapid Cabin Depressurization Alert with Oxygen Mask Deployment',
    flightNumber: 'SK-880',
    airline: 'SkyShield Air (SKY880)',
    aircraftType: 'Boeing 787-10 Dreamliner',
    registration: 'N790SK',
    origin: 'KJFK',
    destination: 'RJTT',
    date: '2026-09-08T03:12:00Z',
    phase: 'En-Route / Cruise (FL280 - FL410)',
    altitude: 'FL390 (39,000 ft)',
    speed: '488 kts',
    weather: 'Clear night, ambient temperature -54°C',
    category: 'Cabin Safety & Depressurization',
    severity: 4,
    likelihood: 'A', // 4A -> Tolerable
    riskRating: 'tolerable',
    status: 'Closed',
    reportedBy: 'Capt. Donald Ross',
    narrative: 'While cruising at FL390 near Anchorage, cabin altitude warning horn sounded when cabin altitude climbed past 10,000 ft at 1,400 fpm due to aft outflow valve mechanical actuator jamming in full-open position. Crew donned oxygen masks, deployed passenger masks at 14,000 ft cabin altitude, disconnected autothrottle, extended speedbrakes, and performed emergency descent to 10,000 ft in 3 minutes 40 seconds. Safely diverted to Ted Stevens Anchorage International Airport (PANC). No injuries.',
    fdrSnippet: {
      cabinClimbRate: '1,420 ft/min',
      peakCabinAltitude: '13,850 ft',
      emergencyDescentRate: '6,200 ft/min average',
      timeToFL100: '3 min 38 sec'
    },
    rootCauseAnalysis: {
      fiveWhys: [
        { level: 1, question: 'Why did cabin pressure deplete rapidly at FL390?', answer: 'The aft cabin outflow valve actuator jammed in the full-open position.' },
        { level: 2, question: 'Why did the outflow valve actuator jam open?', answer: 'Moisture ingress into the drive gearbox froze solid at cruise temperatures (-54°C).' },
        { level: 3, question: 'Why did moisture penetrate the drive gearbox?', answer: 'The silicone seal boot had split during high-pressure wash maintenance.' },
        { level: 4, question: 'Why did the backup DC manual drive motor not override the jam?', answer: 'Mechanical gear teeth were bound tight by ice expansion.' },
        { level: 5, question: 'Why did the emergency descent execute without passenger hypoxia?', answer: 'Automated passenger oxygen chemical generators deployed instantly and crew initiated 6,000 fpm descent without hesitation.' }
      ],
      hfacsTags: ['ORG-RES', 'PRE-ENV-PHY', 'SUP-DEF'],
      bowTie: {
        threats: [
          { name: 'Extreme sub-zero atmospheric temperatures (-54°C)', status: 'Active' },
          { name: 'Moisture contamination from ground washing', status: 'Active' }
        ],
        preventionBarriers: [
          { name: 'Aircraft High-Pressure Wash Masking Checklist', status: 'Failed', note: 'Washers failed to install outflow valve protective boot cover' },
          { name: 'Cabin Pressure Controller Dual Channel Self-Test', status: 'Degraded', note: 'Passed preflight warm test' }
        ],
        topEvent: 'Rapid Cabin Depressurization at FL390 with High Differential Pressure Loss',
        mitigationBarriers: [
          { name: 'Flight Deck Quick-Donning Oxygen Masks (3-Second Donning)', status: 'Effective', note: 'Crew 100% conscious' },
          { name: 'Automatic Cabin Oxygen Mask Drop Protocol', status: 'Effective', note: 'Deployed at 13,850 ft cabin alt' },
          { name: 'Emergency Rapid Descent High-Speed SOP (Speedbrakes Full, M0.85/330kt)', status: 'Effective', note: 'Reached safe air in 3m 38s' }
        ],
        consequences: [
          { name: 'Diversion to Anchorage ($140k hotel & rebooking costs)', status: 'Mitigated' },
          { name: 'Passenger/Crew Loss of Consciousness (Hypoxia Catastrophe)', status: 'Prevented' }
        ]
      }
    },
    capaActions: [
      {
        id: 'CAPA-2026-004',
        title: 'Revise Line Maintenance Wash Procedure to Install Rigid Outflow Valve Seal Covers',
        assignee: 'Line Maintenance Quality Manager',
        deadline: '2026-09-30',
        priority: 'High',
        status: 'Closed & Verified',
        complianceStandard: 'Boeing AMM 21-31-00'
      }
    ]
  },
  {
    id: 'INC-2026-0654',
    title: 'Severe Low-Level Windshear & Microburst Encounter Prompting Go-Around',
    flightNumber: 'SK-112',
    airline: 'SkyShield Air (SKY112)',
    aircraftType: 'ATR 72-600',
    registration: 'VT-SKA',
    origin: 'VABB',
    destination: 'VOBL',
    date: '2026-08-30T11:45:00Z',
    phase: 'Terminal Approach / Localizer',
    altitude: '450 ft AGL',
    speed: '115 kts',
    weather: 'Monsoon thunderstorm cell directly overhead, Wind 090@15kt shifting to 270@35G48kt, Heavy tropical deluge',
    category: 'Severe Turbulence / Weather',
    severity: 4,
    likelihood: 'C', // 4C -> Intolerable
    riskRating: 'intolerable',
    status: 'Closed',
    reportedBy: 'Capt. Rajesh Pillai',
    narrative: 'On short final for Runway 27 at Mumbai CSMI during severe monsoon squall, aircraft encountered a localized wet microburst at 450 ft. Indicated airspeed jumped from 115 kts to 142 kts (+27 kt headwind gain) followed immediately by severe downdraft (-1,800 fpm sink rate) and loss of 32 kts airspeed. Reactive Windshear Warning "WINDSHEAR! WINDSHEAR!" triggered on cockpit audio. Pilot flying immediately advanced power levers to ramp detent, commanded TOGA, pitched up to pitch limit indicator, and initiated a successful escape maneuver, clearing terrain by 280 ft.',
    fdrSnippet: {
      airspeedLoss: '-32 kts within 3.2 seconds',
      verticalDescentPeak: '-1,840 ft/min at 380 ft AGL',
      minimumTerrainClearance: '280 ft AGL',
      enginePowerApplication: '100% max continuous within 1.1s'
    },
    rootCauseAnalysis: {
      fiveWhys: [
        { level: 1, question: 'Why did the aircraft experience sudden sink rate and airspeed collapse?', answer: 'The aircraft penetrated the cold downdraft core of a collapsing monsoon thunderstorm.' },
        { level: 2, question: 'Why was the flight attempting approach during a severe squall?', answer: 'Preceding Boeing 777 landed without reporting windshear 90 seconds prior.' },
        { level: 3, question: 'Why did the ATR 72 suffer much worse performance penalty than the B777?', answer: 'Turboprop aircraft possess lower kinetic inertia and power-to-weight ratio than heavy widebody jets.' },
        { level: 4, question: 'Why did the aerodrome Terminal Doppler Weather Radar (TDWR) not issue an alert?', answer: 'Microburst originated below the 0.5-degree radar elevation scan plane.' },
        { level: 5, question: 'Why did the escape maneuver succeed with 280 ft clearance?', answer: 'Flight crew had completed seasonal monsoon simulator windshear recovery training 2 weeks prior.' }
      ],
      hfacsTags: ['PRE-ENV-PHY', 'UA-DEC'],
      bowTie: {
        threats: [
          { name: 'Monsoon convective cloud microburst downdraft', status: 'Active' },
          { name: 'Low altitude on final approach (450 ft AGL)', status: 'Active' }
        ],
        preventionBarriers: [
          { name: 'Airfield Terminal Doppler Weather Radar Alert', status: 'Degraded', note: 'Below scan floor' },
          { name: 'Preceding Flight Crew PIREP Report', status: 'Failed', note: 'Heavy jet felt only moderate chop' }
        ],
        topEvent: 'Microburst Encounter at Low Altitude with Severe Airspeed Loss (-32 kts)',
        mitigationBarriers: [
          { name: 'Onboard Reactive Windshear Detection System', status: 'Effective', note: 'Sounded audio alert in 0.4s' },
          { name: 'Pilot Immediate TOGA & Pitch-to-PLI Escape Maneuver', status: 'Effective', note: 'Averted CFIT by 280 ft' }
        ],
        consequences: [
          { name: 'Controlled Flight Into Terrain (CFIT Catastrophe)', status: 'Prevented' },
          { name: 'Diversion to Alternate Airport (VOBL)', status: 'Mitigated' }
        ]
      }
    },
    capaActions: [
      {
        id: 'CAPA-2026-001',
        title: 'Establish Strict Minimum Separation & Microburst Delay Policy behind Heavies in Monsoon',
        assignee: 'Airports Authority of India Safety Directorate',
        deadline: '2026-09-20',
        priority: 'High',
        status: 'Closed & Verified',
        complianceStandard: 'ICAO Doc 9859 Safety Management'
      }
    ]
  },
  {
    id: 'INC-2026-0622',
    title: 'Ground Towbar Shear Pin Failure and Nose Gear Torque Link Deflection',
    flightNumber: 'SK-401',
    airline: 'SkyShield Air (SKY401)',
    aircraftType: 'Airbus A350-1000',
    registration: 'D-ASKA',
    origin: 'EDDF',
    destination: 'KJFK',
    date: '2026-08-14T07:20:00Z',
    phase: 'Pushback & Taxi-Out',
    altitude: 'Ground (Elevation 364 ft)',
    speed: '3 kts pushback',
    weather: 'Damp apron, light drizzle, 14°C',
    category: 'Ground Handling & Ramp Safety',
    severity: 2,
    likelihood: 'C', // 2C -> Tolerable
    riskRating: 'tolerable',
    status: 'Closed',
    reportedBy: 'Ground Handling Lead (Hans Schmidt)',
    narrative: 'During pushback from Stand B42 at Frankfurt, tow tug operator executed sharp 75-degree turn while aircraft brakes were momentarily pressurized by flight deck during electrical transfer. Excessive rotational torque sheared the tug towbar mechanical fuse pin. Towbar impacted nose gear door, creating a 4-inch dent. Aircraft was stopped immediately. Passengers were deplaned; maintenance replaced shear pin and torque link assembly.',
    fdrSnippet: {
      pushbackSpeed: '2.8 kts',
      noseGearSteeringAngle: '74.2 degrees',
      brakePressureSpike: '1,800 PSI momentarily'
    },
    rootCauseAnalysis: {
      fiveWhys: [
        { level: 1, question: 'Why did the towbar shear pin break during pushback?', answer: 'The rotational torque exceeded the pin mechanical yield rating of 18,500 Nm.' },
        { level: 2, question: 'Why was excessive torque applied to the nose gear?', answer: 'The aircraft brake system was pressurized while the tug was continuing its turning arc.' },
        { level: 3, question: 'Why were the aircraft brakes pressurized during pushback?', answer: 'Flight crew tapped brakes instinctively when APU-to-engine electrical generator transfer flickered instrument screens.' },
        { level: 4, question: 'Why was headset interphone communication ineffective?', answer: 'High ramp background noise caused the ground engineer callout to be garbled.' },
        { level: 5, question: 'Why was a rigid towbar used instead of modern towbarless tug?', answer: 'The towbarless vehicle was undergoing scheduled hydraulic accumulator servicing.' }
      ],
      hfacsTags: ['UA-SKB', 'PRE-ENV-PHY', 'PRE-PERS-CRM'],
      bowTie: {
        threats: [
          { name: 'Tight apron turn geometry on Frankfurt Terminal 1', status: 'Active' },
          { name: 'Flight deck electrical transfer distraction', status: 'Active' }
        ],
        preventionBarriers: [
          { name: 'Ground-to-Flight Deck Interphone Standard Phraseology', status: 'Degraded', note: 'Ramp noise drowned warning' },
          { name: 'Nosewheel Steering Bypass Pin Installation', status: 'Effective', note: 'Bypass pin prevented hydraulic actuator rupture' }
        ],
        topEvent: 'Towbar Shear Pin Structural Failure during High-Angle Pushback',
        mitigationBarriers: [
          { name: 'Mechanical Fuse Pin Designed Breakaway', status: 'Effective', note: 'Pin sheared before nose gear barrel could fracture' },
          { name: 'Tug Operator Immediate Emergency Stop', status: 'Effective', note: 'Prevented tug from rolling under nose radome' }
        ],
        consequences: [
          { name: 'Nose Gear Door Dent ($14k repair)', status: 'Mitigated' },
          { name: 'Catastrophic Nose Gear Retraction / Collapse', status: 'Prevented' }
        ]
      }
    },
    capaActions: [
      {
        id: 'CAPA-2026-002',
        title: 'Upgrade Ground Headsets to Active Noise Canceling (ANC) DECT Wireless Systems',
        assignee: 'Frankfurt Station Operations Manager',
        deadline: '2026-09-15',
        priority: 'Medium',
        status: 'Closed & Verified',
        complianceStandard: 'IATA Ground Operations Manual (IGOM 4.2)'
      }
    ]
  }
];

export const SAFETY_PERFORMANCE_INDICATORS = {
  incidentRatePer10kHours: {
    current: 0.84,
    target: 1.20,
    unit: 'per 10k hrs',
    status: 'good',
    trend: '-14% YoY'
  },
  highRiskIntolerableEvents: {
    current: 4,
    target: 0,
    unit: 'active YTD',
    status: 'warning',
    trend: '+1 this quarter'
  },
  capaClosureRate: {
    current: 94.2,
    target: 90.0,
    unit: '% on-time',
    status: 'good',
    trend: '+3.1% YoY'
  },
  voluntaryReportingRatio: {
    current: 4.8,
    target: 4.0,
    unit: 'vol / mandatory',
    status: 'good',
    trend: 'Robust reporting culture'
  },
  meanTimeToResolveDays: {
    current: 18.4,
    target: 25.0,
    unit: 'days MTTR',
    status: 'good',
    trend: '-4.2 days vs 2025'
  }
};
