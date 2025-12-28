"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Role,
  Project,
  Evidence,
  VerificationResult,
  LedgerEntry,
  AuditEvent,
  Dispute,
  MilestoneStatus,
} from "@/components/renno/types";

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

// simple demo "hash"
function tinyHash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ("00000000" + (h >>> 0).toString(16)).slice(-8);
}

function nowIso() {
  return new Date().toISOString();
}

const seedProjects: Project[] = [
  {
    id: "proj_renno_001",
    name: "Kitchen Renovation — Amsterdam",
    homeownerName: "Sanne V.",
    contractorName: "Van Dijk Bouw",
    escrowEUR: 42000,
    milestones: [
      {
        id: "ms_001",
        title: "Demolition + Waste Removal",
        amountEUR: 6500,
        requirements: [
          "Before/after photos (wide angle)",
          "Waste disposal receipt photo",
          "Site cleared, safe access",
        ],
        threshold: 78,
        status: "in_progress",
        evidenceIds: [],
      },
      {
        id: "ms_002",
        title: "Plumbing Rough-In Complete",
        amountEUR: 9800,
        requirements: [
          "Photos of piping runs",
          "Close-up of joints + valves",
          "Pressure test proof photo",
        ],
        threshold: 82,
        status: "not_started",
        evidenceIds: [],
      },
      {
        id: "ms_003",
        title: "Cabinet + Countertop Install",
        amountEUR: 12600,
        requirements: [
          "Wide angle of full kitchen",
          "Close-ups: anchors + alignment",
          "Appliance gaps measured photo",
        ],
        threshold: 85,
        status: "not_started",
        evidenceIds: [],
      },
      {
        id: "ms_004",
        title: "Final Finish + Handover",
        amountEUR: 13100,
        requirements: [
          "Walkthrough video (15–30s)",
          "Checklist signed (photo)",
          "Snag list addressed",
        ],
        threshold: 88,
        status: "not_started",
        evidenceIds: [],
      },
    ],
  },
];

type State = {
  role: Role;
  activeProjectId: string;

  projects: Project[];
  evidence: Record<string, Evidence>;
  verifications: Record<string, VerificationResult>;
  ledger: LedgerEntry[];
  audit: AuditEvent[];
  disputes: Dispute[];

  setRole: (role: Role) => void;
  setActiveProject: (projectId: string) => void;

  addEvidence: (milestoneId: string, ev: Evidence) => void;
  submitForVerification: (milestoneId: string) => Promise<void>;
  opsApprove: (milestoneId: string) => void;
  openDispute: (milestoneId: string, reason: string) => void;
  resolveDispute: (disputeId: string, resolution: string) => void;

  resetDemo: () => void;
};

function findMilestone(projects: Project[], milestoneId: string) {
  for (const p of projects) {
    const m = p.milestones.find((x) => x.id === milestoneId);
    if (m) return { project: p, milestone: m };
  }
  return null;
}

function updateMilestoneStatus(
  projects: Project[],
  milestoneId: string,
  status: MilestoneStatus
): Project[] {
  return projects.map((p) => ({
    ...p,
    milestones: p.milestones.map((m) =>
      m.id === milestoneId ? { ...m, status } : m
    ),
  }));
}

function appendAudit(
  audit: AuditEvent[],
  actor: Role | "system",
  action: string,
  meta?: any
): AuditEvent[] {
  const prevHash = audit.length ? audit[audit.length - 1].hash : undefined;
  const payload = JSON.stringify({ at: nowIso(), actor, action, meta, prevHash });
  const hash = tinyHash(payload + (prevHash ?? ""));
  const evt: AuditEvent = {
    id: uid("audit"),
    at: nowIso(),
    actor,
    action,
    meta,
    prevHash,
    hash,
  };
  return [...audit, evt];
}

export const useRennoStore = create<State>()(
  persist(
    (set, get) => ({
      role: "ops",
      activeProjectId: seedProjects[0].id,

      projects: seedProjects,
      evidence: {},
      verifications: {},
      ledger: [],
      audit: [
        {
          id: "audit_seed",
          at: nowIso(),
          actor: "system",
          action: "Demo initialized",
          meta: { projects: seedProjects.length },
          prevHash: undefined,
          hash: tinyHash("seed"),
        },
      ],
      disputes: [],

      setRole: (role) =>
        set((s) => ({
          role,
          audit: appendAudit(s.audit, role, "Role switched"),
        })),

      setActiveProject: (projectId) =>
        set(() => ({
          activeProjectId: projectId,
        })),

      addEvidence: (milestoneId, ev) =>
        set((s) => {
          const found = findMilestone(s.projects, milestoneId);
          if (!found) return s;

          const projects: Project[] = s.projects.map((p) => ({
            ...p,
            milestones: p.milestones.map((m) => {
              if (m.id !== milestoneId) return m;

              const nextStatus: MilestoneStatus =
                m.status === "not_started" ? "in_progress" : m.status;

              return {
                ...m,
                status: nextStatus,
                evidenceIds: [...m.evidenceIds, ev.id],
              };
            }),
          }));

          const audit = appendAudit(s.audit, s.role, "Evidence added", {
            milestoneId,
            evidenceId: ev.id,
            fileName: ev.fileName,
          });

          return {
            ...s,
            projects,
            evidence: { ...s.evidence, [ev.id]: ev },
            audit,
          };
        }),

      submitForVerification: async (milestoneId) => {
        const snap = get();
        const found = findMilestone(snap.projects, milestoneId);
        if (!found) return;

        // submitted
        set((st) => ({
          projects: updateMilestoneStatus(st.projects, milestoneId, "submitted"),
          audit: appendAudit(st.audit, st.role, "Submitted for verification", { milestoneId }),
        }));

        await new Promise((r) => setTimeout(r, 450));

        // analyzing
        set((st) => ({
          projects: updateMilestoneStatus(st.projects, milestoneId, "analyzing"),
          audit: appendAudit(st.audit, "system", "AI analysis started", { milestoneId }),
        }));

        // simulate AI analysis
        const milestone = findMilestone(get().projects, milestoneId)?.milestone;
        if (!milestone) return;

        const evCount = milestone.evidenceIds.length;
        const base = Math.min(65 + evCount * 9, 92);
        const jitter = Math.floor((Math.random() - 0.5) * 18); // -9..+9
        const confidence = Math.max(30, Math.min(98, base + jitter));

        const checks = [
          { label: "Required angles captured", passed: evCount >= 2 },
          { label: "Material consistency detected", passed: confidence >= 60 },
          { label: "Work area matches expected zone", passed: confidence >= 70 },
          { label: "Evidence quality sufficient", passed: confidence >= 75 },
        ];

        const flags: string[] = [];
        if (evCount < 2) flags.push("Not enough evidence angles — request 2–3 shots.");
        if (confidence < 75) flags.push("Low confidence: lighting/angle mismatch suspected.");
        if (confidence >= 92) flags.push("High confidence: matches known completion patterns.");

        const decision =
          confidence >= milestone.threshold ? ("auto_verified" as const) : ("needs_review" as const);

        const verificationId = uid("ver");
        const vr: VerificationResult = {
          id: verificationId,
          milestoneId,
          createdAt: nowIso(),
          confidence,
          decision,
          checks,
          flags,
        };

        if (decision === "auto_verified") {
          set((st) => {
            const projects: Project[] = st.projects.map((p) => ({
              ...p,
              milestones: p.milestones.map((m) =>
                m.id === milestoneId
                  ? ({
                      ...m,
                      status: "verified" as MilestoneStatus,
                      verificationId,
                    })
                  : m
              ),
            }));

            const ledgerEntry: LedgerEntry = {
              id: uid("led"),
              createdAt: nowIso(),
              projectId: found.project.id,
              milestoneId,
              amountEUR: milestone.amountEUR,
              method: "Auto (AI)",
              status: "Initiated",
            };

            let audit = appendAudit(st.audit, "system", "AI decision: auto-verified", {
              milestoneId,
              confidence,
              threshold: milestone.threshold,
            });

            audit = appendAudit(audit, "system", "Payout initiated", {
              milestoneId,
              amountEUR: milestone.amountEUR,
              method: "Auto (AI)",
            });

            return {
              ...st,
              projects,
              verifications: { ...st.verifications, [verificationId]: vr },
              ledger: [ledgerEntry, ...st.ledger],
              audit,
            };
          });

          await new Promise((r) => setTimeout(r, 900));

          set((st) => {
            const ledger: LedgerEntry[] = st.ledger.map((l) =>
              l.milestoneId === milestoneId
                ? { ...l, status: "Completed" as const }
                : l
            );

            const projects = updateMilestoneStatus(st.projects, milestoneId, "paid");
            const audit = appendAudit(st.audit, "system", "Payout completed", { milestoneId });

            return { ...st, ledger, projects, audit };
          });
        } else {
          set((st) => {
            const projects: Project[] = st.projects.map((p) => ({
              ...p,
              milestones: p.milestones.map((m) =>
                m.id === milestoneId
                  ? ({
                      ...m,
                      status: "needs_review" as MilestoneStatus,
                      verificationId,
                    })
                  : m
              ),
            }));

            const audit = appendAudit(st.audit, "system", "AI decision: needs review", {
              milestoneId,
              confidence,
              threshold: milestone.threshold,
            });

            return {
              ...st,
              projects,
              verifications: { ...st.verifications, [verificationId]: vr },
              audit,
            };
          });
        }
      },

      opsApprove: (milestoneId) =>
        set((s) => {
          const found = findMilestone(s.projects, milestoneId);
          if (!found) return s;

          const milestone = found.milestone;

          let projects = updateMilestoneStatus(s.projects, milestoneId, "verified");

          const ledgerEntry: LedgerEntry = {
            id: uid("led"),
            createdAt: nowIso(),
            projectId: found.project.id,
            milestoneId,
            amountEUR: milestone.amountEUR,
            method: "Manual (Ops)",
            status: "Completed",
          };

          let audit = appendAudit(s.audit, s.role, "Manual approval granted", { milestoneId });
          audit = appendAudit(audit, "system", "Payout completed", {
            milestoneId,
            amountEUR: milestone.amountEUR,
            method: "Manual (Ops)",
          });

          // immediately paid for demo
          projects = updateMilestoneStatus(projects, milestoneId, "paid");

          return { ...s, projects, ledger: [ledgerEntry, ...s.ledger], audit };
        }),

      openDispute: (milestoneId, reason) =>
        set((s) => {
          const found = findMilestone(s.projects, milestoneId);
          if (!found) return s;

          const dispute: Dispute = {
            id: uid("disp"),
            projectId: found.project.id,
            milestoneId,
            createdAt: nowIso(),
            status: "open",
            reason,
          };

          const projects = updateMilestoneStatus(s.projects, milestoneId, "disputed");
          const audit = appendAudit(s.audit, s.role, "Dispute opened", { milestoneId, reason });

          return { ...s, disputes: [dispute, ...s.disputes], projects, audit };
        }),

      resolveDispute: (disputeId, resolution) =>
        set((s) => {
          const dispute = s.disputes.find((d) => d.id === disputeId);
          if (!dispute) return s;

          const disputes: Dispute[] = s.disputes.map((d) =>
            d.id === disputeId
              ? { ...d, status: "resolved" as const, resolution }
              : d
          );

          const projects = updateMilestoneStatus(s.projects, dispute.milestoneId, "needs_review");
          const audit = appendAudit(s.audit, s.role, "Dispute resolved", { disputeId, resolution });

          return { ...s, disputes, projects, audit };
        }),

      resetDemo: () =>
        set(() => ({
          role: "ops",
          activeProjectId: seedProjects[0].id,
          projects: seedProjects,
          evidence: {},
          verifications: {},
          ledger: [],
          disputes: [],
          audit: [
            {
              id: "audit_seed",
              at: nowIso(),
              actor: "system",
              action: "Demo reset",
              meta: { projects: seedProjects.length },
              prevHash: undefined,
              hash: tinyHash("reset"),
            },
          ],
        })),
    }),
    {
      name: "renno_demo_store_v1",
      version: 1,
    }
  )
);
