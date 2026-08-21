import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import authService from "../services/auth.service";

export function useAuth() {
  const query = useQuery({
    queryKey: ["auth", "me"],

    queryFn: authService.getMe,

    retry: false,

    staleTime: 60_000,

    throwOnError: false,
  });

  const isUnauthorized =
    axios.isAxiosError(query.error) &&
    query.error.response?.status === 401;

  return {
    ...query,

    isAuthenticated: query.data?.authenticated === true,
    isAdmin: query.data?.admin === true,

    isUnauthorized,
  };
}