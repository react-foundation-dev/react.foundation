import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border/10 p-20 text-sm text-foreground/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p>
          Copyright © The Linux Foundation®. All rights reserved. The Linux Foundation has
          registered trademarks and uses trademarks. For more information, including terms
          of use, privacy policy, and trademark usage, please see our {" "}
            <Link className="underline hover:text-foreground" href="https://www.linuxfoundation.org/legal/policies?__hstc=262006610.e1a66f67cd0c0baa5c7b042e4f9911ce.1768952497248.1771462813100.1771610134177.3&__hssc=262006610.1.1771610134177&__hsfp=360811d5cbd407fc58d506f8b0aa3133">
              Policies page
            </Link>
          .
        </p>
        <div className="flex flex-wrap gap-6">
          <Link className="transition hover:text-foreground" href="/privacy">
            Privacy
          </Link>
          <Link className="transition hover:text-foreground" href="/terms">
            Terms
          </Link>
          <a className="transition hover:text-foreground" href="#accessibility">
            Accessibility
          </a>
        </div>
      </div>
    </footer>
  );
}
