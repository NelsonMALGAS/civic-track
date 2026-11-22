
"use client";

import Link from "next/link";

import {
    Bell,
    Menu,
    UserRound,
    Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ModeToggle } from "@/components/ModeToggle";

interface ResidentsHeaderProps {
    onMenuClick: () => void;
}

const ResidentsHeader = ({
    onMenuClick,
}: ResidentsHeaderProps) => {
    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl sm:px-6">
            {/* Left section */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={onMenuClick}
                    aria-label="Open navigation"
                >
                    <Menu className="size-5" />
                </Button>

                <div>
                    <p className="text-sm font-semibold tracking-tight">
                        Resident Portal
                    </p>
                    <p className="hidden text-xs text-muted-foreground sm:block">
                        Your community, your voice.
                    </p>
                </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-2">
                <ModeToggle />

                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    asChild
                >
                    <Link
                        href="/resident/notifications"
                        aria-label="Notifications"
                    >
                        <Bell className="size-4.5" />
                    </Link>
                </Button>

                <div className="mx-1 hidden h-7 w-px bg-border sm:block" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-auto gap-2 px-2 py-1.5"
                        >
                            <Avatar className="size-8">
                                <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                                    R
                                </AvatarFallback>
                            </Avatar>

                            <div className="hidden text-left sm:block">
                                <p className="text-xs font-semibold">
                                    My Account
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                    Resident
                                </p>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-52"
                    >
                        <DropdownMenuLabel>
                            My Account
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                            <Link href="/resident/profile">
                                <UserRound className="mr-2 size-4" />
                                My Profile
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <Link href="/resident/profile">
                                <Settings className="mr-2 size-4" />
                                Account Settings
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                            <Link href="/resident/notifications">
                                <Bell className="mr-2 size-4" />
                                Notifications
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default ResidentsHeader;
