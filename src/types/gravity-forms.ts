export interface GFSubmissionResponse {
  is_valid: boolean;
  validation_messages: Record<string, string>;
  confirmation_message: string;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

/**
 * Maps friendly field names to Gravity Forms input IDs.
 * Update these to match the actual field IDs in your GF form.
 */
export const CONTACT_FIELD_MAP: Record<keyof ContactFormData, string> = {
  firstName: 'input_1',
  lastName: 'input_2',
  email: 'input_3',
  phone: 'input_4',
  message: 'input_5',
};
