"use client"

import {
    Briefcase,
    Building2,
    DollarSign,
    ShieldCheck,
    Users,
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
    { label: "Total Users", value: "6,420", icon: Users, accent: "bg-violet-500" },
    { label: "Total Recruiters", value: 312, icon: Building2, accent: "bg-cyan-500" },
    { label: "Total Companies", value: 187, icon: ShieldCheck, accent: "bg-emerald-500" },
    { label: "Total Jobs Posted", value: "1,043", icon: Briefcase, accent: "bg-amber-500" },
    { label: "Platform Revenue", value: "$48,290", icon: DollarSign, accent: "bg-rose-500" },
]

const JOBS_PER_CATEGORY = [
    { label: "Design", value: 214 },
    { label: "Engineering", value: 386 },
    { label: "Product", value: 152 },
    { label: "Data", value: 121 },
    { label: "Marketing", value: 98 },
    { label: "Support", value: 72 },
]

const NEW_USERS_PER_DAY = [
    { label: "W1", value: 42 },
    { label: "W2", value: 65 },
    { label: "W3", value: 58 },
    { label: "W4", value: 84 },
    { label: "W5", value: 96 },
    { label: "W6", value: 121 },
]

export default function AdminDashboardPage() {
    const { data: session, isPending } = useSession()
    const user = session?.user
    const role = getUserRole(user)
    const name = user?.name?.trim() || ROLE_LABEL[role]

    if (isPending) {
        return <div className="p-6 text-muted-foreground">Loading dashboard…</div>
    }

    return (
        <div className="space-y-6 p-4 md:p-6">
            <WelcomeHeader name={name} subtitle="Platform-wide overview of users, jobs, and revenue." />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {STATS.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <DashboardSection title="Job Posts per Category">
                    <BarChart data={JOBS_PER_CATEGORY} color="bg-violet-500" />
                </DashboardSection>
                <DashboardSection title="New User Registrations (Weekly)">
                    <BarChart data={NEW_USERS_PER_DAY} color="bg-cyan-500" />
                </DashboardSection>
            </div>

            <DashboardSection title="Recent Subscription Transactions" action={{ label: "View All Payments", href: "/dashboard/admin/payments" }}>
                <ul className="space-y-2">
                    <ActivityItem
                        icon={DollarSign}
                        iconColor="bg-emerald-500"
                        title="Premium plan subscription — e.lopez@globalfoundries.com ($39.00 · Enterprise)"
                        time="May 10, 2026 · 9 days ago"
                    />
                    <ActivityItem
                        icon={DollarSign}
                        iconColor="bg-emerald-500"
                        title="Growth plan subscription — a.sterling@techflow.io ($49.00)"
                        time="May 9, 2026 · 10 days ago"
                    />
                    <ActivityItem
                        icon={DollarSign}
                        iconColor="bg-rose-500"
                        title="Failed payment retry — m.chen@cloudpeak.com ($19.00 · Pro)"
                        time="May 8, 2026 · 11 days ago"
                    />
                </ul>
            </DashboardSection>
        </div>
    )
}
