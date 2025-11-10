import { useState } from 'react';
import { Alert } from 'react-native';
import { CONTACT_FORM_MESSAGES } from '../constants';

export function useContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert(CONTACT_FORM_MESSAGES.EMPTY_NAME.title, CONTACT_FORM_MESSAGES.EMPTY_NAME.message);
      return false;
    }
    if (!email.trim() || !validateEmail(email)) {
      Alert.alert(
        CONTACT_FORM_MESSAGES.INVALID_EMAIL.title,
        CONTACT_FORM_MESSAGES.INVALID_EMAIL.message
      );
      return false;
    }
    if (!message.trim()) {
      Alert.alert(
        CONTACT_FORM_MESSAGES.EMPTY_MESSAGE.title,
        CONTACT_FORM_MESSAGES.EMPTY_MESSAGE.message
      );
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setMessage('');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Contact form submitted:', { name, email, message });
      Alert.alert(CONTACT_FORM_MESSAGES.SUCCESS.title, CONTACT_FORM_MESSAGES.SUCCESS.message);
      resetForm();
    } catch {
      Alert.alert(CONTACT_FORM_MESSAGES.ERROR.title, CONTACT_FORM_MESSAGES.ERROR.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    message,
    setMessage,
    isSubmitting,
    handleSubmit,
    resetForm,
  };
}
