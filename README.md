[![make.fun · best-flight-game-20261126-0057](https://make.fun/badge/best-flight-game-20261126-0057.svg)](https://make.fun/bounty/best-flight-game-20261126-0057?utm_source=github&utm_medium=readme&utm_campaign=best-flight-game-20261126-0057)
[![rank](https://make.fun/badge/best-flight-game-20261126-0057/bmbngn/Makefun-cloudcutter/rank.svg)](https://make.fun/bounty/best-flight-game-20261126-0057/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-flight-game-20261126-0057)
[![reward](https://make.fun/badge/best-flight-game-20261126-0057/bmbngn/Makefun-cloudcutter/reward.svg)](https://make.fun/bounty/best-flight-game-20261126-0057?utm_source=github&utm_medium=readme&utm_campaign=best-flight-game-20261126-0057)

# Cloudcutter — Island Ring Run

Cloudcutter is a complete 3D arcade flight game that plays offline in a desktop browser. Take off from runway 09 on the home island, fly 8 golden rings over a procedural archipelago — coast, volcano, twin peaks, open sea — then land back on the runway before the fuel runs out. Chase view, lit HUD (airspeed, altitude, heading, throttle, fuel, rings, timer, score), three wind difficulties (Calm, Breezy, Stormy), and WebAudio-synthesised engine, wind and chime sounds with no audio files.

Entry for [Make the best flight game](https://make.fun/bounty/best-flight-game-20261126-0057) on [make.fun](https://make.fun). An AI judge compares the games two at a time; the 50 best share $500.

## How to run

Serve the `game/` directory with any static HTTP server and open `index.html` in desktop Chrome — no build step, no network requests.

Controls: W/S pitch · A/D bank · Shift/Ctrl throttle · Space airbrake · G gear · P pause · M sound · mouse drag to look, wheel to zoom · Enter starts/restarts.

## Files

- `main.ts` — hands the game in: copies `game/` and `screenshots/` to the output directory and writes `dossier.json`.
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged.
- `game/` — the playable game as static files (Three.js vendored under `game/vendor/`).
- `screenshots/` — four real renders of the game running in a browser; the first is the cover.
