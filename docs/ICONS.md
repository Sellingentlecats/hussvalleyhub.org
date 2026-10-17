# Huss Valley Hub icon system

The original mark is an ivory angular V representing a valley, with a gold reward marker on the site's deep green. It does not reproduce the Roblox logo or an official game asset. The simplified geometry remains visible at favicon sizes.

`scripts/icons.mjs` is the source of truth. The build generates SVG, PNG and a multi-resolution ICO without third-party dependencies. PNG and SVG use the same shapes and palette.

Generated root assets:
- `/favicon.svg`: 32px vector favicon, scalable viewBox.
- `/icon.svg`: 512px vector mark.
- `/favicon.ico`: 16px, 32px and 48px embedded PNG variants.
- `/favicon-32.png`: raster fallback/preview.
- `/apple-touch-icon.png`: 180px home-screen icon.
- `/icon-192.png` and `/icon-512.png`: manifest icons.
- `/site.webmanifest`: app name, palette and icon references.

All pages declare the favicon, Apple touch icon and manifest. `npm run build` generates and validates assets; `npm run check` rechecks PNG dimensions, ICO entries, SVG sizes and manifest links. The manifest does not add an offline service worker or imply that installation/offline support has been tested.

Browser caching and search-engine recrawling determine when a changed icon appears. No indexing time or traffic change is promised.
