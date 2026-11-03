"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { dataProtectionEvents, digitalIdEvents, TIMELINE_LAST_UPDATED } from "@/data/timelineEvents";
import { Tabs } from "../ui/tabs";
import FolderTabs from "./FolderTabs";
import TimelineComponent from "./TimelineComponent";

const TIMELINE_TABS = [
    { value: "data-protection", label: "Data Protection" },
    { value: "digital-id", label: "Digital Identity" },
];

const PolicyHighlightsSection: React.FC = () => {
    // Timeline management state
    const [activeTimeline, setActiveTimeline] = useState<"data-protection" | "digital-id">("data-protection");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Get current timeline events based on active tab
    const currentTimelineEvents = activeTimeline === "data-protection" ? dataProtectionEvents : digitalIdEvents;
    const totalPages = Math.ceil(currentTimelineEvents.length / itemsPerPage);
    const offset = (currentPage - 1) * itemsPerPage;
    const currentEvents = currentTimelineEvents.slice(offset, offset + itemsPerPage);

    // Reset page when switching timelines
    const handleTimelineSwitch = (timeline: "data-protection" | "digital-id") => {
        setActiveTimeline(timeline);
        setCurrentPage(1);
    };

    const firstShown = offset + 1;
    const lastShown = Math.min(offset + itemsPerPage, currentTimelineEvents.length);

    const heading =
        activeTimeline === "data-protection"
            ? {
                  title: "African Data Protection Milestones",
                  blurb: "Laws enacted, conventions signed or ratified, and policy steps, newest first.",
              }
            : {
                  title: "African Digital Identity Milestones",
                  blurb: "National ID systems launched, rolled out or updated, newest first.",
              };

    return (
        <section className="bg-slate-50 py-20">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6">
                {/* Header */}
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{heading.title}</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-slate-600">{heading.blurb}</p>
                    <p className="mt-3 text-sm text-slate-500">Last updated {TIMELINE_LAST_UPDATED}</p>
                </div>

                <Tabs
                    value={activeTimeline}
                    onValueChange={(value) => handleTimelineSwitch(value as "data-protection" | "digital-id")}
                    className="w-full gap-0"
                >
                    <FolderTabs tabs={TIMELINE_TABS} />

                    {/* The timeline panel, attached to the tabs */}
                    <div className="rounded-2xl rounded-tl-none border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 max-sm:rounded-tr-none sm:p-8">
                        <div key={`${activeTimeline}-${currentPage}`}>
                            <TimelineComponent
                                events={currentEvents}
                                previousYear={offset > 0 ? currentTimelineEvents[offset - 1].year : undefined}
                            />
                        </div>

                        {totalPages > 1 && (
                            <nav
                                aria-label="Timeline pages"
                                className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row"
                            >
                                <span className="text-sm text-slate-500">
                                    Showing {firstShown}–{lastShown} of {currentTimelineEvents.length} milestones
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <Button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        aria-label="Previous page"
                                        variant="outline"
                                        size="sm"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            aria-label={`Page ${page}`}
                                            aria-current={page === currentPage ? "page" : undefined}
                                            variant={page === currentPage ? "default" : "ghost"}
                                            size="sm"
                                            className="min-w-8 tabular-nums"
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                    <Button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        aria-label="Next page"
                                        variant="outline"
                                        size="sm"
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </nav>
                        )}
                    </div>
                </Tabs>
            </div>
        </section>
    );
};

export default PolicyHighlightsSection;
