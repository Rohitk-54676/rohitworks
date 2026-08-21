import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/projects": "Projects",
  "/admin/experience": "Experience",
  "/admin/skills": "Skills",
  "/admin/education": "Education",
  "/admin/achievements": "Achievements",
  "/admin/certifications": "Certifications",
  "/admin/social-links": "Social Links",
  "/admin/messages": "Messages",
  "/admin/settings": "Settings",
};

export default function AdminHeader({
  onMenuClick,
}: AdminHeaderProps) {
  const location = useLocation();

  const title = pageTitles[location.pathname] ?? "Admin";

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-base font-semibold text-slate-900">
            {title}
          </h1>
          <p className="hidden text-xs text-slate-500 sm:block">
            Manage your professional portfolio
          </p>
        </div>
      </div>
    </header>
  );
}