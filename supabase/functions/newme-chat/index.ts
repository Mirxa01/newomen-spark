"use client";

// @ts-ignore: URL imports are valid in Deno/Supabase Edge Functions
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// @ts-ignore: URL imports are valid in Deno/Supabase Edge Functions
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// @ts-ignore: Deno is available in Supabase edge functions
const _Deno = Deno;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }

  try {
    const { message, intensity, sessionId, memoryConsent } = await req.json();
    console.log("[newme-chat] Processing message:", { sessionId, intensity });

    const supabaseUrl = _Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = _Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Get user from JWT
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (userError || !user) throw new Error("User not found");

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

      if (recentMessages) {
        context = recentMessages
          .reverse()
          .map((m: any) => `${m.role}: ${m.content}`)
          .join("\n");
      }
    }

    // 3. Define the persona based on intensity
    const systemPrompts = {
      soft: "You are NewMe, a warm, nurturing astrological psychologist. Use zodiac archetypes gently to validate the user. Be supportive.",
      direct:
        "You are NewMe, a precise and declarative astrological psychologist. Use zodiac archetypes to track patterns and confront inconsistencies directly.",
      no_mercy:
        "You are NewMe, a brutally honest astrological psychologist. Use zodiac archetypes to strip away comfortable lies. Be provocative and direct.",
    };

    const systemPrompt = `${
      systemPrompts[intensity as keyof typeof systemPrompts] ||
      systemPrompts.direct
    } 
    User nickname: ${profile?.nickname || "there"}. 
    User horoscope: ${profile?.horoscope_sign || "unknown"}.
    Past context:
    ${context}`;

    // 4. Call OpenAI (Simplified for now, expecting real API key in secrets)
    const openAiKey = _Deno.env.get("OPENAI_API_KEY");
    if (!openAiKey) {
      // Fallback response if no key is set yet
      const fallbackResponse = `[Demo Mode] As a ${intensity} guide, I hear you. You mentioned "${message}". Let's explore your ${
        profile?.horoscope_sign || "inner"
      } archetypes.`;

      // Save messages
      await supabase.from("messages").insert([
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
          content: fallbackResponse,
          saved_to_memory: memoryConsent,
        },
      ]);

      return new Response(JSON.stringify({ content: fallbackResponse }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;

    // 5. Save to database
    await supabase.from("messages").insert([
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

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[newme-chat] Error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});