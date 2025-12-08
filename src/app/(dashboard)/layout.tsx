
import { SidebarProvider } from "@/components/ui/sidebar";

import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { getQueryClient, trpc } from "@/trpc/server";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <div className="flex flex-col min-h-screen w-screen bg-muted">
        <DashboardNavbar />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
