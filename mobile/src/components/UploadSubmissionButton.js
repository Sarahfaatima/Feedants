import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography, spacing, radius } from '../theme/theme';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { uploadSubmission } from '../api/competitions';
import { parseApiError } from '../api/client';

// Single contextual CTA covering every state the assignment calls out:
// logged out, not registered, registration closed/full, submission not
// started, submission open, uploading, submitted, submission closed.
export default function UploadSubmissionButton({
  competitionId,
  participation,
  onRegister,
  registering,
  onSubmitted,
  onRequireLogin,
}) {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { isRegistered, canRegister, canSubmit, lifecycleStatus, submission, isFull } = participation || {};

  const pickAndUpload = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('somethingWentWrong'), 'Media library permission is required to submit an entry.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 0.8,
    });
    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    const isVideo = asset.type === 'video';
    const fileName = asset.fileName || `submission-${Date.now()}.${isVideo ? 'mp4' : 'jpg'}`;

    const file = {
      uri: asset.uri,
      name: fileName,
      type: asset.mimeType || (isVideo ? 'video/mp4' : 'image/jpeg'),
    };

    setUploading(true);
    setProgress(0);
    try {
      const created = await uploadSubmission(competitionId, file, (evt) => {
        if (evt.total) setProgress(Math.round((evt.loaded / evt.total) * 100));
      });
      onSubmitted?.(created);
    } catch (err) {
      const parsed = parseApiError(err);
      Alert.alert(t('somethingWentWrong'), parsed.message);
    } finally {
      setUploading(false);
    }
  };

  let label;
  let subtitle;
  let disabled = false;
  let icon = 'cloud-upload-outline';
  let onPress = () => {};

  if (!isAuthenticated) {
    label = t('loginToRegister');
    onPress = onRequireLogin;
    icon = 'log-in-outline';
  } else if (submission) {
    label = t('submitted');
    subtitle = t('registered');
    disabled = true;
    icon = 'checkmark-circle';
  } else if (uploading) {
    label = `${t('uploading')} ${progress}%`;
    disabled = true;
  } else if (!isRegistered) {
    if (canRegister) {
      label = registering ? t('uploading') : t('registerNow');
      subtitle = undefined;
      onPress = onRegister;
      disabled = registering;
      icon = 'add-circle-outline';
    } else {
      label = isFull ? t('full') : t('registrationClosed');
      disabled = true;
      icon = 'lock-closed-outline';
    }
  } else if (canSubmit) {
    label = t('uploadSubmission');
    subtitle = t('registered');
    onPress = pickAndUpload;
  } else if (lifecycleStatus === 'submission_closed' || lifecycleStatus === 'results_published') {
    label = t('submissionClosed');
    subtitle = t('registered');
    disabled = true;
    icon = 'lock-closed-outline';
  } else {
    label = t('submissionNotStarted');
    subtitle = t('registered');
    disabled = true;
    icon = 'time-outline';
  }

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      {uploading ? (
        <ActivityIndicator color={colors.white} style={{ marginRight: spacing.sm }} />
      ) : (
        <Ionicons name={icon} size={18} color={colors.white} style={{ marginRight: spacing.sm }} />
      )}
      <View>
        <Text style={styles.label}>{label}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  buttonDisabled: {
    backgroundColor: colors.textMuted,
  },
  label: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    textAlign: 'center',
  },
});
