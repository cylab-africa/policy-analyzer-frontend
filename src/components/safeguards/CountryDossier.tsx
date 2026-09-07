"use client";

import { cn } from "@/lib/utils";
import {
    CountryEvidenceData,
    CountryPrincipleCoverage,
    CoverageStatus,
    DpiPrinciple,
    LegalEvidenceItem,
    PrincipleEvidence,
} from "@/types/api";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

/* ------------------------------------------------------------------ *
 * Status vocabulary
 * ------------------------------------------------------------------ */

const STATUS_LABEL: Record<CoverageStatus, string> = {
    addressed: "Addressed",
    partial: "Partial / indirect",
    not_addressed: "Not addressed",
};

const STATUS_TOKENS: Record<CoverageStatus, { chip: string; rail: string; dot: string; ink: string }> = {
    addressed: {
        chip: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/20",
        rail: "bg-emerald-600",
        dot: "bg-emerald-600",
        ink: "text-emerald-700",
    },
    partial: {
        chip: "bg-amber-50 text-amber-900 ring-1 ring-amber-600/25",
        rail: "bg-amber-500",
        dot: "bg-amber-500",
        ink: "text-amber-700",
    },
    not_addressed: {
        chip: "bg-slate-100 text-slate-700 ring-1 ring-slate-500/20",
        rail: "bg-slate-400",
        dot: "bg-slate-300",
        ink: "text-slate-600",
    },
};

const ORDER: CoverageStatus[] = ["addressed", "partial", "not_addressed"];

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

interface CountryDossierProps {
    evidence: CountryEvidenceData;
    principles: DpiPrinciple[];
    country: CountryPrincipleCoverage | null;
}

export default function CountryDossier({ evidence, principles, country }: Readonly<CountryDossierProps>) {
    const { source, methodology } = evidence;

    const principleByCode = useMemo(() => {
        const m = new Map<string, DpiPrinciple>();
        principles.forEach((p) => m.set(p.code, p));
        return m;
    }, [principles]);

    const rows = useMemo(
        () =>
            evidence.principles
                .map((e) => ({ evidence: e, principle: principleByCode.get(e.principleCode) }))
                .sort((a, b) => {
                    const s = ORDER.indexOf(a.evidence.status) - ORDER.indexOf(b.evidence.status);
                    if (s !== 0) return s;
                    return a.evidence.principleCode.localeCompare(b.evidence.principleCode);
                }),
        [evidence.principles, principleByCode],
    );

    const tally = useMemo(() => {
        const t: Record<CoverageStatus, number> = { addressed: 0, partial: 0, not_addressed: 0 };
        evidence.principles.forEach((e) => (t[e.status] += 1));
        return t;
    }, [evidence.principles]);

    const citationCount = useMemo(
        () => evidence.principles.reduce((n, e) => n + e.evidence.length, 0),
        [evidence.principles],
    );

    const [openCode, setOpenCode] = useState<string | null>(null);
    const total = evidence.principles.length;

    return (
        <div className="min-h-screen bg-[#fbfbfa]">
            {/* ---------------- Masthead ---------------- */}
            <header className="border-b border-slate-200 bg-white">
                <div className="max-w-5xl mx-auto px-6 pt-8 pb-9">
                    <Link
                        href="/safeguards"
                        className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors print:hidden"
                    >
                        &larr; All countries
                    </Link>

                    <div className="mt-6">
                        <h1 className="flex items-center gap-3 text-[34px] leading-[1.15] font-semibold tracking-[-0.02em] text-slate-900">
                            Kenya
                            <span className="rounded border border-slate-300 px-1.5 py-0.5 text-[12px] font-semibold tracking-[0.08em] text-slate-500">
                                {country?.isoAlpha2 ?? "KE"}
                            </span>
                        </h1>
                        <p className="mt-2.5 text-[15px] leading-relaxed text-slate-600 max-w-2xl">
                            Every safeguard rating below is traced to the operative text of the{" "}
                            <span className="font-medium text-slate-900">{source.lawName}</span>, with the statutory
                            provision quoted and linked to the official consolidation.
                        </p>
                    </div>

                    {/* Citation block */}
                    <dl className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-4 border-t border-slate-200 pt-6">
                        <Meta label="Instrument" value={source.citation} />
                        <Meta label="In force" value={fmt(source.commencementDate)} />
                        <Meta label="Consolidated to" value={fmt(source.consolidatedTo)} />
                        <Meta label="Assessed" value={fmt(methodology.assessedOn)} />
                    </dl>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-9">
                {/* ---------------- Summary ---------------- */}
                <section className="mb-10">
                    <SectionHeading>Assessment summary</SectionHeading>

                    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                        {/* Distribution bar */}
                        <div className="p-5 border-b border-slate-100">
                            <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
                                {ORDER.map((s) =>
                                    tally[s] ? (
                                        <div
                                            key={s}
                                            className={STATUS_TOKENS[s].rail}
                                            style={{ width: `${(tally[s] / total) * 100}%` }}
                                            title={`${STATUS_LABEL[s]}: ${tally[s]}`}
                                        />
                                    ) : null,
                                )}
                            </div>
                            <div className="mt-3.5 flex flex-wrap gap-x-6 gap-y-2">
                                {ORDER.map((s) => (
                                    <div key={s} className="flex items-baseline gap-2">
                                        <span
                                            className={cn(
                                                "h-2 w-2 rounded-full translate-y-[-1px]",
                                                STATUS_TOKENS[s].dot,
                                            )}
                                        />
                                        <span className="text-[13px] font-semibold text-slate-900 tabular-nums">
                                            {tally[s]}
                                        </span>
                                        <span className="text-[13px] text-slate-600">{STATUS_LABEL[s]}</span>
                                    </div>
                                ))}
                                <div className="ml-auto text-[13px] text-slate-500">
                                    <span className="font-semibold text-slate-900 tabular-nums">{citationCount}</span>{" "}
                                    provisions cited across {total} safeguards
                                </div>
                            </div>
                        </div>

                        {/* The actual finding */}
                        <div className="p-5 bg-slate-50/60">
                            <p className="text-[14px] leading-[1.65] text-slate-700">
                                Kenya&rsquo;s Act covers the{" "}
                                <span className="font-medium text-slate-900">procedural</span> safeguards
                                comprehensively — legal basis, privacy and security by design, lawful processing,
                                data-subject rights and redress are each supported by explicit operative provisions. The
                                gaps are concentrated in the{" "}
                                <span className="font-medium text-slate-900">distributive</span> safeguards:
                                non-discrimination, responsiveness to gender, ability and age, and non-exclusion. Two of
                                those three fall outside what a data-protection statute governs, and are marked
                                accordingly rather than counted as failures.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ---------------- Findings ---------------- */}
                <section className="mb-10">
                    <SectionHeading>
                        Findings
                        <span className="ml-2 font-normal text-slate-400 normal-case tracking-normal">
                            {total} safeguards · select one to read the evidence
                        </span>
                    </SectionHeading>

                    <div className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden">
                        {rows.map(({ evidence: ev, principle }) => (
                            <FindingRow
                                key={ev.principleCode}
                                ev={ev}
                                principle={principle}
                                source={evidence.source}
                                open={openCode === ev.principleCode}
                                onToggle={() => setOpenCode(openCode === ev.principleCode ? null : ev.principleCode)}
                            />
                        ))}
                    </div>
                </section>

                {/* ---------------- Method ---------------- */}
                <section>
                    <SectionHeading>Method &amp; provenance</SectionHeading>

                    <div className="grid md:grid-cols-2 gap-4">
                        <Panel title="Rating criteria">
                            <dl className="space-y-3">
                                {ORDER.map((s) => (
                                    <div key={s}>
                                        <dt className="mb-1">
                                            <span
                                                className={cn(
                                                    "inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-semibold",
                                                    STATUS_TOKENS[s].chip,
                                                )}
                                            >
                                                {STATUS_LABEL[s]}
                                            </span>
                                        </dt>
                                        <dd className="text-[13px] leading-relaxed text-slate-600">
                                            {methodology.criteria[s]}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </Panel>

                        <div className="space-y-4">
                            <Panel title="Source text">
                                <p className="text-[13px] leading-relaxed text-slate-600">
                                    {source.verificationMethod}
                                </p>
                                <div className="mt-3.5 flex flex-col gap-2">
                                    <SourceLink href={source.canonicalUrl}>
                                        {source.publisher} — official consolidation
                                    </SourceLink>
                                    <SourceLink href={source.corroboratingUrl}>
                                        Gazetted text (PDF) — corroborating copy
                                    </SourceLink>
                                </div>
                                <p className="mt-3 text-[12px] text-slate-500">Retrieved {fmt(source.retrievedAt)}.</p>

                                {source.relatedInstruments && source.relatedInstruments.length > 0 && (
                                    <div className="mt-4 border-t border-slate-100 pt-3.5">
                                        <p className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500">
                                            Related instruments
                                        </p>
                                        <p className="mb-3 text-[12px] leading-relaxed text-slate-500">
                                            Context for how the Act is applied. These did not inform any
                                            rating.
                                        </p>
                                        <ul className="space-y-3">
                                            {source.relatedInstruments.map((ri) => (
                                                <li key={ri.url}>
                                                    <SourceLink href={ri.url}>{ri.title}</SourceLink>
                                                    <p className="mt-0.5 text-[12px] text-slate-500">
                                                        {ri.citation}
                                                    </p>
                                                    <p className="mt-1 text-[12px] leading-relaxed text-slate-600">
                                                        {ri.relevance}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </Panel>

                            <Panel title="Scope of analysis">
                                <p className="text-[13px] leading-relaxed text-slate-600">{methodology.scopeNote}</p>
                            </Panel>

                            <Panel title="Status">
                                <dl className="space-y-2.5 text-[13px] leading-relaxed">
                                    <div>
                                        <dt className="text-slate-500">Prepared by</dt>
                                        <dd className="text-slate-700">{methodology.preparedBy}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-500">Pending review by</dt>
                                        <dd className="text-slate-700">{methodology.reviewerRole}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-500">For review</dt>
                                        <dd className="text-slate-700">{methodology.reviewScope}</dd>
                                    </div>
                                </dl>
                            </Panel>
                        </div>
                    </div>

                    {/*
                      HIDDEN, NOT DELETED — pending a decision on how to document method.

                      Why it is hidden: the heading claimed this was "the query used to generate
                      each assessment", but `methodology.promptTemplate` is a template containing
                      {principleName}/{principleCode} placeholders — it is not the query that ran
                      for any individual principle. More importantly, the statutory citations were
                      NOT produced by a prompt: they were located in, and machine-diffed against,
                      the gazetted text. Presenting a prompt as their provenance misdescribes how
                      the verified part of this work was actually done.

                      The data field `methodology.promptTemplate` is retained in the JSON.

                      To restore, either (a) re-add a per-principle `promptUsed` field so the
                      heading is truthful, or (b) reframe this block as "How this assessment was
                      produced" — locate, verify, classify — with the template nested beneath.

                    <details className="mt-4 group rounded-lg border border-slate-200 bg-white">
                        <summary className="flex cursor-pointer items-center gap-2 px-5 py-3.5 text-[13px] font-medium text-slate-700 hover:bg-slate-50/70 transition-colors list-none">
                            <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform group-open:rotate-180" />
                            Query used to generate each assessment
                        </summary>
                        <div className="border-t border-slate-100 px-5 py-4">
                            <pre className="whitespace-pre-wrap font-mono text-[12px] leading-[1.7] text-slate-600">
                                {methodology.promptTemplate}
                            </pre>
                        </div>
                    </details>
                    */}
                </section>
            </main>
        </div>
    );
}

/* ------------------------------------------------------------------ *
 * Finding row
 * ------------------------------------------------------------------ */

function FindingRow({
    ev,
    principle,
    source,
    open,
    onToggle,
}: Readonly<{
    ev: PrincipleEvidence;
    principle?: DpiPrinciple;
    source: CountryEvidenceData["source"];
    open: boolean;
    onToggle: () => void;
}>) {
    const tokens = STATUS_TOKENS[ev.status];

    return (
        <div className={cn(open && "bg-slate-50/40")}>
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-slate-50/70 transition-colors cursor-pointer"
            >
                <span className={cn("h-8 w-[3px] shrink-0 rounded-full", tokens.rail)} />

                <span className="w-7 shrink-0 text-[12px] font-semibold tracking-[0.06em] text-slate-400">
                    {ev.principleCode}
                </span>

                <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] font-medium text-slate-900 truncate">{principle?.name}</span>
                    <span className="mt-0.5 block text-[12.5px] text-slate-500 truncate">
                        {ev.evidence.length > 0
                            ? ev.evidence.map((e) => e.provision).join(" · ")
                            : "No provision identified"}
                    </span>
                </span>

                {!ev.inScope && (
                    <span className="hidden md:inline-flex shrink-0 items-center rounded px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-300">
                        Outside scope
                    </span>
                )}

                <span
                    className={cn(
                        "shrink-0 rounded px-2 py-1 text-[11.5px] font-semibold whitespace-nowrap",
                        tokens.chip,
                    )}
                >
                    {STATUS_LABEL[ev.status]}
                </span>

                <ChevronDown
                    className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform", open && "rotate-180")}
                />
            </button>

            {open && (
                <div className="px-5 pb-6 pl-[3.4rem]">
                    <div className="max-w-3xl space-y-6">
                        {principle?.description && (
                            <p className="text-[13px] italic leading-relaxed text-slate-500 border-l-2 border-slate-200 pl-3.5">
                                {principle.description}
                            </p>
                        )}

                        {!ev.inScope && ev.outOfScopeNote && (
                            <Callout tone="slate" title="Outside the scope of a data-protection statute">
                                {ev.outOfScopeNote}
                            </Callout>
                        )}

                        {ev.status === "partial" && ev.partialityReason && (
                            <Callout tone="amber" title="Why this is partial, not addressed">
                                {ev.partialityReason}
                            </Callout>
                        )}

                        <Block label="Finding">{ev.rationale}</Block>

                        <div>
                            <BlockLabel>
                                Legal evidence
                                {ev.evidence.length > 0 && (
                                    <span className="ml-2 font-normal normal-case tracking-normal text-slate-400">
                                        {ev.evidence.length} {ev.evidence.length === 1 ? "provision" : "provisions"}
                                    </span>
                                )}
                            </BlockLabel>

                            {ev.evidence.length === 0 ? (
                                <div className="rounded-md border border-dashed border-slate-300 bg-white px-4 py-3.5">
                                    <p className="text-[13.5px] text-slate-600">
                                        No relevant provision was identified in the {source.lawName}.
                                    </p>
                                    {ev.nearestProvision && (
                                        <div className="mt-4 border-t border-slate-200 pt-4">
                                            <p className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500">
                                                Nearest provision considered
                                            </p>
                                            <Provision item={ev.nearestProvision} source={source} />
                                            <p className="mt-2.5 text-[13px] leading-relaxed text-slate-600">
                                                <span className="font-medium text-slate-800">
                                                    Why it does not suffice:{" "}
                                                </span>
                                                {ev.nearestProvision.whyInsufficient}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {ev.evidence.map((item) => (
                                        <Provision key={item.provision} item={item} source={source} />
                                    ))}
                                </div>
                            )}
                        </div>

                        <Block label="How the provision maps to the safeguard">{ev.mappingExplanation}</Block>

                        {ev.limitations && (
                            <Block label="Limitations" muted>
                                {ev.limitations}
                            </Block>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ *
 * Provision card — the citation unit
 * ------------------------------------------------------------------ */

function Provision({ item, source }: Readonly<{ item: LegalEvidenceItem; source: CountryEvidenceData["source"] }>) {
    const href = `${source.canonicalUrl}#${item.anchor}`;

    return (
        <figure className="overflow-hidden rounded-md border border-slate-200 bg-white">
            <figcaption className="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
                <span className="font-mono text-[12px] font-semibold text-slate-900">{item.provision}</span>
                <span className="text-slate-300">·</span>
                <span className="min-w-0 flex-1 truncate text-[12.5px] text-slate-600">{item.heading}</span>
                {item.verified && (
                    <span
                        className="shrink-0 text-[11px] font-medium text-emerald-700"
                        title="Excerpt checked against the official consolidation and a corroborating gazetted copy"
                    >
                        Verified
                    </span>
                )}
            </figcaption>

            <blockquote className="px-4 py-3.5">
                <p className="font-mono text-[12.5px] leading-[1.75] text-slate-700">
                    {item.excerptIsSummary ? item.excerpt : `“${item.excerpt}”`}
                </p>
                {item.excerptIsSummary && (
                    <p className="mt-2 text-[11.5px] italic text-slate-500">
                        Summary of the provision, not a verbatim quotation.
                    </p>
                )}
            </blockquote>

            <div className="border-t border-slate-100 px-4 py-2.5">
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12.5px] font-medium text-primary hover:underline"
                >
                    Read {item.provision} in the official text &rarr;
                </a>
            </div>
        </figure>
    );
}

/* ------------------------------------------------------------------ *
 * Primitives
 * ------------------------------------------------------------------ */

function SectionHeading({ children }: Readonly<{ children: React.ReactNode }>) {
    return <h2 className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{children}</h2>;
}

function BlockLabel({ children }: Readonly<{ children: React.ReactNode }>) {
    return <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500">{children}</p>;
}

function Block({ label, children, muted }: Readonly<{ label: string; children: React.ReactNode; muted?: boolean }>) {
    return (
        <div>
            <BlockLabel>{label}</BlockLabel>
            <p className={cn("text-[14px] leading-[1.7]", muted ? "text-slate-500" : "text-slate-700")}>{children}</p>
        </div>
    );
}

function Callout({
    tone,
    title,
    children,
}: Readonly<{ tone: "amber" | "slate"; title: string; children: React.ReactNode }>) {
    const styles =
        tone === "amber"
            ? { box: "border-amber-500 bg-amber-50/60", head: "text-amber-900", body: "text-amber-800" }
            : { box: "border-slate-400 bg-slate-50", head: "text-slate-900", body: "text-slate-600" };

    return (
        <div className={cn("rounded-md border-l-2 px-4 py-3.5", styles.box)}>
            <p className={cn("text-[13px] font-semibold", styles.head)}>{title}</p>
            <p className={cn("mt-1 text-[13px] leading-relaxed", styles.body)}>{children}</p>
        </div>
    );
}

function Panel({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="mb-3.5 text-[13px] font-semibold text-slate-900">{title}</h3>
            {children}
        </div>
    );
}

function SourceLink({ href, children }: Readonly<{ href: string; children: React.ReactNode }>) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12.5px] font-medium text-primary hover:underline"
        >
            {children} &rarr;
        </a>
    );
}

function Meta({ label, value }: Readonly<{ label: string; value: string }>) {
    return (
        <div>
            <dt className="text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500">{label}</dt>
            <dd className="mt-1 text-[13.5px] text-slate-900">{value}</dd>
        </div>
    );
}

function fmt(iso: string) {
    const d = new Date(`${iso}T00:00:00Z`);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    });
}
