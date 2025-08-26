"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileKey, Shield } from "lucide-react";
import DataProtectionMap from "./DataProtectionMap";
import DigitalIDMap from "./DigitalIDMap";

const TabSection = () => {
    return (
        <section className="py-8 lg:py-16 bg-gradient-to-b from-slate-50/50 to-white">
            <div className="max-w-7xl mx-auto px-4 lg:px-6">
                <div className="text-center mb-8 lg:mb-12">
                    <Badge variant="outline" className="mb-4 bg-blue-50 text-blue-700 border-blue-200">
                        Interactive Maps
                    </Badge>
                    <h2 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-4">
                        African Digital Governance Landscape
                    </h2>
                    <p className="text-slate-600 max-w-3xl mx-auto text-sm lg:text-base">
                        Explore comprehensive data on digital identity systems and data protection legislation across
                        Africa
                    </p>
                </div>

                <Tabs defaultValue="digital-id" className="w-full">
                    <TabsList className="grid grid-cols-2 mb-8 h-auto border border-gray-300 p-0 bg-white rounded-xl max-w-md mx-auto">
                        <TabsTrigger
                            value="digital-id"
                            className="flex p-0 items-center justify-center gap-3 text-sm py-4 px-6 font-semibold rounded-lg transition-all duration-300 data-[state=active]:bg-blue-400 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-blue-50"
                        >
                            <FileKey className="w-4 h-4" />
                            Digital ID
                        </TabsTrigger>
                        <TabsTrigger
                            value="data-protection"
                            className="flex p-0 items-center justify-center gap-3 text-sm py-4 px-6 font-semibold rounded-lg transition-all duration-300 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-emerald-50"
                        >
                            <Shield className="w-4 h-4" />
                            Data Protection
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="digital-id" className="space-y-6">
                        <div className="bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm">
                            <div className="pb-6 border-b border-slate-100">
                                <div className="flex items-center gap-3 text-xl lg:text-2xl font-bold text-slate-900">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <FileKey className="w-5 h-5 text-blue-400" />
                                    </div>
                                    Digital ID Implementation Status
                                </div>
                                <p className="text-slate-600 text-sm lg:text-base mt-2 leading-relaxed">
                                    Comprehensive overview of digital identity systems deployment across African
                                    nations. Hover over countries to explore implementation details and progress.
                                </p>
                            </div>
                            <DigitalIDMap />
                        </div>
                    </TabsContent>

                    <TabsContent value="data-protection" className="space-y-6">
                        <div className="bg-gradient-to-br from-white to-emerald-50/30 backdrop-blur-sm">
                            <div className="pb-6 border-b border-slate-100">
                                <div className="flex items-center gap-3 text-xl lg:text-2xl font-bold text-slate-900">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    Data Protection Legislation Status
                                </div>
                                <p className="text-slate-600 text-sm lg:text-base mt-2 leading-relaxed">
                                    Interactive visualization of data protection laws and privacy regulations across
                                    Africa. Discover legislative progress and Malabo Convention adoption.
                                </p>
                            </div>
                            <DataProtectionMap />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
};

export default TabSection;
