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

function makeBubbles(sites: typeof researchMapSites, selectedId: string | null, size: number, focused: boolean): MapBubble[] {
  return sites.map((site) => ({
    id: site.id,
    name: site.name,
    country: site.country,
    status: site.status,
    latitude: site.lat + (site.dlat ?? 0),
    longitude: site.lon + (site.dlon ?? 0),
    radius: Math.max(focused ? 7 : 4, size / 180) + (site.id === selectedId ? 3 : 0),
    fillKey: site.status === 'Planned' ? 'planned' : site.theme,
    borderWidth: site.id === selectedId ? 3 : 1.5,
    borderColor: site.id === selectedId ? cssValue('--grm-selected') : cssValue('--grm-border'),
    fillOpacity: 1,
  }));
}

function drawWorldMap(
  element: HTMLElement,
  view: MapView,
  selectedId: string | null,
  enabledThemes: Set<ResearchMapTheme>,
  focused: boolean,
  onSelect: (siteId: string, fromKeyboard?: boolean) => void,
) {
  const { Datamap, d3 } = window;
  if (!Datamap || !d3) return false;

  const width = element.clientWidth;
  if (width <= 0) return false;
  const height = focused ? Math.min(560, Math.max(300, Math.round(width * 0.84))) : Math.round(width * 0.44);
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
        .scale(width / (2 * Math.PI) * (focused ? 5 : 1))
        .center(focused ? [30, -2] : [10, 14])
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
    const visibleSites = researchMapSites.filter((site) =>
      enabledThemes.has(site.theme) && (!focused || site.region === 'East African sampling network'),
    );
    map.bubbles(makeBubbles(visibleSites, selectedId, width, focused), {});
    map.svg.selectAll('.datamaps-bubble')
      .attr('data-site-id', (bubble) => bubble.id)
      .attr('tabindex', '0')
      .attr('role', 'button')
      .attr('aria-label', (bubble) => `${bubble.name}, ${bubble.country}${bubble.status ? `, ${bubble.status}` : ''} research location`)
      .attr('aria-pressed', (bubble) => String(bubble.id === selectedId))
      .style('cursor', 'pointer')
      .on('click', (bubble) => onSelect(bubble.id))
      .on('keydown', (bubble) => {
        const event = d3.event;
        if (event instanceof KeyboardEvent && (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar')) {
          event.preventDefault();
          onSelect(bubble.id, true);
        }
      });
  }
  return true;
}

export function GlobalResearchMapPage() {
  const [view, setView] = useState<MapView>('sites');
  const [selectedId, setSelectedId] = useState<string | null>('london');
  const [focused, setFocused] = useState(false);
  const [enabledThemes, setEnabledThemes] = useState<Set<ResearchMapTheme>>(
    () => new Set(Object.keys(researchMapThemes) as ResearchMapTheme[]),
  );
  const [librariesReady, setLibrariesReady] = useState(false);
  const [mapsDrawn, setMapsDrawn] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);
  const worldMapRef = useRef<HTMLDivElement>(null);
  const restoreMapFocus = useRef(false);

  const counts = useMemo(() => ({
    sites: researchMapSites.filter((site) => site.status !== 'Planned').length,
    listed: researchMapSites.length,
    planned: researchMapSites.filter((site) => site.status === 'Planned').length,
    countries: new Set(researchMapSites.filter((site) => site.status !== 'Planned').map((site) => site.country)).size,
    eastAfrica: EAST_AFRICA.length,
    continents: new Set(researchMapSites.filter((site) => site.status !== 'Planned').map((site) => site.continent)).size,
  }), []);
  const visibleSites = useMemo(
    () => researchMapSites.filter((site) => enabledThemes.has(site.theme)),
    [enabledThemes],
  );
  const visibleEastAfrica = visibleSites.filter((site) => site.region === 'East African sampling network');

  const toggleTheme = (theme: ResearchMapTheme) => {
    if (enabledThemes.has(theme) && enabledThemes.size === 1) return;
    const updated = new Set(enabledThemes);
    if (updated.has(theme)) updated.delete(theme);
    else updated.add(theme);
    const selectedSite = researchMapSites.find((site) => site.id === selectedId);
    if (selectedSite && !updated.has(selectedSite.theme)) {
      setSelectedId(null);
    }
    setEnabledThemes(updated);
  };

  const selectSite = useCallback((siteId: string, fromKeyboard = false) => {
    restoreMapFocus.current = fromKeyboard;
    if (focused && !EAST_AFRICA.some((site) => site.id === siteId)) setFocused(false);
    setSelectedId(siteId);
  }, [focused]);

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
        const worldReady = drawWorldMap(worldMapRef.current, view, selectedId, enabledThemes, focused, selectSite);
        if (restoreMapFocus.current) {
          worldMapRef.current.querySelector<SVGCircleElement>(`[data-site-id="${selectedId}"]`)?.focus();
          restoreMapFocus.current = false;
        }
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
  }, [enabledThemes, focused, librariesReady, selectSite, selectedId, view]);

  return (
    <div className="global-research-map">
      <section className="grm-hero p3-purple-hero">
        <div className="container-wide grm-hero-grid">
          <div>
            <span className="grm-eyebrow">Global research map</span>
            <h1>Where we measure the air</h1>
            <p>Explore research sites, collaborations and the communities connected to our work around the world.</p>
            <a className="grm-jump-link" href="#grm-interactive-map">Explore the map <span aria-hidden="true">↓</span></a>
          </div>
          <div className="grm-stats" aria-label="Map statistics">
            <div><strong>{counts.sites}</strong><span>Non-planned locations</span></div>
            <div><strong>{counts.countries}</strong><span>Country and territory labels</span></div>
            <div><strong>{counts.eastAfrica}</strong><span>East African sampling sites</span></div>
            <div><strong>{counts.continents}</strong><span>Continents</span></div>
          </div>
          <p className="grm-count-note">{counts.sites} non-planned locations are shown across {counts.listed} listed records; {counts.planned} planned {counts.planned === 1 ? 'location is' : 'locations are'} included in the list but excluded from the headline totals. Country and continent counts use the recorded map labels.</p>
        </div>
      </section>

      <section id="grm-interactive-map" className="grm-section grm-interactive" aria-label="Interactive research map">
        <div className="container-wide">
          <div className="grm-toolbar">
            <div className="grm-segment" role="group" aria-label="Map view">
              <button type="button" aria-pressed={view === 'sites'} onClick={() => { setView('sites'); setFocused(false); }}>Research sites</button>
              <button type="button" aria-pressed={view === 'team'} onClick={() => { setView('team'); setFocused(false); }}>Where our team comes from</button>
            </div>
            {view === 'sites' && <div className="grm-legend" role="group" aria-label="Filter research themes">
              {(Object.entries(researchMapThemes) as [ResearchMapTheme, { name: string }][]).map(([theme, value]) => (
                <button key={theme} type="button" aria-pressed={enabledThemes.has(theme)} onClick={() => toggleTheme(theme)}>
                  <i style={{ backgroundColor: themeColor(theme) }} aria-hidden="true" />{value.name}
                </button>
              ))}
            </div>}
          </div>
          {view === 'team' && <p className="grm-team-map-note">Highlighted countries are those listed in team profiles. This view shows profile connections, not research-site locations.</p>}

          <div className={`grm-map-card${focused ? ' is-focused' : ''}`}>
            <div className="grm-map-topline">
              <span>{view === 'sites' ? 'Research sites' : 'Team connections'}</span>
              <div className="grm-map-topline-actions">
                {view === 'sites' && mapsDrawn && <button type="button" aria-pressed={focused} onClick={() => { if (!focused) setSelectedId(null); setFocused((current) => !current); }}>{focused ? 'Show global map' : 'Focus East Africa'}</button>}
                <span>Interactive map</span>
              </div>
            </div>
            <div className={`grm-map-stage${focused ? ' is-focused' : ''}`}>
              <div ref={worldMapRef} className="grm-world-map" hidden={mapFailed || !librariesReady} role="group" aria-label={view === 'sites' ? 'Interactive world map of research locations; markers are keyboard-accessible buttons.' : 'Interactive world map highlighting countries listed in team profiles.'} />
              {(mapFailed || !librariesReady || !mapsDrawn) && <img className="grm-map-fallback" src="/images/map-research-locations.png" alt="Static world map showing P3 Health Lab research locations." />}
              {view === 'sites' && visibleEastAfrica.length > 0 && <details className="grm-east-africa-cluster">
                <summary aria-label={`${visibleEastAfrica.length} East African sampling locations. Expand to select an individual location.`}>
                  <strong>{visibleEastAfrica.length}</strong><span>East Africa sites</span>
                </summary>
                <div className="grm-cluster-list">
                  <p>Select a location to highlight its marker.</p>
                  {visibleEastAfrica.map((site) => <button key={site.id} type="button" aria-pressed={site.id === selectedId} onClick={() => selectSite(site.id)}>
                    <span>{site.name}</span><small>{site.country}</small>
                  </button>)}
                  <a href="#grm-east-africa">View the regional location list</a>
                </div>
              </details>}
            </div>
          </div>
          {mapFailed && <p className="grm-map-warning" role="status">The interactive map could not load; the site lists below remain available.</p>}
        </div>
      </section>

      <section className="grm-section grm-regions">
        <div className="container-wide">
          {view === 'sites' ? <>
            <div className="grm-section-heading"><span className="grm-eyebrow">Explore by region</span><h2>Sites by region</h2></div>
            <p className="grm-list-status" role="status">Showing {visibleSites.length} of {counts.listed} listed locations. Theme filters apply to both this list and the map; {counts.planned} planned {counts.planned === 1 ? 'location is' : 'locations are'} included here but excluded from the {counts.sites} non-planned headline total. Select a location to highlight its map marker.</p>
            <div className="grm-region-grid">
              {REGIONS.map((region, index) => {
                const sites = visibleSites.filter((site) => site.region === region);
                if (sites.length === 0) return null;
                return <section key={region} id={region === 'East African sampling network' ? 'grm-east-africa' : undefined} aria-labelledby={`grm-region-${index}`}>
                  <h3 id={`grm-region-${index}`}>{region}</h3>
                  <div>{sites.map((site) => <button key={site.id} type="button" aria-label={`Select ${site.name}, ${site.country}, ${site.status} and highlight its map marker`} aria-pressed={site.id === selectedId} className={site.id === selectedId ? 'is-selected' : ''} onClick={() => selectSite(site.id)}>
                    <span>{site.name}</span><small>{site.id === selectedId ? 'Selected · shown on map' : `${site.country} · ${site.status}`}</small>
                  </button>)}</div>
                </section>;
              })}
            </div>
          </> : <>
            <div className="grm-section-heading"><span className="grm-eyebrow">Team connections</span><h2>Countries represented in team profiles</h2></div>
            <ul className="grm-team-country-list">{researchMapTeamCountries.map(({ country }) => <li key={country}>{country}</li>)}</ul>
          </>}
        </div>
      </section>
    </div>
  );
}
