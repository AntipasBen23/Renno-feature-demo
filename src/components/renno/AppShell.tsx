"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRennoStore } from "../store/rennoStore";
import RoleSwitcher from "./RoleSwitcher";
import ProjectBoard from "./ProjectBoard";
import { Tabs } from "@/components/ui/tabs";
import LedgerPanel from "./LedgerPanel";
import AuditTrail from "./AuditTrail";
import DisputesPanel from "./DisputesPanel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function AppShell() {
  const { resetDemo } = useRennoStore();
  const [tab, setTab] = useRennoStore((s) => [s.role === "contractor" ? "project" : "project", () => {}]) as any; // dummy to avoid rerenders
  const [view, setView] = useRennoStore((s) => [s.activeProjectId, () => {}]) as any; // dummy

  const [activeTab, setActiveTab] = (function () {
    // local tab state, avoid store coupling
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const React = require("react");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return React.useState("project");
  })();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-renno border-2 border-black bg-white shadow-rennoSm">
              <div className="h-8 w-8 border-2 border-black bg-renno-orange" />
            </div>
            <div>
              <div className="text-2xl font-extrabold tracking-tight">
                Verified Milestones + Escrow Trigger (Demo)
              </div>
              <div className="text-sm text-renno-muted">
                Frontend-only simulation: evidence → AI confidence → auto-verify/manual review → payout ledger → audit trail
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <RoleSwitcher />
            <Button variant="secondary" onClick={resetDemo}>Reset Demo</Button>
          </div>
        </div>
      </div>

      <Card className="bg-renno-white">
        <CardHeader>
          <CardTitle>Trust Engine Console</CardTitle>
          <CardDescription>
            This is the layer Renno will need to scale: objective milestone verification to unlock instant payouts without scaling ops headcount.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <Tabs
            tabs={[
              { key: "project", label: "Project" },
              { key: "ledger", label: "Ledger" },
              { key: "audit", label: "Audit Trail" },
              { key: "disputes", label: "Disputes" },
            ]}
            value={activeTab[0]}
            onChange={activeTab[1]}
          />

          <Separator />

          {activeTab[0] === "project" && <ProjectBoard />}
          {activeTab[0] === "ledger" && <LedgerPanel />}
          {activeTab[0] === "audit" && <AuditTrail />}
          {activeTab[0] === "disputes" && <DisputesPanel />}
        </CardContent>
      </Card>

      <div className="mt-6 text-xs text-renno-muted">
        Palette: <span className="font-bold text-black">#000000</span> / <span className="font-bold" style={{ color: "#FF6B35" }}>#FF6B35</span> / <span className="font-bold text-black">#FFFFFF</span>
      </div>
    </div>
  );
}
