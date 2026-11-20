import AuthClient from "@/components/AuthClient"
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ResolveDesk | Auth Page",
    description: "Customer Support, Simplified",
};

const AuthPage = () => {
    return (
        <main className="relative min-h-screen overflow-hidden bg-background">
            {/* Background decoration */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />
            </div>

            <div className="relative mx-auto flex min-h-screen max-w-7xl">
                {/* Left side */}
                <section className="hidden flex-1 flex-col justify-between p-10 lg:flex xl:p-16">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                                <Zap className="size-5 fill-current" />
                            </div>

                            <span className="text-xl font-bold tracking-tight">
                                Resolve<span className="text-primary">Desk</span>
                            </span>
                        </div>
                    </div>

                    {/* Hero */}
                    <div className="max-w-xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur">
                            <span className="size-2 rounded-full bg-emerald-500" />
                            Modern customer support platform
                        </div>

                        <h1 className="text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
                            Resolve customer issues
                            <span className="block text-primary">
                                faster.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
                            Manage your support tickets, collaborate with your team,
                            and deliver exceptional customer experiences from one
                            powerful workspace.
                        </p>

                        {/* Features */}
                        <div className="mt-10 space-y-4">
                            <Feature
                                icon={<CheckCircle2 />}
                                title="Centralized support"
                                description="Keep every customer conversation in one place."
                            />

                            <Feature
                                icon={<ShieldCheck />}
                                title="Secure by design"
                                description="Your organization and customer data stay protected."
                            />

                            <Feature
                                icon={<Zap />}
                                title="Built for speed"
                                description="Give your support team the tools to resolve issues faster."
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-sm text-muted-foreground">
                        © 2026 ResolveDesk. All rights reserved.
                    </p>
                </section>

                {/* Right side */}
                <section className="flex w-full items-center justify-center px-6 py-12 lg:w-130 lg:border-l lg:bg-muted/20 xl:w-140">
                    <div className="w-full max-w-md">
                        {/* Mobile branding */}
                        <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                                <Zap className="size-5 fill-current" />
                            </div>

                            <span className="text-xl font-bold tracking-tight">
                                Resolve<span className="text-primary">Desk</span>
                            </span>
                        </div>

                        <AuthClient />

                        <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
                            <ShieldCheck className="size-3.5" />
                            <span>
                                Your information is protected and securely encrypted.
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}

interface FeatureProps {
    icon: React.ReactNode
    title: string
    description: string
}

function Feature({
    icon,
    title,
    description,
}: FeatureProps) {
    return (
        <div className="flex gap-4">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background shadow-sm">
                <span className="text-primary [&_svg]:size-4">
                    {icon}
                </span>
            </div>

            <div>
                <h3 className="font-medium">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default AuthPage