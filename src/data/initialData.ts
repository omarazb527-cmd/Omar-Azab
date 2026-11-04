import { AppState, HospitalUnit, UserAccount, WeeklyScheduleSlot } from '../types';

export const initialUsers: UserAccount[] = [
  {
    id: 1,
    name: 'م/ عمر فريد العزب',
    username: 'omar.azab',
    password: '123',
    role: 'ADMIN',
    roleTitle: 'مدير إدارة السلامة والصحة المهنية (Admin)',
    phone: '01009876543'
  },
  {
    id: 2,
    name: 'م/ أحمد نبيه',
    username: 'ahmed.nabeh',
    password: '123',
    role: 'TEAM_LEADER',
    roleTitle: 'Team Leader السلامة الميدانية',
    phone: '01001234567'
  },
  {
    id: 3,
    name: 'Ali Mohamed',
    username: 'ali.mohamed',
    password: '123',
    role: 'INSPECTOR',
    roleTitle: 'فني سلامة وصحة مهنية (Inspector)',
    phone: '01112233445'
  },
  {
    id: 4,
    name: 'Ahmed Abdelhamid',
    username: 'ahmed.abdelhamid',
    password: '123',
    role: 'INSPECTOR',
    roleTitle: 'فني سلامة وصحة مهنية (Inspector)',
    phone: '01223344556'
  },
  {
    id: 5,
    name: 'Sameh yousief',
    username: 'sameh.yousief',
    password: '123',
    role: 'INSPECTOR',
    roleTitle: 'فني سلامة وصحة مهنية (Inspector)',
    phone: '01556677889'
  },
  {
    id: 6,
    name: 'Abdel Megid Mkhimar',
    username: 'abdelmegid.mkhimar',
    password: '123',
    role: 'INSPECTOR',
    roleTitle: 'فني سلامة وصحة مهنية (Inspector)',
    phone: '01019988776'
  }
];

export const initialUnits: HospitalUnit[] = [
  {
    id: 1,
    name: 'Lab',
    code: 'UNIT-LAB',
    buildingFloor: 'Building A - Floor 1',
    riskLevel: 'High Risk',
    defaultShift: 'Day',
    assignedInspector: 'Ali Mohamed',
    backupInspector: 'Ahmed Abdelhamid',
    scheduledDays: ['Saturday'],
    checklist: [
      { id: 'c1', text: 'MSDS sheets available and updated for all reagents & chemicals' },
      { id: 'c2', text: 'Eye wash station tested, clean, and inspected with unobstructed access' },
      { id: 'c3', text: 'Bio-hazard waste bags and sharp disposal boxes intact and not overfilled (>75%)' },
      { id: 'c4', text: 'Chemical fume hood certified and airflow indicator normal' },
      { id: 'c5', text: 'Staff wearing appropriate PPE (Lab coat, nitrile gloves, safety goggles)' },
      { id: 'c6', text: 'Emergency exit doors unlocked from inside and corridors clear' },
      { id: 'c7', text: 'Fire extinguisher inspected, tagged, and pressure in green zone' }
    ]
  },
  {
    id: 2,
    name: 'CCU',
    code: 'UNIT-CCU',
    buildingFloor: 'Building A - Floor 3',
    riskLevel: 'High Risk',
    defaultShift: 'Night',
    assignedInspector: 'Ahmed Abdelhamid',
    backupInspector: 'Ali Mohamed',
    scheduledDays: ['Saturday'],
    checklist: [
      { id: 'c1', text: 'Medical gas outlets pressure (O2, Medical Air, Vacuum) within normal limits' },
      { id: 'c2', text: 'Emergency crash cart checked, sealed, and defibrillator functional' },
      { id: 'c3', text: 'Emergency exit doors unobstructed and illuminated exit signs working' },
      { id: 'c4', text: 'Isolated power system / electrical grounding monitors showing no faults' },
      { id: 'c5', text: 'Sharps safety boxes properly mounted and not exceeding fill line' },
      { id: 'c6', text: 'Patient call bell system functioning at every bed station' }
    ]
  },
  {
    id: 3,
    name: 'Chiller room',
    code: 'UNIT-CHILLER',
    buildingFloor: 'Service Building - Basement',
    riskLevel: 'High Risk',
    defaultShift: 'Day',
    assignedInspector: 'Ali Mohamed',
    backupInspector: 'Sameh yousief',
    scheduledDays: ['Saturday'],
    checklist: [
      { id: 'c1', text: 'Chiller operating pressures and temperature logs verified' },
      { id: 'c2', text: 'Refrigerant leak detection alarm system tested and operational' },
      { id: 'c3', text: 'Emergency ventilation exhaust fans operational and tested' },
      { id: 'c4', text: 'Electrical control panels closed, dry, and danger high voltage signs posted' },
      { id: 'c5', text: 'Hearing protection and face shield PPE available at entrance' },
      { id: 'c6', text: 'No water pooling or oil leaks on walkway surfaces' }
    ]
  },
  {
    id: 4,
    name: 'Pharmacy',
    code: 'UNIT-PHARM',
    buildingFloor: 'Building A - Ground Floor',
    riskLevel: 'Medium Risk',
    defaultShift: 'Night',
    assignedInspector: 'Ahmed Abdelhamid',
    backupInspector: 'Sameh yousief',
    scheduledDays: ['Saturday'],
    checklist: [
      { id: 'c1', text: 'Refrigerators temperature calibrated and daily temp log current (2-8°C)' },
      { id: 'c2', text: 'Room temperature and humidity monitored (<25°C, <60% RH)' },
      { id: 'c3', text: 'Narcotics and controlled drugs safe securely locked' },
      { id: 'c4', text: 'Flammable liquid storage cabinet grounded and closed' },
      { id: 'c5', text: 'Aisles and exit routes clear of shipping boxes and pallets' }
    ]
  },
  {
    id: 5,
    name: 'Ups Room',
    code: 'UNIT-UPS',
    buildingFloor: 'Building B - Basement',
    riskLevel: 'High Risk',
    defaultShift: 'Day',
    assignedInspector: 'Sameh yousief',
    backupInspector: 'Ali Mohamed',
    scheduledDays: ['Sunday'],
    checklist: [
      { id: 'c1', text: 'Battery terminals clean with zero acid leaks or corrosion' },
      { id: 'c2', text: 'Room temperature maintained below 22°C with dedicated AC' },
      { id: 'c3', text: 'Hydrogen gas detector tested and active' },
      { id: 'c4', text: 'Clean agent (FM200 / Aerosol) fire suppression system cylinder gauge normal' },
      { id: 'c5', text: 'Strictly zero combustible cardboard or storage items in room' }
    ]
  },
  {
    id: 6,
    name: 'GW 1 ( Sec. 2)',
    code: 'UNIT-GW1',
    buildingFloor: 'Building A - Floor 1',
    riskLevel: 'Medium Risk',
    defaultShift: 'Night',
    assignedInspector: 'Ahmed Abdelhamid',
    backupInspector: 'Abdel Megid Mkhimar',
    scheduledDays: ['Sunday'],
    checklist: [
      { id: 'c1', text: 'Patient corridors free of carts, wheelchairs, or trip hazards' },
      { id: 'c2', text: 'Fire doors self-closing mechanisms intact and not wedged open' },
      { id: 'c3', text: 'Emergency evacuation floor plans displayed prominently' },
      { id: 'c4', text: 'Zone oxygen shut-off valve box clear, labeled, and key accessible' },
      { id: 'c5', text: 'Bathrooms emergency pull cords reaching 10cm above floor' }
    ]
  },
  {
    id: 7,
    name: 'GIT',
    code: 'UNIT-GIT',
    buildingFloor: 'Building A - Floor 2',
    riskLevel: 'High Risk',
    defaultShift: 'Day',
    assignedInspector: 'Sameh yousief',
    backupInspector: 'Ali Mohamed',
    scheduledDays: ['Sunday'],
    checklist: [
      { id: 'c1', text: 'High-level disinfectant glutaraldehyde ventilation & fumes control' },
      { id: 'c2', text: 'Chemical spill kit and neutralizing agents fully stocked' },
      { id: 'c3', text: 'Scope reprocessing clean and dirty workflow segregation' },
      { id: 'c4', text: 'Medical suction units tested and bacterial filters valid' }
    ]
  },
  {
    id: 8,
    name: 'GW 2 ( Sec. 1)',
    code: 'UNIT-GW2',
    buildingFloor: 'Building A - Floor 2',
    riskLevel: 'Medium Risk',
    defaultShift: 'Night',
    assignedInspector: 'Ahmed Abdelhamid',
    backupInspector: 'Abdel Megid Mkhimar',
    scheduledDays: ['Sunday'],
    checklist: [
      { id: 'c1', text: 'Corridor clearance minimum 2.4m maintained' },
      { id: 'c2', text: 'Nurse station electrical circuits and telemetry wiring tidy' },
      { id: 'c3', text: 'Clean utility and dirty utility rooms separated and locked' },
      { id: 'c4', text: 'Fire hose reel cabinet unblocked and test tag updated' }
    ]
  },
  {
    id: 9,
    name: 'Boilers Room',
    code: 'UNIT-BOILERS',
    buildingFloor: 'Service Yard - Boiler House',
    riskLevel: 'High Risk',
    defaultShift: 'Day',
    assignedInspector: 'Ali Mohamed',
    backupInspector: 'Sameh yousief',
    scheduledDays: ['Sunday'],
    checklist: [
      { id: 'c1', text: 'Steam pressure gauge and high-pressure limit safety cut-off verified' },
      { id: 'c2', text: 'Safety relief valves tested and discharge piping secured' },
      { id: 'c3', text: 'Fuel oil piping and gas connections checked for leaks' },
      { id: 'c4', text: 'Blowdown tank and water softening treatment logs checked' },
      { id: 'c5', text: 'Emergency fuel shut-off push button unobstructed' }
    ]
  },
  {
    id: 10,
    name: 'GW 3',
    code: 'UNIT-GW3',
    buildingFloor: 'Building A - Floor 3',
    riskLevel: 'Medium Risk',
    defaultShift: 'Night',
    assignedInspector: 'Ahmed Abdelhamid',
    backupInspector: 'Abdel Megid Mkhimar',
    scheduledDays: ['Sunday'],
    checklist: [
      { id: 'c1', text: 'Patient rooms fire sprinkler heads clean with 45cm clearance' },
      { id: 'c2', text: 'Emergency exit stair door unlocked and latching smoothly' },
      { id: 'c3', text: 'Medication prep area clean and sharps safety box compliant' },
      { id: 'c4', text: 'Wet floor caution cones available in housekeeping pantry' }
    ]
  },
  {
    id: 11,
    name: 'Warehouse',
    code: 'UNIT-WAREHOUSE',
    buildingFloor: 'Central Logistics Depot',
    riskLevel: 'Medium Risk',
    defaultShift: 'Day',
    assignedInspector: 'Sameh yousief',
    backupInspector: 'Abdel Megid Mkhimar',
    scheduledDays: ['Monday'],
    checklist: [
      { id: 'c1', text: 'Storage stacking height maintains >= 45cm clearance below sprinkler heads' },
      { id: 'c2', text: 'Pallets stable, wrapped, and no damaged or leaning racks' },
      { id: 'c3', text: 'Forklift & pallet truck safety, charging area ventilated' },
      { id: 'c4', text: 'Electrical distribution boards clear by 1 meter radius' },
      { id: 'c5', text: 'CO2 & Dry Powder fire extinguishers inspected and accessible' }
    ]
  },
  {
    id: 12,
    name: 'ICU 1 ( Sec. 4)',
    code: 'UNIT-ICU1',
    buildingFloor: 'Main Building - Floor 2',
    riskLevel: 'High Risk',
    defaultShift: 'Night',
    assignedInspector: 'Abdel Megid Mkhimar',
    backupInspector: 'Ahmed Abdelhamid',
    scheduledDays: ['Monday'],
    checklist: [
      { id: 'c1', text: 'Medical gas terminal units pressure and alarms active' },
      { id: 'c2', text: 'Emergency ventilator backup batteries fully charged' },
      { id: 'c3', text: 'Isolated power ground-fault indicators tested' },
      { id: 'c4', text: 'Crash cart defibrillator functional and pads in-date' },
      { id: 'c5', text: 'Fire evacuation blankets and slide sheets readily available' }
    ]
  },
  {
    id: 13,
    name: 'OPD',
    code: 'UNIT-OPD',
    buildingFloor: 'Building B - Ground Floor',
    riskLevel: 'Low Risk',
    defaultShift: 'Day',
    assignedInspector: 'Sameh yousief',
    backupInspector: 'Ali Mohamed',
    scheduledDays: ['Monday'],
    checklist: [
      { id: 'c1', text: 'Patient waiting areas crowd safety and unobstructed walkways' },
      { id: 'c2', text: 'Wheelchairs available, clean, and wheel brakes functioning' },
      { id: 'c3', text: 'Emergency exit doors open without key from inside' },
      { id: 'c4', text: 'First aid kit stocked and easily identifiable' }
    ]
  },
  {
    id: 14,
    name: 'ICU 2 ( Sec 3)',
    code: 'UNIT-ICU2',
    buildingFloor: 'Main Building - Floor 2',
    riskLevel: 'High Risk',
    defaultShift: 'Night',
    assignedInspector: 'Abdel Megid Mkhimar',
    backupInspector: 'Ahmed Abdelhamid',
    scheduledDays: ['Monday'],
    checklist: [
      { id: 'c1', text: 'Zone valve box accessible and clearly labeled with room numbers' },
      { id: 'c2', text: 'Electrical multi-plug adapters strictly banned on medical devices' },
      { id: 'c3', text: 'Clinical waste segregation strictly compliant' },
      { id: 'c4', text: 'Fire exit corridor uncompromised by unused beds' }
    ]
  },
  {
    id: 15,
    name: 'Medical gas Station',
    code: 'UNIT-MEDGAS',
    buildingFloor: 'Service Compound - Ground Floor',
    riskLevel: 'High Risk',
    defaultShift: 'Day',
    assignedInspector: 'Sameh yousief',
    backupInspector: 'Ali Mohamed',
    scheduledDays: ['Monday'],
    checklist: [
      { id: 'c1', text: 'Oxygen liquid tank pressure and level indicator logged' },
      { id: 'c2', text: 'Cylinder manifolds (O2, N2O, Air) chained and secured upright' },
      { id: 'c3', text: 'Automatic switchover control panel functional with green power status' },
      { id: 'c4', text: 'Medical air compressors oil level and moisture separators drained' },
      { id: 'c5', text: 'Medical vacuum pumps operational with standby pump on auto' },
      { id: 'c6', text: 'Strict "No Smoking / No Grease / No Open Flame" signage posted' }
    ]
  },
  {
    id: 16,
    name: 'ICU 3',
    code: 'UNIT-ICU3',
    buildingFloor: 'Main Building - Floor 3',
    riskLevel: 'High Risk',
    defaultShift: 'Night',
    assignedInspector: 'Abdel Megid Mkhimar',
    backupInspector: 'Ahmed Abdelhamid',
    scheduledDays: ['Monday'],
    checklist: [
      { id: 'c1', text: 'Emergency evacuation pathway clear to exterior exit stair' },
      { id: 'c2', text: 'Oxygen analyzer and gas alarm repeaters operational' },
      { id: 'c3', text: 'Equipment grounding and preventive maintenance stickers valid' }
    ]
  },
  {
    id: 17,
    name: 'Cathlab',
    code: 'UNIT-CATHLAB',
    buildingFloor: 'Cardiac Wing - Floor 2',
    riskLevel: 'High Risk',
    defaultShift: 'Day',
    assignedInspector: 'Ali Mohamed',
    backupInspector: 'Ahmed Nabeh',
    scheduledDays: ['Tuesday'],
    checklist: [
      { id: 'c1', text: 'Radiation warning illuminated sign outside room triggers with X-ray' },
      { id: 'c2', text: 'Lead aprons and thyroid collars inspected with no cracks / hung properly' },
      { id: 'c3', text: 'Lead glass viewing window sealed and undamaged' },
      { id: 'c4', text: 'Medical gas and emergency contrast reaction kit verified' },
      { id: 'c5', text: 'Emergency stop push buttons operational' }
    ]
  },
  {
    id: 18,
    name: 'NICU',
    code: 'UNIT-NICU',
    buildingFloor: 'Pediatric Wing - Floor 2',
    riskLevel: 'High Risk',
    defaultShift: 'Night',
    assignedInspector: 'Ahmed Abdelhamid',
    backupInspector: 'Abdel Megid Mkhimar',
    scheduledDays: ['Tuesday'],
    checklist: [
      { id: 'c1', text: 'Incubators connected strictly to emergency red generator sockets' },
      { id: 'c2', text: 'Low sound level maintained and ambient lighting controlled' },
      { id: 'c3', text: 'Neonatal emergency evacuation apron / carrier bags ready' },
      { id: 'c4', text: 'Medical gas terminal units checked and calibrated' }
    ]
  },
  {
    id: 19,
    name: 'Main OR',
    code: 'UNIT-OR',
    buildingFloor: 'Surgical Block - Floor 2',
    riskLevel: 'High Risk',
    defaultShift: 'Day',
    assignedInspector: 'Ali Mohamed',
    backupInspector: 'Ahmed Nabeh',
    scheduledDays: ['Tuesday'],
    checklist: [
      { id: 'c1', text: 'Positive air pressure differential verified via pressure gauge' },
      { id: 'c2', text: 'Laminar airflow HEPA filters certified and clean' },
      { id: 'c3', text: 'Anesthetic Gas Scavenging System (AGSS) active during procedures' },
      { id: 'c4', text: 'Anti-static conductive flooring verified and grounded' },
      { id: 'c5', text: 'Laser safety goggles available when surgical laser in use' },
      { id: 'c6', text: 'Surgical smoke evacuator machine operational' },
      { id: 'c7', text: 'Isolated power system panel zero alarms' }
    ]
  },
  {
    id: 20,
    name: 'ER',
    code: 'UNIT-ER',
    buildingFloor: 'Building A - Ground Floor',
    riskLevel: 'High Risk',
    defaultShift: 'Night',
    assignedInspector: 'Ahmed Abdelhamid',
    backupInspector: 'Abdel Megid Mkhimar',
    scheduledDays: ['Tuesday'],
    checklist: [
      { id: 'c1', text: 'Ambulance bay access clear and patient drop-off unobstructed' },
      { id: 'c2', text: 'Decontamination shower operational with clear drainage' },
      { id: 'c3', text: 'Resuscitation room trauma equipment and gas lines verified' },
      { id: 'c4', text: 'Security panic button tested at reception triage' },
      { id: 'c5', text: 'Stretcher brakes inspected and side-rails functional' }
    ]
  },
  {
    id: 21,
    name: 'Electrical Room',
    code: 'UNIT-ELECTRICAL',
    buildingFloor: 'Technical Wing - Ground Floor',
    riskLevel: 'High Risk',
    defaultShift: 'Night',
    assignedInspector: 'Abdel Megid Mkhimar',
    backupInspector: 'Sameh yousief',
    scheduledDays: ['Tuesday'],
    checklist: [
      { id: 'c1', text: 'Electrical dielectric insulating rubber matting along all switchboards' },
      { id: 'c2', text: 'High voltage warning signs and single-line diagram displayed' },
      { id: 'c3', text: 'Zero water pipes, sprinkler heads or wet lines passing above panels' },
      { id: 'c4', text: 'Clean agent gaseous fire suppression cylinder pressure confirmed' },
      { id: 'c5', text: 'Panel doors locked and circuit breakers labeled' }
    ]
  },
  {
    id: 22,
    name: 'Radiology',
    code: 'UNIT-RAD',
    buildingFloor: 'Diagnostic Wing - Basement',
    riskLevel: 'High Risk',
    defaultShift: 'Day',
    assignedInspector: 'Ali Mohamed',
    backupInspector: 'Ahmed Nabeh',
    scheduledDays: ['Wednesday'],
    checklist: [
      { id: 'c1', text: 'Radiation warning illuminated door interlocks working' },
      { id: 'c2', text: 'Lead barriers intact and staff personal dosimeters (TLD) worn' },
      { id: 'c3', text: 'MRI zone access control strict (Zone III & IV 5-gauss line marked)' },
      { id: 'c4', text: 'Non-magnetic fire extinguisher (water mist) present in MRI' }
    ]
  },
  {
    id: 23,
    name: 'Laundry',
    code: 'UNIT-LAUNDRY',
    buildingFloor: 'Service Building - Basement',
    riskLevel: 'Medium Risk',
    defaultShift: 'Day',
    assignedInspector: 'Sameh yousief',
    backupInspector: 'Ali Mohamed',
    scheduledDays: ['Wednesday'],
    checklist: [
      { id: 'c1', text: 'Commercial washing machines emergency stop cords operational' },
      { id: 'c2', text: 'Dryer lint collection screens cleaned daily to prevent fire' },
      { id: 'c3', text: 'Automatic chemical dosing system enclosed with secondary containment' },
      { id: 'c4', text: 'Anti-slip perforated floor mats on wet working zones' },
      { id: 'c5', text: 'Clean and soiled linen areas strictly segregated' }
    ]
  },
  {
    id: 24,
    name: 'Elevator',
    code: 'UNIT-ELEVATOR',
    buildingFloor: 'Central Shafts 1 to 4',
    riskLevel: 'Medium Risk',
    defaultShift: 'Night',
    assignedInspector: 'Abdel Megid Mkhimar',
    backupInspector: 'Ahmed Abdelhamid',
    scheduledDays: ['Wednesday'],
    checklist: [
      { id: 'c1', text: 'Cabin emergency two-way intercom connected to security control' },
      { id: 'c2', text: 'Landing door interlocks and optical sensors tested' },
      { id: 'c3', text: 'Elevator machine room ventilated, dry, and fire extinguisher certified' },
      { id: 'c4', text: 'Elevator pit dry and pit stop switch operational' }
    ]
  },
  {
    id: 25,
    name: 'Stairwells',
    code: 'UNIT-STAIRS',
    buildingFloor: 'East & West Evacuation Stairs',
    riskLevel: 'Medium Risk',
    defaultShift: 'Night',
    assignedInspector: 'Abdel Megid Mkhimar',
    backupInspector: 'Ahmed Abdelhamid',
    scheduledDays: ['Wednesday'],
    checklist: [
      { id: 'c1', text: 'Self-closing fire doors latching completely with zero doorstops' },
      { id: 'c2', text: 'Emergency stair lighting and illuminated exit signs functioning' },
      { id: 'c3', text: 'Strictly zero storage under stair landings or in stairwells' },
      { id: 'c4', text: 'Stair handrails secure and floor identification signage visible' }
    ]
  },
  {
    id: 26,
    name: 'First Aid',
    code: 'UNIT-FIRSTAID',
    buildingFloor: 'All Departments Stations',
    riskLevel: 'Low Risk',
    defaultShift: 'Night',
    assignedInspector: 'Ahmed Abdelhamid',
    backupInspector: 'Abdel Megid Mkhimar',
    scheduledDays: ['Wednesday'],
    checklist: [
      { id: 'c1', text: 'First aid cabinet fully stocked per checklist without missing items' },
      { id: 'c2', text: 'All sterile bandages, antiseptics, and burn dressings in-date' },
      { id: 'c3', text: 'Logbook of first aid utilization maintained' }
    ]
  },
  {
    id: 27,
    name: 'CSSD',
    code: 'UNIT-CSSD',
    buildingFloor: 'Building A - Basement',
    riskLevel: 'High Risk',
    defaultShift: 'Day',
    assignedInspector: 'Ali Mohamed',
    backupInspector: 'Sameh yousief',
    scheduledDays: ['Thursday'],
    checklist: [
      { id: 'c1', text: 'Air pressure gradient: Decontamination (Negative) -> Clean -> Sterile (Positive)' },
      { id: 'c2', text: 'Autoclave biological indicator test results logged daily' },
      { id: 'c3', text: 'Steam autoclave safety interlocks and heat resistant gloves provided' },
      { id: 'c4', text: 'Chemical indicator strips stored away from sunlight and moisture' },
      { id: 'c5', text: 'Eye wash station inspected and unobstructed' }
    ]
  },
  {
    id: 28,
    name: 'Endoscopy',
    code: 'UNIT-ENDOSCOPY',
    buildingFloor: 'Building A - Floor 2',
    riskLevel: 'High Risk',
    defaultShift: 'Day',
    assignedInspector: 'Ali Mohamed',
    backupInspector: 'Sameh yousief',
    scheduledDays: ['Thursday'],
    checklist: [
      { id: 'c1', text: 'Chemical disinfection basin exhaust ventilation operational' },
      { id: 'c2', text: 'Staff wearing vapor respiratory mask and nitrile gloves' },
      { id: 'c3', text: 'Emergency suction and oxygen wall connections tested' }
    ]
  },
  {
    id: 29,
    name: 'Medical waste room',
    code: 'UNIT-WASTE',
    buildingFloor: 'External Service Yard',
    riskLevel: 'High Risk',
    defaultShift: 'Night',
    assignedInspector: 'Abdel Megid Mkhimar',
    backupInspector: 'Sameh yousief',
    scheduledDays: ['Thursday'],
    checklist: [
      { id: 'c1', text: 'Biohazard waste stored in labeled, puncture-proof red & yellow containers' },
      { id: 'c2', text: 'Refrigerated infectious waste storage unit running at <= 4°C' },
      { id: 'c3', text: 'Room kept locked with authorized personnel only access' },
      { id: 'c4', text: 'Wash-down hose, disinfectant drain trap and pest control active' },
      { id: 'c5', text: 'Manifest logs signed for licensed waste transport vehicle' }
    ]
  },
  {
    id: 30,
    name: 'Chemical store (HK)',
    code: 'UNIT-CHEMSTORE',
    buildingFloor: 'Housekeeping Compound',
    riskLevel: 'High Risk',
    defaultShift: 'Night',
    assignedInspector: 'Abdel Megid Mkhimar',
    backupInspector: 'Sameh yousief',
    scheduledDays: ['Thursday'],
    checklist: [
      { id: 'c1', text: 'Secondary containment spill pallets placed under all bulk chemical drums' },
      { id: 'c2', text: 'GHS hazard pictograms on every container; zero unlabelled bottles' },
      { id: 'c3', text: 'Mechanical exhaust ventilation running 24/7' },
      { id: 'c4', text: 'Chemical spill response kit complete and accessible' }
    ]
  },
  {
    id: 31,
    name: 'GW4',
    code: 'UNIT-GW4',
    buildingFloor: 'Building A - Floor 4',
    riskLevel: 'Medium Risk',
    defaultShift: 'Night',
    assignedInspector: 'Abdel Megid Mkhimar',
    backupInspector: 'Ahmed Abdelhamid',
    scheduledDays: ['Thursday'],
    checklist: [
      { id: 'c1', text: 'Patient corridors clear of linen hampers and excess equipment' },
      { id: 'c2', text: 'Fire alarm manual call points and break-glass units visible' },
      { id: 'c3', text: 'Nurse station oxygen emergency shutoff valve unobstructed' }
    ]
  },
  {
    id: 32,
    name: 'Chemical Spill Kit',
    code: 'UNIT-SPILLKIT',
    buildingFloor: 'Hospital Mobile Stations',
    riskLevel: 'Medium Risk',
    defaultShift: 'Day',
    assignedInspector: 'Sameh yousief',
    backupInspector: 'Ali Mohamed',
    scheduledDays: ['Friday'],
    checklist: [
      { id: 'c1', text: 'Neutralizer powders (Acid & Alkali) available and seals intact' },
      { id: 'c2', text: 'Absorbent pads, containment socks, and biohazard disposal bags complete' },
      { id: 'c3', text: 'Heavy duty nitrile gloves, splash goggles, and shoe covers in kit' },
      { id: 'c4', text: 'Standard Operating Procedure (SOP) quick instruction sheet legible' }
    ]
  },
  {
    id: 33,
    name: 'Eye washer and shower',
    code: 'UNIT-EYEWASH',
    buildingFloor: 'All High Risk Units',
    riskLevel: 'Medium Risk',
    defaultShift: 'Day',
    assignedInspector: 'Sameh yousief',
    backupInspector: 'Ali Mohamed',
    scheduledDays: ['Friday'],
    checklist: [
      { id: 'c1', text: 'Weekly flush test completed and water runs clear for 3 minutes' },
      { id: 'c2', text: 'Water flow rate and pattern covers both eyes simultaneously' },
      { id: 'c3', text: 'Water temperature tepid (16°C to 38°C)' },
      { id: 'c4', text: 'Inspection tag signed and dated with inspection tag attached' },
      { id: 'c5', text: 'Unimpeded pathway with zero obstruction within 10-second reach' }
    ]
  },
  {
    id: 34,
    name: 'Generator',
    code: 'UNIT-GENERATOR',
    buildingFloor: 'Power Plant Compound',
    riskLevel: 'High Risk',
    defaultShift: 'Night',
    assignedInspector: 'Ali Mohamed',
    backupInspector: 'Sameh yousief',
    scheduledDays: ['Friday'],
    checklist: [
      { id: 'c1', text: 'Diesel fuel main day tank level >= 75% capacity' },
      { id: 'c2', text: 'Starting lead-acid battery voltage and trickle charger verified' },
      { id: 'c3', text: 'Engine oil level, radiator coolant level, and block heater warm' },
      { id: 'c4', text: 'Automatic Transfer Switch (ATS) in "AUTO" mode' },
      { id: 'c5', text: 'Air intake louvers and exhaust silencer clear of obstructions' }
    ]
  },
  {
    id: 35,
    name: 'Fire pump room',
    code: 'UNIT-FIREPUMP',
    buildingFloor: 'Water Plant & Fire Pumphouse',
    riskLevel: 'High Risk',
    defaultShift: 'Night',
    assignedInspector: 'Ali Mohamed',
    backupInspector: 'Sameh yousief',
    scheduledDays: ['Friday'],
    checklist: [
      { id: 'c1', text: 'Jockey pump pressure maintains system static pressure' },
      { id: 'c2', text: 'Electric fire pump controller in "AUTOMATIC" mode with power on' },
      { id: 'c3', text: 'Diesel fire pump fuel tank full, battery sets 1 & 2 verified' },
      { id: 'c4', text: 'Suction and discharge control valves locked in wide-open position' },
      { id: 'c5', text: 'Water storage tank level verified at 100% capacity' }
    ]
  },
  {
    id: 36,
    name: 'Cooling tower',
    code: 'UNIT-COOLINGTOWER',
    buildingFloor: 'Roof Level',
    riskLevel: 'Medium Risk',
    defaultShift: 'Night',
    assignedInspector: 'Ali Mohamed',
    backupInspector: 'Sameh yousief',
    scheduledDays: ['Friday'],
    checklist: [
      { id: 'c1', text: 'Water treatment biocide dosing operational (Legionella prevention)' },
      { id: 'c2', text: 'Basin water clean, drift eliminators clean without bio-film' },
      { id: 'c3', text: 'Fan motors vibration and safety guard cages secure' },
      { id: 'c4', text: 'Roof access safety ladder and fall protection harness anchor tested' }
    ]
  }
];

export const initialScheduleSlots: WeeklyScheduleSlot[] = [
  // Saturday
  { id: 1, dayOfWeek: 'Saturday', shift: 'نهاري (08:00 AM - 08:00 PM)', departmentName: 'Lab', inspectorName: 'Ali Mohamed', roundType: 'مرور بيئة الرعاية (EOC)' },
  { id: 2, dayOfWeek: 'Saturday', shift: 'نهاري (08:00 AM - 08:00 PM)', departmentName: 'Chiller room', inspectorName: 'Ali Mohamed', roundType: 'فحص أنظمة التشغيل والسلامة' },
  { id: 3, dayOfWeek: 'Saturday', shift: 'ليلي (08:00 PM - 08:00 AM)', departmentName: 'CCU', inspectorName: 'Ahmed Abdelhamid', roundType: 'مرور بيئة الرعاية (EOC)' },
  { id: 4, dayOfWeek: 'Saturday', shift: 'ليلي (08:00 PM - 08:00 AM)', departmentName: 'Pharmacy', inspectorName: 'Ahmed Abdelhamid', roundType: 'فحص السلامة الكيميائية والتخزين' },

  // Sunday
  { id: 5, dayOfWeek: 'Sunday', shift: 'نهاري (08:00 AM - 08:00 PM)', departmentName: 'Ups Room', inspectorName: 'Sameh yousief', roundType: 'فحص السلامة الكهربائية وأنظمة الغاز' },
  { id: 6, dayOfWeek: 'Sunday', shift: 'نهاري (08:00 AM - 08:00 PM)', departmentName: 'GIT', inspectorName: 'Sameh yousief', roundType: 'إدارة المواد الخطرة والنفايات' },
  { id: 7, dayOfWeek: 'Sunday', shift: 'نهاري (08:00 AM - 08:00 PM)', departmentName: 'Boilers Room', inspectorName: 'Ali Mohamed', roundType: 'فحص السلامة الميكانيكية والضغط' },
  { id: 8, dayOfWeek: 'Sunday', shift: 'ليلي (08:00 PM - 08:00 AM)', departmentName: 'GW 1 ( Sec. 2)', inspectorName: 'Ahmed Abdelhamid', roundType: 'مرور سلامة المرضى ومسارات الإخلاء' },
  { id: 9, dayOfWeek: 'Sunday', shift: 'ليلي (08:00 PM - 08:00 AM)', departmentName: 'GW 2 ( Sec. 1)', inspectorName: 'Ahmed Abdelhamid', roundType: 'مرور سلامة المرضى ومسارات الإخلاء' },
  { id: 10, dayOfWeek: 'Sunday', shift: 'ليلي (08:00 PM - 08:00 AM)', departmentName: 'GW 3', inspectorName: 'Ahmed Abdelhamid', roundType: 'مرور سلامة المرضى ومسارات الإخلاء' },

  // Monday
  { id: 11, dayOfWeek: 'Monday', shift: 'نهاري (08:00 AM - 08:00 PM)', departmentName: 'Warehouse', inspectorName: 'Sameh yousief', roundType: 'فحص التخزين والسلامة من الحريق' },
  { id: 12, dayOfWeek: 'Monday', shift: 'نهاري (08:00 AM - 08:00 PM)', departmentName: 'OPD', inspectorName: 'Sameh yousief', roundType: 'مرور بيئة الرعاية (EOC)' },
  { id: 13, dayOfWeek: 'Monday', shift: 'نهاري (08:00 AM - 08:00 PM)', departmentName: 'Medical gas Station', inspectorName: 'Sameh yousief', roundType: 'فحص شبكات الغازات الطبية المركزية' },
  { id: 14, dayOfWeek: 'Monday', shift: 'ليلي (08:00 PM - 08:00 AM)', departmentName: 'ICU 1 ( Sec. 4)', inspectorName: 'Abdel Megid Mkhimar', roundType: 'مرور بيئة الرعاية (EOC)' },
  { id: 15, dayOfWeek: 'Monday', shift: 'ليلي (08:00 PM - 08:00 AM)', departmentName: 'ICU 2 ( Sec 3)', inspectorName: 'Abdel Megid Mkhimar', roundType: 'مرور بيئة الرعاية (EOC)' },
  { id: 16, dayOfWeek: 'Monday', shift: 'ليلي (08:00 PM - 08:00 AM)', departmentName: 'ICU 3', inspectorName: 'Abdel Megid Mkhimar', roundType: 'مرور بيئة الرعاية (EOC)' },

  // Tuesday
  { id: 17, dayOfWeek: 'Tuesday', shift: 'نهاري (08:00 AM - 08:00 PM)', departmentName: 'Cathlab', inspectorName: 'Ali Mohamed', roundType: 'فحص السلامة الإشعاعية والبيئية' },
  { id: 18, dayOfWeek: 'Tuesday', shift: 'نهاري (08:00 AM - 08:00 PM)', departmentName: 'Main OR', inspectorName: 'Ali Mohamed', roundType: 'مرور بيئة الرعاية والضغط الإيجابي' },
  { id: 19, dayOfWeek: 'Tuesday', shift: 'ليلي (08:00 PM - 08:00 AM)', departmentName: 'NICU', inspectorName: 'Ahmed Abdelhamid', roundType: 'مرور سلامة بيئة الرعاية' },
  { id: 20, dayOfWeek: 'Tuesday', shift: 'ليلي (08:00 PM - 08:00 AM)', departmentName: 'ER', inspectorName: 'Ahmed Abdelhamid', roundType: 'مرور قسم الطوارئ والاستقبال' },
  { id: 21, dayOfWeek: 'Tuesday', shift: 'ليلي (08:00 PM - 08:00 AM)', departmentName: 'Electrical Room', inspectorName: 'Abdel Megid Mkhimar', roundType: 'فحص السلامة الكهربائية والمحولات' },

  // Wednesday
  { id: 22, dayOfWeek: 'Wednesday', shift: 'نهاري (08:00 AM - 08:00 PM)', departmentName: 'Radiology', inspectorName: 'Ali Mohamed', roundType: 'فحص السلامة الإشعاعية' },
  { id: 23, dayOfWeek: 'Wednesday', shift: 'نهاري (08:00 AM - 08:00 PM)', departmentName: 'Laundry', inspectorName: 'Sameh yousief', roundType: 'فحص المواد الخطرة ومعدات الغسيل' },
  { id: 24, dayOfWeek: 'Wednesday', shift: 'ليلي (08:00 PM - 08:00 AM)', departmentName: 'Elevator', inspectorName: 'Abdel Megid Mkhimar', roundType: 'فحص أنظمة المصاعد ووسائل الطوارئ' },
  { id: 25, dayOfWeek: 'Wednesday', shift: 'ليلي (08:00 PM - 08:00 AM)', departmentName: 'Stairwells', inspectorName: 'Abdel Megid Mkhimar', roundType: 'فحص مسالك الهروب وأبواب الحريق' },
  { id: 26, dayOfWeek: 'Wednesday', shift: 'ليلي (08:00 PM - 08:00 AM)', departmentName: 'First Aid', inspectorName: 'Ahmed Abdelhamid', roundType: 'فحص وجاهزية حقائب الإسعافات' },

  // Thursday
  { id: 27, dayOfWeek: 'Thursday', shift: 'نهاري (08:00 AM - 08:00 PM)', departmentName: 'CSSD', inspectorName: 'Ali Mohamed', roundType: 'مرور بيئة الرعاية والتعقيم المركزي' },
  { id: 28, dayOfWeek: 'Thursday', shift: 'نهاري (08:00 AM - 08:00 PM)', departmentName: 'Endoscopy', inspectorName: 'Ali Mohamed', roundType: 'إدارة المواد الخطرة والتطهير' },
  { id: 29, dayOfWeek: 'Thursday', shift: 'ليلي (08:00 PM - 08:00 AM)', departmentName: 'Medical waste room', inspectorName: 'Abdel Megid Mkhimar', roundType: 'فحص غرفة تجميع النفايات الطبية' },
  { id: 30, dayOfWeek: 'Thursday', shift: 'ليلي (08:00 PM - 08:00 AM)', departmentName: 'Chemical store (HK)', inspectorName: 'Abdel Megid Mkhimar', roundType: 'فحص مخزن المواد الكيميائية' },
  { id: 31, dayOfWeek: 'Thursday', shift: 'ليلي (08:00 PM - 08:00 AM)', departmentName: 'GW4', inspectorName: 'Abdel Megid Mkhimar', roundType: 'مرور سلامة المرضى ومسارات الإخلاء' },

  // Friday
  { id: 32, dayOfWeek: 'Friday', shift: 'نهاري (08:00 AM - 08:00 PM)', departmentName: 'Chemical Spill Kit', inspectorName: 'Sameh yousief', roundType: 'فحص جاهزية أطقم انسكاب الكيماويات' },
  { id: 33, dayOfWeek: 'Friday', shift: 'نهاري (08:00 AM - 08:00 PM)', departmentName: 'Eye washer and shower', inspectorName: 'Sameh yousief', roundType: 'اختبار دوش الطوارئ ومغاسل العيون' },
  { id: 34, dayOfWeek: 'Friday', shift: 'ليلي (08:00 PM - 08:00 AM)', departmentName: 'Generator', inspectorName: 'Ali Mohamed', roundType: 'فحص مولدات الطوارئ ومستوى الديزل' },
  { id: 35, dayOfWeek: 'Friday', shift: 'ليلي (08:00 PM - 08:00 AM)', departmentName: 'Fire pump room', inspectorName: 'Ali Mohamed', roundType: 'فحص واختبار مضخات الحريق' },
  { id: 36, dayOfWeek: 'Friday', shift: 'ليلي (08:00 PM - 08:00 AM)', departmentName: 'Cooling tower', inspectorName: 'Ali Mohamed', roundType: 'فحص أبراج التبريد ومكافحة الليجيونيلا' }
];

export const initialAppState: AppState = {
  users: initialUsers,
  units: initialUnits,
  weeklySchedule: initialScheduleSlots,

  signers: {
    teamLeader: {
      name: 'م/ أحمد نبيه',
      title: 'Team Leader السلامة الميدانية'
    },
    safetyDirector: {
      name: 'م/ عمر فريد العزب',
      title: 'مدير إدارة السلامة والصحة المهنية'
    },
    opsDirector: {
      name: '',
      title: 'مدير التشغيل'
    },
    ceoDirector: {
      name: '',
      title: 'المدير التنفيذي للمستشفى'
    }
  },

  inspections: [],
  incidents: [],
  ncrs: [],
  kpis: [],
  activityLog: [],

  lastUpdated: new Date().toISOString()
};

