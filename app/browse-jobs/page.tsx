import { getJobs } from "@/lib/api/jobs"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { JobsBrowser, SearchBar } from "./_components"

export const metadata = { title: "Browse Jobs — hireloop" }

const BrowseJobsPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    const params = await searchParams

    // Forward every query param as-is so the backend can filter on them.
    const query = new URLSearchParams(
        Object.entries(params).flatMap(([key, value]) =>
            typeof value === "string" ? [[key, value] as [string, string]] : [],
        ),
    ).toString()

    const jobs = await getJobs(query)

    return (
        <div className="flex min-h-svh flex-col bg-[#080808] text-white">
            <Navbar />

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-28 pb-16 sm:px-6">
                <SearchBar defaultValue={typeof params.search === "string" ? params.search : ""} />
                <JobsBrowser jobs={jobs} />
            </main>

            <Footer />
        </div>
    )
}

export default BrowseJobsPage
