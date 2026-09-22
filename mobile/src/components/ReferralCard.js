import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { colors, typography, spacing, radius } from '../theme/theme';
import { useLanguage } from '../context/LanguageContext';

export default function ReferralCard({ referralUrl, rewardText }) {
  const { t, localize } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="megaphone-outline" size={16} color={colors.primaryDark} />
        <Text style={styles.headerText}>{t('referEarn')}</Text>
      </View>

      <View style={styles.linkRow}>
        <View style={styles.linkBox}>
          <Text style={styles.linkText} numberOfLines={1}>
            {referralUrl}
          </Text>
        </View>
        <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
          <Text style={styles.copyButtonText}>{copied ? t('linkCopied') : t('copyLink')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.referButton}>
          <Text style={styles.referButtonText}>{t('referNow')}</Text>
        </TouchableOpacity>
        <Text style={styles.rewardText}>{localize(rewardText)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  headerText: {
    ...typography.subheading,
    color: colors.primaryDark,
  },
  linkRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  linkBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  linkText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  copyButton: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  copyButtonText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    rowGap: spacing.sm,
  },
  referButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  referButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
  rewardText: {
    ...typography.caption,
    color: colors.primaryDark,
  },
});
