"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useDigitalIdData, usePolicyLawData } from "@/redux/api/apiSlice";
import { AlertCircle, ChevronLeft, ChevronRight, FileKey, Loader2, Shield } from "lucide-react";
import React, { useEffect, useState } from "react";

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
                    <div className="w-20 text-sm font-medium text-white/90">{item.label}</div>
                    <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500 ease-out"
                            style={{
                                width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
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

// Main Hero Stats Component with Carousel
const HeroStatsSection: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const {
        isLoading: policyLoading,
        error: policyError,
        enactedLaws,
        draftLaws,
        noLaws,
        liteLaws,
    } = usePolicyLawData();

    const {
        isLoading: digitalLoading,
        error: digitalError,
        implementedSystems,
        partialSystems,
        planningSystems,
        noDataSystems,
    } = useDigitalIdData();

    const isLoading = policyLoading || digitalLoading;
    const hasError = policyError || digitalError;

    // Auto-play functionality
    useEffect(() => {
        if (isAutoPlaying && !isLoading && !hasError) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % 2);
            }, 5000); // Change slide every 5 seconds

            return () => clearInterval(interval);
        }
    }, [isAutoPlaying, isLoading, hasError]);

    // Data Protection Chart Data
    const dataProtectionData = [
        { label: "Enacted", value: enactedLaws, color: "#059669" },
        { label: "Draft", value: draftLaws, color: "#3b82f6" },
        { label: "Partial", value: liteLaws, color: "#8b5cf6" },
        { label: "No Law", value: noLaws, color: "#6b7280" },
    ];

    // Digital ID Chart Data
    const digitalIdData = [
        { label: "Implemented", value: implementedSystems, color: "#059669" },
        { label: "Partial", value: partialSystems, color: "#3b82f6" },
        { label: "Planning", value: planningSystems, color: "#f59e0b" },
        { label: "No Data", value: noDataSystems, color: "#6b7280" },
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % 2);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + 2) % 2);
        setIsAutoPlaying(false);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-12 flex items-center justify-center">
                    <div className="flex items-center gap-3 text-white/80">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="font-medium">Loading statistics...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-red-300/30 p-8 text-center">
                    <div className="w-12 h-12 bg-red-100/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <AlertCircle className="h-6 w-6 text-red-200" />
                    </div>
                    <div className="text-white font-semibold mb-1">Unable to load statistics</div>
                    <div className="text-white/70 text-sm">Please try again later</div>
                </div>
            </div>
        );
    }

    const slides = [
        {
            title: "Data Protection Landscape",
            subtitle: "African legislative overview",
            icon: <Shield className="w-5 h-5 text-white" />,
            content: (
                <div className="space-y-6">
                    {/* Data Protection Chart */}
                    <Card className="bg-white/15 backdrop-blur-md border-white/25 shadow-xl">
                        <CardContent className="p-6">
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
            ),
        },

        {
            title: "Digital Identity Systems",
            subtitle: "Implementation across Africa",
            icon: <FileKey className="w-5 h-5 text-white" />,
            content: (
                <div className="space-y-6">
                    {/* Digital ID Chart */}
                    <Card className="bg-white/15 backdrop-blur-md border-white/25 shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <DonutChart
                                    data={digitalIdData}
                                    centerText={`${implementedSystems}`}
                                    centerSubtext="Active"
                                />
                                <div className="flex-1 ml-6">
                                    <MiniBarChart data={digitalIdData} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            {/* Carousel Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    {slides[currentSlide]?.icon}
                    <div>
                        <h3 className="text-lg font-bold text-white">{slides[currentSlide]?.title}</h3>
                    </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevSlide}
                        className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-4 h-4 text-white" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-4 h-4 text-white" />
                    </button>
                </div>
            </div>

            {/* Carousel Content */}
            <div className="relative overflow-hidden rounded-xl">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <div key={index} className="w-full flex-shrink-0">
                            {slide.content}
                        </div>
                    ))}
                </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-4">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentSlide ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroStatsSection;
