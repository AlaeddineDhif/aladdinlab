export interface ContactInquiry {
  id?: number;
  name: string;
  email: string;
  inquiryType: string;
  userType: 'individual' | 'company';
  companyName?: string;
  message: string;
  createdAt?: string;
}

export const INQUIRY_TYPES = [
  'Sponsorship & Brand Collaboration',
  'Custom IoT / Embedded Project',
  '3D Printing & Prototyping',
  'General Inquiry / Feedback'
] as const;

export type InquiryType = typeof INQUIRY_TYPES[number];