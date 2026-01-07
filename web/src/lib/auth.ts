import { supabase } from "./supabase";

const setSessionCookie = (token: string) => {
  document.cookie = `session=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
};

const removeSessionCookie = () => {
  document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

export async function login(payload: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signInWithPassword(payload);
  if (error) throw error;
  if (data.session) {
    setSessionCookie(data.session.access_token);
  }
  return data;
}

export async function registerUser(payload: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signUp(payload);
  if (error) throw error;
  if (data.session) {
    setSessionCookie(data.session.access_token);
  }
  return data;
}

export async function forgotPassword(payload: { email: string }) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(payload.email);
  if (error) throw error;
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  removeSessionCookie();
  if (error) throw error;
}
