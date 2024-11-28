"use client"

import Navigation from "@/src/components/layout/Navigation";
import Footer from "@/src/components/layout/Footer";
import { SidebarProvider, useSidebar } from "@/src/contexts/SidebarContext";
import { useAuthenticator } from "@aws-amplify/ui-react";

function MainContent({ children }: { children: React.ReactNode }) {
    const { isExpanded } = useSidebar();
    const { user } = useAuthenticator((context) => [context.user]);

    return (
        <div className={`app-container ${isExpanded ? 'sidebar-expanded' : ''} ${!user ? 'no-sidebar' : ''}`}>
            <Navigation />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <MainContent>
                {children}
            </MainContent>
        </SidebarProvider>
    );
} 