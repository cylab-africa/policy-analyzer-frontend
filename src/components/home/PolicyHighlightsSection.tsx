"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import React, { useState } from "react";
import TimelineComponent from "./TimelineComponent";

// Define the type for timeline events
interface TimelineEvent {
    year: number;
    content: string;
    color: string;
}

const PolicyHighlightsSection: React.FC = () => {
    const timelineEvents: TimelineEvent[] = [
        {
            year: 2023,
            content:
                "The Malabo Convention officially enters into force on June 8, 2023, following the deposit of the 15th instrument of ratification.",
            color: "#2563eb", // Blue
        },
        {
            year: 2023,
            content: "Côte d'Ivoire and Mauritania ratify the Malabo Convention.",
            color: "#059669", // Emerald
        },
        {
            year: 2023,
            content: "Sao Tome & Principe ratify the Malabo Convention.",
            color: "#7c3aed", // Violet
        },
        {
            year: 2022,
            content: "Niger ratifies the Malabo Convention.",
            color: "#dc2626", // Red
        },
        {
            year: 2021,
            content: "Togo ratifies the Malabo Convention.",
            color: "#ea580c", // Orange
        },
        {
            year: 2020,
            content:
                "Angola, Cape Verde, Congo, and Zambia ratify the Malabo Convention, and the convention reaches 15 ratifications, bringing it close to entering into force.",
            color: "#2563eb", // Blue
        },
        {
            year: 2019,
            content: "Ghana, Mozambique, Namibia, and Rwanda ratify the Malabo Convention.",
            color: "#059669", // Emerald
        },
        {
            year: 2018,
            content: "Mauritius and Guinea ratify the Malabo Convention.",
            color: "#7c3aed", // Violet
        },
        {
            year: 2016,
            content: "Senegal becomes the first country to ratify the Malabo Convention.",
            color: "#dc2626", // Red
        },
        {
            year: 2014,
            content:
                "The African Union adopts the Malabo Convention on Cyber Security and Personal Data Protection in Malabo, Equatorial Guinea.",
            color: "#ea580c", // Orange
        },
    ];

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Number of events to display per page

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
        <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                        Data Protection Policies{" "}
                        <span className="block text-primary">Highlights in Africa</span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Tracking the evolution of cybersecurity and data protection frameworks across the African
                        continent
                    </p>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    {/* Timeline Header */}
                    <div className="bg-gradient-to-r from-primary to-primary/90 px-8 py-6">
                        <div className="flex items-center gap-3 text-white">
                            <Calendar className="h-6 w-6" />
                            <h3 className="text-xl font-semibold">Malabo Convention Timeline</h3>
                        </div>
                    </div>

                    {/* Timeline Content */}
                    <div className="p-8">
                        <TimelineComponent events={currentEvents} />
                    </div>

                    {/* Pagination */}
                    <div className="px-8 py-6 bg-slate-50 border-t border-slate-200">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <span>
                                    Showing {startIndex + 1}-{Math.min(endIndex, timelineEvents.length)} of{" "}
                                    {timelineEvents.length} events
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    variant="outline"
                                    size="sm"
                                    className="cursor-pointer h-9 px-4 border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </Button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            variant={page === currentPage ? "default" : "ghost"}
                                            size="sm"
                                            className={`cursor-pointer h-9 w-9 ${
                                                page === currentPage
                                                    ? "bg-primary/80 hover:bg-primary text-white"
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
                                    className="cursor-pointer h-9 px-4 border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                    <ArrowRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{timelineEvents.length}</div>
                        <div className="text-slate-600 font-medium">Total Events</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 text-center">
                        <div className="text-3xl font-bold text-emerald-600 mb-2">15+</div>
                        <div className="text-slate-600 font-medium">Countries Ratified</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 text-center">
                        <div className="text-3xl font-bold text-violet-600 mb-2">2023</div>
                        <div className="text-slate-600 font-medium">Convention in Force</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PolicyHighlightsSection;
