# مناسك | Manasik

Static PWA (no build step, no backend) — deploy the folder as-is to GitHub Pages. All paths are relative.

```
index.html            entry page (loads the files below)
manifest.json, sw.js  PWA manifest + service worker (bump cache name in sw.js on release)
css/style.css         app styles          css/quran.css   Quran reader styles
js/app.js             shell, routing, home      js/umrah.js     Umrah steps
js/track.js, location.js   GPS tracking         js/tasbeeh.js   Tasbeeh
js/quran.js           Quran reader (images + text, bookmarks, offline download)
data/umrah.json|js    Umrah texts (ar/en) — keep the two files identical in content
assets/               icons
quran/
  img/NNN.webp        604 Madinah Mushaf page images (001–604)
  data/quran.json     per-page verses (KFGQPC Hafs), surah names, juz
  fonts/UthmanicHafs-v-3.0.ttf   KFGQPC Hafs font (text mode)
  SOURCES.txt, LICENSE-quran-text.txt   provenance and licence
```
QR destination: https://MOs-V.github.io/Manasik/

## Deploy checklist (GitHub Pages) — the Quran needs ALL of these in the repo
```
git add -A && git commit -m "Add Quran reader" && git push
```
Required files (the Quran shows an error naming the first missing one):
`css/quran.css`, `js/quran.js`, `js/tasbeeh.js`, `quran/data/quran.json`, `quran/data/quran.js`, `quran/fonts/UthmanicHafs-v-3.0.ttf`, `quran/img/001.webp … 604.webp` (604 files).
Check after deploy: open `https://MOs-V.github.io/Manasik/quran/data/quran.json` and `…/quran/img/001.webp` — both must load (HTTP 200). Then reload the app twice (service worker v15 updates the cached shell).

## Testing locally
Put all files in one folder (images in `quran/img/001.webp … 604.webp`). Then run `python3 serve.py` (Windows: double-click `serve.bat`) and open http://localhost:8000/ . The script reports any missing Quran file.
