/**
 * Job-related constants & types shared by the recruiter dashboard (post/edit job)
 * and the backend API helpers in lib/api/jobs.ts.
 *
 * Field names match the MongoDB `jobs` collection documents exactly
 * (jobTitle, jobCategory, isWorldwide, jobLocation, applicationDeadline, frequency).
 */

export const JOB_CATEGORIES = [
    "Technology",
    "Design",
    "Marketing",
    "Writing & Content",
    "Administrative",
    "Sales",
    "Customer Service",
    "Human Resources",
    "Media & Communication",
    "Finance & Accounting",
    "Management",
    "Business Development",
    "IT & Networking",
    "Education",
    "Data & Analytics",
] as const

export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const

export type JobType = (typeof JOB_TYPES)[number]

export const SALARY_FREQUENCIES = ["per hour", "per day", "per month", "per year"] as const

export const EXPERIENCE_LEVELS = ["Junior", "Mid-level", "Senior", "Lead"] as const

export type JobStatus = "active" | "closed" | "draft"

/** Shape of the "Post a New Job" form (also what we send to POST /jobs). */
export type JobFormData = {
    jobTitle: string
    companyName: string
    jobCategory: string
    jobType: JobType
    isWorldwide: boolean
    jobLocation: string
    applicationDeadline: string
    minSalary: string | number
    maxSalary: string | number
    frequency: (typeof SALARY_FREQUENCIES)[number]
    responsibilities: string
    requirements: string

    /** Optional / not present on every stored job. */
    applicants?: number
    status?: JobStatus
    experienceLevel?: (typeof EXPERIENCE_LEVELS)[number]
    isEasyApply?: boolean
    isHotJob?: boolean

    /** Optional rich content for the public job details page. */
    description?: string
    /** Comma-separated skills, rendered as pills (e.g. "Figma, Prototyping"). */
    skills?: string
    /** Comma-separated benefits (e.g. "Health & Dental, 401k"). */
    benefits?: string
}

/** A job as stored in the DB / returned by the API (JobFormData + DB-generated fields). */
export type StoredJob = JobFormData & { _id: string; createdAt?: string }
