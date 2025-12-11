"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { Conversation } from "@/types/chat";
import { Database, FileSpreadsheet, History, LayoutGrid, Plus, Trash2, X } from "lucide-react";

interface ChatHistorySidebarProps {
    readonly showChatHistory: boolean;
    readonly setShowChatHistory: (show: boolean) => void;
    readonly conversations: Conversation[];
    readonly activeConversationId: string | null;
    readonly onSelectConversation: (id: string) => void;
    readonly onDeleteConversation: (id: string) => void;
    readonly clearAllHistory: () => void;
    readonly isMobile: boolean;
    readonly onNewChat: () => void;
    readonly onOpenBatch?: () => void;
    readonly onOpenDocuments?: () => void;
    readonly activeTab: string;
}

// Helper to group conversations by relative date
function groupConversationsByDate(conversations: Conversation[]): Record<string, Conversation[]> {
    const groups: Record<string, Conversation[]> = {};
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    for (const conv of conversations) {
        const convDate = new Date(conv.updatedAt);
        const convDay = new Date(convDate.getFullYear(), convDate.getMonth(), convDate.getDate());

        let label: string;
        if (convDay.getTime() === today.getTime()) {
            label = "Today";
        } else if (convDay.getTime() === yesterday.getTime()) {
            label = "Yesterday";
        } else if (convDay >= lastWeek) {
            label = "Previous 7 Days";
        } else if (convDay >= lastMonth) {
            label = "Previous 30 Days";
        } else {
            label = convDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });
        }

        if (!groups[label]) {
            groups[label] = [];
        }
        groups[label].push(conv);
    }

    return groups;
}

export function ChatHistorySidebar({
    showChatHistory,
    setShowChatHistory,
    conversations,
    activeConversationId,
    onSelectConversation,
    onDeleteConversation,
    clearAllHistory,
    isMobile,
    onNewChat,
    onOpenBatch,
    onOpenDocuments,
    activeTab,
}: ChatHistorySidebarProps) {
    // Filter conversations by active tab and sort by most recent
    const filteredConversations = conversations
        .filter((conv) => conv.tab === activeTab)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const groupedConversations = groupConversationsByDate(filteredConversations);
    const groupOrder = ["Today", "Yesterday", "Previous 7 Days", "Previous 30 Days"];

    // Sort groups: known groups first in order, then remaining by date
    const sortedGroups = Object.entries(groupedConversations).sort(([a], [b]) => {
        const aIndex = groupOrder.indexOf(a);
        const bIndex = groupOrder.indexOf(b);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return 0;
    });

    return (
        <>
            {/* Mobile overlay */}
            {isMobile && showChatHistory && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setShowChatHistory(false)}
                    onKeyDown={(e) => e.key === "Escape" && setShowChatHistory(false)}
                    role="button"
                    tabIndex={0}
                    aria-label="Close sidebar"
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "bg-slate-50/50 border-r border-gray-200 flex flex-col transition-all duration-300 backdrop-blur-xl",
                    isMobile ? "fixed left-0 top-0 bottom-0 w-80 transform z-50" : "w-72",
                    showChatHistory ? "translate-x-0" : isMobile ? "-translate-x-full" : "hidden"
                )}
            >
                {/* Header & New Chat */}
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-700 font-semibold">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                <LayoutGrid size={18} />
                            </div>
                            <span>Workspace</span>
                        </div>
                        {isMobile && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => setShowChatHistory(false)}
                            >
                                <X size={16} />
                            </Button>
                        )}
                    </div>

                    <Button
                        className="w-full justify-start gap-2 bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 hover:text-primary hover:border-primary/30 shadow-sm transition-all"
                        variant="outline"
                        onClick={onNewChat}
                    >
                        <Plus size={16} />
                        <span>New Chat</span>
                    </Button>
                </div>

                {/* Tools Section */}
                <div className="px-3 py-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Tools</div>
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-slate-600 hover:text-primary hover:bg-primary/5 h-9 font-medium"
                            onClick={onOpenDocuments}
                        >
                            <Database size={16} />
                            Knowledge Base
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-slate-600 hover:text-primary hover:bg-primary/5 h-9 font-medium"
                            onClick={onOpenBatch}
                        >
                            <FileSpreadsheet size={16} />
                            Batch Analysis
                        </Button>
                    </div>
                </div>

                {/* History Section */}
                <div className="flex-1 flex flex-col min-h-0 mt-2">
                    <div className="flex items-center justify-between px-6 mb-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">History</div>
                        {filteredConversations.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-[10px] text-slate-400 hover:text-red-500 px-2"
                                onClick={clearAllHistory}
                            >
                                Clear All
                            </Button>
                        )}
                    </div>

                    <ScrollArea className="flex-1 px-3">
                        {sortedGroups.length > 0 ? (
                            sortedGroups.map(([dateLabel, convs]) => (
                                <div key={dateLabel} className="mb-4">
                                    <div className="px-3 py-2 text-[10px] font-medium text-slate-400 sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10">
                                        {dateLabel}
                                    </div>
                                    <div className="space-y-0.5">
                                        {convs.map((conversation) => (
                                            <div
                                                key={conversation.id}
                                                className={cn(
                                                    "group px-3 py-1.5 rounded-lg cursor-pointer transition-all border",
                                                    activeConversationId === conversation.id
                                                        ? "bg-primary/5 border-primary/10"
                                                        : "hover:bg-white border-transparent"
                                                )}
                                                onClick={() => {
                                                    onSelectConversation(conversation.id);
                                                    if (isMobile) {
                                                        setShowChatHistory(false);
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        onSelectConversation(conversation.id);
                                                        if (isMobile) {
                                                            setShowChatHistory(false);
                                                        }
                                                    }
                                                }}
                                                role="button"
                                                tabIndex={0}
                                            >
                                                <div className="flex items-start gap-2">
                                                    <div className="flex-1l min-w-0 pr-2">
                                                        <div
                                                            className={cn(
                                                                "text-xs font-medium line-clamp-2 transition-colors overflow-hidden break-words",
                                                                activeConversationId === conversation.id
                                                                    ? "text-primary"
                                                                    : "text-slate-700 group-hover:text-primary"
                                                            )}
                                                        >
                                                            {conversation.title}
                                                        </div>
                                                        {/* <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                                            <Clock size={10} />
                                                            {conversation.messages.length} message
                                                            {conversation.messages.length !== 1 ? "s" : ""}
                                                        </div> */}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50 shrink-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDeleteConversation(conversation.id);
                                                        }}
                                                    >
                                                        <Trash2 size={12} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-32 text-slate-400 gap-2">
                                <History size={24} className="opacity-20" />
                                <span className="text-xs">No conversations yet</span>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </div>
        </>
    );
}
