import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "danger" | "outline";
};

export function Badge({ className, variant = "default", ...props }: Props) {
  const base = "inline-flex items-center rounded-full border-2 px-2.5 py-0.5 text-xs font-bold";
  const variants: Record<string, string> = {
    default: "bg-renno-paper border-renno-black text-renno-black",
    success: "bg-white border-renno-black text-black",
    warning: "bg-renno-orange border-renno-black text-white",
    danger: "bg-black border-black text-white",
    outline: "bg-transparent border-renno-black text-renno-black",
  };
  return <span className={cn(base, variants[variant], className)} {...props} />;
}
