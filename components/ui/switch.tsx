"use client"

import * as React from "react"
import { cn } from "cn"

/** Small on/off switch. Controlled: checked + onCheckedChange. */
function Switch({
    checked,
    onCheckedChange,
    className,
    ...props
}: {
    checked: boolean
    onCheckedChange?: (checked: boolean) => void
} & Omit<React.ComponentProps<"button">, "onCheckedChange" | "onChange">) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            data-slot="switch"
            onClick={() => onCheckedChange?.(!checked)}
            className={cn(
                "relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors",
                checked ? "bg-[#5C53FE]" : "bg-white/20",
                className,
            )}
            {...props}
        >
            <span
                className={cn(
                    "block size-4 rounded-full bg-white transition-all",
                    checked ? "translate-x-5" : "translate-x-1",
                )}
            />
        </button>
    )
}

export { Switch }
