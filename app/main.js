// main.js — routing and controls for Jordan in Numbers.
// Hash routes: #/ home, #/population, #/economy, #/labour, #/prices,
// #/data, #/about. No network: every page is rendered from data.js.

import { INDICATORS } from './data.js';
import {
  homeView, populationView, economyView, labourView, pricesView,
  dataView, aboutView, homeChartFor, sectorChartFor,
} from './views.js';

const app = document.getElementById('app');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));

const ROUTES = {
  '/': homeView,
  '/population': populationView,
  '/economy': economyView,
  '/labour': labourView,
  '/prices': pricesView,
  '/data': dataView,
  '/about': aboutView,
};

function currentRoute() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  return ROUTES[hash] ? hash : '/';
}

function render() {
  const route = currentRoute();
  app.innerHTML = ROUTES[route]();
  navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + route));
  document.title = document.querySelector('h1')?.textContent + ' — Jordan in Numbers' || 'Jordan in Numbers';
  window.scrollTo(0, 0);
  wirePage(route);
}

// Sortable tables: click a <th data-key> to sort that column, toggling direction.
function wireSortable(table) {
  if (!table) return;
  const tbody = table.querySelector('tbody');
  let key = null;
  let dir = 1;
  table.querySelectorAll('th[data-key]').forEach((th) => {
    th.addEventListener('click', () => {
      const k = th.dataset.key;
      dir = k === key ? -dir : 1;
      key = k;
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const col = Array.from(th.parentElement.children).indexOf(th);
      rows.sort((a, b) => {
        const av = a.children[col].dataset.sort ?? a.children[col].textContent.trim();
        const bv = b.children[col].dataset.sort ?? b.children[col].textContent.trim();
        const an = parseFloat(av);
        const bn = parseFloat(bv);
        if (!Number.isNaN(an) && !Number.isNaN(bn)) return (an - bn) * dir;
        return av.localeCompare(bv) * dir;
      });
      rows.forEach((r) => tbody.appendChild(r));
      table.querySelectorAll('th').forEach((h) => h.removeAttribute('aria-sort'));
      th.setAttribute('aria-sort', dir === 1 ? 'ascending' : 'descending');
    });
  });
}

function wirePage(route) {
  // Home: chart range buttons.
  if (route === '/') {
    const chart = document.getElementById('home-chart');
    document.querySelectorAll('[data-range]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-range]').forEach((b) => b.classList.toggle('active', b === btn));
        chart.innerHTML = homeChartFor(btn.dataset.range);
      });
    });
  }

  // Economy: donut / bars toggle for the sector chart.
  if (route === '/economy') {
    const chart = document.getElementById('sector-chart');
    document.querySelectorAll('[data-sectors]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-sectors]').forEach((b) => b.classList.toggle('active', b === btn));
        chart.innerHTML = sectorChartFor(btn.dataset.sectors);
      });
    });
  }

  // Population + explorer tables sort on header click.
  wireSortable(document.getElementById('gov-table'));
  wireSortable(document.getElementById('explorer-table'));

  // Data explorer: live search, category filter, CSV download.
  if (route === '/data') {
    const search = document.getElementById('explorer-search');
    const category = document.getElementById('explorer-category');
    const table = document.getElementById('explorer-table');
    const count = document.getElementById('explorer-count');
    const applyFilter = () => {
      const q = search.value.trim().toLowerCase();
      const cat = category.value;
      let shown = 0;
      table.querySelectorAll('tbody tr').forEach((row) => {
        const text = row.textContent.toLowerCase();
        const ok = (!q || text.includes(q)) && (!cat || row.children[4].textContent === cat);
        row.style.display = ok ? '' : 'none';
        if (ok) shown += 1;
      });
      count.textContent = `${shown} indicator${shown === 1 ? '' : 's'} shown`;
    };
    search.addEventListener('input', applyFilter);
    category.addEventListener('change', applyFilter);

    document.getElementById('explorer-download').addEventListener('click', () => {
      const visible = Array.from(table.querySelectorAll('tbody tr'))
        .filter((row) => row.style.display !== 'none')
        .map((row) => Array.from(row.children).map((c) => `"${c.textContent.replace(/"/g, '""')}"`).join(','));
      const csv = ['"Indicator","Value","Year","Source","Category"', ...visible].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'jordan-indicators.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }
}

window.addEventListener('hashchange', render);
render();
