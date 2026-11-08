"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Briefcase,
  Loader2,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react"

import { AuthShell } from "@/components/site/auth-shell"
import { PasswordInput } from "@/components/site/password-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { cn } from "@/lib/utils"

const ROLES = [
  {
    value: "seeker",
    label: "Seeker",
    description: "Find and apply to jobs",
    icon: UserRound,
  },
  {
    value: "recruiter",
    label: "Recruiter",
    description: "Post jobs and hire talent",
    icon: Briefcase,
  },
  {
    value: "admin",
    label: "Admin",
    description: "Manage the platform",
    icon: ShieldCheck,
  },
] as const

type Role = (typeof ROLES)[number]["value"]

export default function SignUpPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState<Role>("seeker")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = String(formData.get("name") ?? "")
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")

    try {
      // `role` is a user additional field (input: true) in lib/auth.ts.
      // The untyped client won't accept it statically, so we cast the payload.
      const payload = {
        name, // required, The name of the user.
        email, // required, The email address of the user.
        password, // required, At least 8 characters, max 128 by default.
        role, // "seeker" | "recruiter" | "admin"
        callbackURL: "/", // Redirects to home after the user signs up.
      } as Parameters<typeof authClient.signUp.email>[0]

      const { data, error } = await authClient.signUp.email(payload)
      console.log(data)
      if (error) {
        setError(error.message ?? "Something went wrong. Please try again.")
        return
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }

    console.log(formData)
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start finding your dream job today"
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-medium text-[#8b5cf6] hover:underline"
          >
            Sign In
          </Link>
        </>
      }
    >
      {/* TODO: replace with better-auth social providers */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="border-white/10 bg-white/5 text-white hover:bg-white/10 dark:border-white/10 dark:bg-white/5"
        >
          <Mail data-icon="inline-start" />
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="border-white/10 bg-white/5 text-white hover:bg-white/10 dark:border-white/10 dark:bg-white/5"
        >
          <Mail data-icon="inline-start" />
          GitHub
        </Button>
      </div>

      <form className="mt-6" onSubmit={handleSubmit}>
        <FieldGroup>
          {/* Role selection */}
          <Field>
            <FieldLabel>I am a</FieldLabel>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Account type">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  role="radio"
                  aria-checked={role === r.value}
                  onClick={() => setRole(r.value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-colors",
                    role === r.value
                      ? "border-[#5b46f5] bg-[#5b46f5]/10 text-white"
                      : "border-white/10 bg-white/5 text-white/60 hover:border-white/25 hover:text-white"
                  )}
                >
                  <r.icon
                    className={cn(
                      "size-5",
                      role === r.value ? "text-[#8b5cf6]" : "text-white/40"
                    )}
                  />
                  <span className="text-sm font-medium">{r.label}</span>
                  <span className="text-[10px] leading-tight text-white/40">
                    {r.description}
                  </span>
                </button>
              ))}
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="signup-name">Full Name</FieldLabel>
            <Input
              id="signup-name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="John Doe"
              required
              className="border-white/10 bg-white/5 placeholder:text-white/30"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="signup-email">Email</FieldLabel>
            <Input
              id="signup-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              className="border-white/10 bg-white/5 placeholder:text-white/30"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="signup-password">Password</FieldLabel>
            <PasswordInput
              id="signup-password"
              name="password"
              autoComplete="new-password"
              placeholder="••••••••"
              required
              className="pr-10 border-white/10 bg-white/5 placeholder:text-white/30"
            />
            <FieldDescription className="text-white/40">
              Must be at least 8 characters long.
            </FieldDescription>
          </Field>

          <FieldError errors={[error ? { message: error } : undefined]} />

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-[#5b46f5] text-white hover:bg-[#4c39e8]"
          >
            {loading && <Loader2 data-icon="inline-start" className="animate-spin" />}
            Create Account as {ROLES.find((r) => r.value === role)?.label}
          </Button>
        </FieldGroup>
      </form>
    </AuthShell>
  )
}
