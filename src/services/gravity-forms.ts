import type { ContactFormData, GFSubmissionResponse } from '@/types/gravity-forms';
import { CONTACT_FIELD_MAP } from '@/types/gravity-forms';

const GF_API_URL =
  process.env.EXPO_PUBLIC_GF_API_URL || 'https://mrdemonwolf.com/wp-json/gf/v2';
const FORM_ID = process.env.EXPO_PUBLIC_GF_CONTACT_FORM_ID || '1';

export async function submitContactForm(data: ContactFormData): Promise<GFSubmissionResponse> {
  const payload: Record<string, string> = {};
  for (const [key, inputId] of Object.entries(CONTACT_FIELD_MAP)) {
    payload[inputId] = data[key as keyof ContactFormData];
  }

  const response = await fetch(`${GF_API_URL}/forms/${FORM_ID}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit contact form: ${response.statusText}`);
  }

  return response.json();
}
