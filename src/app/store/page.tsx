import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Store | Coming Soon",
  description: "Our store is currently coming soon.",
};

export default function StorePage() {
  return (
    <div className="min-h-screen bg-background pt-24 text-muted-foreground">
      <div className="absolute inset-x-0 top-[-6rem] -z-10 flex justify-center blur-3xl">
        <div className="h-[24rem] w-[60rem] bg-gradient-to-r from-cyan-500 via-yellow-300 to-orange-500 opacity-30" />
      </div>

      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center sm:px-8">
        <div className="space-y-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            Store
          </p>
          <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">
            Coming Soon
          </h1>
          <p className="mx-auto max-w-xl text-lg text-foreground/75">
            We&apos;re preparing a new store experience.
            Until then, this page is a placeholder while we finalize product drops,
            collections, and impact-based perks.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ButtonLink href="/" variant="secondary" size="lg">
              Back to Home
            </ButtonLink>
            <Link
              href="/about"
              className="inline-flex rounded-full border-2 border-border px-6 py-3 text-sm font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            >
              Learn About the Foundation
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
