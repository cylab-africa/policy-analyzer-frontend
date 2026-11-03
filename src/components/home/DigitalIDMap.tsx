"use client";

import africanCountries from "@/data/world-map.json";
import { useDigitalIdData } from "@/redux/api/apiSlice";
import { AlertCircle, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { ISLAND_STATES } from "@/lib/island-states";
import { MapPopoverCard, useMapPopover } from "./MapPopover";
import MapLegend from "./MapLegend";
import DigitalIdCard from "./DigitalIdCard";

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
    "Sao Tome & Principe": "São Tomé and Príncipe",
    "São Tomé and Príncipe": "São Tomé and Príncipe",
    "São Tomé and Principe": "São Tomé and Príncipe",
    "Sao Tome and Principe": "São Tomé and Príncipe",
    "Ivory Coast": "Côte d'Ivoire",
    "Côte d'Ivoire": "Côte d'Ivoire",
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
            return "#B7BDBF"; // Light slate - default state
    }
};

const DigitalIDMap: React.FC = () => {
    const { state: popoverState, containerRef, cardRef, hover, move, leave, pin, close } = useMapPopover();
    // Status picked in the legend; every other country is dimmed while it is set
    const [activeStatus, setActiveStatus] = useState<string | null>(null);

    // Use RTK Query hook with updated structure
    const { digitalIds, isLoading, error } = useDigitalIdData();

    const getCountryStatus = (countryName: string): string => {
        const countryData = findCountryData(digitalIds, countryName);
        return countryData?.status || "Unknown";
    };

    const activeCountry = popoverState ? findCountryData(digitalIds, popoverState.name) : undefined;

    if (isLoading) {
        return (
            <div className="w-full h-[600px] lg:h-[700px] rounded-xl bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center border border-slate-200">
                <div className="flex items-center gap-3 text-slate-600 bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4 shadow-sm border border-white/60">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="font-medium">Loading digital ID data...</span>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="w-full h-[500px] rounded-xl flex items-center justify-center border border-slate-200 bg-white">
                <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white/60 max-w-md mx-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Failed to load data</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Unable to fetch digital ID data from the server
                    </p>
                </div>
            </div>
        );
    }

    const legendData = [
        { status: "Implemented", color: getColor("Implemented"), label: "Fully Operational" },
        { status: "Partial", color: getColor("Partial"), label: "Partially Implemented" },
        { status: "Planning", color: getColor("Planning"), label: "Planning" },
        { status: "No Data", color: getColor("No Data"), label: "No Information" },
    ].map((item) => ({
        ...item,
        count: digitalIds.filter((id) => id.status === item.status).length,
    }));

    return (
        <div className="w-full">
            <MapLegend items={legendData} active={activeStatus} onChange={setActiveStatus} />
            <div className="relative">
                <div className="w-full h-[600px] lg:h-[700px] overflow-hidden relative bg-gradient-to-br from-slate-50/50 to-blue-50/30"
                    ref={containerRef}
                    onClick={close}
                >
                    {/* Faint dot grid, like graph paper */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-60"
                        style={{
                            backgroundImage: "radial-gradient(rgb(148 163 184 / 0.35) 1px, transparent 1px)",
                            backgroundSize: "22px 22px",
                        }}
                    />
                    {/* Professional background pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(99,102,241,0.05)_0%,transparent_70%)] pointer-events-none"></div>


                    <p className="pointer-events-none absolute left-4 top-6 z-10 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
                        Hover a country to preview it, click to pin.
                    </p>

                    <ComposableMap
                        projectionConfig={{
                            scale: 350,
                            center: [20, 0],
                        }}
                        style={{ width: "100%", height: "100%" }}
                        className="drop-shadow-lg"
                    >
                        <Geographies geography={africanCountries}>
                            {({ geographies }) =>
                                geographies.map((geo) => {
                                    const countryName = geo.properties.geounit;
                                    const interactive = geo.properties.au_member === true;
                                    const status = getCountryStatus(countryName);
                                    const fillColor = getColor(status);
                                    const isHovered = popoverState?.name === countryName;
                                    const dimmed = activeStatus !== null && status !== activeStatus;

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            aria-label={interactive ? countryName : undefined}
                                            geography={geo}
                                            fill={fillColor}

                                            stroke={isHovered ? "#1e293b" : "rgba(255,255,255,0.8)"}
                                            strokeWidth={isHovered ? 1.6 : 0.7}
                                            style={{
                                                default: {
                                                    outline: "none",
                                                    filter: isHovered ? "brightness(1.12)" : "none",
                                                    transition: "filter 0.15s ease, opacity 0.25s ease",
                                                    opacity: dimmed ? 0.18 : 1,
                                                    cursor: interactive ? "pointer" : "default",
                                                },
                                                hover: interactive
                                                    ? { outline: "none", fill: fillColor, filter: "brightness(1.12)", opacity: dimmed ? 0.4 : 1 }
                                                    : {},
                                                pressed: interactive
                                                    ? { outline: "none", fill: fillColor, filter: "brightness(0.95)", opacity: dimmed ? 0.4 : 1 }
                                                    : {},
                                            }}
                                            onMouseEnter={interactive ? (event) => hover(countryName, event) : undefined}
                                            onMouseMove={interactive ? move : undefined}
                                            onMouseLeave={interactive ? leave : undefined}
                                            onClick={interactive ? (event) => pin(countryName, event) : undefined}
                                            className={
                                                interactive
                                                    ? "cursor-pointer"
                                                    : "cursor-default"
                                            }
                                        />
                                    );
                                })
                            }
                        </Geographies>
                        {ISLAND_STATES.map(({ name, coordinates }) => (
                            <Marker key={name} coordinates={coordinates}>
                                <circle
                                    r={5}
                                    aria-label={name}
                                    fill={getColor(getCountryStatus(name))}
                                    stroke="rgba(255,255,255,0.9)"
                                    strokeWidth={1.5}
                                    className="cursor-pointer transition-opacity duration-200"
                                    opacity={activeStatus !== null && getCountryStatus(name) !== activeStatus ? 0.25 : 1}
                                    onMouseEnter={(event) => hover(name, event)}
                                    onMouseMove={move}
                                    onMouseLeave={leave}
                                    onClick={(event) => pin(name, event)}
                                />
                            </Marker>
                        ))}
                    </ComposableMap>
                    {popoverState && activeCountry && (
                        <MapPopoverCard
                            pinned={popoverState.pinned}
                            label={activeCountry.country}
                            cardRef={cardRef}
                            onClose={close}
                        >
                            <DigitalIdCard
                                                    country={activeCountry}
                                                    pinned={popoverState.pinned}
                                                    statusColor={getColor(activeCountry.status || "No Data")}
                                                />
                        </MapPopoverCard>
                    )}

                    {/* Map Source Reference */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-black/5 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
                            <p className="text-xs text-gray-500 font-medium">
                                Source:
                                <a
                                    href="https://www.naturalearthdata.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-blue-900 ml-1 transition-colors duration-200"
                                >
                                    Natural Earth
                                </a>
                                <span className="ml-1">· African Union members map</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DigitalIDMap;
