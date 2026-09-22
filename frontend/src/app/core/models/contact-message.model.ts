export interface ContactMessage {
  id?: number;
  senderName: string;
  senderEmail: string;
  message: string;
  submittedAt?: string;
  read?: boolean;
}
