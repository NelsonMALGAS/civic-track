
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    PlusCircle,
    ClipboardList,
    Bell,
    UserRound,
    ShieldCheck,
    ChevronRight,
    LifeBuoy,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { SignOutButton } from "../SignOutButton";


interface ResidentsSidebarProps {
    onNavigate?: () => void;
}

const navigation = [
    {
        title: "Workspace",
        items: [
            {
                label: "Dashboard",
                href: "/resident",
                icon: LayoutDashboard,
            },
            {
                label: "Report an issue",
                href: "/resident/report",
                icon: PlusCircle,
            },
            {
                label: "My reports",
                href: "/resident/reports",
                icon: ClipboardList,
            },
        ],
    },
    {
        title: "Personal",
        items: [
            {
                label: "Notifications",
                href: "/resident/notifications",
                icon: Bell,
            },
            {
                label: "My profile",
                href: "/resident/profile",
                icon: UserRound,
            },
        ],
    },
];

const ResidentsSidebar = ({
    onNavigate,
}: ResidentsSidebarProps) => {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/resident") {
            return pathname === href;
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <div className="flex h-full w-full flex-col bg-background">
            {/* Brand */}
            <div className="flex h-16 shrink-0 items-center border-b border-border/60 px-5">
                <Link
                    href="/resident"
                    onClick={onNavigate}
                    className="group flex items-center gap-3"
                >
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
                        <ShieldCheck className="size-5" />
                    </div>

                    <div className="space-y-1">
                        <p className="text-lg font-bold leading-none tracking-tight">
                            CivicTrack
                        </p>
                        <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                            Resident Portal
                        </p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-6">
                {navigation.map((group) => (
                    <div key={group.title} className="space-y-2">
                        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {group.title}
                        </p>

                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onNavigate}
                                        aria-current={active ? "page" : undefined}
                                        className={cn(
                                            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                            active
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <Icon className="size-4.5 shrink-0" />

                                        <span className="flex-1">
                                            {item.label}
                                        </span>

                                        {active && (
                                            <ChevronRight className="size-4 opacity-70" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Support */}
            <div className="shrink-0 border-t border-border/60 p-4">
                <Link
                    href="/contact"
                    onClick={onNavigate}
                    className="mb-4 flex items-center gap-3 rounded-xl bg-muted/60 p-3 transition-colors hover:bg-muted"
                >
                    <div className="flex size-9 items-center justify-center rounded-lg bg-background">
                        <LifeBuoy className="size-4 text-muted-foreground" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold">
                            Need assistance?
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                            We&apos;re here to help.
                        </p>
                    </div>

                    <ChevronRight className="size-4 text-muted-foreground" />
                </Link>

                <SignOutButton />


            </div>
        </div>
    );
};

export default ResidentsSidebar;
