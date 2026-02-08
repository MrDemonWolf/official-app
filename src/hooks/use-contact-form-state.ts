import { useCallback, useState } from 'react';

import type { ContactFormData } from '@/types/gravity-forms';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useContactFormState() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((): Record<string, string> => {
    const fieldErrors: Record<string, string> = {};

    if (!firstName.trim()) fieldErrors.firstName = 'First name is required';
    if (!lastName.trim()) fieldErrors.lastName = 'Last name is required';
    if (!email.trim()) {
      fieldErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      fieldErrors.email = 'Please enter a valid email';
    }
    if (!message.trim()) fieldErrors.message = 'Message is required';

    return fieldErrors;
  }, [firstName, lastName, email, message]);

  const resetForm = useCallback(() => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setErrors({});
  }, []);

  const getFormData = useCallback(
    (): ContactFormData => ({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim(),
    }),
    [firstName, lastName, email, phone, message]
  );

  const handleSubmit = useCallback(
    (mutate: (data: ContactFormData) => void): boolean => {
      const fieldErrors = validate();
      setErrors(fieldErrors);

      if (Object.keys(fieldErrors).length > 0) {
        return false;
      }

      mutate(getFormData());
      return true;
    },
    [validate, getFormData]
  );

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    phone,
    setPhone,
    message,
    setMessage,
    errors,
    setErrors,
    validate,
    resetForm,
    getFormData,
    handleSubmit,
  };
}
