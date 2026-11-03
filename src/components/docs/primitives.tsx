import type { ReactNode } from "react";

// Turns a heading into the id used for anchors and the table of contents
export const slugify = (text: string) =>
    text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

// A top-level section of the page (an h2). The title is also what the table of contents lists.
export function DocSection({ title, children }: { readonly title: string; readonly children: ReactNode }) {
    return (
        <section>
            <h2
                id={slugify(title)}
                className="scroll-mt-32 text-2xl font-bold lg:scroll-mt-24 text-slate-900 mt-12 mb-4 pt-8 border-t border-border"
            >
                {title}
            </h2>
            {children}
        </section>
    );
}

// A diagram with a caption. The caption says what the figure shows, so the text carries the meaning.
export function Figure({ caption, children }: { readonly caption: string; readonly children: ReactNode }) {
    return (
        <figure className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
            {children}
            <figcaption className="mt-4 text-sm text-slate-600">{caption}</figcaption>
        </figure>
    );
}

// A numbered, step-by-step guide: a number on a line that joins the steps, then the step's title and content
export function Steps({ children }: { readonly children: ReactNode }) {
    return <ol className="mb-6 list-none">{children}</ol>;
}

export function Step({
    n,
    title,
    children,
}: {
    readonly n: number;
    readonly title: string;
    readonly children: ReactNode;
}) {
    return (
        <li className="group flex gap-4 pb-8 last:pb-0">
            <div className="flex flex-col items-center">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {n}
                </span>
                <span aria-hidden="true" className="mt-2 w-px flex-1 bg-slate-200 group-last:hidden" />
            </div>
            <div className="min-w-0 flex-1 pt-1 [&>*:last-child]:mb-0">
                <h4 className="mb-2 font-semibold text-slate-900">{title}</h4>
                {children}
            </div>
        </li>
    );
}

// A short callout for the points a reader should not miss
export function Note({ children }: { readonly children: ReactNode }) {
    return (
        <aside className="mb-6 rounded-lg border border-slate-200 border-l-4 border-l-primary bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
            {children}
        </aside>
    );
}

export function DocSubsection({ title, children }: { readonly title: string; readonly children: ReactNode }) {
    return (
        <>
            <h3
                id={slugify(title)}
                className="scroll-mt-32 text-lg font-semibold lg:scroll-mt-24 text-slate-900 mt-8 mb-3"
            >
                {title}
            </h3>
            {children}
        </>
    );
}

export const P = ({ children }: { readonly children: ReactNode }) => (
    <p className="text-slate-700 leading-relaxed mb-4">{children}</p>
);

export const UL = ({ children }: { readonly children: ReactNode }) => (
    <ul className="list-disc pl-6 space-y-2 mb-4 text-slate-700">{children}</ul>
);

export const OL = ({ children }: { readonly children: ReactNode }) => (
    <ol className="list-decimal pl-6 space-y-3 mb-4 text-slate-700">{children}</ol>
);

export const LI = ({ children }: { readonly children: ReactNode }) => (
    <li className="leading-relaxed pl-1">{children}</li>
);

export const B = ({ children }: { readonly children: ReactNode }) => (
    <strong className="font-semibold text-slate-900">{children}</strong>
);

export const Code = ({ children }: { readonly children: ReactNode }) => (
    <code className="break-words rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-slate-800">
        {children}
    </code>
);

// Links starting with http open in a new tab; in-page anchors and mailto links stay in the same tab
export function A({ href, children }: { readonly href: string; readonly children: ReactNode }) {
    const isExternal = href.startsWith("http");
    return (
        <a
            href={href}
            className="break-words text-primary font-medium underline underline-offset-2 hover:text-primary/80"
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
            {children}
        </a>
    );
}

export function DocTable({ head, rows }: { readonly head: string[]; readonly rows: ReactNode[][] }) {
    return (
        <div className="mb-6 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
                <thead className="bg-muted/60 text-slate-900">
                    <tr>
                        {head.map((label) => (
                            <th key={label} className="px-4 py-2.5 font-semibold">
                                {label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((cells, index) => (
                        <tr key={index}>
                            {cells.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className="border-t border-border px-4 py-2.5 align-top text-slate-700"
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Where the code lives. Kept in one place so the links stay consistent across sections.
export const REPOS = {
    backend: "https://github.com/cylab-africa/policy-analyzer-backend",
    frontend: "https://github.com/cylab-africa/policy-analyzer-frontend",
};
export const CONTACT_EMAIL = "upanzi@andrew.cmu.edu";
