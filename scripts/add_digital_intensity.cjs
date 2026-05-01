const fs   = require('fs')
const path = require('path')

// Digital Intensity Index (0–100):
// Measures how thoroughly a role's core workflows are mediated by digital systems.
// High = outputs already exist in machine-readable form → AI can ingest & replicate them easily.

const INDIA_SCORES = {
  // Agriculture
  crop_farming:         8,
  animal_husbandry:    10,
  fisheries:           12,
  agri_labour:          5,
  horticulture:        15,
  agri_engineers_ext:  62,
  // Construction
  construction_workers:      10,
  electricians_plumbers:     22,
  construction_supervisors:  45,
  civil_engineers:           78,
  real_estate_agents:        60,
  equipment_operators:       20,
  architects_india:          82,
  // Trade
  retail_workers:   35,
  restaurant_hotel: 22,
  wholesale_trade:  55,
  ecommerce:        72,
  gig_delivery:     40,
  tourism_travel:   58,
  street_vendors:    5,
  // Manufacturing
  garment_textile:      18,
  food_processing:      22,
  automobile:           42,
  electronics:          40,
  chemical_pharma:      48,
  msme_workers:         20,
  craft_artisans:       10,
  ev_battery_workers:   48,
  defence_manufacturing:55,
  // IT & Technology
  software_engineers:    97,
  it_support_bpo:        88,
  data_scientists:       95,
  cybersecurity:         95,
  cloud_devops:          97,
  ai_ml_engineers:       98,
  product_managers:      92,
  ui_ux_designers:       92,
  hardware_network_eng:  80,
  // Education
  school_teachers:       52,
  college_faculty:       62,
  edtech_professionals:  88,
  private_tutors:        45,
  // Healthcare
  doctors:               62,
  nurses:                45,
  pharmacists:           58,
  paramedics:            50,
  asha_workers:          18,
  hospital_admin:        78,
  ayush_practitioners:   22,
  mental_health_workers: 55,
  // Transport
  truck_drivers:      25,
  auto_taxi_drivers:  35,
  railway_staff:      42,
  logistics_warehouse:52,
  aviation:           72,
  postal_courier:     48,
  metro_urban_transit:45,
  // Finance
  bank_employees:         82,
  insurance:              62,
  fintech_professionals:  95,
  chartered_accountants:  85,
  stock_brokers:          85,
  microfinance:           45,
  mutual_fund_agents:     62,
  // Government
  civil_servants:      58,
  police_paramilitary: 22,
  municipal_workers:   18,
  psu_employees:       55,
  armed_forces:        20,
  // Personal Services
  domestic_workers:   5,
  security_guards:    22,
  beauty_wellness:    20,
  sanitation_waste:    8,
  gig_home_services:  35,
  // Creative & Media
  film_entertainment:   75,
  digital_creators:     88,
  journalists:          82,
  advertising_marketing:85,
  gaming_esports:       92,
  // Mining
  coal_miners:              22,
  stone_quarry:              8,
  mining_engineers:         70,
  oil_gas_workers:          58,
  mineral_processing:       25,
  critical_minerals_workers:42,
  // Utilities
  power_utility:           52,
  renewable_energy:        38,
  water_sanitation_utility:28,
  gas_distribution:        32,
  nuclear_energy_workers:  55,
}

const WORLD_SCORES = {
  // Agriculture
  crop_farmers:          8,
  livestock_dairy:       10,
  fisheries_global:      12,
  agri_wage_labour:       5,
  food_scientists_global:72,
  // Manufacturing
  factory_assembly:        28,
  garment_textile_global:  18,
  food_beverage_mfg:       30,
  auto_engineering_global: 48,
  electronics_global:      52,
  pharma_chemical_global:  58,
  aerospace_mfg_global:    65,
  semiconductor_workers:   62,
  // Trade
  retail_workers_global:       40,
  ecommerce_global:            72,
  wholesale_distribution_global:60,
  street_informal_trade:        8,
  // Construction
  construction_workers_global: 12,
  civil_engineers_global:      80,
  skilled_trades_global:       25,
  real_estate_global:          68,
  // Transport
  truck_drivers_global:      28,
  ride_gig_global:           42,
  aviation_global:           75,
  maritime_shipping:         58,
  logistics_warehouse_global:55,
  drone_operators_global:    72,
  // Healthcare
  doctors_global:            65,
  nurses_global:             48,
  community_health_global:   32,
  elderly_care:              28,
  mental_health_global:      58,
  biotech_researchers_global:82,
  // Education
  school_teachers_global: 55,
  higher_ed_global:       68,
  edtech_global:          90,
  // IT & Tech
  software_engineers_global: 97,
  ai_ml_global:              98,
  cybersecurity_global:      95,
  cloud_devops_global:       97,
  data_analysts_global:      95,
  it_support_bpo_global:     88,
  quantum_computing_global:  90,
  robotics_automation_global:85,
  // Finance
  bank_employees_global:        82,
  fintech_global:               95,
  investment_advisors_global:   88,
  insurance_global:             68,
  accounting_audit_global:      85,
  crypto_defi_global:           92,
  // Government
  civil_servants_global: 58,
  police_military_global:25,
  social_workers_global: 48,
  international_orgs:    72,
  // Professional Services
  lawyers_legal:                82,
  consultants_mgmt:             85,
  marketing_advertising_global: 85,
  architects_designers:         80,
  hr_recruiters:                82,
  scientists_researchers:       78,
  journalists_media_global:     82,
  accountants_global_pro:       85,
  climate_sustainability_global:78,
  legal_tech_global:            85,
  // Mining & Energy
  fossil_fuel_workers:    42,
  renewable_energy_global:38,
  mining_workers_global:  25,
  utility_grid_workers:   52,
  nuclear_global:         55,
  hydrogen_energy_global: 55,
  // Hospitality
  chefs_restaurant_global: 25,
  hotel_hospitality_global:42,
  tour_guides_travel:      48,
  cruise_hospitality:      40,
  // Personal Services
  domestic_workers_global:  5,
  beauty_fitness_global:   22,
  security_services_global:28,
  elder_childcare_global:  22,
}

function addScores(filePath, scores) {
  const data     = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  let   added    = 0
  const notFound = []

  for (const sector of data.sectors) {
    for (const occ of sector.occupations) {
      if (scores[occ.id] !== undefined) {
        occ.digitalIntensity = scores[occ.id]
        added++
      } else {
        notFound.push(occ.id)
      }
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
  console.log(`✓ Added digitalIntensity to ${added} occupations in ${path.basename(filePath)}`)
  if (notFound.length) console.warn('  ⚠ IDs not in score map:', notFound.join(', '))
}

const base      = path.join(__dirname, '../client/src/data')
addScores(path.join(base, 'india_jobs.json'), INDIA_SCORES)
addScores(path.join(base, 'world_jobs.json'), WORLD_SCORES)
console.log('Done.')
