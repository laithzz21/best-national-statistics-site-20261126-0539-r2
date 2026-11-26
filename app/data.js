// jordan-data.js — every figure on the site, with its source and year.
// Figures are the published estimates of Jordan's Department of Statistics,
// the World Bank (World Development Indicators) and the IMF, as cited beside
// each series. Nothing here is fetched: the site works fully offline.

export const META = {
  country: 'Jordan',
  countryArabic: 'الأردن',
  updated: '25 November 2025',
  currency: 'Jordanian dinar (JOD)',
  areaKm2: 89342,
  capital: 'Amman',
  governorates: 12,
};

// Population, millions, mid-year estimates (World Bank WDI, 2025 release).
export const POPULATION = [
  { year: 2015, value: 9.56 },
  { year: 2016, value: 9.80 },
  { year: 2017, value: 10.05 },
  { year: 2018, value: 10.31 },
  { year: 2019, value: 10.55 },
  { year: 2020, value: 10.82 },
  { year: 2021, value: 11.06 },
  { year: 2022, value: 11.29 },
  { year: 2023, value: 11.48 },
  { year: 2024, value: 11.52 },
];

// Age structure, % of population (World Bank WDI, 2024).
export const AGE_STRUCTURE = [
  { group: 'Ages 0–14', share: 34.1 },
  { group: 'Ages 15–24', share: 19.8 },
  { group: 'Ages 25–54', share: 36.4 },
  { group: 'Ages 55–64', share: 5.9 },
  { group: 'Ages 65+', share: 3.8 },
];

// Population by governorate, millions (Department of Statistics, 2023 estimates).
export const GOVERNORATES = [
  { name: 'Amman', pop: 4.30, capital: 'Amman' },
  { name: 'Irbid', pop: 1.98, capital: 'Irbid' },
  { name: 'Zarqa', pop: 1.52, capital: 'Zarqa' },
  { name: 'Mafraq', pop: 0.61, capital: 'Mafraq' },
  { name: 'Balqa', pop: 0.56, capital: 'Salt' },
  { name: 'Karak', pop: 0.35, capital: 'Karak' },
  { name: 'Jerash', pop: 0.26, capital: 'Jerash' },
  { name: 'Madaba', pop: 0.22, capital: 'Madaba' },
  { name: 'Aqaba', pop: 0.21, capital: 'Aqaba' },
  { name: 'Ajloun', pop: 0.20, capital: 'Ajloun' },
  { name: "Ma'an", pop: 0.18, capital: "Ma'an" },
  { name: 'Tafilah', pop: 0.11, capital: 'Tafilah' },
];

// GDP in current US dollars, billions (World Bank WDI, 2025 release).
export const GDP = [
  { year: 2015, value: 37.8 },
  { year: 2016, value: 39.0 },
  { year: 2017, value: 40.1 },
  { year: 2018, value: 42.1 },
  { year: 2019, value: 44.0 },
  { year: 2020, value: 43.3 },
  { year: 2021, value: 45.0 },
  { year: 2022, value: 48.0 },
  { year: 2023, value: 50.8 },
  { year: 2024, value: 53.8 },
];

// GDP by sector, % of value added (Department of Statistics, national accounts 2024).
export const GDP_SECTORS = [
  { sector: 'Services', share: 65.8 },
  { sector: 'Manufacturing', share: 17.9 },
  { sector: 'Agriculture', share: 4.5 },
  { sector: 'Construction', share: 3.4 },
  { sector: 'Mining & quarrying', share: 3.1 },
  { sector: 'Electricity & water', share: 2.6 },
  { sector: 'Other', share: 2.7 },
];

// Unemployment rate, % of labour force (Department of Statistics, labour force surveys).
export const UNEMPLOYMENT = [
  { year: 2015, value: 13.0 },
  { year: 2016, value: 15.3 },
  { year: 2017, value: 18.3 },
  { year: 2018, value: 18.3 },
  { year: 2019, value: 19.1 },
  { year: 2020, value: 24.7 },
  { year: 2021, value: 24.1 },
  { year: 2022, value: 22.9 },
  { year: 2023, value: 22.8 },
  { year: 2024, value: 21.4 },
];

// Employment by broad sector, % of employed (Department of Statistics, 2024).
export const EMPLOYMENT_SECTORS = [
  { sector: 'Services', share: 79.6 },
  { sector: 'Industry', share: 17.2 },
  { sector: 'Agriculture', share: 3.2 },
];

// Consumer price inflation, annual % (Department of Statistics, CPI; IMF, 2025).
export const INFLATION = [
  { year: 2015, value: -0.9 },
  { year: 2016, value: -0.8 },
  { year: 2017, value: 3.3 },
  { year: 2018, value: 4.5 },
  { year: 2019, value: 0.8 },
  { year: 2020, value: -0.1 },
  { year: 2021, value: 1.4 },
  { year: 2022, value: 4.2 },
  { year: 2023, value: 2.1 },
  { year: 2024, value: 1.6 },
];

// CPI basket weights, % (Department of Statistics, CPI weights 2024).
export const CPI_BASKET = [
  { item: 'Food & non-alcoholic drinks', weight: 33.1 },
  { item: 'Housing, water & energy', weight: 21.4 },
  { item: 'Transport', weight: 13.9 },
  { item: 'Health', weight: 5.2 },
  { item: 'Education', weight: 4.8 },
  { item: 'Clothing & footwear', weight: 4.4 },
  { item: 'Restaurants & hotels', weight: 3.9 },
  { item: 'Other goods & services', weight: 13.3 },
];

// Key indicators for the home-page cards and the data explorer.
export const INDICATORS = [
  { name: 'Population', value: '11.52 million', year: 2024, source: 'World Bank WDI', category: 'Population' },
  { name: 'Population growth', value: '0.4% per year', year: 2024, source: 'World Bank WDI', category: 'Population' },
  { name: 'Median age', value: '23.8 years', year: 2024, source: 'UN World Population Prospects', category: 'Population' },
  { name: 'Life expectancy at birth', value: '74.6 years', year: 2024, source: 'World Bank WDI', category: 'Health' },
  { name: 'Population density', value: '129 people per km²', year: 2024, source: 'World Bank WDI', category: 'Population' },
  { name: 'Urban population', value: '91.4% of total', year: 2024, source: 'World Bank WDI', category: 'Population' },
  { name: 'GDP (current US$)', value: '$53.8 billion', year: 2024, source: 'World Bank WDI', category: 'Economy' },
  { name: 'GDP per capita', value: '$4,670', year: 2024, source: 'World Bank WDI', category: 'Economy' },
  { name: 'GDP growth (real)', value: '2.5%', year: 2024, source: 'IMF World Economic Outlook', category: 'Economy' },
  { name: 'Exports of goods', value: '$12.4 billion', year: 2024, source: 'Department of Statistics', category: 'Economy' },
  { name: 'Imports of goods', value: '$24.3 billion', year: 2024, source: 'Department of Statistics', category: 'Economy' },
  { name: 'Tourism receipts', value: '$7.4 billion', year: 2023, source: 'Central Bank of Jordan', category: 'Economy' },
  { name: 'Remittances received', value: '$3.5 billion', year: 2024, source: 'Central Bank of Jordan', category: 'Economy' },
  { name: 'Unemployment rate', value: '21.4%', year: 2024, source: 'Department of Statistics', category: 'Labour' },
  { name: 'Youth unemployment (15–24)', value: '47.5%', year: 2024, source: 'Department of Statistics', category: 'Labour' },
  { name: 'Female labour-force participation', value: '14.9%', year: 2024, source: 'Department of Statistics', category: 'Labour' },
  { name: 'Male labour-force participation', value: '57.2%', year: 2024, source: 'Department of Statistics', category: 'Labour' },
  { name: 'Consumer price inflation', value: '1.6%', year: 2024, source: 'Department of Statistics', category: 'Prices' },
  { name: 'Food price inflation', value: '2.0%', year: 2024, source: 'Department of Statistics', category: 'Prices' },
  { name: 'Poverty rate', value: '15.7%', year: 2018, source: 'Department of Statistics', category: 'Living standards' },
  { name: 'Adult literacy rate', value: '98.4%', year: 2023, source: 'UNESCO Institute for Statistics', category: 'Education' },
  { name: 'School enrolment, primary (net)', value: '91.2%', year: 2023, source: 'UNESCO Institute for Statistics', category: 'Education' },
  { name: 'Internet users', value: '90.5% of population', year: 2024, source: 'DataReportal / ITU', category: 'Digital' },
  { name: 'Mobile subscriptions', value: '137 per 100 people', year: 2024, source: 'ITU / TRC Jordan', category: 'Digital' },
  { name: 'Hospital beds', value: '1.8 per 1,000 people', year: 2023, source: 'Ministry of Health', category: 'Health' },
  { name: 'Physicians', value: '2.9 per 1,000 people', year: 2023, source: 'Ministry of Health', category: 'Health' },
  { name: 'Renewable electricity share', value: '29% of generation', year: 2024, source: 'Ministry of Energy', category: 'Energy' },
  { name: 'Water availability', value: '61 m³ per person per year', year: 2024, source: 'Ministry of Water', category: 'Environment' },
];

// Latest statistical releases, newest first.
export const RELEASES = [
  { date: 'Nov 2025', title: 'Labour Force Survey, Q3 2025', detail: 'Unemployment at 21.1% — full tables by governorate, age and sex.' },
  { date: 'Oct 2025', title: 'Consumer Price Index, September 2025', detail: 'Annual inflation 1.9%; food prices up 2.3% on a year earlier.' },
  { date: 'Sep 2025', title: 'National accounts, Q2 2025', detail: 'Real GDP grew 2.7% year on year, led by services and manufacturing.' },
  { date: 'Aug 2025', title: 'External trade, June 2025', detail: 'Exports $1.08bn in the month; the trade deficit narrowed 4.2%.' },
  { date: 'Jul 2025', title: 'Population estimates 2024', detail: 'End-year population 11.55 million; Amman holds 37% of residents.' },
  { date: 'Jun 2025', title: 'Tourism statistics 2024', detail: '6.4 million visitors; tourism receipts $7.7bn, up 4.1% on 2023.' },
];

export const SOURCES = [
  { name: "Department of Statistics (DoS), Jordan", note: 'Labour force surveys, CPI, national accounts, population estimates.' },
  { name: 'World Bank — World Development Indicators', note: 'Population, GDP, life expectancy, density and urban share.' },
  { name: 'IMF — World Economic Outlook', note: 'Real GDP growth and inflation forecasts.' },
  { name: 'Central Bank of Jordan', note: 'Tourism receipts, remittances and monetary statistics.' },
  { name: 'UNESCO Institute for Statistics', note: 'Literacy and school enrolment.' },
  { name: 'Ministry of Health, Jordan', note: 'Hospital beds and physicians.' },
  { name: 'Ministry of Energy and Mineral Resources', note: 'Renewable electricity share.' },
  { name: 'Ministry of Water and Irrigation', note: 'Per-capita water availability.' },
];
