"use client";

import { useMemo, useState } from "react";
import { useRennoStore } from "@/store/rennoStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import MilestoneCard from "./MilestoneCard";
import { Badge } from "@/components/ui/badge";

export default function ProjectBoard() {
  const role = useRennoStore((s) => s.role);
  const projects = useRennoStore((s) => s.projects);
  const activeProjectId = useRennoStore((s) => s.activeProjectId);
  const setActiveProject = useRennoStore((s) => s.setActiveProject);

  const project = useMemo(
    () => projects.find((p) => p.id === activeProjectId) ?? projects[0],
    [projects, activeProjectId]
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Context</CardTitle>
          <CardDescription>Project and escrow context for the demo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-sm font-bold mb-1">Project</div>
            <Select
              value={project.id}
              onChange={setActiveProject}
              options={projects.map((p) => ({ value: p.id, label: p.name }))}
            />
          </div>

          <div className="rounded-renno border-2 border-black bg-renno-paper p-3 shadow-rennoSm">
            <div className="text-sm font-extrabold">{project.name}</div>
            <div className="mt-1 text-sm text-renno-muted">
              Homeowner: <span className="font-bold text-black">{project.homeownerName}</span>
            </div>
            <div className="text-sm text-renno-muted">
              Contractor: <span className="font-bold text-black">{project.contractorName}</span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs font-bold">Escrow Secured</div>
              <Badge variant="warning">€{project.escrowEUR.toLocaleString()}</Badge>
            </div>
          </div>

          <div className="text-xs text-renno-muted">
            Active role controls actions:
            <ul className="list-disc pl-5 mt-1">
              <li><b>Contractor</b>: upload evidence + submit</li>
              <li><b>Homeowner</b>: open disputes</li>
              <li><b>Ops</b>: manual approve if AI needs review</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-4">
        {project.milestones.map((m) => (
          <MilestoneCard key={m.id} projectId={project.id} milestoneId={m.id} />
        ))}
      </div>
    </div>
  );
}
