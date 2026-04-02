import type { RecentTarget, SupabaseSubdomain } from "@/types/types";
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
