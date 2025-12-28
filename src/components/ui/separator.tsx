import { cn } from "@/lib/utils";

export function Separator({ className }: { className?: string }) {
  return <div className={cn("h-[2px] w-full bg-renno-black/10", className)} />;
}
