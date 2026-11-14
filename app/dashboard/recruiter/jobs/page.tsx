"use client"

/**
 * Manage Jobs (Recruiter → Job Listings & Postings)
 *
 * STRUCTURE:
 *  - Page header with "+ New Job Post" action
 *  - Job table: title/dept, company/location, type, compensation,
 *    applicants, status, deadline, actions (Update / Delete / More)
 *
 * FLOW: fetches all jobs via getJobs() (backend GET /jobs) on mount.
 */

import { useEffect, useState } from "react"
import Link from "next/link"
import {
    Building2,
    Ellipsis,
    Eye,
    Globe,
    MapPin,
    Pencil,
    Plus,
    Trash2,
    Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { toast } from "@/components/ui/toast"
import { deleteJob, getJobs } from "@/lib/api/jobs"
import type { JobStatus, StoredJob } from "@/lib/types/jobs"

/** Full category → short dept label shown under the job title. */
const DEPT_LABELS: Record<string, string> = {
    "Engineering & Tech": "Engineering",
    "Design & Creative": "Design",
    "Product & Management": "Product",
    "Data & Analytics": "Data",
    "Marketing & Growth": "Marketing",
    "Customer Support": "Support",
}

const FREQ_LABELS: Record<string, string> = {
    "per hour": "hr",
    "per day": "day",
    "per month": "mo",
    "per year": "yr",
}

/** "2025-05-30" → "May 30, 2025" */
function formatDate(value?: string) {
    if (!value) return "—"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "—"
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

/** ISO createdAt → "Posted 2w ago" */
function postedAgo(createdAt?: string) {
    if (!createdAt) return null
    const posted = new Date(createdAt).getTime()
    if (Number.isNaN(posted)) return null
    const seconds = Math.max(0, Math.floor((Date.now() - posted) / 1000))
    const units: [number, string][] = [
        [60 * 60 * 24 * 7, "w"],
        [60 * 60 * 24, "d"],
        [60 * 60, "h"],
        [60, "m"],
    ]
    for (const [size, suffix] of units) {
        if (seconds >= size) return `Posted ${Math.floor(seconds / size)}${suffix} ago`
    }
    return "Posted just now"
}

function StatusBadge({ status }: { status: JobStatus }) {
    const active = status === "active"
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                active
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-white/10 bg-white/5 text-white/50"
            }`}
        >
            <span aria-hidden className={`size-1.5 rounded-full ${active ? "bg-emerald-400" : "bg-white/40"}`} />
            {active ? "Active" : status === "closed" ? "Expired" : "Draft"}
        </span>
    )
}

function TypePill({ type }: { type: string }) {
    return (
        <span className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70 capitalize">
            {type.replace("-", "-")}
        </span>
    )
}

export default function ManageJobsPage() {
    const [jobs, setJobs] = useState<StoredJob[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    // Job pending deletion (drives the confirm dialog).
    const [pendingDelete, setPendingDelete] = useState<StoredJob | null>(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        getJobs()
            .then(setJobs)
            .catch((err) => {
                console.error("getJobs failed:", err)
                setError(true)
            })
            .finally(() => setLoading(false))
    }, [])

    const stubAction = (name: string) =>
        toast.add({
            title: `${name} coming soon`,
            description: "This action will be wired to the backend shortly.",
        })

    const handleDelete = async () => {
        if (!pendingDelete) return
        setDeleting(true)
        try {
            await deleteJob(pendingDelete._id)
            setJobs((prev) => prev.filter((job) => job._id !== pendingDelete._id))
            toast.add({
                title: "Job deleted",
                description: `"${pendingDelete.title}" has been removed.`,
            })
            setPendingDelete(null)
        } catch (err) {
            console.error("deleteJob failed:", err)
            toast.add({
                title: "Job not deleted",
                description: "Something went wrong. Please try again.",
                variant: "error",
            })
        } finally {
            setDeleting(false)
        }
    }

    return (
        <PageContainer width="wide">
            <PageHeader
                overline="Manage Jobs › Job Listings &amp; Postings"
                title="Manage Job Posts"
                subtitle="Review live listings, monitor applicants, and update job details across your organization."
                action={
                    <Link href="/dashboard/recruiter/jobs/new">
                        <Button className="btn-brand">
                            <Plus aria-hidden />
                            New Job Post
                        </Button>
                    </Link>
                }
            />

            <div className="overflow-hidden rounded-xl border border-white/10 bg-card">
                {/* Table head */}
                <div className="grid grid-cols-[minmax(220px,1.4fr)_minmax(180px,1.2fr)_90px_minmax(130px,1fr)_130px_100px_minmax(130px,1fr)_170px] gap-4 border-b border-white/10 px-5 py-3 text-[11px] font-semibold tracking-wider text-white/40 uppercase">
                    <span>Job Title &amp; Dept</span>
                    <span>Company &amp; Location</span>
                    <span>Type</span>
                    <span>Compensation</span>
                    <span>Applicants</span>
                    <span>Status</span>
                    <span>Deadline</span>
                    <span className="text-right">Actions</span>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="px-5 py-10 text-sm text-white/50">Loading jobs…</div>
                ) : error ? (
                    <div className="px-5 py-10 text-sm text-red-400">
                        Failed to load jobs. Is the backend running?
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
                        <p className="text-sm text-white/60">No jobs posted yet.</p>
                        <Link href="/dashboard/recruiter/jobs/new">
                            <Button variant="outline" className="border-white/10 bg-white/5">
                                <Plus aria-hidden />
                                Post your first job
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <ul className="divide-y divide-white/5">
                        {jobs.map((job) => (
                            <li
                                key={job._id}
                                className="grid grid-cols-[minmax(220px,1.4fr)_minmax(180px,1.2fr)_90px_minmax(130px,1fr)_130px_100px_minmax(130px,1fr)_170px] items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.03]"
                            >
                                {/* Job title & dept */}
                                <div className="flex items-center gap-3">
                                    <span
                                        aria-hidden
                                        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#5C53FE]/15 text-[#a78bfa]"
                                    >
                                        <Building2 className="size-4" />
                                    </span>
                                    <div className="min-w-0">
                                        <Link
                                            href={`/dashboard/jobs/${job._id}`}
                                            className="block truncate text-sm font-medium text-white/90 hover:text-[#a78bfa] hover:underline"
                                        >
                                            {job.title}
                                        </Link>
                                        <p className="text-xs text-[#a78bfa]">{DEPT_LABELS[job.category] ?? job.category}</p>
                                    </div>
                                </div>

                                {/* Company & location */}
                                <div className="min-w-0">
                                    <p className="truncate text-sm text-white/90">{job.companyName}</p>
                                    <p className="flex items-center gap-1 truncate text-xs text-white/45">
                                        {job.isRemote ? (
                                            <>
                                                <Globe aria-hidden className="size-3 shrink-0" />
                                                Remote
                                            </>
                                        ) : (
                                            <>
                                                <MapPin aria-hidden className="size-3 shrink-0" />
                                                {job.location}
                                            </>
                                        )}
                                    </p>
                                </div>

                                {/* Type */}
                                <div>
                                    <TypePill type={job.jobType} />
                                </div>

                                {/* Compensation */}
                                <p className="text-sm text-white/80">
                                    €{job.minSalary} – €{job.maxSalary} / {FREQ_LABELS[job.salaryFrequency] ?? job.salaryFrequency}
                                </p>

                                {/* Applicants */}
                                <p className="flex items-center gap-1.5 text-sm text-white/80">
                                    <Users aria-hidden className="size-3.5 text-white/50" />
                                    {job.applicants} Candidates
                                </p>

                                {/* Status */}
                                <div>
                                    <StatusBadge status={job.status} />
                                </div>

                                {/* Deadline */}
                                <div>
                                    <p className="text-sm text-white/80">{formatDate(job.deadline)}</p>
                                    <p className="text-xs text-white/40">
                                        {job.status === "active" ? postedAgo(job.createdAt) ?? "—" : "Closed"}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-1.5">
                                    <Link
                                        href={`/dashboard/jobs/${job._id}`}
                                        aria-label={`View ${job.title}`}
                                        className="flex size-8 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-[#a78bfa]"
                                    >
                                        <Eye aria-hidden className="size-4" />
                                    </Link>
                                    <Link
                                        href={`/dashboard/recruiter/jobs/${job._id}/edit`}
                                        aria-label={`Edit ${job.title}`}
                                        className="flex h-8 items-center gap-1.5 rounded-md border border-[#5C53FE]/40 bg-[#5C53FE]/15 px-3 text-xs font-medium text-[#a78bfa] transition-colors hover:bg-[#5C53FE]/25"
                                    >
                                        <Pencil aria-hidden className="size-3.5" />
                                        Update
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label={`Delete ${job.title}`}
                                        onClick={() => setPendingDelete(job)}
                                        className="size-8 text-white/50 hover:bg-white/10 hover:text-red-400"
                                    >
                                        <Trash2 aria-hidden className="size-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label={`More actions for ${job.title}`}
                                        onClick={() => stubAction("More actions")}
                                        className="size-8 text-white/50 hover:bg-white/10"
                                    >
                                        <Ellipsis aria-hidden className="size-4" />
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => !open && setPendingDelete(null)}
                title="Delete this job?"
                description={
                    pendingDelete
                        ? `"${pendingDelete.title}" at ${pendingDelete.companyName} will be permanently removed from the database. This cannot be undone.`
                        : undefined
                }
                confirmLabel="Delete"
                loading={deleting}
                onConfirm={handleDelete}
            />
        </PageContainer>
    )
}
