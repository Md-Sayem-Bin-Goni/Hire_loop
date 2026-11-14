"use client"

/**
 * Interactive bits of the public job details page
 * (app/browse-jobs/[jobId]/page.tsx): bookmark + Apply Now actions and the
 * company "Visit Website" button (stubbed until applications exist).
 */

import { useState } from "react"
import { Bookmark } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

export function JobActions({ jobTitle }: { jobTitle: string }) {
    const [saved, setSaved] = useState(false)

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
                onClick={() =>
                    toast.add({
                        title: "Applications coming soon",
                        description: `You'll be able to apply for "${jobTitle}" shortly.`,
                    })
                }
            >
                Apply Now
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
