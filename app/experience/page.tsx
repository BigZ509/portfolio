import { AtmosphericBackground } from "@/components/atmospheric-background";
import { DecorativeFrame } from "@/components/decorative-frame";
import { PageContainer } from "@/components/page-container";
import { SectionHeading } from "@/components/section-heading";
import { experiences } from "@/data/experience";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience — AFTERIMAGE",
};

export default function ExperiencePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden pt-20 pb-[var(--space-5)] sm:pt-24 sm:pb-[var(--space-6)]">
      <AtmosphericBackground />
      <PageContainer>
        <SectionHeading as="h1" className="mb-[var(--space-5)] text-center text-4xl sm:text-5xl">
          Experience
        </SectionHeading>

        <div className="mx-auto max-w-3xl">
          {/* Timeline */}
          <ol className="relative border-l border-[rgb(201_174_120_/_20%)] pl-0 list-none">
            {experiences.map((exp) => (
              <li key={exp.id} className="mb-[var(--space-4)] ml-6 last:mb-0">
                {/* Timeline dot */}
                <span
                  aria-hidden="true"
                  className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full border border-[var(--color-antique-gold)] bg-[var(--color-near-black)]"
                />

                <DecorativeFrame>
                  <div className="mb-[var(--space-1)] flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-ivory)]">
                      {exp.role}
                    </h2>
                    <span className="text-sm text-[var(--color-antique-gold)]">
                      {exp.startDate}
                      {exp.endDate ? ` — ${exp.endDate}` : " — Present"}
                    </span>
                  </div>

                  <p className="mb-[var(--space-2)] text-sm text-[var(--color-text-muted)]">
                    {exp.organization}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </p>

                  <p className="leading-relaxed text-[var(--color-text-muted)]">
                    {exp.description}
                  </p>

                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-[var(--space-2)] list-none space-y-1 pl-0">
                      {exp.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-antique-gold)]"
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </DecorativeFrame>
              </li>
            ))}
          </ol>

          {/* Note about placeholder */}
          <p className="mt-[var(--space-4)] text-center text-sm text-[var(--color-text-muted)] italic">
            Experience details are being finalized and will be updated with verified information.
          </p>
        </div>
      </PageContainer>
    </main>
  );
}
