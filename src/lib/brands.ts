import type { RuleKey } from './decoder';
import type { Equip } from './equipment';

export type Status = 'verified' | 'checked' | 'estimated';
export interface Brand {
  slug: string; name: string;
  group: 'hvac' | 'water';
  equip: Equip[];                       // what the decoder offers for this brand
  rule: Partial<Record<Equip, RuleKey>>;
  status: Status;
  maker: string;                        // who makes it
  family: string;                       // family key, for "same code as"
  about: string;                        // one or two factual sentences, own words
  pages: Equip[];                       // brand x equipment pages (where people search for them)
  note?: string;
}

const hvac3: Equip[] = ['furnace', 'air-conditioner', 'heat-pump'];
const hv = (r: RuleKey) => ({ furnace: r, 'air-conditioner': r, 'heat-pump': r });

export const BRANDS: Brand[] = [
  // Heating and cooling
  { slug: 'lennox', name: 'Lennox', group: 'hvac', equip: hvac3, rule: hv('lennox'), status: 'verified', maker: 'Lennox International', family: 'lennox', pages: ['furnace', 'air-conditioner'],
    about: 'Lennox has built furnaces in Iowa since 1895 and now makes furnaces, air conditioners and heat pumps under the Lennox name. Its serial code has stayed the same since 1974, which makes it one of the easiest to read.' },
  { slug: 'carrier', name: 'Carrier', group: 'hvac', equip: hvac3, rule: hv('carrier'), status: 'checked', maker: 'Carrier Global', family: 'carrier', pages: ['furnace', 'air-conditioner'],
    about: 'Carrier, Bryant and Payne are all made by Carrier and use the same serial code. Carrier also owns the ICP brands (Heil, Tempstar, Comfortmaker, Arcoaire), but those use a different code.' },
  { slug: 'bryant', name: 'Bryant', group: 'hvac', equip: hvac3, rule: hv('carrier'), status: 'checked', maker: 'Carrier Global', family: 'carrier', pages: ['furnace', 'air-conditioner'],
    about: 'Bryant is Carrier\'s dealer brand. A modern Bryant uses exactly the same serial code as a Carrier.' },
  { slug: 'payne', name: 'Payne', group: 'hvac', equip: hvac3, rule: hv('carrier'), status: 'checked', maker: 'Carrier Global', family: 'carrier', pages: [],
    about: 'Payne is Carrier\'s value brand, built on Carrier and Bryant designs, with the same serial code.' },
  { slug: 'trane', name: 'Trane', group: 'hvac', equip: hvac3, rule: hv('trane'), status: 'verified', maker: 'Trane Technologies', family: 'trane', pages: ['furnace', 'air-conditioner'],
    about: 'Trane and American Standard come from the same factories and share a serial code. Trane has changed that code three times since 1983, so the first step is to see whether the serial starts with two digits, one digit or a letter.' },
  { slug: 'american-standard', name: 'American Standard', group: 'hvac', equip: hvac3, rule: hv('trane'), status: 'verified', maker: 'Trane Technologies', family: 'trane', pages: ['furnace', 'air-conditioner'],
    about: 'American Standard heating and cooling equipment is made by Trane and uses the Trane serial code. (American Standard water heaters are a different company.)' },
  { slug: 'ameristar', name: 'Ameristar', group: 'hvac', equip: hvac3, rule: hv('trane'), status: 'verified', maker: 'Trane Technologies', family: 'trane', pages: [],
    about: 'Ameristar is Trane\'s budget brand and uses the Trane serial code.' },
  { slug: 'goodman', name: 'Goodman', group: 'hvac', equip: hvac3, rule: hv('goodman'), status: 'verified', maker: 'Daikin (since 2012)', family: 'goodman', pages: ['furnace', 'air-conditioner'],
    about: 'Goodman uses one of the simplest codes there is: the first four digits are the year and month. Amana and Janitrol, both owned by Goodman, use the same code.' },
  { slug: 'amana', name: 'Amana', group: 'hvac', equip: hvac3, rule: hv('goodman'), status: 'verified', maker: 'Goodman (Daikin)', family: 'goodman', pages: ['furnace', 'air-conditioner'],
    about: 'Amana heating and cooling has been part of Goodman since 1997 and uses the Goodman code. (Amana kitchen appliances are a separate company with different serial numbers.)' },
  { slug: 'janitrol', name: 'Janitrol', group: 'hvac', equip: hvac3, rule: hv('goodman'), status: 'verified', maker: 'Goodman (Daikin)', family: 'goodman', pages: [],
    about: 'Goodman bought Janitrol in 1982. Janitrol units built since then use the Goodman code.' },
  { slug: 'rheem', name: 'Rheem', group: 'hvac', equip: [...hvac3, 'water-heater'], rule: { ...hv('rheemHvac'), 'water-heater': 'rheemWh' }, status: 'verified', maker: 'Rheem Manufacturing (Paloma)', family: 'rheem', pages: ['furnace', 'air-conditioner', 'water-heater'],
    about: 'Rheem makes both heating and cooling equipment and water heaters, and they use different serial codes, so pick the right type below. Ruud is Rheem\'s sister brand with the same codes.' },
  { slug: 'ruud', name: 'Ruud', group: 'hvac', equip: [...hvac3, 'water-heater'], rule: { ...hv('rheemHvac'), 'water-heater': 'rheemWh' }, status: 'verified', maker: 'Rheem Manufacturing (Paloma)', family: 'rheem', pages: ['furnace', 'water-heater'],
    about: 'Ruud is owned by Rheem and uses the same serial codes. Like Rheem, its water heaters use a different code from its furnaces and air conditioners.' },
  { slug: 'york', name: 'York', group: 'hvac', equip: hvac3, rule: hv('york'), status: 'verified', maker: 'Johnson Controls', family: 'york', pages: ['furnace', 'air-conditioner'],
    about: 'York, Luxaire and Coleman are all made by Johnson Controls and share one serial code. It changed in late 2004, from all letters at the start to a letter, digit, letter, digit pattern.' },
  { slug: 'luxaire', name: 'Luxaire', group: 'hvac', equip: hvac3, rule: hv('york'), status: 'verified', maker: 'Johnson Controls', family: 'york', pages: ['furnace'],
    about: 'Luxaire is a Johnson Controls brand built alongside York, with the same serial code.' },
  { slug: 'coleman', name: 'Coleman', group: 'hvac', equip: hvac3, rule: hv('york'), status: 'verified', maker: 'Johnson Controls', family: 'york', pages: ['furnace'],
    about: 'Coleman home heating and cooling is made by Johnson Controls and uses the York code. This does not cover Coleman RV air conditioners or camping gear, which are different companies.' },
  { slug: 'heil', name: 'Heil', group: 'hvac', equip: hvac3, rule: hv('icp'), status: 'estimated', maker: 'ICP (Carrier)', family: 'icp', pages: [],
    about: 'Heil is one of the International Comfort Products brands, owned by Carrier since 1999. ICP brands use their own code, not Carrier\'s.' },
  { slug: 'tempstar', name: 'Tempstar', group: 'hvac', equip: hvac3, rule: hv('icp'), status: 'estimated', maker: 'ICP (Carrier)', family: 'icp', pages: [],
    about: 'Tempstar is an ICP brand, built alongside Heil and Comfortmaker, with the ICP serial code.' },
  { slug: 'comfortmaker', name: 'Comfortmaker', group: 'hvac', equip: hvac3, rule: hv('icp'), status: 'estimated', maker: 'ICP (Carrier)', family: 'icp', pages: [],
    about: 'Comfortmaker is an ICP brand with the same serial code as Heil and Tempstar.' },
  { slug: 'arcoaire', name: 'Arcoaire', group: 'hvac', equip: hvac3, rule: hv('icp'), status: 'estimated', maker: 'ICP (Carrier)', family: 'icp', pages: [],
    about: 'Arcoaire is an ICP brand with the same serial code as Heil and Tempstar.' },
  { slug: 'nordyne', name: 'Nordyne', group: 'hvac', equip: hvac3, rule: hv('nordyne'), status: 'estimated', maker: 'Nortek Global HVAC', family: 'nordyne', pages: ['furnace'],
    about: 'Nordyne (now Nortek Global HVAC) makes equipment under many names, including Intertherm, Miller, Frigidaire, Tappan, Westinghouse, Maytag and Broan heating and cooling. Many are in manufactured homes.' },
  { slug: 'intertherm', name: 'Intertherm', group: 'hvac', equip: hvac3, rule: hv('nordyne'), status: 'estimated', maker: 'Nortek Global HVAC', family: 'nordyne', pages: [],
    about: 'Intertherm is a Nordyne brand, very common in manufactured and mobile homes, and uses the Nordyne code.' },
  { slug: 'miller', name: 'Miller', group: 'hvac', equip: hvac3, rule: hv('nordyne'), status: 'estimated', maker: 'Nortek Global HVAC', family: 'nordyne', pages: [],
    about: 'Miller furnaces, mostly found in manufactured homes, are made by Nordyne and use the Nordyne code.' },
  // Water heaters
  { slug: 'bradford-white', name: 'Bradford White', group: 'water', equip: ['water-heater'], rule: { 'water-heater': 'bradfordWhite' }, status: 'verified', maker: 'Bradford White Corporation', family: 'bradford-white', pages: [],
    about: 'Bradford White water heaters are sold through plumbers rather than stores. The serial number starts with two letters: the first is the year and the second is the month.' },
  { slug: 'ao-smith', name: 'A.O. Smith', group: 'water', equip: ['water-heater'], rule: { 'water-heater': 'aosmith' }, status: 'verified', maker: 'A.O. Smith Corporation', family: 'aosmith', pages: [],
    about: 'A.O. Smith is the largest US water heater maker. State, Reliance, American, U.S. Craftmaster and many Whirlpool and Kenmore heaters come from the same company and use the same code.' },
  { slug: 'state', name: 'State', group: 'water', equip: ['water-heater'], rule: { 'water-heater': 'aosmith' }, status: 'verified', maker: 'A.O. Smith Corporation', family: 'aosmith', pages: [],
    about: 'State has been part of A.O. Smith since 2001. Newer State heaters use the A.O. Smith year-and-week code.' },
  { slug: 'reliance', name: 'Reliance', group: 'water', equip: ['water-heater'], rule: { 'water-heater': 'aosmith' }, status: 'verified', maker: 'A.O. Smith Corporation', family: 'aosmith', pages: [],
    about: 'Reliance water heaters, often sold through Lowe\'s and rental programs, are made by A.O. Smith and use its code.' },
  { slug: 'american-water-heater', name: 'American Water Heater', group: 'water', equip: ['water-heater'], rule: { 'water-heater': 'aosmith' }, status: 'verified', maker: 'A.O. Smith Corporation', family: 'aosmith', pages: [],
    about: 'American Water Heater, based in Johnson City, Tennessee, has been owned by A.O. Smith since 2011. Its serials start with the year and the week. (Some guides say the third and fourth digits are the month; a 2001 recall notice shows they are the week.)' },
  { slug: 'us-craftmaster', name: 'U.S. Craftmaster', group: 'water', equip: ['water-heater'], rule: { 'water-heater': 'aosmith' }, status: 'verified', maker: 'A.O. Smith Corporation', family: 'aosmith', pages: [],
    about: 'U.S. Craftmaster is an American Water Heater brand (A.O. Smith) and uses the same code.' },
  { slug: 'whirlpool-water-heater', name: 'Whirlpool', group: 'water', equip: ['water-heater'], rule: { 'water-heater': 'aosmith' }, status: 'checked', maker: 'A.O. Smith Corporation (under licence)', family: 'aosmith', pages: [],
    about: 'Whirlpool does not make its own water heaters. Recent Whirlpool-branded heaters were made by A.O. Smith\'s American Water Heater and use the A.O. Smith code. This page is only for water heaters, not Whirlpool appliances.' },
  { slug: 'kenmore-water-heater', name: 'Kenmore', group: 'water', equip: ['water-heater'], rule: { 'water-heater': 'aosmith' }, status: 'checked', maker: 'A.O. Smith Corporation (recent models)', family: 'aosmith', pages: [],
    about: 'Kenmore water heaters have been made by different companies over the years. Recent ones came from A.O. Smith and use its code; an older Kenmore may not match. This page is only for water heaters.',
    note: 'Older Kenmore water heaters were made by other companies and may not decode.' },
  { slug: 'richmond', name: 'Richmond', group: 'water', equip: ['water-heater'], rule: { 'water-heater': 'rheemWh' }, status: 'verified', maker: 'Rheem Manufacturing', family: 'rheem', pages: [],
    about: 'Richmond water heaters are made by Rheem, sold mainly at Menards, and use the Rheem water heater code.' },
  { slug: 'ge-water-heater', name: 'GE', group: 'water', equip: ['water-heater'], rule: { 'water-heater': 'geWh' }, status: 'estimated', maker: 'Rheem (under licence)', family: 'ge', pages: [],
    about: 'GE-branded water heaters have been made under licence by Rheem. Ignore the letters at the start of the serial number; the first four digits are the month and year. This page is only for water heaters.' },
  { slug: 'rinnai', name: 'Rinnai', group: 'water', equip: ['tankless'], rule: { tankless: 'rinnai' }, status: 'estimated', maker: 'Rinnai Corporation', family: 'rinnai', pages: [],
    about: 'Rinnai is best known for tankless water heaters. Since 2009 its serial numbers start with two letters for the year and month.' },
];

export const brandBySlug = (s: string) => BRANDS.find((b) => b.slug === s)!;
export const sisters = (b: Brand) => BRANDS.filter((x) => x.family === b.family && x.slug !== b.slug);
export const brandsFor = (e: Equip) => BRANDS.filter((b) => b.equip.includes(e));
export const brandPath = (b: Brand) => `/${b.slug}/`;
export const brandEquipPath = (b: Brand, e: Equip) => `/${b.slug}/${e}/`;
export const STATUS_TEXT: Record<Status, string> = {
  verified: 'Checked against official records (recall notices or data plates with printed dates).',
  checked: 'Published guides agree on this code, but we have not yet checked it against an official record.',
  estimated: 'Based on a single published source. Treat the date as an estimate and check the label for a printed date.',
};
export const FAMILY_NAMES: Record<string, string> = {
  lennox: 'Lennox International', carrier: 'Carrier', trane: 'Trane Technologies', goodman: 'Goodman (owned by Daikin)',
  rheem: 'Rheem (owned by Paloma)', york: 'Johnson Controls (York)', icp: 'International Comfort Products (owned by Carrier)',
  nordyne: 'Nortek Global HVAC (Nordyne)', 'bradford-white': 'Bradford White', aosmith: 'A.O. Smith', ge: 'GE water heaters (made under licence)', rinnai: 'Rinnai',
};
