import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Plus, Minus, Layers as LayersIcon, Search, Compass, Target } from 'lucide-react';

interface MapProps {
  initialCenter?: [number, number]; // [lng, lat]
  initialZoom?: number;
  height?: string;
  activeLayers?: Record<string, boolean>;
  selectedTarget?: string;
  onMarkerClick?: (targetId: string) => void;
}

const TARGET_COORDINATES: Record<string, [number, number]> = {
  'Target-1': [79.82, 21.78],
  'Target-2': [79.92, 21.68],
  'Target-3': [79.72, 21.72],
  'Target-4': [80.12, 21.62],
  'Target-5': [80.02, 21.75],
};

const MAP_TILES = {
  Terrain: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
  Satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  Map: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
};

export const Map: React.FC<MapProps> = ({
  initialCenter = [79.86, 21.70], // Centered around Bhandara / Nagpur Extension Belt
  initialZoom = 9.6,
  height = '100%',
  activeLayers = {
    cem: true,
    sentinel2: false,
    dem: false,
    geology: false,
    occurrences: false,
    lineaments: false,
  },
  selectedTarget = 'Target-2',
  onMarkerClick
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const [mapType, setMapType] = useState<'Map' | 'Satellite' | 'Terrain'>('Terrain');
  const [searchLocation, setSearchLocation] = useState('bhandara');

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const style: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'base-raster-tiles': {
          type: 'raster',
          tiles: [MAP_TILES[mapType]],
          tileSize: 256,
          attribution: 'Esri, USGS, CartoDB'
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

      // 1. Exploration AOI Outer Boundary (Dashed White Polygon as seen in Screenshot)
      map.current.addSource('aoi-boundary', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { name: 'Exploration AOI' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [79.62, 21.58],
                  [79.80, 21.82],
                  [80.18, 21.76],
                  [80.12, 21.54],
                  [79.88, 21.50],
                  [79.62, 21.58]
                ]]
              }
            }
          ]
        }
      });

      map.current.addLayer({
        id: 'aoi-boundary-line',
        type: 'line',
        source: 'aoi-boundary',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 2.5,
          'line-dasharray': [4, 3]
        }
      });

      // 2. Target Corridor Polygon (Yellow Translucent Shaded Region)
      map.current.addSource('target-corridor', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { name: 'Target Corridor' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [79.66, 21.60],
                  [80.14, 21.74],
                  [80.08, 21.64],
                  [79.68, 21.56],
                  [79.66, 21.60]
                ]]
              }
            }
          ]
        }
      });

      map.current.addLayer({
        id: 'target-corridor-fill',
        type: 'fill',
        source: 'target-corridor',
        paint: {
          'fill-color': '#EAB308',
          'fill-opacity': 0.45
        }
      });

      map.current.addLayer({
        id: 'target-corridor-outline',
        type: 'line',
        source: 'target-corridor',
        paint: {
          'line-color': '#CA8A04',
          'line-width': 1.5,
          'line-dasharray': [2, 2]
        }
      });

      // 3. Red Target Bounding Boxes (Target 1 & Target 2)
      map.current.addSource('target-red-boxes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { targetId: 'Target-1', name: 'Target 1' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [79.67, 21.69],
                  [79.74, 21.69],
                  [79.74, 21.74],
                  [79.67, 21.74],
                  [79.67, 21.69]
                ]]
              }
            },
            {
              type: 'Feature',
              properties: { targetId: 'Target-2', name: 'Target 2' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [80.04, 21.65],
                  [80.11, 21.65],
                  [80.11, 21.70],
                  [80.04, 21.70],
                  [80.04, 21.65]
                ]]
              }
            }
          ]
        }
      });

      map.current.addLayer({
        id: 'target-red-boxes-fill',
        type: 'fill',
        source: 'target-red-boxes',
        paint: {
          'fill-color': '#DC2626',
          'fill-opacity': 0.75
        }
      });

      map.current.addLayer({
        id: 'target-red-boxes-line',
        type: 'line',
        source: 'target-red-boxes',
        paint: {
          'line-color': '#991B1B',
          'line-width': 2
        }
      });

      // 4. Orange Anomaly Squares (Positive / CEM Anomaly Points)
      map.current.addSource('orange-anomaly-squares', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { name: 'Anomaly Zone A' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [79.78, 21.58],
                  [79.83, 21.58],
                  [79.83, 21.62],
                  [79.78, 21.62],
                  [79.78, 21.58]
                ]]
              }
            },
            {
              type: 'Feature',
              properties: { name: 'Anomaly Zone B' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [79.94, 21.55],
                  [79.99, 21.55],
                  [79.99, 21.59],
                  [79.94, 21.59],
                  [79.94, 21.55]
                ]]
              }
            }
          ]
        }
      });

      map.current.addLayer({
        id: 'orange-anomaly-fill',
        type: 'fill',
        source: 'orange-anomaly-squares',
        paint: {
          'fill-color': '#EA580C',
          'fill-opacity': 0.85
        }
      });

      // 5. CEM Spectral Anomaly Overlay
      map.current.addSource('cem-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { cem_score: 0.88 },
              geometry: {
                type: 'Polygon',
                coordinates: [[[79.75, 21.62], [80.05, 21.72], [79.95, 21.65], [79.75, 21.62]]]
              }
            }
          ]
        }
      });
      map.current.addLayer({
        id: 'cem-fill',
        type: 'fill',
        source: 'cem-source',
        paint: {
          'fill-color': '#06B6D4',
          'fill-opacity': 0.35
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

  // Smooth fly to when selectedTarget changes
  useEffect(() => {
    if (!map.current) return;
    const targetCoords = TARGET_COORDINATES[selectedTarget];
    if (targetCoords) {
      map.current.flyTo({
        center: targetCoords,
        zoom: 10.4,
        speed: 1.2,
        curve: 1.4,
        essential: true,
      });
    }
  }, [selectedTarget]);

  // Toggle layer visibility
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const layerMap: Record<string, string> = {
      cem: 'cem-fill',
    };

    Object.entries(layerMap).forEach(([key, layerId]) => {
      if (map.current?.getLayer(layerId)) {
        const isVisible = activeLayers[key] !== false;
        map.current.setLayoutProperty(
          layerId,
          'visibility',
          isVisible ? 'visible' : 'none'
        );
      }
    });

    // Re-render markers for key targets
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const targetPins = [
      { id: 'Target-1', name: 'Target 1', label: 'Very High', coords: [79.70, 21.71] },
      { id: 'Target-2', name: 'Target 2', label: 'High', coords: [80.07, 21.67] },
    ];

    targetPins.forEach((pin) => {
      const isSelected = selectedTarget === pin.id;
      const container = document.createElement('div');
      container.className = 'flex flex-col items-center cursor-pointer group z-30';

      const labelDiv = document.createElement('div');
      labelDiv.className = `px-2 py-0.5 rounded shadow-lg text-[10px] font-extrabold flex items-center gap-1 transition-all ${
        isSelected
          ? 'bg-[#003366] text-white ring-2 ring-amber-400 scale-105'
          : 'bg-slate-900/90 text-white hover:scale-105'
      }`;
      labelDiv.innerHTML = `
        <span class="w-2 h-2 rounded-full ${pin.id === 'Target-1' ? 'bg-red-600' : 'bg-amber-500'}"></span>
        <span class="font-bold">${pin.name}</span>
      `;

      container.appendChild(labelDiv);

      container.onclick = () => {
        if (onMarkerClick) onMarkerClick(pin.id);
      };

      const m = new maplibregl.Marker({ element: container })
        .setLngLat(pin.coords as [number, number])
        .addTo(map.current!);

      markersRef.current.push(m);
    });

  }, [activeLayers, selectedTarget, onMarkerClick]);

  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();
  const handleResetZoom = () => {
    map.current?.flyTo({ center: initialCenter, zoom: initialZoom });
  };

  return (
    <div className="relative w-full h-full rounded-xl border border-slate-300 overflow-hidden shadow-sm min-h-[500px]" style={{ height }}>
      {/* Mapbox / Maplibre Container */}
      <div ref={mapContainer} className="w-full h-full min-h-[500px] bg-slate-900" />

      {/* Top Left Search Input Overlay: q bhandara */}
      <div className="absolute top-4 left-4 z-20 w-64 md:w-72">
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-300 shadow-md text-xs text-slate-800">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-400 font-medium"
          />
        </div>
      </div>

      {/* Top Right Map Type Switcher Overlay (Map | Satellite | Terrain) */}
      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center bg-white p-0.5 rounded-md border border-slate-300 shadow-md text-xs font-bold">
          {(['Map', 'Satellite', 'Terrain'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setMapType(type)}
              className={`px-3 py-1 rounded transition text-xs ${
                mapType === type
                  ? 'bg-[#003366] text-white font-extrabold shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Right Side Floating Map Controls (+ / - / Layers / Target) */}
      <div className="absolute top-16 right-4 flex flex-col items-center gap-1 z-20">
        <button
          onClick={handleZoomIn}
          className="w-7 h-7 bg-white hover:bg-slate-100 text-slate-800 rounded border border-slate-300 shadow-md flex items-center justify-center transition font-bold"
          title="Zoom In"
        >
          <Plus className="w-3.5 h-3.5 text-slate-700" />
        </button>

        <button
          onClick={handleZoomOut}
          className="w-7 h-7 bg-white hover:bg-slate-100 text-slate-800 rounded border border-slate-300 shadow-md flex items-center justify-center transition font-bold"
          title="Zoom Out"
        >
          <Minus className="w-3.5 h-3.5 text-slate-700" />
        </button>

        <button
          onClick={handleResetZoom}
          className="w-7 h-7 bg-white hover:bg-slate-100 text-slate-800 rounded border border-slate-300 shadow-md flex items-center justify-center transition"
          title="Reset View"
        >
          <Compass className="w-3.5 h-3.5 text-[#003366]" />
        </button>

        <button
          onClick={handleResetZoom}
          className="w-7 h-7 bg-white hover:bg-slate-100 text-slate-800 rounded border border-slate-300 shadow-md flex items-center justify-center transition"
          title="Layers"
        >
          <LayersIcon className="w-3.5 h-3.5 text-[#003366]" />
        </button>
      </div>

      {/* Bottom Left: North Arrow & Scale Bar */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 z-20">
        <div className="bg-white/95 p-1.5 rounded border border-slate-300 text-[#003366] flex flex-col items-center shadow-md">
          <Compass className="w-4 h-4 text-[#003366]" />
          <span className="text-[8px] font-black tracking-widest mt-0.5">N</span>
        </div>

        <div className="bg-white/95 px-2.5 py-1 rounded border border-slate-300 text-[10px] text-slate-800 font-mono flex items-center gap-2 shadow-md">
          <span>0</span>
          <span className="w-4 border-b border-slate-700 inline-block"></span>
          <span>5</span>
          <span className="w-4 border-b border-slate-700 inline-block"></span>
          <span>10</span>
          <span className="w-6 border-b border-slate-700 inline-block"></span>
          <span>20 km</span>
        </div>
      </div>

      {/* Bottom Right: Lat/Lng Coordinates Badge */}
      <div className="absolute bottom-3 right-3 z-20">
        <div className="bg-[#003366]/90 text-white px-2.5 py-1 rounded text-[10px] font-mono font-bold shadow-md">
          21.48° N, 80.12° E
        </div>
      </div>
    </div>
  );
};
