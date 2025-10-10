"use client";

import { Button } from "@/components/ui/button";
import { usePostHog } from "posthog-js/react";
import { Fingerprint, Loader2, Send, Shield } from "lucide-react";
import { ChatTab } from ".";
import { Input } from "../ui/input";

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
    const posthog = usePostHog();

    const handleInputFocus = () => {
        posthog?.capture("chat_input_focused", {
            tab: activeTab,
            timestamp: new Date().toISOString(),
        });
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (input.trim()) {
            posthog?.capture("chat_message_sent", {
                tab: activeTab,
                message_length: input.trim().length,
                timestamp: new Date().toISOString(),
            });
        }

        handleSend(e);
    };

    const handleFeedbackClick = () => {
        posthog?.capture("feedback_button_clicked", {
            source: "chat_input",
            timestamp: new Date().toISOString(),
        });
    };

    return (
        <div className="bg-white/95 backdrop-blur-sm kborder-t border-slate-200/80 px-4 py-3 shrink-0">
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="relative">
                    {/* Main Input Container */}
                    <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 focus-within:shadow-lg focus-within:border-primary/30">
                        <div className="flex items-center gap-1 px-4 py-1">
                            {/* Tab Icon */}
                            <div className="flex-shrink-0 hidden md:block">
                                <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200/60">
                                    {activeTab === ChatTab.DATA_PROTECTION ? (
                                        <Shield className="w-5 h-5 text-slate-600" />
                                    ) : (
                                        <Fingerprint className="w-5 h-5 text-slate-600" />
                                    )}
                                </div>
                            </div>

                            <Input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onFocus={handleInputFocus}
                                placeholder={
                                    activeTab === ChatTab.DATA_PROTECTION
                                        ? "Ask about data protection policies, legislation status..."
                                        : "Ask about digital ID systems, implementation progress..."
                                }
                                className="flex-1 w-full border-1 bg-transparent text-base sm:text-base placeholder:text-slate-400 placeholder:text-xs sm:placeholder:text-sm outline-none ring-0 focus:ring-0 focus:outline-none px-0 py-1 pl-1"
                                disabled={isStreaming}
                                style={{ border: "none", outline: "none", boxShadow: "none" }}
                            />

                            {/* Send Button */}
                            <div className="flex-shrink-0">
                                <Button
                                    type="submit"
                                    disabled={!input.trim() || isStreaming}
                                    className="w-10 h-10 cursor-pointer rounded-full bg-primary hover:bg-primary/90 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none p-0"
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
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r rounded-2x gap-3 sm:gap-0">
                            {/* Left Side - Feedback Link */}
                            <div className="flex items-center gap-2 order-2 sm:order-1">
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
                                        onClick={handleFeedbackClick}
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
                            <div className="flex items-center gap-2 order-1 sm:order-2">
                                <span className="text-xs font-medium text-gray-500">
                                    AI can make mistakes. Check important info.
                                </span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
