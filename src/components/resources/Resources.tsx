/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
    AlertTriangle,
    Book,
    Check,
    CreditCard,
    ExternalLink,
    File,
    FileDigit,
    Globe,
    Loader2,
    RefreshCw,
    Search,
    Shield,
} from "lucide-react";
import React, { useMemo, useState } from "react";

// Import API hooks
import { useGetDigitalIdsQuery, useGetPolicyLawsQuery } from "@/redux/api/apiSlice";

// Enum for resource type
enum ResourceType {
    DATA_PROTECTION = "data-protection",
    DIGITAL_ID = "digital-id",
}

// Interface for unified resource data
interface Resource {
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

// Country code to emoji mapping
const FLAG_EMOJIS: Record<string, string> = {
    DZ: "🇩🇿",
    AO: "🇦🇴",
    BJ: "🇧🇯",
    BW: "🇧🇼",
    BF: "🇧🇫",
    BI: "🇧🇮",
    CM: "🇨🇲",
    CV: "🇨🇻",
    CF: "🇨🇫",
    TD: "🇹🇩",
    KM: "🇰🇲",
    CG: "🇨🇬",
    CD: "🇨🇩",
    CI: "🇨🇮",
    DJ: "🇩🇯",
    EG: "🇪🇬",
    GQ: "🇬🇶",
    ER: "🇪🇷",
    SZ: "🇸🇿",
    ET: "🇪🇹",
    GA: "🇬🇦",
    GM: "🇬🇲",
    GH: "🇬🇭",
    GN: "🇬🇳",
    GW: "🇬🇼",
    KE: "🇰🇪",
    LS: "🇱🇸",
    LR: "🇱🇷",
    LY: "🇱🇾",
    MG: "🇲🇬",
    MW: "🇲🇼",
    ML: "🇲🇱",
    MR: "🇲🇷",
    MU: "🇲🇺",
    MA: "🇲🇦",
    MZ: "🇲🇿",
    NA: "🇳🇦",
    NE: "🇳🇪",
    NG: "🇳🇬",
    RW: "🇷🇼",
    ST: "🇸🇹",
    SN: "🇸🇳",
    SC: "🇸🇨",
    SL: "🇸🇱",
    SO: "🇸🇴",
    ZA: "🇿🇦",
    SS: "🇸🇸",
    SD: "🇸🇩",
    TZ: "🇹🇿",
    TG: "🇹🇬",
    TN: "🇹🇳",
    UG: "🇺🇬",
    ZM: "🇿🇲",
    ZW: "🇿🇼",
};

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

    // Helper functions
    const getRegion = (countryName: string): string => {
        const eastAfrica = [
            "Burundi",
            "Comoros",
            "Djibouti",
            "Eritrea",
            "Ethiopia",
            "Kenya",
            "Madagascar",
            "Mauritius",
            "Rwanda",
            "Seychelles",
            "Somalia",
            "South Sudan",
            "Tanzania",
            "Uganda",
        ];
        const centralAfrica = [
            "Angola",
            "Cameroon",
            "Central African Republic",
            "Chad",
            "Republic of the Congo",
            "Republic of Congo",
            "Democratic Republic of the Congo",
            "Democratic Republic of Congo",
            "Equatorial Guinea",
            "Gabon",
            "São Tomé and Príncipe",
            "Sao Tome and Principe",
            "Sao Tome & Principe",
        ];
        const southernAfrica = [
            "Botswana",
            "Eswatini",
            "Lesotho",
            "Malawi",
            "Mozambique",
            "Namibia",
            "South Africa",
            "Zambia",
            "Zimbabwe",
        ];
        const westAfrica = [
            "Benin",
            "Burkina Faso",
            "Cape Verde",
            "Cabo Verde",
            "Côte d'Ivoire",
            "Ivory Coast",
            "Cote d'Ivoire",
            "Gambia",
            "The Gambia",
            "Ghana",
            "Guinea",
            "Guinea-Bissau",
            "Liberia",
            "Mali",
            "Mauritania",
            "Niger",
            "Nigeria",
            "Senegal",
            "Sierra Leone",
            "Togo",
        ];
        const northAfrica = ["Algeria", "Egypt", "Libya", "Morocco", "Sudan", "Tunisia"];

        if (northAfrica.includes(countryName)) return "North Africa";
        if (westAfrica.includes(countryName)) return "West Africa";
        if (eastAfrica.includes(countryName)) return "East Africa";
        if (centralAfrica.includes(countryName)) return "Central Africa";
        if (southernAfrica.includes(countryName)) return "Southern Africa";
        return "Other";
    };

    const getDocumentLanguage = (countryName: string): string => {
        const francophoneCountries = [
            "Benin",
            "Burkina Faso",
            "Burundi",
            "Cameroon",
            "Central African Republic",
            "Chad",
            "Comoros",
            "Congo",
            "Republic of Congo",
            "Democratic Republic of the Congo",
            "Democratic Republic of Congo",
            "Djibouti",
            "Gabon",
            "Guinea",
            "Ivory Coast",
            "Cote d'Ivoire",
            "Madagascar",
            "Mali",
            "Niger",
            "Rwanda",
            "Senegal",
            "Seychelles",
            "Togo",
        ];
        const arabicCountries = ["Algeria", "Egypt", "Libya", "Mauritania", "Morocco", "Sudan", "Tunisia"];
        const portugueseCountries = [
            "Angola",
            "Cape Verde",
            "Cabo Verde",
            "Guinea-Bissau",
            "Mozambique",
            "São Tomé and Príncipe",
            "Sao Tome and Principe",
            "Sao Tome & Principe",
        ];

        if (francophoneCountries.includes(countryName)) return "French";
        if (arabicCountries.includes(countryName)) return "Arabic/French";
        if (portugueseCountries.includes(countryName)) return "Portuguese";
        return "English";
    };

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
                    resource.title.toLowerCase().includes(query) ||
                    resource.countryName.toLowerCase().includes(query) ||
                    resource.description.toLowerCase().includes(query) ||
                    resource.authority?.toLowerCase().includes(query) ||
                    resource.features?.some((f) => f.toLowerCase().includes(query))
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
        return filteredResources.reduce((groups, resource) => {
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
            <div className="max-w-7xl mx-auto container px-6 pb-16">
                {/* Error Alert */}
                {hasError && (
                    <div className="mb-6">
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="flex items-center justify-between">
                                <span>Failed to load resources. Please check your connection and try again.</span>
                                <Button variant="outline" size="sm" onClick={handleRetry} className="ml-4">
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
                                        className="flex items-center justify-center gap-2 data-[state=active]:shadow-sm"
                                    >
                                        <Shield className="h-4 w-4" />
                                        <span>Data Protection</span>
                                        <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">
                                            {resourceCounts[ResourceType.DATA_PROTECTION]}
                                        </span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value={ResourceType.DIGITAL_ID}
                                        className="flex items-center justify-center gap-2 data-[state=active]:shadow-sm"
                                    >
                                        <FileDigit className="h-4 w-4" />
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
                                    placeholder="Search resources..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-11 border-gray-200 min-w-[350px]"
                                />
                            </div>
                            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                                <SelectTrigger className="h-11 border-gray-200 min-w-[180px]">
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
                    <div className="bg-white rounded-lg shadow-md p-16 text-center">
                        <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                        <p className="text-xl text-gray-600">Loading resources...</p>
                    </div>
                )}

                {/* Resources Content */}
                {!isLoading && (
                    <div>
                        {filteredResources.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-16 text-center">
                                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                                <p className="text-xl text-gray-600 mb-6">
                                    No resources found. Try adjusting your search or filters.
                                </p>
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

// Resource Card Component
function ResourceCard({ resource }: { resource: Resource }) {
    const getBorderColor = () => {
        if (resource.type === ResourceType.DATA_PROTECTION) {
            return "border-t-emerald-500";
        }

        // Different colors based on link type for Digital ID
        switch (resource.linkType) {
            case "Academic Research":
                return "border-t-blue-600";
            case "Policy Research":
                return "border-t-purple-600";
            case "Development Partner":
                return "border-t-orange-500";
            case "Research Institute":
                return "border-t-indigo-500";
            case "Government":
            case "Official":
                return "border-t-green-600";
            default:
                return "border-t-blue-500";
        }
    };

    const handleLinkClick = (url: string) => {
        if (url && url !== "#") {
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <Card
            className={cn(
                "border border-gray-200 overflow-hidden h-full transition-all hover:-translate-y-1 hover:shadow-lg relative group border-t-4",
                getBorderColor()
            )}
        >
            <div className="p-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                            {resource.flagEmoji}
                        </div>
                        <span className="font-medium text-gray-700">{resource.countryName}</span>
                    </div>
                    <span className="text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded">{resource?.yearLaunched || resource?.year}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-start gap-2">
                    <span className="text-primary mt-1">{resource.icon}</span>
                    <span>{resource.title}</span>
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{resource.description}</p>

                {/* Additional info for Digital ID */}
                {resource.type === ResourceType.DIGITAL_ID && (
                    <div className="mb-4 space-y-2">
                        {resource.coverage && (
                            <div className="text-xs text-gray-600">
                                <span className="font-medium">Coverage:</span> {resource.coverage}
                            </div>
                        )}
                        {resource.authority && (
                            <div className="text-xs text-gray-600">
                                <span className="font-medium">Authority:</span> {resource.authority}
                            </div>
                        )}
                        {resource.features && resource.features.length > 0 && (
                            <div className="text-xs text-gray-600">
                                <span className="font-medium">Features:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {resource.features.slice(0, 3).map((feature, index) => (
                                        <span
                                            key={`${resource.id}-feature-${index}`}
                                            className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                    {resource.features.length > 3 && (
                                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                            +{resource.features.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                        {resource.linkType && (
                            <div className="text-xs text-gray-600">
                                <span className="font-medium">Source:</span>
                                <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs ml-1">
                                    {resource.linkType}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Additional info for Data Protection */}
                {resource.type === ResourceType.DATA_PROTECTION && (
                    <div className="mb-4 space-y-2">
                        {resource.malaboStatus && (
                            <div className="text-xs text-gray-600">
                                <span className="font-medium">Malabo Convention:</span>
                                <span
                                    className={cn(
                                        "px-1.5 py-0.5 rounded text-xs ml-1",
                                        resource.malaboStatus === "Ratified"
                                            ? "bg-green-100 text-green-700"
                                            : resource.malaboStatus === "Signed"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-gray-100 text-gray-700"
                                    )}
                                >
                                    {resource.malaboStatus}
                                </span>
                            </div>
                        )}
                        {resource.linkType && (
                            <div className="text-xs text-gray-600">
                                <span className="font-medium">Source:</span>
                                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs ml-1">
                                    {resource.linkType}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Metadata */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <span className="text-xs text-gray-500">
                        <span className="text-gray-400">Language:</span> {resource.language}
                    </span>
                    {resource.fileType && (
                        <span className="text-xs text-gray-500">
                            <span className="text-gray-400">Format:</span> {resource.fileType}
                        </span>
                    )}
                    {resource.isOfficial && (
                        <span className="text-xs text-primary flex items-center">
                            <Check className="h-3 w-3 mr-1" /> Official
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-auto">
                    {resource.documentUrl && resource.documentUrl !== "#" && (
                        <Button
                            className="flex-1 flex items-center gap-2"
                            onClick={() => handleLinkClick(resource.documentUrl!)}
                        >
                            <ExternalLink className="h-4 w-4" />
                            <span>View Resource</span>
                        </Button>
                    )}
                    {resource.websiteUrl && resource.websiteUrl !== "#" && (
                        <Button
                            variant="outline"
                            className="flex-1 flex items-center gap-2"
                            onClick={() => handleLinkClick(resource.websiteUrl!)}
                        >
                            <ExternalLink className="h-4 w-4" />
                            <span>Visit Website</span>
                        </Button>
                    )}
                    {(!resource.documentUrl || resource.documentUrl === "#") &&
                        (!resource.websiteUrl || resource.websiteUrl === "#") && (
                            <Button variant="outline" className="flex-1" disabled>
                                <span>No Document Available</span>
                            </Button>
                        )}
                </div>
            </div>
        </Card>
    );
}
