"use client";

import { cn } from "@/lib/utils";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from ".";
import { CheckCheck, Copy } from "lucide-react";

interface MessageBubbleProps {
    message: Message;
}

const markdownComponents: React.ComponentProps<typeof Markdown>["components"] = {
    h1: (props) => (
        <h1
            className="mb-3 mt-6 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-900 first:mt-0"
            {...props}
        />
    ),
    h2: (props) => <h2 className="mb-2 mt-5 text-lg font-semibold text-slate-900 first:mt-0" {...props} />,
    h3: (props) => <h3 className="mb-2 mt-4 text-base font-semibold text-slate-900 first:mt-0" {...props} />,
    p: (props) => <p className="mb-4 leading-relaxed text-slate-700 last:mb-0" {...props} />,
    ul: (props) => <ul className="mb-4 list-disc space-y-1.5 pl-6" {...props} />,
    ol: (props) => <ol className="mb-4 list-decimal space-y-1.5 pl-6" {...props} />,
    li: (props) => <li className="leading-relaxed text-slate-700" {...props} />,
    code: ({ className, children, ...props }) =>
        className ? (
            <code
                className="block overflow-x-auto rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-100"
                {...props}
            >
                {children}
            </code>
        ) : (
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-slate-800" {...props}>
                {children}
            </code>
        ),
    pre: (props) => <pre className="mb-4 overflow-x-auto" {...props} />,
    blockquote: (props) => <blockquote className="mb-4 border-l-2 border-slate-300 pl-4 text-slate-600" {...props} />,
    table: (props) => (
        <div className="mb-4 overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-sm" {...props} />
        </div>
    ),
    thead: (props) => <thead className="bg-slate-50" {...props} />,
    th: (props) => (
        <th
            className="border-b border-slate-200 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
            {...props}
        />
    ),
    td: (props) => <td className="border-b border-slate-100 px-4 py-2.5 align-top text-slate-700" {...props} />,
    a: (props) => (
        <a
            className="break-words text-primary underline underline-offset-2 hover:text-primary/80"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
        />
    ),
    strong: (props) => <strong className="font-semibold text-slate-900" {...props} />,
    hr: (props) => <hr className="my-6 border-slate-200" {...props} />,
};

// Network chunks arrive in bursts. This reveals them at an even pace instead, speeding up
// when the backlog grows, so the text flows rather than jumps.
function useSmoothText(text: string, startEmpty: boolean): string {
    const [count, setCount] = useState(startEmpty ? 0 : text.length);
    const countRef = useRef(count);

    useEffect(() => {
        if (countRef.current >= text.length) return;

        let frame = 0;
        const tick = () => {
            const backlog = text.length - countRef.current;
            countRef.current = Math.min(text.length, countRef.current + Math.max(2, Math.ceil(backlog / 12)));
            setCount(countRef.current);
            if (countRef.current < text.length) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [text]);

    return text.slice(0, count);
}

// "14:32" for today, "2 Nov, 14:32" for earlier days
function formatAnsweredAt(timestamp: number): string {
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (date.toDateString() === new Date().toDateString()) return time;
    return `${date.toLocaleDateString([], { day: "numeric", month: "short" })}, ${time}`;
}

export function MessageBubble({ message }: Readonly<MessageBubbleProps>) {
    const [copied, setCopied] = useState(false);
    const visibleText = useSmoothText(message.bot, !!message.isStreaming);

    const copyAnswer = async () => {
        try {
            await navigator.clipboard.writeText(message.bot);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy the answer");
        }
    };

    const showAnswer = message.bot || message.isStreaming;

    return (
        <article id={`message-${message.id}`} className="mb-10">
            <div className="flex justify-end">
                <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-tr-md bg-slate-100 px-4 py-3 text-slate-900 sm:max-w-xl">
                    {message.user}
                </p>
            </div>

            {showAnswer && (
                <div className="mt-6">
                    <div className="mb-4 border-b border-slate-200 pb-2.5">
                        <span className="text-sm font-semibold text-primary text-uppercase">Policy Analyzer</span>
                    </div>

                    <div
                        className={cn(
                            "min-w-0",
                            message.error && "rounded-lg border border-red-200 bg-red-50 p-4 text-red-800",
                        )}
                    >
                        {visibleText && (
                            <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                {visibleText}
                            </Markdown>
                        )}

                        {!message.bot && message.isStreaming && (
                            <div className="space-y-2.5 py-1" role="status" aria-label="Preparing the answer">
                                <div className="h-3 w-11/12 animate-pulse rounded bg-slate-100" />
                                <div className="h-3 w-4/5 animate-pulse rounded bg-slate-100" />
                                <div className="h-3 w-3/5 animate-pulse rounded bg-slate-100" />
                            </div>
                        )}
                    </div>

                    {!message.isStreaming &&
                        !message.error &&
                        visibleText.length === message.bot.length &&
                        message.bot && (
                            <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                                <button
                                    type="button"
                                    onClick={copyAnswer}
                                    aria-label={copied ? "Copied" : "Copy answer"}
                                    title={copied ? "Copied" : "Copy answer"}
                                    className="-ml-1.5 cursor-pointer rounded-md p-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                >
                                    {copied ? (
                                        <CheckCheck size={14} className="text-emerald-600" />
                                    ) : (
                                        <Copy size={14} />
                                    )}
                                </button>
                                {message.answeredAt !== undefined && (
                                    <>
                                        <span aria-hidden="true" className="h-3.5 w-px bg-slate-200" />
                                        <time
                                            dateTime={new Date(message.answeredAt).toISOString()}
                                            className="tabular-nums"
                                        >
                                            {formatAnsweredAt(message.answeredAt)}
                                        </time>
                                    </>
                                )}
                            </div>
                        )}
                </div>
            )}
        </article>
    );
}
