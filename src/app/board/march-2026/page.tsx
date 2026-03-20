import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "March 2026 Board Meeting — Agenda & Minutes",
  description: "React Foundation Inaugural Board Meeting Agenda & Minutes",
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

const keyDecisions = [
  "Approved preliminary Year 1 budget (iterative, not fixed)",
  "Agreed to year-end public summary (no immediate budget publication)",
  "Appointed Seth Webster as Executive Director (unanimous)",
  "Established meeting cadence: every two months (6/year)",
  "Selected Discord as primary communication platform",
  "Confirmed ReactConf will take place in 2026",
];

type ActionGroup = { owner: string; items: string[] };

const actionsRequired: ActionGroup[] = [
  {
    owner: "All Board Member Organizations",
    items: ["Identify ~2–3 engineers (full-time or partial) to contribute to React / React Native"],
  },
  {
    owner: "Seth Webster (Executive Director)",
    items: [
      "Stand up Discord access and structure",
      "Continue ReactConf planning",
      "Advance community funding model design",
      "Coordinate in-person board meeting",
    ],
  },
  {
    owner: "Meta (Matt Carroll and team)",
    items: [
      "Continue asset migration to Foundation (GitHub, trademarks, accounts)",
      "Progress React Native → GitHub-first transition",
      "Finalize CI/CD transition approach",
    ],
  },
  {
    owner: "Technical Governance Group",
    items: [
      "Finalize governance structure",
      "Nominate representative to Governing Board",
    ],
  },
];

type Attendee = { org: string; name: string; note?: string };

const attending: Attendee[] = [
  { org: "Expo", name: "Brent Vatne" },
  { org: "Callstack", name: "Mike Grabowski" },
  { org: "Huawei", name: "Haibo Li" },
  { org: "Microsoft", name: "Khalef Hosany" },
  { org: "Software Mansion", name: "Magdalena Retman-Rakoczy" },
  { org: "Vercel", name: "Thomas Occhino", note: "left at 11:02 am" },
  { org: "Meta", name: "Matt Carroll" },
];

const notAttending: Attendee[] = [
  { org: "Amazon", name: "Piyush Jain" },
  { org: "Meta", name: "Eli White" },
];

const otherAttendees: Attendee[] = [
  { org: "Software Mansion", name: "Two additional colleagues" },
  { org: "Linux Foundation", name: "Mike Dolan" },
  { org: "Linux Foundation", name: "Todd Benzies" },
  { org: "Linux Foundation", name: "Scott Nicholas" },
];

type MinutesSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  decision?: string;
};

const minutesSections: MinutesSection[] = [
  {
    title: "Call to Order",
    paragraphs: [
      "The meeting commenced at 10:05 am US Eastern Time. Attendance was taken, quorum was assessed, and introductions were made among participants.",
    ],
  },
  {
    title: "Overview",
    paragraphs: [
      "Seth Webster welcomed the Governing Board and provided an overview of the React Foundation's mission, emphasizing stability, community investment, global expansion, and operational maturity in the first year.",
    ],
  },
  {
    title: "Year 1 Budget",
    paragraphs: [
      "Seth presented the proposed Year 1 budget. Discussion included:",
    ],
    bullets: [
      "Alignment between priorities and budget allocation",
      "The importance of supporting community projects and maintainers",
      "CI/CD infrastructure costs and sustainability",
      "Event strategy, including ReactConf and community events",
      "Clarification that CI/CD costs apply only to open source infrastructure and exclude Meta internal systems",
      "Clarification that a prior proposal for Meta to cover Executive Director costs was not approved",
    ],
  },
  {
    title: "Year 1 Budget — Discussion",
    paragraphs: [
      "Matt Carroll confirmed that Meta will cover CI/CD infrastructure costs for 2026 and outlined ongoing work to transition infrastructure to the Foundation.",
      "It was noted that the budget is a preliminary, high-level framework intended to enable operations and will be iterated throughout the year, including reallocation across categories as priorities evolve.",
      "The Governing Board discussed the importance of developing a structured approach to community funding. While not explicitly line-itemed in the initial budget, there was alignment that such a program will be defined and incorporated as it matures.",
      "It was confirmed that ReactConf will take place in 2026. The Board aligned that continuing the event is important to signal continuity and stability following the transition to the Foundation.",
      "Regarding transparency, it was noted that the budget is not required to be public. The Board agreed to provide a summary in a year-end report.",
    ],
    decision: "The Governing Board approved a year-in-review approach for sharing budget information. The Governing Board approved the preliminary Year 1 budget to enable operations, with the understanding that it will be revisited and refined throughout the year. (Unanimous, no abstentions or objections.)",
  },
  {
    title: "Executive Director",
    paragraphs: [
      "Matt Carroll called for a vote to appoint Seth Webster as Executive Director.",
    ],
    decision: "Seth Webster was appointed Executive Director of the React Foundation. (Unanimous, no abstentions or objections.)",
  },
  {
    title: "Governance and Meeting Cadence",
    paragraphs: [
      "The Governing Board agreed to meet every two months (six times per year).",
      "Seth proposed holding an in-person Governing Board meeting to further develop priorities and operational plans.",
    ],
  },
  {
    title: "Communication",
    paragraphs: [
      "A Discord server has been established for Foundation coordination. The Governing Board agreed to:",
    ],
    bullets: [
      "Use Discord as the primary communication channel",
      "Maintain a private channel for Board discussions",
      "Participate actively in ongoing coordination",
    ],
  },
  {
    title: "Program and Activity Updates",
    paragraphs: [
      "Seth provided updates on current activities:",
    ],
    bullets: [
      "Community Advisory Board: Formation underway to represent global community needs and engagement",
      "Asset Transition: Ongoing migration of GitHub repositories, trademarks, domains, and accounts from Meta to the Foundation",
      "React Native: Transition to a GitHub-first development model is planned within the year",
      "Accounts and Infrastructure: A draft migration plan is in development to ensure minimal disruption",
      "ReactConf: Planning has begun; further discussion on goals and direction will occur in a future meeting",
    ],
  },
  {
    title: "Roles and Next Steps",
    paragraphs: [
      "Seth outlined expected shifts in engineering contributions: Meta's engineering investment is expected to evolve over time, and broader ecosystem participation is required to sustain and accelerate development.",
      "Seth requested that each member organization evaluate contributing approximately 2–3 engineers (full-time or partial) to support React and React Native under the Foundation.",
      "Matt Carroll noted that this transition is not only to offset reductions but also to enable faster progress by reducing historical bottlenecks.",
    ],
    bullets: [
      "The need to define priorities across working groups",
      "Development of a coordinated action plan",
      "Alignment between Board governance and technical governance",
    ],
  },
  {
    title: "Technical Governance",
    paragraphs: [
      "Technical governance is being developed as a separate structure from the Governing Board.",
    ],
    bullets: [
      "The technical leadership group has met twice",
      "A governance structure is in progress",
      "A representative from this group will participate in future Governing Board meetings",
    ],
  },
  {
    title: "Closing",
    paragraphs: [
      "With no further business, the meeting was adjourned at 11:05 am US Eastern Time.",
    ],
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
        <SectionHeader title="Agenda" />
        <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm px-6 py-6">
          <div className="relative">
            {agenda.map((item, i) => (
              <AgendaSection key={item.title} index={i + 1} item={item} isLast={i === agenda.length - 1} />
            ))}
          </div>
        </div>

        {/* Minutes */}
        <SectionHeader title="Minutes" className="mt-16" />

        {/* TL;DR */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm px-6 py-6 mb-4">
          <h3 className="text-lg font-bold text-[#23272f] mb-4">TL;DR</h3>

          {/* Key Decisions */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#087ea4] mb-3">Key Decisions</h4>
            <ul className="space-y-2">
              {keyDecisions.map((d) => (
                <li key={d} className="flex items-start gap-3 text-sm text-[#374151]">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#087ea4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions Required */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#b45309] mb-3">Actions Required</h4>
            <div className="space-y-4">
              {actionsRequired.map((group) => (
                <div key={group.owner}>
                  <p className="text-sm font-semibold text-[#23272f] mb-1.5">{group.owner}</p>
                  <ul className="space-y-1.5 ml-1">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-[#374151]">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b45309]/40" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm px-6 py-6 mb-4">
          <h3 className="text-lg font-bold text-[#23272f] mb-4">Attendance</h3>
          <div className="grid gap-6 sm:grid-cols-3">
            <AttendanceList title="Attending" attendees={attending} color="green" />
            <AttendanceList title="Not Attending" attendees={notAttending} color="red" />
            <AttendanceList title="Other Attendees" attendees={otherAttendees} color="gray" />
          </div>
        </div>

        {/* Minutes Sections */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm px-6 py-6">
          <div className="relative">
            {minutesSections.map((section, i) => (
              <MinutesBlock key={section.title} section={section} isLast={i === minutesSections.length - 1} />
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

function SectionHeader({ title, className = "" }: { title: string; className?: string }) {
  return (
    <div className={`mb-4 flex items-center gap-3 ${className}`}>
      <h2 className="text-xl font-extrabold tracking-tight text-[#23272f]">{title}</h2>
      <div className="h-px flex-1 bg-[#e5e7eb]" />
    </div>
  );
}

function AttendanceList({ title, attendees, color }: { title: string; attendees: Attendee[]; color: "green" | "red" | "gray" }) {
  const dotColor = color === "green" ? "bg-emerald-400" : color === "red" ? "bg-red-400" : "bg-gray-400";
  return (
    <div>
      <h4 className="text-sm font-semibold text-[#23272f] mb-2">{title}</h4>
      <ul className="space-y-1.5">
        {attendees.map((a) => (
          <li key={`${a.org}-${a.name}`} className="flex items-start gap-2.5 text-sm text-[#374151]">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotColor}`} />
            <span>
              <span className="font-medium">{a.name}</span>
              <span className="text-[#9ca3af]"> — {a.org}</span>
              {a.note && <span className="text-[#9ca3af] italic"> ({a.note})</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MinutesBlock({ section, isLast }: { section: MinutesSection; isLast: boolean }) {
  return (
    <div className={`${isLast ? "" : "mb-6 pb-6 border-b border-[#f3f4f6]"}`}>
      <h3 className="text-base font-bold text-[#23272f] mb-2">{section.title}</h3>
      {section.paragraphs.map((p, i) => (
        <p key={i} className="text-sm text-[#374151] leading-relaxed mb-2">{p}</p>
      ))}
      {section.bullets && (
        <ul className="space-y-1.5 ml-1 mb-2">
          {section.bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm text-[#374151]">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#087ea4]/40" />
              {b}
            </li>
          ))}
        </ul>
      )}
      {section.decision && (
        <div className="mt-3 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-emerald-800">{section.decision}</span>
        </div>
      )}
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
