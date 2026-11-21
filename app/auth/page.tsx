
import AuthClient from "@/components/AuthClient";
import {
    ArrowUpRight,
    CheckCircle2,
    ClipboardList,
    MapPin,
    ShieldCheck,
    Activity,
    Landmark,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CivicTrack | Sign In",
    description:
        "Report, manage, and track community service delivery issues with CivicTrack.",
};

const AuthPage = () => {
    return (
        <main className="relative min-h-screen overflow-hidden bg-background text-foreground">

            {/* Background decoration */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-40 -top-40 size-137.5 rounded-full bg-primary/10 blur-[120px]" />

                <div className="absolute -bottom-40 -right-40 size-137.5 rounded-full bg-primary/10 blur-[120px]" />

                {/* Subtle grid */}
                <div
                    className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />

                {/* Decorative circles */}
                <div className="absolute right-[20%] top-[15%] size-72 rounded-full border border-primary/10" />

                <div className="absolute right-[22%] top-[18%] size-56 rounded-full border border-primary/10" />
            </div>

            <div className="relative mx-auto flex min-h-screen max-w-[1600px]">

                {/* LEFT PANEL */}
                <section className="relative hidden flex-1 flex-col justify-between p-12 lg:flex xl:p-16">

                    {/* Brand */}
                    <Brand />

                    {/* Hero */}
                    <div className="max-w-2xl">

                        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-2 text-xs font-medium text-primary">
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-50" />
                                <span className="relative inline-flex size-2 rounded-full bg-primary" />
                            </span>

                            A smarter approach to local governance
                        </div>

                        <h1 className="text-5xl font-bold leading-[1.12] tracking-tight xl:text-6xl">
                            Your community.
                            <br />
                            Your voice.
                            <br />
                            <span className="text-primary">
                                Real change.
                            </span>
                        </h1>

                        <p className="mt-7 max-w-lg text-base leading-8 text-muted-foreground xl:text-lg">
                            CivicTrack connects residents and municipalities
                            through a transparent platform for reporting,
                            managing, and resolving community service delivery
                            issues.
                        </p>

                        {/* Features */}
                        <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-2">

                            <Feature
                                icon={<MapPin />}
                                title="Location-based reporting"
                                description="Report issues from exactly where they happen."
                            />

                            <Feature
                                icon={<Activity />}
                                title="Real-time tracking"
                                description="Follow every report from submission to resolution."
                            />

                            <Feature
                                icon={<ClipboardList />}
                                title="Accountable management"
                                description="Keep requests organised and track progress."
                            />

                            <Feature
                                icon={<ShieldCheck />}
                                title="Transparent service"
                                description="Promote accountability in local governance."
                            />

                        </div>

                        {/* Bottom statement */}
                        <div className="mt-10 flex items-center gap-4 border-t border-border pt-7">

                            <div className="flex -space-x-2">
                                <div className="flex size-9 items-center justify-center rounded-full border-2 border-background bg-primary/10 text-primary">
                                    <Landmark className="size-4" />
                                </div>

                                <div className="flex size-9 items-center justify-center rounded-full border-2 border-background bg-muted text-muted-foreground">
                                    <MapPin className="size-4" />
                                </div>

                                <div className="flex size-9 items-center justify-center rounded-full border-2 border-background bg-primary/10 text-primary">
                                    <CheckCircle2 className="size-4" />
                                </div>
                            </div>

                            <p className="text-xs leading-5 text-muted-foreground">
                                <span className="font-semibold text-foreground">
                                    Better communities start with action.
                                </span>
                                <br />
                                One report at a time.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <p>
                            © 2026 CivicTrack. All rights reserved.
                        </p>

                        <p>Built for better communities.</p>
                    </div>
                </section>

                {/* RIGHT PANEL */}
                <section className="flex w-full items-center justify-center border-border px-5 py-10 sm:px-10 lg:w-130 lg:flex-none lg:border-l lg:bg-muted/30 lg:px-12 xl:w-140">

                    <div className="w-full max-w-md">

                        {/* Mobile branding */}
                        <div className="mb-10 lg:hidden">
                            <Brand />
                        </div>

                        {/* Auth heading */}
                        <div className="mb-8">

                            <div className="mb-5 flex size-12 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
                                <ShieldCheck className="size-6 text-primary" />
                            </div>

                            <h2 className="text-3xl font-bold tracking-tight">
                                Welcome
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                Sign in to your CivicTrack account and
                                continue making a difference in your community.
                            </p>
                        </div>

                        {/* Authentication */}
                        <AuthClient />

                        {/* Security notice */}
                        <div className="mt-7 flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />

                            <div>
                                <p className="text-xs font-semibold">
                                    Your account is secure
                                </p>

                                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                    CivicTrack takes the protection of your
                                    personal information seriously.
                                </p>
                            </div>
                        </div>

                        {/* Legal */}
                        <div className="mt-8 text-center">
                            <p className="text-xs leading-6 text-muted-foreground">
                                By continuing, you agree to our{" "}
                                <a
                                    href="/terms"
                                    className="font-medium text-primary hover:underline"
                                >
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a
                                    href="/privacy"
                                    className="font-medium text-primary hover:underline"
                                >
                                    Privacy Policy
                                </a>.
                            </p>

                            <div className="mt-7 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                                <span>Powered by</span>

                                <span className="font-semibold text-foreground">
                                    CivicTrack
                                </span>

                                <ArrowUpRight className="size-3" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

/* Brand component */
function Brand() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                <MapPin className="size-6" strokeWidth={2.5} />
            </div>

            <div>
                <h2 className="text-xl font-bold tracking-tight">
                    Civic<span className="text-primary">Track</span>
                </h2>

                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Community. Accountability. Action.
                </p>
            </div>
        </div>
    );
}

/* Feature component */
interface FeatureProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

function Feature({
    icon,
    title,
    description,
}: FeatureProps) {
    return (
        <div className="group flex gap-3 rounded-xl border border-border/70 bg-card/60 p-4 transition-all duration-200 hover:border-primary/30 hover:bg-accent/50">

            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="[&_svg]:size-4.5">
                    {icon}
                </span>
            </div>

            <div>
                <h3 className="text-sm font-semibold">
                    {title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default AuthPage;
