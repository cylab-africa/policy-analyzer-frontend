"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ChevronLeft, Menu } from "lucide-react";
import { ChatTab } from ".";

export function ChatHeader({
    activeTab,
    handleTabChange,
    showChatHistory,
    setShowChatHistory,
}: {
    readonly activeTab: ChatTab;
    readonly handleTabChange: (tab: ChatTab) => void;
    readonly showChatHistory: boolean;
    readonly setShowChatHistory: (show: boolean) => void;
}) {
    return (
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 p-3 lg:px-6 lg:py-3 flex items-center justify-between shrink-0 z-10">
            <div className="flex items-center gap-3">
                {/* Sidebar Toggle */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    onClick={() => setShowChatHistory(!showChatHistory)}
                    title={showChatHistory ? "Close Sidebar" : "Open Sidebar"}
                >
                    {showChatHistory ? <ChevronLeft size={18} /> : <Menu size={18} />}
                </Button>

                {/* Context Switcher (Tabs) */}
                <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as ChatTab)}>
                    <TabsList className="bg-gradient-to-r from-slate-50 to-slate-100/90 p-1 h-10 border border-slate-200 rounded-lg shadow-none">
                        <TabsTrigger
                            className="text-xs cursor-pointer font-semibold px-5 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-md data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-900 data-[state=inactive]:hover:bg-slate-50/50 transition-all duration-200"
                            value={ChatTab.DATA_PROTECTION}
                        >
                            Data Protection
                        </TabsTrigger>
                        <TabsTrigger
                            className="text-xs cursor-pointer font-semibold px-5 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-md data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-900 data-[state=inactive]:hover:bg-slate-50/50 transition-all duration-200"
                            value={ChatTab.DIGITAL_ID}
                        >
                            Digital ID
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Right Actions (Minimal) */}
            
        </div>
    );
}
