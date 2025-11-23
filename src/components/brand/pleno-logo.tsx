"use client";
import React from "react";
import styles from "./pleno-logo.module.css";
import { cn } from "@/lib/utils";

interface PlenoLogoProps {
  size?: "small" | "default" | "large";
  orientation?: "horizontal" | "vertical" | "iconOnly";
  className?: string;
  withText?: boolean;
  frameless?: boolean;
}

export const PlenoLogo: React.FC<PlenoLogoProps> = ({
  size = "small",
  orientation = "horizontal",
  className,
  withText,
  frameless = true,
}) => {
  const showText = withText ?? orientation !== "iconOnly";
  return (
    <div
      className={cn(
        styles.logo,
        styles[size],
        styles[orientation],
        frameless && styles.frameless,
        className
      )}
      aria-label="Pleno"
    >
      <div className={styles.logoIcon}>
        <div className={styles.iconBars}>
          <span className={cn(styles.bar, styles.bar1)} />
          <span className={cn(styles.bar, styles.bar2)} />
            <span className={cn(styles.bar, styles.bar3)} />
          <span className={cn(styles.bar, styles.bar4)} />
        </div>
      </div>
      {showText && <span className={styles.logoText}>Pleno</span>}
    </div>
  );
};

export default PlenoLogo;
