import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, MapPin, Layers, Target, Search, ChevronRight, ShieldCheck, 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, BarChart3, Database, Compass, Info, RefreshCw, ZoomIn, ZoomOut
} from 'lucide-react';

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

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mapLayerFilters, setMapLayerFilters] = useState<Record<string, boolean>>({
    occurrences: true,
    prospectivity: true,
    mines: true,
    targets: true
  });

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

  // Handle Drilling Down
  const handleSelectSite = (site: IndiaSite) => {
    setSelectedSite(site);
    setHierarchyLevel(2);
    setSelectedTargetId('T001');
  };

  const handleSelectTarget = (targetId: string) => {
    setSelectedTargetId(targetId);
    setHierarchyLevel(3);
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
              onClick={() => {
                setHierarchyLevel(1);
                setSelectedSite(null);
                setSelectedTargetId(null);
              }}
              className="hover:underline flex items-center gap-1"
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
            From national manganese geochemical distribution to drill-ready exploration targets.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search site, district, state or Target ID (e.g. T001)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#0A1128] w-64 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* ── MAP LAYER TOGGLE & PROVENANCE STRIP ───────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0A1128] text-white p-3 rounded-lg border border-slate-800 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-bold uppercase mr-1">Display Layers:</span>
          <button
            onClick={() => toggleFilter('occurrences')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
              mapLayerFilters.occurrences ? 'bg-[#C5A059] text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            ◆ Occurrences ({sites.reduce((acc, s) => acc + s.occurrences_count, 0)})
          </button>
          <button
            onClick={() => toggleFilter('prospectivity')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
              mapLayerFilters.prospectivity ? 'bg-[#C5A059] text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            ░ AI Geochemical Heatmap
          </button>
          <button
            onClick={() => toggleFilter('mines')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
              mapLayerFilters.mines ? 'bg-[#C5A059] text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            ● Active MOIL Mines ({sites.filter(s => s.status === 'PRODUCING_MINE').length})
          </button>
          <button
            onClick={() => toggleFilter('targets')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
              mapLayerFilters.targets ? 'bg-[#C5A059] text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            △ Exploration Targets
          </button>
        </div>

        <div className="text-[10px] text-slate-400 italic">
          Coverage based on GSI NGCM Geochemistry Assays & MOIL Mining Inventories
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
                {hierarchyLevel === 1 && 'LEVEL 1: NATIONAL MANGANESE DISTRIBUTION (INDIA GEOSPATIAL MAP)'}
                {hierarchyLevel === 2 && `LEVEL 2: REGIONAL EXPLORATION AREA — ${selectedSite?.name}`}
                {hierarchyLevel === 3 && `LEVEL 3: TARGET EXPLORATION ZONE — ${targetDetail?.mn_target_code || 'T001'}`}
              </span>
            </div>

            {hierarchyLevel > 1 && (
              <button
                onClick={() => {
                  setHierarchyLevel(1);
                  setSelectedSite(null);
                  setSelectedTargetId(null);
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[#C5A059] text-[10px] font-bold transition"
              >
                ← Return to India Map
              </button>
            )}
          </div>

          {/* ── HIGH-FIDELITY GEOGRAPHIC SVG MAP ENGINE (MATCHING REFERENCE SPECIFICATION) ── */}
          <div className="w-full h-[620px] relative bg-[#040814] overflow-hidden select-none">
            <svg
              viewBox="0 0 1000 900"
              className="w-full h-full object-contain filter drop-shadow-2xl"
              style={{ background: '#040814' }}
            >
              <defs>
                {/* 1. HIGH-PRECISION INDIA LANDMASS BOUNDARY CLIP-PATH (NO OVERSPRAY INTO OCEAN) */}
                <clipPath id="indiaLandClip">
                  <path d="M 465,65 C 480,55 505,60 525,75 C 545,90 535,120 515,145 C 495,170 470,165 440,175 C 410,185 375,215 345,245 C 320,270 295,330 280,360 C 260,370 235,375 220,395 C 210,410 230,425 255,425 C 275,420 285,405 295,435 C 310,455 330,445 335,475 C 325,510 338,555 345,610 C 355,660 380,720 405,770 C 425,810 435,845 440,845 C 445,845 460,810 475,760 C 500,700 540,630 580,570 C 615,525 660,475 700,430 C 715,445 735,455 745,430 C 755,405 735,395 760,370 C 790,365 830,345 850,305 C 855,280 830,270 800,285 C 770,300 740,320 715,295 C 685,285 640,290 600,295 C 555,240 500,185 465,65 Z" />
                </clipPath>

                {/* 2. CONTINUOUS INTERPOLATED GEOCHEMICAL FIELD GRADIENTS (GSI NGCM ASSAY PALETTE) */}
                {/* Central Sausar Belt (MP/MH) High-Grade Heatmap Core */}
                <radialGradient id="sausarHeatmap" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#DC2626" stopOpacity="0.95" />
                  <stop offset="25%" stopColor="#EF4444" stopOpacity="0.9" />
                  <stop offset="45%" stopColor="#F97316" stopOpacity="0.85" />
                  <stop offset="65%" stopColor="#FACC15" stopOpacity="0.75" />
                  <stop offset="82%" stopColor="#22C55E" stopOpacity="0.55" />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.1" />
                </radialGradient>

                {/* Keonjhar-Bonai (Odisha) High-Grade Heatmap Core */}
                <radialGradient id="keonjharHeatmap" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#DC2626" stopOpacity="0.92" />
                  <stop offset="30%" stopColor="#F97316" stopOpacity="0.85" />
                  <stop offset="55%" stopColor="#FACC15" stopOpacity="0.7" />
                  <stop offset="78%" stopColor="#22C55E" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                </radialGradient>

                {/* Sandur Belt (Karnataka) Heatmap Core */}
                <radialGradient id="sandurHeatmap" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#EA580C" stopOpacity="0.9" />
                  <stop offset="35%" stopColor="#FACC15" stopOpacity="0.8" />
                  <stop offset="65%" stopColor="#86EFAC" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                </radialGradient>

                {/* Singhbhum/North-East Regional Gradient */}
                <radialGradient id="singhbhumHeatmap" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FACC15" stopOpacity="0.75" />
                  <stop offset="50%" stopColor="#22C55E" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Geographic Coordinate Graticule Grid Lines */}
              <g stroke="#1E293B" strokeWidth="0.75" strokeDasharray="3 3">
                {/* Latitude Lines */}
                <line x1="50" y1="100" x2="950" y2="100" />
                <line x1="50" y1="250" x2="950" y2="250" />
                <line x1="50" y1="400" x2="950" y2="400" />
                <line x1="50" y1="550" x2="950" y2="550" />
                <line x1="50" y1="700" x2="950" y2="700" />
                
                {/* Longitude Lines */}
                <line x1="150" y1="50" x2="150" y2="850" />
                <line x1="350" y1="50" x2="350" y2="850" />
                <line x1="550" y1="50" x2="550" y2="850" />
                <line x1="750" y1="50" x2="750" y2="850" />

                {/* Coordinate Grid Labels */}
                <text x="20" y="105" fill="#64748B" fontSize="11" fontFamily="monospace">35°N</text>
                <text x="20" y="255" fill="#64748B" fontSize="11" fontFamily="monospace">30°N</text>
                <text x="20" y="405" fill="#64748B" fontSize="11" fontFamily="monospace">25°N</text>
                <text x="20" y="555" fill="#64748B" fontSize="11" fontFamily="monospace">20°N</text>
                <text x="20" y="705" fill="#64748B" fontSize="11" fontFamily="monospace">15°N</text>

                <text x="145" y="40" fill="#64748B" fontSize="11" fontFamily="monospace">70°E</text>
                <text x="345" y="40" fill="#64748B" fontSize="11" fontFamily="monospace">75°E</text>
                <text x="545" y="40" fill="#64748B" fontSize="11" fontFamily="monospace">80°E</text>
                <text x="745" y="40" fill="#64748B" fontSize="11" fontFamily="monospace">85°E</text>
              </g>

              {/* MAIN GEOGRAPHIC MAP GROUP WITH ZOOM TRANSFORM */}
              <g transform={hierarchyLevel === 1 ? "scale(1)" : hierarchyLevel === 2 ? "translate(-300, -200) scale(1.8)" : "translate(-600, -400) scale(2.6)"} style={{ transition: 'all 0.6s ease-in-out' }}>
                
                {/* ── CLIPPED CONTINUOUS GEOCHEMICAL HEATMAP SURFACE (EDGE-TO-EDGE IN INDIA) ── */}
                <g clipPath="url(#indiaLandClip)">
                  {/* Base Land Fill (Low Concentration Blue Baseline < 243 ppm) */}
                  <rect width="1000" height="900" fill="#0C1A3A" />

                  {mapLayerFilters.prospectivity && (
                    <g>
                      {/* Regional Background Warm Ambient Glow */}
                      <circle cx="530" cy="480" r="320" fill="#2563EB" opacity="0.3" />
                      <circle cx="530" cy="480" r="260" fill="#06B6D4" opacity="0.3" />

                      {/* Major Manganese Field Hotspots */}
                      {/* 1. Sausar Belt Field (MP/MH) */}
                      <circle cx="485" cy="470" r="190" fill="url(#sausarHeatmap)" />
                      {/* 2. Keonjhar-Bonai Belt Field (Odisha) */}
                      <circle cx="650" cy="450" r="160" fill="url(#keonjharHeatmap)" />
                      {/* 3. Sandur Belt Field (Karnataka) */}
                      <circle cx="405" cy="640" r="130" fill="url(#sandurHeatmap)" />
                      {/* 4. Singhbhum Mineralized Field */}
                      <circle cx="710" cy="390" r="140" fill="url(#singhbhumHeatmap)" />
                    </g>
                  )}
                </g>

                {/* ── INDIA LANDMASS BORDER & STATE BOUNDARY LINES OVERLAY ── */}
                {/* High-Precision India Boundary Outline */}
                <path
                  d="M 465,65 C 480,55 505,60 525,75 C 545,90 535,120 515,145 C 495,170 470,165 440,175 C 410,185 375,215 345,245 C 320,270 295,330 280,360 C 260,370 235,375 220,395 C 210,410 230,425 255,425 C 275,420 285,405 295,435 C 310,455 330,445 335,475 C 325,510 338,555 345,610 C 355,660 380,720 405,770 C 425,810 435,845 440,845 C 445,845 460,810 475,760 C 500,700 540,630 580,570 C 615,525 660,475 700,430 C 715,445 735,455 745,430 C 755,405 735,395 760,370 C 790,365 830,345 850,305 C 855,280 830,270 800,285 C 770,300 740,320 715,295 C 685,285 640,290 600,295 C 555,240 500,185 465,65 Z"
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  filter="drop-shadow(0px 0px 4px rgba(0,0,0,0.8))"
                />

                {/* State Boundary Sub-Lines */}
                <path d="M 345,245 C 410,250 490,240 550,230" stroke="#475569" strokeWidth="1" strokeDasharray="4 2" fill="none" opacity="0.7" />
                <path d="M 345,430 C 440,400 560,400 660,430" stroke="#475569" strokeWidth="1" strokeDasharray="4 2" fill="none" opacity="0.7" />
                <path d="M 335,475 C 440,520 540,520 640,490" stroke="#475569" strokeWidth="1" strokeDasharray="4 2" fill="none" opacity="0.7" />
                <path d="M 345,610 C 430,620 500,600 580,570" stroke="#475569" strokeWidth="1" strokeDasharray="4 2" fill="none" opacity="0.7" />

                {/* State Labels */}
                <text x="460" y="425" fill="#E2E8F0" fontSize="10" fontWeight="bold" fontFamily="sans-serif" opacity="0.8" letterSpacing="1">MADHYA PRADESH</text>
                <text x="390" y="525" fill="#E2E8F0" fontSize="10" fontWeight="bold" fontFamily="sans-serif" opacity="0.8" letterSpacing="1">MAHARASHTRA</text>
                <text x="635" y="490" fill="#E2E8F0" fontSize="10" fontWeight="bold" fontFamily="sans-serif" opacity="0.8" letterSpacing="1">ODISHA</text>
                <text x="360" y="675" fill="#E2E8F0" fontSize="10" fontWeight="bold" fontFamily="sans-serif" opacity="0.8" letterSpacing="1">KARNATAKA</text>

                {/* ── INTERACTIVE SITE MARKERS & NON-OVERLAPPING LEADER CALLOUTS ── */}
                {filteredSites.map((site) => {
                  let px = 505; let py = 450; // default
                  let lx1 = 505; let ly1 = 450;
                  let lx2 = 550; let ly2 = 405;
                  let lx3 = 575; let ly3 = 405;
                  let bx = 575; let by = 390;
                  let numberStr = "1";

                  if (site.id === 'site-balaghat') {
                    px = 505; py = 450;
                    lx1 = 505; ly1 = 450; lx2 = 550; ly2 = 405; lx3 = 575; ly3 = 405;
                    bx = 575; by = 390; numberStr = "①";
                  } else if (site.id === 'site-ukwa') {
                    px = 525; py = 435;
                    lx1 = 525; ly1 = 435; lx2 = 560; ly2 = 355; lx3 = 585; ly3 = 355;
                    bx = 585; by = 340; numberStr = "②";
                  } else if (site.id === 'site-dongri') {
                    px = 455; py = 480;
                    lx1 = 455; ly1 = 480; lx2 = 380; ly2 = 440; lx3 = 355; ly3 = 440;
                    bx = 155; by = 425; numberStr = "③";
                  } else if (site.id === 'site-chikla') {
                    px = 435; py = 495;
                    lx1 = 435; ly1 = 495; lx2 = 360; ly2 = 510; lx3 = 335; ly3 = 510;
                    bx = 135; by = 495; numberStr = "④";
                  } else if (site.id === 'site-keonjhar') {
                    px = 650; py = 450;
                    lx1 = 650; ly1 = 450; lx2 = 710; ly2 = 480; lx3 = 730; ly3 = 480;
                    bx = 730; by = 465; numberStr = "⑤";
                  } else if (site.id === 'site-sandur') {
                    px = 405; py = 640;
                    lx1 = 405; ly1 = 640; lx2 = 330; ly2 = 670; lx3 = 305; ly3 = 670;
                    bx = 105; by = 655; numberStr = "⑥";
                  }

                  const isSelected = selectedSite?.id === site.id;

                  return (
                    <g 
                      key={site.id}
                      className="cursor-pointer group"
                      onClick={() => handleSelectSite(site)}
                    >
                      {/* Leader Callout Line */}
                      {mapLayerFilters.mines && (
                        <polyline
                          points={`${lx1},${ly1} ${lx2},${ly2} ${lx3},${ly3}`}
                          fill="none"
                          stroke={isSelected ? '#C5A059' : '#94A3B8'}
                          strokeWidth={isSelected ? '2' : '1.2'}
                          strokeDasharray={isSelected ? 'none' : '2 2'}
                          opacity={isSelected ? '1' : '0.8'}
                        />
                      )}

                      {/* Map Pin Pulse & Core Dot */}
                      <g transform={`translate(${px}, ${py})`}>
                        <circle r="14" fill="#EF4444" opacity="0.35" className="animate-ping" />
                        <circle r="8" fill={isSelected ? '#C5A059' : '#DC2626'} stroke="#FFFFFF" strokeWidth="2" />
                        <circle r="3" fill="#FFFFFF" />
                      </g>

                      {/* Non-Overlapping Callout Badge */}
                      {mapLayerFilters.mines && (
                        <g transform={`translate(${bx}, ${by})`}>
                          <rect
                            x="0"
                            y="0"
                            width="195"
                            height="30"
                            rx="5"
                            fill={isSelected ? '#0A1128' : '#070D1E'}
                            stroke={isSelected ? '#C5A059' : '#334155'}
                            strokeWidth={isSelected ? '2' : '1'}
                            className="shadow-xl transition-all duration-200 group-hover:stroke-[#C5A059]"
                          />
                          <text x="8" y="19" fill="#FACC15" fontSize="12" fontWeight="bold" fontFamily="mono">
                            {numberStr}
                          </text>
                          <text x="24" y="14" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                            {site.name}
                          </text>
                          <text x="24" y="24" fill={isSelected ? '#34D399' : '#94A3B8'} fontSize="8" fontFamily="monospace">
                            {site.measured_mn_wt_pct}% Mn • {site.targets_count} Targets
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* TARGET PINS (IF AT LEVEL 2 OR 3) */}
                {hierarchyLevel >= 2 && (
                  <g transform="translate(505, 450)">
                    {/* T001 Pin */}
                    <g className="cursor-pointer" onClick={() => handleSelectTarget('T001')}>
                      <polygon points="0,-14 11,8 -11,8" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
                      <text x="15" y="4" fill="#FACC15" fontSize="11" fontWeight="bold" fontFamily="monospace">T001 (92%)</text>
                    </g>
                    {/* T002 Pin */}
                    <g transform="translate(-40, 30)" className="cursor-pointer" onClick={() => handleSelectTarget('T002')}>
                      <polygon points="0,-12 9,6 -9,6" fill="#F97316" stroke="#FFFFFF" strokeWidth="2" />
                      <text x="13" y="4" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="monospace">T002 (76%)</text>
                    </g>
                    {/* T003 Pin */}
                    <g transform="translate(45, -25)" className="cursor-pointer" onClick={() => handleSelectTarget('T003')}>
                      <polygon points="0,-12 9,6 -9,6" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
                      <text x="13" y="4" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="monospace">T003 (87%)</text>
                    </g>
                  </g>
                )}
              </g>
            </svg>

            {/* ── SCIENTIFIC CONCENTRATION LEGEND BOX (EXACT MATCH TO REFERENCE IMAGE 2) ── */}
            <div className="absolute bottom-4 left-4 z-30 bg-[#090D16]/95 border-2 border-slate-700 p-3.5 rounded-lg text-white font-mono text-[10px] shadow-2xl space-y-2 max-w-[240px]">
              <div className="border-b border-slate-700 pb-1 font-sans">
                <span className="font-bold text-[#C5A059] block uppercase text-[11px]">EXPLANATION</span>
                <span className="text-slate-300 block text-[10px]">Mn Geochemistry (Top 0-to-5 cm)</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-bold text-slate-400">PERCENTILE</span>
                  <span className="font-bold text-slate-400">mg/kg (ppm)</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-3 bg-[#DC2626] border border-white/40" />
                    <span>90 to 100</span>
                  </div>
                  <strong className="text-red-400">1180 to 7780</strong>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-3 bg-[#EA580C] border border-white/40" />
                    <span>80 to 90</span>
                  </div>
                  <span className="text-orange-300">881 to 1180</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-3 bg-[#FACC15] stroke-slate-900 border border-white/40" />
                    <span>70 to 80</span>
                  </div>
                  <span className="text-yellow-300">713 to 881</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-3 bg-[#86EFAC] border border-white/40" />
                    <span>60 to 70</span>
                  </div>
                  <span className="text-emerald-300">591 to 713</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-3 bg-[#22C55E] border border-white/40" />
                    <span>40 to 60</span>
                  </div>
                  <span className="text-emerald-400">411 to 591</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-3 bg-[#06B6D4] border border-white/40" />
                    <span>20 to 40</span>
                  </div>
                  <span className="text-cyan-300">243 to 411</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-3 bg-[#2563EB] border border-white/40" />
                    <span>&lt; 20</span>
                  </div>
                  <span className="text-blue-400">&lt; 243</span>
                </div>
              </div>

              {/* Lambert Projection & Scale Bar */}
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
                <div className="text-[8px] text-slate-500 pt-0.5">GSI NGCM Data • Lambert Conformal Conic Projection</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: TARGET DETAIL & EVIDENCE PANEL (4 COLUMNS) ─────────── */}
        <div className="lg:col-span-4 space-y-6">
          {targetDetail ? (
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

                <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800 flex justify-between">
                  <span>Applicability Domain: <strong className="text-emerald-400 font-bold">{targetDetail.applicability}</strong></span>
                  <span>Assay: Certified XRF</span>
                </div>
              </div>

              {/* 2. WHY WAS THIS TARGET PREDICTED? (SHAP FEATURE ATTRIBUTION) */}
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

              {/* 3. SUPPORTING EVIDENCE CARDS */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="font-serif font-bold text-sm text-slate-900 block">Supporting Evidence Cards</span>
                <div className="space-y-2.5 max-h-56 overflow-y-auto">
                  {targetDetail.evidence_cards.map((card) => (
                    <div key={card.title} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{card.title}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                          {card.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{card.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. NEARBY BOREHOLES */}
              {targetDetail.nearby_drillholes.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100 font-mono text-xs">
                  <span className="font-bold text-slate-800 block">Nearby Certified Boreholes:</span>
                  {targetDetail.nearby_drillholes.map((bh) => (
                    <div key={bh.hole_id} className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between text-[11px]">
                      <span className="font-bold text-slate-900">{bh.hole_id} ({bh.depth_m}m)</span>
                      <span className="text-emerald-700 font-bold">{bh.mn_intercept_pct}% Mn Intercept</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 5. ACTION BUTTONS */}
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
            <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-500 space-y-2">
              <Compass className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-bold text-slate-700">Select a Site or Target Zone</p>
              <p className="text-[11px]">Click any site on the India map or choose Target T001 to view target-level evidence breakdowns.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
