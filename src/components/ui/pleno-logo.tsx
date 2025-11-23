"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface PlenoLogoProps {
  className?: string;
}

export const PlenoLogo: React.FC<PlenoLogoProps> = ({ className }) => {
  const base = "[--pleno-primary:var(--sidebar-accent,oklch(0.6299_0.1983_263.75))]";
  return (
    <div
      aria-label="Pleno"
      className={cn(
        base,
        "group flex items-center gap-[10px] p-1 select-none transition-transform duration-200 hover:-translate-y-[1px]",
        className
      )}
    >
      <div className="relative w-[38px] h-[38px]">
        <div className="absolute inset-0">
          <span className="absolute block rounded-sm bg-[var(--pleno-primary)] w-[24px] h-[3px] top-[6px] left-[7px] transition-transform duration-300 group-hover:translate-x-[2px]" />
          <span className="absolute block rounded-sm bg-[var(--pleno-primary)] w-[20px] h-[3px] top-[14px] left-[9px] transition-transform duration-300 group-hover:-translate-x-[2px]" />
          <span className="absolute block rounded-sm bg-[var(--pleno-primary)] w-[30px] h-[4px] top-[22px] left-[5px] transition-transform duration-300 group-hover:translate-x-[2px]" />
          <span className="absolute block rounded-sm bg-[var(--pleno-primary)] w-[16px] h-[3px] top-[30px] left-[11px] transition-transform duration-300 group-hover:translate-x-[3px]" />
        </div>
      </div>
  <span className="font-semibold text-[28px] leading-none tracking-[-0.5px] text-[var(--pleno-primary)] font-sans whitespace-nowrap">Pleno</span>
    </div>
  );
};

export default PlenoLogo;
