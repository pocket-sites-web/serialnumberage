import type { RuleKey } from './decoder';

export interface Format {
  title: string;      // e.g. "10 characters, 1974 on"
  pattern: string;    // shape, e.g. "##YY M #####"
  steps: string[];    // how to read it, in plain words
  example: string;    // a serial that decodes with this format
}
export interface RuleInfo {
  summary: string;    // one-sentence answer for snippets
  formats: Format[];
  months?: string;    // letter table note, when letters are used
  ambiguity?: string; // how to choose when two dates are possible
  notCovered?: string;
}

export const MONTH_LETTERS = 'A = January, B = February, C = March, D = April, E = May, F = June, G = July, H = August, J = September, K = October, L = November, M = December (there is no I).';

export const RULES: Record<RuleKey, RuleInfo> = {
  lennox: {
    summary: 'Characters 3 and 4 of a Lennox serial number are the year and character 5 is a letter for the month.',
    formats: [{
      title: '10 characters, 1974 to today', pattern: 'PP YY M #####',
      steps: ['Characters 1 and 2 are the factory.', 'Characters 3 and 4 are the year: 98 means 1998, 10 means 2010.', 'Character 5 is the month as a letter.'],
      example: '5898F06044',
    }],
    months: MONTH_LETTERS,
    notCovered: 'Units made before 1974 use an older code that we do not decode yet.',
  },
  carrier: {
    summary: 'The first two digits of a modern Carrier-family serial number are the week of the year and the next two are the year.',
    formats: [{
      title: '10 characters (4 digits, a letter, 5 digits), 1980s to today', pattern: 'WW YY L #####',
      steps: ['Digits 1 and 2 are the week of the year (01 to 52).', 'Digits 3 and 4 are the year: 19 means 2019.', 'The letter after them is the factory.'],
      example: '0519E28045',
    }],
    notCovered: 'Older 7, 8 and 9 character serials from the 1960s to 1980s use several different codes. Published guides disagree on them, so we do not decode them yet.',
  },
  trane: {
    summary: 'Since 2010 the first two digits of a Trane serial number are the year and the next two are the week; older units use a single digit or a year letter.',
    formats: [
      { title: '2010 to today: starts with 2 digits', pattern: 'YY WW # #####', steps: ['Digits 1 and 2 are the year: 17 means 2017.', 'Digits 3 and 4 are the week of the year.'], example: '17103N6MF4' },
      { title: '2002 to 2009: 9 characters, starts with 1 digit', pattern: 'Y WW ## L ###', steps: ['Digit 1 is the last digit of the year: 8 means 2008.', 'Digits 2 and 3 are the week of the year.'], example: '81422S41G' },
      { title: '1983 to 2001: starts with a letter', pattern: 'L WW ######', steps: ['The first letter is the year: W = 1983, X = 1984, Y = 1985, Z = 1986, B = 1987, C = 1988, D = 1989, E = 1990, F = 1991, G = 1992, H = 1993, J = 1994, K = 1995, L = 1996, M = 1997, N = 1998, P = 1999, R = 2000, S = 2001.', 'The next two digits are the week of the year.'], example: 'J1828DWCD' },
    ],
    ambiguity: 'Published guides disagree about two of the 1983 to 2001 letters: one says S = 2001 and Z = 1986, another has them the other way round, so we show both. Some older serials also fit two formats; the age of the house usually settles it.',
    notCovered: 'Codes from the 1970s and early 1980s (short serials with hyphens) are not decoded yet.',
  },
  goodman: {
    summary: 'The first two digits of a Goodman, Amana or Janitrol serial number are the year and the next two are the month.',
    formats: [
      { title: '10 digits, all numbers', pattern: 'YY MM ######', steps: ['Digits 1 and 2 are the year: 16 means 2016.', 'Digits 3 and 4 are the month: 09 means September.'], example: '1609123456' },
      { title: 'Older 9-digit serials', pattern: 'YY #######', steps: ['Digits 1 and 2 are the year. The month is not shown.'], example: '001112581' },
    ],
    notCovered: 'Packaged terminal units (hotel-style wall units) built for Goodman by Daikin use letters and are not decoded yet.',
  },
  rheemHvac: {
    summary: 'In a Rheem or Ruud heating and cooling serial number, the factory letter is followed by the week and then the year.',
    formats: [
      { title: '10 characters, starts with a letter (most units)', pattern: 'L WW YY #####', steps: ['The letter is the factory.', 'The next two digits are the week of the year: 42 is mid-October.', 'The two digits after that are the year: 17 means 2017.'], example: 'W421724596' },
      { title: 'Longer serials (14 to 17 characters)', pattern: '…L WW YY #####', steps: ['Find the factory letter near the middle (usually F, G, M, N or W).', 'The two digits after it are the week, the next two are the year.'], example: '7143W1519143722' },
      { title: 'Older units: starts with 4 digits', pattern: 'MM YY L #####', steps: ['Digits 1 and 2 are the month.', 'Digits 3 and 4 are the year.'], example: '0902C11246' },
    ],
  },
  rheemWh: {
    summary: 'Newer Rheem, Ruud and Richmond water heater serials give the week then the year after the first letter; older ones start with the month then the year.',
    formats: [
      { title: 'Newer: a letter, then 4 digits, then numbers', pattern: 'L WW YY #####', steps: ['Skip the first letter (sometimes after a 4-letter prefix such as RHUN).', 'The next two digits are the week of the year.', 'The two after that are the year: 14 means 2014.'], example: 'A0114123456' },
      { title: 'Older: month and year after any letters', pattern: '(LLLL) MM YY …', steps: ['Skip any letters at the start (such as RHLN or RHNG).', 'The first two digits are the month, the next two are the year: 0804 means August 2004.'], example: 'RHNG0804P000036' },
    ],
  },
  geWh: {
    summary: 'For a GE water heater, ignore the letters at the start: the first two digits are the month and the next two are the year.',
    formats: [{ title: 'GE water heaters (made by Rheem)', pattern: '(LLLL) MM YY …', steps: ['Ignore any letters at the start, such as GE or GENG.', 'The first two digits are the month.', 'The next two digits are the year.'], example: 'GENG0601D13586' }],
  },
  aosmith: {
    summary: 'Since about 2008 the first two digits of an A.O. Smith family serial number are the year and the next two are the week; older ones start with a month letter.',
    formats: [
      { title: 'About 2008 to today: starts with 4 digits', pattern: 'YY WW …', steps: ['Digits 1 and 2 are the year: 11 means 2011.', 'Digits 3 and 4 are the week of the year: 15 is mid-April.'], example: '1115A123456' },
      { title: 'Older: starts with 2 letters', pattern: 'L M YY …', steps: ['The second letter is the month.', 'The two digits after the letters are the year.'], example: 'AF04A093001' },
      { title: 'Older: starts with 1 letter', pattern: 'M YY …', steps: ['The letter is the month.', 'The two digits after it are the year.'], example: 'L07A071460' },
    ],
    months: MONTH_LETTERS,
  },
  bradfordWhite: {
    summary: 'The first letter of a Bradford White serial number is the year and the second letter is the month; the year letters repeat every 20 years.',
    formats: [{
      title: '2 letters, then numbers', pattern: 'Y M #######',
      steps: ['Letter 1 is the year: A = 1984 or 2004, B = 1985 or 2005, C = 1986 or 2006, D = 1987 or 2007, E = 1988 or 2008, F = 1989 or 2009, G = 1990 or 2010, H = 1991 or 2011, J = 1992 or 2012, K = 1993 or 2013, L = 1994 or 2014, M = 1995 or 2015, N = 1996 or 2016, P = 1997 or 2017, S = 1998 or 2018, T = 1999 or 2019, W = 2000 or 2020, X = 2001 or 2021, Y = 2002 or 2022, Z = 2003 or 2023. From 2024 the cycle starts again at A.', 'Letter 2 is the month.'],
      example: 'EF10718168',
    }],
    months: MONTH_LETTERS,
    ambiguity: 'Because the letters repeat every 20 years, one serial fits two years. Look at the label for the standard it was tested to (for example "ANSI Z21.10.1-2004"): the heater cannot be older than that year. A tank in a house built after the earlier date must be the later one.',
  },
  rinnai: {
    summary: 'Since 2009 the first letter of a Rinnai serial number is the year (A = 2009) and the second letter is the month.',
    formats: [
      { title: '2009 to today: 2 letters', pattern: 'Y M …', steps: ['Letter 1 is the year: A = 2009, B = 2010, C = 2011, D = 2012, E = 2013, F = 2014, G = 2015, H = 2016, J = 2017, K = 2018, L = 2019, M = 2020, N = 2021, P = 2022, R = 2023, S = 2024, T = 2025, W = 2026.', 'Letter 2 is the month.'], example: 'BL.CA-051306' },
      { title: 'Before 2009: digits with a full stop', pattern: 'YY.MM-######', steps: ['The digits before the full stop are the year.', 'The two digits after it are the month.'], example: '04.03-102521' },
    ],
    months: MONTH_LETTERS,
  },
  york: {
    summary: 'Since late 2004, digits 2 and 4 of a York, Luxaire or Coleman serial number make the year and letter 3 is the month; older serials use two letters.',
    formats: [
      { title: 'Late 2004 to today', pattern: 'P Y M Y ######', steps: ['Character 1 is the factory.', 'Characters 2 and 4 together are the year: W0D5… gives 0 and 5, so 2005.', 'Character 3 is the month: A = January, B = February, C = March, D = April, E = May, F = June, G = July, H = August, K = September, L = October, M = November, N = December (no I or J).'], example: 'N0D6653823' },
      { title: '1971 to 2004: 4 letters, then 6 digits', pattern: 'P M Y L ######', steps: ['Letter 2 is the month (same letters as above).', 'Letter 3 is the year: A = 1971 or 1992, B = 1972 or 1993, C = 1973 or 1994, D = 1974 or 1995, E = 1975 or 1996, F = 1976 or 1997, G = 1977 or 1998, H = 1978 or 1999, J = 1979 or 2000, K = 1980 or 2001, L = 1981 or 2002, M = 1982 or 2003, N = 1983 or 2004, P = 1984, R = 1985, S = 1986, T = 1987, V = 1988, W = 1989, X = 1990, Y = 1991.', 'Ignore a letter in brackets at the start, such as (S).'], example: 'WFKM003055' },
    ],
    ambiguity: 'Year letters A to N were used twice, 21 years apart. Look for the ANSI standard year on the label, the style of the unit, or the age of the house. A 1970s unit is now over 45 years old and rare.',
  },
  nordyne: {
    summary: 'In a Nordyne-family serial number, the two digits after the first three letters are the year and the next two are the month.',
    formats: [{ title: '3 letters, then numbers', pattern: 'LLL YY MM #####', steps: ['Skip the 3 letters at the start.', 'The next two digits are the year, then two digits for the month.'], example: 'GBB030708229' }],
  },
  icp: {
    summary: 'In an ICP-family serial number (Heil, Tempstar, Comfortmaker, Arcoaire), the two digits after the first letter are the year and the next two are the week.',
    formats: [{ title: 'A letter, then 9 digits', pattern: 'L YY WW #####', steps: ['The letter is the factory.', 'The next two digits are the year.', 'The two after that are the week of the year.'], example: 'E072514528' }],
    notCovered: 'Older ICP serials (before the late 1990s) use other codes that we do not decode yet.',
  },
};
