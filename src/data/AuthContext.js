import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaura a sessão salva e acompanha login/logout.
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return undefined;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (!next) setProfile(null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id;

  // READ: carrega o perfil do usuário logado (cria se o gatilho do banco ainda não criou).
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const user = session.user;
      let { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (!data) {
        const fallback = {
          id: userId,
          email: user.email,
          full_name: user.user_metadata?.full_name || (user.email || '').split('@')[0] || 'Usuário',
        };
        const res = await supabase.from('profiles').upsert(fallback).select().maybeSingle();
        data = res.data || fallback;
      }
      if (!cancelled) setProfile(data);
    })();
    return () => { cancelled = true; };
  }, [userId]);

  // CREATE: cria a conta; o perfil nasce via gatilho (supabase/schema.sql).
  const signUp = useCallback(async ({ fullName, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: fullName.trim() } },
    });
    if (error) throw error;
    // Com confirmação de e-mail ligada, não há sessão até a pessoa confirmar.
    return { needsConfirmation: !data.session };
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const resetPassword = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (error) throw error;
  }, []);

  // UPDATE: nome do perfil e senha.
  const updateProfile = useCallback(async ({ fullName }) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim() })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    setProfile(data);
  }, [userId]);

  const updatePassword = useCallback(async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  }, []);

  // DELETE: apaga a conta (e o perfil, por cascata) e encerra a sessão.
  const deleteAccount = useCallback(async () => {
    const { error } = await supabase.rpc('delete_my_account');
    if (error) throw error;
    await supabase.auth.signOut({ scope: 'local' });
  }, []);

  const value = useMemo(
    () => ({
      session, profile, loading, isSupabaseConfigured,
      signUp, signIn, signOut, resetPassword, updateProfile, updatePassword, deleteAccount,
    }),
    [session, profile, loading, signUp, signIn, signOut, resetPassword, updateProfile, updatePassword, deleteAccount]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
