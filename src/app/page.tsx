"use client";

import React from "react";
import Link from "next/link";
import TabSection from "@/components/home/TabSection";
import PolicyHighlightsSection from "@/components/home/PolicyHighlightsSection";

export default function Home() {
    return (
        <div className="min-h-screen w-full">
            <div className="w-full bg-primary text-white py-20">
                <div className="max-w-7xl container mx-auto px-6">
                    <h1 className="text-4xl font-bold mb-2">
                        Data Privacy &amp; Digital ID
                        <br />
                        Laws Analyzer
                    </h1>
                    <p className="text-white/90 max-w-[700px] text-lg">
                        Analyze and compare data protection and digital identity policies across Africa. Interactive
                        tools for policymakers, implementers, and researchers.
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
            </div>

            <TabSection />
            <PolicyHighlightsSection />
        </div>
    );
}
