import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { colors, radii, spacing } from '../theme/theme';

const ICONS = {
  Dashboard: 'home',
  Relatorios: 'bar-chart-2',
  Perfil: 'user',
  Mais: 'more-horizontal',
};

export default function TabBar({ state, navigation }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {state.routes
          .filter((r) => r.name !== 'NovaLeitura')
          .map((route) => {
            const isFocused = state.routes[state.index].name === route.name;
            const iconName = ICONS[route.name] || 'circle';
            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => navigation.navigate(route.name)}
                style={[styles.tabItem, isFocused && styles.tabItemActive]}
              >
                <Feather
                  name={iconName}
                  size={18}
                  color={isFocused ? colors.white : colors.tabInactive}
                />
              </TouchableOpacity>
            );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(10,14,35,0.75)',
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.pillBorder,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  tabItem: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    backgroundColor: colors.accentBlueDark,
  },
});
