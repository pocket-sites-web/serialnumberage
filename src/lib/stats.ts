import recs from '../data/stats/recs-ages.json';
export { recs };
export const STATS_UPDATED = '2026-11-13';
export const STATS_UPDATED_LABEL = 'November 13, 2026';

export type Cell = { pct: number; se: number; homes_m: number; homes_se_m: number; n: number; n_base: number; ok: boolean };
export type Shares = { '10plus': Cell; '15plus': Cell; '20plus': Cell; under5: Cell; base_homes_m: number; n_base: number };

export const pct = (c: Cell | number) => `${(typeof c === 'number' ? c : c.pct).toFixed(1)}%`;
export const mil = (m: number) => `${m.toFixed(1)} million`;
export const reliable = (s: Shares) => s['15plus'].ok && s['20plus'].ok && s.n_base >= 30;

/** Rows for a bar table from a by_* breakdown, keeping only reliable cells. */
export function rowsFrom(group: Record<string, Shares>, key: '10plus' | '15plus' | '20plus' | 'under5', opts: { sort?: boolean; skip?: string[] } = {}) {
  let rows = Object.entries(group)
    .filter(([label, s]) => !opts.skip?.includes(label) && s.n_base >= 30 && s[key].ok)
    .map(([label, s]) => ({ label, value: s[key].pct, se: s[key].se, n: s.n_base }));
  if (opts.sort) rows = rows.sort((a, b) => b.value - a.value);
  return rows;
}

export function distRows(dist: Record<string, Cell>) {
  return Object.entries(dist).map(([label, c]) => ({ label, value: c.pct, se: c.se, extra: mil(c.homes_m) }));
}

export const RECS_CITE = 'U.S. Energy Information Administration, 2020 Residential Energy Consumption Survey (RECS) public microdata, version 7';
export const RECS_URL = 'https://www.eia.gov/consumption/residential/data/2020/index.php?view=microdata';
export const CPSC_CITE = 'U.S. Consumer Product Safety Commission, Non-Fire Carbon Monoxide Deaths Associated with the Use of Consumer Products: 2021 Annual Estimates';
export const CPSC_URL = 'https://www.cpsc.gov/Research--Statistics/Carbon-Monoxide/Non-Fire-Carbon-Monoxide-Deaths-Associated-with-the-Use-of-Consumer-Products-2021-Annual-Estimates';
