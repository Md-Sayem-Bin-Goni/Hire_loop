/**
 * Job-related constants & types shared by the recruiter dashboard (post/edit job)
 * and the backend API helpers in lib/api/jobs.ts.
 */

export const JOB_CATEGORIES = [
    "Engineering & Tech",
    "Design & Creative",
    "Product & Management",
    "Data & Analytics",
    "Marketing & Growth",
    "Customer Support",
] as const

export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const

export type JobType = Lowercase<(typeof JOB_TYPES)[number]>

export const SALARY_FREQUENCIES = ["per hour", "per day", "per month", "per year"] as const

export type JobStatus = "active" | "closed" | "draft"

/** Shape of the "Post a New Job" form (also what we send to POST /jobs). */
export type JobFormData = {
    title: string
    companyName: string
    category: string
    jobType: JobType
    isRemote: boolean
    location: string
    deadline: string
    minSalary: string
    maxSalary: string
    salaryFrequency: (typeof SALARY_FREQUENCIES)[number]
    responsibilities: string
    requirements: string
    applicants: number
    status: JobStatus
}

/** A job as stored in the DB / returned by the API (JobFormData + DB-generated fields). */
export type StoredJob = JobFormData & { _id: string; createdAt?: string }
