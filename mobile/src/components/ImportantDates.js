import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from './Card';
import { colors, typography, spacing, radius } from '../theme/theme';
import { useLanguage } from '../context/LanguageContext';
import { formatDateShort, formatTimeShort } from '../utils/formatDate';

function DateItem({ icon, label, iso }) {
  return (
    <View style={styles.item}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <View>
        <Text style={styles.itemLabel}>{label}</Text>
        <Text style={styles.itemDate}>{formatDateShort(iso)}</Text>
        <Text style={styles.itemTime}>{formatTimeShort(iso)}</Text>
      </View>
    </View>
  );
}

export default function ImportantDates({ competition }) {
  const { t } = useLanguage();

  return (
    <Card>
      <Text style={styles.title}>{t('importantDates')}</Text>
      <View style={styles.grid}>
        <DateItem icon="calendar-outline" label={t('registerBefore')} iso={competition.registrationClose} />
        <DateItem icon="paper-plane-outline" label={t('submissionStarts')} iso={competition.submissionStart} />
        <DateItem icon="cloud-upload-outline" label={t('submissionEnds')} iso={competition.submissionEnd} />
        <DateItem icon="trophy-outline" label={t('resultDate')} iso={competition.resultDate} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.heading,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    paddingRight: spacing.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  itemLabel: {
    ...typography.caption,
  },
  itemDate: {
    ...typography.subheading,
    fontSize: 13,
    marginTop: 2,
  },
  itemTime: {
    ...typography.caption,
  },
});
