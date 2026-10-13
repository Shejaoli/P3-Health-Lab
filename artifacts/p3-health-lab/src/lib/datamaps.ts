export type Projection = {
  scale(value: number): Projection;
  center(value: [number, number]): Projection;
  translate(value: [number, number]): Projection;
};

export type MapBubble = {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  radius: number;
  fillKey: string;
  borderWidth: number;
  borderColor: string;
  fillOpacity: number;
};

export type DatamapSelection = {
  style(name: string, value: string): DatamapSelection;
  on(event: string, handler: (bubble: MapBubble) => void): DatamapSelection;
};

export type DatamapInstance = {
  bubbles(data: MapBubble[], options: Record<string, never>): void;
  svg: {
    selectAll(selector: string): DatamapSelection;
  };
};

export type DatamapOptions = {
  element: HTMLElement;
  scope: 'world';
  fills: Record<string, string>;
  data: Record<string, { fillKey: string }>;
  setProjection: () => { path: unknown; projection: Projection };
  geographyConfig: {
    borderColor: string;
    borderWidth: number;
    highlightOnHover: false;
    popupOnHover: true;
    popupTemplate: (geography: { properties: { name: string } }) => string;
  };
  bubblesConfig: {
    popupOnHover: true;
    highlightOnHover: false;
    animate: false;
    popupTemplate: (_geography: unknown, bubble: MapBubble) => string;
  };
};

type D3V3 = {
  geo: {
    equirectangular(): Projection;
    mercator(): Projection;
    path(): { projection(projection: Projection): unknown };
  };
};

declare global {
  interface Window {
    d3?: D3V3;
    topojson?: unknown;
    Datamap?: new (options: DatamapOptions) => DatamapInstance;
  }
}

export function loadDatamapLibraries() {
  if (!window.d3 || !window.topojson || !window.Datamap) {
    return Promise.reject(new Error('The map libraries did not initialize.'));
  }
  return Promise.resolve();
}

export function cssValue(name: string) {
  const scope = document.querySelector('.global-research-map, .p3-home') ?? document.documentElement;
  return getComputedStyle(scope).getPropertyValue(name).trim();
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
  })[character] ?? character);
}
