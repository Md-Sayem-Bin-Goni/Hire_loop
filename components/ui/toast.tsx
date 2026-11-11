"use client"

/**
 * Tiny toast system (no dependency).
 *
 * USAGE:
 *   import { toast } from "@/components/ui/toast"
 *   toast.add({ title: "Job created", description: "..." })
 *
 * RENDERING (once, in app/layout.tsx):
 *   <Toaster />
 */

import * as React from "react"

export type ToastItem = {
    id: number
    title: string
    description?: string
    variant?: "default" | "success" | "error"
}

// Simple store: any file can call toast.add(); every mounted <Toaster /> listens.
let items: ToastItem[] = []
const listeners = new Set<(items: ToastItem[]) => void>()
let nextId = 1

function emit() {
    for (const listener of listeners) listener(items)
}

export const toast = {
    add(input: { title: string; description?: string; variant?: ToastItem["variant"] }) {
        const item: ToastItem = { id: nextId++, ...input }
        items = [...items, item]
        emit()
        // Auto-dismiss after 4s
        setTimeout(() => toast.remove(item.id), 4000)
    },
    remove(id: number) {
        items = items.filter((item) => item.id !== id)
        emit()
    },
}

export function Toaster() {
    const [current, setCurrent] = React.useState<ToastItem[]>([])

    React.useEffect(() => {
        const listener = (latest: ToastItem[]) => setCurrent(latest)
        listeners.add(listener)
        return () => {
            listeners.delete(listener)
        }
    }, [])

    return (
        <div className="fixed bottom-4 right-4 z-100 flex w-80 flex-col gap-2">
            {current.map((item) => (
                <div
                    key={item.id}
                    className="rounded-xl border border-white/10 bg-[#1e1e1e] p-4 shadow-lg"
                    role="status"
                >
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    {item.description ? (
                        <p className="mt-1 text-xs text-white/60">{item.description}</p>
                    ) : null}
                </div>
            ))}
        </div>
    )
}
