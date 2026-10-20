"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export interface DocsHeading {
    id: string;
    title: string;
    children: { id: string; title: string }[];
}

export default function DocsSidebar({ headings }: { readonly headings: DocsHeading[] }) {
    const [activeId, setActiveId] = useState(headings[0]?.id);

    // Highlight the heading nearest the top of the viewport
    useEffect(() => {
        const ids = headings.flatMap((heading) => [heading.id, ...heading.children.map((child) => child.id)]);
        const elements = ids
            .map((id) => document.getElementById(id))
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
    }, [headings]);

    const linkClass = (id: string, nested: boolean) =>
        cn(
            "block border-l-2 py-1.5 text-sm transition-colors duration-200",
            nested ? "pl-7" : "pl-4 font-medium",
            activeId === id
                ? "border-primary text-primary"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
        );

    return (
        <ul className="border-l border-border">
            {headings.map((heading) => (
                <li key={heading.id} className="-ml-px">
                    <a
                        href={`#${heading.id}`}
                        className={linkClass(heading.id, false)}
                        aria-current={activeId === heading.id ? "location" : undefined}
                    >
                        {heading.title}
                    </a>
                    {heading.children.length > 0 && (
                        <ul>
                            {heading.children.map((child) => (
                                <li key={child.id}>
                                    <a
                                        href={`#${child.id}`}
                                        className={linkClass(child.id, true)}
                                        aria-current={activeId === child.id ? "location" : undefined}
                                    >
                                        {child.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );
}
