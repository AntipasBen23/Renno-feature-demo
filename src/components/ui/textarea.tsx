import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[90px] w-full rounded-renno border-2 border-renno-black bg-white px-3 py-2 text-sm shadow-rennoSm outline-none focus:ring-2 focus:ring-renno-orange",
        className
      )}
      {...props}
    />
  );
}
