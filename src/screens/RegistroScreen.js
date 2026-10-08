import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AuthInput from '../components/AuthInput';
import SocialButtons from '../components/SocialButtons';
import { colors, gradients, radii, spacing, typography } from '../theme/theme';
import { useReadings } from '../data/ReadingsContext';

export default function RegistroScreen({ navigation }) {
  const { register, login } = useReadings();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [aceito, setAceito] = useState(false);
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    if (nome.trim().split(/\s+/).length < 2) e.nome = 'Informe nome e sobrenome.';
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Informe um e-mail válido.';
    if (senha.length < 6) e.senha = 'A senha deve ter ao menos 6 caracteres.';
    if (!aceito) e.termos = 'Aceite os Termos de Privacidade para continuar.';
    setErrors(e);
    if (Object.keys(e).length) return;
    register({ fullName: nome.trim(), email });
    navigation.replace('Tabs');
  };

  const social = (provider) => {
    login({ email: `${provider.toLowerCase()}@conta.com` });
    navigation.replace('Tabs');
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={gradients.background} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
          <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
          <Text style={styles.backLabel}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.hero}>
          <View style={styles.logo}>
            <Ionicons name="heart" size={36} color={colors.textPrimary} />
          </View>
          <Text style={styles.title}>Crie sua conta!</Text>
        </View>

        <AuthInput icon="user" label="Nome completo" placeholder="Maria Alice Nobrega Campos" autoCapitalize="words" value={nome} onChangeText={setNome} error={errors.nome} />
        <AuthInput icon="user" label="Email" placeholder="email.exemplo@gmail.com" keyboardType="email-address" value={email} onChangeText={setEmail} error={errors.email} />
        <AuthInput icon="lock" label="Senha" secure placeholder="Mínimo de 6 caracteres" value={senha} onChangeText={setSenha} error={errors.senha} />

        <TouchableOpacity style={styles.termsRow} onPress={() => setAceito((a) => !a)} activeOpacity={0.8}>
          <Ionicons name={aceito ? 'checkbox' : 'square-outline'} size={18} color={aceito ? colors.accentBlue : colors.textSecondary} />
          <Text style={styles.terms}>Aceito os Termos de Privacidade</Text>
        </TouchableOpacity>
        {errors.termos ? <Text style={styles.error}>{errors.termos}</Text> : null}

        <TouchableOpacity activeOpacity={0.85} onPress={submit}>
          <LinearGradient colors={gradients.button} style={styles.cta}>
            <Text style={styles.ctaLabel}>Entrar</Text>
          </LinearGradient>
        </TouchableOpacity>

        <SocialButtons onPress={social} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já possui uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.footerLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { padding: spacing.xl, paddingTop: spacing.xxl, gap: spacing.lg, paddingBottom: spacing.xxl },
  backRow: { flexDirection: 'row', alignItems: 'center' },
  backLabel: { ...typography.label, marginLeft: 2 },
  hero: { alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
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
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  terms: typography.label,
  error: { color: colors.danger, fontSize: 11, marginTop: -spacing.sm },
  cta: { borderRadius: radii.pill, paddingVertical: spacing.lg, alignItems: 'center' },
  ctaLabel: { color: colors.white, fontWeight: '700', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: typography.label,
  footerLink: { ...typography.label, color: colors.accentBlue, fontWeight: '700' },
});
