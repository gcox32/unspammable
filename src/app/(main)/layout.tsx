"use client"

import Navigation from "@/src/components/Navigation";
import Footer from "@/src/components/Footer";
import { SidebarProvider, useSidebar } from "@/src/contexts/SidebarContext";

function MainContent({ children }: { children: React.ReactNode }) {
    const { isExpanded } = useSidebar();

    return (
        <div className={`app-container ${isExpanded ? 'sidebar-expanded' : ''}`}>
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