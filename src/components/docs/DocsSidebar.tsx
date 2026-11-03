"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// The contents list shows the main sections only, in labelled groups; sub-headings stay on the page itself
export interface DocsHeading {
    id: string;
    title: string;
}

export interface DocsGroup {
    label: string;
    headings: DocsHeading[];
}

// Highlight the heading nearest the top of the viewport
function useActiveHeading(groups: DocsGroup[]) {
    const [activeId, setActiveId] = useState(groups[0]?.headings[0]?.id);

    useEffect(() => {
        const elements = groups
            .flatMap((group) => group.headings)
            .map((heading) => document.getElementById(heading.id))
            .filter((element): element is HTMLElement => element !== null);

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((entry) => entry.isIntersecting);
                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            { rootMargin: "-80px 0px -70% 0px" }
        );

        elements.forEach((element) => observer.observe(element));
        return () => observer.disconnect();
    }, [groups]);

    return activeId;
}

function DocsNavList({
    groups,
    activeId,
    onNavigate,
}: {
    readonly groups: DocsGroup[];
    readonly activeId: string | undefined;
    readonly onNavigate?: () => void;
}) {
    return (
        <div className="space-y-5">
            {groups.map((group) => (
                <div key={group.label}>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{group.label}</p>
                    <ul className="border-l border-border">
                        {group.headings.map((heading) => (
                            <li key={heading.id} className="-ml-px">
                                <a
                                    href={`#${heading.id}`}
                                    onClick={onNavigate}
                                    className={cn(
                                        "block border-l-2 py-1.5 pl-4 text-sm font-medium transition-colors duration-200",
                                        activeId === heading.id
                                            ? "border-primary text-primary"
                                            : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"
                                    )}
                                    aria-current={activeId === heading.id ? "location" : undefined}
                                >
                                    {heading.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

// Beside the page on wide screens
export default function DocsSidebar({ groups }: { readonly groups: DocsGroup[] }) {
    const activeId = useActiveHeading(groups);
    return (
        <nav
            aria-label="Documentation contents"
            className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6"
        >
            <DocsNavList groups={groups} activeId={activeId} />
        </nav>
    );
}

// A bar that stays under the site header on small screens and opens the same list
export function DocsMobileNav({ groups }: { readonly groups: DocsGroup[] }) {
    const [open, setOpen] = useState(false);
    const activeId = useActiveHeading(groups);
    const current = groups.flatMap((group) => group.headings).find((heading) => heading.id === activeId);

    return (
        <div className="sticky top-16 z-30 -mx-6 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls="docs-mobile-nav"
                className="flex w-full cursor-pointer items-center justify-between gap-3 px-6 py-3 text-left text-sm"
            >
                <span className="shrink-0 font-semibold text-slate-700">On this page</span>
                <span className="min-w-0 truncate text-slate-500">{current?.title}</span>
            </button>
            {open && (
                <nav
                    id="docs-mobile-nav"
                    aria-label="Documentation contents"
                    className="absolute left-0 right-0 top-full max-h-[60vh] overflow-y-auto border-b border-slate-200 bg-white px-6 py-4 shadow-lg"
                >
                    <DocsNavList groups={groups} activeId={activeId} onNavigate={() => setOpen(false)} />
                </nav>
            )}
        </div>
    );
}
