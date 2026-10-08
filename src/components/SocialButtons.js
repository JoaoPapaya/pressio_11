import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../theme/theme';

const PROVIDERS = [
  { key: 'Google', icon: 'google', color: '#EA4335' },
  { key: 'Apple', icon: 'apple', color: '#FFFFFF' },
  { key: 'Facebook', icon: 'facebook', color: '#4C7BF4' },
];

export default function SocialButtons({ onPress }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Entrar como</Text>
      <View style={styles.row}>
        {PROVIDERS.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={styles.btn}
            onPress={() => onPress?.(p.key)}
            accessibilityLabel={`Entrar com ${p.key}`}
          >
            <FontAwesome name={p.icon} size={22} color={p.color} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: spacing.md },
  label: typography.label,
  row: { flexDirection: 'row', gap: spacing.xl },
  btn: {
    width: 52,
    height: 52,
    borderRadius: radii.pill,
    backgroundColor: colors.pill,
    borderWidth: 1,
    borderColor: colors.pillBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
