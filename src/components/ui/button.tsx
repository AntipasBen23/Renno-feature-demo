import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold border-2 border-renno-black rounded-renno transition active:translate-x-[1px] active:translate-y-[1px]";
  const variants: Record<string, string> = {
    primary: "bg-renno-orange text-renno-white shadow-rennoSm hover:brightness-95",
    secondary: "bg-renno-white text-renno-black shadow-rennoSm hover:bg-renno-paper",
    ghost: "bg-transparent text-renno-black hover:bg-renno-white",
    danger: "bg-black text-white shadow-rennoSm hover:opacity-90",
  };
  const sizes: Record<string, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-5 text-base",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
