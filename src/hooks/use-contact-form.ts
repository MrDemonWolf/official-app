import { useMutation } from '@tanstack/react-query';

import { submitContactForm } from '@/services/contact';
import type { ContactSubmission, ContactSubmissionResponse } from '@/types/contact';

export function useContactForm() {
  return useMutation<ContactSubmissionResponse, Error, ContactSubmission>({
    mutationFn: submitContactForm,
  });
}
