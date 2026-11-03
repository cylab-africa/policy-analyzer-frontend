"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { Resource, ResourceType } from ".";
import { getYearBadge } from "./utils";

interface Fact {
    label: string;
    value: string;
    /** The full original wording, shown on hover when the value shortens it */
    title?: string;
    valueClass?: string;
}

const MALABO_CLASS: Record<string, string> = {
    Ratified: "text-emerald-700",
    Signed: "text-amber-700",
};

// "Enacted 2019" -> label "Enacted", value "2019"
const splitYearBadge = (text: string): { label: string; value: string } => {
    const match = /^(Enacted|Launched|Since)\s+(.+)$/.exec(text);
    return match ? { label: match[1], value: match[2] } : { label: "Launch", value: text };
};

function ResourceCard({ resource }: { resource: Resource }) {
    const yearBadge = getYearBadge(resource.type, resource.yearLaunched ?? resource.year);

    const handleLinkClick = (url: string) => {
        if (url && url !== "#") {
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };

    const facts: Fact[] = [];
    if (yearBadge) facts.push({ ...splitYearBadge(yearBadge.text), title: yearBadge.title });
    if (resource.type === ResourceType.DATA_PROTECTION && resource.malaboStatus) {
        facts.push({
            label: "Malabo Convention",
            value: resource.malaboStatus,
            valueClass: MALABO_CLASS[resource.malaboStatus],
        });
    }
    if (resource.type === ResourceType.DIGITAL_ID && resource.coverage) {
        facts.push({ label: "Coverage", value: resource.coverage });
    }

    const hasDocument = resource.documentUrl && resource.documentUrl !== "#";
    const hasWebsite = resource.websiteUrl && resource.websiteUrl !== "#";

    return (
        <Card className="h-full gap-0 overflow-hidden border-slate-200 p-0 shadow-none transition-colors hover:border-slate-300 hover:shadow-md">
            <div className="flex h-full flex-col p-5">
                <div className="mb-3 flex items-center gap-2">
                    <span className="text-lg leading-none" aria-hidden="true">
                        {resource.flagEmoji}
                    </span>
                    <span className="text-sm font-medium text-slate-600">{resource.countryName}</span>
                </div>

                <h3 className="mb-2 text-md font-semibold leading-snug text-slate-900">{resource.title}</h3>

                <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-600" title={resource.description}>
                    {resource.description}
                </p>

                {resource.systemSummary && (
                    <p
                        className="mb-4 line-clamp-3 text-xs leading-relaxed text-slate-600"
                        title={resource.systemSummary}
                    >
                        <span className="font-medium">About the system:</span> {resource.systemSummary}
                    </p>
                )}

                <div className="mt-auto">
                    {facts.length > 0 && (
                        <dl className="mb-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 pt-4">
                            {facts.map((fact) => (
                                <div key={fact.label} className="min-w-0">
                                    <dt className="text-xs text-slate-500">{fact.label}</dt>
                                    <dd
                                        className={cn("text-sm font-medium text-slate-900", fact.valueClass)}
                                        title={fact.title}
                                    >
                                        {fact.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    )}

                    <div className="flex gap-3">
                        {hasDocument && (
                            <Button
                                variant="outline"
                                className="flex-1 gap-2 border-primary text-primary hover:bg-primary hover:text-white"
                                onClick={() => handleLinkClick(resource.documentUrl!)}
                            >
                                View resource
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        )}
                        {hasWebsite && (
                            <Button
                                variant="outline"
                                className="flex-1 gap-2 border-primary text-primary hover:bg-primary hover:text-white"
                                onClick={() => handleLinkClick(resource.websiteUrl!)}
                            >
                                Visit website
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        )}
                        {!hasDocument && !hasWebsite && (
                            <Button variant="outline" className="flex-1" disabled>
                                No document available
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default ResourceCard;
