"use client";

import PolicyHighlightsSection from "@/components/home/PolicyHighlightsSection";
import TabSection from "@/components/home/TabSection";
import HeroStatsSection from "@/components/home/HeroStatsSection";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen w-full">
            <div className="w-full bg-primary text-white py-20">
                <div className="max-w-7xl container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        {/* Left side - Hero content */}
                        <div className="space-y-6">
                            <h1 className="text-4xl font-bold mb-2">
                                Africa&apos;s Data Protection &amp; Digital ID Insights
                            </h1>
                            <p className="text-white/90 text-lg">
                                An AI-driven platform to track, compare, and understand digital identity and data
                                protection policies shaping the future of governance across Africa.
                            </p>

                            <div className="flex gap-4 mt-8 md:flex-row flex-col">
                                <Link
                                    href="/chat"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary border-2 border-white rounded-lg hover:bg-white/90 hover:scale-105 transition-all duration-200 font-semibold text-base shadow-lg"
                                >
                                    <MessageSquare className="w-5 h-5 mr-2" />
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
