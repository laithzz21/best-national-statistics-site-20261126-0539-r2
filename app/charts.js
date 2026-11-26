// Hand-rolled SVG charts for "Jordan in Numbers".
//
// Nothing here reaches for a charting library or the network: each function
// takes one of the site's own series and returns an SVG string, which the
// views drop straight into the page. Every chart has a <title> and labelled
// axes, so it still makes sense when colour alone does not carry the point.

const SVG_NS = 'http://www.w3.org/2000/svg';

// Palette shared by every chart on the site.
const PALETTE = {
  ink: '#0f3b3a',
  teal: '#0e7c6b',
  sand: '#c98a2e',
  grid: '#e7eae5',
  axis: '#d9ddd8',
  muted: '#5d6b66',
};

const DONUT_COLOURS = [
  '#0e7c6b', '#c98a2e', '#3f6d8e', '#7a9e7e', '#b4552d', '#8a6d9b', '#5d6b66',
];

// Escape text that ends up inside SVG markup.
function xmlEscape(raw) {
  return String(raw)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

// Pick the smallest "round" ceiling at or above a maximum, walking the
// 1 / 1.5 / 2 / 3 / 4 / 5 / 6 / 8 / 10 ladder. A top value of 53.8 lands on
// 60 rather than 100, so the marks fill the chart instead of hugging its
// base.
function niceCeiling(maxValue) {
  const power = 10 ** Math.floor(Math.log10(maxValue));
  const ladder = [1, 1.5, 2, 3, 4, 5, 6, 8, 10];
  const step = ladder.find((s) => s * power >= maxValue);
  return step === undefined ? 10 * power : step * power;
}

function tickValues(maxValue, count) {
  const top = niceCeiling(maxValue);
  return Array.from({ length: count + 1 }, (_, i) => (top * i) / count);
}

function svgOpen(width, height, label) {
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${xmlEscape(label)}" class="chart" xmlns="${SVG_NS}"><title>${xmlEscape(label)}</title>`;
}

// A small sparkline for the home-page cards: just a line, no axes.
export function sparkline(series, colour) {
  const w = 120;
  const h = 36;
  const values = series.map((d) => d.value);
  const low = Math.min(...values);
  const high = Math.max(...values);
  const span = high - low || 1;
  const coords = [];
  for (let i = 0; i < series.length; i += 1) {
    const px = ((i / (series.length - 1)) * w).toFixed(1);
    const py = (h - 4 - ((series[i].value - low) / span) * (h - 8)).toFixed(1);
    coords.push(`${px},${py}`);
  }
  const points = coords.join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" class="spark" aria-hidden="true" xmlns="${SVG_NS}">` +
    `<polyline points="${points}" fill="none" stroke="${colour || PALETTE.teal}" stroke-width="2" stroke-linejoin="round"/></svg>`;
}

// Donut chart for shares that add up to roughly 100, with a legend.
export function donutChart(rows, opts = {}) {
  const size = 300;
  const centre = size / 2;
  const radius = 110;
  const thickness = 44;
  const total = rows.reduce((sum, d) => sum + d.share, 0) || 1;
  const slices = [];
  let angle = -Math.PI / 2;
  rows.forEach((d, i) => {
    const fraction = d.share / total;
    const startAngle = angle;
    const endAngle = angle + fraction * Math.PI * 2;
    angle = endAngle;
    const largeArc = fraction > 0.5 ? 1 : 0;
    const x0 = centre + radius * Math.cos(startAngle);
    const y0 = centre + radius * Math.sin(startAngle);
    const x1 = centre + radius * Math.cos(endAngle);
    const y1 = centre + radius * Math.sin(endAngle);
    const colour = DONUT_COLOURS[i % DONUT_COLOURS.length];
    slices.push(
      `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${radius} ${radius} 0 ${largeArc} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="${colour}" stroke-width="${thickness}"><title>${xmlEscape(d.sector)}: ${d.share}%</title></path>`,
    );
  });
  const legend = rows
    .map((d, i) => {
      const colour = DONUT_COLOURS[i % DONUT_COLOURS.length];
      return `<li><span class="swatch" style="background:${colour}"></span>${xmlEscape(d.sector)} — <strong>${d.share}%</strong></li>`;
    })
    .join('');
  const label = opts.label || 'Donut chart';
  return `<div class="donut-wrap">` +
    `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="${xmlEscape(label)}" class="chart donut" xmlns="${SVG_NS}">` +
    `<title>${xmlEscape(label)}</title>${slices.join('')}` +
    `<text x="${centre}" y="${centre - 4}" text-anchor="middle" font-size="26" font-weight="700" fill="${PALETTE.ink}">${xmlEscape(opts.centre || '')}</text>` +
    `<text x="${centre}" y="${centre + 18}" text-anchor="middle" font-size="12" fill="${PALETTE.muted}">${xmlEscape(opts.centreLabel || '')}</text>` +
    `</svg><ul class="legend">${legend}</ul></div>`;
}

// Horizontal bars for labelled values — governorates, age bands, the CPI basket.
export function hbarChart(rows, opts = {}) {
  const rowHeight = 34;
  const width = 760;
  const height = rowHeight * rows.length + 24;
  const labelWidth = 150;
  const valueWidth = 64;
  const innerWidth = width - labelWidth - valueWidth;
  const biggest = Math.max(...rows.map((r) => r.value));
  const format = opts.format || ((v) => String(v));
  const colour = opts.color || PALETTE.teal;
  const label = opts.label || 'Bar chart';
  const parts = [svgOpen(width, height, label)];
  rows.forEach((row, i) => {
    const top = 12 + i * rowHeight;
    const barWidth = (row.value / biggest) * innerWidth;
    parts.push(
      `<text x="${labelWidth - 10}" y="${top + 15}" text-anchor="end" font-size="12" fill="${PALETTE.ink}">${xmlEscape(row.label)}</text>`,
      `<rect x="${labelWidth}" y="${top}" width="${Math.max(2, barWidth).toFixed(1)}" height="20" rx="3" fill="${row.highlight ? PALETTE.sand : colour}"><title>${xmlEscape(row.label)}: ${xmlEscape(format(row.value))}</title></rect>`,
      `<text x="${(labelWidth + barWidth + 8).toFixed(1)}" y="${top + 15}" font-size="12" fill="${PALETTE.ink}">${xmlEscape(format(row.value))}</text>`,
    );
  });
  parts.push('</svg>');
  return parts.join('');
}

// Vertical bars for a { year, value } series. The latest bar is sand, the
// rest teal, so the eye lands on the most recent year first.
export function barChart(series, opts = {}) {
  const width = 760;
  const height = opts.height || 300;
  const pad = { left: 56, right: 16, top: 18, bottom: 34 };
  const innerWidth = width - pad.left - pad.right;
  const innerHeight = height - pad.top - pad.bottom;
  const colour = opts.color || PALETTE.teal;
  const format = opts.format || ((v) => String(v));
  const top = niceCeiling(Math.max(...series.map((d) => d.value)));
  const slot = innerWidth / series.length;
  const barWidth = Math.min(46, slot * 0.62);
  const label = opts.label || 'Bar chart';
  const parts = [svgOpen(width, height, label)];
  for (const tick of tickValues(top, 4)) {
    const yy = pad.top + innerHeight - (tick / top) * innerHeight;
    parts.push(
      `<line x1="${pad.left}" y1="${yy}" x2="${width - pad.right}" y2="${yy}" stroke="${PALETTE.grid}" stroke-width="1"/>`,
      `<text x="${pad.left - 8}" y="${yy + 4}" text-anchor="end" font-size="11" fill="${PALETTE.muted}">${xmlEscape(format(tick))}</text>`,
    );
  }
  series.forEach((d, i) => {
    const barHeight = (d.value / top) * innerHeight;
    const bx = pad.left + i * slot + (slot - barWidth) / 2;
    const by = pad.top + innerHeight - barHeight;
    const centreX = (bx + barWidth / 2).toFixed(1);
    const fill = i === series.length - 1 ? PALETTE.sand : colour;
    parts.push(
      `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${barWidth}" height="${barHeight.toFixed(1)}" rx="3" fill="${fill}"><title>${d.year}: ${xmlEscape(format(d.value))}</title></rect>`,
      `<text x="${centreX}" y="${by - 6}" text-anchor="middle" font-size="11" fill="${PALETTE.ink}">${xmlEscape(format(d.value))}</text>`,
      `<text x="${centreX}" y="${height - 10}" text-anchor="middle" font-size="11" fill="${PALETTE.muted}">${d.year}</text>`,
    );
  });
  parts.push('</svg>');
  return parts.join('');
}

// Line chart for a { year, value } series, with a soft fill under the line.
// opts: { label, format, color, height }.
export function lineChart(series, opts = {}) {
  const width = 760;
  const height = opts.height || 300;
  const pad = { left: 56, right: 16, top: 18, bottom: 34 };
  const innerWidth = width - pad.left - pad.right;
  const innerHeight = height - pad.top - pad.bottom;
  const colour = opts.color || PALETTE.teal;
  const format = opts.format || ((v) => String(v));
  const values = series.map((d) => d.value);
  const low = Math.min(0, ...values);
  const high = Math.max(...values);
  const span = high - low || 1;
  const xFor = (i) => pad.left + (i / (series.length - 1)) * innerWidth;
  const yFor = (v) => pad.top + innerHeight - ((v - low) / span) * innerHeight;
  const ticks = tickValues(high - low, 4).map((t) => t + low);
  const points = series.map((d, i) => `${xFor(i).toFixed(1)},${yFor(d.value).toFixed(1)}`).join(' ');
  const area = `${pad.left},${yFor(low)} ${points} ${xFor(series.length - 1).toFixed(1)},${yFor(low)}`;
  const label = opts.label || 'Line chart';
  const parts = [svgOpen(width, height, label)];
  parts.push(`<polygon points="${area}" fill="${colour}" opacity="0.10"/>`);
  for (const tick of ticks) {
    parts.push(
      `<line x1="${pad.left}" y1="${yFor(tick)}" x2="${width - pad.right}" y2="${yFor(tick)}" stroke="${PALETTE.grid}" stroke-width="1"/>`,
      `<text x="${pad.left - 8}" y="${yFor(tick) + 4}" text-anchor="end" font-size="11" fill="${PALETTE.muted}">${xmlEscape(format(tick))}</text>`,
    );
  }
  parts.push(`<polyline points="${points}" fill="none" stroke="${colour}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`);
  series.forEach((d, i) => {
    parts.push(
      `<circle cx="${xFor(i)}" cy="${yFor(d.value)}" r="3.5" fill="#fff" stroke="${colour}" stroke-width="2"><title>${d.year}: ${xmlEscape(format(d.value))}</title></circle>`,
    );
  });
  series.forEach((d, i) => {
    if (i % 2 === 0 || i === series.length - 1) {
      parts.push(`<text x="${xFor(i)}" y="${height - 10}" text-anchor="middle" font-size="11" fill="${PALETTE.muted}">${d.year}</text>`);
    }
  });
  parts.push('</svg>');
  return parts.join('');
}
