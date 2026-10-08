import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../theme/theme';

export default function AuthInput({ icon, label, secure, error, style, ...props }) {
  const [hidden, setHidden] = useState(!!secure);
  return (
    <View style={style}>
      <View style={styles.labelRow}>
        <Feather name={icon} size={16} color={colors.textPrimary} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={[styles.field, error && styles.fieldError]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={hidden}
          autoCapitalize="none"
          {...props}
        />
        {secure ? (
          <TouchableOpacity onPress={() => setHidden((h) => !h)} accessibilityLabel="Mostrar ou ocultar senha">
            <Feather name={hidden ? 'eye-off' : 'eye'} size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  label: { ...typography.h2, fontSize: 13 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.pill,
    borderWidth: 1,
    borderColor: colors.pillBorder,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
  },
  fieldError: { borderColor: colors.danger },
  input: { flex: 1, color: colors.textPrimary, paddingVertical: spacing.md, fontSize: 14 },
  error: { color: colors.danger, fontSize: 11, marginTop: 4 },
});
