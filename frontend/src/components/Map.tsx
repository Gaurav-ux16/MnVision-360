import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Plus, Minus, Layers as LayersIcon, Compass } from 'lucide-react';

interface MapProps {
  initialCenter?: [number, number]; // [lng, lat]
  initialZoom?: number;
  height?: string;
  activeLayers?: Record<string, boolean>;
  selectedTarget?: string;
  selectedLocationPin?: { lat: number; lng: number } | null;
  onMarkerClick?: (targetId: string) => void;
  onMapClick?: (lat: number, lng: number, prospectivity: number) => void;
  onHover?: (lat: number, lng: number, prospectivity: number) => void;
}

const TARGET_COORDINATES: Record<string, [number, number]> = {
  'Target-1': [80.08, 21.84],
  'Target-2': [79.98, 21.66],
  'Target-3': [79.78, 21.83],
  'Target-4': [80.32, 21.56],
};

const MAP_TILES = {
  Satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  Terrain: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
  Map: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
};

export function calculateProspectivity(lat: number, lng: number): number {
  const centers = [
    { lat: 21.84, lng: 80.72, score: 0.92 },
    { lat: 21.91, lng: 79.82, score: 0.87 },
    { lat: 21.68, lng: 79.92, score: 0.76 },
    { lat: 21.62, lng: 80.31, score: 0.69 },
    { lat: 21.78, lng: 80.12, score: 0.58 },
  ];
  let maxScore = 0.22;
  for (const c of centers) {
    const dist = Math.sqrt(Math.pow(lat - c.lat, 2) + Math.pow(lng - c.lng, 2));
    if (dist < 0.20) {
      const contrib = c.score * Math.max(0, 1 - dist / 0.20);
      if (contrib > maxScore) maxScore = contrib;
    }
  }
  return Number(Math.min(0.96, Math.max(0.12, maxScore)).toFixed(2));
}

export const Map: React.FC<MapProps> = ({
  initialCenter = [79.98, 21.72], // Centered around Balaghat Manganese Belt
  initialZoom = 9.8,
  height = '100%',
  activeLayers = {
    cem: true,
    sentinel2: false,
    dem: false,
    geology: false,
    occurrences: false,
    lineaments: false,
  },
  selectedTarget = 'Target-1',
  selectedLocationPin = null,
  onMarkerClick,
  onMapClick,
  onHover,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Default basemap is SATELLITE view as requested
  const [mapType, setMapType] = useState<'Satellite' | 'Terrain' | 'Map'>('Satellite');

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const style: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'base-raster-tiles': {
          type: 'raster',
          tiles: [MAP_TILES[mapType]],
          tileSize: 256,
          attribution: 'Esri World Imagery, Sentinel-2 Satellite'
        }
      },
      layers: [
        {
          id: 'base-raster-layer',
          type: 'raster',
          source: 'base-raster-tiles',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    };

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: style,
      center: initialCenter,
      zoom: initialZoom,
      attributionControl: false,
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // 1. AOI BOUNDARY POLYGON (White Outer Boundary as shown in image)
      map.current.addSource('aoi-boundary', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { name: 'AOI Boundary' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [79.62, 21.90],
                  [79.88, 21.95],
                  [80.18, 21.92],
                  [80.45, 21.68],
                  [80.35, 21.48],
                  [80.05, 21.52],
                  [79.82, 21.60],
                  [79.62, 21.90]
                ]]
              }
            }
          ]
        }
      });

      // Shaded background inside AOI boundary
      map.current.addLayer({
        id: 'aoi-boundary-fill',
        type: 'fill',
        source: 'aoi-boundary',
        paint: {
          'fill-color': '#0F172A',
          'fill-opacity': 0.15
        }
      });

      map.current.addLayer({
        id: 'aoi-boundary-line',
        type: 'line',
        source: 'aoi-boundary',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 2.2
        }
      });

      // 2. MULTI-LEVEL HEATMAP GRADIENT POLYGONS (Very Low, Low, Medium, High, Very High)
      const heatFeatures = [
        // Blue / Cyan Outer (Very Low 0.0 - 0.2)
        {
          color: '#0284C7',
          opacity: 0.45,
          coords: [[
            [79.65, 21.88], [79.85, 21.92], [80.15, 21.88], [80.40, 21.65],
            [80.30, 21.50], [80.00, 21.55], [79.80, 21.62], [79.65, 21.88]
          ]]
        },
        // Green Envelope (Low 0.2 - 0.4)
        {
          color: '#10B981',
          opacity: 0.55,
          coords: [[
            [79.68, 21.86], [79.88, 21.90], [80.12, 21.86], [80.36, 21.62],
            [80.25, 21.52], [79.96, 21.58], [79.78, 21.65], [79.68, 21.86]
          ]]
        },
        // Yellow Transition (Medium 0.4 - 0.6)
        {
          color: '#EAB308',
          opacity: 0.65,
          coords: [
            // Target 3 & Target 1 upper cluster
            [[79.70, 21.85], [79.85, 21.89], [80.15, 21.88], [80.00, 21.75], [79.72, 21.78], [79.70, 21.85]],
            // Target 2 & Target 4 lower cluster
            [[79.90, 21.70], [80.34, 21.60], [80.20, 21.52], [79.90, 21.60], [79.90, 21.70]]
          ]
        },
        // Orange Rings (High 0.6 - 0.8)
        {
          color: '#F97316',
          opacity: 0.75,
          coords: [
            // Target 3 Core Ring
            [[79.72, 21.86], [79.84, 21.86], [79.84, 21.78], [79.72, 21.78], [79.72, 21.86]],
            // Target 1 Core Ring
            [[80.00, 21.87], [80.14, 21.87], [80.14, 21.79], [80.00, 21.79], [80.00, 21.87]],
            // Target 2 Core Ring
            [[79.92, 21.69], [80.04, 21.69], [80.04, 21.62], [79.92, 21.62], [79.92, 21.69]],
            // Target 4 Core Ring
            [[80.25, 21.60], [80.36, 21.60], [80.36, 21.52], [80.25, 21.52], [80.25, 21.60]]
          ]
        },
        // Red Core Spots (Very High 0.8 - 1.0)
        {
          color: '#DC2626',
          opacity: 0.85,
          coords: [
            // Target 3 High Core
            [[79.75, 21.85], [79.81, 21.85], [79.81, 21.80], [79.75, 21.80], [79.75, 21.85]],
            // Target 1 Very High Core
            [[80.04, 21.86], [80.11, 21.86], [80.11, 21.81], [80.04, 21.81], [80.04, 21.86]]
          ]
        }
      ];

      heatFeatures.forEach((layerData, idx) => {
        const srcId = `heat-src-${idx}`;
        const layerId = `heat-layer-${idx}`;

        const featuresData: any[] = layerData.coords.map(poly => ({
          type: 'Feature',
          properties: {},
          geometry: { type: 'Polygon', coordinates: poly }
        }));

        map.current?.addSource(srcId, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: featuresData
          }
        });

        map.current?.addLayer({
          id: layerId,
          type: 'fill',
          source: srcId,
          paint: {
            'fill-color': layerData.color,
            'fill-opacity': layerData.opacity
          }
        });
      });

      // 3. MANGANESE BELT LINE (Dashed Gray/White Line as shown in image)
      map.current.addSource('mn-belt-line', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { name: 'Manganese Belt' },
              geometry: {
                type: 'LineString',
                coordinates: [
                  [79.62, 21.90],
                  [79.70, 21.68], // Tirodi
                  [79.82, 21.55], // Ukwa branch
                  [80.18, 21.81], // Balaghat
                  [80.35, 21.72]
                ]
              }
            }
          ]
        }
      });

      map.current.addLayer({
        id: 'mn-belt-line-style',
        type: 'line',
        source: 'mn-belt-line',
        paint: {
          'line-color': '#E2E8F0',
          'line-width': 2,
          'line-dasharray': [4, 4]
        }
      });

      // 4. KEY LOCATIONS (Balaghat, Tirodi, Ukwa dots)
      const keyLocations = [
        { name: 'Balaghat', coords: [80.18, 21.81] },
        { name: 'Tirodi', coords: [79.70, 21.68] },
        { name: 'Ukwa', coords: [79.82, 21.55] }
      ];

      keyLocations.forEach(loc => {
        const el = document.createElement('div');
        el.className = 'flex items-center gap-1 text-[#FFFFFF] text-xs font-bold drop-shadow-md';
        el.innerHTML = `
          <span class="w-2.5 h-2.5 bg-white rounded-full border border-slate-900 shadow"></span>
          <span class="font-serif tracking-wide text-white font-extrabold text-[11px] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">${loc.name}</span>
        `;
        new maplibregl.Marker({ element: el })
          .setLngLat(loc.coords as [number, number])
          .addTo(map.current!);
      });

      // Mousemove hover event listener
      map.current.on('mousemove', (e) => {
        const lng = e.lngLat.lng;
        const lat = e.lngLat.lat;
        const score = calculateProspectivity(lat, lng);
        if (onHoverRef.current) {
          onHoverRef.current(lat, lng, score);
        }
      });

      // Click event listener
      map.current.on('click', (e) => {
        const lng = e.lngLat.lng;
        const lat = e.lngLat.lat;
        const score = calculateProspectivity(lat, lng);
        if (onMapClickRef.current) {
          onMapClickRef.current(lat, lng, score);
        }
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [initialCenter, initialZoom]);

  // Update tile layer when mapType state changes
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const source = map.current.getSource('base-raster-tiles') as maplibregl.RasterTileSource;
    if (source) {
      source.setTiles([MAP_TILES[mapType]]);
    }
  }, [mapType]);

  // Smooth fly to target on selection
  useEffect(() => {
    if (!map.current) return;
    const targetCoords = TARGET_COORDINATES[selectedTarget];
    if (targetCoords) {
      map.current.flyTo({
        center: targetCoords,
        zoom: 10.2,
        speed: 1.2,
        curve: 1.4,
        essential: true,
      });
    }
  }, [selectedTarget]);

  // Render Target Pin Callout Markers exactly matching the reference image!
  useEffect(() => {
    if (!map.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Predefined Target Markers
    const targetPins = [
      { id: 'Target-1', title: 'Target 1', subtitle: 'Very High Priority', color: 'red', coords: [80.08, 21.84] },
      { id: 'Target-2', title: 'Target 2', subtitle: 'High Priority', color: 'orange', coords: [79.98, 21.66] },
      { id: 'Target-3', title: 'Target 3', subtitle: 'High Priority', color: 'red', coords: [79.78, 21.83] },
      { id: 'Target-4', title: 'Target 4', subtitle: 'Medium Priority', color: 'orange', coords: [80.32, 21.56] },
    ];

    targetPins.forEach((pin) => {
      const isSelected = selectedTarget === pin.id || selectedTarget === pin.name;
      const container = document.createElement('div');
      container.className = 'flex flex-col items-center cursor-pointer group z-30 transition-transform hover:scale-105';

      // Callout card badge (dark glass card as seen in image)
      const callout = document.createElement('div');
      callout.className = `px-3 py-1.5 rounded-lg shadow-xl text-left border flex flex-col justify-center font-sans ${
        isSelected
          ? 'bg-[#0B192C]/95 border-amber-400 text-white ring-2 ring-amber-400/50 scale-105'
          : 'bg-[#0B192C]/90 border-slate-700 text-slate-100 hover:border-slate-500'
      }`;
      callout.innerHTML = `
        <div class="text-[11px] font-extrabold font-serif leading-tight">${pin.title}</div>
        <div class="text-[9px] font-bold text-slate-300 leading-tight">${pin.subtitle}</div>
      `;

      // Pin marker circle below callout
      const pinDot = document.createElement('div');
      pinDot.className = `w-4 h-4 rounded-full border-2 border-white shadow-lg mt-1 ${
        pin.color === 'red' ? 'bg-red-600' : 'bg-orange-500'
      }`;

      container.appendChild(callout);
      container.appendChild(pinDot);

      container.onclick = (e) => {
        e.stopPropagation();
        if (onMarkerClick) onMarkerClick(pin.id);
      };

      const m = new maplibregl.Marker({ element: container })
        .setLngLat(pin.coords as [number, number])
        .addTo(map.current!);

      markersRef.current.push(m);
    });

  }, [selectedTarget, onMarkerClick]);

  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();

  return (
    <div className="relative w-full h-full rounded-xl border border-slate-300 overflow-hidden shadow-md min-h-[520px]" style={{ height }}>
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full min-h-[520px] bg-slate-900" />

      {/* TOP LEFT: North Arrow Indicator (matching image top-left) */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-[#0B192C]/80 text-white border border-slate-700 p-2 rounded-lg shadow-lg flex flex-col items-center">
          <Compass className="w-5 h-5 text-amber-400 animate-pulse" />
          <span className="text-[9px] font-extrabold tracking-widest text-slate-200 mt-0.5">N</span>
        </div>
      </div>

      {/* TOP RIGHT: Floating Prospectivity Heatmap Legend Card (MATCHING IMAGE EXACTLY) */}
      <div className="absolute top-4 right-4 z-20 w-52 bg-[#0B192C]/90 text-white rounded-xl border border-slate-700/80 p-3.5 shadow-2xl backdrop-blur-md space-y-2 text-xs font-sans">
        <div className="font-extrabold font-serif text-amber-400 text-xs tracking-wide border-b border-slate-700 pb-1.5 flex items-center justify-between">
          <span>Prospectivity Index</span>
          <span className="text-[9px] font-mono text-slate-400">PU Score</span>
        </div>

        <div className="space-y-1.5 text-[11px] font-medium text-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#DC2626] border border-red-400 shrink-0" />
              <span>Very High</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">(0.8 – 1.0)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#F97316] border border-orange-400 shrink-0" />
              <span>High</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">(0.6 – 0.8)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#EAB308] border border-yellow-400 shrink-0" />
              <span>Medium</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">(0.4 – 0.6)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#10B981] border border-emerald-400 shrink-0" />
              <span>Low</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">(0.2 – 0.4)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#0284C7] border border-blue-400 shrink-0" />
              <span>Very Low</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">(0.0 – 0.2)</span>
          </div>
        </div>

        {/* Legend Map Symbols */}
        <div className="pt-2 border-t border-slate-700/80 space-y-1 text-[10px] text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-4 h-2.5 border-2 border-white rounded-xs shrink-0" />
            <span>AOI Boundary</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 border-t-2 border-dashed border-slate-200 shrink-0" />
            <span>Manganese Belt</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-white rounded-full border border-slate-900 shrink-0" />
            <span>Key Location</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 border-t border-slate-400 shrink-0" />
            <span>Roads</span>
          </div>
        </div>
      </div>

      {/* BOTTOM LEFT: Scale Bar (0  5  10  20 km) matching image bottom-left */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-[#0B192C]/80 text-white px-3 py-1 rounded-lg border border-slate-700 text-[10px] font-mono flex items-center gap-2 shadow-lg">
          <span>0</span>
          <span className="w-4 border-b border-white inline-block"></span>
          <span>5</span>
          <span className="w-4 border-b border-white inline-block"></span>
          <span>10</span>
          <span className="w-6 border-b border-white inline-block"></span>
          <span>20 km</span>
        </div>
      </div>

      {/* BOTTOM RIGHT: Map Control Buttons (+ / - / Layers) matching image bottom-right */}
      <div className="absolute bottom-4 right-4 flex flex-col items-center gap-1.5 z-20">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 bg-[#0B192C]/90 hover:bg-[#0B192C] text-white rounded-lg border border-slate-700 shadow-xl flex items-center justify-center transition font-bold"
          title="Zoom In"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>

        <button
          onClick={handleZoomOut}
          className="w-8 h-8 bg-[#0B192C]/90 hover:bg-[#0B192C] text-white rounded-lg border border-slate-700 shadow-xl flex items-center justify-center transition font-bold"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4 text-white" />
        </button>

        {/* Basemap Switcher Toggle */}
        <button
          onClick={() => setMapType(prev => prev === 'Satellite' ? 'Terrain' : 'Satellite')}
          className="w-8 h-8 bg-[#0B192C]/90 hover:bg-[#0B192C] text-amber-400 rounded-lg border border-slate-700 shadow-xl flex items-center justify-center transition"
          title={`Switch Basemap (Current: ${mapType})`}
        >
          <LayersIcon className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
