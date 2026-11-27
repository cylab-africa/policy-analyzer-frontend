"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, type ReactNode } from "react";

// The contents list shows the main sections only, in labelled groups; sub-headings stay on the page itself
export interface DocsHeading {
    id: string;
    title: string;
}

export interface DocsGroup {
    label: string;
    headings: DocsHeading[];
}

// Highlight the last heading that has scrolled up to where a link to it places it. At the bottom of the page, short
// final sections can never get that far up, so highlight the section that was linked to if it is in view, and
// otherwise the last one.
function useActiveHeading(groups: DocsGroup[]) {
    const [activeId, setActiveId] = useState(groups[0]?.headings[0]?.id);

    useEffect(() => {
        const ids = groups.flatMap((group) => group.headings.map((heading) => heading.id));
        let frame = 0;

        const update = () => {
            frame = 0;
            let current = ids[0];
            for (const id of ids) {
                const element = document.getElementById(id);
                if (!element) continue;
                // Where a link to this heading leaves it: its scroll margin, which differs between screen sizes
                const linkedTop = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
                if (element.getBoundingClientRect().top <= linkedTop + 8) current = id;
            }

            const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
            if (atBottom) {
                const linked = decodeURIComponent(window.location.hash.slice(1));
                const top = ids.includes(linked) ? document.getElementById(linked)?.getBoundingClientRect().top : undefined;
                current = top !== undefined && top >= 0 && top < window.innerHeight ? linked : ids[ids.length - 1];
            }
            setActiveId(current);
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        window.addEventListener("hashchange", onScroll);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            window.removeEventListener("hashchange", onScroll);
        };
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

interface NavProps {
    readonly groups: DocsGroup[];
    readonly activeId: string | undefined;
}

// Beside the page on wide screens
function DocsSidebar({ groups, activeId }: NavProps) {
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
function DocsMobileNav({ groups, activeId }: NavProps) {
    const [open, setOpen] = useState(false);
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

// The page body with its contents list. One scroll listener serves both the sidebar and the mobile bar.
export function DocsLayout({ groups, children }: { readonly groups: DocsGroup[]; readonly children: ReactNode }) {
    const activeId = useActiveHeading(groups);
    return (
        <>
            <DocsMobileNav groups={groups} activeId={activeId} />
            <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
                <aside className="hidden lg:block">
                    <DocsSidebar groups={groups} activeId={activeId} />
                </aside>
                {children}
            </div>
        </>
    );
}
