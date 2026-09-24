import React, { useState, useEffect } from 'react';
import { 
  Layers, MapPin, Eye, EyeOff, Sliders, Maximize2, Minimize2, 
  RotateCcw, ShieldCheck, CheckCircle2, ChevronDown, ChevronRight, 
  Info, Database, Compass, Activity, ArrowRightLeft, Sparkles, Filter
} from 'lucide-react';

export interface GeoLayerItem {
  id: string;
  name: string;
  category: string;
  type: string;
  source: string;
  crs: string;
  bounds: number[];
  opacity: number;
  visible: boolean;
  resolution?: string;
  feature_count?: number | null;
  coverage_pct?: number;
  no_data_pct?: number;
  min_val?: number;
  max_val?: number;
  mean_val?: number;
  fields: string[];
  description: string;
  provenance: Record<string, any>;
}

export interface StudyArea {
  id: string;
  name: string;
  region: string;
  center: [number, number];
  bounds: number[];
  zoom: number;
  mines_count: number;
  occurrences_count: number;
  data_status: string;
}

const DEFAULT_STUDY_AREAS: StudyArea[] = [
  {
    id: 'balaghat-main',
    name: 'Balaghat Flagship Sector',
    region: 'Madhya Pradesh',
    center: [21.84, 80.72],
    bounds: [79.60, 21.50, 80.85, 22.05],
    zoom: 11,
    mines_count: 3,
    occurrences_count: 18,
    data_status: 'HIGH_DENSITY_VERIFIED'
  },
  {
    id: 'ukwa-sector',
    name: 'Ukwa Deep Extension Zone',
    region: 'Madhya Pradesh',
    center: [21.92, 80.48],
    bounds: [80.20, 21.80, 80.75, 22.10],
    zoom: 12,
    mines_count: 1,
    occurrences_count: 8,
    data_status: 'GEOPHYSICS_ACTIVE'
  },
  {
    id: 'bhandara-dongri',
    name: 'Dongri Buzurg - Bhandara Region',
    region: 'Maharashtra',
    center: [21.54, 79.72],
    bounds: [79.40, 21.35, 79.95, 21.75],
    zoom: 11,
    mines_count: 2,
    occurrences_count: 12,
    data_status: 'OPENCAST_PRODUCING'
  },
  {
    id: 'chikla-tier',
    name: 'Chikla Belt Structural Target Area',
    region: 'Maharashtra',
    center: [21.46, 79.65],
    bounds: [79.45, 21.30, 79.85, 21.60],
    zoom: 12,
    mines_count: 1,
    occurrences_count: 6,
    data_status: 'EXPLORATION_STAGE'
  }
];

const DEFAULT_GEO_LAYERS: GeoLayerItem[] = [
  {
    id: 'sentinel2-rgb',
    name: 'Sentinel-2 True Color (RGB)',
    category: 'BASE / REFERENCE',
    type: 'RASTER',
    source: 'Copernicus Sentinel-2 L2A (10m Resolution)',
    crs: 'EPSG:4326',
    bounds: [79.60, 21.50, 80.85, 22.05],
    opacity: 1.0,
    visible: true,
    resolution: '10 meters',
    feature_count: null,
    no_data_pct: 1.2,
    min_val: 0.0,
    max_val: 10000.0,
    mean_val: 1840.5,
    fields: ['B02_Blue', 'B03_Green', 'B04_Red'],
    description: 'Multi-spectral surface reflectance captured over the Balaghat manganese belt.',
    provenance: { acquisition_date: '2026-02-14', provider: 'ESA / Copernicus', processing: 'Surface Reflectance BOA' }
  },
  {
    id: 'mine-boundaries',
    name: 'MOIL Mine Boundaries & AOI',
    category: 'BASE / REFERENCE',
    type: 'VECTOR_POLYGON',
    source: 'MOIL GIS Cadastral Survey (Verified Boundaries)',
    crs: 'EPSG:4326',
    bounds: [79.60, 21.50, 80.85, 22.05],
    opacity: 0.85,
    visible: true,
    feature_count: 6,
    coverage_pct: 100.0,
    fields: ['mine_name', 'block_code', 'lease_area_ha', 'operating_depth_m', 'status'],
    description: 'Official lease boundaries for Balaghat Underground, Ukwa, and adjacent mining sectors.',
    provenance: { survey_year: '2025-2026', provider: 'MOIL Survey & Mapping Division' }
  },
  {
    id: 'dem-elevation',
    name: 'SRTM Digital Elevation Model (DEM)',
    category: 'TERRAIN',
    type: 'RASTER',
    source: 'SRTM 30m Global DEM / ALOS PALSAR',
    crs: 'EPSG:4326',
    bounds: [79.60, 21.50, 80.85, 22.05],
    opacity: 0.7,
    visible: true,
    resolution: '30 meters',
    feature_count: null,
    no_data_pct: 0.0,
    min_val: 285.0,
    max_val: 642.0,
    mean_val: 384.2,
    fields: ['Elevation (m)', 'Slope (deg)', 'Aspect (deg)', 'Curvature'],
    description: 'Topographic surface elevation and terrain roughness indices used to model structural dip slopes.',
    provenance: { sensor: 'SRTM Shuttle Radar', vertical_accuracy: '±16m', datum: 'WGS84 / EGM96' }
  },
  {
    id: 'gsi-geology',
    name: 'Sausar Group Bedrock Lithology',
    category: 'GEOLOGY',
    type: 'VECTOR_POLYGON',
    source: 'Geological Survey of India (1:50,000 Quadrangle Series)',
    crs: 'EPSG:4326',
    bounds: [79.60, 21.50, 80.85, 22.05],
    opacity: 0.75,
    visible: true,
    feature_count: 42,
    coverage_pct: 98.4,
    fields: ['formation', 'lithology_description', 'age_era', 'mn_bearing_potential', 'structural_setting'],
    description: 'Precambrian Sausar Mobile Belt metasedimentary units: Mansar Formation mica-schists, quartzites, and gondite ore bodies.',
    provenance: { publisher: 'Geological Survey of India (GSI)', map_scale: '1:50,000' }
  },
  {
    id: 'structural-lineaments',
    name: 'Fault Corridors & Fold Axes',
    category: 'GEOLOGY',
    type: 'VECTOR_LINE',
    source: 'Landsat-8 & SAR Automated Lineament Extraction',
    crs: 'EPSG:4326',
    bounds: [79.60, 21.50, 80.85, 22.05],
    opacity: 0.9,
    visible: true,
    feature_count: 184,
    coverage_pct: 94.1,
    fields: ['structure_type', 'length_km', 'strike_azimuth', 'density_score', 'cross_shear'],
    description: 'Major synclinal fold axes, fault traces, and lineament intersection density grids dictating manganese mineralization traps.',
    provenance: { derivation: 'Sobel Filter & Lineament Extraction', validation: 'GSI Structural Field Traverses' }
  },
  {
    id: 'geochemistry-mn',
    name: 'GSI Stream Sediment & Outcrop Geochemistry',
    category: 'GEOCHEMISTRY',
    type: 'VECTOR_POINT',
    source: 'National Geochemical Mapping Program (NGCM) Assays',
    crs: 'EPSG:4326',
    bounds: [79.60, 21.50, 80.85, 22.05],
    opacity: 0.95,
    visible: true,
    feature_count: 50,
    coverage_pct: 82.0,
    fields: ['sample_id', 'mno_pct', 'fe2o3_pct', 'sio2_pct', 'p_pct', 'sample_type', 'depth_m'],
    description: 'Laboratory XRF elemental assay locations measuring MnO, Fe2O3, and SiO2 concentration percentages.',
    provenance: { laboratory: 'MOIL Central Testing Facility & GSI Lab', assay_method: 'XRF / ICP-MS' }
  },
  {
    id: 'geophysics-gravity',
    name: 'Bouguer Gravity Anomaly & Magnetics',
    category: 'GEOPHYSICS',
    type: 'RASTER',
    source: 'Airborne Geophysical Survey (NGRI / GSI)',
    crs: 'EPSG:4326',
    bounds: [79.60, 21.50, 80.85, 22.05],
    opacity: 0.65,
    visible: false,
    resolution: '50 meters',
    feature_count: null,
    no_data_pct: 2.4,
    min_val: -45.2,
    max_val: 18.7,
    mean_val: -12.4,
    fields: ['Gravity_mGal', 'Magnetic_nT', 'Resistivity_ohm_m'],
    description: 'Subsurface density contrast maps identifying high-density manganese lens responses.',
    provenance: { survey: 'Airborne Magnetic & Gravimetric Survey', institution: 'NGRI' }
  },
  {
    id: 'sentinel1-sar',
    name: 'Sentinel-1 SAR C-Band Backscatter (VV/VH)',
    category: 'REMOTE SENSING',
    type: 'RASTER',
    source: 'Copernicus Sentinel-1 SAR Polarimetry',
    crs: 'EPSG:4326',
    bounds: [79.60, 21.50, 80.85, 22.05],
    opacity: 0.7,
    visible: false,
    resolution: '10 meters',
    feature_count: null,
    no_data_pct: 0.1,
    min_val: -24.5,
    max_val: -3.1,
    mean_val: -14.2,
    fields: ['VV (dB)', 'VH (dB)', 'VV_VH_Ratio', 'Texture_Entropy'],
    description: 'Synthetic Aperture Radar dual-pol backscatter penalizing cloud shadow and measuring surface roughness.',
    provenance: { mode: 'IW Descending', processing: 'Terrain Correction & Speckle Filtering' }
  },
  {
    id: 'cem-anomaly',
    name: 'CEM Spectral Target Anomaly Filter',
    category: 'REMOTE SENSING',
    type: 'RASTER',
    source: 'Constrained Energy Minimization (Sentinel-2 SWIR)',
    crs: 'EPSG:4326',
    bounds: [79.60, 21.50, 80.85, 22.05],
    opacity: 0.8,
    visible: true,
    resolution: '10 meters',
    feature_count: null,
    no_data_pct: 0.0,
    min_val: 0.05,
    max_val: 0.98,
    mean_val: 0.42,
    fields: ['CEM_Score', 'Clay_Index', 'Ferrous_Index'],
    description: 'Matched filter targeting manganese oxide spectral signatures in SWIR Bands (B11/B12).',
    provenance: { algorithm: 'FIR Matched Filter CEM', target_spectrum: 'Braunite Outcrop Reflectance' }
  },
  {
    id: 'known-occurrences',
    name: 'Known Manganese Deposits & Outcrops',
    category: 'MINERALIZATION',
    type: 'VECTOR_POINT',
    source: 'MOIL Mineral Resource Inventory & GSI Occurrences',
    crs: 'EPSG:4326',
    bounds: [79.60, 21.50, 80.85, 22.05],
    opacity: 1.0,
    visible: true,
    feature_count: 18,
    coverage_pct: 100.0,
    fields: ['deposit_name', 'ore_type', 'mn_grade_pct', 'status', 'depth_m'],
    description: 'Confirmed ground-truth manganese mineral occurrences, active stopes, and historical diggings.',
    provenance: { registry: 'MOIL Exploration Database', verification: 'Certified Core & Assay Records' }
  },
  {
    id: 'prospectivity-ai',
    name: 'MnExplore AI Prospectivity Model',
    category: 'AI OUTPUTS',
    type: 'RASTER',
    source: 'Elkan-Noto PU Learner + Spatial Block CV',
    crs: 'EPSG:4326',
    bounds: [79.60, 21.50, 80.85, 22.05],
    opacity: 0.75,
    visible: true,
    resolution: '10 meters',
    feature_count: null,
    no_data_pct: 0.0,
    min_val: 0.12,
    max_val: 0.96,
    mean_val: 0.54,
    fields: ['Prospectivity_Prob', 'Confidence_Pct', 'Applicability_Domain'],
    description: 'Fused machine learning prospectivity probability raster synthesizing all 8 evidence channels.',
    provenance: { model_version: 'MnExplore-v2.4', cv_strategy: 'SpatialBlockCV (5-Fold)' }
  }
];

export const GeoLayersSection: React.FC = () => {
  const [layers, setLayers] = useState<GeoLayerItem[]>(DEFAULT_GEO_LAYERS);
  const [studyAreas, setStudyAreas] = useState<StudyArea[]>(DEFAULT_STUDY_AREAS);
  const [selectedStudyAreaId, setSelectedStudyAreaId] = useState<string>('balaghat-main');
  const [selectedLayerId, setSelectedLayerId] = useState<string>('gsi-geology');

  // Mode Toggles
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [isSplitProspectivity, setIsSplitProspectivity] = useState<boolean>(false);
  const [isFullscreenMap, setIsFullscreenMap] = useState<boolean>(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Active Clicked Feature Attribute Inspection State
  const [clickedFeature, setClickedFeature] = useState<{
    layerId: string;
    layerName: string;
    type: string;
    lat: number;
    lng: number;
    attributes: Record<string, any>;
  } | null>(null);

  // Dynamic API Fetching on Mount
  useEffect(() => {
    fetch('/api/geo-layers')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.layers && Array.isArray(data.layers) && data.layers.length > 0) {
          setLayers(data.layers);
        }
      })
      .catch(() => {});

    fetch('/api/study-areas')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.study_areas && Array.isArray(data.study_areas) && data.study_areas.length > 0) {
          setStudyAreas(data.study_areas);
        }
      })
      .catch(() => {});
  }, []);

  const activeStudyArea = studyAreas.find((s) => s.id === selectedStudyAreaId) || studyAreas[0];
  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || layers[0];

  // Group Layers by Category
  const categories = Array.from(new Set(layers.map((l) => l.category)));

  const toggleCategoryCollapse = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleLayerVisibility = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  };

  const handleOpacityChange = (id: string, val: number) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, opacity: val } : l))
    );
  };

  // Presets Handler
  const applyPreset = (presetName: 'geology' | 'remote' | 'exploration' | 'drill') => {
    setLayers((prev) =>
      prev.map((l) => {
        if (presetName === 'geology') {
          return {
            ...l,
            visible: ['gsi-geology', 'structural-lineaments', 'known-occurrences', 'mine-boundaries'].includes(l.id)
          };
        } else if (presetName === 'remote') {
          return {
            ...l,
            visible: ['sentinel2-rgb', 'sentinel1-sar', 'cem-anomaly', 'dem-elevation'].includes(l.id)
          };
        } else if (presetName === 'exploration') {
          return {
            ...l,
            visible: ['gsi-geology', 'geochemistry-mn', 'geophysics-gravity', 'known-occurrences', 'dem-elevation'].includes(l.id)
          };
        } else {
          return {
            ...l,
            visible: ['prospectivity-ai', 'known-occurrences', 'gsi-geology', 'mine-boundaries'].includes(l.id)
          };
        }
      })
    );
  };

  // Feature Click Simulation on Canvas Map
  const handleMapCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Relative Lat/Lng mapping inside active study area bounds
    const bounds = activeStudyArea.bounds;
    const lng = bounds[0] + (x / rect.width) * (bounds[2] - bounds[0]);
    const lat = bounds[3] - (y / rect.height) * (bounds[3] - bounds[1]);

    if (selectedLayer.id === 'gsi-geology') {
      setClickedFeature({
        layerId: selectedLayer.id,
        layerName: selectedLayer.name,
        type: 'Metasedimentary Formation',
        lat: Number(lat.toFixed(4)),
        lng: Number(lng.toFixed(4)),
        attributes: {
          'Formation': 'Mansar Formation (Sausar Group)',
          'Lithology': 'Muscovite-Biotite Schist & Manganiferous Quartzite',
          'Mn Grade Potential': 'HIGH (Contains Gondite Horizon)',
          'Structural Dip': '65° SSE (Synclinal Limb)',
          'Age Era': 'Paleoproterozoic (~2.0 Ga)',
          'GSI Mapping Unit': 'SAUSAR-MANSAR-01'
        }
      });
    } else if (selectedLayer.id === 'geochemistry-mn') {
      setClickedFeature({
        layerId: selectedLayer.id,
        layerName: selectedLayer.name,
        type: 'Outcrop XRF Assay',
        lat: Number(lat.toFixed(4)),
        lng: Number(lng.toFixed(4)),
        attributes: {
          'Sample ID': 'BAL-NGCM-042',
          'MnO (%)': '34.80%',
          'Fe2O3 (%)': '14.20%',
          'SiO2 (%)': '26.50%',
          'P (%)': '0.18%',
          'Sample Method': 'Certified Outcrop Grab XRF',
          'Depth': '0.5 meters (Surface Outcrop)'
        }
      });
    } else if (selectedLayer.id === 'known-occurrences') {
      setClickedFeature({
        layerId: selectedLayer.id,
        layerName: selectedLayer.name,
        type: 'Manganese Deposit',
        lat: Number(lat.toFixed(4)),
        lng: Number(lng.toFixed(4)),
        attributes: {
          'Deposit Name': 'Balaghat Underground Stope Extension',
          'Ore Type': 'Braunite / Hollandite Ore Lens',
          'Mn Purity': '38.5% Mn Metallurgical Grade',
          'Operating Level': '-385m RL Datum',
          'Status': 'ACTIVE PRODUCING STOPE'
        }
      });
    } else {
      setClickedFeature({
        layerId: selectedLayer.id,
        layerName: selectedLayer.name,
        type: selectedLayer.type,
        lat: Number(lat.toFixed(4)),
        lng: Number(lng.toFixed(4)),
        attributes: {
          'Layer ID': selectedLayer.id,
          'CRS': selectedLayer.crs,
          'Resolution': selectedLayer.resolution || 'Vector Grid',
          'Value at Coordinates': '0.842 (High Anomaly Response)',
          'Source': selectedLayer.source
        }
      });
    }
  };

  const visibleLayers = layers.filter((l) => l.visible);

  return (
    <div className={`space-y-6 ${isFullscreenMap ? 'fixed inset-0 z-50 bg-[#0B4F8A] p-6 overflow-y-auto' : ''}`}>
      {/* ── HEADER & SCIENTIFIC SUBTITLE ─────────────────────────────────────── */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#0B4F8A] text-[#F28C28] flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-serif font-bold text-slate-900 tracking-tight">
              GEO LAYERS
            </h2>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-orange-100 text-orange-900 border border-orange-300">
              Location-Aware Spatial GIS
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Explore the spatial evidence layers contributing to manganese exploration intelligence.
          </p>
        </div>

        {/* Top Control Bar: Study Area AOI Selector & Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded border border-slate-300 text-xs">
            <MapPin className="w-3.5 h-3.5 text-[#F28C28]" />
            <span className="font-bold text-slate-700">Study Area:</span>
            <select
              value={selectedStudyAreaId}
              onChange={(e) => setSelectedStudyAreaId(e.target.value)}
              className="bg-transparent font-semibold text-slate-900 focus:outline-none cursor-pointer"
            >
              {studyAreas.map((sa) => (
                <option key={sa.id} value={sa.id}>
                  {sa.name} ({sa.region})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Presets */}
          <div className="hidden xl:flex items-center gap-1 pl-2 border-l border-slate-200 text-xs">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase mr-1">Presets:</span>
            <button
              onClick={() => applyPreset('geology')}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-300 transition text-[11px]"
            >
              Geology
            </button>
            <button
              onClick={() => applyPreset('remote')}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-300 transition text-[11px]"
            >
              Remote Sensing
            </button>
            <button
              onClick={() => applyPreset('exploration')}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-300 transition text-[11px]"
            >
              Evidence
            </button>
            <button
              onClick={() => applyPreset('drill')}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-300 transition text-[11px]"
            >
              Drill Plan
            </button>
          </div>
        </div>
      </div>

      {/* ── MODE ACTIONS BAR (COMPARE EVIDENCE & PROSPECTIVITY SPLIT) ──────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B4F8A] text-white p-3 rounded-lg border border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCompareMode(!isCompareMode)}
            className={`px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5 ${
              isCompareMode
                ? 'bg-[#F28C28] text-slate-950 shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>{isCompareMode ? 'Exit Compare Mode' : 'Compare Evidence'}</span>
          </button>

          <button
            onClick={() => setIsSplitProspectivity(!isSplitProspectivity)}
            className={`px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5 ${
              isSplitProspectivity
                ? 'bg-[#F28C28] text-slate-950 shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSplitProspectivity ? 'Single Map View' : 'Compare with Prospectivity'}</span>
          </button>

          <button
            onClick={() => setIsFullscreenMap(!isFullscreenMap)}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium transition border border-slate-700 flex items-center gap-1.5"
          >
            {isFullscreenMap ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreenMap ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span>Active Layers Overlaying:</span>
          <span className="font-bold text-[#F28C28]">{visibleLayers.length} / {layers.length}</span>
          <span className="text-slate-600">|</span>
          <span>CRS: <strong className="text-slate-200">EPSG:4326</strong></span>
        </div>
      </div>

      {/* ── COMPARE EVIDENCE ACTIVE CHIP STRIP ──────────────────────────────── */}
      {isCompareMode && (
        <div className="bg-orange-950/40 border border-orange-800/80 p-3 rounded-lg text-xs space-y-2 text-orange-200 animate-in fade-in duration-150">
          <div className="flex justify-between items-center font-bold">
            <span className="flex items-center gap-1.5 text-orange-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Channel Evidence Fusion Active</span>
            </span>
            <span className="text-[10px] font-mono text-orange-400">{visibleLayers.length} Active Channels Selected</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {visibleLayers.map((l) => (
              <span key={l.id} className="px-2.5 py-1 rounded bg-[#0B4F8A] border border-orange-500/40 text-[#F28C28] text-[11px] font-mono font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{l.name}</span>
                <span className="text-[9px] text-slate-400">({Math.round(l.opacity * 100)}%)</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN 3-COLUMN GIS WORKSPACE ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT COLUMN: CATEGORIZED LAYER CONTROL PANEL ─────────────────────── */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[750px]">
          <div className="p-4 bg-[#0B4F8A] text-white border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#F28C28]" />
              <span className="font-serif font-bold text-sm">Spatial Layer Control</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
              {layers.length} Layers
            </span>
          </div>

          <div className="p-3 overflow-y-auto space-y-4 flex-1 font-sans text-xs">
            {categories.map((cat) => {
              const catLayers = layers.filter((l) => l.category === cat);
              const isCollapsed = !!collapsedCategories[cat];

              return (
                <div key={cat} className="space-y-2 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategoryCollapse(cat)}
                    className="w-full flex items-center justify-between text-[11px] font-mono font-bold uppercase text-slate-500 hover:text-slate-900 transition py-1"
                  >
                    <span>{cat}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 font-normal">({catLayers.length})</span>
                      {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                  </button>

                  {/* Layer Items */}
                  {!isCollapsed && (
                    <div className="space-y-2 pl-1">
                      {catLayers.map((layer) => {
                        const isSelected = selectedLayerId === layer.id;

                        return (
                          <div
                            key={layer.id}
                            className={`p-2.5 rounded-lg border transition ${
                              isSelected
                                ? 'bg-slate-900 text-white border-slate-800 shadow-xs'
                                : layer.visible
                                ? 'bg-slate-50 border-slate-200 text-slate-900'
                                : 'bg-slate-100/60 border-slate-200 opacity-60 text-slate-600'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              {/* Visibility Checkbox & Selection */}
                              <div className="flex items-start gap-2 flex-1 cursor-pointer" onClick={() => setSelectedLayerId(layer.id)}>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLayerVisibility(layer.id);
                                  }}
                                  className="mt-0.5 text-slate-400 hover:text-[#F28C28] transition"
                                >
                                  {layer.visible ? (
                                    <Eye className="w-4 h-4 text-emerald-500" />
                                  ) : (
                                    <EyeOff className="w-4 h-4 text-slate-400" />
                                  )}
                                </button>

                                <div className="space-y-0.5">
                                  <span className={`font-semibold text-xs block leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                    {layer.name}
                                  </span>
                                  <div className="flex items-center gap-2 text-[10px] font-mono opacity-80">
                                    <span className="uppercase text-[#F28C28] font-bold">{layer.type}</span>
                                    {layer.resolution && <span>• {layer.resolution}</span>}
                                  </div>
                                </div>
                              </div>

                              {/* Inspect Button */}
                              <button
                                onClick={() => setSelectedLayerId(layer.id)}
                                className={`p-1 rounded text-[10px] transition ${
                                  isSelected ? 'bg-[#F28C28] text-slate-950 font-bold' : 'hover:bg-slate-200 text-slate-500'
                                }`}
                                title="Inspect Layer Metadata"
                              >
                                <Info className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Opacity Slider */}
                            {layer.visible && (
                              <div className="mt-2 pt-2 border-t border-slate-200/40 flex items-center gap-2 text-[10px] font-mono">
                                <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>Opacity:</span>
                                <input
                                  type="range"
                                  min="0"
                                  max="1"
                                  step="0.05"
                                  value={layer.opacity}
                                  onChange={(e) => handleOpacityChange(layer.id, parseFloat(e.target.value))}
                                  className="w-full accent-[#F28C28] cursor-pointer h-1 bg-slate-200 rounded"
                                />
                                <span className={`font-bold w-7 text-right ${isSelected ? 'text-[#F28C28]' : 'text-slate-700'}`}>
                                  {Math.round(layer.opacity * 100)}%
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CENTER COLUMN: INTERACTIVE LOCATION-SPECIFIC GIS MAP ─────────────── */}
        <div className={`${isSplitProspectivity ? 'lg:col-span-6' : 'lg:col-span-6'} space-y-4`}>
          <div className="bg-[#0B4F8A] rounded-xl border border-slate-800 shadow-xl overflow-hidden relative">
            {/* Map Top Bar */}
            <div className="p-3 border-b border-slate-800 bg-[#083B67] flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2 font-mono">
                <MapPin className="w-4 h-4 text-[#F28C28]" />
                <span className="font-bold">{activeStudyArea.name}</span>
                <span className="text-slate-400">({activeStudyArea.center[0]}° N, {activeStudyArea.center[1]}° E)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setClickedFeature(null)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium transition"
                >
                  Clear Selection
                </button>
                <button
                  onClick={() => {
                    setLayers(DEFAULT_GEO_LAYERS);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[#F28C28] text-[10px] font-bold transition flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Layers</span>
                </button>
              </div>
            </div>

            {/* Interactive Canvas Map Container */}
            <div
              className="w-full h-[520px] relative bg-slate-950 cursor-crosshair overflow-hidden group select-none"
              onClick={handleMapCanvasClick}
            >
              {/* Synthetic Map Vector Grid & Satellite Layer Simulation */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity filter contrast-125 transition-all duration-300"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1800&q=80')`
                }}
              />

              {/* Dynamic Visible Spatial Layer Stack Render */}
              {visibleLayers.map((l, idx) => {
                let colorClass = 'border-orange-500/50 bg-orange-500/10';
                if (l.category === 'GEOLOGY') colorClass = 'border-purple-500/60 bg-purple-500/15';
                if (l.category === 'GEOCHEMISTRY') colorClass = 'border-emerald-500/80 bg-emerald-500/20';
                if (l.category === 'MINERALIZATION') colorClass = 'border-red-500/80 bg-red-500/25';
                if (l.category === 'AI OUTPUTS') colorClass = 'border-[#F28C28] bg-[#F28C28]/20';

                return (
                  <div
                    key={l.id}
                    className={`absolute inset-4 rounded border-2 transition-all pointer-events-none ${colorClass}`}
                    style={{
                      opacity: l.opacity,
                      transform: `scale(${1 - idx * 0.015})`,
                    }}
                  />
                );
              })}

              {/* Map Coordinate Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

              {/* Selected Feature Pin */}
              {clickedFeature && (
                <div 
                  className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 animate-bounce"
                  style={{ top: '45%', left: '55%' }}
                >
                  <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-xs shadow-lg border-2 border-white">
                    📍
                  </div>
                </div>
              )}

              {/* In-Map Instructions */}
              <div className="absolute top-4 left-4 z-20 bg-slate-900/90 border border-slate-800 text-white p-2.5 rounded shadow-lg text-[11px] space-y-1">
                <span className="font-bold text-[#F28C28] block uppercase font-mono">MAP INTERACTION</span>
                <p className="text-slate-300">Click anywhere on the map grid to inspect vector/raster attributes at coordinates.</p>
              </div>

              {/* Scale & Active AOI Footer Badge */}
              <div className="absolute bottom-4 right-4 z-20 bg-slate-900/90 border border-slate-800 text-slate-300 px-3 py-1.5 rounded font-mono text-[10px] space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold text-white">EPSG:4326 Datum</span>
                </div>
                <div>Bounds: [{activeStudyArea.bounds.join(', ')}]</div>
              </div>
            </div>

            {/* Dynamic Map Legend Footer Bar */}
            <div className="p-3 border-t border-slate-800 bg-[#083B67] text-white text-xs font-mono flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <span className="font-bold text-slate-400 uppercase">LEGEND:</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-purple-500/80 border border-purple-300" />
                  <span>Sausar Geology</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-500/80 border border-emerald-300" />
                  <span>GSI Assays</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-red-500/80 border border-red-300" />
                  <span>Confirmed Deposits</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#F28C28]/80 border border-orange-300" />
                  <span>AI Prospectivity</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: SELECTED LAYER METADATA & FEATURE INSPECTION PANEL ─── */}
        <div className="lg:col-span-3 space-y-6">
          {/* 1. Selected Layer Metadata Panel */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#0B4F8A]" />
                <h3 className="font-serif font-bold text-sm text-slate-900">Layer Metadata</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-slate-100 text-slate-700 border border-slate-300">
                {selectedLayer.type}
              </span>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div>
                <span className="font-bold text-slate-900 text-sm block">{selectedLayer.name}</span>
                <span className="text-[11px] text-slate-500 font-mono block mt-0.5">{selectedLayer.source}</span>
              </div>

              <p className="text-slate-600 leading-snug text-xs">{selectedLayer.description}</p>

              {/* Data Statistics Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[9px] uppercase">CRS</span>
                  <span className="font-bold text-slate-900">{selectedLayer.crs}</span>
                </div>

                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[9px] uppercase">Resolution / Type</span>
                  <span className="font-bold text-slate-900">{selectedLayer.resolution || selectedLayer.type}</span>
                </div>

                {selectedLayer.feature_count !== null && (
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase">Feature Count</span>
                    <span className="font-bold text-slate-900">{selectedLayer.feature_count} Features</span>
                  </div>
                )}

                {selectedLayer.coverage_pct !== undefined && (
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase">AOI Coverage</span>
                    <span className="font-bold text-emerald-700">{selectedLayer.coverage_pct}%</span>
                  </div>
                )}

                {selectedLayer.min_val !== undefined && (
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase">Min - Max Value</span>
                    <span className="font-bold text-slate-900">{selectedLayer.min_val} to {selectedLayer.max_val}</span>
                  </div>
                )}
              </div>

              {/* Available Fields Checklist */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Available Attributes / Fields:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedLayer.fields.map((f) => (
                    <span key={f} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-mono">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Provenance Details */}
              <div className="pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-500 space-y-1">
                <span className="font-bold text-slate-700 block uppercase">Provenance & Lineage:</span>
                {Object.entries(selectedLayer.provenance).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="capitalize">{k.replace('_', ' ')}:</span>
                    <span className="font-semibold text-slate-900">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Interactive Clicked Feature Inspector Drawer */}
          {clickedFeature ? (
            <div className="bg-[#0B4F8A] text-white rounded-xl border border-slate-800 p-5 space-y-3 shadow-lg animate-in fade-in duration-150">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#F28C28]" />
                  <span className="font-serif font-bold text-sm text-white">Clicked Feature Inspector</span>
                </div>
                <button onClick={() => setClickedFeature(null)} className="text-slate-400 hover:text-white text-xs">
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-400">Coordinates:</span>
                  <span className="font-bold text-[#F28C28]">{clickedFeature.lat}° N, {clickedFeature.lng}° E</span>
                </div>

                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Feature Attributes:</span>
                  {Object.entries(clickedFeature.attributes).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-[11px] border-b border-slate-800/60 pb-1 last:border-0">
                      <span className="text-slate-400">{k}:</span>
                      <span className="font-semibold text-white font-mono">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-500 space-y-1">
              <Compass className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="font-semibold text-slate-700">No Map Feature Selected</p>
              <p className="text-[11px]">Click anywhere on the interactive GIS map to inspect vector/raster attribute properties.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
