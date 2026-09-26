import React, { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  Layers, MapPin, Eye, EyeOff, Sliders, RotateCcw, 
  ShieldCheck, CheckCircle2, ChevronDown, ChevronRight, 
  Info, Database, Compass, Activity, ArrowRightLeft, Sparkles, 
  Filter, Search, ZoomIn, ZoomOut, AlertTriangle, FileText, Mountain, Trees, Droplet, Gauge, Award
} from 'lucide-react';
import { LayerStackVisualization, StackTier } from './LayerStackVisualization';
import { LocationEvidencePanel, LocationMetadata, DrillholeData } from './LocationEvidencePanel';

export interface SubsurfaceLayerItem {
  id: string;
  name: string;
  category: string;
  type: string;
  source: string;
  resolution: string;
  default_opacity: number;
  opacity: number;
  visible: boolean;
  provenance_type: 'OBSERVED' | 'MODEL_DERIVED' | 'SYNTHETIC_PROTOTYPE';
  fields: string[];
  description: string;
}

const PRESET_LOCATIONS = [
  { name: 'Balaghat Flagship Sector', state: 'Madhya Pradesh', lat: 21.8400, lon: 80.7200, zoom: 10.5 },
  { name: 'Ukwa Deep Extension', state: 'Madhya Pradesh', lat: 21.9200, lon: 80.4800, zoom: 11.2 },
  { name: 'Dongri Buzurg Opencast', state: 'Maharashtra', lat: 21.5400, lon: 79.7200, zoom: 11.0 },
  { name: 'Sandur Manganese Belt', state: 'Karnataka', lat: 15.0800, lon: 76.5500, zoom: 10.8 },
  { name: 'Keonjhar - Bonai Iron-Mn', state: 'Odisha', lat: 21.7500, lon: 85.3500, zoom: 10.5 }
];

export const SubsurfaceLayerIntelligence: React.FC = () => {
  // Layer Catalog State
  const [layers, setLayers] = useState<SubsurfaceLayerItem[]>([]);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [selectedLayerInfo, setSelectedLayerInfo] = useState<SubsurfaceLayerItem | null>(null);

  // Active Location & Coordinate State
  const [selectedCoord, setSelectedCoord] = useState<[number, number]>([80.7200, 21.8400]); // [lon, lat]
  const [inputLat, setInputLat] = useState<string>('21.8400');
  const [inputLon, setInputLon] = useState<string>('80.7200');

  // Subsurface Intelligence Data
  const [locationMeta, setLocationMeta] = useState<LocationMetadata | null>(null);
  const [layerStackTiers, setLayerStackTiers] = useState<StackTier[]>([]);
  const [drillholeData, setDrillholeData] = useState<DrillholeData | null>(null);
  const [overallProspectivityPct, setOverallProspectivityPct] = useState<number>(92.0);
  const [explorationReadiness, setExplorationReadiness] = useState<string>('DRILL_READY');
  const [activeTierId, setActiveTierId] = useState<string | null>('tier-prospectivity');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Right Panel Tab State: 'stack' | 'evidence'
  const [rightPanelTab, setRightPanelTab] = useState<'stack' | 'evidence'>('stack');

  // MapLibre Reference
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  // 1. Fetch Layers Catalog on Mount
  useEffect(() => {
    fetch('/api/geospatial/subsurface/layers')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.layers) {
          const initialized = data.layers.map((l: any) => ({
            ...l,
            opacity: l.default_opacity ?? 0.75,
            visible: ['sentinel2_rgb', 'bedrock_lithology', 'known_occurrences', 'prospectivity_model'].includes(l.id)
          }));
          setLayers(initialized);
        }
      })
      .catch((err) => console.warn('Could not load subsurface layers catalog:', err));
  }, []);

  // 2. Load Location Data for Coordinates
  const fetchLocationData = async (lat: number, lon: number) => {
    setIsLoading(true);
    try {
      // Parallel fetches for location, stack, and drillholes
      const [locRes, stackRes, dhRes] = await Promise.all([
        fetch(`/api/geospatial/subsurface/location?lat=${lat}&lon=${lon}`),
        fetch(`/api/geospatial/subsurface/layer-stack?lat=${lat}&lon=${lon}`),
        fetch(`/api/geospatial/subsurface/drillholes?lat=${lat}&lon=${lon}&radius_km=15`)
      ]);

      if (locRes.ok) {
        const loc = await locRes.json();
        setLocationMeta(loc);
      }

      if (stackRes.ok) {
        const stack = await stackRes.json();
        setLayerStackTiers(stack.stack_layers || []);
        setOverallProspectivityPct(stack.overall_prospectivity_pct || 50.0);
        setExplorationReadiness(stack.exploration_readiness || 'REGIONAL_RECONNAISSANCE');
      }

      if (dhRes.ok) {
        const dh = await dhRes.json();
        setDrillholeData(dh);
      }
    } catch (err) {
      console.warn('Error fetching subsurface location data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger initial fetch for default location
  useEffect(() => {
    fetchLocationData(selectedCoord[1], selectedCoord[0]);
  }, []);

  // 3. Initialize MapLibre GL JS Map
  useEffect(() => {
    if (mapInstanceRef.current || !mapContainerRef.current) return;

    // 100% Keyless, reliable OpenStreetMap raster base with dark scientific styling
    const keylessStyle: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'osm-tiles': {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors'
        }
      },
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: { 'background-color': '#060B19' }
        },
        {
          id: 'osm-layer',
          type: 'raster',
          source: 'osm-tiles',
          minzoom: 0,
          maxzoom: 19,
          paint: {
            'raster-opacity': 0.18,
            'raster-saturation': -0.92,
            'raster-contrast': 0.10
          }
        }
      ]
    };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: keylessStyle,
      center: [selectedCoord[0], selectedCoord[1]],
      zoom: 6.5,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    map.on('load', async () => {
      // 1. Add India Boundaries
      try {
        const boundRes = await fetch('/api/geospatial/boundaries/india');
        if (boundRes.ok) {
          const boundGeoJson = await boundRes.json();
          map.addSource('india-boundaries', { type: 'geojson', data: boundGeoJson });

          map.addLayer({
            id: 'india-boundaries-fill',
            type: 'fill',
            source: 'india-boundaries',
            paint: {
              'fill-color': '#0A132C',
              'fill-opacity': 0.45
            }
          });

          map.addLayer({
            id: 'india-boundaries-line',
            type: 'line',
            source: 'india-boundaries',
            paint: {
              'line-color': '#38BDF8',
              'line-width': 1.4,
              'line-opacity': 0.7
            }
          });
        }
      } catch (e) {
        console.warn('Could not load boundaries GeoJSON:', e);
      }

      // 2. Add Continuous Manganese Prospectivity GeoTIFF Raster Tiles
      map.addSource('prospectivity-raster', {
        type: 'raster',
        tiles: ['/api/geospatial/tiles/prospectivity/{z}/{x}/{y}.png'],
        tileSize: 256,
        bounds: [68.0, 8.0, 89.0, 35.0]
      });

      map.addLayer({
        id: 'prospectivity-raster-layer',
        type: 'raster',
        source: 'prospectivity-raster',
        paint: {
          'raster-opacity': 0.75,
          'raster-fade-duration': 0
        }
      });

      // 3. Add Known Manganese Occurrences
      try {
        const occRes = await fetch('/api/geospatial/occurrences/geojson');
        if (occRes.ok) {
          const occGeoJson = await occRes.json();
          map.addSource('manganese-occurrences', { type: 'geojson', data: occGeoJson });

          map.addLayer({
            id: 'manganese-occurrences-circle',
            type: 'circle',
            source: 'manganese-occurrences',
            paint: {
              'circle-radius': 5,
              'circle-color': '#06B6D4',
              'circle-stroke-width': 1.5,
              'circle-stroke-color': '#FFFFFF'
            }
          });
        }
      } catch (e) {}

      // 4. Add Exploration Targets
      try {
        const tgtRes = await fetch('/api/geospatial/targets/geojson');
        if (tgtRes.ok) {
          const tgtGeoJson = await tgtRes.json();
          map.addSource('exploration-targets', { type: 'geojson', data: tgtGeoJson });

          map.addLayer({
            id: 'exploration-targets-circle',
            type: 'circle',
            source: 'exploration-targets',
            paint: {
              'circle-radius': 8,
              'circle-color': '#EF4444',
              'circle-stroke-width': 2,
              'circle-stroke-color': '#FBBF24'
            }
          });
        }
      } catch (e) {}

      // 5. Initial Selection Pin
      updatePinOnMap(selectedCoord[0], selectedCoord[1]);
    });

    // 6. Map Click Handler
    map.on('click', (e) => {
      const lon = e.lngLat.lng;
      const lat = e.lngLat.lat;

      setSelectedCoord([lon, lat]);
      setInputLat(lat.toFixed(4));
      setInputLon(lon.toFixed(4));

      updatePinOnMap(lon, lat);
      fetchLocationData(lat, lon);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Pin Marker on Map
  const updatePinOnMap = (lon: number, lat: number) => {
    if (!mapInstanceRef.current) return;

    if (markerRef.current) {
      markerRef.current.setLngLat([lon, lat]);
    } else {
      const el = document.createElement('div');
      el.className = 'w-7 h-7 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400 border-2 border-white shadow-xl flex items-center justify-center text-xs animate-bounce cursor-pointer';
      el.innerHTML = '📍';

      markerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([lon, lat])
        .addTo(mapInstanceRef.current);
    }
  };

  // Jump to Preset Location
  const handleJumpToPreset = (preset: typeof PRESET_LOCATIONS[0]) => {
    setSelectedCoord([preset.lon, preset.lat]);
    setInputLat(preset.lat.toFixed(4));
    setInputLon(preset.lon.toFixed(4));

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [preset.lon, preset.lat],
        zoom: preset.zoom,
        essential: true
      });
      updatePinOnMap(preset.lon, preset.lat);
    }

    fetchLocationData(preset.lat, preset.lon);
  };

  // Manual Coordinate Submit
  const handleManualCoordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(inputLat);
    const lon = parseFloat(inputLon);

    if (isNaN(lat) || isNaN(lon)) return;

    setSelectedCoord([lon, lat]);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [lon, lat],
        zoom: 10.0,
        essential: true
      });
      updatePinOnMap(lon, lat);
    }

    fetchLocationData(lat, lon);
  };

  // Layer Controls Helpers
  const toggleLayerVisibility = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const nextVis = !l.visible;
          // Apply to MapLibre layer if present
          if (mapInstanceRef.current) {
            if (id === 'prospectivity_model' && mapInstanceRef.current.getLayer('prospectivity-raster-layer')) {
              mapInstanceRef.current.setLayoutProperty('prospectivity-raster-layer', 'visibility', nextVis ? 'visible' : 'none');
            }
            if (id === 'known_occurrences' && mapInstanceRef.current.getLayer('manganese-occurrences-circle')) {
              mapInstanceRef.current.setLayoutProperty('manganese-occurrences-circle', 'visibility', nextVis ? 'visible' : 'none');
            }
            if (id === 'exploration_targets' && mapInstanceRef.current.getLayer('exploration-targets-circle')) {
              mapInstanceRef.current.setLayoutProperty('exploration-targets-circle', 'visibility', nextVis ? 'visible' : 'none');
            }
            if (id === 'bedrock_lithology' && mapInstanceRef.current.getLayer('india-boundaries-fill')) {
              mapInstanceRef.current.setLayoutProperty('india-boundaries-fill', 'visibility', nextVis ? 'visible' : 'none');
            }
          }
          return { ...l, visible: nextVis };
        }
        return l;
      })
    );
  };

  const handleOpacityChange = (id: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          if (mapInstanceRef.current && id === 'prospectivity_model' && mapInstanceRef.current.getLayer('prospectivity-raster-layer')) {
            mapInstanceRef.current.setPaintProperty('prospectivity-raster-layer', 'raster-opacity', opacity);
          }
          return { ...l, opacity };
        }
        return l;
      })
    );
  };

  const toggleCategoryCollapse = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const categories = Array.from(new Set(layers.map((l) => l.category)));

  return (
    <div className="space-y-4">
      {/* ── TOP WORKSPACE HEADER & COORDINATE CONTROL BAR ───────────────────── */}
      <div className="bg-[#0B4F8A] rounded-2xl border border-slate-800 p-4 shadow-xl text-white space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#F28C28]/10 border border-[#F28C28]/30 text-[#F28C28]">
                <Layers className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold font-serif tracking-wide text-white">
                SUBSURFACE & ORE INTELLIGENCE
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#F28C28]/20 text-[#F28C28] border border-[#F28C28]/40">
                PRO LAYER STACK
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Inspect geological, terrain, geochemical, and modelled subsurface evidence beneath any location in India.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs">
            <span className="text-[11px] font-mono text-slate-400 mr-1 hidden sm:inline">Quick Jump:</span>
            {PRESET_LOCATIONS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleJumpToPreset(preset)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition border ${
                  locationMeta?.sector === preset.name
                    ? 'bg-[#F28C28] text-slate-950 font-bold border-[#F28C28]'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {preset.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Manual Coordinates Form & Map Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <form onSubmit={handleManualCoordSubmit} className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#F28C28]" />
              <span className="text-slate-400 font-mono text-[11px]">Pin Coordinates:</span>
            </div>

            <div className="flex items-center gap-1">
              <input
                type="number"
                step="0.0001"
                value={inputLat}
                onChange={(e) => setInputLat(e.target.value)}
                placeholder="Lat °N"
                className="w-24 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded font-mono text-xs text-white focus:outline-none focus:border-[#F28C28]"
              />
              <span className="text-slate-500">°N</span>
            </div>

            <div className="flex items-center gap-1">
              <input
                type="number"
                step="0.0001"
                value={inputLon}
                onChange={(e) => setInputLon(e.target.value)}
                placeholder="Lon °E"
                className="w-24 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded font-mono text-xs text-white focus:outline-none focus:border-[#F28C28]"
              />
              <span className="text-slate-500">°E</span>
            </div>

            <button
              type="submit"
              className="px-3 py-1 rounded bg-[#0B4F8A] hover:bg-[#111A38] border border-[#F28C28]/60 text-[#F28C28] font-bold text-xs transition"
            >
              Resolve Point
            </button>
          </form>

          <div className="flex items-center gap-2 self-end sm:self-auto text-[11px] font-mono text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Map Interaction: Click anywhere on map to drop pin</span>
          </div>
        </div>
      </div>

      {/* ── MAIN 3-COLUMN EXPLORATION WORKSPACE ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* ── LEFT COLUMN: GROUPED SPATIAL LAYER CONTROL (4 COLUMNS) ─────────── */}
        <div className="lg:col-span-4 bg-[#0B4F8A] border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[820px]">
          {/* Layer Control Header */}
          <div className="p-3 border-b border-slate-800 bg-[#083B67] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#F28C28]" />
              <span className="text-xs font-serif font-bold text-white uppercase tracking-wide">
                Spatial Layer Control
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px]">
              {layers.length} Layers Available
            </span>
          </div>

          {/* Layer Group Sections */}
          <div className="p-3 space-y-3 overflow-y-auto custom-scrollbar flex-1">
            {categories.map((cat) => {
              const groupLayers = layers.filter((l) => l.category === cat);
              const isCollapsed = collapsedCategories[cat];
              const visibleCount = groupLayers.filter((l) => l.visible).length;

              return (
                <div key={cat} className="border border-slate-800/90 rounded-xl overflow-hidden bg-slate-950/40">
                  {/* Category Header Bar */}
                  <div
                    onClick={() => toggleCategoryCollapse(cat)}
                    className="p-2.5 bg-slate-900/80 hover:bg-slate-900 cursor-pointer flex items-center justify-between text-xs transition"
                  >
                    <div className="flex items-center gap-2 font-mono text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                      {cat}
                      <span className="text-slate-500 text-[10px]">
                        ({visibleCount}/{groupLayers.length})
                      </span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
                  </div>

                  {/* Category Layer Items */}
                  {!isCollapsed && (
                    <div className="p-2 space-y-2 border-t border-slate-800/60 bg-slate-950/30">
                      {groupLayers.map((layer) => (
                        <div
                          key={layer.id}
                          className={`p-2.5 rounded-lg border transition ${
                            layer.visible
                              ? 'bg-slate-900/90 border-slate-700'
                              : 'bg-slate-950/60 border-slate-900 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <button
                                onClick={() => toggleLayerVisibility(layer.id)}
                                className={`p-1 rounded transition ${
                                  layer.visible ? 'text-[#F28C28] bg-[#F28C28]/10' : 'text-slate-600 hover:text-slate-400'
                                }`}
                              >
                                {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>
                              <div className="min-w-0">
                                <span className="text-xs font-semibold text-white truncate block">
                                  {layer.name}
                                </span>
                                <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400">
                                  <span className="px-1 py-0.2 rounded bg-slate-800 text-slate-300">
                                    {layer.type}
                                  </span>
                                  <span>{layer.resolution}</span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => setSelectedLayerInfo(layer)}
                              className="p-1 text-slate-500 hover:text-white transition"
                              title="Layer Metadata"
                            >
                              <Info className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Opacity Slider */}
                          {layer.visible && (
                            <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center gap-2 text-[10px] font-mono">
                              <span className="text-slate-500">Opacity:</span>
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={layer.opacity}
                                onChange={(e) => handleOpacityChange(layer.id, parseFloat(e.target.value))}
                                className="w-full accent-[#F28C28] cursor-pointer h-1 bg-slate-800 rounded"
                              />
                              <span className="w-8 text-right font-bold text-[#F28C28]">
                                {Math.round(layer.opacity * 100)}%
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CENTER COLUMN: INTERACTIVE MAPLIBRE GIS MAP (4 COLUMNS) ─────────── */}
        <div className="lg:col-span-4 bg-[#0B4F8A] border border-slate-800 rounded-2xl shadow-xl overflow-hidden relative">
          {/* Map Top Bar */}
          <div className="p-3 border-b border-slate-800 bg-[#083B67] flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-2 font-mono">
              <MapPin className="w-4 h-4 text-[#F28C28]" />
              <span className="font-bold text-white truncate max-w-[200px]">
                {locationMeta ? locationMeta.sector : 'National Map'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.zoomIn();
                  }
                }}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.zoomOut();
                  }
                }}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo({ center: [78.5, 22.0], zoom: 4.5 });
                  }
                }}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-[#F28C28]"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Map Canvas Container */}
          <div
            ref={mapContainerRef}
            className="w-full h-[760px] bg-[#060B19] cursor-crosshair relative"
          />

          {/* In-Map Floating Coordinates HUD */}
          <div className="absolute top-14 left-3 z-10 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl shadow-lg text-[11px] font-mono text-slate-300 pointer-events-none">
            <div className="text-white font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              <span>ACTIVE PIN</span>
            </div>
            <div className="text-slate-400 mt-1">
              Lat: {selectedCoord[1].toFixed(4)}° N • Lon: {selectedCoord[0].toFixed(4)}° E
            </div>
            {locationMeta && (
              <div className="text-[#F28C28] font-bold text-[10px] mt-0.5">
                {locationMeta.district}, {locationMeta.state}
              </div>
            )}
          </div>

          {/* Map Bottom Legend */}
          <div className="absolute bottom-3 left-3 right-3 z-10 bg-slate-950/90 border border-slate-800 p-2 rounded-xl text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Targets
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" /> Occurrences
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-orange-500/80" /> Heatmap
              </span>
            </div>
            <span>EPSG:4326</span>
          </div>
        </div>

        {/* ── RIGHT COLUMN: EVIDENCE PANEL & VERTICAL LAYER STACK (4 COLUMNS) ── */}
        <div className="lg:col-span-4 bg-[#0B4F8A] border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[820px]">
          {/* Sub-Tab Navigation Header */}
          <div className="p-2 border-b border-slate-800 bg-[#083B67] flex items-center justify-between">
            <div className="flex items-center gap-1 w-full">
              <button
                onClick={() => setRightPanelTab('stack')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  rightPanelTab === 'stack'
                    ? 'bg-[#0B4F8A] text-[#F28C28] shadow border border-[#F28C28]/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Layer Stack</span>
              </button>

              <button
                onClick={() => setRightPanelTab('evidence')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  rightPanelTab === 'evidence'
                    ? 'bg-[#0B4F8A] text-[#F28C28] shadow border border-[#F28C28]/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Location & Assays</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-3 overflow-y-auto custom-scrollbar flex-1">
            {rightPanelTab === 'stack' ? (
              <LayerStackVisualization
                tiers={layerStackTiers}
                activeTierId={activeTierId}
                onSelectTier={(tierId) => setActiveTierId(tierId)}
                isLoading={isLoading}
                selectedLocationName={locationMeta?.sector}
              />
            ) : locationMeta ? (
              <LocationEvidencePanel
                location={locationMeta}
                drillholeData={drillholeData}
                overallProspectivityPct={overallProspectivityPct}
                explorationReadiness={explorationReadiness}
                onOpenTarget={(tgtId) => {
                  alert(`Opening Target ${tgtId} Dossier`);
                }}
              />
            ) : (
              <div className="text-center py-10 text-slate-500 font-mono text-xs">
                Click anywhere on the map to inspect evidence.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MODAL: LAYER METADATA INSPECTOR ─────────────────────────────────── */}
      {selectedLayerInfo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B4F8A] border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#F28C28]" />
                <h3 className="font-bold text-sm font-serif">{selectedLayerInfo.name}</h3>
              </div>
              <button
                onClick={() => setSelectedLayerInfo(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedLayerInfo.description}
            </p>

            <div className="space-y-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-500">CATEGORY:</span>
                <span className="font-bold text-white">{selectedLayerInfo.category}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-500">DATA TYPE:</span>
                <span className="font-bold text-white">{selectedLayerInfo.type}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-500">DATA SOURCE:</span>
                <span className="font-bold text-white truncate max-w-[200px]">{selectedLayerInfo.source}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-500">RESOLUTION:</span>
                <span className="font-bold text-white">{selectedLayerInfo.resolution}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-500">PROVENANCE:</span>
                <span className="font-bold text-emerald-400">{selectedLayerInfo.provenance_type}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedLayerInfo(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
            >
              Close Metadata
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
