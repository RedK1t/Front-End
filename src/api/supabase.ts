import type {
  RecentTarget,
  ScanRecordFull,
  ScanRecordMeta,
  ScanSummary,
  supabaseEndpoint,
  supabasePort,
  SupabaseSubdomain,
} from "@/types/types";
import type { vulnerabilities } from "@/features/AI-Scanner/types";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// user
export async function signUp(email: string, password: string, name: string) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  await updateUserName({ name });
  return;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function updateUserName(data: { name: string }) {
  const { error } = await supabase.auth.updateUser({
    data,
  });
  if (error) {
    throw error;
  }
}

export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Target
export async function getTargets() {
  const user = await getUser();
  if (!user) {
    return [];
  }
  const { data, error } = await supabase
    .from("targets")
    .select("*")
    .eq("user_id", user?.id);

  if (error) {
    throw error;
  }
  return data as RecentTarget[];
}

export async function getTarget(domain: string) {
  const user = await getUser();
  if (!user) {
    return [];
  }
  const { data, error } = await supabase
    .from("targets")
    .select("*")
    .eq("user_id", user?.id)
    .eq("domain", domain);

  if (error) {
    throw error;
  }
  return data as RecentTarget[];
}

export async function updateTarget(domain: string) {
  const user = await getUser();
  if (!user) {
    return [];
  }

  const { error } = await supabase
    .from("targets")
    .update({ created_at: new Date().toISOString() })
    .eq("user_id", user?.id)
    .eq("domain", domain)
    .select();

  if (error) {
    throw error;
  }
}

export async function deleteTarget(domain: string) {
  const user = await getUser();
  if (!user) {
    return [];
  }

  const { error } = await supabase
    .from("targets")
    .delete()
    .eq("user_id", user?.id)
    .eq("domain", domain)
    .select();

  if (error) {
    throw error;
  }
}

export async function insertNewTarget(domain: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("you must login");
  }
  const targetExists = await getTarget(domain);
  if (targetExists.length > 0) {
    await updateTarget(domain);
    return;
  }
  const { error } = await supabase
    .from("targets")
    .insert({ user_id: user?.id, domain });
  if (error) {
    throw error;
  }
}

// Subdomains
export async function getSubdomains(domain: string) {
  const { data, error } = await supabase
    .from("subdomains")
    .select("*")
    .eq("target_domain", domain);

  if (error) {
    throw error;
  }
  return data as SupabaseSubdomain[];
}

export async function insertSubdomains(subdomains: SupabaseSubdomain[]) {
  const data = await getSubdomains(subdomains[0].target_domain);
  if (data.length > 0) {
    return;
  }
  const { error } = await supabase
    .from("subdomains")
    .insert(subdomains)
    .select();
  if (error) {
    throw error;
  }
}

// Ports
export async function getPorts(subdomain: string) {
  const { data, error } = await supabase
    .from("ports")
    .select("*")
    .eq("sub_domain_name", subdomain);

  if (error) {
    throw error;
  }

  return data as supabasePort[];
}

export async function insertPorts(ports: supabasePort[]) {
  const { error } = await supabase.from("ports").insert(ports).select();
  if (error) {
    throw error;
  }
}

// endpoints
export async function getEndpoints(subdomain: string) {
  const { data, error } = await supabase
    .from("endpoints")
    .select("*")
    .eq("sub_domain_name", subdomain);

  if (error) {
    throw error;
  }

  return data as supabaseEndpoint[];
}

export async function insertEndpoints(endpoints: supabaseEndpoint[]) {
  const { error } = await supabase.from("endpoints").insert(endpoints).select();
  if (error) {
    throw error;
  }
}

// AI scanner — scan history (per-user `scans` table).
export async function insertScan(scan: {
  domain: string | null;
  target_url: string | null;
  scan_id: string | null;
  summary: ScanSummary | null;
  vulnerabilities: vulnerabilities;
}) {
  const user = await getUser();
  if (!user) {
    throw new Error("you must login");
  }
  const { error } = await supabase.from("scans").insert({
    user_id: user.id,
    domain: scan.domain,
    target_url: scan.target_url,
    scan_id: scan.scan_id,
    summary: scan.summary,
    vulnerabilities: scan.vulnerabilities,
  });
  if (error) {
    throw error;
  }
}

// Metadata only (no heavy vulnerabilities payload) for the history list, newest first.
export async function getScans() {
  const user = await getUser();
  if (!user) {
    return [];
  }
  const { data, error } = await supabase
    .from("scans")
    .select("id, domain, target_url, scan_id, summary, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }
  return data as ScanRecordMeta[];
}

// Full record (with findings) for opening a past scan.
export async function getScan(id: string) {
  const user = await getUser();
  if (!user) {
    return null;
  }
  const { data, error } = await supabase
    .from("scans")
    .select("*")
    .eq("user_id", user.id)
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }
  return data as ScanRecordFull;
}

export async function deleteScan(id: string) {
  const user = await getUser();
  if (!user) {
    return;
  }
  const { error } = await supabase
    .from("scans")
    .delete()
    .eq("user_id", user.id)
    .eq("id", id);

  if (error) {
    throw error;
  }
}
