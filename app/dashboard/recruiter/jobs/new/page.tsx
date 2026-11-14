"use client"

/**
 * Post a New Job (Recruiter → Add Job)
 *
 * Reuses the shared JobForm (components/dashboard/job-form.tsx).
 * FLOW: form state → "Publish Job" → createJob() → success toast → redirect to Manage Jobs.
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { JobForm } from "@/components/dashboard/job-form"
import { createJob } from "@/lib/api/jobs"
import { type JobFormData, type JobType } from "@/lib/types/jobs"
import { toast } from "@/components/ui/toast"

export default function NewJobPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (form: JobFormData) => {
        setLoading(true)
        try {
            const result = await createJob(form)
            if (result.insertedId) {
                toast.add({
                    title: "Job created",
                    description: "The job has been successfully created.",
                })
                router.push("/dashboard/recruiter/jobs")
            }
        } catch (error) {
            console.error("createJob failed:", error)
            toast.add({
                title: "Job not created",
                description: "Something went wrong. Please try again.",
                variant: "error",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <PageContainer width="narrow">
            <PageHeader
                overline="Manage Jobs › Create New Listing"
                title="Post a New Job"
                subtitle="Fill in the position specifications to attract qualified talent across our network."
            />

            <JobForm
                formId="new-job-form"
                initial={{
                    title: "",
                    companyName: "",
                    category: "",
                    jobType: "" as JobType,
                    isRemote: false,
                    location: "",
                    deadline: "",
                    minSalary: "",
                    maxSalary: "",
                    salaryFrequency: "per hour",
                    responsibilities: "",
                    requirements: "",
                    applicants: 0,
                    status: "active",
                }}
                loading={loading}
                onSubmit={handleSubmit}
            />

            {/* Submit sits below the form (linked via formId). */}
            <div className="flex justify-end">
                <Button type="submit" form="new-job-form" className="btn-brand" disabled={loading}>
                    Publish Job
                    <ArrowRight aria-hidden />
                </Button>
            </div>
        </PageContainer>
    )
}
