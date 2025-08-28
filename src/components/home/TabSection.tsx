"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileKey, Shield } from "lucide-react";
import DataProtectionMap from "./DataProtectionMap";
import DigitalIDMap from "./DigitalIDMap";

const TabSection = () => {
    return (
        <section className="py-12 lg:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <Badge
                        variant="outline"
                        className="mb-6 bg-slate-50 text-slate-700 border-slate-200 font-medium px-4 py-1.5"
                    >
                        Interactive Analysis
                    </Badge>
                    <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                        Digital Governance in Africa
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        Comprehensive analysis of digital identity systems and data protection legislation across
                        African nations
                    </p>
                </div>

                <Tabs defaultValue="digital-id" className="w-full">
                    {/* Tab Navigation */}
                    <div className="flex justify-center mb-4">
                        <TabsList className="grid grid-cols-2 bg-slate-100 rounded-xl p-1 border-0 h-auto">
                            <TabsTrigger
                                value="digital-id"
                                className="flex items-center gap-3 px-8 py-3 text-md font-bold rounded-lg transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-600 hover:text-slate-800"
                            >
                                <FileKey className="w-4 h-4" />
                                Digital Identity
                            </TabsTrigger>
                            <TabsTrigger
                                value="data-protection"
                                className="flex items-center gap-3 px-8 py-3 text-md font-bold rounded-lg transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-600 hover:text-slate-800"
                            >
                                <Shield className="w-4 h-4" />
                                Data Protection
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Digital ID Tab Content */}
                    <TabsContent value="digital-id" className="focus:outline-none">
                        <div className="bg-white rounded-2xl overflow-hidden">
                            <div className="py-6 border-b border-slate-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                        <FileKey className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                            Digital Identity Implementation
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            Track the deployment and progress of digital identity systems across Africa.
                                            Hover over countries to explore implementation status, coverage data, and
                                            key features.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <DigitalIDMap />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Data Protection Tab Content */}
                    <TabsContent value="data-protection" className="focus:outline-none">
                        <div className="bg-white rounded-2xl overflow-hidden">
                            <div className="py-6 border-b border-slate-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                        <Shield className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                            Data Protection Legislation
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            Monitor privacy laws and data protection regulations across African
                                            countries. Explore legislative status, enactment dates, and Malabo
                                            Convention adoption.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <DataProtectionMap />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
};

export default TabSection;
