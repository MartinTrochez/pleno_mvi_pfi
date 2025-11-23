"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PackageIcon,        
  RefreshCwIcon,      
  ShoppingCartIcon,   
  BarChart3Icon,      
  UsersIcon,          
  SettingsIcon,       
  UserIcon,           
  LogOutIcon          
} from 'lucide-react';

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { PlenoLogo } from "@/components/ui/pleno-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";


const firstSection = [
  {
    icon: PackageIcon,
    label: "Stock de Productos",
    href: "/stock-productos",
  },
  {
    icon: RefreshCwIcon,
    label: "Actualización de Stock",
    href: "/actualizacion-stock",
  },
  {
    icon: ShoppingCartIcon,
    label: "Carga de Ventas",
    href: "/carga-ventas",
  },
  {
    icon: BarChart3Icon,
    label: "Historial de Ventas",
    href: "/historial-ventas",
  },
  {
    icon: UsersIcon,
    label: "Usuarios",
    href: "/usuarios",
  },
];

const secondSection = [
  {
    icon: SettingsIcon,
    label: "Configuración",
    href: "/configuracion",
  },
  {
    icon: UserIcon,
    label: "Perfil",
    href: "/perfil",
  },
  {
    icon: LogOutIcon,
    label: "Salir",
    href: "/sign-in",
  }
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link href="/" aria-label="Inicio Pleno" className="flex justify-center">
          <PlenoLogo />
        </Link>
      </SidebarHeader>
      <div className="px-4 py-2">
        <Separator className="text-[#5D6B68]" />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 hover:bg-sidebar-accent/15 border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                      pathname === item.href && "bg-primary border-[#5D6B68]/10"
                    )}
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon className={cn("size-5",  
                          pathname === item.href && "text-white")}
                      />
                      <span className={cn("text-sm font-medium tracking-tight",
                          pathname === item.href && "text-white"
                      )}>
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="px-4 py-2">
          <Separator className="text-[#E0E0E0]" />
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 hover:bg-sidebar-accent/15 border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                      pathname === item.href && "bg-primary border-[#5D6B68]/10"
                    )}
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5" />
                      <span className={cn("text-sm font-medium tracking-tight",
                          pathname === item.href && "text-white"
                      )}>
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
