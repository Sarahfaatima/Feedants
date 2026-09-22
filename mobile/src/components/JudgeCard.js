import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from './Card';
import { colors, typography, spacing, radius } from '../theme/theme';
import { useLanguage } from '../context/LanguageContext';

export default function JudgeCard({ judge, introVideoUrl }) {
  const { t } = useLanguage();

  const handlePlay = () => {
    if (introVideoUrl) Linking.openURL(introVideoUrl);
  };

  return (
    <Card style={styles.card}>
      {judge.imageUrl ? (
        <Image source={{ uri: judge.imageUrl }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Ionicons name="person" size={28} color={colors.primary} />
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.label}>{t('judge')}</Text>
        <Text style={styles.name}>{judge.name}</Text>
        <Text style={styles.profession}>{judge.profession}</Text>
        <Text style={styles.experience}>{judge.experience}</Text>
      </View>

      <TouchableOpacity style={styles.playColumn} onPress={handlePlay} accessibilityRole="button">
        <View style={styles.playButton}>
          <Ionicons name="play" size={18} color={colors.white} />
        </View>
        <Text style={styles.playLabel}>{t('introVideo')}</Text>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: spacing.md,
  },
  avatarFallback: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  label: {
    ...typography.caption,
  },
  name: {
    ...typography.heading,
    marginTop: 1,
  },
  profession: {
    ...typography.bodyMuted,
    marginTop: 1,
  },
  experience: {
    ...typography.caption,
    marginTop: 1,
  },
  playColumn: {
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playLabel: {
    ...typography.caption,
    marginTop: 4,
    textAlign: 'center',
    width: 60,
  },
});
