"use client"

/** Label + control wrapper so every field row renders the same way. */
export function Field({
    label,
    htmlFor,
    required,
    hint,
    className,
    children,
}: {
    label: string
    htmlFor?: string
    required?: boolean
    /** Small text next to the label, e.g. "Required". */
    hint?: string
    className?: string
    children: React.ReactNode
}) {
    return (
        <div className={className}>
            <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm">
                <span>
                    {label}
                    {required ? <span className="ml-0.5 text-[#8b5cf6]">*</span> : null}
                </span>
                {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
            </label>
            {children}
        </div>
    )
}
