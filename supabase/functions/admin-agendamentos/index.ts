import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiter
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return true;
  if (now - record.lastAttempt > LOCKOUT_MS) {
    loginAttempts.delete(ip);
    return true;
  }
  return record.count < MAX_ATTEMPTS;
}

function recordAttempt(ip: string, success: boolean) {
  if (success) {
    loginAttempts.delete(ip);
    return;
  }
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (record) {
    record.count++;
    record.lastAttempt = now;
  } else {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";

  const body = await req.json();
  const { password, action, id, updates } = body;

  // Rate limit check
  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "Muitas tentativas. Tente novamente em 15 minutos." }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const adminPassword = Deno.env.get("ADMIN_PASSWORD");
  if (!password || password !== adminPassword) {
    recordAttempt(ip, false);
    return new Response(
      JSON.stringify({ error: "Senha incorreta" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  recordAttempt(ip, true);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  if (action === "list") {
    const { data, error } = await supabase
      .from("agendamentos")
      .select("*")
      .order("dia", { ascending: true })
      .order("horario", { ascending: true });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (action === "delete" && id) {
    const { error } = await supabase
      .from("agendamentos")
      .delete()
      .eq("id", id);

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (action === "update" && id && updates) {
    const allowedFields = ["servico", "barbeiro", "dia", "horario", "obs"];
    const sanitized: Record<string, string> = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        sanitized[key] = String(updates[key]);
      }
    }

    if (Object.keys(sanitized).length === 0) {
      return new Response(
        JSON.stringify({ error: "Nenhum campo válido para atualizar" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error } = await supabase
      .from("agendamentos")
      .update(sanitized)
      .eq("id", id);

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ error: "Ação inválida" }),
    { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
