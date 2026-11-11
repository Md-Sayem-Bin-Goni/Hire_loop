"use client"

import {
    Bell,
    Bookmark,
    CalendarClock,
    FileText,
    Mail,
    TrendingUp,
} from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { getUserRole, ROLE_LABEL } from "@/lib/types/user"
import {
    ActivityItem,
    BarChart,
    DashboardSection,
    DonutChart,
    StatCard,
    WelcomeHeader,
} from "../_components"

const STATS = [
    { label: "Saved Jobs", value: 12, icon: Bookmark, accent: "bg-violet-500" },
    { label: "Applications Submitted", value: 34, icon: FileText, accent: "bg-cyan-500" },
    { label: "Interviews Scheduled", value: 3, icon: CalendarClock, accent: "bg-amber-500" },
    { label: "Offers Received", value: 1, icon: TrendingUp, accent: "bg-emerald-500" },
]

const STATUS_DISTRIBUTION = [
    { label: "Applied", value: 18 },
    { label: "Under Review", value: 9 },
    { label: "Shortlisted", value: 4 },
    { label: "Rejected", value: 2 },
    { label: "Offered", value: 1 },
]

export default function SeekerDashboardPage() {
    const { data: session, isPending } = useSession()
    const user = session?.user
    const role = getUserRole(user)
    const name = user?.name?.trim() || ROLE_LABEL[role]

    if (isPending) {
        return <div className="p-6 text-muted-foreground">Loading dashboard…</div>
    }

    return (
        <div className="space-y-6 p-4 md:p-6">
            <WelcomeHeader name={name} subtitle="Here's an overview of your job search activity." />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {STATS.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <DashboardSection title="Profile" className="lg:col-span-1">
                    <div className="flex items-center gap-3">
                        <span className="flex size-12 items-center justify-center rounded-full bg-violet-500/20 text-base font-semibold text-violet-400">
                            {name.slice(0, 2).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{name}</p>
                            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>
                    <a
                        href="/dashboard/seeker/settings"
                        className="mt-4 inline-block rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted"
                    >
                        Edit Profile
                    </a>
                </DashboardSection>

                <DashboardSection title="Application Status Distribution" className="lg:col-span-2">
                    <DonutChart data={STATUS_DISTRIBUTION} />
                </DashboardSection>
            </div>

            <DashboardSection title="Recent Activity" action={{ label: "View All Activity", href: "/dashboard/seeker/applications" }}>
                <ul className="space-y-2">
                    <ActivityItem
                        icon={FileText}
                        title="Application for Senior Product Designer at TechFlow updated to 'Under Review'"
                        time="2 hours ago"
                    />
                    <ActivityItem
                        icon={Bell}
                        iconColor="bg-amber-500"
                        title="New Job Alert: Lead Frontend Engineer at FinGrid matches your profile."
                        time="5 hours ago"
                    />
                    <ActivityItem
                        icon={Mail}
                        iconColor="bg-emerald-500"
                        title="Interview invitation from CloudPeak for the UI Engineer role."
                        time="Yesterday"
                    />
                </ul>
            </DashboardSection>

            <DashboardSection title="Applications This Week">
                <BarChart
                    data={[
                        { label: "Mon", value: 2 },
                        { label: "Tue", value: 5 },
                        { label: "Wed", value: 3 },
                        { label: "Thu", value: 6 },
                        { label: "Fri", value: 4 },
                        { label: "Sat", value: 1 },
                        { label: "Sun", value: 0 },
                    ]}
                />
            </DashboardSection>
        </div>
    )
}
