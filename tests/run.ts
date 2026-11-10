// npm test: decodes every known-date serial in test-cases.json and every example on the site.
import { readFileSync } from 'node:fs';
import { decodeSerial } from '../src/lib/decoder.ts';
import { BRANDS } from '../src/lib/brands.ts';
import { RULES } from '../src/lib/formats.ts';

const cases = JSON.parse(readFileSync(new URL('./test-cases.json', import.meta.url), 'utf8'));
const alias: Record<string, [string, string]> = {
  'rheem water heater': ['rheem', 'water-heater'], 'ge water heater': ['ge-water-heater', 'water-heater'],
  'a.o. smith': ['ao-smith', 'water-heater'], american: ['american-water-heater', 'water-heater'], whirlpool: ['whirlpool-water-heater', 'water-heater'],
};
const ym = (y: number, m: number | null) => y * 12 + (m || 6) - 1;
let fail = 0; let n = 0;
for (const t of cases) {
  const key = t.brand.toLowerCase();
  const [slug, eq] = alias[key] || [key.replace(/[^a-z0-9]+/g, '-'), ''];
  const b = BRANDS.find((x) => x.slug === slug);
  if (!b) { console.log('NO BRAND', t.brand); fail++; continue; }
  const rule = b.rule[(eq || b.equip[0]) as keyof typeof b.rule]!;
  const c = decodeSerial(rule, t.serial);
  let ok: boolean;
  if (t.window) {
    const [a, z] = t.window.map((s: string) => s.split('-').map(Number));
    ok = c.some((x) => ym(x.year, x.month) >= ym(a[0], a[1]) && ym(x.year, x.month) <= ym(z[0], z[1]));
  } else {
    const [y, m] = t.expect.split('-').map(Number);
    ok = c.some((x) => x.year === y && (!m || !x.month || Math.abs(x.month - m) <= 1));
  }
  n++;
  if (!ok) { const known = /disputed|single reply/.test(t.strength); console.log(known ? 'KNOWN' : 'FAIL ', t.brand, t.serial, t.expect || t.window, '->', JSON.stringify(c.map((x) => [x.year, x.month]))); if (!known) fail++; }
}
for (const [k, r] of Object.entries(RULES)) for (const f of r.formats) {
  n++; if (!decodeSerial(k as any, f.example).length) { console.log('EXAMPLE FAIL', k, f.example); fail++; }
}
console.log(`${n} checks, ${fail} failures`);
process.exit(fail ? 1 : 0);
