/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import africanCountries from "@/data/world-map.json";
import { usePolicyLawData } from "@/redux/api/apiSlice";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip as ReactTooltip } from "react-tooltip";

// Professional color palette for data protection legislation status
const getColor = (status: string): string => {
    switch (status) {
        case "Enacted":
            return "#059669"; // Emerald-600
        case "Draft":
            return "#3b82f6"; // Blue-500
        case "Lite":
            return "#8b5cf6"; // Violet-500
        case "No Law":
            return "#ef4444"; // Red-500
        default:
            return "#cbd5e1"; // Gray-400
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

const DataProtectionMap: React.FC = () => {
    const [tooltipContent, setTooltipContent] = useState<string>("");
    const [hoveredCountry, setHoveredCountry] = useState<string>("");

    const { policyLaws, isLoading, error } = usePolicyLawData();

    const handleMouseEnter = (countryName: string) => {
        setHoveredCountry(countryName);
        const countryData = policyLaws.find((law) => law.country === countryName);

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
        const countryData = policyLaws.find((law) => law.country === countryName);
        return countryData?.dataProtectionLegislationStatus || "Unknown";
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="w-full">
                <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[800px] rounded-xl bg-muted flex items-center justify-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="font-medium">Loading data protection data...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="w-full">
                <div className="w-full h-[500px] rounded-xl bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load data</h3>
                        <p className="text-gray-600 mb-4 max-w-md">
                            Unable to fetch data protection legislation data from the server
                        </p>
                        <Button variant="outline" onClick={() => window.location.reload()} className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Retry
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Legend data
    const legendData = [
        { status: "Enacted", color: getColor("Enacted"), label: "Comprehensive Law" },
        { status: "Draft", color: getColor("Draft"), label: "Draft Legislation" },
        { status: "Lite", color: getColor("Lite"), label: "Limited Framework" },
        { status: "No Law", color: getColor("No Law"), label: "No Legislation" },
    ];

    return (
        <div className="w-full space-y-6">
            {/* Map Container */}
            <div className="relative">
                <div className="w-full h-[600px] lg:h-[700px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 border border-gray-200 relative">
                    <ComposableMap
                        projectionConfig={{
                            scale: 220,
                            center: [20, 5],
                        }}
                        style={{ width: "100%", height: "100%" }}
                    >
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
                                            stroke="rgba(255,255,255,0.8)"
                                            strokeWidth={isHovered ? 1.5 : 0.8}
                                            style={{
                                                default: {
                                                    outline: "none",
                                                    transition: "all 0.2s ease",
                                                    filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.1))",
                                                },
                                                hover: {
                                                    outline: "none",
                                                    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15)) brightness(1.1)",
                                                    stroke: "rgba(255,255,255,0.95)",
                                                },
                                                pressed: {
                                                    outline: "none",
                                                    filter: "brightness(0.95)",
                                                },
                                            }}
                                            onMouseEnter={() => handleMouseEnter(countryName)}
                                            onMouseLeave={handleMouseLeave}
                                            data-tooltip-id="data-protection-tooltip"
                                            data-tooltip-html={tooltipContent}
                                            className="cursor-pointer"
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ComposableMap>
                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-xl max-w-xs">
                        <h4 className="text-md font-bold text-gray-800 mb-3 flex items-center gap-2">
                            Data Protection
                        </h4>
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
