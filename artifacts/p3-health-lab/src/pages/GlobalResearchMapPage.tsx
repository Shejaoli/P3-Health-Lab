import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  researchMapSites,
  researchMapTeamCountries,
  researchMapThemes,
  type ResearchMapRegion,
  type ResearchMapTheme,
} from '@/data/researchMapSites';
import {
  cssValue,
  escapeHtml,
  loadDatamapLibraries,
  type DatamapOptions,
  type MapBubble,
  type Projection,
} from '@/lib/datamaps';
import './global-research-map.css';

type MapView = 'sites' | 'team';

const EAST_AFRICA = researchMapSites.filter((site) => site.region === 'East African sampling network');
const REGIONS: ResearchMapRegion[] = [
  'North America',
  'Europe',
  'South America',
  'Asia & Oceania',
  'Africa: partners',
  'East African sampling network',
];

function themeColor(theme: ResearchMapTheme) {
  return cssValue(`--mm-${theme}`);
}

function buildFills() {
  const fills: Record<string, string> = {
    defaultFill: cssValue('--grm-land'),
    team: cssValue('--grm-team'),
    planned: cssValue('--grm-muted'),
  };
  (Object.keys(researchMapThemes) as ResearchMapTheme[]).forEach((theme) => {
    fills[theme] = themeColor(theme);
    fills[`${theme}Country`] = cssValue(`--grm-${theme}-fill`);
  });
  return fills;
}

function makeBubbles(sites: typeof researchMapSites, selectedId: string | null, size: number): MapBubble[] {
  return sites.map((site) => ({
    id: site.id,
    name: site.name,
    country: site.country,
    latitude: site.lat + (site.dlat ?? 0),
    longitude: site.lon + (site.dlon ?? 0),
    radius: Math.max(4, size / 180) + (site.id === selectedId ? 3 : 0),
    fillKey: site.status === 'Planned' ? 'planned' : site.theme,
    borderWidth: site.id === selectedId ? 3 : 1.5,
    borderColor: site.id === selectedId ? cssValue('--grm-selected') : cssValue('--grm-border'),
    fillOpacity: 1,
  }));
}

function drawWorldMap(element: HTMLElement, view: MapView, selectedId: string | null, enabledThemes: Set<ResearchMapTheme>, onSelect: (siteId: string) => void) {
  const { Datamap, d3 } = window;
  if (!Datamap || !d3) return false;

  const width = element.clientWidth;
  if (width <= 0) return false;
  const height = Math.round(width * 0.44);
  element.style.height = `${height}px`;
  element.replaceChildren();

  const teamData: Record<string, { fillKey: string }> = {};
  researchMapTeamCountries.forEach(({ iso }) => { teamData[iso] = { fillKey: 'team' }; });
  const countryThemes = new Map<string, ResearchMapTheme>();
  researchMapSites.filter((site) => site.status !== 'Planned' && site.iso !== 'GUF').forEach((site) => {
    const current = countryThemes.get(site.iso);
    if (!current || site.theme === 'home') countryThemes.set(site.iso, site.theme);
  });
  const siteData: Record<string, { fillKey: string }> = {};
  countryThemes.forEach((theme, iso) => { siteData[iso] = { fillKey: `${theme}Country` }; });

  const options: DatamapOptions = {
    element,
    scope: 'world',
    fills: buildFills(),
    data: view === 'team' ? teamData : siteData,
    setProjection: () => {
      const projection = d3.geo.equirectangular()
        .scale(width / (2 * Math.PI))
        .center([10, 14])
        .translate([width / 2, height / 2]);
      return { path: d3.geo.path().projection(projection), projection };
    },
    geographyConfig: {
      borderColor: cssValue('--grm-border'),
      borderWidth: 0.6,
      highlightOnHover: false,
      popupOnHover: true,
      popupTemplate: (geography) => `<div class="hoverinfo grm-tooltip">${escapeHtml(geography.properties.name)}</div>`,
    },
    bubblesConfig: {
      popupOnHover: true,
      highlightOnHover: false,
      animate: false,
      popupTemplate: (_geography, bubble) => `<div class="hoverinfo grm-tooltip"><strong>${escapeHtml(bubble.name)}</strong><small>${escapeHtml(bubble.country)}</small></div>`,
    },
  };
  const map = new Datamap(options);
  if (view === 'sites') {
    const visibleSites = researchMapSites.filter((site) => enabledThemes.has(site.theme));
    map.bubbles(makeBubbles(visibleSites, selectedId, width), {});
    map.svg.selectAll('.datamaps-bubble')
      .style('cursor', 'pointer')
      .on('click', (bubble) => onSelect(bubble.id));
  }
  return true;
}

export function GlobalResearchMapPage() {
  const [view, setView] = useState<MapView>('sites');
  const [selectedId, setSelectedId] = useState('london');
  const [enabledThemes, setEnabledThemes] = useState<Set<ResearchMapTheme>>(
    () => new Set(Object.keys(researchMapThemes) as ResearchMapTheme[]),
  );
  const [librariesReady, setLibrariesReady] = useState(false);
  const [mapsDrawn, setMapsDrawn] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);
  const worldMapRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => ({
    sites: researchMapSites.filter((site) => site.status !== 'Planned').length,
    countries: new Set(researchMapSites.filter((site) => site.status !== 'Planned').map((site) => site.country)).size,
    eastAfrica: EAST_AFRICA.length,
    continents: new Set(researchMapSites.filter((site) => site.status !== 'Planned').map((site) => site.continent)).size,
  }), []);

  const selectSite = useCallback((siteId: string) => setSelectedId(siteId), []);

  useEffect(() => {
    let cancelled = false;
    void loadDatamapLibraries().then(() => {
      if (!cancelled) setLibrariesReady(true);
    }).catch(() => {
      if (!cancelled) setMapFailed(true);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!librariesReady) return;
    let resizeTimer: number | undefined;
    const draw = () => {
      if (!worldMapRef.current) return;
      try {
        const worldReady = drawWorldMap(worldMapRef.current, view, selectedId, enabledThemes, (id) => selectSite(id));
        setMapFailed(!worldReady);
        setMapsDrawn(worldReady);
      } catch {
        setMapFailed(true);
        setMapsDrawn(false);
      }
    };
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(draw, 200);
    };
    const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
    window.addEventListener('resize', onResize);
    colorScheme.addEventListener('change', draw);
    draw();
    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      colorScheme.removeEventListener('change', draw);
    };
  }, [enabledThemes, librariesReady, selectSite, selectedId, view]);

  const toggleTheme = (theme: ResearchMapTheme) => {
    setEnabledThemes((current) => {
      if (current.has(theme) && current.size === 1) return current;
      const updated = new Set(current);
      if (updated.has(theme)) updated.delete(theme);
      else updated.add(theme);
      return updated;
    });
  };

  return (
    <div className="global-research-map">
      <section className="grm-hero p3-purple-hero">
        <div className="container-wide grm-hero-grid">
          <div>
            <span className="grm-eyebrow">Global research map</span>
            <h1>Where we measure the air</h1>
            <p>Explore research sites, collaborations and the communities connected to our work around the world.</p>
          </div>
          <div className="grm-stats" aria-label="Map statistics">
            <div><strong>{counts.sites}</strong><span>Research sites</span></div>
            <div><strong>{counts.countries}</strong><span>Countries</span></div>
            <div><strong>{counts.eastAfrica}</strong><span>East African sampling sites</span></div>
            <div><strong>{counts.continents}</strong><span>Continents</span></div>
          </div>
        </div>
      </section>

      <section className="grm-section grm-interactive" aria-label="Interactive research map">
        <div className="container-wide">
          <div className="grm-toolbar">
            <div className="grm-segment" role="group" aria-label="Map view">
              <button type="button" aria-pressed={view === 'sites'} onClick={() => setView('sites')}>Research sites</button>
              <button type="button" aria-pressed={view === 'team'} onClick={() => setView('team')}>Where our team comes from</button>
            </div>
            {view === 'sites' && <div className="grm-legend" aria-label="Filter research themes">
              {(Object.entries(researchMapThemes) as [ResearchMapTheme, { name: string }][]).map(([theme, value]) => (
                <button key={theme} type="button" aria-pressed={enabledThemes.has(theme)} onClick={() => toggleTheme(theme)}>
                  <i style={{ backgroundColor: themeColor(theme) }} aria-hidden="true" />{value.name}
                </button>
              ))}
            </div>}
          </div>

          <div className="grm-map-card">
            <div className="grm-map-topline"><span>{view === 'sites' ? 'Research sites' : 'Team connections'}</span><span>Interactive map</span></div>
            <div ref={worldMapRef} className="grm-world-map" hidden={mapFailed || !librariesReady} aria-label="Interactive world map" />
            {(mapFailed || !librariesReady || !mapsDrawn) && <img className="grm-map-fallback" src="/images/map-research-locations.png" alt="Static world map showing P3 Health Lab research locations." />}
          </div>
          {mapFailed && <p className="grm-map-warning" role="status">The interactive map could not load; the site lists below remain available.</p>}
        </div>
      </section>

      <section className="grm-section grm-regions">
        <div className="container-wide">
          <div className="grm-section-heading"><span className="grm-eyebrow">Explore by region</span><h2>Sites by region</h2></div>
          <div className="grm-region-grid">
            {REGIONS.map((region) => <section key={region} aria-labelledby={`grm-region-${REGIONS.indexOf(region)}`}>
              <h3 id={`grm-region-${REGIONS.indexOf(region)}`}>{region}</h3>
              <div>{researchMapSites.filter((site) => site.region === region).map((site) => <button key={site.id} type="button" className={site.id === selectedId ? 'is-selected' : ''} onClick={() => selectSite(site.id)}>
                <span>{site.name}</span><small>{site.country}</small>
              </button>)}</div>
            </section>)}
          </div>
        </div>
      </section>
    </div>
  );
}
