# Lost Letters

A small retro pixel typing adventure. Its look is inspired by classic indie RPGs: black dialogue boxes, a pixel font, and text that types itself out with little blips. All of the art, characters, writing and sounds are original.

Last night's storm scrambled the whole village's mail. You play a fox courier, newly hired by the grumpy mailbox Postmaster. To win each villager's trust, you **retype their ruined letters** fast and accurately enough to meet their goal. Each new friend opens the road onward, until you reach the Turtle Sage and the last lost letter.

## How to play

| Where | Keys |
| --- | --- |
| Walking | Arrow keys **or** WASD |
| Talk / confirm | Z, E or Enter |
| Back / skip text | X, Shift or Esc |
| Menu (in the village) | Esc |
| Typing a letter | Type freely. Backspace fixes (Ctrl+Backspace deletes a word), Enter sends, Esc leaves |

- Each villager gives you a round of **3–5 sentences**. You don't have to fix your mistakes, but every error lowers your accuracy.
- A round **passes** when your average speed and accuracy over the round meet the villager's goal:

  | Villager | Goal (Normal) |
  | --- | --- |
  | Mushroom | 20 WPM / 85% |
  | Postmaster | 30 WPM / 90% |
  | Lantern Ghost | 40 WPM / 93% |
  | Turtle Sage | 50 WPM / 95% |

- **Settings → Goals** switches between Gentle (easier), Normal and Tough (harder).
- Villagers you've already befriended will keep trading letters with you for practice.

### How scoring works

- **WPM** is calculated as (characters typed ÷ 5) per minute. The clock starts at your first keystroke and stops when you press Enter. The speed goal uses *net* WPM, which is raw WPM × accuracy, so careless speed doesn't pay.
- **Accuracy** compares what you typed against the sentence using edit distance. A skipped or extra letter counts as one mistake; it doesn't throw off everything after it.
- The **Stats** screen shows your personal bests, a chart of speed and accuracy over your recent rounds, and the keys you miss most often.

Progress and stats are saved in your browser (localStorage). If storage is blocked, for example in some private windows, the game still runs; it just won't remember anything.

## Running it

It's plain HTML, CSS and JavaScript (ES modules). There's no build step and nothing to install, and it works offline. Browsers won't load ES modules from `file://`, so serve the folder with any static server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Hosting on GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**. Pick the branch and the `/ (root)` folder, then save.
4. After a minute the game is live at `https://<user>.github.io/<repo>/`.

## Project layout

```
index.html, style.css     page shell (one 640x480 canvas, scaled up crisply)
js/main.js                boot + fixed-timestep game loop
js/input.js               keyboard actions (arrows/WASD, Z/E/Enter, X/Shift/Esc) and text events
js/scenes/                title, naming, overworld, dialogue, challenge, results, stats, settings, pause, ending
js/world/map.js           village map (built in code), gates and sign text
js/world/npcs.js          villagers: dialogue, goals, unlock order
js/data/sentences.js      every villager's letter sentences
js/gfx/font.js            the code-drawn 5x8 bitmap font
js/gfx/sprites.js         character sprites as pixel strings
js/gfx/tiles.js           procedurally painted map tiles
js/audio/sfx.js           Web Audio blips and jingles
js/core/                  scoring, save data, progress chart
tests/                    Node tests (scoring math, font coverage, sprite shapes, map reachability)
```

## Tests

```bash
npm test
```

This needs Node 18 or newer. The tests check the scoring maths, that every character in the game's text has a font glyph, that the sprites are well-formed, and that the map's gates unlock the villagers in story order.
