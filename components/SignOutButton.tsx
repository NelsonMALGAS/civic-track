"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { signOutAction } from "@/app/server-actions";
import { Button } from "./ui/button";

export function SignOutButton() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleSignOut = () => {
        startTransition(async () => {
            const result = await signOutAction();

            if (result.success) {
                router.push("/auth");
                router.refresh();
            } else {
                console.error("Sign out failed:", result.message);
            }
        });
    };

    return (
        <Button
            onClick={handleSignOut}
            disabled={isPending}
            className={[
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                "text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50",
            ].join(" ")}
        >
            <span className="[&_svg]:size-4">
                <LogOut />
            </span>
            {isPending && (
                <span className="inline-block size-4 animate-spin rounded-full border-2 border-muted-foreground/25 border-t-primary" />
            )}
        </Button>
    );
}