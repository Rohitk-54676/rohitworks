import {
  Award,
  BriefcaseBusiness,
  Code2,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Link,
  Mail,
  Settings,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    path: "/admin/projects",
    icon: FolderKanban,
  },
  {
    label: "Experience",
    path: "/admin/experience",
    icon: BriefcaseBusiness,
  },
  {
    label: "Skills",
    path: "/admin/skills",
    icon: Sparkles,
  },
  {
    label: "Technologies",
    path: "/admin/technologies",
    icon: Code2,
  },
  {
    label: "Education",
    path: "/admin/education",
    icon: GraduationCap,
  },
  {
    label: "Achievements",
    path: "/admin/achievements",
    icon: Trophy,
  },
  {
    label: "Certifications",
    path: "/admin/certifications",
    icon: Award,
  },
  {
    label: "Social Links",
    path: "/admin/social-links",
    icon: Link,
  },
  {
    label: "Messages",
    path: "/admin/messages",
    icon: Mail,
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar({
  isOpen,
  onClose,
}: AdminSidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Rohit Kumar
            </p>
            <p className="text-xs text-slate-500">Portfolio Admin</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-slate-200 p-3">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
              <span className="text-xs font-semibold text-slate-700">
                RK
              </span>
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">
                Admin
              </p>
              <p className="text-xs text-slate-500">Authenticated</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}