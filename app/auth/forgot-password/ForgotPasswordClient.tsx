"use client";

import { useState, useTransition, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, LockKeyhole, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordAction } from "@/app/server-actions";


export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        startTransition(async () => {
            const result = await forgotPasswordAction({ email });

            if (result.success) {
                setSuccess(
                    result.message ??
                    "If an account exists with that email address, we've sent a password reset link."
                );
            } else {
                setError(result.message);
            }
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-3 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <LockKeyhole className="size-6" />
                    </div>

                    <div className="space-y-1">
                        <CardTitle className="text-2xl">Forgot your password?</CardTitle>
                        <CardDescription>
                            Enter your email and we&apos;ll send you a password reset link.
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    {success ? (
                        <div className="rounded-md border border-green-400/30 bg-green-400/10 px-3 py-2 text-sm">
                            {success}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isPending}
                                        required
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" disabled={isPending} className="w-full">
                                {isPending ? "Sending..." : "Send reset link"}
                            </Button>
                        </form>
                    )}
                </CardContent>

                <CardFooter className="justify-center border-t pt-6">
                    <Link
                        href="/auth"
                        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                        <ArrowLeft className="size-4" />
                        Back to sign in
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}