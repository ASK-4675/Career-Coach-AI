import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

// Layouts & Guards
import { PublicLayout } from "./components/layout/PublicLayout";
import { MainLayout } from "./components/layout/MainLayout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfileSetupPage } from "./pages/ProfileSetupPage";
import { DepartmentSelectionPage } from "./pages/DepartmentSelectionPage";
import { CareerRoleSelectionPage } from "./pages/CareerRoleSelectionPage";
import { DashboardPage } from "./pages/DashboardPage";
import { InterviewCoachPage } from "./pages/InterviewCoachPage";
import { QuestionBankPage } from "./pages/QuestionBankPage";
import { CommunicationCoachPage } from "./pages/CommunicationCoachPage";
import { SkillGapAnalysisPage } from "./pages/SkillGapAnalysisPage";
import { RoadmapPage } from "./pages/RoadmapPage";
import { WeeklyReportPage } from "./pages/WeeklyReportPage";
import { ProfileSettingsPage } from "./pages/ProfileSettingsPage";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Authenticated Dashboard & Feature Routes guarded by ProtectedRoute */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile-setup" element={<ProfileSetupPage />} />
            <Route path="/departments" element={<DepartmentSelectionPage />} />
            <Route path="/career-roles" element={<CareerRoleSelectionPage />} />
            <Route path="/interview-coach" element={<InterviewCoachPage />} />
            <Route path="/question-bank" element={<QuestionBankPage />} />
            <Route path="/communication-coach" element={<CommunicationCoachPage />} />
            <Route path="/skill-gap" element={<SkillGapAnalysisPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/weekly-report" element={<WeeklyReportPage />} />
            <Route path="/settings" element={<ProfileSettingsPage />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
