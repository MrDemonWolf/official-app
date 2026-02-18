import { ImpactFeedbackStyle, NotificationFeedbackType } from 'expo-haptics';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useContactForm } from '@/hooks/use-contact-form';
import { useContactFormState } from '@/hooks/use-contact-form-state';
import { useHaptics } from '@/hooks/use-haptics';
import { getAppCheckToken } from '@/services/app-check';

const isIOS = process.env.EXPO_OS === 'ios';

export default function ContactScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const haptics = useHaptics();
  const mutation = useContactForm();
  const form = useContactFormState();
  const [submitted, setSubmitted] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const isLoading = isVerifying || mutation.isPending;

  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const messageRef = useRef<TextInput>(null);

  const handleSubmit = useCallback(() => {
    setVerifyError(null);

    const didSubmit = form.handleSubmit(async (data) => {
      setIsVerifying(true);

      let appCheckToken: string;
      try {
        appCheckToken = await getAppCheckToken();
      } catch (error) {
        setIsVerifying(false);
        setVerifyError(
          error instanceof Error ? error.message : 'Device verification failed.',
        );
        haptics.notification(NotificationFeedbackType.Error);
        return;
      }

      setIsVerifying(false);

      mutation.mutate(
        { data, appCheckToken },
        {
          onSuccess: (response) => {
            haptics.notification(NotificationFeedbackType.Success);
            setConfirmationMessage(
              response.message || 'Your message has been sent successfully!',
            );
            setSubmitted(true);
            form.resetForm();
          },
          onError: () => {
            haptics.notification(NotificationFeedbackType.Error);
          },
        },
      );
    });

    if (!didSubmit) {
      haptics.notification(NotificationFeedbackType.Error);
    }
  }, [form, mutation, haptics]);

  const handleSendAnother = useCallback(() => {
    haptics.impact(ImpactFeedbackStyle.Light);
    setSubmitted(false);
    setConfirmationMessage('');
    setVerifyError(null);
    mutation.reset();
  }, [mutation, haptics]);

  const sectionHeaderStyle = {
    fontSize: 13,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    color: isDark ? '#a1a1aa' : '#71717a',
  };

  const inputStyle = {
    fontSize: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: isDark ? '#18181b' : '#f4f4f5',
    color: isDark ? '#f4f4f5' : '#18181b',
  };

  if (submitted) {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}
        className="bg-zinc-50 dark:bg-zinc-950"
      >
        <View style={{ alignItems: 'center', gap: 16 }}>
          <Text style={{ fontSize: 48 }}>{'✓'}</Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
              color: isDark ? '#f4f4f5' : '#18181b',
              textAlign: 'center',
            }}
          >
            Message Sent
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: isDark ? '#a1a1aa' : '#71717a',
              textAlign: 'center',
              lineHeight: 24,
            }}
          >
            {confirmationMessage}
          </Text>
          <Pressable
            onPress={handleSendAnother}
            accessibilityRole="button"
            accessibilityLabel="Send Another"
            style={({ pressed }) => ({
              marginTop: 8,
              paddingVertical: 14,
              paddingHorizontal: 32,
              borderRadius: 12,
              backgroundColor: '#3b82f6',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#ffffff' }}>
              Send Another
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={isIOS ? 'padding' : undefined}
      keyboardVerticalOffset={isIOS ? 100 : 0}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 24, paddingBottom: 40 }}
        className="bg-zinc-50 dark:bg-zinc-950"
        keyboardShouldPersistTaps="handled"
      >
        {/* Error banner */}
        {(mutation.isError || verifyError) && (
          <View
            accessibilityRole="alert"
            accessibilityLiveRegion="assertive"
            style={{
              padding: 12,
              borderRadius: 10,
              backgroundColor: isDark ? '#450a0a' : '#fef2f2',
              borderWidth: 1,
              borderColor: isDark ? '#7f1d1d' : '#fecaca',
            }}
          >
            <Text style={{ fontSize: 14, color: isDark ? '#fca5a5' : '#ef4444' }}>
              {verifyError || mutation.error?.message || 'Something went wrong. Please try again.'}
            </Text>
          </View>
        )}

        {/* Contact Form */}
        <View
          className="rounded-xl bg-white dark:bg-zinc-900"
          style={{ padding: 16, gap: 16, borderCurve: 'continuous' }}
        >
          <Text style={sectionHeaderStyle}>Contact Form</Text>

          {/* First Name */}
          <View style={{ gap: 4 }}>
            <TextInput
              style={inputStyle}
              placeholder="First Name"
              placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
              accessibilityLabel="First Name"
              value={form.firstName}
              onChangeText={form.setFirstName}
              autoCapitalize="words"
              autoComplete="given-name"
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current?.focus()}
            />
            {form.errors.firstName && (
              <Text
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
                style={{ fontSize: 13, color: isDark ? '#fca5a5' : '#ef4444', paddingLeft: 4 }}
              >
                {form.errors.firstName}
              </Text>
            )}
          </View>

          {/* Last Name */}
          <View style={{ gap: 4 }}>
            <TextInput
              ref={lastNameRef}
              style={inputStyle}
              placeholder="Last Name"
              placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
              accessibilityLabel="Last Name"
              value={form.lastName}
              onChangeText={form.setLastName}
              autoCapitalize="words"
              autoComplete="family-name"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
            {form.errors.lastName && (
              <Text
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
                style={{ fontSize: 13, color: isDark ? '#fca5a5' : '#ef4444', paddingLeft: 4 }}
              >
                {form.errors.lastName}
              </Text>
            )}
          </View>

          {/* Email */}
          <View style={{ gap: 4 }}>
            <TextInput
              ref={emailRef}
              style={inputStyle}
              placeholder="Email"
              placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
              accessibilityLabel="Email"
              value={form.email}
              onChangeText={form.setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current?.focus()}
            />
            {form.errors.email && (
              <Text
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
                style={{ fontSize: 13, color: isDark ? '#fca5a5' : '#ef4444', paddingLeft: 4 }}
              >
                {form.errors.email}
              </Text>
            )}
          </View>

          {/* Phone */}
          <View style={{ gap: 4 }}>
            <TextInput
              ref={phoneRef}
              style={inputStyle}
              placeholder="Phone (optional)"
              placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
              accessibilityLabel="Phone number, optional"
              value={form.phone}
              onChangeText={form.setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
              returnKeyType="next"
              onSubmitEditing={() => messageRef.current?.focus()}
            />
          </View>

          {/* Message */}
          <View style={{ gap: 4 }}>
            <TextInput
              ref={messageRef}
              style={[inputStyle, { minHeight: 120, textAlignVertical: 'top' }]}
              placeholder="Your message..."
              placeholderTextColor={isDark ? '#52525b' : '#a1a1aa'}
              accessibilityLabel="Your message"
              value={form.message}
              onChangeText={form.setMessage}
              multiline
              numberOfLines={5}
            />
            {form.errors.message && (
              <Text
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
                style={{ fontSize: 13, color: isDark ? '#fca5a5' : '#ef4444', paddingLeft: 4 }}
              >
                {form.errors.message}
              </Text>
            )}
          </View>

          {/* Submit */}
          <Pressable
            onPress={handleSubmit}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel={isLoading ? 'Sending message' : 'Send Message'}
            accessibilityState={{ disabled: isLoading }}
            style={({ pressed }) => ({
              paddingVertical: 14,
              borderRadius: 12,
              backgroundColor: isLoading ? (isDark ? '#1e40af' : '#93c5fd') : '#3b82f6',
              alignItems: 'center',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#ffffff' }}>
                Send Message
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
