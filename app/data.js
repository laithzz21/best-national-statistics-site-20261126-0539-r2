// All figures behind "Jordan in Numbers", kept in this one module.
//
// The numbers are published estimates from Jordan's Department of
// Statistics, the World Bank's World Development Indicators and the IMF,
// with the source and year noted next to each collection below. The site
// never fetches anything at run time: it renders entirely from the tables
// in this file, so it works with no connection at all.
//
// To keep the tables compact, the yearly series are written as short
// [year, value] pairs and then expanded into objects by the small builders
// at the top. The exported shapes are unchanged: every series is an array
// of { year, value } objects, exactly as the views expect.

// --- builders -------------------------------------------------------------

const yearly = (pairs) => {
  const out = [];
  for (const [year, value] of pairs) out.push({ year, value });
  return out;
};

const placeRow = (name, pop, capital) => ({ name, pop, capital });

const sectorRow = (sector, share) => ({ sector, share });

const basketRow = (item, weight) => ({ item, weight });

const indicator = (name, value, year, source, category) => ({
  name,
  value,
  year,
  source,
  category,
});

const release = (date, title, detail) => ({ date, title, detail });

const sourceEntry = (name, note) => ({ name, note });

// --- about the country ----------------------------------------------------

export const META = {
  country: 'Jordan',
  countryArabic: 'الأردن',
  updated: '25 November 2025',
  currency: 'Jordanian dinar (JOD)',
  areaKm2: 89342,
  capital: 'Amman',
  governorates: 12,
};

// --- population -----------------------------------------------------------

// Mid-year population, millions (World Bank WDI, 2025 release).
export const POPULATION = yearly([
  [2015, 9.56], [2016, 9.80], [2017, 10.05], [2018, 10.31], [2019, 10.55],
  [2020, 10.82], [2021, 11.06], [2022, 11.29], [2023, 11.48], [2024, 11.52],
]);

// Age bands as a share of everyone (World Bank WDI, 2024).
// Written as [label, share] pairs so the table stays easy to scan.
export const AGE_STRUCTURE = [
  ['Ages 0–14', 34.1],
  ['Ages 15–24', 19.8],
  ['Ages 25–54', 36.4],
  ['Ages 55–64', 5.9],
  ['Ages 65+', 3.8],
].map(([group, share]) => ({ group, share }));

// Residents by governorate, millions (Department of Statistics, 2023 estimates).
export const GOVERNORATES = [
  placeRow('Amman', 4.30, 'Amman'),
  placeRow('Irbid', 1.98, 'Irbid'),
  placeRow('Zarqa', 1.52, 'Zarqa'),
  placeRow('Mafraq', 0.61, 'Mafraq'),
  placeRow('Balqa', 0.56, 'Salt'),
  placeRow('Karak', 0.35, 'Karak'),
  placeRow('Jerash', 0.26, 'Jerash'),
  placeRow('Madaba', 0.22, 'Madaba'),
  placeRow('Aqaba', 0.21, 'Aqaba'),
  placeRow('Ajloun', 0.20, 'Ajloun'),
  placeRow("Ma'an", 0.18, "Ma'an"),
  placeRow('Tafilah', 0.11, 'Tafilah'),
];

// --- economy --------------------------------------------------------------

// GDP in current US dollars, billions (World Bank WDI, 2025 release).
export const GDP = yearly([
  [2015, 37.8], [2016, 39.0], [2017, 40.1], [2018, 42.1], [2019, 44.0],
  [2020, 43.3], [2021, 45.0], [2022, 48.0], [2023, 50.8], [2024, 53.8],
]);

// Value added by sector, percent (Department of Statistics, national accounts 2024).
export const GDP_SECTORS = [
  sectorRow('Services', 65.8),
  sectorRow('Manufacturing', 17.9),
  sectorRow('Agriculture', 4.5),
  sectorRow('Construction', 3.4),
  sectorRow('Mining & quarrying', 3.1),
  sectorRow('Electricity & water', 2.6),
  sectorRow('Other', 2.7),
];

// --- labour ----------------------------------------------------------------

// Unemployment, percent of the labour force (Department of Statistics, labour force surveys).
export const UNEMPLOYMENT = yearly([
  [2015, 13.0], [2016, 15.3], [2017, 18.3], [2018, 18.3], [2019, 19.1],
  [2020, 24.7], [2021, 24.1], [2022, 22.9], [2023, 22.8], [2024, 21.4],
]);

// Employed people by broad sector, percent (Department of Statistics, 2024).
export const EMPLOYMENT_SECTORS = [
  ['Services', 79.6],
  ['Industry', 17.2],
  ['Agriculture', 3.2],
].map(([sector, share]) => ({ sector, share }));

// --- prices ----------------------------------------------------------------

// Consumer price inflation, annual percent (Department of Statistics CPI; IMF, 2025).
export const INFLATION = yearly([
  [2015, -0.9], [2016, -0.8], [2017, 3.3], [2018, 4.5], [2019, 0.8],
  [2020, -0.1], [2021, 1.4], [2022, 4.2], [2023, 2.1], [2024, 1.6],
]);

// Weights in the CPI basket, percent (Department of Statistics, CPI weights 2024).
export const CPI_BASKET = [
  basketRow('Food & non-alcoholic drinks', 33.1),
  basketRow('Housing, water & energy', 21.4),
  basketRow('Transport', 13.9),
  basketRow('Health', 5.2),
  basketRow('Education', 4.8),
  basketRow('Clothing & footwear', 4.4),
  basketRow('Restaurants & hotels', 3.9),
  basketRow('Other goods & services', 13.3),
];

// --- the headline indicators ----------------------------------------------

// Feeds the home-page cards and the data explorer. The first argument is
// the display name, then the formatted value, year, source and category.
export const INDICATORS = [
  indicator('Population', '11.52 million', 2024, 'World Bank WDI', 'Population'),
  indicator('Population growth', '0.4% per year', 2024, 'World Bank WDI', 'Population'),
  indicator('Median age', '23.8 years', 2024, 'UN World Population Prospects', 'Population'),
  indicator('Life expectancy at birth', '74.6 years', 2024, 'World Bank WDI', 'Health'),
  indicator('Population density', '129 people per km²', 2024, 'World Bank WDI', 'Population'),
  indicator('Urban population', '91.4% of total', 2024, 'World Bank WDI', 'Population'),
  indicator('GDP (current US$)', '$53.8 billion', 2024, 'World Bank WDI', 'Economy'),
  indicator('GDP per capita', '$4,670', 2024, 'World Bank WDI', 'Economy'),
  indicator('GDP growth (real)', '2.5%', 2024, 'IMF World Economic Outlook', 'Economy'),
  indicator('Exports of goods', '$12.4 billion', 2024, 'Department of Statistics', 'Economy'),
  indicator('Imports of goods', '$24.3 billion', 2024, 'Department of Statistics', 'Economy'),
  indicator('Tourism receipts', '$7.4 billion', 2023, 'Central Bank of Jordan', 'Economy'),
  indicator('Remittances received', '$3.5 billion', 2024, 'Central Bank of Jordan', 'Economy'),
  indicator('Unemployment rate', '21.4%', 2024, 'Department of Statistics', 'Labour'),
  indicator('Youth unemployment (15–24)', '47.5%', 2024, 'Department of Statistics', 'Labour'),
  indicator('Female labour-force participation', '14.9%', 2024, 'Department of Statistics', 'Labour'),
  indicator('Male labour-force participation', '57.2%', 2024, 'Department of Statistics', 'Labour'),
  indicator('Consumer price inflation', '1.6%', 2024, 'Department of Statistics', 'Prices'),
  indicator('Food price inflation', '2.0%', 2024, 'Department of Statistics', 'Prices'),
  indicator('Poverty rate', '15.7%', 2018, 'Department of Statistics', 'Living standards'),
  indicator('Adult literacy rate', '98.4%', 2023, 'UNESCO Institute for Statistics', 'Education'),
  indicator('School enrolment, primary (net)', '91.2%', 2023, 'UNESCO Institute for Statistics', 'Education'),
  indicator('Internet users', '90.5% of population', 2024, 'DataReportal / ITU', 'Digital'),
  indicator('Mobile subscriptions', '137 per 100 people', 2024, 'ITU / TRC Jordan', 'Digital'),
  indicator('Hospital beds', '1.8 per 1,000 people', 2023, 'Ministry of Health', 'Health'),
  indicator('Physicians', '2.9 per 1,000 people', 2023, 'Ministry of Health', 'Health'),
  indicator('Renewable electricity share', '29% of generation', 2024, 'Ministry of Energy', 'Energy'),
  indicator('Water availability', '61 m³ per person per year', 2024, 'Ministry of Water', 'Environment'),
];

// --- newest releases first --------------------------------------------------

export const RELEASES = [
  release('Nov 2025', 'Labour Force Survey, Q3 2025', 'Unemployment at 21.1% — full tables by governorate, age and sex.'),
  release('Oct 2025', 'Consumer Price Index, September 2025', 'Annual inflation 1.9%; food prices up 2.3% on a year earlier.'),
  release('Sep 2025', 'National accounts, Q2 2025', 'Real GDP grew 2.7% year on year, led by services and manufacturing.'),
  release('Aug 2025', 'External trade, June 2025', 'Exports $1.08bn in the month; the trade deficit narrowed 4.2%.'),
  release('Jul 2025', 'Population estimates 2024', 'End-year population 11.55 million; Amman holds 37% of residents.'),
  release('Jun 2025', 'Tourism statistics 2024', '6.4 million visitors; tourism receipts $7.7bn, up 4.1% on 2023.'),
];

// --- where the numbers come from -------------------------------------------

export const SOURCES = [
  sourceEntry("Department of Statistics (DoS), Jordan", 'Labour force surveys, CPI, national accounts, population estimates.'),
  sourceEntry('World Bank — World Development Indicators', 'Population, GDP, life expectancy, density and urban share.'),
  sourceEntry('IMF — World Economic Outlook', 'Real GDP growth and inflation forecasts.'),
  sourceEntry('Central Bank of Jordan', 'Tourism receipts, remittances and monetary statistics.'),
  sourceEntry('UNESCO Institute for Statistics', 'Literacy and school enrolment.'),
  sourceEntry('Ministry of Health, Jordan', 'Hospital beds and physicians.'),
  sourceEntry('Ministry of Energy and Mineral Resources', 'Renewable electricity share.'),
  sourceEntry('Ministry of Water and Irrigation', 'Per-capita water availability.'),
];
