"use client";

import { useRennoStore } from "@/store/rennoStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LedgerPanel() {
  const ledger = useRennoStore((s) => s.ledger);
  const projects = useRennoStore((s) => s.projects);

  function milestoneTitle(milestoneId: string) {
    for (const p of projects) {
      const m = p.milestones.find((x) => x.id === milestoneId);
      if (m) return m.title;
    }
    return milestoneId;
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-extrabold">Ledger</div>

      <Card className="bg-white">
        <div className="p-3">
          <div className="text-sm text-renno-muted mb-3">
            This mimics escrow payout events triggered by verification.
          </div>

          {ledger.length === 0 ? (
            <div className="text-sm text-renno-muted">No payouts yet. Auto-verify a milestone to see entries.</div>
          ) : (
            <div className="space-y-2">
              {ledger.map((l) => (
                <div key={l.id} className="rounded-renno border-2 border-black bg-renno-paper p-3 shadow-rennoSm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-extrabold">{milestoneTitle(l.milestoneId)}</div>
                    <Badge variant={l.status === "Completed" ? "success" : "warning"}>{l.status}</Badge>
                  </div>
                  <div className="mt-1 text-sm text-renno-muted">
                    Amount: <span className="font-bold text-black">€{l.amountEUR.toLocaleString()}</span> • Method:{" "}
                    <span className="font-bold text-black">{l.method}</span>
                  </div>
                  <div className="text-xs text-renno-muted mt-1">
                    {new Date(l.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
