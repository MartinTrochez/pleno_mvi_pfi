"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import PlenoLogo from "@/components/brand/pleno-logo";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// Captura errores en componentes hijos (NO incluye html/body)
export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Error capturado:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted to-background px-6 py-16 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-destructive/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-destructive/10 blur-3xl" />

      <div className="flex flex-col items-center gap-6 text-center max-w-xl w-full">
        <div className="flex items-center gap-3">
          <PlenoLogo className="h-10 w-auto" />
          <span className="text-sm uppercase tracking-wider font-medium text-muted-foreground">
            Sistema
          </span>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-destructive to-destructive/60 drop-shadow-sm">
            ¡Oops!
          </h1>
          <h2 className="text-2xl font-semibold tracking-tight">
            Ha ocurrido un error
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Algo inesperado sucedió. Intenta reintentar la operación o vuelve más tarde.
          </p>
          
          {error?.message && (
            <pre className="mt-3 text-xs bg-muted/60 border rounded-md p-3 max-h-40 overflow-auto text-left w-full whitespace-pre-wrap">
              {error.message}
            </pre>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          <Button 
            variant="default" 
            size="lg" 
            onClick={() => reset()} 
            className="gap-2"
          >
            Reintentar
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/">Ir al Inicio</Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="gap-2">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>

        <div className="text-[11px] text-muted-foreground/80 mt-4">
          Código de referencia: {error?.digest ?? "N/A"}
        </div>
      </div>
    </main>
  );
}