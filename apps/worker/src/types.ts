export interface Env {
  actionguard_db: D1Database;
  actionguard_evidence: R2Bucket;
  RESEND_API_KEY?: string;
  ALERT_FROM_EMAIL?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
}
