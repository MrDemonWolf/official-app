import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useContactForm } from '../hooks';

export function ContactScreen() {
  const { name, setName, email, setEmail, message, setMessage, isSubmitting, handleSubmit } =
    useContactForm();

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="px-6 py-6 pt-12">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-4xl font-bold text-gray-900 dark:text-white">Get In Touch</Text>
          <Text className="mt-2 text-base text-gray-600 dark:text-gray-300">
            I would love to hear from you. Send me a message and I will respond as soon as possible.
          </Text>
        </View>

        {/* Contact Info Cards */}
        <View className="mb-8 flex-row gap-3">
          <View className="flex-1 rounded-xl bg-blue-50 p-4 dark:bg-blue-950/30">
            <Text className="text-xl">📧</Text>
            <Text className="mt-2 text-xs font-medium text-gray-600 dark:text-gray-400">Email</Text>
            <Text className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">hello@</Text>
          </View>
          <View className="flex-1 rounded-xl bg-purple-50 p-4 dark:bg-purple-950/30">
            <Text className="text-xl">💬</Text>
            <Text className="mt-2 text-xs font-medium text-gray-600 dark:text-gray-400">
              Response
            </Text>
            <Text className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
              24 hours
            </Text>
          </View>
        </View>

        {/* Form Section */}
        <View className="mb-8 rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
          <Text className="text-lg font-bold text-gray-900 dark:text-white">Contact Form</Text>

          {/* Name Input */}
          <View className="mt-5">
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">Name</Text>
            <TextInput
              className="mt-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Your full name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
              editable={!isSubmitting}
            />
          </View>

          {/* Email Input */}
          <View className="mt-4">
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</Text>
            <TextInput
              className="mt-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#999"
              keyboardType="email-address"
              editable={!isSubmitting}
            />
          </View>

          {/* Message Input */}
          <View className="mt-4">
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">Message</Text>
            <TextInput
              className="mt-2 h-40 rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Tell me about your project or idea..."
              value={message}
              onChangeText={setMessage}
              placeholderTextColor="#999"
              multiline
              textAlignVertical="top"
              editable={!isSubmitting}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            className="mt-6 items-center rounded-lg bg-purple-600 py-4 active:bg-purple-700 disabled:bg-purple-400 dark:bg-purple-700 dark:active:bg-purple-600"
            activeOpacity={0.8}>
            <Text className="text-base font-semibold text-white">
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer Note */}
        <View className="mb-24 rounded-xl bg-blue-50 p-4 dark:bg-blue-950/30">
          <Text className="text-xs leading-4 text-gray-600 dark:text-gray-300">
            💡 I typically respond to messages within 24 hours. For urgent inquiries, please call or
            use my social media.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
