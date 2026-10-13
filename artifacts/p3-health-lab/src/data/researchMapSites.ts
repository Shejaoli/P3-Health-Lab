export type ResearchMapTheme = 'home' | 'aero' | 'child' | 'mob' | 'clim' | 'train';
export type ResearchMapRegion =
  | 'North America'
  | 'Europe'
  | 'South America'
  | 'Asia & Oceania'
  | 'Africa: partners'
  | 'East African sampling network';

export const researchMapThemes: Record<ResearchMapTheme, { name: string }> = {
  home: { name: 'Home base' },
  aero: { name: 'Airborne microbiome & chemicals' },
  child: { name: 'Children & schools' },
  mob: { name: 'Mobility & cities' },
  clim: { name: 'Climate heat & household air' },
  train: { name: 'Training & partnerships' },
};

export const researchMapSites: {
  id: string;
  name: string;
  country: string;
  iso: string;
  lat: number;
  lon: number;
  dlat?: number;
  dlon?: number;
  theme: ResearchMapTheme;
  status: string;
  continent: string;
  region: ResearchMapRegion;
  landUse: string;
}[] = [
  { id: 'london', name: 'London, Ontario', country: 'Canada', iso: 'CAN', lat: 42.98, lon: -81.25, theme: 'home', status: 'Home base', continent: 'North America', region: 'North America', landUse: 'Research location' },
  { id: 'toronto', name: 'Toronto, Ontario', country: 'Canada', iso: 'CAN', lat: 43.70, lon: -79.42, dlat: 0.8, dlon: 2.5, theme: 'train', status: 'Partner', continent: 'North America', region: 'North America', landUse: 'Research location' },
  { id: 'oilsands', name: 'Athabasca Oil Sands, Alberta', country: 'Canada', iso: 'CAN', lat: 57.0, lon: -111.5, theme: 'aero', status: 'Active', continent: 'North America', region: 'North America', landUse: 'Research location' },
  { id: 'birmingham', name: 'Birmingham', country: 'United Kingdom', iso: 'GBR', lat: 52.49, lon: -1.89, theme: 'clim', status: 'Past', continent: 'Europe', region: 'Europe', landUse: 'Research location' },
  { id: 'kanazawa', name: 'Kanazawa', country: 'Japan', iso: 'JPN', lat: 36.56, lon: 136.65, theme: 'aero', status: 'Partner', continent: 'Asia', region: 'Asia & Oceania', landUse: 'Research location' },
  { id: 'auckland', name: 'Auckland', country: 'New Zealand', iso: 'NZL', lat: -36.85, lon: 174.76, theme: 'aero', status: 'Past', continent: 'Oceania', region: 'Asia & Oceania', landUse: 'Research location' },
  { id: 'guiana', name: 'French Guiana', country: 'French Guiana (France)', iso: 'GUF', lat: 4.9, lon: -52.3, theme: 'aero', status: 'Expanding', continent: 'South America', region: 'South America', landUse: 'Research location' },
  { id: 'brazil', name: 'Brazilian Amazon', country: 'Brazil', iso: 'BRA', lat: -3.1, lon: -60.0, theme: 'aero', status: 'Planned', continent: 'South America', region: 'South America', landUse: 'Research location' },
  { id: 'dakar', name: 'Dakar', country: 'Senegal', iso: 'SEN', lat: 14.72, lon: -17.47, theme: 'train', status: 'Partner', continent: 'Africa', region: 'Africa: partners', landUse: 'Research location' },
  { id: 'accra', name: 'Accra', country: 'Ghana', iso: 'GHA', lat: 5.60, lon: -0.19, theme: 'train', status: 'Partner', continent: 'Africa', region: 'Africa: partners', landUse: 'Research location' },
  { id: 'kampala', name: 'Kampala', country: 'Uganda', iso: 'UGA', lat: 0.35, lon: 32.58, theme: 'train', status: 'Partner', continent: 'Africa', region: 'Africa: partners', landUse: 'Research location' },
  { id: 'kigali', name: 'Kigali', country: 'Rwanda', iso: 'RWA', lat: -1.944, lon: 30.06, theme: 'child', status: 'Active', continent: 'Africa', region: 'East African sampling network', landUse: 'Passive air sampling site' },
  { id: 'nyagatare', name: 'Nyagatare', country: 'Rwanda', iso: 'RWA', lat: -1.30, lon: 30.33, theme: 'aero', status: 'Active', continent: 'Africa', region: 'East African sampling network', landUse: 'Passive air sampling site' },
  { id: 'rubavu', name: 'Rubavu', country: 'Rwanda', iso: 'RWA', lat: -1.68, lon: 29.26, dlon: 0.10, theme: 'aero', status: 'Active', continent: 'Africa', region: 'East African sampling network', landUse: 'Passive air sampling site' },
  { id: 'rusizi', name: 'Rusizi', country: 'Rwanda', iso: 'RWA', lat: -2.48, lon: 28.91, dlon: 0.10, theme: 'aero', status: 'Active', continent: 'Africa', region: 'East African sampling network', landUse: 'Passive air sampling site' },
  { id: 'kitabi', name: 'Kitabi', country: 'Rwanda', iso: 'RWA', lat: -2.53, lon: 29.43, theme: 'aero', status: 'Active', continent: 'Africa', region: 'East African sampling network', landUse: 'Passive air sampling site' },
  { id: 'bujumbura', name: 'Bujumbura', country: 'Burundi', iso: 'BDI', lat: -3.38, lon: 29.36, theme: 'aero', status: 'Active', continent: 'Africa', region: 'East African sampling network', landUse: 'Passive air sampling site' },
  { id: 'bukavu', name: 'Bukavu', country: 'DR Congo', iso: 'COD', lat: -2.51, lon: 28.86, dlon: -0.10, theme: 'aero', status: 'Active', continent: 'Africa', region: 'East African sampling network', landUse: 'Passive air sampling site' },
  { id: 'goma', name: 'Goma', country: 'DR Congo', iso: 'COD', lat: -1.68, lon: 29.22, dlon: -0.10, theme: 'aero', status: 'Active', continent: 'Africa', region: 'East African sampling network', landUse: 'Passive air sampling site' },
  { id: 'nairobi', name: 'Nairobi', country: 'Kenya', iso: 'KEN', lat: -1.29, lon: 36.82, theme: 'aero', status: 'Active', continent: 'Africa', region: 'East African sampling network', landUse: 'Passive air sampling site' },
  { id: 'dar', name: 'Dar es Salaam', country: 'Tanzania', iso: 'TZA', lat: -6.79, lon: 39.21, theme: 'aero', status: 'Active', continent: 'Africa', region: 'East African sampling network', landUse: 'Passive air sampling site' },
];

export const researchMapTeamCountries = [
  { country: 'Canada', iso: 'CAN' },
  { country: 'Senegal', iso: 'SEN' },
  { country: 'Ghana', iso: 'GHA' },
  { country: 'Nigeria', iso: 'NGA' },
  { country: 'Iraq', iso: 'IRQ' },
  { country: 'Afghanistan', iso: 'AFG' },
  { country: 'Uganda', iso: 'UGA' },
  { country: 'Rwanda', iso: 'RWA' },
  { country: 'Bangladesh', iso: 'BGD' },
  { country: 'China', iso: 'CHN' },
];
