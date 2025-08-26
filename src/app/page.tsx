"use client";

import PolicyHighlightsSection from "@/components/home/PolicyHighlightsSection";
import TabSection from "@/components/home/TabSection";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen w-full">
            <div className="w-full bg-primary text-white py-20">
                <div className="max-w-7xl container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left side - Hero content */}
                        <div className="space-y-6">
                            <h1 className="text-4xl font-bold mb-2">
                                AI-Powered Data Protection
                                <br />
                                &amp; Digital ID Analyzer
                            </h1>
                            <p className="text-white/90 text-lg">
                                Analyze and compare data protection and digital identity policies across Africa.
                                Interactive tools for policymakers, implementers, and researchers.
                            </p>
                            <div className="flex gap-5 mt-8 md:flex-row flex-col">
                                <Link
                                    href="/chat"
                                    className="inline-flex px-5 py-3 bg-primary border border-white rounded-md text-white hover:bg-primary/90 transition-colors font-medium text-base"
                                >
                                    Interact with chatbot
                                </Link>
                            </div>
                        </div>

                        {/* Right side - Interactive Africa Map */}
                        {/* <div className="lg:block hidden">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <DataProtectionMap />
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            <TabSection />
            <PolicyHighlightsSection />
        </div>
    );
}
