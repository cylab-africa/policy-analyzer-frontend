/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
    AlertTriangle,
    Book,
    CreditCard,
    File,
    FileDigit,
    Globe,
    Loader2,
    RefreshCw,
    Search,
    Shield,
    X,
} from "lucide-react";
import React, { useMemo, useState } from "react";

// Import API hooks
import { useGetDigitalIdsQuery, useGetPolicyLawsQuery } from "@/redux/api/apiSlice";
import FolderTabs from "@/components/home/FolderTabs";
import { FLAG_EMOJIS, describeLink, getRegion } from "./utils";
import ResourceCard from "./ResourceCard";

// Enum for resource type
export enum ResourceType {
    DATA_PROTECTION = "data-protection",
    DIGITAL_ID = "digital-id",
}

// Interface for unified resource data
export interface Resource {
    id: string;
    countryCode: string;
    countryName: string;
    flagEmoji: string;
    region: string;
    title: string;
    description: string;
    /** Country-level summary of the digital ID system, shown on one card per country */
    systemSummary?: string;
    type: ResourceType;
    documentUrl?: string;
    websiteUrl?: string;
    year?: string;
    fileType?: string;
    isOfficial: boolean;
    docType?: string;
    icon?: React.ReactNode;
    coverage?: string;
    authority?: string;
    features?: string[];
    malaboStatus?: string;
    legislationStatus?: string;
    yearLaunched?: string;
    linkType?: string;
}

// "Continental" is how the data names sources that cover the whole continent
const regionLabel = (region: string) => (region === "Continental" ? "Pan-African" : region);

export default function ResourcesPage() {
    const [activeTab, setActiveTab] = useState<ResourceType>(ResourceType.DATA_PROTECTION);
    const [selectedRegion, setSelectedRegion] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    // API queries
    const {
        data: policyLaws = [],
        isLoading: policyLawsLoading,
        error: policyLawsError,
        refetch: refetchPolicyLaws,
    } = useGetPolicyLawsQuery({ page: 1, limit: 100 });

    const {
        data: digitalIds = [],
        isLoading: digitalIdsLoading,
        error: digitalIdsError,
        refetch: refetchDigitalIds,
    } = useGetDigitalIdsQuery({ page: 1, limit: 100 });

    const getResourceIcon = (type: string, linkType?: string) => {
        if (type === ResourceType.DATA_PROTECTION) {
            return <Shield className="h-[18px] w-[18px]" />;
        }

        // For Digital ID, use link type or default
        switch (linkType) {
            case "Academic Research":
                return <Book className="h-[18px] w-[18px]" />;
            case "Policy Research":
                return <File className="h-[18px] w-[18px]" />;
            case "Development Partner":
                return <Globe className="h-[18px] w-[18px]" />;
            case "Research Institute":
                return <CreditCard className="h-[18px] w-[18px]" />;
            case "Government":
            case "Official":
                return <Shield className="h-[18px] w-[18px]" />;
            default:
                return <FileDigit className="h-[18px] w-[18px]" />;
        }
    };

    // Transform API data into unified resources
    const resources = useMemo(() => {
        const allResources: Resource[] = [];

        // Process Data Protection Resources
        try {
            if (Array.isArray(policyLaws)) {
                policyLaws.forEach((law: any) => {
                    // Only include resources with enacted legislation
                    if (law.dataProtectionLegislationStatus === "Enacted") {
                        const countryCode = law.isoAlpha2;
                        const region = getRegion(law.country);

                        // Process each link in the policy law record
                        if (law.links && Array.isArray(law.links) && law.links.length > 0) {
                            law.links.forEach((linkObj: any, index: number) => {
                                if (linkObj.url && linkObj.url.trim() !== "") {
                                    const resource: Resource = {
                                        id: `dp-${countryCode}-${index}`,
                                        countryCode: countryCode || "",
                                        countryName: law.country,
                                        flagEmoji: law.flagEmoji || FLAG_EMOJIS[countryCode] || "🏳️",
                                        region,
                                        title: linkObj.title || `${law.country} Data Protection Resources`,
                                        description: describeLink(linkObj, "data-protection"),
                                        type: ResourceType.DATA_PROTECTION,
                                        documentUrl: linkObj.url,
                                        year: law.yearLegislationEnacted,
                                        fileType: linkObj.type || "PDF",
                                        isOfficial: true,
                                        icon: getResourceIcon(ResourceType.DATA_PROTECTION),
                                        malaboStatus: law.malaboConventionStatus,
                                        legislationStatus: law.dataProtectionLegislationStatus,
                                        linkType: linkObj.type,
                                    };
                                    allResources.push(resource);
                                }
                            });
                        } else {
                            // Create a basic resource even without links for countries with enacted legislation
                            const resource: Resource = {
                                id: `dp-${countryCode}-basic`,
                                countryCode: countryCode || "",
                                countryName: law.country,
                                flagEmoji: law.flagEmoji || FLAG_EMOJIS[countryCode] || "🏳️",
                                region,
                                title: `${law.country} Data Protection Act`,
                                description: `Data protection legislation for ${law.country}, enacted in ${law.yearLegislationEnacted}.`,
                                type: ResourceType.DATA_PROTECTION,
                                documentUrl: "#",
                                year: law.yearLegislationEnacted,
                                fileType: "Legislation",
                                isOfficial: true,
                                icon: getResourceIcon(ResourceType.DATA_PROTECTION),
                                malaboStatus: law.malaboConventionStatus,
                                legislationStatus: law.dataProtectionLegislationStatus,
                            };
                            allResources.push(resource);
                        }
                    }
                });
            }
        } catch (error) {
            console.error("Error processing policy laws:", error);
        }

        // Process Digital ID Resources
        try {
            if (Array.isArray(digitalIds)) {
                digitalIds.forEach((digitalId: any) => {
                    const countryCode = digitalId.isoAlpha2;
                    const region = getRegion(digitalId.country);

                    // Process each link in the digital ID record
                    if (digitalId.links && Array.isArray(digitalId.links) && digitalId.links.length > 0) {
                        let summaryShown = false;
                        digitalId.links.forEach((linkObj: any, index: number) => {
                            if (linkObj.url && linkObj.url.trim() !== "") {
                                const resource: Resource = {
                                    id: `id-${countryCode}-${index}`,
                                    countryCode,
                                    countryName: digitalId.country,
                                    flagEmoji: digitalId.flagEmoji || FLAG_EMOJIS[countryCode] || "🏳️",
                                    region,
                                    title: linkObj.title || `${digitalId.country} Digital ID Resources`,
                                    description: describeLink(linkObj, "digital-id"),
                                    systemSummary: summaryShown ? undefined : digitalId.description,
                                    type: ResourceType.DIGITAL_ID,
                                    documentUrl: linkObj.url,
                                    fileType: linkObj.type || "Research",
                                    isOfficial: linkObj.type === "Government" || linkObj.type === "Official",
                                    icon: getResourceIcon(ResourceType.DIGITAL_ID, linkObj.type),
                                    coverage: digitalId.coverage,
                                    authority: digitalId.authority,
                                    features: digitalId.features,
                                    yearLaunched: digitalId.year_launched,
                                    linkType: linkObj.type,
                                };
                                allResources.push(resource);
                                summaryShown = true;
                            }
                        });
                    } else if (digitalId.status && digitalId.status !== "No Data") {
                        // Create a basic resource for countries with digital ID info but no links
                        const resource: Resource = {
                            id: `id-${countryCode}-basic`,
                            countryCode,
                            countryName: digitalId.country,
                            flagEmoji: digitalId.flagEmoji || FLAG_EMOJIS[countryCode] || "🏳️",
                            region,
                            title: `${digitalId.country} Digital ID System`,
                            description: digitalId.description || `Digital identity system in ${digitalId.country}`,
                            type: ResourceType.DIGITAL_ID,
                            documentUrl: "#",
                            fileType: "System Info",
                            isOfficial: true,
                            icon: getResourceIcon(ResourceType.DIGITAL_ID),
                            coverage: digitalId.coverage,
                            authority: digitalId.authority,
                            features: digitalId.features,
                            yearLaunched: digitalId.year_launched,
                        };
                        allResources.push(resource);
                    }
                });
            }
        } catch (error) {
            console.error("Error processing digital IDs:", error);
        }

        return allResources;
    }, [policyLaws, digitalIds]);

    // Sources of the active tab that match the search; the region counts are taken from these
    const searchedResources = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return resources.filter(
            (resource) =>
                resource.type === activeTab &&
                (!query ||
                    resource.countryName.toLowerCase().includes(query) ||
                    resource.title.toLowerCase().includes(query))
        );
    }, [resources, activeTab, searchQuery]);

    const filteredResources = useMemo(
        () =>
            selectedRegion === "all"
                ? searchedResources
                : searchedResources.filter((resource) => resource.region === selectedRegion),
        [searchedResources, selectedRegion]
    );

    // Regions in display order: pan-African first, "Other" last
    const regionList = useMemo(() => {
        const rank = (region: string) => (region === "Continental" ? 0 : region.toLowerCase() === "other" ? 2 : 1);
        return [...new Set(resources.map((resource) => resource.region))].sort(
            (a, b) => rank(a) - rank(b) || a.localeCompare(b)
        );
    }, [resources]);

    const regionOptions = useMemo(
        () => [
            { value: "all", label: "All regions", count: searchedResources.length },
            ...regionList.map((region) => ({
                value: region,
                label: regionLabel(region),
                count: searchedResources.filter((resource) => resource.region === region).length,
            })),
        ],
        [regionList, searchedResources]
    );

    // Group resources by region
    const groupedResources = useMemo(() => {
        return filteredResources?.reduce(
            (groups, resource) => {
                const { region } = resource;
                if (!groups[region]) {
                    groups[region] = [];
                }
                groups[region].push(resource);
                return groups;
            },
            {} as Record<string, Resource[]>
        );
    }, [filteredResources]);

    // Sort regions
    const sortedRegions = useMemo(() => {
        return Object.keys(groupedResources).sort((a, b) => {
            if (a === "Continental") return -1;
            if (b === "Continental") return 1;
            return a.localeCompare(b);
        });
    }, [groupedResources]);

    // Resource counts
    const resourceCounts = useMemo(() => {
        return {
            [ResourceType.DATA_PROTECTION]: resources.filter((r) => r.type === ResourceType.DATA_PROTECTION).length,
            [ResourceType.DIGITAL_ID]: resources.filter((r) => r.type === ResourceType.DIGITAL_ID).length,
        };
    }, [resources]);

    // Loading and error states
    const isLoading = policyLawsLoading || digitalIdsLoading;
    const hasError = policyLawsError || digitalIdsError;

    // Retry function
    const handleRetry = () => {
        refetchPolicyLaws();
        refetchDigitalIds();
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedRegion("all");
    };

    return (
        <div className="min-h-screen w-full bg-gray-50">
            <div className="container mx-auto max-w-7xl px-6 pb-16 pt-10">
                <header className="mb-8 max-w-3xl">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Source library</h1>
                    <p className="mt-2 text-lg leading-relaxed text-slate-600">
                        Laws, country fact sheets and research on data protection and digital identity across Africa.
                        Each entry links to the original publication on its publisher&apos;s site.
                    </p>
                </header>

                {hasError && (
                    <div className="mb-6">
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="flex items-center justify-between">
                                <span>Failed to load resources. Please check your connection and try again.</span>
                                <Button variant="outline" size="sm" onClick={handleRetry} className="cursor-pointer">
                                    <RefreshCw className="mr-1 h-3 w-3" />
                                    Retry
                                </Button>
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                <Tabs
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as ResourceType)}
                    className="w-full gap-0"
                >
                    <FolderTabs
                        tabs={[
                            {
                                value: ResourceType.DATA_PROTECTION,
                                label: "Data Protection",
                                count: resourceCounts[ResourceType.DATA_PROTECTION],
                            },
                            {
                                value: ResourceType.DIGITAL_ID,
                                label: "Digital ID",
                                count: resourceCounts[ResourceType.DIGITAL_ID],
                            },
                        ]}
                    />

                    <div className="rounded-2xl rounded-tl-none border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 max-sm:rounded-tr-none sm:p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="relative w-full sm:max-w-md">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by country or title"
                                    aria-label="Search by country or title"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-11 border-slate-200 pl-9 pr-9"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        aria-label="Clear search"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded p-1 text-slate-400 transition-colors hover:text-slate-700"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            {!isLoading && (
                                <p className="text-sm text-slate-500" aria-live="polite">
                                    {filteredResources.length} {filteredResources.length === 1 ? "source" : "sources"}
                                </p>
                            )}
                        </div>

                        <div className="mt-6 grid gap-6 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-8">
                            <aside className="lg:sticky lg:top-24 lg:self-start">
                                <nav aria-label="Filter by region">
                                    <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Region
                                    </h2>
                                    <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 lg:pb-0">
                                        {regionOptions.map((option) => {
                                            const isSelected = selectedRegion === option.value;
                                            return (
                                                <li key={option.value} className="shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedRegion(option.value)}
                                                        aria-pressed={isSelected}
                                                        disabled={option.count === 0 && !isSelected}
                                                        className={cn(
                                                            "flex w-full cursor-pointer items-center justify-between gap-3 whitespace-nowrap rounded-md border px-3 py-2 text-sm transition-colors disabled:cursor-default disabled:opacity-40 lg:border-transparent",
                                                            isSelected
                                                                ? "border-primary/30 bg-primary/10 font-medium text-primary"
                                                                : "border-slate-200 text-slate-600 enabled:hover:bg-slate-100 enabled:hover:text-slate-900"
                                                        )}
                                                    >
                                                        <span>{option.label}</span>
                                                        <span className="tabular-nums text-xs text-slate-400">
                                                            {option.count}
                                                        </span>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </nav>
                            </aside>

                            <div className="min-w-0">
                                {isLoading && (
                                    <div className="py-16 text-center">
                                        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
                                        <p className="text-slate-600">Loading sources…</p>
                                    </div>
                                )}

                                {!isLoading && filteredResources.length === 0 && (
                                    <div className="py-16 text-center">
                                        <p className="mb-4 text-slate-600">No sources match your filters.</p>
                                        <Button variant="outline" onClick={clearFilters}>
                                            Clear filters
                                        </Button>
                                    </div>
                                )}

                                {!isLoading &&
                                    filteredResources.length > 0 &&
                                    sortedRegions.map((region) => (
                                        <section key={region} className="mb-10 last:mb-0">
                                            <h2 className="mb-4 flex items-baseline gap-2 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-900">
                                                {regionLabel(region)}
                                                <span className="text-sm font-normal tabular-nums text-slate-400">
                                                    {groupedResources[region].length}
                                                </span>
                                            </h2>
                                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                                                {groupedResources[region].map((resource) => (
                                                    <ResourceCard key={resource.id} resource={resource} />
                                                ))}
                                            </div>
                                        </section>
                                    ))}
                            </div>
                        </div>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
