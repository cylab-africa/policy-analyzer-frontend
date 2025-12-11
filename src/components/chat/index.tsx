/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";

import { AlertCircle } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatHistorySidebar } from "./ChatHistorySidebar";
import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";
import { WelcomeScreen } from "./WelcomeScreen";
import { UploadPanel } from "./UploadPanel";
import { BatchAnalysisPanel } from "./BatchAnalysisPanel";
import { Conversation, ChatMessage } from "@/types/chat";

// Define enum for chat tabs
export enum ChatTab {
    DATA_PROTECTION = "data-protection",
    DIGITAL_ID = "digital-id",
}

// Legacy Message interface for MessageBubble compatibility
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

// Storage keys
const STORAGE_KEY = "policyAnalyzer_conversations";
const ACTIVE_CONVERSATION_KEY = "policyAnalyzer_activeConversation";

// Generate unique ID
const generateId = (): string => {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Generate conversation title from first message (truncate to ~50 chars)
const generateTitle = (firstMessage: string): string => {
    const maxLength = 50;
    if (firstMessage.length <= maxLength) return firstMessage;
    return firstMessage.substring(0, maxLength).trim() + "...";
};

// Load conversations from localStorage
const loadConversations = (): Conversation[] => {
    if (typeof window === "undefined") return [];
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return [];
        const parsed = JSON.parse(saved);
        // Restore Date objects
        return parsed.map((conv: any) => ({
            ...conv,
            createdAt: new Date(conv.createdAt),
            updatedAt: new Date(conv.updatedAt),
            messages: conv.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
            })),
        }));
    } catch (error) {
        console.error("Failed to load conversations:", error);
        return [];
    }
};

// Save conversations to localStorage
const saveConversations = (conversations: Conversation[]): void => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
        console.error("Failed to save conversations:", error);
    }
};

// Load active conversation ID
const loadActiveConversationId = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACTIVE_CONVERSATION_KEY);
};

// Save active conversation ID
const saveActiveConversationId = (id: string | null): void => {
    if (typeof window === "undefined") return;
    if (id) {
        localStorage.setItem(ACTIVE_CONVERSATION_KEY, id);
    } else {
        localStorage.removeItem(ACTIVE_CONVERSATION_KEY);
    }
};

// Error Alert Component
function ErrorAlert({
    streamError,
    setStreamError,
}: {
    readonly streamError: string | null;
    readonly setStreamError: (error: string | null) => void;
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

// Main Chat Page Component
export default function ChatPage() {
    const [showUploadPanel, setShowUploadPanel] = useState(false);
    const [showBatchPanel, setShowBatchPanel] = useState(false);

    const [activeTab, setActiveTab] = useState<ChatTab>(ChatTab.DATA_PROTECTION);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [input, setInput] = useState<string>("");
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [showChatHistory, setShowChatHistory] = useState<boolean>(true);
    const [streamError, setStreamError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const chatBodyRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const accumulatedResponseRef = useRef<string>("");

    // Get current conversation
    const currentConversation = conversations.find((c) => c.id === activeConversationId);

    // Get messages for current conversation (filtered by tab)
    const getCurrentMessages = useCallback((): ChatMessage[] => {
        if (!currentConversation) return [];
        return currentConversation.messages;
    }, [currentConversation]);

    // Convert ChatMessage to Message for MessageBubble compatibility
    const getDisplayMessages = useCallback((): Message[] => {
        return getCurrentMessages().map((msg) => ({
            ...msg,
            tab: activeTab,
        }));
    }, [getCurrentMessages, activeTab]);

    // Panel control functions
    const openUploadPanel = () => {
        setShowBatchPanel(false);
        setShowUploadPanel(true);
    };

    const openBatchPanel = () => {
        setShowUploadPanel(false);
        setShowBatchPanel(true);
    };

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

    // Initialize from localStorage
    useEffect(() => {
        const loadedConversations = loadConversations();
        const loadedActiveId = loadActiveConversationId();

        setConversations(loadedConversations);

        // Verify the active conversation exists
        if (loadedActiveId && loadedConversations.some((c) => c.id === loadedActiveId)) {
            setActiveConversationId(loadedActiveId);
            // Set the tab based on the active conversation
            const activeConv = loadedConversations.find((c) => c.id === loadedActiveId);
            if (activeConv) {
                setActiveTab(activeConv.tab);
            }
        }

        setIsInitialized(true);
    }, []);

    // Save conversations whenever they change
    useEffect(() => {
        if (isInitialized && conversations.length > 0) {
            saveConversations(conversations);
        }
    }, [conversations, isInitialized]);

    // Save active conversation ID whenever it changes
    useEffect(() => {
        if (isInitialized) {
            saveActiveConversationId(activeConversationId);
        }
    }, [activeConversationId, isInitialized]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [currentConversation?.messages]);

    // Format timestamp
    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Create new conversation
    const createNewConversation = useCallback(
        (firstMessage: string): Conversation => {
            const now = new Date();
            const newConv: Conversation = {
                id: generateId(),
                title: generateTitle(firstMessage),
                messages: [],
                tab: activeTab,
                createdAt: now,
                updatedAt: now,
            };
            return newConv;
        },
        [activeTab]
    );

    // Add message to conversation
    const addMessageToConversation = useCallback((conversationId: string, message: ChatMessage) => {
        setConversations((prev) =>
            prev.map((conv) => {
                if (conv.id === conversationId) {
                    return {
                        ...conv,
                        messages: [...conv.messages, message],
                        updatedAt: new Date(),
                    };
                }
                return conv;
            })
        );
    }, []);

    // Update message in conversation
    const updateMessageInConversation = useCallback(
        (conversationId: string, messageId: string, updates: Partial<ChatMessage>) => {
            setConversations((prev) =>
                prev.map((conv) => {
                    if (conv.id === conversationId) {
                        return {
                            ...conv,
                            messages: conv.messages.map((msg) => (msg.id === messageId ? { ...msg, ...updates } : msg)),
                            updatedAt: new Date(),
                        };
                    }
                    return conv;
                })
            );
        },
        []
    );

    // Stream handler
    const handleStreamResponse = async (query: string) => {
        if (isStreaming) return;

        setIsStreaming(true);
        setStreamError(null);
        accumulatedResponseRef.current = "";

        const newMessageId = generateId();

        // Determine the conversation to use
        let conversationId = activeConversationId;
        let isNewConversation = false;

        // If no active conversation or active conversation is from different tab, create new one
        if (!conversationId || !currentConversation || currentConversation.tab !== activeTab) {
            const newConv = createNewConversation(query);
            conversationId = newConv.id;
            isNewConversation = true;
            setConversations((prev) => [...prev, newConv]);
            setActiveConversationId(newConv.id);
        }

        const newMessage: ChatMessage = {
            id: newMessageId,
            user: query,
            bot: "",
            timestamp: new Date(),
            isStreaming: true,
        };

        // Add message to conversation
        if (isNewConversation) {
            // For new conversation, add message directly
            setConversations((prev) =>
                prev.map((conv) => {
                    if (conv.id === conversationId) {
                        return {
                            ...conv,
                            messages: [newMessage],
                            updatedAt: new Date(),
                        };
                    }
                    return conv;
                })
            );
        } else {
            addMessageToConversation(conversationId!, newMessage);
        }

        abortControllerRef.current = new AbortController();

        let finalSources: string[] = [];
        let hasReceivedContent = false;

        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

            const response = await fetch(`${API_BASE_URL}/query_v2`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "text/event-stream",
                    "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "MY_API_KEY3",
                },
                body: JSON.stringify({
                    query,
                    session_id: conversationId,
                    tab: activeTab,
                    enable_web_search: true,
                    search_tool: "tavily",
                    max_docs_per_query: 2,
                    max_total_docs: 4,
                    enable_country_filter: false,
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
                        let parsedData;
                        try {
                            parsedData = JSON.parse(data);
                        } catch {
                            const jsonString = data
                                .replaceAll("'", '"')
                                .replaceAll("True", "true")
                                .replaceAll("False", "false")
                                .replaceAll("None", "null");
                            parsedData = JSON.parse(jsonString);
                        }

                        if (parsedData.type === "content" || parsedData.content) {
                            let contentText = "";

                            if (parsedData.content?.content) {
                                contentText = parsedData.content.content;
                            } else if (parsedData.content) {
                                contentText = parsedData.content;
                            } else if (parsedData.text) {
                                contentText = parsedData.text;
                            } else if (typeof parsedData === "string") {
                                contentText = parsedData;
                            }

                            if (contentText?.trim()) {
                                hasReceivedContent = true;
                                accumulatedResponseRef.current += contentText;

                                updateMessageInConversation(conversationId!, newMessageId, {
                                    bot: accumulatedResponseRef.current,
                                    isStreaming: true,
                                });
                            }
                        }

                        if (parsedData.type === "sources" && parsedData.sources) {
                            finalSources = [...new Set([...finalSources, ...parsedData.sources])];
                            updateMessageInConversation(conversationId!, newMessageId, {
                                sources: finalSources,
                            });
                        }
                    } catch (parseError) {
                        console.error("Error parsing SSE data:", parseError, "Raw data:", data);

                        if (data?.trim() && !data.includes("{") && !data.includes("[DONE]")) {
                            hasReceivedContent = true;
                            accumulatedResponseRef.current += data;

                            updateMessageInConversation(conversationId!, newMessageId, {
                                bot: accumulatedResponseRef.current,
                                isStreaming: true,
                            });
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

            const errorMessage = hasReceivedContent
                ? accumulatedResponseRef.current
                : "I apologize, but I encountered an issue processing your request. Please try rephrasing your question or try again.";

            updateMessageInConversation(conversationId!, newMessageId, {
                bot: errorMessage,
                error: !hasReceivedContent,
                isStreaming: false,
                sources: finalSources,
            });
        } finally {
            setIsStreaming(false);

            const finalResponse = accumulatedResponseRef.current;

            updateMessageInConversation(conversationId!, newMessageId, {
                bot: finalResponse || "I apologize, but I didn't receive a proper response. Please try again.",
                isStreaming: false,
                sources: finalSources,
                error: !finalResponse,
            });

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
        if (!trimmedInput || isStreaming) return;

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
        setActiveConversationId(null); // Clear active conversation when changing tabs
        setIsStreaming(false);
        setStreamError(null);
    };

    // Handle new chat - creates empty state, conversation will be created on first message
    const handleNewChat = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        setActiveConversationId(null);
        setIsStreaming(false);
        setStreamError(null);
        setInput("");

        if (isMobile) {
            setShowChatHistory(false);
        }
    };

    // Select a conversation from history
    const handleSelectConversation = (id: string) => {
        const conv = conversations.find((c) => c.id === id);
        if (conv) {
            setActiveConversationId(id);
            setActiveTab(conv.tab);
        }
    };

    // Delete a conversation
    const handleDeleteConversation = (id: string) => {
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (activeConversationId === id) {
            setActiveConversationId(null);
        }
    };

    // Clear all history for current tab
    const clearAllHistory = () => {
        setConversations((prev) => prev.filter((c) => c.tab !== activeTab));
        if (currentConversation?.tab === activeTab) {
            setActiveConversationId(null);
        }
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
        <>
            <div
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                style={{
                    height: "calc(100vh - 160px)",
                    minHeight: "600px",
                }}
            >
                <div className="flex h-full">
                    {/* Chat History Sidebar */}
                    <ChatHistorySidebar
                        showChatHistory={showChatHistory}
                        setShowChatHistory={setShowChatHistory}
                        conversations={conversations}
                        activeConversationId={activeConversationId}
                        onSelectConversation={handleSelectConversation}
                        onDeleteConversation={handleDeleteConversation}
                        clearAllHistory={clearAllHistory}
                        isMobile={isMobile}
                        onNewChat={handleNewChat}
                        onOpenBatch={openBatchPanel}
                        onOpenDocuments={openUploadPanel}
                        activeTab={activeTab}
                    />

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col min-w-0 bg-white relative">
                        {/* Header with Action Buttons */}
                        <ChatHeader
                            activeTab={activeTab}
                            handleTabChange={handleTabChange}
                            showChatHistory={showChatHistory}
                            setShowChatHistory={setShowChatHistory}
                        />

                        {/* Error Alert */}
                        <ErrorAlert streamError={streamError} setStreamError={setStreamError} />

                        {/* Chat Messages Area */}
                        <div
                            ref={chatBodyRef}
                            className="flex-1 overflow-y-auto bg-white"
                            style={{
                                scrollBehavior: "smooth",
                            }}
                        >
                            {getDisplayMessages().length === 0 ? (
                                <WelcomeScreen
                                    activeTab={activeTab}
                                    setInput={setInput}
                                    suggestedQuestions={suggestedQuestions}
                                    onUploadClick={openUploadPanel}
                                    onBatchClick={openBatchPanel}
                                />
                            ) : (
                                <div className="w-full mx-auto py-6 px-4 max-w-4xl">
                                    {getDisplayMessages().map((message) => (
                                        <MessageBubble key={message.id} message={message} formatTime={formatTime} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Fixed Input Area - Always at bottom */}
                        <div className="shrink-0">
                            {/* Upload Panel - Expandable above input */}
                            <UploadPanel isOpen={showUploadPanel} onClose={() => setShowUploadPanel(false)} />

                            <ChatInput
                                input={input}
                                setInput={setInput}
                                handleSend={handleSend}
                                isStreaming={isStreaming}
                                activeTab={activeTab}
                                onUploadClick={openUploadPanel}
                                onBatchClick={openBatchPanel}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Batch Analysis Panel - Slide over from right */}
            <BatchAnalysisPanel isOpen={showBatchPanel} onClose={() => setShowBatchPanel(false)} />
        </>
    );
}
