"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PanelLeftOpen } from "lucide-react";
import { ChatTab } from ".";

const TRIGGER_CLASS =
    "cursor-pointer px-4 text-sm font-medium text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm";

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
        <div className="z-10 flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
            {!showChatHistory && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-slate-600"
                    onClick={() => setShowChatHistory(true)}
                    aria-label="Show history"
                    title="Show history"
                >
                    <PanelLeftOpen size={18} />
                </Button>
            )}

            <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as ChatTab)}>
                <TabsList className="bg-slate-100">
                    <TabsTrigger className={TRIGGER_CLASS} value={ChatTab.DATA_PROTECTION}>
                        Data Protection
                    </TabsTrigger>
                    <TabsTrigger className={TRIGGER_CLASS} value={ChatTab.DIGITAL_ID}>
                        Digital ID
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
}
