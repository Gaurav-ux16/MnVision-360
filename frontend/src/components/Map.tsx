import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Plus, Minus, Layers as LayersIcon, Compass, MapPin, Sparkles, RotateCcw, Target, ShieldAlert, CheckCircle2 } from 'lucide-react';

export interface RealMine {
  id: string;
  name: string;
  code: string;
  district: string;
  state: string;
  coords: [number, number]; // [lng, lat]
  zoom: number;
  type: 'Underground' | 'Opencast' | 'Mixed';
  capacity: string;
  grade: string;
  status: 'OPERATIONAL' | 'EXPANSION' | 'EXPLORATION';
  description: string;
  targetCount: number;
  primaryTargetId: string;
}

export const REAL_MINES: RealMine[] = [
  {
    id: 'mine-balaghat',
    name: 'Balaghat Manganese Mine',
    code: 'MOIL-BLG',
    district: 'Balaghat',
    state: 'Madhya Pradesh',
    coords: [80.18, 21.84],
    zoom: 11.4,
    type: 'Underground',
    capacity: '0.85 MT/year',
    grade: '42.5% - 48.0% Mn',
    status: 'OPERATIONAL',
    description: 'Deepest underground manganese mine in Asia. Primary high-grade pyrolusite & braunite orebody.',
    targetCount: 4,
    primaryTargetId: 'Target-1',
  },
  {
    id: 'mine-dongri',
    name: 'Dongri Buzurg Mine',
    code: 'MOIL-DGB',
    district: 'Bhandara',
    state: 'Maharashtra',
    coords: [79.68, 21.55],
    zoom: 11.4,
    type: 'Opencast',
    capacity: '0.45 MT/year',
    grade: '38.0% - 44.0% Mn',
    status: 'OPERATIONAL',
    description: 'Major dioxide grade manganese opencast mine with battery-grade ore.',
    targetCount: 3,
    primaryTargetId: 'Target-2',
  },
  {
    id: 'mine-tirodi',
    name: 'Tirodi Manganese Mine',
    code: 'MOIL-TRD',
    district: 'Balaghat',
    state: 'Madhya Pradesh',
    coords: [79.71, 21.68],
    zoom: 11.4,
    type: 'Mixed',
    capacity: '0.35 MT/year',
    grade: '34.0% - 40.0% Mn',
    status: 'OPERATIONAL',
    description: 'Historic manganese deposit hosted along Tirodi biotite gneiss contact.',
    targetCount: 3,
    primaryTargetId: 'Target-3',
  },
  {
    id: 'mine-chikla',
    name: 'Chikla Manganese Mine',
    code: 'MOIL-CHK',
    district: 'Bhandara',
    state: 'Maharashtra',
    coords: [79.77, 21.56],
    zoom: 11.4,
    type: 'Underground',
    capacity: '0.28 MT/year',
    grade: '36.0% - 42.0% Mn',
    status: 'OPERATIONAL',
    description: 'Underground manganese workings in Sausar Group quartz-mica schists.',
    targetCount: 2,
    primaryTargetId: 'Target-2',
  },
  {
    id: 'mine-gumgaon',
    name: 'Gumgaon Manganese Mine',
    code: 'MOIL-GMG',
    district: 'Nagpur',
    state: 'Maharashtra',
    coords: [78.98, 21.38],
    zoom: 11.4,
    type: 'Underground',
    capacity: '0.22 MT/year',
    grade: '35.0% - 40.0% Mn',
    status: 'OPERATIONAL',
    description: 'Western corridor underground manganese extraction sector.',
    targetCount: 2,
    primaryTargetId: 'Target-4',
  },
  {
    id: 'mine-mansar',
    name: 'Mansar Manganese Mine',
    code: 'MOIL-MSR',
    district: 'Nagpur',
    state: 'Maharashtra',
    coords: [79.28, 21.40],
    zoom: 11.4,
    type: 'Opencast',
    capacity: '0.20 MT/year',
    grade: '32.0% - 38.0% Mn',
    status: 'OPERATIONAL',
    description: 'Mansar formation gondite type manganese ore horizon.',
    targetCount: 2,
    primaryTargetId: 'Target-4',
  },
  {
    id: 'mine-kandri',
    name: 'Kandri Manganese Mine',
    code: 'MOIL-KND',
    district: 'Nagpur',
    state: 'Maharashtra',
    coords: [79.27, 21.42],
    zoom: 11.4,
    type: 'Underground',
    capacity: '0.18 MT/year',
    grade: '38.0% - 45.0% Mn',
    status: 'OPERATIONAL',
    description: 'High purity metallurgical grade manganese deposits.',
    targetCount: 2,
    primaryTargetId: 'Target-4',
  },
  {
    id: 'mine-ukwa',
    name: 'Ukwa Manganese Mine',
    code: 'MOIL-UKW',
    district: 'Balaghat',
    state: 'Madhya Pradesh',
    coords: [80.46, 21.96],
    zoom: 11.4,
    type: 'Underground',
    capacity: '0.25 MT/year',
    grade: '36.0% - 42.0% Mn',
    status: 'OPERATIONAL',
    description: 'Eastern extension underground mine with continuous ore body over 5 km strike length.',
    targetCount: 3,
    primaryTargetId: 'Target-1',
  },
];

export interface MineBlock {
  blockCode: string;
  mineId: string;
  label: string;
  polygon: [number, number][];
  centroid: [number, number];
  readinessScore: number;
  estOreTonnes: number;
  mnGradePct: number;
  operationalStatus: 'ACTIVE_PRODUCTION' | 'RESERVE_STANDBY' | 'DEVELOPMENT' | 'BLASTING_DELAYED';
  development: number;
  access: number;
  drilling: number;
  blasting: number;
}

// Balaghat mine blocks — polygon coords from seed_prototype.sql,
// readiness/grade from Operational Block Readiness Matrix.
export const MINE_BLOCKS: MineBlock[] = [
  {
    blockCode: 'B-12',
    mineId: 'mine-balaghat',
    label: 'Block B-12 (North Balaghat)',
    polygon: [[80.12, 21.89], [80.15, 21.89], [80.15, 21.87], [80.12, 21.87], [80.12, 21.89]],
    centroid: [80.135, 21.88],
    readinessScore: 93.5,
    estOreTonnes: 62000,
    mnGradePct: 38.0,
    operationalStatus: 'ACTIVE_PRODUCTION',
    development: 91, access: 94, drilling: 98, blasting: 90,
  },
  {
    blockCode: 'B-17',
    mineId: 'mine-balaghat',
    label: 'Block B-17 (Central Balaghat)',
    polygon: [[80.17, 21.85], [80.21, 21.85], [80.21, 21.82], [80.17, 21.82], [80.17, 21.85]],
    centroid: [80.19, 21.835],
    readinessScore: 86.4,
    estOreTonnes: 45000,
    mnGradePct: 34.5,
    operationalStatus: 'RESERVE_STANDBY',
    development: 82, access: 90, drilling: 95, blasting: 75,
  },
  {
    blockCode: 'B-18',
    mineId: 'mine-balaghat',
    label: 'Block B-18 (South Balaghat)',
    polygon: [[80.14, 21.79], [80.18, 21.79], [80.18, 21.76], [80.14, 21.76], [80.14, 21.79]],
    centroid: [80.16, 21.775],
    readinessScore: 78.2,
    estOreTonnes: 38000,
    mnGradePct: 31.0,
    operationalStatus: 'DEVELOPMENT',
    development: 76, access: 85, drilling: 88, blasting: 60,
  },
  {
    blockCode: 'B-09',
    mineId: 'mine-balaghat',
    label: 'Block B-09 (East Balaghat)',
    polygon: [[80.24, 21.84], [80.27, 21.84], [80.27, 21.81], [80.24, 21.81], [80.24, 21.84]],
    centroid: [80.255, 21.825],
    readinessScore: 66.0,
    estOreTonnes: 29000,
    mnGradePct: 28.5,
    operationalStatus: 'BLASTING_DELAYED',
    development: 65, access: 70, drilling: 80, blasting: 50,
  },
];

function blockFillColor(mnGrade: number): string {
  if (mnGrade >= 38) return '#DC2626';
  if (mnGrade >= 28) return '#F97316';
  if (mnGrade >= 20) return '#EAB308';
  return '#10B981';
}

function statusBadgeStyle(status: MineBlock['operationalStatus']): { bg: string; text: string } {
  switch (status) {
    case 'ACTIVE_PRODUCTION': return { bg: '#166534', text: '#86EFAC' };
    case 'RESERVE_STANDBY':   return { bg: '#1E3A8A', text: '#93C5FD' };
    case 'DEVELOPMENT':       return { bg: '#78350F', text: '#FCD34D' };
    case 'BLASTING_DELAYED':  return { bg: '#7F1D1D', text: '#FCA5A5' };
  }
}

interface MapProps {
  initialCenter?: [number, number]; // [lng, lat]
  initialZoom?: number;
  height?: string;
  activeLayers?: Record<string, boolean>;
  selectedTarget?: string;
  selectedMineId?: string | null;
  selectedLocationPin?: { lat: number; lng: number } | null;
  onMarkerClick?: (targetId: string) => void;
  onMineClick?: (mine: RealMine) => void;
  onResetOverview?: () => void;
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
    { lat: 21.84, lng: 80.08, score: 0.92 },
    { lat: 21.91, lng: 79.82, score: 0.87 },
    { lat: 21.83, lng: 79.78, score: 0.87 },
    { lat: 21.66, lng: 79.98, score: 0.76 },
    { lat: 21.68, lng: 79.92, score: 0.76 },
    { lat: 21.56, lng: 80.32, score: 0.69 },
    { lat: 21.62, lng: 80.31, score: 0.69 },
    { lat: 21.55, lng: 79.68, score: 0.82 },
    { lat: 21.96, lng: 80.46, score: 0.85 },
  ];
  let maxScore = 0.24;
  for (const c of centers) {
    const dist = Math.sqrt(Math.pow(lat - c.lat, 2) + Math.pow(lng - c.lng, 2));
    if (dist < 0.25) {
      const contrib = c.score * Math.max(0, 1 - dist / 0.25);
      if (contrib > maxScore) maxScore = contrib;
    }
  }
  return Number(Math.min(0.96, Math.max(0.12, maxScore)).toFixed(2));
}

export function getManganeseLabel(score: number): { label: string; color: string; badge: string; gradeRange: string } {
  if (score >= 0.80) {
    return { label: 'Very High Manganese', color: '#DC2626', badge: 'bg-red-600 text-white', gradeRange: '38.0% – 48.0% Mn (Braunite/Pyrolusite)' };
  } else if (score >= 0.60) {
    return { label: 'High Manganese', color: '#F97316', badge: 'bg-orange-500 text-white', gradeRange: '28.0% – 37.9% Mn (Metallurgical Grade)' };
  } else if (score >= 0.40) {
    return { label: 'Medium Manganese', color: '#EAB308', badge: 'bg-yellow-500 text-slate-900 font-bold', gradeRange: '20.0% – 27.9% Mn (Siliceous Ore)' };
  } else if (score >= 0.20) {
    return { label: 'Low Manganese', color: '#10B981', badge: 'bg-emerald-600 text-white', gradeRange: '10.0% – 19.9% Mn (Host Schist/Gneiss)' };
  } else {
    return { label: 'Background / Low', color: '#0284C7', badge: 'bg-sky-600 text-white', gradeRange: '< 10.0% Mn (Country Rock)' };
  }
}

export const Map: React.FC<MapProps> = ({
  initialCenter = [79.98, 21.72],
  initialZoom = 8.8,
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
  selectedMineId = null,
  selectedLocationPin = null,
  onMarkerClick,
  onMineClick,
  onResetOverview,
  onMapClick,
  onHover,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const mineMarkersRef = useRef<maplibregl.Marker[]>([]);
  const targetMarkersRef = useRef<maplibregl.Marker[]>([]);
  const hoverPopupRef = useRef<maplibregl.Popup | null>(null);

  const onHoverRef = useRef(onHover);
  onHoverRef.current = onHover;
  const onMapClickRef = useRef(onMapClick);
  onMapClickRef.current = onMapClick;

  const [mapType, setMapType] = useState<'Satellite' | 'Terrain' | 'Map'>('Satellite');
  const [currentZoom, setCurrentZoom] = useState<number>(initialZoom);
  const [activeMine, setActiveMine] = useState<RealMine | null>(() => {
    if (selectedMineId) {
      return REAL_MINES.find(m => m.id === selectedMineId) || null;
    }
    return null;
  });
  const [hoveredInfo, setHoveredInfo] = useState<{ lat: number; lng: number; score: number } | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<MineBlock | null>(null);

  // Sync selectedMineId prop
  useEffect(() => {
    if (selectedMineId) {
      const found = REAL_MINES.find(m => m.id === selectedMineId);
      if (found) {
        setActiveMine(found);
        if (map.current) {
          map.current.flyTo({
            center: found.coords,
            zoom: found.zoom,
            speed: 1.2,
            curve: 1.4,
            essential: true,
          });
        }
      }
    } else {
      setActiveMine(null);
    }
  }, [selectedMineId]);

  // Initial Map Load
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

    map.current.on('zoom', () => {
      if (map.current) {
        setCurrentZoom(Number(map.current.getZoom().toFixed(1)));
      }
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // 1. AOI BOUNDARY POLYGON (White Outer Boundary)
      map.current.addSource('aoi-boundary', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { name: 'Balaghat-Nagpur Manganese Belt AOI' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [78.85, 21.30],
                  [79.35, 21.35],
                  [79.75, 21.50],
                  [80.25, 21.75],
                  [80.60, 22.05],
                  [80.45, 22.15],
                  [79.80, 21.95],
                  [79.20, 21.65],
                  [78.85, 21.30]
                ]]
              }
            }
          ]
        }
      });

      map.current.addLayer({
        id: 'aoi-boundary-fill',
        type: 'fill',
        source: 'aoi-boundary',
        paint: {
          'fill-color': '#0F172A',
          'fill-opacity': 0.12
        }
      });

      map.current.addLayer({
        id: 'aoi-boundary-line',
        type: 'line',
        source: 'aoi-boundary',
        paint: {
          'line-color': '#38BDF8',
          'line-width': 2.0,
          'line-dasharray': [3, 2]
        }
      });

      // 2. MULTI-LEVEL HEATMAP GRADIENT POLYGONS (Very High = Red, High = Orange, Medium = Yellow, Low = Green/Cyan)
      const heatFeatures = [
        // Blue / Cyan Outer (Very Low 0.0 - 0.2)
        {
          color: '#0284C7',
          opacity: 0.35,
          coords: [[
            [79.55, 21.92], [79.85, 21.96], [80.20, 21.92], [80.50, 21.70],
            [80.35, 21.45], [79.95, 21.50], [79.70, 21.58], [79.55, 21.92]
          ]]
        },
        // Green Envelope (Low 0.2 - 0.4)
        {
          color: '#10B981',
          opacity: 0.50,
          coords: [[
            [79.65, 21.88], [79.88, 21.92], [80.15, 21.88], [80.40, 21.64],
            [80.28, 21.50], [79.92, 21.55], [79.74, 21.62], [79.65, 21.88]
          ]]
        },
        // Yellow Envelope (Medium Manganese 0.4 - 0.6)
        {
          color: '#EAB308',
          opacity: 0.65,
          coords: [
            // Balaghat & Ukwa Sector
            [[79.95, 21.89], [80.25, 21.88], [80.50, 21.98], [80.35, 21.70], [80.00, 21.75], [79.95, 21.89]],
            // Tirodi & Dongri Sector
            [[79.60, 21.72], [79.85, 21.70], [79.80, 21.50], [79.62, 21.50], [79.60, 21.72]],
            // Mansar & Gumgaon Sector
            [[78.90, 21.42], [79.35, 21.45], [79.30, 21.35], [78.92, 21.32], [78.90, 21.42]]
          ]
        },
        // Orange Rings (High Manganese 0.6 - 0.8)
        {
          color: '#F97316',
          opacity: 0.78,
          coords: [
            // Target 1 / Balaghat High Ring
            [[80.02, 21.88], [80.18, 21.88], [80.18, 21.80], [80.02, 21.80], [80.02, 21.88]],
            // Target 3 / Tirodi High Ring
            [[79.72, 21.86], [79.84, 21.86], [79.84, 21.78], [79.72, 21.78], [79.72, 21.86]],
            // Target 2 / Dongri High Ring
            [[79.92, 21.69], [80.04, 21.69], [80.04, 21.62], [79.92, 21.62], [79.92, 21.69]],
            // Target 4 High Ring
            [[80.25, 21.60], [80.36, 21.60], [80.36, 21.52], [80.25, 21.52], [80.25, 21.60]],
            // Ukwa High Ring
            [[80.40, 21.99], [80.52, 21.99], [80.52, 21.92], [80.40, 21.92], [80.40, 21.99]]
          ]
        },
        // Red Core Spots (VERY HIGH MANGANESE 0.8 - 1.0)
        {
          color: '#DC2626',
          opacity: 0.90,
          coords: [
            // Target 1 / Balaghat Very High Core
            [[80.05, 21.86], [80.12, 21.86], [80.12, 21.81], [80.05, 21.81], [80.05, 21.86]],
            // Target 3 / Tirodi Very High Core
            [[79.75, 21.85], [79.81, 21.85], [79.81, 21.80], [79.75, 21.80], [79.75, 21.85]],
            // Ukwa Very High Core
            [[80.44, 21.98], [80.49, 21.98], [80.49, 21.94], [80.44, 21.94], [80.44, 21.98]]
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

      // 3. MANGANESE BELT STRUCTURAL LINE
      map.current.addSource('mn-belt-line', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { name: 'Central India Manganese Belt Trend' },
              geometry: {
                type: 'LineString',
                coordinates: [
                  [78.98, 21.38], // Gumgaon
                  [79.28, 21.40], // Mansar
                  [79.68, 21.55], // Dongri
                  [79.71, 21.68], // Tirodi
                  [80.18, 21.84], // Balaghat
                  [80.46, 21.96], // Ukwa
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
          'line-color': '#FDE047',
          'line-width': 2.5,
          'line-dasharray': [4, 3]
        }
      });

      // 4. MINE BLOCK POLYGON OVERLAYS (visible at zoom >= 9, colored by Mn grade)
      const blockFeatures = MINE_BLOCKS.map(block => ({
        type: 'Feature' as const,
        properties: {
          blockCode: block.blockCode,
          mineId: block.mineId,
          label: block.label,
          mnGradePct: block.mnGradePct,
          readinessScore: block.readinessScore,
          estOreTonnes: block.estOreTonnes,
          operationalStatus: block.operationalStatus,
          fillColor: blockFillColor(block.mnGradePct),
        },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [block.polygon],
        },
      }));

      map.current.addSource('mine-blocks', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: blockFeatures },
      });

      // Fill — colored by Mn grade
      map.current.addLayer({
        id: 'mine-blocks-fill',
        type: 'fill',
        source: 'mine-blocks',
        minzoom: 9,
        paint: {
          'fill-color': ['get', 'fillColor'],
          'fill-opacity': 0.55,
        },
      });

      // White outline
      map.current.addLayer({
        id: 'mine-blocks-outline',
        type: 'line',
        source: 'mine-blocks',
        minzoom: 9,
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 2.0,
          'line-opacity': 0.9,
        },
      });

      // Selected block bright highlight (filter changes on click)
      map.current.addLayer({
        id: 'mine-blocks-selected',
        type: 'fill',
        source: 'mine-blocks',
        minzoom: 9,
        filter: ['==', ['get', 'blockCode'], ''],
        paint: {
          'fill-color': '#FFFFFF',
          'fill-opacity': 0.28,
        },
      });

      // Click on a block polygon → zoom to it + show detail card
      map.current.on('click', 'mine-blocks-fill', (e) => {
        const features = e.features;
        if (!features || features.length === 0) return;
        const props = features[0].properties as { blockCode: string };
        const block = MINE_BLOCKS.find(b => b.blockCode === props.blockCode);
        if (!block || !map.current) return;
        map.current.setFilter('mine-blocks-selected', ['==', ['get', 'blockCode'], block.blockCode]);
        setSelectedBlock(block);
        map.current.flyTo({ center: block.centroid, zoom: 14, speed: 1.2, curve: 1.4, essential: true });
      });

      map.current.on('mouseenter', 'mine-blocks-fill', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'mine-blocks-fill', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });

      // Mousemove hover event listener
      map.current.on('mousemove', (e) => {
        const lng = e.lngLat.lng;
        const lat = e.lngLat.lat;
        const score = calculateProspectivity(lat, lng);
        setHoveredInfo({ lat, lng, score });
        if (onHoverRef.current) {
          onHoverRef.current(lat, lng, score);
        }
      });

      // General click (dismiss block card when clicking open map area)
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
  }, []); // Only run once on mount

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
        zoom: 11.2,
        speed: 1.2,
        curve: 1.4,
        essential: true,
      });
    }
  }, [selectedTarget]);

  // 4. RENDER REAL MINES MARKERS & TARGET PIN CALLOUTS
  useEffect(() => {
    if (!map.current) return;

    // Clear old markers
    mineMarkersRef.current.forEach(m => m.remove());
    mineMarkersRef.current = [];
    targetMarkersRef.current.forEach(m => m.remove());
    targetMarkersRef.current = [];

    // A. Render REAL MOIL MINES
    REAL_MINES.forEach((mine) => {
      const isSelectedMine = activeMine?.id === mine.id;
      const el = document.createElement('div');
      el.className = 'group cursor-pointer flex flex-col items-center z-30 transition-transform hover:scale-110';
      el.innerHTML = `
        <div class="px-2.5 py-1 rounded-lg text-left shadow-2xl border flex items-center gap-1.5 font-sans transition ${
          isSelectedMine
            ? 'bg-[#1E3A8A] border-amber-400 text-white ring-2 ring-amber-400 scale-105'
            : 'bg-[#0B192C]/95 border-blue-500/80 text-white hover:border-amber-300'
        }">
          <div class="w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] flex items-center justify-center shrink-0">M</div>
          <div>
            <div class="text-[10.5px] font-extrabold font-serif leading-tight whitespace-nowrap">${mine.name}</div>
            <div class="text-[8.5px] text-amber-300 font-mono leading-none">${mine.district} | ${mine.capacity}</div>
          </div>
        </div>
        <div class="w-3.5 h-3.5 rounded-full border-2 border-white shadow-lg -mt-0.5 ${
          isSelectedMine ? 'bg-amber-400 ring-4 ring-amber-400/40' : 'bg-blue-600'
        }"></div>
      `;

      el.onclick = (e) => {
        e.stopPropagation();
        setActiveMine(mine);
        if (map.current) {
          map.current.flyTo({
            center: mine.coords,
            zoom: mine.zoom,
            speed: 1.3,
            curve: 1.4,
            essential: true,
          });
        }
        if (onMineClick) onMineClick(mine);
      };

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(mine.coords)
        .addTo(map.current!);

      mineMarkersRef.current.push(marker);
    });

    // B. Render TARGET CALLOUT PINS
    const targetPins = [
      { id: 'Target-1', title: 'Target 1 (Balaghat)', subtitle: 'Very High Mn (38-48%)', color: 'red', coords: [80.08, 21.84] },
      { id: 'Target-2', title: 'Target 2 (Dongri/Bhandara)', subtitle: 'High Mn (28-37%)', color: 'orange', coords: [79.98, 21.66] },
      { id: 'Target-3', title: 'Target 3 (Tirodi Sector)', subtitle: 'Very High Mn (35-45%)', color: 'red', coords: [79.78, 21.83] },
      { id: 'Target-4', title: 'Target 4 (Mansar/Kandri)', subtitle: 'High Mn (25-34%)', color: 'orange', coords: [80.32, 21.56] },
    ];

    targetPins.forEach((pin) => {
      const isSelected = selectedTarget === pin.id;
      const container = document.createElement('div');
      container.className = 'flex flex-col items-center cursor-pointer group z-40 transition-transform hover:scale-110';

      const callout = document.createElement('div');
      callout.className = `px-3 py-1.5 rounded-lg shadow-xl text-left border flex flex-col justify-center font-sans ${
        isSelected
          ? 'bg-[#0B192C]/95 border-red-500 text-white ring-2 ring-red-400/80 scale-105'
          : 'bg-[#0B192C]/90 border-slate-700 text-slate-100 hover:border-slate-400'
      }`;
      callout.innerHTML = `
        <div class="text-[11px] font-extrabold font-serif leading-tight flex items-center gap-1">
          <span class="w-2 h-2 rounded-full ${pin.color === 'red' ? 'bg-red-500' : 'bg-orange-400'} animate-pulse"></span>
          <span>${pin.title}</span>
        </div>
        <div class="text-[9px] font-bold ${pin.color === 'red' ? 'text-red-300' : 'text-orange-300'} leading-tight">${pin.subtitle}</div>
      `;

      const pinDot = document.createElement('div');
      pinDot.className = `w-4 h-4 rounded-full border-2 border-white shadow-lg mt-1 ${
        pin.color === 'red' ? 'bg-red-600' : 'bg-orange-500'
      } ${isSelected ? 'ring-4 ring-red-500/50' : ''}`;

      container.appendChild(callout);
      container.appendChild(pinDot);

      container.onclick = (e) => {
        e.stopPropagation();
        if (onMarkerClick) onMarkerClick(pin.id);
      };

      const m = new maplibregl.Marker({ element: container })
        .setLngLat(pin.coords as [number, number])
        .addTo(map.current!);

      targetMarkersRef.current.push(m);
    });

  }, [selectedTarget, activeMine, onMarkerClick, onMineClick]);

  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();

  const handleResetOverview = () => {
    setActiveMine(null);
    setSelectedBlock(null);
    if (map.current) {
      map.current.setFilter('mine-blocks-selected', ['==', ['get', 'blockCode'], '']);
      map.current.flyTo({
        center: [79.98, 21.72],
        zoom: 8.8,
        speed: 1.2,
        curve: 1.4,
        essential: true,
      });
    }
    if (onResetOverview) onResetOverview();
  };

  const currentMnInfo = hoveredInfo ? getManganeseLabel(hoveredInfo.score) : null;

  return (
    <div className="relative w-full h-full rounded-xl border border-slate-300 overflow-hidden shadow-md min-h-[560px]" style={{ height }}>
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full min-h-[560px] bg-slate-900" />

      {/* TOP BAR: Real Mines Navigation & Zoom Indicator */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Compass & Active Mine Header */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-[#0B192C]/90 text-white border border-slate-700 px-2.5 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-extrabold tracking-wider text-slate-200">NORTH</span>
          </div>

          {activeMine ? (
            <div className="bg-[#0B192C]/95 text-white border border-amber-400 px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <div>
                <span className="text-[10px] font-extrabold text-amber-300 block leading-tight">ACTIVE MINE SECTOR</span>
                <span className="text-xs font-serif font-bold text-white leading-none">{activeMine.name} ({activeMine.grade})</span>
              </div>
              <button
                onClick={handleResetOverview}
                className="ml-2 px-2 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded text-[10px] font-extrabold transition flex items-center gap-1 shadow"
              >
                <RotateCcw className="w-3 h-3" />
                <span>All Mines</span>
              </button>
            </div>
          ) : (
            <div className="bg-[#0B192C]/90 text-white border border-slate-700 px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-slate-200">
                Click any <strong className="text-amber-300">MOIL Mine</strong> to Zoom In & Inspect AI Targets
              </span>
            </div>
          )}
        </div>

        {/* Right: Quick Jump Mine Pills */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#0B192C]/90 p-1 rounded-lg border border-slate-700 shadow-xl pointer-events-auto">
          <span className="text-[10px] font-extrabold text-slate-400 px-1.5">MOIL Mines:</span>
          {REAL_MINES.slice(0, 4).map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setActiveMine(m);
                map.current?.flyTo({ center: m.coords, zoom: m.zoom });
                if (onMineClick) onMineClick(m);
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                activeMine?.id === m.id
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {m.code.replace('MOIL-', '')}
            </button>
          ))}
        </div>
      </div>

      {/* TOP RIGHT: Floating Prospectivity Heatmap Legend Card */}
      <div className="absolute top-16 right-3 z-20 w-56 bg-[#0B192C]/95 text-white rounded-xl border border-slate-700/80 p-3.5 shadow-2xl backdrop-blur-md space-y-2 text-xs font-sans">
        <div className="font-extrabold font-serif text-amber-400 text-xs tracking-wide border-b border-slate-700 pb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Manganese Prospectivity</span>
          </div>
          <span className="text-[9px] font-mono text-slate-400">PU Index</span>
        </div>

        <div className="space-y-1.5 text-[11px] font-medium text-slate-200">
          <div className="flex items-center justify-between bg-red-950/40 p-1 rounded border border-red-800/40">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#DC2626] border border-red-400 shrink-0" />
              <strong className="text-red-300 font-bold">Very High Mn</strong>
            </div>
            <span className="text-[10px] font-mono text-red-200 font-bold">(0.8 – 1.0)</span>
          </div>

          <div className="flex items-center justify-between bg-orange-950/40 p-1 rounded border border-orange-800/40">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#F97316] border border-orange-400 shrink-0" />
              <strong className="text-orange-300 font-bold">High Mn</strong>
            </div>
            <span className="text-[10px] font-mono text-orange-200 font-bold">(0.6 – 0.8)</span>
          </div>

          <div className="flex items-center justify-between bg-yellow-950/40 p-1 rounded border border-yellow-800/40">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#EAB308] border border-yellow-400 shrink-0" />
              <strong className="text-yellow-300 font-bold">Medium Mn</strong>
            </div>
            <span className="text-[10px] font-mono text-yellow-200 font-bold">(0.4 – 0.6)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#10B981] border border-emerald-400 shrink-0" />
              <span>Low Mn / Schist</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">(0.2 – 0.4)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-[#0284C7] border border-blue-400 shrink-0" />
              <span>Background Rock</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">(0.0 – 0.2)</span>
          </div>
        </div>

        {/* Legend Map Symbols */}
        <div className="pt-2 border-t border-slate-700/80 space-y-1 text-[10px] text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 text-[8px] font-black flex items-center justify-center shrink-0">M</span>
            <span>Real MOIL Manganese Mine</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 border border-white shrink-0" />
            <span>AI Drill Target Callout</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 border-t-2 border-dashed border-yellow-400 shrink-0" />
            <span>Central Mn Ore Trend</span>
          </div>
        </div>
      </div>

      {/* BLOCK DETAIL CARD — shown when a mine block polygon is clicked */}
      {selectedBlock && (() => {
        const sty = statusBadgeStyle(selectedBlock.operationalStatus);
        const mnColor = blockFillColor(selectedBlock.mnGradePct);
        return (
          <div className="absolute top-16 left-3 z-30 w-72 bg-[#0B192C]/97 text-white rounded-xl border border-slate-600 shadow-2xl backdrop-blur-md font-sans text-xs overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-700"
              style={{ borderLeft: `4px solid ${mnColor}` }}>
              <div>
                <div className="text-[11px] font-extrabold font-serif text-amber-300 leading-tight">
                  {selectedBlock.blockCode} — Balaghat Underground
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">{selectedBlock.label}</div>
              </div>
              <button
                onClick={() => {
                  setSelectedBlock(null);
                  if (map.current) map.current.setFilter('mine-blocks-selected', ['==', ['get', 'blockCode'], '']);
                }}
                className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300 text-[12px] font-bold ml-2 shrink-0"
              >✕</button>
            </div>

            {/* Status + Grade row */}
            <div className="flex items-center gap-2 px-3.5 py-2 border-b border-slate-700/60">
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide"
                style={{ backgroundColor: sty.bg, color: sty.text }}
              >{selectedBlock.operationalStatus.replace('_', ' ')}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold"
                style={{ backgroundColor: '#1E293B', color: mnColor }}>
                {selectedBlock.mnGradePct}% Mn
              </span>
              <span className="text-[10px] text-slate-400 ml-auto font-mono">
                {selectedBlock.estOreTonnes.toLocaleString()} MT
              </span>
            </div>

            {/* Readiness progress bars */}
            <div className="px-3.5 py-2.5 space-y-1.5">
              <div className="text-[10px] font-extrabold text-slate-300 mb-1 uppercase tracking-widest">
                Readiness Matrix
              </div>
              {[
                { label: 'Development', val: selectedBlock.development },
                { label: 'Access', val: selectedBlock.access },
                { label: 'Drilling', val: selectedBlock.drilling },
                { label: 'Blasting', val: selectedBlock.blasting },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-2">
                  <span className="w-20 text-[10px] text-slate-400 shrink-0">{row.label}</span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${row.val}%`,
                        backgroundColor: row.val >= 90 ? '#22C55E' : row.val >= 75 ? '#F59E0B' : row.val >= 60 ? '#F97316' : '#EF4444',
                      }}
                    />
                  </div>
                  <span className="w-8 text-right text-[10px] font-mono text-slate-300">{row.val}%</span>
                </div>
              ))}
              {/* Overall readiness score */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/60">
                <span className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest">Overall Readiness</span>
                <span className="text-sm font-extrabold font-mono"
                  style={{ color: selectedBlock.readinessScore >= 90 ? '#22C55E' : selectedBlock.readinessScore >= 75 ? '#F59E0B' : selectedBlock.readinessScore >= 60 ? '#F97316' : '#EF4444' }}>
                  {selectedBlock.readinessScore}%
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* BOTTOM CENTER: Live Cursor Prospectivity & Manganese Grade Telemetry */}
      {hoveredInfo && currentMnInfo && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-[#0B192C]/95 text-white px-4 py-2 rounded-xl border border-slate-700 shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs font-sans">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
            <span>📍</span>
            <span>{hoveredInfo.lat.toFixed(3)}°N, {hoveredInfo.lng.toFixed(3)}°E</span>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${currentMnInfo.badge}`}>
              {currentMnInfo.label} ({(hoveredInfo.score * 100).toFixed(0)}%)
            </span>
            <span className="text-[10px] text-slate-300 hidden md:inline font-mono">
              {currentMnInfo.gradeRange}
            </span>
          </div>
        </div>
      )}

      {/* BOTTOM LEFT: Scale Bar */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-[#0B192C]/80 text-white px-3 py-1.5 rounded-lg border border-slate-700 text-[10px] font-mono flex items-center gap-2 shadow-lg">
          <span>0</span>
          <span className="w-4 border-b border-white inline-block"></span>
          <span>5</span>
          <span className="w-4 border-b border-white inline-block"></span>
          <span>10</span>
          <span className="w-6 border-b border-white inline-block"></span>
          <span>20 km</span>
          <span className="text-slate-400 text-[9px] ml-1">Z:{currentZoom}</span>
        </div>
      </div>

      {/* BOTTOM RIGHT: Map Control Buttons (+ / - / Layers) */}
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

        {/* Reset / Fit Overview */}
        <button
          onClick={handleResetOverview}
          className="w-8 h-8 bg-[#0B192C]/90 hover:bg-[#0B192C] text-amber-400 rounded-lg border border-slate-700 shadow-xl flex items-center justify-center transition font-bold"
          title="Reset to Regional Overview"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
        </button>

        {/* Basemap Switcher Toggle */}
        <button
          onClick={() => setMapType(prev => prev === 'Satellite' ? 'Terrain' : prev === 'Terrain' ? 'Map' : 'Satellite')}
          className="w-8 h-8 bg-[#0B192C]/90 hover:bg-[#0B192C] text-amber-400 rounded-lg border border-slate-700 shadow-xl flex items-center justify-center transition"
          title={`Switch Basemap (Current: ${mapType})`}
        >
          <LayersIcon className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
