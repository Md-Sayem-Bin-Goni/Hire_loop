"use client"

/**
 * Row of selectable pills (used for Job type, filters, etc.).
 *
 *   <PillGroup
 *     name="job-type"
 *     value={form.jobType}
 *     onChange={setJobType}
 *     options={[{ value: "Full-time", label: "Full-time" }, ...]}
 *   />
 */

import { cn } from "@/lib/utils"

export type PillOption = { value: string; label: string }

export function PillGroup({
    name,
    value,
    onChange,
    options,
    className,
    pillClassName,
}: {
    name: string
    value: string
    onChange: (value: string) => void
    options: PillOption[]
    /** Layout classes for the row (e.g. "grid grid-cols-4 gap-2"). */
    className?: string
    /** Extra classes applied to each pill. */
    pillClassName?: string
}) {
    return (
        <div className={cn("flex flex-wrap gap-2", className)} role="radiogroup" aria-label={name}>
            {options.map((option) => {
                const selected = value === option.value
                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        name={name}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                            selected
                                ? "border-[#5C53FE]/60 bg-[#5C53FE]/10 text-[#a78bfa]" // selected pill
                                : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10", // idle pill
                            pillClassName,
                        )}
                    >
                        {option.label}
                    </button>
                )
            })}
        </div>
    )
}
