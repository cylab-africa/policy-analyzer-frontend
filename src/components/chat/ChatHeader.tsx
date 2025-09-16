"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ChevronLeft, History, Menu } from "lucide-react";
import { ChatTab } from ".";

export function ChatHeader({
    activeTab,
    handleTabChange,
    showChatHistory,
    setShowChatHistory,
    isMobile,
}: {
    activeTab: ChatTab;
    handleTabChange: (tab: ChatTab) => void;
    showChatHistory: boolean;
    setShowChatHistory: (show: boolean) => void;
    isMobile: boolean;
}) {
    return (
        <div className="bg-white border-b border-gray-200 p-3 lg:p-4 flex items-center gap-3 shrink-0">
            {/* Mobile menu button */}
            <Button
                variant="outline"
                size="sm"
                className="lg:hidden flex items-center gap-1"
                onClick={() => setShowChatHistory(!showChatHistory)}
            >
                {showChatHistory ? <ChevronLeft size={16} /> : <Menu size={16} />}
                <span className="sr-only">Toggle menu</span>
            </Button>

            {/* Tabs */}
            <Tabs value={activeTab} className="flex-1" onValueChange={(value) => handleTabChange(value as ChatTab)}>
                <TabsList className="grid w-full max-w-md grid-cols-2 h-9">
                    <TabsTrigger className="cursor-pointer text-xs sm:text-sm px-2" value={ChatTab.DATA_PROTECTION}>
                        <span className="hidden sm:inline">Data Protection</span>
                        <span className="sm:hidden">Data</span>
                    </TabsTrigger>
                    <TabsTrigger className="cursor-pointer text-xs sm:text-sm px-2" value={ChatTab.DIGITAL_ID}>
                        <span className="hidden sm:inline">Digital ID</span>
                        <span className="sm:hidden">ID</span>
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Desktop history toggle */}
            {!isMobile && (
                <Button
                    variant="outline"
                    size="sm"
                    className="hidden lg:flex items-center gap-1"
                    onClick={() => setShowChatHistory(!showChatHistory)}
                >
                    <History size={14} />
                    {showChatHistory ? "Hide History" : "Show History"}
                </Button>
            )}
        </div>
    );
}
