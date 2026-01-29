import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

interface AdminRoleState {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
  error: Error | null;
  verified: boolean; // Indicates if server-side verification was performed
}

export function useAdminRole(): AdminRoleState {
  const { user, session, loading: authLoading } = useAuth();
  const [state, setState] = useState<AdminRoleState>({
    isAdmin: false,
    isSuperAdmin: false,
    loading: true,
    error: null,
    verified: false,
  });

  const verifyAdminServerSide = useCallback(async (accessToken: string): Promise<{ isAdmin: boolean; isSuperAdmin: boolean } | null> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-admin`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.warn("Server-side admin verification failed:", response.status);
        return null;
      }

      const data = await response.json();
      return { isAdmin: data.isAdmin, isSuperAdmin: data.isSuperAdmin };
    } catch (err) {
      console.warn("Server-side admin verification error:", err);
      return null;
    }
  }, []);

  useEffect(() => {
    async function checkAdminRole() {
      if (authLoading) {
        return;
      }

      if (!user || !session) {
        setState({
          isAdmin: false,
          isSuperAdmin: false,
          loading: false,
          error: null,
          verified: false,
        });
        return;
      }

      try {
        // First, try server-side verification (most secure)
        if (isSupabaseConfigured && session.access_token) {
          const serverResult = await verifyAdminServerSide(session.access_token);
          
          if (serverResult !== null) {
            setState({
              isAdmin: serverResult.isAdmin,
              isSuperAdmin: serverResult.isSuperAdmin,
              loading: false,
              error: null,
              verified: true,
            });
            return;
          }
        }

        // Fallback to client-side check (RLS still protects data)
        const supabase = await getSupabase();
        if (!supabase) {
          setState({
            isAdmin: false,
            isSuperAdmin: false,
            loading: false,
            error: new Error("Backend not configured"),
            verified: false,
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
            verified: false,
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
          verified: false, // Client-side check, not server-verified
        });
      } catch (err) {
        console.error("Error in useAdminRole:", err);
        setState({
          isAdmin: false,
          isSuperAdmin: false,
          loading: false,
          error: err as Error,
          verified: false,
        });
      }
    }

    checkAdminRole();
  }, [user, session, authLoading, verifyAdminServerSide]);

  return state;
}
