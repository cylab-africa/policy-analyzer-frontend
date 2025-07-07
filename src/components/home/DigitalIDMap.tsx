"use client";

import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip as ReactTooltip } from "react-tooltip";
import africanCountries from "@/data/africa.json";
import digitalIDData from "@/data/digitalIDData.json";

// Define the color mapping for Digital ID status with professional gradient colors
const getColor = (status: string): string => {
    switch (status) {
        case "Implemented":
            return "#10b981"; // Emerald green for Implemented
        case "Partial":
            return "#f59e0b"; // Amber for Partial implementation
        case "Planning":
            return "#3b82f6"; // Blue for Planning stage
        case "None":
            return "#6b7280"; // Neutral gray for No system
        default:
            return "#d1d5db"; // Light gray for Unknown
    }
};

// Professional Legend component with glass morphism
const Legend: React.FC = () => {
    return (
        <div className="bg-white/90 backdrop-blur-lg rounded-xl p-6 w-[280px] shadow-xl border border-white/20 absolute top-6 right-6 z-10">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3"></div>
                Digital ID Systems
            </h4>
            <div className="space-y-3">
                <div className="flex items-center group">
                    <div
                        className="w-4 h-4 rounded-full mr-3 shadow-sm transition-transform group-hover:scale-110"
                        style={{ backgroundColor: "#10b981" }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">Fully Implemented</span>
                </div>
                <div className="flex items-center group">
                    <div
                        className="w-4 h-4 rounded-full mr-3 shadow-sm transition-transform group-hover:scale-110"
                        style={{ backgroundColor: "#f59e0b" }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">Partially Implemented</span>
                </div>
                <div className="flex items-center group">
                    <div
                        className="w-4 h-4 rounded-full mr-3 shadow-sm transition-transform group-hover:scale-110"
                        style={{ backgroundColor: "#3b82f6" }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">In Planning</span>
                </div>
                <div className="flex items-center group">
                    <div
                        className="w-4 h-4 rounded-full mr-3 shadow-sm transition-transform group-hover:scale-110"
                        style={{ backgroundColor: "#6b7280" }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">No System</span>
                </div>
            </div>
        </div>
    );
};

const DigitalIDMap: React.FC = () => {
    const [tooltipContent, setTooltipContent] = useState<string>("");

    const handleMouseEnter = (countryName: string) => {
        const countryData = digitalIDData[countryName as keyof typeof digitalIDData];

        if (countryData) {
            // Create a more visually appealing tooltip
            const statusColor = getColor(countryData.status);
            const featuresHTML = countryData.features
                .map(
                    (feature) =>
                        `<span class="inline-flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-700 mr-2 mb-2 shadow-sm hover:shadow-md transition-shadow">${feature}</span>`
                )
                .join(" ");

            // Enhanced professional tooltip with modern design
            setTooltipContent(`
        <div class="font-sans rounded-xl overflow-hidden shadow-2xl bg-white/95 backdrop-blur-lg text-gray-800 w-[380px] border border-white/20">
          <div class="flex justify-between items-center p-4 bg-gradient-to-r" style="background: linear-gradient(135deg, ${statusColor}, ${statusColor}dd);">
            <h3 class="m-0 text-white font-bold text-lg tracking-tight">${countryName}</h3>
            <span class="bg-white/25 backdrop-blur-sm py-1.5 px-3 rounded-full text-xs text-white font-semibold border border-white/20">${
                countryData.status
            }</span>
          </div>
          <div class="p-5">
            <div class="grid grid-cols-1 gap-3">
              <div class="flex items-center justify-between py-2 px-3 bg-gray-50/50 rounded-lg">
                <span class="font-semibold text-gray-600 text-sm flex items-center">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Implementation Year
                </span>
                <span class="text-sm font-medium text-gray-800">${countryData.year}</span>
              </div>
              ${
                  countryData.authority
                      ? `
              <div class="flex items-center justify-between py-2 px-3 bg-gray-50/50 rounded-lg">
                <span class="font-semibold text-gray-600 text-sm flex items-center">
                  <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Authority
                </span>
                <span class="text-sm font-medium text-gray-800 max-w-[180px] text-right">${countryData.authority}</span>
              </div>`
                      : ""
              }
              ${
                  countryData.coverage
                      ? `
              <div class="flex items-center justify-between py-2 px-3 bg-gray-50/50 rounded-lg">
                <span class="font-semibold text-gray-600 text-sm flex items-center">
                  <div class="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Population Coverage
                </span>
                <span class="text-sm font-medium text-gray-800">${countryData.coverage}</span>
              </div>`
                      : ""
              }
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-100">
              <span class="font-semibold text-gray-700 text-sm mb-3 flex items-center">
                <div class="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-2"></div>
                Key Features
              </span>
              <div class="flex flex-wrap gap-2">
                ${featuresHTML}
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

    const getCountryStatus = (countryName: string): string => {
        if (countryName in digitalIDData) {
            return digitalIDData[countryName as keyof typeof digitalIDData].status;
        }

        // Default to Unknown if not found
        return "Unknown";
    };

    return (
        <div className="w-full relative">
            <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-sm bg-gradient-to-br from-slate-50 to-blue-50 border border-white/20 relative">
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
                                                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                                            },
                                            hover: {
                                                fill: "#6366f1",
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
                                        data-tooltip-id="id-tooltip"
                                        data-tooltip-html={tooltipContent}
                                        className="cursor-pointer transition-all duration-300 ease-out"
                                    />
                                );
                            })
                        }
                    </Geographies>
                </ComposableMap>
                <ReactTooltip
                    id="id-tooltip"
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

export default DigitalIDMap;
