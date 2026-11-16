import { HomeEnvironment } from "@/components/home-environment";
import { HomeIntro } from "@/components/home-intro";

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[var(--color-near-black)]">
      <HomeEnvironment />
      <HomeIntro />
    </main>
  );
}
