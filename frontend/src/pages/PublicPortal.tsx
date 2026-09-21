import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, ArrowRight, ShieldCheck, Layers, Cpu, Database, 
  MapPin, Activity, CheckCircle2, ChevronRight, Lock, User, 
  HardHat, Globe, TrendingUp, AlertTriangle, Eye, Award, 
  Check, FileText, X, Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PublicPortal: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Login Modal State
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('ops_manager');
  const [password, setPassword] = useState<string>('MoilOps@2026!');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Active Journey Stage Tab (10-Stage Stepper)
  const [activeJourneyStep, setActiveJourneyStep] = useState<number>(0);

  const JOURNEY_STEPS = [
    {
      step: 1,
      category: "EXPLORATION & SURFACE EVIDENCE",
      title: "Earth Observation & Planetary Evidence",
      lead: "Synthesizing multi-spectral satellite imagery to detect surface mineral alteration and structural fault corridors.",
      description: "Harmonizing Sentinel-2 multispectral reflectance, Sentinel-1 C-band SAR polarimetry, and SRTM DEM elevation to map surface manganese alteration anomalies, iron-clay indices, and regional lineaments across the Balaghat belt.",
      evidence: "Sentinel-1 VV/VH SAR Backscatter, Sentinel-2 SWIR Band Ratios (B8A/B12), DEM Slope Gradient",
      deliverable: "Spatial Prospectivity Probability Raster (EPSG:4326)"
    },
    {
      step: 2,
      category: "REGIONAL GEOLOGY",
      title: "Stratigraphic Horizon & Structural Matching",
      lead: "Correlating satellite anomalies with the Precambrian Sausar Mobile Belt lithology.",
      description: "Mapping concordant manganese bands within the Mansar Formation mica-schists and quartzites, bounded by Tirodi Gneissic basements, to establish regional synclinal structural fold controls.",
      evidence: "GSI 1:50,000 Geological Bedrock Mapping, Regional Foliation Vectors, Structural Shear Horizons",
      deliverable: "Lithological Contact & Fold Axis Vector Model"
    },
    {
      step: 3,
      category: "GROUND TRUTHING",
      title: "Field Reconnaissance & Outcrop Mapping",
      lead: "Field verification teams inspect ground evidence to confirm satellite spectral indications.",
      description: "Geological exploration crews conduct ground traversing, structural dip/strike validation with Brunton compasses, and GPS-tagged rock grab sampling along mapped quartzite contacts.",
      evidence: "Outcrop Field Photographs, Structural Strike/Dip Measurements, Surface Grab Geochemistry",
      deliverable: "Field Verified Surface Mineralization Log"
    },
    {
      step: 4,
      category: "SUBSURFACE SAMPLING",
      title: "Diamond Core Borehole Verification",
      lead: "Rigorous core drilling is the only definitive method to confirm subsurface ore thickness and geometry.",
      description: "Ranked exploration targets are drilled using inclined wireline diamond core rigs to intersect the mineralized horizon, extracting solid core for lithological logging and geotechnical RQD measurements.",
      evidence: "Drillhole Intercept Depths, Core Recovery %, Rock Quality Designation (RQD)",
      deliverable: "Certified Drillhole Geological Log & Core Library"
    },
    {
      step: 5,
      category: "ANALYTICAL ASSAY",
      title: "Certified Laboratory Geochemical Assays",
      lead: "Laboratory wet chemical and XRF assaying to establish elemental manganese purity.",
      description: "Split core samples undergo crushing, pulverizing, and X-ray Fluorescence (XRF) and ICP-MS testing at MOIL central testing facilities to verify percentages of MnO, Fe2O3, SiO2, and Phosphorus.",
      evidence: "Certified Elemental Assay (% Mn, % Fe, % P, % SiO2, % Al2O3)",
      deliverable: "Accredited Laboratory Geochemical Certificate"
    },
    {
      step: 6,
      category: "RESOURCE MODELING",
      title: "3D Geological & Geostatistical Modeling",
      lead: "Interpolating drillhole assays into a 3D block model compliant with UNFC/JORC reporting codes.",
      description: "Borehole assay intercepts are wireframed into 3D solid bodies using inverse distance weighting and ordinary kriging to estimate in-situ ore tonnage and classify resources into Measured, Indicated, and Inferred.",
      evidence: "Geostatistical Variograms, In-situ Volume (m³), Grade Distribution Variance",
      deliverable: "UNFC Classified 3D Mineral Resource Block Model"
    },
    {
      step: 7,
      category: "UNDERGROUND ENGINEERING",
      title: "Mine Development & Stope Preparation",
      lead: "Preparing underground access declines, ventilation airways, and stope drives at working levels.",
      description: "Sinking vertical shafts, driving haulage declines, installing primary auxiliary ventilation (18.4 m³/s), and applying heavy cable bolting to reach validated blocks at depths up to -385m RL datum.",
      evidence: "Ventilation Airflow (CFM), Drive Profile Clearance, Cable Bolting Pull-Tests, Water Inflow L/min",
      deliverable: "5-Gate Operational Stope Readiness Certification"
    },
    {
      step: 8,
      category: "ORE EXTRACTION",
      title: "Underground Stope Extraction & Mucking",
      lead: "Sequenced ring drilling, blasting, and Load-Haul-Dump machinery mucking.",
      description: "Longhole drill rigs bore fan patterns into the stope face. Controlled emulsion explosives fragment the manganese ore into drawpoints, where underground diesel LHDs muck ore to underground chutes.",
      evidence: "LHD Telemetry Hours, Ring Drill Meters Bores, Blast Fragmentation P80 (mm)",
      deliverable: "Daily Stope Run-of-Mine (ROM) Production Tonnage"
    },
    {
      step: 9,
      category: "SURFACE BENEFICIATION",
      title: "Crushing, Sizing & Plant Beneficiation",
      lead: "Run-of-Mine ore is hauled to the surface shaft head for crushing and optical sorting.",
      description: "Primary jaw crushers and multi-deck vibratory screens separate the extracted ore into calibrated lumpy metallurgical ore (25–75 mm) and high-grade battery fines, washing away silicates.",
      evidence: "Crusher Hourly Throughput (t/h), Screen Mesh Size Splits, Waste Rock Reject %",
      deliverable: "Stockpiled Commercial Manganese Products by Grade"
    },
    {
      step: 10,
      category: "CONTINUITY & DISPATCH",
      title: "ShortfallShield & Supply Continuity",
      lead: "Predictive AI monitoring 30-day delivery schedules to protect domestic steelworks.",
      description: "ShortfallShield regression engines monitor equipment telematics, weather delays, and stope readiness daily to forecast 30-day output. Prescriptive optimizers deploy corrective recovery plans before shortfalls emerge.",
      evidence: "ShortfallShield 30-Day Predictive Curve, Tree SHAP Root Cause Scores, Plan A Mitigations",
      deliverable: "Guaranteed Commercial Dispatch to Indian Steel Mills"
    }
  ];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Authentication failed. Please verify credentials.');
      }

      login(data.access_token, data.user);
      setShowLoginModal(false);
      navigate('/app/command');
    } catch (err: any) {
      setLoginError(err.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setDemoCredentials = (role: 'ops' | 'geo' | 'admin' | 'field') => {
    if (role === 'ops') {
      setUsername('ops_manager');
      setPassword('MoilOps@2026!');
    } else if (role === 'geo') {
      setUsername('geologist');
      setPassword('MoilGeo@2026!');
    } else if (role === 'admin') {
      setUsername('admin');
      setPassword('MoilAdmin@2026!');
    } else {
      setUsername('field_officer');
      setPassword('MoilField@2026!');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] text-slate-900 font-sans selection:bg-[#0A1128] selection:text-white">
      {/* ── 1. CORPORATE EDITORIAL HEADER ───────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full bg-[#0A1128] text-white border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand & Organization */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-[#131E3A] border border-[#C5A059] text-[#C5A059] font-serif font-black flex items-center justify-center text-base shadow-xs">
              Mn
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-serif font-bold tracking-tight text-white">MnVision 360</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700 tracking-wider">
                  MOIL Limited
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Miniratna Category-I PSU • Govt. of India
              </p>
            </div>
          </div>

          {/* Editorial Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <a href="#manganese" className="hover:text-[#C5A059] transition">Manganese</a>
            <a href="#moil" className="hover:text-[#C5A059] transition">MOIL</a>
            <a href="#journey" className="hover:text-[#C5A059] transition">Mining Journey</a>
            <a href="#challenge" className="hover:text-[#C5A059] transition">The Challenge</a>
            <a href="#solution" className="hover:text-[#C5A059] transition">MnVision 360</a>
            <a href="#technology" className="hover:text-[#C5A059] transition">Technology</a>
            <a href="#responsible" className="hover:text-[#C5A059] transition">Responsible Mining</a>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/app/command')}
                className="px-5 py-2.5 rounded bg-[#C5A059] hover:bg-[#B38F46] text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-xs"
              >
                <span>ENTER COMMAND DECK</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-5 py-2.5 rounded bg-[#C5A059] hover:bg-[#B38F46] text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>SECURE LOGIN</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── 2. HERO EDITORIAL SHOWCASE ──────────────────────────────────────── */}
      <section className="relative w-full min-h-[82vh] flex items-center bg-[#070D1E] text-white overflow-hidden">
        {/* Real Industrial Mining Backdrop */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity filter contrast-125"
          style={{
            backgroundImage: `radial-gradient(circle at 60% 40%, rgba(10, 17, 40, 0.4), rgba(7, 13, 30, 0.95)), url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2200&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070D1E] via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 space-y-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-800/80 border border-slate-700 text-[#C5A059] text-xs font-mono tracking-widest uppercase">
              <span>SMART INDIA HACKATHON 2026 • MOIL LIMITED</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tight leading-none">
              Manganese.
            </h1>
            
            <p className="text-xl sm:text-2xl font-editorial italic text-slate-200 leading-relaxed font-light">
              From Space to Mine. From Prediction to Decision.
            </p>

            <p className="text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed font-normal">
              Deploying multi-source Earth observation, structural geology, digital underground mine twins, and prescriptive machine learning to de-risk exploration and secure domestic manganese production continuity.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => {
                  if (isAuthenticated) navigate('/app/command');
                  else setShowLoginModal(true);
                }}
                className="px-7 py-3.5 rounded bg-[#C5A059] hover:bg-[#B38F46] text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-2"
              >
                <span>ENTER THE PLATFORM</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#journey"
                className="px-6 py-3.5 rounded bg-slate-900/90 hover:bg-slate-800 text-white font-medium text-xs uppercase tracking-wider transition border border-slate-700 flex items-center gap-2"
              >
                <span>EXPLORE MINING JOURNEY</span>
                <ChevronRight className="w-4 h-4 text-[#C5A059]" />
              </a>
            </div>
          </div>

          {/* Scientific Baseline Note */}
          <div className="pt-6 border-t border-slate-800/80 max-w-2xl">
            <p className="text-[11px] font-mono text-slate-400 leading-relaxed">
              <strong>SCIENTIFIC SAFETY NOTE:</strong> Multi-source Earth observation provides surface and near-surface structural evidence to guide exploration. In accordance with JORC and UNFC standards, subsurface ore thickness and tonnage verification strictly require diamond core drilling.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. MANGANESE INTRODUCTION (ANGLO AMERICAN INSPIRATION) ─────────── */}
      <section id="manganese" className="py-28 bg-[#FFFFFF] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-6 space-y-6">
              <div className="vline-accent">
                <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block">
                  INDUSTRIAL FOUNDATION
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-950 tracking-tight mt-1">
                  What is Manganese used for?
                </h2>
              </div>

              <div className="space-y-4 text-sm md:text-base text-slate-700 leading-relaxed font-normal">
                <p>
                  Manganese (elemental symbol <strong>Mn</strong>, atomic number 25) is an essential, irreplaceable mineral at the heart of the modern industrial economy.
                </p>
                <p>
                  The most significant use of manganese is <strong>steel production</strong>, which consumes more than <strong>85% to 90%</strong> of all manganese mined globally. The ore is indispensable in increasing steel’s resistance to oxidation; it functions as a critical deoxidizer and desulfurizer during smelting, while fundamentally augmenting the overall tensile strength, workability, and hardness of the final alloy.
                </p>
                <p>
                  As the metallurgical adage states: <em>"You cannot make steel without manganese."</em> There is no known practical substitute in high-grade carbon and stainless steel manufacturing.
                </p>
                <p>
                  Beyond traditional metallurgy, high-purity manganese has emerged as a cornerstone of the clean energy transition. It serves as a vital cathode precursor for <strong>lithium-ion and sodium-ion batteries</strong> (LMFP, NMC chemistries), delivering thermal stability and cost-efficient energy density for electric mobility and grid storage.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-3xl font-serif font-bold text-[#0A1128] block">&gt; 85%</span>
                  <span className="text-xs text-slate-600 font-medium mt-1 block">Dedicated to Global Steelmaking</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-3xl font-serif font-bold text-[#C5A059] block">Critical</span>
                  <span className="text-xs text-slate-600 font-medium mt-1 block">Classified Critical Mineral by Govt. of India</span>
                </div>
              </div>
            </div>

            {/* Industrial Mining Photography */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative rounded overflow-hidden shadow-lg border border-slate-200 aspect-[4/3] bg-slate-900">
                <div 
                  className="absolute inset-0 bg-cover bg-center filter contrast-110"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80')`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-sans">
                  <span className="text-[10px] font-mono text-[#C5A059] uppercase block font-bold">ORE EXTRACTION</span>
                  <span className="font-semibold">Manganese Ore Rock Formation (Braunite / Hollandite Matrix)</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 font-serif italic text-center">
                High-grade manganese ore mined from the Precambrian Sausar Mobile Belt is the lifeblood of India's heavy infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. MOIL LIMITED CORPORATE OVERVIEW ──────────────────────────────── */}
      <section id="moil" className="py-28 bg-[#F8F9FA] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="max-w-3xl space-y-4">
            <div className="vline-accent">
              <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block">
                NATIONAL LEADER
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-950 tracking-tight mt-1">
                MOIL Limited — The Manganese Pillar of India
              </h2>
            </div>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal">
              MOIL Limited is a premier Miniratna Category-I State Enterprise under the Ministry of Mines, Government of India. Headquartered in Nagpur, MOIL is the largest producer of manganese ore in the country, operating 10 major underground and opencast mines across Maharashtra and Madhya Pradesh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                <Building2 className="w-5 h-5 text-[#0A1128]" />
              </div>
              <h3 className="text-base font-serif font-bold text-slate-900">Balaghat Flagship Mine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Operating one of the deepest underground manganese deposits in Asia at working levels down to -385m RL, extracting premium metallurgical ore from the Mansar Formation.
              </p>
            </div>

            <div className="bg-white p-6 rounded border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                <TrendingUp className="w-5 h-5 text-[#C5A059]" />
              </div>
              <h3 className="text-base font-serif font-bold text-slate-900">National Production Mandate</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Actively scaling annual domestic production from 1.5 MT toward 3.0 MT by 2030 to fulfill the National Steel Policy goal of 300 million tonnes of crude steel capacity.
              </p>
            </div>

            <div className="bg-white p-6 rounded border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                <Compass className="w-5 h-5 text-[#0A1128]" />
              </div>
              <h3 className="text-base font-serif font-bold text-slate-900">Exploration & Continuity</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deploying satellite remote sensing, structural geology modeling, and predictive AI ensures uninterrupted raw material supply to India's major steel complexes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. THE 10-STAGE MINING JOURNEY (CORE EDITORIAL STEPPER) ─────────── */}
      <section id="journey" className="py-28 bg-[#FFFFFF] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-14">
          <div className="max-w-3xl space-y-4">
            <div className="vline-accent">
              <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block">
                SEQUENTIAL VALUE CHAIN
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-950 tracking-tight mt-1">
                The 10-Stage Space-to-Mine Journey
              </h2>
            </div>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal">
              A comprehensive exploration and extraction pathway demonstrating how planetary satellite evidence transforms into verified underground production.
            </p>
          </div>

          {/* Stepper Navigation Strip */}
          <div className="overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
            <div className="flex items-center gap-2 min-w-max">
              {JOURNEY_STEPS.map((s, idx) => (
                <button
                  key={s.step}
                  onClick={() => setActiveJourneyStep(idx)}
                  className={`px-3.5 py-2 rounded-t text-xs font-mono font-bold transition flex items-center gap-2 border-b-2 ${
                    activeJourneyStep === idx
                      ? 'border-[#C5A059] text-slate-950 bg-slate-50 font-black'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    activeJourneyStep === idx ? 'bg-[#0A1128] text-[#C5A059]' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {s.step}
                  </span>
                  <span>STAGE {s.step}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Stage Detailed Presentation */}
          <div className="bg-[#0A1128] text-white rounded p-8 md:p-12 border border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#C5A059] uppercase tracking-wider">
                  {JOURNEY_STEPS[activeJourneyStep].category}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs font-mono text-slate-400">STAGE {JOURNEY_STEPS[activeJourneyStep].step} OF 10</span>
              </div>

              <h3 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight">
                {JOURNEY_STEPS[activeJourneyStep].title}
              </h3>

              <p className="text-base text-[#C5A059] font-editorial italic">
                "{JOURNEY_STEPS[activeJourneyStep].lead}"
              </p>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {JOURNEY_STEPS[activeJourneyStep].description}
              </p>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="text-xs font-mono text-slate-400">
                  <strong className="text-slate-200">PRIMARY EVIDENCE:</strong> {JOURNEY_STEPS[activeJourneyStep].evidence}
                </div>
                <div className="text-xs font-mono text-slate-400">
                  <strong className="text-[#C5A059]">KEY DELIVERABLE:</strong> {JOURNEY_STEPS[activeJourneyStep].deliverable}
                </div>
              </div>
            </div>

            {/* Stepper Control Card */}
            <div className="lg:col-span-4 bg-slate-900/90 p-6 rounded border border-slate-800 text-center space-y-4">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider block">
                STAGE PROGRESSION
              </span>
              <div className="text-5xl font-mono font-bold text-[#C5A059]">
                0{activeJourneyStep + 1}
                <span className="text-lg text-slate-500 font-normal"> / 10</span>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  disabled={activeJourneyStep === 0}
                  onClick={() => setActiveJourneyStep((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded disabled:opacity-30 transition"
                >
                  Previous
                </button>
                <button
                  disabled={activeJourneyStep === JOURNEY_STEPS.length - 1}
                  onClick={() => setActiveJourneyStep((prev) => Math.min(JOURNEY_STEPS.length - 1, prev + 1))}
                  className="px-4 py-2 bg-[#C5A059] hover:bg-[#B38F46] text-slate-950 text-xs font-bold rounded disabled:opacity-30 transition"
                >
                  Next Stage
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. THE CORE MINING PROBLEM & FALLACY ─────────────────────────────── */}
      <section id="challenge" className="py-28 bg-[#070D1E] text-white">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="max-w-3xl space-y-4">
            <div className="vline-accent">
              <span className="text-xs font-mono font-bold tracking-widest text-[#C5A059] uppercase block">
                OPERATIONAL BOTTLENECK
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight mt-1">
                The Fundamental Mining Fallacy
              </h2>
            </div>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed font-normal">
              In mining engineering, assuming geological reserves directly translate into dispatched production is the root cause of unexpected shortfalls.
            </p>
          </div>

          {/* Central Mining Fallacy Equation Card */}
          <div className="bg-[#0A1128] border border-slate-800 p-8 md:p-12 rounded text-center space-y-6 shadow-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C5A059]">
              CORE MINING AXIOM
            </span>

            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-base md:text-2xl font-mono font-bold text-white">
              <span className="px-3.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                Resource
              </span>
              <span className="text-red-500 font-bold">≠</span>
              <span className="px-3.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                Mineable Ore
              </span>
              <span className="text-red-500 font-bold">≠</span>
              <span className="px-3.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                Production-Ready Ore
              </span>
              <span className="text-red-500 font-bold">≠</span>
              <span className="px-3.5 py-1.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-400">
                Actual Production
              </span>
            </div>

            <p className="text-xs md:text-sm text-slate-400 max-w-3xl mx-auto leading-relaxed font-normal">
              Having geological manganese in the ground does not guarantee extraction. Stope preparation delays, equipment failures, monsoon haul road degradation, and blasting delays cause daily shortfalls between forecasted supply and refinery demand.
            </p>
          </div>

          {/* 4 Real Mining Bottleneck Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900/80 p-6 rounded border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-[#C5A059]">01 • HEAVY MACHINERY</span>
              <h3 className="text-sm font-bold text-white">Equipment Telemetry & Downtime</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                LHD loaders and underground dump trucks experiencing hydraulic seal failures can remove 350 tonnes of stope mucking capacity per shift.
              </p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-[#C5A059]">02 • STOPE ACCESS</span>
              <h3 className="text-sm font-bold text-white">5-Gate Readiness Delays</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                When cable bolting, trackage, or auxiliary airflow fall behind schedule, stopes cannot be blasted, resulting in unmined reserves.
              </p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-[#C5A059]">03 • WEATHER IMPACT</span>
              <h3 className="text-sm font-bold text-white">Monsoon Haul Road Degradation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Intense monsoon precipitation creates mud slurry on haul roads, reducing truck cycles and choking surface primary crusher feed.
              </p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-[#C5A059]">04 • STRUCTURAL BIAS</span>
              <h3 className="text-sm font-bold text-white">Exploration Drilling Risk</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drilling without multi-source satellite alignment risks dry boreholes in barren gneiss rather than manganese-rich Mansar quartzites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. THE MNVISION 360 SOLUTION ────────────────────────────────────── */}
      <section id="solution" className="py-28 bg-[#FFFFFF] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="max-w-3xl space-y-4">
            <div className="vline-accent">
              <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block">
                THE SOLUTION
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-950 tracking-tight mt-1">
                The Space-to-Mine Architecture
              </h2>
            </div>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal">
              MnVision 360 unites 4 operational pillars into one continuous intelligence platform for MOIL Limited.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded space-y-3">
              <div className="w-9 h-9 rounded bg-[#0A1128] text-[#C5A059] flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-slate-900">01. Earth Observation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fusing Sentinel-1 SAR roughness polarimetry, Sentinel-2 SWIR mineral indices, and SRTM DEM morphometry for target prospectivity ranking.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded space-y-3">
              <div className="w-9 h-9 rounded bg-[#0A1128] text-[#C5A059] flex items-center justify-center font-bold">
                <HardHat className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-slate-900">02. Mine Twin 360</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Level-by-level stope readiness matrix tracking 5 critical structural gates down to Level -385m RL datum at the Balaghat underground mine.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded space-y-3">
              <div className="w-9 h-9 rounded bg-[#0A1128] text-[#C5A059] flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-slate-900">03. ShortfallShield</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                7, 15, and 30-day production forecasting with Tree SHAP feature attributions decomposing root causes into exact loss percentages.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded space-y-3">
              <div className="w-9 h-9 rounded bg-[#0A1128] text-[#C5A059] flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-slate-900">04. Prescriptive Optimizer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Constraint-aware mathematical solver generating executable recovery plans alongside a real-time What-If sensitivity simulator.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. TECHNOLOGY & SCIENTIFIC RIGOR ───────────────────────────────── */}
      <section id="technology" className="py-28 bg-[#F8F9FA] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="max-w-3xl space-y-4">
            <div className="vline-accent">
              <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block">
                SCIENTIFIC RIGOR
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-950 tracking-tight mt-1">
                Technology & Machine Learning Provenance
              </h2>
            </div>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal">
              Built on peer-reviewed geospatial machine learning methodologies to prevent optimistic spatial autocorrelation leakage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>SpatialBlockCV Validation</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Training and validation datasets are separated into non-overlapping spatial tiles using SpatialBlockCV to guarantee valid spatial generalization.
              </p>
            </div>

            <div className="bg-white p-6 rounded border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Tree SHAP Feature Decomposition</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Production deficits are explained via local Tree SHAP attributions, quantifying the exact contribution of machinery downtime versus haul road speeds.
              </p>
            </div>

            <div className="bg-white p-6 rounded border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>OOD Applicability Warning</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Predictions outside the spatial and spectral distribution of the Balaghat training zone are explicitly flagged to prevent false drillhole targeting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. RESPONSIBLE MINING COMMITMENT ───────────────────────────────── */}
      <section id="responsible" className="py-28 bg-[#FFFFFF] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="max-w-3xl space-y-4">
            <div className="vline-accent">
              <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block">
                ESG STEWARDSHIP
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-950 tracking-tight mt-1">
                Responsible Mining Commitment
              </h2>
            </div>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal">
              Sustainable mineral development balancing industrial steel supply with environmental stewardship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400">01 • WATER RECYCLING</span>
              <h3 className="text-sm font-bold text-slate-900">Zero Underground Discharge</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Underground dewatering water is pumped to surface settling clarifiers, treated, and recycled for drilling dust suppression and mineral beneficiation.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400">02 • TAILINGS SAFETY</span>
              <h3 className="text-sm font-bold text-slate-900">Geotechnical Dam Stability</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Continuous piezometric and satellite InSAR monitoring over tailings dams ensures zero slope compromise and absolute community safety.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400">03 • MINE CLOSURE</span>
              <h3 className="text-sm font-bold text-slate-900">Progressive Afforestation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Progressive backfilling and native species plantation across exhausted benches protects regional biodiversity in the Central Indian belt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. CORPORATE FOOTER ────────────────────────────────────────────── */}
      <footer className="bg-[#070D1E] text-white py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-12">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#131E3A] border border-[#C5A059] text-[#C5A059] font-serif font-black flex items-center justify-center text-sm">
                  Mn
                </div>
                <span className="text-lg font-serif font-bold text-white">MnVision 360</span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Space-to-Mine Intelligence Platform for MOIL Limited • Smart India Hackathon 2026
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-2.5 rounded bg-[#C5A059] hover:bg-[#B38F46] text-slate-950 font-bold text-xs uppercase tracking-wider transition"
              >
                Sign In to Platform
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
            <span>&copy; 2026 MOIL Limited. All Rights Reserved. Govt. of India Enterprise.</span>
            <span>Balaghat Manganese Belt • Madhya Pradesh, India (EPSG:4326)</span>
          </div>
        </div>
      </footer>

      {/* ── 11. SECURE CORPORATE LOGIN MODAL ─────────────────────────────────── */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-slate-300 w-full max-w-md shadow-2xl overflow-hidden font-sans animate-in fade-in duration-150">
            {/* Modal Header */}
            <div className="bg-[#0A1128] text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#131E3A] border border-[#C5A059] text-[#C5A059] font-serif font-black flex items-center justify-center text-sm">
                  Mn
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">Secure Platform Access</h3>
                  <p className="text-[10px] text-slate-400 font-mono">MOIL MnVision 360 Authentication</p>
                </div>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Persona Quick-Switcher */}
            <div className="p-5 bg-slate-50 border-b border-slate-200 space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                SELECT DEMO EVALUATION PERSONA:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDemoCredentials('ops')}
                  className={`p-2 rounded border text-left transition ${
                    username === 'ops_manager'
                      ? 'bg-[#0A1128] text-white border-[#0A1128] font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span className="block font-bold">Operations Director</span>
                  <span className="text-[10px] opacity-75 font-mono">ops_manager</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoCredentials('geo')}
                  className={`p-2 rounded border text-left transition ${
                    username === 'geologist'
                      ? 'bg-[#0A1128] text-white border-[#0A1128] font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span className="block font-bold">Chief Geologist</span>
                  <span className="text-[10px] opacity-75 font-mono">geologist</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoCredentials('admin')}
                  className={`p-2 rounded border text-left transition ${
                    username === 'admin'
                      ? 'bg-[#0A1128] text-white border-[#0A1128] font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span className="block font-bold">General Manager</span>
                  <span className="text-[10px] opacity-75 font-mono">admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoCredentials('field')}
                  className={`p-2 rounded border text-left transition ${
                    username === 'field_officer'
                      ? 'bg-[#0A1128] text-white border-[#0A1128] font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span className="block font-bold">Field Geologist</span>
                  <span className="text-[10px] opacity-75 font-mono">field_officer</span>
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
                  {loginError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Username / Security ID</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0A1128]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0A1128]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#0A1128] hover:bg-[#131E3A] text-white font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2 shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{isSubmitting ? 'AUTHENTICATING...' : 'AUTHENTICATE & ENTER PLATFORM'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
