import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, typography, spacing } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { fetchCompetitions } from '../api/competitions';
import { parseApiError } from '../api/client';
import CompetitionListCard from '../components/CompetitionListCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await fetchCompetitions();
      setCompetitions(data);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={competitions}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <Text style={styles.greeting}>{user ? `Welcome, ${user.name.split(' ')[0]}` : 'Welcome to Feedants'}</Text>
            <Text style={styles.subtitle}>Featured competitions</Text>
          </View>
        }
        renderItem={({ item }) => (
          <CompetitionListCard
            competition={item}
            onPress={() => navigation.navigate('CompetitionDetails', { competitionId: item._id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  headerBlock: { paddingVertical: spacing.lg },
  greeting: { ...typography.title },
  subtitle: { ...typography.bodyMuted, marginTop: 2 },
});
