import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import LineChart from '../components/LineChart';
import { colors, gradients, radii, spacing, typography } from '../theme/theme';
import { useReadings } from '../data/ReadingsContext';

export default function RelatoriosScreen({ navigation }) {
  const { readings, trend } = useReadings();
  const historyDesc = [...readings].reverse();

  const exportReport = () => navigation?.navigate?.('Exportacao');

  return (
    <View style={styles.screen}>
      <LinearGradient colors={gradients.background} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack?.()} style={styles.backRow}>
            <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
            <Text style={styles.backLabel}>Voltar</Text>
          </TouchableOpacity>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.brand}>Pressio</Text>
              <Text style={styles.subtitle}>Análise de Tendências</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation?.navigate?.('NovaLeitura')}>
              <Ionicons name="add" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <GlassCard style={styles.chartCard}>
          <LineChart
            series={[
              { data: trend.systolic, color: colors.accentBlue },
              { data: trend.diastolic, color: colors.accentPink },
              { data: trend.glucose, color: colors.accentCyan },
            ]}
            width={300}
            height={100}
          />
          <View style={styles.legendRow}>
            <Legend color={colors.accentBlue} label="PAS" />
            <Legend color={colors.accentPink} label="PAD" />
            <Legend color={colors.accentCyan} label="Glicose" />
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.h2}>Pressão Arterial</Text>
          {historyDesc.map((r) => (
            <View key={r.id} style={styles.historyRow}>
              <Text style={styles.historyValue}>
                {r.systolic}/{r.diastolic} mmHg
              </Text>
              <View style={styles.historyRight}>
                <Text style={styles.historyDate}>
                  {r.date} {r.time}
                </Text>
                {r.id === readings[readings.length - 1].id && (
                  <Ionicons name="heart" size={14} color={colors.accentPink} />
                )}
              </View>
            </View>
          ))}
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.h2}>Glicemia</Text>
          <View style={styles.historyRow}>
            <Text style={styles.historyValue}>
              {readings[readings.length - 1].glucose} mg/dL - Em Jejum
            </Text>
            <Feather name="droplet" size={14} color={colors.accentCyan} />
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <TouchableOpacity onPress={() => navigation?.navigate?.('Consultas')}>
            <Text style={styles.h2}>Lembretes &amp; Consultas</Text>
          </TouchableOpacity>
          <View style={styles.row}>
            <TouchableOpacity style={styles.miniAction} onPress={() => navigation?.navigate?.('Lembretes')}>
              <Ionicons name="notifications-outline" size={16} color={colors.textPrimary} />
              <Text style={styles.miniActionLabel}>Lembrete de{'\n'}Medicação</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.miniAction} onPress={exportReport}>
              <MaterialIcons name="ios-share" size={16} color={colors.textPrimary} />
              <Text style={styles.miniActionLabel}>Exportar{'\n'}Relatório</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

function Legend({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: {
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  header: { marginBottom: spacing.xs },
  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  backLabel: { ...typography.label, marginLeft: 2 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brand: typography.brand,
  subtitle: { ...typography.label, marginTop: 2 },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.pillBorder,
  },
  chartCard: { alignItems: 'center', gap: spacing.sm },
  legendRow: { flexDirection: 'row', gap: spacing.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { ...typography.small },
  card: { gap: spacing.sm },
  h2: typography.h2,
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.pill,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  historyValue: { color: colors.textPrimary, fontWeight: '600', fontSize: 13 },
  historyRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  historyDate: { color: colors.textSecondary, fontSize: 12 },
  row: { flexDirection: 'row', gap: spacing.md },
  miniAction: {
    flex: 1,
    backgroundColor: colors.pill,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.pillBorder,
    padding: spacing.md,
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  miniActionLabel: { color: colors.textPrimary, fontSize: 12, fontWeight: '600' },
});
