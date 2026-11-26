// Routing and page controls for "Jordan in Numbers".
//
// Hash routes: #/ home, #/population, #/economy, #/labour, #/prices,
// #/data, #/about. Nothing is fetched: each page is rendered from data.js
// by views.js, and this file only swaps the HTML in and wires up the
// controls that page happens to need.

import { INDICATORS } from './data.js';
import {
  homeView, populationView, economyView, labourView, pricesView,
  dataView, aboutView, homeChartFor, sectorChartFor,
} from './views.js';

const mount = document.getElementById('app');
const navItems = [...document.querySelectorAll('.nav-link')];

// Route table: hash path (without the leading #) to its view function.
const PAGES = {
  '/': homeView,
  '/population': populationView,
  '/economy': economyView,
  '/labour': labourView,
  '/prices': pricesView,
  '/data': dataView,
  '/about': aboutView,
};

function resolveRoute() {
  const path = window.location.hash.replace(/^#/, '') || '/';
  return PAGES[path] ? path : '/';
}

function paint() {
  const route = resolveRoute();
  mount.innerHTML = PAGES[route]();
  for (const link of navItems) {
    link.classList.toggle('active', link.getAttribute('href') === `#${route}`);
  }
  const heading = document.querySelector('h1');
  document.title = heading ? `${heading.textContent} — Jordan in Numbers` : 'Jordan in Numbers';
  window.scrollTo(0, 0);
  wireControls(route);
}

// Compare two table cells for sorting: numbers numerically, text with
// locale order. A cell's data-sort attribute wins over its visible text.
function compareCells(aCell, bCell, direction) {
  const aText = aCell.dataset.sort ?? aCell.textContent.trim();
  const bText = bCell.dataset.sort ?? bCell.textContent.trim();
  const aNum = parseFloat(aText);
  const bNum = parseFloat(bText);
  if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return (aNum - bNum) * direction;
  return aText.localeCompare(bText) * direction;
}

// Click a <th data-key> to sort that column; a second click flips direction.
function makeSortable(table) {
  if (!table) return;
  const body = table.querySelector('tbody');
  let sortKey = null;
  let direction = 1;
  for (const th of table.querySelectorAll('th[data-key]')) {
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      direction = key === sortKey ? -direction : 1;
      sortKey = key;
      const column = [...th.parentElement.children].indexOf(th);
      const rows = [...body.querySelectorAll('tr')];
      const byColumn = (a, b) => compareCells(a.children[column], b.children[column], direction);
      rows.sort(byColumn);
      for (const row of rows) body.appendChild(row);
      for (const h of table.querySelectorAll('th')) h.removeAttribute('aria-sort');
      th.setAttribute('aria-sort', direction === 1 ? 'ascending' : 'descending');
    });
  }
}

// Home page: the 2015–2024 / 2020–2024 range buttons redraw the chart.
function wireHome() {
  const chart = document.getElementById('home-chart');
  const buttons = document.querySelectorAll('[data-range]');
  for (const btn of buttons) {
    btn.addEventListener('click', () => {
      for (const b of buttons) b.classList.toggle('active', b === btn);
      chart.innerHTML = homeChartFor(btn.dataset.range);
    });
  }
}

// Economy page: the donut / bars toggle redraws the sector chart.
function wireEconomy() {
  const chart = document.getElementById('sector-chart');
  const buttons = document.querySelectorAll('[data-sectors]');
  for (const btn of buttons) {
    btn.addEventListener('click', () => {
      for (const b of buttons) b.classList.toggle('active', b === btn);
      chart.innerHTML = sectorChartFor(btn.dataset.sectors);
    });
  }
}

// Data explorer: live search, category filter and a CSV download of the
// rows currently visible.
function wireExplorer() {
  const search = document.getElementById('explorer-search');
  const category = document.getElementById('explorer-category');
  const table = document.getElementById('explorer-table');
  const count = document.getElementById('explorer-count');
  const download = document.getElementById('explorer-download');

  const applyFilter = () => {
    const query = search.value.trim().toLowerCase();
    const wanted = category.value;
    let shown = 0;
    for (const row of table.querySelectorAll('tbody tr')) {
      const matchesText = !query || row.textContent.toLowerCase().includes(query);
      const matchesCategory = !wanted || row.children[4].textContent === wanted;
      const visible = matchesText && matchesCategory;
      row.style.display = visible ? '' : 'none';
      if (visible) shown += 1;
    }
    count.textContent = `${shown} indicator${shown === 1 ? '' : 's'} shown`;
  };
  search.addEventListener('input', applyFilter);
  category.addEventListener('change', applyFilter);

  download.addEventListener('click', () => {
    const lines = ['"Indicator","Value","Year","Source","Category"'];
    for (const row of table.querySelectorAll('tbody tr')) {
      if (row.style.display === 'none') continue;
      const cells = [...row.children].map((c) => `"${c.textContent.replaceAll('"', '""')}"`);
      lines.push(cells.join(','));
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'jordan-indicators.csv';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}

function wireControls(route) {
  switch (route) {
    case '/':
      wireHome();
      break;
    case '/economy':
      wireEconomy();
      break;
    case '/data':
      wireExplorer();
      break;
    default:
      break;
  }
  makeSortable(document.getElementById('gov-table'));
  makeSortable(document.getElementById('explorer-table'));
}

window.addEventListener('hashchange', paint);
paint();
