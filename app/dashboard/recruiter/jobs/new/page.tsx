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
import { JOB_CATEGORIES, type JobFormData } from "@/lib/types/jobs"
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
                action={
                    <Button type="submit" form="new-job-form" className="btn-brand" disabled={loading}>
                        Publish Job
                        <ArrowRight aria-hidden />
                    </Button>
                }
            />

            <JobForm
                formId="new-job-form"
                initial={{
                    title: "Frontend Developer",
                    companyName: "HirePulse Network",
                    category: JOB_CATEGORIES[0],
                    jobType: "full-time",
                    isRemote: false,
                    location: "New York, USA",
                    deadline: "2025-05-30",
                    minSalary: "25",
                    maxSalary: "40",
                    salaryFrequency: "per hour",
                    responsibilities:
                        "Showcase your commitment to delivering exceptional user interfaces and digital experiences. You will collaborate directly with systems designers and backend engineers to craft responsive, micro-interaction rich products.",
                    requirements:
                        "• 3+ years of experience with React, TypeScript, and modern state architectures\n• Solid understanding of DOM performance and component-driven designs\n• Experience partnering closely with product teams and UI/UX designers",
                    applicants: 0,
                    status: "active",
                }}
                loading={loading}
                onSubmit={handleSubmit}
            />
        </PageContainer>
    )
}
