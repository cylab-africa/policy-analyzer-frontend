/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";

import { AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatHistorySidebar } from "./ChatHistorySidebar";
import { ChatHeader } from "./ChatHeader";
import { WelcomeScreen } from "./WelcomeScreen";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";

// Define enum for chat tabs
export enum ChatTab {
    DATA_PROTECTION = "data-protection",
    DIGITAL_ID = "digital-id",
}

// Define message interface
export interface Message {
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
            let buffer = ""; // Buffer for incomplete chunks

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    streamCompleted = true;
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                // Process complete lines only
                const lines = buffer.split("\n");
                // Keep the last potentially incomplete line in the buffer
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (!line.trim() || !line.startsWith("data: ")) continue;

                    const data = line.slice(6).trim();

                    if (data === "[DONE]") {
                        streamCompleted = true;
                        break;
                    }

                    // Skip empty data
                    if (!data) continue;

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
                            let contentText: string = "";

                            // Try different ways to extract content
                            if (parsedData.content?.content !== undefined && parsedData.content?.content !== null) {
                                contentText = String(parsedData.content.content);
                            } else if (parsedData.content !== undefined && parsedData.content !== null && typeof parsedData.content === "string") {
                                contentText = parsedData.content;
                            } else if (parsedData.text !== undefined && parsedData.text !== null) {
                                contentText = String(parsedData.text);
                            } else if (typeof parsedData === "string") {
                                contentText = parsedData;
                            }

                            // Ensure contentText is a string and trim it safely
                            if (typeof contentText === "string" && contentText.trim().length > 0) {
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
                    } catch {
                        // Only log errors for non-empty data that looks like it should be valid JSON
                        if (data && data.trim() && (data.startsWith("{") || data.startsWith("["))) {
                            console.warn("Could not parse SSE data chunk (may be incomplete):", data.substring(0, 100));
                        }
                        // Silently skip unparseable chunks - they're likely incomplete and will be completed in the next chunk
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
                height: "calc(100vh - 250px)", 
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
                        className="flex-1 overflow-y-auto"
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
