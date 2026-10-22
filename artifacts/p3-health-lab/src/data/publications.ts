export type Publication = {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  date: string;
  articleNumber: string;
  doi: string;
  url: string;
};

export const publications: Publication[] = [
  {
    title: 'First Results from a Passive Air Monitoring Network across Five East African Countries for Polycyclic Aromatic Hydrocarbons (PAHs) and Metals',
    authors: ['Egide Kalisa', 'Tom Harner', 'Franck Kwabe', 'Amandeep Saini', 'Jacob Mastin'],
    journal: 'Environmental Pollution',
    year: 2026,
    date: '2026-10-17',
    articleNumber: '129361',
    doi: '10.1016/j.envpol.2026.129361',
    url: 'https://www.sciencedirect.com/science/article/pii/S0269749126017318',
  },
];
