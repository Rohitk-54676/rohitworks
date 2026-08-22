import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ScrollToTop from "./components/common/ScrollToTop";
import HomePage from "./pages/public/HomePage";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import ProjectsPage from "./pages/admin/ProjectsPage";
import ExperiencePage from "./pages/admin/ExperiencePage";
import SkillsPage from "./pages/admin/SkillsPage";
import TechnologiesPage from "./pages/admin/TechnologiesPage";
import EducationPage from "./pages/admin/EducationPage";
import AchievementsPage from "./pages/admin/AchievementsPage";
import CertificationsPage from "./pages/admin/CertificationsPage";
import SocialLinksPage from "./pages/admin/SocialLinksPage";
import MessagesPage from "./pages/admin/MessagesPage";
import SiteSettingsPage from "./pages/admin/SiteSettingsPage";
import AdminLoginPage from "./pages/auth/AdminLoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import Chatbot from "./components/common/Chatbot";
import ProjectDetailsPage from "./pages/public/ProjectDetailsPage";
import ProjectsListPage from "./pages/public/AllProjectsPage";
import SkillsListPage from "./pages/public/SkillsListPage";

function App() {
  return (
    <BrowserRouter>
     <ScrollToTop />
      <Routes>
        {/* ================================
            PUBLIC APPLICATION
        ================================= */}

        <Route
          path="/"
          element={<HomePage/>}
        />
        <Route
          path="/projects"
          element={<ProjectsListPage />}
        />
        <Route
          path="/projects/:slug"
          element={<ProjectDetailsPage />}
        />
        <Route
          path="/skills"
          element={<SkillsListPage />}
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
              path="/admin/technologies"
              element={<TechnologiesPage />}
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
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;