import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import BarChart from '../components/BarChart';
import { colors, gradients, radii, spacing, typography } from '../theme/theme';
import { useReadings } from '../data/ReadingsContext';

function PressureGauge({ systolic, diastolic }) {
  const size = 110;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = Math.PI * radius; // semicircle
  // normaliza sistólica entre 90-180 para o arco
  const pct = Math.min(Math.max((systolic - 90) / (180 - 90), 0), 1);

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size / 2 + stroke}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.pill}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          rotation="180"
          origin={`${size / 2}, ${size / 2}`}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.accentPink}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference - circumference * pct}
          strokeLinecap="round"
          rotation="180"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.gaugeLabel}>
        <Text style={styles.gaugeValue}>{systolic}/{diastolic}</Text>
        <Text style={styles.gaugeUnit}>mmHg</Text>
      </View>
    </View>
  );
}

export default function DashboardScreen({ navigation }) {
  const { userName, latest, medications, readings, toggleMedication } = useReadings();
  const lastReading = readings[readings.length - 2] || latest;

  const glucoseWeek = [88, 92, 90, 95, 89, 97, latest.glucose];

  return (
    <View style={styles.screen}>
      <LinearGradient colors={gradients.background} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.brand}>Pressio</Text>
          <Text style={styles.welcome}>Bem-vindo, {userName}</Text>
          <Text style={styles.subtitle}>Acompanhamento Diário</Text>
        </View>

        <View style={styles.row}>
          <GlassCard style={[styles.halfCard]}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.h2}>Pressão Arterial</Text>
              <Ionicons name="heart" size={14} color={colors.accentPink} />
            </View>
            <PressureGauge systolic={latest.systolic} diastolic={latest.diastolic} />
            <Text style={styles.lastReading}>
              Última leitura:{'\n'}
              {latest.date}, {latest.time}
            </Text>
          </GlassCard>

          <GlassCard style={[styles.halfCard]}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.h2}>Glicemia</Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <Feather name="droplet" size={14} color={colors.accentCyan} />
                <MaterialCommunityIcons name="paperclip" size={14} color={colors.textSecondary} />
              </View>
            </View>
            <Text style={styles.bigValue}>{latest.glucose}</Text>
            <Text style={styles.unitLabel}>mg/dL</Text>
            <BarChart data={glucoseWeek} width={110} height={54} />
            <Text style={styles.lastReading}>
              Última leitura:{'\n'}
              {latest.date}, {latest.time} - Em jejum
            </Text>
          </GlassCard>
        </View>

        <GlassCard style={styles.card}>
          <TouchableOpacity onPress={() => navigation?.navigate?.('Lembretes')} style={styles.cardHeaderRow}>
            <Text style={styles.h2}>Lembretes de Medicação</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
          {medications.slice(0, 3).map((m) => (
            <TouchableOpacity key={m.id} style={styles.medRow} onPress={() => toggleMedication(m.id)} activeOpacity={0.8}>
              <View style={styles.medLeft}>
                <Ionicons
                  name={m.done ? 'checkbox' : 'square-outline'}
                  size={18}
                  color={m.done ? colors.accentBlue : colors.textSecondary}
                />
                <Text style={styles.medName}>{m.name}</Text>
              </View>
              <Text style={styles.medTime}>{m.time}</Text>
            </TouchableOpacity>
          ))}
        </GlassCard>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionPill}
            onPress={() => navigation?.navigate?.('NovaLeitura')}
          >
            <Text style={styles.actionLabel}>Adicionar Leitura</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionPill} onPress={() => navigation?.navigate?.('Consultas')}>
            <Text style={styles.actionLabel}>Consultas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionPill}
            onPress={() => navigation?.navigate?.('Relatorios')}
          >
            <Text style={styles.actionLabel}>Relatórios</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  brand: typography.brand,
  welcome: { ...typography.h1, marginTop: spacing.xs },
  subtitle: { ...typography.label, marginTop: 2 },
  row: { flexDirection: 'row', gap: spacing.md },
  halfCard: { flex: 1, alignItems: 'center', gap: spacing.xs },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  h2: typography.h2,
  gaugeLabel: { position: 'absolute', top: 30, alignItems: 'center' },
  gaugeValue: { color: colors.white, fontWeight: '800', fontSize: 16 },
  gaugeUnit: { color: colors.textMuted, fontSize: 10 },
  bigValue: { ...typography.value, fontSize: 26, alignSelf: 'flex-start' },
  unitLabel: { ...typography.small, alignSelf: 'flex-start', marginBottom: spacing.xs },
  lastReading: { ...typography.small, textAlign: 'center', marginTop: spacing.xs },
  card: { gap: spacing.sm },
  medRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.pill,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  medLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  medName: { color: colors.textPrimary, fontWeight: '600', fontSize: 13 },
  medTime: { color: colors.textSecondary, fontSize: 13 },
  actionsRow: { flexDirection: 'row', gap: spacing.sm },
  actionPill: {
    flex: 1,
    backgroundColor: colors.pill,
    borderWidth: 1,
    borderColor: colors.pillBorder,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  actionLabel: { color: colors.textPrimary, fontSize: 12, fontWeight: '600' },
});
