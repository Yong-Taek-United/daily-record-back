interface EmailTemplate {
  to: string;
  subject: string;
  template: string;
  context?: {};
}

interface EmailLogData {
  email: string;
  emailType: string;
  userId?: number;
}
