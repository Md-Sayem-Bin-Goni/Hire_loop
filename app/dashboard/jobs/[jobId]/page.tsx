"use client"

/**
 * Job Details (recruiter → view a single job posting)
 *
 * Fetches the job by id from the backend (GET /jobs/:id) and renders
 * every field: basic info, location/compensation, responsibilities
 * and requirements.
 */

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
    Building2,
    Calendar,
    Globe,
    MapPin,
    Users,
} from "lucide-react"

import { PageContainer, PageHeader, SectionCard } from "@/components/dashboard/page-shell"
import { Field } from "@/components/shared/field"
import { PillGroup } from "@/components/shared/pill-group"
import { getJob } from "@/lib/api/jobs"
import type { StoredJob } from "@/lib/types/jobs"

/** Plain read-only text styled like an input. */
function DetailBox({ value }: { value?: string | number }) {
    return (
        <div className="surface-field flex items-center overflow-auto whitespace-pre-wrap">
            {value === undefined || value === "" ? "—" : value}
        </div>
    )
}

export default function JobDetailPage() {
    const { jobId } = useParams<{ jobId: string }>()
    const [job, setJob] = useState<StoredJob | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        getJob(jobId)
            .then(setJob)
            .catch((err) => {
                console.error("getJob failed:", err)
                setError(true)
            })
            .finally(() => setLoading(false))
    }, [jobId])

    return (
        <PageContainer width="narrow">
            <PageHeader
                overline="Manage Jobs › Job Details"
                title={loading ? "Loading…" : (job?.title ?? error ? "Job not found" : "")}
                subtitle={
                    error
                        ? "The job could not be loaded. Is the backend running?"
                        : "Full posting details as stored in the database."
                }
            />

            {loading ? (
                <div className="rounded-xl border border-white/10 bg-card p-5 text-sm text-white/50">
                    Loading job details…
                </div>
            ) : error || !job ? null : (
                <div className="flex flex-col gap-6">
                    {/* 1. Basic Information */}
                    <SectionCard index={1} title="Basic Information">
                        <div className="flex flex-col gap-5">
                            <Field label="Job title">
                                <DetailBox value={job.title} />
                            </Field>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Company name">
                                    <DetailBox value={job.companyName} />
                                </Field>
                                <Field label="Job category">
                                    <DetailBox value={job.category} />
                                </Field>
                            </div>
                            <fieldset className="flex flex-col gap-2">
                                <legend className="text-sm text-white/80">Job type</legend>
                                <PillGroup
                                    name="job-type-view"
                                    value={job.jobType}
                                    onChange={() => {}}
                                    options={["Full-time", "Part-time", "Contract", "Internship"].map((t) => ({
                                        value: t.toLowerCase(),
                                        label: t,
                                    }))}
                                    className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                                    pillClassName="h-11 justify-center capitalize cursor-default"
                                />
                            </fieldset>
                        </div>
                    </SectionCard>

                    {/* 2. Location, Compensation & Timeline */}
                    <SectionCard index={2} title="Location, Compensation &amp; Timeline">
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 p-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-white/90">Remote work allowed</span>
                                    <p className="text-xs text-white/50">
                                        {job.isRemote ? "Worldwide / distributed applications" : "On-site or hybrid"}
                                    </p>
                                </div>
                                <span
                                    className={`h-6 w-11 rounded-full transition-colors ${job.isRemote ? "bg-[#5C53FE]" : "bg-white/15"}`}
                                >
                                    <span
                                        className={`block size-5 translate-y-0.5 rounded-full bg-white transition-transform ${job.isRemote ? "translate-x-5.5 ml-1" : "ml-1"}`}
                                    />
                                </span>
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Job location">
                                    <div className="relative">
                                        <MapPin
                                            aria-hidden
                                            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/50"
                                        />
                                        <DetailBox value={job.isRemote ? "Remote" : job.location} />
                                    </div>
                                </Field>
                                <Field label="Application deadline">
                                    <div className="relative">
                                        <Calendar
                                            aria-hidden
                                            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/50"
                                        />
                                        <DetailBox value={job.deadline} />
                                    </div>
                                </Field>
                            </div>
                            <div className="grid gap-5 sm:grid-cols-3">
                                <Field label="Min salary / rate">
                                    <DetailBox value={job.minSalary} />
                                </Field>
                                <Field label="Max salary / rate">
                                    <DetailBox value={job.maxSalary} />
                                </Field>
                                <Field label="Frequency">
                                    <DetailBox value={job.salaryFrequency} />
                                </Field>
                            </div>
                        </div>
                    </SectionCard>

                    {/* 3. Responsibilities & Requirements */}
                    <SectionCard index={3} title="Responsibilities &amp; Requirements">
                        <div className="flex flex-col gap-5">
                            <Field label="Key responsibilities">
                                <DetailBox value={job.responsibilities} />
                            </Field>
                            <Field label="Qualifications &amp; requirements">
                                <DetailBox value={job.requirements} />
                            </Field>
                        </div>
                    </SectionCard>

                    {/* 4. Meta */}
                    <SectionCard index={4} title="Status &amp; Applicants">
                        <div className="grid gap-5 sm:grid-cols-3">
                            <Field label="Status">
                                <DetailBox value={job.status} />
                            </Field>
                            <Field label="Applicants">
                                <p className="flex items-center gap-2 text-sm text-white/80">
                                    <Users aria-hidden className="size-4 text-white/50" />
                                    {job.applicants} Candidates
                                </p>
                            </Field>
                            <Field label="Company">
                                <p className="flex items-center gap-2 text-sm text-white/80">
                                    <Building2 aria-hidden className="size-4 text-white/50" />
                                    {job.isRemote ? <Globe className="size-4 text-white/50" /> : null}
                                    {job.companyName}
                                </p>
                            </Field>
                        </div>
                    </SectionCard>
                </div>
            )}
        </PageContainer>
    )
}
