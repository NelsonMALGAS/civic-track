
"use client"

import { Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormEvent, useState, useTransition } from "react"
import { signInAction, signUpAction, signInSocialRedirectAction } from "@/app/server-actions"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

type AuthMode = "login" | "signup"

interface AuthClientProps {
    mode?: AuthMode

}

type FormState = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function AuthClient({
    mode = "login",
}: AuthClientProps) {



    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [currentMode, setCurrentMode] = useState<"signup" | "login">(mode)
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState<FormState>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const router = useRouter();

    const isLogin = currentMode === "login"

    const handleSocialLogin = async (provider: "google" | "github") => {
        try {
            await signInSocialRedirectAction({ provider })
            toast.success("Login successful")
        } catch (error) {
            console.error(error)
        }
    }

    const onModeChange = (mode: "login" | "signup") => {
        setCurrentMode(mode)
    }

    const handleChange = (field: keyof FormState, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!isLogin) {
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords don't match");
                return;
            }

            if (formData.password.length < 8) {
                setError("Password too short");
                return;
            }
        }

        setLoading(true);

        startTransition(async () => {
            try {
                if (isLogin) {
                    const result = await signInAction({
                        email: formData.email,
                        password: formData.password,
                    });

                    if (result.success) {
                        toast.success("Login successful");
                        router.push("/");
                        router.refresh();
                    } else {
                        setError("Sign in failed");
                    }
                } else {
                    const result = await signUpAction({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        confirmPassword: formData.confirmPassword,
                    });

                    if (result.success) {
                        toast.success("Account created successfully");
                        router.push("/");
                        router.refresh();
                    } else {
                        setError("Sign up failed");
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setLoading(false);
            }
        });
    };

    const pending = loading || isPending


    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-3 text-center">
                {/* Logo */}
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <LockKeyhole className="size-6" />
                </div>

                <div className="space-y-1">
                    <CardTitle className="text-2xl">
                        {isLogin ? "Welcome back" : "Create an account"}
                    </CardTitle>

                    <CardDescription>
                        {isLogin
                            ? "Sign in to your account to continue."
                            : "Create your account to get started."}
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Social Login */}

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialLogin("google")}
                        disabled={loading}
                        className="w-full"
                    >
                        <GoogleIcon />
                        Continue with Google
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialLogin("github")}
                        disabled={loading}
                        className="w-full"
                    >
                        <GithubIcon />
                        Continue with GitHub
                    </Button>
                </div>

                {/* Divider */}

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>

                    <div className="relative flex justify-center">
                        <span className="bg-card px-3 text-xs uppercase text-muted-foreground">
                            Or continue with email
                        </span>
                    </div>
                </div>

                {/* Form */}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}

                    {!isLogin && (
                        <div className="space-y-2">
                            <Label htmlFor="name">Full name</Label>

                            <div className="relative">
                                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    autoComplete="name"
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    disabled={pending}
                                    required
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    )}

                    {/* Email */}

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
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                disabled={pending}
                                required
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Password */}

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>

                            {isLogin && (
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <div className="relative">
                            <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete={
                                    isLogin ? "current-password" : "new-password"
                                }
                                value={formData.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                                disabled={pending}
                                required
                                minLength={8}
                                className="pl-9 pr-10"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                                aria-label={
                                    showPassword ? "Hide password" : "Show password"
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </button>
                        </div>

                    </div>
                    {/* Confirm Password */}

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Confirm Password</Label>
                        </div>

                        <div className="relative">
                            <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                id="password"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete={
                                    isLogin ? "current-password" : "new-password"
                                }
                                value={formData.confirmPassword}
                                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                disabled={pending}
                                required
                                minLength={8}
                                className="pl-9 pr-10"
                            />

                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={loading}
                                aria-label={
                                    showConfirmPassword ? "Hide password" : "Show password"
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </button>
                        </div>

                    </div>

                    {/* Error */}

                    {error && (
                        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                            {error}
                        </div>
                    )}


                    {/* Submit */}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading
                            ? "Please wait..."
                            : isLogin
                                ? "Sign in"
                                : "Create account"}
                    </Button>
                </form>
            </CardContent>

            {/* Footer */}

            <CardFooter className="justify-center border-t pt-6">
                <p className="text-sm text-muted-foreground">
                    {isLogin
                        ? "Don't have an account?"
                        : "Already have an account?"}{" "}

                    <button
                        type="button"
                        onClick={() =>
                            onModeChange(isLogin ? "signup" : "login")
                        }
                        className="font-medium text-primary hover:underline"
                    >
                        {isLogin ? "Create one" : "Sign in"}
                    </button>
                </p>
            </CardFooter>
        </Card>
    )
}

/* -------------------------------------------------------------------------- */
/* Google Icon                                                                 */
/* -------------------------------------------------------------------------- */

function GoogleIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-4"
        >
            <path
                fill="#4285F4"
                d="M21.35 12.23c0-.78-.07-1.53-.22-2.25H12v4.26h5.22a4.46 4.46 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.93-4.18 2.93-7.38Z"
            />

            <path
                fill="#34A853"
                d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.52A9.74 9.74 0 0 0 12 21.5Z"
            />

            <path
                fill="#FBBC05"
                d="M6.53 13.59A5.86 5.86 0 0 1 6.22 12c0-.55.1-1.08.31-1.59V7.89H3.29A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.11l3.24-2.52Z"
            />

            <path
                fill="#EA4335"
                d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.48 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.71 5.39l3.24 2.52C7.3 8.1 9.46 6.38 12 6.38Z"
            />
        </svg>
    )
}

function GithubIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-4"
            fill="currentColor"
        >
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.49.5.092.682-.217.682-.483 0-.237-.009-.866-.014-1.7-2.782.604-3.369-1.342-3.369-1.342-.455-1.157-1.11-1.466-1.11-1.466-.908-.621.069-.608.069-.608 1.004.071 1.532 1.03 1.532 1.03.892 1.529 2.341 1.087 2.91.831.091-.646.35-1.087.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .268.18.579.688.481A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z" />
        </svg>
    )
}
