"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { Resource, ResourceType } from ".";
import { getYearBadge } from "./utils";

function ResourceCard({ resource }: { resource: Resource }) {
    const yearBadge = getYearBadge(resource.type, resource.yearLaunched ?? resource.year);

    const handleLinkClick = (url: string) => {
        if (url && url !== "#") {
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <Card
            className={cn(
                "border border-gray-200 overflow-hidden p-0 h-full transition-all hover:-translate-y-1 hover:shadow-lg relative group border-t-4",
            )}
        >
            <div className="p-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                            {resource.flagEmoji}
                        </div>
                        <span className="font-medium text-gray-700">{resource.countryName}</span>
                    </div>
                    {yearBadge && (
                        <span
                            className="text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded whitespace-nowrap"
                            title={yearBadge.title}
                        >
                            {yearBadge.text}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-start gap-2">
                    {/* <span className="text-primary mt-1">{resource.icon}</span> */}
                    <span>{resource.title}</span>
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3" title={resource.description}>
                    {resource.description}
                </p>

                {resource.systemSummary && (
                    <p className="text-xs text-gray-600 mb-3 line-clamp-3" title={resource.systemSummary}>
                        <span className="font-medium">About the system:</span> {resource.systemSummary}
                    </p>
                )}

                {/* Additional info for Digital ID */}
                {resource.type === ResourceType.DIGITAL_ID && (
                    <div className="mb-4 space-y-2">
                        {resource.coverage && (
                            <div className="text-xs text-gray-600">
                                <span className="font-medium">Coverage:</span> {resource.coverage}
                            </div>
                        )}

                        {/* {resource?.features && resource?.features?.length > 0 && (
                            <div className="text-xs text-gray-600">
                                <span className="font-medium">Features:</span>
                                <span className="flex flex-wrap gap-1 mt-1">
                                    {resource.features.slice(0, 3).map((feature, index) => (
                                        <span
                                            key={`${resource.id}-feature-${index}`}
                                            className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                    {resource.features.length > 3 && (
                                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                            +{resource.features.length - 3}
                                        </span>
                                    )}
                                </span>
                            </div>
                        )} */}
                    </div>
                )}

                {/* Additional info for Data Protection */}
                {resource.type === ResourceType.DATA_PROTECTION && (
                    <div className="mb-4 space-y-2">
                        {resource.malaboStatus && (
                            <div className="text-xs text-gray-600">
                                <span className="font-medium">Malabo Convention:</span>
                                <span
                                    className={cn(
                                        "px-1.5 py-0.5 rounded text-xs ml-1",
                                        resource.malaboStatus === "Ratified"
                                            ? "bg-green-100 text-green-700"
                                            : resource.malaboStatus === "Signed"
                                              ? "bg-yellow-100 text-yellow-700"
                                              : "bg-gray-100 text-gray-700",
                                    )}
                                >
                                    {resource.malaboStatus}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-auto">
                    {resource.documentUrl && resource.documentUrl !== "#" && (
                        <Button
                            variant="outline"
                            className="flex-1 flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white"
                            onClick={() => handleLinkClick(resource.documentUrl!)}
                        >
                            View Resource
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                    )}
                    {resource.websiteUrl && resource.websiteUrl !== "#" && (
                        <Button
                            variant="outline"
                            className="flex-1 flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white"
                            onClick={() => handleLinkClick(resource.websiteUrl!)}
                        >
                            Visit Website
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                    )}
                    {(!resource.documentUrl || resource.documentUrl === "#") &&
                        (!resource.websiteUrl || resource.websiteUrl === "#") && (
                            <Button variant="outline" className="flex-1" disabled>
                                <span className="text-primary">No Document Available</span>
                            </Button>
                        )}
                </div>
            </div>
        </Card>
    );
}

export default ResourceCard;
