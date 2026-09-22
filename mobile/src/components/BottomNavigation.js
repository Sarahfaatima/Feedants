import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../theme/theme';
import { useLanguage } from '../context/LanguageContext';

const ITEMS = [
  { key: 'Home', icon: 'home-outline', iconActive: 'home', labelKey: 'home' },
  { key: 'Explore', icon: 'search-outline', iconActive: 'search', labelKey: 'explore' },
  { key: 'Add', icon: 'add', iconActive: 'add', labelKey: 'add', raised: true },
  { key: 'Competitions', icon: 'trophy-outline', iconActive: 'trophy', labelKey: 'competitions' },
  { key: 'Profile', icon: 'person-outline', iconActive: 'person', labelKey: 'profile' },
];

// Used both as the actual bottom tab bar (via Tab.Navigator's `tabBar` prop)
// and rendered standalone at the bottom of the Competition Details screen
// (which lives outside the tab navigator), so its API is decoupled from
// React Navigation's tab bar prop shape.
export default function BottomNavigation({ activeKey, onPress }) {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {ITEMS.map((item) => {
        const isActive = item.key === activeKey;

        if (item.raised) {
          return (
            <TouchableOpacity key={item.key} style={styles.raisedWrap} onPress={() => onPress(item.key)}>
              <View style={styles.raisedButton}>
                <Ionicons name={item.icon} size={26} color={colors.white} />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity key={item.key} style={styles.item} onPress={() => onPress(item.key)}>
            <Ionicons
              name={isActive ? item.iconActive : item.icon}
              size={22}
              color={isActive ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>{t(item.labelKey)}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    ...Platform.select({ ios: { paddingBottom: spacing.xs } }),
  },
  item: {
    alignItems: 'center',
    gap: 2,
    minWidth: 56,
  },
  label: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  raisedWrap: {
    alignItems: 'center',
    marginTop: -22,
  },
  raisedButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.background,
  },
});
