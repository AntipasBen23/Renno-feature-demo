"use client";

import { useRennoStore } from "@/store/rennoStore";
import { Select } from "@/components/ui/select";
import type { Role } from "./types";

export default function RoleSwitcher() {
  const role = useRennoStore((s) => s.role);
  const setRole = useRennoStore((s) => s.setRole);

  return (
    <div className="min-w-[220px]">
      <Select
        value={role}
        onChange={(v) => setRole(v as Role)}
        options={[
          { value: "contractor", label: "Role: Contractor" },
          { value: "homeowner", label: "Role: Homeowner" },
          { value: "ops", label: "Role: Renno Ops" },
        ]}
      />
    </div>
  );
}
