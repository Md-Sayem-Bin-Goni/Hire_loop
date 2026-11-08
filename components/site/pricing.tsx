"use client"

import { useState } from "react"
import Link from "next/link"
import { Crown, Zap, Sparkles, ArrowRight } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Plan = {
  icon: React.ComponentType<{ className?: string }>
  name: string
  monthly: number
  features: string[]
  highlighted?: boolean
}

const PLANS: Plan[] = [
  {
    icon: Crown,
    name: "Starter",
    monthly: 0,
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
  },
  {
    icon: Sparkles,
    name: "Growth",
    monthly: 17,
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
    highlighted: true,
  },
  {
    icon: Zap,
    name: "Premium",
    monthly: 99,
    features: [
      "Everything in Pro",
      "Multi-profile career portfolios",
      "Shared talent rooms",
      "Recruiter view (read-only)",
    ],
  },
]

const YEARLY_DISCOUNT = 0.2

function PriceCard({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  const price = yearly
    ? Math.round(plan.monthly * (1 - YEARLY_DISCOUNT))
    : plan.monthly

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border p-6 backdrop-blur-sm transition-colors md:scale-[1.04]",
        plan.highlighted
          ? "border-[#5b46f5]/60 bg-[#161616] shadow-[0_0_40px_-10px_rgba(91,70,245,0.45)] hover:border-[#5b46f5]"
          : "border-white/10 bg-[#121212]/90 hover:border-white/20"
      )}
    >
      {plan.highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#5b46f5] px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-white">
          Most Popular
        </span>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-white/5 text-white/80">
            <plan.icon className="size-4" />
          </span>
          <span className="font-semibold">{plan.name}</span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold">${price}</span>
          <span className="text-xs text-white/50"> /month</span>
        </div>
      </div>

      <p className="mt-5 text-sm text-white/60">
        Start building your insights hub.
      </p>

      <ul className="mt-4 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5 text-sm text-white/70">
            <span className="flex size-5 items-center justify-center rounded-md bg-white/5 text-white/50">
              +
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href="/signin"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "group mt-8 w-full justify-between rounded-full px-5",
          plan.highlighted
            ? "border-[#5b46f5] bg-[#5b46f5] text-white hover:bg-[#4c39e8]"
            : "border-white/10 text-white hover:bg-white/10"
        )}
      >
        Choose This Plan
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}

export function Pricing({ className }: { className?: string }) {
  const [yearly, setYearly] = useState(false)

  return (
    <section
      className={cn("bg-[#080808] py-16 text-white sm:py-24", className)}
    >
      <div className="mx-auto max-w-6xl px-4">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-white/60">
            <span className="size-1.5 rounded-full bg-[#5b46f5]" aria-hidden />
            Pricing
            <span className="size-1.5 rounded-full bg-[#5b46f5]" aria-hidden />
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
            Pay for the leverage, not the listings
          </h2>
        </div>

        {/* Billing toggle */}
        <div className="mt-10 flex justify-center">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#121212] p-1">
            <button
              type="button"
              aria-pressed={!yearly}
              onClick={() => setYearly(false)}
              className={cn(
                "rounded-full px-5 py-1.5 text-sm font-medium transition-colors",
                !yearly ? "bg-white text-black" : "text-white/70 hover:text-white"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              aria-pressed={yearly}
              onClick={() => setYearly(true)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                yearly ? "bg-white text-black" : "text-white/70 hover:text-white"
              )}
            >
              Yearly
              <span
                className={cn(
                  "ml-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  yearly ? "bg-black text-white" : "bg-[#db2777] text-white"
                )}
              >
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="mt-10 grid gap-4 md:grid-cols-3 sm:gap-5">
          {PLANS.map((plan) => (
            <PriceCard key={plan.name} plan={plan} yearly={yearly} />
          ))}
        </div>
      </div>
    </section>
  )
}
