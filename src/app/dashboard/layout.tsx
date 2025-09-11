"use client";

import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import ClientOnly from "@/components/ClientOnly";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ClientOnly
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <DashboardContent>{children}</DashboardContent>
    </ClientOnly>
  );
}

function DashboardContent({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, requireAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      requireAuth();
    }
  }, [isLoading, isAuthenticated, requireAuth]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect to login page
  }

  return (
    <div className="flex">
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <main className="w-full">
          <Navbar />
          <div className="px-4">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}

