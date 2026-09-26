import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, ArrowRight, ShieldCheck, Layers, Cpu, Database, 
  MapPin, Activity, CheckCircle2, ChevronRight, Lock, User, 
  HardHat, Globe, TrendingUp, AlertTriangle, Eye, Award, 
  Check, FileText, X, Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEMO_ACCOUNTS: Record<string, { role: string; password: string; fullName: string }> = {
  admin: { role: 'Admin', password: 'MoilAdmin@2026!', fullName: 'MOIL Executive Administrator' },
  ops_manager: { role: 'Operations Manager', password: 'MoilOps@2026!', fullName: 'Balaghat Operations Director' },
  geologist: { role: 'Geologist', password: 'MoilGeo@2026!', fullName: 'Chief Exploration Geologist' },
  field_officer: { role: 'Field Officer', password: 'MoilField@2026!', fullName: 'Ground Reconnaissance Officer' },
};

export const PublicPortal: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, getDefaultDashboard } = useAuth();

  // Login Modal State
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('ops_manager');
  const [password, setPassword] = useState<string>('MoilOps@2026!');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    document.querySelectorAll('#manganese, #moil, #journey, #challenge, #solution, #technology, #responsible').forEach((element) => {
      element.classList.add('story-reveal');
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

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
      const demoAccount = DEMO_ACCOUNTS[username];
      const useDemoAccount = () => {
        if (!demoAccount || password !== demoAccount.password) return false;
        login(`demo-session-${username}-${Date.now()}`, {
          username,
          role: demoAccount.role,
          full_name: demoAccount.fullName,
          email: `${username}@moil.nic.in`,
        });
        setShowLoginModal(false);
        navigate(getDefaultDashboard(demoAccount.role));
        return true;
      };

      let res: Response;
      try {
        res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
      } catch {
        if (useDemoAccount()) return;
        throw new Error('The sign-in service is unavailable. Start the backend or use a valid demo profile.');
      }

      const data = await res.json().catch(() => null);
      if (res.ok && data?.access_token && data?.user) {
        login(data.access_token, data.user);
        setShowLoginModal(false);
        navigate(getDefaultDashboard(data.user.role));
        return;
      }

      // Demo profiles remain usable for frontend preview when the API is stopped
      // or returns an empty gateway response.
      if ((res.status >= 500 || !data) && useDemoAccount()) return;
      throw new Error(data?.detail || (res.ok
        ? 'The sign-in service returned an incomplete response. Please try again.'
        : 'Authentication failed. Please verify the selected profile and password.'));
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
    <div className="min-h-screen w-full bg-[#FFFFFF] text-slate-900 font-sans selection:bg-[#0B4F8A] selection:text-white">
      {/* ── 1. CORPORATE EDITORIAL HEADER ───────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full bg-white text-[#0B4F8A] border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand & Organization */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-[#1769AA] border border-[#F28C28] text-[#F28C28] font-serif font-black flex items-center justify-center text-base shadow-xs">
              Mn
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-serif font-bold tracking-tight text-[#0B4F8A]">MnVision 360</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-blue-50 text-[#0B4F8A] border border-blue-100 tracking-wider">
                  MOIL Limited
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                Miniratna Category-I PSU • Govt. of India
              </p>
            </div>
          </div>

          {/* Editorial Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <a href="#manganese" className="hover:text-[#F28C28] transition">Manganese</a>
            <a href="#journey" className="hover:text-[#F28C28] transition">Mining Journey</a>
            <a href="#solution" className="hover:text-[#F28C28] transition">MnVision 360</a>
            <a href="#responsible" className="hover:text-[#F28C28] transition">Responsible Mining</a>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/app/command')}
                className="px-5 py-2.5 rounded bg-[#F28C28] hover:bg-[#D97706] text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-xs"
              >
                <span>ENTER COMMAND DECK</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-5 py-2.5 rounded bg-[#F28C28] hover:bg-[#D97706] text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>SECURE LOGIN</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── 2. HERO EDITORIAL SHOWCASE ──────────────────────────────────────── */}
      <section className="mn-hero relative isolate overflow-hidden text-white">
        <div className="mn-hero-grid" aria-hidden="true" />
        <div className="mn-hero-glow" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid min-h-[min(780px,calc(100vh-5rem))] max-w-7xl items-center gap-8 px-6 py-14 lg:grid-cols-[1fr_0.92fr] lg:py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-100 backdrop-blur"><span className="h-2 w-2 animate-pulse rounded-full bg-[#F28C28]" /> MOIL · Space-to-Mine Intelligence</div>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.32em] text-orange-300">Element 25 · The steelmaker’s ally</p>
            <h1 className="mt-3 font-serif text-6xl font-bold leading-[0.92] tracking-tight sm:text-7xl lg:text-[6.5rem]">Manganese<span className="text-orange-400">.</span></h1>
            <p className="mt-7 max-w-xl text-xl font-light leading-relaxed text-blue-50 sm:text-2xl">From deep time to stronger steel. One connected view of every decision in between.</p>
            <p className="mt-5 max-w-lg text-sm leading-7 text-blue-100/75">Follow the journey from satellite evidence and geological context to verified resources, mine readiness, and production planning across MOIL’s manganese operations.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => isAuthenticated ? navigate('/app/command') : setShowLoginModal(true)} className="group inline-flex items-center gap-3 rounded-full bg-[#F28C28] px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider text-slate-950 shadow-lg shadow-orange-950/30 transition hover:-translate-y-0.5 hover:bg-orange-300">Enter the platform <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button>
              <a href="#journey" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur transition hover:bg-white/15">Explore the journey <ChevronRight className="h-4 w-4 text-orange-300" /></a>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 border-t border-white/15 pt-5">
              <div><span className="block text-2xl font-bold text-white">25</span><span className="mt-1 block text-[9px] uppercase tracking-widest text-blue-100/60">Atomic number</span></div>
              <div className="border-l border-white/15 pl-5"><span className="block text-2xl font-bold text-white">85%+</span><span className="mt-1 block text-[9px] uppercase tracking-widest text-blue-100/60">Used in steel</span></div>
              <div className="border-l border-white/15 pl-5"><span className="block text-2xl font-bold text-orange-300">360°</span><span className="mt-1 block text-[9px] uppercase tracking-widest text-blue-100/60">Space to mine</span></div>
            </div>
          </div>
          <div className="mn-specimen-scene relative mx-auto flex aspect-square w-full max-w-[560px] items-center justify-center" aria-label="Animated manganese crystal illustration">
            <div className="mn-orbit mn-orbit-one" aria-hidden="true" /><div className="mn-orbit mn-orbit-two" aria-hidden="true" />
            <div className="mn-crystal-float"><svg className="mn-crystal" viewBox="0 0 420 500" role="img" aria-label="Faceted orange manganese ore crystal">
              <defs><linearGradient id="ore-main" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#FFD18A"/><stop offset=".24" stopColor="#F28C28"/><stop offset=".61" stopColor="#B84D16"/><stop offset="1" stopColor="#512B42"/></linearGradient><linearGradient id="ore-side" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#7E351F"/><stop offset=".5" stopColor="#E26B20"/><stop offset="1" stopColor="#371F3B"/></linearGradient><linearGradient id="ore-light" x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#FFF0CB"/><stop offset="1" stopColor="#F28C28"/></linearGradient><filter id="ore-shadow" x="-40%" y="-30%" width="180%" height="180%"><feGaussianBlur stdDeviation="18"/></filter></defs>
              <ellipse cx="215" cy="437" rx="112" ry="23" fill="#F28C28" opacity=".32" filter="url(#ore-shadow)" />
              <g className="mn-crystal-facets" stroke="#FFD8A2" strokeOpacity=".32" strokeWidth="1.2" strokeLinejoin="round"><path d="M212 32 313 91 362 191 319 319 231 420 147 379 68 286 82 157 139 73Z" fill="url(#ore-main)"/><path d="m212 32 8 169-81-128 34 162-91-78 106 119-120 10 163 34-84 59 84 41 88-101-51-43 94-84-101-3 15-98Z" fill="#F7A34A" fillOpacity=".62"/><path d="m212 32 101 59-93 110Z" fill="url(#ore-light)"/><path d="m313 91 49 100-142 10Z" fill="#C95E24"/><path d="m362 191-43 128-99-118Z" fill="url(#ore-side)"/><path d="m319 319-88 101-11-219Z" fill="#673047"/><path d="m231 420-84-41 73-178Z" fill="#B95025"/><path d="m147 379-79-93 152-85Z" fill="#E98334"/><path d="m68 286 14-129 138 44Z" fill="#783848"/><path d="m82 157 57-84 81 128Z" fill="#FFD08B" fillOpacity=".72"/></g><path d="m188 63 24-31 5 98" fill="none" stroke="#FFF5DC" strokeOpacity=".8" strokeWidth="3"/><path d="m92 171 20-39" fill="none" stroke="#FFF5DC" strokeOpacity=".62" strokeWidth="2"/>
            </svg></div>
            <div className="mn-specimen-label absolute bottom-[9%] right-[1%] rounded-xl border border-white/15 bg-[#082F50]/70 px-4 py-3 backdrop-blur-md"><span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-orange-300">Manganese ore</span><span className="mt-1 block text-xs text-blue-50">The strength inside steel</span></div>
            <span className="mn-spark mn-spark-a" aria-hidden="true" /><span className="mn-spark mn-spark-b" aria-hidden="true" /><span className="mn-spark mn-spark-c" aria-hidden="true" />
          </div>
        </div>
        <a href="#manganese" className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-[9px] font-semibold uppercase tracking-[0.25em] text-blue-100/60 transition hover:text-white">Scroll to explore <span className="ml-2 text-orange-300">↓</span></a>
      </section>
      {/* Manganese fundamentals */}      <section id="manganese" className="py-28 bg-[#FFFFFF] border-b border-slate-200">
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
                  <span className="text-3xl font-serif font-bold text-[#0B4F8A] block">&gt; 85%</span>
                  <span className="text-xs text-slate-600 font-medium mt-1 block">Dedicated to Global Steelmaking</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-3xl font-serif font-bold text-[#F28C28] block">Critical</span>
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
                  <span className="text-[10px] font-mono text-[#F28C28] uppercase block font-bold">ORE EXTRACTION</span>
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
                <Building2 className="w-5 h-5 text-[#0B4F8A]" />
              </div>
              <h3 className="text-base font-serif font-bold text-slate-900">Balaghat Flagship Mine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Operating one of the deepest underground manganese deposits in Asia at working levels down to -385m RL, extracting premium metallurgical ore from the Mansar Formation.
              </p>
            </div>

            <div className="bg-white p-6 rounded border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                <TrendingUp className="w-5 h-5 text-[#F28C28]" />
              </div>
              <h3 className="text-base font-serif font-bold text-slate-900">National Production Mandate</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Actively scaling annual domestic production from 1.5 MT toward 3.0 MT by 2030 to fulfill the National Steel Policy goal of 300 million tonnes of crude steel capacity.
              </p>
            </div>

            <div className="bg-white p-6 rounded border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                <Compass className="w-5 h-5 text-[#0B4F8A]" />
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
      <section id="journey" className="border-b border-blue-100 bg-[#F3F7FB] py-20 md:py-24">
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

          <div className="overflow-x-auto pb-2" role="tablist" aria-label="Space-to-mine stages">
            <div className="flex min-w-max gap-2">
              {JOURNEY_STEPS.map((stage, idx) => (
                <button key={stage.step} type="button" role="tab" aria-selected={activeJourneyStep === idx} aria-controls="journey-stage-panel" title={stage.category} onClick={() => setActiveJourneyStep(idx)} className={`journey-stage-tab ${activeJourneyStep === idx ? 'journey-stage-tab-active' : ''}`}>
                  <span className="flex w-full items-center justify-between"><span className="text-[11px] font-bold tracking-[0.12em]">STAGE</span><span className="journey-stage-number">{String(stage.step).padStart(2, '0')}</span></span>
                  <span className="journey-stage-line"><span style={{ width: `${((idx + 1) / JOURNEY_STEPS.length) * 100}%` }} /></span>
                  <span className="max-w-[92px] truncate text-left text-[10px] font-medium leading-tight">{stage.category}</span>
                </button>
              ))}
            </div>
          </div>

          <div id="journey-stage-panel" role="tabpanel" aria-live="polite" className="journey-panel grid grid-cols-1 gap-5 rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_16px_50px_rgba(15,55,90,0.08)] md:p-8 lg:grid-cols-[minmax(0,1fr)_280px]" key={activeJourneyStep}>
            <div className="flex min-h-full flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#0B4F8A]">{JOURNEY_STEPS[activeJourneyStep].category}</span>
                <span className="text-xs font-semibold text-slate-500">Stage {String(JOURNEY_STEPS[activeJourneyStep].step).padStart(2, '0')} of 10</span>
              </div>
              <h3 className="mt-5 max-w-3xl text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-3xl">{JOURNEY_STEPS[activeJourneyStep].title}</h3>
              <p className="mt-3 max-w-3xl text-base font-semibold leading-relaxed text-[#0B4F8A]">{JOURNEY_STEPS[activeJourneyStep].lead}</p>
              <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600">{JOURNEY_STEPS[activeJourneyStep].description}</p>
              <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Primary evidence</span><p className="mt-2 text-sm leading-6 text-slate-700">{JOURNEY_STEPS[activeJourneyStep].evidence}</p></div>
                <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-4"><span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-orange-800">Key deliverable</span><p className="mt-2 text-sm leading-6 text-slate-700">{JOURNEY_STEPS[activeJourneyStep].deliverable}</p></div>
              </div>
            </div>

            <aside className="flex flex-col rounded-xl bg-[#F3F7FB] p-5 md:p-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">Journey progress</span>
              <div className="mt-3 flex items-baseline gap-2"><span className="text-5xl font-bold tracking-tight text-[#0B4F8A]">{String(activeJourneyStep + 1).padStart(2, '0')}</span><span className="text-sm font-medium text-slate-500">/ 10 stages</span></div>
              <div className="mt-4 flex gap-1" aria-label={`${activeJourneyStep + 1} of 10 stages complete`}>{JOURNEY_STEPS.map((stage, idx) => <span key={stage.step} className={`h-1.5 flex-1 rounded-full ${idx <= activeJourneyStep ? 'bg-[#F28C28]' : 'bg-blue-100'}`} />)}</div>
              <p className="mt-5 min-h-[52px] text-sm leading-6 text-slate-600">Move from satellite evidence to a validated, production-ready manganese operation.</p>
              <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
                <button type="button" disabled={activeJourneyStep === 0} onClick={() => setActiveJourneyStep((prev) => Math.max(0, prev - 1))} className="rounded-lg border border-blue-200 bg-white px-3 py-3 text-sm font-semibold text-[#0B4F8A] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
                <button type="button" disabled={activeJourneyStep === JOURNEY_STEPS.length - 1} onClick={() => setActiveJourneyStep((prev) => Math.min(JOURNEY_STEPS.length - 1, prev + 1))} className="rounded-lg bg-[#0B4F8A] px-3 py-3 text-sm font-semibold text-white transition hover:bg-[#1769AA] disabled:cursor-not-allowed disabled:opacity-40">Next stage <span aria-hidden="true">→</span></button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── 6. THE CORE MINING PROBLEM & FALLACY ─────────────────────────────── */}
      <section id="challenge" className="border-y border-blue-100 bg-[#F3F7FB] py-20 md:py-24">
        <div className="mx-auto max-w-7xl space-y-12 px-6">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex rounded-full bg-orange-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-orange-800">The operational reality</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">Ore in the ground is not ore dispatched.</h2>
            <p className="max-w-2xl text-base leading-7 text-slate-600">Geological resources move through distinct engineering and operational gates before they become production. A delay at any gate can create a delivery shortfall.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <article className="relative rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <span className="text-xs font-bold tracking-[0.14em] text-[#0B4F8A]">01</span><h3 className="mt-3 text-lg font-bold text-slate-900">Geological resource</h3><p className="mt-2 text-sm leading-6 text-slate-600">Exploration identifies mineralization and estimates the deposit. It does not confirm what can be extracted economically.</p>
            </article>
            <article className="relative rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <span className="text-xs font-bold tracking-[0.14em] text-[#0B4F8A]">02</span><h3 className="mt-3 text-lg font-bold text-slate-900">Mineable ore</h3><p className="mt-2 text-sm leading-6 text-slate-600">Mine design, grade, access, and safety constraints determine which parts of a resource can be mined.</p>
            </article>
            <article className="relative rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <span className="text-xs font-bold tracking-[0.14em] text-[#0B4F8A]">03</span><h3 className="mt-3 text-lg font-bold text-slate-900">Operationally ready</h3><p className="mt-2 text-sm leading-6 text-slate-600">Stopes need development, ventilation, equipment, and workforce readiness before extraction can begin.</p>
            </article>
            <article className="relative rounded-2xl border border-orange-200 bg-white p-5 shadow-sm">
              <span className="text-xs font-bold tracking-[0.14em] text-orange-700">04</span><h3 className="mt-3 text-lg font-bold text-slate-900">Actual production</h3><p className="mt-2 text-sm leading-6 text-slate-600">Equipment availability, haulage, weather, and dispatch determine the tonnes delivered to customers.</p>
            </article>
          </div>

          <div className="flex items-center gap-4 pt-1"><span className="shrink-0 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">What interrupts the flow</span><span className="h-px w-full bg-blue-100" /></div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-xl border border-slate-200 bg-white p-5"><span className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#0B4F8A]">Heavy machinery</span><h3 className="mt-2 text-base font-bold text-slate-900">Equipment downtime</h3><p className="mt-2 text-sm leading-6 text-slate-600">Hydraulic failures in LHD loaders and underground trucks can remove 350 tonnes of mucking capacity per shift.</p></article>
            <article className="rounded-xl border border-slate-200 bg-white p-5"><span className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#0B4F8A]">Stope access</span><h3 className="mt-2 text-base font-bold text-slate-900">Readiness delays</h3><p className="mt-2 text-sm leading-6 text-slate-600">Cable bolting, trackage, and auxiliary airflow must be ready before a stope can be blasted.</p></article>
            <article className="rounded-xl border border-slate-200 bg-white p-5"><span className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#0B4F8A]">Weather impact</span><h3 className="mt-2 text-base font-bold text-slate-900">Monsoon haul roads</h3><p className="mt-2 text-sm leading-6 text-slate-600">Heavy rainfall slows truck cycles and can restrict feed to the surface crusher.</p></article>
            <article className="rounded-xl border border-slate-200 bg-white p-5"><span className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#0B4F8A]">Exploration risk</span><h3 className="mt-2 text-base font-bold text-slate-900">Poorly placed drilling</h3><p className="mt-2 text-sm leading-6 text-slate-600">Satellite evidence and geological context help prioritize targets before costly core drilling verifies them.</p></article>
          </div>
        </div>
      </section>
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
              <div className="w-9 h-9 rounded bg-[#0B4F8A] text-[#F28C28] flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-slate-900">01. Earth Observation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fusing Sentinel-1 SAR roughness polarimetry, Sentinel-2 SWIR mineral indices, and SRTM DEM morphometry for target prospectivity ranking.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded space-y-3">
              <div className="w-9 h-9 rounded bg-[#0B4F8A] text-[#F28C28] flex items-center justify-center font-bold">
                <HardHat className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-slate-900">02. Mine Twin 360</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Level-by-level stope readiness matrix tracking 5 critical structural gates down to Level -385m RL datum at the Balaghat underground mine.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded space-y-3">
              <div className="w-9 h-9 rounded bg-[#0B4F8A] text-[#F28C28] flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-slate-900">03. ShortfallShield</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                7, 15, and 30-day production forecasting with Tree SHAP feature attributions decomposing root causes into exact loss percentages.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded space-y-3">
              <div className="w-9 h-9 rounded bg-[#0B4F8A] text-[#F28C28] flex items-center justify-center font-bold">
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
      <footer className="bg-[#083B67] text-white py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-12">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#1769AA] border border-[#F28C28] text-[#F28C28] font-serif font-black flex items-center justify-center text-sm">
                  Mn
                </div>
                <span className="text-lg font-serif font-bold text-white">MnVision 360</span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Space-to-Mine Intelligence Platform for MOIL Limited • Smart India Hackathon 2026
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-2.5 rounded bg-[#F28C28] hover:bg-[#D97706] text-slate-950 font-bold text-xs uppercase tracking-wider transition"
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
            <div className="bg-[#0B4F8A] text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#1769AA] border border-[#F28C28] text-[#F28C28] font-serif font-black flex items-center justify-center text-sm">
                  Mn
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">Secure Platform Access</h3>
                  <p className="text-xs text-blue-100/80">MOIL MnVision 360 Authentication</p>
                </div>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-blue-100/70 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Persona Quick-Switcher */}
            <div className="p-5 bg-slate-50 border-b border-slate-200 space-y-2">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                SELECT DEMO EVALUATION PERSONA:
              </span>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => setDemoCredentials('ops')}
                  className={`min-h-[64px] rounded-lg border p-3 text-left transition ${
                    username === 'ops_manager'
                      ? 'bg-[#0B4F8A] text-white border-[#0B4F8A] font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span className="block font-bold">Operations Director</span>
                  <span className="text-xs opacity-80 font-sans">ops_manager</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoCredentials('geo')}
                  className={`min-h-[64px] rounded-lg border p-3 text-left transition ${
                    username === 'geologist'
                      ? 'bg-[#0B4F8A] text-white border-[#0B4F8A] font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span className="block font-bold">Chief Geologist</span>
                  <span className="text-xs opacity-80 font-sans">geologist</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoCredentials('admin')}
                  className={`min-h-[64px] rounded-lg border p-3 text-left transition ${
                    username === 'admin'
                      ? 'bg-[#0B4F8A] text-white border-[#0B4F8A] font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span className="block font-bold">General Manager</span>
                  <span className="text-xs opacity-80 font-sans">admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoCredentials('field')}
                  className={`min-h-[64px] rounded-lg border p-3 text-left transition ${
                    username === 'field_officer'
                      ? 'bg-[#0B4F8A] text-white border-[#0B4F8A] font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span className="block font-bold">Field Geologist</span>
                  <span className="text-xs opacity-80 font-sans">field_officer</span>
                </button>
              </div>
              <p className="text-xs text-slate-600">Demo profiles work in offline preview mode when the API is stopped.</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {loginError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Username / Security ID</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0B4F8A] focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0B4F8A] focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#0B4F8A] py-3 text-sm font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#1769AA] flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>{isSubmitting ? 'AUTHENTICATING...' : 'AUTHENTICATE & ENTER PLATFORM'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
