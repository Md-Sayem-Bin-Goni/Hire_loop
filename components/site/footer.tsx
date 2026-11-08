import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5V11H8.5v3H11v7h2.5Z" />
    </svg>
  )
}

function DribbbleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M5.5 9.5c4 1 8.8.5 12-2M8 19c1.5-4.5 4.5-8 8.5-9.5M3.6 13.6c5-1 10.2.6 13 4" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.9 8.5H4.2V20h2.7V8.5ZM5.5 7.2A1.6 1.6 0 1 0 5.5 4a1.6 1.6 0 0 0 0 3.2ZM10 20h2.7v-6c0-1.1.6-2 1.9-2 1.2 0 1.7.8 1.7 2v6H19v-6.6c0-2.8-1.5-4.1-3.6-4.1-1.7 0-2.4.9-2.7 1.5V8.5H10V20Z" />
    </svg>
  )
}

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Job discovery", href: "/jobs" },
      { label: "Worker AI", href: "/jobs" },
      { label: "Companies", href: "/company" },
      { label: "Salary data", href: "/jobs" },
    ],
  },
  {
    title: "Navigations",
    links: [
      { label: "Help center", href: "/" },
      { label: "Career library", href: "/" },
      { label: "Contact", href: "/" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Brand Guideline", href: "/" },
      { label: "Newsroom", href: "/" },
    ],
  },
]

const SOCIALS = [
  { icon: FacebookIcon, label: "Facebook", href: "/" },
  { icon: DribbbleIcon, label: "Dribbble", href: "/", highlighted: true },
  { icon: LinkedinIcon, label: "LinkedIn", href: "/" },
]

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("bg-[#080808] text-white", className)}>
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-16">
        <div className="grid gap-12 md:grid-cols-[1.3fr_2fr]">
          {/* Brand */}
          <div>
            <Image
              src="/image/logo.png"
              alt="hireloop"
              width={130}
              height={36}
              className="h-9 w-auto"
            />
            <p className="mt-5 max-w-xs text-sm/relaxed text-white/50">
              The AI-native career platform. Built for people who take their
              work seriously.
            </p>

            <div className="mt-16 flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, label, href, highlighted }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg text-sm transition-colors",
                    highlighted
                      ? "bg-[#5b46f5] text-white hover:bg-[#4c39e8]"
                      : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                  )}
                >
                  <Icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_COLUMNS.map((column, i) => (
              <div key={column.title} className={cn(i === 0 && "sm:pl-4")}>
                <h3 className="text-sm font-semibold text-[#8b5cf6]">
                  {column.title}
                </h3>
                <ul className="mt-5 space-y-3.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-end gap-4 sm:flex-row sm:gap-6">
          <p className="text-xs text-white/40 sm:text-sm">
            Copyright 2024 — Programming Hero
          </p>
          <div className="flex items-center gap-3 text-xs text-white/40 sm:text-sm">
            <Link href="/" className="transition-colors hover:text-white">
              Terms &amp; Policy
            </Link>
            <span aria-hidden>-</span>
            <Link href="/" className="transition-colors hover:text-white">
              Privacy Guideline
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
