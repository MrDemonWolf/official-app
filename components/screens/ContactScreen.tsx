import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    console.log('Contact form submitted:', { name, email, message });
    setName('');
    setEmail('');
    setMessage('');
    alert('Message sent! Thank you for reaching out.');
  };

  return (
    <ScrollView className="flex-1 bg-white pt-4">
      <View className="px-6 py-4">
        <Text className="mb-4 text-3xl font-bold text-gray-900">Contact</Text>

        <View className="mb-6 rounded-lg bg-gray-100 p-4">
          <Text className="text-xl font-semibold text-gray-800">Get in Touch</Text>
          <Text className="mt-2 text-gray-600">I'd love to hear from you. Send me a message!</Text>
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-semibold text-gray-700">Name</Text>
          <TextInput
            className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900"
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#999"
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-semibold text-gray-700">Email</Text>
          <TextInput
            className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#999"
            keyboardType="email-address"
          />
        </View>

        <View className="mb-6">
          <Text className="mb-2 font-semibold text-gray-700">Message</Text>
          <TextInput
            className="h-32 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900"
            placeholder="Your message here..."
            value={message}
            onChangeText={setMessage}
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          className="mb-24 items-center rounded-lg bg-purple-600 py-4 active:bg-purple-700"
          activeOpacity={0.8}>
          <Text className="text-lg font-semibold text-white">Send Message</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
