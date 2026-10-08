import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/theme';

// Cabeçalho padrão: "Voltar" + marca + subtítulo (opcional)
export default function ScreenHeader({ navigation, subtitle, back = true, right }) {
  return (
    <View style={styles.header}>
      {back ? (
        <TouchableOpacity onPress={() => navigation?.goBack?.()} style={styles.backRow}>
          <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
          <Text style={styles.backLabel}>Voltar</Text>
        </TouchableOpacity>
      ) : null}
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.brand}>Pressio</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.xs },
  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  backLabel: { ...typography.label, marginLeft: 2 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  brand: typography.brand,
  subtitle: { ...typography.label, marginTop: 2 },
});
