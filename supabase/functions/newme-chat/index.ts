import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { 
      status: 401, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }

  try {
    const { message, intensity, sessionId, memoryConsent } = await req.json();
    console.log("[newme-chat] Processing message:", { sessionId, intensity });

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Get user from JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (userError || !user) {
      console.error("[newme-chat] User error:", userError);
      throw new Error("User not found");
    }

    // 2. Fetch profile and memory if consent is given
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    let context = "";
    if (memoryConsent) {
      const { data: recentMessages } = await supabase
        .from("messages")
        .select("role, content")
        .eq("user_id", user.id)
        .eq("saved_to_memory", true)
        .order("created_at", { ascending: false })
        .limit(10);

      if (recentMessages && recentMessages.length > 0) {
        context = recentMessages
          .reverse()
          .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
          .join("\n");
      }
    }

    // 3. Define the persona based on intensity
    const systemPrompts: Record<string, string> = {
      soft: `You are NewMe, a warm, nurturing astrological psychologist. Use zodiac archetypes gently to validate the user. Be supportive and encouraging while helping them explore their inner landscape. Avoid predictions or fortune-telling. Focus on psychological patterns and self-discovery.`,
      direct: `You are NewMe, a precise and declarative astrological psychologist. Use zodiac archetypes as psychological lenses to track patterns and confront inconsistencies directly. Be provocative but constructive. No small talk. No predictions. Focus on transformation and truth.`,
      no_mercy: `You are NewMe, a brutally honest astrological psychologist. Use zodiac archetypes to strip away comfortable lies and delusions. Be provocative, confrontational, and direct. Challenge every excuse. No coddling, no predictions, no fortune-telling. Only truth that transforms.`,
    };

    const systemPrompt = `${systemPrompts[intensity] || systemPrompts.direct}

User Profile:
- Nickname: ${profile?.nickname || "Seeker"}
- Horoscope Sign: ${profile?.horoscope_sign || "Unknown"}
- Date of Birth: ${profile?.date_of_birth || "Unknown"}

${context ? `Recent conversation context:\n${context}` : "This is the start of a new conversation."}

Remember: You are an astrological psychologist, not a fortune teller. Use zodiac archetypes as psychological tools for self-discovery, not for predictions. Be ${intensity === "soft" ? "warm and supportive" : intensity === "no_mercy" ? "brutally honest" : "direct and precise"}.`;

    // 4. Call Lovable AI Gateway
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      console.error("[newme-chat] LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await aiResponse.text();
      console.error("[newme-chat] AI Gateway error:", aiResponse.status, errorText);
      throw new Error("AI service error");
    }

    const data = await aiResponse.json();
    const content = data.choices?.[0]?.message?.content || "I'm here to help you explore your inner world. What's on your mind?";

    // 5. Save messages to database using service role (bypasses RLS)
    const { error: insertError } = await supabase.from("messages").insert([
      {
        session_id: sessionId,
        user_id: user.id,
        role: "user",
        content: message,
        saved_to_memory: memoryConsent,
      },
      {
        session_id: sessionId,
        user_id: user.id,
        role: "assistant",
        content: content,
        saved_to_memory: memoryConsent,
      },
    ]);

    if (insertError) {
      console.error("[newme-chat] Error saving messages:", insertError);
      // Don't fail the request, just log the error
    }

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[newme-chat] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
