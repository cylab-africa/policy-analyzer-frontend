"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePostHog } from "posthog-js/react";
import { ChevronLeft, Fingerprint, History, Menu, Shield } from "lucide-react";
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
    const posthog = usePostHog();

    const handleTabSwitch = (tab: ChatTab) => {
        posthog?.capture("chat_tab_switched", {
            from_tab: activeTab,
            to_tab: tab,
            timestamp: new Date().toISOString(),
        });
        handleTabChange(tab);
    };

    const handleHistoryToggle = () => {
        posthog?.capture("chat_history_toggled", {
            action: showChatHistory ? "hide" : "show",
            timestamp: new Date().toISOString(),
        });
        setShowChatHistory(!showChatHistory);
    };

    return (
        <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-200 p-2 sm:p-3 lg:p-4 shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Mobile menu button */}
                <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden h-9 w-9 p-0 shrink-0"
                    onClick={handleHistoryToggle}
                >
                    {showChatHistory ? <ChevronLeft size={16} /> : <Menu size={16} />}
                    <span className="sr-only">Toggle menu</span>
                </Button>

                {/* Tab Selector - Select on small mobile, Tabs on larger screens */}
                <div className="flex-1 min-w-0">
                    {/* Mobile Select (< 480px) */}
                    <div className="block min-[480px]:hidden">
                        <Select value={activeTab} onValueChange={(value) => handleTabSwitch(value as ChatTab)}>
                            <SelectTrigger className="h-9 w-full border-gray-200">
                                <SelectValue>
                                    <div className="flex items-center gap-2">
                                        {activeTab === ChatTab.DATA_PROTECTION ? (
                                            <>
                                                <Shield className="h-3.5 w-3.5" />
                                                <span className="text-xs">Data Protection</span>
                                            </>
                                        ) : (
                                            <>
                                                <Fingerprint className="h-3.5 w-3.5" />
                                                <span className="text-xs">Digital ID</span>
                                            </>
                                        )}
                                    </div>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ChatTab.DATA_PROTECTION}>
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        <span>Data Protection</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value={ChatTab.DIGITAL_ID}>
                                    <div className="flex items-center gap-2">
                                        <Fingerprint className="h-4 w-4" />
                                        <span>Digital ID</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tabs (>= 480px) */}
                    <div className="hidden min-[480px]:block">
                        <Tabs
                            value={activeTab}
                            className="w-full"
                            onValueChange={(value) => handleTabSwitch(value as ChatTab)}
                        >
                            <TabsList className="grid w-full max-w-md grid-cols-2 h-9">
                                <TabsTrigger
                                    className="cursor-pointer text-xs sm:text-sm px-2 gap-1"
                                    value={ChatTab.DATA_PROTECTION}
                                >
                                    <Shield className="h-3.5 w-3.5 shrink-0" />
                                    <span className="hidden sm:inline">Data Protection</span>
                                    <span className="sm:hidden">Data</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    className="cursor-pointer text-xs sm:text-sm px-2 gap-1"
                                    value={ChatTab.DIGITAL_ID}
                                >
                                    <Fingerprint className="h-3.5 w-3.5 shrink-0" />
                                    <span className="hidden sm:inline">Digital ID</span>
                                    <span className="sm:hidden">ID</span>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                {/* Desktop history toggle */}
                {!isMobile && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="hidden lg:flex items-center gap-1.5 h-9 shrink-0"
                        onClick={handleHistoryToggle}
                    >
                        <History size={14} />
                        <span className="hidden lg:inline">{showChatHistory ? "Hide History" : "Show History"}</span>
                    </Button>
                )}
            </div>
        </div>
    );
}
