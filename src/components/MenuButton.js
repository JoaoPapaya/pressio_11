import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/theme';

export default function MenuButton({ icon, title, subtitle, onPress, center }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.8} accessibilityRole="button">
      <View style={styles.icon}>{icon}</View>
      <View style={[styles.texts, center && { alignItems: 'center', paddingRight: 36 }]}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  icon: { width: 36, alignItems: 'center' },
  texts: { flex: 1 },
  title: { ...typography.h1, fontSize: 17 },
  subtitle: { ...typography.small, marginTop: 2 },
});
