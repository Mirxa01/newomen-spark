import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { getSupabase } from "@/lib/supabase";

interface AdminRoleState {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
  error: Error | null;
}

export function useAdminRole(): AdminRoleState {
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<AdminRoleState>({
    isAdmin: false,
    isSuperAdmin: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function checkAdminRole() {
      if (authLoading) {
        return;
      }

      if (!user) {
        setState({
          isAdmin: false,
          isSuperAdmin: false,
          loading: false,
          error: null,
        });
        return;
      }

      try {
        const supabase = await getSupabase();
        if (!supabase) {
          setState({
            isAdmin: false,
            isSuperAdmin: false,
            loading: false,
            error: new Error("Backend not configured"),
          });
          return;
        }

        // Query the user_roles table for admin roles
        const { data: roles, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error checking admin role:", error);
          setState({
            isAdmin: false,
            isSuperAdmin: false,
            loading: false,
            error: error as Error,
          });
          return;
        }

        const roleList = roles?.map((r) => r.role) || [];
        const isAdmin = roleList.includes("admin") || roleList.includes("super_admin");
        const isSuperAdmin = roleList.includes("super_admin");

        setState({
          isAdmin,
          isSuperAdmin,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error("Error in useAdminRole:", err);
        setState({
          isAdmin: false,
          isSuperAdmin: false,
          loading: false,
          error: err as Error,
        });
      }
    }

    checkAdminRole();
  }, [user, authLoading]);

  return state;
}
