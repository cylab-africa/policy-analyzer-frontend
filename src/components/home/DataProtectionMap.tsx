/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import africanCountries from "@/data/africa.json";
import { usePolicyLawData } from "@/redux/api/apiSlice";
import { AlertCircle, CheckCircle2, Globe, Loader2, RefreshCw, Shield } from "lucide-react";
import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip as ReactTooltip } from "react-tooltip";

// CORRECTED: Enhanced color mapping for data protection legislation status
const getColor = (status: string): string => {
    // Use exact string matching instead of includes()
    switch (status) {
        case "Enacted":
            return "#059669"; // emerald-600
        case "Draft":
            return "#d97706"; // amber-600
        case "Lite":
            return "#7c3aed"; // violet-600
        case "No Law":
            return "#dc2626"; // red-600
        default:
            return "#6b7280"; // gray-500
    }
};

// CORRECTED: Helper function to determine Malabo Convention color
const getMalaboColor = (status: string): string => {
    // Use exact string matching
    switch (status) {
        case "Ratified":
            return "#059669"; // emerald-600
        case "Signed":
            return "#d97706"; // amber-600
        case "No":
        case "Not Signed":
            return "#dc2626"; // red-600
        default:
            return "#6b7280"; // gray-500
    }
};

// CORRECTED: Enhanced Professional Legend component
const Legend: React.FC<{ stats: any }> = ({ stats }) => {
    // FIXED: Use exact status matching and correct property names
    const legendItems = [
        {
            status: "enacted",
            color: "#059669",
            label: "Comprehensive Laws",
            count: stats.enactedLaws || 0, // This should now be correct from the fixed hook
            description: "Full data protection legislation",
        },
        {
            status: "draft",
            color: "#d97706",
            label: "Draft/Pending",
            count: stats.draftLaws || 0, // This should now be correct from the fixed hook
            description: "Legislation in development",
        },
        {
            status: "lite",
            color: "#7c3aed",
            label: "Limited Protection",
            count: stats.liteLaws || stats.policyLaws?.filter(
                (law: any) => law.dataProtectionLegislationStatus === "Lite"
            ).length || 0,
            description: "Sectoral or partial laws",
        },
        {
            status: "none",
            color: "#dc2626",
            label: "No Laws",
            count: stats.noLaws || 0, // This should now be correct from the fixed hook
            description: "No data protection legislation",
        },
    ];

    const implementationRate =
        stats.totalCountries > 0 ? Math.round((stats.enactedLaws / stats.totalCountries) * 100) : 0;

    return (
        <Card className="h-fit shadow-lg border-0 bg-gradient-to-br from-background via-background to-muted/20">
            <CardHeader className="pb-4">
                <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <div className="text-foreground">Data Protection Laws</div>
                        <div className="text-xs font-normal text-muted-foreground">
                            Legislative Status Across Africa
                        </div>
                    </div>
                </CardTitle>
                <Separator className="bg-gradient-to-r from-border to-transparent" />
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Status Legend */}
                {legendItems.map((item) => (
                    <div key={item.status} className="group">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-card hover:bg-accent/50 transition-all duration-200 border border-border/50 hover:border-border hover:shadow-md">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-4 h-4 rounded-full shadow-sm ring-2 ring-background group-hover:scale-110 transition-transform duration-200"
                                    style={{ backgroundColor: item.color }}
                                ></div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-foreground group-hover:text-foreground/90">
                                        {item.label}
                                    </div>
                                    <div className="text-xs text-muted-foreground">{item.description}</div>
                                </div>
                            </div>
                            <Badge
                                variant="secondary"
                                className="text-xs font-bold min-w-[2.5rem] justify-center shadow-sm"
                                style={{
                                    backgroundColor: `${item.color}15`,
                                    color: item.color,
                                    border: `1px solid ${item.color}30`,
                                }}
                            >
                                {item.count}
                            </Badge>
                        </div>
                    </div>
                ))}

                <Separator className="my-6" />

                {/* CORRECTED: Key Statistics with additional Malabo Convention info */}
                <div className="grid grid-cols-1 gap-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/20 hover:border-primary/30 transition-colors group">
                            <div className="text-2xl font-bold text-primary group-hover:scale-105 transition-transform">
                                {stats.totalCountries}
                            </div>
                            <div className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-1">
                                <Globe className="h-3 w-3" />
                                Countries
                            </div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-xl border border-emerald-500/20 hover:border-emerald-500/30 transition-colors group">
                            <div className="text-2xl font-bold text-emerald-600 group-hover:scale-105 transition-transform">
                                {implementationRate}%
                            </div>
                            <div className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Enacted
                            </div>
                        </div>
                    </div>
                    
                    {/* ADDED: Malabo Convention statistics */}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="text-center p-2 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-lg border border-amber-500/20">
                            <div className="text-lg font-bold text-amber-600">
                                {stats.malaboSignedOrRatified || 0}
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">
                                Malabo Conv.
                            </div>
                        </div>
                        <div className="text-center p-2 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-lg border border-blue-500/20">
                            <div className="text-lg font-bold text-blue-600">
                                {stats.malaboRatified || 0}
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">
                                Ratified
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const DataProtectionMap: React.FC = () => {
    const [tooltipContent, setTooltipContent] = useState<string>("");

    // CORRECTED: Use the fixed RTK Query hook with all new properties
    const { 
        policyLaws, 
        isLoading, 
        error, 
        totalCountries, 
        enactedLaws, 
        draftLaws, 
        noLaws, 
        liteLaws,
        malaboRatified,
        malaboSigned,
        malaboSignedOrRatified,
        malaboNo
    } = usePolicyLawData();

    const handleMouseEnter = (countryName: string) => {
        const countryData = policyLaws.find((law) => law.country === countryName);

        if (countryData) {
            const statusColor = getColor(countryData.dataProtectionLegislationStatus);
            const malaboColor = getMalaboColor(countryData.malaboConventionStatus);

            setTooltipContent(`
                <div class="font-sans rounded-xl overflow-hidden shadow-2xl bg-white/95 backdrop-blur-lg text-gray-800 w-80 border border-white/30">
                    <div class="relative p-4" style="background: linear-gradient(135deg, ${statusColor}, ${statusColor}dd);">
                        <div class="absolute inset-0 bg-black/10 rounded-t-xl"></div>
                        <div class="relative flex justify-between items-center">
                            <h3 class="m-0 text-white font-bold text-base tracking-tight drop-shadow-sm">${
                                countryData.country
                            }</h3>
                            <span class="bg-white/25 backdrop-blur-sm py-1.5 px-3 rounded-full text-xs text-white font-semibold border border-white/30 shadow-sm">
                                ${countryData.dataProtectionLegislationStatus}
                            </span>
                        </div>
                    </div>
                    <div class="p-4 space-y-3">
                        <div class="grid grid-cols-1 gap-2">
                            ${
                                countryData.yearLegislationEnacted && countryData.yearLegislationEnacted !== "-" && countryData.yearLegislationEnacted !== "Unknown"
                                    ? `
                            <div class="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-emerald-50/80 to-green-50/80 rounded-lg border border-emerald-100/50">
                                <span class="font-semibold text-emerald-700 text-xs flex items-center">
                                    <div class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                                    Year Enacted
                                </span>
                                <span class="text-xs font-bold text-emerald-800">${countryData.yearLegislationEnacted}</span>
                            </div>`
                                    : ""
                            }
                            
                            <div class="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-lg border border-blue-100/50">
                                <span class="font-semibold text-blue-700 text-xs flex items-center">
                                    <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                    Malabo Convention
                                </span>
                                <span class="text-xs font-bold text-blue-800" style="color: ${malaboColor};">
                                    ${countryData.malaboConventionStatus}
                                </span>
                            </div>

                            ${
                                countryData.name && countryData.name !== countryData.country
                                    ? `
                            <div class="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-lg border border-purple-100/50">
                                <span class="font-semibold text-purple-700 text-xs flex items-center">
                                    <div class="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                    Official Name
                                </span>
                                <span class="text-xs font-bold text-purple-800 max-w-32 text-right truncate">
                                    ${countryData.name}
                                </span>
                            </div>`
                                    : ""
                            }
                        </div>
                        
                        ${
                            countryData.link && countryData.link.trim() !== ""
                                ? `
                        <div class="pt-3 border-t border-gray-100">
                            <a href="${countryData.link}" target="_blank" rel="noopener noreferrer" class="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] flex items-center justify-center gap-2 no-underline">
                                <span>View Legislation</span>
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                                </svg>
                            </a>
                        </div>`
                                : `
                        <div class="pt-3 border-t border-gray-100">
                            <button class="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white py-2 px-3 rounded-lg text-xs font-semibold opacity-50 cursor-not-allowed">
                                No Link Available
                            </button>
                        </div>`
                        }
                    </div>
                </div>
            `);
        } else {
            setTooltipContent(`
                <div class="font-sans rounded-xl overflow-hidden shadow-2xl bg-white/95 backdrop-blur-lg text-gray-800 w-64 border border-white/30">
                    <div class="flex justify-between items-center p-4 bg-gradient-to-r from-gray-400 to-gray-500">
                        <h3 class="m-0 text-white font-bold text-base drop-shadow-sm">${countryName}</h3>
                        <span class="bg-white/25 backdrop-blur-sm py-1 px-2 rounded-full text-xs text-white font-semibold">No Data</span>
                    </div>
                    <div class="p-4 text-center">
                        <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <div class="w-6 h-6 bg-gray-400 rounded-full opacity-50"></div>
                        </div>
                        <p class="m-0 text-gray-600 text-sm">No detailed information available</p>
                    </div>
                </div>
            `);
        }
    };

    const handleMouseLeave = () => {
        setTooltipContent("");
    };

    const getCountryStatus = (countryName: string): string => {
        const countryData = policyLaws.find((law) => law.country === countryName);
        return countryData?.dataProtectionLegislationStatus || "Unknown";
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="w-full">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="flex-1">
                        <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[550px] rounded-xl bg-muted flex items-center justify-center">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <span>Loading data protection data...</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full sm:w-72 lg:w-80 flex-shrink-0">
                        <Card className="h-fit shadow-lg">
                            <CardContent className="p-6">
                                <div className="animate-pulse space-y-4">
                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                    <div className="h-8 bg-muted rounded"></div>
                                    <div className="h-8 bg-muted rounded"></div>
                                    <div className="h-8 bg-muted rounded"></div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="w-full">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="flex-1">
                        <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[550px] rounded-xl bg-muted flex items-center justify-center">
                            <div className="text-center">
                                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load data</h3>
                                <p className="text-muted-foreground mb-4">
                                    Unable to fetch data protection legislation data from the server
                                </p>
                                <Button variant="outline" onClick={() => window.location.reload()} className="gap-2">
                                    <RefreshCw className="h-4 w-4" />
                                    Retry
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full sm:w-72 lg:w-80 flex-shrink-0">
                        <Card className="h-fit shadow-lg">
                            <CardContent className="p-6 text-center text-muted-foreground">
                                Data unavailable
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // CORRECTED: Pass all the correct stats to Legend
    const stats = {
        totalCountries,
        enactedLaws,
        draftLaws,
        noLaws,
        liteLaws,
        malaboSigned,
        malaboRatified,
        malaboSignedOrRatified,
        malaboNo,
        policyLaws,
    };

    return (
        <div className="w-full">
            {/* Map and Legend Container - Side by side on all screens */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Map Section - Takes most space */}
                <div className="flex-1">
                    <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[550px] rounded-xl overflow-hidden bg-gradient-to-br from-muted/20 to-accent/20 border relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 pointer-events-none"></div>
                        <ComposableMap
                            projectionConfig={{
                                scale: 320,
                                center: [20, 0],
                            }}
                            style={{ width: "100%", height: "100%" }}
                            className="drop-shadow-sm"
                        >
                            <Geographies geography={africanCountries}>
                                {({ geographies }) =>
                                    geographies.map((geo) => {
                                        const countryName = geo.properties.geounit;
                                        const status = getCountryStatus(countryName);
                                        const fillColor = getColor(status);

                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                fill={fillColor}
                                                stroke="#ffffff"
                                                strokeWidth={0.8}
                                                style={{
                                                    default: {
                                                        outline: "none",
                                                        filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.1))",
                                                    },
                                                    hover: {
                                                        fill: "#10b981",
                                                        outline: "none",
                                                        filter: "drop-shadow(0 4px 12px rgba(16,185,129,0.3)) brightness(1.1)",
                                                    },
                                                    pressed: {
                                                        outline: "none",
                                                        filter: "brightness(0.9)",
                                                    },
                                                }}
                                                onMouseEnter={() => handleMouseEnter(countryName)}
                                                onMouseLeave={handleMouseLeave}
                                                data-tooltip-id="data-protection-tooltip"
                                                data-tooltip-html={tooltipContent}
                                                className="cursor-pointer transition-all duration-200 ease-out"
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                        </ComposableMap>

                        {/* Map watermark */}
                        <div className="absolute bottom-2 left-2 text-xs text-muted-foreground/60 font-medium">
                            Data Protection Legislation
                        </div>
                    </div>
                </div>

                {/* Legend Section - Fixed width, always beside map */}
                <div className="w-full sm:w-72 lg:w-80 flex-shrink-0">
                    <Legend stats={stats} />
                </div>
            </div>

            {/* Enhanced Tooltip */}
            <ReactTooltip
                id="data-protection-tooltip"
                className="z-50 opacity-100 !bg-transparent"
                style={{
                    backgroundColor: "transparent",
                    maxWidth: "320px",
                    padding: "0",
                }}
                place="top"
                offset={10}
            />
        </div>
    );
};

export default DataProtectionMap;