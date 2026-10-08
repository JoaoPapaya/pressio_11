import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import ScreenHeader from '../components/ScreenHeader';
import { colors, gradients, radii, spacing, typography } from '../theme/theme';
import { useReadings } from '../data/ReadingsContext';

const ICONS = { pill: 'pill', heart: 'heart-outline', drop: 'water-outline', syringe: 'needle' };
const PERIODS = ['Manhã', 'Almoço', 'Jantar', 'Noite'];

export default function LembretesScreen({ navigation }) {
  const { medications, toggleMedication, addMedication } = useReadings();
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [period, setPeriod] = useState('Manhã');

  const save = () => {
    if (!name.trim()) return;
    addMedication({ name: name.trim(), dose: dose.trim() || '—', period });
    setName(''); setDose(''); setPeriod('Manhã'); setFormOpen(false);
  };

  return (
    <View style={styles.screen}>
      <LinearGradient colors={gradients.background} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ScreenHeader navigation={navigation} subtitle="Lembretes de Medicação" />

        <GlassCard style={styles.card}>
          <Text style={styles.h2}>Próximas Medicações</Text>

          {medications.map((m) => (
            <TouchableOpacity key={m.id} style={styles.row} onPress={() => toggleMedication(m.id)} activeOpacity={0.8}>
              <MaterialCommunityIcons
                name={m.done ? 'check-circle' : ICONS[m.icon] || 'pill'}
                size={20}
                color={m.done ? colors.accentBlue : colors.textSecondary}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.medName, m.done && styles.done]}>{m.name}</Text>
                <Text style={styles.medInfo}>{m.dose} - {m.period}</Text>
              </View>
              <Text style={styles.time}>{m.time}</Text>
            </TouchableOpacity>
          ))}

          {formOpen && (
            <View style={styles.form}>
              <TextInput style={styles.input} placeholder="Nome do medicamento" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />
              <TextInput style={styles.input} placeholder="Dose (ex.: 10mg)" placeholderTextColor={colors.textMuted} value={dose} onChangeText={setDose} />
              <View style={styles.periods}>
                {PERIODS.map((p) => (
                  <TouchableOpacity key={p} onPress={() => setPeriod(p)} style={[styles.chip, period === p && styles.chipOn]}>
                    <Text style={[styles.chipLabel, period === p && { color: colors.white }]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity onPress={save}>
                <LinearGradient colors={gradients.button} style={styles.saveBtn}>
                  <Text style={styles.saveLabel}>Salvar lembrete</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.fabRow}>
            <TouchableOpacity style={styles.fab} onPress={() => setFormOpen((o) => !o)} accessibilityLabel="Adicionar medicação">
              <Ionicons name={formOpen ? 'close' : 'add'} size={22} color={colors.gold} />
            </TouchableOpacity>
          </View>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { padding: spacing.lg, paddingTop: spacing.xxl, paddingBottom: 110, gap: spacing.lg },
  card: { gap: spacing.sm },
  h2: { ...typography.h1, fontSize: 16, marginBottom: spacing.xs },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.pill,
    borderWidth: 1, borderColor: colors.pillBorder, borderRadius: radii.md,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
  },
  medName: { color: colors.textPrimary, fontWeight: '700', fontSize: 14 },
  done: { textDecorationLine: 'line-through', color: colors.textSecondary },
  medInfo: { color: colors.textSecondary, fontSize: 12 },
  time: { color: colors.textSecondary, fontSize: 12 },
  form: { gap: spacing.sm, marginTop: spacing.sm },
  input: {
    backgroundColor: colors.pill, borderWidth: 1, borderColor: colors.pillBorder, borderRadius: radii.md,
    color: colors.textPrimary, paddingHorizontal: spacing.md, paddingVertical: spacing.md, fontSize: 13,
  },
  periods: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.pillBorder },
  chipOn: { backgroundColor: colors.accentBlueDark },
  chipLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  saveBtn: { borderRadius: radii.pill, paddingVertical: spacing.md, alignItems: 'center' },
  saveLabel: { color: colors.white, fontWeight: '700', fontSize: 14 },
  fabRow: { alignItems: 'flex-end', marginTop: spacing.sm },
  fab: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(231,200,120,0.18)',
    borderWidth: 1, borderColor: 'rgba(231,200,120,0.6)', alignItems: 'center', justifyContent: 'center',
  },
});
