"use client";

import { useMemo } from "react";
import { useRennoStore } from "../store/rennoStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function VerificationPanel({ milestoneId }: { milestoneId: string }) {
  const projects = useRennoStore((s) => s.projects);
  const evidenceMap = useRennoStore((s) => s.evidence);
  const verifications = useRennoStore((s) => s.verifications);

  const milestone = useMemo(() => {
    for (const p of projects) {
      const m = p.milestones.find((x) => x.id === milestoneId);
      if (m) return m;
    }
    return null;
  }, [projects, milestoneId]);

  if (!milestone) return null;

  const ev = milestone.evidenceIds.map((id) => evidenceMap[id]).filter(Boolean);
  const vr = milestone.verificationId ? verifications[milestone.verificationId] : undefined;

  return (
    <div className="space-y-3">
      <div className="text-sm font-extrabold">Verification</div>

      <Card className="bg-white shadow-rennoSm">
        <div className="space-y-3 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm text-renno-muted">
              Status: <span className="font-extrabold text-black">{milestone.status.replaceAll("_", " ")}</span>
            </div>
            <div className="text-xs text-renno-muted">
              Evidence items: <span className="font-bold text-black">{ev.length}</span>
            </div>
          </div>

          {milestone.status === "analyzing" && (
            <div className="space-y-2">
              <Progress value={65} />
              <div className="text-xs text-renno-muted">
                Running pipeline: metadata checks → vision checks → confidence score → decision.
              </div>
            </div>
          )}

          {!vr && milestone.status !== "analyzing" && (
            <div className="text-sm text-renno-muted">
              No verification result yet. Add evidence then submit.
            </div>
          )}

          {vr && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={vr.decision === "auto_verified" ? "success" : "warning"}>
                  {vr.decision === "auto_verified" ? "AUTO-VERIFIED" : "NEEDS HUMAN REVIEW"}
                </Badge>
                <Badge variant="outline">Confidence: {vr.confidence}%</Badge>
                <Badge variant="outline">Threshold: {milestone.threshold}%</Badge>
              </div>

              <Progress value={vr.confidence} />

              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="rounded-renno border-2 border-black bg-renno-paper p-3 shadow-rennoSm">
                  <div className="text-sm font-extrabold mb-2">Checks</div>
                  <ul className="space-y-1 text-sm">
                    {vr.checks.map((c, idx) => (
                      <li key={idx} className="flex items-center justify-between">
                        <span className="text-black/90">{c.label}</span>
                        <span className={`font-extrabold ${c.passed ? "text-black" : "text-renno-orange"}`}>
                          {c.passed ? "PASS" : "FAIL"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-renno border-2 border-black bg-white p-3 shadow-rennoSm">
                  <div className="text-sm font-extrabold mb-2">Flags</div>
                  {vr.flags.length ? (
                    <ul className="list-disc pl-5 text-sm text-renno-muted">
                      {vr.flags.map((f, idx) => (
                        <li key={idx}><span className="text-black/90">{f}</span></li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-renno-muted">No flags.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
