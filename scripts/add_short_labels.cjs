#!/usr/bin/env node
// node scripts/add_short_labels.cjs
// Adds shortLabel to every occupation and shortName to every sector.
// Safe to re-run — only sets fields that are missing or explicitly listed here.

const fs   = require('fs')
const path = require('path')
const DATA = path.join(__dirname, '../client/src/data')

// ─── Sector short names ───────────────────────────────────────────────────────
const SECTOR_SHORT = {
  // India
  agriculture:       'Agriculture',
  construction:      'Construction',
  trade:             'Trade',
  manufacturing:     'Manufacturing',
  it_technology:     'IT & Tech',
  education:         'Education',
  healthcare:        'Healthcare',
  transport:         'Transport',
  finance:           'Finance',
  government:        'Government',
  personal_services: 'Personal Svcs',
  creative_media:    'Creative',
  mining:            'Mining',
  utilities:         'Utilities',
  // World
  agriculture_global:            'Agriculture',
  manufacturing_global:          'Manufacturing',
  trade_retail:                  'Trade & Retail',
  construction_global:           'Construction',
  transport_logistics_global:    'Transport',
  healthcare_global:             'Healthcare',
  education_global:              'Education',
  it_technology_global:          'IT & Tech',
  finance_global:                'Finance',
  government_global:             'Government',
  professional_services:         'Prof. Services',
  mining_energy_global:          'Mining/Energy',
  accommodation_food_global:     'Hospitality',
  personal_services_global:      'Personal Svcs',
}

// ─── Occupation short labels (≤14 chars) ─────────────────────────────────────
const OCC_SHORT = {
  // India — Agriculture
  crop_farming:             'Crop Farming',
  animal_husbandry:         'Animal Husb.',
  fisheries:                'Fisheries',
  agri_labour:              'Agri Labour',
  horticulture:             'Horticulture',
  agri_engineers_ext:       'Agri-Tech',
  // India — Construction
  construction_workers:     'Construction',
  electricians_plumbers:    'Electricians',
  construction_supervisors: 'Site Supvrs',
  civil_engineers:          'Civil Eng.',
  real_estate_agents:       'Real Estate',
  equipment_operators:      'Equip. Ops.',
  architects_india:         'Architects',
  // India — Trade
  retail_workers:           'Retail',
  restaurant_hotel:         'Restaurants',
  wholesale_trade:          'Wholesale',
  ecommerce:                'E-commerce',
  gig_delivery:             'Gig Delivery',
  tourism_travel:           'Tourism',
  street_vendors:           'Street Vendors',
  // India — Manufacturing
  garment_textile:          'Garments',
  food_processing:          'Food Proc.',
  automobile:               'Automobile',
  electronics:              'Electronics',
  chemical_pharma:          'Chemicals',
  msme_workers:             'MSME Workers',
  craft_artisans:           'Artisans',
  ev_battery_workers:       'EV/Battery',
  defence_manufacturing:    'Defence Mfg',
  // India — IT
  software_engineers:       'Software Dev',
  it_support_bpo:           'IT Support/BPO',
  data_scientists:          'Data Science',
  cybersecurity:            'Cybersecurity',
  cloud_devops:             'Cloud/DevOps',
  ai_ml_engineers:          'AI/ML Eng.',
  product_managers:         'Product Mgrs',
  ui_ux_designers:          'UI/UX Design',
  hardware_network_eng:     'HW/Network',
  // India — Education
  school_teachers:          'Teachers',
  college_faculty:          'Professors',
  edtech_professionals:     'EdTech',
  private_tutors:           'Tutors',
  // India — Healthcare
  doctors:                  'Doctors',
  nurses:                   'Nurses',
  pharmacists:              'Pharmacists',
  paramedics:               'Paramedics',
  asha_workers:             'ASHA Workers',
  hospital_admin:           'Hospital Admin',
  ayush_practitioners:      'AYUSH Prctrs',
  mental_health_workers:    'Mental Health',
  // India — Transport
  truck_drivers:            'Truck Drivers',
  auto_taxi_drivers:        'Auto/Taxi',
  railway_staff:            'Railways',
  logistics_warehouse:      'Logistics',
  aviation:                 'Aviation',
  postal_courier:           'Post/Courier',
  metro_urban_transit:      'Metro Transit',
  // India — Finance
  bank_employees:           'Banking',
  insurance:                'Insurance',
  fintech_professionals:    'FinTech',
  chartered_accountants:    'CAs/Auditors',
  stock_brokers:            'Stock Brokers',
  microfinance:             'Microfinance',
  mutual_fund_agents:       'MF Agents',
  // India — Government
  civil_servants:           'Civil Servants',
  police_paramilitary:      'Police/Forces',
  municipal_workers:        'Municipal',
  psu_employees:            'PSU Workers',
  armed_forces:             'Armed Forces',
  // India — Personal Services
  domestic_workers:         'Domestic Work',
  security_guards:          'Security',
  beauty_wellness:          'Beauty/Well.',
  sanitation_waste:         'Sanitation',
  gig_home_services:        'Home Services',
  // India — Creative
  film_entertainment:       'Film/OTT',
  digital_creators:         'Creators',
  journalists:              'Journalism',
  advertising_marketing:    'Marketing',
  gaming_esports:           'Gaming/Esports',
  // India — Mining
  coal_miners:              'Coal Mining',
  stone_quarry:             'Quarrying',
  mining_engineers:         'Mining Eng.',
  oil_gas_workers:          'Oil & Gas',
  mineral_processing:       'Minerals',
  critical_minerals_workers:'Critical Min.',
  // India — Utilities
  power_utility:            'Power/Grid',
  renewable_energy:         'Renewables',
  water_sanitation_utility: 'Water Supply',
  gas_distribution:         'Gas Distrib.',
  nuclear_energy_workers:   'Nuclear',

  // World — Agriculture
  crop_farmers:             'Crop Farmers',
  livestock_dairy:          'Livestock',
  fisheries_global:         'Fisheries',
  agri_wage_labour:         'Agri Labour',
  food_scientists_global:   'Food Science',
  // World — Manufacturing
  factory_assembly:         'Factory Wkrs',
  garment_textile_global:   'Garments',
  food_beverage_mfg:        'Food/Bev Mfg',
  auto_engineering_global:  'Auto/Eng.',
  electronics_global:       'Electronics',
  pharma_chemical_global:   'Pharma/Chem',
  aerospace_mfg_global:     'Aerospace',
  semiconductor_workers:    'Semicon.',
  // World — Trade
  retail_workers_global:    'Retail',
  ecommerce_global:         'E-commerce',
  wholesale_distribution_global: 'Wholesale',
  street_informal_trade:    'Informal Trade',
  // World — Construction
  construction_workers_global: 'Construction',
  civil_engineers_global:   'Civil Eng.',
  skilled_trades_global:    'Skilled Trades',
  real_estate_global:       'Real Estate',
  // World — Transport
  truck_drivers_global:     'Truck Drivers',
  ride_gig_global:          'Ride/Gig',
  aviation_global:          'Aviation',
  maritime_shipping:        'Maritime',
  logistics_warehouse_global: 'Logistics',
  drone_operators_global:   'Drones/UAV',
  // World — Healthcare
  doctors_global:           'Doctors',
  nurses_global:            'Nurses',
  community_health_global:  'Community Hth',
  elderly_care:             'Elderly Care',
  mental_health_global:     'Mental Health',
  biotech_researchers_global: 'Biotech R&D',
  // World — Education
  school_teachers_global:   'Teachers',
  higher_ed_global:         'Professors',
  edtech_global:            'EdTech',
  // World — IT
  software_engineers_global: 'Software Dev',
  ai_ml_global:             'AI/ML',
  cybersecurity_global:     'Cybersecurity',
  cloud_devops_global:      'Cloud/DevOps',
  data_analysts_global:     'Data Science',
  it_support_bpo_global:    'IT Support',
  quantum_computing_global: 'Quantum Comp.',
  robotics_automation_global: 'Robotics',
  // World — Finance
  bank_employees_global:    'Banking',
  fintech_global:           'FinTech',
  investment_advisors_global: 'Investment',
  insurance_global:         'Insurance',
  accounting_audit_global:  'Accounting',
  crypto_defi_global:       'Crypto/DeFi',
  // World — Government
  civil_servants_global:    'Civil Servants',
  police_military_global:   'Police/Military',
  social_workers_global:    'Social Work',
  international_orgs:       'Intl. Orgs',
  // World — Professional Services
  lawyers_legal:            'Legal',
  consultants_mgmt:         'Consulting',
  marketing_advertising_global: 'Marketing',
  architects_designers:     'Architecture',
  hr_recruiters:            'HR/Recruit.',
  scientists_researchers:   'R&D Science',
  journalists_media_global: 'Journalism',
  accountants_global_pro:   'BPO/Admin',
  climate_sustainability_global: 'Sustainability',
  legal_tech_global:        'LegalTech',
  // World — Mining/Energy
  fossil_fuel_workers:      'Oil/Gas/Coal',
  renewable_energy_global:  'Renewables',
  mining_workers_global:    'Mining',
  utility_grid_workers:     'Grid/Utility',
  nuclear_global:           'Nuclear',
  hydrogen_energy_global:   'Green H₂',
  // World — Accommodation/Food
  chefs_restaurant_global:  'Chefs',
  hotel_hospitality_global: 'Hospitality',
  tour_guides_travel:       'Tourism',
  cruise_hospitality:       'Cruise',
  // World — Personal Services
  domestic_workers_global:  'Domestic Work',
  beauty_fitness_global:    'Beauty/Fitness',
  security_services_global: 'Security',
  elder_childcare_global:   'Childcare',
}

function applyShortLabels(data) {
  data.sectors.forEach(s => {
    if (SECTOR_SHORT[s.id] && !s.shortName) s.shortName = SECTOR_SHORT[s.id]
    s.occupations.forEach(o => {
      if (OCC_SHORT[o.id] && !o.shortLabel) o.shortLabel = OCC_SHORT[o.id]
    })
  })
}

// States: shortLabel auto-generated from last word segments (already short enough)
function applyStatesShortLabels(data) {
  data.sectors.forEach(s => {
    // State names are already short enough as sector labels
    if (!s.shortName) s.shortName = s.name.replace(/\s*\(.*\)/, '').slice(0, 14)
    s.occupations.forEach(o => {
      if (!o.shortLabel) {
        // e.g. "up_agri" → use last segments after state prefix
        const suffix = o.id.split('_').slice(1).join('_')
        const fallback = o.name.replace(/^[\w\s]+ — /, '').slice(0, 14)
        o.shortLabel = fallback
      }
    })
  })
}

const india  = JSON.parse(fs.readFileSync(path.join(DATA, 'india_jobs.json'),  'utf8'))
const world  = JSON.parse(fs.readFileSync(path.join(DATA, 'world_jobs.json'),  'utf8'))
const states = JSON.parse(fs.readFileSync(path.join(DATA, 'india_states_jobs.json'), 'utf8'))

applyShortLabels(india)
applyShortLabels(world)
applyStatesShortLabels(states)

fs.writeFileSync(path.join(DATA, 'india_jobs.json'),        JSON.stringify(india,  null, 2))
fs.writeFileSync(path.join(DATA, 'world_jobs.json'),        JSON.stringify(world,  null, 2))
fs.writeFileSync(path.join(DATA, 'india_states_jobs.json'), JSON.stringify(states, null, 2))

const indiaHit  = india.sectors.reduce((a,s)  => a + s.occupations.filter(o => o.shortLabel).length, 0)
const worldHit  = world.sectors.reduce((a,s)  => a + s.occupations.filter(o => o.shortLabel).length, 0)
const statesHit = states.sectors.reduce((a,s) => a + s.occupations.filter(o => o.shortLabel).length, 0)
console.log(`shortLabel applied — India:${indiaHit}  World:${worldHit}  States:${statesHit}`)
