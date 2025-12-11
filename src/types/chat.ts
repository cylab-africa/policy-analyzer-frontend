import { ChatTab } from "@/components/chat";

// Single message within a conversation
export interface ChatMessage {
    id: string;
    user: string;
    bot: string;
    timestamp: Date;
    sources?: string[];
    isStreaming?: boolean;
    error?: boolean;
}

// A conversation contains multiple messages
export interface Conversation {
    id: string;
    title: string; // Generated from first user message
    messages: ChatMessage[];
    tab: ChatTab;
    createdAt: Date;
    updatedAt: Date;
}

// Storage structure for all conversations
export interface ConversationStore {
    conversations: Conversation[];
    activeConversationId: string | null;
}
