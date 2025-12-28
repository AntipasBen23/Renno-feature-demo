"use client";

import { useMemo, useState } from "react";
import { useRennoStore } from "@/store/rennoStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EvidenceUploader from "./EvidenceUploader";
import VerificationPanel from "./VerificationPanel";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

function statusBadge(status: string) {
  switch (status) {
    case "paid":
      return <Badge variant="success">PAID</Badge>;
    case "verified":
      return <Badge variant="success">VERIFIED</Badge>;
    case "needs_review":
      return <Badge variant="warning">NEEDS REVIEW</Badge>;
    case "analyzing":
      return <Badge variant="outline">ANALYZING</Badge>;
    case "submitted":
      return <Badge variant="outline">SUBMITTED</Badge>;
    case "disputed":
      return <Badge variant="danger">DISPUTED</Badge>;
    case "in_progress":
      return <Badge variant="default">IN PROGRESS</Badge>;
    default:
      return <Badge variant="outline">NOT STARTED</Badge>;
  }
}

export default function MilestoneCard({ milestoneId }: { projectId: string; milestoneId: string }) {
  const role = useRennoStore((s) => s.role);
  const projects = useRennoStore((s) => s.projects);
  const evidenceMap = useRennoStore((s) => s.evidence);
  const verifications = useRennoStore((s) => s.verifications);
  const submitForVerification = useRennoStore((s) => s.submitForVerification);
  const opsApprove = useRennoStore((s) => s.opsApprove);
  const openDispute = useRennoStore((s) => s.openDispute);

  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");

  const milestone = useMemo(() => {
    for (const p of projects) {
      const m = p.milestones.find((x) => x.id === milestoneId);
      if (m) return m;
    }
    return null;
  }, [projects, milestoneId]);

  if (!milestone) return null;

  const evidence = milestone.evidenceIds.map((id) => evidenceMap[id]).filter(Boolean);

  const verification = milestone.verificationId ? verifications[milestone.verificationId] : undefined;

  const canSubmit =
    role === "contractor" &&
    (milestone.status === "in_progress" || milestone.status === "submitted" || milestone.status === "not_started") &&
    milestone.evidenceIds.length > 0;

  const canManualApprove = role === "ops" && milestone.status === "needs_review";
  const canDispute = role === "homeowner" && (milestone.status === "needs_review" || milestone.status === "verified" || milestone.status === "paid");

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle>{milestone.title}</CardTitle>
            <CardDescription>
              Milestone payout: <span className="font-bold text-black">€{milestone.amountEUR.toLocaleString()}</span>{" "}
              • Auto-verify threshold: <span className="font-bold text-black">{milestone.threshold}%</span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {statusBadge(milestone.status)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-renno border-2 border-black bg-white p-3 shadow-rennoSm">
          <div className="text-sm font-extrabold mb-2">Completion requirements</div>
          <ul className="list-disc pl-5 text-sm text-renno-muted">
            {milestone.requirements.map((r, i) => (
              <li key={i}><span className="text-black/90">{r}</span></li>
            ))}
          </ul>
        </div>

        <EvidenceUploader milestoneId={milestone.id} disabled={role !== "contractor" || milestone.status === "paid"} />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            disabled={!canSubmit || milestone.status === "analyzing"}
            onClick={() => submitForVerification(milestone.id)}
          >
            Submit for Verification
          </Button>

          {canManualApprove && (
            <Button variant="secondary" onClick={() => opsApprove(milestone.id)}>
              Ops: Approve + Release Payout
            </Button>
          )}

          {canDispute && (
            <Button variant="danger" onClick={() => setDisputeOpen(true)}>
              Open Dispute
            </Button>
          )}
        </div>

        <Separator />

        <VerificationPanel milestoneId={milestone.id} />

        <Dialog open={disputeOpen} onOpenChange={setDisputeOpen} title="Open a Dispute">
          <div className="space-y-3">
            <div className="text-sm text-renno-muted">
              Disputes are expensive. The point of the Trust Engine is to reduce these by making completion objective.
            </div>
            <Textarea
              placeholder="Describe what’s wrong (e.g. missing items, incorrect install, quality issues)..."
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Button
                variant="danger"
                disabled={disputeReason.trim().length < 6}
                onClick={() => {
                  openDispute(milestone.id, disputeReason.trim());
                  setDisputeReason("");
                  setDisputeOpen(false);
                }}
              >
                Submit Dispute
              </Button>
              <Button variant="secondary" onClick={() => setDisputeOpen(false)}>Cancel</Button>
            </div>
          </div>
        </Dialog>
      </CardContent>
    </Card>
  );
}
