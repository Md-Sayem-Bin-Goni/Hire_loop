"use client"

import Link from "next/link"
import { useState } from "react"
import { Loader2, Mail } from "lucide-react"

import { AuthShell } from "@/components/site/auth-shell"
import { PasswordInput } from "@/components/site/password-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

export default function SignInPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")

    try {
      const { data, error } = await authClient.signIn.email({
        email, // required, The email address of the user.
        password, // required, The password of the user.
        callbackURL: "/", // Redirects to home after the user signs in.
      })
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
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your HireLoop account"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-[#8b5cf6] hover:underline"
          >
            Sign Up
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
          <Field>
            <FieldLabel htmlFor="signin-email">Email</FieldLabel>
            <Input
              id="signin-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              className="border-white/10 bg-white/5 placeholder:text-white/30"
            />
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="signin-password">Password</FieldLabel>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-[#8b5cf6] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="signin-password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
              className="pr-10 border-white/10 bg-white/5 placeholder:text-white/30"
            />
          </Field>

          <FieldError errors={[error ? { message: error } : undefined]} />

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-[#5b46f5] text-white hover:bg-[#4c39e8]"
          >
            {loading && <Loader2 data-icon="inline-start" className="animate-spin" />}
            Sign In
          </Button>
        </FieldGroup>
      </form>
    </AuthShell>
  )
}
