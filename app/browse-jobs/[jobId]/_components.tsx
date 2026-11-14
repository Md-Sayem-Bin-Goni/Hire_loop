"use client"

/**
 * Interactive bits of the public job details page
 * (app/browse-jobs/[jobId]/page.tsx): bookmark + Apply Now actions and the
 * company "Visit Website" button.
 */

import { useState } from "react"
import { Bookmark } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { useSession } from "@/lib/auth-client"
import { getUserRole } from "@/lib/types/user"
import { cn } from "@/lib/utils"
import { applyToAJob } from "@/lib/api/actions/applications"

export function JobActions({
    jobId,
    jobTitle,
    companyName,
}: {
    jobId: string
    jobTitle: string
    companyName: string
}) {
    const [saved, setSaved] = useState(false)
    const [applying, setApplying] = useState(false)
    const { data: session, isPending } = useSession()
    const router = useRouter()

    async function handleApply() {
        if (isPending || applying) return

        if (!session) {
            const returnTo = `/browse-jobs/${encodeURIComponent(jobId)}`
            router.push(`/signin?redirectTo=${encodeURIComponent(returnTo)}`)
            return
        }

        if (getUserRole(session.user) !== "seeker") {
            toast.add({
                title: "Unable to apply",
                description: "Only job seekers can apply for jobs.",
                variant: "error",
            })
            return
        }

        setApplying(true)
        try {
            const result = await applyToAJob({
                jobId,
                userId: session.user.id,
                email: session.user.email,
                jobTitle,
                companyName,
            })

            if (!result.insertedId) {
                throw new Error("The application was not saved.")
            }

            toast.add({
                title: "Application submitted",
                description: `Your application for "${jobTitle}" was submitted.`,
                variant: "success",
            })
        } catch (error) {
            toast.add({
                title: "Application failed",
                description: error instanceof Error ? error.message : "Please try again.",
                variant: "error",
            })
        } finally {
            setApplying(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                aria-label={saved ? "Remove bookmark" : "Save job"}
                aria-pressed={saved}
                onClick={() => setSaved((v) => !v)}
                className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
                <Bookmark className={cn("size-5", saved && "fill-[#5C53FE] text-[#5C53FE]")} />
            </button>
            <Button
                className="h-10 rounded-xl bg-white px-6 text-black hover:bg-white/90"
                disabled={isPending || applying}
                onClick={handleApply}
            >
                {applying ? "Applying..." : "Apply Now"}
            </Button>
        </div>
    )
}

export function VisitWebsiteButton({ companyName }: { companyName: string }) {
    return (
        <Button
            variant="outline"
            className="w-full rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
            onClick={() =>
                toast.add({
                    title: "Company profile coming soon",
                    description: `${companyName}'s website link will be available shortly.`,
                })
            }
        >
            Visit Website
        </Button>
    )
}
