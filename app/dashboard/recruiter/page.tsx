"use client"

import {
    Bell,
    Briefcase,
    Building2,
    CheckCircle2,
    FileText,
    Users,
    XCircle,
} from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { getUserRole, ROLE_LABEL } from "@/lib/types/user"
import {
    ActivityItem,
    BarChart,
    DashboardSection,
    StatCard,
    WelcomeHeader,
} from "../_components"

const STATS = [
    { label: "Total Job Posts", value: 18, icon: Briefcase, accent: "bg-violet-500" },
    { label: "Total Applicants", value: "1,284", icon: Users, accent: "bg-cyan-500" },
    { label: "Active Jobs", value: 7, icon: CheckCircle2, accent: "bg-emerald-500" },
    { label: "Jobs Closed", value: 4, icon: XCircle, accent: "bg-rose-500" },
]

const APPLICANTS_PER_JOB = [
    { label: "Sr Designer", value: 142 },
    { label: "FE Eng", value: 96 },
    { label: "PM", value: 64 },
    { label: "Data Eng", value: 51 },
    { label: "QA", value: 38 },
]

export default function RecruiterDashboardPage() {
    const { data: session, isPending } = useSession()
    const user = session?.user
    const role = getUserRole(user)
    const name = user?.name?.trim() || ROLE_LABEL[role]

    if (isPending) {
        return <div className="p-6 text-muted-foreground">Loading dashboard…</div>
    }

    return (
        <div className="space-y-6 p-4 md:p-6">
            <WelcomeHeader name={name} subtitle="Here's how your job posts are performing." />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {STATS.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <DashboardSection title="Company" className="lg:col-span-1">
                    <div className="flex items-center gap-3">
                        <span className="flex size-12 items-center justify-center rounded-full bg-violet-500/20 text-violet-400">
                            <Building2 className="size-5" />
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">TechFlow Inc.</p>
                            <p className="truncate text-xs text-muted-foreground">Software Development</p>
                        </div>
                    </div>
                    <span className="mt-3 inline-block rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400">
                        Approved
                    </span>
                    <a
                        href="/dashboard/recruiter/company"
                        className="mt-4 block rounded-lg border border-border px-3 py-1.5 text-center text-sm hover:bg-muted"
                    >
                        Edit Company
                    </a>
                </DashboardSection>

                <DashboardSection title="Applicants per Job Post (Last 30 Days)" className="lg:col-span-2">
                    <BarChart data={APPLICANTS_PER_JOB} color="bg-cyan-500" />
                </DashboardSection>
            </div>

            <DashboardSection title="Recent Applications" action={{ label: "View All Applicants", href: "/dashboard/recruiter/applicants" }}>
                <ul className="space-y-2">
                    <ActivityItem
                        icon={FileText}
                        title="Jane Cooper applied for Senior Product Designer at TechFlow"
                        time="10 minutes ago"
                    />
                    <ActivityItem
                        icon={FileText}
                        title="Marcus Lee applied for Lead Frontend Engineer"
                        time="1 hour ago"
                    />
                    <ActivityItem
                        icon={Bell}
                        iconColor="bg-amber-500"
                        title="Your job post 'Product Manager' has 25 applicants — review pending."
                        time="3 hours ago"
                    />
                </ul>
            </DashboardSection>
        </div>
    )
}
