/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
    AlertCircle,
    Bot,
    ChevronLeft,
    Clock,
    FileKey,
    History,
    Loader2,
    Menu,
    MessageSquare,
    Send,
    Shield,
    User,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Input } from "../ui/input";

// Define enum for chat tabs
enum ChatTab {
    DATA_PROTECTION = "data-protection",
    DIGITAL_ID = "digital-id",
}

// Define message interface
interface Message {
    id: string;
    user: string;
    bot: string;
    timestamp: Date;
    tab: ChatTab;
    sources?: string[];
    isStreaming?: boolean;
    error?: boolean;
}

// Generate session ID - client-side only
const getSessionId = (): string => {
    if (typeof window === "undefined") {
        return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    let sessionId = sessionStorage.getItem("chatSessionId");
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem("chatSessionId", sessionId);
    }
    return sessionId;
};

// Chat History Sidebar Component
function ChatHistorySidebar({
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
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowChatHistory(false)} />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
                    isMobile ? "fixed left-0 top-0 bottom-0 w-80 transform" : "w-64",
                    showChatHistory ? "translate-x-0" : isMobile ? "-translate-x-full" : "hidden"
                )}
            >
                <div className="p-4 border-b border-gray-200 flex items-center">
                    {isMobile && (
                        <Button variant="ghost" size="sm" className="mr-2" onClick={() => setShowChatHistory(false)}>
                            <X size={16} />
                        </Button>
                    )}
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <History size={18} />
                        Chat History
                    </h2>
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto flex items-center gap-1 text-xs h-8"
                        onClick={clearChatHistory}
                    >
                        <Clock size={14} />
                        Clear
                    </Button>
                </div>

                <ScrollArea className="flex-1">
                    {getChatHistory().length > 0 ? (
                        getChatHistory().map(([date, dateMessages]) => (
                            <div key={date} className="mb-4 px-2">
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
                                            {message.user.length > 28
                                                ? `${message.user.substring(0, 28)}...`
                                                : message.user}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                            <MessageSquare size={12} />
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

// Chat Header Component
function ChatHeader({
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

// Message Component
function MessageBubble({ message, formatTime }: { message: Message; formatTime: (date: Date) => string }) {
    return (
        <div id={`message-${message.id}`} className="mb-6 px-2 sm:px-4">
            {/* User Message */}
            <div className="flex justify-end mb-3">
                <div className="flex items-start gap-2 max-w-full sm:max-w-3xl">
                    <Card className="bg-blue-50 border-blue-100 py-3 px-4 shadow-none max-w-full">
                        <div className="text-gray-800 text-sm sm:text-base break-words">{message.user}</div>
                        <div className="text-gray-400 text-xs text-right">{formatTime(message.timestamp)}</div>
                    </Card>
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                        <User size={16} className="text-white" />
                    </div>
                </div>
            </div>

            {/* Bot Message */}
            {(message.bot || message.isStreaming) && (
                <div className="flex mb-3">
                    <div className="flex items-start gap-2 w-full">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                            <Bot size={16} className="text-white" />
                        </div>

                        <Card
                            className={cn(
                                "p-4 sm:p-6 shadow-none flex-1 min-w-0",
                                message.error ? "bg-red-50 border-red-200" : "bg-white border-gray-200"
                            )}
                        >
                            <div className="prose prose-sm sm:prose prose-gray max-w-none">
                                <Markdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        // Professional, responsive typography
                                        h1: ({ ...props }) => (
                                            <h1
                                                className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 mt-4 sm:mt-6 first:mt-0 border-b border-gray-200 pb-2"
                                                {...props}
                                            />
                                        ),
                                        h2: ({ ...props }) => (
                                            <h2
                                                className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 mt-4 sm:mt-5 first:mt-0"
                                                {...props}
                                            />
                                        ),
                                        h3: ({ ...props }) => (
                                            <h3
                                                className="text-sm sm:text-base font-medium text-gray-900 mb-2 mt-3 sm:mt-4 first:mt-0"
                                                {...props}
                                            />
                                        ),
                                        p: ({ ...props }) => (
                                            <p
                                                className="mb-3 sm:mb-4 last:mb-0 text-gray-700 leading-relaxed text-sm sm:text-base"
                                                {...props}
                                            />
                                        ),
                                        ul: ({ ...props }) => (
                                            <ul
                                                className="mb-3 sm:mb-4 space-y-1 sm:space-y-2 pl-4 sm:pl-6 list-disc text-sm sm:text-base"
                                                {...props}
                                            />
                                        ),
                                        ol: ({ ...props }) => (
                                            <ol
                                                className="mb-3 sm:mb-4 space-y-1 sm:space-y-2 pl-4 sm:pl-6 list-decimal text-sm sm:text-base"
                                                {...props}
                                            />
                                        ),
                                        li: ({ ...props }) => (
                                            <li className="text-gray-700 leading-relaxed" {...props} />
                                        ),
                                        code: ({ className, children, ...props }) => {
                                            const isInline = !className;
                                            return isInline ? (
                                                <code
                                                    className="bg-gray-100 text-gray-800 px-1 sm:px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono"
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            ) : (
                                                <code
                                                    className="block bg-gray-900 text-gray-100 p-2 sm:p-4 rounded-lg text-xs sm:text-sm font-mono overflow-x-auto"
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            );
                                        },
                                        pre: ({ ...props }) => (
                                            <pre className="mb-3 sm:mb-4 overflow-x-auto" {...props} />
                                        ),
                                        blockquote: ({ ...props }) => (
                                            <blockquote
                                                className="border-l-4 border-primary pl-3 sm:pl-4 py-2 mb-3 sm:mb-4 bg-blue-50 text-gray-700 italic text-sm sm:text-base"
                                                {...props}
                                            />
                                        ),
                                        table: ({ ...props }) => (
                                            <div className="overflow-x-auto mb-3 sm:mb-4">
                                                <table
                                                    className="min-w-full border border-gray-300 rounded-lg text-sm"
                                                    {...props}
                                                />
                                            </div>
                                        ),
                                        thead: ({ ...props }) => <thead className="bg-gray-50" {...props} />,
                                        th: ({ ...props }) => (
                                            <th
                                                className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300"
                                                {...props}
                                            />
                                        ),
                                        td: ({ ...props }) => (
                                            <td
                                                className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700 border-b border-gray-200 text-sm"
                                                {...props}
                                            />
                                        ),
                                        a: ({ ...props }) => (
                                            <a
                                                className="text-primary hover:text-primary/80 underline break-words"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                {...props}
                                            />
                                        ),
                                        strong: ({ ...props }) => (
                                            <strong className="font-semibold text-gray-900" {...props} />
                                        ),
                                        em: ({ ...props }) => <em className="italic text-gray-700" {...props} />,
                                        hr: ({ ...props }) => (
                                            <hr className="my-4 sm:my-6 border-gray-300" {...props} />
                                        ),
                                    }}
                                >
                                    {message.bot}
                                </Markdown>

                                {/* Streaming indicator */}
                                {message.isStreaming && (
                                    <div className="flex items-center gap-2 text-gray-600 text-sm mt-3 sm:mt-4 pt-3 border-t border-gray-100">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                            <div
                                                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                                                style={{ animationDelay: "0.1s" }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                                                style={{ animationDelay: "0.2s" }}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-medium">AI is typing...</span>
                                    </div>
                                )}
                            </div>

                            {/* Sources */}
                            {message.sources && message.sources.length > 0 && (
                                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                                    <div className="text-xs font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                                        <div className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                                        </div>
                                        Sources ({message.sources.length})
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {message.sources.map((source, index) => (
                                            <div
                                                key={index}
                                                className="bg-gray-50 border border-gray-200 rounded-lg p-2 sm:p-3 text-xs"
                                            >
                                                <div className="flex items-start gap-2">
                                                    <Badge variant="secondary" className="text-xs shrink-0">
                                                        {index + 1}
                                                    </Badge>
                                                    <span className="text-gray-700 break-words text-xs sm:text-sm">
                                                        {source}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="text-gray-400 text-xs  border-t border-gray-100">
                                {formatTime(message.timestamp)}
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}

// Welcome Screen Component
import { ArrowRight } from "lucide-react";

function WelcomeScreen({
    activeTab,
    setInput,
    suggestedQuestions,
}: {
    activeTab: ChatTab;
    setInput: (input: string) => void;
    suggestedQuestions: Record<ChatTab, string[]>;
}) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-6 max-w-4xl mx-auto">
            {/* Title with better typography */}
            <div className="mb-8 space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {activeTab === ChatTab.DATA_PROTECTION
                        ? "Explore Data Protection Policies"
                        : "Discover Digital ID Systems"}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base max-w-lg">
                    {activeTab === ChatTab.DATA_PROTECTION
                        ? "Get insights on privacy laws, compliance frameworks, and regulatory landscapes across African nations"
                        : "Learn about identity verification systems, digital citizenship, and authentication frameworks in Africa"}
                </p>
            </div>

            {/* Enhanced suggestion tags */}
            <div className="w-full max-w-3xl mt-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium text-gray-700">Try asking about:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {suggestedQuestions[activeTab].map((question, index) => (
                        <Button
                            key={index}
                            className="group cursor-pointer relative bg-gradient-to-r from-gray-50 to-gray-100/90 
                            border border-gray-200 hover:border-primary/30 rounded-xl p-4 text-left transition-all duration-300 
                            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                            onClick={() => setInput(question)}
                        >
                            {/* Content */}
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-2 h-2 bg-primary/60 rounded-full transition-colors"></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-600 group-hover:text-gray-700 leading-relaxed">
                                        {question}
                                    </p>
                                </div>
                                <ArrowRight
                                    size={16}
                                    className="text-gray-400 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0"
                                />
                            </div>

                            {/* Hover effect border */}
                            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-300"></div>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Error Alert Component
function ErrorAlert({
    streamError,
    setStreamError,
}: {
    streamError: string | null;
    setStreamError: (error: string | null) => void;
}) {
    if (!streamError) return null;

    return (
        <div className="p-3 sm:p-4 bg-red-50 border-b border-red-200 shrink-0">
            <div className="flex items-center gap-2 text-red-700">
                <AlertCircle size={16} />
                <span className="text-sm flex-1">Connection error: {streamError}</span>
                <Button variant="outline" size="sm" onClick={() => setStreamError(null)} className="shrink-0">
                    Dismiss
                </Button>
            </div>
        </div>
    );
}

//  Input Area  - Always visible at bottom
function ChatInput({
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
// Main Chat Page Component
export default function ChatPage() {
    const [activeTab, setActiveTab] = useState<ChatTab>(ChatTab.DATA_PROTECTION);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [showChatHistory, setShowChatHistory] = useState<boolean>(true);
    const [sessionId, setSessionId] = useState<string>("");
    const [streamError, setStreamError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const chatBodyRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const accumulatedResponseRef = useRef<string>("");

    // Check if mobile
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) {
                setShowChatHistory(false);
            }
        };

        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);
        return () => window.removeEventListener("resize", checkIsMobile);
    }, []);

    // Initialize session ID on client side
    useEffect(() => {
        setSessionId(getSessionId());
    }, []);

    // Load chat history from session storage
    useEffect(() => {
        if (!sessionId) return;

        const savedChats = sessionStorage.getItem(`chatHistory_${sessionId}`);
        if (savedChats) {
            try {
                const parsedChats = JSON.parse(savedChats);
                const restoredMessages = parsedChats.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp),
                }));
                setMessages(restoredMessages);
            } catch (error) {
                console.error("Failed to parse chat history:", error);
                sessionStorage.removeItem(`chatHistory_${sessionId}`);
            }
        }
    }, [sessionId]);

    // Save messages to session storage
    useEffect(() => {
        if (messages.length > 0 && sessionId) {
            sessionStorage.setItem(`chatHistory_${sessionId}`, JSON.stringify(messages));
        }
    }, [messages, sessionId]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    // Get filtered messages by tab
    const getFilteredMessages = () => {
        return messages.filter((message) => message.tab === activeTab);
    };

    // Format timestamp
    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Group chat history by date
    const getChatHistory = () => {
        const filteredMessages = getFilteredMessages();
        const groupedMessages: Record<string, Message[]> = {};

        filteredMessages.forEach((message) => {
            const date = new Date(message.timestamp).toLocaleDateString();
            if (!groupedMessages[date]) {
                groupedMessages[date] = [];
            }
            groupedMessages[date].push(message);
        });

        return Object.entries(groupedMessages);
    };

    // FIXED: Stream handler with better response handling
    const handleStreamResponse = async (query: string) => {
        if (isStreaming) return;

        setIsStreaming(true);
        setStreamError(null);
        accumulatedResponseRef.current = "";

        const newMessageId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const newMessage: Message = {
            id: newMessageId,
            user: query,
            bot: "",
            timestamp: new Date(),
            tab: activeTab,
            isStreaming: true,
        };

        setMessages((prev) => [...prev, newMessage]);
        abortControllerRef.current = new AbortController();

        let finalSources: string[] = [];
        let hasReceivedContent = false; // Track if we received any content

        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

            const response = await fetch(`${API_BASE_URL}/query_stream`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "text/event-stream",
                    "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "HpOfOIDyNljM7LlC5QYxKGXSjn0ZRhidTUYW6bgh",
                },
                body: JSON.stringify({
                    query,
                    session_id: sessionId,
                    tab: activeTab,
                    enable_web_search: true,
                    search_tool: "tavily",
                }),
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (!response.body) {
                throw new Error("Response body is null");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let streamCompleted = false;

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    streamCompleted = true;
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n").filter((line) => line.trim() !== "");

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;

                    const data = line.slice(6).trim();

                    if (data === "[DONE]") {
                        streamCompleted = true;
                        break;
                    }

                    try {
                        // Handle both JSON and Python dict-like responses
                        let parsedData;
                        try {
                            // Try parsing as JSON first
                            parsedData = JSON.parse(data);
                        } catch {
                            // Fall back to Python dict-like parsing
                            const jsonString = data
                                .replace(/'/g, '"')
                                .replace(/True/g, "true")
                                .replace(/False/g, "false")
                                .replace(/None/g, "null");
                            parsedData = JSON.parse(jsonString);
                        }

                        // Handle content streaming - be more flexible with data structure
                        if (parsedData.type === "content" || parsedData.content) {
                            let contentText = "";

                            // Try different ways to extract content
                            if (parsedData.content?.content) {
                                contentText = parsedData.content.content;
                            } else if (parsedData.content) {
                                contentText = parsedData.content;
                            } else if (parsedData.text) {
                                contentText = parsedData.text;
                            } else if (typeof parsedData === "string") {
                                contentText = parsedData;
                            }

                            if (contentText && contentText.trim()) {
                                hasReceivedContent = true;
                                accumulatedResponseRef.current += contentText;

                                // Update the message in real-time
                                setMessages((prev) =>
                                    prev.map((msg) =>
                                        msg.id === newMessageId
                                            ? { ...msg, bot: accumulatedResponseRef.current, isStreaming: true }
                                            : msg
                                    )
                                );
                            }
                        }

                        // Handle sources
                        if (parsedData.type === "sources" && parsedData.sources) {
                            finalSources = [...new Set([...finalSources, ...parsedData.sources])];

                            setMessages((prev) =>
                                prev.map((msg) => (msg.id === newMessageId ? { ...msg, sources: finalSources } : msg))
                            );
                        }
                    } catch (parseError) {
                        console.error("Error parsing SSE data:", parseError, "Raw data:", data);

                        // If we can't parse the data, treat it as plain text content
                        if (data && data.trim() && !data.includes("{") && !data.includes("[DONE]")) {
                            hasReceivedContent = true;
                            accumulatedResponseRef.current += data;

                            setMessages((prev) =>
                                prev.map((msg) =>
                                    msg.id === newMessageId
                                        ? { ...msg, bot: accumulatedResponseRef.current, isStreaming: true }
                                        : msg
                                )
                            );
                        }
                    }
                }

                if (streamCompleted) break;
            }
        } catch (error: any) {
            if (error.name === "AbortError") {
                return;
            }

            console.error("Stream error:", error);
            setStreamError(error.message);

            // Only show error if we didn't receive any content
            const errorMessage = hasReceivedContent
                ? accumulatedResponseRef.current
                : "I apologize, but I encountered an issue processing your request. Please try rephrasing your question or try again.";

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === newMessageId
                        ? {
                              ...msg,
                              bot: errorMessage,
                              error: !hasReceivedContent,
                              isStreaming: false,
                              sources: finalSources,
                          }
                        : msg
                )
            );
        } finally {
            setIsStreaming(false);

            // Final update to ensure message is complete
            const finalResponse = accumulatedResponseRef.current;

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === newMessageId
                        ? {
                              ...msg,
                              bot:
                                  finalResponse ||
                                  "I apologize, but I didn't receive a proper response. Please try again.",
                              isStreaming: false,
                              sources: finalSources,
                              error: !finalResponse,
                          }
                        : msg
                )
            );

            // Clear the ref after a short delay
            setTimeout(() => {
                accumulatedResponseRef.current = "";
            }, 100);

            abortControllerRef.current = null;
        }
    };

    // Handle sending messages
    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const trimmedInput = input.trim();
        if (!trimmedInput || isStreaming || !sessionId) return;

        const query = trimmedInput;
        setInput("");

        await handleStreamResponse(query);
    };

    // Handle tab change
    const handleTabChange = (tab: ChatTab) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        setActiveTab(tab);
        setIsStreaming(false);
        setStreamError(null);
    };

    // Clear chat history for current tab
    const clearChatHistory = () => {
        if (!sessionId) return;

        const filteredMessages = messages.filter((message) => message.tab !== activeTab);
        setMessages(filteredMessages);
        sessionStorage.setItem(`chatHistory_${sessionId}`, JSON.stringify(filteredMessages));
    };

    // Suggested questions
    const suggestedQuestions = {
        [ChatTab.DATA_PROTECTION]: [
            "Which countries have data protection laws?",
            "What is the Malabo Convention?",
            "Compare Ghana and Nigeria's data laws",
        ],
        [ChatTab.DIGITAL_ID]: [
            "Which countries have digital ID systems?",
            "How does Kenya's Huduma Namba work?",
            "Digital ID systems for women",
        ],
    };

    return (
        <div
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            style={{
                height: "calc(100vh - 280px)", // Account for header (120px) + margins (160px)
                minHeight: "600px",
            }}
        >
            <div className="flex h-full">
                {/* Chat History Sidebar */}
                <ChatHistorySidebar
                    showChatHistory={showChatHistory}
                    setShowChatHistory={setShowChatHistory}
                    getChatHistory={getChatHistory}
                    clearChatHistory={clearChatHistory}
                    formatTime={formatTime}
                    isMobile={isMobile}
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <ChatHeader
                        activeTab={activeTab}
                        handleTabChange={handleTabChange}
                        showChatHistory={showChatHistory}
                        setShowChatHistory={setShowChatHistory}
                        isMobile={isMobile}
                    />

                    {/* Error Alert */}
                    <ErrorAlert streamError={streamError} setStreamError={setStreamError} />

                    {/* Chat Messages Area */}
                    <div
                        ref={chatBodyRef}
                        className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white"
                        style={{
                            scrollBehavior: "smooth",
                        }}
                    >
                        {getFilteredMessages().length === 0 ? (
                            <WelcomeScreen
                                activeTab={activeTab}
                                setInput={setInput}
                                suggestedQuestions={suggestedQuestions}
                            />
                        ) : (
                            <div className="w-full mx-auto py-4">
                                {getFilteredMessages().map((message) => (
                                    <MessageBubble key={message.id} message={message} formatTime={formatTime} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Fixed Input Area - Always at bottom */}
                    <ChatInput
                        input={input}
                        setInput={setInput}
                        handleSend={handleSend}
                        isStreaming={isStreaming}
                        activeTab={activeTab}
                    />
                </div>
            </div>
        </div>
    );
}
