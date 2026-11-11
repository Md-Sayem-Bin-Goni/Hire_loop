"use client"

/**
 * Dashboard page scaffolding so every page looks consistent:
 *
 *   <PageContainer width="narrow">
 *     <PageHeader overline="Breadcrumb" title="..." subtitle="..." />
 *     <SectionCard index={1} title="...">...fields...</SectionCard>
 *   </PageContainer>
 */

import { cn } from "@/lib/utils"

/** Centers content and limits its width. width: "narrow" for forms, wide for tables. */
export function PageContainer({
    width = "wide",
    className,
    children,
}: {
    width?: "narrow" | "wide"
    className?: string
    children: React.ReactNode
}) {
    return (
        <div
            className={cn(
                "mx-auto p-4 md:p-6",
                width === "narrow" ? "max-w-3xl" : "w-full",
                className,
            )}
        >
            {children}
        </div>
    )
}

/** Breadcrumb-style overline + big title + optional subtitle. */
export function PageHeader({
    overline,
    title,
    subtitle,
    action,
}: {
    overline?: string
    title: string
    subtitle?: string
    action?: React.ReactNode
}) {
    return (
        <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
                {overline ? <p className="text-xs text-muted-foreground">{overline}</p> : null}
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
            </div>
            {action}
        </header>
    )
}

/** Numbered card section, e.g. "● 1. Basic Information". */
export function SectionCard({
    index,
    title,
    className,
    children,
}: {
    index?: number
    title: string
    className?: string
    children: React.ReactNode
}) {
    return (
        <section className={cn("rounded-xl border border-white/10 bg-card p-5", className)}>
            <h2 className="mb-5 flex items-center gap-2.5 text-sm font-semibold">
                <span aria-hidden className="size-2 rounded-full bg-[#8b5cf6]" />
                {typeof index === "number" ? `${index}. ` : ""}
                {title}
            </h2>
            {children}
        </section>
    )
}
