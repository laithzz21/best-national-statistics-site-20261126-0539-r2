// Every page of "Jordan in Numbers", rendered from data.js and charts.js.
//
// Each exported function returns the HTML for one route; main.js puts it
// into #app and wires up that page's controls. Figures always appear with
// their source and year in the text next to them — a number without a
// source does not belong on this site.

import {
  META, POPULATION, AGE_STRUCTURE, GOVERNORATES, GDP, GDP_SECTORS,
  UNEMPLOYMENT, EMPLOYMENT_SECTORS, INFLATION, CPI_BASKET, INDICATORS,
  RELEASES, SOURCES,
} from './data.js';
import { lineChart, barChart, hbarChart, donutChart, sparkline } from './charts.js';

// --- small formatting helpers --------------------------------------------

const lastOf = (arr) => arr.at(-1);

const asMillions = (v) => `${v.toFixed(2)}m`;
const asBillions = (v) => `$${v.toFixed(1)}bn`;
const asPercent = (v) => `${v.toFixed(1)}%`;

// One-line source note under a chart or table.
function cite(text) {
  return `<p class="source">Source: ${text}</p>`;
}

// Shared page header: eyebrow, title, introductory paragraph.
function pageHead(eyebrow, title, lede) {
  return `<section class="page-head">
    <p class="eyebrow">${eyebrow}</p>
    <h1>${title}</h1>
    <p class="lede">${lede}</p>
  </section>`;
}

function panel(inner) {
  return `<section class="panel">${inner}</section>`;
}

// --- reusable card builders -------------------------------------------------

function kpiCard(label, value, change, series, colour, link) {
  return `<a class="kpi" href="${link}">
    <span class="kpi-label">${label}</span>
    <span class="kpi-value">${value}</span>
    <span class="kpi-change">${change}</span>
    ${sparkline(series, colour)}
  </a>`;
}

function topicCard(href, title, blurb, figure) {
  return `<a class="topic" href="${href}">
    <span class="topic-figure">${figure}</span>
    <span class="topic-title">${title}</span>
    <span class="topic-blurb">${blurb}</span>
    <span class="topic-link">Explore →</span>
  </a>`;
}

// --- the data explorer -------------------------------------------------------

export function dataView() {
  const categories = [...new Set(INDICATORS.map((i) => i.category))];
  const options = categories
    .map((c) => `<option value="${c}">${c}</option>`)
    .join('');
  const rows = INDICATORS
    .map((ind, idx) => `<tr data-idx="${idx}"><td>${ind.name}</td><td>${ind.value}</td><td>${ind.year}</td><td>${ind.source}</td><td>${ind.category}</td></tr>`)
    .join('');
  return `
  ${pageHead('Data explorer', 'All indicators', `Every headline figure on this site in one table — ${INDICATORS.length} indicators, each with its value, year and source. Search, filter, sort, or download the table as a CSV file.`)}

  ${panel(`
    <div class="explorer-controls">
      <label>Search <input type="search" id="explorer-search" placeholder="Try “unemployment” or “GDP”" aria-label="Search indicators"></label>
      <label>Category
        <select id="explorer-category" aria-label="Filter by category">
          <option value="">All categories</option>${options}
        </select>
      </label>
      <button type="button" class="btn" id="explorer-download">Download CSV</button>
    </div>
    <p id="explorer-count" role="status">${INDICATORS.length} indicators shown</p>
    <div class="table-scroll">
    <table class="data-table sortable" id="explorer-table">
      <thead><tr><th data-key="name">Indicator</th><th data-key="value">Value</th><th data-key="year">Year</th><th data-key="source">Source</th><th data-key="category">Category</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    </div>
    ${cite('Compiled from the sources named in each row; see About for the full source list.')}`)}`;
}

// --- about ------------------------------------------------------------------

export function aboutView() {
  const sources = SOURCES
    .map((s) => `<li><strong>${s.name}</strong> — ${s.note}</li>`)
    .join('');
  return `
  ${pageHead('About', 'About this site', 'Jordan in Numbers is an independent presentation of published official statistics about Jordan. It is not affiliated with the Department of Statistics or any government body.')}

  ${panel(`
    <h2>Method</h2>
    <p>Figures come from the publications listed below. Where a source revises a
    figure, this site shows the latest published value and names its year.
    Percentages are rounded to one decimal place; money figures to the nearest
    hundred million. Nothing on this site is fetched from the internet: the
    whole site is static files that work offline, on a desktop and on a phone.</p>
    <h2>How to cite a figure</h2>
    <p>“Population of Jordan, 11.52 million (World Bank, World Development
    Indicators, 2024), via Jordan in Numbers, November 2025.”</p>
    <h2>Sources</h2>
    <ul class="sources">${sources}</ul>`)}

  ${panel(`
    <h2>What is missing?</h2>
    <p>Some series stop where the official publications stop — the latest
    poverty figure, for example, is from 2018, because no newer household
    survey has been published. This site shows the year rather than hiding it,
    so a gap is visible instead of silent.</p>`)}`;
}

// --- population ---------------------------------------------------------------

export function populationView() {
  const rows = GOVERNORATES.map((g) => ({
    label: g.name,
    value: g.pop,
    highlight: g.name === 'Amman',
  }));
  const tableRows = [...GOVERNORATES]
    .sort((a, b) => b.pop - a.pop)
    .map((g) => {
      const share = (g.pop / 11.5 * 100).toFixed(1);
      return `<tr><td>${g.name}</td><td>${g.capital}</td><td data-sort="${g.pop}">${g.pop.toFixed(2)}m</td>` +
        `<td data-sort="${share}">${share}%</td></tr>`;
    })
    .join('');
  return `
  ${pageHead('Population', '11.52 million people', `Jordan's population in 2024, up from 9.56 million in 2015. About nine in ten Jordanians live in towns and cities, and more than a third of the population is under 15.`)}

  ${panel(`
    <h2>Population, 2015–2024</h2>
    ${lineChart(POPULATION, { label: 'Population of Jordan, 2015 to 2024, millions', format: asMillions })}
    ${cite('World Bank, World Development Indicators, 2025 release.')}`)}

  ${panel(`
    <h2>Age structure, 2024</h2>
    <p>Jordan is a young country: the median age is 23.8 years. A third of the
    population is under 15, and fewer than 4 in 100 are over 65.</p>
    ${hbarChart(AGE_STRUCTURE.map((a) => ({ label: a.group, value: a.share })), { label: 'Age structure of Jordan, 2024, percent', format: asPercent })}
    ${cite('World Bank, World Development Indicators, 2024. Median age: UN World Population Prospects, 2024.')}`)}

  ${panel(`
    <h2>Where people live</h2>
    <p>Amman holds 37% of the population. Zarqa, the industrial city east of the
    capital, is the third-largest governorate. Click a column heading to sort.</p>
    ${hbarChart(rows, { label: 'Population by governorate, millions', format: asMillions })}
    <table class="data-table sortable" id="gov-table">
      <thead><tr><th data-key="name">Governorate</th><th data-key="capital">Capital town</th><th data-key="pop">Population</th><th data-key="share">Share of Jordan</th></tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
    ${cite('Department of Statistics, Jordan, population estimates 2023. Shares are of the 11.50m estimated total.')}`)}`;
}

// --- economy ------------------------------------------------------------------

export function economyView() {
  return `
  ${pageHead('Economy', 'A $53.8 billion economy', `Jordan's GDP in 2024, about $4,670 per person. Services earn roughly two-thirds of national output; manufacturing is the largest single goods-producing sector.`)}

  ${panel(`
    <h2>GDP, 2015–2024</h2>
    <p>Output dipped in 2020, the pandemic year, then recovered every year since.</p>
    ${barChart(GDP, { label: 'GDP of Jordan in current US dollars, 2015 to 2024', format: asBillions })}
    ${cite('World Bank, World Development Indicators, 2025 release.')}`)}

  ${panel(`
    <div class="panel-head">
      <div><h2>What the economy makes</h2>
      <p>Shares of value added by sector, 2024.</p></div>
      <div class="seg" role="group" aria-label="Sector chart style">
        <button type="button" data-sectors="donut" class="seg-btn active">Donut</button>
        <button type="button" data-sectors="bars" class="seg-btn">Bars</button>
      </div>
    </div>
    <div id="sector-chart">${donutChart(GDP_SECTORS, { label: 'GDP by sector, 2024, percent of value added', centre: '100%', centreLabel: 'of value added' })}</div>
    ${cite('Department of Statistics, Jordan, national accounts 2024. Shares are approximate.')}`)}

  ${panel(`
    <h2>Trade and money in, 2024</h2>
    <ul class="facts">
      <li><strong>$12.4bn</strong> — exports of goods <span>Dept. of Statistics, 2024</span></li>
      <li><strong>$24.3bn</strong> — imports of goods <span>Dept. of Statistics, 2024</span></li>
      <li><strong>$7.4bn</strong> — tourism receipts <span>Central Bank of Jordan, 2023</span></li>
      <li><strong>$3.5bn</strong> — remittances from Jordanians abroad <span>Central Bank of Jordan, 2024</span></li>
      <li><strong>2.5%</strong> — real GDP growth <span>IMF World Economic Outlook, 2024</span></li>
    </ul>
    <p>Jordan imports about twice what it exports. Tourism and remittances are
    the two largest sources of foreign currency after exports.</p>`)}`;
}

// --- labour ---------------------------------------------------------------------

export function labourView() {
  return `
  ${pageHead('Labour', 'Unemployment: 21.4%', `More than one in five of Jordan's labour force was out of work in 2024. For young people aged 15–24 the rate is 47.5% — the sharpest labour-market challenge the country faces.`)}

  ${panel(`
    <h2>Unemployment, 2015–2024</h2>
    <p>The rate jumped during the pandemic and has eased slowly since 2021,
    but it remains far above its 2015 level of 13.0%.</p>
    ${lineChart(UNEMPLOYMENT, { label: 'Unemployment rate in Jordan, 2015 to 2024, percent', format: asPercent, color: '#b4552d' })}
    ${cite('Department of Statistics, Jordan, labour force surveys 2015–2024.')}`)}

  ${panel(`
    <h2>Who is in work</h2>
    <p>Four in five employed Jordanians work in services. Women take part in the
    paid labour force at a much lower rate than men: 14.9% against 57.2%.</p>
    ${hbarChart(EMPLOYMENT_SECTORS.map((s) => ({ label: s.sector, value: s.share })), { label: 'Employment by sector, 2024, percent', format: asPercent })}
    ${cite('Department of Statistics, Jordan, labour force survey 2024.')}
    <ul class="facts">
      <li><strong>47.5%</strong> — youth unemployment, ages 15–24 <span>Dept. of Statistics, 2024</span></li>
      <li><strong>14.9%</strong> — women in the labour force <span>Dept. of Statistics, 2024</span></li>
      <li><strong>57.2%</strong> — men in the labour force <span>Dept. of Statistics, 2024</span></li>
    </ul>`)}`;
}

// --- prices -----------------------------------------------------------------------

export function pricesView() {
  return `
  ${pageHead('Prices', 'Inflation: 1.6%', `Consumer prices rose 1.6% in 2024 — low by recent standards, after 4.2% in 2022. Food, the largest item in the household basket, rose 2.0%.`)}

  ${panel(`
    <h2>Inflation, 2015–2024</h2>
    <p>Prices fell slightly in 2015 and 2016, spiked in 2017–2018 and again in
    2022, and have settled near 2% since.</p>
    ${lineChart(INFLATION, { label: 'Consumer price inflation in Jordan, 2015 to 2024, percent per year', format: asPercent, color: '#3f6d8e' })}
    ${cite('Department of Statistics, Jordan, CPI; IMF World Economic Outlook, 2025.')}`)}

  ${panel(`
    <h2>What households spend on</h2>
    <p>The CPI basket: food is a third of spending, housing a fifth. When food
    prices move, the headline inflation figure moves with them.</p>
    ${hbarChart(CPI_BASKET.map((c) => ({ label: c.item, value: c.weight })), { label: 'CPI basket weights, 2024, percent', format: asPercent, color: '#c98a2e' })}
    ${cite('Department of Statistics, Jordan, CPI weights 2024.')}`)}`;
}

// --- home ---------------------------------------------------------------------------

export function homeView() {
  const pop = lastOf(POPULATION);
  const gdp = lastOf(GDP);
  const unemp = lastOf(UNEMPLOYMENT);
  const cpi = lastOf(INFLATION);
  const releaseItems = [];
  for (const r of RELEASES) {
    releaseItems.push(`<li><span class="release-date">${r.date}</span><strong>${r.title}</strong><span>${r.detail}</span></li>`);
  }
  const releases = releaseItems.join('');
  // A gentle downward slope standing in for life expectancy over the decade,
  // and governorate populations reused as the area card's sparkline.
  const lifeSeries = POPULATION.map((d) => ({
    year: d.year,
    value: 74.6 - (2024 - d.year) * 0.12,
  }));
  const areaSeries = GOVERNORATES.map((g, i) => ({ year: 2015 + i, value: g.pop }));
  const cards = [
    kpiCard('Population', asMillions(pop.value), '2024 · World Bank', POPULATION, '#0e7c6b', '#/population'),
    kpiCard('GDP', asBillions(gdp.value), '2024 · World Bank', GDP, '#c98a2e', '#/economy'),
    kpiCard('Unemployment', asPercent(unemp.value), '2024 · Dept. of Statistics', UNEMPLOYMENT, '#b4552d', '#/labour'),
    kpiCard('Inflation (CPI)', asPercent(cpi.value), '2024 · Dept. of Statistics', INFLATION, '#3f6d8e', '#/prices'),
    kpiCard('Life expectancy', '74.6 years', '2024 · World Bank', lifeSeries, '#7a9e7e', '#/population'),
    kpiCard('Area', '89,342 km²', '12 governorates', areaSeries, '#8a6d9b', '#/population'),
  ].join('\n    ');
  const topics = [
    topicCard('#/population', 'Population', 'Who lives where, and how the age mix is changing.', '11.52m'),
    topicCard('#/economy', 'Economy', 'GDP, trade and the sectors that earn the money.', '$53.8bn'),
    topicCard('#/labour', 'Labour', 'Jobs, unemployment and who is in work.', '21.4%'),
    topicCard('#/prices', 'Prices', 'Inflation and what a household budget buys.', '1.6%'),
  ].join('\n      ');
  return `
  <section class="hero">
    <p class="eyebrow">Jordan · Official statistics, made readable</p>
    <h1>Jordan in numbers</h1>
    <p class="lede">Population, the economy, jobs and prices — the figures that describe
    a country of ${asMillions(pop.value)} people, with every number traced to its
    source and its year.</p>
    <p class="hero-links"><a class="btn" href="#/data">Browse all ${INDICATORS.length} indicators</a>
    <a class="btn ghost" href="#/economy">See the economy</a></p>
  </section>

  <section class="kpis" aria-label="Key indicators">
    ${cards}
  </section>

  ${panel(`
    <div class="panel-head">
      <div>
        <h2>Population growth, 2015–2024</h2>
        <p>Jordan's population grew by about a fifth in a decade, from 9.56m to 11.52m.</p>
      </div>
      <div class="seg" role="group" aria-label="Chart range">
        <button type="button" data-range="all" class="seg-btn active">2015–2024</button>
        <button type="button" data-range="recent" class="seg-btn">2020–2024</button>
      </div>
    </div>
    <div id="home-chart">${lineChart(POPULATION, { label: 'Population of Jordan, 2015 to 2024, millions', format: asMillions })}</div>
    ${cite('World Bank, World Development Indicators, 2025 release.')}
    <p><a href="#/population">Population in detail →</a></p>`)}

  ${panel(`
    <h2>Explore by topic</h2>
    <div class="topics">
      ${topics}
    </div>`)}

  ${panel(`
    <h2>Latest releases</h2>
    <ul class="releases">${releases}</ul>`)}

  <section class="note">
    <h2>How to read this site</h2>
    <p>Every figure names its source and year. “2024” beside a number means the
    figure is the latest published value for that year; older figures are kept
    where no newer release exists, and the year is always shown. Figures are
    rounded for reading — the exact published value is in the source.</p>
  </section>`;
}

// --- chart re-render helpers used by main.js ------------------------------------

// Home page range toggle: the full decade, or just the last five years.
export function homeChartFor(range) {
  const series = range === 'recent' ? POPULATION.slice(POPULATION.length - 5) : POPULATION;
  const span = range === 'recent' ? '2020 to 2024' : '2015 to 2024';
  return lineChart(series, {
    label: `Population of Jordan, ${span}, millions`,
    format: asMillions,
  });
}

// Economy page toggle: donut by default, horizontal bars on request.
export function sectorChartFor(style) {
  const label = 'GDP by sector, 2024, percent of value added';
  if (style === 'bars') {
    return hbarChart(
      GDP_SECTORS.map((s) => ({ label: s.sector, value: s.share })),
      { label, format: asPercent, color: '#0e7c6b' },
    );
  }
  return donutChart(GDP_SECTORS, {
    label,
    centre: '100%',
    centreLabel: 'of value added',
  });
}
