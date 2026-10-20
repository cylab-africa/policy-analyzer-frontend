"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useDigitalIdData, usePolicyLawData } from "@/redux/api/apiSlice";
import { AlertCircle, ChevronLeft, ChevronRight, Fingerprint, Loader2, Shield } from "lucide-react";
import React, { useEffect, useState } from "react";

// Enhanced Donut Chart Component
const DonutChart: React.FC<{
    data: { label: string; value: number; color: string }[];
    centerText?: string;
    centerSubtext?: string;
}> = ({ data, centerText, centerSubtext }) => {
    const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
    const total = data?.reduce((sum, item) => sum + item.value, 0);

    const radius = 45;
    const strokeWidth = 7;
    const normalizedRadius = radius - strokeWidth * 1.5;
    const circumference = normalizedRadius * 2 * Math.PI;

    let cumulativePercentage = 0;

    return (
        <div className="relative w-48 h-48 mx-auto group">
            {/* SVG Donut Chart */}
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-lg">
                {/* Background circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth={strokeWidth}
                />

                {/* Data segments */}
                {data.map((item, index) => {
                    if (item.value === 0) return null;

                    const percentage = (item.value / total) * 100;
                    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -((cumulativePercentage / 100) * circumference);

                    cumulativePercentage += percentage;

                    const isHovered = hoveredSegment === index;

                    return (
                        <circle
                            key={index}
                            cx="50"
                            cy="50"
                            r={normalizedRadius}
                            fill="none"
                            stroke={item.color}
                            strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="butt"
                            className="transition-all duration-300 ease-out cursor-pointer"
                            style={{
                                filter: isHovered
                                    ? "brightness(1.2) drop-shadow(0 0 8px rgba(255,255,255,0.3))"
                                    : "none",
                                transform: isHovered ? "scale(1.02)" : "scale(1)",
                                transformOrigin: "50% 50%",
                            }}
                            onMouseEnter={() => setHoveredSegment(index)}
                            onMouseLeave={() => setHoveredSegment(null)}
                        />
                    );
                })}
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-center">
                    <div className="text-3xl font-bold text-white drop-shadow-sm">
                        {hoveredSegment !== null ? data[hoveredSegment]?.value : centerText}
                    </div>
                    <div className="text-sm text-white/80 mt-1">
                        {hoveredSegment !== null ? data[hoveredSegment]?.label : centerSubtext}
                    </div>
                    {hoveredSegment !== null && (
                        <div className="text-xs text-white/60 mt-1">
                            {((data[hoveredSegment]?.value / total) * 100).toFixed(1)}%
                        </div>
                    )}
                </div>
            </div>

            {/* Hover tooltip */}
            {hoveredSegment !== null && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full pointer-events-none">
                    <div className="bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-white/20">
                        <div className="font-semibold">{data[hoveredSegment]?.label}</div>
                        <div className="text-white/80">
                            {data[hoveredSegment]?.value} countries (
                            {((data[hoveredSegment]?.value / total) * 100).toFixed(1)}%)
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Mini Bar Chart Component
const MiniBarChart: React.FC<{
    data: { label: string; value: number; color: string }[];
}> = ({ data }) => {
    // Scale bars against the total so each bar shows its share of all countries
    const total = data.reduce((sum, d) => sum + d.value, 0);

    return (
        <div className="space-y-3">
            {data.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                    <div className="w-24 text-sm font-medium text-white">{item.label}</div>
                    <div className="flex-1 bg-white/80 rounded-full h-3 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500 ease-out shadow-sm"
                            style={{
                                width: `${total > 0 ? (item.value / total) * 100 : 0}%`,
                                backgroundColor: item.color,
                                boxShadow: `0 0 4px ${item.color}40`,
                            }}
                        />
                    </div>
                    <div className="w-8 text-xs font-bold text-white text-left px-1 rounded">{item.value}</div>
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
        { label: "Enacted", value: enactedLaws, color: "#10b981" },
        { label: "Draft", value: draftLaws, color: "#3b82f6" },
        { label: "Limited", value: liteLaws, color: "#a855f7" },
        { label: "No law", value: noLaws, color: "#9ca3af" },
    ];

    // Digital ID Chart Data
    const digitalIdData = [
        { label: "Implemented", value: implementedSystems, color: "#10b981" },
        { label: "Partial", value: partialSystems, color: "#3b82f6" },
        { label: "Planning", value: planningSystems, color: "#f59e0b" },
        { label: "No info", value: noDataSystems, color: "#9ca3af" },
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
            title: "Data Protection Laws",
            subtitle: "African legislative overview",
            icon: <Shield className="w-5 h-5 text-white" />,
            content: (
                <div className="space-y-6">
                    {/* Data Protection Chart */}
                    <Card className="bg-white/15 backdrop-blur-md border-white/25 shadow-xl">
                        <CardContent className="py-2">
                            <div className="flex items-center justify-between">
                                <DonutChart
                                    data={dataProtectionData}
                                    centerText={`${enactedLaws}`}
                                    centerSubtext="Enacted"
                                />
                                <div className="flex-1 ml-3">
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
            icon: <Fingerprint className="w-5 h-5 text-white" />,
            content: (
                <div className="space-y-6">
                    {/* Digital ID Chart */}
                    <Card className="bg-white/15 backdrop-blur-md border-white/25 shadow-xl">
                        <CardContent className="py-2">
                            <div className="flex items-center justify-between">
                                <DonutChart
                                    data={digitalIdData}
                                    centerText={`${implementedSystems}`}
                                    centerSubtext="Implemented"
                                />
                                <div className="flex-1 ml-3">
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
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                    {slides[currentSlide]?.icon}
                    <div>
                        <h3 className="text-lg font-semibold text-white">{slides[currentSlide]?.title}</h3>
                    </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevSlide}
                        className="w-8 h-8 cursor-pointer bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-4 h-4 text-white" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="w-8 h-8 cursor-pointer bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-4 h-4 text-white" />
                    </button>
                </div>
            </div>

            {/* Carousel Content */}
            <div className="relative overflow-hidden rounded-xl bg-primary/50">
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
