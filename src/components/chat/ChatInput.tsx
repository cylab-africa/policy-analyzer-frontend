"use client";

import { Button } from "@/components/ui/button";

import { FileKey, Loader2, Send, Shield } from "lucide-react";
import { Input } from "../ui/input";
import { ChatTab } from ".";

export function ChatInput({
    input,
    setInput,
    handleSend,
    isStreaming,
    activeTab,
}: {
    input: string;
    setInput: (input: string) => void;
    handleSend: (e?: React.FormEvent) => void;
    isStreaming: boolean;
    activeTab: ChatTab;
}) {
    return (
        <div className="bg-white/95 backdrop-blur-sm border-t border-slate-200/60 px-4 py-3 shrink-0">
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSend} className="relative">
                    {/* Main Input Container */}
                    <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xs transition-all duration-200 focus-within:shadow-lg focus-within:border-primary/30">
                        <div className="flex items-center gap-1 px-4 py-2">
                            {/* Tab Icon */}
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200/60">
                                    {activeTab === ChatTab.DATA_PROTECTION ? (
                                        <Shield className="w-5 h-5 text-slate-600" />
                                    ) : (
                                        <FileKey className="w-5 h-5 text-slate-600" />
                                    )}
                                </div>
                            </div>

                            {/* Input Field */}
                            <Input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={
                                    activeTab === ChatTab.DATA_PROTECTION
                                        ? "Ask about data protection policies, legislation status..."
                                        : "Ask about digital ID systems, implementation progress..."
                                }
                                className="flex-1 w-full border-1 bg-transparent text-base placeholder:text-slate-400 outline-none ring-0 focus:ring-0 focus:outline-none px-0 py-1 pl-1"
                                disabled={isStreaming}
                                style={{ border: "none", outline: "none", boxShadow: "none" }}
                            />

                            {/* Send Button */}
                            <div className="flex-shrink-0">
                                <Button
                                    type="submit"
                                    disabled={!input.trim() || isStreaming}
                                    className="w-10 h-10 cursor-pointer rounded-xl bg-primary hover:bg-primary/90 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none p-0"
                                >
                                    {isStreaming ? (
                                        <Loader2 size={18} className="animate-spin text-white" />
                                    ) : (
                                        <Send size={18} className="text-white" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Input Enhancement Line */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-0 transition-opacity duration-200 group-focus-within:opacity-100"></div>
                    </div>

                    {/* Context Indicators */}
                    <div className="mt-4">
                        {/* Enhanced Context Bar */}
                        <div className="flex items-end justify-between px-4 py-1 bg-gradient-to-r rounded-2x">
                            {/* Left Side - Feedback Link */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="text-xs text-primary hover:text-primary/80 h-8 px-3 rounded-full flex items-center gap-1.5 
        border-primary/40 hover:border-primary/60 hover:bg-transparent transition-all duration-300 relative overflow-hidden
        shadow-[0_0_4px_rgba(var(--primary),0.2)] 
        hover:shadow-[0_0_12px_rgba(var(--primary),0.4),0_0_24px_rgba(var(--primary),0.2)]
        animate-[glow_3s_ease-in-out_infinite]
        before:absolute before:inset-0 before:rounded-full 
        before:bg-gradient-to-r before:from-transparent before:via-primary/15 before:to-transparent
        before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000 before:ease-out"
                                >
                                    <a
                                        href="https://form.typeform.com/to/D7we4T7R"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 relative z-10"
                                    >
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                        Give Feedback
                                    </a>
                                </Button>
                            </div>

                            {/* Right Side - AI Disclaimer */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500">
                                    AI can make mistakes. please double-check it.
                                </span>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Enhanced Status Bar */}
                {isStreaming && (
                    <div className="mt-4 flex items-center justify-center">
                        <div className="flex items-center gap-3 bg-slate-50 rounded-full px-4 py-2 border border-slate-200">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            </div>
                            <span className="text-sm font-medium text-slate-600">Analyzing...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
