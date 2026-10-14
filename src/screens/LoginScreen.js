import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AuthInput from '../components/AuthInput';
import SocialButtons from '../components/SocialButtons';
import { colors, gradients, radii, spacing, typography } from '../theme/theme';
import { useAuth } from '../data/AuthContext';
import { notify } from '../utils/dialogs';
import { friendlyAuthError } from '../utils/authErrors';

export default function LoginScreen({ navigation }) {
  const { signIn, resetPassword, isSupabaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [aceito, setAceito] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Informe um e-mail válido.';
    if (senha.length < 6) e.senha = 'A senha deve ter ao menos 6 caracteres.';
    if (!aceito) e.termos = 'Aceite os Termos de Privacidade para continuar.';
    setErrors(e);
    if (Object.keys(e).length) return;
    if (!isSupabaseConfigured) {
      notify('Supabase não configurado', 'Preencha o arquivo .env com a URL e a chave do seu projeto.');
      return;
    }
    setLoading(true);
    try {
      await signIn({ email, password: senha });
      // A navegação para o app acontece sozinha quando a sessão é criada.
    } catch (err) {
      setErrors({ form: friendlyAuthError(err) });
      setLoading(false);
    }
  };

  const forgot = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrors({ email: 'Digite seu e-mail acima para receber o link de redefinição.' });
      return;
    }
    try {
      await resetPassword(email);
      notify('Verifique seu e-mail', 'Se houver uma conta com esse e-mail, enviamos um link para redefinir a senha.');
    } catch (err) {
      notify('Não foi possível enviar', friendlyAuthError(err));
    }
  };

  const social = (provider) =>
    notify(`Entrar com ${provider}`, 'Este método ainda não está ativo. Entre com e-mail e senha.');

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={gradients.background} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.logo}>
            <Ionicons name="heart" size={36} color={colors.textPrimary} />
          </View>
          <Text style={styles.title}>Bem-vindo(a) de volta!</Text>
        </View>

        <AuthInput
          icon="user"
          label="Email"
          placeholder="email.exemplo@gmail.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />
        <AuthInput
          icon="lock"
          label="Senha"
          secure
          placeholder="Sua senha"
          value={senha}
          onChangeText={setSenha}
          error={errors.senha}
        />

        <TouchableOpacity onPress={forgot}>
          <Text style={styles.link}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.termsRow} onPress={() => setAceito((a) => !a)} activeOpacity={0.8}>
          <Ionicons
            name={aceito ? 'checkbox' : 'square-outline'}
            size={18}
            color={aceito ? colors.accentBlue : colors.textSecondary}
          />
          <Text style={styles.terms}>Aceito os Termos de Privacidade</Text>
        </TouchableOpacity>
        {errors.termos ? <Text style={styles.error}>{errors.termos}</Text> : null}

        {errors.form ? <Text style={styles.error}>{errors.form}</Text> : null}

        <TouchableOpacity activeOpacity={0.85} onPress={submit} disabled={loading}>
          <LinearGradient colors={gradients.button} style={styles.cta}>
            {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.ctaLabel}>Entrar</Text>}
          </LinearGradient>
        </TouchableOpacity>

        <SocialButtons onPress={social} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não possui uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
            <Text style={styles.footerLink}>Registrar-se</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { padding: spacing.xl, paddingTop: spacing.xxl * 1.5, gap: spacing.lg, paddingBottom: spacing.xxl },
  hero: { alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...typography.h1, fontSize: 22, textAlign: 'center' },
  link: { ...typography.label, color: colors.accentBlue },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  terms: typography.label,
  error: { color: colors.danger, fontSize: 11, marginTop: -spacing.sm },
  cta: { borderRadius: radii.pill, paddingVertical: spacing.lg, alignItems: 'center' },
  ctaLabel: { color: colors.white, fontWeight: '700', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: typography.label,
  footerLink: { ...typography.label, color: colors.accentBlue, fontWeight: '700' },
});
