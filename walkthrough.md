# MnVision 360 — Space-to-Mine Intelligence Platform Walkthrough

**MnVision 360** is an enterprise-grade Space-to-Mine Intelligence Platform built for **MOIL Limited (Ministry of Steel, Govt of India)** to transform manganese exploration, underground operations, and production shortfall recovery.

---

## 🌟 1. Implemented Platform Architecture

```
                                  MNVISION 360 PLATFORM ARCHITECTURE
                                  
   +---------------------------------------------------------------------------------------------------+
   |                                 EXPLORATION INTELLIGENCE STREAM                                    |
   |  Sentinel-1 SAR + Sentinel-2 Optical + DEM + Geology + Geophysics + Geochemistry + CEM Anomaly   |
   |                                                |                                                  |
   |                                    PU Learning (RandomForest)                                     |
   |                                                |                                                  |
   |                                 Spatial Block Cross-Validation                                    |
   |                                                |                                                  |
   |                                 Prospectivity + Confidence + OOD                                  |
   |                                                |                                                  |
   |                                        DrillTarget AI                                             |
   +------------------------------------------------|--------------------------------------------------+
                                                    |
                                                    v
   +---------------------------------------------------------------------------------------------------+
   |                                     CLOSED-LOOP GROUND TRUTH                                      |
   |          Field Recon Survey (Offline PWA) -> Core Drilling -> Lab Assay -> Model Retrain           |
   +------------------------------------------------|--------------------------------------------------+
                                                    |
                                                    v
   +---------------------------------------------------------------------------------------------------+
   |                                OPERATIONAL INTELLIGENCE STREAM                                    |
   |       MineTwin (3D/2D) -> ShortfallShield (7/15/30d) -> SHAP Root Causes -> MILP Optimizer        |
   +------------------------------------------------|--------------------------------------------------+
                                                    |
                                                    v
   +---------------------------------------------------------------------------------------------------+
   |                                    WHAT-IF SIMULATION ENGINE                                      |
   |       Disruption Input -> Isolated State Copy -> Shortfall -> SHAP -> Optimizer -> Recovery        |
   +---------------------------------------------------------------------------------------------------+
```

---

## 🛠️ 2. Summary of Implementation

### A. What Was Implemented
1. **Prescriptive Mine Optimizer Engine ([`backend/app/ml/optimizer.py`](file:///C:/Users/swaro/.gemini/antigravity/scratch/mnvision360/backend/app/ml/optimizer.py))**: Scipy/MILP constraint satisfaction solver evaluating block readiness score ($\ge 80\%$), equipment availability ($\ge 70\%$, downtime $\le 20\text{h}$), and crusher capacity ($1200\text{ MT/day}$).
2. **What-If Simulator Engine ([`backend/app/ml/whatif_simulator.py`](file:///C:/Users/swaro/.gemini/antigravity/scratch/mnvision360/backend/app/ml/whatif_simulator.py))**: Non-mutating scenario simulator operating on an isolated copy of mine state, recalculating `ShortfallShield` forecasts, `SHAP` explanations, and passing modified states to the Prescriptive Optimizer.
3. **What-If Simulator UI ([`frontend/src/pages/WhatIfSimulator.tsx`](file:///C:/Users/swaro/.gemini/antigravity/scratch/mnvision360/frontend/src/pages/WhatIfSimulator.tsx))**: Interactive page with 1-click presets, scenario configuration sliders, baseline vs scenario cards, SHAP breakdowns, recovery plan cards, comparison matrix, and scenario history logs.
4. **MnAssist AI & Voice Command Integration ([`frontend/src/components/MnAssist.tsx`](file:///C:/Users/swaro/.gemini/antigravity/scratch/mnvision360/frontend/src/components/MnAssist.tsx))**: Real-time integration with backend APIs (`POST /api/whatif/simulate`, `POST /api/optimizer/optimize`, `GET /api/targets`) for voice and text queries.
5. **Closed-Loop Exploration & Retraining ([`backend/app/api/drilling.py`](file:///C:/Users/swaro/.gemini/antigravity/scratch/mnvision360/backend/app/api/drilling.py))**: Full loop connecting Drill Target $\rightarrow$ Core Drilling $\rightarrow$ Lab Assay $\rightarrow$ Ground Truth Validation $\rightarrow$ Controlled Model Retraining (`POST /api/exploration/retrain-model`).
6. **Enterprise Security & Audit Logging**: Hardened JWT authentication, bcrypt password hashing, IP rate limiting, server-side RBAC dependency checks, security headers middleware, and audit event logging (`backend/app/services/audit_service.py`).

### B. What Was Changed & Refined
- Upgraded `Header.tsx` to include `WHAT-IF SIMULATOR` navigation.
- Connected `ShortfallShield`'s "Generate Prescriptive Recovery Plan" button to `/decisions` and `/what-if`.
- Updated `App.tsx` router with role-protected `/what-if` route.

---

## 🏃 3. How to Run the Application

### Backend Server (FastAPI Daemon)
```powershell
cd C:\Users\swaro\.gemini\antigravity\scratch\mnvision360\backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Docs: `http://127.0.0.1:8000/api/docs`

### Frontend Server (Vite React)
```powershell
cd C:\Users\swaro\.gemini\antigravity\scratch\mnvision360\frontend
npm run dev
```
- Web Application: `http://localhost:3000/`

---

## 🎬 4. How to Demonstrate the Complete SIH Workflow

### Step 1: Scientific Exploration Pipeline (PREDICT & EXPLAIN)
1. Open `http://localhost:3000/exploration`.
2. Inspect the **Manganese Prospectivity Map** showing multi-source evidence layers (Sentinel-1 SAR, Sentinel-2 Optical, DEM, Geology, Geophysics, and CEM Spectral Anomaly).
3. Click on Target **Target-1** or **T-004**:
   - Review Prospectivity Score (e.g. `0.892`), Scientific Confidence (e.g. `91.0%`), and Applicability Domain status (`IN_DOMAIN`).
   - Click **"Handoff to DrillTarget AI"**.

### Step 2: Drill Target & Closed-Loop Validation (EVALUATE & LEARN)
1. Navigate to `/drill-planning`.
2. Review the generated **AI Target Polygon** and drilling recommendation workflow.
3. Click **"Log Core Assay Sample"**:
   - Log sample `SMP-BAL-001` with `36.8% Mn`.
   - Click **"Validate Ground Truth & Trigger Retrain"**. Notice the controlled retraining pipeline enqueuing validated samples to update model weights.

### Step 3: Operational Intelligence (OPTIMIZE & DECIDE)
1. Navigate to `/production` (**ShortfallShield**).
2. Observe the predicted **7-Day Shortfall** (-350 MT) and **Tree SHAP Root Cause Breakdown** (equipment downtime on EX-104 & drill delays).
3. Click **"Generate Prescriptive Recovery Plan"**.
4. You are taken to `/decisions` (**Prescriptive Mine Optimizer**):
   - Review **Plan A** (Block B-17 Activation + LHD-02 Redeployment) recovering `+350 MT` with constraint check badges (`PASS`).
   - Click **"Apply Plan A"** and approve dispatch to field command.

### Step 4: What-If Operational Simulation (SIMULATE)
1. Navigate to `/what-if` (**What-If Simulator**).
2. Click the quick preset **"⚡ What if E-17 is unavailable for 3 days?"**:
   - Observe baseline shortfall (-350 MT) vs new scenario shortfall (-710 MT, Risk: `CRITICAL`).
   - Inspect **SHAP Scenario Breakdown** explaining the -360 MT loss.
   - Review evaluated recovery options (Optimizer excludes E-17 during outage).
   - Click **"Reset to Baseline"** to confirm baseline state remained 100% unmutated.

### Step 5: MnAssist AI & Voice Interaction
1. Click the floating **MnAssist AI** widget in bottom-right.
2. Ask: *"What happens if E-17 is unavailable for 3 days?"*
3. Watch MnAssist call `/api/whatif/simulate` live and display exact calculated metrics, shortfall risk, and recovery plans!
