"use client";

import { Card, CardContent } from "@/components/ui/card";
import { usePolicyLawData } from "@/redux/api/apiSlice";
import { AlertCircle, Loader2, Shield } from "lucide-react";
import React from "react";

// Donut Chart Component
const DonutChart: React.FC<{
    data: { label: string; value: number; color: string }[];
    centerText?: string;
    centerSubtext?: string;
}> = ({ data, centerText, centerSubtext }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;

    const createPath = (percentage: number, cumulativePerc: number) => {
        const startAngle = cumulativePerc * 3.6;
        const endAngle = (cumulativePerc + percentage) * 3.6;

        const start = polarToCartesian(50, 50, 40, endAngle);
        const end = polarToCartesian(50, 50, 40, startAngle);
        const largeArcFlag = percentage > 50 ? 1 : 0;

        return `M 50,50 L ${start.x},${start.y} A 40,40 0 ${largeArcFlag},0 ${end.x},${end.y} Z`;
    };

    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians),
        };
    };

    return (
        <div className="relative w-32 h-32 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {data.map((item, index) => {
                    if (item.value === 0) return null;
                    const percentage = (item.value / total) * 100;
                    const path = createPath(percentage, cumulativePercentage);
                    cumulativePercentage += percentage;

                    return (
                        <path
                            key={index}
                            d={path}
                            fill={item.color}
                            className="transition-all duration-300 hover:brightness-110"
                        />
                    );
                })}
                <circle cx="50" cy="50" r="25" fill="white" />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-slate-800">{centerText}</div>
                {centerSubtext && <div className="text-xs text-slate-600 font-medium">{centerSubtext}</div>}
            </div>
        </div>
    );
};

// Mini Bar Chart Component
const MiniBarChart: React.FC<{
    data: { label: string; value: number; color: string }[];
}> = ({ data }) => {
    const maxValue = Math.max(...data.map((d) => d.value));

    return (
        <div className="space-y-3">
            {data.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                    <div className="w-16 text-sm font-medium text-white/90 truncate">{item.label}</div>
                    <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500 ease-out"
                            style={{
                                width: `${(item.value / maxValue) * 100}%`,
                                backgroundColor: item.color,
                            }}
                        />
                    </div>
                    <div className="w-8 text-xs font-bold text-white text-right">{item.value}</div>
                </div>
            ))}
        </div>
    );
};

// Main Hero Stats Component
const HeroStatsSection: React.FC = () => {
    const {
        isLoading: policyLoading,
        error: policyError,
        enactedLaws,
        draftLaws,
        noLaws,
        liteLaws,
    } = usePolicyLawData();

    const isLoading = policyLoading;
    const hasError = policyError;

    // Data Protection Chart Data
    const dataProtectionData = [
        { label: "Enacted", value: enactedLaws, color: "#059669" },
        { label: "Draft", value: draftLaws, color: "#3b82f6" },
        { label: "Lite", value: liteLaws, color: "#8b5cf6" },
        { label: "No Law", value: noLaws, color: "#ef4444" },
    ];

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-white/70" />
                    <span className="ml-3 text-white/70 font-medium">Loading statistics...</span>
                </div>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="space-y-6">
                <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-6 text-center">
                    <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                    <div className="text-white font-medium">Unable to load statistics</div>
                    <div className="text-white/70 text-sm mt-1">Please try again later</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Charts Section */}
            <div className="space-y-6">
                <Card className="bg-white/20 backdrop-blur-sm border-white/20">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Shield className="w-5 h-5 text-white" />
                            <h3 className="text-lg font-bold text-white">Data Protection Status</h3>
                        </div>

                        <div className="flex items-center justify-between">
                            <DonutChart
                                data={dataProtectionData}
                                centerText={`${enactedLaws}`}
                                centerSubtext="Enacted"
                            />

                            <div className="flex-1 ml-6">
                                <MiniBarChart data={dataProtectionData} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default HeroStatsSection;
