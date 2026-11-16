import { AtmosphericBackground } from "@/components/atmospheric-background";
import { PageContainer } from "@/components/page-container";
import { ProjectCarousel } from "@/components/project-carousel";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden pt-20 pb-[var(--space-5)] sm:pt-24 sm:pb-[var(--space-6)]">
      <AtmosphericBackground />
      <PageContainer>
        <SectionHeading as="h1" className="mb-[var(--space-5)] text-center text-4xl sm:text-5xl">
          Projects
        </SectionHeading>
        <ProjectCarousel projects={projects} />
      </PageContainer>
    </main>
  );
}
