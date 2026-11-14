const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

type JobApplication = {
    jobId: string
    userId: string
    email: string
    jobTitle: string
    companyName: string
}

type ApplicationResponse = {
    insertedId?: string
}

export async function applyToAJob(data: JobApplication): Promise<ApplicationResponse> {
    const response = await fetch(`${BASE_URL}/applications`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        throw new Error(`Application submission failed (status ${response.status}).`)
    }

    return response.json() as Promise<ApplicationResponse>

}