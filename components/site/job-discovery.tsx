import Link from "next/link"
import {
  ArrowRight,
  Banknote,
  Briefcase,
  Building2,
  MapPin,
  Sparkles,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const JOBS = [
  {
    title: "Frontend Developer",
    company: "Nova Tech",
    description:
      "Showcase your commitment to diversity and inclusion by highlighting initiatives.",
    location: "New York, USA",
    type: "Hybrid",
    salary: "€25- €40/hour",
  },
  {
    title: "Frontend Developer",
    company: "Nova Tech",
    description:
      "Showcase your commitment to diversity and inclusion by highlighting initiatives.",
    location: "New York, USA",
    type: "Hybrid",
    salary: "€25- €40/hour",
  },
  {
    title: "Frontend Developer",
    company: "Nova Tech",
    description:
      "Showcase your commitment to diversity and inclusion by highlighting initiatives.",
    location: "New York, USA",
    type: "Hybrid",
    salary: "€25- €40/hour",
  },
  {
    title: "Frontend Developer",
    company: "Nova Tech",
    description:
      "Showcase your commitment to diversity and inclusion by highlighting initiatives.",
    location: "New York, USA",
    type: "Hybrid",
    salary: "€25- €40/hour",
  },
  {
    title: "Frontend Developer",
    company: "Nova Tech",
    description:
      "Showcase your commitment to diversity and inclusion by highlighting initiatives.",
    location: "New York, USA",
    type: "Hybrid",
    salary: "€25- €40/hour",
  },
  {
    title: "Frontend Developer",
    company: "Nova Tech",
    description:
      "Showcase your commitment to diversity and inclusion by highlighting initiatives.",
    location: "New York, USA",
    type: "Hybrid",
    salary: "€25- €40/hour",
  },
]

function JobBadge({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
      <Icon className="size-3 text-white/50" />
      {children}
    </span>
  )
}

function JobCard({ job }: { job: (typeof JOBS)[number] }) {
  return (
    <div className="flex flex-col rounded-xl border border-white/10 bg-[#121212]/90 p-5 backdrop-blur-sm transition-colors hover:border-white/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-white/5 text-white/80">
          <Building2 className="size-4" />
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{job.title}</h3>
      <p className="mt-2 text-sm/relaxed text-white/60">{job.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <JobBadge icon={MapPin}>{job.location}</JobBadge>
        <JobBadge icon={Briefcase}>{job.type}</JobBadge>
        <JobBadge icon={Banknote}>{job.salary}</JobBadge>
      </div>

      <Link
        href="/jobs"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-[#a78bfa]"
      >
        Apply Now
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}

export function JobDiscovery({ className }: { className?: string }) {
  return (
    <section
      className={cn("bg-[#080808] py-16 text-white sm:py-24", className)}
    >
      <div className="mx-auto max-w-6xl px-4">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-white/60">
            <span className="size-1.5 rounded-full bg-[#5b46f5]" aria-hidden />
            Smart Job Discovery
            <span className="size-1.5 rounded-full bg-[#5b46f5]" aria-hidden />
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
            The roles you’d never find by searching
          </h2>
        </div>

        {/* Job cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {JOBS.map((job, i) => (
            <JobCard key={`${job.title}-${i}`} job={job} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/jobs"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full border-white/10 bg-white px-6 text-black hover:bg-white/90"
            )}
          >
            View all job open
          </Link>
        </div>
      </div>
    </section>
  )
}
