/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import africanCountries from "@/data/world-map.json";
import { useDigitalIdData } from "@/redux/api/apiSlice";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip as ReactTooltip } from "react-tooltip";

// Professional color palette for Digital ID status
const getColor = (status: string): string => {
    switch (status.toLowerCase()) {
        case "implemented":
            return "#95D69A";
        case "partial":
            return "#AAC8FC";
        case "planning":
            return "#61D8D6";
        case "no data":
            return "#FFB3B5";
        default:
            return "#cbd5e1";
    }
};

const DigitalIDMap: React.FC = () => {
    const [tooltipContent, setTooltipContent] = useState<string>("");

    // Use RTK Query hook with updated structure
    const { digitalIds, isLoading, error } = useDigitalIdData();

    const handleMouseEnter = (countryName: string) => {
        const countryData = digitalIds.find((id) => id.country === countryName);

        if (countryData) {
            const statusColor = getColorFromFeatures(countryData.features);
            const featuresHTML = countryData.features
                .map(
                    (feature: string) =>
                        `<span class="inline-block bg-slate-100/90 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 mr-1.5 mb-1.5 shadow-sm">${feature}</span>`
                )
                .join(" ");

            const systemStatus = getSystemStatus(countryData);

            setTooltipContent(`
                <div class="font-inter max-w-sm bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
                    <div class="relative p-5" style="background: linear-gradient(135deg, ${statusColor}15, ${statusColor}08); border-bottom: 1px solid ${statusColor}20;">
                        <div class="flex items-start justify-between">
                            <div>
                                <h3 class="text-lg font-bold text-gray-800 mb-1 leading-tight">${
                                    countryData.country
                                }</h3>
                                <div class="flex items-center gap-2">
                                    <div class="w-2.5 h-2.5 rounded-full" style="background: ${statusColor};"></div>
                                    <span class="text-sm font-medium text-gray-600">${systemStatus}</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-white shadow-sm">
                                <svg class="w-5 h-5" style="color: ${statusColor};" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 8A8 8 0 11 2 8a8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="p-5 space-y-4">
                        <div class="space-y-3">
                            ${
                                countryData.authority
                                    ? `
                            <div class="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl border border-gray-100">
                                <div class="flex items-center gap-2.5">
                                    <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                        </svg>
                                    </div>
                                    <span class="text-sm font-medium text-gray-700">Authority</span>
                                </div>
                                <span class="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg max-w-24 text-right truncate">${countryData.authority}</span>
                            </div>`
                                    : ""
                            }
                            
                            ${
                                countryData.coverage
                                    ? `
                            <div class="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl border border-gray-100">
                                <div class="flex items-center gap-2.5">
                                    <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <span class="text-sm font-medium text-gray-700">Coverage</span>
                                </div>
                                <span class="text-sm font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">${countryData.coverage}</span>
                            </div>`
                                    : ""
                            }
                        </div>
                        
                        ${
                            countryData.description
                                ? `
                        <div class="pt-2 border-t border-gray-100">
                            <div class="flex items-center gap-2 mb-2">
                                <div class="w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center">
                                    <svg class="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                </div>
                                <span class="text-sm font-semibold text-gray-700">System Overview</span>
                            </div>
                            <p class="text-xs text-gray-600 leading-relaxed bg-gray-50/50 p-3 rounded-lg">${countryData.description}</p>
                        </div>`
                                : ""
                        }
                        
                        ${
                            countryData.features.length > 0
                                ? `
                        <div class="pt-2 border-t border-gray-100">
                            <div class="flex items-center gap-2 mb-3">
                                <div class="w-6 h-6 bg-orange-100 rounded-md flex items-center justify-center">
                                    <svg class="w-3.5 h-3.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m6 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-6 4h6m-5 4h4"></path>
                                    </svg>
                                </div>
                                <span class="text-sm font-semibold text-gray-700">Key Features</span>
                            </div>
                            <div class="flex flex-wrap gap-1.5">
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
                <div class="font-inter max-w-xs bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
                    <div class="p-5 bg-gradient-to-br from-slate-50 to-gray-100 border-b border-gray-200">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-bold text-gray-800">${countryName}</h3>
                            <div class="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="p-5 text-center">
                        <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 2v20M14 2v20M4 7h16M4 17h16"></path>
                            </svg>
                        </div>
                        <p class="text-gray-600 text-sm font-medium mb-1">No Data Available</p>
                        <p class="text-gray-500 text-xs">Digital ID information not currently available</p>
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
            return "No Data";
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
            return "#94a3b8"; // Professional slate for no data
        }

        const hasAdvancedFeatures = features.some(
            (feature) =>
                feature.toLowerCase().includes("biometric") ||
                feature.toLowerCase().includes("digital") ||
                feature.toLowerCase().includes("electronic")
        );

        if (hasAdvancedFeatures) {
            return "#95D69A"; // Professional blue for implemented
        } else if (features.length > 2) {
            return "#dc2626"; // Professional red for partial
        } else if (features.length > 0) {
            return "#16a085"; // Professional teal for planning
        }

        return "#cbd5e1"; // Light slate for unknown
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
        { status: "Planning", color: getColor("Planning"), label: "In Development" },
        { status: "No Data", color: getColor("No Data"), label: "No Information" },
    ];

    return (
        <div className="w-full space-y-6">
            {/* Map Container */}
            <div className="relative">
                <div className="w-full h-[600px] lg:h-[700px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 border border-gray-200 relative">
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
                                                    fill: "#95D69A",
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
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-xl max-w-xs">
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
