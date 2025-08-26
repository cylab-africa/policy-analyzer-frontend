"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";

interface TimelineEvent {
    year: number;
    content: string;
    countries?: string[];
}

interface TimelineProps {
    events: TimelineEvent[];
}

const TimelineComponent: React.FC<TimelineProps> = ({ events }) => {
    return (
        <div className="relative max-w-4xl mx-auto">
            {/* Enhanced Timeline line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 opacity-30"></div>

            <div className="space-y-6">
                {events.map((event, index) => (
                    <div
                        key={index}
                        className="relative flex items-start gap-6 group"
                        style={{
                            animationDelay: `${index * 150}ms`,
                            animation: "fadeInUp 0.6s ease-out forwards",
                        }}
                    >
                        {/* Enhanced Year Badge */}
                        <div className="relative z-10 flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-110">
                                <span className="text-white font-bold text-sm">{event.year}</span>
                            </div>
                        </div>

                        {/* Enhanced Content Card */}
                        <div className="flex-1 min-w-0">
                            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:border-blue-200 group-hover:-translate-y-1">
                                {/* Year indicator for mobile */}
                                <div className="flex items-center gap-2 mb-3 md:hidden">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-semibold text-primary/80">{event.year}</span>
                                </div>

                                {/* Main content */}
                                <p className="text-slate-700 leading-relaxed font-medium mb-4 text-sm lg:text-base">
                                    {event.content}
                                </p>

                                {/* Countries section */}
                                {event.countries && event.countries.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                                Countries ({event.countries.length})
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {event.countries.map((country, i) => (
                                                <Badge
                                                    key={i}
                                                    variant="secondary"
                                                    className="bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 border-0 px-3 py-1 text-xs font-medium transition-colors duration-200 hover:scale-105"
                                                >
                                                    {country}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Subtle bottom accent */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimelineComponent;
