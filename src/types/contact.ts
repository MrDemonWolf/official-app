export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export interface ContactSubmission {
  data: ContactFormData;
  appCheckToken: string;
}

export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
  entry_id?: number;
}
