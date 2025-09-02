"use client";

import HeroStatsSection from "@/components/home/HeroStatsSection";
import PolicyHighlightsSection from "@/components/home/PolicyHighlightsSection";
import TabSection from "@/components/home/TabSection";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen w-full">
            <div className="w-full bg-primary text-white py-20">
                <div className="max-w-7xl container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        {/* Left side - Hero content */}
                        <div className="space-y-6">
                            <h1 className="text-4xl font-bold mb-2">
                                Insights on Data Protection & Digital Identity Across Africa
                            </h1>
                            <p className="text-white/90 text-lg">
                                Leverage AI to explore, compare, and understand the evolving landscape of digital
                                identity and data protection policies shaping governance across Africa.
                            </p>

                            <div className="flex gap-4 mt-8 md:flex-row flex-col">
                                <Link
                                    href="/chat"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary border-2 border-white rounded-lg hover:bg-white/90 hover:scale-105 transition-all duration-200 font-bold text-base shadow-lg"
                                >
                                    Analyze Policies with AI
                                </Link>
                                <Link
                                    href="/resources"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white/10 hover:scale-105 transition-all duration-200 font-semibold text-base"
                                >
                                    Explore Resources
                                </Link>
                            </div>
                        </div>

                        {/* Right side - Statistics Dashboard */}
                        <div className="w-full">
                            <HeroStatsSection />
                        </div>
                    </div>
                </div>
            </div>

            <TabSection />
            <PolicyHighlightsSection />
        </div>
    );
}
