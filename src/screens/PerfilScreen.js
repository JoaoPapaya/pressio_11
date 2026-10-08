import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import MenuButton from '../components/MenuButton';
import { colors, gradients, spacing, typography } from '../theme/theme';
import { useReadings } from '../data/ReadingsContext';

const ICON = (name) => <Feather name={name} size={24} color={colors.textPrimary} />;

export default function PerfilScreen() {
  const { profile } = useReadings();
  const soon = (t) => () => Alert.alert(t, 'Esta seção será liberada em breve.');

  return (
    <View style={styles.screen}>
      <LinearGradient colors={gradients.background} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.brand}>Pressio</Text>

        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Feather name="user" size={40} color={colors.textPrimary} />
          </View>
          <Text style={styles.name}>{profile.fullName}</Text>
        </View>

        <MenuButton icon={ICON('user')} title="Conta" subtitle="Nome, senha, email" onPress={soon('Conta')} />
        <MenuButton icon={ICON('edit-2')} title="Avatar" subtitle="Criar, alterar" onPress={soon('Avatar')} />
        <MenuButton icon={ICON('bell')} title="Notificação" subtitle="Preferências, lembretes, alertas" onPress={soon('Notificação')} />
        <MenuButton icon={ICON('eye')} title="Acessibilidade" subtitle="Fonte, contraste, idioma" onPress={soon('Acessibilidade')} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { padding: spacing.lg, paddingTop: spacing.xxl, paddingBottom: 110, gap: spacing.md },
  brand: typography.brand,
  userRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginVertical: spacing.lg },
  avatar: {
    width: 84, height: 84, borderRadius: 42, backgroundColor: colors.card,
    borderWidth: 2, borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center',
  },
  name: { ...typography.h1, fontSize: 22, flex: 1 },
});
