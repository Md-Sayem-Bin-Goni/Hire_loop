import { Navbar } from "@/components/site/navbar"
import { Hero } from "@/components/site/hero"
import { JobDiscovery } from "@/components/site/job-discovery"
import { Features } from "@/components/site/features"
import { Pricing } from "@/components/site/pricing"
import { Cta } from "@/components/site/cta"
import { Footer } from "@/components/site/footer"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col bg-[#080808]">
      <Navbar />
      <Hero />
      <JobDiscovery />
      <Features />
      <Pricing />
      <Cta />
      <Footer />
    </div>
  )
}
