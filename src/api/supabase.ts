import type { Target } from "@/types/types";
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
  return data as Target[];
}
