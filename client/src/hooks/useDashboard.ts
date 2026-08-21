import { useQuery } from "@tanstack/react-query";

import dashboardService from "../services/dashboard.service";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: dashboardService.getOverview,
    staleTime: 30_000,
    retry: 1,
  });
}