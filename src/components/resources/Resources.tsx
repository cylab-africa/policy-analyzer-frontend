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
import React, { useEffect, useMemo, useState } from "react";

// Import API hooks
import {
    useGetDigitalIdFilesQuery,
    useGetDigitalIdsQuery,
    useGetPolicyLawFilesQuery,
    useGetPolicyLawsQuery,
    type DigitalId,
    type PolicyLaw,
} from "@/redux/api/apiSlice";

// Enum for resource type
enum ResourceType {
    DATA_PROTECTION = "data-protection",
    DIGITAL_ID = "digital-id",
}

// Enum for digital ID document types
enum DigitalIdDocType {
    REGISTRATION = "digitalIdRegistration",
    NATIONAL_ID = "digitalIdNational",
    IMMIGRATION = "digitalIdImmigration",
    OTHER = "digitalIdOther",
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
    const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
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
        data: policyLawFiles = [],
        isLoading: policyFilesLoading,
        error: policyFilesError,
        refetch: refetchPolicyFiles,
    } = useGetPolicyLawFilesQuery({ page: 1, limit: 100 });

    const {
        data: digitalIds = [],
        isLoading: digitalIdsLoading,
        error: digitalIdsError,
        refetch: refetchDigitalIds,
    } = useGetDigitalIdsQuery({ page: 1, limit: 100 });

    const {
        data: digitalIdFiles = [],
        isLoading: digitalFilesLoading,
        error: digitalFilesError,
        refetch: refetchDigitalFiles,
    } = useGetDigitalIdFilesQuery({ page: 1, limit: 100 });

    // Helper functions - moved before useMemo to avoid initialization errors
    const getCountryCode = (countryName: string): string => {
        // Create reverse mapping from country name to code
        const countryMap: Record<string, string> = {
            Algeria: "DZ",
            Angola: "AO",
            Benin: "BJ",
            Botswana: "BW",
            "Burkina Faso": "BF",
            Burundi: "BI",
            Cameroon: "CM",
            "Cape Verde": "CV",
            "Central African Republic": "CF",
            Chad: "TD",
            Comoros: "KM",
            Congo: "CG",
            "Democratic Republic of the Congo": "CD",
            "Ivory Coast": "CI",
            Djibouti: "DJ",
            Egypt: "EG",
            "Equatorial Guinea": "GQ",
            Eritrea: "ER",
            Eswatini: "SZ",
            Ethiopia: "ET",
            Gabon: "GA",
            Gambia: "GM",
            Ghana: "GH",
            Guinea: "GN",
            "Guinea-Bissau": "GW",
            Kenya: "KE",
            Lesotho: "LS",
            Liberia: "LR",
            Libya: "LY",
            Madagascar: "MG",
            Malawi: "MW",
            Mali: "ML",
            Mauritania: "MR",
            Mauritius: "MU",
            Morocco: "MA",
            Mozambique: "MZ",
            Namibia: "NA",
            Niger: "NE",
            Nigeria: "NG",
            Rwanda: "RW",
            "São Tomé and Príncipe": "ST",
            Senegal: "SN",
            Seychelles: "SC",
            "Sierra Leone": "SL",
            Somalia: "SO",
            "South Africa": "ZA",
            "South Sudan": "SS",
            Sudan: "SD",
            Tanzania: "TZ",
            Togo: "TG",
            Tunisia: "TN",
            Uganda: "UG",
            Zambia: "ZM",
            Zimbabwe: "ZW",
        };
        return countryMap[countryName] || "";
    };

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
            "Democratic Republic of the Congo",
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
            "Gambia",
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
        const northAfrica = ["Algeria", "Egypt", "Libya", "Morocco", "Sudan", "Tunisia", "Western Sahara"];

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
            "Democratic Republic of the Congo",
            "Djibouti",
            "Gabon",
            "Guinea",
            "Ivory Coast",
            "Madagascar",
            "Mali",
            "Niger",
            "Rwanda",
            "Senegal",
            "Seychelles",
            "Togo",
        ];
        const arabicCountries = ["Algeria", "Egypt", "Libya", "Mauritania", "Morocco", "Sudan", "Tunisia"];
        const portugueseCountries = ["Angola", "Cape Verde", "Guinea-Bissau", "Mozambique", "São Tomé and Príncipe"];

        if (francophoneCountries.includes(countryName)) return "French";
        if (arabicCountries.includes(countryName)) return "Arabic/French";
        if (portugueseCountries.includes(countryName)) return "Portuguese";
        return "English";
    };

    const getDigitalIdInfo = (docType: string, countryName: string) => {
        switch (docType) {
            case DigitalIdDocType.REGISTRATION:
                return {
                    icon: <Book className="h-[18px] w-[18px]" />,
                    title: `${countryName} Civil Registration Law`,
                };
            case DigitalIdDocType.NATIONAL_ID:
                return {
                    icon: <CreditCard className="h-[18px] w-[18px]" />,
                    title: `${countryName} National ID System`,
                };
            case DigitalIdDocType.IMMIGRATION:
                return {
                    icon: <Globe className="h-[18px] w-[18px]" />,
                    title: `${countryName} Immigration & Citizenship`,
                };
            case DigitalIdDocType.OTHER:
                return {
                    icon: <File className="h-[18px] w-[18px]" />,
                    title: `${countryName} Digital ID Framework`,
                };
            default:
                return {
                    icon: <FileDigit className="h-[18px] w-[18px]" />,
                    title: `${countryName} Digital ID Document`,
                };
        }
    };

    const getDigitalIdDescription = (docType: string, digitalId: DigitalId): string => {
        const baseDesc = digitalId.description || "Digital identity system documentation";
        const features = digitalId.features?.join(", ") || "";
        const coverage = digitalId.coverage ? ` with ${digitalId.coverage} coverage` : "";
        const authority = digitalId.authority ? ` managed by ${digitalId.authority}` : "";

        return `${baseDesc}${coverage}${authority}. Features: ${features}`;
    };

    const getEstimatedYear = (countryCode: string, docType: string): string => {
        // You can expand this based on actual data or estimates
        const yearMapping: Record<string, Record<string, string>> = {
            NG: { digitalIdNational: "2014", digitalIdOther: "2019" },
            KE: { digitalIdRegistration: "2015" },
            GH: { digitalIdRegistration: "2012", digitalIdNational: "2017" },
            // Add more mappings as needed
        };
        return yearMapping[countryCode]?.[docType] || "2020";
    };

    // Transform API data into unified resources
    const resources = useMemo(() => {
        if (!policyLaws || !digitalIds) {
            return [];
        }

        const allResources: Resource[] = [];

        // Process Data Protection Resources
        try {
            // Create a map of files by country code for quick lookup
            const filesMap = new Map();
            if (policyLawFiles && Array.isArray(policyLawFiles)) {
                policyLawFiles.forEach((file) => {
                    if (file.isoAlpha2) {
                        filesMap.set(file.isoAlpha2, file);
                    }
                });
            }

            if (Array.isArray(policyLaws)) {
                policyLaws.forEach((law: PolicyLaw) => {
                    // Check if we have enacted legislation
                    if (law.dataProtectionLegislationStatus === "Enacted") {
                        const countryCode = getCountryCode(law.country);
                        const file = filesMap.get(countryCode);

                        // For now, let's include resources even without files to see if the logic works
                        const region = getRegion(law.country);
                        const resource: Resource = {
                            id: `dp-${countryCode || law.country.replace(/\s+/g, "")}`,
                            countryCode: countryCode || "",
                            countryName: law.country,
                            flagEmoji: FLAG_EMOJIS[countryCode] || "🏳️",
                            region,
                            title: `${law.country} Data Protection Act`,
                            description: `The official data protection legislation of ${law.country}, enacted in ${law.yearLegislationEnacted}.`,
                            type: ResourceType.DATA_PROTECTION,
                            documentUrl: file?.link || "#",
                            year: law.yearLegislationEnacted || "Unknown",
                            language: getDocumentLanguage(law.country),
                            fileType: "PDF",
                            isOfficial: true,
                            icon: <Shield className="h-[18px] w-[18px]" />,
                            malaboStatus: law.malaboConventionStatus,
                            legislationStatus: law.dataProtectionLegislationStatus,
                        };

                        allResources.push(resource);
                    }
                });
            }
        } catch (error) {
            console.error("Error processing policy laws:", error);
        }

        // Process Digital ID Resources
        try {
            if (Array.isArray(digitalIds)) {
                digitalIds.forEach((digitalId: DigitalId) => {
                    const countryCode = digitalId.isoAlpha2;
                    const region = getRegion(digitalId.country);

                    // Process each link in the digital ID record
                    if (digitalId.links && Array.isArray(digitalId.links) && digitalId.links.length > 0) {
                        digitalId.links.forEach((linkObj, index) => {
                            if (linkObj.link) {
                                const { icon, title } = getDigitalIdInfo(linkObj.name, digitalId.country);
                                const description = getDigitalIdDescription(linkObj.name, digitalId);

                                const resource: Resource = {
                                    id: `id-${countryCode}-${linkObj.name}-${index}`,
                                    countryCode,
                                    countryName: digitalId.country,
                                    flagEmoji: FLAG_EMOJIS[countryCode] || "🏳️",
                                    region,
                                    title,
                                    description,
                                    type: ResourceType.DIGITAL_ID,
                                    documentUrl: linkObj.link,
                                    year: getEstimatedYear(countryCode, linkObj.name),
                                    language: getDocumentLanguage(digitalId.country),
                                    fileType: "PDF",
                                    isOfficial: true,
                                    docType: linkObj.name,
                                    icon,
                                    coverage: digitalId.coverage,
                                    authority: digitalId.authority,
                                    features: digitalId.features,
                                };

                                allResources.push(resource);
                            }
                        });
                    } else {
                        // Add a resource even without links for debugging
                        const resource: Resource = {
                            id: `id-${countryCode}-basic`,
                            countryCode,
                            countryName: digitalId.country,
                            flagEmoji: FLAG_EMOJIS[countryCode] || "🏳️",
                            region,
                            title: `${digitalId.country} Digital ID System`,
                            description: digitalId.description || `Digital identity system in ${digitalId.country}`,
                            type: ResourceType.DIGITAL_ID,
                            documentUrl: "#",
                            year: "2020",
                            language: getDocumentLanguage(digitalId.country),
                            fileType: "PDF",
                            isOfficial: true,
                            icon: <FileDigit className="h-[18px] w-[18px]" />,
                            coverage: digitalId.coverage,
                            authority: digitalId.authority,
                            features: digitalId.features,
                        };

                        allResources.push(resource);
                    }
                });
            }
        } catch (error) {
            console.error("Error processing digital IDs:", error);
        }

        return allResources;
    }, [policyLaws?.length, policyLawFiles?.length, digitalIds?.length, digitalIdFiles?.length]);

    // Debug the filtering process
    const filteredResourcesData = useMemo(() => {
        let filtered = resources.filter((resource) => {
            const matchesTab = resource.type === activeTab;
            return matchesTab;
        });

        if (selectedRegion !== "all") {
            filtered = filtered.filter((resource) => {
                const matchesRegion = resource.region === selectedRegion;
                return matchesRegion;
            });
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

    // Update filtered resources only when the computed data changes
    useEffect(() => {
        setFilteredResources(filteredResourcesData);
    }, [filteredResourcesData]);

    // Get unique regions from resources - memoized to prevent re-computation
    const regions = useMemo(() => {
        const uniqueRegions = [...new Set(resources.map((resource) => resource.region))];

        const sorted = uniqueRegions
            .filter((region) => region.toLowerCase() !== "other")
            .sort((a, b) => a.localeCompare(b));

        const hasOther = uniqueRegions.some((region) => region.toLowerCase() === "other");
        if (hasOther) {
            sorted.push("Other");
        }

        return ["all", ...sorted];
    }, [resources]);

    // Group resources by region - memoized to prevent re-computation
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

    console.log("Grouped Resources:", groupedResources);

    // Sort regions - memoized to prevent re-computation
    const sortedRegions = useMemo(() => {
        return Object.keys(groupedResources).sort((a, b) => {
            if (a === "Continental") return -1;
            if (b === "Continental") return 1;
            return a.localeCompare(b);
        });
    }, [groupedResources]);

    // Resource counts - memoized to prevent re-computation
    const resourceCounts = useMemo(() => {
        return {
            [ResourceType.DATA_PROTECTION]: resources.filter((r) => r.type === ResourceType.DATA_PROTECTION).length,
            [ResourceType.DIGITAL_ID]: resources.filter((r) => r.type === ResourceType.DIGITAL_ID).length,
        };
    }, [resources]);

    // Loading state
    const isLoading = policyLawsLoading || policyFilesLoading || digitalIdsLoading || digitalFilesLoading;

    // Error state
    const hasError = policyLawsError || policyFilesError || digitalIdsError || digitalFilesError;

    // Retry function
    const handleRetry = () => {
        refetchPolicyLaws();
        refetchPolicyFiles();
        refetchDigitalIds();
        refetchDigitalFiles();
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
                                        .map((region, idx) => (
                                            <SelectItem key={`region-${region}-${idx}`} value={region}>
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
                                <div
                                    key={`${index}-${region}-${groupedResources[region].map((r) => r.id).join("-")}`}
                                    className="mb-10"
                                >
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
                                        {groupedResources[region].map((resource, index) => (
                                            <ResourceCard key={`${index}-${region}`} resource={resource} />
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
            return "border-t-primary";
        }
        if (resource.type === ResourceType.DIGITAL_ID) {
            switch (resource.docType) {
                case DigitalIdDocType.REGISTRATION:
                    return "border-t-purple-600";
                case DigitalIdDocType.NATIONAL_ID:
                    return "border-t-blue-500";
                case DigitalIdDocType.IMMIGRATION:
                    return "border-t-amber-500";
                case DigitalIdDocType.OTHER:
                    return "border-t-orange-500";
                default:
                    return "border-t-blue-500";
            }
        }
        return "border-t-primary";
    };

    const isSpecial = resource.region === "Continental";

    // console.log("resource", resource);

    return (
        <Card
            className={cn(
                "border border-gray-200 overflow-hidden h-full transition-all hover:-translate-y-1 hover:shadow-lg relative group border-t-4",
                getBorderColor(),
                isSpecial && "border-2 border-primary/10 shadow-md"
            )}
        >
            {isSpecial && (
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-blue-500 to-orange-500"></div>
            )}

            <div className="p-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                            {resource.flagEmoji}
                        </div>
                        <span className="font-medium text-gray-700">{resource.countryName}</span>
                    </div>
                    <span className="text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded">{resource.year}</span>
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
                                            key={`${resource.id}-feature-${feature}-${index}`}
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
                    {resource.documentUrl && (
                        <Button className="flex-1 flex items-center gap-2" asChild>
                            <a href={resource.documentUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                                <span>View Document</span>
                            </a>
                        </Button>
                    )}
                    {resource.websiteUrl && resource.websiteUrl !== "#" && (
                        <Button variant="outline" className="flex-1 flex items-center gap-2" asChild>
                            <a href={resource.websiteUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                                <span>Visit Website</span>
                            </a>
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
