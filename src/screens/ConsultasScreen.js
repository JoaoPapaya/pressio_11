import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { colors, gradients, radii, spacing, typography } from '../theme/theme';
import { useReadings } from '../data/ReadingsContext';
import {
  formatAppointment, parseDateTime, sameDay, startOfDay, weekOf, weekdayShort,
} from '../utils/dates';

const GOLD_BG = 'rgba(231,200,120,0.14)';
const GOLD_BORDER = 'rgba(231,200,120,0.55)';
const BLUE_BG = 'rgba(110,140,255,0.16)';
const BLUE_BORDER = 'rgba(160,185,255,0.55)';

export default function ConsultasScreen({ navigation }) {
  const { appointments, addAppointment } = useReadings();
  const today = startOfDay(new Date());
  const week = useMemo(() => weekOf(today), []);
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [tipo, setTipo] = useState('');
  const [local, setLocal] = useState('');
  const [quando, setQuando] = useState('');

  const upcoming = appointments.filter((a) => a.date >= today);
  const history = appointments.filter((a) => a.date < today).reverse();
  const visible = selected ? upcoming.filter((a) => sameDay(a.date, selected)) : upcoming;

  const save = () => {
    const date = parseDateTime(quando);
    if (!tipo.trim() || !local.trim() || !date) {
      Alert.alert('Dados incompletos', 'Preencha o tipo, o local e a data no formato dd/mm hh:mm (ex.: 20/10 14:30).');
      return;
    }
    addAppointment({ title: `Consulta de ${tipo.trim()}`, place: local.trim(), date });
    setTipo(''); setLocal(''); setQuando(''); setFormOpen(false);
  };

  return (
    <View style={styles.screen}>
      <LinearGradient colors={gradients.background} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ScreenHeader navigation={navigation} subtitle="Minhas Consultas" />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekRow}>
          {week.map((d) => {
            const isToday = sameDay(d, today);
            const isSel = selected && sameDay(d, selected);
            const hasAppt = upcoming.some((a) => sameDay(a.date, d));
            return (
              <TouchableOpacity
                key={d.toISOString()}
                onPress={() => setSelected(isSel ? null : d)}
                style={[styles.day, (isSel || (!selected && isToday)) && styles.dayActive]}
              >
                <Text style={styles.dayName}>{weekdayShort(d)}</Text>
                <Text style={styles.dayNum}>{d.getDate()}</Text>
                {isToday ? <Text style={styles.hoje}>HOJE</Text> : <View style={[styles.dot, hasAppt && styles.dotOn]} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.h2}>{selected ? 'Consultas do dia' : 'Próximas Consultas'}</Text>

        {visible.length === 0 ? (
          <Text style={styles.empty}>Nenhuma consulta {selected ? 'neste dia' : 'agendada'}. Toque em + para adicionar.</Text>
        ) : (
          visible.map((a) => <AppointmentCard key={a.id} a={a} />)
        )}

        {history.length > 0 && (
          <>
            <Text style={styles.historyTitle}>Histórico</Text>
            {history.map((a) => <AppointmentCard key={a.id} a={a} faded />)}
          </>
        )}

        {formOpen && (
          <View style={styles.form}>
            <Text style={styles.h2}>Nova consulta</Text>
            <TextInput style={styles.input} placeholder="Tipo de consulta (ex.: Diabetes)" placeholderTextColor={colors.textMuted} value={tipo} onChangeText={setTipo} />
            <TextInput style={styles.input} placeholder="Local (ex.: Hospital XY)" placeholderTextColor={colors.textMuted} value={local} onChangeText={setLocal} />
            <TextInput style={styles.input} placeholder="Data e hora (dd/mm hh:mm)" placeholderTextColor={colors.textMuted} value={quando} onChangeText={setQuando} />
            <View style={styles.formActions}>
              <TouchableOpacity style={styles.ghostBtn} onPress={() => setFormOpen(false)}>
                <Text style={styles.ghostLabel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1 }} onPress={save}>
                <LinearGradient colors={gradients.button} style={styles.saveBtn}>
                  <Text style={styles.saveLabel}>Salvar consulta</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={{ height: 90 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setFormOpen((o) => !o)} accessibilityLabel="Adicionar consulta">
        <Ionicons name={formOpen ? 'close' : 'add'} size={26} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

function AppointmentCard({ a, faded }) {
  const diabetes = a.type === 'diabetes';
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: diabetes ? GOLD_BG : BLUE_BG, borderColor: diabetes ? GOLD_BORDER : BLUE_BORDER },
        faded && { opacity: 0.55 },
      ]}
    >
      <View style={styles.cardTop}>
        <Text style={styles.cardTitle}>{a.title}</Text>
        {diabetes ? (
          <Feather name="droplet" size={16} color={colors.gold} />
        ) : (
          <Ionicons name="heart-outline" size={18} color={colors.textPrimary} />
        )}
      </View>
      <Text style={styles.cardDate}>{formatAppointment(a.date)}</Text>
      <Text style={styles.cardPlace}>{a.place}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { padding: spacing.lg, paddingTop: spacing.xxl, gap: spacing.md },
  weekRow: { gap: spacing.sm, paddingVertical: spacing.sm },
  day: {
    width: 44,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.pill,
    borderWidth: 1,
    borderColor: colors.pillBorder,
    alignItems: 'center',
    gap: 2,
  },
  dayActive: { backgroundColor: 'rgba(245,246,250,0.9)' },
  dayName: { color: colors.textSecondary, fontSize: 10, fontWeight: '600' },
  dayNum: { color: colors.textPrimary, fontSize: 16, fontWeight: '800' },
  hoje: { color: colors.accentBlueDark, fontSize: 8, fontWeight: '800' },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'transparent', marginTop: 2 },
  dotOn: { backgroundColor: colors.gold },
  h2: { ...typography.h1, fontSize: 17, marginTop: spacing.sm },
  empty: { ...typography.label, marginVertical: spacing.sm },
  historyTitle: { ...typography.label, marginTop: spacing.lg },
  card: { borderWidth: 1.5, borderRadius: radii.lg, padding: spacing.lg, gap: 4 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  cardTitle: { ...typography.h2, flex: 1 },
  cardDate: { color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
  cardPlace: { color: colors.textSecondary, fontSize: 12 },
  form: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder,
    borderRadius: radii.lg, padding: spacing.lg, gap: spacing.sm, marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.pill, borderWidth: 1, borderColor: colors.pillBorder, borderRadius: radii.md,
    color: colors.textPrimary, paddingHorizontal: spacing.md, paddingVertical: spacing.md, fontSize: 13,
  },
  formActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  ghostBtn: {
    paddingHorizontal: spacing.lg, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.pillBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  ghostLabel: { color: colors.textSecondary, fontWeight: '600', fontSize: 13 },
  saveBtn: { borderRadius: radii.pill, paddingVertical: spacing.md, alignItems: 'center' },
  saveLabel: { color: colors.white, fontWeight: '700', fontSize: 14 },
  fab: {
    position: 'absolute', right: spacing.xl, bottom: 96, width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.accentBlueDark, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.cardBorder,
  },
});
