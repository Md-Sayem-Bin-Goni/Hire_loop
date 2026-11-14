"use client"

/**
 * Client pieces of the Browse Jobs page (app/browse-jobs/page.tsx).
 *
 * - SearchBar  — only the "Search Jobs" submit updates the URL query.
 * - JobsBrowser — filters, sort, job cards and pagination. Filters/sort/paging
 *   work on the jobs already fetched by the server; they never touch the URL,
 *   so their handlers stay local (per design).
 */

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    Banknote,
    Bookmark,
    Building2,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    Flame,
    Search,
    Star,
    Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { JOB_CATEGORIES, JOB_TYPES, type StoredJob } from "@/lib/types/jobs"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 6

const SORT_OPTIONS = [
    { value: "recent", label: "Most Recent" },
    { value: "salary-high", label: "Salary: High to Low" },
    { value: "salary-low", label: "Salary: Low to High" },
] as const

type SortBy = (typeof SORT_OPTIONS)[number]["value"]

/* ------------------------------------------------------------------ */
/* Search bar                                                          */
/* ------------------------------------------------------------------ */

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
    const router = useRouter()

    const [value, setValue] = useState(defaultValue)

   
    // The ONLY place that sets the search query (updates the URL).
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const search = new FormData(event.currentTarget).get("searchField")

        const params = new URLSearchParams()
        if (typeof search === "string" && search.trim()) params.set("search", search.trim())
        router.push(`/browse-jobs${params.size ? `?${params}` : ""}`)
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#121212] p-4 sm:flex-row sm:items-center"
        >
            <div className="relative flex-1">
                <Search
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/40"
                />
                <Input
                    name='searchField'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Search by job title, keywords..."
                    aria-label="Search jobs"
                    className="surface-field h-11 pl-11"
                />
            </div>
            <Button type="submit" className="h-11 rounded-xl bg-white px-6 text-black hover:bg-white/90">
                Search Jobs
            </Button>
        </form>
    )
}

/* ------------------------------------------------------------------ */
/* Jobs browser (filters + results)                                    */
/* ------------------------------------------------------------------ */

export function JobsBrowser({ jobs }: { jobs: StoredJob[] }) {
    const [selectedType, setSelectedType] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [sortBy, setSortBy] = useState<SortBy>("recent")
    const [page, setPage] = useState(1)

    // Filter by the selected job type + category (nothing selected = show everything).
    const filteredJobs = useMemo(
        () =>
            jobs.filter(
                (job) =>
                    (selectedType === "" || job.jobType === selectedType) &&
                    (selectedCategory === "" || job.jobCategory === selectedCategory),
            ),
        [jobs, selectedType, selectedCategory],
    )

    const sortedJobs = useMemo(() => sortJobs(filteredJobs, sortBy), [filteredJobs, sortBy])

    const totalPages = Math.max(1, Math.ceil(sortedJobs.length / PAGE_SIZE))
    const safePage = Math.min(page, totalPages)
    const visibleJobs = sortedJobs.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

    // Single-select: clicking the active job type clears it.
    function selectType(type: string) {
        setPage(1)
        setSelectedType((prev) => (prev === type ? "" : type))
    }

    // Single-select: clicking the active category clears it.
    function selectCategory(category: string) {
        setPage(1)
        setSelectedCategory((prev) => (prev === category ? "" : category))
    }

    function changeSort(value: string) {
        setSortBy(value as SortBy)
        setPage(1)
    }

    return (
        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
            <FiltersSidebar
                jobs={jobs}
                selectedType={selectedType}
                selectedCategory={selectedCategory}
                onSelectType={selectType}
                onSelectCategory={selectCategory}
            />

            <section className="min-w-0 flex-1">
                {/* Results header */}
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold sm:text-xl">
                        Found {filteredJobs.length} Professional Jobs
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-white/50">
                        <span className="hidden sm:inline">Sort by:</span>
                        <SortSelect value={sortBy} onChange={changeSort} />
                    </div>
                </div>

                {/* Job cards */}
                <div className="mt-4 flex flex-col gap-4">
                    {visibleJobs.map((job) => (
                        <JobCard key={job._id} job={job} />
                    ))}
                    {visibleJobs.length === 0 && (
                        <p className="rounded-2xl border border-white/10 bg-[#121212] p-10 text-center text-sm text-white/50">
                            No jobs match your filters.
                        </p>
                    )}
                </div>

                {totalPages > 1 && (
                    <Pagination
                        page={safePage}
                        totalPages={totalPages}
                        onChange={setPage}
                    />
                )}
            </section>
        </div>
    )
}

/* ------------------------------------------------------------------ */
/* Filters sidebar                                                     */
/* ------------------------------------------------------------------ */

function FiltersSidebar({
    jobs,
    selectedType,
    selectedCategory,
    onSelectType,
    onSelectCategory,
}: {
    jobs: StoredJob[]
    selectedType: string
    selectedCategory: string
    onSelectType: (type: string) => void
    onSelectCategory: (category: string) => void
}) {
    return (
        <aside className="h-fit shrink-0 rounded-2xl border border-white/10 bg-[#121212] p-5 lg:w-60">
            <h3 className="text-base font-semibold">Filters</h3>

            <h4 className="mt-4 text-sm font-medium text-white/80">Job Type</h4>
            <div className="mt-3 flex flex-col gap-3">
                {JOB_TYPES.map((type) => (
                    <FilterCheckbox
                        key={type}
                        label={type}
                        count={jobs.filter((job) => job.jobType === type).length}
                        checked={selectedType === type}
                        onChange={() => onSelectType(type)}
                    />
                ))}
            </div>

            <h4 className="mt-5 text-sm font-medium text-white/80">Category</h4>
            <div className="mt-3 flex flex-col gap-3">
                {JOB_CATEGORIES.map((category) => (
                    <FilterCheckbox
                        key={category}
                        label={category}
                        count={jobs.filter((job) => job.jobCategory === category).length}
                        checked={selectedCategory === category}
                        onChange={() => onSelectCategory(category)}
                    />
                ))}
            </div>
        </aside>
    )
}

function FilterCheckbox({
    label,
    count,
    checked,
    onChange,
}: {
    label: string
    count: number
    checked: boolean
    onChange: () => void
}) {
    return (
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-white/70">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="peer sr-only"
            />
            <span className="grid size-4 shrink-0 place-items-center rounded border border-white/20 bg-white/5 transition-colors peer-checked:border-[#5C53FE] peer-checked:bg-[#5C53FE]">
                <Check className="size-3 text-white opacity-0 peer-checked:[&>svg]:opacity-100" />
            </span>
            <span className="flex-1">{label}</span>
            <span className="text-white/40">{count}</span>
        </label>
    )
}

/* ------------------------------------------------------------------ */
/* Sort select                                                         */
/* ------------------------------------------------------------------ */

function SortSelect({ value, onChange }: { value: SortBy; onChange: (value: string) => void }) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="surface-field w-44">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

/* ------------------------------------------------------------------ */
/* Job card                                                            */
/* ------------------------------------------------------------------ */

function JobBadge({
    icon: Icon,
    children,
    className,
}: {
    icon: React.ComponentType<{ className?: string }>
    children: React.ReactNode
    className?: string
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70",
                className,
            )}
        >
            <Icon className="size-3 text-white/50" />
            {children}
        </span>
    )
}

function JobCard({ job }: { job: StoredJob }) {
    const [saved, setSaved] = useState(false)

    return (
        <article className="group relative flex gap-4 rounded-2xl border border-white/10 bg-[#121212] p-5 transition-colors hover:border-white/20">
            {/* Card-sized link — clicking anywhere (except the bookmark) opens the details page. */}
            <Link
                href={`/browse-jobs/${job._id}`}
                className="absolute inset-0 rounded-2xl focus-visible:ring-3 focus-visible:ring-[#5C53FE]/40 focus-visible:outline-none"
                aria-label={`View ${job.jobTitle} details`}
            />

            <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-white/5 text-white/80">
                <Building2 className="size-5" />
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white transition-colors group-hover:text-[#a78bfa]">
                    {job.jobTitle}
                </h3>
                <p className="mt-1 truncate text-sm text-white/60">
                    {job.companyName} • {job.jobLocation}
                    {job.isWorldwide && " (Remote)"}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                    <SalaryBadge job={job} />
                    <JobBadge icon={Clock} className="capitalize">
                        {job.jobType}
                    </JobBadge>
                    {job.experienceLevel && <JobBadge icon={Star}>{job.experienceLevel}</JobBadge>}
                    {job.isEasyApply && (
                        <JobBadge
                            icon={Zap}
                            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 [&>svg]:text-emerald-400"
                        >
                            Easy Apply
                        </JobBadge>
                    )}
                    {job.isHotJob && (
                        <JobBadge
                            icon={Flame}
                            className="border-orange-500/30 bg-orange-500/10 text-orange-400 [&>svg]:text-orange-400"
                        >
                            Hot Job
                        </JobBadge>
                    )}
                </div>
            </div>

            <button
                type="button"
                aria-label={saved ? "Remove bookmark" : "Save job"}
                aria-pressed={saved}
                onClick={() => setSaved((v) => !v)}
                className="relative z-10 h-fit shrink-0 rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/5 hover:text-white"
            >
                <Bookmark className={cn("size-5", saved && "fill-[#5C53FE] text-[#5C53FE]")} />
            </button>
        </article>
    )
}

function SalaryBadge({ job }: { job: StoredJob }) {
    const min = formatSalary(job.minSalary)
    const max = formatSalary(job.maxSalary)
    if (!min && !max) return null

    return (
        <JobBadge icon={Banknote}>
            {[min, max].filter(Boolean).join(" - ")}
            {job.frequency ? ` ${job.frequency}` : ""}
        </JobBadge>
    )
}

/** "140000" → "$140k", "25" → "$25"; empty/invalid → null. */
function formatSalary(value: string | number) {
    const amount = Number(value)
    if (!amount) return null
    return amount >= 1000 ? `$${Math.round(amount / 1000)}k` : `$${amount}`
}

/* ------------------------------------------------------------------ */
/* Pagination                                                          */
/* ------------------------------------------------------------------ */

function Pagination({
    page,
    totalPages,
    onChange,
}: {
    page: number
    totalPages: number
    onChange: (page: number) => void
}) {
    return (
        <nav aria-label="Jobs pagination" className="mt-6 flex justify-center gap-1.5">
            <PageButton disabled={page === 1} onClick={() => onChange(page - 1)} label="Previous page">
                <ChevronLeft className="size-4" />
            </PageButton>

            {getPageNumbers(page, totalPages).map((item, index) =>
                item === "…" ? (
                    <span key={`ellipsis-${index}`} className="px-2 py-1.5 text-sm text-white/40">
                        …
                    </span>
                ) : (
                    <PageButton
                        key={item}
                        active={item === page}
                        onClick={() => onChange(item)}
                        label={`Page ${item}`}
                    >
                        {item}
                    </PageButton>
                ),
            )}

            <PageButton disabled={page === totalPages} onClick={() => onChange(page + 1)} label="Next page">
                <ChevronRight className="size-4" />
            </PageButton>
        </nav>
    )
}

function PageButton({
    children,
    onClick,
    label,
    active = false,
    disabled = false,
}: {
    children: React.ReactNode
    onClick: () => void
    label: string
    active?: boolean
    disabled?: boolean
}) {
    return (
        <button
            type="button"
            aria-label={label}
            aria-current={active ? "page" : undefined}
            disabled={disabled}
            onClick={onClick}
            className={cn(
                "grid size-8 place-items-center rounded-lg border text-sm transition-colors",
                active
                    ? "border-[#5C53FE] bg-[#5C53FE] font-semibold text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                disabled && "cursor-not-allowed opacity-40 hover:bg-white/5",
            )}
        >
            {children}
        </button>
    )
}

/** 1 … around current … last (nothing hidden for small page counts). */
function getPageNumbers(page: number, totalPages: number): (number | "…")[] {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)

    const pages = new Set([1, page - 1, page, page + 1, totalPages])
    const visible = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)

    return visible.flatMap((p, i) => {
        const gap = i > 0 && p - visible[i - 1] > 1
        return gap ? ["…" as const, p] : [p]
    })
}

/* ------------------------------------------------------------------ */
/* Sorting                                                             */
/* ------------------------------------------------------------------ */

function sortJobs(jobs: StoredJob[], sortBy: SortBy) {
    const salary = (job: StoredJob) => Number(job.maxSalary) || 0
    const recent = (job: StoredJob) => new Date(job.createdAt ?? 0).getTime()

    return [...jobs].sort((a, b) => {
        switch (sortBy) {
            case "salary-high":
                return salary(b) - salary(a)
            case "salary-low":
                return salary(a) - salary(b)
            default:
                return recent(b) - recent(a)
        }
    })
}
