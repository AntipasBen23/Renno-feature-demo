export type Role = "contractor" | "homeowner" | "ops";

export type MilestoneStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "analyzing"
  | "needs_review"
  | "verified"
  | "paid"
  | "disputed";

export type Evidence = {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  previewDataUrl?: string; // for demo only
  createdAt: string; // ISO
  capturedAt?: string; // ISO
  geo?: { lat: number; lon: number; accuracyM?: number } | null;
  deviceNote?: string;
};

export type VerificationResult = {
  id: string;
  milestoneId: string;
  createdAt: string;
  confidence: number; // 0-100
  decision: "auto_verified" | "needs_review";
  checks: Array<{ label: string; passed: boolean }>;
  flags: string[];
};

export type LedgerEntry = {
  id: string;
  createdAt: string;
  projectId: string;
  milestoneId: string;
  amountEUR: number;
  method: "Auto (AI)" | "Manual (Ops)";
  status: "Initiated" | "Completed";
};

export type AuditEvent = {
  id: string;
  at: string;
  actor: Role | "system";
  action: string;
  meta?: Record<string, any>;
  prevHash?: string;
  hash: string;
};

export type Dispute = {
  id: string;
  projectId: string;
  milestoneId: string;
  createdAt: string;
  status: "open" | "resolved";
  reason: string;
  resolution?: string;
};

export type Milestone = {
  id: string;
  title: string;
  amountEUR: number;
  requirements: string[];
  threshold: number; // auto-verify threshold
  status: MilestoneStatus;
  evidenceIds: string[];
  verificationId?: string;
};

export type Project = {
  id: string;
  name: string;
  homeownerName: string;
  contractorName: string;
  escrowEUR: number;
  milestones: Milestone[];
};
