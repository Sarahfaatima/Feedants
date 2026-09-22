import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from './Card';
import { colors, typography, spacing } from '../theme/theme';
import { useLanguage } from '../context/LanguageContext';

const TABS = [
  { key: 'about', labelKey: 'aboutCompetition', field: 'description' },
  { key: 'judging', labelKey: 'judgingParameters', field: 'judgingParameters' },
  { key: 'rules', labelKey: 'rulesEligibility', field: 'rules' },
];

export default function CompetitionTabs({ competition }) {
  const { t, localize } = useLanguage();
  const [activeKey, setActiveKey] = useState('about');
  const [expanded, setExpanded] = useState(false);

  const activeTab = TABS.find((tab) => tab.key === activeKey);
  const content = localize(competition[activeTab.field]);
  const truncatable = content.length > 140;
  const displayContent = expanded || !truncatable ? content : `${content.slice(0, 140).trimEnd()}...`;

  return (
    <Card>
      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const isActive = tab.key === activeKey;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabButton}
              onPress={() => {
                setActiveKey(tab.key);
                setExpanded(false);
              }}
            >
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]} numberOfLines={1}>
                {t(tab.labelKey)}
              </Text>
              {isActive ? <View style={styles.tabIndicator} /> : null}
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.content}>{displayContent || '--'}</Text>

      {truncatable ? (
        <TouchableOpacity onPress={() => setExpanded((v) => !v)}>
          <Text style={styles.viewMore}>{expanded ? t('viewLess') : t('viewMore')}</Text>
        </TouchableOpacity>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    marginRight: spacing.lg,
    paddingBottom: spacing.sm,
  },
  tabLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabLabelActive: {
    color: colors.primary,
  },
  tabIndicator: {
    marginTop: 6,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  content: {
    ...typography.bodyMuted,
    lineHeight: 20,
  },
  viewMore: {
    ...typography.label,
    color: colors.primary,
    marginTop: spacing.sm,
  },
});
