/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import africanCountries from "@/data/world-map.json";
import { useDigitalIdData } from "@/redux/api/apiSlice";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip as ReactTooltip } from "react-tooltip";

// Country name mapping to handle inconsistencies between map data and API data
const COUNTRY_NAME_MAPPING: Record<string, string> = {
    // Map geounit -> API country name
    "Cape Verde": "Cabo Verde",
    "Cabo Verde": "Cape Verde",
    "Democratic Republic of the Congo": "Democratic Republic of Congo",
    "Republic of the Congo": "Republic of Congo",
    eSwatini: "Eswatini",
    Swaziland: "Eswatini",
    "The Gambia": "Gambia",
    "São Tomé and Príncipe": "Sao Tome & Principe",
    "Sao Tome and Principe": "Sao Tome & Principe",
    "Ivory Coast": "Cote d'Ivoire",
    "Côte d'Ivoire": "Cote d'Ivoire",
};

// Utility function to normalize country names
const normalizeCountryName = (countryName: string): string => {
    if (COUNTRY_NAME_MAPPING[countryName]) {
        return COUNTRY_NAME_MAPPING[countryName];
    }

    return countryName
        .trim()
        .replace(/^The\s+/, "") // Remove "The" prefix
        .replace(/\s+/g, " "); // Normalize spaces
};

// Enhanced country lookup function
const findCountryData = <T extends { country: string }>(data: T[], mapCountryName: string): T | undefined => {
    // Direct match first
    let match = data.find((item) => item.country === mapCountryName);
    if (match) return match;

    // Try normalized name
    const normalized = normalizeCountryName(mapCountryName);
    match = data.find((item) => item.country === normalized);
    if (match) return match;

    // Try reverse mapping
    const reversed = COUNTRY_NAME_MAPPING[mapCountryName];
    if (reversed) {
        match = data.find((item) => item.country === reversed);
        if (match) return match;
    }

    // Fuzzy matching for common variations
    return data.find((item) => {
        const itemCountry = item.country.toLowerCase();
        const searchCountry = mapCountryName.toLowerCase();

        if (itemCountry.includes("republic") && searchCountry.includes("republic")) {
            return itemCountry.replace(/republic\s+of\s+/g, "") === searchCountry.replace(/republic\s+of\s+/g, "");
        }

        if (itemCountry.includes("democratic") && searchCountry.includes("democratic")) {
            return (
                itemCountry.includes(searchCountry.split(" ").pop()!) ||
                searchCountry.includes(itemCountry.split(" ").pop()!)
            );
        }

        return false;
    });
};

// Professional color palette for Digital ID status
const getColor = (status: string): string => {
    switch (status) {
        case "Implemented":
            return "#10b981"; // Modern emerald - strong implementation
        case "Partial":
            return "#3b82f6"; // Professional blue - progress in development
        case "Planning":
            return "#f59e0b"; // Sophisticated amber - planning stage
        case "No Data":
            return "#64748b"; // Neutral slate - unknown status
        default:
            return "#cbd5e1"; // Light slate - default state
    }
};

const DigitalIDMap: React.FC = () => {
    const [tooltipContent, setTooltipContent] = useState<string>("");

    // Use RTK Query hook with updated structure
    const { digitalIds, isLoading, error } = useDigitalIdData();

    const handleMouseEnter = (countryName: string) => {
        const countryData = findCountryData(digitalIds, countryName);

        if (countryData) {
            const statusColor = getColor(countryData.status || "No Data");
            const featuresHTML =
                countryData.features
                    ?.map(
                        (feature: string) =>
                            `<span class="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 rounded-full border border-blue-100 hover:shadow-sm transition-all duration-200">${feature}</span>`
                    )
                    .join(" ") || "";

            const systemStatus = countryData.status || "No Data";

            setTooltipContent(`
            <div class="w-84 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/80 overflow-hidden font-inter relative">
                <!-- Subtle top accent -->
                <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                
                <!-- Header -->
                <div class="px-5 py-4 bg-gradient-to-br from-gray-50/80 to-white border-b border-gray-100/60">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg font-bold text-gray-900 tracking-tight">${countryData.country}</h3>
                        </div>
                        <div class="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gray-200/60">
                            <div class="w-2.5 h-2.5 rounded-full shadow-sm" style="background-color: ${statusColor}; box-shadow: 0 0 6px ${statusColor}40;"></div>
                            <span class="text-sm font-medium text-gray-700">${systemStatus}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Content -->
                <div class="p-5 space-y-5">
                    ${
                        countryData.coverage
                            ? `
                    <div class="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50/50 to-blue-50/50 rounded-lg border border-purple-100/60">
                        <div class="flex items-center gap-2.5">
                            <div class="w-7 h-7 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                            </div>
                            <span class="text-sm font-medium text-gray-700">Coverage</span>
                        </div>
                        <span class="text-sm font-bold text-purple-700 bg-white/80 px-3 py-1.5 rounded-lg shadow-sm">${countryData.coverage}</span>
                    </div>`
                            : ""
                    }
                    
                    ${
                        countryData.description
                            ? `
                    <div class="space-y-2.5">
                        <div class="flex items-center gap-2">
                            <div class="w-6 h-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-md flex items-center justify-center">
                                <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                            <span class="text-sm font-semibold text-gray-800">System Overview</span>
                        </div>
                        <p class="text-sm text-gray-600 leading-relaxed bg-gray-50/60 p-3.5 rounded-lg border border-gray-100/60">${countryData.description}</p>
                    </div>`
                            : ""
                    }
                    
                    ${
                        countryData.features && countryData.features.length > 0
                            ? `
                    <div class="space-y-3">
                        <div class="flex items-center gap-2">
                            <div class="w-6 h-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-md flex items-center justify-center">
                                <svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                            <span class="text-sm font-semibold text-gray-800">Key Features</span>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            ${featuresHTML}
                        </div>
                    </div>`
                            : ""
                    }
                </div>
            </div>
        `);
        } else {
            setTooltipContent(`
            <div class="w-72 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/80 overflow-hidden font-inter relative">
                <!-- Subtle top accent -->
                <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-400 to-gray-500"></div>
                
                <!-- Header -->
                <div class="px-5 py-4 bg-gradient-to-br from-gray-50/80 to-white border-b border-gray-100/60">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-bold text-gray-900 tracking-tight">${countryName}</h3>
                    </div>
                </div>
                
                <!-- Content -->
                <div class="p-5 text-center">
                    <div class="w-16 h-16 bg-gradient-to-br from-gray-100/80 to-gray-200/80 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200/60">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <div class="space-y-2">
                        <p class="text-sm font-semibold text-gray-900">No Data Available</p>
                        <p class="text-xs text-gray-500 leading-relaxed">Digital ID information is not currently available for this country</p>
                    </div>
                </div>
            </div>
        `);
        }
    };

    const handleMouseLeave = () => {
        setTooltipContent("");
    };

    const getCountryStatus = (countryName: string): string => {
        const countryData = findCountryData(digitalIds, countryName);
        return countryData?.status || "Unknown";
    };

    if (isLoading) {
        return (
            <div className="w-full">
                <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[800px] rounded-xl bg-muted flex items-center justify-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading digital ID data...</span>
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
                </div>
            </div>
        );
    }

    // Legend data
    const legendData = [
        { status: "Implemented", color: getColor("Implemented"), label: "Fully Operational" },
        { status: "Partial", color: getColor("Partial"), label: "Partially Implemented" },
        { status: "Planning", color: getColor("Planning"), label: "Planning" },
        { status: "No Data", color: getColor("No Data"), label: "No Information" },
    ];

    return (
        <div className="w-full space-y-6">
            {/* Map Container */}
            <div className="relative">
                <div className="w-full h-[600px] lg:h-[700px] rounded-xl overflow-hidden relative">
                    {/* Professional background pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(99,102,241,0.05)_0%,transparent_70%)] pointer-events-none"></div>
                    <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

                    <ComposableMap
                        projectionConfig={{
                            scale: 220,
                            center: [20, 5],
                        }}
                        style={{ width: "100%", height: "100%" }}
                        className="drop-shadow-lg"
                    >
                        <defs>
                            <filter id="digitalIdFilter" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="0" />
                                <feOffset dx="0" dy="1" result="offset" />
                                <feFlood floodColor="rgba(0,0,0,0.08)" />
                                <feComposite in2="offset" operator="in" />
                                <feMerge>
                                    <feMergeNode />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
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
                                            stroke="rgba(255,255,255,0.8)"
                                            strokeWidth={0.6}
                                            style={{
                                                default: {
                                                    outline: "none",
                                                    filter: "url(#digitalIdFilter) drop-shadow(0 2px 4px rgba(0,0,0,0.06))",
                                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                },
                                                hover: {
                                                    fill: "#10b981",
                                                    outline: "none",
                                                    filter: "url(#digitalIdFilter) drop-shadow(0 8px 25px rgba(99,102,241,0.2)) brightness(1.05)",
                                                    transform: "scale(1.02)",
                                                    stroke: "rgba(255,255,255,0.9)",
                                                    strokeWidth: 1,
                                                },
                                                pressed: {
                                                    outline: "none",
                                                    filter: "brightness(0.95)",
                                                    transform: "scale(0.98)",
                                                },
                                            }}
                                            onMouseEnter={() => handleMouseEnter(countryName)}
                                            onMouseLeave={handleMouseLeave}
                                            data-tooltip-id="id-tooltip"
                                            data-tooltip-html={tooltipContent}
                                            className="cursor-pointer transition-all duration-300 ease-out"
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ComposableMap>

                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-lg max-w-xs">
                        <h4 className="text-md font-bold text-gray-800 mb-3 flex items-center gap-2">Digital ID</h4>
                        <div className="space-y-2">
                            {legendData.map((item) => (
                                <div key={item.status} className="flex items-center gap-2.5">
                                    <div
                                        className="w-3 h-3 rounded-full border border-white/70 shadow-sm"
                                        style={{ backgroundColor: item.color }}
                                    ></div>
                                    <div className="flex-1">
                                        <div className="text-xs font-medium text-gray-800">{item.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Professional Tooltip */}
            <ReactTooltip
                id="id-tooltip"
                className="z-50 opacity-100 !bg-transparent !p-0"
                style={{
                    backgroundColor: "transparent",
                    maxWidth: "420px",
                    padding: "0",
                    border: "none",
                    borderRadius: "0",
                    boxShadow: "none",
                }}
                place="top"
                offset={15}
                noArrow={true}
            />
        </div>
    );
};

export default DigitalIDMap;
