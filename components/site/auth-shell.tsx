import Link from "next/link"
import Image from "next/image"

import { cn } from "@/lib/utils"

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  className,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  footer: React.ReactNode
  className?: string
}) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-[#080808] px-4 py-14 text-white">
      <Link href="/" className="mb-8">
        <Image
          src="/image/logo.png"
          alt="hireloop"
          width={130}
          height={36}
          priority
          className="h-9 w-auto"
        />
      </Link>

      <div
        className={cn(
          "w-full max-w-sm rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-lg shadow-black/40 sm:p-8",
          className
        )}
      >
        <h1 className="text-center text-xl font-semibold sm:text-2xl">
          {title}
        </h1>
        <p className="mt-2 text-center text-sm text-white/50">{subtitle}</p>
        <div className="mt-6">{children}</div>
        <div className="mt-6 text-center text-sm text-white/50">{footer}</div>
      </div>
    </main>
  )
}
