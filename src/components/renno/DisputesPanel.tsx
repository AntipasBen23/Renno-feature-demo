"use client";

import { useState } from "react";
import { useRennoStore } from "@/store/rennoStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function DisputesPanel() {
  const role = useRennoStore((s) => s.role);
  const disputes = useRennoStore((s) => s.disputes);
  const projects = useRennoStore((s) => s.projects);
  const resolveDispute = useRennoStore((s) => s.resolveDispute);

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [resolution, setResolution] = useState("");

  function titleFor(milestoneId: string) {
    for (const p of projects) {
      const m = p.milestones.find((x) => x.id === milestoneId);
      if (m) return m.title;
    }
    return milestoneId;
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-extrabold">Disputes</div>

      <Card className="bg-white">
        <div className="p-3">
          <div className="text-sm text-renno-muted mb-3">
            Disputes are the cost center. Verification automation exists to reduce them.
          </div>

          {disputes.length === 0 ? (
            <div className="text-sm text-renno-muted">No disputes yet.</div>
          ) : (
            <div className="space-y-2">
              {disputes.map((d) => (
                <div key={d.id} className="rounded-renno border-2 border-black bg-renno-paper p-3 shadow-rennoSm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-extrabold">{titleFor(d.milestoneId)}</div>
                    <Badge variant={d.status === "open" ? "danger" : "success"}>
                      {d.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm">
                    <div className="font-bold">Reason</div>
                    <div className="text-renno-muted">{d.reason}</div>
                  </div>

                  {d.resolution && (
                    <div className="mt-2 text-sm">
                      <div className="font-bold">Resolution</div>
                      <div className="text-renno-muted">{d.resolution}</div>
                    </div>
                  )}

                  <div className="mt-2 text-xs text-renno-muted">
                    {new Date(d.createdAt).toLocaleString()}
                  </div>

                  {role === "ops" && d.status === "open" && (
                    <div className="mt-3">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSelectedId(d.id);
                          setOpen(true);
                        }}
                      >
                        Resolve Dispute
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen} title="Resolve Dispute (Ops)">
        <div className="space-y-3">
          <div className="text-sm text-renno-muted">
            Give a short resolution note. The milestone returns to “needs review” for re-verification in this demo.
          </div>
          <Textarea
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            placeholder="Resolution note..."
          />
          <div className="flex items-center gap-2">
            <Button
              disabled={!selectedId || resolution.trim().length < 5}
              onClick={() => {
                if (!selectedId) return;
                resolveDispute(selectedId, resolution.trim());
                setResolution("");
                setSelectedId(null);
                setOpen(false);
              }}
            >
              Resolve
            </Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
