export interface GithubProfile {
  username: string;
  name: string | null;
  bio: string | null;
  avatar_url: string | null;
  profile_url: string;
  public_repositories: number;
  followers: number;
  following: number;
}

export interface GithubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  is_fork: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
}

export interface GithubContributions {
  total_contributions: number;
  daily_activity: Array<{
    date: string;
    count: number;
  }>;
}

export interface LeetCodeProfile {
  username: string;
  ranking: number | null;
  avatar_url: string | null;
  real_name: string | null;
  about: string | null;
  country: string | null;
}

export interface LeetCodeProblemStats {
  total: number;
  easy: number;
  medium: number;
  hard: number;
}

export interface LeetCodeActivity {
  active_years: number[];
  current_streak: number;
  total_active_days: number;
  daily_activity: Array<{
    date: string;
    count: number;
  }>;
}

export interface LeetCodeLanguage {
  language: string;
  problems_solved: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}