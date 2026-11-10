# Serial Number Age

serialnumberage.com: how old is a furnace, air conditioner, heat pump or water heater, decoded from its serial number. Astro static site, deployed by Cloudflare Pages (build `npm run build`, output `dist`).

## How it works
- `src/lib/decoder.ts`: the serial code rules (pure functions, run in the browser). One `RuleKey` per code family.
- `src/lib/brands.ts`: every brand, its maker, which rule each unit type uses, test status (`verified` / `checked` / `estimated`), and which brand × unit pages exist.
- `src/lib/formats.ts`: plain-English explanation and an example for each code.
- `src/lib/equipment.ts`: lifespans, where the data plate is, Amazon suggestions (tag `booforgen-20`).
- `tests/test-cases.json`: 66 serials with known dates (CPSC recall notices, plate photos, inspector forums). `npm test` checks them and every example on the site.

## Pages
- `/` decoder, `/[brand]/` (33 brands), `/[brand]/[unit]/` (brand × unit pages where people search for them), hubs `/furnace-age/`, `/air-conditioner-age/`, `/heat-pump-age/`, `/water-heater-age/`, guides, `/brands/`, `/who-makes-what/`, `/sources/`.

## Adding a brand
Add it to `BRANDS` with an existing rule, or add a new rule in `decoder.ts` + `formats.ts`, plus test cases. Run `npm test` before pushing.

## Launch switches (`src/lib/site.ts`)
`PREVIEW = true` hides the site from search engines. `SITE_URL`, `SITE_NAME`, `AMAZON_TAG`.
