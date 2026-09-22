import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme/theme';
import { useLanguage } from '../context/LanguageContext';
import { useCountdown } from '../utils/useCountdown';

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function CountdownCard({ registrationClose, lifecycleStatus }) {
  const { t } = useLanguage();
  const countdown = useCountdown(registrationClose);
  const isOpen = lifecycleStatus === 'registration_open' && !countdown.expired;

  if (!isOpen) {
    return (
      <View style={styles.closedContainer}>
        <Ionicons name="hourglass-outline" size={18} color={colors.textSecondary} />
        <Text style={styles.closedText}>{t('registrationClosed')}</Text>
      </View>
    );
  }

  const isUrgent = countdown.days === 0 && countdown.hours < 12;

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Ionicons name="hourglass-outline" size={18} color={colors.primaryDark} />
        <Text style={styles.label}>{t('registrationClosesIn')}</Text>
      </View>

      <Text style={styles.countdown}>
        {pad(countdown.days)}
        {t('days')} : {pad(countdown.hours)}
        {t('hours')} : {pad(countdown.minutes)}
        {t('minutes')} : {pad(countdown.seconds)}
        {t('seconds')}
      </Text>

      {isUrgent ? (
        <View style={styles.hurryBadge}>
          <Ionicons name="timer-outline" size={14} color={colors.danger} />
          <Text style={styles.hurryText}>{t('hurryUp')}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primarySurface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexWrap: 'wrap',
    rowGap: spacing.xs,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  countdown: {
    ...typography.subheading,
    color: colors.primaryDark,
    fontVariant: ['tabular-nums'],
  },
  hurryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hurryText: {
    ...typography.caption,
    color: colors.danger,
    fontWeight: '700',
  },
  closedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  closedText: {
    ...typography.bodyMuted,
  },
});
