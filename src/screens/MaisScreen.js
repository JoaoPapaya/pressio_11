import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import MenuButton from '../components/MenuButton';
import { colors, gradients, radii, spacing, typography } from '../theme/theme';
import { useAuth } from '../data/AuthContext';
import { notify } from '../utils/dialogs';

const ICON = (name) => <Feather name={name} size={24} color={colors.textPrimary} />;

export default function MaisScreen({ navigation }) {
  const { signOut } = useAuth();

  const info = (title, msg) => () => notify(title, msg);
  // Ao encerrar a sessão, o app volta ao Login sozinho.
  const exit = async () => {
    try {
      await signOut();
    } catch (err) {
      notify('Não foi possível sair', err.message);
    }
  };

  return (
    <View style={styles.screen}>
      <LinearGradient colors={gradients.background} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.brand}>Pressio</Text>

        <MenuButton center icon={ICON('lock')} title="Termos de Privacidade"
          onPress={info('Termos de Privacidade', 'Seus dados de saúde são usados somente para o seu acompanhamento.')} />
        <MenuButton center icon={ICON('headphones')} title="Central de ajuda"
          onPress={info('Central de ajuda', 'Precisa de ajuda? Fale com o suporte pelo e-mail suporte@pressio.app.')} />
        <MenuButton center icon={ICON('settings')} title="Gerenciamento"
          onPress={() => navigation.getParent()?.navigate('Exportacao')} />
        <MenuButton center icon={ICON('info')} title="Sobre"
          onPress={info('Sobre', 'Pressio 1.0.0 — acompanhamento de pressão arterial e glicemia.')} />

        <View style={styles.exitWrap}>
          <TouchableOpacity style={styles.exitBtn} onPress={exit}>
            <Text style={styles.exitLabel}>Sair</Text>
          </TouchableOpacity>
          <View style={styles.otherRow}>
            <Text style={styles.otherText}>Entrar em outra </Text>
            <TouchableOpacity onPress={exit}>
              <Text style={styles.otherLink}>Conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { padding: spacing.lg, paddingTop: spacing.xxl, paddingBottom: 110, gap: spacing.md },
  brand: { ...typography.brand, textAlign: 'center', marginBottom: spacing.md },
  exitWrap: { marginTop: spacing.xl, gap: spacing.sm, alignItems: 'center' },
  exitBtn: {
    alignSelf: 'stretch', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder,
    borderRadius: radii.pill, paddingVertical: spacing.md, alignItems: 'center',
  },
  exitLabel: { color: colors.textPrimary, fontWeight: '700', fontSize: 15 },
  otherRow: { flexDirection: 'row' },
  otherText: typography.small,
  otherLink: { ...typography.small, color: colors.accentBlue },
});
