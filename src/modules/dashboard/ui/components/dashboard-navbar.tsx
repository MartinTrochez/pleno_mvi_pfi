"use client"

import { PanelLeftCloseIcon, PanelLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export const DashboardNavbar =() => {
  const { state, toggleSidebar, isMobile } = useSidebar();

  return (
    <nav className="grid grid-cols-3 items-center py-3 border-b bg-background">
      <div className="justify-self-start pl-2">
        <Button className="size-9" variant="outline" onClick={toggleSidebar}>
          {(state === "collapsed" || isMobile) 
            ?  <PanelLeftIcon className="size-4" /> 
            : <PanelLeftCloseIcon className="size-4" />
          }
        </Button>
      </div>
      <p className="text-center font-semibold text-2xl">Comercio Supermercado</p>
    </nav>
  )
}
