"use client";

import { useState, useTransition, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, Eye, EyeOff, LockKeyhole, X } from "lucide-react";

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
import { resetPasswordAction } from "@/app/server-actions";


export default function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const urlError = searchParams.get("error");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (urlError === "INVALID_TOKEN") {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setError("This reset link is invalid or has expired. Please request a new one.");
        }
    }, [urlError]);

    const hasMinLength = password.length >= 8;
    const passwordsMatch = password.length > 0 && password === confirmPassword;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!token) {
            setError("This reset link is missing a token. Please request a new one.");
            return;
        }

        startTransition(async () => {
            const result = await resetPasswordAction({
                token,
                password,
                confirmPassword,
            });

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/auth");
                }, 2000);
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
                        <CardTitle className="text-2xl">Create new password</CardTitle>
                        <CardDescription>
                            Enter a new password for your account.
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    {success ? (
                        <div className="rounded-md border border-green-400/30 bg-green-400/10 px-3 py-2 text-sm">
                            Your password has been reset. Redirecting you to sign in...
                        </div>
                    ) : !token ? (
                        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                            This reset link is invalid or missing a token. Please request a
                            new one from the{" "}
                            <Link href="/auth/forgot-password" className="underline">
                                forgot password
                            </Link>{" "}
                            page.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">New password</Label>
                                <div className="relative">
                                    <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isPending}
                                        required
                                        minLength={8}
                                        className="pl-9 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isPending}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm password</Label>
                                <div className="relative">
                                    <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={isPending}
                                        required
                                        minLength={8}
                                        className="pl-9 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={isPending}
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1 text-sm">
                                <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-green-600" : "text-muted-foreground"}`}>
                                    {hasMinLength ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                                    At least 8 characters
                                </div>
                                <div className={`flex items-center gap-1.5 ${passwordsMatch ? "text-green-600" : "text-muted-foreground"}`}>
                                    {passwordsMatch ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                                    Passwords match
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isPending || !hasMinLength || !passwordsMatch}
                                className="w-full"
                            >
                                {isPending ? "Resetting..." : "Reset password"}
                            </Button>
                        </form>
                    )}
                </CardContent>

                <CardFooter className="justify-center border-t pt-6">
                    <Link href="/auth" className="text-sm font-medium text-primary hover:underline">
                        Back to sign in
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}