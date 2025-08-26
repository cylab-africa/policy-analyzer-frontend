"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import React, { useState } from "react";
import TimelineComponent from "./TimelineComponent";

interface TimelineEvent {
    year: number;
    content: string;
    color: string;
    type?: string;
    countries?: string[];
}

const PolicyHighlightsSection: React.FC = () => {
    const timelineEvents: TimelineEvent[] = [
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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(timelineEvents.length / itemsPerPage);
    const currentEvents = timelineEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <section className="py-16 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4">
                        <Calendar className="h-3 w-3 mr-2" />
                        Policy Timeline
                    </Badge>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">African Data Protection Milestones</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Key developments in cybersecurity and data protection across Africa
                    </p>
                </div>

                {/* Timeline Card */}
                <Card>
                    <CardHeader className="border-b bg-white">
                        <CardTitle className="flex items-center justify-between">
                            <span className="text-lg font-semibold">Implementation Timeline</span>
                            <Badge variant="outline">{timelineEvents.length} Events</Badge>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-6">
                        <TimelineComponent events={currentEvents} />
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
