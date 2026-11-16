import { AtmosphericBackground } from "@/components/atmospheric-background";
import { DecorativeFrame } from "@/components/decorative-frame";
import { PageContainer } from "@/components/page-container";
import { SectionHeading } from "@/components/section-heading";
import { socialLinks } from "@/data/social-links";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume — MARC'S WORLD",
};

export default function ResumePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden pt-20 pb-[var(--space-5)] sm:pt-24 sm:pb-[var(--space-6)]">
      <AtmosphericBackground />
      <PageContainer>
        <SectionHeading as="h1" className="mb-[var(--space-5)] text-center text-4xl sm:text-5xl">
          Resume
        </SectionHeading>

        <div className="mx-auto max-w-2xl">
          <DecorativeFrame className="text-center">
            <p className="mb-[var(--space-3)] text-lg text-[var(--color-ivory)]">
              A downloadable resume will be available here soon.
            </p>
            <p className="mb-[var(--space-4)] text-[var(--color-text-muted)]">
              In the meantime, you can explore my projects, experience, and skills through the other
              sections of this portfolio, or connect with me directly.
            </p>

            {/* Action links */}
            <div className="flex flex-wrap justify-center gap-3">
              {socialLinks
                .filter((link) => link.icon === "email" || link.icon === "linkedin")
                .map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.icon === "email" ? undefined : "_blank"}
                    rel={link.icon === "email" ? undefined : "noopener noreferrer"}
                    className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-antique-gold)] bg-[rgb(201_174_120_/_8%)] px-5 py-2.5 text-[var(--color-antique-gold)] no-underline transition-colors hover:bg-[rgb(201_174_120_/_15%)] hover:text-[var(--color-ivory)]"
                  >
                    {link.label === "Email" ? "Get in Touch" : link.label}
                  </a>
                ))}
            </div>
          </DecorativeFrame>

          {/* PDF placeholder note */}
          <p className="mt-[var(--space-4)] text-center text-sm text-[var(--color-text-muted)] italic">
            A PDF resume will be added once finalized. Check back soon.
          </p>
        </div>
      </PageContainer>
    </main>
  );
}
