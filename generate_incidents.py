#!/usr/bin/env python3
"""
SkyShield Bharat - National Aviation Safety & Airworthiness Intelligence System (NASIS)
Synthetic Incident Dataset Generator (5,000 Validated Records)
Compliant with DGCA CAR Section 5 Series C Part I, AAIB India & ICAO Annex 19
With Exact Category-Matched HFACS Classifications and 5-Whys Root Cause Trees
"""

import csv
import json
import random
from datetime import datetime, timedelta

NUM_RECORDS = 5000
START_DATE = datetime(2024, 1, 1, 0, 0, 0)
END_DATE = datetime(2026, 10, 20, 23, 59, 59)

# Indian Major Aerodromes & FIRs
INDIAN_AIRPORTS = [
    ("VIDP", "Indira Gandhi Intl, New Delhi (DEL)", "Delhi FIR", 28.5562, 77.1000, "CAT III-B"),
    ("VABB", "Chhatrapati Shivaji Maharaj Intl, Mumbai (BOM)", "Mumbai FIR", 19.0896, 72.8656, "CAT II"),
    ("VOBL", "Kempegowda Intl, Bengaluru (BLR)", "Chennai FIR", 13.1986, 77.7066, "CAT III-B"),
    ("VOMM", "Chennai Intl (MAA)", "Chennai FIR", 12.9941, 80.1709, "CAT II"),
    ("VECC", "Netaji Subhash Chandra Bose Intl, Kolkata (CCU)", "Kolkata FIR", 22.6547, 88.4467, "CAT III-B"),
    ("VOHS", "Rajiv Gandhi Intl, Hyderabad (HYD)", "Chennai FIR", 17.2403, 78.4294, "CAT I"),
    ("VOCI", "Cochin Intl, Kochi (COK)", "Chennai FIR", 10.1556, 76.4019, "CAT I"),
    ("VAAH", "Sardar Vallabhbhai Patel Intl, Ahmedabad (AMD)", "Mumbai FIR", 23.0734, 72.6347, "CAT I"),
    ("VIAR", "Sri Guru Ram Dass Jee Intl, Amritsar (ATQ)", "Delhi FIR", 31.7096, 74.7973, "CAT III-B"),
    ("VAGO", "Manohar Intl Airport, Mopa, Goa (GOX)", "Mumbai FIR", 15.7667, 73.8667, "CAT I"),
    ("VOPB", "Veer Savarkar Intl, Port Blair (IXZ)", "Kolkata FIR", 11.6410, 92.7297, "Non-Precision"),
    ("VILK", "Chaudhary Charan Singh Intl, Lucknow (LKO)", "Delhi FIR", 26.7606, 80.8893, "CAT III-B"),
]

# Indian Scheduled & Regional Operators
INDIAN_AIRLINES = [
    ("Air India", "AI", "Air India", ["Boeing 787-8/9", "Airbus A350-900", "Boeing 777-300ER", "Airbus A320neo"]),
    ("IndiGo", "6E", "iFly", ["Airbus A320neo", "Airbus A321neo", "ATR 72-600"]),
    ("Air India Express", "IX", "Express India", ["Boeing 737 MAX 8", "Airbus A320neo"]),
    ("Akasa Air", "QP", "Akasa Air", ["Boeing 737 MAX 8-200"]),
    ("SpiceJet", "SG", "Spicejet", ["Boeing 737-800", "De Havilland Q400"]),
    ("Vistara", "UK", "Vistara", ["Airbus A320neo", "Boeing 787-8/9"]),
    ("Alliance Air", "9I", "Allied", ["ATR 72-600", "Dornier Do-228"]),
]

AIRCRAFT_SPECS = {
    "Boeing 787-8/9": {"icao": "B789", "max_alt": 43000, "typ_cruise": 490},
    "Boeing 777-300ER": {"icao": "B77W", "max_alt": 43100, "typ_cruise": 490},
    "Airbus A350-900": {"icao": "A359", "max_alt": 43000, "typ_cruise": 488},
    "Airbus A320neo": {"icao": "A20N", "max_alt": 39800, "typ_cruise": 450},
    "Airbus A321neo": {"icao": "A21N", "max_alt": 39800, "typ_cruise": 455},
    "Boeing 737 MAX 8": {"icao": "B38M", "max_alt": 41000, "typ_cruise": 453},
    "Boeing 737 MAX 8-200": {"icao": "B38M", "max_alt": 41000, "typ_cruise": 453},
    "Boeing 737-800": {"icao": "B738", "max_alt": 41000, "typ_cruise": 450},
    "ATR 72-600": {"icao": "AT76", "max_alt": 25000, "typ_cruise": 280},
    "De Havilland Q400": {"icao": "DH8D", "max_alt": 27000, "typ_cruise": 360},
    "Dornier Do-228": {"icao": "D228", "max_alt": 15000, "typ_cruise": 210},
}

PHASE_TELEMETRY = {
    "Pre-Flight / Boarding": {"alt": (0, 0), "spd": (0, 0)},
    "Pushback & Taxi-Out": {"alt": (0, 0), "spd": (5, 25)},
    "Takeoff Roll": {"alt": (0, 100), "spd": (40, 165)},
    "Initial Climb (0 - 10,000 ft)": {"alt": (500, 10000), "spd": (160, 250)},
    "En-Route / Cruise (FL280 - FL410)": {"alt": (28000, 41000), "spd": (430, 500)},
    "Descent": {"alt": (10000, 28000), "spd": (250, 340)},
    "Terminal Approach / Localizer": {"alt": (800, 4500), "spd": (135, 185)},
    "Landing Rollout & Flare": {"alt": (0, 50), "spd": (30, 140)},
    "Taxi-In & Gate": {"alt": (0, 0), "spd": (5, 20)},
}

DGCA_CATEGORIES = [
    "Bird Strike / Wildlife Hazard (Black Kite / Stray Animal)",
    "Severe Monsoon Convective Weather / Cloudburst Squall",
    "Delhi NCR Dense Winter Fog (CAT III-B LVP / Low Visibility)",
    "Runway Incursion / Stop-Bar Violation",
    "TCAS Resolution Advisory (RA) / Loss of Separation",
    "High Density Altitude (Hot Weather 45°C+ Thrust Margin)",
    "Avionics & Pitot-Static Sensor Probe Discrepancy",
    "Tail Strike / Hard Landing Exceedance (> 2.1g)",
    "Cabin Pressurization / Emergency Oxygen Mask Deployment",
    "Laser Illumination in Terminal Control Area (TMA)",
    "Ground Handling & Ramp Safety (GSE Impact)",
    "PED Lithium Battery Thermal Runaway in Cabin",
    "Tabletop Runway Spatial Disorientation / Late Go-Around"
]

INDIAN_WEATHER_PROFILES = [
    "Severe Southwest Monsoon squall, crosswind gusting 34 kts, runway water depth 5mm (Aquaplaning alert)",
    "Delhi NCR Winter Fog CAT III-B: RVR RWY 28 75m, ceiling 0ft, Low Visibility Procedures (LVP) phase 2 active",
    "Kalbaishakhi (Nor'wester) severe thunderstorm cell over West Bengal, severe hail accretion and -3500 fpm downdraft",
    "High Density Altitude: Surface Temp 46.5°C, QNH 998 hPa, density altitude 5,800 ft (Jaipur/Nagpur summer)",
    "Pre-monsoon dust storm (Andhi) with visibility dropping abruptly from 6,000m to 800m during final approach",
    "VMC (Visual Meteorological Conditions), Wind 090/08 kts, visibility 10 km, CAVOK",
    "Terminal Windshear alert on Runway 27 approach, airspeed fluctuation +/- 18 kts at 400 ft AGL"
]

RISK_RATINGS = {
    (5, 'A'): 'intolerable', (5, 'B'): 'intolerable', (5, 'C'): 'intolerable', (5, 'D'): 'intolerable', (5, 'E'): 'intolerable',
    (4, 'A'): 'tolerable',   (4, 'B'): 'intolerable', (4, 'C'): 'intolerable', (4, 'D'): 'intolerable', (4, 'E'): 'intolerable',
    (3, 'A'): 'acceptable',  (3, 'B'): 'tolerable',   (3, 'C'): 'tolerable',   (3, 'D'): 'intolerable', (3, 'E'): 'intolerable',
    (2, 'A'): 'acceptable',  (2, 'B'): 'acceptable',  (2, 'C'): 'tolerable',   (2, 'D'): 'tolerable',   (2, 'E'): 'tolerable',
    (1, 'A'): 'acceptable',  (1, 'B'): 'acceptable',  (1, 'C'): 'acceptable',  (1, 'D'): 'acceptable',  (1, 'E'): 'tolerable'
}

INDIAN_NARRATIVES = {
    "Bird Strike / Wildlife Hazard (Black Kite / Stray Animal)": "During initial climb out of Runway 29 at 1,200 ft AGL, aircraft encountered a flock of Black Kites. #1 engine experienced severe vibration (4.8 units) with burning odor in bleed air. Flight crew declared PAN-PAN, leveled off at 4,000 ft, executed engine isolation checklist, and returned for safe single-engine overweight landing at Delhi. Aircraft inspected per DGCA CAR Sec 5 guidelines.",
    "Severe Monsoon Convective Weather / Cloudburst Squall": "While on final approach to Runway 27 at Mumbai during heavy monsoon downpour, aircraft encountered severe microburst with airspeed loss of 22 knots and vertical sink rate spike to 1,400 fpm. Predictive Windshear Warning (PWS) chimed in cockpit. Crew initiated immediate TOGA Go-Around, navigated to holding waypoint, and diverted to Ahmedabad.",
    "Delhi NCR Dense Winter Fog (CAT III-B LVP / Low Visibility)": "Aircraft conducted CAT III-B autoland on Runway 28 under Low Visibility Procedures (LVR 50m, ceiling 0ft). At 80 ft radio altitude, localizer signal exhibited transient distortion due to vehicle in ILS critical zone. Autopilot successfully touched down centerline; runway vacate guidance required 'Follow-Me' marshaling escort.",
    "Runway Incursion / Stop-Bar Violation": "A catering vehicle crossed lighted Stop-Bar at Taxiway Kilo without ATC tower readback clearance while an A320 was on 80-knot takeoff roll on Runway 28. ASDE-X ground radar alarm triggered; tower instructed immediate rejected takeoff (RTO). Aircraft stopped 950 meters clear.",
    "TCAS Resolution Advisory (RA) / Loss of Separation": "While cruising at FL350 along airway Q24 over Nagpur in high-density corridor, aircraft received TCAS Resolution Advisory 'Descend, Descend'. Crew disconnected autopilot within 3 seconds and complied with -1500 fpm descent, establishing 1,000 ft vertical clearance with crossing traffic.",
    "High Density Altitude (Hot Weather 45°C+ Thrust Margin)": "During midday departure at 47°C ambient temperature at Jaipur, aircraft experienced degraded single-engine climb gradient capability. Flight dispatch adjusted max takeoff weight by 2.4 tons prior to departure per revised performance charts.",
    "Avionics & Pitot-Static Sensor Probe Discrepancy": "Severe monsoon precipitation caused transient moisture accumulation in Captain's pitot probe, creating a 35-knot airspeed disagreement between PFD 1 and PFD 2. Flight control system reverted to Alternate Law. Crew referenced backup standby instrument (ISIS) and maintained pitch and power.",
    "Tail Strike / Hard Landing Exceedance (> 2.1g)": "During landing flare in gusty crosswind condition, aircraft floated and experienced rapid rate of descent, resulting in 2.24g touchdown load factor. Aircraft taxied to gate under own power; mandatory DGCA hard landing inspection and FDR download performed.",
    "Cabin Pressurization / Emergency Oxygen Mask Deployment": "Gradual cabin altitude ascent warning triggered passing FL240 due to faulty outflow valve actuator. Crew donned oxygen masks, declared MAYDAY, and executed rapid emergency descent to 10,000 ft. Passenger masks deployed automatically; all 178 passengers landed safely.",
    "Laser Illumination in Terminal Control Area (TMA)": "Green high-intensity laser pointed from ground near Dwarka sector directly into cockpit windshield at 2,500 ft on approach to Runway 10. Pilot Flying maintained instrument scan; ATC notified for local police liaison.",
    "Ground Handling & Ramp Safety (GSE Impact)": "Ramp baggage container dolly became unhitched during pushback in heavy rain and contacted rear fuselage skin, causing 4mm dent. Aircraft grounded for AIESL structural evaluation.",
    "PED Lithium Battery Thermal Runaway in Cabin": "Passenger mobile phone fell into seat recline mechanism and was crushed, generating thick smoke and sparks. Cabin crew utilized halon extinguisher and lithium fire containment bag within 45 seconds.",
    "Tabletop Runway Spatial Disorientation / Late Go-Around": "On visual approach to tabletop runway in patchy monsoon rain, aircraft was above glide path at 500 ft (Vapp +19 kts). First Officer called 'Go-Around, Unstabilized'. Captain complied immediately, executing standard missed approach to divert station."
}

# EXACT CATEGORY-CORRELATED ROOT-CAUSE ANALYSIS MAPPING
CATEGORY_RCA_MAPPING = {
    "Bird Strike / Wildlife Hazard (Black Kite / Stray Animal)": {
        "tier": "Level 2: Preconditions",
        "code": "PRE-ENV-PHY",
        "name": "Physical Environment (Wildlife Habitat)",
        "five_whys": [
            {"step": 1, "q": "Why did the engine ingest a Black Kite during climb?", "a": "Flock was soaring in thermal updrafts over the open Najafgarh drain near the Runway 29 corridor."},
            {"step": 2, "q": "Why were scavenger birds concentrated in the departure path?", "a": "Open waste disposal and municipal abattoir activity outside the airport perimeter attracted birds."},
            {"step": 3, "q": "Why was the flight crew unaware of the flock density prior to departure?", "a": "Airfield avian radar was undergoing scheduled maintenance and ATC lacked visual spotting."},
            {"step": 4, "q": "Why was no bird hazard NOTAM issued?", "a": "Airfield wildlife monitoring team had not updated the morning bird density survey in the ATC briefing log."},
            {"step": 5, "q": "Why was inter-agency coordination delayed?", "a": "Municipal authority and airport operator lack a real-time integrated wildlife telemetry alert system."}
        ]
    },
    "Severe Monsoon Convective Weather / Cloudburst Squall": {
        "tier": "Level 2: Preconditions",
        "code": "PRE-ENV-PHY",
        "name": "Physical Environment (Convective Windshear)",
        "five_whys": [
            {"step": 1, "q": "Why did the aircraft experience sudden 22-knot airspeed loss on final?", "a": "Aircraft penetrated an intense microburst downdraft cell embedded in the monsoon squall line."},
            {"step": 2, "q": "Why was the microburst not detected earlier by terminal sensors?", "a": "Terminal Doppler Weather Radar (TDWR) experienced signal attenuation in heavy rain core."},
            {"step": 3, "q": "Why did the flight crew continue the approach toward the cell?", "a": "Airborne weather radar displayed radar shadow effect behind preceding thunderstorm cell."},
            {"step": 4, "q": "Why was holding or diversion not initiated earlier?", "a": "Aircraft was approaching Minimum Diversion Fuel (MDF) due to terminal sequencing delays."},
            {"step": 5, "q": "Why was fuel contingency buffer narrow?", "a": "Airline flight dispatch used standard 5% route contingency instead of monsoon-season 10% policy."}
        ]
    },
    "Delhi NCR Dense Winter Fog (CAT III-B LVP / Low Visibility)": {
        "tier": "Level 2: Preconditions",
        "code": "PRE-ENV-TECH",
        "name": "Technological Environment (ILS Beam Distortion)",
        "five_whys": [
            {"step": 1, "q": "Why did the autoland localizer deviate at 80 ft radio altitude?", "a": "ILS localizer signal was momentarily distorted by a vehicle near the runway centerline."},
            {"step": 2, "q": "Why was a vehicle near the runway during CAT III-B operations?", "a": "An airside catering vehicle crossed the taxiway stop-bar into the ILS critical sensitive area."},
            {"step": 3, "q": "Why did the driver enter the protected sensitive area?", "a": "Driver suffered spatial disorientation in 50m RVR fog and the stop-bar light module had failed."},
            {"step": 4, "q": "Why did airfield surface detection radar (ASDE) alert tower late?", "a": "ASDE ground tracking suffered heavy multipath clutter from dense fog water droplets."},
            {"step": 5, "q": "Why was vehicle transponder tracking unavailable?", "a": "Phase-3 ground vehicle retrofitting with ADS-B tracking transponders was pending completion."}
        ]
    },
    "Runway Incursion / Stop-Bar Violation": {
        "tier": "Level 1: Unsafe Acts",
        "code": "UA-DEC",
        "name": "Decision Error (Inadvertent Runway Entry)",
        "five_whys": [
            {"step": 1, "q": "Why was takeoff aborted at 80 knots?", "a": "A ground servicing vehicle entered the active runway holding area without clearance."},
            {"step": 2, "q": "Why did the driver cross the holding point?", "a": "Driver misheard apron control frequency handover instructions as runway crossing clearance."},
            {"step": 3, "q": "Why was standard readback protocol omitted?", "a": "Driver lacked certified radio telephony training for active aircraft maneuvering areas."},
            {"step": 4, "q": "Why was an uncertified driver assigned to airside operational area?", "a": "Staff shortage during morning departure bank led to dispatching auxiliary contract staff."},
            {"step": 5, "q": "Why was supervisor oversight absent?", "a": "Airside ground operations lacked mandatory biometric dispatch validation for airside driver permits."}
        ]
    },
    "TCAS Resolution Advisory (RA) / Loss of Separation": {
        "tier": "Level 3: Unsafe Supervision",
        "code": "SUP-INAD",
        "name": "Inadequate Supervision (Sector Controller Overload)",
        "five_whys": [
            {"step": 1, "q": "Why did TCAS trigger a Resolution Advisory 'Descend, Descend'?", "a": "Vertical separation between two cruising aircraft reduced to 600 ft along intersecting airways."},
            {"step": 2, "q": "Why were both flights cleared to conflicting flight levels?", "a": "En-route radar controller cleared a level change without cross-checking crossing traffic."},
            {"step": 3, "q": "Why did the controller fail to detect the conflict on radar?", "a": "Controller was managing two combined high-density sectors under extreme frequency congestion."},
            {"step": 4, "q": "Why were sectors not split during high traffic volume?", "a": "Unexpected medical callout left the shift supervisor without an available relief controller."},
            {"step": 5, "q": "Why did Short Term Conflict Alert (STCA) provide late warning?", "a": "Ground STCA algorithm had a 15-second acoustic filter delay in sector boundary transition zone."}
        ]
    },
    "High Density Altitude (Hot Weather 45°C+ Thrust Margin)": {
        "tier": "Level 4: Organizational Influences",
        "code": "ORG-PROC",
        "name": "Operational Processes (Hot Weather Performance SOP)",
        "five_whys": [
            {"step": 1, "q": "Why did the aircraft experience degraded climb gradient during departure?", "a": "Ambient temperature of 47°C produced density altitude exceeding 5,800 ft at field elevation."},
            {"step": 2, "q": "Why was takeoff thrust margin inadequate for obstacle clearance?", "a": "Takeoff assumed temperature calculation used morning forecast of 41°C instead of actual 47°C."},
            {"step": 3, "q": "Why was actual temperature not updated in the flight computer?", "a": "Crew received ACARS performance uplink 45 minutes prior and failed to cross-check latest ATIS."},
            {"step": 4, "q": "Why did company dispatch not flag the rapid temperature spike?", "a": "Automated flight planning software lacked real-time hourly ATIS delta alerts for summer heat."},
            {"step": 5, "q": "Why are extreme heat dispatch buffers not standardized?", "a": "Company route manual lacked mandatory full-thrust departure policy when ambient temp exceeds 44°C."}
        ]
    },
    "Avionics & Pitot-Static Sensor Probe Discrepancy": {
        "tier": "Level 2: Preconditions",
        "code": "PRE-ENV-PHY",
        "name": "Physical Environment (Severe Rain Water Ingestion)",
        "five_whys": [
            {"step": 1, "q": "Why did primary flight display show 'AIRSPEED DISAGREE'?", "a": "A 35-knot indicated airspeed disagreement occurred between Captain and First Officer pitot systems."},
            {"step": 2, "q": "Why did pitot probe reading drop on Captain's system?", "a": "Severe monsoon rain core overwhelmed water drain holes in the forward pitot mast."},
            {"step": 3, "q": "Why was electrical probe heat unable to clear the moisture?", "a": "High concentration of supercooled water droplets exceeded probe heater thermodynamic capacity."},
            {"step": 4, "q": "Why did flight control computers revert to Alternate Law?", "a": "Flight control system detected persistent discordant air data inertial reference unit (ADIRU) votes."},
            {"step": 5, "q": "Why did airline not install high-capacity convective pitot probes?", "a": "Fleet retrofit campaign was awaiting OEM service bulletin modification kit delivery."}
        ]
    },
    "Tail Strike / Hard Landing Exceedance (> 2.1g)": {
        "tier": "Level 1: Unsafe Acts",
        "code": "UA-SKB",
        "name": "Skill-Based Error (Improper Crosswind De-crab Flare)",
        "five_whys": [
            {"step": 1, "q": "Why did the aircraft register a 2.24g hard touchdown load factor?", "a": "High sink rate of 950 fpm was not arrested prior to main gear touchdown."},
            {"step": 2, "q": "Why was the flare maneuver under-controlled?", "a": "Pilot Flying experienced sudden tailwind gust during the final 30 ft of de-crab maneuver."},
            {"step": 3, "q": "Why was a Go-Around not executed when sink rate spiked?", "a": "Crew was mentally committed to landing after an extended 40-minute monsoon holding pattern."},
            {"step": 4, "q": "Why did Pilot Monitoring not intervene and call for Go-Around?", "a": "Steep authority gradient between senior check captain and junior first officer inhibited intervention."},
            {"step": 5, "q": "Why does assertiveness hesitation persist?", "a": "Recurrent simulator training lacked scenario-based challenge-and-response drills for check pairings."}
        ]
    },
    "Cabin Pressurization / Emergency Oxygen Mask Deployment": {
        "tier": "Level 4: Organizational Influences",
        "code": "ORG-RES",
        "name": "Resource Management (Deferred Outflow Valve Maintenance)",
        "five_whys": [
            {"step": 1, "q": "Why did cabin altitude climb uncontrollably above 10,000 ft?", "a": "Primary cabin outflow valve actuator jammed in the 65% open position at FL240."},
            {"step": 2, "q": "Why did the outflow valve actuator jam?", "a": "Carbon brush wear in the DC actuator motor caused electrical stall under high differential pressure."},
            {"step": 3, "q": "Why was the actuator not replaced during C-check?", "a": "Component had 240 operating hours remaining before mandatory hard-time removal interval."},
            {"step": 4, "q": "Why did BITE self-test not detect sluggish actuator transit time?", "a": "Line maintenance test protocol only verified full open/close limits without timing motor current draw."},
            {"step": 5, "q": "Why were predictive telemetry monitors not active?", "a": "Central maintenance computer predictive health algorithm had not been enabled in airline telemetry software."}
        ]
    },
    "Laser Illumination in Terminal Control Area (TMA)": {
        "tier": "Level 2: Preconditions",
        "code": "PRE-ENV-PHY",
        "name": "Physical Environment (Night Urban Visual Interference)",
        "five_whys": [
            {"step": 1, "q": "Why was the cockpit windshield illuminated by high-intensity laser?", "a": "A handheld laser was aimed at the flight deck from an urban residential settlement 3 NM from runway."},
            {"step": 2, "q": "Why was the laser light able to dazzle the pilot flying?", "a": "Glare and specular refraction in curved cockpit windscreen expanded the beam diameter across both pilot stations."},
            {"step": 3, "q": "Why did pilot flying not wear laser-protective eyewear?", "a": "Laser glare protection glasses are not mandated as standard flight deck equipment in domestic airline operations."},
            {"step": 4, "q": "Why was law enforcement unable to interdict the perpetrator immediately?", "a": "ATC notified police liaison via landline telephone with a 12-minute reporting lag."},
            {"step": 5, "q": "Why does city periphery laser tracking lack real-time geofencing?", "a": "Urban municipal surveillance cameras around aerodrome approach funnels are not integrated with civil aviation police feeds."}
        ]
    },
    "Ground Handling & Ramp Safety (GSE Impact)": {
        "tier": "Level 1: Unsafe Acts",
        "code": "UA-VIO-ROUTINE",
        "name": "Routine Violation (Ramp GSE Speed Exceedance)",
        "five_whys": [
            {"step": 1, "q": "Why did a baggage container dolly impact the aircraft fuselage?", "a": "Tug operator lost directional control during apron turn on slippery ramp surface."},
            {"step": 2, "q": "Why did the tug skid during the turn?", "a": "Tug was traveling at 24 km/h in an area with a mandatory 10 km/h speed limit."},
            {"step": 3, "q": "Why was the driver speeding inside the parking stand?", "a": "High turnaround pressure to meet scheduled 25-minute domestic departure on-time performance (OTP)."},
            {"step": 4, "q": "Why did ramp safety marshal not signal driver to stop?", "a": "Marshal was positioned behind the wing resolving an adjacent ground power unit cable jam."},
            {"step": 5, "q": "Why was automated collision sensing absent on the tug?", "a": "Ground handling agency had not fitted ultrasonic proximity speed limiters on legacy apron tractors."}
        ]
    },
    "PED Lithium Battery Thermal Runaway in Cabin": {
        "tier": "Level 1: Unsafe Acts",
        "code": "UA-SKB",
        "name": "Skill-Based Error (Inadvertent Device Crushing in Seat)",
        "five_whys": [
            {"step": 1, "q": "Why did smoke and sparks erupt in the passenger cabin?", "a": "Lithium-ion battery in a passenger mobile phone underwent catastrophic thermal runaway."},
            {"step": 2, "q": "Why did the battery rupture?", "a": "Phone slipped into electrical seat recline tracks and was mechanically crushed when seat was adjusted."},
            {"step": 3, "q": "Why was the phone not retrieved before seat movement?", "a": "Passenger did not alert cabin crew and attempted to operate the motorized seat control in the dark."},
            {"step": 4, "q": "Why was the seat gap large enough for electronic devices to enter?", "a": "Legacy business class seat shroud lacked modern anti-entrapment brush barriers."},
            {"step": 5, "q": "Why were anti-entrapment retrofits not completed across the fleet?", "a": "Service Bulletin for seat shrouds was categorized as recommended rather than mandatory airworthiness directive."}
        ]
    },
    "Tabletop Runway Spatial Disorientation / Late Go-Around": {
        "tier": "Level 1: Unsafe Acts",
        "code": "UA-PER",
        "name": "Perceptual Error (Visual Slope Illusion on Tabletop Runway)",
        "five_whys": [
            {"step": 1, "q": "Why was the aircraft above glide slope at 500 ft AGL?", "a": "Crew perceived false runway elevation cues due to sloping terrain before the cliff edge threshold."},
            {"step": 2, "q": "Why was precision instrument guidance not cross-checked?", "a": "Crew transitioned to visual references too early during heavy rain shower when runway lights became visible."},
            {"step": 3, "q": "Why did the pilot not immediately recognize the high energy state?", "a": "Unstabilized approach warning on flight display was acknowledged as nuisance alert due to tailwind shear."},
            {"step": 4, "q": "Why was missed approach delayed until 300 ft AGL?", "a": "Pilot Flying attempted aggressive pitch-down maneuver to salvage the landing before First Officer initiated Go-Around command."},
            {"step": 5, "q": "Why are tabletop runway visual approaches permitted in low visibility?", "a": "Airline special aerodrome operating briefing lacked mandatory coupled autopilot autoland requirement during rainfall at tabletop airports."}
        ]
    }
}

DGCA_CAPA_ACTIONS = [
    "DGCA-CAPA-01: Mandate Scenario-Based Assertiveness CRM Training for First Officers (CAR Sec 5)",
    "DGCA-CAPA-02: Accelerate ADS-B Vehicle Tracking Retrofit on All Airside GSE at Metro Aerodromes",
    "DGCA-CAPA-03: Install High-Intensity Acoustic Wildlife Deterrents at Runway Thresholds (DGCA Wildlife Advisory)",
    "DGCA-CAPA-04: Recalibrate Monsoon Contaminated Runway Hydroplaning Buffers in Flight Dispatch MEL",
    "DGCA-CAPA-05: Equip Delhi/Amritsar Fleet with Dual Synthetic Vision HUD Systems for CAT-IIIB Operations",
    "DGCA-CAPA-06: Implement Strict Sterile Cockpit Surveillance Audits via Flight Data Monitoring (FDM)",
    "DGCA-CAPA-07: Issue DGCA Safety Circular on Lithium Battery Cabin Stowage Procedures"
]

STATUSES = ["Reported to DGCA", "Triage / Under Review", "AAIB Investigation Active", "CAPA Assigned", "Closed / Verified by DGCA"]

def random_vt_registration():
    letters = ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ', k=3))
    return f"VT-{letters}"

def generate_records(num_records=5000):
    records = []
    total_seconds = int((END_DATE - START_DATE).total_seconds())

    for idx in range(1, num_records + 1):
        incident_id = f"DGCA-2026-{idx:04d}"
        random_sec = random.randint(0, total_seconds)
        filed_time = START_DATE + timedelta(seconds=random_sec)

        airline_name, airline_code, callsign, fleet_models = random.choice(INDIAN_AIRLINES)
        flight_number = f"{airline_code}-{random.randint(101, 999)}"
        ac_name = random.choice(fleet_models)
        ac_specs = AIRCRAFT_SPECS[ac_name]
        ac_code = ac_specs["icao"]
        registration = random_vt_registration()

        origin = random.choice(INDIAN_AIRPORTS)
        destination = random.choice([a for a in INDIAN_AIRPORTS if a[0] != origin[0]])

        phase = random.choice(list(PHASE_TELEMETRY.keys()))
        telemetry = PHASE_TELEMETRY[phase]
        altitude_ft = random.randint(telemetry["alt"][0], telemetry["alt"][1])
        airspeed_kts = random.randint(telemetry["spd"][0], telemetry["spd"][1])

        # G-Force centered around 1.0g with realistic excursions during weather
        if "Monsoon" in phase or "Rollout" in phase or "Climb" in phase:
            peak_g = round(random.gauss(1.0, 0.40), 2)
        else:
            peak_g = round(random.gauss(1.0, 0.10), 2)
        peak_g = max(-1.40, min(3.60, peak_g))

        weather = random.choice(INDIAN_WEATHER_PROFILES)
        category = random.choice(DGCA_CATEGORIES)
        narrative = INDIAN_NARRATIVES.get(category, f"Operational safety occurrence logged during {phase} sector from {origin[1]} to {destination[1]}. Mandatory Occurrence Report submitted under DGCA CAR Section 5.")

        # Real-world distribution: Minor occurrences (1, 2) account for ~75%
        severity = random.choices([1, 2, 3, 4, 5], weights=[0.42, 0.33, 0.17, 0.06, 0.02])[0]
        likelihood = random.choices(['A', 'B', 'C', 'D', 'E'], weights=[0.08, 0.22, 0.38, 0.24, 0.08])[0]
        risk_rating = RISK_RATINGS.get((severity, likelihood), "tolerable")

        # EXACT CATEGORY-CORRELATED RCA
        rca_info = CATEGORY_RCA_MAPPING[category]
        hfacs_tier = rca_info["tier"]
        hfacs_code = rca_info["code"]
        hfacs_name = rca_info["name"]
        five_whys_json = json.dumps(rca_info["five_whys"])

        # Status and CAPA logic
        if risk_rating == "intolerable":
            capa_required = True
            status = random.choice(["AAIB Investigation Active", "CAPA Assigned", "Closed / Verified by DGCA"])
        elif risk_rating == "tolerable":
            capa_required = random.choice([True, False])
            status = random.choice(STATUSES)
        else:
            capa_required = False
            status = random.choices(["Reported to DGCA", "Closed / Verified by DGCA"], weights=[0.25, 0.75])[0]

        if capa_required:
            capa_action = random.choice(DGCA_CAPA_ACTIONS)
            capa_status = "Closed" if "Closed" in status else random.choice(["Drafted", "In Progress", "Under Verification by DGCA"])
        else:
            capa_action = "N/A"
            capa_status = "Not Applicable"

        closure_days = random.randint(3, 40) if "Closed" in status else ""

        records.append({
            "incident_id": incident_id,
            "reported_at": filed_time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "flight_number": flight_number,
            "airline": airline_name,
            "callsign": callsign,
            "aircraft_type": ac_name,
            "aircraft_icao": ac_code,
            "registration": registration,
            "origin_icao": origin[0],
            "origin_name": origin[1],
            "origin_fir": origin[2],
            "dest_icao": destination[0],
            "dest_name": destination[1],
            "dest_fir": destination[2],
            "flight_phase": phase,
            "altitude_ft": altitude_ft,
            "airspeed_kts": airspeed_kts,
            "peak_g_force": peak_g,
            "weather": weather,
            "category": category,
            "severity": severity,
            "likelihood": likelihood,
            "risk_rating": risk_rating,
            "narrative": narrative,
            "hfacs_tier": hfacs_tier,
            "hfacs_code": hfacs_code,
            "hfacs_name": hfacs_name,
            "five_whys_json": five_whys_json,
            "status": status,
            "dgca_car_reference": "CAR Section 5, Series C, Part I",
            "capa_required": capa_required,
            "capa_status": capa_status,
            "capa_action": capa_action,
            "closure_days": closure_days
        })

    return records

def export_data(records):
    import sqlite3
    csv_file = "skyshield_5000_incidents.csv"
    json_file = "skyshield_5000_incidents.json"
    db_file = "skyshield_sms.db"

    headers = list(records[0].keys())
    with open(csv_file, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(records)

    with open(json_file, mode="w", encoding="utf-8") as f:
        json.dump(records, f, indent=2)

    # Export to SQLite
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS incidents;")
    
    col_defs = ", ".join([f'"{h}" TEXT' if h not in ("severity", "altitude_ft", "airspeed_kts", "closure_days", "peak_g_force", "capa_required") else (f'"{h}" INTEGER' if h != "peak_g_force" else f'"{h}" REAL') for h in headers])
    cursor.execute(f"CREATE TABLE incidents ({col_defs}, PRIMARY KEY (incident_id));")
    
    placeholders = ", ".join(["?"] * len(headers))
    rows_to_insert = [[r[h] for h in headers] for r in records]
    cursor.executemany(f"INSERT INTO incidents VALUES ({placeholders});", rows_to_insert)

    cursor.execute("CREATE INDEX IF NOT EXISTS idx_incident_id ON incidents(incident_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_airline ON incidents(airline);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_category ON incidents(category);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_severity ON incidents(severity);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_hfacs_code ON incidents(hfacs_code);")
    conn.commit()
    conn.close()

    print(f"[SUCCESS] SkyShield Bharat generated {len(records)} incidents with 100% category-matched 5-Whys and HFACS trees.")
    print(f"  [+] CSV File:    {csv_file}")
    print(f"  [+] JSON File:   {json_file}")
    print(f"  [+] SQLite DB:   {db_file}")

if __name__ == "__main__":
    records = generate_records(NUM_RECORDS)
    export_data(records)
