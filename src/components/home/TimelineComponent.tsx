"use client";
import type { TimelineEvent } from "@/data/timelineEvents";
import React from "react";

interface TimelineProps {
    /** Events for this page, newest first. */
    events: TimelineEvent[];
    /** Year of the event just before this page's first one, so a year that carries over can be marked. */
    previousYear?: number;
}

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

const TimelineComponent: React.FC<TimelineProps> = ({ events, previousYear }) => {
    // Events arrive newest first; group consecutive entries that share a year.
    const groups = events.reduce<{ year: number; items: TimelineEvent[] }[]>((acc, event) => {
        const last = acc[acc.length - 1];
        if (last && last.year === event.year) last.items.push(event);
        else acc.push({ year: event.year, items: [event] });
        return acc;
    }, []);

    return (
        <ol className="mx-auto max-w-4xl">
            {groups.map((group, groupIndex) => (
                <li key={group.year} className="grid gap-x-8 pb-10 last:pb-0 md:grid-cols-[6rem_1fr]">
                    <div className="mb-3 md:mb-0 md:text-right">
                        <h3 className="text-2xl font-semibold tabular-nums text-slate-900">{group.year}</h3>
                        {groupIndex === 0 && previousYear === group.year && (
                            <span className="text-xs text-slate-500">continued</span>
                        )}
                    </div>

                    <ul className="space-y-7 border-l border-slate-200 pl-6">
                        {group.items.map((event, index) => (
                            <li key={index} className="relative">
                                <span
                                    aria-hidden="true"
                                    className="absolute -left-[1.78rem] top-1.5 h-2 w-2 rounded-full bg-slate-400 ring-4 ring-white"
                                />
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    {labelFor(event.type)}
                                </p>
                                <p className="mt-1 leading-relaxed text-slate-800">{event.content}</p>
                                {event.countries && event.countries.length > 0 && (
                                    <p className="mt-2 text-sm text-slate-500">
                                        <span className="sr-only">Countries: </span>
                                        {event.countries.join(" · ")}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ol>
    );
};

export default TimelineComponent;
