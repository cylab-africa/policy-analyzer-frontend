/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import africanCountries from "@/data/africa.json";
import digitalIDData from "@/data/digitalIDData.json";

// Define the color mapping for Digital ID status
const getColor = (status: string): string => {
    switch (status) {
        case "Implemented":
            return "#10b981";
        case "Partial":
            return "#f59e0b";
        case "Planning":
            return "#3b82f6";
        case "None":
            return "#6b7280";
        default:
            return "#d1d5db";
    }
};

// Professional Legend component
const Legend: React.FC = () => {
    // Calculate actual stats from digitalIDData
    const stats = Object.values(digitalIDData).reduce((acc, country: any) => {
        const status = country.status || "None";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Count countries with biometric systems
    const biometricCount = Object.values(digitalIDData).filter(
        (country: any) =>
            country.features &&
            country.features.some(
                (feature: string) =>
                    feature.toLowerCase().includes("biometric") || feature.toLowerCase().includes("fingerprint")
            )
    ).length;

    const legendItems = [
        { status: "Implemented", color: "#10b981", label: "Fully Implemented", count: stats["Implemented"] || 0 },
        { status: "Partial", color: "#f59e0b", label: "Partially Implemented", count: stats["Partial"] || 0 },
        { status: "Planning", color: "#3b82f6", label: "In Planning", count: stats["Planning"] || 0 },
        { status: "None", color: "#6b7280", label: "No System", count: stats["None"] || 0 },
    ];

    const totalCountriesWithData = Object.keys(digitalIDData).length;

    return (
        <Card className="h-fit shadow-sm border-0 bg-gradient-to-br from-background via-background to-muted/20">
            <CardHeader>
                <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-sm"></div>
                    Digital ID Systems
                </CardTitle>
                <Separator className="bg-gradient-to-r from-border to-transparent" />
            </CardHeader>
            <CardContent className="space-y-4">
                {legendItems.map((item) => (
                    <div key={item.status} className="group">
                        <div className="flex items-center justify-between md:px-3 md:py-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50">
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

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col items-center p-3 bg-gradient-to-br from-primary/8 to-primary/4 rounded-lg border border-primary/15 hover:border-primary/25 transition-all duration-200">
                        <div className="text-lg font-bold text-primary mb-1">{totalCountriesWithData}</div>
                        <div className="text-xs text-muted-foreground font-medium text-center leading-tight">Total Coverage</div>
                    </div>
                    
                    <div className="flex flex-col items-center p-3 bg-gradient-to-br from-purple-500/8 to-purple-500/4 rounded-lg border border-purple-500/15 hover:border-purple-500/25 transition-all duration-200">
                        <div className="text-lg font-bold text-purple-600 mb-1">{biometricCount}</div>
                        <div className="text-xs text-muted-foreground font-medium text-center leading-tight">Biometric ID</div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};

const DigitalIDMap: React.FC = () => {
    const [tooltipContent, setTooltipContent] = useState<string>("");

    const handleMouseEnter = (countryName: string) => {
        const countryData = digitalIDData[countryName as keyof typeof digitalIDData];

        if (countryData) {
            const statusColor = getColor(countryData.status);
            const featuresHTML = countryData.features
                .map(
                    (feature) =>
                        `<span class="inline-block bg-white/90 backdrop-blur-sm border border-white/40 rounded-md px-2 py-1 text-xs font-medium text-gray-700 mr-1 mb-1 shadow-sm">${feature}</span>`
                )
                .join(" ");

            setTooltipContent(`
                <div class="font-sans rounded-xl overflow-hidden shadow-2xl bg-white/95 backdrop-blur-lg text-gray-800 w-80 border border-white/30">
                    <div class="relative p-4" style="background: linear-gradient(135deg, ${statusColor}, ${statusColor}dd);">
                        <div class="absolute inset-0 bg-black/10 rounded-t-xl"></div>
                        <div class="relative flex justify-between items-center">
                            <h3 class="m-0 text-white font-bold text-base tracking-tight drop-shadow-sm">${countryName}</h3>
                            <span class="bg-white/25 backdrop-blur-sm py-1.5 px-3 rounded-full text-xs text-white font-semibold border border-white/30 shadow-sm">${
                                countryData.status
                            }</span>
                        </div>
                    </div>
                    <div class="p-4 space-y-3">
                        <div class="grid grid-cols-1 gap-2">
                            <div class="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-lg border border-blue-100/50">
                                <span class="font-semibold text-blue-700 text-xs flex items-center">
                                    <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                    Implementation Year
                                </span>
                                <span class="text-xs font-bold text-blue-800">${countryData.year}</span>
                            </div>
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
                        </div>
                        
                        <div class="pt-3 border-t border-gray-100">
                            <span class="font-semibold text-gray-700 text-xs mb-2 flex items-center">
                                <div class="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-2"></div>
                                Key Features
                            </span>
                            <div class="flex flex-wrap gap-1">
                                ${featuresHTML}
                            </div>
                        </div>
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
        if (countryName in digitalIDData) {
            return digitalIDData[countryName as keyof typeof digitalIDData].status;
        }
        return "Unknown";
    };

    return (
        <div className="w-full">
            {/* Map and Legend Container - Side by side on all screens */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Map Section - Takes most space */}
                <div className="flex-1">
                    <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[550px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/50 border border-border/50 shadow-sm relative group">
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
                                                        fill: "#6366f1",
                                                        outline: "none",
                                                        filter: "drop-shadow(0 4px 12px rgba(99,102,241,0.3)) brightness(1.05)",
                                                        transform: "scale(1.02)",
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
                                                className="cursor-pointer transition-all duration-300 ease-out"
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                        </ComposableMap>

                        {/* Map watermark */}
                        <div className="absolute bottom-2 left-2 text-xs text-muted-foreground/60 font-medium">
                            Digital ID Implementation
                        </div>
                    </div>
                </div>

                {/* Legend Section - Fixed width, always beside map */}
                <div className="w-full sm:w-72 lg:w-80 flex-shrink-0">
                    <Legend />
                </div>
            </div>

            {/* Tooltip */}
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
