"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

/* ---------------- Stats row ---------------- */

export function StatCard({
    label,
    value,
    icon: Icon,
    accent,
}: {
    label: string
    value: string | number
    icon: LucideIcon
    accent?: string
}) {
    return (
        <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center gap-2">
                <span
                    className={cn(
                        "flex size-8 items-center justify-center rounded-lg text-white",
                        accent ?? "bg-violet-500",
                    )}
                >
                    <Icon className="size-4" />
                </span>
                <span className="text-sm text-muted-foreground">{label}</span>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
    )
}

/* ---------------- Charts (dependency-free SVG) ---------------- */

export function BarChart({
    data,
    height = 180,
    color = "bg-violet-500",
}: {
    data: { label: string; value: number }[]
    height?: number
    color?: string
}) {
    const max = Math.max(...data.map((d) => d.value), 1)
    return (
        <div className="flex items-end gap-2" style={{ height }}>
            {data.map((d) => (
                <div key={d.label} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">{d.value}</span>
                    <div
                        className={cn("w-full max-w-8 rounded-t-md", color)}
                        style={{ height: `${Math.max((d.value / max) * (height - 36), 4)}px` }}
                    />
                    <span className="w-full truncate text-center text-[10px] text-muted-foreground">{d.label}</span>
                </div>
            ))}
        </div>
    )
}

const DONUT_COLORS = ["#8b5cf6", "#22d3ee", "#f59e0b", "#ef4444", "#10b981"]

export function DonutChart({
    data,
    size = 160,
}: {
    data: { label: string; value: number }[]
    size?: number
}) {
    const total = data.reduce((sum, d) => sum + d.value, 0) || 1
    const radius = size / 2 - 10
    const circumference = 2 * Math.PI * radius
    const arcs = data.reduce<{ d: { label: string; value: number }; color: string; dash: number; offset: number }[]>(
        (acc, d) => {
            const prev = acc[acc.length - 1]
            const dash = (d.value / total) * circumference
            const offset = prev ? prev.offset + prev.dash : 0
            acc.push({ d, color: DONUT_COLORS[acc.length % DONUT_COLORS.length], dash, offset })
            return acc
        },
        [],
    )

    return (
        <div className="flex flex-wrap items-center gap-6">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
                <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
                    {arcs.map(({ d, color, dash, offset }) => (
                        <circle
                            key={d.label}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke={color}
                            strokeWidth={16}
                            strokeDasharray={`${dash} ${circumference - dash}`}
                            strokeDashoffset={-offset}
                            strokeLinecap="butt"
                        />
                    ))}
                </g>
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-foreground text-xl font-semibold"
                >
                    {total}
                </text>
            </svg>
            <ul className="space-y-1.5 text-sm">
                {data.map((d, i) => (
                    <li key={d.label} className="flex items-center gap-2">
                        <span
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
                        />
                        <span className="text-muted-foreground">{d.label}</span>
                        <span className="font-medium">{d.value}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

/* ---------------- Activity / list sections ---------------- */

export function DashboardSection({
    title,
    action,
    className,
    children,
}: {
    title: string
    action?: { label: string; href: string }
    className?: string
    children: React.ReactNode
}) {
    return (
        <section className={cn("rounded-xl border border-border/60 bg-card p-5", className)}>
            <header className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold">{title}</h3>
                {action ? (
                    <a href={action.href} className="text-sm text-muted-foreground hover:text-foreground">
                        {action.label}
                    </a>
                ) : null}
            </header>
            {children}
        </section>
    )
}

export function ActivityItem({
    title,
    time,
    icon: Icon,
    iconColor,
}: {
    title: string
    time: string
    icon: LucideIcon
    iconColor?: string
}) {
    return (
        <li className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
            <span
                className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg text-white",
                    iconColor ?? "bg-violet-500",
                )}
            >
                <Icon className="size-4" />
            </span>
            <div className="min-w-0">
                <p className="text-sm leading-snug">{title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{time}</p>
            </div>
        </li>
    )
}

export function PagePlaceholder({ title, role }: { title: string; role: string }) {
    return (
        <div className="p-4 md:p-6">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm capitalize text-muted-foreground">
                {role} dashboard section — coming soon.
            </p>
        </div>
    )
}

export function WelcomeHeader({ name, subtitle }: { name: string; subtitle: string }) {
    return (
        <div>
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
    )
}
