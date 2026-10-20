export interface Env {
  actionguard_db: D1Database;
  actionguard_evidence: R2Bucket;
  RESEND_API_KEY?: string;
  ALERT_FROM_EMAIL?: string;
}
