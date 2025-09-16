"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Fingerprint, Shield } from "lucide-react";
import DataProtectionMap from "./DataProtectionMap";
import DigitalIDMap from "./DigitalIDMap";

const TabSection = () => {
    return (
        <section className="py-12 lg:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                        Digital Governance Framework Analysis
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        An interactive overview of digital identity frameworks and data protection laws across African
                        countries.
                    </p>
                </div>

                <Tabs defaultValue="data-protection" className="w-full">
                    {/* Tab Navigation */}
                    <div className="flex justify-center mb-4">
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
                    </div>

                    {/* Data Protection Tab Content */}
                    <TabsContent value="data-protection" className="focus:outline-none">
                        <div className="bg-white overflow-hidden">
                            <div className="px-6 py-8 border-b border-slate-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-emerald-200/50">
                                        <Shield className="w-7 h-7 text-emerald-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                                            Data Protection Legislation
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed text-base">
                                            Explore legislative status, enactment dates, and Malabo Convention adoption.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <DataProtectionMap />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Digital ID Tab Content */}
                    <TabsContent value="digital-id" className="focus:outline-none">
                        <div className="bg-white overflow-hidden">
                            <div className="px-6 py-8 border-b border-slate-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-200/50">
                                        <Fingerprint className="w-7 h-7 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                                            Digital Identity Implementation
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed text-base">
                                            Track the deployment and progress of digital identity systems across Africa.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <DigitalIDMap />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
};

export default TabSection;
