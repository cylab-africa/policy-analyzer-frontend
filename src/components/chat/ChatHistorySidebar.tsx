"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { Clock, History, X } from "lucide-react";
import { Message } from ".";

export function ChatHistorySidebar({
    showChatHistory,
    setShowChatHistory,
    getChatHistory,
    clearChatHistory,
    formatTime,
    isMobile,
}: {
    showChatHistory: boolean;
    setShowChatHistory: (show: boolean) => void;
    getChatHistory: () => [string, Message[]][];
    clearChatHistory: () => void;
    formatTime: (date: Date) => string;
    isMobile: boolean;
}) {
    return (
        <>
            {/* Mobile overlay */}
            {isMobile && showChatHistory && (
                <div className="fixed inset-0 bg-black/50 lg:hidden z-40" onClick={() => setShowChatHistory(false)} />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300",
                    isMobile ? "fixed left-0 top-0 bottom-0 w-72 transform z-50" : "w-80",
                    showChatHistory ? "translate-x-0" : isMobile ? "-translate-x-full" : "hidden"
                )}
            >
                {/* Header */}
                <div className="p-3 py-4.5 border-b border-gray-200 shrink-0">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            {isMobile && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 shrink-0"
                                    onClick={() => setShowChatHistory(false)}
                                >
                                    <X size={16} />
                                </Button>
                            )}
                            <h2 className="text-sm font-semibold flex items-center gap-2 truncate">
                                <History size={16} className="shrink-0" />
                                <span>Chat History</span>
                            </h2>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1.5 text-xs h-8 px-3 shrink-0"
                            onClick={clearChatHistory}
                        >
                            <Clock size={14} />
                            Clear
                        </Button>
                    </div>
                </div>

                <ScrollArea className="flex-1 mt-2">
                    {getChatHistory().length > 0 ? (
                        getChatHistory().map(([date, dateMessages]) => (
                            <div key={date} className="mb-4">
                                <div className="px-2 py-1 text-xs font-semibold text-gray-500 flex items-center gap-2">
                                    <div className="w-1/3 h-px bg-gray-200" />
                                    {date}
                                    <div className="flex-1 h-px bg-gray-200" />
                                </div>
                                {dateMessages.map((message) => (
                                    <div
                                        key={message.id}
                                        className="px-3 py-2 mx-1 my-1 rounded-md hover:bg-gray-100 cursor-pointer border-l-2 border-transparent hover:border-primary transition-all"
                                        onClick={() => {
                                            const element = document.getElementById(`message-${message.id}`);
                                            if (element) {
                                                element.scrollIntoView({ behavior: "smooth" });
                                            }
                                            if (isMobile) {
                                                setShowChatHistory(false);
                                            }
                                        }}
                                    >
                                        <div className="text-sm font-medium text-gray-800 truncate">
                                            {message.user.length > 36
                                                ? `${message.user.substring(0, 36)}...`
                                                : message.user}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                            {formatTime(message.timestamp)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="p-6 text-center text-gray-400 text-sm">No chat history yet</div>
                    )}
                </ScrollArea>
            </div>
        </>
    );
}
