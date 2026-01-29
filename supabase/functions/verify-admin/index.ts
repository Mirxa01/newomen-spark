import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdminVerifyResponse {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  error?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ isAdmin: false, isSuperAdmin: false, error: "No authorization header" } as AdminVerifyResponse),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ isAdmin: false, isSuperAdmin: false, error: "Not authenticated" } as AdminVerifyResponse),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Query the user_roles table for admin roles
    const { data: roles, error: rolesError } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    if (rolesError) {
      console.error("Roles query error:", rolesError);
      return new Response(
        JSON.stringify({ isAdmin: false, isSuperAdmin: false, error: "Failed to check roles" } as AdminVerifyResponse),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const roleList = roles?.map((r) => r.role) || [];
    const isAdmin = roleList.includes("admin") || roleList.includes("super_admin");
    const isSuperAdmin = roleList.includes("super_admin");

    console.log(`Admin verification for user ${user.id}: isAdmin=${isAdmin}, isSuperAdmin=${isSuperAdmin}`);

    return new Response(
      JSON.stringify({ isAdmin, isSuperAdmin } as AdminVerifyResponse),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ isAdmin: false, isSuperAdmin: false, error: "Internal server error" } as AdminVerifyResponse),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
