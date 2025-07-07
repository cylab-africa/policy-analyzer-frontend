"use client";

import React, { useState, useEffect } from "react";
import {
    ExternalLink,
    FileText,
    Check,
    AlertTriangle,
    Search,
    FileDigit,
    CreditCard,
    Globe,
    Shield,
    Book,
    File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Import your data
import africaData from "@/data/countries_law_data.json";
import documentLinks from "@/data/data_protection_links.json";
import digitalIdLinks from "@/data/digital_id_links.json";

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

// Interface for resource data
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
}

export default function ResourcesPage() {
    const [activeTab, setActiveTab] = useState<ResourceType>(ResourceType.DATA_PROTECTION);
    const [resources, setResources] = useState<Resource[]>([]);
    const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
    const [selectedRegion, setSelectedRegion] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Digital ID document type descriptions
    const digitalIdDescriptions = {
        [DigitalIdDocType.REGISTRATION]: "Civil registration law governing birth registration and legal identity",
        [DigitalIdDocType.NATIONAL_ID]: "Legislation establishing the national ID system and its governance",
        [DigitalIdDocType.IMMIGRATION]: "Immigration and citizenship legislation related to identity",
        [DigitalIdDocType.OTHER]: "Other policies, guidelines and regulatory frameworks for digital identity",
    };

    // Digital ID document type icons and titles
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
                    title: `${countryName} National ID Legislation`,
                };
            case DigitalIdDocType.IMMIGRATION:
                return {
                    icon: <Globe className="h-[18px] w-[18px]" />,
                    title: `${countryName} Immigration & Citizenship Law`,
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

    // Generate resources data
    useEffect(() => {
        setIsLoading(true);
        const allResources: Resource[] = [];

        // Generate data protection resources
        Object.values(africaData).forEach((country) => {
            const region = getRegion(country.name);
            const countryCode = country.isoAlpha2;

            // Only add resources for countries with legislation enacted AND with a document link
            if (
                country.dataProtectionLegislationStatus === "Enacted" &&
                documentLinks[countryCode as keyof typeof documentLinks]?.dataProtectionLaw
            ) {
                allResources.push({
                    id: `dp-${countryCode}-1`,
                    countryCode: countryCode,
                    countryName: country.name,
                    flagEmoji: country.flagEmoji || getFlagEmoji(countryCode),
                    region,
                    title: `${country.name} Data Protection Act`,
                    description: `The official data protection legislation of ${country.name}, enacted in ${country.yearLegislationEnacted}.`,
                    type: ResourceType.DATA_PROTECTION,
                    documentUrl: documentLinks[countryCode as keyof typeof documentLinks]?.dataProtectionLaw,
                    year: country.yearLegislationEnacted || "",
                    language: getDocumentLanguage(country.name),
                    fileType: "PDF",
                    isOfficial: true,
                    icon: <Shield className="h-[18px] w-[18px]" />,
                });

                // Add guidelines for countries that have them
                if (
                    (
                        documentLinks[countryCode as keyof typeof documentLinks] as {
                            dataProtectionLaw: string;
                            dataProtectionGuidelines?: string;
                        }
                    )?.dataProtectionGuidelines
                ) {
                    allResources.push({
                        id: `dp-${countryCode}-2`,
                        countryCode: countryCode,
                        countryName: country.name,
                        flagEmoji: country.flagEmoji || getFlagEmoji(countryCode),
                        region,
                        title: `${country.name} Data Protection Guidelines`,
                        description: `Implementation guidelines and best practices for ${country.name}'s data protection law.`,
                        type: ResourceType.DATA_PROTECTION,
                        documentUrl: (
                            documentLinks[countryCode as keyof typeof documentLinks] as {
                                dataProtectionLaw: string;
                                dataProtectionGuidelines?: string;
                            }
                        )?.dataProtectionGuidelines,
                        year: (parseInt(country.yearLegislationEnacted || "2020") + 1).toString(),
                        language: getDocumentLanguage(country.name),
                        fileType: "PDF",
                        isOfficial: true,
                        icon: <FileText className="h-[18px] w-[18px]" />,
                    });
                }
            }
        });

        // Generate digital ID resources
        Object.entries(digitalIdLinks as Record<string, Record<string, string>>).forEach(([countryCode, links]) => {
            // Skip Africa Union for now to handle it separately
            if (countryCode === "AU") return;

            // Find country information
            const country = Object.values(africaData).find((c) => c.isoAlpha2 === countryCode);

            let countryName = "";
            let region = "";
            let flagEmoji = "";

            if (country) {
                countryName = country.name;
                region = getRegion(country.name);
                flagEmoji = country.flagEmoji || getFlagEmoji(countryCode);
            } else if (countryCode === "ZNZ") {
                // Special case for Zanzibar
                countryName = "Zanzibar";
                region = "East Africa";
                flagEmoji = "🇹🇿"; // Using Tanzania flag
            }

            if (countryName) {
                // Process each type of digital ID document
                Object.entries(links).forEach(([docType, url]) => {
                    // Get document info based on type
                    const { icon, title } = getDigitalIdInfo(docType, countryName);
                    const description =
                        digitalIdDescriptions[docType as DigitalIdDocType] || "Legal framework for digital identity";
                    const year = getEstimatedYear(countryCode, docType);

                    allResources.push({
                        id: `id-${countryCode}-${docType}`,
                        countryCode,
                        countryName,
                        flagEmoji,
                        region,
                        title,
                        description,
                        type: ResourceType.DIGITAL_ID,
                        documentUrl: url as string,
                        year,
                        language: getDocumentLanguage(countryName),
                        fileType: "PDF",
                        isOfficial: true,
                        docType,
                        icon,
                    });
                });
            }
        });

        // Add Africa Union as a continental resource
        if (digitalIdLinks.AU?.digitalIdOther) {
            allResources.push({
                id: `id-AU-other`,
                countryCode: "AU",
                countryName: "Africa Union",
                flagEmoji: "🌍", // Using Africa emoji instead of AU flag
                region: "Continental",
                title: "Africa Union Digital ID Framework",
                description: "Continental framework for digital identity systems across Africa",
                type: ResourceType.DIGITAL_ID,
                documentUrl: digitalIdLinks.AU.digitalIdOther,
                year: "2022",
                language: "English",
                fileType: "PDF",
                isOfficial: true,
                docType: DigitalIdDocType.OTHER,
                icon: <Globe className="h-[18px] w-[18px]" />,
            });
        }

        setResources(allResources);
        setIsLoading(false);
    }, []);

    // Apply filters when tab, region, or search changes
    useEffect(() => {
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
                    resource.description.toLowerCase().includes(query)
            );
        }

        setFilteredResources(filtered);
    }, [resources, activeTab, selectedRegion, searchQuery]);

    // Function to get language based on country (simplified)
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

        if (francophoneCountries.includes(countryName)) {
            return "French";
        } else if (arabicCountries.includes(countryName)) {
            return "Arabic/French";
        } else if (portugueseCountries.includes(countryName)) {
            return "Portuguese";
        }

        return "English";
    };

    // Function to get estimated year for digital ID documents
    const getEstimatedYear = (countryCode: string, docType: string): string => {
        // Estimated years for each country's digital ID systems
        // This would be replaced with actual data
        const yearMapping: Record<string, Record<string, string>> = {
            KE: { digitalIdRegistration: "2015" },
            GH: {
                digitalIdRegistration: "2012",
                digitalIdNational: "2017",
                digitalIdOther: "2018",
            },
            UG: { digitalIdRegistration: "2015" },
            TZ: {
                digitalIdRegistration: "2013",
                digitalIdNational: "2018",
                digitalIdOther: "2019",
            },
            RW: { digitalIdImmigration: "2014", digitalIdNational: "2015" },
            ZM: { digitalIdRegistration: "2018" },
            ET: { digitalIdRegistration: "2017", digitalIdNational: "2020" },
            NG: { digitalIdNational: "2014", digitalIdOther: "2019" },
            BW: { digitalIdRegistration: "2016" },
            BJ: { digitalIdRegistration: "2015" },
            ZNZ: { digitalIdRegistration: "2018" },
            AU: { digitalIdOther: "2022" },
        };

        return yearMapping[countryCode]?.[docType] || "2020";
    };

    // Function to get flag emoji if missing
    const getFlagEmoji = (countryCode: string): string => {
        // Simplified helper function for demo
        return "🏳️";
    };

    // Function to determine region (simplified version)
    const getRegion = (countryName: string): string => {
        // North Africa
        const northAfrica = ["Morocco", "Algeria", "Tunisia", "Libya", "Egypt", "Western Sahara", "Mauritania"];

        // West Africa
        const westAfrica = [
            "Nigeria",
            "Ghana",
            "Senegal",
            "Ivory Coast",
            "Guinea",
            "Mali",
            "Burkina Faso",
            "Benin",
            "Niger",
            "Togo",
            "Liberia",
            "Sierra Leone",
            "Gambia",
            "Guinea-Bissau",
            "Cape Verde",
        ];

        // East Africa
        const eastAfrica = [
            "Kenya",
            "Tanzania",
            "Uganda",
            "Ethiopia",
            "Rwanda",
            "Burundi",
            "Somalia",
            "Djibouti",
            "Eritrea",
            "South Sudan",
            "Sudan",
            "Seychelles",
            "Comoros",
            "Madagascar",
            "Mauritius",
            "Zanzibar",
        ];

        // Central Africa
        const centralAfrica = [
            "Cameroon",
            "Chad",
            "Central African Republic",
            "Congo",
            "Gabon",
            "Equatorial Guinea",
            "Sao Tome and Principe",
            "Democratic Republic of the Congo",
        ];

        // Southern Africa
        const southernAfrica = [
            "South Africa",
            "Namibia",
            "Botswana",
            "Zimbabwe",
            "Mozambique",
            "Zambia",
            "Malawi",
            "Angola",
            "Lesotho",
            "Eswatini",
        ];

        if (northAfrica.includes(countryName)) return "North Africa";
        if (westAfrica.includes(countryName)) return "West Africa";
        if (eastAfrica.includes(countryName)) return "East Africa";
        if (centralAfrica.includes(countryName)) return "Central Africa";
        if (southernAfrica.includes(countryName)) return "Southern Africa";
        if (countryName === "Africa Union") return "Continental";

        return "Other";
    };

    // Get unique regions from resources
    const regions = ["all", ...new Set(resources.map((resource) => resource.region))].sort();

    // Group resources by region
    const groupedResources = filteredResources.reduce((groups, resource) => {
        const { region } = resource;
        if (!groups[region]) {
            groups[region] = [];
        }
        groups[region].push(resource);
        return groups;
    }, {} as Record<string, Resource[]>);

    // Sort regions alphabetically, but ensure Continental comes first if it exists
    const sortedRegions = Object.keys(groupedResources).sort((a, b) => {
        if (a === "Continental") return -1;
        if (b === "Continental") return 1;
        return a.localeCompare(b);
    });

    // Resource count badges
    const resourceCounts = {
        [ResourceType.DATA_PROTECTION]: resources.filter((r) => r.type === ResourceType.DATA_PROTECTION).length,
        [ResourceType.DIGITAL_ID]: resources.filter((r) => r.type === ResourceType.DIGITAL_ID).length,
    };

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            {/* Page Header */}

            <div className="max-w-7xl mx-auto container px-6 pb-16">
                {/* Tabs and Filters Row */}
                <div className="mb-10">
                    {/* Unified container with consistent styling */}
                    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4 items-stretch">
                        {/* Tabs - now with more compact design */}
                        <div className="flex-1 min-w-0">
                            <Tabs
                                defaultValue={activeTab}
                                onValueChange={(value) => setActiveTab(value as ResourceType)}
                                className="w-full"
                            >
                                <TabsList className="grid grid-cols-2 h-12">
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
                                </TabsList>
                            </Tabs>
                        </div>

                        {/* Search and Filter - aligned with tabs */}
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
                                <SelectTrigger className="h-20 border-gray-200 min-w-[180px]">
                                    <SelectValue placeholder="Filter by Region" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Regions</SelectItem>
                                    {regions
                                        .filter((r) => r !== "all")
                                        .map((region) => (
                                            <SelectItem key={region} value={region}>
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
                        <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                        <p className="text-xl text-gray-600">Loading resources...</p>
                    </div>
                )}

                {/* Resources by Region */}
                <div>
                    {!isLoading && filteredResources.length === 0 ? (
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
                        sortedRegions.map((region) => (
                            <div key={region} className="mb-10">
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
                                    {groupedResources[region].map((resource) => (
                                        <ResourceCard key={resource.id} resource={resource} />
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
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
                <p className="text-gray-600 text-sm mb-6 flex-grow">{resource.description}</p>

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
