import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme/theme';
import { useLanguage } from '../context/LanguageContext';

function WinnerTile({ winner }) {
  const handlePress = () => {
    if (winner.videoUrl) Linking.openURL(winner.videoUrl);
  };

  return (
    <TouchableOpacity style={styles.tile} onPress={handlePress} activeOpacity={0.85}>
      <Image source={{ uri: winner.imageUrl }} style={styles.image} />
      <View style={styles.playBadge}>
        <Ionicons name="play" size={12} color={colors.white} />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {winner.name}
      </Text>
      <Text style={styles.position} numberOfLines={1}>
        {winner.positionLabel}
      </Text>
    </TouchableOpacity>
  );
}

export default function PreviousWinners({ winners }) {
  const { t } = useLanguage();

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{t('previousWinners')}</Text>
      {winners.length === 0 ? (
        <Text style={styles.empty}>{t('noWinnersYet')}</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {winners.map((w) => (
            <WinnerTile key={w._id} winner={w} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.heading,
    marginBottom: spacing.md,
  },
  row: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  tile: {
    width: 84,
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
  playBadge: {
    position: 'absolute',
    bottom: 34,
    alignSelf: 'center',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(14,124,123,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 6,
  },
  position: {
    ...typography.caption,
    color: colors.primary,
  },
  empty: {
    ...typography.bodyMuted,
  },
});
