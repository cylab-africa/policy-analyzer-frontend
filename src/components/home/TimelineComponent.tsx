"use client";

import React from "react";

// Define the type for timeline events
interface TimelineEvent {
    year: number;
    content: string;
    color: string;
}

interface TimelineProps {
    events: TimelineEvent[];
}

const TimelineComponent: React.FC<TimelineProps> = ({ events }) => {
    return (
        <div className="relative pl-8">
            {/* Main timeline line */}
            <div className="absolute left-[20px] top-0 bottom-0 w-[2px] bg-gray-200"></div>

            {/* Timeline events */}
            <div className="space-y-8">
                {events.map((event, index) => (
                    <div key={index} className="relative">
                        {/* Year indicator and colored dot */}
                        <div
                            className="absolute left-[-20px] top-0 w-5 h-5 rounded-full z-10"
                            style={{ backgroundColor: event.color }}
                        ></div>

                        <div className="flex items-start">
                            {/* Year */}
                            <div className="text-gray-700 font-bold mr-4 w-14 pt-0 mt-[-2px]">{event.year}</div>

                            {/* Content box */}
                            <div
                                className="flex-1 p-4 rounded-lg shadow-sm bg-white relative ml-2"
                                style={{ borderLeft: `4px solid ${event.color}` }}
                            >
                                {/* Arrow pointing to the timeline */}
                                <div
                                    className="absolute left-[-8px] top-3 w-4 h-4 bg-white rotate-45 border-l border-b"
                                    style={{ borderColor: "rgba(229, 231, 235, 1)" }}
                                ></div>
                                <p className="text-gray-700 m-0 relative z-10">{event.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimelineComponent;
