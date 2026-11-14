import { notFound } from "next/navigation"
import {
    BadgeCheck,
    Banknote,
    Briefcase,
    Building2,
    Check,
    CheckCircle2,
    MapPin,
    Sparkles,
} from "lucide-react"

import { getJob } from "@/lib/api/jobs"
import { type StoredJob } from "@/lib/types/jobs"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { JobActions, VisitWebsiteButton } from "./_components"

export default async function JobDetailsPage({params,}: {params: Promise<{ jobId: string }>}) {
    const { jobId } = await params

    let job: StoredJob
    try {
        job = await getJob(jobId)
    } catch {
        notFound()
    }

    return (
        <div className="flex min-h-svh flex-col bg-[#080808] text-white">
            <Navbar />

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-28 pb-16 sm:px-6">
                {/* Header card */}
                <section className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#121212] p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-white/5 text-xl font-bold text-[#a78bfa]">
                            {job.companyName.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{job.jobTitle}</h1>
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-white/60">
                                {job.companyName}
                                <span aria-hidden>•</span>
                                <span className="inline-flex items-center gap-1 text-emerald-400">
                                    <BadgeCheck className="size-4" />
                                    Verified Employer
                                </span>
                            </p>
                        </div>
                    </div>
                    <JobActions
                        jobId={job._id}
                        jobTitle={job.jobTitle}
                        companyName={job.companyName}
                    />
                </section>

                <div className="mt-6 flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_320px]">
                    {/* Left column */}
                    <div className="flex min-w-0 flex-col gap-6">
                        {/* Key facts */}
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <InfoTile icon={Banknote} label="Salary Range">
                                {formatRange(job)}
                            </InfoTile>
                            <InfoTile icon={MapPin} label="Location">
                                {job.isWorldwide ? "Remote" : job.jobLocation || "—"}
                            </InfoTile>
                            <InfoTile icon={Briefcase} label="Job Type">
                                {job.jobType || "—"}
                            </InfoTile>
                            <InfoTile icon={Sparkles} label="Experience">
                                {job.experienceLevel ?? "—"}
                            </InfoTile>
                        </div>

                        {/* Description */}
                        <section className="rounded-2xl border border-white/10 bg-[#121212] p-6">
                            <h2 className="text-lg font-semibold">Job Description</h2>
                            {job.description && (
                                <p className="mt-3 text-sm/relaxed text-white/60">{job.description}</p>
                            )}

                            <Bullets title="Responsibilities" text={job.responsibilities} />
                            <Bullets
                                title="Requirements"
                                text={job.requirements}
                                skills={job.skills}
                            />
                        </section>

                        {/* Benefits */}
                        {toListItems(job.benefits).length > 0 && (
                            <section className="rounded-2xl border border-white/10 bg-[#121212] p-6">
                                <h2 className="text-lg font-semibold">Benefits</h2>
                                <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                                    {toListItems(job.benefits).map((benefit) => (
                                        <li
                                            key={benefit}
                                            className="flex items-center gap-2.5 text-sm text-white/80"
                                        >
                                            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/5 text-white/60">
                                                <Check className="size-4" />
                                            </span>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>

                    {/* Right column — company overview */}
                    <aside className="h-fit rounded-2xl border border-white/10 bg-[#121212] p-5 lg:sticky lg:top-24">
                        <h2 className="text-lg font-semibold">Company Overview</h2>

                        <div className="mt-4 grid h-40 place-items-center rounded-xl bg-gradient-to-br from-[#5C53FE]/25 to-white/5">
                            <Building2 className="size-10 text-white/25" />
                        </div>

                        <dl className="mt-4 flex flex-col divide-y divide-white/5">
                            <OverviewRow label="Industry" value={job.jobCategory || "—"} />
                            <OverviewRow
                                label="Location"
                                value={job.isWorldwide ? "Worldwide / Remote" : job.jobLocation || "—"}
                            />
                            <OverviewRow label="Job Type" value={job.jobType || "—"} />
                        </dl>

                        <div className="mt-5">
                            <VisitWebsiteButton companyName={job.companyName} />
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    )
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function InfoTile({
    icon: Icon,
    label,
    children,
}: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    children: React.ReactNode
}) {
    return (
        <div className="rounded-xl border border-white/10 bg-[#121212] p-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-white/40 uppercase">
                <Icon className="size-3.5" />
                {label}
            </div>
            <p className="mt-2 truncate text-sm font-medium text-white">{children}</p>
        </div>
    )
}

function Bullets({
    title,
    text,
    skills,
}: {
    title: string
    text?: string
    skills?: string
}) {
    const items = toListItems(text)
    if (items.length === 0 && !skills) return null

    return (
        <div className="mt-6 border-t border-white/5 pt-5">
            <h3 className="text-base font-semibold">{title}</h3>

            {skills && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {toListItems(skills.replace(/,/g, "\n")).map((skill) => (
                        <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                        >
                            <CheckCircle2 className="size-3 text-white/40" />
                            {skill}
                        </span>
                    ))}
                </div>
            )}

            {items.length > 0 && (
                <ul className="mt-3 flex flex-col gap-2.5">
                    {items.map((item, index) => (
                        <li key={index} className="flex gap-2.5 text-sm/relaxed text-white/60">
                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-white/30" aria-hidden />
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

function OverviewRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-xs font-semibold tracking-wider text-white/40 uppercase">{label}</dt>
            <dd className="truncate text-sm text-white/90">{value}</dd>
        </div>
    )
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** "140000" → "$140k"; numbers/strings, empty → null. */
function formatSalary(value: string | number | undefined) {
    const amount = Number(value)
    if (!amount) return null
    return amount >= 1000 ? `$${Math.round(amount / 1000)}k` : `$${amount}`
}

function formatRange(job: StoredJob) {
    const min = formatSalary(job.minSalary)
    const max = formatSalary(job.maxSalary)
    if (!min && !max) return "—"
    return [min, max].filter(Boolean).join(" - ")
}

/** Splits a textarea-style field into clean bullet items ("• foo\n• bar"). */
function toListItems(text?: string) {
    return (text ?? "")
        .split("\n")
        .map((line) => line.replace(/^[•\-*]\s*/, "").trim())
        .filter(Boolean)
}
