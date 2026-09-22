import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, radius } from '../theme/theme';
import { useLanguage } from '../context/LanguageContext';

export default function CompetitionHeader() {
  const navigation = useNavigation();
  const { language, setLanguage, t } = useLanguage();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel={t('goBack')}
      >
        <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        <Text style={styles.backText}>{t('goBack')}</Text>
      </TouchableOpacity>

      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.toggleOption, language === 'en' && styles.toggleOptionActive]}
          onPress={() => setLanguage('en')}
        >
          <Text style={[styles.toggleText, language === 'en' && styles.toggleTextActive]}>ENG</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleOption, language === 'hi' && styles.toggleOptionActive]}
          onPress={() => setLanguage('hi')}
        >
          <Text style={[styles.toggleText, language === 'hi' && styles.toggleTextActive]}>हिंदी</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  backText: {
    ...typography.subheading,
    marginLeft: spacing.xs,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    padding: 3,
  },
  toggleOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  toggleOptionActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  toggleTextActive: {
    color: colors.white,
  },
});
