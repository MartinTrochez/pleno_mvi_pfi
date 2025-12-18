"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useSidebarShortcuts(routes: string[]) {
  const router = useRouter();

  const isMac = navigator.userAgent.toLowerCase().includes("mac");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      for (let i = 0; i < routes.length; i++) {
        const keyNumber = (i + 1).toString();

        const pressed =
          isMac
            ? e.altKey && e.key === keyNumber
            : e.altKey && e.key === keyNumber;

        if (pressed) {
          e.preventDefault();
          router.push(routes[i]);
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [routes, router, isMac]);
}
