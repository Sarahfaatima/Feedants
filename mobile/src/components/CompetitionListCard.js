import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow } from '../theme/theme';
import { useLanguage } from '../context/LanguageContext';

export default function CompetitionListCard({ competition, onPress }) {
  const { t } = useLanguage();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: competition.featuredImage }} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {competition.title}
        </Text>
        <View style={styles.tagsRow}>
          {(competition.tags || []).slice(0, 2).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.prize}>₹ {competition.prizePool.toLocaleString('en-IN')}</Text>
          <View style={styles.spotsRow}>
            <Ionicons name="people-outline" size={12} color={colors.textMuted} />
            <Text style={styles.spotsText}>{competition.remainingSpots} {t('spotsLeft')}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: colors.border,
  },
  body: {
    padding: spacing.md,
  },
  title: {
    ...typography.subheading,
    marginBottom: spacing.xs,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  tag: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  tagText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prize: {
    ...typography.subheading,
    color: colors.primaryDark,
  },
  spotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  spotsText: {
    ...typography.caption,
  },
});
