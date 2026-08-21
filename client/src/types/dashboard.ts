export interface DashboardProject {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  thumbnail_url: string | null;
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  status: string;
  start_date: string | null;
  end_date: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardSkill {
  id: string;
  name: string;
  category: string;
  icon_reference: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardExperience {
  id: string;
  organization: string;
  role: string;
  location: string | null;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  achievements: string[] | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface DashboardOverview {
  projects: DashboardProject[];
  skills: DashboardSkill[];
  experience: DashboardExperience[];
  messages: DashboardContactMessage[];
}