import {
  Bookmark,
  Building2,
  FileText,
  GitBranch,
  LineChart,
  Search,
  SquareMousePointer,
  Wand2,
} from "lucide-react"

import { cn } from "@/lib/utils"

const FEATURES = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Find your ideal job with advanced filters.",
  },
  {
    icon: LineChart,
    title: "Salary Insights",
    description: "Get real salary data to negotiate confidently.",
  },
  {
    icon: Building2,
    title: "Top Companies",
    description: "Apply to verified companies that are hiring.",
  },
  {
    icon: Bookmark,
    title: "Saved Jobs",
    description: "Manage apps & favorites on your dashboard.",
  },
  {
    icon: Wand2,
    title: "One-Click Apply",
    description: "Simplify your job applications for an easier process.",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description: "Create professional resumes with modern templates.",
  },
  {
    icon: GitBranch,
    title: "Skill-Based Matching",
    description: "Discover jobs that match your skills and experience.",
  },
  {
    icon: SquareMousePointer,
    title: "Career Growth Resources",
    description: "Boost your career with quick interview tips.",
  },
]

function FeatureCard({
  icon: Icon,
  title,
  description,
}: (typeof FEATURES)[number]) {
  return (
    <div className="group flex gap-4 p-5">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/80 transition-colors group-hover:text-[#a78bfa]">
        <Icon className="size-4" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="mt-1.5 text-sm/relaxed text-white/60">{description}</p>
      </div>
    </div>
  )
}

export function Features({ className }: { className?: string }) {
  return (
    <section
      className={cn("bg-[#080808] py-16 text-white sm:py-24", className)}
    >
      <div className="mx-auto max-w-6xl px-4">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-white/60">
            <span className="size-1.5 rounded-full bg-[#5b46f5]" aria-hidden />
            Features Job
            <span className="size-1.5 rounded-full bg-[#5b46f5]" aria-hidden />
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
            Everything you need to succeed
          </h2>
        </div>

        {/* Feature grid */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-[#121212]/90 p-2 backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
