import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function Globe() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 flex h-full justify-center overflow-hidden"
      aria-hidden="true"
    >
      {/* Purple glow at the top */}
      <div className="absolute top-0 h-64 w-[120%] max-w-5xl rounded-[100%] bg-[radial-gradient(ellipse_at_center,#7a5cff80_0%,#4c2fd860_45%,transparent_75%)] blur-2xl" />

      {/* CSS wireframe dome: concentric rings fanning from the top point */}
      <div
        className="absolute left-1/2 top-0 size-[2600px] -translate-x-1/2 bg-[repeating-radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.09)_0px,rgba(255,255,255,0.09)_1px,transparent_1px,transparent_52px),repeating-conic-gradient(from_12deg_at_50%_0%,transparent_0deg,transparent_6.5deg,rgba(255,255,255,0.07)_6.5deg,rgba(255,255,255,0.07)_7deg,transparent_7deg,transparent_15deg),radial-gradient(circle_at_50%_0%,#4c2fd840_0%,#150f2e_30%,transparent_60%)] [mask-image:radial-gradient(circle_at_50%_0%,black_0%,rgba(0,0,0,0.55)_32%,transparent_62%)]"
      />

      {/* Fade into the page background */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-[#080808]" />
      <div className="absolute inset-x-0 top-[45%] bottom-0 bg-gradient-to-b from-transparent to-[#080808]" />
    </div>
  )
}

export function Cta({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-[#080808] text-white",
        className
      )}
    >
      <Globe />

      <div className="relative z-10 mx-auto max-w-3xl px-4 pt-20 text-center sm:pt-24">
        {/* Heading */}
        <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
          Your next role is already looking for you
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm/relaxed text-white/60 sm:text-base/relaxed">
          Build a profile in three minutes. The matches start arriving tomorrow
          morning.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-lg bg-white px-6 text-black hover:bg-white/90"
            )}
          >
            Create a free account
          </Link>
          <Link
            href="/pricing"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-lg border-white/15 bg-[#121212] px-6 text-white hover:bg-white/10"
            )}
          >
            View pricing
          </Link>
        </div>
      </div>

      {/* Spacer lets the dome breathe before it fades out */}
      <div className="relative z-10 h-40 sm:h-48" />
    </section>
  )
}
