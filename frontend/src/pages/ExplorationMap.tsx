import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Map } from '../components/Map';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { TargetDrawer, TargetData } from '../components/TargetDrawer';
import { GeoLayersSection } from '../components/GeoLayersSection';
import { SubsurfaceLayerIntelligence } from '../components/SubsurfaceLayerIntelligence';
import { IndiaManganeseMapSection } from '../components/IndiaManganeseMapSection';
import { workflowApi } from '../services/api';
import { 
  Calendar, Layers, MapPin, Sparkles, 
  CheckSquare, Square, Wrench, Search, ChevronUp, ChevronDown, 
  Plus, Mountain, BarChart3, Target, Clock, ArrowRight, ShieldCheck, Activity,
  Ruler, Download, Upload, Compass, Filter, FileText
} from 'lucide-react';

interface ProspectTarget {
  id: string;
  target_id: string;
  mn_target_code: string;
  name: string;
  score: number;
  area: number;
  status: 'Very High' | 'High' | 'Medium' | 'Low';
  lat: number;
  lng: number;
  predictedGrade: string;
  confidence: number;
  applicability: 'HIGH' | 'MEDIUM' | 'LOW';
  ndvi: number;
  bandRatio: number;
  demSlope: number;
  geologyMatch: string;
  cemAnomaly?: number;
}

const DEFAULT_TARGETS: ProspectTarget[] = [
  {
    id: 'Target-1',
    target_id: 'Target-1',
    mn_target_code: 'MN-TGT-001',
    name: 'Target 1',
    rank: 1,
    priority_level: 'Very High',
    prospectivity_score: 0.92,
    confidence_pct: 86.0,
    applicability: 'HIGH',
    area_sqkm: 12.8,
    latitude: 21.84,
    longitude: 80.72,
    predicted_grade: '28.4% - 34.7% Mn',
    geology_match: 'High (Mansar Formation Quartzite / Mn Ore)',
    recommended_action: 'Priority diamond core verification drillhole recommended at (21.84 N, 80.72 E).',
    evidence: {
      cem_anomaly: 0.88,
      structural_lineament_density: 0.81,
      geophysics_gravity: 0.62,
      geochemistry_mn_ppm: 2840.0,
      sar_polarization_ratio: 0.68,
      dem_slope_deg: 12.6
    },
    scientific_safety_note: 'Priority exploration target - Requires field validation.',
    has_production_data: true
  },
  {
    rank: 2,
    id: 'Target-2',
    target_id: 'Target-2',
    mn_target_code: 'MN-TGT-002',
    name: 'Target 2',
    score: 0.76,
    area: 14.2,
    status: 'High',
    lat: 21.66,
    lng: 79.98,
    predictedGrade: '22.0% - 28.5% Mn',
    confidence: 79,
    applicability: 'HIGH',
    area_sqkm: 14.2,
    latitude: 21.68,
    longitude: 79.92,
    predicted_grade: '22.0% - 28.5% Mn',
    geology_match: 'Medium (Chorbaoli Formation)',
    recommended_action: 'Outcrop geological mapping & geochemical trenching recommended.',
    evidence: {
      cem_anomaly: 0.74,
      structural_lineament_density: 0.69,
      geophysics_gravity: 0.52,
      geochemistry_mn_ppm: 1950.0,
      sar_polarization_ratio: 0.58,
      dem_slope_deg: 9.8
    },
    scientific_safety_note: 'Priority exploration target - Requires field validation.',
    has_production_data: true
  },
  {
    rank: 3,
    id: 'Target-3',
    name: 'Target 3',
    score: 0.87,
    area: 10.4,
    status: 'Very High',
    lat: 21.83,
    lng: 79.78,
    predictedGrade: '26.1% - 32.0% Mn',
    confidence: 84,
    applicability: 'HIGH',
    ndvi: 0.64,
    bandRatio: 1.98,
    demSlope: 11.2,
    geologyMatch: 'High (Tirodi Gneiss)',
    cemAnomaly: 0.82,
  },
  {
    rank: 4,
    id: 'Target-4',
    target_id: 'Target-4',
    mn_target_code: 'MN-TGT-004',
    name: 'Target 4',
    score: 0.69,
    area: 9.7,
    status: 'High',
    lat: 21.56,
    lng: 80.32,
    predictedGrade: '19.5% - 24.8% Mn',
    confidence: 74,
    applicability: 'MEDIUM',
    area_sqkm: 9.7,
    latitude: 21.62,
    longitude: 80.31,
    predicted_grade: '19.5% - 24.8% Mn',
    geology_match: 'Medium (Sausar Group Contact)',
    recommended_action: 'Ground magnetics survey to resolve structural uncertainty.',
    evidence: {
      cem_anomaly: 0.61,
      structural_lineament_density: 0.62,
      geophysics_gravity: 0.48,
      geochemistry_mn_ppm: 1620.0,
      sar_polarization_ratio: 0.52,
      dem_slope_deg: 8.4
    },
    scientific_safety_note: 'Priority exploration target - Requires field validation.',
    has_production_data: false
  },
];

export const ExplorationMap: React.FC = () => {
  const navigate = useNavigate();

  // Header Dropdowns State (Defaults match exact screenshot: Nagpur Extension Belt & Dec 2024)
  const [selectedAOI, setSelectedAOI] = useState('Nagpur Extension Belt');
  const [selectedDate, setSelectedDate] = useState('Dec 2024');

  // Layer Toggles State (Only CEM Spectral Anomaly checked by default as seen in screenshot)
  const [activeLayers, setActiveLayers] = useState({
    cem: true,
    sentinel2: false,
    dem: false,
    geology: false,
    occurrences: false,
    lineaments: false,
  });

  const toggleLayer = (layerKey: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Target Selection State (Default Target 1 matching image)
  const [selectedTargetId, setSelectedTargetId] = useState('Target-1');
  const selectedTarget = PROSPECT_TARGETS.find(t => t.id === selectedTargetId) || PROSPECT_TARGETS[0];

  // Left Sidebar Accordion & Tab State
  const [sidebarTab, setSidebarTab] = useState<'layers' | 'tools'>('layers');
  const [layerSearch, setLayerSearch] = useState('');
  const [aiLayersOpen, setAiLayersOpen] = useState(true);
  const [refLayersOpen, setRefLayersOpen] = useState(true);
  const [baseMapsOpen, setBaseMapsOpen] = useState(true);

  // Right Sidebar Accordion State
  const [areaInsightsOpen, setAreaInsightsOpen] = useState(true);

  // Custom Layer Modal State
  const [isAddLayerOpen, setIsAddLayerOpen] = useState(false);
  const [customLayerName, setCustomLayerName] = useState('');

  // AI Prospectivity Layers List definition
  const aiLayerItems: Array<{ key: keyof typeof activeLayers; label: string }> = [
    { key: 'cem', label: 'CEM Spectral Anomaly' },
    { key: 'sentinel2', label: 'Sentinel-2 Satellite' },
    { key: 'dem', label: 'SRTM DEM Slope' },
    { key: 'geology', label: 'GSI Geology' },
    { key: 'occurrences', label: 'Mn Positives' },
    { key: 'lineaments', label: 'Structural Lineaments' },
  ];

  const filteredAiLayers = aiLayerItems.filter(item => 
    item.label.toLowerCase().includes(layerSearch.toLowerCase())
  );

  return (
    <div className="w-full bg-[#F4F6F9] text-slate-900 min-h-screen py-3 px-4 md:px-8 space-y-3 font-sans">
      
      {/* Green Scientific Pipeline Banner matching Screenshot */}
      <PrototypeBadge 
        type="banner" 
        isReal={true} 
        message="MNEXPLORE — Multi-Source Earth Observation & AI Prospectivity Analysis (Balaghat Manganese Belt)" 
      />

      {/* ------------------------------------------------ */}
      {/* 1. PAGE SUB-HEADER TITLE & SELECTORS BAR          */}
      {/* ------------------------------------------------ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#003366] text-white flex flex-col items-center justify-center font-bold text-[10px] border-2 border-amber-400 shrink-0 shadow-xs">
            <span className="text-amber-300 font-extrabold text-[9px]">MOIL</span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#003366] tracking-tight font-serif flex items-center gap-2">
              <span>Manganese Prospectivity GIS Portal</span>
              <span className="text-[10px] font-sans font-bold bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>% CEM + PU/Learning</span>
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              MOIL AI-driven multi-source evidence fusion (Sentinel-1/2, SRTM DEM, GSI Geochemistry & CEM Spectral Target Detection)
            </p>
          </div>
        </div>

        {/* Right Dropdowns: AOI Region & Date Picker */}
        <div className="flex items-center gap-2.5 text-xs">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-lg text-slate-800 shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-[#003366] shrink-0" />
            <select 
              value={selectedAOI}
              onChange={(e) => setSelectedAOI(e.target.value)}
              className="bg-transparent border-none text-xs font-extrabold text-[#003366] focus:outline-none cursor-pointer"
            >
              <option value="Nagpur Extension Belt">Nagpur Extension Belt</option>
              <option value="Balaghat Manganese Belt (MP)">Balaghat Manganese Belt (MP)</option>
              <option value="Bhandara District Sector">Bhandara District Sector</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-lg text-slate-800 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-[#003366] shrink-0" />
            <select 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none text-xs font-extrabold text-[#003366] focus:outline-none cursor-pointer"
            >
              <option value="Dec 2024">Dec 2024</option>
              <option value="Nov 2024">Nov 2024</option>
              <option value="Oct 2024">Oct 2024</option>
            </select>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* 2. MAIN 3-COLUMN ENTERPRISE GIS GRID             */}
      {/* ------------------------------------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

        {/* ================================================ */}
        {/* COLUMN 1: LEFT SIDEBAR (LAYERS & TOOLS)          */}
        {/* ================================================ */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-3">
          
          {/* Top Tabs: Layers vs Tools */}
          <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setSidebarTab('layers')}
              className={`py-1.5 px-3 rounded-md font-extrabold text-xs transition flex items-center justify-center gap-1.5 ${
                sidebarTab === 'layers' 
                  ? 'bg-[#003366] text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Layers</span>
            </button>
            <button
              onClick={() => setSidebarTab('tools')}
              className={`py-1.5 px-3 rounded-md font-extrabold text-xs transition flex items-center justify-center gap-1.5 ${
                sidebarTab === 'tools' 
                  ? 'bg-[#003366] text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Tools</span>
            </button>
          </div>

          {sidebarTab === 'layers' ? (
            <>
              {/* Search Layers Input */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 px-2.5 py-1.5 rounded-lg text-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search layers..."
                  value={layerSearch}
                  onChange={(e) => setLayerSearch(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-400 font-medium"
                />
              </div>

              {/* Layer List Accordions */}
              <div className="space-y-3 text-xs">

                {/* Accordion 1: AI Prospectivity Layers */}
                <div className="border-b border-slate-100 pb-2">
                  <button
                    onClick={() => setAiLayersOpen(!aiLayersOpen)}
                    className="w-full flex items-center justify-between font-extrabold text-[#003366] py-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-[#003366]" />
                      <span>AI Prospectivity Layers</span>
                    </div>
                    {aiLayersOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {aiLayersOpen && (
                    <div className="mt-1.5 space-y-1.5 pl-1 font-semibold text-slate-700">
                      {filteredAiLayers.map(item => (
                        <div 
                          key={item.key}
                          onClick={() => toggleLayer(item.key)} 
                          className="flex items-center gap-2.5 cursor-pointer hover:text-[#003366] transition py-0.5"
                        >
                          {activeLayers[item.key] ? (
                            <CheckSquare className="w-4 h-4 text-[#003366] shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className={activeLayers[item.key] ? "text-[#003366] font-bold" : "text-slate-700"}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Accordion 2: Reference Layers */}
                <div className="border-b border-slate-100 pb-2">
                  <button
                    onClick={() => setRefLayersOpen(!refLayersOpen)}
                    className="w-full flex items-center justify-between font-extrabold text-slate-700 py-1 text-left hover:text-[#003366]"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reference Layers</span>
                    </div>
                    {refLayersOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  {refLayersOpen && (
                    <div className="mt-2">
                      <select className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-800 outline-none cursor-pointer">
                        <option>AOI & Boundaries</option>
                        <option>Mining Lease Areas</option>
                        <option>Administrative Zones</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Accordion 3: Base Maps */}
                <div className="pb-1">
                  <button
                    onClick={() => setBaseMapsOpen(!baseMapsOpen)}
                    className="w-full flex items-center justify-between font-extrabold text-slate-700 py-1 text-left hover:text-[#003366]"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>Base Maps</span>
                    </div>
                    {baseMapsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

              </div>

              {/* Add Custom Layer CTA */}
              <button 
                onClick={() => setIsAddLayerOpen(true)}
                className="w-full py-2 bg-white hover:bg-slate-50 text-[#003366] font-extrabold rounded-lg text-xs transition border border-[#003366] flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom Layer</span>
              </button>
            </>
          ) : (
            /* Tools Sidebar Tab Content */
            <div className="space-y-3 text-xs">
              <div className="font-extrabold text-[#003366] border-b pb-1.5 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                <span>GIS Spatial Utilities</span>
              </div>

              <button className="w-full p-2 rounded bg-slate-50 border border-slate-200 hover:bg-blue-50 text-slate-700 text-left flex items-center gap-2 font-semibold">
                <Ruler className="w-4 h-4 text-[#003366]" />
                <div>
                  <div className="font-bold">Measure Distance & Area</div>
                  <div className="text-[10px] text-slate-500">Calculate spatial length & perimeter</div>
                </div>
              </button>

              <button className="w-full p-2 rounded bg-slate-50 border border-slate-200 hover:bg-blue-50 text-slate-700 text-left flex items-center gap-2 font-semibold">
                <Compass className="w-4 h-4 text-[#003366]" />
                <div>
                  <div className="font-bold">Coordinate Converter</div>
                  <div className="text-[10px] text-slate-500">EPSG:4326 to UTM 44N projection</div>
                </div>
              </button>

              <button className="w-full p-2 rounded bg-slate-50 border border-slate-200 hover:bg-blue-50 text-slate-700 text-left flex items-center gap-2 font-semibold">
                <Download className="w-4 h-4 text-[#003366]" />
                <div>
                  <div className="font-bold">Export GeoTIFF / GeoJSON</div>
                  <div className="text-[10px] text-slate-500">Download prospectivity raster bounds</div>
                </div>
              </button>
            </div>
          )}

        </div>

        {/* ================================================ */}
        {/* COLUMN 2: CENTER MAP & COMPACT KPI BAR           */}
        {/* ================================================ */}
        <div className="lg:col-span-6 space-y-3">
          
          {/* Main Map Box */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs relative min-h-[480px]">
            <Map 
              activeLayers={{
                cem: activeLayers.cem,
                sentinel2: activeLayers.sentinel2,
                dem: activeLayers.dem,
                geology: activeLayers.geology,
                occurrences: activeLayers.occurrences,
                lineaments: activeLayers.lineaments,
              }}
              selectedTarget={selectedTargetId}
              onMarkerClick={(targetId) => setSelectedTargetId(targetId)}
            />
          </div>

          {/* Compact KPI Summary Bar (4 Cards directly matching the Screenshot) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-50 text-[#003366]">
                <Mountain className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-bold uppercase block leading-none">TOTAL AOI AREA</span>
                <strong className="text-slate-900 font-mono text-sm font-extrabold mt-1 block">1,247 km²</strong>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-bold uppercase block leading-none">HIGH & VERY HIGH</span>
                <strong className="text-slate-900 font-mono text-sm font-extrabold mt-1 block">449 km² (36%)</strong>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-bold uppercase block leading-none">TARGETS IDENTIFIED</span>
                <strong className="text-slate-900 font-mono text-sm font-extrabold mt-1 block">12</strong>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-bold uppercase block leading-none">LAST UPDATED</span>
                <strong className="text-slate-900 font-mono text-sm font-extrabold mt-1 block">Dec 2024</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================ */}
        {/* COLUMN 3: RIGHT SIDEBAR (TARGET INSPECTOR CARD)  */}
        {/* MATCHING media_1789639729431.png EXACTLY         */}
        {/* ================================================ */}
        <div className="lg:col-span-3 space-y-3">

          {/* TARGET INSPECTOR CARD */}
          <div className="bg-[#091527] text-white rounded-2xl border border-slate-800 p-4 shadow-2xl space-y-4 font-sans relative">
            {/* Target Selector Dropdown Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full animate-pulse shadow-md ${
                  selectedTarget.status === 'Very High' ? 'bg-red-600 shadow-red-600/50' : 'bg-orange-500 shadow-orange-500/50'
                }`} />
                <h3 className="text-base font-bold font-serif text-white tracking-tight flex items-center gap-1.5">
                  <span>{selectedTarget.name}</span>
                </h3>
              </div>

              <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${
                selectedTarget.status === 'Very High'
                  ? 'bg-red-950/80 border-red-800 text-red-300'
                  : 'bg-orange-950/80 border-orange-800 text-orange-300'
              }`}>
                {selectedTarget.status} Priority
              </span>
            </div>

            {/* Navigation Tabs (Overview active with blue underline) */}
            <div className="flex items-center gap-4 text-xs font-semibold border-b border-slate-800/80 pb-2 text-slate-400">
              <button className="text-blue-400 font-extrabold border-b-2 border-blue-500 pb-1.5 -mb-2.5">Overview</button>
              <button className="hover:text-slate-200 transition">Satellite Indices</button>
              <button className="hover:text-slate-200 transition">Geology</button>
              <button className="hover:text-slate-200 transition">Drilling</button>
            </div>

            {/* Top Details Section: Satellite Thumbnail Image + Metrics List */}
            <div className="grid grid-cols-12 gap-3 items-center pt-1">
              {/* Left: Satellite Thumbnail image with red anomaly overlay */}
              <div className="col-span-5 relative rounded-xl overflow-hidden border border-slate-700/80 shadow-lg aspect-square group">
                <img
                  src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/13/3561/5712"
                  alt="Target Satellite View"
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                {/* Red Anomaly Contour Ring Overlay matching image */}
                <svg className="absolute inset-0 w-full h-full p-2.5" viewBox="0 0 100 100">
                  <ellipse cx="50" cy="50" rx="38" ry="24" fill="rgba(220, 38, 38, 0.40)" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="3 2" transform="rotate(-25 50 50)" />
                  <ellipse cx="50" cy="50" rx="20" ry="12" fill="rgba(239, 68, 68, 0.75)" stroke="#DC2626" strokeWidth="2" transform="rotate(-25 50 50)" />
                </svg>
              </div>

              {/* Right: Key Metrics List matching image */}
              <div className="col-span-7 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px]">Location</span>
                  <strong className="font-mono text-slate-100 text-[11px]">{selectedTarget.lat.toFixed(2)}° N, {selectedTarget.lng.toFixed(2)}° E</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px]">Area</span>
                  <strong className="font-mono text-slate-100 text-[11px]">{selectedTarget.area} km²</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px]">Avg. Prospectivity Score</span>
                  <strong className="font-mono text-slate-100 font-extrabold text-xs">{selectedTarget.score.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px]">Predicted Grade (AI)</span>
                  <strong className="font-mono text-slate-100 text-[11px]">{selectedTarget.predictedGrade}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px]">Confidence</span>
                  <strong className="font-mono text-slate-100 text-[11px]">{selectedTarget.confidence}%</strong>
                </div>
              </div>
            </div>

            {/* Key Indicators Grid (4 Cards matching image) */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
                <span>Key Indicators</span>
                <span className="text-slate-400 font-bold">→</span>
              </span>

              <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                {/* Card 1: NDVI */}
                <div className="bg-[#07182C] p-2 rounded-xl border border-slate-800 space-y-1 flex flex-col justify-between">
                  <div className="flex items-center justify-center gap-1 text-[9px] text-slate-300">
                    <span className="w-3 h-3 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[8px] font-black border border-emerald-500/50">✓</span>
                    <span className="font-bold">NDVI</span>
                  </div>
                  <strong className="font-mono text-slate-100 font-extrabold text-xs block">{selectedTarget.ndvi}</strong>
                </div>

                {/* Card 2: Band Ratio */}
                <div className="bg-[#07182C] p-2 rounded-xl border border-slate-800 space-y-1 flex flex-col justify-between">
                  <div className="flex items-center justify-center gap-1 text-[8px] text-slate-300">
                    <Mountain className="w-3 h-3 text-cyan-400" />
                    <span className="font-bold leading-none">Band Ratio</span>
                  </div>
                  <strong className="font-mono text-slate-100 font-extrabold text-xs block">{selectedTarget.bandRatio}</strong>
                </div>

                {/* Card 3: DEM Slope */}
                <div className="bg-[#07182C] p-2 rounded-xl border border-slate-800 space-y-1 flex flex-col justify-between">
                  <div className="flex items-center justify-center gap-1 text-[8px] text-slate-300">
                    <Activity className="w-3 h-3 text-amber-400" />
                    <span className="font-bold leading-none">DEM Slope</span>
                  </div>
                  <strong className="font-mono text-slate-100 font-extrabold text-xs block">{selectedTarget.demSlope}°</strong>
                </div>

                {/* Card 4: Geology Match */}
                <div className="bg-[#07182C] p-2 rounded-xl border border-slate-800 space-y-1 flex flex-col justify-between">
                  <div className="flex items-center justify-center gap-1 text-[8px] text-slate-300">
                    <ShieldCheck className="w-3 h-3 text-purple-400" />
                    <span className="font-bold leading-none">Geology</span>
                  </div>
                  <strong className="font-sans text-slate-100 font-extrabold text-xs block truncate" title={selectedTarget.geologyMatch}>High</strong>
                </div>
              </div>
            </div>

            {/* Target Selection Switcher */}
            <div className="flex items-center justify-between text-xs bg-[#07182C] p-2 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] font-semibold">Switch Target:</span>
              <select
                value={selectedTargetId}
                onChange={(e) => setSelectedTargetId(e.target.value)}
                className="bg-[#0B192C] border border-slate-700 rounded text-xs font-bold text-amber-400 px-2 py-1 outline-none cursor-pointer"
              >
                {PROSPECT_TARGETS.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.status} Priority)</option>
                ))}
              </select>
            </div>

            {/* Full Width Action Button */}
            <button
              onClick={() => navigate(`/exploration/${selectedTarget.id}`)}
              className="w-full py-3 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-xl transition shadow-xl flex items-center justify-center gap-2 border border-blue-400/30"
            >
              <span>View Detailed Analysis</span>
              <span className="text-amber-400 font-extrabold">→</span>
            </button>
          </div>

        </div>

      </div>

      {/* Add Custom Layer Modal */}
      {isAddLayerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-md p-5 space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-extrabold text-[#003366] text-sm font-serif flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-[#003366]" />
                <span>Add Custom Geospatial Layer</span>
              </h3>
              <button onClick={() => setIsAddLayerOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Layer Name:</label>
                <input 
                  type="text" 
                  placeholder="e.g., Airborne Aeromagnetics 2024"
                  value={customLayerName}
                  onChange={(e) => setCustomLayerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 outline-none font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Upload File (GeoJSON, SHP, KML, GeoTIFF):</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center text-slate-500 bg-slate-50 hover:bg-slate-100 cursor-pointer">
                  <Upload className="w-6 h-6 mx-auto text-[#003366] mb-1" />
                  <span>Click to browse or drag geospatial files here</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button 
                onClick={() => setIsAddLayerOpen(false)} 
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert(`Custom layer "${customLayerName || 'User GeoJSON'}" registered successfully!`);
                  setIsAddLayerOpen(false);
                }} 
                className="px-4 py-1.5 bg-[#003366] text-white font-bold rounded hover:bg-[#002244]"
              >
                Upload Layer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

