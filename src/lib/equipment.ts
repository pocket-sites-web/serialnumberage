export type Equip = 'furnace' | 'air-conditioner' | 'heat-pump' | 'water-heater' | 'tankless';

export interface EquipInfo {
  slug: Equip; name: string; plural: string; lifeMin: number; lifeMax: number;
  where: string; hub: string;
  amazon: { q: string; why: string }[];
}

export const EQUIP: Record<Equip, EquipInfo> = {
  furnace: {
    slug: 'furnace', name: 'furnace', plural: 'furnaces', lifeMin: 15, lifeMax: 20, hub: '/furnace-age/',
    where: 'Take off the front lower panel (turn the power off first). The data plate is a metal or foil sticker on the inside of the door or on the side of the cabinet, next to the blower. The serial number is usually labelled "Serial No.", "S/N" or "Ser. No."',
    amazon: [
      { q: 'furnace air filter', why: 'Change it every 1 to 3 months. Check the size printed on the old filter.' },
      { q: 'carbon monoxide detector plug in', why: 'Any gas furnace, and especially an older one, should have a CO alarm nearby.' },
      { q: 'smart thermostat', why: 'Cuts run time on any system, old or new.' },
    ],
  },
  'air-conditioner': {
    slug: 'air-conditioner', name: 'air conditioner', plural: 'air conditioners', lifeMin: 12, lifeMax: 17, hub: '/air-conditioner-age/',
    where: 'On the outdoor unit (the condenser), look for the data plate on the side panel, often near the electrical box where the power cables go in. The indoor coil or air handler has its own plate with a different serial number.',
    amazon: [
      { q: 'ac condenser coil cleaner', why: 'Dirty outdoor coils make an older unit work harder.' },
      { q: 'furnace air filter', why: 'The indoor filter matters for cooling too.' },
      { q: 'smart thermostat', why: 'Cuts run time on any system, old or new.' },
    ],
  },
  'heat-pump': {
    slug: 'heat-pump', name: 'heat pump', plural: 'heat pumps', lifeMin: 10, lifeMax: 15, hub: '/heat-pump-age/',
    where: 'On the outdoor unit, look for the data plate on a side panel, usually near the electrical box. Heat pumps and air conditioners look alike; the model number or the plate will say "heat pump".',
    amazon: [
      { q: 'ac condenser coil cleaner', why: 'Dirty outdoor coils make an older unit work harder.' },
      { q: 'furnace air filter', why: 'Change the indoor filter every 1 to 3 months.' },
      { q: 'smart thermostat heat pump', why: 'Pick one that supports heat pumps and auxiliary heat.' },
    ],
  },
  'water-heater': {
    slug: 'water-heater', name: 'water heater', plural: 'water heaters', lifeMin: 8, lifeMax: 12, hub: '/water-heater-age/',
    where: 'The rating plate is a sticker on the side of the tank, usually at eye level or just above the gas valve or the upper access panel. Many water heater labels also print the manufacture date, so check for that first.',
    amazon: [
      { q: 'water heater anode rod', why: 'A new anode rod can add years to a tank that is not leaking yet.' },
      { q: 'water heater leak detector alarm', why: 'Cheap insurance for a tank near the end of its life.' },
      { q: 'water heater drain flush kit', why: 'Flushing sediment once a year helps an older tank.' },
    ],
  },
  tankless: {
    slug: 'tankless', name: 'tankless water heater', plural: 'tankless water heaters', lifeMin: 15, lifeMax: 20, hub: '/water-heater-age/',
    where: 'The rating label is on the side or bottom of the unit, or inside the front cover. Some models also show the serial number in the unit\'s service menu.',
    amazon: [
      { q: 'tankless water heater flush kit', why: 'Descaling once a year keeps a tankless heater efficient.' },
      { q: 'water heater leak detector alarm', why: 'Cheap insurance against a slow leak.' },
    ],
  },
};
