/* eslint-disable @typescript-eslint/no-explicit-any */
// components/maps/DigitalIDMap.tsx
"use client";

import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import africanCountries from "@/data/africa.json";
import { useDigitalIdData } from "@/redux/api/apiSlice";

// Define the color mapping for Digital ID status
// const getColor = (status: string): string => {
//     switch (status) {
//         case "Implemented":
//             return "#10b981";
//         case "Partial":
//             return "#f59e0b";
//         case "Planning":
//             return "#3b82f6";
//         case "None":
//             return "#6b7280";
//         default:
//             return "#d1d5db";
//     }
// };

// Professional Legend component
const Legend: React.FC<{ stats: any }> = ({ stats }) => {
    const legendItems = [
        { status: "Implemented", color: "#10b981", label: "Fully Implemented", count: stats.implementedSystems },
        { status: "Partial", color: "#f59e0b", label: "Partially Implemented", count: stats.partialSystems },
        { status: "Planning", color: "#3b82f6", label: "In Planning", count: stats.planningSystems },
        { status: "None", color: "#6b7280", label: "No System", count: stats.noSystems },
    ];

    // Calculate biometric systems count
    const biometricCount =
        stats.digitalIds?.filter((id: any) => id.biometric_capabilities && id.biometric_capabilities.length > 0)
            .length || 0;

    return (
        <Card className="h-fit shadow-lg border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <CardHeader className="pb-4">
                <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-sm"></div>
                    Digital ID Systems
                </CardTitle>
                <Separator className="bg-gradient-to-r from-border to-transparent" />
            </CardHeader>
            <CardContent className="space-y-4">
                {legendItems.map((item) => (
                    <div key={item.status} className="group">
                        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-4 h-4 rounded-full shadow-sm ring-2 ring-white group-hover:scale-110 transition-transform duration-200"
                                    style={{ backgroundColor: item.color }}
                                ></div>
                                <div>
                                    <div className="text-sm font-medium text-foreground group-hover:text-foreground/90">
                                        {item.label}
                                    </div>
                                    <div className="text-xs text-muted-foreground">{item.count} countries</div>
                                </div>
                            </div>
                            <Badge
                                variant="secondary"
                                className="text-xs font-semibold min-w-[2rem] justify-center"
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

                <Separator className="my-4" />

                <div className="text-center p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
                    <div className="text-2xl font-bold text-foreground">{stats.totalCountries}</div>
                    <div className="text-xs text-muted-foreground font-medium">Countries with Data</div>
                </div>

                {biometricCount > 0 && (
                    <div className="text-center p-3 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-lg border border-purple-500/10">
                        <div className="text-xl font-bold text-purple-600">{biometricCount}</div>
                        <div className="text-xs text-muted-foreground font-medium">Biometric Systems</div>
                    </div>
                )}

                <div className="text-xs text-muted-foreground text-center pt-2">Hover over countries for details</div>
            </CardContent>
        </Card>
    );
};

const DigitalIDMap: React.FC = () => {
    const [tooltipContent, setTooltipContent] = useState<string>("");

    // Use RTK Query hook with updated structure
    const {
        digitalIds,
        isLoading,
        error,
        totalCountries,
        countriesWithSystems,
        totalFeatures,
        countriesWithBiometrics,
    } = useDigitalIdData();

    const handleMouseEnter = (countryName: string) => {
        const countryData = digitalIds.find((id) => id.country === countryName);

        if (countryData) {
            const statusColor = getColorFromFeatures(countryData.features);
            const featuresHTML = countryData.features
                .map(
                    (feature: string) =>
                        `<span class="inline-block bg-white/90 backdrop-blur-sm border border-white/40 rounded-md px-2 py-1 text-xs font-medium text-gray-700 mr-1 mb-1 shadow-sm">${feature}</span>`
                )
                .join(" ");

            const systemStatus = getSystemStatus(countryData);

            setTooltipContent(`
                <div class="font-sans rounded-xl overflow-hidden shadow-2xl bg-white/95 backdrop-blur-lg text-gray-800 w-80 border border-white/30">
                    <div class="relative p-4" style="background: linear-gradient(135deg, ${statusColor}, ${statusColor}dd);">
                        <div class="absolute inset-0 bg-black/10 rounded-t-xl"></div>
                        <div class="relative flex justify-between items-center">
                            <h3 class="m-0 text-white font-bold text-base tracking-tight drop-shadow-sm">${
                                countryData.country
                            }</h3>
                            <span class="bg-white/25 backdrop-blur-sm py-1.5 px-3 rounded-full text-xs text-white font-semibold border border-white/30 shadow-sm">${systemStatus}</span>
                        </div>
                    </div>
                    <div class="p-4 space-y-3">
                        <div class="grid grid-cols-1 gap-2">
                            ${
                                countryData.authority
                                    ? `
                            <div class="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-emerald-50/80 to-green-50/80 rounded-lg border border-emerald-100/50">
                                <span class="font-semibold text-emerald-700 text-xs flex items-center">
                                    <div class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                                    Authority
                                </span>
                                <span class="text-xs font-bold text-emerald-800 max-w-32 text-right truncate">${countryData.authority}</span>
                            </div>`
                                    : ""
                            }
                            ${
                                countryData.coverage
                                    ? `
                            <div class="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-lg border border-purple-100/50">
                                <span class="font-semibold text-purple-700 text-xs flex items-center">
                                    <div class="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                    Coverage
                                </span>
                                <span class="text-xs font-bold text-purple-800">${countryData.coverage}</span>
                            </div>`
                                    : ""
                            }
                            ${
                                countryData.isoAlpha2
                                    ? `
                            <div class="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-lg border border-blue-100/50">
                                <span class="font-semibold text-blue-700 text-xs flex items-center">
                                    <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                    Country Code
                                </span>
                                <span class="text-xs font-bold text-blue-800">${countryData.isoAlpha2}</span>
                            </div>`
                                    : ""
                            }
                        </div>
                        
                        ${
                            countryData.description
                                ? `
                        <div class="pt-3 border-t border-gray-100">
                            <span class="font-semibold text-gray-700 text-xs mb-2 flex items-center">
                                <div class="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-2"></div>
                                Description
                            </span>
                            <p class="text-xs text-gray-600 leading-relaxed">${countryData.description}</p>
                        </div>`
                                : ""
                        }
                        
                        ${
                            countryData.features.length > 0
                                ? `
                        <div class="pt-3 border-t border-gray-100">
                            <span class="font-semibold text-gray-700 text-xs mb-2 flex items-center">
                                <div class="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-2"></div>
                                Key Features
                            </span>
                            <div class="flex flex-wrap gap-1">
                                ${featuresHTML}
                            </div>
                        </div>`
                                : ""
                        }
                        
                        ${
                            countryData.links && countryData.links.length > 0
                                ? `
                        <div class="pt-3 border-t border-gray-100">
                            <span class="font-semibold text-gray-700 text-xs mb-2 flex items-center">
                                <div class="w-2 h-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mr-2"></div>
                                Additional Links
                            </span>
                            <div class="text-xs text-blue-600">
                                ${countryData.links.length} reference(s) available
                            </div>
                        </div>`
                                : ""
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

    // Helper function to determine system status from features and other data
    const getSystemStatus = (countryData: any): string => {
        if (!countryData.features || countryData.features.length === 0) {
            return "No System";
        }

        // Determine status based on features and coverage
        const hasAdvancedFeatures = countryData.features.some(
            (feature: string) =>
                feature.toLowerCase().includes("biometric") ||
                feature.toLowerCase().includes("digital") ||
                feature.toLowerCase().includes("electronic")
        );

        const hasCoverage = countryData.coverage && countryData.coverage !== "0%";

        if (hasAdvancedFeatures && hasCoverage) {
            return "Implemented";
        } else if (hasAdvancedFeatures || hasCoverage) {
            return "Partial";
        } else if (countryData.features.length > 0) {
            return "Planning";
        }

        return "Unknown";
    };

    const getCountryStatus = (countryName: string): string => {
        const countryData = digitalIds.find((id) => id.country === countryName);
        return countryData ? getSystemStatus(countryData) : "Unknown";
    };

    // Helper function to get color based on features (since we don't have explicit status)
    const getColorFromFeatures = (features: string[]): string => {
        if (!features || features.length === 0) {
            return "#9CA3AF"; // gray-400 for no system
        }

        const hasAdvancedFeatures = features.some(
            (feature) =>
                feature.toLowerCase().includes("biometric") ||
                feature.toLowerCase().includes("digital") ||
                feature.toLowerCase().includes("electronic")
        );

        if (hasAdvancedFeatures) {
            return "#10B981"; // emerald-500 for implemented
        } else if (features.length > 2) {
            return "#F59E0B"; // amber-500 for partial
        } else if (features.length > 0) {
            return "#3B82F6"; // blue-500 for planning
        }

        return "#9CA3AF"; // gray-400 for unknown
    };

    const getColor = (status: string): string => {
        switch (status.toLowerCase()) {
            case "implemented":
                return "#10B981"; // emerald-500
            case "partial":
                return "#F59E0B"; // amber-500
            case "planning":
                return "#3B82F6"; // blue-500
            case "no system":
                return "#9CA3AF"; // gray-400
            default:
                return "#6B7280"; // gray-500
        }
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
                                <span>Loading digital ID data...</span>
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
                                    Unable to fetch digital ID data from the server
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

    // Updated stats object to match new structure
    const stats = {
        totalCountries,
        implementedSystems: digitalIds.filter((id) => getSystemStatus(id) === "Implemented").length,
        partialSystems: digitalIds.filter((id) => getSystemStatus(id) === "Partial").length,
        planningSystems: digitalIds.filter((id) => getSystemStatus(id) === "Planning").length,
        noSystems: digitalIds.filter((id) => getSystemStatus(id) === "No System").length,
        countriesWithSystems,
        totalFeatures,
        countriesWithBiometrics,
        digitalIds,
    };

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
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
                                                strokeWidth={0.5}
                                                style={{
                                                    default: {
                                                        outline: "none",
                                                    },
                                                    hover: {
                                                        fill: "#6366f1",
                                                        outline: "none",
                                                        filter: "brightness(1.1)",
                                                    },
                                                    pressed: {
                                                        outline: "none",
                                                        filter: "brightness(0.9)",
                                                    },
                                                }}
                                                onMouseEnter={() => handleMouseEnter(countryName)}
                                                onMouseLeave={handleMouseLeave}
                                                data-tooltip-id="id-tooltip"
                                                data-tooltip-html={tooltipContent}
                                                className="cursor-pointer transition-all duration-200 ease-out"
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                        </ComposableMap>

                        <div className="absolute bottom-2 left-2 text-xs text-muted-foreground/60 font-medium">
                            Digital ID Implementation
                        </div>
                    </div>
                </div>

                <div className="w-full sm:w-72 lg:w-80 flex-shrink-0">
                    <Legend stats={stats} />
                </div>
            </div>

            <ReactTooltip
                id="id-tooltip"
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

export default DigitalIDMap;
