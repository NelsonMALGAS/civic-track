
"use client";

import { useState } from "react";

import ResidentsSidebar from "./ResidentsSidebar";
import ResidentsHeader from "./ResidentsHeader";

import {
    Sheet,
    SheetContent,
    SheetTitle,
} from "@/components/ui/sheet";

interface ResidentsShellProps {
    children: React.ReactNode;
}

const ResidentsShell = ({ children }: ResidentsShellProps) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <div className="min-h-svh bg-muted/30">
            {/* Desktop Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-65 border-r bg-background md:flex">
                <ResidentsSidebar />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet
                open={mobileMenuOpen}
                onOpenChange={setMobileMenuOpen}
            >
                <SheetContent
                    side="left"
                    className="w-70 border-r border-border/60 p-0"
                >
                    <SheetTitle className="sr-only">
                        Residents navigation
                    </SheetTitle>

                    <ResidentsSidebar onNavigate={closeMobileMenu} />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className="flex min-h-svh flex-col md:pl-65">
                <ResidentsHeader
                    onMenuClick={() => setMobileMenuOpen(true)}
                />

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto w-full max-w-[1600px]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ResidentsShell;
