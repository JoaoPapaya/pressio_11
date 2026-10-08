import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/theme';

// Réplica do "slider" do protótipo: um valor menor acima, o valor grande
// editável ao centro, e um valor menor abaixo, sugerindo um seletor vertical.
export default function ValuePill({ value, onChangeValue, unit, above, below }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.ghost}>{above}</Text>
      <View style={styles.pill}>
        <TextInput
          style={styles.value}
          value={String(value)}
          onChangeText={onChangeValue}
          keyboardType="number-pad"
          maxLength={3}
          selectTextOnFocus
        />
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
      <Text style={styles.ghost}>{below}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  ghost: {
    ...typography.small,
    color: colors.textMuted,
    fontSize: 13,
    marginVertical: 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: colors.pill,
    borderWidth: 1,
    borderColor: colors.pillBorder,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    minWidth: 140,
    justifyContent: 'center',
  },
  value: {
    ...typography.value,
    textAlign: 'center',
    padding: 0,
  },
  unit: {
    ...typography.label,
    marginLeft: spacing.xs,
  },
});
