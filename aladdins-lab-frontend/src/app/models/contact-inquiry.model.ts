export interface ContactInquiry {
  id?: number;
  name: string;
  email: string;
  inquiryType: string;
  message: string;
  createdAt?: string;
}

export const INQUIRY_TYPES = [
  'Sponsorship',
  'Collaboration',
  'Custom Project',
  'General Inquiry'
] as const;

export type InquiryType = typeof INQUIRY_TYPES[number];