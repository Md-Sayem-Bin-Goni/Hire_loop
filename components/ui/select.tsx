"use client"

/**
 * Custom Select (button + popover list) — no native <select>, so it renders
 * the same everywhere and matches the dark theme.
 *
 * USAGE:
 *   <Select value={v} onValueChange={set}>
 *     <SelectTrigger><SelectValue placeholder="Pick one" /></SelectTrigger>
 *     <SelectContent>...<SelectItem value="a">A</SelectItem>...</SelectContent>
 *   </Select>
 *
 * HOW IT WORKS:
 *  - Select owns: current value, the label shown in the trigger, open/closed.
 *  - SelectTrigger is the button you click (chevron included).
 *  - SelectContent is the popup list; it stays mounted but visually hidden
 *    when closed, so items can register their labels even before opening.
 *  - SelectItem highlights the selected one and closes the popup on click.
 */

import * as React from "react"
import { cn } from "cn"

type SelectContextValue = {
    value?: string
    open: boolean
    setOpen: (open: boolean) => void
    close: () => void
    onChange: (value: string, label: string) => void
    /** Label of the currently selected item (to display in the trigger). */
    label: string | null
    /** Lets SelectItem register its label for the current value. */
    registerLabel: (value: string, label: string) => void
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

function Select({
    value,
    onValueChange,
    children,
}: {
    value?: string
    onValueChange?: (value: string) => void
    children: React.ReactNode
}) {
    const [open, setOpen] = React.useState(false)
    const rootRef = React.useRef<HTMLDivElement>(null)

    // Close the popup when clicking anywhere outside (rootRef wraps BOTH the
    // trigger and the popup, so clicks inside the popup don't close it).
    React.useEffect(() => {
        if (!open) return
        function onPointerDown(event: PointerEvent) {
            if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
        }
        document.addEventListener("pointerdown", onPointerDown)
        return () => {
            document.removeEventListener("pointerdown", onPointerDown)
        }
    }, [open])

    // Label stored with the value it belongs to — an outside value change
    // (e.g. form reset) automatically hides a stale label.
    const [marked, setMarked] = React.useState<{ value: string; label: string } | null>(null)
    const label = marked && marked.value === value ? marked.label : null

    const ctx = React.useMemo<SelectContextValue>(
        () => ({
            value,
            open,
            setOpen,
            close: () => setOpen(false),
            onChange: (next, nextLabel) => {
                setMarked({ value: next, label: nextLabel })
                onValueChange?.(next)
            },
            label,
            registerLabel: (itemValue, itemLabel) => {
                // Only remember the label if nothing was chosen yet (initial preset).
                setMarked((prev) => (prev === null ? { value: itemValue, label: itemLabel } : prev))
            },
        }),
        [value, open, label, onValueChange],
    )

    return (
        <div ref={rootRef} className="relative">
            <SelectContext.Provider value={ctx}>{children}</SelectContext.Provider>
        </div>
    )
}

function SelectTrigger({ className, children, ...props }: React.ComponentProps<"button">) {
    const ctx = React.useContext(SelectContext)

    return (
        <div className="relative">
            <button
                type="button"
                data-slot="select-trigger"
                aria-haspopup="listbox"
                aria-expanded={ctx?.open}
                onClick={() => ctx?.setOpen(!ctx.open)}
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-[#5C53FE]/50 focus-visible:ring-3 focus-visible:ring-[#5C53FE]/30",
                    className,
                )}
                {...props}
            >
                <span className={cn("truncate", !ctx?.label && "text-muted-foreground")}>
                    {ctx?.label ?? ""}
                    {children}
                </span>
                <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className={cn(
                        "size-4 shrink-0 fill-none stroke-muted-foreground stroke-2 transition-transform",
                        ctx?.open && "rotate-180",
                    )}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>
            {children}
        </div>
    )
}

function SelectContent({ children }: { children: React.ReactNode }) {
    const ctx = React.useContext(SelectContext)
    if (!ctx) return null

    return (
        <div
            role="listbox"
            aria-hidden={!ctx.open}
            className={cn(
                "absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-white/10 bg-[#1a1a1a] p-1 shadow-lg",
                !ctx.open && "hidden", // keep mounted (labels register) but invisible
            )}
        >
            {children}
        </div>
    )
}

function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
    const ctx = React.useContext(SelectContext)
    const selected = ctx?.value === value
    const label = typeof children === "string" ? children : String(children)

    // Register this item's label so the trigger can display it for a preset value.
    React.useEffect(() => {
        if (selected && ctx?.label === null) ctx.registerLabel(value, label)
    }, [selected, ctx, value, label])

    return (
        <button
            type="button"
            role="option"
            aria-selected={selected}
            data-slot="select-item"
            onClick={() => ctx?.onChange(value, label)}
            className={cn(
                "flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors",
                selected ? "bg-[#5C53FE]/15 text-[#a78bfa]" : "text-white/80 hover:bg-white/10",
            )}
        >
            {children}
        </button>
    )
}

/** Shows the placeholder text inside the trigger until a value is chosen. */
function SelectValue({ placeholder }: { placeholder?: string }) {
    const ctx = React.useContext(SelectContext)
    if (ctx?.label) return null
    if (!placeholder) return null
    return <span>{placeholder}</span>
}

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue }
