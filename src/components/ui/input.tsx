import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-renno border-2 border-renno-black bg-white px-3 text-sm shadow-rennoSm outline-none focus:ring-2 focus:ring-renno-orange",
        className
      )}
      {...props}
    />
  );
}
