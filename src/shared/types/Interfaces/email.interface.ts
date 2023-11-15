interface EmailTemplate {
  to: string;
  subject: string;
  template: string;
  context?: {};
}
