"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Loader2, Plus, Send } from "lucide-react";
import { ChatTab } from ".";
import { Input } from "../ui/input";

const FEEDBACK_URL = "https://form.typeform.com/to/D7we4T7R";

// Same limit as the backend (QueryRequest.query in main.py)
const MAX_QUESTION_LENGTH = 4000;

const menuItemClass =
    "w-full cursor-pointer px-4 py-2.5 text-left transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none";

export function ChatInput({
    wide,
    input,
    setInput,
    handleSend,
    isStreaming,
    activeTab,
    onUploadClick,
    onBatchClick,
}: Readonly<{
    wide?: boolean;
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

    // Close menu when clicking outside or pressing Escape
    useEffect(() => {
        if (!showMenu) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setShowMenu(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [showMenu]);

    const handleMenuAction = (action?: () => void) => {
        setShowMenu(false);
        action?.();
    };

    return (
        <div className="z-20 shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-3">
            <div
                className={cn(
                    "mx-auto transition-[max-width] duration-300 ease-in-out",
                    wide ? "max-w-4xl" : "max-w-3xl",
                )}
            >
                <form onSubmit={handleSend}>
                    <div className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white p-1.5 transition-colors focus-within:border-primary">
                        <div className="relative" ref={menuRef}>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className={`h-8 w-8 shrink-0 rounded-lg ${
                                    showMenu
                                        ? "bg-slate-100 text-slate-900"
                                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                                onClick={() => setShowMenu(!showMenu)}
                                aria-label="Documents and batch analysis"
                                aria-haspopup="menu"
                                aria-expanded={showMenu}
                            >
                                <Plus
                                    size={20}
                                    className={`transition-transform duration-200 ${showMenu ? "rotate-45" : ""}`}
                                />
                            </Button>

                            {showMenu && (
                                <div
                                    role="menu"
                                    className="absolute bottom-full left-0 z-50 mb-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg"
                                >
                                    <button
                                        type="button"
                                        role="menuitem"
                                        onClick={() => handleMenuAction(onUploadClick)}
                                        className={menuItemClass}
                                    >
                                        <p className="text-sm font-medium text-slate-800">Upload documents</p>
                                        <p className="text-xs text-slate-500">Add a law or policy to search</p>
                                    </button>
                                    <button
                                        type="button"
                                        role="menuitem"
                                        onClick={() => handleMenuAction(onBatchClick)}
                                        className={menuItemClass}
                                    >
                                        <p className="text-sm font-medium text-slate-800">Batch analysis</p>
                                        <p className="text-xs text-slate-500">
                                            Answer many questions from a spreadsheet
                                        </p>
                                    </button>
                                </div>
                            )}
                        </div>

                        <Input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={
                                activeTab === ChatTab.DATA_PROTECTION
                                    ? "Ask about data protection policy"
                                    : "Ask about digital identity systems"
                            }
                            aria-label="Your question"
                            maxLength={MAX_QUESTION_LENGTH}
                            className="h-auto min-w-0 flex-1 border-0 bg-transparent px-2 py-0 text-sm shadow-none placeholder:text-slate-400 focus-visible:ring-0"
                            disabled={isStreaming}
                        />

                        <Button
                            type="submit"
                            disabled={!input.trim() || isStreaming}
                            aria-label={isStreaming ? "Answering" : "Send question"}
                            className="h-8 w-8 shrink-0 rounded-lg p-0 disabled:bg-slate-100 disabled:text-slate-300"
                        >
                            {isStreaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        </Button>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-slate-500">
                        <p>
                            Verify important points against the original law.
                            <Link
                                href="/docs#retrieval-augmented-generation-rag"
                                className="underline underline-offset-2 hover:text-slate-700 ml-1"
                            >
                                How answers are produced
                            </Link>
                        </p>
                        <a
                            href={FEEDBACK_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary underline-offset-2 hover:underline"
                        >
                            Give feedback
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
