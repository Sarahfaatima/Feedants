import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme/theme';
import { useLanguage } from '../context/LanguageContext';

export default function Testimonials({ testimonials }) {
  const { t } = useLanguage();

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.85}>
      <View style={styles.left}>
        <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.primaryDark} />
        <View style={styles.textWrap}>
          <Text style={styles.title}>{t('hearFromUsers')}</Text>
          <Text style={styles.subtitle}>{t('seeWhatParticipantsSay')}</Text>
        </View>
      </View>

      {testimonials.length > 0 ? (
        <View style={styles.avatarStack}>
          {testimonials.slice(0, 3).map((item, idx) => (
            <Image
              key={item._id}
              source={{ uri: item.avatarUrl }}
              style={[styles.avatar, { marginLeft: idx === 0 ? 0 : -10 }]}
            />
          ))}
        </View>
      ) : null}

      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    ...typography.subheading,
    fontSize: 13,
  },
  subtitle: {
    ...typography.caption,
  },
  avatarStack: {
    flexDirection: 'row',
    marginRight: spacing.sm,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.surface,
  },
});
