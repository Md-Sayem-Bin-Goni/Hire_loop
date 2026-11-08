import Image from "next/image"
import Link from "next/link"
import {
  Briefcase,
  Building2,
  Flame,
  MapPin,
  Search,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const STATS = [
  { icon: Briefcase, value: "50K", label: "Active Jobs" },
  { icon: Building2, value: "12K", label: "Companies" },
  { icon: Search, value: "2M", label: "Job Seekers" },
  { icon: Star, value: "97%", label: "Satisfaction Rate" },
]

const TRENDING = ["Product Designer", "AI Engineering", "DevOps Engineer"]

function Globe() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">
      {/* Glow behind the globe */}
      <div
        className="absolute top-[8%] h-56 w-[120%] max-w-3xl rounded-[100%] bg-[radial-gradient(ellipse_at_center,#6d4aff66_0%,#4c2fd855_40%,transparent_70%)] blur-2xl"
        aria-hidden="true"
      />
      <Image
        src="/image/globe.png"
        alt=""
        width={1440}
        height={1672}
        priority
        className="w-[1100px] max-w-none opacity-90"
      />
      {/* Purple tint over the dome */}
      <div
        className="absolute inset-x-0 bottom-0 top-[10%] bg-[linear-gradient(to_bottom,#5237f540,#1a1140b3_55%,#12101d_90%)]"
        aria-hidden="true"
      />
      {/* Edge stars */}
      <div
        className="absolute inset-x-0 top-0 h-16 bg-[radial-gradient(3px_3px_at_10%_50%,#ffffff88_50%,transparent),radial-gradient(2px_2px_at_30%_80%,#ffffff66_50%,transparent),radial-gradient(2px_2px_at_55%_30%,#ffffff55_50%,transparent),radial-gradient(3px_3px_at_72%_70%,#ffffff77_50%,transparent),radial-gradient(2px_2px_at_90%_40%,#ffffff66_50%,transparent)]"
        aria-hidden="true"
      />
    </div>
  )
}

function StatCard({
  icon: Icon,
  value,
  label,
}: (typeof STATS)[number]) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#121212]/90 p-4 shadow-black/20 backdrop-blur-sm transition-colors hover:border-white/20 sm:p-5">
      <div className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-white/80">
        <Icon className="size-4" />
      </div>
      <div className="mt-5 text-3xl font-bold text-white sm:text-4xl">
        {value}
      </div>
      <div className="mt-1 text-xs font-medium text-white/60 sm:text-sm">
        {label}
      </div>
    </div>
  )
}

export function Hero({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-[#080808] pt-2 text-white",
        className
      )}
    >
      <div className="relative z-10 mx-auto max-w-3xl px-4 pt-20 text-center sm:pt-28">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#161616] px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-white/80 uppercase">
          <span className="flex size-5 items-center justify-center rounded-md bg-orange-500/20">
            <Flame className="size-3 text-orange-500" />
          </span>
          <span className="text-white">50,000+</span> new jobs this month
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
          Find Your Dream Job Today
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm/relaxed text-white/60 sm:text-base/relaxed">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land you next role— faster.
        </p>

        {/* Search bar */}
        <form
          action="/jobs"
          className="mx-auto mt-8 flex max-w-xl items-stretch gap-2 rounded-2xl border border-white/10 bg-[#121212] p-2 shadow-lg shadow-black/30 focus-within:border-white/25"
        >
          <div className="flex flex-1 items-center gap-2 px-2">
            <Search className="size-4 shrink-0 text-white/50" />
            <input
              type="text"
              name="q"
              placeholder="Job title, skill or company"
              className="h-10 w-full min-w-0 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
          </div>
          <span className="my-2.5 w-px bg-white/10" aria-hidden="true" />
          <div className="hidden flex-1 items-center gap-2 px-2 sm:flex">
            <MapPin className="size-4 shrink-0 text-white/50" />
            <input
              type="text"
              name="location"
              placeholder="Location or Remote"
              className="h-10 w-full min-w-0 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
          </div>
          <Button
            type="submit"
            size="icon-lg"
            aria-label="Search jobs"
            className="my-auto rounded-full bg-[#5b46f5] text-white hover:bg-[#4c39e8]"
          >
            <Search className="size-4" />
          </Button>
        </form>

        {/* Trending */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-white/50">Trending Position</span>
          {TRENDING.map((t) => (
            <Link
              key={t}
              href={`/jobs?q=${encodeURIComponent(t)}`}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              {t}
            </Link>
          ))}
        </div>
      </div>

      {/* Globe backdrop + overlay text */}
      <div className="relative mt-10">
        <Globe />
        <p className="relative z-10 mx-auto max-w-md px-4 pt-40 text-center text-xl/relaxed font-medium text-slate-300 text-balance sm:pt-48 sm:text-2xl/relaxed">
          Assisting over <span className="font-semibold text-white">15,000</span>{" "}
          job seekers find their dream positions.
        </p>

        {/* Stats */}
        <div className="relative z-10 mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-3 px-4 pb-10 sm:gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  )
}
