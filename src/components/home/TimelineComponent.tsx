"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Shield, Globe } from "lucide-react";

// Define the type for timeline events
interface TimelineEvent {
    year: number;
    content: string;
    color: string;
    type?: "ratification" | "adoption" | "entry-force";
    countries?: string[];
}

interface TimelineProps {
    events: TimelineEvent[];
}

const TimelineComponent: React.FC<TimelineProps> = ({ events }) => {
    const getEventIcon = (type?: string) => {
        switch (type) {
            case "adoption":
                return <Shield className="h-4 w-4" />;
            case "entry-force":
                return <Globe className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getEventTypeLabel = (type?: string) => {
        switch (type) {
            case "adoption":
                return "Adoption";
            case "entry-force":
                return "Entry into Force";
            case "ratification":
                return "Ratification";
            default:
                return "Event";
        }
    };

    const getEventTypeVariant = (type?: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (type) {
            case "adoption":
                return "default";
            case "entry-force":
                return "destructive";
            default:
                return "secondary";
        }
    };

    return (
        <div className="relative">
            {/* Timeline container */}
            <div className="relative pl-4 sm:pl-8 lg:pl-12">
                {/* Main timeline line */}
                <div className="absolute left-[12px] sm:left-[24px] lg:left-[36px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-slate-300 to-slate-200"></div>

                {/* Timeline events */}
                <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                    {events.map((event, index) => (
                        <div key={index} className="relative group">
                            {/* Year indicator and colored dot */}
                            <div
                                className="absolute left-[-16px] sm:left-[-28px] top-6 sm:top-7 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-4 border-white shadow-lg z-10 flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                                style={{ backgroundColor: event.color }}
                            >
                                <div className="text-white text-xs sm:text-sm">{getEventIcon(event.type)}</div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                {/* Year badge - Mobile: above content, Desktop: left side */}
                                <div className="sm:w-20 lg:w-24 flex-shrink-0">
                                    <Badge
                                        variant="outline"
                                        className="font-bold text-sm sm:text-base px-3 py-1 bg-white border-2 shadow-sm"
                                        style={{ borderColor: event.color, color: event.color }}
                                    >
                                        {event.year}
                                    </Badge>
                                </div>

                                {/* Content card */}
                                <div className="flex-1">
                                    <Card className="relative bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:shadow-xl overflow-hidden">
                                        {/* Color accent border */}
                                        <div
                                            className="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-300 group-hover:w-2"
                                            style={{ backgroundColor: event.color }}
                                        ></div>

                                        <CardContent className="p-4 sm:p-5 lg:p-6 pl-6 sm:pl-7 lg:pl-8">
                                            {/* Event type and countries badges */}
                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                <Badge
                                                    variant={getEventTypeVariant(event.type)}
                                                    className="text-xs font-medium"
                                                >
                                                    {getEventTypeLabel(event.type)}
                                                </Badge>
                                                {event.countries && event.countries.length > 0 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {event.countries.length}{" "}
                                                        {event.countries.length === 1 ? "Country" : "Countries"}
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Main content */}
                                            <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-3">
                                                {event.content}
                                            </p>

                                            {/* Countries list */}
                                            {event.countries && event.countries.length > 0 && (
                                                <div className="pt-3 border-t border-slate-100">
                                                    <div className="text-xs text-slate-500 mb-2 font-medium">
                                                        Countries:
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {event.countries.map((country, countryIndex) => (
                                                            <Badge
                                                                key={countryIndex}
                                                                variant="secondary"
                                                                className="text-xs bg-slate-100/80 text-slate-700 hover:bg-slate-200/80 transition-colors"
                                                            >
                                                                {country}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>

                                        {/* Subtle gradient overlay on hover */}
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
                                            style={{
                                                background: `linear-gradient(135deg, ${event.color}, transparent)`,
                                            }}
                                        ></div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimelineComponent;
