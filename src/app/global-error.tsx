"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import PlenoLogo from "@/components/brand/pleno-logo";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// IMPORTANTE: global-error.tsx debe incluir <html> y <body>
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Error global capturado:", error);
  }, [error]);

  return (
    <html lang="es">
      <body>
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 px-6 py-16 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />

          <div className="flex flex-col items-center gap-6 text-center max-w-xl w-full">
            <div className="flex items-center gap-3">
              <PlenoLogo className="h-10 w-auto" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400 drop-shadow-sm">
                500
              </h1>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Error Crítico del Servidor
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ha ocurrido un error crítico. Por favor, intenta recargar la página o contacta al soporte técnico.
              </p>
              
              {error?.message && (
                <pre className="mt-3 text-xs bg-slate-200/60 border border-slate-300 rounded-md p-3 max-h-40 overflow-auto text-left w-full whitespace-pre-wrap text-slate-800">
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
            </div>

            <div className="text-[11px] text-slate-500 mt-4">
              Código de referencia: {error?.digest ?? "N/A"}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}