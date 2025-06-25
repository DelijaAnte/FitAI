"use client";

import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "./context/auth-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="overflow-x-hidden">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LayoutWrapper>{children}</LayoutWrapper>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full relative">
        {user && <AppSidebar className="flex-shrink-0" />}

        {user && (
          <div
            className="fixed left-2 z-50 flex flex-col items-center"
            style={{ top: "40vh" }}
          >
            <SidebarTrigger />
            {/* <div className="mt-4">
              <ModeToggle />
            </div> */}
          </div>
        )}

        <main className="flex-1 flex flex-col min-h-screen">
          <div className="w-full" data-layout="full-width">
            {children}
          </div>

          <div
            className="flex-1 flex items-center justify-center p-4 hidden"
            data-layout="centered"
          >
            <div className="w-full max-w-4xl mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
