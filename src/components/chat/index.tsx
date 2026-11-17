/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api-base";

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
    isStreaming?: boolean;
    answeredAt?: number;
    error?: boolean;
}

// Storage keys
const STORAGE_KEY = "policyAnalyzer_conversations";
const ACTIVE_CONVERSATION_KEY = "policyAnalyzer_activeConversation";

// Generate unique ID
const generateId = (): string => {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Generate conversation title from first message. The sidebar fades long titles at its edge,
// so this only caps the length and adds no ellipsis.
const generateTitle = (firstMessage: string): string => {
    const maxLength = 80;
    const title = firstMessage.replace(/\s+/g, " ").trim();
    return title.length <= maxLength ? title : title.substring(0, maxLength).trim();
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

// Suggested questions
const SUGGESTED_QUESTIONS: Record<ChatTab, string[]> = {
    [ChatTab.DATA_PROTECTION]: [
        "Which African countries have enacted data protection laws?",
        "What is the Malabo Convention, and which countries have ratified it?",
        "Compare Ghana and Nigeria's data protection laws",
        "What rights do individuals have under Kenya's Data Protection Act?",
    ],
    [ChatTab.DIGITAL_ID]: [
        "Which African countries have a national digital ID system?",
        "How does Ethiopia's Fayda ID work?",
        "Compare Nigeria's NIN and the Ghana Card",
        "How is biometric data protected in national ID systems?",
    ],
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
        <div role="alert" className="shrink-0 border-b border-red-200 bg-red-50 px-4 py-3">
            <div className="flex items-center gap-3 text-red-800">
                <span className="flex-1 text-sm">Connection error: {streamError}</span>
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
    const contentRef = useRef<HTMLDivElement>(null);
    const stickToBottomRef = useRef(true);
    const lastSavedRef = useRef(0);
    const abortControllerRef = useRef<AbortController | null>(null);

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

    // Track the mobile breakpoint; the history drawer starts closed on mobile
    useEffect(() => {
        const query = window.matchMedia("(max-width: 1023px)");
        const apply = (matches: boolean) => {
            setIsMobile(matches);
            if (matches) setShowChatHistory(false);
        };

        apply(query.matches);
        const onChange = (event: MediaQueryListEvent) => apply(event.matches);
        query.addEventListener("change", onChange);
        return () => query.removeEventListener("change", onChange);
    }, []);

    // Initialize from localStorage
    useEffect(() => {
        const loadedConversations = loadConversations();
        const loadedActiveId = loadActiveConversationId();

        // Read after mount: localStorage does not exist on the server, so reading it earlier would mismatch
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
        if (!isInitialized) return;
        // While an answer streams, write at most every two seconds instead of on every chunk
        if (isStreaming && Date.now() - lastSavedRef.current < 2000) return;
        lastSavedRef.current = Date.now();
        saveConversations(conversations);
    }, [conversations, isInitialized, isStreaming]);

    // Save active conversation ID whenever it changes
    useEffect(() => {
        if (isInitialized) {
            saveActiveConversationId(activeConversationId);
        }
    }, [activeConversationId, isInitialized]);

    // Keep the newest text in view while it grows, unless the reader has scrolled up
    const hasMessages = (currentConversation?.messages.length ?? 0) > 0;

    useEffect(() => {
        const body = chatBodyRef.current;
        const content = contentRef.current;
        if (!body || !content) return;

        const observer = new ResizeObserver(() => {
            if (stickToBottomRef.current) body.scrollTop = body.scrollHeight;
        });
        observer.observe(content);
        return () => observer.disconnect();
    }, [hasMessages]);

    // Opening another conversation starts at its end
    useEffect(() => {
        stickToBottomRef.current = true;
        const body = chatBodyRef.current;
        if (body) body.scrollTop = body.scrollHeight;
    }, [activeConversationId]);

    const handleChatScroll = () => {
        const body = chatBodyRef.current;
        if (!body) return;
        stickToBottomRef.current = body.scrollHeight - body.scrollTop - body.clientHeight < 80;
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

        // Each stream keeps its own controller and text, so a stream that was cancelled
        // can never overwrite the one that replaced it.
        const controller = new AbortController();
        abortControllerRef.current = controller;

        let failed = false;
        let accumulated = "";
        let buffer = "";
        let hasReceivedContent = false;

        try {
            const response = await fetch(`${API_BASE_URL}/query_v2`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "text/event-stream",
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
                signal: controller.signal,
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

            const applyData = (data: string) => {
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
                            accumulated += contentText;

                            updateMessageInConversation(conversationId!, newMessageId, {
                                bot: accumulated,
                                isStreaming: true,
                            });
                        }
                    }
                } catch (parseError) {
                    console.error("Error parsing SSE data:", parseError, "Raw data:", data);

                    if (data?.trim() && !data.includes("{") && !data.includes("[DONE]")) {
                        hasReceivedContent = true;
                        accumulated += data;

                        updateMessageInConversation(conversationId!, newMessageId, {
                            bot: accumulated,
                            isStreaming: true,
                        });
                    }
                }
            };

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    // Whatever is left in the buffer is a final line without a trailing newline
                    if (buffer.startsWith("data: ")) {
                        const data = buffer.slice(6).trim();
                        if (data && data !== "[DONE]") applyData(data);
                    }
                    break;
                }

                // A network chunk can end in the middle of a line, so only whole lines are processed
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() ?? "";

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;

                    const data = line.slice(6).trim();

                    if (data === "[DONE]") {
                        streamCompleted = true;
                        break;
                    }

                    applyData(data);
                }

                if (streamCompleted) break;
            }
        } catch (error: any) {
            if (error.name === "AbortError") {
                return;
            }

            console.error("Stream error:", error);
            failed = true;
            setStreamError(error.message);

            const errorMessage = hasReceivedContent
                ? accumulated
                : "I apologize, but I encountered an issue processing your request. Please try rephrasing your question or try again.";

            updateMessageInConversation(conversationId!, newMessageId, {
                bot: errorMessage,
                error: !hasReceivedContent,
                isStreaming: false,
            });
        } finally {
            // Only the stream that is still current may change the shared state
            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
                setIsStreaming(false);
            }

            // A question the user cancelled is not an error: keep what arrived, or nothing
            const cancelled = controller.signal.aborted;
            updateMessageInConversation(conversationId!, newMessageId, {
                bot:
                    accumulated ||
                    (cancelled ? "" : "I apologize, but I didn't receive a proper response. Please try again."),
                isStreaming: false,
                error: !accumulated && !cancelled,
                // Only a complete answer gets a time; a cancelled or broken one would show a misleading stamp
                answeredAt: accumulated && !failed && !controller.signal.aborted ? Date.now() : undefined,
            });
        }
    };

    // Handle sending messages
    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const trimmedInput = input.trim();
        if (!trimmedInput || isStreaming) return;

        stickToBottomRef.current = true;

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

    // Rename a conversation; the order in the list does not change
    const handleRenameConversation = (id: string, title: string) => {
        const trimmed = title.trim();
        if (!trimmed) return;
        setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title: trimmed } : c)));
    };

    // Clear all history for current tab
    const clearAllHistory = () => {
        setConversations((prev) => prev.filter((c) => c.tab !== activeTab));
        if (currentConversation?.tab === activeTab) {
            setActiveConversationId(null);
        }
    };

    const displayMessages = getDisplayMessages();

    return (
        <>
            <div className="h-[calc(100dvh-16rem)] min-h-[34rem] overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex h-full">
                    {/* Chat History Sidebar */}
                    <ChatHistorySidebar
                        showChatHistory={showChatHistory}
                        setShowChatHistory={setShowChatHistory}
                        conversations={conversations}
                        activeConversationId={activeConversationId}
                        onSelectConversation={handleSelectConversation}
                        onDeleteConversation={handleDeleteConversation}
                        onRenameConversation={handleRenameConversation}
                        clearAllHistory={clearAllHistory}
                        isMobile={isMobile}
                        onNewChat={handleNewChat}
                        onOpenBatch={openBatchPanel}
                        onOpenDocuments={openUploadPanel}
                        activeTab={activeTab}
                    />

                    {/* Main Content */}
                    <div className="relative flex min-w-0 flex-1 flex-col bg-white">
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
                        <div ref={chatBodyRef} onScroll={handleChatScroll} className="flex-1 overflow-y-auto bg-white">
                            {displayMessages.length === 0 ? (
                                <WelcomeScreen
                                    wide={!showChatHistory}
                                    activeTab={activeTab}
                                    setInput={setInput}
                                    suggestedQuestions={SUGGESTED_QUESTIONS}
                                    onUploadClick={openUploadPanel}
                                    onBatchClick={openBatchPanel}
                                />
                            ) : (
                                <div
                                    ref={contentRef}
                                    className={cn(
                                        "mx-auto w-full px-4 py-8 transition-[max-width] duration-300 ease-in-out sm:px-6",
                                        showChatHistory ? "max-w-3xl" : "max-w-4xl"
                                    )}
                                >
                                    {displayMessages.map((message) => (
                                        <MessageBubble key={message.id} message={message} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Fixed Input Area - Always at bottom */}
                        <div className="shrink-0">
                            {/* Upload Panel - Expandable above input */}
                            <UploadPanel isOpen={showUploadPanel} onClose={() => setShowUploadPanel(false)} />

                            <ChatInput
                                wide={!showChatHistory}
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
