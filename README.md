# Jordan in Numbers

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/laithzz21/best-national-statistics-site-20261126-0539-r2/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/laithzz21/best-national-statistics-site-20261126-0539-r2/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

A national statistics site for **Jordan**, built as plain static files that
work offline in a browser on a desktop and on a phone. No build step, no
network requests, no framework.

## What it covers

- **Home** — key indicators at a glance (population, GDP, unemployment,
  inflation, life expectancy, area) with sparklines, a population chart with
  a working 2015–2024 / 2020–2024 range switch, topic cards and the latest
  statistical releases.
- **Population** — population trend, age structure, and population by
  governorate as a chart and a sortable table.
- **Economy** — GDP 2015–2024, GDP by sector (donut / bars toggle), trade,
  tourism and remittances.
- **Labour** — unemployment 2015–2024, employment by sector, youth
  unemployment and labour-force participation by sex.
- **Prices** — CPI inflation 2015–2024 and the weights of the CPI basket.
- **Data explorer** — all 28 indicators in one table with live search, a
  category filter, sortable columns and a CSV download of the visible rows.
- **About** — method, how to cite a figure, and the full source list.

Every figure names its source and year: Jordan's Department of Statistics,
the World Bank (World Development Indicators), the IMF, the Central Bank of
Jordan, UNESCO, and Jordan's ministries of Health, Energy and Water.

## Run it

```sh
node serve.ts            # serves app/ at http://localhost:8080
```

Open http://localhost:8080 in a browser. The sections are hash routes
(`#/population`, `#/economy`, …) and work on a phone layout too.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
into the output directory and writes `dossier.json` with the vendored
`vendor/makefun-frontend.ts` library.

## Layout

- `app/index.html` — the shell: header, nav, footer, `#app`
- `app/style.css` — the whole design (system fonts only)
- `app/data.js` — every figure, with source and year
- `app/charts.js` — hand-rolled SVG line, bar and donut charts
- `app/views.js` — one render function per page
- `app/main.js` — hash router and the working controls
- `screenshots/` — real renders of the site in headless Chrome

## License

MIT — see `LICENSE`.
