import { cn } from "@/lib/utils";

export function Progress({ value, className }: { value: number; className?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-3 w-full rounded-full border-2 border-renno-black bg-white", className)}>
      <div
        className="h-full rounded-full bg-renno-orange"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
