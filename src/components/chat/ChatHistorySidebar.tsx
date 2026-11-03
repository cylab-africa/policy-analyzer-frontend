"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { Conversation } from "@/types/chat";
import { ChevronDown, FileSpreadsheet, MoreHorizontal, PanelLeftClose, Pencil, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";

interface ChatHistorySidebarProps {
    readonly showChatHistory: boolean;
    readonly setShowChatHistory: (show: boolean) => void;
    readonly conversations: Conversation[];
    readonly activeConversationId: string | null;
    readonly onSelectConversation: (id: string) => void;
    readonly onDeleteConversation: (id: string) => void;
    readonly onRenameConversation: (id: string, title: string) => void;
    readonly clearAllHistory: () => void;
    readonly isMobile: boolean;
    readonly onNewChat: () => void;
    readonly onOpenBatch?: () => void;
    readonly onOpenDocuments?: () => void;
    readonly activeTab: string;
}

export function ChatHistorySidebar({
    showChatHistory,
    setShowChatHistory,
    conversations,
    activeConversationId,
    onSelectConversation,
    onDeleteConversation,
    onRenameConversation,
    clearAllHistory,
    isMobile,
    onNewChat,
    onOpenBatch,
    onOpenDocuments,
    activeTab,
}: ChatHistorySidebarProps) {
    const [recentsOpen, setRecentsOpen] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [draftTitle, setDraftTitle] = useState("");
    // Escape cancels a rename; the blur that follows must not save it
    const cancelledRef = useRef(false);

    const tools = [
        { label: "Upload documents", hint: "Add a law or policy", Icon: Upload, onClick: onOpenDocuments },
        {
            label: "Batch analysis",
            hint: "Many questions, one PDF report",
            Icon: FileSpreadsheet,
            onClick: onOpenBatch,
        },
    ];

    const startRename = (conversation: Conversation) => {
        cancelledRef.current = false;
        setDraftTitle(conversation.title);
        setEditingId(conversation.id);
    };

    const finishRename = (conversation: Conversation) => {
        if (!cancelledRef.current && draftTitle.trim() && draftTitle.trim() !== conversation.title) {
            onRenameConversation(conversation.id, draftTitle);
        }
        setEditingId(null);
    };

    // Filter conversations by active tab and sort by most recent
    const filteredConversations = conversations
        .filter((conv) => conv.tab === activeTab)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const confirmClearAll = () => {
        if (window.confirm("Delete all conversations in this tab? This cannot be undone.")) clearAllHistory();
    };

    const selectConversation = (id: string) => {
        onSelectConversation(id);
        if (isMobile) setShowChatHistory(false);
    };

    return (
        <>
            {/* Mobile overlay, faded in and out */}
            {isMobile && (
                <button
                    type="button"
                    tabIndex={showChatHistory ? 0 : -1}
                    className={cn(
                        "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden",
                        showChatHistory ? "opacity-100" : "pointer-events-none opacity-0"
                    )}
                    onClick={() => setShowChatHistory(false)}
                    aria-label="Close history"
                />
            )}

            {/* The outer element animates its width; the inner one keeps its size so the content is clipped, not squeezed */}
            <aside
                aria-label="Conversation history"
                inert={!showChatHistory}
                className={cn(
                    "shrink-0 overflow-hidden bg-slate-50 transition-[width,transform] duration-300 ease-in-out",
                    isMobile
                        ? cn(
                              "fixed bottom-0 left-0 top-0 z-50 w-80",
                              showChatHistory ? "translate-x-0" : "-translate-x-full"
                          )
                        : showChatHistory
                          ? "w-72"
                          : "w-0"
                )}
            >
                <div className={cn("flex h-full flex-col border-r border-slate-200", isMobile ? "w-80" : "w-72")}>
                    <div className="flex gap-2 p-4">
                        <Button className="flex-1" onClick={onNewChat}>
                            New chat
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 text-slate-600"
                            onClick={() => setShowChatHistory(false)}
                            aria-label="Hide history"
                            title="Hide history"
                        >
                            <PanelLeftClose size={18} />
                        </Button>
                    </div>

                    <div className="px-4 pb-2">
                        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Tools</div>
                        <div className="-mx-2 flex flex-col gap-0.5">
                            {tools.map(({ label, hint, Icon, onClick }) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={onClick}
                                    className="group flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white"
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary">
                                        <Icon size={18} />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block text-sm font-medium text-slate-800">{label}</span>
                                        <span className="block truncate text-xs text-slate-500">{hint}</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-2 flex min-h-0 flex-1 flex-col border-t border-slate-200 pt-4">
                        <div className="mb-2 flex items-center justify-between px-4">
                            <button
                                type="button"
                                onClick={() => setRecentsOpen((open) => !open)}
                                aria-expanded={recentsOpen}
                                aria-controls="history-list"
                                className="-ml-1 flex cursor-pointer items-center gap-1 rounded px-1 text-xs font-semibold uppercase tracking-wide text-slate-500 transition-colors hover:text-slate-900"
                            >
                                Recents
                                <ChevronDown
                                    size={14}
                                    className={cn("transition-transform duration-200", !recentsOpen && "-rotate-90")}
                                />
                            </button>
                            {recentsOpen && filteredConversations.length > 0 && (
                                <button
                                    type="button"
                                    className="cursor-pointer text-xs text-slate-500 hover:text-red-600"
                                    onClick={confirmClearAll}
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        <div
                            id="history-list"
                            inert={!recentsOpen}
                            className={cn(
                                "min-h-0 basis-0 overflow-hidden transition-[flex-grow,opacity] duration-200 ease-out",
                                recentsOpen ? "grow opacity-100" : "grow-0 opacity-0"
                            )}
                        >
                            {/* A plain scroller: Radix ScrollArea sizes its content to the longest unwrapped title, which pushed the rows and their menu button past the sidebar edge */}
                            <div className="h-full overflow-y-auto pl-2 pr-3 [scrollbar-width:thin]">
                                {filteredConversations.length > 0 ? (
                                    <ul className="space-y-0.5 pb-2">
                                        {filteredConversations.map((conversation) => {
                                            const isActive = activeConversationId === conversation.id;

                                            if (editingId === conversation.id) {
                                                return (
                                                    <li key={conversation.id} className="py-0.5">
                                                        <Input
                                                            autoFocus
                                                            value={draftTitle}
                                                            maxLength={80}
                                                            aria-label="Conversation name"
                                                            onChange={(e) => setDraftTitle(e.target.value)}
                                                            onFocus={(e) => e.target.select()}
                                                            onBlur={() => finishRename(conversation)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") e.currentTarget.blur();
                                                                if (e.key === "Escape") {
                                                                    cancelledRef.current = true;
                                                                    e.currentTarget.blur();
                                                                }
                                                            }}
                                                            className="h-8 bg-white text-sm"
                                                        />
                                                    </li>
                                                );
                                            }

                                            return (
                                                <li key={conversation.id} className="group relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => selectConversation(conversation.id)}
                                                        aria-current={isActive ? "true" : undefined}
                                                        className={cn(
                                                            // Room for the options button: always on touch screens, on hover or focus otherwise
                                                            "w-full cursor-pointer rounded-md py-1.5 pl-2 pr-8 text-left text-[0.875rem] transition-[background-color,padding] lg:pr-2 lg:group-focus-within:pr-8 lg:group-hover:pr-8 lg:group-has-[[data-state=open]]:pr-8",
                                                            isActive
                                                                ? "bg-slate-200/70 font-medium text-slate-900"
                                                                : "text-slate-700 hover:bg-slate-200/50"
                                                        )}
                                                    >
                                                        {/* A long title fades out at the edge instead of ending in an ellipsis */}
                                                        <span className="block overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,#000_calc(100%-1.5rem),transparent)]">
                                                            {conversation.title.replace(/\.{3}$/, "")}
                                                        </span>
                                                    </button>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button
                                                                type="button"
                                                                aria-label={`Options for ${conversation.title}`}
                                                                className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer rounded p-1 text-slate-500 transition-opacity hover:bg-slate-300/50 hover:text-slate-900 focus-visible:opacity-100 data-[state=open]:bg-slate-300/50 data-[state=open]:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                                                            >
                                                                <MoreHorizontal size={16} />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            onCloseAutoFocus={(e) => e.preventDefault()}
                                                        >
                                                            <DropdownMenuItem
                                                                onSelect={() => startRename(conversation)}
                                                            >
                                                                <Pencil size={14} />
                                                                Rename
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                onSelect={() => onDeleteConversation(conversation.id)}
                                                            >
                                                                <Trash2 size={14} />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p className="px-2 py-6 text-sm text-slate-500">No conversations yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
