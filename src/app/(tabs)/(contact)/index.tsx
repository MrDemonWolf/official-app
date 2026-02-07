import { NotificationFeedbackType } from 'expo-haptics';
import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  Pressable,
  View,
} from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useContactForm } from '@/hooks/use-contact-form';
import { useContactFormState } from '@/hooks/use-contact-form-state';
import { useHaptics } from '@/hooks/use-haptics';
import { decodeHtmlEntities } from '@/lib/decode-html';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export default function ContactScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { mutate, isPending, isSuccess, isError, data, error, reset } = useContactForm();
  const form = useContactFormState();
  const { resetForm } = form;
  const haptics = useHaptics();

  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const messageRef = useRef<TextInput>(null);

  const hasServerValidationErrors =
    data && !data.is_valid && Object.keys(data.validation_messages).length > 0;

  useEffect(() => {
    if (isSuccess && data?.is_valid) {
      haptics.notification();
      resetForm();
    }
  }, [isSuccess, data?.is_valid, resetForm, haptics]);

  const onSubmit = () => {
    reset();
    const valid = form.handleSubmit(mutate);
    if (!valid) {
      haptics.notification(NotificationFeedbackType.Error);
    }
  };

  const labelStyle = {
    fontSize: 13,
    fontWeight: '500' as const,
    color: isDark ? '#a1a1aa' : '#71717a',
    marginBottom: 4,
  };

  const inputStyle = {
    fontSize: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: isDark ? '#18181b' : '#f4f4f5',
    color: isDark ? '#f4f4f5' : '#18181b',
  };

  const errorTextStyle = {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 2,
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="interactive"
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}
        className="bg-zinc-50 dark:bg-zinc-950"
      >
        {/* Subtitle */}
        <Text
          style={{
            fontSize: 15,
            lineHeight: 22,
            color: isDark ? '#a1a1aa' : '#71717a',
          }}
        >
          Have a project in mind or just want to say hello? Drop me a message and I&apos;ll get back
          to you as soon as I can.
        </Text>

        {/* Contact Fields */}
        <View
          className="rounded-xl bg-white dark:bg-zinc-900"
          style={{ padding: 16, gap: 12, borderCurve: 'continuous' }}
        >
          <View>
            <Text style={labelStyle}>First Name *</Text>
            <TextInput
              style={inputStyle}
              placeholder="Jane"
              placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
              value={form.firstName}
              onChangeText={form.setFirstName}
              autoCorrect={false}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => lastNameRef.current?.focus()}
            />
            {form.errors.firstName && <Text style={errorTextStyle}>{form.errors.firstName}</Text>}
          </View>

          <View>
            <Text style={labelStyle}>Last Name *</Text>
            <TextInput
              ref={lastNameRef}
              style={inputStyle}
              placeholder="Doe"
              placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
              value={form.lastName}
              onChangeText={form.setLastName}
              autoCorrect={false}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => emailRef.current?.focus()}
            />
            {form.errors.lastName && <Text style={errorTextStyle}>{form.errors.lastName}</Text>}
          </View>

          <View>
            <Text style={labelStyle}>Email *</Text>
            <TextInput
              ref={emailRef}
              style={inputStyle}
              placeholder="jane@example.com"
              placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
              value={form.email}
              onChangeText={form.setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => phoneRef.current?.focus()}
            />
            {form.errors.email && <Text style={errorTextStyle}>{form.errors.email}</Text>}
          </View>

          <View>
            <Text style={labelStyle}>Phone</Text>
            <TextInput
              ref={phoneRef}
              style={inputStyle}
              placeholder="(555) 123-4567"
              placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
              value={form.phone}
              onChangeText={form.setPhone}
              keyboardType="phone-pad"
              blurOnSubmit={false}
              onSubmitEditing={() => messageRef.current?.focus()}
            />
          </View>
        </View>

        {/* Message */}
        <View
          className="rounded-xl bg-white dark:bg-zinc-900"
          style={{ padding: 16, gap: 12, borderCurve: 'continuous' }}
        >
          <View>
            <Text style={labelStyle}>Message *</Text>
            <TextInput
              ref={messageRef}
              style={{
                ...inputStyle,
                minHeight: 120,
                textAlignVertical: 'top',
              }}
              placeholder="How can we help?"
              placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
              value={form.message}
              onChangeText={form.setMessage}
              multiline
              returnKeyType="default"
            />
            {form.errors.message && <Text style={errorTextStyle}>{form.errors.message}</Text>}
          </View>
        </View>

        {/* Submit Button */}
        <Pressable
          onPress={onSubmit}
          disabled={isPending}
          style={({ pressed }) => ({
            backgroundColor: '#007AFF',
            borderRadius: 14,
            borderCurve: 'continuous',
            paddingVertical: 16,
            alignItems: 'center',
            opacity: pressed || isPending ? 0.7 : 1,
          })}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ fontSize: 17, fontWeight: '600', color: '#fff' }}>Send Message</Text>
          )}
        </Pressable>

        {/* Success Message */}
        {isSuccess && data?.is_valid && (
          <View
            style={{
              padding: 16,
              borderRadius: 14,
              borderCurve: 'continuous',
              backgroundColor: isDark ? '#052e16' : '#f0fdf4',
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: isDark ? '#86efac' : '#166534',
                textAlign: 'center',
              }}
            >
              {decodeHtmlEntities(stripHtml(data.confirmation_message)) ||
                'Thank you! Your message has been sent.'}
            </Text>
          </View>
        )}

        {/* Server Validation Errors */}
        {hasServerValidationErrors && (
          <View
            style={{
              padding: 16,
              borderRadius: 14,
              borderCurve: 'continuous',
              backgroundColor: isDark ? '#450a0a' : '#fef2f2',
            }}
          >
            {Object.values(data.validation_messages).map((msg, i) => (
              <Text
                key={i}
                style={{
                  fontSize: 14,
                  color: isDark ? '#fca5a5' : '#991b1b',
                }}
              >
                {msg}
              </Text>
            ))}
          </View>
        )}

        {/* Network / Server Error */}
        {isError && (
          <View
            style={{
              padding: 16,
              borderRadius: 14,
              borderCurve: 'continuous',
              backgroundColor: isDark ? '#450a0a' : '#fef2f2',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: isDark ? '#fca5a5' : '#991b1b',
                textAlign: 'center',
              }}
            >
              {error?.message || 'Something went wrong. Please try again.'}
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
