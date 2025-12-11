"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Fingerprint, Shield } from "lucide-react";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import TimelineComponent from "./TimelineComponent";

interface TimelineEvent {
    year: number;
    content: string;
    color: string;
    type?: string;
    countries?: string[];
}

const PolicyHighlightsSection: React.FC = () => {
    // Data Protection Timeline Events
    const dataProtectionEvents: TimelineEvent[] = [
        {
            year: 2025,
            content: "Limited progress continues with only 16 total ratifications from 55 AU member states",
            color: "orange",
            type: "progress-update",
        },
        {
            year: 2024,
            content: "AU Summit addresses cybersecurity challenges amid slow ratification progress",
            color: "orange",
            type: "summit-milestone",
        },
        {
            year: 2023,
            content: "São Tomé & Príncipe ratifies post-entry into force",
            color: "blue",
            type: "ratification",
            countries: ["São Tomé & Príncipe"],
        },
        {
            year: 2023,
            content: "Sudan signs the Convention at AU Summit but does not ratify",
            color: "yellow",
            type: "signing",
            countries: ["Sudan"],
        },
        {
            year: 2023,
            content: "Malabo Convention enters into force on June 8th following 15th ratification",
            color: "green",
            type: "entry-force",
        },
        {
            year: 2023,
            content: "Côte d'Ivoire and Mauritania ratify the Malabo Convention",
            color: "blue",
            type: "ratification",
            countries: ["Côte d'Ivoire", "Mauritania"],
        },
        {
            year: 2022,
            content: "Cape Verde and Niger ratify the Malabo Convention",
            color: "blue",
            type: "ratification",
            countries: ["Cape Verde", "Niger"],
        },
        {
            year: 2021,
            content: "Togo and Zambia ratify the Malabo Convention",
            color: "blue",
            type: "ratification",
            countries: ["Togo", "Zambia"],
        },
        {
            year: 2020,
            content: "Three countries ratify the Malabo Convention",
            color: "blue",
            type: "ratification",
            countries: ["Angola", "Congo", "Mozambique"],
        },
        {
            year: 2019,
            content: "Major ratification milestone with three African nations",
            color: "blue",
            type: "ratification",
            countries: ["Ghana", "Namibia", "Rwanda"],
        },
        {
            year: 2018,
            content: "Mauritius and Guinea join the Convention",
            color: "blue",
            type: "ratification",
            countries: ["Mauritius", "Guinea"],
        },
        {
            year: 2016,
            content: "Senegal becomes the first country to ratify",
            color: "blue",
            type: "ratification",
            countries: ["Senegal"],
        },
        {
            year: 2014,
            content: "African Union adopts the Malabo Convention on Cyber Security and Personal Data Protection",
            color: "purple",
            type: "adoption",
        },
        {
            year: 2011,
            content: "Initial drafting of the Malabo Convention begins",
            color: "gray",
            type: "drafting",
        },
    ];

    // Digital ID Timeline Events (placeholder - you can add your data here)
    const digitalIdEvents: TimelineEvent[] = [
        {
            year: 2025,
            content:
                "Ethiopia's Fayda ID enrollments surge past 24 million as the country aims for 90 million by 2027. Registration expands to rural communities to ensure wider access, with financial incentives encouraging adoption.",
            color: "green",
            type: "enrollment-milestone",
        },
        {
            year: 2025,
            content:
                "Uganda launches a nationwide mass enrollment and renewal exercise for national ID cards, targeting 15.8 million renewals and 17.2 million new registrations for the 2024/2025 financial year.",
            color: "green",
            type: "enrollment-milestone",
        },
        {
            year: 2025,
            content:
                "Togo continues its mass biometric enrollment for the e-ID Togo project, expanding its campaign to regions such as Agoè-Nyivé as part of the World Bank-supported WURI program.",
            color: "green",
            type: "project-rollout",
        },
        {
            year: 2024,
            content:
                "Following the lifting of an injunction by the High Court in August, Kenya's Maisha Namba digital ID system proceeds with its rollout. The government also reports progress in clearing card backlogs.",
            color: "green",
            type: "project-update",
        },
        {
            year: 2024,
            content:
                "Mauritius launches the Mauritius National Identity Card (MNIC) 3.0, a mobile-first digital identity system that aligns with international standards.",
            color: "green",
            type: "project-launch",
        },
        {
            year: 2023,
            content:
                "The Malabo Convention on cybersecurity and data protection enters into force on June 8, providing a foundational legal framework for digital ID initiatives.",
            color: "green",
            type: "legal-framework",
        },
        {
            year: 2022,
            content:
                "Ethiopia begins the mass enrollment process for the Fayda ID system, initially focusing on government employees and urban areas.",
            color: "blue",
            type: "enrollment-launch",
        },
        {
            year: 2020,
            content:
                "The African Union adopts its Digital Transformation Strategy for Africa (2020-2030), highlighting digital ID as a crucial enabler for development.",
            color: "purple",
            type: "policy-adoption",
        },
        {
            year: 2018,
            content:
                "The World Bank and ECOWAS launch the West Africa Unique Identification for Regional Integration and Inclusion (WURI) program, a multi-phase project for foundational IDs.",
            color: "gray",
            type: "program-launch",
        },
        {
            year: 2016,
            content:
                "Ghana launches the Ghana Card, a national biometric ID card intended for a wide range of services.",
            color: "blue",
            type: "project-launch",
        },
        {
            year: 2015,
            content:
                "The ECOWAS National Biometric Identity Card (ENBIC), approved in 2014, is issued by Senegal as the first implementing country, facilitating regional mobility.",
            color: "blue",
            type: "regional-project-launch",
        },
    ];

    // Timeline management state
    const [activeTimeline, setActiveTimeline] = useState<"data-protection" | "digital-id">("data-protection");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Get current timeline events based on active tab
    const currentTimelineEvents = activeTimeline === "data-protection" ? dataProtectionEvents : digitalIdEvents;
    const totalPages = Math.ceil(currentTimelineEvents.length / itemsPerPage);
    const currentEvents = currentTimelineEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset page when switching timelines
    const handleTimelineSwitch = (timeline: "data-protection" | "digital-id") => {
        setActiveTimeline(timeline);
        setCurrentPage(1);
    };

    return (
        <section className="py-16 bg-slate-50">
            <div className="max-w-8xl container mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                        African {activeTimeline === "data-protection" ? "Data Protection" : "Digital Identity"}{" "}
                        Milestones
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Key developments in{" "}
                        {activeTimeline === "data-protection" ? "data protection" : "digital identity systems"} across
                        Africa
                    </p>
                </div>

                {/* Timeline Tabs */}
                <div className="flex justify-center mb-8">
                    <Tabs
                        defaultValue="data-protection"
                        value={activeTimeline}
                        onValueChange={(value) => handleTimelineSwitch(value as "data-protection" | "digital-id")}
                    >
                        <TabsList className="grid grid-cols-2 bg-slate-100 rounded-xl p-1 border-0 h-auto">
                            <TabsTrigger
                                value="data-protection"
                                className="flex items-center cursor-pointer gap-3 px-8 py-3 text-md font-bold rounded-lg transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-600 hover:text-slate-800"
                            >
                                <Shield className="w-4 h-4" />
                                Data Protection
                            </TabsTrigger>
                            <TabsTrigger
                                value="digital-id"
                                className="flex items-center cursor-pointer gap-3 px-8 py-3 text-md font-bold rounded-lg transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-600 hover:text-slate-800"
                            >
                                <Fingerprint className="w-4 h-4" />
                                Digital Identity
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Timeline Card */}
                <Card>
                    <CardHeader className="border-b bg-white">
                        <CardTitle className="flex items-center justify-between">
                            <span className="text-lg font-semibold">Implementation Timeline</span>
                            <Badge variant="outline">{currentTimelineEvents.length} Events</Badge>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-6">
                        <div key={activeTimeline} className="transition-all duration-500 ease-in-out">
                            <TimelineComponent events={currentEvents} />
                        </div>
                    </CardContent>

                    {/* Simple Pagination */}
                    {totalPages > 1 && (
                        <div className="border-t bg-slate-50/50 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </section>
    );
};

export default PolicyHighlightsSection;
