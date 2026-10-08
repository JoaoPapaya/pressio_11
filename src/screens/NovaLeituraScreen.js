import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import ValuePill from '../components/ValuePill';
import { colors, gradients, radii, spacing, typography } from '../theme/theme';
import { useReadings } from '../data/ReadingsContext';

export default function NovaLeituraScreen({ navigation }) {
  const { addReading } = useReadings();
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [glucose, setGlucose] = useState('95');
  const [favoritePressure, setFavoritePressure] = useState(false);

  const handleSave = () => {
    addReading({ systolic, diastolic, glucose });
    Alert.alert('Leitura salva', 'Sua medição foi registrada com sucesso.');
    navigation?.goBack?.();
  };

  return (
    <View style={styles.screen}>
      <LinearGradient colors={gradients.background} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack?.()} style={styles.backRow}>
            <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
            <Text style={styles.backLabel}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.brand}>Pressio</Text>
          <Text style={styles.subtitle}>Nova Leitura</Text>
        </View>

        <GlassCard style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.h2}>Pressão Arterial (mmHg)</Text>
            <TouchableOpacity onPress={() => setFavoritePressure((v) => !v)}>
              <Ionicons
                name={favoritePressure ? 'heart' : 'heart-outline'}
                size={18}
                color={favoritePressure ? colors.danger : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.fieldLabel}>Sistólica</Text>
              <ValuePill
                value={systolic}
                onChangeValue={setSystolic}
                above={String(Number(systolic) + 10)}
                below={String(Number(systolic) - 10)}
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.fieldLabel}>Diastólica</Text>
              <ValuePill
                value={diastolic}
                onChangeValue={setDiastolic}
                above={String(Number(diastolic) + 10)}
                below={String(Number(diastolic) - 10)}
              />
            </View>
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.h2}>Glicemia (mg/dL)</Text>
            <Feather name="droplet" size={16} color={colors.accentCyan} />
          </View>

          <ValuePill
            value={glucose}
            onChangeValue={setGlucose}
            unit="mg/dL"
            above={String(Number(glucose) + 5)}
            below={String(Number(glucose) - 5)}
          />
        </GlassCard>

        <TouchableOpacity activeOpacity={0.85} onPress={handleSave}>
          <LinearGradient colors={gradients.button} style={styles.saveButton}>
            <Text style={styles.saveLabel}>Salvar Medição</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  header: { marginBottom: spacing.sm },
  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  backLabel: { ...typography.label, marginLeft: 2 },
  brand: typography.brand,
  subtitle: { ...typography.label, marginTop: 2 },
  card: { gap: spacing.md },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  h2: typography.h2,
  fieldLabel: { ...typography.label, textAlign: 'center', marginBottom: spacing.xs },
  row: { flexDirection: 'row', justifyContent: 'space-around' },
  column: { alignItems: 'center', flex: 1 },
  saveButton: {
    borderRadius: radii.pill,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  saveLabel: { color: colors.white, fontWeight: '700', fontSize: 16 },
});
