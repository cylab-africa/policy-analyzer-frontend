/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import africanCountries from "@/data/world-map.json";
import { usePolicyLawData } from "@/redux/api/apiSlice";
import { AlertCircle, Loader2, RefreshCw, Shield } from "lucide-react";
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
    "Cote d'Ivoire": "Côte d'Ivoire",
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

const DataProtectionMap: React.FC = () => {
    const [tooltipContent, setTooltipContent] = useState<string>("");
    const [hoveredCountry, setHoveredCountry] = useState<string>("");
    const { policyLaws, isLoading, error } = usePolicyLawData();

    // Professional color palette for data protection legislation status
    const getColor = (status: string): string => {
        switch (status) {
            case "Enacted":
                return "#059669"; // Emerald-600 - consistent with other components
            case "Draft":
                return "#3b82f6"; // Blue-500 - professional blue
            case "Lite":
                return "#8b5cf6"; // Violet-500 - distinguishable purple
            case "No Law":
                return "#6b7280"; // Gray-500 - neutral
            default:
                return "#B7BDBF"; // Gray-400 - default state
        }
    };

    // Professional color mapping for Malabo Convention status
    const getMalaboColor = (status: string): string => {
        switch (status) {
            case "Ratified":
                return "#059669"; // Emerald-600
            case "Signed":
                return "#f59e0b"; // Amber-500
            case "No":
            case "Not Signed":
                return "#6b7280"; // Gray-500
            default:
                return "#9ca3af"; // Gray-400
        }
    };

    const handleMouseEnter = (countryName: string) => {
        setHoveredCountry(countryName);
        const countryData = findCountryData(policyLaws, countryName);

        if (countryData) {
            const statusColor = getColor(countryData.dataProtectionLegislationStatus);
            const malaboColor = getMalaboColor(countryData.malaboConventionStatus);

            setTooltipContent(`
                <div class="font-sans max-w-sm bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                    <div class="p-4 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100">
                        <div class="flex items-center gap-3">
                            <div class="text-2xl">${countryData.flagEmoji || "🏳️"}</div>
                            <div>
                                <h3 class="text-lg font-bold text-gray-900 leading-tight">${countryData.country}</h3>
                                <div class="flex items-center gap-2 mt-1">
                                    <div class="w-2 h-2 rounded-full" style="background: ${statusColor};"></div>
                                    <span class="text-sm font-medium text-gray-600">${
                                        countryData.dataProtectionLegislationStatus
                                    }</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="p-4 space-y-3">
                        ${
                            countryData.yearLegislationEnacted &&
                            countryData.yearLegislationEnacted !== "-" &&
                            countryData.yearLegislationEnacted !== "Unknown"
                                ? `
                        <div class="flex items-center justify-between p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                            <div class="flex items-center gap-2">
                                <div class="w-6 h-6 bg-emerald-100 rounded-md flex items-center justify-center">
                                    <svg class="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <span class="text-xs font-medium text-gray-700">Year Enacted</span>
                            </div>
                            <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">${countryData.yearLegislationEnacted}</span>
                        </div>`
                                : ""
                        }
                        
                        <div class="flex items-center justify-between p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                            <div class="flex items-center gap-2">
                                <div class="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                                    <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                                    </svg>
                                </div>
                                <span class="text-xs font-medium text-gray-700">Malabo Convention</span>
                            </div>
                            <span class="text-xs font-bold px-2 py-0.5 rounded" style="color: ${malaboColor}; background: ${malaboColor}20;">
                                ${countryData.malaboConventionStatus}
                            </span>
                        </div>
                        
                        ${
                            countryData.links && countryData.links.length > 0
                                ? `
                        <div class="pt-2 space-y-2">
                            ${countryData.links
                                .slice(0, 2)
                                .map(
                                    (link) => `
                                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-white py-2 px-3 rounded-lg text-xs font-medium transition-colors no-underline group">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                                    </svg>
                                    <span class="truncate">${link.title}</span>
                                </a>`
                                )
                                .join("")}
                            ${
                                countryData.links.length > 2
                                    ? `<div class="text-xs text-gray-500 text-center">+${
                                          countryData.links.length - 2
                                      } more resources</div>`
                                    : ""
                            }
                        </div>`
                                : ""
                        }
                    </div>
                </div>
            `);
        } else {
            setTooltipContent(`
                <div class="font-sans max-w-xs bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                    <div class="p-4 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100">
                        <h3 class="text-lg font-bold text-gray-900">${countryName}</h3>
                    </div>
                    <div class="p-4 text-center">
                        <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <p class="text-gray-600 text-sm font-medium mb-1">No Data Available</p>
                        <p class="text-gray-500 text-xs">Information not currently tracked</p>
                    </div>
                </div>
            `);
        }
    };

    const handleMouseLeave = () => {
        setTooltipContent("");
        setHoveredCountry("");
    };

    const getCountryStatus = (countryName: string): string => {
        const countryData = findCountryData(policyLaws, countryName);
        return countryData?.dataProtectionLegislationStatus || "Unknown";
    };

    if (isLoading) {
        return (
            <div className="w-full h-[600px] lg:h-[700px] rounded-xl bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center border border-slate-200">
                <div className="flex items-center gap-3 text-slate-600 bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4 shadow-sm border border-white/60">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="font-medium">Loading data protection data...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-[600px] lg:h-[700px] rounded-xl bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center border border-red-200">
                <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white/60 max-w-md mx-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Failed to load data</h3>
                    <p className="text-gray-600 mb-6                ">
                        Unable to fetch data protection legislation data from the server
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="gap-2 hover:bg-red-50 border-red-200 text-red-700 hover:border-red-300"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    // Add this function to check if a country is African
    const isAfricanCountry = (countryName: string): boolean => {
        // Check if we have data for this country OR if it's in our mapping
        const hasData = policyLaws.some((law) => law.country === countryName);
        const hasMapping = COUNTRY_NAME_MAPPING[countryName] !== undefined;
        const normalizedData = findCountryData(policyLaws, countryName);

        return hasData || hasMapping || normalizedData !== undefined;
    };

    const legendData = [
        { status: "Enacted", color: getColor("Enacted"), label: "Comprehensive Law" },
        { status: "Draft", color: getColor("Draft"), label: "Draft Legislation" },
        { status: "Lite", color: getColor("Lite"), label: "Limited Framework" },
        { status: "No Law", color: getColor("No Law"), label: "No Legislation" },
    ];

    return (
        <div className="w-full space-y-6">
            <div className="relative">
                <div className="w-full h-[600px] lg:h-[700px] rounded-xl overflow-hidden relative bg-gradient-to-br from-slate-50/50 to-blue-50/30 border border-slate-200/60">
                    {/* Professional background pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(34,197,94,0.05)_0%,transparent_70%)] pointer-events-none"></div>

                    <ComposableMap
                        projectionConfig={{
                            scale: 350,
                            center: [20, 0],
                        }}
                        style={{ width: "100%", height: "100%" }}
                        className="drop-shadow-sm"
                    >
                        <defs>
                            <filter id="dataProtectionFilter" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="0" />
                                <feOffset dx="0" dy="1" result="offset" />
                                <feFlood floodColor="rgba(0,0,0,0.06)" />
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
                                    const isHovered = hoveredCountry === countryName;

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={fillColor}
                                            stroke={isHovered ? "rgba(59, 130, 246, 0.8)" : "rgba(255,255,255,0.8)"}
                                            strokeWidth={isHovered ? 2 : 0.8}
                                            style={{
                                                default: {
                                                    outline: "none",
                                                    filter: "url(#dataProtectionFilter) drop-shadow(0 2px 4px rgba(0,0,0,0.06))",
                                                    transition: "all 0.2s ease-in-out",
                                                    cursor: isAfricanCountry(countryName) ? "pointer" : "default",
                                                },
                                                hover: isAfricanCountry(countryName)
                                                    ? {
                                                          outline: "none",
                                                          fill: fillColor,
                                                          filter: "url(#dataProtectionFilter) drop-shadow(0 4px 12px rgba(0,0,0,0.55)) brightness(1.1)",
                                                          stroke: "rgba(59, 130, 246, 0.9)",
                                                          strokeWidth: 2.5,
                                                      }
                                                    : {},
                                                pressed: isAfricanCountry(countryName)
                                                    ? {
                                                          outline: "none",
                                                          fill: fillColor,
                                                          filter: "brightness(0.95)",
                                                      }
                                                    : {},
                                            }}
                                            onMouseEnter={
                                                isAfricanCountry(countryName)
                                                    ? () => handleMouseEnter(countryName)
                                                    : undefined
                                            }
                                            onMouseLeave={isAfricanCountry(countryName) ? handleMouseLeave : undefined}
                                            data-tooltip-id={
                                                isAfricanCountry(countryName) ? "data-protection-tooltip" : undefined
                                            }
                                            data-tooltip-html={
                                                isAfricanCountry(countryName) ? tooltipContent : undefined
                                            }
                                            className={
                                                isAfricanCountry(countryName) ? "cursor-pointer" : "cursor-default"
                                            }
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ComposableMap>

                    {/* Enhanced Legend */}
                    <div className="absolute bottom-6 right-0 bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-white/60 shadow-xl max-w-xs">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-4 h-4 text-emerald-600" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-800">Data Protection</h4>
                        </div>
                        <div className="space-y-3">
                            {legendData.map((item) => (
                                <div key={item.status} className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
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

            {/* Enhanced Tooltip */}
            <ReactTooltip
                id="data-protection-tooltip"
                className="z-50 opacity-100 !bg-transparent"
                style={{
                    backgroundColor: "transparent",
                    maxWidth: "400px",
                    padding: "0",
                    border: "none",
                    borderRadius: "0",
                    boxShadow: "none",
                }}
                place="top"
                offset={10}
                noArrow={true}
            />
        </div>
    );
};

export default DataProtectionMap;
