import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import ProjectsPage from "./pages/admin/ProjectsPage";
import ExperiencePage from "./pages/admin/ExperiencePage";
import SkillsPage from "./pages/admin/SkillsPage";
import EducationPage from "./pages/admin/EducationPage";
import AchievementsPage from "./pages/admin/AchievementsPage";
import CertificationsPage from "./pages/admin/CertificationsPage";
import SocialLinksPage from "./pages/admin/SocialLinksPage";
import MessagesPage from "./pages/admin/MessagesPage";
import SiteSettingsPage from "./pages/admin/SiteSettingsPage";
import AdminLoginPage from "./pages/auth/AdminLoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================================
            PUBLIC APPLICATION
        ================================= */}

        <Route
          path="/"
          element={
            <div className="flex min-h-screen items-center justify-center">
              <h1 className="text-3xl font-semibold">
                Portfolio
              </h1>
            </div>
          }
        />

        {/* ================================
            ADMIN AUTHENTICATION
        ================================= */}

        <Route
          path="/admin/login"
          element={<AdminLoginPage />}
        />

        {/* ================================
            PROTECTED ADMIN APPLICATION
        ================================= */}

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>

            {/* Dashboard */}

            <Route
              path="/admin"
              element={<DashboardPage />}
            />

            {/* Projects */}

            <Route
              path="/admin/projects"
              element={<ProjectsPage />}
            />

            {/* Future admin pages */}

            <Route
              path="/admin/experience"
              element={<ExperiencePage/>}
            />

            <Route
              path="/admin/skills"
              element={<SkillsPage/>}
            />

            <Route
              path="/admin/education"
              element={<EducationPage/>}
            />

            <Route
              path="/admin/achievements"
              element={<AchievementsPage/>}
            />

            <Route
              path="/admin/certifications"
              element={<CertificationsPage/>}
            />

            <Route
              path="/admin/social-links"
              element={<SocialLinksPage/>}
            />

            <Route
              path="/admin/messages"
              element={<MessagesPage/>}
            />

            <Route
              path="/admin/settings"
              element={<SiteSettingsPage/>}
            />

          </Route>
        </Route>

        {/* ================================
            FALLBACK
        ================================= */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;