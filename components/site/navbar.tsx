"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { getUserRole, type UserRole } from "@/lib/types/user"

const NAV_LINKS = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
]

/** Dashboard entry point per role. */
const DASHBOARD_BY_ROLE: Record<UserRole, string> = {
  seeker: "/dashboard/seeker",
  recruiter: "/dashboard/recruiter",
  admin: "/dashboard/admin",
}

function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="hireloop home"
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src="/image/logo.png"
        alt="hireloop"
        width={130}
        height={36}
        priority
        className="h-8 w-auto sm:h-9"
      />
    </Link>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { data: session } = authClient.useSession()
  const user = session?.user
  const dashboardHref = user ? DASHBOARD_BY_ROLE[getUserRole(user)] : "/signin"

  async function handleSignOut() {
    await authClient.signOut()
    setOpen(false)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav className="relative mx-auto flex max-w-5xl items-center justify-between rounded-2xl border border-white/5 bg-[#161616] px-4 py-3 shadow-lg shadow-black/5 sm:px-6">

        <Logo />

        {/* Desktop links */}
        <div className="hidden items-center gap-2 md:flex">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <span
            className="mx-3 h-6 w-px bg-white/15"
            aria-hidden="true"
          />

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="max-w-32 truncate px-2 text-sm font-medium text-white/90">
                  {user.name}
                </span>

                <Link
                  href={dashboardHref}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "lg" }),
                    "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  Dashboard
                </Link>

                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white/70 hover:bg-white/5 hover:text-white"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "lg" }),
                    "px-5 text-[#8b5cf6] hover:bg-white/5 hover:text-[#a78bfa]"
                  )}
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "rounded-xl bg-[#5b46f5] px-5 text-white hover:bg-[#4c39e8]"
                  )}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon-lg"
          className="text-white hover:bg-white/10 md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </Button>

        {/* Mobile menu */}
        {open && (
          <div className="absolute inset-x-3 top-[calc(100%-0.75rem)] md:hidden">
            <div className="flex flex-col gap-1 rounded-2xl border border-white/5 bg-[#161616] p-3 shadow-lg shadow-black/10">

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <span
                className="my-2 h-px bg-white/15"
                aria-hidden="true"
              />

              {user ? (
                <>
                  <span className="px-4 py-2.5 text-sm font-medium text-white/90">
                    {user.name}
                  </span>

                  <Link
                    href={dashboardHref}
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "w-full rounded-xl bg-[#5b46f5] text-white hover:bg-[#4c39e8]"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>

                  <Button
                    variant="ghost"
                    size="lg"
                    className="justify-start px-4 text-white/70 hover:bg-white/5 hover:text-white"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#8b5cf6] transition-colors hover:bg-white/5"
                    onClick={() => setOpen(false)}
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/signup"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "mt-1 w-full rounded-xl bg-[#5b46f5] text-white hover:bg-[#4c39e8]"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}