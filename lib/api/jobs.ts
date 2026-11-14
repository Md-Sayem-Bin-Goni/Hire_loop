/**
 * API helpers for jobs.
 *
 * They hit the separate Express backend: POST /jobs and GET /jobs.
 * Set NEXT_PUBLIC_API_BASE_URL to its base (e.g. http://localhost:5000).
 */

import type { JobFormData, StoredJob } from "@/lib/types/jobs"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

export const createJob = async (data: JobFormData) => {
    const res = await fetch(`${BASE_URL}/jobs`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        throw new Error(`Job creation failed (status ${res.status})`)
    }

    return res.json() as Promise<{ insertedId?: string }>
}

export const getJobs = async (query:  '') => {
    const res = await fetch(`${BASE_URL}/jobs?${query}`)
    if (!res.ok) {
        throw new Error(`Fetching jobs failed (status ${res.status})`)
    }
    return res.json() as Promise<StoredJob[]>
}

export const getJob = async (id: string) => {
    const res = await fetch(`${BASE_URL}/jobs/${id}`)
    if (!res.ok) {
        throw new Error(`Fetching job failed (status ${res.status})`)
    }
    return res.json() as Promise<StoredJob>
}

export const deleteJob = async (id: string) => {
    const res = await fetch(`${BASE_URL}/jobs/${id}`, { method: "DELETE" })
    if (!res.ok) {
        throw new Error(`Deleting job failed (status ${res.status})`)
    }
}

export const updateJob = async (id: string, data: JobFormData) => {
    const res = await fetch(`${BASE_URL}/jobs/${id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error(`Updating job failed (status ${res.status})`)
    }
}
