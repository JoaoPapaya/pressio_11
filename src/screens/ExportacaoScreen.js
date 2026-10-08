import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { colors, gradients, radii, spacing, typography } from '../theme/theme';
import { useReadings } from '../data/ReadingsContext';

export default function ExportacaoScreen({ navigation }) {
  const { exportItems, removeExportItem } = useReadings();
  const pressao = exportItems.filter((i) => i.kind === 'pressao');
  const glicemia = exportItems.filter((i) => i.kind === 'glicemia');

  const download = (item) =>
    Alert.alert('Relatório', `O registro ${item.label} (${item.date}) será exportado em PDF.`);

  const downloadAll = () =>
    Alert.alert('Relatório', `${exportItems.length} registro(s) serão exportados em um único PDF.`);

  return (
    <View style={styles.screen}>
      <LinearGradient colors={gradients.background} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ScreenHeader navigation={navigation} subtitle="Exportação de Relatórios" />

        <Text style={styles.h2}>Exportar Relatório</Text>

        <Section
          title="Pressão Arterial"
          icon={<Ionicons name="heart-outline" size={18} color={colors.textPrimary} />}
          items={pressao}
          tint="blue"
          onDownload={download}
          onRemove={removeExportItem}
        />
        <Section
          title="Glicemia"
          icon={<Feather name="droplet" size={16} color={colors.gold} />}
          items={glicemia}
          tint="gold"
          onDownload={download}
          onRemove={removeExportItem}
        />

        {exportItems.length === 0 && (
          <Text style={styles.empty}>Nenhum registro selecionado. Salve uma nova leitura para exportá-la aqui.</Text>
        )}

        {exportItems.length > 0 && (
          <TouchableOpacity activeOpacity={0.85} onPress={downloadAll}>
            <LinearGradient colors={gradients.button} style={styles.cta}>
              <Text style={styles.ctaLabel}>Exportar tudo em PDF</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

function Section({ title, icon, items, tint, onDownload, onRemove }) {
  if (items.length === 0) return null;
  const gold = tint === 'gold';
  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor: gold ? 'rgba(231,200,120,0.12)' : 'rgba(110,140,255,0.14)',
          borderColor: gold ? 'rgba(231,200,120,0.55)' : 'rgba(160,185,255,0.5)',
        },
      ]}
    >
      <View style={styles.sectionHead}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {items.map((i) => (
        <View key={i.id} style={styles.item}>
          <View>
            <Text style={styles.itemValue}>{i.label}</Text>
            <Text style={styles.itemDate}>{i.date}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => onDownload(i)} accessibilityLabel="Baixar registro" hitSlop={8}>
              <Feather name="download" size={18} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onRemove(i.id)} accessibilityLabel="Remover registro" hitSlop={8}>
              <Feather name="x" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { padding: spacing.lg, paddingTop: spacing.xxl, paddingBottom: 110, gap: spacing.md },
  h2: { ...typography.h1, fontSize: 17, color: colors.gold, marginTop: spacing.sm },
  section: { borderWidth: 1.5, borderRadius: radii.lg, padding: spacing.lg, gap: spacing.sm },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  sectionTitle: typography.h2,
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.xs },
  itemValue: { color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
  itemDate: { color: colors.textSecondary, fontSize: 12 },
  actions: { flexDirection: 'row', gap: spacing.md },
  empty: { ...typography.label, marginTop: spacing.md },
  cta: { borderRadius: radii.pill, paddingVertical: spacing.lg, alignItems: 'center', marginTop: spacing.sm },
  ctaLabel: { color: colors.white, fontWeight: '700', fontSize: 15 },
});
