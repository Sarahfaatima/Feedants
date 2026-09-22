import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme/theme';

// Generic small info row/card used across the "trust" section of the screen
// (disclaimer, prize-payment info, refund policy, secure payments).
export default function InfoCard({ icon, iconColor, title, subtitle, onPress, variant = 'row' }) {
  const Wrapper = onPress ? TouchableOpacity : View;

  if (variant === 'banner') {
    return (
      <View style={styles.banner}>
        <Ionicons name={icon} size={16} color={colors.primaryDark} />
        <Text style={styles.bannerText}>
          <Text style={styles.bannerTitle}>{title} </Text>
          {subtitle}
        </Text>
      </View>
    );
  }

  return (
    <Wrapper style={styles.row} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.iconWrap, variant === 'button' && styles.iconWrapButton]}>
        <Ionicons
          name={icon}
          size={variant === 'button' ? 18 : 15}
          color={variant === 'button' ? colors.white : iconColor || colors.primary}
        />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  iconWrapButton: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    marginRight: spacing.md,
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
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.primarySurface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  bannerText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  bannerTitle: {
    fontWeight: '700',
    color: colors.primaryDark,
  },
});
