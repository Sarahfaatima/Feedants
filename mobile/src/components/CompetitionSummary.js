import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from './Card';
import { colors, typography, spacing, radius } from '../theme/theme';
import { useLanguage } from '../context/LanguageContext';

export default function CompetitionSummary({ competition, isRegistered, remainingSpots, isFull }) {
  const { t } = useLanguage();
  const { title, tags = [], winnersGetCertificate, prizePool, entryFee, capacity, bookedCount } = competition;

  const progress = capacity > 0 ? Math.min(bookedCount / capacity, 1) : 0;

  return (
    <Card>
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {isRegistered ? (
          <View style={styles.registeredBadge}>
            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            <Text style={styles.registeredText}>{t('registered')}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.tagsRow}>
        {tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        {winnersGetCertificate ? (
          <View style={styles.certificateRow}>
            <Ionicons name="ribbon-outline" size={14} color={colors.primary} />
            <Text style={styles.certificateText}>{t('winnersGetCertificate')}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>{t('prizePool')}</Text>
          <Text style={styles.statValue}>₹ {prizePool.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>{t('entryFee')}</Text>
          <Text style={styles.statValue}>₹ {entryFee.toLocaleString('en-IN')}</Text>
        </View>
        <View style={[styles.statBlock, { flex: 1.3 }]}>
          <View style={styles.spotsRow}>
            <Ionicons name="people-outline" size={14} color={isFull ? colors.danger : colors.primary} />
            <Text style={[styles.spotsText, isFull && { color: colors.danger }]}>
              {isFull ? t('full') : t('onlySpotsLeft', { n: remainingSpots })}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.bookedText}>
            {bookedCount} / {capacity} {t('booked')}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.title,
    flex: 1,
    marginRight: spacing.sm,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    gap: 4,
  },
  registeredText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '700',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tag: {
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  certificateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  certificateText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  statBlock: {
    flex: 1,
  },
  statLabel: {
    ...typography.label,
    marginBottom: 2,
  },
  statValue: {
    ...typography.heading,
    color: colors.primaryDark,
    fontSize: 18,
  },
  spotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  spotsText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  bookedText: {
    ...typography.caption,
  },
});
