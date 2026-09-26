import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppShell } from './components/AppShell';
import { PublicPortal } from './pages/PublicPortal';
import { CommandCenter } from './pages/CommandCenter';
import { ExplorationMap } from './pages/ExplorationMap';
import { DrillPlanning } from './pages/DrillPlanning';
import { TargetAnalysis } from './pages/TargetAnalysis';
import { MineTwin } from './pages/MineTwin';
import { Production } from './pages/Production';
import { ProductionShortfall } from './pages/ProductionShortfall';
import { Equipment } from './pages/Equipment';
import { DecisionCenter } from './pages/DecisionCenter';
import { FieldSurvey } from './pages/FieldSurvey';
import { DataModels } from './pages/DataModels';
import { Contact } from './pages/Contact';
import { Weather } from './pages/Weather';
import { Security } from './pages/Security';
import { WhatIfSimulator } from './pages/WhatIfSimulator';
import { TargetResource } from './pages/TargetResource';
import { ShortfallAnalysis } from './pages/ShortfallAnalysis';
import { CorrectiveActions } from './pages/CorrectiveActions';
import { Optimization } from './pages/Optimization';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Corporate Website & Landing Page */}
          <Route path="/" element={<PublicPortal />} />
          <Route path="/login" element={<PublicPortal />} />
          <Route path="/contact" element={<Contact />} />

          {/* Unified Authenticated Application Shell */}
          <Route
            path="/app"
            element={
              <ProtectedRoute path="/app">
                <AppShell />
              </ProtectedRoute>
            }
          >
            {/* Primary Logged-In Workspaces */}
            <Route index element={<CommandCenter />} />
            <Route path="command" element={<CommandCenter />} />
            <Route path="explore" element={<ExplorationMap />} />
            <Route path="explore/:targetId" element={<TargetAnalysis />} />
            <Route path="mine" element={<MineTwin />} />
            <Route path="produce" element={<Production />} />
            <Route path="decide" element={<DecisionCenter />} />
            <Route path="map" element={<ExplorationMap />} />

            {/* In-Context Workflow Pages */}
            <Route path="what-if" element={<WhatIfSimulator />} />
            <Route path="shortfall" element={<ProductionShortfall />} />
            <Route path="shortfall-analysis" element={<ShortfallAnalysis />} />
            <Route path="corrective-actions" element={<CorrectiveActions />} />
            <Route path="optimization" element={<Optimization />} />
            <Route path="target-resource" element={<TargetResource />} />
            <Route path="drill-planning" element={<DrillPlanning />} />
            <Route path="field-survey" element={<FieldSurvey />} />
            <Route path="equipment" element={<Equipment />} />
            <Route path="weather" element={<Weather />} />
            <Route path="security" element={<Security />} />
            <Route path="data-models" element={<DataModels />} />
          </Route>

          {/* Backward-Compatible Direct Routes (Wrapped in AppShell) */}
          <Route
            path="/exploration"
            element={
              <ProtectedRoute path="/exploration">
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<ExplorationMap />} />
            <Route path=":targetId" element={<TargetAnalysis />} />
          </Route>

          <Route
            path="/mine-twin"
            element={
              <ProtectedRoute path="/mine-twin">
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<MineTwin />} />
          </Route>

          <Route
            path="/production"
            element={
              <ProtectedRoute path="/production">
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Production />} />
          </Route>

          <Route
            path="/shortfall"
            element={
              <ProtectedRoute path="/shortfall">
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProductionShortfall />} />
          </Route>

          <Route
            path="/shortfall-analysis"
            element={
              <ProtectedRoute path="/shortfall-analysis">
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<ShortfallAnalysis />} />
          </Route>

          <Route
            path="/corrective-actions"
            element={
              <ProtectedRoute path="/corrective-actions">
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<CorrectiveActions />} />
          </Route>

          <Route
            path="/optimization"
            element={
              <ProtectedRoute path="/optimization">
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Optimization />} />
          </Route>

          <Route
            path="/what-if"
            element={
              <ProtectedRoute path="/what-if">
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<WhatIfSimulator />} />
          </Route>

          <Route
            path="/decisions"
            element={
              <ProtectedRoute path="/decisions">
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<DecisionCenter />} />
          </Route>

          <Route
            path="/drill-planning"
            element={
              <ProtectedRoute path="/drill-planning">
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<DrillPlanning />} />
          </Route>

          <Route
            path="/target-resource"
            element={
              <ProtectedRoute path="/target-resource">
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<TargetResource />} />
          </Route>

          <Route
            path="/field-survey"
            element={
              <ProtectedRoute path="/field-survey">
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<FieldSurvey />} />
          </Route>

          <Route
            path="/equipment"
            element={
              <ProtectedRoute path="/equipment">
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Equipment />} />
          </Route>

          <Route
            path="/security"
            element={
              <ProtectedRoute path="/security">
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Security />} />
          </Route>

          <Route
            path="/data-models"
            element={
              <ProtectedRoute path="/data-models">
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<DataModels />} />
          </Route>

          <Route
            path="/weather"
            element={
              <ProtectedRoute path="/weather">
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Weather />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
