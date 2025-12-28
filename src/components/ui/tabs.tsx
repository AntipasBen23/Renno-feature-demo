"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Tab = { key: string; label: string };

export function Tabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: Tab[];
  value: string;
  onChange: (key: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={cn(
            "h-10 px-4 rounded-renno border-2 border-renno-black font-extrabold shadow-rennoSm transition active:translate-x-[1px] active:translate-y-[1px]",
            value === t.key ? "bg-renno-orange text-white" : "bg-white text-black"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
