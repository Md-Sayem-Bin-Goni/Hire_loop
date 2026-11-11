import * as React from "react"
import { cn } from "cn"

/** Multi-line text input styled like the rest of the form fields. */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                "min-h-16 w-full rounded-lg border border-input bg-input/30 px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50",
                className,
            )}
            {...props}
        />
    )
}

export { Textarea }
