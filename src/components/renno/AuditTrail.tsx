"use client";

import { useRennoStore } from "@/store/rennoStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AuditTrail() {
  const audit = useRennoStore((s) => s.audit);

  return (
    <div className="space-y-3">
      <div className="text-sm font-extrabold">Audit Trail (demo hash chain)</div>

      <Card className="bg-white">
        <div className="p-3">
          <div className="text-sm text-renno-muted mb-3">
            Each event stores a hash referencing the previous event (tamper-evident style).
          </div>

          <div className="space-y-2">
            {[...audit].reverse().map((e) => (
              <div key={e.id} className="rounded-renno border-2 border-black bg-renno-paper p-3 shadow-rennoSm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-extrabold">{e.action}</div>
                  <Badge variant="outline">{e.actor}</Badge>
                </div>
                <div className="text-xs text-renno-muted mt-1">
                  {new Date(e.at).toLocaleString()}
                </div>
                <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 text-xs">
                  <div className="rounded-renno border-2 border-black bg-white p-2">
                    <div className="font-bold">hash</div>
                    <div className="font-mono">{e.hash}</div>
                  </div>
                  <div className="rounded-renno border-2 border-black bg-white p-2">
                    <div className="font-bold">prevHash</div>
                    <div className="font-mono">{e.prevHash ?? "—"}</div>
                  </div>
                </div>
                {e.meta && (
                  <pre className="mt-2 overflow-auto rounded-renno border-2 border-black bg-white p-2 text-[11px]">
{JSON.stringify(e.meta, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
