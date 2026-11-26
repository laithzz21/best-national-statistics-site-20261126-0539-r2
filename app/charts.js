// charts.js — small SVG charts drawn from the site's own figures.
// No library, no network: every chart is a string of SVG built here and
// dropped into the page by views.js. All charts carry a <title> and axis
// labels so they read without colour alone.

const NS = 'http://www.w3.org/2000/svg';
const INK = '#0f3b3a';
const TEAL = '#0e7c6b';
const SAND = '#c98a2e';
const LINE = '#d9ddd8';
const GRID = '#e7eae5';
const MUTED = '#5d6b66';

function esc(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Smallest "nice" ceiling at or above max, from the 1 / 1.5 / 2 / 3 / 4 /
// 5 / 6 / 8 / 10 ladder: a 53.8 top becomes 60, not 100, so bars and lines
// fill the chart instead of squatting at its bottom.
function niceMax(max) {
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  for (const m of [1, 1.5, 2, 3, 4, 5, 6, 8, 10]) {
    if (m * pow >= max) return m * pow;
  }
  return 10 * pow;
}

function niceTicks(max, count) {
  const top = niceMax(max);
  const out = [];
  for (let i = 0; i <= count; i++) out.push((top * i) / count);
  return out;
}

// Line chart for a {year, value} series. opts: {label, format, color, height}.
export function lineChart(series, opts = {}) {
  const width = 760;
  const height = opts.height || 300;
  const padL = 56;
  const padR = 16;
  const padT = 18;
  const padB = 34;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const color = opts.color || TEAL;
  const values = series.map((d) => d.value);
  const min = Math.min(0, ...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const x = (i) => padL + (i / (series.length - 1)) * innerW;
  const y = (v) => padT + innerH - ((v - min) / span) * innerH;
  const fmt = opts.format || ((v) => String(v));
  const ticks = niceTicks(max - min, 4).map((t) => t + min);
  const points = series.map((d, i) => `${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ');
  const area = `${padL},${y(min)} ${points} ${x(series.length - 1).toFixed(1)},${y(min)}`;
  let grid = '';
  for (const t of ticks) {
    grid += `<line x1="${padL}" y1="${y(t)}" x2="${width - padR}" y2="${y(t)}" stroke="${GRID}" stroke-width="1"/>` +
      `<text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${esc(fmt(t))}</text>`;
  }
  let labels = '';
  series.forEach((d, i) => {
    if (i % 2 === 0 || i === series.length - 1) {
      labels += `<text x="${x(i)}" y="${height - 10}" text-anchor="middle" font-size="11" fill="${MUTED}">${d.year}</text>`;
    }
  });
  let dots = '';
  series.forEach((d, i) => {
    dots += `<circle cx="${x(i)}" cy="${y(d.value)}" r="3.5" fill="#fff" stroke="${color}" stroke-width="2">` +
      `<title>${d.year}: ${esc(fmt(d.value))}</title></circle>`;
  });
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(opts.label || 'Line chart')}" class="chart" xmlns="${NS}">` +
    `<title>${esc(opts.label || 'Line chart')}</title>` +
    `<polygon points="${area}" fill="${color}" opacity="0.10"/>` +
    grid +
    `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>` +
    dots + labels +
    `</svg>`;
}

// Vertical bar chart for a {year, value} series.
export function barChart(series, opts = {}) {
  const width = 760;
  const height = opts.height || 300;
  const padL = 56;
  const padR = 16;
  const padT = 18;
  const padB = 34;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const color = opts.color || TEAL;
  const max = Math.max(...series.map((d) => d.value));
  const top = niceMax(max);
  const fmt = opts.format || ((v) => String(v));
  const slot = innerW / series.length;
  const barW = Math.min(46, slot * 0.62);
  const ticks = niceTicks(top, 4);
  let grid = '';
  for (const t of ticks) {
    const yy = padT + innerH - (t / top) * innerH;
    grid += `<line x1="${padL}" y1="${yy}" x2="${width - padR}" y2="${yy}" stroke="${GRID}" stroke-width="1"/>` +
      `<text x="${padL - 8}" y="${yy + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${esc(fmt(t))}</text>`;
  }
  let bars = '';
  series.forEach((d, i) => {
    const h = (d.value / top) * innerH;
    const bx = padL + i * slot + (slot - barW) / 2;
    const by = padT + innerH - h;
    bars += `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${barW}" height="${h.toFixed(1)}" rx="3" fill="${i === series.length - 1 ? SAND : color}">` +
      `<title>${d.year}: ${esc(fmt(d.value))}</title></rect>` +
      `<text x="${(bx + barW / 2).toFixed(1)}" y="${by - 6}" text-anchor="middle" font-size="11" fill="${INK}">${esc(fmt(d.value))}</text>` +
      `<text x="${(bx + barW / 2).toFixed(1)}" y="${height - 10}" text-anchor="middle" font-size="11" fill="${MUTED}">${d.year}</text>`;
  });
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(opts.label || 'Bar chart')}" class="chart" xmlns="${NS}">` +
    `<title>${esc(opts.label || 'Bar chart')}</title>` + grid + bars + `</svg>`;
}

// Horizontal bar chart for labelled values, e.g. governorates or age groups.
export function hbarChart(rows, opts = {}) {
  const rowH = 34;
  const width = 760;
  const height = rowH * rows.length + 24;
  const padL = 150;
  const padR = 64;
  const innerW = width - padL - padR;
  const max = Math.max(...rows.map((r) => r.value));
  const fmt = opts.format || ((v) => String(v));
  const color = opts.color || TEAL;
  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(opts.label || 'Bar chart')}" class="chart" xmlns="${NS}">` +
    `<title>${esc(opts.label || 'Bar chart')}</title>`;
  rows.forEach((r, i) => {
    const yy = 12 + i * rowH;
    const w = (r.value / max) * innerW;
    out += `<text x="${padL - 10}" y="${yy + 15}" text-anchor="end" font-size="12" fill="${INK}">${esc(r.label)}</text>` +
      `<rect x="${padL}" y="${yy}" width="${Math.max(2, w).toFixed(1)}" height="20" rx="3" fill="${r.highlight ? SAND : color}">` +
      `<title>${esc(r.label)}: ${esc(fmt(r.value))}</title></rect>` +
      `<text x="${(padL + w + 8).toFixed(1)}" y="${yy + 15}" font-size="12" fill="${INK}">${esc(fmt(r.value))}</text>`;
  });
  return out + `</svg>`;
}

// Donut chart for shares that add to about 100.
export function donutChart(rows, opts = {}) {
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const r = 110;
  const thick = 44;
  const colors = ['#0e7c6b', '#c98a2e', '#3f6d8e', '#7a9e7e', '#b4552d', '#8a6d9b', '#5d6b66'];
  const total = rows.reduce((s, d) => s + d.share, 0) || 1;
  let angle = -Math.PI / 2;
  let slices = '';
  rows.forEach((d, i) => {
    const frac = d.share / total;
    const a0 = angle;
    const a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    slices += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="${colors[i % colors.length]}" stroke-width="${thick}">` +
      `<title>${esc(d.sector)}: ${d.share}%</title></path>`;
  });
  const legend = rows.map((d, i) =>
    `<li><span class="swatch" style="background:${colors[i % colors.length]}"></span>${esc(d.sector)} — <strong>${d.share}%</strong></li>`).join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 ${size} ${size}" role="img" aria-label="${esc(opts.label || 'Donut chart')}" class="chart donut" xmlns="${NS}">` +
    `<title>${esc(opts.label || 'Donut chart')}</title>${slices}` +
    `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="26" font-weight="700" fill="${INK}">${esc(opts.centre || '')}</text>` +
    `<text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="12" fill="${MUTED}">${esc(opts.centreLabel || '')}</text>` +
    `</svg><ul class="legend">${legend}</ul></div>`;
}

// Tiny inline sparkline used on the home page cards.
export function sparkline(series, color) {
  const w = 120;
  const h = 36;
  const values = series.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = series.map((d, i) =>
    `${((i / (series.length - 1)) * w).toFixed(1)},${(h - 4 - ((d.value - min) / span) * (h - 8)).toFixed(1)}`).join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" class="spark" aria-hidden="true" xmlns="${NS}">` +
    `<polyline points="${pts}" fill="none" stroke="${color || TEAL}" stroke-width="2" stroke-linejoin="round"/></svg>`;
}
