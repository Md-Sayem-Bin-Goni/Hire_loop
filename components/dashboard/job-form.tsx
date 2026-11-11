"use client"

/**
 * Shared "Post a New Job" form used by BOTH the create page
 * (app/dashboard/recruiter/jobs/new/page.tsx) and the edit page
 * (app/dashboard/recruiter/jobs/[jobId]/edit/page.tsx).
 *
 * STRUCTURE (3 numbered sections):
 *  1. Basic Information — title, company, category, job type pills
 *  2. Location, Compensation & Timeline — remote switch, location, deadline, salary
 *  3. Responsibilities & Requirements — two textareas
 *
 * The page owns the submit handler; this component only manages field state.
 */

import { useState } from "react"

import { Building2, Calendar, MapPin } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { SectionCard } from "@/components/dashboard/page-shell"
import { Field } from "@/components/shared/field"
import { PillGroup } from "@/components/shared/pill-group"
import {
    JOB_CATEGORIES,
    JOB_TYPES,
    SALARY_FREQUENCIES,
    type JobFormData,
    type JobType,
} from "@/lib/types/jobs"

const inputClass = "surface-field focus-visible:ring-[#5C53FE]/30"

export function JobForm({
    initial,
    formId = "job-form",
    submitLabel = "Publish Job",
    loading = false,
    onSubmit,
}: {
    initial: JobFormData
    formId?: string
    submitLabel?: string
    loading?: boolean
    onSubmit: (data: JobFormData) => void | Promise<void>
}) {
    const [form, setForm] = useState<JobFormData>(initial)

    // Generic flat setter so every field is just set("key")(value).
    const set =
        <K extends keyof JobFormData>(key: K) =>
            (value: JobFormData[K]) =>
                setForm((prev) => ({ ...prev, [key]: value }))

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        await onSubmit({ ...form })
    }

    return (
        <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* 1. Basic Information */}
                <SectionCard index={1} title="Basic Information">
                    <div className="flex flex-col gap-5">
                        {/* Job Title */}
                        <Field label="Job title" htmlFor="title" required>
                            <Input
                                id="title"
                                name="title"
                                required
                                minLength={3}
                                maxLength={80}
                                value={form.title}
                                onChange={(e) => set("title")(e.target.value)}
                                placeholder="e.g. Senior Product Designer"
                                className={inputClass}
                            />
                        </Field>

                        {/* Company Name & Job Category */}
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Company name" htmlFor="companyName" required>
                                <div className="relative">
                                    <Building2
                                        aria-hidden
                                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/50"
                                    />
                                    <Input
                                        id="companyName"
                                        name="companyName"
                                        required
                                        value={form.companyName}
                                        onChange={(e) => set("companyName")(e.target.value)}
                                        placeholder="Acme Inc."
                                        className={`${inputClass} pl-9`}
                                    />
                                </div>
                            </Field>
                            <Field label="Job category" htmlFor="category" required>
                                <Select value={form.category} onValueChange={(value) => set("category")(value)}>
                                    <SelectTrigger id="category" className={inputClass}>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {JOB_CATEGORIES.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>

                        {/* Job Type pills */}
                        <fieldset className="flex flex-col gap-2">
                            <legend className="text-sm text-white/80">Job type</legend>
                            <PillGroup
                                name="job-type"
                                value={form.jobType}
                                onChange={(value) => set("jobType")(value.toLowerCase() as JobType)}
                                options={JOB_TYPES.map((type) => ({ value: type.toLowerCase(), label: type }))}
                                className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                                pillClassName="h-11 justify-center capitalize"
                            />
                        </fieldset>
                    </div>
                </SectionCard>

                {/* 2. Location, Compensation & Timeline */}
                <SectionCard index={2} title="Location, Compensation &amp; Timeline">
                    <div className="flex flex-col gap-5">
                        {/* Remote Work Allowed (isRemote) */}
                        <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 p-4">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="isRemote" className="text-white/90">
                                    Remote work allowed
                                </Label>
                                <p className="text-xs text-white/50">
                                    Enable worldwide or distributed candidate applications
                                </p>
                            </div>
                            <Switch
                                id="isRemote"
                                checked={form.isRemote}
                                onCheckedChange={(checked) => set("isRemote")(checked)}
                            />
                        </div>

                        {/* Job Location & Application Deadline */}
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field
                                label="Job location"
                                htmlFor="location"
                                required={!form.isRemote}
                                hint={form.isRemote ? "Not required (remote)" : "Required"}
                            >
                                <div className="relative">
                                    <MapPin
                                        aria-hidden
                                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/50"
                                    />
                                    <Input
                                        id="location"
                                        name="location"
                                        required={!form.isRemote}
                                        value={form.location}
                                        onChange={(e) => set("location")(e.target.value)}
                                        placeholder="e.g. New York, USA"
                                        className={`${inputClass} pl-9`}
                                    />
                                </div>
                            </Field>
                            <Field label="Application deadline" htmlFor="deadline">
                                <div className="relative">
                                    <Calendar
                                        aria-hidden
                                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/50"
                                    />
                                    <Input
                                        id="deadline"
                                        name="deadline"
                                        type="date"
                                        value={form.deadline}
                                        onChange={(e) => set("deadline")(e.target.value)}
                                        className={`${inputClass} pl-9 [color-scheme:dark]`}
                                    />
                                </div>
                            </Field>
                        </div>

                        {/* Salary Range (minSalary & maxSalary) */}
                        <div className="grid gap-5 sm:grid-cols-[1fr_1fr_auto] sm:items-start">
                            <Field label="Min salary / rate" htmlFor="minSalary" required>
                                <div className="relative">
                                    <span aria-hidden className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-white/50">
                                        €
                                    </span>
                                    <Input
                                        id="minSalary"
                                        name="minSalary"
                                        type="number"
                                        min={0}
                                        required
                                        placeholder="25"
                                        value={form.minSalary}
                                        onChange={(e) => set("minSalary")(e.target.value)}
                                        className={`${inputClass} pl-7`}
                                    />
                                </div>
                            </Field>
                            <Field label="Max salary / rate" htmlFor="maxSalary" required>
                                <div className="relative">
                                    <span aria-hidden className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-white/50">
                                        €
                                    </span>
                                    <Input
                                        id="maxSalary"
                                        name="maxSalary"
                                        type="number"
                                        min={0}
                                        required
                                        placeholder="40"
                                        value={form.maxSalary}
                                        onChange={(e) => set("maxSalary")(e.target.value)}
                                        className={`${inputClass} pl-7`}
                                    />
                                </div>
                            </Field>
                            <Field label="Frequency" htmlFor="salaryFrequency">
                                <Select
                                    value={form.salaryFrequency}
                                    onValueChange={(value) => set("salaryFrequency")(value as JobFormData["salaryFrequency"])}
                                >
                                    <SelectTrigger id="salaryFrequency" className={inputClass}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SALARY_FREQUENCIES.map((frequency) => (
                                            <SelectItem key={frequency} value={frequency}>
                                                {frequency}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>
                    </div>
                </SectionCard>

                {/* 3. Responsibilities & Requirements */}
                <SectionCard index={3} title="Responsibilities &amp; Requirements">
                    <div className="flex flex-col gap-5">
                        <Field label="Key responsibilities" htmlFor="responsibilities" required>
                            <Textarea
                                id="responsibilities"
                                name="responsibilities"
                                required
                                rows={5}
                                maxLength={2000}
                                placeholder="Describe the key responsibilities of the role…"
                                value={form.responsibilities}
                                onChange={(e) => set("responsibilities")(e.target.value)}
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Qualifications &amp; requirements" htmlFor="requirements" required>
                            <Textarea
                                id="requirements"
                                name="requirements"
                                required
                                rows={5}
                                maxLength={2000}
                                placeholder={"• 3+ years of experience with…\n• Solid understanding of…"}
                                value={form.requirements}
                                onChange={(e) => set("requirements")(e.target.value)}
                                className={inputClass}
                            />
                        </Field>
                    </div>
                </SectionCard>
            </form>
    )
}
