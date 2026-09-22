import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme/theme';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  fetchCompetition,
  fetchWinners,
  fetchTestimonials,
  fetchRewards,
  fetchParticipation,
  registerForCompetition,
} from '../api/competitions';
import { parseApiError } from '../api/client';

import CompetitionHeader from '../components/CompetitionHeader';
import CompetitionSummary from '../components/CompetitionSummary';
import JudgeCard from '../components/JudgeCard';
import CountdownCard from '../components/CountdownCard';
import ImportantDates from '../components/ImportantDates';
import PreviousWinners from '../components/PreviousWinners';
import CompetitionTabs from '../components/CompetitionTabs';
import RewardsList from '../components/RewardsList';
import InfoCard from '../components/InfoCard';
import ReferralCard from '../components/ReferralCard';
import Testimonials from '../components/Testimonials';
import UploadSubmissionButton from '../components/UploadSubmissionButton';
import BottomNavigation from '../components/BottomNavigation';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

function AdPlaceholder() {
  const { t } = useLanguage();
  return (
    <View style={styles.adPlaceholder}>
      <Ionicons name="megaphone-outline" size={14} color={colors.textMuted} />
      <Text style={styles.adText}>{t('adHere')}</Text>
    </View>
  );
}

export default function CompetitionDetailsScreen({ route, navigation }) {
  const { competitionId } = route.params;
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  const [competition, setCompetition] = useState(null);
  const [winners, setWinners] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [participation, setParticipation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const tasks = [
        fetchCompetition(competitionId),
        fetchWinners(competitionId),
        fetchTestimonials(competitionId),
        fetchRewards(competitionId),
      ];
      const [comp, winnersData, testimonialsData, rewardsData] = await Promise.all(tasks);

      setCompetition(comp);
      setWinners(winnersData);
      setTestimonials(testimonialsData);
      setRewards(rewardsData);

      if (isAuthenticated) {
        const participationData = await fetchParticipation(competitionId);
        setParticipation(participationData);
      } else {
        setParticipation({
          lifecycleStatus: comp.lifecycleStatus,
          remainingSpots: comp.remainingSpots,
          isFull: comp.isFull,
          isRegistered: false,
          canRegister: false,
          canSubmit: false,
          submission: null,
        });
      }
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [competitionId, isAuthenticated]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      await registerForCompetition(competitionId);
      await load();
    } catch (err) {
      Alert.alert(t('somethingWentWrong'), parseApiError(err).message);
    } finally {
      setRegistering(false);
    }
  };

  const handleSubmitted = (submission) => {
    setParticipation((prev) => (prev ? { ...prev, submission, canSubmit: false } : prev));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <CompetitionHeader />
        <LoadingState />
      </SafeAreaView>
    );
  }

  if (error || !competition) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <CompetitionHeader />
        <ErrorState message={error} onRetry={load} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <CompetitionHeader />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <CompetitionSummary
            competition={competition}
            isRegistered={participation?.isRegistered}
            remainingSpots={participation?.remainingSpots ?? competition.remainingSpots}
            isFull={participation?.isFull ?? competition.isFull}
          />
        </View>

        <View style={styles.section}>
          <JudgeCard judge={competition.judge} introVideoUrl={competition.introVideoUrl} />
        </View>

        <View style={styles.section}>
          <CountdownCard
            registrationClose={competition.registrationClose}
            lifecycleStatus={participation?.lifecycleStatus ?? competition.lifecycleStatus}
          />
        </View>

        <View style={styles.section}>
          <ImportantDates competition={competition} />
        </View>

        <PreviousWinners winners={winners} />

        <View style={[styles.section, { marginTop: spacing.lg }]}>
          <CompetitionTabs competition={competition} />
        </View>

        <View style={styles.section}>
          <RewardsList rewards={rewards} />
        </View>

        <View style={styles.section}>
          <InfoCard variant="banner" icon="information-circle-outline" title={t('disclaimer') + ':'} subtitle={t('disclaimerText')} />
        </View>

        <View style={[styles.section, styles.trustRow]}>
          <View style={styles.trustLeft}>
            <InfoCard
              variant="button"
              icon="play"
              title={t('howReceivePrize')}
              subtitle={t('watchVideoToKnowMore')}
              onPress={() => competition.prizeInfoVideoUrl && Linking.openURL(competition.prizeInfoVideoUrl)}
            />
          </View>
          <View style={styles.trustRight}>
            <InfoCard icon="shield-checkmark-outline" title={t('refundPolicy')} />
            <View style={{ height: spacing.sm }} />
            <InfoCard icon="shield-checkmark-outline" title={`${t('securePaymentsPoweredBy')} Razorpay`} />
          </View>
        </View>

        <View style={styles.section}>
          <ReferralCard referralUrl={competition.referralUrl} rewardText={competition.referralRewardText} />
        </View>

        <View style={styles.section}>
          <Testimonials testimonials={testimonials} />
        </View>

        <View style={styles.section}>
          <AdPlaceholder />
        </View>

        <View style={styles.section}>
          <UploadSubmissionButton
            competitionId={competitionId}
            participation={participation}
            onRegister={handleRegister}
            registering={registering}
            onSubmitted={handleSubmitted}
            onRequireLogin={() => navigation.navigate('Login')}
          />
        </View>
      </ScrollView>

      <BottomNavigation
        activeKey="Competitions"
        onPress={(key) => {
          if (key === 'Add') {
            navigation.navigate('Tabs', { screen: 'Add' });
          } else {
            navigation.navigate('Tabs', { screen: key });
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: spacing.xxxl },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  trustRow: { flexDirection: 'row', gap: spacing.md },
  trustLeft: { flex: 1 },
  trustRight: { flex: 1, justifyContent: 'center' },
  adPlaceholder: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  adText: { ...typography.caption },
});
