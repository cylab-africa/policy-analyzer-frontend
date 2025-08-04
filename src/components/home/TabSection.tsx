/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataProtectionMap from "./DataProtectionMap";
import DigitalIDMap from "./DigitalIDMap";

// Main TabSection Component - Simplified since stats are now in map components
const TabSection = () => {
    return (
        <section className="py-4 sm:py-6 lg:py-12">
            <div className="max-w-7xl mx-auto sm:px-4 lg:px-6">
                <Tabs defaultValue="digital-id" className="w-full">
                    <TabsList className="grid grid-cols-2 mb-6 sm:mb-8 h-auto border p-0 bg-muted/50 rounded-lg">
                        <TabsTrigger
                            value="digital-id"
                            className="flex items-center justify-center gap-2 text-sm py-3 sm:py-3 px-4 font-medium rounded-md transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                        >
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                            Digital ID
                        </TabsTrigger>
                        <TabsTrigger
                            value="data-protection"
                            className="flex items-center justify-center gap-2 text-sm py-3 sm:py-3 px-4 font-medium rounded-md transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                        >
                            <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full"></div>
                            Data Protection
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="digital-id" className="space-y-6">
                        <Card className="border-0 shadow-none bg-gradient-to-r pt-0 from-background via-background to-muted/10">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl lg:text-3xl font-bold">
                                    Digital ID Implementation Across Africa
                                </CardTitle>
                                <p className="text-muted-foreground text-sm sm:text-base mt-2 lg:max-w-4/5">
                                    Explore the status of digital identity systems implementation across African
                                    countries. Click on countries for detailed information about their digital ID
                                    programs.
                                </p>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6">
                                <DigitalIDMap />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="data-protection" className="space-y-6">
                        <Card className="border-0 pt-0 shadow-none bg-gradient-to-r from-background via-background to-muted/10">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl lg:text-3xl font-bold">
                                    Data Protection Legislation Across Africa
                                </CardTitle>
                                <p className="text-muted-foreground text-sm sm:text-base lg:max-w-4/5 mt-2">
                                    Discover the landscape of data protection laws and privacy regulations across
                                    African nations. Interactive map showing implementation status and legislative
                                    progress.
                                </p>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6">
                                <DataProtectionMap />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
};

export default TabSection;
