"use client"

/**
 * Confirmation dialog (shadcn-style) — centered card over a dimmed overlay.
 *
 *   <ConfirmDialog
 *     open={open}
 *     onOpenChange={setOpen}
 *     title="Delete this job?"
 *     description="This will permanently remove …"
 *     confirmLabel="Delete"
 *     loading={deleting}
 *     onConfirm={handleDelete}
 *   />
 */

import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    loading = false,
    onConfirm,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
    /** Disables the confirm button and shows "Working…" while pending. */
    loading?: boolean
    onConfirm: () => void
}) {
    // Close on Escape while open.
    useEffect(() => {
        if (!open) return
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape" && !loading) onOpenChange(false)
        }
        document.addEventListener("keydown", onKeyDown)
        return () => document.removeEventListener("keydown", onKeyDown)
    }, [open, loading, onOpenChange])

    if (!open) return null

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed inset-0 z-100 flex items-center justify-center p-4"
        >
            {/* Dimmed backdrop (click to close) */}
            <button
                type="button"
                aria-label="Close dialog"
                onClick={() => !loading && onOpenChange(false)}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Card */}
            <div className="relative w-full max-w-md rounded-xl border border-white/10 bg-[#141414] p-6 shadow-2xl">
                <h2 className="text-base font-semibold text-white/90">{title}</h2>
                {description ? (
                    <p className="mt-2 text-sm text-white/60">{description}</p>
                ) : null}

                <div className="mt-6 flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        className="border-white/10 bg-white/5 hover:bg-white/10"
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={loading}
                        className="bg-red-500/90 text-white hover:bg-red-500"
                    >
                        {loading ? "Working…" : confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    )
}

// Re-exported helper so callers keep a single import (kept minimal on purpose).
export { cn }
