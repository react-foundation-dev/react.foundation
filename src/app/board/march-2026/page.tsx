import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "March 2026 Board Meeting — Agenda",
  description: "React Foundation Inaugural Board Meeting Agenda",
  robots: { index: false, follow: false },
};

type AgendaItem = {
  title: string;
  bullets?: (string | { text: string; link?: string; sub?: string[] })[];
  vote?: string;
};

const agenda: AgendaItem[] = [
  {
    title: "Call to Order",
    bullets: [
      "Welcome and opening remarks",
      "Introductions",
      "Confirmation of quorum",
    ],
  },
  {
    title: "Overview of the React Foundation",
    bullets: [
      "Foundation structure within the Linux Foundation",
      "Initial priorities and objectives",
    ],
  },
  {
    title: "Presentation and Discussion of the Year 1 Budget",
    bullets: [
      { text: "Walkthrough of the proposed foundation budget", link: "/budgets/2026", sub: [] },
      "Board discussion and questions",
    ],
    vote: "Motion to approve FY1 budget",
  },
  {
    title: "Executive Director Appointment",
    bullets: [
      "Confirmation of the Executive Director role",
    ],
    vote: "Motion to appoint Executive Director",
  },
  {
    title: "Governance and Meeting Cadence",
    bullets: [
      "Proposed cadence for board meetings",
      "Communication and decision-making between meetings",
    ],
  },
  {
    title: "Program and Activity Updates",
    bullets: [
      {
        text: "Overview of activities currently underway",
        sub: [
          "Technical — Migration of assets into RF control (repos, trademarks, accounts, etc.)",
          "Need company-based TSC nominations",
          "Community — Michelle Bakels — Community Advisory Board",
        ],
      },
      {
        text: "Upcoming events and opportunities",
        sub: [
          "React Conf",
          "Huawei / Beijing",
        ],
      },
    ],
  },
  {
    title: "Roles and Next Steps",
    bullets: [
      "Priority areas for board involvement",
      "Potential working groups or committees",
      {
        text: "Immediate next actions",
        sub: [
          "Provide TSC member",
          "Specific engineering commitments",
        ],
      },
    ],
  },
  {
    title: "Open Discussion",
    bullets: [
      "Add agenda items here",
    ],
  },
  {
    title: "Adjournment",
  },
];

export default function BoardMeetingAgendaPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] pt-24 pb-20">
      <div className="mx-auto max-w-[900px] px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex items-center gap-3">
            <svg className="h-12 w-12" viewBox="-11.5 -10.232 23 20.463">
              <circle r="2.05" fill="#087ea4" />
              <g stroke="#087ea4" strokeWidth="1" fill="none">
                <ellipse rx="11" ry="4.2" />
                <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                <ellipse rx="11" ry="4.2" transform="rotate(120)" />
              </g>
            </svg>
            <div className="text-left">
              <h1 className="text-[32px] font-extrabold tracking-tight text-[#23272f]">
                React Foundation
              </h1>
              <p className="text-base text-[#6b7280]">Inaugural Board Meeting — March 20, 2026</p>
            </div>
          </div>
          <div className="mx-auto max-w-xl">
            <a
              href="https://docs.google.com/document/d/1MzEZ3gEPCqxmaLvwTbHCoG4xDwwVVc8z8y952wRHmLA/edit?tab=t.0"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#374151] shadow-sm transition-colors hover:bg-[#f3f4f6]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              Open in Google Docs
            </a>
          </div>
        </div>

        {/* Agenda Items */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm px-6 py-6">
          <div className="relative">
            {agenda.map((item, i) => (
              <AgendaSection key={item.title} index={i + 1} item={item} isLast={i === agenda.length - 1} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-[20px] bg-gradient-to-br from-[#23272f] to-[#1a3a4a] px-10 py-8 shadow-xl sm:flex-row">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-white/60">Prepared by</p>
            <p className="mt-1 text-xl font-bold text-white">Seth Webster</p>
          </div>
          <div className="flex gap-10">
            <div>
              <p className="text-xs text-white/50">Date</p>
              <p className="text-base font-semibold tabular-nums text-white/80">March 20, 2026</p>
            </div>
            <div>
              <p className="text-xs text-white/50">Location</p>
              <p className="text-base font-semibold text-white/80">Zoom</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgendaSection({ index, item, isLast }: { index: number; item: AgendaItem; isLast: boolean }) {
  const hasBullets = item.bullets && item.bullets.length > 0;
  const hasVote = !!item.vote;

  return (
    <div className="relative flex gap-5">
      {/* Timeline rail */}
      <div className="flex flex-col items-center">
        <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#087ea4] text-sm font-bold text-white shadow-md shadow-[#087ea4]/20">
          {index}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-[#087ea4]/30 to-[#087ea4]/10" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 ${isLast ? "pb-0" : "pb-8"}`}>
        <h2 className="mt-1.5 text-lg font-bold text-[#23272f]">{item.title}</h2>

        {(hasBullets || hasVote) && (
          <div className="mt-3">
            {hasBullets && (
              <ul className="space-y-2.5">
                {item.bullets!.map((bullet) => {
                  if (typeof bullet === "string") {
                    return (
                      <li key={bullet} className="flex items-start gap-3 text-sm text-[#374151]">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#087ea4]/40" />
                        {bullet}
                      </li>
                    );
                  }
                  return (
                    <li key={bullet.text} className="space-y-2">
                      <div className="flex items-start gap-3 text-sm font-medium text-[#374151]">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#087ea4]/40" />
                        {bullet.link ? (
                          <Link href={bullet.link} className="!text-[#087ea4] underline underline-offset-2 decoration-[#087ea4]/40 hover:!text-[#065a78] hover:decoration-[#065a78]">
                            {bullet.text}
                          </Link>
                        ) : (
                          bullet.text
                        )}
                      </div>
                      {bullet.sub && bullet.sub.length > 0 && (
                        <ul className="ml-6 space-y-1.5">
                          {bullet.sub.map((s) => (
                            <li key={s} className="flex items-start gap-2.5 text-[13px] text-[#6b7280]">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#9ca3af]/50" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            {hasVote && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#087ea4]/20 bg-[#087ea4]/5 px-4 py-3">
                <svg className="h-5 w-5 shrink-0 text-[#087ea4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-[#087ea4]">
                  Board Vote: {item.vote}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
