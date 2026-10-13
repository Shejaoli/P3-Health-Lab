import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { researchMapSites, researchMapThemes, type ResearchMapTheme } from '@/data/researchMapSites';
import { cssValue, escapeHtml, loadDatamapLibraries, type DatamapOptions, type MapBubble, type Projection } from '@/lib/datamaps';

const FULL_MAP_URL = '/research-map';

function drawMap(element: HTMLElement, fallback: HTMLImageElement) {
  const { Datamap, d3 } = window;
  if (!Datamap || !d3) return false;

  element.hidden = false;
  const width = element.clientWidth;
  if (width <= 0) {
    element.hidden = true;
    return false;
  }
  const height = Math.round(width * 0.44);
  element.style.height = `${height}px`;
  element.replaceChildren();

  const fills: Record<string, string> = {
    defaultFill: cssValue('--mm-land'),
    on: cssValue('--mm-on'),
    planned: cssValue('--muted'),
  };
  (Object.keys(researchMapThemes) as ResearchMapTheme[]).forEach((theme) => {
    fills[theme] = cssValue(`--mm-${theme}`);
  });

  const data: Record<string, { fillKey: string }> = {};
  researchMapSites
    .filter((site) => site.status !== 'Planned' && site.iso !== 'GUF')
    .forEach((site) => {
      data[site.iso] = { fillKey: 'on' };
    });

  const map = new Datamap({
    element,
    scope: 'world',
    fills,
    data,
    setProjection: () => {
      const projection = d3.geo.equirectangular()
        .scale(width / (2 * Math.PI))
        .center([10, 14])
        .translate([width / 2, height / 2]);
      return {
        path: d3.geo.path().projection(projection),
        projection,
      };
    },
    geographyConfig: {
      borderColor: cssValue('--mm-border'),
      borderWidth: 0.6,
      highlightOnHover: false,
      popupOnHover: true,
      popupTemplate: (geography) => `<div class="hoverinfo home-minimap-tooltip">${escapeHtml(geography.properties.name)}</div>`,
    },
    bubblesConfig: {
      popupOnHover: true,
      highlightOnHover: false,
      animate: false,
      popupTemplate: (_geography, bubble) => `<div class="hoverinfo home-minimap-tooltip"><strong>${escapeHtml(bubble.name)}</strong><small>${escapeHtml(bubble.country)}</small></div>`,
    },
  });

  const radius = Math.max(4, width / 180);
  map.bubbles(researchMapSites.map((site): MapBubble => ({
    id: site.id,
    name: site.name,
    country: site.country,
    latitude: site.lat + (site.dlat ?? 0),
    longitude: site.lon + (site.dlon ?? 0),
    radius: site.id === 'london' ? radius + 3 : radius,
    fillKey: site.status === 'Planned' ? 'planned' : site.theme,
    borderWidth: 1.5,
    borderColor: cssValue('--mm-border'),
    fillOpacity: 1,
  })), {});

  map.svg.selectAll('.datamaps-bubble')
    .style('cursor', 'pointer')
    .on('click', () => window.location.assign(FULL_MAP_URL));

  fallback.hidden = true;
  element.hidden = false;
  return true;
}

export function HomeResearchMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const mapElement = mapRef.current;
    const fallback = fallbackRef.current;
    if (!mapElement || !fallback) return;

    let disposed = false;
    let resizeTimer: number | undefined;
    const redraw = () => {
      if (disposed) return;
      try {
        if (!drawMap(mapElement, fallback)) {
          fallback.hidden = false;
        }
      } catch {
        mapElement.hidden = true;
        fallback.hidden = false;
      }
    };
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(redraw, 200);
    };
    const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const onColorSchemeChange = () => redraw();

    void loadDatamapLibraries().then(redraw).catch(() => {
      if (!disposed) {
        mapElement.hidden = true;
        fallback.hidden = false;
      }
    });

    window.addEventListener('resize', onResize);
    colorScheme.addEventListener('change', onColorSchemeChange);
    return () => {
      disposed = true;
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      colorScheme.removeEventListener('change', onColorSchemeChange);
    };
  }, []);

  return (
    <div className="home-minimap-card">
      <div ref={mapRef} id="minimap" className="home-minimap" hidden aria-label="Interactive world map of research sites" />
      <img
        ref={fallbackRef}
        className="home-minimap-fallback"
        src="/images/map-research-locations.png"
        alt="World map of P3 Health Lab research sites."
        width="1672"
        height="941"
      />
      <div className="home-minimap-legend" aria-label="Research map legend">
        <span><i className="home-minimap-dot home-minimap-dot-home" />Home base</span>
        <span><i className="home-minimap-dot home-minimap-dot-aero" />Airborne microbiome &amp; chemicals</span>
        <span><i className="home-minimap-dot home-minimap-dot-child" />Children &amp; schools</span>
        <span><i className="home-minimap-dot home-minimap-dot-clim" />Climate &amp; heat</span>
        <span><i className="home-minimap-dot home-minimap-dot-train" />Partnerships</span>
        <Link href={FULL_MAP_URL}>Open the full map <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  );
}
