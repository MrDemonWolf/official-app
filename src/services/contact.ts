import type { ContactSubmission, ContactSubmissionResponse } from '@/types/contact';

const PACKRELAY_API_URL =
  process.env.EXPO_PUBLIC_PACKRELAY_API_URL || '';
const PACKRELAY_FORM_ID =
  process.env.EXPO_PUBLIC_PACKRELAY_FORM_ID || '';

/** Maps friendly field names to WPForms field IDs */
const FIELD_IDS: Record<string, string> = {
  firstName: '1',
  lastName: '2',
  email: '3',
  phone: '4',
  message: '5',
};

export async function submitContactForm(
  submission: ContactSubmission,
): Promise<ContactSubmissionResponse> {
  const { data, appCheckToken } = submission;

  const fields: Record<string, string> = {};
  for (const [key, fieldId] of Object.entries(FIELD_IDS)) {
    const value = data[key as keyof typeof data];
    if (value) {
      fields[fieldId] = value;
    }
  }

  let response: Response;
  try {
    response = await fetch(
      `${PACKRELAY_API_URL}/submit/${PACKRELAY_FORM_ID}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields,
          app_check_token: appCheckToken,
        }),
      },
    );
  } catch {
    throw new Error(
      'Unable to reach the server. Please check your internet connection and try again.',
    );
  }

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = await response.json();
      detail = body?.message || body?.detail || JSON.stringify(body);
    } catch {
      // body wasn't JSON — fall back to statusText
    }
    throw new Error(`Submission failed: ${detail}`);
  }

  const result: ContactSubmissionResponse = await response.json();

  if (!result.success) {
    throw new Error(result.message || 'Submission was not accepted. Please try again.');
  }

  return result;
}
