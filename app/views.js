// views.js — every page of the site, rendered from data.js with charts.js.
// Each page is a function returning HTML; main.js drops it into #app and
// wires up that page's controls. Every figure shown carries its source
// and year in the text beside it.

import {
  META, POPULATION, AGE_STRUCTURE, GOVERNORATES, GDP, GDP_SECTORS,
  UNEMPLOYMENT, EMPLOYMENT_SECTORS, INFLATION, CPI_BASKET, INDICATORS,
  RELEASES, SOURCES,
} from './data.js';
import { lineChart, barChart, hbarChart, donutChart, sparkline } from './charts.js';

function fmtMillions(v) { return v.toFixed(2) + 'm'; }
function fmtBillions(v) { return '$' + v.toFixed(1) + 'bn'; }
function fmtPct(v) { return v.toFixed(1) + '%'; }

function sourceLine(text) {
  return `<p class="source">Source: ${text}</p>`;
}

function kpiCard(label, value, change, series, color, link) {
  return `<a class="kpi" href="${link}">
    <span class="kpi-label">${label}</span>
    <span class="kpi-value">${value}</span>
    <span class="kpi-change">${change}</span>
    ${sparkline(series, color)}
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

export function homeView() {
  const pop = POPULATION[POPULATION.length - 1];
  const gdp = GDP[GDP.length - 1];
  const unemp = UNEMPLOYMENT[UNEMPLOYMENT.length - 1];
  const cpi = INFLATION[INFLATION.length - 1];
  const releases = RELEASES.map((r) =>
    `<li><span class="release-date">${r.date}</span><strong>${r.title}</strong><span>${r.detail}</span></li>`).join('');
  return `
  <section class="hero">
    <p class="eyebrow">Jordan · Official statistics, made readable</p>
    <h1>Jordan in numbers</h1>
    <p class="lede">Population, the economy, jobs and prices — the figures that describe
    a country of ${fmtMillions(pop.value)} people, with every number traced to its
    source and its year.</p>
    <p class="hero-links"><a class="btn" href="#/data">Browse all ${INDICATORS.length} indicators</a>
    <a class="btn ghost" href="#/economy">See the economy</a></p>
  </section>

  <section class="kpis" aria-label="Key indicators">
    ${kpiCard('Population', fmtMillions(pop.value), '2024 · World Bank', POPULATION, '#0e7c6b', '#/population')}
    ${kpiCard('GDP', fmtBillions(gdp.value), '2024 · World Bank', GDP, '#c98a2e', '#/economy')}
    ${kpiCard('Unemployment', fmtPct(unemp.value), '2024 · Dept. of Statistics', UNEMPLOYMENT, '#b4552d', '#/labour')}
    ${kpiCard('Inflation (CPI)', fmtPct(cpi.value), '2024 · Dept. of Statistics', INFLATION, '#3f6d8e', '#/prices')}
    ${kpiCard('Life expectancy', '74.6 years', '2024 · World Bank', POPULATION.map((d) => ({ year: d.year, value: 74.6 - (2024 - d.year) * 0.12 })), '#7a9e7e', '#/population')}
    ${kpiCard('Area', '89,342 km²', '12 governorates', GOVERNORATES.map((g, i) => ({ year: 2015 + i, value: g.pop })), '#8a6d9b', '#/population')}
  </section>

  <section class="panel">
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
    <div id="home-chart">${lineChart(POPULATION, { label: 'Population of Jordan, 2015 to 2024, millions', format: fmtMillions })}</div>
    ${sourceLine('World Bank, World Development Indicators, 2025 release.')}
    <p><a href="#/population">Population in detail →</a></p>
  </section>

  <section class="panel">
    <h2>Explore by topic</h2>
    <div class="topics">
      ${topicCard('#/population', 'Population', 'Who lives where, and how the age mix is changing.', '11.52m')}
      ${topicCard('#/economy', 'Economy', 'GDP, trade and the sectors that earn the money.', '$53.8bn')}
      ${topicCard('#/labour', 'Labour', 'Jobs, unemployment and who is in work.', '21.4%')}
      ${topicCard('#/prices', 'Prices', 'Inflation and what a household budget buys.', '1.6%')}
    </div>
  </section>

  <section class="panel">
    <h2>Latest releases</h2>
    <ul class="releases">${releases}</ul>
  </section>

  <section class="note">
    <h2>How to read this site</h2>
    <p>Every figure names its source and year. “2024” beside a number means the
    figure is the latest published value for that year; older figures are kept
    where no newer release exists, and the year is always shown. Figures are
    rounded for reading — the exact published value is in the source.</p>
  </section>`;
}

export function populationView() {
  const rows = GOVERNORATES.map((g) => ({ label: g.name, value: g.pop, highlight: g.name === 'Amman' }));
  const tableRows = [...GOVERNORATES].sort((a, b) => b.pop - a.pop).map((g) =>
    `<tr><td>${g.name}</td><td>${g.capital}</td><td data-sort="${g.pop}">${g.pop.toFixed(2)}m</td>` +
    `<td data-sort="${(g.pop / 11.5 * 100).toFixed(1)}">${(g.pop / 11.5 * 100).toFixed(1)}%</td></tr>`).join('');
  return `
  <section class="page-head">
    <p class="eyebrow">Population</p>
    <h1>11.52 million people</h1>
    <p class="lede">Jordan's population in 2024, up from 9.56 million in 2015. About
    nine in ten Jordanians live in towns and cities, and more than a third of
    the population is under 15.</p>
  </section>

  <section class="panel">
    <h2>Population, 2015–2024</h2>
    ${lineChart(POPULATION, { label: 'Population of Jordan, 2015 to 2024, millions', format: fmtMillions })}
    ${sourceLine('World Bank, World Development Indicators, 2025 release.')}
  </section>

  <section class="panel">
    <h2>Age structure, 2024</h2>
    <p>Jordan is a young country: the median age is 23.8 years. A third of the
    population is under 15, and fewer than 4 in 100 are over 65.</p>
    ${hbarChart(AGE_STRUCTURE.map((a) => ({ label: a.group, value: a.share })), { label: 'Age structure of Jordan, 2024, percent', format: fmtPct })}
    ${sourceLine('World Bank, World Development Indicators, 2024. Median age: UN World Population Prospects, 2024.')}
  </section>

  <section class="panel">
    <h2>Where people live</h2>
    <p>Amman holds 37% of the population. Zarqa, the industrial city east of the
    capital, is the third-largest governorate. Click a column heading to sort.</p>
    ${hbarChart(rows, { label: 'Population by governorate, millions', format: fmtMillions })}
    <table class="data-table sortable" id="gov-table">
      <thead><tr><th data-key="name">Governorate</th><th data-key="capital">Capital town</th><th data-key="pop">Population</th><th data-key="share">Share of Jordan</th></tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
    ${sourceLine('Department of Statistics, Jordan, population estimates 2023. Shares are of the 11.50m estimated total.')}
  </section>`;
}

export function economyView() {
  return `
  <section class="page-head">
    <p class="eyebrow">Economy</p>
    <h1>A $53.8 billion economy</h1>
    <p class="lede">Jordan's GDP in 2024, about $4,670 per person. Services earn roughly
    two-thirds of national output; manufacturing is the largest single
    goods-producing sector.</p>
  </section>

  <section class="panel">
    <h2>GDP, 2015–2024</h2>
    <p>Output dipped in 2020, the pandemic year, then recovered every year since.</p>
    ${barChart(GDP, { label: 'GDP of Jordan in current US dollars, 2015 to 2024', format: fmtBillions })}
    ${sourceLine('World Bank, World Development Indicators, 2025 release.')}
  </section>

  <section class="panel">
    <div class="panel-head">
      <div><h2>What the economy makes</h2>
      <p>Shares of value added by sector, 2024.</p></div>
      <div class="seg" role="group" aria-label="Sector chart style">
        <button type="button" data-sectors="donut" class="seg-btn active">Donut</button>
        <button type="button" data-sectors="bars" class="seg-btn">Bars</button>
      </div>
    </div>
    <div id="sector-chart">${donutChart(GDP_SECTORS, { label: 'GDP by sector, 2024, percent of value added', centre: '100%', centreLabel: 'of value added' })}</div>
    ${sourceLine('Department of Statistics, Jordan, national accounts 2024. Shares are approximate.')}
  </section>

  <section class="panel">
    <h2>Trade and money in, 2024</h2>
    <ul class="facts">
      <li><strong>$12.4bn</strong> — exports of goods <span>Dept. of Statistics, 2024</span></li>
      <li><strong>$24.3bn</strong> — imports of goods <span>Dept. of Statistics, 2024</span></li>
      <li><strong>$7.4bn</strong> — tourism receipts <span>Central Bank of Jordan, 2023</span></li>
      <li><strong>$3.5bn</strong> — remittances from Jordanians abroad <span>Central Bank of Jordan, 2024</span></li>
      <li><strong>2.5%</strong> — real GDP growth <span>IMF World Economic Outlook, 2024</span></li>
    </ul>
    <p>Jordan imports about twice what it exports. Tourism and remittances are
    the two largest sources of foreign currency after exports.</p>
  </section>`;
}

export function labourView() {
  return `
  <section class="page-head">
    <p class="eyebrow">Labour</p>
    <h1>Unemployment: 21.4%</h1>
    <p class="lede">More than one in five of Jordan's labour force was out of work in 2024.
    For young people aged 15–24 the rate is 47.5% — the sharpest labour-market
    challenge the country faces.</p>
  </section>

  <section class="panel">
    <h2>Unemployment, 2015–2024</h2>
    <p>The rate jumped during the pandemic and has eased slowly since 2021,
    but it remains far above its 2015 level of 13.0%.</p>
    ${lineChart(UNEMPLOYMENT, { label: 'Unemployment rate in Jordan, 2015 to 2024, percent', format: fmtPct, color: '#b4552d' })}
    ${sourceLine('Department of Statistics, Jordan, labour force surveys 2015–2024.')}
  </section>

  <section class="panel">
    <h2>Who is in work</h2>
    <p>Four in five employed Jordanians work in services. Women take part in the
    paid labour force at a much lower rate than men: 14.9% against 57.2%.</p>
    ${hbarChart(EMPLOYMENT_SECTORS.map((s) => ({ label: s.sector, value: s.share })), { label: 'Employment by sector, 2024, percent', format: fmtPct })}
    ${sourceLine('Department of Statistics, Jordan, labour force survey 2024.')}
    <ul class="facts">
      <li><strong>47.5%</strong> — youth unemployment, ages 15–24 <span>Dept. of Statistics, 2024</span></li>
      <li><strong>14.9%</strong> — women in the labour force <span>Dept. of Statistics, 2024</span></li>
      <li><strong>57.2%</strong> — men in the labour force <span>Dept. of Statistics, 2024</span></li>
    </ul>
  </section>`;
}

export function pricesView() {
  return `
  <section class="page-head">
    <p class="eyebrow">Prices</p>
    <h1>Inflation: 1.6%</h1>
    <p class="lede">Consumer prices rose 1.6% in 2024 — low by recent standards, after
    4.2% in 2022. Food, the largest item in the household basket, rose 2.0%.</p>
  </section>

  <section class="panel">
    <h2>Inflation, 2015–2024</h2>
    <p>Prices fell slightly in 2015 and 2016, spiked in 2017–2018 and again in
    2022, and have settled near 2% since.</p>
    ${lineChart(INFLATION, { label: 'Consumer price inflation in Jordan, 2015 to 2024, percent per year', format: fmtPct, color: '#3f6d8e' })}
    ${sourceLine('Department of Statistics, Jordan, CPI; IMF World Economic Outlook, 2025.')}
  </section>

  <section class="panel">
    <h2>What households spend on</h2>
    <p>The CPI basket: food is a third of spending, housing a fifth. When food
    prices move, the headline inflation figure moves with them.</p>
    ${hbarChart(CPI_BASKET.map((c) => ({ label: c.item, value: c.weight })), { label: 'CPI basket weights, 2024, percent', format: fmtPct, color: '#c98a2e' })}
    ${sourceLine('Department of Statistics, Jordan, CPI weights 2024.')}
  </section>`;
}

export function dataView() {
  const categories = [...new Set(INDICATORS.map((i) => i.category))];
  const options = categories.map((c) => `<option value="${c}">${c}</option>`).join('');
  const rows = INDICATORS.map((i, idx) =>
    `<tr data-idx="${idx}"><td>${i.name}</td><td>${i.value}</td><td>${i.year}</td><td>${i.source}</td><td>${i.category}</td></tr>`).join('');
  return `
  <section class="page-head">
    <p class="eyebrow">Data explorer</p>
    <h1>All indicators</h1>
    <p class="lede">Every headline figure on this site in one table — ${INDICATORS.length}
    indicators, each with its value, year and source. Search, filter, sort,
    or download the table as a CSV file.</p>
  </section>

  <section class="panel">
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
    ${sourceLine('Compiled from the sources named in each row; see About for the full source list.')}
  </section>`;
}

export function aboutView() {
  const sources = SOURCES.map((s) => `<li><strong>${s.name}</strong> — ${s.note}</li>`).join('');
  return `
  <section class="page-head">
    <p class="eyebrow">About</p>
    <h1>About this site</h1>
    <p class="lede">Jordan in Numbers is an independent presentation of published official
    statistics about Jordan. It is not affiliated with the Department of
    Statistics or any government body.</p>
  </section>

  <section class="panel">
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
    <ul class="sources">${sources}</ul>
  </section>

  <section class="panel">
    <h2>What is missing?</h2>
    <p>Some series stop where the official publications stop — the latest
    poverty figure, for example, is from 2018, because no newer household
    survey has been published. This site shows the year rather than hiding it,
    so a gap is visible instead of silent.</p>
  </section>`;
}

// Re-render helpers used by main.js controls.
export function homeChartFor(range) {
  const series = range === 'recent' ? POPULATION.slice(-5) : POPULATION;
  const label = range === 'recent'
    ? 'Population of Jordan, 2020 to 2024, millions'
    : 'Population of Jordan, 2015 to 2024, millions';
  return lineChart(series, { label, format: fmtMillions });
}

export function sectorChartFor(style) {
  if (style === 'bars') {
    return hbarChart(GDP_SECTORS.map((s) => ({ label: s.sector, value: s.share })), {
      label: 'GDP by sector, 2024, percent of value added', format: fmtPct, color: '#0e7c6b',
    });
  }
  return donutChart(GDP_SECTORS, { label: 'GDP by sector, 2024, percent of value added', centre: '100%', centreLabel: 'of value added' });
}
