"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from ".";

interface MessageBubbleProps {
    message: Message;
    formatTime?: (date: Date) => string;
}

export function MessageBubble({ message }: Readonly<MessageBubbleProps>) {
    const [copied, setCopied] = useState(false);

    const handleCopyUserMessage = async () => {
        try {
            await navigator.clipboard.writeText(message.user);
            setCopied(true);
            toast.success("Message copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy message");
        }
    };

    return (
        <div id={`message-${message.id}`} className="mb-6 px-2 sm:px-4">
            {/* User Message */}
            <div className="flex justify-end mb-3">
                <div className="flex items-start gap-2 max-w-full sm:max-w-3xl">
                    <Card className="bg-blue-50 border-blue-100 py-3 px-4 shadow-none max-w-full relative group">
                        <div className="text-gray-800 text-sm sm:text-base break-words pr-8">{message.user}</div>
                        {/* Copy Button */}
                        <button
                            onClick={handleCopyUserMessage}
                            className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-blue-100 transition-colors opacity-0 group-hover:opacity-100"
                            aria-label="Copy message"
                            title="Copy message"
                        >
                            {copied ? (
                                <Check size={14} className="text-green-600" />
                            ) : (
                                <Copy size={14} className="text-gray-600" />
                            )}
                        </button>
                        {/* <div className="text-gray-400 text-xs text-right">{formatTime(message.timestamp)}</div> */}
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

                            {/* <div className="text-gray-400 text-xs  border-t border-gray-100">
                                {formatTime(message.timestamp)}
                            </div> */}
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
