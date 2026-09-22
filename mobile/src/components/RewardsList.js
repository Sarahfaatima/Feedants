import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from './Card';
import { colors, typography, spacing } from '../theme/theme';
import { useLanguage } from '../context/LanguageContext';

const ICON_COLORS = {
  1: colors.gold,
  2: colors.silver,
  3: colors.bronze,
};

export default function RewardsList({ rewards }) {
  const { t } = useLanguage();

  return (
    <Card>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{t('rewards')}</Text>
        <Text style={styles.subtitle}>{t('allPositions')}</Text>
      </View>

      {rewards.map((reward) => (
        <View key={reward.position} style={styles.row}>
          <View style={styles.left}>
            <Ionicons
              name={reward.icon === 'star' ? 'star-outline' : reward.icon}
              size={18}
              color={ICON_COLORS[reward.position] || colors.primary}
            />
            <Text style={styles.label}>{reward.label}</Text>
          </View>
          <Text style={styles.amount}>₹ {reward.amount.toLocaleString('en-IN')}</Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.heading,
  },
  subtitle: {
    ...typography.caption,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    ...typography.body,
  },
  amount: {
    ...typography.subheading,
    color: colors.primaryDark,
  },
});
