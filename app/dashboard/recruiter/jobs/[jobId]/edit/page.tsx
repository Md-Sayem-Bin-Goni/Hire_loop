"use client"

/**
 * Edit Job (Recruiter → update an existing posting)
 *
 * Fetches the job by id (GET /jobs/:id), prefills the shared JobForm,
 * then PUT /jobs/:id persists every changed field in MongoDB.
 */

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowRight, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { JobForm } from "@/components/dashboard/job-form"
import { getJob, updateJob } from "@/lib/api/jobs"
import type { JobFormData, StoredJob } from "@/lib/types/jobs"
import { toast } from "@/components/ui/toast"

export default function EditJobPage() {
    const { jobId } = useParams<{ jobId: string }>()
    const router = useRouter()
    const [job, setJob] = useState<StoredJob | null>(null)
    const [loading, setLoading] = useState(true) // initial fetch
    const [error, setError] = useState(false)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        getJob(jobId)
            .then((data) => setJob(data))
            .catch((err) => {
                console.error("getJob failed:", err)
                setError(true)
            })
            .finally(() => setLoading(false))
    }, [jobId])

    const handleSubmit = async (form: JobFormData) => {
        if (!job) return
        setSaving(true)
        try {
            await updateJob(job._id, form)
            toast.add({
                title: "Job updated",
                description: "Your changes have been saved.",
            })
            router.push("/dashboard/recruiter/jobs")
        } catch (err) {
            console.error("updateJob failed:", err)
            toast.add({
                title: "Job not updated",
                description: "Something went wrong. Please try again.",
                variant: "error",
            })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <PageContainer width="narrow">
                <PageHeader overline="Manage Jobs › Edit Listing" title="Edit Job" />
                <div className="rounded-xl border border-white/10 bg-card p-5 text-sm text-white/50">
                    Loading job…
                </div>
            </PageContainer>
        )
    }

    if (error || !job) {
        return (
            <PageContainer width="narrow">
                <PageHeader overline="Manage Jobs › Edit Listing" title="Job not found" />
                <div className="rounded-xl border border-white/10 bg-card p-5 text-sm text-red-400">
                    The job could not be loaded. Is the backend running?
                </div>
            </PageContainer>
        )
    }

    return (
        <PageContainer width="narrow">
            <PageHeader
                overline="Manage Jobs › Edit Listing"
                title={`Edit: ${job.title}`}
                subtitle="Update any field below — changes are saved to the database on submit."
                action={
                    <Button type="submit" form="edit-job-form" className="btn-brand" disabled={saving}>
                        <Save aria-hidden />
                        Save Changes
                        <ArrowRight aria-hidden />
                    </Button>
                }
            />

            <JobForm formId="edit-job-form" initial={job} loading={saving} onSubmit={handleSubmit} />
        </PageContainer>
    )
}
