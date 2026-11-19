# Leonida Trophy Guide — Grand Theft Auto VI

![GTA 6 trophy guide](https://make.fun/badge/gta6-trophy-guide-01.svg)
![Rank](https://make.fun/badge/gta6-trophy-guide-01/maelaozera/gta6-trophy-guide-01/rank.svg)
![Reward](https://make.fun/badge/gta6-trophy-guide-01/maelaozera/gta6-trophy-guide-01/reward.svg)

An offline web app that guides and tracks all **55 PlayStation 5 trophies** of
Grand Theft Auto VI: 1 platinum, 2 gold, 6 silver and 46 bronze. Built for the
[make.fun bounty](https://make.fun/bounty/gta6-trophy-guide-01).

## What it is

- **Checklist tracker** — every trophy with its official name, description and
  grade as PlayStation publishes them. Tick trophies off as you earn them;
  progress is saved in the browser (localStorage) and can be exported to a
  file and imported back.
- **Filters** — by kind (story, missable, collectibles, activities), by grade,
  by earned/remaining, and free-text search across names, descriptions and
  guides.
- **Spoiler setting** — hides the names, descriptions and guides of story
  trophies until you earn them.
- **Guide for every trophy** — written in our own words for this entry, each
  one naming the published guides it draws on (PowerPyx, Exophase,
  PSNProfiles, GTABase, CryptoGames, Output Lag). Where a method is not yet
  confirmed on launch day, the guide says so plainly instead of inventing one.
- **Platinum roadmap** — three stages (story, 100% checklist, cleanup) with
  the collectible counts the checklist asks for, and the one potentially
  missable trophy flagged: Positive Mental Attitude, the Chapter 1 balcony
  meditation.

## Run it offline

```sh
node serve.ts
```

Then open <http://localhost:8080> in a desktop browser. The app loads only
its own files and makes no network request at all — turn the network off and
it keeps working. No account, no tracking.

## Layout

- `app/index.html` — the page shell
- `app/app.js` — boot and wiring
- `app/store.js` — progress and settings in localStorage, export/import
- `app/filters.js` — kind/grade/status filters, search, the spoiler rule
- `app/render.js` — checklist rows and the guide detail panel
- `app/roadmap.js` — platinum roadmap and missable-trophies pages
- `app/data/trophies.json` — the 55 official trophies with guides
- `main.ts` — the hand-in program (Node 22): copies `app/` and
  `screenshots/` to the output directory and writes `dossier.json`
- `screenshots/` — 4 screenshots of the guide running

## Build the hand-in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE). No Rockstar artwork is used anywhere in this
guide; its look is our own.
