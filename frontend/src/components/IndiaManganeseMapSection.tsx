import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  Globe, MapPin, Layers, Target, Search, ChevronRight, ShieldCheck, 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, BarChart3, Database, Compass, Info, RefreshCw, ZoomIn, ZoomOut
} from 'lucide-react';
import { MapInspectionDrawer, InspectionData } from './MapInspectionDrawer';

export interface IndiaSite {
  id: string;
  site_code: string;
  name: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  type: string;
  status: string;
  occurrences_count: number;
  targets_count: number;
  drillholes_count: number;
  geochem_samples_count: number;
  measured_mn_wt_pct: number;
  estimated_mn_wt_pct: number;
  prospectivity_pct: number;
  confidence_pct: number;
  applicability: string;
  description: string;
}

export interface TargetDetail {
  target_id: string;
  mn_target_code: string;
  name: string;
  site_id: string;
  site_name: string;
  state: string;
  latitude: number;
  longitude: number;
  prospectivity_score: number;
  prospectivity_pct: number;
  confidence_pct: number;
  applicability: string;
  priority_level: string;
  status: string;
  manganese_status: {
    measured_mn_wt_pct: number | null;
    estimated_mn_wt_pct: number | null;
    sample_count: number;
    assay_method: string;
    nearest_occurrence: string;
  };
  why_predicted_shap: Array<{
    factor: string;
    weight_pct: number;
    direction: string;
    detail: string;
  }>;
  evidence_cards: Array<{
    category: string;
    title: string;
    description: string;
  }>;
  nearby_drillholes: Array<{
    hole_id: string;
    depth_m: number;
    mn_intercept_pct: number;
    status: string;
    dist_m: number;
  }>;
  recommended_action: string;
}

const DEFAULT_SITES: IndiaSite[] = [
  {
    id: 'site-balaghat',
    site_code: 'SITE-MP-BAL',
    name: 'Balaghat Sausar Belt',
    state: 'Madhya Pradesh',
    district: 'Balaghat',
    latitude: 21.84,
    longitude: 80.72,
    type: 'UNDERGROUND_MINE_COMPLEX',
    status: 'PRODUCING_MINE',
    occurrences_count: 18,
    targets_count: 5,
    drillholes_count: 24,
    geochem_samples_count: 50,
    measured_mn_wt_pct: 34.8,
    estimated_mn_wt_pct: 31.2,
    prospectivity_pct: 92.0,
    confidence_pct: 86.0,
    applicability: 'HIGH',
    description: "Asia's premier underground manganese ore deposit in Precambrian Sausar Mobile Belt Mansar Formation quartzites."
  },
  {
    id: 'site-ukwa',
    site_code: 'SITE-MP-UKW',
    name: 'Ukwa Deep Extension Sector',
    state: 'Madhya Pradesh',
    district: 'Balaghat',
    latitude: 21.92,
    longitude: 80.48,
    type: 'UNDERGROUND_MINE',
    status: 'PRODUCING_MINE',
    occurrences_count: 8,
    targets_count: 3,
    drillholes_count: 14,
    geochem_samples_count: 22,
    measured_mn_wt_pct: 32.1,
    estimated_mn_wt_pct: 29.5,
    prospectivity_pct: 87.0,
    confidence_pct: 84.0,
    applicability: 'HIGH',
    description: 'High-grade gonditic manganese ore horizon bounded by synclinal shear folds.'
  },
  {
    id: 'site-dongri',
    site_code: 'SITE-MH-DNG',
    name: 'Dongri Buzurg Opencast Sector',
    state: 'Maharashtra',
    district: 'Bhandara',
    latitude: 21.54,
    longitude: 79.72,
    type: 'OPENCAST_MINE',
    status: 'PRODUCING_MINE',
    occurrences_count: 12,
    targets_count: 4,
    drillholes_count: 18,
    geochem_samples_count: 35,
    measured_mn_wt_pct: 36.4,
    estimated_mn_wt_pct: 33.8,
    prospectivity_pct: 89.0,
    confidence_pct: 85.0,
    applicability: 'HIGH',
    description: 'Renowned for high-grade battery oxide manganese deposits and active opencast benching.'
  },
  {
    id: 'site-chikla',
    site_code: 'SITE-MH-CHK',
    name: 'Chikla - Mansar Belt',
    state: 'Maharashtra',
    district: 'Bhandara / Nagpur',
    latitude: 21.46,
    longitude: 79.65,
    type: 'UNDERGROUND_MINE',
    status: 'PRODUCING_MINE',
    occurrences_count: 6,
    targets_count: 2,
    drillholes_count: 10,
    geochem_samples_count: 16,
    measured_mn_wt_pct: 30.5,
    estimated_mn_wt_pct: 28.0,
    prospectivity_pct: 78.0,
    confidence_pct: 80.0,
    applicability: 'HIGH',
    description: 'Underground mining sector targeting concordant manganese ore lenses.'
  },
  {
    id: 'site-keonjhar',
    site_code: 'SITE-OR-KNJ',
    name: 'Keonjhar - Bonai Iron-Mn Belt',
    state: 'Odisha',
    district: 'Keonjhar',
    latitude: 21.80,
    longitude: 85.30,
    type: 'DEPOSIT_FIELD',
    status: 'EXPLORATION_STAGE',
    occurrences_count: 14,
    targets_count: 4,
    drillholes_count: 12,
    geochem_samples_count: 28,
    measured_mn_wt_pct: 27.2,
    estimated_mn_wt_pct: 25.0,
    prospectivity_pct: 81.0,
    confidence_pct: 75.0,
    applicability: 'MEDIUM',
    description: 'Supergene enriched manganese oxide lenses within Iron Ore Group BHJ formations.'
  },
  {
    id: 'site-sandur',
    site_code: 'SITE-KA-SND',
    name: 'Sandur Manganese Belt',
    state: 'Karnataka',
    district: 'Ballari',
    latitude: 15.08,
    longitude: 76.55,
    type: 'DEPOSIT_FIELD',
    status: 'EXPLORATION_STAGE',
    occurrences_count: 10,
    targets_count: 3,
    drillholes_count: 8,
    geochem_samples_count: 20,
    measured_mn_wt_pct: 26.8,
    estimated_mn_wt_pct: 24.2,
    prospectivity_pct: 76.0,
    confidence_pct: 72.0,
    applicability: 'MEDIUM',
    description: 'Dharwar Craton metasedimentary manganese oxide deposits.'
  }
];

export const IndiaManganeseMapSection: React.FC = () => {
  const navigate = useNavigate();
  const [sites, setSites] = useState<IndiaSite[]>(DEFAULT_SITES);
  
  // Hierarchy Level State: 1 = NATIONAL, 2 = REGIONAL, 3 = TARGET
  const [hierarchyLevel, setHierarchyLevel] = useState<1 | 2 | 3>(1);
  const [selectedSite, setSelectedSite] = useState<IndiaSite | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [targetDetail, setTargetDetail] = useState<TargetDetail | null>(null);

  // Map Click Inspection Drawer State
  const [inspectionData, setInspectionData] = useState<InspectionData | null>(null);
  const [isInspectLoading, setIsInspectLoading] = useState<boolean>(false);

  // Search & Layer Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mapLayerFilters, setMapLayerFilters] = useState<Record<string, boolean>>({
    occurrences: true,
    prospectivity: true,
    targets: true,
    boundaries: true
  });

  // MapLibre Reference
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const clickPinRef = useRef<maplibregl.Marker | null>(null);

  // Fetch Sites from Backend
  useEffect(() => {
    fetch('/api/india-map/sites')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.sites && Array.isArray(data.sites) && data.sites.length > 0) {
          setSites(data.sites);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch Target Detail when Target is Selected
  useEffect(() => {
    if (selectedTargetId) {
      fetch(`/api/india-map/targets/${selectedTargetId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setTargetDetail(data);
        })
        .catch(() => {});
    }
  }, [selectedTargetId]);

  // ── INITIALIZE KEYLESS MAPLIBRE GL GIS ENGINE (NO CARTO / NO API KEYS) ─────
  useEffect(() => {
    if (mapInstanceRef.current || !mapContainerRef.current) return;

    // 100% Keyless, reliable OpenStreetMap raster base with dark scientific styling
    const keylessStyle: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'osm-tiles': {
          type: 'raster',
          tiles: [
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors'
        }
      },
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: {
            'background-color': '#060B19'
          }
        },
        {
          id: 'osm-layer',
          type: 'raster',
          source: 'osm-tiles',
          minzoom: 0,
          maxzoom: 19,
          paint: {
            'raster-opacity': 0.16,
            'raster-saturation': -0.92,
            'raster-contrast': 0.10
          }
        }
      ]
    };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: keylessStyle,
      center: [78.5, 22.0], // Centered over India
      zoom: 4.4,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    map.on('load', async () => {
      // 1. Add India & State Vector Boundaries Layer (BASE LAYER)
      try {
        const boundRes = await fetch('/api/geospatial/boundaries/india');
        if (boundRes.ok) {
          const boundGeoJson = await boundRes.json();
          map.addSource('india-boundaries', { type: 'geojson', data: boundGeoJson });

          // Land fill
          map.addLayer({
            id: 'india-boundaries-fill',
            type: 'fill',
            source: 'india-boundaries',
            paint: {
              'fill-color': '#0A132C',
              'fill-opacity': 0.50
            }
          });
        }
      } catch (e) {
        console.warn('Could not load boundaries GeoJSON:', e);
      }

      // 2. Add Continuous Manganese Prospectivity GeoTIFF Raster Tiles Layer (PROSPECTIVITY RASTER)
      map.addSource('prospectivity-raster', {
        type: 'raster',
        tiles: [
          '/api/geospatial/tiles/prospectivity/{z}/{x}/{y}.png'
        ],
        tileSize: 256,
        bounds: [68.0, 8.0, 89.0, 35.0]
      });

      map.addLayer({
        id: 'prospectivity-raster-layer',
        type: 'raster',
        source: 'prospectivity-raster',
        paint: {
          'raster-opacity': 0.74,
          'raster-fade-duration': 0
        }
      });

      // 3. Add Boundaries Line on Top of Heatmap
      if (map.getSource('india-boundaries')) {
        map.addLayer({
          id: 'india-boundaries-line',
          type: 'line',
          source: 'india-boundaries',
          paint: {
            'line-color': '#94A3B8',
            'line-width': 1.6
          }
        });
      }

      // 4. Add Known Manganese Occurrences Point Layer
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
      } catch (e) {
        console.warn('Could not load occurrences GeoJSON:', e);
      }

      // 5. MAP CLICK EVENT LISTENER FOR REAL GIS POINT INSPECTION
      map.on('click', async (e) => {
        const lng = e.lngLat.lng;
        const lat = e.lngLat.lat;

        // Place custom glowing location pin
        if (clickPinRef.current) {
          clickPinRef.current.remove();
        }

        const pinDiv = document.createElement('div');
        pinDiv.className = 'flex flex-col items-center cursor-pointer z-40 animate-pulse';
        pinDiv.innerHTML = `
          <div class="bg-amber-400 text-slate-950 font-mono font-black px-2 py-0.5 rounded text-[10px] shadow-lg border border-amber-300">
            📍 (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)
          </div>
          <div class="w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-950 shadow-2xl mt-0.5"></div>
        `;

        clickPinRef.current = new maplibregl.Marker({ element: pinDiv })
          .setLngLat([lng, lat])
          .addTo(map);

        // Fetch backend point query result
        setIsInspectLoading(true);
        try {
          const queryRes = await fetch(`/api/geospatial/query?lat=${lat}&lon=${lng}`);
          if (queryRes.ok) {
            const queryData = await queryRes.json();
            setInspectionData(queryData);
          }
        } catch (err) {
          console.error('Spatial point query error:', err);
        } finally {
          setIsInspectLoading(false);
        }
      });
    });

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // ── UPDATE TARGET & SITE MARKERS ON MAP ────────────────────────────────────
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add Target Pins if targets layer active
    if (mapLayerFilters.targets) {
      const targetPins = [
        { id: 'T001', code: 'MN-BAL-001', name: 'Target T001 (Balaghat)', coords: [80.72, 21.84], score: '92%', rank: '#1', color: 'bg-red-600' },
        { id: 'T003', code: 'MN-UKW-003', name: 'Target T003 (Tirodi)', coords: [79.82, 21.91], score: '87%', rank: '#2', color: 'bg-red-600' },
        { id: 'T002', code: 'MN-DNG-002', name: 'Target T002 (Dongri)', coords: [79.92, 21.68], score: '76%', rank: '#3', color: 'bg-amber-500' },
        { id: 'T004', code: 'MN-KNJ-004', name: 'Target T004 (Keonjhar)', coords: [85.30, 21.80], score: '81%', rank: '#4', color: 'bg-red-500' },
        { id: 'T005', code: 'MN-SND-005', name: 'Target T005 (Sandur)', coords: [76.55, 15.08], score: '76%', rank: '#5', color: 'bg-amber-400' },
        { id: 'T006', code: 'MN-SGB-006', name: 'Target T006 (Singhbhum)', coords: [85.75, 22.35], score: '73%', rank: '#6', color: 'bg-emerald-500' }
      ];

      targetPins.forEach((pin) => {
        const isSelected = selectedTargetId === pin.id;

        const container = document.createElement('div');
        container.className = 'flex flex-col items-center cursor-pointer group z-30 transition-all duration-200';

        const badgeDiv = document.createElement('div');
        badgeDiv.className = `px-2 py-1 rounded-md shadow-2xl text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all ${
          isSelected
            ? 'bg-[#0A1128] text-white ring-2 ring-[#C5A059] scale-110 shadow-amber-500/50'
            : 'bg-[#070D1E]/90 text-white border border-slate-700 hover:scale-105'
        }`;
        badgeDiv.innerHTML = `
          <span class="w-2 h-2 rounded-full ${pin.color}"></span>
          <span>${pin.code}</span>
          <span class="text-amber-300 font-extrabold">${pin.score}</span>
        `;

        const pinDot = document.createElement('div');
        pinDot.className = `w-4 h-4 rounded-full ${pin.color} border-2 border-white shadow-xl mt-0.5 ${
          isSelected ? 'ring-4 ring-amber-400 scale-125' : ''
        }`;

        container.appendChild(badgeDiv);
        container.appendChild(pinDot);

        container.onclick = (e) => {
          e.stopPropagation();
          handleSelectTarget(pin.id);
        };

        const m = new maplibregl.Marker({ element: container })
          .setLngLat(pin.coords as [number, number])
          .addTo(map);

        markersRef.current.push(m);
      });
    }

    // Toggle visibility of map layers
    if (map.getLayer('prospectivity-raster-layer')) {
      map.setLayoutProperty('prospectivity-raster-layer', 'visibility', mapLayerFilters.prospectivity ? 'visible' : 'none');
    }
    if (map.getLayer('manganese-occurrences-circle')) {
      map.setLayoutProperty('manganese-occurrences-circle', 'visibility', mapLayerFilters.occurrences ? 'visible' : 'none');
    }
    if (map.getLayer('india-boundaries-line')) {
      map.setLayoutProperty('india-boundaries-line', 'visibility', mapLayerFilters.boundaries ? 'visible' : 'none');
    }
  }, [mapLayerFilters, selectedTargetId]);

  // ── HANDLE MAP DRILL-DOWN & FLY-TO ─────────────────────────────────────────
  const handleSelectSite = (site: IndiaSite) => {
    setSelectedSite(site);
    setHierarchyLevel(2);
    setSelectedTargetId('T001');

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [site.longitude, site.latitude],
        zoom: 9.8,
        speed: 1.2,
        curve: 1.4,
        essential: true
      });
    }
  };

  const handleSelectTarget = (targetId: string) => {
    setSelectedTargetId(targetId);
    setHierarchyLevel(3);

    const targetCoordsMap: Record<string, [number, number]> = {
      'T001': [80.72, 21.84],
      'T002': [79.92, 21.68],
      'T003': [79.82, 21.91],
      'T004': [85.30, 21.80],
      'T005': [76.55, 15.08],
      'T006': [85.75, 22.35]
    };

    const coords = targetCoordsMap[targetId];
    if (coords && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: coords,
        zoom: 11.5,
        speed: 1.2,
        curve: 1.4,
        essential: true
      });
    }

    // Trigger point query for target location
    if (coords) {
      fetch(`/api/geospatial/query?lat=${coords[1]}&lon=${coords[0]}`)
        .then((res) => res.ok ? res.json() : null)
        .then((data) => {
          if (data) setInspectionData(data);
        })
        .catch(() => {});
    }
  };

  const handleFlyToIndiaLevel = () => {
    setHierarchyLevel(1);
    setSelectedSite(null);
    setSelectedTargetId(null);
    setInspectionData(null);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [78.5, 22.0],
        zoom: 4.4,
        speed: 1.2,
        essential: true
      });
    }
  };

  const toggleFilter = (key: string) => {
    setMapLayerFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filtered Sites by Search Query
  const filteredSites = sites.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q) ||
      s.district.toLowerCase().includes(q) ||
      s.site_code.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      {/* ── HEADER & SCIENTIFIC BREADCRUMB NAVIGATION ─────────────────────────── */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          {/* Hierarchical Clickable Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider">
            <button
              onClick={handleFlyToIndiaLevel}
              className="hover:underline flex items-center gap-1 text-[#C5A059]"
            >
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span>INDIA NATIONAL MAP</span>
            </button>

            {selectedSite && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <button
                  onClick={() => {
                    setHierarchyLevel(2);
                    setSelectedTargetId(null);
                  }}
                  className="hover:underline text-slate-700"
                >
                  {selectedSite.state} / {selectedSite.name}
                </button>
              </>
            )}

            {selectedTargetId && targetDetail && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[#0A1128] font-black bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  {targetDetail.mn_target_code}
                </span>
              </>
            )}
          </div>

          <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-900 tracking-tight">
            India Manganese Intelligence Map
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Continuous manganese prospectivity surface generated from GeoTIFF rasterio tiles and GSI geochemical evidence.
          </p>
        </div>

        {/* Global Search & Zoom Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search site, district, state or Target ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#0A1128] w-64 font-semibold"
            />
          </div>

          <button
            onClick={handleFlyToIndiaLevel}
            className="px-3 py-1.5 rounded-lg bg-[#0A1128] hover:bg-slate-900 text-[#C5A059] font-mono text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Reset India Zoom</span>
          </button>
        </div>
      </div>

      {/* ── MAP LAYER TOGGLE & PROVENANCE STRIP ───────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0A1128] text-white p-3 rounded-lg border border-slate-800 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-bold uppercase mr-1">Interactive Layers:</span>
          
          <button
            onClick={() => toggleFilter('prospectivity')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
              mapLayerFilters.prospectivity ? 'bg-[#C5A059] text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            ░ Prospectivity Heatmap
          </button>

          <button
            onClick={() => toggleFilter('targets')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
              mapLayerFilters.targets ? 'bg-[#C5A059] text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            △ Exploration Targets (6)
          </button>

          <button
            onClick={() => toggleFilter('occurrences')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
              mapLayerFilters.occurrences ? 'bg-[#C5A059] text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            ◆ Mn Occurrences & Assays
          </button>

          <button
            onClick={() => toggleFilter('boundaries')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
              mapLayerFilters.boundaries ? 'bg-[#C5A059] text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            ⬡ State & National Borders
          </button>
        </div>

        <div className="text-[10px] text-slate-400 italic">
          Dataset: India Modelled Prospectivity Surface • Source: GeoTIFF Rasterio & GSI NGCM Assays
        </div>
      </div>

      {/* ── MAIN HIERARCHICAL WORKSPACE GRID ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT/CENTER GEOGRAPHIC MAP WORKSPACE (8 COLUMNS) ────────────────── */}
        <div className="lg:col-span-8 bg-[#070D1E] rounded-xl border border-slate-800 shadow-xl overflow-hidden relative flex flex-col">
          {/* Map Level Header Banner */}
          <div className="p-3 border-b border-slate-800 bg-[#0A1128] flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-2 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-[#C5A059]">
                {hierarchyLevel === 1 && 'LEVEL 1: NATIONAL MANGANESE DISTRIBUTION (GEOTIFF RASTER TILES)'}
                {hierarchyLevel === 2 && `LEVEL 2: REGIONAL EXPLORATION AREA — ${selectedSite?.name}`}
                {hierarchyLevel === 3 && `LEVEL 3: TARGET EXPLORATION ZONE — ${targetDetail?.mn_target_code || 'T001'}`}
              </span>
            </div>

            {hierarchyLevel > 1 && (
              <button
                onClick={handleFlyToIndiaLevel}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[#C5A059] text-[10px] font-bold transition"
              >
                ← Return to India Map
              </button>
            )}
          </div>

          {/* ── LIVE MAPLIBRE GL JS GIS CANVAS ENGINE ──────────────────────────── */}
          <div className="w-full h-[640px] relative bg-[#040814] overflow-hidden select-none">
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Scientific Heatmap Concentration Legend Box */}
            <div className="absolute bottom-4 left-4 z-30 bg-[#090D16]/95 border-2 border-slate-700 p-3 rounded-lg text-white font-mono text-[10px] shadow-2xl space-y-2 max-w-[240px]">
              <div className="border-b border-slate-700 pb-1 font-sans">
                <span className="font-bold text-[#C5A059] block uppercase text-[11px]">EXPLANATION</span>
                <span className="text-slate-300 block text-[10px]">Modelled Manganese Prospectivity Surface</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-bold text-slate-400">PROBABILITY</span>
                  <span className="font-bold text-slate-400">CLASSIFICATION</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-3 bg-[#DC2626] border border-white/40" />
                    <span>0.85 to 1.00</span>
                  </div>
                  <strong className="text-red-400">Very High</strong>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-3 bg-[#EA580C] border border-white/40" />
                    <span>0.70 to 0.85</span>
                  </div>
                  <span className="text-orange-300">High</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-3 bg-[#FACC15] border border-white/40" />
                    <span>0.55 to 0.70</span>
                  </div>
                  <span className="text-yellow-300">Moderate</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-3 bg-[#22C55E] border border-white/40" />
                    <span>0.40 to 0.55</span>
                  </div>
                  <span className="text-emerald-300">Low-Moderate</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-3 bg-[#06B6D4] border border-white/40" />
                    <span>0.25 to 0.40</span>
                  </div>
                  <span className="text-cyan-300">Low</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-3 bg-[#2563EB] border border-white/40" />
                    <span>&lt; 0.25</span>
                  </div>
                  <span className="text-blue-400">Background</span>
                </div>
              </div>

              {/* Map Scale Bar */}
              <div className="pt-1.5 border-t border-slate-800 text-[9px] text-slate-400 font-mono space-y-0.5">
                <div className="flex justify-between">
                  <span>0</span>
                  <span>125</span>
                  <span>250</span>
                  <span>500 KM</span>
                </div>
                <div className="w-full h-1 bg-slate-600 rounded flex">
                  <div className="w-1/4 h-full bg-white" />
                  <div className="w-1/4 h-full bg-slate-900" />
                  <div className="w-1/4 h-full bg-white" />
                  <div className="w-1/4 h-full bg-slate-900" />
                </div>
                <div className="text-[8px] text-slate-500 pt-0.5">Click map to inspect point values • GeoTIFF Rasterio WGS84</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: MAP INSPECTION / TARGET DETAIL PANEL (4 COLUMNS) ───── */}
        <div className="lg:col-span-4 space-y-6">
          {inspectionData ? (
            <MapInspectionDrawer
              data={inspectionData}
              onClose={() => setInspectionData(null)}
              onOpenTargetDetail={(tId) => handleSelectTarget(tId)}
            />
          ) : targetDetail ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              {/* Target Header */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-100 text-red-900 border border-red-300">
                    {targetDetail.priority_level} PRIORITY
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">{targetDetail.mn_target_code}</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 leading-tight">
                  {targetDetail.name}
                </h3>
                <p className="text-xs text-slate-600 font-mono">
                  Location: {targetDetail.latitude.toFixed(4)}° N, {targetDetail.longitude.toFixed(4)}° E
                </p>
              </div>

              {/* 1. MANGANESE STATUS (STRICT SCIENTIFIC SEPARATION) */}
              <div className="bg-[#0A1128] text-white p-4 rounded-lg space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-[#C5A059] border-b border-slate-800 pb-2">
                  <span className="font-bold uppercase tracking-wider">MANGANESE STATUS</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[9px] uppercase">Measured Mn</span>
                    <strong className="text-emerald-400 text-sm">{targetDetail.manganese_status.measured_mn_wt_pct}% wt</strong>
                  </div>

                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[9px] uppercase">Estimated Mn</span>
                    <strong className="text-amber-300 text-sm">{targetDetail.manganese_status.estimated_mn_wt_pct}% wt</strong>
                  </div>

                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[9px] uppercase">AI Prospectivity</span>
                    <strong className="text-white text-sm">{targetDetail.prospectivity_pct}%</strong>
                  </div>

                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[9px] uppercase">Model Confidence</span>
                    <strong className="text-cyan-300 text-sm">{targetDetail.confidence_pct}%</strong>
                  </div>
                </div>
              </div>

              {/* 2. WHY WAS THIS TARGET PREDICTED? */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-serif font-bold text-sm text-slate-900">Why did AI predict {targetDetail.target_id}?</span>
                  <BarChart3 className="w-4 h-4 text-[#C5A059]" />
                </div>

                <div className="space-y-2 text-xs">
                  {targetDetail.why_predicted_shap.map((shap) => (
                    <div key={shap.factor} className="space-y-1">
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="font-semibold text-slate-800">{shap.factor}</span>
                        <span className="font-bold text-slate-900">+{shap.weight_pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-[#0A1128] rounded-full"
                          style={{ width: `${shap.weight_pct * 2.5}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. ACTION BUTTONS */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <button
                  onClick={() => navigate(`/app/explore/${targetDetail.target_id}`)}
                  className="w-full py-2.5 bg-[#0A1128] hover:bg-slate-900 text-[#C5A059] font-bold text-xs rounded transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <Target className="w-4 h-4 text-[#C5A059]" />
                  <span>OPEN DRILLTARGET ANALYSIS FOR {targetDetail.target_id}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-500 space-y-3">
              <Compass className="w-8 h-8 text-[#C5A059] mx-auto animate-spin" style={{ animationDuration: '10s' }} />
              <div className="space-y-1">
                <p className="font-bold text-slate-800 text-sm">Interactive GIS Point Inspector</p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Click <strong>anywhere on the map of India</strong> to inspect exact longitude/latitude, continuous prospectivity score, Mn geochemistry ppm, confidence, and multi-source evidence breakdown.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
