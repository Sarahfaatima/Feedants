import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme/theme';

export default function AddScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Ionicons name="cloud-upload-outline" size={40} color={colors.primary} />
      <Text style={styles.title}>Submit an entry</Text>
      <Text style={styles.subtitle}>
        Pick a competition you're registered for to upload your submission.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Competitions')}>
        <Text style={styles.buttonText}>Browse Competitions</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  title: { ...typography.title, marginTop: spacing.md },
  subtitle: { ...typography.bodyMuted, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xl },
  button: { backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  buttonText: { color: colors.white, fontWeight: '700' },
});
