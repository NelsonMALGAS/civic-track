
import type { Metadata } from "next";

import ResidentShell from "@/components/resident/resident-shell";

export const metadata: Metadata = {
    title: {
        default: "Resident Portal | CivicTrack",
        template: "%s | CivicTrack",
    },
    description:
        "Access your CivicTrack resident portal to report municipal issues, track service requests and stay updated on community service delivery.",
};

interface ResidentsLayoutProps {
    children: React.ReactNode;
}

export default function ResidentsLayout({
    children,
}: ResidentsLayoutProps) {
    return (
        <ResidentShell>
            {children}
        </ResidentShell>
    );
}
