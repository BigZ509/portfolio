import Link from "next/link";
import { AtmosphericBackground } from "@/components/atmospheric-background";
import { DecorativeFrame } from "@/components/decorative-frame";
import { PageContainer } from "@/components/page-container";
import { SectionHeading } from "@/components/section-heading";

export default function Home() {
  return (
    <main className="relative isolate flex min-h-screen items-center overflow-hidden bg-[var(--color-near-black)] pt-16 pb-[var(--space-5)]">
      <AtmosphericBackground />
      <PageContainer className="flex justify-center">
        <DecorativeFrame className="w-full max-w-3xl text-center">
          <SectionHeading as="h1" className="text-5xl tracking-[0.09em] sm:text-7xl md:text-8xl">
            AFTERIMAGE
          </SectionHeading>
          <p className="mx-auto mt-[var(--space-3)] max-w-lg text-lg leading-relaxed text-[var(--color-text-muted)]">
            Engineer · Builder · Creator
          </p>
          <div className="mt-[var(--space-4)] flex flex-wrap justify-center gap-3">
            <Link
              href="/projects"
              className="inline-block rounded-[var(--radius-md)] border border-[var(--color-antique-gold)] bg-[rgb(201_174_120_/_8%)] px-6 py-2.5 text-[var(--color-antique-gold)] no-underline transition-colors hover:bg-[rgb(201_174_120_/_15%)] hover:text-[var(--color-ivory)]"
            >
              View Projects
            </Link>
            <Link
              href="/about"
              className="inline-block rounded-[var(--radius-md)] border border-[rgb(201_174_120_/_20%)] px-6 py-2.5 text-[var(--color-text-muted)] no-underline transition-colors hover:border-[var(--color-antique-gold)] hover:text-[var(--color-ivory)]"
            >
              About Me
            </Link>
          </div>
        </DecorativeFrame>
      </PageContainer>
    </main>
  );
}
