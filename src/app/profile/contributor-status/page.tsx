import type { Metadata } from "next";
import { MaintainerProgress } from "@/features/maintainer-progress/maintainer-progress";
import { MaintainerProgressProvider } from "@/features/maintainer-progress/context";
import { Pill } from "@/components/ui/pill";
import { ecosystemLibraries } from "@/lib/maintainer-tiers";

export const metadata: Metadata = {
  title: "Contributor Status",
  description: "View your contributor status and ecosystem contributions.",
};

export default function ContributorStatusPage() {
  const libraryCount = ecosystemLibraries.length;

  return (
    <div className="space-y-8 pt-12">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-bold text-foreground">Contributor Status</h1>
          <Pill tone="custom" dotColorClassName="bg-amber-400">DEMO DATA</Pill>
          <Pill tone="sky">PREVIEW</Pill>
        </div>
        <p className="mt-2 text-base text-foreground/70">
          Your contributions across {libraryCount} React ecosystem libraries.
        </p>
      </div>

      <MaintainerProgressProvider>
        <div className="rounded-3xl border border-border/10 bg-muted/60 p-8">
          <MaintainerProgress />
        </div>
      </MaintainerProgressProvider>
    </div>
  );
}
