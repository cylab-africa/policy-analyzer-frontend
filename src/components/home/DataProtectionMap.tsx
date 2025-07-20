/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import africanCountries from "@/data/africa.json";
import africaData from "@/data/countries_law_data.json";
import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip as ReactTooltip } from "react-tooltip";

// Color mapping for data protection legislation status
const getColor = (status: string): string => {
    switch (status) {
        case "Enacted":
            return "#059669";
        case "Draft":
            return "#d97706";
        case "No Law":
            return "#dc2626";
        default:
            return "#6b7280";
    }
};

// Professional Legend component
const Legend: React.FC = () => {
    // Calculate actual stats from africaData
    const stats = Object.values(africaData).reduce((acc, country: any) => {
        const status = country.dataProtectionLegislationStatus;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

   

    const legendItems = [
        { status: "Enacted", color: "#16a34a", label: "Enacted Laws", count: stats["Enacted"] || 0 },
        { status: "Draft", color: "#f59e0b", label: "Draft Legislation", count: stats["Draft"] || 0 },
        { status: "No Law", color: "#ef4444", label: "No Laws", count: stats["No Law"] || 0 },
        {
            status: "Other",
            color: "#94a3b8",
            label: "Limited/Unknown",
            count: (stats["Limited"] || 0) + (stats["Unknown"] || 0) + (stats["Lite"] || 0),
        },
    ];

    const totalCountries = Object.keys(africaData).length;
    const implementationRate = Math.round(((stats["Enacted"] || 0) / totalCountries) * 100);

    return (
        <Card className="h-fit shadow-sm border-0 bg-gradient-to-br from-background via-background to-muted/20">
            <CardHeader>
                <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full shadow-sm"></div>
                    Data Protection Laws
                </CardTitle>
                <Separator className="bg-gradient-to-r from-border to-transparent" />
            </CardHeader>
            <CardContent className="space-y-4">
                {legendItems.map((item) => (
                    <div key={item.status} className="group">
                        <div className="flex items-center justify-between md:px-3 lg:py-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50">
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
                    <div className="text-center p-2.5 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent rounded-lg border border-primary/10 hover:border-primary/20 transition-colors">
                        <div className="text-lg font-bold text-primary">{totalCountries}</div>
                        <div className="text-xs text-muted-foreground font-medium">Countries</div>
                    </div>
                    <div className="text-center p-2.5 bg-gradient-to-br from-emerald-500/5 via-emerald-500/3 to-transparent rounded-lg border border-emerald-500/10 hover:border-emerald-500/20 transition-colors">
                        <div className="text-lg font-bold text-emerald-600">{implementationRate}%</div>
                        <div className="text-xs text-muted-foreground font-medium">Enacted</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const DataProtectionMap: React.FC = () => {
    const [tooltipContent, setTooltipContent] = useState<string>("");

    const handleMouseEnter = (countryName: string) => {
        const country = africaData[countryName as keyof typeof africaData];
        if (country) {
            const statusColor = getColor(country.dataProtectionLegislationStatus);

            setTooltipContent(`
                <div class="font-sans rounded-xl overflow-hidden shadow-2xl bg-white/95 backdrop-blur-lg text-gray-800 w-80 border border-white/30">
                    <div class="relative p-4" style="background: linear-gradient(135deg, ${statusColor}, ${statusColor}dd);">
                        <div class="absolute inset-0 bg-black/10 rounded-t-xl"></div>
                        <div class="relative flex justify-between items-center">
                            <h3 class="m-0 text-white font-bold text-base tracking-tight drop-shadow-sm">${
                                country.flagEmoji
                            } ${country.name}</h3>
                            <span class="bg-white/25 backdrop-blur-sm py-1.5 px-3 rounded-full text-xs text-white font-semibold border border-white/30 shadow-sm">${
                                country.dataProtectionLegislationStatus
                            }</span>
                        </div>
                    </div>
                    <div class="p-4 space-y-3">
                        <div class="grid grid-cols-1 gap-2">
                            <div class="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-emerald-50/80 to-green-50/80 rounded-lg border border-emerald-100/50">
                                <span class="font-semibold text-emerald-700 text-xs flex items-center">
                                    <div class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                                    Year Enacted
                                </span>
                                <span class="text-xs font-bold text-emerald-800">${
                                    country.yearLegislationEnacted || "Not Available"
                                }</span>
                            </div>
                            
                            <div class="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-lg border border-blue-100/50">
                                <span class="font-semibold text-blue-700 text-xs flex items-center">
                                    <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                    Malabo Convention
                                </span>
                                <span class="text-xs font-bold text-blue-800">${country.malaboConventionStatus}</span>
                            </div>
                        </div>
                        
                        <div class="pt-3 border-t border-gray-100">
                            <button class="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]">
                                View Country Details →
                            </button>
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

    return (
        <div className="w-full">
            {/* Map and Legend Container - Side by side on all screens */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Map Section - Takes most space */}
                <div className="flex-1">
                    <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[550px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 border border-border/50 shadow-sm relative group">
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
                                        const country = africaData[countryName as keyof typeof africaData];
                                        const fillColor = country
                                            ? getColor(country.dataProtectionLegislationStatus)
                                            : "#6b7280";

                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                // onClick={() => handleCountryClick(countryName)}
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
                                                        filter: "drop-shadow(0 4px 12px rgba(16,185,129,0.3)) brightness(1.05)",
                                                        transform: "scale(1.02)",
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
                                                className="cursor-pointer transition-all duration-300 ease-out"
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
                    <Legend />
                </div>
            </div>

            {/* Tooltip */}
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
