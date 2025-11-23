import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import PlenoLogo from "@/components/brand/pleno-logo";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página que buscas no existe o fue movida",
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted to-background px-6 py-16 relative overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="flex flex-col items-center gap-6 text-center max-w-xl w-full">
        {/* Header con logo */}
        <div className="flex items-center gap-3">
          <PlenoLogo className="h-10 w-auto" />
        </div>

        {/* Contenido principal */}
        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 drop-shadow-sm">
            404
          </h1>
          <h2 className="text-2xl font-semibold tracking-tight">
            Página no encontrada
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            La ruta que estás intentando visitar no existe o fue movida. 
            Revisa la URL o vuelve al inicio.
          </p>
        </div>

        {/* Botones de navegación */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          <Button asChild variant="default" size="lg" className="gap-2">
            <Link href="/">Volver al Inicio</Link>
          </Button>
        </div>

        {/* Footer con ayuda */}
        <p className="text-[11px] text-muted-foreground/80 mt-4">
          Si crees que esto es un error, contacta al administrador.
        </p>
      </div>
    </main>
  );
}