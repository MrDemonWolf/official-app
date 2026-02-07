import { useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  Pressable,
  View,
} from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useContactForm } from '@/hooks/use-contact-form';
import { useContactFormState } from '@/hooks/use-contact-form-state';
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

  const hasServerValidationErrors =
    data && !data.is_valid && Object.keys(data.validation_messages).length > 0;

  useEffect(() => {
    if (isSuccess && data?.is_valid) {
      resetForm();
    }
  }, [isSuccess, data?.is_valid, resetForm]);

  const onSubmit = () => {
    reset();
    form.handleSubmit(mutate);
  };

  const sectionHeaderStyle = {
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
    color: isDark ? '#a1a1aa' : '#71717a',
  };

  const inputStyle = {
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: isDark ? '#3f3f46' : '#e4e4e7',
    color: isDark ? '#f4f4f5' : '#18181b',
    backgroundColor: 'transparent',
  };

  const inputErrorStyle = {
    ...inputStyle,
    borderColor: '#ef4444',
  };

  const errorTextStyle = {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 2,
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 24, paddingBottom: 40 }}
      className="bg-zinc-50 dark:bg-zinc-950"
    >
      {/* Contact Information */}
      <View
        className="rounded-xl bg-white dark:bg-zinc-900"
        style={{
          padding: 16,
          gap: 12,
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
        }}
      >
        <Text style={sectionHeaderStyle}>Contact Information</Text>

        <View>
          <TextInput
            style={form.errors.firstName ? inputErrorStyle : inputStyle}
            placeholder="First Name *"
            placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
            value={form.firstName}
            onChangeText={form.setFirstName}
            autoCorrect={false}
            returnKeyType="next"
          />
          {form.errors.firstName && <Text style={errorTextStyle}>{form.errors.firstName}</Text>}
        </View>

        <View>
          <TextInput
            style={form.errors.lastName ? inputErrorStyle : inputStyle}
            placeholder="Last Name *"
            placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
            value={form.lastName}
            onChangeText={form.setLastName}
            autoCorrect={false}
            returnKeyType="next"
          />
          {form.errors.lastName && <Text style={errorTextStyle}>{form.errors.lastName}</Text>}
        </View>

        <View>
          <TextInput
            style={form.errors.email ? inputErrorStyle : inputStyle}
            placeholder="Email *"
            placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
            value={form.email}
            onChangeText={form.setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />
          {form.errors.email && <Text style={errorTextStyle}>{form.errors.email}</Text>}
        </View>

        <View>
          <TextInput
            style={inputStyle}
            placeholder="Phone"
            placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
            value={form.phone}
            onChangeText={form.setPhone}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {/* Message */}
      <View
        className="rounded-xl bg-white dark:bg-zinc-900"
        style={{
          padding: 16,
          gap: 12,
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
        }}
      >
        <Text style={sectionHeaderStyle}>Message</Text>

        <View>
          <TextInput
            style={{
              ...(form.errors.message ? inputErrorStyle : inputStyle),
              minHeight: 120,
              textAlignVertical: 'top',
            }}
            placeholder="Your message *"
            placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
            value={form.message}
            onChangeText={form.setMessage}
            multiline
          />
          {form.errors.message && <Text style={errorTextStyle}>{form.errors.message}</Text>}
        </View>
      </View>

      {/* Submit Button */}
      <Pressable
        onPress={onSubmit}
        disabled={isPending}
        style={({ pressed }) => ({
          backgroundColor: '#0a7ea4',
          borderRadius: 12,
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
            borderRadius: 12,
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
            borderRadius: 12,
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
            borderRadius: 12,
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
  );
}
