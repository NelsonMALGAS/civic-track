
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    ArrowRight,
    Menu,
    ShieldCheck,
    X,
} from "lucide-react";

import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navigation = [
    { label: "Home", href: "/" },
    { label: "How it works", href: "/how-it-works" },
    { label: "Municipalities", href: "/municipalities" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

const Header = () => {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <header className="sticky top-0 z-50 w-full px-4 pt-4 bg-card text-foreground">
            <div className="mx-auto flex h-19 max-w-7xl items-center justify-between gap-4">

                {/* Brand */}
                <Link
                    href="/"
                    className="group flex shrink-0 items-center gap-2.5"
                >
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
                        <ShieldCheck className="size-6" />
                    </div>

                    <div className="leading-none">
                        <span className="text-xl font-bold tracking-tight">
                            CivicTrack
                        </span>
                        <p className="mt-1 text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">
                            Community. Connected.
                        </p>
                    </div>
                </Link>

                {/* Desktop floating navigation */}
                <nav className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
                    <div className="flex items-center gap-1 rounded-full border border-border/60 bg-background/65 p-1.5 shadow-lg shadow-black/3 backdrop-blur-2xl supports-backdrop-filter:bg-background/55 dark:shadow-black/10">

                        {navigation.map((item) => {
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={active ? "page" : undefined}
                                    className={cn(
                                        "relative isolate rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-200",
                                        active
                                            ? "text-primary"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {active && (
                                        <motion.span
                                            layoutId="active-navigation"
                                            className="absolute inset-0 -z-10 rounded-full bg-primary/10"
                                            transition={{
                                                type: "spring",
                                                stiffness: 380,
                                                damping: 32,
                                            }}
                                        />
                                    )}

                                    <span className="relative z-10">
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}

                    </div>
                </nav>

                {/* Desktop actions */}
                <div className="hidden shrink-0 items-center gap-3 lg:flex">
                    <ModeToggle />

                    <Button
                        variant="outline"
                        asChild
                        className="rounded-md text-sm font-medium p-1"
                    >
                        <Link href="/auth">Sign in</Link>
                    </Button>

                    <Button
                        asChild
                        className="group rounded-md px-5 py-2 shadow-sm"
                    >
                        <Link href="/report">
                            Report an issue
                            <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>

                {/* Mobile actions */}
                <div className="flex items-center gap-2 lg:hidden">
                    <ModeToggle />

                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full border-border/60 bg-background/60 backdrop-blur-xl"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? (
                            <X className="size-5" />
                        ) : (
                            <Menu className="size-5" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile navigation */}
            <div
                className={cn(
                    "mx-auto grid max-w-7xl overflow-hidden transition-all duration-300 lg:hidden",
                    mobileMenuOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "pointer-events-none grid-rows-[0fr] opacity-0"
                )}
            >
                <div className="min-h-0">
                    <div className="mb-3 rounded-2xl border border-border/60 bg-background/80 p-3 shadow-xl shadow-black/4 backdrop-blur-2xl dark:shadow-black/20">
                        <nav className="flex flex-col gap-1">
                            {navigation.map((item) => {
                                const active = isActive(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        aria-current={active ? "page" : undefined}
                                        className={cn(
                                            "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                                            active
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border/60 pt-3">
                            <Button
                                variant="outline"
                                asChild
                                className="rounded-xl"
                            >
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign in
                                </Link>
                            </Button>

                            <Button
                                asChild
                                className="rounded-xl"
                            >
                                <Link
                                    href="/report"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Report an issue
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
