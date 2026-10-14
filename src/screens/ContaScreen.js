import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import AuthInput from '../components/AuthInput';
import GlassCard from '../components/GlassCard';
import { colors, gradients, radii, spacing, typography } from '../theme/theme';
import { useAuth } from '../data/AuthContext';
import { confirm, notify } from '../utils/dialogs';
import { friendlyAuthError } from '../utils/authErrors';

export default function ContaScreen({ navigation }) {
  const { profile, session, updateProfile, updatePassword, deleteAccount } = useAuth();
  const [nome, setNome] = useState(profile?.full_name || '');
  const [senha, setSenha] = useState('');
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(null); // 'nome' | 'senha' | 'excluir'

  useEffect(() => {
    if (profile?.full_name) setNome(profile.full_name);
  }, [profile?.full_name]);

  const saveName = async () => {
    if (nome.trim().split(/\s+/).length < 2) {
      setErrors({ nome: 'Informe nome e sobrenome.' });
      return;
    }
    setErrors({});
    setBusy('nome');
    try {
      await updateProfile({ fullName: nome });
      notify('Nome atualizado', 'Seu perfil foi salvo.');
    } catch (err) {
      setErrors({ nome: friendlyAuthError(err) });
    } finally {
      setBusy(null);
    }
  };

  const savePassword = async () => {
    if (senha.length < 6) {
      setErrors({ senha: 'A senha deve ter ao menos 6 caracteres.' });
      return;
    }
    setErrors({});
    setBusy('senha');
    try {
      await updatePassword(senha);
      setSenha('');
      notify('Senha alterada', 'Use a nova senha no próximo login.');
    } catch (err) {
      setErrors({ senha: friendlyAuthError(err) });
    } finally {
      setBusy(null);
    }
  };

  const remove = async () => {
    const ok = await confirm(
      'Excluir conta',
      'Sua conta e seus dados de perfil serão apagados de forma permanente. Essa ação não pode ser desfeita.',
      'Excluir'
    );
    if (!ok) return;
    setBusy('excluir');
    try {
      await deleteAccount(); // a sessão termina e o app volta ao Login
    } catch (err) {
      setBusy(null);
      notify('Não foi possível excluir', friendlyAuthError(err));
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={gradients.background} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <ScreenHeader navigation={navigation} subtitle="Minha Conta" />

        <GlassCard style={styles.card}>
          <AuthInput icon="user" label="Nome completo" autoCapitalize="words" value={nome} onChangeText={setNome} error={errors.nome} />
          <View>
            <View style={styles.emailLabel}>
              <Feather name="mail" size={16} color={colors.textPrimary} />
              <Text style={styles.emailTitle}>Email</Text>
            </View>
            <Text style={styles.email}>{session?.user?.email}</Text>
          </View>
          <PrimaryButton label="Salvar nome" loading={busy === 'nome'} onPress={saveName} />
        </GlassCard>

        <GlassCard style={styles.card}>
          <AuthInput icon="lock" label="Nova senha" secure placeholder="Mínimo de 6 caracteres" value={senha} onChangeText={setSenha} error={errors.senha} />
          <PrimaryButton label="Alterar senha" loading={busy === 'senha'} onPress={savePassword} />
        </GlassCard>

        <TouchableOpacity style={styles.danger} onPress={remove} disabled={busy === 'excluir'}>
          {busy === 'excluir' ? (
            <ActivityIndicator color={colors.danger} />
          ) : (
            <Text style={styles.dangerLabel}>Excluir minha conta</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function PrimaryButton({ label, loading, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} disabled={loading}>
      <LinearGradient colors={gradients.button} style={styles.cta}>
        {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.ctaLabel}>{label}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { padding: spacing.lg, paddingTop: spacing.xxl, paddingBottom: 110, gap: spacing.lg },
  card: { gap: spacing.md },
  emailLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  emailTitle: { ...typography.h2, fontSize: 13 },
  email: { color: colors.textSecondary, fontSize: 14 },
  cta: { borderRadius: radii.pill, paddingVertical: spacing.md, alignItems: 'center' },
  ctaLabel: { color: colors.white, fontWeight: '700', fontSize: 14 },
  danger: {
    borderWidth: 1, borderColor: colors.danger, borderRadius: radii.pill,
    paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.sm,
  },
  dangerLabel: { color: colors.danger, fontWeight: '700', fontSize: 14 },
});
