"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu, MessageSquare, Send, Sparkles, X } from "lucide-react";
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
}

// Suggested questions for quick start
const suggestedQuestions = {
    [ChatTab.DATA_PROTECTION]: [
        "Which countries have data protection laws?",
        "What is the Malabo Convention?",
        "Compare Ghana and Nigeria's data laws",
        "Data protection implementation timeline",
        "GDPR vs African data protection laws",
    ],
    [ChatTab.DIGITAL_ID]: [
        "Which countries have digital ID systems?",
        "How does Kenya's Huduma Namba work?",
        "Digital ID systems for women",
        "Biometric data protection concerns",
        "Cross-border digital ID recognition",
    ],
};

// Main Chat Page Component
export default function ChatPage() {
    const [activeTab, setActiveTab] = useState<ChatTab>(ChatTab.DATA_PROTECTION);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const [currentBotResponse, setCurrentBotResponse] = useState<string>("");
    const chatBodyRef = useRef<HTMLDivElement>(null);
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [showHistoryMobile, setShowHistoryMobile] = useState<boolean>(false);

    // Load chat history from local storage on component mount
    useEffect(() => {
        const savedChats = localStorage.getItem("chatHistory");
        if (savedChats) {
            try {
                setMessages(JSON.parse(savedChats));
            } catch (error) {
                console.error("Failed to parse chat history from localStorage:", error);
                localStorage.removeItem("chatHistory");
            }
        }
    }, []);

    // Save messages to local storage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem("chatHistory", JSON.stringify(messages));
        }
    }, [messages]);

    // Scroll to bottom when new messages are added
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, currentBotResponse]);

    // Function to get filtered messages based on active tab
    const getFilteredMessages = () => {
        return messages.filter((message) => message.tab === activeTab);
    };

    // Function to format timestamp
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

    // Add a typewriter effect for simulating responses
    const simulateBotResponse = (query: string) => {
        setCurrentBotResponse("");
        setIsStreaming(true);

        const responses = {
            "data-protection": {
                "Which countries have data protection laws?":
                    "Based on our database, **36 African countries** have enacted data protection laws, including:\n\n- **South Africa** - Protection of Personal Information Act (2013)\n- **Kenya** - Data Protection Act (2019)\n- **Nigeria** - Nigeria Data Protection Regulation (2019)\n- **Ghana** - Data Protection Act (2012)\n- **Morocco** - Law 09-08 (2009)\n\nAnother **3 countries** have draft laws pending approval, while **16 countries** have no specific data protection legislation yet.",
                "What is the Malabo Convention?":
                    "The **Malabo Convention** (African Union Convention on Cyber Security and Personal Data Protection) was adopted in 2014 in Malabo, Equatorial Guinea.\n\n**Key Features:**\n- Framework for cybersecurity and personal data protection\n- Harmonizes data protection across Africa\n- Came into force on **June 8, 2023**\n- Currently has **15+ ratifying countries**\n\nIt aims to create a unified approach to data protection and cybersecurity across the African continent.",
                "Compare Ghana and Nigeria's data laws":
                    "**Ghana's Data Protection Act (2012):**\n- Independent Data Protection Commission\n- Requires registration of data processors\n- Maximum penalty: 250,000 GHS fine\n- Focus on consent and individual rights\n\n**Nigeria's Data Protection Regulation (2019):**\n- Administered by NITDA\n- **2% of annual gross revenue** penalty for violations\n- More emphasis on international data transfers\n- Stronger enforcement mechanisms\n\n**Key Difference:** Nigeria has significantly higher penalties and stricter enforcement.",
            },
            "digital-id": {
                "Which countries have digital ID systems?":
                    "Currently, **32 African countries** have implemented digital ID systems:\n\n**Fully Implemented:**\n- **South Africa**: Smart ID Card system\n- **Kenya**: Huduma Namba\n- **Nigeria**: National Identification Number (NIN)\n- **Rwanda**: National ID with service integration\n- **Morocco**: National Electronic ID Card\n\n**Partial Implementation:** 12 countries\n**Planning Stage:** 6 countries\n\nThese systems vary from basic digitization to advanced biometric-enabled platforms.",
                "How does Kenya's Huduma Namba work?":
                    "**Kenya's Huduma Namba** ('Service Number' in Swahili) is a comprehensive digital ID system:\n\n**Features:**\n- Biometric data collection (fingerprints, facial photos)\n- Unique identifier for all citizens and residents\n- Single source of identity verification\n- Integration with government services\n\n**Current Status:**\n- Implementation ongoing since 2019\n- Faced legal challenges on data protection\n- Gradual rollout with improved privacy safeguards\n- Aims to streamline access to government benefits and services",
                "Digital ID systems for women":
                    "Digital ID systems present **opportunities and challenges** for women in Africa:\n\n**✅ Benefits:**\n- Enhanced financial inclusion\n- Direct access to government benefits\n- Reduced documentation barriers\n- Better access to healthcare and education\n\n**⚠️ Challenges:**\n- Enrollment barriers in conservative regions\n- Lower digital literacy in rural areas\n- Documentation requirements women may lack\n- Privacy and safety concerns\n\n**Success Stories:**\n- **Rwanda**: 90%+ women enrollment\n- **Morocco**: Gender-inclusive outreach programs",
            },
        };

        const defaultResponse =
            "I don't have specific information on that query. Would you like me to help you find information about data protection laws or digital ID systems in Africa?";
        const tabResponses = responses[activeTab] || {};
        const response = (tabResponses as Record<string, string>)[query] || defaultResponse;

        let index = 0;
        const typingInterval = setInterval(() => {
            if (index < response.length) {
                setCurrentBotResponse((prevResponse) => prevResponse + response.charAt(index));
                index++;
            } else {
                clearInterval(typingInterval);

                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages];
                    if (updatedMessages.length > 0) {
                        updatedMessages[updatedMessages.length - 1].bot = response;
                    }
                    return updatedMessages;
                });

                setCurrentBotResponse("");
                setIsStreaming(false);
            }
        }, 20);
    };

    // Handle sending messages
    const handleSend = () => {
        if (input.trim() === "" || isStreaming) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            user: input,
            bot: "",
            timestamp: new Date(),
            tab: activeTab,
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        const query = input;
        setInput("");

        simulateBotResponse(query);
    };

    // Handle tab change
    const handleTabChange = (tab: ChatTab) => {
        setActiveTab(tab);
        setCurrentBotResponse("");
    };

    // Clear chat history for the current tab
    const clearChatHistory = () => {
        const updatedMessages = messages.filter((message) => message.tab !== activeTab);
        setMessages(updatedMessages);
        localStorage.setItem("chatHistory", JSON.stringify(updatedMessages));
    };

    // Chat History Component (reusable for both desktop sidebar and mobile sheet)
    const ChatHistoryContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold">Chat History</h2>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-xs"
                    onClick={clearChatHistory}
                >
                    <X className="h-3 w-3" />
                    Clear
                </Button>
            </div>

            <ScrollArea className="flex-1">
                {getChatHistory().length > 0 ? (
                    <div className="p-2">
                        {getChatHistory().map(([date, dateMessages]) => (
                            <div key={date} className="mb-4">
                                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground mb-2">{date}</div>
                                {dateMessages.map((message) => (
                                    <Card
                                        key={message.id}
                                        className="mb-2 cursor-pointer hover:bg-accent/50 transition-colors border-0 shadow-sm"
                                        onClick={() => {
                                            const element = document.getElementById(`message-${message.id}`);
                                            if (element) {
                                                element.scrollIntoView({ behavior: "smooth" });
                                                setShowHistoryMobile(false);
                                            }
                                        }}
                                    >
                                        <CardContent className="p-3">
                                            <div className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                                                {message.user}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <MessageSquare className="h-3 w-3" />
                                                {formatTime(message.timestamp)}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 text-center text-muted-foreground text-sm">No chat history yet</div>
                )}
            </ScrollArea>
        </div>
    );

    return (
        <div className="flex flex-col h-screen max-h-screen bg-background">
            {/* Mobile Header */}
            <div className="lg:hidden border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <Sheet open={showHistoryMobile} onOpenChange={setShowHistoryMobile}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="sm" className="p-2">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-80 p-0">
                                <SheetHeader className="sr-only">
                                    <SheetTitle>Chat History</SheetTitle>
                                </SheetHeader>
                                <ChatHistoryContent />
                            </SheetContent>
                        </Sheet>

                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <span className="font-semibold text-lg">Policy Chat</span>
                        </div>
                    </div>

                    <Badge variant="secondary" className="text-xs">
                        {getFilteredMessages().length} chats
                    </Badge>
                </div>

                {/* Mobile Tabs */}
                <div className="px-4 pb-3">
                    <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as ChatTab)}>
                        <TabsList className="grid w-full grid-cols-2 h-9">
                            <TabsTrigger value={ChatTab.DATA_PROTECTION} className="text-xs">
                                Data Protection
                            </TabsTrigger>
                            <TabsTrigger value={ChatTab.DIGITAL_ID} className="text-xs">
                                Digital ID
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Desktop Sidebar */}
                <div className="hidden lg:flex w-80 border-r border-border bg-muted/30 flex-col">
                    <ChatHistoryContent />
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Desktop Header */}
                    <div className="hidden lg:flex border-b border-border bg-background p-4 items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Sparkles className="h-6 w-6 text-primary" />
                            <h1 className="text-xl font-semibold">African Policy Assistant</h1>
                        </div>

                        <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as ChatTab)}>
                            <TabsList className="grid grid-cols-2">
                                <TabsTrigger value={ChatTab.DATA_PROTECTION}>Data Protection</TabsTrigger>
                                <TabsTrigger value={ChatTab.DIGITAL_ID}>Digital ID</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Chat Messages Area */}
                    <div
                        ref={chatBodyRef}
                        className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 bg-gradient-to-b from-background to-muted/20"
                    >
                        {getFilteredMessages().length === 0 ? (
                            // Welcome Screen
                            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4">
                                <div className="mb-6">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                                        <Sparkles className="h-8 w-8 text-primary" />
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                                        {activeTab === ChatTab.DATA_PROTECTION
                                            ? "Data Protection Assistant"
                                            : "Digital ID Assistant"}
                                    </h2>
                                    <p className="text-muted-foreground text-sm sm:text-base">
                                        Your guide to understanding policies, privacy, and compliance across Africa.
                                    </p>
                                </div>

                                <div className="w-full space-y-3">
                                    <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {suggestedQuestions[activeTab].slice(0, 3).map((question, index) => (
                                            <Button
                                                key={index}
                                                variant="outline"
                                                className="h-auto p-3 text-left justify-start text-wrap bg-background/50 hover:bg-accent/50 border-border/50"
                                                onClick={() => setInput(question)}
                                            >
                                                <span className="text-sm">{question}</span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Chat Messages
                            <div className="max-w-4xl mx-auto space-y-4">
                                {getFilteredMessages().map((message) => (
                                    <div key={message.id} id={`message-${message.id}`} className="space-y-3">
                                        {/* User Message */}
                                        <div className="flex justify-end">
                                            <Card className="max-w-[85%] sm:max-w-lg bg-primary text-primary-foreground border-0 shadow-sm">
                                                <CardContent className="p-3 sm:p-4">
                                                    <div className="text-sm sm:text-base break-words">
                                                        {message.user}
                                                    </div>
                                                    <div className="text-xs opacity-70 mt-2 text-right">
                                                        {formatTime(message.timestamp)}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Bot Message */}
                                        {message.bot && (
                                            <div className="flex justify-start">
                                                <Card className="max-w-[85%] sm:max-w-2xl bg-background border border-border shadow-sm">
                                                    <CardContent className="p-3 sm:p-4">
                                                        <div className="prose prose-sm max-w-none text-sm sm:text-base">
                                                            <Markdown
                                                                remarkPlugins={[remarkGfm]}
                                                                components={{
                                                                    p: ({ ...props }) => (
                                                                        <p
                                                                            className="mb-3 last:mb-0 leading-relaxed"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    li: ({ ...props }) => (
                                                                        <li className="mb-1" {...props} />
                                                                    ),
                                                                    strong: ({ ...props }) => (
                                                                        <strong
                                                                            className="font-semibold text-primary"
                                                                            {...props}
                                                                        />
                                                                    ),
                                                                    ul: ({ ...props }) => (
                                                                        <ul className="mb-3 ml-4" {...props} />
                                                                    ),
                                                                    ol: ({ ...props }) => (
                                                                        <ol className="mb-3 ml-4" {...props} />
                                                                    ),
                                                                }}
                                                            >
                                                                {message.bot}
                                                            </Markdown>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-2">
                                                            {formatTime(message.timestamp)}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Streaming Response */}
                                {isStreaming && currentBotResponse && (
                                    <div className="flex justify-start">
                                        <Card className="max-w-[85%] sm:max-w-2xl bg-background border border-border shadow-sm">
                                            <CardContent className="p-3 sm:p-4">
                                                <div className="prose prose-sm max-w-none text-sm sm:text-base">
                                                    <Markdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            p: ({ ...props }) => (
                                                                <p
                                                                    className="mb-3 last:mb-0 leading-relaxed"
                                                                    {...props}
                                                                />
                                                            ),
                                                            strong: ({ ...props }) => (
                                                                <strong
                                                                    className="font-semibold text-primary"
                                                                    {...props}
                                                                />
                                                            ),
                                                        }}
                                                    >
                                                        {currentBotResponse}
                                                    </Markdown>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                                    <div className="flex space-x-1">
                                                        <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                                                        <div
                                                            className="w-1 h-1 bg-current rounded-full animate-pulse"
                                                            style={{ animationDelay: "0.2s" }}
                                                        ></div>
                                                        <div
                                                            className="w-1 h-1 bg-current rounded-full animate-pulse"
                                                            style={{ animationDelay: "0.4s" }}
                                                        ></div>
                                                    </div>
                                                    <span>Typing...</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 sm:p-4 lg:p-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-end gap-2 sm:gap-3">
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
                                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                                        className="pr-12 py-3 sm:py-4 resize-none border-border shadow-sm rounded-lg text-sm sm:text-base"
                                        disabled={isStreaming}
                                    />
                                    <Button
                                        onClick={handleSend}
                                        disabled={input.trim() === "" || isStreaming}
                                        size="sm"
                                        className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-md"
                                    >
                                        <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                </div>
                            </div>
                            <p className="text-center text-xs text-muted-foreground mt-2">
                                AI can make mistakes. Verify important information.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
