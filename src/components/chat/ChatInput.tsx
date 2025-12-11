"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

import { FileSpreadsheet, Heart, Loader2, Plus, Send, Upload } from "lucide-react";
import { ChatTab } from ".";
import { Input } from "../ui/input";

const FEEDBACK_URL = "https://form.typeform.com/to/D7we4T7R";

export function ChatInput({
    input,
    setInput,
    handleSend,
    isStreaming,
    activeTab,
    onUploadClick,
    onBatchClick,
}: Readonly<{
    input: string;
    setInput: (input: string) => void;
    handleSend: (e?: React.FormEvent) => void;
    isStreaming: boolean;
    activeTab: ChatTab;
    onUploadClick?: () => void;
    onBatchClick?: () => void;
}>) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showMenu]);

    const handleMenuAction = (action: () => void | undefined) => {
        setShowMenu(false);
        action?.();
    };

    const openFeedback = () => {
        globalThis.open(FEEDBACK_URL, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="sticky bottom-0 bg-slate-100/40 backdrop-blur-sm border-t border-slate-200/60 px-4 py-2.5 shrink-0 z-20">
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSend} className="relative">
                    {/* Main Input Container */}
                    <div className="relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 focus-within:shadow-lg focus-within:border-primary/30 p-1.5 flex items-center gap-1.5">
                        {/* Plus Button with Dropdown */}
                        <div className="relative" ref={menuRef}>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className={`h-8 w-8 rounded-lg transition-all duration-200 shrink-0 ${
                                    showMenu
                                        ? "bg-primary/10 text-primary"
                                        : "text-slate-500 hover:text-slate-600 hover:bg-slate-100"
                                }`}
                                onClick={() => setShowMenu(!showMenu)}
                                title="More options"
                            >
                                <Plus
                                    size={20}
                                    className={`transition-transform duration-200 ${showMenu ? "rotate-45" : ""}`}
                                />
                            </Button>

                            {/* Dropdown Menu */}
                            {showMenu && (
                                <div className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
                                    <button
                                        type="button"
                                        onClick={() => handleMenuAction(onUploadClick!)}
                                        className="w-full flex cursor-pointer items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="p-1.5 bg-primary/10 rounded-lg">
                                            <Upload size={16} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">Upload Documents</p>
                                            <p className="text-xs text-slate-400">Add files to knowledge base</p>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleMenuAction(onBatchClick!)}
                                        className="w-full flex cursor-pointer items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="p-1.5 bg-green-100 rounded-lg">
                                            <FileSpreadsheet size={16} className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">Batch Analysis</p>
                                            <p className="text-xs text-slate-400">Process multiple queries</p>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Input Field */}
                        <div className="flex-1 min-w-0">
                            <Input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={
                                    activeTab === ChatTab.DATA_PROTECTION
                                        ? "Ask about data protection policies..."
                                        : "Ask about digital ID systems..."
                                }
                                className="w-full border-1 rounded-full bg-transparent text-sm placeholder:text-slate-400 outline-none ring-0 focus:ring-0 focus:outline-none px-2 py-0 h-auto shadow-none"
                                disabled={isStreaming}
                                style={{ border: "none", outline: "none", boxShadow: "none" }}
                            />
                        </div>

                        {/* Send Button */}
                        <Button
                            type="submit"
                            disabled={!input.trim() || isStreaming}
                            className="h-8 w-8 rounded-lg bg-primary hover:bg-primary/90 disabled:bg-slate-100 disabled:text-slate-300 transition-all duration-200 shadow-sm p-0 shrink-0"
                        >
                            {isStreaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        </Button>
                    </div>

                    {/* Footer: Context Indicators + Feedback */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <span className="font-medium">
                                    {activeTab === ChatTab.DATA_PROTECTION ? "Data Protection Mode" : "Digital ID Mode"}
                                </span>
                            </div>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">AI can make mistakes. Check important info.</span>
                        </div>

                        {/* Feedback Button */}
                        <Button
                            variant={"ghost"}
                            onClick={openFeedback}
                            className="flex items-center gap-1 text-primary hover:text-primary transition-colors group"
                        >
                            <Heart size={14} className="group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Feedback</span>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
