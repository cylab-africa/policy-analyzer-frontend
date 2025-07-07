"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip as ReactTooltip } from "react-tooltip";
import africanCountries from "@/data/africa.json"; // Your GeoJSON data
import africaData from "@/data/countries_law_data.json"; // Importing the JSON file

// Professional color mapping for data protection legislation status
const getColor = (status: string): string => {
    switch (status) {
        case "Enacted":
            return "#059669"; // Emerald green for Enacted
        case "Draft":
            return "#d97706"; // Amber for Draft
        case "No Law":
            return "#dc2626"; // Red for No Law
        default:
            return "#6b7280"; // Neutral gray for Unknown/Lite
    }
};

// Professional Legend component with glass morphism
const Legend: React.FC = () => {
    return (
        <div className="bg-white/90 backdrop-blur-lg rounded-xl p-6 w-[280px] shadow-xl border border-white/20 absolute top-6 right-6 z-10">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full mr-3"></div>
                Data Protection Laws
            </h4>
            <div className="space-y-3">
                <div className="flex items-center group">
                    <div
                        className="w-4 h-4 rounded-full mr-3 shadow-sm transition-transform group-hover:scale-110"
                        style={{ backgroundColor: "#059669" }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">Enacted</span>
                </div>
                <div className="flex items-center group">
                    <div
                        className="w-4 h-4 rounded-full mr-3 shadow-sm transition-transform group-hover:scale-110"
                        style={{ backgroundColor: "#d97706" }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">Draft</span>
                </div>
                <div className="flex items-center group">
                    <div
                        className="w-4 h-4 rounded-full mr-3 shadow-sm transition-transform group-hover:scale-110"
                        style={{ backgroundColor: "#dc2626" }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">No Law</span>
                </div>
                <div className="flex items-center group">
                    <div
                        className="w-4 h-4 rounded-full mr-3 shadow-sm transition-transform group-hover:scale-110"
                        style={{ backgroundColor: "#6b7280" }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">Limited/Unknown</span>
                </div>
            </div>
        </div>
    );
};

const DataProtectionMap: React.FC = () => {
    const [tooltipContent, setTooltipContent] = useState<string>("");
    const router = useRouter();

    const handleMouseEnter = (countryName: string) => {
        const country = africaData[countryName as keyof typeof africaData];
        if (country) {
            const statusColor = getColor(country.dataProtectionLegislationStatus);

            // Enhanced professional tooltip with modern design
            setTooltipContent(`
        <div class="font-sans rounded-xl overflow-hidden shadow-2xl bg-white/95 backdrop-blur-lg text-gray-800 w-[380px] border border-white/20">
          <div class="flex justify-between items-center p-4 bg-gradient-to-r" style="background: linear-gradient(135deg, ${statusColor}, ${statusColor}dd);">
            <h3 class="m-0 text-white font-bold text-lg tracking-tight">${country.flagEmoji} ${country.name}</h3>
            <span class="bg-white/25 backdrop-blur-sm py-1.5 px-3 rounded-full text-xs text-white font-semibold border border-white/20">${
                country.dataProtectionLegislationStatus
            }</span>
          </div>
          <div class="p-5">
            <div class="grid grid-cols-1 gap-3">
              <div class="flex items-center justify-between py-3 px-4 bg-emerald-50/50 rounded-lg border border-emerald-100/50">
                <span class="font-semibold text-emerald-700 text-sm flex items-center">
                  <div class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  Year Enacted
                </span>
                <span class="text-sm font-bold text-emerald-800">${
                    country.yearLegislationEnacted || "Not Available"
                }</span>
              </div>
              
              <div class="flex items-center justify-between py-3 px-4 bg-blue-50/50 rounded-lg border border-blue-100/50">
                <span class="font-semibold text-blue-700 text-sm flex items-center">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Malabo Convention
                </span>
                <span class="text-sm font-bold text-blue-800">${country.malaboConventionStatus}</span>
              </div>
            </div>
          </div>
        </div>
      `);
        } else {
            // Enhanced no-data tooltip
            setTooltipContent(`
        <div class="font-sans rounded-xl overflow-hidden shadow-2xl bg-white/95 backdrop-blur-lg text-gray-800 w-[280px] border border-white/20">
          <div class="flex justify-between items-center p-4 bg-gradient-to-r from-gray-400 to-gray-500">
            <h3 class="m-0 text-white font-bold text-lg">${countryName}</h3>
            <span class="bg-white/25 backdrop-blur-sm py-1.5 px-3 rounded-full text-xs text-white font-semibold">No Data</span>
          </div>
          <div class="p-5 text-center">
            <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <div class="w-6 h-6 bg-gray-400 rounded-full"></div>
            </div>
            <p class="m-0 text-gray-600 text-sm">No detailed information available for this country.</p>
          </div>
        </div>
      `);
        }
    };

    const handleMouseLeave = () => {
        setTooltipContent("");
    };

    return (
        <div className="flex flex-col w-full">
            <div className="w-full h-[600px] rounded-2xl shadow-sm overflow-hidden bg-gradient-to-br from-slate-50 to-emerald-50 border border-white/20 relative flex justify-center items-stretch">
                <ComposableMap
                    projectionConfig={{
                        scale: 380,
                        center: [45, 0],
                    }}
                    style={{ width: "100%", height: "100%" }}
                >
                    <Geographies geography={africanCountries}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const countryName = geo.properties.geounit;
                                const country = africaData[countryName as keyof typeof africaData];
                                const fillColor = country
                                    ? getColor(country.dataProtectionLegislationStatus)
                                    : "#6b7280";
                                const isoAlpha2 = country?.isoAlpha2 || "";

                                const handleCountryClick = (countryCode: string) => {
                                    if (countryCode) {
                                        router.push(`/country/${countryCode}`);
                                    }
                                };

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onClick={() => handleCountryClick(isoAlpha2)}
                                        fill={fillColor}
                                        stroke="#ffffff"
                                        strokeWidth={0.8}
                                        style={{
                                            default: {
                                                outline: "none",
                                                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                                            },
                                            hover: {
                                                fill: "#10b981",
                                                outline: "none",
                                                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2)) brightness(1.1)",
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
                <ReactTooltip
                    id="data-protection-tooltip"
                    className="z-50 opacity-100 !bg-transparent max-w-[400px] animate-in fade-in-0 zoom-in-95 duration-200"
                    style={{
                        backgroundColor: "transparent",
                        maxWidth: "400px",
                    }}
                />
                <Legend />
            </div>
        </div>
    );
};

export default DataProtectionMap;
