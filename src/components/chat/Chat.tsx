"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Clock, MessageSquare, Send } from "lucide-react";
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

// Main Chat Page Component
export default function ChatPage() {
    const [activeTab, setActiveTab] = useState<ChatTab>(ChatTab.DATA_PROTECTION);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const [currentBotResponse, setCurrentBotResponse] = useState<string>("");
    const chatBodyRef = useRef<HTMLDivElement>(null);
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [showChatHistory, setShowChatHistory] = useState<boolean>(true);

    // Load chat history from local storage on component mount
    useEffect(() => {
        const savedChats = localStorage.getItem("chatHistory");
        if (savedChats) {
            try {
                setMessages(JSON.parse(savedChats));
            } catch (error) {
                console.error("Failed to parse chat history from localStorage:", error);
                localStorage.removeItem("chatHistory"); // Remove corrupted data
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
        // Reset bot response
        setCurrentBotResponse("");
        setIsStreaming(true);

        // Just for demo - in a real app, this would be replaced with actual API calls
        const responses = {
            "data-protection": {
                "Which countries have data protection laws?":
                    "Based on our database, 36 African countries have enacted data protection laws, including **South Africa**, **Kenya**, **Nigeria**, **Ghana**, and **Morocco**.\n\nAnother 3 countries have draft laws pending approval, while 16 countries have no specific data protection legislation yet.",
                "What is the Malabo Convention?":
                    "The **Malabo Convention** (officially the African Union Convention on Cyber Security and Personal Data Protection) was adopted in 2014 in Malabo, Equatorial Guinea.\n\nIt provides a framework for cybersecurity and personal data protection across Africa. The convention came into force on June 8, 2023, after reaching 15 ratifications.",
                "Compare Ghana and Nigeria's data laws":
                    "**Ghana's Data Protection Act** (2012):\n- Independent Data Protection Commission\n- Requires registration of data processors\n- Maximum penalty: 250,000 GHS fine\n\n**Nigeria's Data Protection Regulation** (2019):\n- Administered by NITDA (National Information Technology Development Agency)\n- 2% of annual gross revenue penalty for violations\n- More focus on international data transfers",
            },
            "digital-id": {
                "Which countries have digital ID systems?":
                    "Currently, 32 African countries have implemented some form of digital ID system. Notable examples include:\n\n- **South Africa**: Smart ID Card system\n- **Kenya**: Huduma Namba\n- **Nigeria**: National Identification Number (NIN)\n- **Rwanda**: National ID integrated with services\n\nAnother 12 countries have partial implementations, and 6 are in the planning stages.",
                "How does Kenya's Huduma Namba work?":
                    "**Kenya's Huduma Namba** (which means 'Service Number' in Swahili) is a biometric-based national ID system that:\n\n1. Collects biometric data (fingerprints, facial photos)\n2. Assigns a unique identifier to citizens and residents\n3. Intended to be a single source of identity verification\n4. Aims to streamline access to government services\n\nThe implementation has faced legal challenges related to data protection concerns, and enrollment is still ongoing.",
                "Digital ID systems for women":
                    "Digital ID systems present both opportunities and challenges for women in Africa:\n\n**Benefits**:\n- Financial inclusion through easier account opening\n- Access to government benefits directly\n- Reduction in identity-related barriers to services\n\n**Challenges**:\n- Enrollment barriers in conservative regions\n- Lower digital literacy among women in rural areas\n- Requirements for supporting documentation women may lack\n\nCountries like **Rwanda** and **Morocco** have made efforts to ensure gender-inclusive ID systems with better outreach to women.",
            },
        };

        // Get the appropriate response based on tab and query, or a default response
        const defaultResponse =
            "I don't have specific information on that query. Would you like me to help you find information about data protection laws or digital ID systems in Africa?";
        const tabResponses = responses[activeTab] || {};
        const response = (tabResponses as Record<string, string>)[query] || defaultResponse;

        // Simulate streaming with a typing effect
        let index = 0;
        const typingInterval = setInterval(() => {
            if (index < response.length) {
                setCurrentBotResponse((prevResponse) => prevResponse + response.charAt(index));
                index++;
            } else {
                clearInterval(typingInterval);

                // After "typing" is complete, save the message
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages];
                    // Update the bot response of the last message
                    if (updatedMessages.length > 0) {
                        updatedMessages[updatedMessages.length - 1].bot = response;
                    }
                    return updatedMessages;
                });

                setCurrentBotResponse("");
                setIsStreaming(false);
            }
        }, 10); // Adjust speed as needed
    };

    // Handle sending messages
    const handleSend = () => {
        if (input.trim() === "") return;

        // Create new message with unique ID
        const newMessage: Message = {
            id: Date.now().toString(),
            user: input,
            bot: "",
            timestamp: new Date(),
            tab: activeTab,
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        const query = input;
        setInput(""); // Clear the input

        // Simulate fetching the response
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

    // Start a new chat for the current tab
    const startNewChat = () => {
        clearChatHistory();
    };

    return (
        <Card className="p-4 shadow-md">
            <div className="flex min-h-[80vh] bg-gray-50">
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
                            onClick={startNewChat}
                        >
                            <Clock size={14} />
                            New Chat
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
                                                {message.user}
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

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 p-2 flex items-center">
                        <Tabs
                            defaultValue={activeTab}
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
                                    Your guide to understanding policies, privacy, and compliance.
                                </p>

                                <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                                    <Button
                                        variant="outline"
                                        className="rounded-full bg-white"
                                        onClick={() => {
                                            setInput(
                                                activeTab === ChatTab.DATA_PROTECTION
                                                    ? "Which countries have data protection laws?"
                                                    : "Which countries have digital ID systems?"
                                            );
                                        }}
                                    >
                                        {activeTab === ChatTab.DATA_PROTECTION
                                            ? "Which countries have data protection laws?"
                                            : "Which countries have digital ID systems?"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="rounded-full bg-white"
                                        onClick={() => {
                                            setInput(
                                                activeTab === ChatTab.DATA_PROTECTION
                                                    ? "What is the Malabo Convention?"
                                                    : "How does Kenya's Huduma Namba work?"
                                            );
                                        }}
                                    >
                                        {activeTab === ChatTab.DATA_PROTECTION
                                            ? "What is the Malabo Convention?"
                                            : "How does Kenya's Huduma Namba work?"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="rounded-full bg-white"
                                        onClick={() => {
                                            setInput(
                                                activeTab === ChatTab.DATA_PROTECTION
                                                    ? "Compare Ghana and Nigeria's data laws"
                                                    : "Digital ID systems for women"
                                            );
                                        }}
                                    >
                                        {activeTab === ChatTab.DATA_PROTECTION
                                            ? "Compare Ghana and Nigeria's data laws"
                                            : "Digital ID systems for women"}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {getFilteredMessages().map((message) => (
                                    <div
                                        key={message.id}
                                        id={`message-${message.id}`}
                                        className="mb-6 max-w-4xl mx-auto"
                                    >
                                        <div className="flex justify-end mb-3">
                                            <Card className="bg-blue-50 border-blue-100 py-3 px-4 max-w-3xl shadow-sm">
                                                <div className="text-gray-800">{message.user}</div>
                                                <div className="text-gray-400 text-xs mt-2 text-right">
                                                    {formatTime(message.timestamp)}
                                                </div>
                                            </Card>
                                        </div>

                                        {message.bot && (
                                            <div className="flex mb-3">
                                                <Card className="bg-white border border-gray-200 py-3 px-4 max-w-3xl shadow-sm">
                                                    <div className="prose prose-sm max-w-none">
                                                        <Markdown
                                                            remarkPlugins={[remarkGfm]}
                                                            components={{
                                                                p: ({ ...props }) => (
                                                                    <p className="mb-4 last:mb-0" {...props} />
                                                                ),
                                                                li: ({ ...props }) => (
                                                                    <li className="mb-2" {...props} />
                                                                ),
                                                                strong: ({ ...props }) => (
                                                                    <strong
                                                                        className="font-semibold text-blue-600"
                                                                        {...props}
                                                                    />
                                                                ),
                                                            }}
                                                        >
                                                            {message.bot}
                                                        </Markdown>
                                                    </div>
                                                    <div className="text-gray-400 text-xs mt-2">
                                                        {formatTime(message.timestamp)}
                                                    </div>
                                                </Card>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {isStreaming && currentBotResponse && (
                                    <div className="flex mb-3 max-w-4xl mx-auto">
                                        <Card className="bg-white border border-gray-200 py-3 px-4 max-w-3xl shadow-sm">
                                            <div className="prose prose-sm max-w-none">
                                                <Markdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        p: ({ ...props }) => (
                                                            <p className="mb-4 last:mb-0" {...props} />
                                                        ),
                                                        li: ({ ...props }) => <li className="mb-2" {...props} />,
                                                        strong: ({ ...props }) => (
                                                            <strong
                                                                className="font-semibold text-blue-600"
                                                                {...props}
                                                            />
                                                        ),
                                                    }}
                                                >
                                                    {currentBotResponse}
                                                </Markdown>
                                            </div>
                                            <div className="text-gray-400 text-xs mt-2">Just now</div>
                                        </Card>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex items-center max-w-4xl mx-auto">
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
                                    onKeyDown={(e) => e.key === "Enter" && !isStreaming && handleSend()}
                                    className="pr-12 py-6 border-gray-300 shadow-sm rounded-lg"
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={input.trim() === "" || isStreaming}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md h-8 w-8 p-0"
                                >
                                    <Send size={16} />
                                </Button>
                            </div>
                        </div>
                        <p className="text-center text-xs text-amber-600 mt-2 max-w-4xl mx-auto">
                            Note: The AI can make mistakes. Check important information
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
