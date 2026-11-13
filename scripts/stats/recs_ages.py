"""Equipment-age statistics from the EIA 2020 Residential Energy Consumption Survey (RECS) microdata.

Usage: python3 scripts/stats/recs_ages.py path/to/recs2020_public_v7.csv
Download: https://www.eia.gov/consumption/residential/data/2020/csv/recs2020_public_v7.csv
Writes src/data/stats/recs-ages.json and public/data/*.csv.

Estimates use the final weight NWEIGHT. Standard errors use EIA's 60 jackknife replicate
weights: var = (R-1)/R * sum((rep - full)^2), R = 60 (RECS 2020 microdata guide).
Cells with fewer than 30 sampled homes or a relative standard error over 30% are withheld.
"""
import sys, json, csv, os
import pandas as pd
import numpy as np

SRC = sys.argv[1]
ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
R = 60
W = 'NWEIGHT'
REPS = [f'NWEIGHT{i}' for i in range(1, R + 1)]

AGE = {1: 'Under 2 years', 2: '2 to 4 years', 3: '5 to 9 years', 4: '10 to 14 years', 5: '15 to 19 years', 6: '20+ years'}
EQUIPM = {3: 'Central furnace', 2: 'Boiler (steam or hot water)', 4: 'Central heat pump', 13: 'Ductless heat pump (mini-split)',
          5: 'Built-in electric units', 7: 'Built-in gas or oil room heater', 8: 'Wood or pellet stove', 10: 'Portable electric heaters', 99: 'Other'}
FUEL = {5: 'Electricity', 1: 'Natural gas', 2: 'Propane', 3: 'Fuel oil', 7: 'Wood or pellets', 8: 'Solar thermal', 99: 'Other'}
YEARMADE = {1: 'Before 1950', 2: '1950s', 3: '1960s', 4: '1970s', 5: '1980s', 6: '1990s', 7: '2000s', 8: '2010 to 2015', 9: '2016 to 2020'}
TENURE = {1: 'Owner-occupied', 2: 'Rented', 3: 'Rented'}
HOUSING = {1: 'Mobile home', 2: 'Single-family detached', 3: 'Single-family attached', 4: 'Apartment (2 to 4 units)', 5: 'Apartment (5+ units)'}
ACTYPE = {1: 'Central AC (incl. central heat pump)', 3: 'Ductless heat pump (mini-split)', 4: 'Window or wall unit', 5: 'Portable unit', 6: 'Evaporative (swamp) cooler'}
WHSIZE = {1: 'Small tank (30 gal or less)', 2: 'Medium tank (31 to 49 gal)', 3: 'Large tank (50 gal or more)', 4: 'Tankless'}

df = pd.read_csv(SRC, low_memory=False)
total_homes = df[W].sum()

def est(mask_num, mask_den):
    """Weighted share mask_num/mask_den with jackknife SE; also the count for the numerator."""
    num = df.loc[mask_num, [W] + REPS].sum()
    den = df.loc[mask_den, [W] + REPS].sum()
    p = num[W] / den[W]
    reps = (num[REPS].values / den[REPS].values)
    se = np.sqrt((R - 1) / R * ((reps - p) ** 2).sum())
    cnt_se = np.sqrt((R - 1) / R * ((num[REPS].values - num[W]) ** 2).sum())
    n = int(mask_num.sum()); nd = int(mask_den.sum())
    ok = nd >= 30 and (p == 0 or se / p <= 0.30)
    return {'pct': round(100 * p, 1), 'se': round(100 * se, 1), 'homes_m': round(num[W] / 1e6, 2),
            'homes_se_m': round(cnt_se / 1e6, 2), 'n': n, 'n_base': nd, 'ok': bool(ok)}

def age_dist(base, agevar):
    return {AGE[k]: est(base & (df[agevar] == k), base) for k in AGE}

def old_shares(base, agevar):
    return {'10plus': est(base & (df[agevar] >= 4), base), '15plus': est(base & (df[agevar] >= 5), base), '20plus': est(base & (df[agevar] == 6), base),
            'under5': est(base & df[agevar].isin([1, 2]), base), 'base_homes_m': round(df.loc[base, W].sum() / 1e6, 2), 'n_base': int(base.sum())}

def by(base, agevar, col, labels):
    out = {}
    for k, lab in labels.items():
        b = base & (df[col] == k) if not isinstance(k, (list, tuple)) else base & df[col].isin(k)
        if b.sum() == 0: continue
        if lab in out:  # merge codes that share a label
            b = base & df[col].isin([c for c, l in labels.items() if l == lab])
        out[lab] = old_shares(b, agevar)
    return out

def by_state(base, agevar):
    out = {}
    for st, g in df[base].groupby('state_name'):
        b = base & (df['state_name'] == st)
        out[st] = old_shares(b, agevar)
    return out

res = {'source': 'U.S. Energy Information Administration, 2020 Residential Energy Consumption Survey (RECS), public microdata v7',
       'total_homes_m': round(total_homes / 1e6, 2), 'sample_homes': int(len(df))}

# ---- Main space heating equipment
heat = (df['HEATHOME'] == 1) & (df['EQUIPAGE'] > 0)
furn = heat & (df['EQUIPM'] == 3)
res['heating'] = {
    'base_homes_m': round(df.loc[heat, W].sum() / 1e6, 2),
    'dist': age_dist(heat, 'EQUIPAGE'), 'summary': old_shares(heat, 'EQUIPAGE'),
    'by_type': by(heat, 'EQUIPAGE', 'EQUIPM', EQUIPM),
    'by_fuel': by(heat, 'EQUIPAGE', 'FUELHEAT', FUEL),
    'by_region': by(heat, 'EQUIPAGE', 'REGIONC', {r: r.title() for r in ['NORTHEAST', 'MIDWEST', 'SOUTH', 'WEST']}),
    'by_yearmade': by(heat, 'EQUIPAGE', 'YEARMADERANGE', YEARMADE),
    'by_tenure': by(heat, 'EQUIPAGE', 'KOWNRENT', TENURE),
    'by_housing': by(heat, 'EQUIPAGE', 'TYPEHUQ', HOUSING),
    'by_state': by_state(heat, 'EQUIPAGE'),
}
res['furnace'] = {
    'dist': age_dist(furn, 'EQUIPAGE'), 'summary': old_shares(furn, 'EQUIPAGE'),
    'by_fuel': by(furn, 'EQUIPAGE', 'FUELHEAT', FUEL),
    'by_region': by(furn, 'EQUIPAGE', 'REGIONC', {r: r.title() for r in ['NORTHEAST', 'MIDWEST', 'SOUTH', 'WEST']}),
    'by_tenure': by(furn, 'EQUIPAGE', 'KOWNRENT', TENURE),
    'by_yearmade': by(furn, 'EQUIPAGE', 'YEARMADERANGE', YEARMADE),
    'by_state': by_state(furn, 'EQUIPAGE'),
}
# Broken heating that the household couldn't afford to fix, by equipment age
res['heating']['broke_by_age'] = {AGE[k]: est(heat & (df['EQUIPAGE'] == k) & (df['NOHEATBROKE'] == 1), heat & (df['EQUIPAGE'] == k)) for k in AGE}
res['heating']['broke_all'] = est(heat & (df['NOHEATBROKE'] == 1), heat)
res['heating']['broke_all_homes'] = est((df['NOHEATBROKE'] == 1), df[W] > 0)

# ---- Main air conditioning equipment
ac = (df['ACEQUIPAGE'] > 0) & (df['ACEQUIPM_PUB'] > 0)
res['ac'] = {
    'base_homes_m': round(df.loc[ac, W].sum() / 1e6, 2),
    'dist': age_dist(ac, 'ACEQUIPAGE'), 'summary': old_shares(ac, 'ACEQUIPAGE'),
    'by_type': by(ac, 'ACEQUIPAGE', 'ACEQUIPM_PUB', ACTYPE),
    'by_region': by(ac, 'ACEQUIPAGE', 'REGIONC', {r: r.title() for r in ['NORTHEAST', 'MIDWEST', 'SOUTH', 'WEST']}),
    'by_tenure': by(ac, 'ACEQUIPAGE', 'KOWNRENT', TENURE),
    'by_yearmade': by(ac, 'ACEQUIPAGE', 'YEARMADERANGE', YEARMADE),
    'by_state': by_state(ac, 'ACEQUIPAGE'),
}
central = ac & (df['ACEQUIPM_PUB'] == 1)
res['ac']['central_dist'] = age_dist(central, 'ACEQUIPAGE')
res['ac']['central_summary'] = old_shares(central, 'ACEQUIPAGE')
# Central ACs 10+ years old in 2020, i.e. installed before ~2010 when R-22 was phased out of new equipment
res['ac']['central_10plus'] = est(central & (df['ACEQUIPAGE'] >= 4), central)

# ---- Main water heater
wh = df['WHEATAGE'] > 0
res['water'] = {
    'base_homes_m': round(df.loc[wh, W].sum() / 1e6, 2),
    'dist': age_dist(wh, 'WHEATAGE'), 'summary': old_shares(wh, 'WHEATAGE'),
    'by_fuel': by(wh, 'WHEATAGE', 'FUELH2O', FUEL),
    'by_size': by(wh, 'WHEATAGE', 'WHEATSIZ', WHSIZE),
    'by_region': by(wh, 'WHEATAGE', 'REGIONC', {r: r.title() for r in ['NORTHEAST', 'MIDWEST', 'SOUTH', 'WEST']}),
    'by_tenure': by(wh, 'WHEATAGE', 'KOWNRENT', TENURE),
    'by_yearmade': by(wh, 'WHEATAGE', 'YEARMADERANGE', YEARMADE),
    'by_state': by_state(wh, 'WHEATAGE'),
}
# Tankless share by water heater age: how fast tankless is growing
res['water']['tankless_by_age'] = {AGE[k]: est(wh & (df['WHEATAGE'] == k) & (df['WHEATSIZ'] == 4), wh & (df['WHEATAGE'] == k)) for k in AGE}
res['water']['tankless_all'] = est(wh & (df['WHEATSIZ'] == 4), wh)
# Heat pumps as share of main heating, by heating equipment age (adoption trend)
res['heating']['heatpump_by_age'] = {AGE[k]: est(heat & (df['EQUIPAGE'] == k) & df['EQUIPM'].isin([4, 13]), heat & (df['EQUIPAGE'] == k)) for k in AGE}
# Homes where both furnace/main heat AND water heater are 15+ years
both = heat & wh
res['both_15plus'] = est(both & (df['EQUIPAGE'] >= 5) & (df['WHEATAGE'] >= 5), both)
res['any_15plus'] = est((heat & (df['EQUIPAGE'] >= 5)) | (wh & (df['WHEATAGE'] >= 5)) | (ac & (df['ACEQUIPAGE'] >= 5)), df[W] > 0)

out = os.path.join(ROOT, 'src', 'data', 'stats'); os.makedirs(out, exist_ok=True)
with open(os.path.join(out, 'recs-ages.json'), 'w') as f:
    json.dump(res, f, indent=1)

# CSV downloads: state tables per equipment
pub = os.path.join(ROOT, 'public', 'data'); os.makedirs(pub, exist_ok=True)
for key, fname in [('furnace', 'furnace-age-by-state.csv'), ('ac', 'ac-age-by-state.csv'), ('water', 'water-heater-age-by-state.csv'), ('heating', 'heating-equipment-age-by-state.csv')]:
    with open(os.path.join(pub, fname), 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['state', 'homes_with_equipment_millions', 'pct_10_plus_years', 'se_10_plus', 'pct_15_plus_years', 'se_15_plus', 'pct_20_plus_years', 'se_20_plus', 'pct_under_5_years', 'se_under_5', 'sampled_homes', 'all_estimates_reliable'])
        for st, v in sorted(res[key]['by_state'].items()):
            ok = v['n_base'] >= 30 and v['10plus']['ok'] and v['15plus']['ok'] and v['20plus']['ok']
            w.writerow([st, v['base_homes_m'], v['10plus']['pct'], v['10plus']['se'], v['15plus']['pct'], v['15plus']['se'], v['20plus']['pct'], v['20plus']['se'], v['under5']['pct'], v['under5']['se'], v['n_base'], 'yes' if ok else 'no (RSE over 30% for at least one column)'])
print('wrote', out)
