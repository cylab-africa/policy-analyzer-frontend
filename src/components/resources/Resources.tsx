/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
    AlertTriangle,
    Book,
    Check,
    Clock,
    CreditCard,
    Download,
    ExternalLink,
    File,
    FileDigit,
    FileText,
    Filter,
    Globe,
    MapPin,
    Search,
    Shield,
    Sparkles,
    X
} from "lucide-react";
import React, { useEffect, useState } from "react";

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
    const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

    // Digital ID document type descriptions
    const digitalIdDescriptions = {
        [DigitalIdDocType.REGISTRATION]: "Civil registration law governing birth registration and legal identity",
        [DigitalIdDocType.NATIONAL_ID]: "Legislation establishing the national ID system and its governance",
        [DigitalIdDocType.IMMIGRATION]: "Immigration and citizenship legislation related to identity",
        [DigitalIdDocType.OTHER]: "Other policies, guidelines and regulatory frameworks for digital identity",
    };

    // Digital ID document type info
    const getDigitalIdInfo = (docType: string, countryName: string) => {
        switch (docType) {
            case DigitalIdDocType.REGISTRATION:
                return {
                    icon: <Book className="h-4 w-4" />,
                    title: `${countryName} Civil Registration Law`,
                    color: "purple",
                };
            case DigitalIdDocType.NATIONAL_ID:
                return {
                    icon: <CreditCard className="h-4 w-4" />,
                    title: `${countryName} National ID Legislation`,
                    color: "blue",
                };
            case DigitalIdDocType.IMMIGRATION:
                return {
                    icon: <Globe className="h-4 w-4" />,
                    title: `${countryName} Immigration & Citizenship Law`,
                    color: "amber",
                };
            case DigitalIdDocType.OTHER:
                return {
                    icon: <File className="h-4 w-4" />,
                    title: `${countryName} Digital ID Framework`,
                    color: "orange",
                };
            default:
                return {
                    icon: <FileDigit className="h-4 w-4" />,
                    title: `${countryName} Digital ID Document`,
                    color: "blue",
                };
        }
    };

    // Generate resources data (keeping your existing logic)
    useEffect(() => {
        setIsLoading(true);
        const allResources: Resource[] = [];

        // Generate data protection resources
        Object.values(africaData).forEach((country) => {
            const region = getRegion(country.name);
            const countryCode = country.isoAlpha2;

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
                    icon: <Shield className="h-4 w-4" />,
                });

                // Add guidelines if available
                if ((documentLinks[countryCode as keyof typeof documentLinks] as any)?.dataProtectionGuidelines) {
                    allResources.push({
                        id: `dp-${countryCode}-2`,
                        countryCode: countryCode,
                        countryName: country.name,
                        flagEmoji: country.flagEmoji || getFlagEmoji(countryCode),
                        region,
                        title: `${country.name} Data Protection Guidelines`,
                        description: `Implementation guidelines and best practices for ${country.name}'s data protection law.`,
                        type: ResourceType.DATA_PROTECTION,
                        documentUrl: (documentLinks[countryCode as keyof typeof documentLinks] as any)
                            ?.dataProtectionGuidelines,
                        year: (parseInt(country.yearLegislationEnacted || "2020") + 1).toString(),
                        language: getDocumentLanguage(country.name),
                        fileType: "PDF",
                        isOfficial: true,
                        icon: <FileText className="h-4 w-4" />,
                    });
                }
            }
        });

        // Generate digital ID resources
        Object.entries(digitalIdLinks as Record<string, Record<string, string>>).forEach(([countryCode, links]) => {
            if (countryCode === "AU") return;

            const country = Object.values(africaData).find((c) => c.isoAlpha2 === countryCode);
            let countryName = "";
            let region = "";
            let flagEmoji = "";

            if (country) {
                countryName = country.name;
                region = getRegion(country.name);
                flagEmoji = country.flagEmoji || getFlagEmoji(countryCode);
            } else if (countryCode === "ZNZ") {
                countryName = "Zanzibar";
                region = "East Africa";
                flagEmoji = "🇹🇿";
            }

            if (countryName) {
                Object.entries(links).forEach(([docType, url]) => {
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

        // Add Africa Union
        if (digitalIdLinks.AU?.digitalIdOther) {
            allResources.push({
                id: `id-AU-other`,
                countryCode: "AU",
                countryName: "Africa Union",
                flagEmoji: "🌍",
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
                icon: <Globe className="h-4 w-4" />,
            });
        }

        setResources(allResources);
        setIsLoading(false);
    }, []);

    // Apply filters
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

    // Helper functions (keeping your existing ones)
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

    const getEstimatedYear = (countryCode: string, docType: string): string => {
        const yearMapping: Record<string, Record<string, string>> = {
            KE: { digitalIdRegistration: "2015" },
            GH: { digitalIdRegistration: "2012", digitalIdNational: "2017", digitalIdOther: "2018" },
            UG: { digitalIdRegistration: "2015" },
            TZ: { digitalIdRegistration: "2013", digitalIdNational: "2018", digitalIdOther: "2019" },
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

    const getFlagEmoji = (countryCode: string): string => {
        const flagMap: Record<string, string> = {
            DZ: "🇩🇿", // Algeria
            AO: "🇦🇴", // Angola
            BJ: "🇧🇯", // Benin
            BW: "🇧🇼", // Botswana
            BF: "🇧🇫", // Burkina Faso
            BI: "🇧🇮", // Burundi
            CM: "🇨🇲", // Cameroon
            CV: "🇨🇻", // Cape Verde
            CF: "🇨🇫", // Central African Republic
            TD: "🇹🇩", // Chad
            KM: "🇰🇲", // Comoros
            CG: "🇨🇬", // Congo
            CD: "🇨🇩", // Democratic Republic of the Congo
            DJ: "🇩🇯", // Djibouti
            EG: "🇪🇬", // Egypt
            GQ: "🇬🇶", // Equatorial Guinea
            ER: "🇪🇷", // Eritrea
            ET: "🇪🇹", // Ethiopia
            GA: "🇬🇦", // Gabon
            GM: "🇬🇲", // Gambia
            GH: "🇬🇭", // Ghana
            GN: "🇬🇳", // Guinea
            GW: "🇬🇼", // Guinea-Bissau
            CI: "🇨🇮", // Ivory Coast
            KE: "🇰🇪", // Kenya
            LS: "🇱🇸", // Lesotho
            LR: "🇱🇷", // Liberia
            LY: "🇱🇾", // Libya
            MG: "🇲🇬", // Madagascar
            MW: "🇲🇼", // Malawi
            ML: "🇲🇱", // Mali
            MR: "🇲🇷", // Mauritania
            MU: "🇲🇺", // Mauritius
            MA: "🇲🇦", // Morocco
            MZ: "🇲🇿", // Mozambique
            NA: "🇳🇦", // Namibia
            NE: "🇳🇪", // Niger
            NG: "🇳🇬", // Nigeria
            RW: "🇷🇼", // Rwanda
            ST: "🇸🇹", // São Tomé and Príncipe
            SN: "🇸🇳", // Senegal
            SC: "🇸🇨", // Seychelles
            SL: "🇸🇱", // Sierra Leone
            SO: "🇸🇴", // Somalia
            ZA: "🇿🇦", // South Africa
            SS: "🇸🇸", // South Sudan
            SD: "🇸🇩", // Sudan
            SZ: "🇸🇿", // Eswatini (Swaziland)
            TZ: "🇹🇿", // Tanzania
            TG: "🇹🇬", // Togo
            TN: "🇹🇳", // Tunisia
            UG: "🇺🇬", // Uganda
            ZM: "🇿🇲", // Zambia
            ZW: "🇿🇼", // Zimbabwe
            AU: "🌍", // Africa Union (special case)
            ZNZ: "🇹🇿", // Zanzibar (uses Tanzania flag)
        };

        return flagMap[countryCode] || "🏳️";
    };

    const getRegion = (countryName: string): string => {
        const regions = {
            "North Africa": ["Morocco", "Algeria", "Tunisia", "Libya", "Egypt", "Western Sahara", "Mauritania"],
            "West Africa": [
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
            ],
            "East Africa": [
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
            ],
            "Central Africa": [
                "Cameroon",
                "Chad",
                "Central African Republic",
                "Congo",
                "Gabon",
                "Equatorial Guinea",
                "Sao Tome and Principe",
                "Democratic Republic of the Congo",
            ],
            "Southern Africa": [
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
            ],
        };

        for (const [region, countries] of Object.entries(regions)) {
            if (countries.includes(countryName)) return region;
        }
        if (countryName === "Africa Union") return "Continental";
        return "Other";
    };

    // Get statistics
    const getStats = () => {
        const currentResources = resources.filter((r) => r.type === activeTab);
        const totalCountries = new Set(currentResources.map((r) => r.countryName)).size;
        const totalDocs = currentResources.length;
        const latestYear = Math.max(...currentResources.map((r) => parseInt(r.year)).filter((y) => !isNaN(y)));

        return { totalCountries, totalDocs, latestYear };
    };

    const stats = getStats();
    const regions = ["all", ...new Set(resources.map((resource) => resource.region))].sort();

    // Group resources by region
    const groupedResources = filteredResources.reduce((groups, resource) => {
        const { region } = resource;
        if (!groups[region]) groups[region] = [];
        groups[region].push(resource);
        return groups;
    }, {} as Record<string, Resource[]>);

    const sortedRegions = Object.keys(groupedResources).sort((a, b) => {
        if (a === "Continental") return -1;
        if (b === "Continental") return 1;
        return a.localeCompare(b);
    });

    const resourceCounts = {
        [ResourceType.DATA_PROTECTION]: resources.filter((r) => r.type === ResourceType.DATA_PROTECTION).length,
        [ResourceType.DIGITAL_ID]: resources.filter((r) => r.type === ResourceType.DIGITAL_ID).length,
    };

    // Filter component for mobile
    const FilterSheet = () => (
        <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="px-4 max-h-fit">
                <SheetHeader>
                    <SheetTitle>Filter Resources</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 pt-6">
                    <div>
                        <label className="text-sm font-medium mb-2 block">Region</label>
                        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                            <SelectTrigger>
                                <SelectValue />
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

                    <div>
                        <label className="text-sm font-medium mb-2 block">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedRegion("all");
                                setShowMobileFilters(false);
                            }}
                            className="w-full"
                        >
                            Clear Filters
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            <div className="max-w-7xl container mx-auto py-12">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    <Card className="border-0 bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-4 sm:p-6 text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                                {stats.totalCountries}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground font-medium">Countries</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-4 sm:p-6 text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1">
                                {stats.totalDocs}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground font-medium">Documents</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-4 sm:p-6 text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{stats.latestYear}</div>
                            <div className="text-xs sm:text-sm text-muted-foreground font-medium">Latest Year</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-4 sm:p-6 text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">5</div>
                            <div className="text-xs sm:text-sm text-muted-foreground font-medium">Regions</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Card className="shadow-none border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="bg-slate-50 border p-4 sm:p-6 lg:p-8">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                            {/* Tabs */}
                            <div className="flex-1">
                                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ResourceType)}>
                                    {/* <TabsList className="grid border grid-cols-2 w-full lg:max-w-4/6 p-0 sm:w-auto"> */}
                                    <TabsList className="grid grid-cols-1 sm:grid-cols-2 w-full xl:max-w-4/6 h-auto p-0 bg-white border">
                                        <TabsTrigger
                                            value={ResourceType.DATA_PROTECTION}
                                            className="flex items-center gap-2"
                                        >
                                            <Shield className="h-4 w-4" />
                                            <span>Data Protection</span>
                                            <Badge variant="outline" className="text-xs">
                                                {resourceCounts[ResourceType.DATA_PROTECTION]}
                                            </Badge>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value={ResourceType.DIGITAL_ID}
                                            className="flex items-center gap-2"
                                        >
                                            <FileDigit className="h-4 w-4" />
                                            <span>Digital ID</span>
                                            <Badge variant="outline" className="text-xs">
                                                {resourceCounts[ResourceType.DIGITAL_ID]}
                                            </Badge>
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                                {/* Mobile filter button */}
                                <FilterSheet />

                                {/* Desktop filters */}
                                <div className="hidden lg:flex gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                        <Input
                                            type="text"
                                            placeholder="Search resources..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9 pr-9 w-80"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery("")}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                                        <SelectTrigger className="w-48">
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
                    </CardHeader>

                    <CardContent className="p-4 sm:p-6 lg:p-8">
                        {/* Loading State */}
                        {isLoading && (
                            <div className="text-center py-16">
                                <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                                <p className="text-muted-foreground">Loading resources...</p>
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && filteredResources.length === 0 && (
                            <div className="text-center py-16">
                                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">No resources found</h3>
                                <p className="text-muted-foreground mb-6">
                                    Try adjusting your search or filters to find what you&apos;re looking for.
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
                        )}

                        {/* Resources Grid */}
                        {!isLoading && filteredResources.length > 0 && (
                            <div className="space-y-8">
                                {sortedRegions.map((region) => (
                                    <div key={region}>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="flex items-center gap-2">
                                                {region === "Continental" ? (
                                                    <Sparkles className="h-5 w-5 text-primary" />
                                                ) : (
                                                    <MapPin className="h-5 w-5 text-muted-foreground" />
                                                )}
                                                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                                                    {region === "Continental" ? "Pan-African Resources" : region}
                                                </h2>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {groupedResources[region].length}{" "}
                                                {groupedResources[region].length === 1 ? "resource" : "resources"}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                                            {groupedResources[region].map((resource) => (
                                                <ResourceCard key={resource.id} resource={resource} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Enhanced Resource Card Component
function ResourceCard({ resource }: { resource: Resource }) {
    const getBorderColor = () => {
        if (resource.type === ResourceType.DATA_PROTECTION) return "border-t-primary";

        switch (resource.docType) {
            case DigitalIdDocType.REGISTRATION:
                return "border-t-purple-500";
            case DigitalIdDocType.NATIONAL_ID:
                return "border-t-blue-500";
            case DigitalIdDocType.IMMIGRATION:
                return "border-t-amber-500";
            case DigitalIdDocType.OTHER:
                return "border-t-orange-500";
            default:
                return "border-t-primary";
        }
    };

    const isSpecial = resource.region === "Continental";

    return (
        <Card
            className={cn(
                "border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-t-4 h-full bg-white/80 backdrop-blur-sm",
                getBorderColor(),
                isSpecial && "ring-2 ring-primary/10 shadow-lg"
            )}
        >
            {isSpecial && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-purple-500"></div>
            )}

            <CardContent className="p-4 sm:p-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-lg sm:text-xl shadow-sm">
                            {resource.flagEmoji}
                        </div>
                        <div>
                            <div className="font-medium text-foreground text-sm sm:text-base">
                                {resource.countryName}
                            </div>
                            <div className="text-xs text-muted-foreground">{resource.region}</div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {resource.year}
                        </Badge>
                        {resource.isOfficial && (
                            <Badge variant="outline" className="text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Official
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Title */}
                <div className="mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 flex items-start gap-2 group-hover:text-primary transition-colors">
                        <span className="text-primary mt-0.5 flex-shrink-0">{resource.icon}</span>
                        <span className="line-clamp-2">{resource.title}</span>
                    </h3>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                    {resource.description}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">
                        🌐 {resource.language}
                    </Badge>
                    {resource.fileType && (
                        <Badge variant="outline" className="text-xs">
                            📄 {resource.fileType}
                        </Badge>
                    )}
                    {resource.docType && (
                        <Badge variant="outline" className="text-xs">
                            {resource.docType === DigitalIdDocType.REGISTRATION && "📋 Registration"}
                            {resource.docType === DigitalIdDocType.NATIONAL_ID && "🆔 National ID"}
                            {resource.docType === DigitalIdDocType.IMMIGRATION && "🌍 Immigration"}
                            {resource.docType === DigitalIdDocType.OTHER && "📋 Framework"}
                        </Badge>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                    {resource.documentUrl && (
                        <Button className="flex-1 text-xs sm:text-sm h-9" asChild>
                            <a href={resource.documentUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                                <span className="hidden sm:inline">View Document</span>
                                <span className="sm:hidden">View</span>
                            </a>
                        </Button>
                    )}
                    {resource.websiteUrl && resource.websiteUrl !== "#" && (
                        <Button variant="outline" className="flex-1 text-xs sm:text-sm h-9" asChild>
                            <a href={resource.websiteUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                                <span className="hidden sm:inline">Website</span>
                                <span className="sm:hidden">Site</span>
                            </a>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
