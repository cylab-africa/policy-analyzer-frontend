/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertTriangle,
    Book,
    CreditCard,
    File,
    FileDigit,
    Fingerprint,
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
import { FLAG_EMOJIS, getDocumentLanguage, getRegion } from "./utils";
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
    type: ResourceType;
    documentUrl?: string;
    websiteUrl?: string;
    year: string;
    language: string;
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
                                        description: `Data protection legislation resource for ${law.country}, enacted in ${law.yearLegislationEnacted}.`,
                                        type: ResourceType.DATA_PROTECTION,
                                        documentUrl: linkObj.url,
                                        year: law.yearLegislationEnacted || "Unknown",
                                        language: getDocumentLanguage(law.country),
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
                                year: law.yearLegislationEnacted || "Unknown",
                                language: getDocumentLanguage(law.country),
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
                        digitalId.links.forEach((linkObj: any, index: number) => {
                            if (linkObj.url && linkObj.url.trim() !== "") {
                                const resource: Resource = {
                                    id: `id-${countryCode}-${index}`,
                                    countryCode,
                                    countryName: digitalId.country,
                                    flagEmoji: digitalId.flagEmoji || FLAG_EMOJIS[countryCode] || "🏳️",
                                    region,
                                    title: linkObj.title || `${digitalId.country} Digital ID Resources`,
                                    description:
                                        digitalId.description ||
                                        `Digital identity system documentation for ${digitalId.country}`,
                                    type: ResourceType.DIGITAL_ID,
                                    documentUrl: linkObj.url,
                                    year: digitalId.year_launched || "2020",
                                    language: getDocumentLanguage(digitalId.country),
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
                            year: digitalId.year_launched || "2020",
                            language: getDocumentLanguage(digitalId.country),
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

    // Filter resources based on current tab, region, and search query
    const filteredResources = useMemo(() => {
        let filtered = resources.filter((resource) => resource.type === activeTab);

        if (selectedRegion !== "all") {
            filtered = filtered.filter((resource) => resource.region === selectedRegion);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (resource) =>
                    // resource.title.toLowerCase().includes(query) ||
                    resource.countryName.toLowerCase().includes(query)
                // resource.description.toLowerCase().includes(query) ||
                // resource.authority?.toLowerCase().includes(query) ||
                // resource.features?.some((f) => f.toLowerCase().includes(query))
            );
        }

        return filtered;
    }, [resources, activeTab, selectedRegion, searchQuery]);

    // Get unique regions from resources
    const regions = useMemo(() => {
        const uniqueRegions = [...new Set(resources.map((resource) => resource.region))];
        const sorted = uniqueRegions
            .filter((region) => region.toLowerCase() !== "other")
            .sort((a, b) => a.localeCompare(b));

        const hasOther = uniqueRegions.some((region) => region.toLowerCase() === "other");
        if (hasOther) sorted.push("Other");

        return ["all", ...sorted];
    }, [resources]);

    // Group resources by region
    const groupedResources = useMemo(() => {
        return filteredResources?.reduce((groups, resource) => {
            const { region } = resource;
            if (!groups[region]) {
                groups[region] = [];
            }
            groups[region].push(resource);
            return groups;
        }, {} as Record<string, Resource[]>);
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

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            <div className="max-w-8xl container mx-auto container px-6 pt-5 pb-16">
                {/* Error Alert */}
                {hasError && (
                    <div className="mb-6">
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="flex items-center justify-between">
                                <span>Failed to load resources. Please check your connection and try again.</span>
                                <Button variant="outline" size="sm" onClick={handleRetry} className="cursor-pointer">
                                    <RefreshCw className="h-3 w-3 mr-1" />
                                    Retry
                                </Button>
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                {/* Tabs and Filters */}
                <div className="mb-10">
                    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4 items-stretch">
                        {/* Tabs */}
                        <div className="flex-1 min-w-0">
                            <Tabs
                                value={activeTab}
                                onValueChange={(value) => setActiveTab(value as ResourceType)}
                                className="w-full"
                            >
                                <TabsList className="grid grid-cols-2 h-12">
                                    <TabsTrigger
                                        value={ResourceType.DATA_PROTECTION}
                                        className="flex items-center cursor-pointer justify-center gap-2 data-[state=active]:shadow-sm"
                                    >
                                        <Shield className="h-4 w-4" />
                                        <span>Data Protection</span>
                                        <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">
                                            {resourceCounts[ResourceType.DATA_PROTECTION]}
                                        </span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value={ResourceType.DIGITAL_ID}
                                        className="flex items-center cursor-pointer justify-center gap-2 data-[state=active]:shadow-sm"
                                    >
                                        <Fingerprint className="h-4 w-4" />
                                        <span>Digital ID</span>
                                        <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">
                                            {resourceCounts[ResourceType.DIGITAL_ID]}
                                        </span>
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    type="text"
                                    placeholder="Search by country..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-9 h-11 border-gray-200 min-w-[350px]"
                                />
                                {searchQuery && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => setSearchQuery("")}
                                        className="cursor-pointer absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-red-500 hover:text-red-600 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                                <SelectTrigger className="h-12 border-gray-200 min-w-[180px]">
                                    <SelectValue placeholder="Filter by Region" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Regions</SelectItem>
                                    {regions
                                        .filter((r) => r !== "all")
                                        .map((region, index) => (
                                            <SelectItem key={index} value={region}>
                                                {region}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="bg-white rounded-lg shadow-sm p-16 text-center">
                        <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                        <p className="text-xl text-gray-600">Loading resources...</p>
                    </div>
                )}

                {/* Resources Content */}
                {!isLoading && (
                    <div>
                        {filteredResources.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm p-16 text-center">
                                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                                <p className="text-xl text-gray-600 mb-6">No resources found.</p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedRegion("all");
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        ) : (
                            sortedRegions.map((region, index) => (
                                <div key={index} className="mb-10">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 pl-3 border-l-4 border-primary flex items-center gap-2">
                                        {region === "Continental" ? (
                                            <>
                                                <Globe className="h-5 w-5 text-primary" />
                                                <span>Pan-African Resources</span>
                                            </>
                                        ) : (
                                            region
                                        )}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {groupedResources[region].map((resource, resourceIndex) => (
                                            <ResourceCard key={resourceIndex} resource={resource} />
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
