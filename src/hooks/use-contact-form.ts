import { useMutation } from '@tanstack/react-query';

import { submitContactForm } from '@/services/gravity-forms';
import type { ContactFormData, GFSubmissionResponse } from '@/types/gravity-forms';

export function useContactForm() {
  return useMutation<GFSubmissionResponse, Error, ContactFormData>({
    mutationFn: submitContactForm,
  });
}
