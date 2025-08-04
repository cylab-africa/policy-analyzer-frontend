/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, MessageSquare, Send, Loader2, AlertCircle, Bot, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
        // Return a temporary ID during SSR
        return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    let sessionId = sessionStorage.getItem("chatSessionId");
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem("chatSessionId", sessionId);
    }
    return sessionId;
};

// Main Chat Page Component
export default function ChatPage() {
    const [activeTab, setActiveTab] = useState<ChatTab>(ChatTab.DATA_PROTECTION);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [showChatHistory, setShowChatHistory] = useState<boolean>(true);
    const [sessionId, setSessionId] = useState<string>("");
    const [streamError, setStreamError] = useState<string | null>(null);

    const chatBodyRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const accumulatedResponseRef = useRef<string>("");

    // Initialize session ID on client side
    useEffect(() => {
        setSessionId(getSessionId());
    }, []);

    // Load chat history from session storage
    useEffect(() => {
        if (!sessionId) return; // Wait for sessionId to be set

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

    // Stream handler for backend integration
    const handleStreamResponse = async (query: string) => {
        // Prevent multiple simultaneous requests
        if (isStreaming) return;

        setIsStreaming(true);
        setStreamError(null);
        accumulatedResponseRef.current = "";

        // Create new message with unique ID
        const newMessageId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const newMessage: Message = {
            id: newMessageId,
            user: query,
            bot: "",
            timestamp: new Date(),
            tab: activeTab,
            isStreaming: true,
        };

        // Add message to state immediately
        setMessages((prev) => [...prev, newMessage]);

        // Create abort controller for this request
        abortControllerRef.current = new AbortController();

        // Declare finalSources in the outer scope so it's accessible in finally
        let finalSources: string[] = [];

        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

            const response = await fetch(`${API_BASE_URL}/api/query_stream`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "text/event-stream",
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
            // let finalSources: string[] = []; // <-- removed from here

            // Read the stream
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

                    // Handle end of stream
                    if (data === "[DONE]") {
                        streamCompleted = true;
                        break;
                    }

                    try {
                        // Parse the Python dict-like response
                        const jsonString = data
                            .replace(/'/g, '"')
                            .replace(/True/g, "true")
                            .replace(/False/g, "false")
                            .replace(/None/g, "null");

                        const parsedData = JSON.parse(jsonString);

                        // Handle content streaming
                        if (
                            parsedData.type === "content" &&
                            parsedData.content?.type === "content" &&
                            parsedData.content?.content
                        ) {
                            accumulatedResponseRef.current += parsedData.content.content;

                            // Update the message in real-time
                            setMessages((prev) =>
                                prev.map((msg) =>
                                    msg.id === newMessageId
                                        ? { ...msg, bot: accumulatedResponseRef.current, isStreaming: true }
                                        : msg
                                )
                            );
                        }

                        // Handle sources
                        if (parsedData.type === "sources" && parsedData.sources) {
                            finalSources = [...new Set([...finalSources, ...parsedData.sources])];

                            // Update sources in message
                            setMessages((prev) =>
                                prev.map((msg) => (msg.id === newMessageId ? { ...msg, sources: finalSources } : msg))
                            );
                        }
                    } catch (parseError) {
                        console.error("Error parsing SSE data:", parseError, "Raw data:", data);
                    }
                }

                // Break out of outer loop if we got [DONE]
                if (streamCompleted) break;
            }

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === newMessageId
                        ? {
                              ...msg,
                              bot: accumulatedResponseRef.current,
                              isStreaming: false,
                              sources: finalSources,
                          }
                        : msg
                )
            );
        } catch (error: any) {
            if (error.name === "AbortError") {
                return;
            }

            console.error("Stream error:", error);
            setStreamError(error.message);

            // Update message with error
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === newMessageId
                        ? {
                              ...msg,
                              bot: "Sorry, I encountered an error processing your request. Please try again.",
                              error: true,
                              isStreaming: false,
                          }
                        : msg
                )
            );
        } finally {
            // Only clear the ref AFTER we've done the final update
            const finalResponse = accumulatedResponseRef.current;

            // Ensure the final message state is correct
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === newMessageId
                        ? {
                              ...msg,
                              bot: finalResponse || "No response received",
                              isStreaming: false,
                              sources: finalSources,
                          }
                        : msg
                )
            );

            setIsStreaming(false);

            // Clear the ref only after all updates are done
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

        // Clear input immediately to prevent double sending
        const query = trimmedInput;
        setInput("");

        // Start streaming
        await handleStreamResponse(query);
    };

    // Handle tab change
    const handleTabChange = (tab: ChatTab) => {
        // Abort any ongoing stream
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
        <Card className="p-4 shadow-md">
            <div className="flex min-h-[80vh] bg-gray-50">
                {/* Chat History Sidebar */}
                <div
                    className={cn(
                        "w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
                        showChatHistory ? "block" : "hidden"
                    )}
                >
                    <div className="p-4 border-b border-gray-200 flex items-center">
                        <h2 className="text-lg font-semibold">Chat History</h2>
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
                                            }}
                                        >
                                            <div className="text-sm font-medium text-gray-800 truncate">
                                                {message.user.length > 32
                                                    ? `${message.user.substring(0, 32)}...`
                                                    : message.user}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                <MessageSquare size={12} />
                                                {formatTime(message.timestamp)}
                                                {/* {message.sources && (
                                                    <Badge variant="secondary" className="text-xs px-1">
                                                        {message.sources.length}
                                                    </Badge>
                                                )} */}
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

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 p-2 flex items-center">
                        <Tabs
                            value={activeTab}
                            className="w-full"
                            onValueChange={(value) => handleTabChange(value as ChatTab)}
                        >
                            <TabsList className="grid w-[400px] grid-cols-2">
                                <TabsTrigger className="cursor-pointer" value={ChatTab.DATA_PROTECTION}>
                                    Data Protection
                                </TabsTrigger>
                                <TabsTrigger className="cursor-pointer" value={ChatTab.DIGITAL_ID}>
                                    Digital ID
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <Button
                            variant="outline"
                            size="sm"
                            className="ml-auto mr-2"
                            onClick={() => setShowChatHistory(!showChatHistory)}
                        >
                            {showChatHistory ? "Hide History" : "Show History"}
                        </Button>
                    </div>

                    {/* Error Alert */}
                    {streamError && (
                        <div className="p-4 bg-red-50 border-b border-red-200">
                            <div className="flex items-center gap-2 text-red-700">
                                <AlertCircle size={16} />
                                <span className="text-sm">Connection error: {streamError}</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setStreamError(null)}
                                    className="ml-auto"
                                >
                                    Dismiss
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Chat Area */}
                    <div ref={chatBodyRef} className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        {getFilteredMessages().length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    {activeTab === ChatTab.DATA_PROTECTION
                                        ? "Ask me about Data Protection policies in Africa"
                                        : "Ask me about Digital ID systems in Africa"}
                                </h2>
                                <p className="text-gray-600 mb-8 max-w-md">
                                    Your AI-powered guide to understanding policies, privacy, and compliance.
                                </p>

                                <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                                    {suggestedQuestions[activeTab].map((question, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            className="rounded-full bg-white"
                                            onClick={() => setInput(question)}
                                        >
                                            {question}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full mx-auto">
                                {getFilteredMessages().map((message) => (
                                    <div key={message.id} id={`message-${message.id}`} className="mb-6">
                                        {/* User Message */}
                                        <div className="flex justify-end mb-3">
                                            <div className="flex items-start gap-2 max-w-3xl">
                                                <Card className="bg-blue-50 border-blue-100 py-3 px-4 shadow-none">
                                                    <div className="text-gray-800">{message.user}</div>
                                                    <div className="text-gray-400 text-xs text-right">
                                                        {formatTime(message.timestamp)}
                                                    </div>
                                                </Card>
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User size={16} className="text-primary" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bot Message */}
                                        {(message.bot || message.isStreaming) && (
                                            <div className="flex mb-3">
                                                <div className="flex items-start gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                                        <Bot size={16} className="text-primary" />
                                                    </div>

                                                    <Card
                                                        className={cn(
                                                            "p-8 shadow-none w-full",
                                                            message.error
                                                                ? "bg-red-50 border-red-200"
                                                                : "bg-white border-gray-200"
                                                        )}
                                                    >
                                                        <div className="prose prose-gray max-w-none">
                                                            <Markdown
                                                                remarkPlugins={[remarkGfm]}
                                                                components={{
                                                                    // Headings
                                                                    h1: ({ ...props }) => (
                                                                        <h1
                                                                            className="text-xl font-bold text-gray-900 mb-4 mt-6 first:mt-0 border-b border-gray-200 pb-2"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    h2: ({ ...props }) => (
                                                                        <h2
                                                                            className="text-lg font-semibold text-gray-900 mb-3 mt-5 first:mt-0"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    h3: ({ ...props }) => (
                                                                        <h3
                                                                            className="text-md font-medium text-gray-900 mb-2 mt-4 first:mt-0"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    // Paragraphs
                                                                    p: ({ ...props }) => (
                                                                        <p
                                                                            className="mb-4 last:mb-0 text-gray-700 leading-relaxed"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    // Lists
                                                                    ul: ({ ...props }) => (
                                                                        <ul
                                                                            className="mb-4 space-y-2 pl-6 list-disc"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    ol: ({ ...props }) => (
                                                                        <ol
                                                                            className="mb-4 space-y-2 pl-6 list-decimal"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    li: ({ ...props }) => (
                                                                        <li
                                                                            className="text-gray-700 leading-relaxed"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    // Code blocks
                                                                    code: ({ className, children, ...props }) => {
                                                                        const isInline = !className;
                                                                        return isInline ? (
                                                                            <code
                                                                                className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
                                                                                {...props}
                                                                            >
                                                                                {children}
                                                                            </code>
                                                                        ) : (
                                                                            <code
                                                                                className="block bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto"
                                                                                {...props}
                                                                            >
                                                                                {children}
                                                                            </code>
                                                                        );
                                                                    },
                                                                    pre: ({ ...props }) => (
                                                                        <pre
                                                                            className="mb-4 overflow-x-auto"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    // Blockquotes
                                                                    blockquote: ({ ...props }) => (
                                                                        <blockquote
                                                                            className="border-l-4 border-primary pl-4 py-2 mb-4 bg-blue-50 text-gray-700 italic"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    // Tables
                                                                    table: ({ ...props }) => (
                                                                        <div className="overflow-x-auto mb-4">
                                                                            <table
                                                                                className="min-w-full border border-gray-300 rounded-lg"
                                                                                {...props}
                                                                            />
                                                                        </div>
                                                                    ),
                                                                    thead: ({ ...props }) => (
                                                                        <thead className="bg-gray-50" {...props} />
                                                                    ),
                                                                    th: ({ ...props }) => (
                                                                        <th
                                                                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    td: ({ ...props }) => (
                                                                        <td
                                                                            className="px-4 py-3 text-gray-700 border-b border-gray-200"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    // Links
                                                                    a: ({ ...props }) => (
                                                                        <a
                                                                            className="text-primary over:text-primary underline"
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    // Emphasis
                                                                    strong: ({ ...props }) => (
                                                                        <strong
                                                                            className="font-semibold text-gray-900"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    em: ({ ...props }) => (
                                                                        <em
                                                                            className="italic text-gray-700"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    // Horizontal rule
                                                                    hr: ({ ...props }) => (
                                                                        <hr
                                                                            className="my-6 border-gray-300"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                }}
                                                            >
                                                                {message.bot}
                                                            </Markdown>

                                                            {/* Streaming indicator */}
                                                            {message.isStreaming && (
                                                                <div className="flex items-center gap-2 text-gray-600 text-sm mt-4 pt-3 border-t border-gray-100 animate-pulse">
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
                                                                    <span className="text-xs font-medium">
                                                                        AI is typing...
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Sources */}
                                                        {message.sources && message.sources.length > 0 && (
                                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                                <div className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                                    <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center">
                                                                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                                                    </div>
                                                                    Sources ({message.sources.length})
                                                                </div>
                                                                <div className="grid grid-cols-1 gap-2">
                                                                    {message.sources.map((source, index) => (
                                                                        <div
                                                                            key={index}
                                                                            className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs"
                                                                        >
                                                                            <div className="flex items-start gap-2">
                                                                                <Badge
                                                                                    variant="secondary"
                                                                                    className="text-xs shrink-0"
                                                                                >
                                                                                    {index + 1}
                                                                                </Badge>
                                                                                <span className="text-gray-700 break-words">
                                                                                    {source}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="text-gray-400 text-xs mt-3 pt-2 border-t border-gray-100">
                                                            {formatTime(message.timestamp)}
                                                        </div>
                                                    </Card>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <form onSubmit={handleSend} className="flex items-center max-w-4xl mx-auto">
                            <div className="flex-1 relative">
                                <Input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={
                                        activeTab === ChatTab.DATA_PROTECTION
                                            ? "Ask about data protection policies..."
                                            : "Ask about digital ID systems..."
                                    }
                                    className="pr-12 py-6 border-gray-300 shadow-sm rounded-lg"
                                    disabled={isStreaming}
                                />
                                <Button
                                    type="submit"
                                    disabled={!input.trim() || isStreaming}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md h-8 w-8 p-0"
                                >
                                    {isStreaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                </Button>
                            </div>
                        </form>
                        <p className="text-center text-xs text-amber-600 mt-2 max-w-4xl mx-auto">
                            Note: The AI can make mistakes. Check important information
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
