/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card } from "@/components/ui/card";
import africaData from "@/data/countries_law_data.json";
import React, { useState } from "react";
import DataProtectionMap from "./DataProtectionMap";
import DigitalIDMap from "./DigitalIDMap";

// Enum for tab types
enum TabType {
    DATA_PROTECTION = "data-protection",
    DIGITAL_ID = "digital-id",
}

// Stats Card Component
interface StatsCardProps {
    icon: React.ReactNode;
    count: number;
    label: string;
    color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, count, label, color }) => {
    return (
        <Card className="p-4 bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-sm">
            <div className="flex items-start space-x-3">
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ backgroundColor: color }}
                >
                    <div className="text-white text-sm">{icon}</div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
                    <div className="text-sm text-gray-600 leading-tight">{label}</div>
                </div>
            </div>
        </Card>
    );
};

// Main TabSection Component
const TabSection = () => {
    const [activeTab, setActiveTab] = useState<TabType>(TabType.DIGITAL_ID);

    // Data Protection Stats
    const dataProtectionStats = {
        totalCountries: Object.keys(africaData).length,
        enactedLaws: Object.values(africaData).filter(
            (country: any) => country.dataProtectionLegislationStatus === "Enacted"
        ).length,
        noLaws: Object.values(africaData).filter((country: any) => country.dataProtectionLegislationStatus === "No Law")
            .length,
        malaboSigned: Object.values(africaData).filter((country: any) => country.malaboConventionStatus === "Signed")
            .length,
    };

    // Digital ID Stats
    const digitalIDStats = {
        totalCountries: Object.keys(africaData).length,
        implementedIDs: 32,
        partiallyImplementedIDs: 12,
        planningIDs: 6,
        biometricSystems: 38,
    };

    // Simplified icons
    const icons = {
        globe: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                <path d="M12 6c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z" />
            </svg>
        ),
        check: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 15.586l-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z" />
            </svg>
        ),
        ban: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                <path d="M15.536 8.464l-1.414-1.414L12 9.172 9.878 7.05 8.464 8.464 10.586 10.586 8.464 12.708l1.414 1.414L12 11.828l2.122 2.122 1.414-1.414L13.414 11.414z" />
            </svg>
        ),
        document: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V8l-6-6zM6 20V4h6v4h4v12H6z" />
            </svg>
        ),
        id: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM4 18V6h16l.002 12H4z" />
                <path d="M6 12h6v2H6zm0-4h4v2H6z" />
            </svg>
        ),
        biometric: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 8c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3z" />
                <path d="M21 21v-1a8 8 0 0 0-8-8h-2a8 8 0 0 0-8 8v1h2v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1z" />
            </svg>
        ),
        partial: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18V4c4.411 0 8 3.589 8 8s-3.589 8-8 8z" />
            </svg>
        ),
    };

    return (
        <section className="py-12">
            <div className="max-w-[1400px] mx-auto px-6">
                {/* Tabs Navigation */}
                <div className="border-b border-gray-200 mb-8">
                    <div className="flex">
                        <button
                            className={`px-8 py-4 text-base font-medium border-b-2 transition-colors ${
                                activeTab === TabType.DIGITAL_ID
                                    ? "text-primary border-primary font-semibold"
                                    : "text-gray-500 hover:text-primary border-transparent hover:border-gray-300"
                            }`}
                            onClick={() => setActiveTab(TabType.DIGITAL_ID)}
                        >
                            Digital ID
                        </button>
                        <button
                            className={`px-8 py-4 text-base font-medium border-b-2 transition-colors ${
                                activeTab === TabType.DATA_PROTECTION
                                    ? "text-primary border-primary font-semibold"
                                    : "text-gray-500 hover:text-primary border-transparent hover:border-gray-300"
                            }`}
                            onClick={() => setActiveTab(TabType.DATA_PROTECTION)}
                        >
                            Data Protection
                        </button>
                    </div>
                </div>

                {/* Dashboard Layout */}
                <div className="flex flex-col lg:flex-row gap-8 mt-8">
                    {/* Map Column - 3/4 width */}
                    <div className="w-full lg:w-3/4">
                        {activeTab === TabType.DATA_PROTECTION ? <DataProtectionMap /> : <DigitalIDMap />}
                    </div>

                    {/* Stats Column - 1/4 width */}
                    <div className="w-full lg:w-1/4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Overview</h3>
                        <div className="space-y-4">
                            {activeTab === TabType.DATA_PROTECTION ? (
                                <>
                                    <StatsCard
                                        icon={icons.globe}
                                        count={dataProtectionStats.totalCountries}
                                        label="Total Countries"
                                        color="#6366f1"
                                    />
                                    <StatsCard
                                        icon={icons.check}
                                        count={dataProtectionStats.enactedLaws}
                                        label="Enacted Laws"
                                        color="#10b981"
                                    />
                                    <StatsCard
                                        icon={icons.ban}
                                        count={dataProtectionStats.noLaws}
                                        label="No Laws"
                                        color="#ef4444"
                                    />
                                    <StatsCard
                                        icon={icons.document}
                                        count={dataProtectionStats.malaboSigned}
                                        label="Malabo Convention"
                                        color="#3b82f6"
                                    />
                                </>
                            ) : (
                                <>
                                    <StatsCard
                                        icon={icons.check}
                                        count={digitalIDStats.implementedIDs}
                                        label="Fully Implemented"
                                        color="#10b981"
                                    />
                                    <StatsCard
                                        icon={icons.partial}
                                        count={digitalIDStats.partiallyImplementedIDs}
                                        label="Partial Implementation"
                                        color="#f59e0b"
                                    />
                                    <StatsCard
                                        icon={icons.globe}
                                        count={digitalIDStats.planningIDs}
                                        label="In Planning"
                                        color="#3b82f6"
                                    />
                                    <StatsCard
                                        icon={icons.biometric}
                                        count={digitalIDStats.biometricSystems}
                                        label="Biometric Systems"
                                        color="#8b5cf6"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TabSection;
