// Serial number -> manufacture date. Pure functions, used at build time and in the browser.
// Rules were tested on 2026-11-06 against 66 serials with known dates (CPSC recall notices,
// data plate photos, inspector forum answers): see tests/test-cases.json and `npm test`.

export type RuleKey =
  | 'lennox' | 'carrier' | 'trane' | 'goodman' | 'rheemHvac' | 'rheemWh' | 'geWh'
  | 'aosmith' | 'bradfordWhite' | 'rinnai' | 'york' | 'nordyne' | 'icp';

export interface Candidate { year: number; month: number | null; week?: number; style: string }

const NOW_YY = new Date().getFullYear() % 100; // two-digit years above this are 19xx
const MONTH12 = 'ABCDEFGHJKLM'; // A = Jan ... M = Dec, no I
const YORK_MONTH = 'ABCDEFGHKLMN'; // York / Johnson Controls: no I and no J
const yy = (n: number) => (n <= NOW_YY ? 2000 + n : 1900 + n);
export const weekToMonth = (w: number) => new Date(Date.UTC(2001, 0, 1 + (w - 1) * 7 + 3)).getUTCMonth() + 1;
export const clean = (s: string) => s.toUpperCase().replace(/\(.*?\)/g, '').replace(/[^A-Z0-9]/g, '');
const c = (year: number, month: number | null, style: string): Candidate => ({ year, month, style });
const wk = (year: number, week: number, style: string): Candidate => ({ year, week, month: weekToMonth(week), style });
const okWeek = (n: number) => n >= 1 && n <= 53;
const okMonth = (n: number) => n >= 1 && n <= 12;

export const TRANE_YEAR_LETTERS: Record<string, number> = {
  W: 1983, X: 1984, Y: 1985, Z: 1986, B: 1987, C: 1988, D: 1989, E: 1990, F: 1991, G: 1992,
  H: 1993, J: 1994, K: 1995, L: 1996, M: 1997, N: 1998, P: 1999, R: 2000, S: 2001,
};
export const BW_YEAR_LETTERS = 'ABCDEFGHJKLMNPSTWXYZ'; // A = 1984 / 2004 / 2024
export const RINNAI_YEAR_LETTERS = 'ABCDEFGHJKLMNPRSTWXYZ'; // A = 2009
export const YORK_YEAR_LETTERS = 'ABCDEFGHJKLMNPRSTVWXY'; // A = 1971 / 1992

const rules: Record<RuleKey, (s: string) => Candidate[]> = {
  lennox(s) {
    const m = s.match(/^[0-9A-Z]{2}(\d{2})([A-HJ-M])/);
    return m ? [c(yy(+m[1]), MONTH12.indexOf(m[2]) + 1, 'Lennox 10-character serial (1974 on)')] : [];
  },
  carrier(s) {
    const m = s.match(/^(\d{2})(\d{2})[A-Z]\d{5}$/);
    return m && okWeek(+m[1]) ? [wk(yy(+m[2]), +m[1], 'Carrier-style serial: week, then year')] : [];
  },
  trane(s) {
    let m: RegExpMatchArray | null; const out: Candidate[] = [];
    if ((m = s.match(/^(\d{2})(\d{2})\d[0-9A-Z]{5}$/)) && +m[1] >= 10 && okWeek(+m[2])) out.push(wk(2000 + +m[1], +m[2], 'Trane 2010 on: year, then week'));
    if ((m = s.match(/^([2-9])(\d{2})\d{2}[A-Z][0-9A-Z]{3}$/)) && okWeek(+m[2])) out.push(wk(2000 + +m[1], +m[2], 'Trane 2002 to 2009: last digit of year, then week'));
    if ((m = s.match(/^([A-Z])(\d{2})[0-9A-Z]{6}$/)) && TRANE_YEAR_LETTERS[m[1]] && okWeek(+m[2])) {
      out.push(wk(TRANE_YEAR_LETTERS[m[1]], +m[2], 'Trane 1983 to 2001: year letter, then week'));
      if (m[1] === 'S') out.push(wk(1986, +m[2], 'Trane 1983 to 2001 (other published letter table: S = 1986)'));
      if (m[1] === 'Z') out.push(wk(2001, +m[2], 'Trane 1983 to 2001 (other published letter table: Z = 2001)'));
    }
    if ((m = s.match(/^[A-Z](\d{2})([A-HJ-M])\d{5}$/))) out.push(c(yy(+m[1]), MONTH12.indexOf(m[2]) + 1, 'Older Trane: letter, year, month letter'));
    return out;
  },
  goodman(s) {
    let m: RegExpMatchArray | null;
    if ((m = s.match(/^(\d{2})(\d{2})\d{6}$/)) && okMonth(+m[2])) return [c(yy(+m[1]), +m[2], 'Goodman-style serial: year, then month')];
    if ((m = s.match(/^(\d{2})\d{7}$/))) return [c(yy(+m[1]), null, 'Older 9-digit serial: year only')];
    return [];
  },
  rheemHvac(s) {
    let m: RegExpMatchArray | null;
    if ((m = s.match(/^[A-Z](\d{2})(\d{2})\d{5}$/)) && okWeek(+m[1])) return [wk(yy(+m[2]), +m[1], 'Rheem/Ruud: factory letter, week, year')];
    if ((m = s.match(/[A-Z](\d{2})(\d{2})\d{4,6}$/)) && okWeek(+m[1])) return [wk(yy(+m[2]), +m[1], 'Rheem/Ruud long serial: factory letter, week, year')];
    if ((m = s.match(/^(\d{2})(\d{2})[A-Z]\d{5}$/)) && okMonth(+m[1])) return [c(yy(+m[2]), +m[1], 'Older Rheem/Ruud: month, then year')];
    return [];
  },
  rheemWh(s) {
    let m: RegExpMatchArray | null;
    if ((m = s.match(/^(?:[A-Z]{4})?[A-Z](\d{2})(\d{2})\d{5,}$/)) && okWeek(+m[1])) return [wk(yy(+m[2]), +m[1], 'Newer Rheem water heater: letter, week, year')];
    if ((m = s.match(/^(?:[A-Z]{2,4}|[A-Z](?=\d{4}[A-Z]))?(\d{2})(\d{2})/)) && okMonth(+m[1])) return [c(yy(+m[2]), +m[1], 'Older Rheem water heater: month, then year')];
    return [];
  },
  geWh(s) {
    const m = s.replace(/^[A-Z]+/, '').match(/^(\d{2})(\d{2})/);
    return m && okMonth(+m[1]) ? [c(yy(+m[2]), +m[1], 'GE water heater: month, then year')] : [];
  },
  aosmith(s) {
    let m: RegExpMatchArray | null;
    if ((m = s.match(/^(\d{2})(\d{2})/)) && okWeek(+m[2])) return [wk(yy(+m[1]), +m[2], 'A.O. Smith family: year, then week')];
    if ((m = s.match(/^[A-Z]([A-HJ-M])(\d{2})/))) return [c(yy(+m[2]), MONTH12.indexOf(m[1]) + 1, 'Older A.O. Smith family: 2 letters (2nd = month), then year')];
    if ((m = s.match(/^([A-HJ-M])(\d{2})/))) return [c(yy(+m[2]), MONTH12.indexOf(m[1]) + 1, 'Older A.O. Smith family: month letter, then year')];
    return [];
  },
  bradfordWhite(s) {
    const m = s.match(/^([A-Z])([A-HJ-M])\d/);
    if (!m || BW_YEAR_LETTERS.indexOf(m[1]) < 0) return [];
    const base = 1984 + BW_YEAR_LETTERS.indexOf(m[1]);
    const thisYear = new Date().getFullYear();
    return [base, base + 20].filter((y) => y <= thisYear).map((y) => c(y, MONTH12.indexOf(m[2]) + 1, 'Bradford White: year letter (repeats every 20 years), month letter'));
  },
  rinnai(s) {
    let m: RegExpMatchArray | null;
    if ((m = s.match(/^([A-Z])([A-HJ-M])/)) && RINNAI_YEAR_LETTERS.indexOf(m[1]) >= 0) return [c(2009 + RINNAI_YEAR_LETTERS.indexOf(m[1]), MONTH12.indexOf(m[2]) + 1, 'Rinnai 2009 on: year letter, month letter')];
    if ((m = s.match(/^(\d{2})(\d{2})/)) && okMonth(+m[2])) return [c(yy(+m[1]), +m[2], 'Rinnai before 2009: year, then month')];
    return [];
  },
  york(s) {
    let m: RegExpMatchArray | null;
    const s2 = s.replace(/^([A-Z])O/, '$10'); // letter O typed for zero
    if ((m = s2.match(/^[A-Z](\d)([A-HK-N])(\d)\d{6}$/))) return [c(2000 + +(m[1] + m[3]), YORK_MONTH.indexOf(m[2]) + 1, 'York family 2004 on: digits 2 and 4 = year, letter 3 = month')];
    if ((m = s.match(/^[A-Z]([A-HK-N])([A-Z])[A-Z]\d{6}$/)) && YORK_YEAR_LETTERS.indexOf(m[2]) >= 0) {
      const base = 1971 + YORK_YEAR_LETTERS.indexOf(m[2]);
      return [base, base + 21].filter((y) => y <= 2004).map((y) => c(y, YORK_MONTH.indexOf(m![1]) + 1, 'York family 1971 to 2004: month letter, year letter (repeats every 21 years)'));
    }
    return [];
  },
  nordyne(s) {
    const m = s.match(/^[A-Z]{3}(\d{2})(\d{2})\d{5}$/);
    return m && okMonth(+m[2]) ? [c(yy(+m[1]), +m[2], 'Nordyne family: 3 letters, year, month')] : [];
  },
  icp(s) {
    const m = s.match(/^[A-Z](\d{2})(\d{2})\d{5}$/);
    return m && okWeek(+m[2]) ? [wk(yy(+m[1]), +m[2], 'ICP family: letter, year, week')] : [];
  },
};

export function decodeSerial(rule: RuleKey, serial: string): Candidate[] {
  const s = clean(serial);
  if (s.length < 4) return [];
  const thisYear = new Date().getFullYear();
  return rules[rule](s).filter((c) => c.year <= thisYear && c.year >= 1960);
}
