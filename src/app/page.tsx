"use client";
import HeroStatsSection from "@/components/home/HeroStatsSection";
import PolicyHighlightsSection from "@/components/home/PolicyHighlightsSection";
import TabSection from "@/components/home/TabSection";
import { useSmoothScroll, ScrollReveal } from "@/components/ui/smooth-scroll";
import Link from "next/link";
import { useEffect, useState } from "react";

const ScrollArrow = () => {
    const [isVisible, setIsVisible] = useState(true);

    // Hide arrow when user starts scrolling
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 100;
            setIsVisible(!scrolled);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTabSection = () => {
        const tabSection = document.querySelector("#tab-section");
        if (tabSection) {
            tabSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        } else {
            // Fallback: scroll down by viewport height
            window.scrollBy({
                top: window.innerHeight - 100,
                behavior: "smooth",
            });
        }
    };

    return (
        <div
            className={`absolute bottom-5 left-1/2 transform -translate-x-1/2 transition-all duration-700 ease-out z-20 ${
                isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-8 scale-95 pointer-events-none"
            }`}
        >
            <button
                onClick={scrollToTabSection}
                className="group cursor-pointer flex flex-col items-center p-2 hover:scale-110 transition-all duration-300 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20"
                aria-label="Scroll to explore policies and insights"
            >
                {/* Animated arrow container */}
                <div className="relative">
                    {/* Background glow effect */}
                    <div className="absolute inset-0 bg-white/10 rounded-full blur-md scale-150 group-hover:bg-white/20 transition-all duration-300"></div>

                    {/* Main arrow */}
                    <div className="relative w-6 h-6 flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-white group-hover:text-white/90 transition-colors duration-200 animate-bounce"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </button>
        </div>
    );
};

export default function Home() {
    // Enable smooth scrolling enhancements
    useSmoothScroll();

    return (
        <div className="w-full scroll-smooth">
            {/* Hero Section */}
            <div className="w-full bg-primary text-white py-20 pb-24 relative overflow-hidden scroll-snap-start">
                {/* Optional: Add subtle background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                </div>

                <div className="max-w-7xl container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        {/* Left side - Hero content */}
                        <div className="space-y-6">
                            <h1 className="text-3xl font-bold mb-2">
                                Insights on Data Protection & Digital Identity Across Africa
                            </h1>
                            <p className="text-white/90 text-lg">
                                Leverage AI to explore, compare, and understand the evolving landscape of digital
                                identity and data protection policies shaping governance across Africa.
                            </p>
                            <div className="flex gap-4 mt-8 md:flex-row flex-col">
                                <Link
                                    href="/chat"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary border-2 border-white rounded-lg hover:bg-white/90 focus-ring transition-all duration-300 font-bold text-base shadow-lg"
                                >
                                    Analyze Policies with AI
                                </Link>
                                <Link
                                    href="/resources"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white/10 focus-ring transition-all duration-300 font-semibold text-base"
                                >
                                    Explore Resources
                                </Link>
                            </div>
                        </div>
                        {/* Right side - Statistics Dashboard */}
                        <ScrollReveal className="w-full" delay={200}>
                            <HeroStatsSection />
                        </ScrollReveal>
                    </div>
                </div>

                {/* Animated Scroll Arrow */}
                <ScrollArrow />
            </div>

            {/* Tab Section with ID for scroll targeting */}
            <ScrollReveal>
                <div id="tab-section" className="scroll-snap-start">
                    <TabSection />
                </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
                <div className="scroll-snap-start">
                    <PolicyHighlightsSection />
                </div>
            </ScrollReveal>
        </div>
    );
}
