"use client";
import React, { useState } from "react";

interface TimelineEvent {
    year: number;
    content: string;
    color?: string;
    type?: string;
    countries?: string[];
}

interface TimelineProps {
    events: TimelineEvent[];
    /** Marks the first event as the most recent one. Only meaningful on the first page. */
    highlightLatest?: boolean;
    /** The full list that `events` was cut from, so each year's total can be shown. Defaults to `events`. */
    allEvents?: TimelineEvent[];
    /** Position of the first shown event within `allEvents` (0 on the first page). */
    offset?: number;
}

// Tailwind needs full class names at build time, so each tone is spelled out.
const TONES = {
    green: {
        dot: "bg-primary",
        chip: "bg-primary/10 text-primary ring-primary/20",
        card: "hover:border-primary/40",
        line: "via-primary/60",
    },
    blue: {
        dot: "bg-sky-500",
        chip: "bg-sky-50 text-sky-700 ring-sky-600/20",
        card: "hover:border-sky-300",
        line: "via-sky-400/60",
    },
    yellow: {
        dot: "bg-amber-500",
        chip: "bg-amber-50 text-amber-700 ring-amber-600/20",
        card: "hover:border-amber-300",
        line: "via-amber-400/60",
    },
    purple: {
        dot: "bg-violet-500",
        chip: "bg-violet-50 text-violet-700 ring-violet-600/20",
        card: "hover:border-violet-300",
        line: "via-violet-400/60",
    },
    gray: {
        dot: "bg-slate-400",
        chip: "bg-slate-100 text-slate-600 ring-slate-500/20",
        card: "hover:border-slate-300",
        line: "via-slate-400/60",
    },
} as const;

const COLLAPSED_COUNTRIES = 8;

const toneFor = (color?: string) => TONES[(color ?? "gray") as keyof typeof TONES] ?? TONES.gray;

// Labels that read badly when generated from the type name
const LABELS: Record<string, string> = {
    "entry-force": "Entry into force",
    "enrollment-milestone": "Enrolment milestone",
    "enrollment-launch": "Enrolment launch",
    "program-launch": "Programme launch",
};

// "national-law" -> "National law"
const labelFor = (type?: string) => {
    if (!type) return "Milestone";
    if (LABELS[type]) return LABELS[type];
    const text = type.replace(/-/g, " ");
    return text.charAt(0).toUpperCase() + text.slice(1);
};

const EventCard: React.FC<{ event: TimelineEvent; isLatest: boolean }> = ({ event, isLatest }) => {
    const [expanded, setExpanded] = useState(false);
    const tone = toneFor(event.color);
    const countries = event.countries ?? [];
    const visible = expanded ? countries : countries.slice(0, COLLAPSED_COUNTRIES);
    const hidden = countries.length - visible.length;

    return (
        <div className="group relative pl-6 md:pl-8">
            {/* Rail node */}
            <span
                aria-hidden="true"
                className={`absolute -left-px top-6 h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-white transition-transform duration-300 group-hover:scale-125 ${tone.dot}`}
            />

            <article
                className={`relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md ${tone.card}`}
            >
                <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${tone.line}`}
                />

                <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${tone.chip}`}
                    >
                        <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                        {labelFor(event.type)}
                    </span>
                    {isLatest && (
                        <span className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-semibold text-secondary ring-1 ring-inset ring-secondary/25">
                            Latest
                        </span>
                    )}
                </div>

                <p className="text-sm leading-relaxed text-slate-700 lg:text-[15px]">{event.content}</p>

                {countries.length > 0 && (
                    <div className="mt-4 border-t border-slate-100 pt-4">
                        <ul aria-label="Countries" className="flex flex-wrap gap-1.5">
                            {visible.map((country) => (
                                <li
                                    key={country}
                                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600"
                                >
                                    {country}
                                </li>
                            ))}
                            {countries.length > COLLAPSED_COUNTRIES && (
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => setExpanded((v) => !v)}
                                        aria-expanded={expanded}
                                        className="cursor-pointer rounded-full px-2.5 py-0.5 text-xs font-semibold text-primary hover:bg-primary/10"
                                    >
                                        {expanded ? "Show less" : `+${hidden} more`}
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </article>
        </div>
    );
};

const TimelineComponent: React.FC<TimelineProps> = ({ events, highlightLatest = false, allEvents = events, offset = 0 }) => {
    // A year can run over onto the next page, so its total comes from the full list, not from this page
    const yearTotals = allEvents.reduce<Record<number, number>>((totals, event) => {
        totals[event.year] = (totals[event.year] ?? 0) + 1;
        return totals;
    }, {});
    const continuesFromPreviousPage = offset > 0 && allEvents[offset - 1]?.year === events[0]?.year;

    // Events arrive newest first; group consecutive entries that share a year.
    const groups = events.reduce<{ year: number; items: { event: TimelineEvent; index: number }[] }[]>(
        (acc, event, index) => {
            const last = acc[acc.length - 1];
            if (last && last.year === event.year) last.items.push({ event, index });
            else acc.push({ year: event.year, items: [{ event, index }] });
            return acc;
        },
        []
    );

    return (
        <ol className="mx-auto max-w-4xl">
            {groups.map((group, groupIndex) => {
                const isLastGroup = groupIndex === groups.length - 1;
                return (
                    <li
                        key={group.year}
                        className="grid gap-x-8 motion-safe:animate-[fadeInUp_0.6s_ease-out_both] md:grid-cols-[6.5rem_1fr]"
                        style={{ animationDelay: `${groupIndex * 100}ms` }}
                    >
                        <div className="mb-4 md:mb-0 md:pt-2 md:text-right">
                            <span className="block bg-gradient-to-b from-slate-900 to-slate-500 bg-clip-text text-3xl font-semibold tabular-nums tracking-tight text-transparent md:text-4xl">
                                {group.year}
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-500">
                                {groupIndex === 0 && continuesFromPreviousPage
                                    ? "continued"
                                    : yearTotals[group.year] === 1
                                      ? "1 milestone"
                                      : `${yearTotals[group.year]} milestones`}
                            </span>
                        </div>

                        <div className={`space-y-4 border-l-2 border-slate-200 ${isLastGroup ? "" : "pb-10"}`}>
                            {group.items.map(({ event, index }) => (
                                <EventCard key={index} event={event} isLatest={highlightLatest && groupIndex === 0 && index === 0} />
                            ))}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
};

export default TimelineComponent;
