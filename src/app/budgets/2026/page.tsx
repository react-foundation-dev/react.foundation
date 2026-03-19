import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "2026 Budget",
  description: "React Foundation 2026 Annual Budget",
  robots: { index: false, follow: false },
};

type BudgetLine = {
  name: string;
  glCode?: string;
  budget: number;
  assumption?: string;
};

type BudgetSection = {
  numeral: string;
  title: string;
  lines: BudgetLine[];
};

type RevenueLine = {
  name: string;
  amount: number;
  note?: string;
  tag?: string;
};

const sections: BudgetSection[] = [
  {
    numeral: "I",
    title: "Community Engagement",
    lines: [
      { name: "Marketing Services", glCode: "6358", budget: 42500, assumption: "Estimate on initial marketing costs" },
      { name: "PR Services", glCode: "6310", budget: 42500, assumption: "Estimate on initial PR costs" },
      { name: "Creative Services", glCode: "6322", budget: 7500 },
      { name: "Marketing Operations & Tools", glCode: "6355", budget: 75000 },
      { name: "Social Media Management", glCode: "6420", budget: 0 },
      { name: "Other External Services", glCode: "6373", budget: 0 },
      { name: "Research", glCode: "6410", budget: 0 },
      { name: "Event Participation & Developer Engagement", glCode: "6440", budget: 30000, assumption: "ReactDay or other small events" },
      { name: "Foundation Events", glCode: "6445", budget: 1300000, assumption: "ReactConf Event" },
    ],
  },
  {
    numeral: "II",
    title: "Legal",
    lines: [
      { name: "Trademark", glCode: "6712", budget: 30000, assumption: "In-house TM costs (12 registrations, 2 classes per TM maintenance)" },
      { name: "Export Control", glCode: "6711", budget: 0 },
      { name: "Legal Support", glCode: "6710", budget: 0 },
    ],
  },
  {
    numeral: "III",
    title: "General & Administrative",
    lines: [
      { name: "G&A", glCode: "6920", budget: 237000 },
    ],
  },
  {
    numeral: "IV",
    title: "Staff, Travel & Board",
    lines: [
      { name: "Leadership", glCode: "6365", budget: 664000, assumption: "ED, DevRel, Director Community ($160k)" },
      { name: "Program Management & Operations", glCode: "6364", budget: 85000, assumption: "LF PMO Service" },
      { name: "Sales Support", budget: 0, assumption: "LF Membership Sales Support (Mike Woster's team)" },
      { name: "Staff Travel", glCode: "62XX", budget: 78000, assumption: "~7-10 trips" },
      { name: "Board Meetings", glCode: "626X", budget: 15000 },
      { name: "Misc. Operational Expenses", glCode: "65XX", budget: 5000 },
    ],
  },
  {
    numeral: "V",
    title: "Development",
    lines: [
      { name: "IT Services and Collab Support & Tools", glCode: "6340", budget: 3000, assumption: "LF IT Service (Vercel, etc.)" },
      { name: "CI/CD", budget: 500000, assumption: "TBD — How can Microsoft, Amazon potentially help with CI?" },
      { name: "Hosting & Cloud Services", glCode: "6576", budget: 1000, assumption: "Minimal hosting costs" },
      { name: "Technical Community Comms Platform", glCode: "6570", budget: 100, assumption: "Discord / Slack / Etc" },
      { name: "Community Travel Fund", glCode: "6270", budget: 50000, assumption: "Pending board approval" },
      { name: "Mentorship Program", glCode: "6337", budget: 150000, assumption: "Pending board approval (Stipend based mentorships via LFX)" },
      { name: "Education Materials", glCode: "6376", budget: 50000, assumption: "Working with Clyde — Certification + Agent Improvement" },
      { name: "Meetup Programs", glCode: "6326", budget: 0, assumption: "TBD — How much do we want to spend here" },
    ],
  },
];

const revenues: RevenueLine[] = [
  { name: "Membership Revenue", amount: 1600000, tag: "per annum" },
  { name: "Events Revenue (Sponsorship / Registration)", amount: 1050000, note: "Lost $250k 2025, typically near break even" },
  { name: "Additional Member Contributions", amount: 250000, note: "Meta Family of apps yearly" },
  { name: "Additional Year-1 Contributions", amount: 500000, note: "Surplus from React Conf 2025" },
  { name: "Other Revenues", amount: 50000, note: "Interest on reserves, donations, etc." },
];

const CHART_COLORS = ["#087ea4", "#149eca", "#58c4dc", "#a8d8ea", "#d4edf7"];

function fmt(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function sectionSubtotal(s: BudgetSection): number {
  return s.lines.reduce((sum, l) => sum + l.budget, 0);
}

export default function Budget2026Page() {
  const totalExpenses = sections.reduce((sum, s) => sum + sectionSubtotal(s), 0);
  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
  const surplus = totalRevenue - totalExpenses;

  const chartData = sections.map((s, i) => ({
    label: s.title,
    value: sectionSubtotal(s),
    pct: (sectionSubtotal(s) / totalExpenses) * 100,
    color: CHART_COLORS[i],
  }));

  // largest category
  const largest = chartData.reduce((a, b) => (a.value > b.value ? a : b));

  // cumulative offsets for donut
  let cumOffset = 0;
  const donutSegments = chartData.map((d) => {
    const seg = { ...d, offset: cumOffset };
    cumOffset += d.pct;
    return seg;
  });

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-24 pb-20">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
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
              <p className="text-base text-[#6b7280]">2026 Annual Budget</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Total Expenses" value={fmt(totalExpenses)} detail="Across 5 categories" />
          <SummaryCard label="Total Revenue" value={fmt(totalRevenue)} detail="6 revenue streams" valueClass="text-[#087ea4]" />
          <SummaryCard label="Budget Surplus" value={fmt(surplus)} detail="2.4% margin" valueClass="text-[#16a34a]" />
          <SummaryCard label="Largest Category" value={`$${(largest.value / 1e6).toFixed(2)}M`} detail={largest.label} />
        </div>

        {/* Donut Chart */}
        <div className="mb-12 flex flex-col items-center gap-12 rounded-2xl border border-[#e5e7eb] bg-white p-8 shadow-sm md:flex-row">
          <div className="relative h-[220px] w-[220px] shrink-0">
            <svg viewBox="0 0 42 42" className="h-full w-full" style={{ transform: "rotate(-90deg)" }}>
              {donutSegments.map((seg) => (
                <circle
                  key={seg.label}
                  r="15.9"
                  cx="21"
                  cy="21"
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth="5"
                  strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
                  strokeDashoffset={`${-seg.offset}`}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[11px] font-medium uppercase tracking-wide text-[#9ca3af]">Total</span>
              <span className="text-[22px] font-extrabold text-[#23272f]">${(totalExpenses / 1e6).toFixed(2)}M</span>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-8">
            {chartData.map((d) => (
              <div key={d.label} className="flex items-center gap-2.5">
                <div className="h-3 w-3 shrink-0 rounded" style={{ background: d.color }} />
                <span className="text-[13px] text-[#4b5563]">{d.label}</span>
                <span className="ml-auto font-semibold tabular-nums text-[#1f2937]">{fmt(d.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <BudgetSectionBlock key={section.numeral} section={section} />
          ))}
        </div>

        {/* Revenue */}
        <div className="mt-12">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#16a34a] text-sm font-bold text-white">$</div>
            <h2 className="text-xl font-bold text-[#23272f]">Revenue</h2>
            <span className="ml-auto text-xl font-bold tabular-nums text-[#16a34a]">{fmt(totalRevenue)}</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {revenues.map((r) => (
              <div key={r.name} className="relative flex items-center justify-between overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white px-6 py-5 shadow-sm transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-md">
                {r.tag && (
                  <span className="absolute top-[10px] right-[-28px] rotate-45 bg-[#087ea4] px-8 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                    {r.tag}
                  </span>
                )}
                <div>
                  <p className="text-sm font-medium text-[#374151]">{r.name}</p>
                  {r.note && <p className="mt-0.5 text-xs text-[#9ca3af]">{r.note}</p>}
                </div>
                <span className="text-xl font-bold tabular-nums text-[#087ea4]">{fmt(r.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 rounded-[20px] bg-gradient-to-br from-[#23272f] to-[#1a3a4a] px-10 py-8 shadow-xl sm:flex-row">
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider text-white/60">Budget Summary</h3>
            <div className="mt-2 flex gap-12">
              <div>
                <p className="text-xs text-white/50">Total Expenses</p>
                <p className="text-2xl font-bold tabular-nums text-white">{fmt(totalExpenses)}</p>
              </div>
              <div>
                <p className="text-xs text-white/50">Total Revenue</p>
                <p className="text-2xl font-bold tabular-nums text-white">{fmt(totalRevenue)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-[#16a34a] px-8 py-4 text-[28px] font-extrabold tabular-nums text-white tracking-tight">
            +{fmt(surplus)}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, detail, valueClass }: { label: string; value: string; detail: string; valueClass?: string }) {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white px-6 py-6 shadow-sm transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-[13px] font-medium uppercase tracking-wide text-[#6b7280]">{label}</p>
      <p className={`mt-2 text-[28px] font-bold tracking-tight tabular-nums ${valueClass ?? "text-[#111827]"}`}>{value}</p>
      <p className="mt-1 text-xs text-[#9ca3af]">{detail}</p>
    </div>
  );
}

function BudgetSectionBlock({ section }: { section: BudgetSection }) {
  const subtotal = sectionSubtotal(section);

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#087ea4] text-sm font-bold text-white">
          {section.numeral}
        </div>
        <h2 className="text-xl font-bold text-[#23272f]">{section.title}</h2>
        <span className="ml-auto text-xl font-bold tabular-nums text-[#23272f]">{fmt(subtotal)}</span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Line Item</th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">GL Code</th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Budget</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Assumptions</th>
            </tr>
          </thead>
          <tbody>
            {section.lines.map((line) => (
              <tr key={line.name} className="border-b border-[#f3f4f6] transition-colors hover:bg-[#f9fafb]">
                <td className="px-5 py-3.5 text-sm font-medium text-[#1f2937]">{line.name}</td>
                <td className="px-5 py-3.5 text-right font-mono text-xs text-[#9ca3af]">{line.glCode ?? ""}</td>
                <td className={`px-5 py-3.5 text-right text-sm font-semibold tabular-nums ${line.budget === 0 ? "text-[#d1d5db]" : "text-[#1f2937]"}`}>
                  {fmt(line.budget)}
                </td>
                <td className="px-5 py-3.5 text-[13px] text-[#6b7280] max-w-[400px]">{line.assumption ?? ""}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-[#e5e7eb] bg-[#f9fafb]">
              <td className="px-5 py-3.5 text-sm font-bold text-[#1f2937]">Subtotal</td>
              <td />
              <td className="px-5 py-3.5 text-right text-[15px] font-bold tabular-nums text-[#23272f]">{fmt(subtotal)}</td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
