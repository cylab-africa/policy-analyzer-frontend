"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Calendar, Shield } from "lucide-react";
import React, { useState } from "react";
import TimelineComponent from "./TimelineComponent";

// Define the type for timeline events
interface TimelineEvent {
    year: number;
    content: string;
    color: string;
    type: "ratification" | "adoption" | "entry-force";
    countries?: string[];
}

const PolicyHighlightsSection: React.FC = () => {
    const timelineEvents: TimelineEvent[] = [
        {
            year: 2023,
            content:
                "The Malabo Convention officially enters into force on June 8, 2023, following the deposit of the 15th instrument of ratification.",
            color: "#2563eb",
            type: "entry-force",
        },
        {
            year: 2023,
            content: "Côte d'Ivoire and Mauritania ratify the Malabo Convention.",
            color: "#059669",
            type: "ratification",
            countries: ["Côte d'Ivoire", "Mauritania"],
        },
        {
            year: 2023,
            content: "Sao Tome & Principe ratify the Malabo Convention.",
            color: "#7c3aed",
            type: "ratification",
            countries: ["Sao Tome & Principe"],
        },
        {
            year: 2022,
            content: "Niger ratifies the Malabo Convention.",
            color: "#dc2626",
            type: "ratification",
            countries: ["Niger"],
        },
        {
            year: 2021,
            content: "Togo ratifies the Malabo Convention.",
            color: "#ea580c",
            type: "ratification",
            countries: ["Togo"],
        },
        {
            year: 2020,
            content:
                "Angola, Cape Verde, Congo, and Zambia ratify the Malabo Convention, and the convention reaches 15 ratifications, bringing it close to entering into force.",
            color: "#2563eb",
            type: "ratification",
            countries: ["Angola", "Cape Verde", "Congo", "Zambia"],
        },
        {
            year: 2019,
            content: "Ghana, Mozambique, Namibia, and Rwanda ratify the Malabo Convention.",
            color: "#059669",
            type: "ratification",
            countries: ["Ghana", "Mozambique", "Namibia", "Rwanda"],
        },
        {
            year: 2018,
            content: "Mauritius and Guinea ratify the Malabo Convention.",
            color: "#7c3aed",
            type: "ratification",
            countries: ["Mauritius", "Guinea"],
        },
        {
            year: 2016,
            content: "Senegal becomes the first country to ratify the Malabo Convention.",
            color: "#dc2626",
            type: "ratification",
            countries: ["Senegal"],
        },
        {
            year: 2014,
            content:
                "The African Union adopts the Malabo Convention on Cyber Security and Personal Data Protection in Malabo, Equatorial Guinea.",
            color: "#ea580c",
            type: "adoption",
        },
    ];

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // Reduced for better mobile experience

    // Calculate total pages
    const totalPages = Math.ceil(timelineEvents.length / itemsPerPage);

    // Get events for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentEvents = timelineEvents.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <section className="py-8 sm:py-12 lg:py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-500/5 to-transparent rounded-full blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Shield className="h-4 w-4" />
                        Policy Timeline
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
                        Data Protection Policies{" "}
                        <span className="block sm:inline text-primary">Highlights in Africa</span>
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Tracking the evolution of cybersecurity and data protection frameworks across the African
                        continent
                    </p>
                </div>

                {/* Main Timeline Card */}
                <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm overflow-hidden">
                    {/* Timeline Header */}
                    <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white p-4 sm:p-6 lg:p-8">
                        <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                            <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                            Malabo Convention Timeline
                            <Badge variant="secondary" className="ml-auto bg-white/20 text-white border-white/30">
                                {currentEvents.length} of {timelineEvents.length}
                            </Badge>
                        </CardTitle>
                    </CardHeader>

                    {/* Timeline Content */}
                    <CardContent className="p-4 sm:p-6 lg:p-8">
                        <TimelineComponent events={currentEvents} />
                    </CardContent>

                    {/* Pagination */}
                    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-slate-50/50 border-t border-slate-200">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                                <Badge variant="outline" className="text-xs">
                                    {startIndex + 1}-{Math.min(endIndex, timelineEvents.length)} of{" "}
                                    {timelineEvents.length}
                                </Badge>
                                <span className="hidden sm:inline">events</span>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3">
                                <Button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    variant="outline"
                                    size="sm"
                                    className="h-8 sm:h-9 px-2 sm:px-4 border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                                    <span className="hidden sm:inline">Previous</span>
                                </Button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            variant={page === currentPage ? "default" : "ghost"}
                                            size="sm"
                                            className={`h-8 w-8 sm:h-9 sm:w-9 text-xs sm:text-sm ${
                                                page === currentPage
                                                    ? "bg-primary hover:bg-primary/90 text-white"
                                                    : "hover:bg-slate-100 text-slate-700"
                                            }`}
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </div>

                                <Button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    variant="outline"
                                    size="sm"
                                    className="h-8 sm:h-9 px-2 sm:px-4 border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 sm:ml-1" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    );
};

export default PolicyHighlightsSection;
